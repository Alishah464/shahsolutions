import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getSql } from '@/lib/db'
import { escapeHtml } from '@/lib/utils'
import { isRateLimited } from '@/lib/rateLimit'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? '0.0.0.0'
  if (await isRateLimited(`chat-lead:${ip}`, 5, 60)) {
    return NextResponse.json({ error: 'Too many requests. Please wait a minute.' }, { status: 429 })
  }

  let body: { name?: string; email?: string; phone?: string; message?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { name, email, phone, message } = body

  if (!name || !email) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }

  try {
    const db = getSql()
    await db`
      INSERT INTO chat_leads (name, email, phone, message)
      VALUES (${name}, ${email}, ${phone ?? ''}, ${message ?? ''})
    `
  } catch (err) {
    console.error('Chat lead DB insert error:', err)
    return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 })
  }

  const apiKey = process.env.RESEND_API_KEY
  const toEmail = process.env.CONTACT_TO_EMAIL ?? 'amaherwani@gmail.com'

  if (!apiKey || apiKey === 're_placeholder_replace_with_real_key') {
    console.log('=== CHAT LEAD (no Resend key) ===', { name, email, phone, message })
    return NextResponse.json({ success: true })
  }

  const resend = new Resend(apiKey)
  const { error: sendError } = await resend.emails.send({
    from: 'Shah Solutions Chatbot <onboarding@resend.dev>',
    to: [toEmail],
    reply_to: email,
    subject: `New Chatbot Lead — ${name}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto">
        <h2 style="color:#7c3aed">New lead from the website chatbot</h2>
        <table style="border-collapse:collapse;width:100%;margin:20px 0">
          <tr><td style="padding:8px;color:#666;width:100px">Name</td><td style="padding:8px">${escapeHtml(name)}</td></tr>
          <tr><td style="padding:8px;color:#666">Email</td><td style="padding:8px">${escapeHtml(email)}</td></tr>
          <tr><td style="padding:8px;color:#666">Phone</td><td style="padding:8px">${escapeHtml(phone || 'Not provided')}</td></tr>
          <tr><td style="padding:8px;color:#666">Message</td><td style="padding:8px;white-space:pre-wrap">${escapeHtml(message || 'None')}</td></tr>
        </table>
      </div>
    `,
  })

  if (sendError) {
    console.error('Resend error (chat lead):', sendError)
    // Lead is already saved in the DB, so still report success to the client.
  }

  return NextResponse.json({ success: true })
}
