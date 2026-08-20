import { getSql } from '@/lib/db'

/** Fire-and-forget usage logging, split by feature (chat vs ai-builder-generate vs
    ai-builder-edit) so quota consumption is attributable — see ai_usage_log in
    scripts/setup-phase2-db.sql. Never throws into the caller; a logging failure
    should never break the actual AI request it's describing. */
export function logAiUsage(entry: {
  feature: 'chat' | 'ai-builder-generate' | 'ai-builder-edit'
  success: boolean
  errorKind?: string
  latencyMs: number
}): void {
  try {
    const db = getSql()
    db`
      INSERT INTO ai_usage_log (feature, success, error_kind, latency_ms)
      VALUES (${entry.feature}, ${entry.success}, ${entry.errorKind ?? null}, ${entry.latencyMs})
    `.catch((err: unknown) => console.error('ai_usage_log insert failed:', err))
  } catch (err) {
    console.error('ai_usage_log insert failed:', err)
  }
}
