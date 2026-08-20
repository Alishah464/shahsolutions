'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { MessageCircle, X, Send, Bot, Loader2 } from 'lucide-react'
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile'

type Role = 'user' | 'assistant'
interface ChatMessage {
  role: Role
  content: string
}

const STORAGE_KEY = 'ss_chat_messages'
const MAX_HISTORY_SENT = 24
const LEAD_START = '<<<LEAD>>>'
const LEAD_END = '<<<END>>>'

const QUICK_PROMPTS = [
  'What services do you offer?',
  'How much does a website cost?',
  "I'd like to book a free call",
]

const GREETING: ChatMessage = {
  role: 'assistant',
  content:
    "Hi! I'm the Shah Solutions assistant. Ask me about SEO, GEO, web/app development, digital marketing, or cloud solutions — or I can help you book a free strategy call.",
}

interface LeadFields {
  name: string
  email: string
  phone: string
  message: string
}

/** Parses `name=...|email=...|phone=...|message=...` — anchor-based rather than
    strict JSON, since small free models don't reliably quote/escape JSON. */
function parseLeadFields(raw: string): LeadFields | null {
  const keys = ['name', 'email', 'phone', 'message'] as const
  const anchors = keys
    .map(key => ({ key, idx: raw.indexOf(`${key}=`) }))
    .filter(a => a.idx !== -1)
    .sort((a, b) => a.idx - b.idx)

  const fields: Partial<Record<(typeof keys)[number], string>> = {}
  anchors.forEach((a, i) => {
    const start = a.idx + a.key.length + 1
    const end = i + 1 < anchors.length ? anchors[i + 1].idx : raw.length
    fields[a.key] = raw.slice(start, end).replace(/\|\s*$/, '').trim()
  })

  if (!fields.name || !fields.email) return null
  return { name: fields.name, email: fields.email, phone: fields.phone ?? '', message: fields.message ?? '' }
}

