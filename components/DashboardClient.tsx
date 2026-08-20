'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Loader2, ExternalLink, Pencil, Upload, Download, LogOut, Users, ChevronDown } from 'lucide-react'
import { SITE_URL } from '@/lib/site'

interface WebsiteRow {
  id: number
  slug: string | null
  business_name: string
  status: 'draft' | 'published'
  updated_at: string
  created_at: string
}

interface Lead {
  id: number
  name: string
  email: string | null
  phone: string | null
  message: string | null
  created_at: string
}

export default function DashboardClient() {
  const [websites, setWebsites] = useState<WebsiteRow[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<number | null>(null)
  const [openLeadsId, setOpenLeadsId] = useState<number | null>(null)
  const [leads, setLeads] = useState<Lead[] | null>(null)

  useEffect(() => {
    fetch('/api/websites')
      .then(res => (res.ok ? res.json() : Promise.reject()))
      .then(data => setWebsites(data.websites))
      .catch(() => setError('Could not load your websites.'))
  }, [])

  async function togglePublish(site: WebsiteRow) {
    setBusyId(site.id)
    setError(null)
    try {
      const res = await fetch(`/api/websites/${site.id}/${site.status === 'published' ? 'unpublish' : 'publish'}`, {
        method: 'POST',
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.website) {
        setError(typeof data?.error === 'string' ? data.error : 'Something went wrong.')
        return
      }
      setWebsites(w => w?.map(s => (s.id === site.id ? data.website : s)) ?? null)
    } catch {
      setError("Sorry, we're having trouble connecting.")
    } finally {
      setBusyId(null)
    }
  }

  async function toggleLeads(siteId: number) {
    if (openLeadsId === siteId) {
      setOpenLeadsId(null)
      return
    }
    setOpenLeadsId(siteId)
    setLeads(null)
    try {
      const res = await fetch(`/api/websites/${siteId}/leads`)
      const data = await res.json().catch(() => ({}))
      setLeads(res.ok ? data.leads : [])
    } catch {
      setLeads([])
    }
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
    window.location.href = '/'
  }

  return (
    <section className="relative min-h-screen pt-32 pb-24 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-black text-3xl text-white">Your Websites</h1>
            <p className="text-slate-400 text-sm mt-1">Websites you&apos;ve saved with Shah AI Builder.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/ai-builder" className="btn-secondary">
              <span>+ New Website</span>
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors">
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        </div>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        {websites === null && !error && (
          <div className="glass-card p-12 text-center">
            <Loader2 size={28} className="animate-spin text-primary mx-auto" />
          </div>
        )}

        {websites?.length === 0 && (
          <div className="glass-card p-12 text-center">
            <p className="text-white font-medium mb-2">You haven&apos;t created a website yet.</p>
            <p className="text-slate-400 mb-6">Tell us about your business and let AI build your first website.</p>
            <Link href="/ai-builder" className="btn-primary inline-flex"><span>Create my website</span></Link>
          </div>
        )}

        <div className="space-y-4">
          {websites?.map(site => (
            <div key={site.id} className="glass-card p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-semibold">{site.business_name}</h3>
                    <span className={`text-xs font-semibold tracking-wide px-2 py-0.5 rounded-full ${site.status === 'published' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/10 text-slate-400'}`}>
                      {site.status === 'published' ? 'PUBLISHED' : 'DRAFT'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">Updated {new Date(site.updated_at).toLocaleDateString()}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Link href={`/ai-builder?websiteId=${site.id}`} className="flex items-center gap-1.5 text-sm text-slate-300 hover:text-white transition-colors">
                    <Pencil size={14} />
                    Edit
                  </Link>
                  <button
                    onClick={() => toggleLeads(site.id)}
                    className="flex items-center gap-1.5 text-sm text-slate-300 hover:text-white transition-colors"
                  >
                    <Users size={14} />
                    Leads
                    <ChevronDown size={12} className={openLeadsId === site.id ? 'rotate-180 transition-transform' : 'transition-transform'} />
                  </button>
                  {site.status === 'published' && site.slug && (
                    <a
                      href={`${SITE_URL}/sites/${site.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-slate-300 hover:text-white transition-colors"
                    >
                      <ExternalLink size={14} />
                      View
                    </a>
                  )}
                  <button
                    onClick={() => togglePublish(site)}
                    disabled={busyId === site.id}
                    className="flex items-center gap-1.5 text-sm text-slate-300 hover:text-white transition-colors disabled:opacity-50"
                  >
                    {busyId === site.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : site.status === 'published' ? (
                      <Download size={14} />
                    ) : (
                      <Upload size={14} />
                    )}
                    {site.status === 'published' ? 'Unpublish' : 'Publish'}
                  </button>
                </div>
              </div>

              {openLeadsId === site.id && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  {leads === null ? (
                    <Loader2 size={16} className="animate-spin text-primary" />
                  ) : leads.length === 0 ? (
                    <p className="text-slate-500 text-sm">No leads yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {leads.map(lead => (
                        <div key={lead.id} className="text-sm bg-white/5 rounded-xl p-3">
                          <p className="text-white font-medium">{lead.name}</p>
                          {lead.email && <p className="text-slate-400">{lead.email}</p>}
                          {lead.phone && <p className="text-slate-400">{lead.phone}</p>}
                          {lead.message && <p className="text-slate-400 mt-1">{lead.message}</p>}
                          <p className="text-slate-600 text-xs mt-1">{new Date(lead.created_at).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
