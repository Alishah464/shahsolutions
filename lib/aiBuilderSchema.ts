import { z } from 'zod'

export const generatedSiteSchema = z.object({
  business: z.object({
    name: z.string().min(1).max(80),
    tagline: z.string().min(1).max(120),
    category: z.string().min(1).max(60),
    city: z.string().min(1).max(60),
  }),
  hero: z.object({
    title: z.string().min(1).max(120),
    subtitle: z.string().min(1).max(240),
    ctaLabel: z.string().min(1).max(40),
  }),
  about: z.object({
    heading: z.string().min(1).max(80),
    body: z.string().min(1).max(600),
  }),
  services: z
    .array(
      z.object({
        emoji: z.string().min(1).max(8),
        title: z.string().min(1).max(60),
        description: z.string().min(1).max(200),
      })
    )
    .min(3)
    .max(6),
  whyUs: z
    .array(
      z.object({
        title: z.string().min(1).max(60),
        description: z.string().min(1).max(200),
      })
    )
    .min(3)
    .max(4),
  faq: z
    .array(
      z.object({
        question: z.string().min(1).max(160),
        answer: z.string().min(1).max(400),
      })
    )
    .min(3)
    .max(5),
  contact: z.object({
    // null (not an invented number) when the business description didn't provide one —
    // see the system prompts below. Fabricating a realistic-looking phone/WhatsApp
    // number risks it being mistaken for a real, working contact detail.
    phone: z.string().min(1).max(30).nullable(),
    whatsappNumber: z.string().min(1).max(30).nullable(),
    city: z.string().min(1).max(60),
  }),
  seo: z.object({
    title: z.string().min(1).max(70),
    description: z.string().min(1).max(160),
  }),
})

export type GeneratedSite = z.infer<typeof generatedSiteSchema>

const SCHEMA_DESCRIPTION = `{
  "business": { "name": string, "tagline": string, "category": string, "city": string },
  "hero": { "title": string, "subtitle": string, "ctaLabel": string },
  "about": { "heading": string, "body": string },
  "services": [ { "emoji": string (single emoji), "title": string, "description": string } ] (3 to 6 items),
  "whyUs": [ { "title": string, "description": string } ] (3 to 4 items),
  "faq": [ { "question": string, "answer": string } ] (3 to 5 items),
  "contact": { "phone": string or null, "whatsappNumber": string or null (digits only, with country code, no + or spaces), "city": string },
  "seo": { "title": string (<=70 chars), "description": string (<=160 chars) }
}`

// The full no-fabrication list — anything business-specific that a visitor could act on
// (call, pay, show up expecting) and that would embarrass a real owner if it turned out
// to be made up. Phone/WhatsApp get a structural null; everything else here is prompt-only
// (there's no dedicated schema field for most of these — they'd otherwise leak into free
// text like about.body or faq[].answer), so the instruction has to be explicit and exhaustive
// rather than relying on the model to generalize from a couple of examples.
const NEVER_FABRICATE = `Never invent, as if real, any of: prices, discounts, specific return/refund policy terms (day counts, conditions), delivery timeframes or areas, opening hours, physical addresses, certifications or licenses, years in business/founding date, customer counts, or customer names/testimonials/reviews. If a question would normally need one of these specifics and the input doesn't provide it, answer in general terms and invite the visitor to ask directly rather than stating a fabricated specific.`

export function buildGenerateSystemPrompt(): string {
  return `You are a website content generator for small businesses in Pakistan. Given a short description of a business, respond with ONLY a single JSON object (no markdown code fences, no commentary, no explanation) matching exactly this shape:

${SCHEMA_DESCRIPTION}

Write in a professional, warm tone appropriate for the business's industry. If the business description mentions a city, use it; otherwise pick a plausible Pakistani city. Never invent a phone number or WhatsApp number — if the description doesn't provide one, set that field to null (do not fabricate a realistic-looking one; it could be mistaken for the business's real contact detail). ${NEVER_FABRICATE} Respond with ONLY the JSON object.`
}

export function buildEditSystemPrompt(): string {
  return `You are editing an existing small-business website's content, represented as JSON. You will be given the current JSON and an instruction describing a change. Respond with ONLY the full updated JSON object (no markdown code fences, no commentary), matching exactly this shape:

${SCHEMA_DESCRIPTION}

Apply the requested change and keep every other field the same unless the instruction implies it should also change. Never invent a phone number or WhatsApp number that wasn't already present or explicitly given in the instruction — leave those fields null rather than fabricate one. ${NEVER_FABRICATE} Respond with ONLY the JSON object.`
}

/** Strips ```json fences if the model added them anyway, then parses + validates. */
export function parseGeneratedSite(raw: string): GeneratedSite | null {
  const stripped = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim()
  let parsed: unknown
  try {
    parsed = JSON.parse(stripped)
  } catch {
    return null
  }
  const result = generatedSiteSchema.safeParse(parsed)
  return result.success ? result.data : null
}
