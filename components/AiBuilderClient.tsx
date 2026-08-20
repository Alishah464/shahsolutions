'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Sparkles, Loader2, ChevronRight, RefreshCw, Save, Check } from 'lucide-react'
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile'
import type { GeneratedSite } from '@/lib/aiBuilderSchema'
import GeneratedSiteView from '@/components/GeneratedSiteView'

type Screen = 'input' | 'generating' | 'preview'

const LOADING_STEPS = [
  'Understanding your business...',
  'Creating your brand...',
  'Writing your content...',
  'Designing your website...',
]

const STORAGE_KEY = 'ss_ai_builder_state'

const EXAMPLE_PROMPTS = [
  { label: 'Restaurant', text: 'I run a Pakistani and Chinese restaurant in Karachi called Spice Garden. We offer dine-in, takeaway and delivery. Customers can contact us through WhatsApp to place orders.' },
  { label: 'Salon', text: "I own a women's salon in Lahore called Glow Studio. We offer haircuts, hair coloring, bridal makeup, facials and manicures. Customers can book appointments through WhatsApp." },
  { label: 'Real Estate', text: 'I run a real estate agency in Islamabad called Capital Properties. We help customers buy, sell and rent residential properties in Islamabad and Rawalpindi.' },
  { label: 'AC Service', text: 'I operate an AC repair and installation business in Karachi called CoolTech Services. We provide AC repair, installation, maintenance and gas charging services across Karachi.' },
  { label: 'Clothing', text: "I own a men's clothing store in Karachi called Royal Wear. We sell premium shalwar kameez, kurtas and waistcoats. Customers can contact us through WhatsApp for orders." },
]

/** Read once, synchronously, as part of initial state — not in a useEffect. An effect-based
    restore races the save-effect: on the very first mount the save-effect also fires with
    the still-default (unrestored) state and immediately overwrites/clears what was just read,
    before the restore's setState has propagated. Reading during initialization sidesteps
    the race entirely — there's no "unrestored" render to race against. */
function readStoredState(): { description: string; site: GeneratedSite | null } {
  if (typeof window === 'undefined') return { description: '', site: null }
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY)
    if (!saved) return { description: '', site: null }
    const parsed = JSON.parse(saved) as { description?: string; site?: GeneratedSite }
    return { description: parsed.description ?? '', site: parsed.site ?? null }
  } catch {
    return { description: '', site: null }
  }
}

