import type { GeneratedSite } from '@/lib/aiBuilderSchema'

/** Deterministic local stand-in for the LLM, used when AI_BUILDER_PROVIDER=mock.
    Lets the full builder UI (input → preview → edit) be exercised end-to-end
    without spending OpenRouter quota. Not meant to look intelligent — only to
    prove the plumbing (state updates, rendering, error paths) actually works. */

const CITY_KEYWORDS = ['karachi', 'lahore', 'islamabad', 'rawalpindi', 'faisalabad', 'multan', 'peshawar']

const CATEGORY_PRESETS: { keywords: string[]; category: string; emoji: string }[] = [
  { keywords: ['ac ', 'air condition', 'hvac'], category: 'AC Repair & Installation', emoji: '❄️' },
  { keywords: ['restaurant', 'food', 'cafe', 'catering'], category: 'Restaurant', emoji: '🍽️' },
  { keywords: ['cloth', 'garment', 'fashion', 'boutique', 'kurta', 'shalwar'], category: 'Clothing', emoji: '👕' },
  { keywords: ['salon', 'barber', 'beauty'], category: 'Salon & Beauty', emoji: '💇' },
  { keywords: ['clinic', 'doctor', 'dental', 'medical'], category: 'Healthcare', emoji: '🏥' },
  { keywords: ['real estate', 'property', 'realtor'], category: 'Real Estate', emoji: '🏠' },
  { keywords: ['construction', 'contractor', 'builder'], category: 'Construction', emoji: '🏗️' },
  { keywords: ['academy', 'tuition', 'school', 'education'], category: 'Education', emoji: '📚' },
]

function detectCategory(description: string): { category: string; emoji: string } {
  const lower = description.toLowerCase()
  const match = CATEGORY_PRESETS.find(p => p.keywords.some(k => lower.includes(k)))
  return match ? { category: match.category, emoji: match.emoji } : { category: 'Business Services', emoji: '💼' }
}

function detectCity(description: string): string {
  const lower = description.toLowerCase()
  const match = CITY_KEYWORDS.find(c => lower.includes(c))
  return match ? match[0].toUpperCase() + match.slice(1) : 'Lahore'
}

function detectName(description: string): string {
  const match = description.match(/called\s+([A-Z][\w'&]*(?:\s+[A-Z][\w'&]*){0,3})/i)
    || description.match(/named\s+([A-Z][\w'&]*(?:\s+[A-Z][\w'&]*){0,3})/i)
  return match ? match[1].trim() : 'Your Business'
}

/** null unless a phone-like number is actually present in the description — mirrors the
    real prompt's "never fabricate a contact number" rule, and exercises the UI's
    placeholder-rendering path since most test descriptions won't include one. */
function detectPhone(description: string): string | null {
  const match = description.match(/(\+?\d[\d\s-]{7,}\d)/)
  return match ? match[1].trim() : null
}

export function generateMockSite(description: string): GeneratedSite {
  const { category, emoji } = detectCategory(description)
  const city = detectCity(description)
  const name = detectName(description)

  return {
    business: { name, tagline: `Trusted ${category} in ${city}`, category, city },
    hero: {
      title: `Welcome to ${name}`,
      subtitle: `[MOCK PREVIEW] Quality ${category.toLowerCase()} services in ${city}, built around your description: "${description.slice(0, 100)}${description.length > 100 ? '…' : ''}"`,
      ctaLabel: 'Get in Touch',
    },
    about: {
      heading: `About ${name}`,
      body: `${name} is a ${category.toLowerCase()} business based in ${city}. This is placeholder mock content — no AI call was made. Set AI_BUILDER_PROVIDER=openrouter to generate real content.`,
    },
    services: [
      { emoji, title: `Core ${category}`, description: 'Mock service description for the primary offering.' },
      { emoji: '⭐', title: 'Premium Support', description: 'Mock service description for a secondary offering.' },
      { emoji: '🚀', title: 'Fast Turnaround', description: 'Mock service description for a third offering.' },
    ],
    whyUs: [
      { title: 'Experienced Team', description: 'Mock reason #1 this business stands out.' },
      { title: 'Local & Trusted', description: 'Mock reason #2 this business stands out.' },
      { title: 'Fair Pricing', description: 'Mock reason #3 this business stands out.' },
    ],
    faq: [
      { question: `What areas does ${name} serve?`, answer: `Mock answer — ${city} and surrounding areas.` },
      { question: 'How do I book a service?', answer: 'Mock answer — call or message on WhatsApp.' },
      { question: 'What are your hours?', answer: 'Mock answer — Monday to Saturday, 9am to 8pm.' },
    ],
    contact: { phone: detectPhone(description), whatsappNumber: detectPhone(description)?.replace(/\D/g, '') ?? null, city },
    seo: {
      title: `${name} — ${category} in ${city}`,
      description: `[MOCK] ${name} offers ${category.toLowerCase()} services in ${city}.`,
    },
  }
}

export function editMockSite(current: GeneratedSite, instruction: string): GeneratedSite {
  return {
    ...current,
    about: {
      ...current.about,
      body: `${current.about.body}\n\n[MOCK EDIT applied]: "${instruction}"`,
    },
  }
}
