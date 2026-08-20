'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, Mail, Phone, Briefcase, CheckCircle, XCircle, AlertCircle, LogOut, RefreshCw, MessageCircle, Circle } from 'lucide-react'
import { formatDate, formatSlot } from '@/lib/timeSlots'
import { useRouter } from 'next/navigation'

type Status = 'pending' | 'confirmed' | 'cancelled'
type LeadStatus = 'new' | 'contacted'

interface Booking {
  id: string
  name: string
  email: string
  phone: string
  service: string
  message: string
  date: string
  time_slot: string
  status: Status
  created_at: string
}

interface ChatLead {
  id: string
  name: string
  email: string
  phone: string
  message: string
  status: LeadStatus
  created_at: string
}

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   icon: AlertCircle,   color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30' },
  confirmed: { label: 'Confirmed', icon: CheckCircle,   color: 'text-green-400 bg-green-400/10 border-green-400/30' },
  cancelled: { label: 'Cancelled', icon: XCircle,       color: 'text-red-400 bg-red-400/10 border-red-400/30' },
}

const LEAD_STATUS_CONFIG = {
  new:       { label: 'New',       icon: Circle,        color: 'text-blue-400 bg-blue-400/10 border-blue-400/30' },
  contacted: { label: 'Contacted', icon: CheckCircle,   color: 'text-green-400 bg-green-400/10 border-green-400/30' },
}

