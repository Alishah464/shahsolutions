'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Clock, User, Mail, Phone, Briefcase, MessageSquare, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { ALL_SLOTS, formatSlot, formatDate } from '@/lib/timeSlots'
import { bookFaqs } from '@/lib/bookFaqs'

const SERVICES = ['SEO Optimization', 'GEO / Local SEO', 'Web Development', 'App Development', 'Digital Strategy', 'Consultation Only']

function buildCalendar(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = Array(firstDay).fill(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

function toDateStr(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export default function BookClient() {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedSlot, setSelectedSlot] = useState('')
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [bookedSlots, setBookedSlots] = useState<string[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', message: '' })
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const fetchSlots = useCallback(async (date: string) => {
    setLoadingSlots(true)
    setAvailableSlots([])
    setBookedSlots([])
    try {
      const res = await fetch(`/api/bookings/available?date=${date}`)
      const data = await res.json()
      setAvailableSlots(data.available ?? [])
      setBookedSlots(data.booked ?? [])
    } finally {
      setLoadingSlots(false)
    }
  }, [])

  useEffect(() => {
    if (selectedDate) {
      setSelectedSlot('')
      fetchSlots(selectedDate)
    }
  }, [selectedDate, fetchSlots])

  const cells = buildCalendar(viewYear, viewMonth)
  const monthName = new Date(viewYear, viewMonth).toLocaleString('en-US', { month: 'long', year: 'numeric' })

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }

  function isDaySelectable(day: number) {
    const d = new Date(viewYear, viewMonth, day)
    const dow = d.getDay()
    if (dow === 0 || dow === 6) return false
    const todayMidnight = new Date(); todayMidnight.setHours(0, 0, 0, 0)
    return d > todayMidnight
  }

  async function handleSubmit() {
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, date: selectedDate, timeSlot: selectedSlot }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Something went wrong'); return }
      setDone(true)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-full bg-purple-600/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-purple-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Consultation Booked!</h1>
          <p className="text-gray-400 mb-2">
            <span className="text-white font-medium">{formatDate(selectedDate)}</span> at{' '}
            <span className="text-white font-medium">{formatSlot(selectedSlot)}</span> PKT
          </p>
          <p className="text-gray-400 text-sm mb-8">
            A confirmation email has been sent to <span className="text-purple-400">{form.email}</span>
          </p>
          <a
            href="/"
            className="inline-block px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
          >
            Back to Home
          </a>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <span className="text-purple-400 text-sm font-semibold tracking-widest uppercase">Free Consultation</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-3">Book a Session</h1>
          <p className="text-gray-400 text-lg">Choose a date and time that works for you</p>
        </motion.div>

        {/* Steps */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-10">
          {[{ n: 1, label: 'Date & Time' }, { n: 2, label: 'Your Details' }].map(({ n, label }) => (
            <div key={n} className="flex items-center gap-1.5 sm:gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors flex-shrink-0 ${step >= n ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-500'}`}>
                {n}
              </div>
              <span className={`text-xs sm:text-sm whitespace-nowrap ${step >= n ? 'text-white' : 'text-gray-600'}`}>{label}</span>
              {n < 2 && <div className={`w-8 sm:w-12 h-px mx-1 ${step > n ? 'bg-purple-600' : 'bg-gray-700'}`} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid md:grid-cols-2 gap-6"
            >
              {/* Calendar */}
              <div className="bg-[#12121a] border border-gray-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-white font-semibold">{monthName}</span>
                  <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-7 mb-2">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                    <div key={d} className="text-center text-xs text-gray-600 font-medium py-1">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {cells.map((day, i) => {
                    if (!day) return <div key={i} />
                    const dateStr = toDateStr(viewYear, viewMonth, day)
                    const selectable = isDaySelectable(day)
                    const selected = dateStr === selectedDate
                    const isToday = dateStr === toDateStr(today.getFullYear(), today.getMonth(), today.getDate())
                    return (
                      <button
                        key={i}
                        disabled={!selectable}
                        onClick={() => setSelectedDate(dateStr)}
                        className={`
                          aspect-square rounded-lg text-sm font-medium transition-all
                          ${selected ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' :
                            selectable ? 'text-white hover:bg-purple-600/20 hover:text-purple-300' :
                            'text-gray-700 cursor-not-allowed'}
                          ${isToday && !selected ? 'ring-1 ring-purple-600/50' : ''}
                        `}
                      >
                        {day}
                      </button>
                    )
                  })}
                </div>
                <p className="text-xs text-gray-600 mt-4 text-center">Weekdays only · Mon–Fri · Book at least 1 day in advance</p>
              </div>

              {/* Time slots */}
              <div className="bg-[#12121a] border border-gray-800 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-purple-400" />
                  <span className="text-white font-semibold">
                    {selectedDate ? formatDate(selectedDate) : 'Select a date first'}
                  </span>
                </div>
                {!selectedDate ? (
                  <div className="text-center text-gray-600 py-16">
                    <Calendar className="w-10 h-10 mx-auto mb-3 opacity-40" />
                    <p>Pick a date on the calendar</p>
                  </div>
                ) : loadingSlots ? (
                  <div className="text-center text-gray-600 py-16">
                    <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p>Loading slots…</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {ALL_SLOTS.map(slot => {
                      const isBooked = bookedSlots.includes(slot)
                      const isAvailable = availableSlots.includes(slot)
                      const isSelected = selectedSlot === slot
                      return (
                        <button
                          key={slot}
                          disabled={isBooked}
                          onClick={() => setSelectedSlot(slot)}
                          className={`
                            py-2 px-1 rounded-lg text-xs font-medium transition-all text-center
                            ${isSelected ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' :
                              isBooked ? 'bg-gray-800/50 text-gray-700 cursor-not-allowed line-through' :
                              isAvailable ? 'bg-gray-800 text-gray-300 hover:bg-purple-600/20 hover:text-purple-300' :
                              'bg-gray-800 text-gray-300 hover:bg-purple-600/20 hover:text-purple-300'}
                          `}
                        >
                          {formatSlot(slot)}
                        </button>
                      )
                    })}
                  </div>
                )}
                {bookedSlots.length > 0 && (
                  <p className="text-xs text-gray-600 mt-4 text-center">
                    {bookedSlots.length} slot{bookedSlots.length > 1 ? 's' : ''} already booked (shown crossed out)
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-xl mx-auto"
            >
              {/* Booking summary */}
              <div className="bg-purple-600/10 border border-purple-600/30 rounded-xl p-4 mb-6 flex flex-wrap items-center gap-3">
                <div>
                  <p className="text-white font-semibold">{formatDate(selectedDate)}</p>
                  <p className="text-purple-300 text-sm">{formatSlot(selectedSlot)} PKT · 30 minutes</p>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="ml-auto text-xs text-purple-400 hover:text-purple-300 underline"
                >
                  Change
                </button>
              </div>

              <div className="bg-[#12121a] border border-gray-800 rounded-2xl p-6 space-y-4">
                {[
                  { icon: User, key: 'name', label: 'Full Name', type: 'text', placeholder: 'Your name' },
                  { icon: Mail, key: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com' },
                  { icon: Phone, key: 'phone', label: 'Phone Number', type: 'tel', placeholder: '0303 2818320' },
                ].map(({ icon: Icon, key, label, type, placeholder }) => (
                  <div key={key}>
                    <label className="block text-sm text-gray-400 mb-1">{label}</label>
                    <div className="relative">
                      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type={type}
                        placeholder={placeholder}
                        value={form[key as keyof typeof form]}
                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                        className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                      />
                    </div>
                  </div>
                ))}

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Service Needed</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <select
                      value={form.service}
                      onChange={e => setForm(f => ({ ...f, service: e.target.value }))}
                      className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors appearance-none"
                    >
                      <option value="">Select a service…</option>
                      {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Message (optional)</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                    <textarea
                      rows={3}
                      placeholder="Briefly describe your project or goals…"
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">{error}</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-8 max-w-xl mx-auto">
          {step === 2 ? (
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 px-6 py-3 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          ) : <div />}

          {step === 1 ? (
            <button
              disabled={!selectedDate || !selectedSlot}
              onClick={() => setStep(2)}
              className="ml-auto px-8 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
            >
              Continue →
            </button>
          ) : (
            <button
              disabled={!form.name || !form.email || !form.service || submitting}
              onClick={handleSubmit}
              className="px-8 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              {submitting ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Booking…</>
              ) : 'Confirm Booking'}
            </button>
          )}
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-white text-center mb-6">Before You Book</h2>
          <div className="space-y-3">
            {bookFaqs.map(faq => (
              <details key={faq.q} className="bg-[#12121a] border border-gray-800 rounded-xl overflow-hidden group">
                <summary className="flex items-center justify-between p-4 cursor-pointer list-none hover:bg-white/3 transition-colors">
                  <span className="font-medium text-white text-sm pr-4">{faq.q}</span>
                  <span className="text-purple-400 text-xl flex-shrink-0 transition-transform duration-300 group-open:rotate-45">+</span>
                </summary>
                <div className="px-4 pb-4 text-gray-400 text-sm leading-relaxed border-t border-gray-800 pt-3">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
