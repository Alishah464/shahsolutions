import { NextRequest, NextResponse } from 'next/server'
import { isRateLimited } from '@/lib/rateLimit'
import { verifyTurnstile } from '@/lib/turnstile'
import { SYSTEM_PROMPT } from '@/lib/chatKnowledge'
import { SITE_URL } from '@/lib/site'
import { classifyOpenRouterStatus, openRouterErrorMessage } from '@/lib/openrouter'
import { logAiUsage } from '@/lib/aiUsageLog'

type ChatMessage = { role: 'user' | 'assistant'; content: string }

const MAX_MESSAGES = 30
const MAX_MESSAGE_LENGTH = 2000
const FALLBACK_REPLY =
  "Thanks for reaching out! Our AI assistant isn't fully set up yet, but our team is happy to help — " +
  'book a free 30-minute strategy call at /book, or send us a message at /contact and we\'ll get back to you shortly.'

function isPlaceholder(key: string | undefined): boolean {
  return !key || key.includes('placeholder')
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? '0.0.0.0'
  if (await isRateLimited(`chat:${ip}`, 20, 60)) {
    return NextResponse.json({ error: 'Too many messages. Please wait a minute and try again.' }, { status: 429 })
  }

  let body: { messages?: ChatMessage[]; turnstileToken?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const messages = body.messages
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: 'Missing messages' }, { status: 400 })
  }
  if (messages.length > MAX_MESSAGES) {
    return NextResponse.json({ error: 'Conversation too long' }, { status: 400 })
  }
  for (const m of messages) {
    if (
      typeof m?.content !== 'string' ||
      m.content.length > MAX_MESSAGE_LENGTH ||
      (m.role !== 'user' && m.role !== 'assistant')
    ) {
      return NextResponse.json({ error: 'Invalid message format' }, { status: 400 })
    }
  }

  if (!body.turnstileToken || !(await verifyTurnstile(body.turnstileToken, ip))) {
    return NextResponse.json({ error: 'Verification failed. Please refresh the page and try again.' }, { status: 400 })
  }

  const apiKey = process.env.OPENROUTER_API_KEY

  if (isPlaceholder(apiKey)) {
    return NextResponse.json({ reply: FALLBACK_REPLY, configured: false })
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 20000)
  const started = Date.now()

  let upstream: Response
  try {
    upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': SITE_URL,
        'X-Title': 'Shah Solutions Chatbot',
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || 'openai/gpt-oss-20b:free',
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
        stream: true,
        temperature: 0.4,
        max_tokens: 500,
      }),
      signal: controller.signal,
    })
  } catch (err) {
    const kind = err instanceof Error && err.name === 'AbortError' ? 'timeout' : 'network'
    console.error(`OpenRouter error: ${kind}`, err)
    logAiUsage({ feature: 'chat', success: false, errorKind: kind, latencyMs: Date.now() - started })
    return NextResponse.json({ reply: openRouterErrorMessage(kind), configured: true })
  } finally {
    clearTimeout(timeout)
  }

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => '')
    console.error('OpenRouter error:', upstream.status, detail)
    const kind = classifyOpenRouterStatus(upstream.status)
    logAiUsage({ feature: 'chat', success: false, errorKind: kind, latencyMs: Date.now() - started })
    return NextResponse.json({ reply: openRouterErrorMessage(kind), configured: true })
  }

  // Time-to-first-byte, not full stream duration — the route hands the raw body straight
  // through and doesn't otherwise observe when the stream actually finishes.
  logAiUsage({ feature: 'chat', success: true, latencyMs: Date.now() - started })

  return new Response(upstream.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