export default function AdminDashboard() {
  const router = useRouter()
  const [view, setView] = useState<'bookings' | 'leads'>('bookings')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | Status>('all')
  const [updating, setUpdating] = useState<string | null>(null)

  const [leads, setLeads] = useState<ChatLead[]>([])
  const [leadsLoading, setLeadsLoading] = useState(true)
  const [leadFilter, setLeadFilter] = useState<'all' | LeadStatus>('all')

  const fetchBookings = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/bookings')
      if (res.status === 401) { router.replace('/admin/login'); return }
      const data = await res.json()
      setBookings(data.bookings ?? [])
    } finally {
      setLoading(false)
    }
  }, [router])

  const fetchLeads = useCallback(async () => {
    setLeadsLoading(true)
    try {
      const res = await fetch('/api/admin/chat-leads')
      if (res.status === 401) { router.replace('/admin/login'); return }
      const data = await res.json()
      setLeads(data.leads ?? [])
    } finally {
      setLeadsLoading(false)
    }
  }, [router])

  useEffect(() => { fetchBookings() }, [fetchBookings])
  useEffect(() => { fetchLeads() }, [fetchLeads])

  async function updateStatus(id: string, status: Status) {
    setUpdating(id)
    try {
      await fetch(`/api/admin/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      setBookings(bs => bs.map(b => b.id === id ? { ...b, status } : b))
    } finally {
      setUpdating(null)
    }
  }

  async function updateLeadStatus(id: string, status: LeadStatus) {
    setUpdating(id)
    try {
      await fetch(`/api/admin/chat-leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      setLeads(ls => ls.map(l => l.id === id ? { ...l, status } : l))
    } finally {
      setUpdating(null)
    }
  }

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.replace('/admin/login')
  }

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)
  const counts = {
    all: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  }

  const today = new Date().toISOString().split('T')[0]
  const todayCount = bookings.filter(b => b.date === today).length

  const filteredLeads = leadFilter === 'all' ? leads : leads.filter(l => l.status === leadFilter)
  const leadCounts = {
    all: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-32 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">{view === 'bookings' ? 'Consultations' : 'Chat Leads'}</h1>
            <p className="text-gray-500 mt-1">Shah Solutions Admin Dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={view === 'bookings' ? fetchBookings : fetchLeads}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 border border-gray-700 hover:border-red-400/30 rounded-lg transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>

        {/* View tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-800">
          <button
            onClick={() => setView('bookings')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              view === 'bookings' ? 'border-purple-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            <Calendar className="w-4 h-4" /> Consultations ({bookings.length})
          </button>
          <button
            onClick={() => setView('leads')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              view === 'leads' ? 'border-purple-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            <MessageCircle className="w-4 h-4" /> Chat Leads ({leads.length})
          </button>
        </div>

        {view === 'bookings' && (<>
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total', value: counts.all, color: 'text-purple-400' },
            { label: "Today's", value: todayCount, color: 'text-blue-400' },
            { label: 'Pending', value: counts.pending, color: 'text-yellow-400' },
            { label: 'Confirmed', value: counts.confirmed, color: 'text-green-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-[#12121a] border border-gray-800 rounded-xl p-4">
              <p className="text-gray-500 text-sm">{label}</p>
              <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(['all', 'pending', 'confirmed', 'cancelled'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                filter === f
                  ? 'bg-purple-600 text-white'
                  : 'bg-[#12121a] border border-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {f === 'all' ? `All (${counts.all})` : `${f.charAt(0).toUpperCase() + f.slice(1)} (${counts[f]})`}
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-20 text-gray-600">
            <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading bookings…
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-600">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No {filter !== 'all' ? filter : ''} bookings yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((booking, i) => {
              const cfg = STATUS_CONFIG[booking.status]
              const StatusIcon = cfg.icon
              const isPast = booking.date < today
              return (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`bg-[#12121a] border rounded-xl p-5 ${isPast ? 'border-gray-800/50 opacity-70' : 'border-gray-800'}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    {/* Left: info */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-white font-semibold text-lg">{booking.name}</span>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${cfg.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {cfg.label}
                        </span>
                        {isPast && <span className="text-xs text-gray-600 bg-gray-800/50 px-2 py-0.5 rounded-full">Past</span>}
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-purple-400" />
                          {formatDate(booking.date)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-purple-400" />
                          {formatSlot(booking.time_slot)} PKT
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-purple-400" />
                          {booking.service}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5" />
                          <a href={`mailto:${booking.email}`} className="hover:text-purple-400 transition-colors">
                            {booking.email}
                          </a>
                        </span>
                        {booking.phone && (
                          <span className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5" />
                            <a href={`tel:${booking.phone}`} className="hover:text-purple-400 transition-colors">
                              {booking.phone}
                            </a>
                          </span>
                        )}
                      </div>

                      {booking.message && (
                        <p className="text-gray-600 text-sm italic">"{booking.message}"</p>
                      )}
                    </div>

                    {/* Right: actions */}
                    <div className="flex gap-2 shrink-0">
                      {booking.status !== 'confirmed' && (
                        <button
                          disabled={updating === booking.id}
                          onClick={() => updateStatus(booking.id, 'confirmed')}
                          className="px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                        >
                          Confirm
                        </button>
                      )}
                      {booking.status !== 'cancelled' && (
                        <button
                          disabled={updating === booking.id}
                          onClick={() => updateStatus(booking.id, 'cancelled')}
                          className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      )}
                      {booking.status !== 'pending' && (
                        <button
                          disabled={updating === booking.id}
                          onClick={() => updateStatus(booking.id, 'pending')}
                          className="px-3 py-1.5 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
        </>)}

        {view === 'leads' && (<>
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total', value: leadCounts.all, color: 'text-purple-400' },
            { label: 'New', value: leadCounts.new, color: 'text-blue-400' },
            { label: 'Contacted', value: leadCounts.contacted, color: 'text-green-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-[#12121a] border border-gray-800 rounded-xl p-4">
              <p className="text-gray-500 text-sm">{label}</p>
              <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(['all', 'new', 'contacted'] as const).map(f => (
            <button
              key={f}
              onClick={() => setLeadFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                leadFilter === f
                  ? 'bg-purple-600 text-white'
                  : 'bg-[#12121a] border border-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {f === 'all' ? `All (${leadCounts.all})` : `${f.charAt(0).toUpperCase() + f.slice(1)} (${leadCounts[f]})`}
            </button>
          ))}
        </div>

        {/* List */}
        {leadsLoading ? (
          <div className="text-center py-20 text-gray-600">
            <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading chat leads…
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="text-center py-20 text-gray-600">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No {leadFilter !== 'all' ? leadFilter : ''} chat leads yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLeads.map((lead, i) => {
              const cfg = LEAD_STATUS_CONFIG[lead.status]
              const StatusIcon = cfg.icon
              return (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="bg-[#12121a] border border-gray-800 rounded-xl p-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    {/* Left: info */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-white font-semibold text-lg">{lead.name}</span>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${cfg.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {cfg.label}
                        </span>
                        <span className="text-xs text-gray-600">
                          {new Date(lead.created_at).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5" />
                          <a href={`mailto:${lead.email}`} className="hover:text-purple-400 transition-colors">
                            {lead.email}
                          </a>
                        </span>
                        {lead.phone && (
                          <span className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5" />
                            <a href={`tel:${lead.phone}`} className="hover:text-purple-400 transition-colors">
                              {lead.phone}
                            </a>
                          </span>
                        )}
                      </div>

                      {lead.message && (
                        <p className="text-gray-600 text-sm italic">&ldquo;{lead.message}&rdquo;</p>
                      )}
                    </div>

                    {/* Right: actions */}
                    <div className="flex gap-2 shrink-0">
                      {lead.status !== 'contacted' && (
                        <button
                          disabled={updating === lead.id}
                          onClick={() => updateLeadStatus(lead.id, 'contacted')}
                          className="px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                        >
                          Mark Contacted
                        </button>
                      )}
                      {lead.status !== 'new' && (
                        <button
                          disabled={updating === lead.id}
                          onClick={() => updateLeadStatus(lead.id, 'new')}
                          className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
        </>)}
      </div>
    </div>
  )
}
