import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { getSql } from '@/lib/db'
import { createUserSession, SESSION_COOKIE } from '@/lib/userSession'
import { SITE_URL } from '@/lib/site'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  const next = req.nextUrl.searchParams.get('next')
  const redirectTarget = next && next.startsWith('/') ? next : '/dashboard'

  if (!token) {
    return NextResponse.redirect(new URL('/login?error=missing_token', SITE_URL))
  }

  const tokenHash = createHash('sha256').update(token).digest('hex')

  try {
    const db = getSql()
    const rows = await db`
      SELECT id, email FROM magic_links
      WHERE token_hash = ${tokenHash} AND used_at IS NULL AND expires_at > now()
    ` as { id: number; email: string }[]

    if (rows.length === 0) {
      return NextResponse.redirect(new URL('/login?error=invalid_or_expired', SITE_URL))
    }

    const { email } = rows[0]
    await db`UPDATE magic_links SET used_at = now() WHERE id = ${rows[0].id}`

    const userRows = await db`
      INSERT INTO users (email) VALUES (${email})
      ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
      RETURNING id
    ` as { id: number }[]
    const userId = userRows[0].id

    const sessionToken = await createUserSession(userId, email)
    const res = NextResponse.redirect(new URL(redirectTarget, SITE_URL))
    res.cookies.set(SESSION_COOKIE, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    })
    return res
  } catch (err) {
    console.error('auth verify error:', err)
    return NextResponse.redirect(new URL('/login?error=server_error', SITE_URL))
  }
}
