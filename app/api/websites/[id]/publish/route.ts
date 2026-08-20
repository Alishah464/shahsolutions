import { NextResponse } from 'next/server'
import { getSql } from '@/lib/db'
import { getUserSession } from '@/lib/userSession'
import { slugify, randomSuffix } from '@/lib/websiteSlug'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getUserSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const db = getSql()

  try {
    const rows = await db`
      SELECT id, slug, business_name FROM websites WHERE id = ${id} AND user_id = ${session.userId}
    ` as { id: number; slug: string | null; business_name: string }[]
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Website not found.' }, { status: 404 })
    }

    let slug = rows[0].slug
    if (!slug) {
      const base = slugify(rows[0].business_name)
      // A handful of attempts against the unique constraint is simpler and just as
      // reliable as a pre-check-then-insert race for this volume of traffic.
      for (let attempt = 0; attempt < 5; attempt++) {
        const candidate = attempt === 0 ? base : `${base}-${randomSuffix()}`
        const existing = await db`SELECT id FROM websites WHERE slug = ${candidate}`
        if (existing.length === 0) {
          slug = candidate
          break
        }
      }
      if (!slug) slug = `${base}-${randomSuffix()}`
    }

    const updated = await db`
      UPDATE websites SET status = 'published', slug = ${slug}, updated_at = now()
      WHERE id = ${id} AND user_id = ${session.userId}
      RETURNING id, slug, business_name, status, updated_at, created_at
    `
    return NextResponse.json({ website: updated[0] })
  } catch (err) {
    console.error('POST /api/websites/[id]/publish error:', err)
    return NextResponse.json({ error: 'Could not publish. Please try again.' }, { status: 500 })
  }
}
