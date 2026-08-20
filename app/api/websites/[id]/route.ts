import { NextResponse } from 'next/server'
import { getSql } from '@/lib/db'
import { getUserSession } from '@/lib/userSession'

export async function GET(
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
    const rows = await db`
      SELECT id, slug, business_name, status, site_data, updated_at, created_at
      FROM websites
      WHERE id = ${id} AND user_id = ${session.userId}
    `
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Website not found.' }, { status: 404 })
    }
    return NextResponse.json({ website: rows[0] })
  } catch (err) {
    console.error('GET /api/websites/[id] error:', err)
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}
