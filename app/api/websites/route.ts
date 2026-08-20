import { NextRequest, NextResponse } from 'next/server'
import { getSql } from '@/lib/db'
import { getUserSession } from '@/lib/userSession'
import { generatedSiteSchema } from '@/lib/aiBuilderSchema'

export async function GET() {
  const session = await getUserSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const db = getSql()
    const rows = await db`
      SELECT id, slug, business_name, status, updated_at, created_at
      FROM websites
      WHERE user_id = ${session.userId}
      ORDER BY updated_at DESC
    `
    return NextResponse.json({ websites: rows })
  } catch (err) {
    console.error('GET /api/websites error:', err)
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getUserSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { id?: number | null; businessName?: string; site?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const siteResult = generatedSiteSchema.safeParse(body.site)
  if (!siteResult.success || !body.businessName?.trim()) {
    return NextResponse.json({ error: 'Invalid website data.' }, { status: 400 })
  }
  const businessName = body.businessName.trim().slice(0, 80)
  // jsonb params need an explicit string + cast — the driver won't auto-serialize a
  // plain JS object into a jsonb literal.
  const siteDataJson = JSON.stringify(siteResult.data)

  try {
    const db = getSql()

    if (body.id) {
      // Update: ownership-checked — updating zero rows because the id belongs to a
      // different user looks identical to a not-found id, so both get the same 404.
      const rows = await db`
        UPDATE websites
        SET business_name = ${businessName}, site_data = ${siteDataJson}::jsonb, updated_at = now()
        WHERE id = ${body.id} AND user_id = ${session.userId}
        RETURNING id, slug, business_name, status, updated_at, created_at
      `
      if (rows.length === 0) {
        return NextResponse.json({ error: 'Website not found.' }, { status: 404 })
      }
      await db`INSERT INTO website_versions (website_id, site_data) VALUES (${body.id}, ${siteDataJson}::jsonb)`
      return NextResponse.json({ website: rows[0] })
    }

    const rows = await db`
      INSERT INTO websites (user_id, business_name, site_data)
      VALUES (${session.userId}, ${businessName}, ${siteDataJson}::jsonb)
      RETURNING id, slug, business_name, status, updated_at, created_at
    `
    await db`INSERT INTO website_versions (website_id, site_data) VALUES (${rows[0].id}, ${siteDataJson}::jsonb)`
    return NextResponse.json({ website: rows[0] })
  } catch (err) {
    console.error('POST /api/websites error:', err)
    return NextResponse.json({ error: 'Could not save. Please try again.' }, { status: 500 })
  }
}
