/** Cloudflare Turnstile verification, shared by every route that needs a human check. */
export async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret || secret === 'your_turnstile_secret_key') return true // skip in dev

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret, response: token, remoteip: ip }),
  })
  const data = await res.json() as { success: boolean; 'error-codes'?: string[] }
  if (!data.success) {
    console.error('Turnstile verification failed:', data['error-codes'])
  }
  return data.success === true
}
