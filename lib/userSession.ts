import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const SESSION_COOKIE = 'ss_user_session'
const secret = () => {
  const key = process.env.ADMIN_SESSION_SECRET
  if (!key) throw new Error('ADMIN_SESSION_SECRET environment variable is not set')
  return new TextEncoder().encode(key)
}

interface UserSessionPayload {
  userId: number
  email: string
}

export async function createUserSession(userId: number, email: string): Promise<string> {
  return new SignJWT({ userId, email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(secret())
}

export async function verifyUserSession(token: string): Promise<UserSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret())
    if (typeof payload.userId !== 'number' || typeof payload.email !== 'string') return null
    return { userId: payload.userId, email: payload.email }
  } catch {
    return null
  }
}

export async function getUserSession(): Promise<UserSessionPayload | null> {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  if (!token) return null
  return verifyUserSession(token)
}

export { SESSION_COOKIE }
