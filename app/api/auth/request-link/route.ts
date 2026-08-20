import { NextRequest, NextResponse } from 'next/server'
import { randomBytes, createHash } from 'crypto'
import { Resend } from 'resend'
import { getSql } from '@/lib/db'
import { isRateLimited } from '@/lib/rateLimit'
import { SITE_URL } from '@/lib/site'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? '0.0.0.0'
  if (await isRateLimited(`auth-request-link:${ip}`, 5, 3600)) {
    return NextResponse.json({ error: 'Too many requests. Please wait a bit and try again.' }, { status: 429 })
  }

  let body: { email?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const email = body.email?.trim().toLowerCase()
  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }
  // Also rate-limit per email, independent of IP, so one address can't be spammed via rotating IPs.
  if (await isRateLimited(`auth-request-link-email:${email}`, 5, 3600)) {
    return NextResponse.json({ error: 'Too many requests. Please wait a bit and try again.' }, { status: 429 })
  }

  const rawToken = randomBytes(32).toString('hex')
  const tokenHash = createHash('sha256').update(rawToken).digest('hex')
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString()

  try {
    const db = getSql()
    await db`
      INSERT INTO magic_links (email, token_hash, expires_at)
      VALUES (${email}, ${tokenHash}, ${expiresAt})
    `
  } catch (err) {
    console.error('magic_links insert error:', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }

  const verifyUrl = `${SITE_URL}/api/auth/verify?token=${rawToken}`
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey || apiKey === 're_placeholder_replace_with_real_key') {
    console.log('=== MAGIC LINK (no Resend key) ===', verifyUrl)
    return NextResponse.json({ success: true })
  }

  // Dev convenience only — token_hash is stored (not the raw token) specifically so it
  // can't be recovered from the DB; NODE_ENV is never 'production' in local dev, so this
  // never runs where a real visitor's link could leak into logs.
  if (process.env.NODE_ENV !== 'production') {
    console.log('=== MAGIC LINK (dev) ===', verifyUrl)
  }

  const resend = new Resend(apiKey)
  const { error: sendError } = await resend.emails.send({
    from: 'Shah Solutions <onboarding@resend.dev>',
    to: [email],
    subject: 'Sign in to Shah AI Builder',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2 style="color:#7c3aed">Sign in to Shah AI Builder</h2>
        <p>Click the link below to sign in. This link expires in 15 minutes.</p>
        <p><a href="${verifyUrl}" style="display:inline-block;padding:12px 24px;background:#7c3aed;color:white;border-radius:8px;text-decoration:none;">Sign in</a></p>
        <p style="color:#666;font-size:13px">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  })

  if (sendError) {
    console.error('Resend error (magic link):', sendError)
    return NextResponse.json({ error: 'Failed to send email. Please try again.' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
