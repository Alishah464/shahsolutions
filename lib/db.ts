import { neon } from '@neondatabase/serverless'

// Factory function — throwing here (at request time) is safe.
// Throwing at module level breaks Next.js build-time static analysis.
export function getSql() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set')
  }
  return neon(process.env.DATABASE_URL)
}
