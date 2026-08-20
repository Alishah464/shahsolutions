import { NextResponse } from 'next/server'
import { getSql } from '@/lib/db'
import { getUserSession } from '@/lib/userSession'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getUserSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    const db = getSql()
    // Slug is kept (not cleared) so re-publishing returns to the same URL.
    const rows = await db`
      UPDATE websites SET status = 'draft', updated_at = now()
      WHERE id = ${id} AND user_id = ${session.userId}
      RETURNING id, slug, business_name, status, updated_at, created_at
    `
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Website not found.' }, { status: 404 })
    }
    return NextResponse.json({ website: rows[0] })
  } catch (err) {
    console.error('POST /api/websites/[id]/unpublish error:', err)
    return NextResponse.json({ error: 'Could not unpublish. Please try again.' }, { status: 500 })
  }
}
