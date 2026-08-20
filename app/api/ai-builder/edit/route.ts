import { NextRequest, NextResponse } from 'next/server'
import { isRateLimited } from '@/lib/rateLimit'
import { verifyTurnstile } from '@/lib/turnstile'
import { SITE_URL } from '@/lib/site'
import { buildEditSystemPrompt, generatedSiteSchema, parseGeneratedSite } from '@/lib/aiBuilderSchema'
import { editMockSite } from '@/lib/aiBuilderMock'
import { callOpenRouterJson, openRouterErrorMessage } from '@/lib/openrouter'

const MAX_INSTRUCTION_LENGTH = 300

function isPlaceholder(key: string | undefined): boolean {
  return !key || key.includes('placeholder')
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? '0.0.0.0'
  if (await isRateLimited(`ai-builder-edit:${ip}`, 15, 3600)) {
    return NextResponse.json(
      { error: 'Too many edits. Please try again in a bit.' },
      { status: 429 }
    )
  }

  let body: { site?: unknown; instruction?: string; turnstileToken?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const instruction = body.instruction?.trim()
  if (!instruction || instruction.length > MAX_INSTRUCTION_LENGTH) {
    return NextResponse.json({ error: 'Please describe the change in a sentence or two.' }, { status: 400 })
  }

  const currentSite = generatedSiteSchema.safeParse(body.site)
  if (!currentSite.success) {
    return NextResponse.json({ error: 'Invalid site data.' }, { status: 400 })
  }

  if (!body.turnstileToken || !(await verifyTurnstile(body.turnstileToken, ip))) {
    return NextResponse.json({ error: 'Verification failed. Please refresh the page and try again.' }, { status: 400 })
  }

  // Local/dev escape hatch: exercise the full builder UI without spending OpenRouter
  // quota. Never set on production — see .env.local.
  if (process.env.AI_BUILDER_PROVIDER === 'mock') {
    return NextResponse.json({ site: editMockSite(currentSite.data, instruction) })
  }

  const apiKey = process.env.OPENROUTER_API_KEY
  if (isPlaceholder(apiKey)) {
    return NextResponse.json({ error: 'The AI Builder is not configured yet. Please try again later.' }, { status: 503 })
  }

  const model = process.env.OPENROUTER_BUILDER_MODEL || process.env.OPENROUTER_MODEL || 'openai/gpt-oss-20b:free'

  const result = await callOpenRouterJson({
    apiKey: apiKey as string,
    model,
    messages: [
      { role: 'system', content: buildEditSystemPrompt() },
      { role: 'user', content: `Current website JSON:\n${JSON.stringify(currentSite.data)}\n\nRequested change: ${instruction}` },
    ],
    referer: SITE_URL,
    title: 'Shah Solutions AI Builder',
    timeoutMs: 60000,
    usageFeature: 'ai-builder-edit',
  })

  if (!result.ok) {
    return NextResponse.json({ error: openRouterErrorMessage(result.kind) }, { status: 502 })
  }

  const site = parseGeneratedSite(result.content)
  if (!site) {
    return NextResponse.json({ error: "That didn't quite work — please try rephrasing the change." }, { status: 502 })
  }

  return NextResponse.json({ site })
}
