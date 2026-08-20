import { logAiUsage } from '@/lib/aiUsageLog'

/** Classifies a failed OpenRouter HTTP status into a user-facing category. */
export type OpenRouterErrorKind = 'rate_limited' | 'auth' | 'server_error' | 'timeout' | 'network'

export function classifyOpenRouterStatus(status: number): OpenRouterErrorKind {
  if (status === 429) return 'rate_limited'
  if (status === 401 || status === 403) return 'auth'
  return 'server_error'
}

export function openRouterErrorMessage(kind: OpenRouterErrorKind): string {
  switch (kind) {
    case 'rate_limited':
      return 'Our AI assistant is temporarily busy. Please try again in a little while, or reach us at /contact.'
    case 'auth':
      return 'Sorry, our AI assistant is temporarily unavailable. Please reach us at /contact.'
    case 'timeout':
      return 'Sorry, that took too long to respond. Please try again.'
    case 'network':
    case 'server_error':
    default:
      return "Sorry, I'm having trouble connecting right now. Please try again, or reach us at /contact."
  }
}

interface CallOpenRouterJsonOptions {
  apiKey: string
  model: string
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[]
  temperature?: number
  maxTokens?: number
  timeoutMs?: number
  referer: string
  title: string
  /** Attributes quota consumption in ai_usage_log — see lib/aiUsageLog.ts. */
  usageFeature: 'ai-builder-generate' | 'ai-builder-edit'
}

export type OpenRouterJsonResult =
  | { ok: true; content: string }
  | { ok: false; kind: OpenRouterErrorKind; status?: number }

/** Non-streaming OpenRouter call requesting a JSON object response, with a timeout and
    error classification. For the streaming chat use case, call the API directly instead —
    this helper only returns a fully-materialized string. */
export async function callOpenRouterJson(opts: CallOpenRouterJsonOptions): Promise<OpenRouterJsonResult> {
  const controller = new AbortController()
  const started = Date.now()
  // Structured-JSON generations run noticeably longer than the chatbot's short streamed
  // replies — the model does internal reasoning before emitting the final JSON, and a
  // ~1800-token structured object under free-tier load can comfortably exceed 20s.
  const timeout = setTimeout(() => controller.abort(), opts.timeoutMs ?? 45000)

  const logResult = (result: OpenRouterJsonResult) => {
    logAiUsage({
      feature: opts.usageFeature,
      success: result.ok,
      errorKind: result.ok ? undefined : result.kind,
      latencyMs: Date.now() - started,
    })
    return result
  }

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${opts.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': opts.referer,
        'X-Title': opts.title,
      },
      body: JSON.stringify({
        model: opts.model,
        messages: opts.messages,
        response_format: { type: 'json_object' },
        temperature: opts.temperature ?? 0.6,
        max_tokens: opts.maxTokens ?? 1800,
      }),
      signal: controller.signal,
    })

    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      const kind = classifyOpenRouterStatus(res.status)
      console.error('OpenRouter error:', res.status, detail)
      return logResult({ ok: false, kind, status: res.status })
    }

    // Read the raw text first (rather than res.json() directly) so an abort that fires
    // mid-body-read throws its own AbortError here, caught below and correctly classified
    // as 'timeout' — a bare res.json().catch(() => null) would swallow that as if the
    // body were merely malformed JSON, mislabeling a slow response as a server error.
    const text = await res.text()
    let data: { choices?: { message?: { content?: string } }[] } | null
    try {
      data = JSON.parse(text)
    } catch {
      console.error('OpenRouter error: response body was not valid JSON:', text.slice(0, 500))
      return logResult({ ok: false, kind: 'server_error' })
    }

    const content = data?.choices?.[0]?.message?.content
    if (!content) {
      console.error('OpenRouter error: empty response body', JSON.stringify(data))
      return logResult({ ok: false, kind: 'server_error' })
    }
    return logResult({ ok: true, content })
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      console.error('OpenRouter error: request timed out')
      return logResult({ ok: false, kind: 'timeout' })
    }
    console.error('OpenRouter error: network failure', err)
    return logResult({ ok: false, kind: 'network' })
  } finally {
    clearTimeout(timeout)
  }
}