export default function AiBuilderClient() {
  const [screen, setScreen] = useState<Screen>(() => (readStoredState().site ? 'preview' : 'input'))
  const [description, setDescription] = useState(() => readStoredState().description)
  const [site, setSite] = useState<GeneratedSite | null>(() => readStoredState().site)
  const [error, setError] = useState<string | null>(null)
  const [loadingStep, setLoadingStep] = useState(0)
  const [editInstruction, setEditInstruction] = useState('')
  const [editLoading, setEditLoading] = useState(false)
  const [websiteId, setWebsiteId] = useState<number | null>(null)
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle')

  // Reopening a saved website from /dashboard: /ai-builder?websiteId=123. A plain
  // client-side query read (not useSearchParams) avoids needing a Suspense boundary
  // in app/ai-builder/page.tsx for what's a best-effort, one-time load.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('websiteId')
    if (!id) return
    fetch(`/api/websites/${id}`)
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (data?.website) {
          setWebsiteId(data.website.id)
          setSite(data.website.site_data as GeneratedSite)
          setScreen('preview')
        }
      })
      .catch(() => {})
  }, [])

  const turnstileRef = useRef<TurnstileInstance>(null)
  const settleTokenRef = useRef<((token: string) => void) | null>(null)

  const getTurnstileToken = useCallback((): Promise<string> => {
    return new Promise((resolve) => {
      let done = false
      const finish = (token: string) => {
        if (done) return
        done = true
        clearInterval(retryTimer)
        settleTokenRef.current = null
        resolve(token)
      }
      const timer = setTimeout(() => finish(''), 15000)
      settleTokenRef.current = (token: string) => {
        clearTimeout(timer)
        finish(token)
      }
      const attempt = () => {
        try {
          turnstileRef.current?.execute()
        } catch {
          // widget not mounted/ready yet — the retry below will catch it once it is
        }
      }
      const retryTimer = setInterval(attempt, 500)
      attempt()
    })
  }, [])

  useEffect(() => {
    if (screen !== 'generating') return
    setLoadingStep(0)
    const interval = setInterval(() => {
      setLoadingStep(s => Math.min(s + 1, LOADING_STEPS.length - 1))
    }, 1200)
    return () => clearInterval(interval)
  }, [screen])

  // Persist across reload — a demo/user shouldn't lose their preview to an accidental
  // refresh. Not persisted: the transient 'generating' screen itself (see readStoredState
  // above for why this is a plain save-on-change effect, not also a restore-on-mount one).
  useEffect(() => {
    try {
      if (site) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ description, site }))
      } else {
        sessionStorage.removeItem(STORAGE_KEY)
      }
    } catch {
      // storage full/unavailable — non-critical
    }
  }, [description, site])

  async function runGenerate(businessDescription: string) {
    setError(null)
    setScreen('generating')

    try {
      const turnstileToken = await getTurnstileToken()
      const res = await fetch('/api/ai-builder/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: businessDescription, turnstileToken }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.site) {
        setError(typeof data?.error === 'string' ? data.error : 'Something went wrong. Please try again.')
        setScreen(site ? 'preview' : 'input')
        return
      }
      setSite(data.site as GeneratedSite)
      setScreen('preview')
    } catch {
      setError("Sorry, we're having trouble connecting. Please try again.")
      setScreen(site ? 'preview' : 'input')
    }
  }

  function handleGenerate(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = description.trim()
    if (!trimmed || screen === 'generating') return
    runGenerate(trimmed)
  }

  function handleRegenerate() {
    if (screen === 'generating') return
    runGenerate(description.trim())
    setWebsiteId(null)
    setSaveState('idle')
  }

  async function handleSave() {
    if (!site || saveState === 'saving') return
    setSaveState('saving')
    setError(null)
    try {
      const res = await fetch('/api/websites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: websiteId, businessName: site.business.name, site }),
      })
      if (res.status === 401) {
        window.location.href = `/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`
        return
      }
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.website) {
        setError(typeof data?.error === 'string' ? data.error : 'Could not save. Please try again.')
        setSaveState('idle')
        return
      }
      setWebsiteId(data.website.id)
      setSaveState('saved')
      setTimeout(() => setSaveState('idle'), 2000)
    } catch {
      setError("Sorry, we're having trouble connecting. Please try again.")
      setSaveState('idle')
    }
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = editInstruction.trim()
    if (!trimmed || editLoading || !site) return

    setError(null)
    setEditLoading(true)

    try {
      const turnstileToken = await getTurnstileToken()
      const res = await fetch('/api/ai-builder/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ site, instruction: trimmed, turnstileToken }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.site) {
        setError(typeof data?.error === 'string' ? data.error : "That edit didn't go through. Please try again.")
        return
      }
      setSite(data.site as GeneratedSite)
      setEditInstruction('')
      setSaveState('idle')
    } catch {
      setError("Sorry, we're having trouble connecting. Please try again.")
    } finally {
      setEditLoading(false)
    }
  }

  return (
    <section className="relative min-h-screen pt-32 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="orb orb-purple absolute top-1/4 -left-32 w-[600px] h-[600px] animate-float" />
      <div className="orb orb-blue absolute bottom-0 -right-32 w-[500px] h-[500px] animate-float-delay" />

      <Turnstile
        ref={turnstileRef}
        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '1x00000000000000000000AA'}
        options={{ size: 'invisible', execution: 'execute' }}
        onSuccess={token => settleTokenRef.current?.(token)}
        onError={() => settleTokenRef.current?.('')}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {screen === 'input' && (
          <div className="text-center">
            <div className="section-tag mx-auto">
              <Sparkles size={12} />
              AI Website Builder — Preview
            </div>
            <h1 className="font-display font-black text-4xl sm:text-5xl text-white mt-6 mb-4">
              Your Business Deserves a Website.{' '}
              <span className="gradient-text">Let AI Build It.</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10">
              Describe your business in a sentence or two. AI generates a preview website in seconds —
              then tell it what to change.
            </p>

            <form onSubmit={handleGenerate} className="glass-card p-6 sm:p-8 text-left">
              <label htmlFor="business-description" className="block text-sm font-medium text-slate-300 mb-2">
                Tell us about your business
              </label>
              <textarea
                id="business-description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                maxLength={600}
                rows={4}
                placeholder="e.g. I own a men's clothing store in Karachi called Royal Wear. We sell premium shalwar kameez, kurtas and waistcoats."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50 resize-none"
              />
              {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
              <button
                type="submit"
                disabled={!description.trim()}
                className="btn-primary mt-6 w-full sm:w-auto disabled:opacity-40 disabled:pointer-events-none"
              >
                <span>✨ Generate My Website</span>
              </button>

              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-xs text-slate-500 mb-3">Or try an example:</p>
                <div className="flex flex-wrap gap-2">
                  {EXAMPLE_PROMPTS.map(p => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setDescription(p.text)}
                      className="px-3 py-1.5 text-xs rounded-full bg-white/5 border border-white/10 text-slate-300 hover:border-primary/50 hover:bg-primary/10 transition-colors"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          </div>
        )}

        {screen === 'generating' && (
          <div className="glass-card p-12 text-center max-w-lg mx-auto">
            <Loader2 size={40} className="animate-spin text-primary mx-auto mb-6" />
            <p className="text-white text-lg font-medium">{LOADING_STEPS[loadingStep]}</p>
          </div>
        )}

        {screen === 'preview' && site && (
          <div className="pb-8">
            <div className="flex items-center justify-between mb-8">
              <p className="text-xs text-slate-500 uppercase tracking-wide">
                {websiteId ? 'Editing a saved website' : 'Live AI preview — demo only, not saved'}
              </p>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleSave}
                  disabled={saveState === 'saving'}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors disabled:opacity-50"
                >
                  {saveState === 'saved' ? <Check size={12} className="text-emerald-400" /> : <Save size={12} />}
                  {saveState === 'saving' ? 'Saving…' : saveState === 'saved' ? 'Saved' : 'Save'}
                </button>
                <button onClick={handleRegenerate} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
                  <RefreshCw size={12} />
                  Regenerate
                </button>
                <button
                  onClick={() => { setScreen('input'); setSite(null); setDescription(''); setError(null); setWebsiteId(null); setSaveState('idle') }}
                  className="text-xs text-slate-400 hover:text-white transition-colors"
                >
                  Start over
                </button>
              </div>
            </div>
            <GeneratedSiteView site={site} />
          </div>
        )}
      </div>

      {screen === 'preview' && site && (
        <div className="sticky bottom-0 z-30 border-t border-white/10 bg-dark-2/95 backdrop-blur-xl">
          <form onSubmit={handleEdit} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3">
            <input
              type="text"
              value={editInstruction}
              onChange={e => setEditInstruction(e.target.value)}
              maxLength={300}
              disabled={editLoading}
              placeholder="Tell AI what you'd like to change… e.g. &quot;make it more premium&quot;"
              className="flex-1 bg-white/5 border border-white/10 rounded-full px-5 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={editLoading || !editInstruction.trim()}
              className="w-11 h-11 flex-shrink-0 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center disabled:opacity-40 hover:brightness-110 transition-all"
              aria-label="Apply change"
            >
              {editLoading ? <Loader2 size={18} className="animate-spin" /> : <ChevronRight size={18} />}
            </button>
          </form>
          {error && <p className="text-red-400 text-xs text-center pb-3">{error}</p>}
        </div>
      )}
    </section>
  )
}
