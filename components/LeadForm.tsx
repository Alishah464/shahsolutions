'use client'

import { useState } from 'react'
import { Loader2, CheckCircle2 } from 'lucide-react'

export default function LeadForm({ websiteId }: { websiteId: number }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || loading) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/websites/${websiteId}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(typeof data?.error === 'string' ? data.error : 'Could not send. Please try again.')
        return
      }
      setSent(true)
    } catch {
      setError("Sorry, we're having trouble connecting. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="glass-card p-6 text-center">
        <CheckCircle2 size={28} className="text-emerald-400 mx-auto mb-2" />
        <p className="text-white font-medium">Thanks — we&apos;ll be in touch.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6">
      <h3 className="text-white font-semibold mb-4">Get in touch</h3>
      <div className="grid sm:grid-cols-2 gap-3 mb-3">
        <input
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          placeholder="Your name"
          required
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50"
        />
        <input
          type="email"
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          placeholder="Email (optional)"
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50"
        />
      </div>
      <input
        value={form.phone}
        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
        placeholder="Phone (optional)"
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50 mb-3"
      />
      <textarea
        value={form.message}
        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
        placeholder="Message (optional)"
        rows={3}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50 resize-none mb-3"
      />
      {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
      <button
        type="submit"
        disabled={!form.name.trim() || loading}
        className="btn-primary w-full justify-center disabled:opacity-40 disabled:pointer-events-none"
      >
        <span>{loading ? <Loader2 size={16} className="animate-spin" /> : 'Send'}</span>
      </button>
    </form>
  )
}
