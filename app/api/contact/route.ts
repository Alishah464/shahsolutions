import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { escapeHtml } from '@/lib/utils'
import { isRateLimited } from '@/lib/rateLimit'
import { verifyTurnstile } from '@/lib/turnstile'

/* ── Route handler ──────────────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  try {
    // Resolve real IP (Vercel forwards via x-forwarded-for)
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
      req.headers.get('x-real-ip') ??
      '0.0.0.0'

    // Rate limit check
    if (await isRateLimited(`contact:${ip}`, 5, 60)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a minute and try again.' },
        { status: 429 }
      )
    }

    const body = await req.json()
    const { name, email, phone, service, budget, message, turnstileToken } = body

    // Basic field validation
    if (!name || !email || !service || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    // Turnstile verification
    if (!turnstileToken) {
      return NextResponse.json({ error: 'Please complete the CAPTCHA.' }, { status: 400 })
    }
    const captchaOk = await verifyTurnstile(turnstileToken, ip)
    if (!captchaOk) {
      return NextResponse.json({ error: 'CAPTCHA verification failed. Please try again.' }, { status: 400 })
    }

    const apiKey = process.env.RESEND_API_KEY
    const toEmail = process.env.CONTACT_TO_EMAIL ?? 'amaherwani@gmail.com'

    if (!apiKey || apiKey === 're_placeholder_replace_with_real_key') {
      console.log('=== CONTACT FORM (no Resend key) ===')
      console.log({ name, email, phone, service, budget, message })
      return NextResponse.json({ success: true })
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family:Inter,sans-serif;background:#050510;color:#F8FAFC;padding:40px;max-width:600px;margin:0 auto;">
          <div style="background:linear-gradient(135deg,#7C3AED,#2563EB);padding:3px;border-radius:16px;">
            <div style="background:#0A0A1A;border-radius:14px;padding:32px;">
              <h1 style="margin:0 0 24px;font-size:24px;background:linear-gradient(135deg,#7C3AED,#2563EB,#06B6D4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">
                New Contact from Shah Solutions
              </h1>
              <table style="width:100%;border-collapse:collapse;">
                ${[
                  ['Name', name],
                  ['Email', email],
                  ['Phone', phone || 'Not provided'],
                  ['Service', service],
                  ['Budget', budget || 'Not specified'],
                ].map(([k, v]) => `
                  <tr>
                    <td style="padding:10px 0;color:#94A3B8;font-size:13px;width:120px;vertical-align:top;">${escapeHtml(String(k))}</td>
                    <td style="padding:10px 0;color:#F8FAFC;font-size:14px;font-weight:600;">${escapeHtml(String(v))}</td>
                  </tr>
                `).join('')}
                <tr>
                  <td style="padding:10px 0;color:#94A3B8;font-size:13px;vertical-align:top;">Message</td>
                  <td style="padding:10px 0;color:#F8FAFC;font-size:14px;white-space:pre-wrap;">${escapeHtml(message)}</td>
                </tr>
              </table>
              <div style="margin-top:32px;padding:16px;background:rgba(124,58,237,0.1);border:1px solid rgba(124,58,237,0.3);border-radius:12px;">
                <p style="margin:0;color:#94A3B8;font-size:12px;">Reply directly to: <a href="mailto:${encodeURIComponent(email)}" style="color:#7C3AED;">${escapeHtml(email)}</a></p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `

    const resend = new Resend(apiKey)
    const { error: sendError } = await resend.emails.send({
      from: 'Shah Solutions <onboarding@resend.dev>',
      to: [toEmail],
      reply_to: email,
      subject: `New Inquiry: ${service} — ${name}`,
      html,
    })

    if (sendError) {
      console.error('Resend error:', sendError)
      return NextResponse.json({ error: 'Email failed' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact route error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
