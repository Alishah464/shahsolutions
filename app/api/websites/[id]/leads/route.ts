import { NextRequest, NextResponse } from 'next/server'
import { getSql } from '@/lib/db'
import { getUserSession } from '@/lib/userSession'
import { isRateLimited } from '@/lib/rateLimit'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Public — this is what a published site's contact form submits to. Only accepts
    leads for websites that are actually published (a draft has no public URL to
    submit from in the first place, so this also acts as a light authorization check). */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? '0.0.0.0'
  if (await isRateLimited(`website-lead:${ip}`, 10, 3600)) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
  }

  const { id } = await params

  let body: { name?: string; email?: string; phone?: string; message?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const name = body.name?.trim()
  if (!name || (body.email && !EMAIL_REGEX.test(body.email.trim()))) {
    return NextResponse.json({ error: 'Please enter your name (and a valid email, if provided).' }, { status: 400 })
  }

  try {
    const db = getSql()
    const site = await db`SELECT id FROM websites WHERE id = ${id} AND status = 'published'`
    if (site.length === 0) {
      return NextResponse.json({ error: 'This site is not accepting messages right now.' }, { status: 404 })
    }
    await db`
      INSERT INTO website_leads (website_id, name, email, phone, message)
      VALUES (${id}, ${name.slice(0, 120)}, ${body.email?.trim() ?? null}, ${body.phone?.trim().slice(0, 30) ?? null}, ${body.message?.trim().slice(0, 1000) ?? null})
    `
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('POST /api/websites/[id]/leads error:', err)
    return NextResponse.json({ error: 'Could not send. Please try again.' }, { status: 500 })
  }
}

/** Owner-only — powers the dashboard's lead list. */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getUserSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    const db = getSql()
    const owned = await db`SELECT id FROM websites WHERE id = ${id} AND user_id = ${session.userId}`
    if (owned.length === 0) {
      return NextResponse.json({ error: 'Website not found.' }, { status: 404 })
    }
    const leads = await db`
      SELECT id, name, email, phone, message, created_at
      FROM website_leads WHERE website_id = ${id} ORDER BY created_at DESC
    `
    return NextResponse.json({ leads })
  } catch (err) {
    console.error('GET /api/websites/[id]/leads error:', err)
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}
