import { getSql } from '@/lib/db'

/* ── Shared rate limiter ──────────────────────────────────────────────────
   Backed by a `rate_limits` table in the existing Neon Postgres database,
   so limits are enforced across all serverless instances. Falls back to an
   in-memory, per-instance counter if the DB call fails, so routes keep
   working rather than failing outright. */

const memoryStore = new Map<string, { count: number; resetAt: number }>()

function isRateLimitedInMemory(key: string, limit: number, windowSeconds: number): boolean {
  const now = Date.now()
  const entry = memoryStore.get(key)
  if (!entry || now > entry.resetAt) {
    memoryStore.set(key, { count: 1, resetAt: now + windowSeconds * 1000 })
    return false
  }
  if (entry.count >= limit) return true
  entry.count++
  return false
}

export async function isRateLimited(key: string, limit: number, windowSeconds: number): Promise<boolean> {
  try {
    const db = getSql()
    const rows = await db`
      INSERT INTO rate_limits (key, count, reset_at)
      VALUES (${key}, 1, now() + (${windowSeconds} * interval '1 second'))
      ON CONFLICT (key) DO UPDATE
      SET
        count = CASE WHEN rate_limits.reset_at < now() THEN 1 ELSE rate_limits.count + 1 END,
        reset_at = CASE WHEN rate_limits.reset_at < now() THEN now() + (${windowSeconds} * interval '1 second') ELSE rate_limits.reset_at END
      RETURNING count
    ` as { count: number }[]
    return rows[0].count > limit
  } catch (err) {
    console.error('DB rate-limit error, falling back to in-memory:', err)
    return isRateLimitedInMemory(key, limit, windowSeconds)
  }
}
