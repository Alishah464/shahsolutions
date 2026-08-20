import { NextRequest, NextResponse } from 'next/server'
import { getSql } from '@/lib/db'
import { isWeekday, isPastDate, ALL_SLOTS, formatDate, formatSlot } from '@/lib/timeSlots'
import { escapeHtml } from '@/lib/utils'
import { isRateLimited } from '@/lib/rateLimit'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
  if (await isRateLimited(`booking:${ip}`, 3, 60)) {
    return NextResponse.json({ error: 'Too many requests. Please wait a minute.' }, { status: 429 })
  }

  let body: {
    name?: string; email?: string; phone?: string
    service?: string; message?: string; date?: string; timeSlot?: string
  }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { name, email, phone, service, message, date, timeSlot } = body

  if (!name || !email || !service || !date || !timeSlot) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (!isWeekday(date) || isPastDate(date)) {
    return NextResponse.json({ error: 'Invalid date. Only future weekdays are allowed.' }, { status: 400 })
  }

  if (!ALL_SLOTS.includes(timeSlot)) {
    return NextResponse.json({ error: 'Invalid time slot.' }, { status: 400 })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
  }

  try {
    const db = getSql()
    await db`
      INSERT INTO bookings (name, email, phone, service, message, date, time_slot)
      VALUES (${name}, ${email}, ${phone ?? ''}, ${service}, ${message ?? ''}, ${date}, ${timeSlot})
    `
  } catch (err: unknown) {
    const pgErr = err as { code?: string }
    if (pgErr?.code === '23505') {
      return NextResponse.json(
        { error: 'That time slot was just taken. Please pick another.' },
        { status: 409 }
      )
    }
    console.error('DB insert error:', err)
    return NextResponse.json({ error: 'Failed to save booking.' }, { status: 500 })
  }

  const formattedDate = formatDate(date)
  const formattedTime = formatSlot(timeSlot)

  // Initialised here (not at module level) so the build-time static analysis
  // pass doesn't throw when RESEND_API_KEY is absent.
  const resend = new Resend(process.env.RESEND_API_KEY)

  await Promise.allSettled([
    resend.emails.send({
      from: 'Shah Solutions <onboarding@resend.dev>',
      to: email,
      subject: `Consultation Confirmed — ${formattedDate} at ${formattedTime}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto">
          <h2 style="color:#7c3aed">Your consultation is booked!</h2>
          <p>Hi ${escapeHtml(name)},</p>
          <p>Your consultation with <strong>Shah Solutions</strong> has been scheduled.</p>
          <table style="border-collapse:collapse;width:100%;margin:20px 0">
            <tr><td style="padding:8px;color:#666;width:120px">Date</td><td style="padding:8px;font-weight:600">${escapeHtml(formattedDate)}</td></tr>
            <tr><td style="padding:8px;color:#666">Time</td><td style="padding:8px;font-weight:600">${escapeHtml(formattedTime)} PKT</td></tr>
            <tr><td style="padding:8px;color:#666">Service</td><td style="padding:8px;font-weight:600">${escapeHtml(service)}</td></tr>
          </table>
          <p>We'll reach out shortly to confirm details. You can also contact us at <a href="tel:03032818320">0303 2818320</a>.</p>
          <p style="color:#666;font-size:13px">Shah Solutions — amaherwani@gmail.com</p>
        </div>
      `,
    }),
    resend.emails.send({
      from: 'Shah Solutions Bookings <onboarding@resend.dev>',
      to: process.env.CONTACT_TO_EMAIL ?? 'amaherwani@gmail.com',
      subject: `New Consultation: ${name} — ${formattedDate} ${formattedTime}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto">
          <h2 style="color:#7c3aed">New Consultation Booked</h2>
          <table style="border-collapse:collapse;width:100%;margin:20px 0">
            <tr><td style="padding:8px;color:#666;width:100px">Name</td><td style="padding:8px">${escapeHtml(name)}</td></tr>
            <tr><td style="padding:8px;color:#666">Email</td><td style="padding:8px">${escapeHtml(email)}</td></tr>
            <tr><td style="padding:8px;color:#666">Phone</td><td style="padding:8px">${escapeHtml(phone ?? 'N/A')}</td></tr>
            <tr><td style="padding:8px;color:#666">Service</td><td style="padding:8px">${escapeHtml(service)}</td></tr>
            <tr><td style="padding:8px;color:#666">Date</td><td style="padding:8px">${escapeHtml(formattedDate)}</td></tr>
            <tr><td style="padding:8px;color:#666">Time</td><td style="padding:8px">${escapeHtml(formattedTime)} PKT</td></tr>
            <tr><td style="padding:8px;color:#666">Message</td><td style="padding:8px">${escapeHtml(message ?? 'None')}</td></tr>
          </table>
        </div>
      `,
    }),
  ])

  return NextResponse.json({ success: true })
}