/** Splits streamed text into what's safe to show and a completed lead payload, if any. */
function splitLead(text: string): { display: string; lead: LeadFields | null } {
  const startIdx = text.indexOf(LEAD_START)
  if (startIdx === -1) return { display: text, lead: null }
  const display = text.slice(0, startIdx).trimEnd()
  const endIdx = text.indexOf(LEAD_END, startIdx)
  if (endIdx === -1) return { display, lead: null }
  const raw = text.slice(startIdx + LEAD_START.length, endIdx)
  return { display, lead: parseLeadFields(raw) }
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [hasUnread, setHasUnread] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const leadSentRef = useRef(false)
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
      // A fast first interaction (e.g. clicking a quick-prompt right after opening
      // the widget) can race Cloudflare's async script/widget init — a single
      // execute() call silently no-ops if the widget isn't rendered yet, with no
      // error and no callback, so it would otherwise just sit until the 15s
      // timeout. Retrying is harmless once the widget IS ready: whichever call
      // is live completes normally and `finish()` clears this interval.
      const retryTimer = setInterval(attempt, 500)
      attempt()
    })
  }, [])

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as ChatMessage[]
        if (Array.isArray(parsed) && parsed.length > 0) setMessages(parsed)
      }
    } catch {
      // ignore corrupt storage
    }
  }, [])

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
    } catch {
      // storage full/unavailable — non-critical
    }
  }, [messages])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isOpen])

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    leadSentRef.current = false
    const userMsg: ChatMessage = { role: 'user', content: trimmed }
    const historyForServer = [...messages, userMsg].slice(-MAX_HISTORY_SENT)

    setMessages(m => [...m, userMsg])
    setInput('')
    setLoading(true)

    try {
      const turnstileToken = await getTurnstileToken()
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: historyForServer, turnstileToken }),
      })

      if (!res.ok) {
        const fallback = "Sorry, something went wrong. Please try again or reach us at /contact."
        let errorText = fallback
        try {
          const data = await res.json()
          errorText = typeof data?.error === 'string' ? data.error : fallback
        } catch {
          // non-JSON error body — use fallback
        }
        setMessages(m => [...m, { role: 'assistant', content: errorText }])
        setLoading(false)
        return
      }

      const contentType = res.headers.get('content-type') ?? ''

      if (contentType.includes('application/json')) {
        const data = await res.json()
        setMessages(m => [...m, { role: 'assistant', content: data.reply }])
        setLoading(false)
        return
      }

      if (!res.body) {
        setLoading(false)
        return
      }

      setMessages(m => [...m, { role: 'assistant', content: '' }])
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let assistantText = ''
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          const trimmedLine = line.trim()
          if (!trimmedLine.startsWith('data:')) continue
          const payload = trimmedLine.slice(5).trim()
          if (payload === '[DONE]') continue
          try {
            const json = JSON.parse(payload)
            const delta = json.choices?.[0]?.delta?.content
            if (delta) {
              assistantText += delta
              const { display } = splitLead(assistantText)
              setMessages(m => {
                const copy = [...m]
                copy[copy.length - 1] = { role: 'assistant', content: display }
                return copy
              })
            }
          } catch {
            // ignore malformed SSE chunk
          }
        }
      }

      const { display, lead } = splitLead(assistantText)
      setMessages(m => {
        const copy = [...m]
        copy[copy.length - 1] = { role: 'assistant', content: display || "I'm here — could you tell me a bit more?" }
        return copy
      })

      if (lead && !leadSentRef.current) {
        leadSentRef.current = true
        fetch('/api/chat/lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(lead),
        }).catch(() => {})
      }
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: "Sorry, I'm having trouble connecting. Please try again shortly." }])
    } finally {
      setLoading(false)
    }
  }, [messages, loading])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    sendMessage(input)
  }

  function toggleOpen() {
    setIsOpen(o => !o)
    setHasUnread(false)
  }

  return (
    <>
      {/* Invisible bot-check — executed once per message via getTurnstileToken().
          The library already renders this at 0x0 for size:'invisible'; wrapping it
          in a display:none ancestor (as this used to) can stop the underlying
          challenge iframe from initializing in some browsers, so it's unwrapped. */}
      <Turnstile
        ref={turnstileRef}
        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '1x00000000000000000000AA'}
        options={{ size: 'invisible', execution: 'execute' }}
        onSuccess={token => settleTokenRef.current?.(token)}
        onError={() => settleTokenRef.current?.('')}
      />

      {/* Floating launcher button */}
      <button
        onClick={toggleOpen}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
        className="fixed bottom-5 right-5 z-30 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center shadow-glow-primary hover:scale-105 active:scale-95 transition-transform duration-200"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        {!isOpen && hasUnread && (
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-accent rounded-full border-2 border-dark" />
        )}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-5 z-30 w-[calc(100vw-2.5rem)] max-w-[380px] h-[min(600px,calc(100vh-8rem))] glass-card !bg-dark-2/95 flex flex-col overflow-hidden shadow-card-hover">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-white/3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
              <Bot size={18} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold leading-tight">Shah Solutions Assistant</p>
              <p className="text-slate-400 text-xs leading-tight">Usually replies instantly</p>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] px-3.5 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === 'user'
                      ? 'bg-gradient-to-br from-primary to-secondary text-white rounded-2xl rounded-br-sm'
                      : 'bg-white/5 border border-white/10 text-slate-200 rounded-2xl rounded-bl-sm'
                  }`}
                >
                  {m.content || (loading && i === messages.length - 1 ? <TypingDots /> : '')}
                </div>
              </div>
            ))}
            {loading && messages[messages.length - 1]?.role !== 'assistant' && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-sm px-3.5 py-2">
                  <TypingDots />
                </div>
              </div>
            )}

            {messages.length === 1 && (
              <div className="flex flex-col gap-2 pt-2">
                {QUICK_PROMPTS.map(q => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-left text-xs text-slate-300 px-3 py-2 rounded-xl border border-white/10 hover:border-primary/50 hover:bg-primary/10 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 p-3 border-t border-white/10 bg-white/3">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your message…"
              maxLength={2000}
              disabled={loading}
              className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send message"
              className="w-9 h-9 flex-shrink-0 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center disabled:opacity-40 hover:brightness-110 transition-all"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={15} />}
            </button>
          </form>
        </div>
      )}
    </>
  )
}

function TypingDots() {
  return (
    <span className="flex items-center gap-1 py-0.5">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
    </span>
  )
}
