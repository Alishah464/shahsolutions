'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Mail, Loader2, CheckCircle2 } from 'lucide-react'

const ERROR_MESSAGES: Record<string, string> = {
  missing_token: 'That sign-in link was missing a token. Please request a new one.',
  invalid_or_expired: 'That sign-in link is invalid or has expired. Please request a new one.',
  server_error: 'Something went wrong. Please try again.',
}

function LoginForm() {
  const searchParams = useSearchParams()
  const urlError = searchParams.get('error')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(urlError ? ERROR_MESSAGES[urlError] ?? 'Something went wrong.' : null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = email.trim()
    if (!trimmed || loading) return

    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/auth/request-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(typeof data?.error === 'string' ? data.error : 'Something went wrong. Please try again.')
        return
      }
      setSent(true)
    } catch {
      setError("Sorry, we're having trouble connecting. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="orb orb-purple absolute top-1/4 -left-32 w-[500px] h-[500px] animate-float" />

      <div className="relative z-10 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4">
            <Mail size={24} className="text-white" />
          </div>
          <h1 className="font-display font-bold text-2xl text-white">Sign in to Shah AI Builder</h1>
          <p className="text-slate-400 text-sm mt-1">No password — we&apos;ll email you a sign-in link.</p>
        </div>

        {sent ? (
          <div className="glass-card p-6 text-center">
            <CheckCircle2 size={32} className="text-emerald-400 mx-auto mb-3" />
            <p className="text-white font-medium mb-1">Check your email</p>
            <p className="text-slate-400 text-sm">We sent a sign-in link to {email}. It expires in 15 minutes.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="glass-card p-6">
            <label htmlFor="login-email" className="block text-sm font-medium text-slate-300 mb-2">
              Email address
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50"
            />
            {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
            <button
              type="submit"
              disabled={!email.trim() || loading}
              className="btn-primary mt-6 w-full justify-center disabled:opacity-40 disabled:pointer-events-none"
            >
              <span>{loading ? <Loader2 size={16} className="animate-spin" /> : 'Send sign-in link'}</span>
            </button>
          </form>
        )}
      </div>
    </section>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}
