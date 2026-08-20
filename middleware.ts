import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const ADMIN_SESSION_COOKIE = 'ss_admin_session'
const USER_SESSION_COOKIE = 'ss_user_session'
const secret = () => {
  const key = process.env.ADMIN_SESSION_SECRET
  if (!key) throw new Error('ADMIN_SESSION_SECRET environment variable is not set')
  return new TextEncoder().encode(key)
}

// Publishing (app/sites/[slug]) currently resolves by path, not by host — there's no
// wildcard domain (e.g. *.shahsites.com) configured yet. If one is added later, this is
// where a Host-header rewrite (businessname.example.com -> /sites/businessname) would go;
// the slug/site_data model in scripts/setup-phase2-db.sql doesn't need to change for that.

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = req.cookies.get(ADMIN_SESSION_COOKIE)?.value
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
    try {
      await jwtVerify(token, secret())
    } catch {
      const res = NextResponse.redirect(new URL('/admin/login', req.url))
      res.cookies.delete(ADMIN_SESSION_COOKIE)
      return res
    }
  }

  if (pathname.startsWith('/dashboard')) {
    const token = req.cookies.get(USER_SESSION_COOKIE)?.value
    if (!token) {
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('next', pathname)
      return NextResponse.redirect(loginUrl)
    }
    try {
      await jwtVerify(token, secret())
    } catch {
      const res = NextResponse.redirect(new URL('/login', req.url))
      res.cookies.delete(USER_SESSION_COOKIE)
      return res
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
}
