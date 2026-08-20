import fs from 'fs'
import path from 'path'
import { marked, type Tokens } from 'marked'

const ARTICLES_DIR = path.join(process.cwd(), 'articles')

// Source articles inconsistently use `#` for section headings instead of `##`.
// The page renders its own single <h1> from the title, so every heading found
// in the body is demoted one level — keeps a valid, single-H1 hierarchy
// regardless of how the source markdown was authored.
marked.use({
  renderer: {
    heading({ tokens, depth }: Tokens.Heading) {
      const level = Math.min(depth + 1, 6)
      return `<h${level}>${this.parser.parseInline(tokens)}</h${level}>\n`
    },
  },
})

// Verified via `git log --follow --diff-filter=A` — the date every current
// article was actually added to the repo, not a placeholder.
const PUBLISHED_DATE = '2026-07-06'

export type ArticleCategory = 'GEO / AEO' | 'SEO' | 'Web Development' | 'Business'

// Hand-written, per-article — the naive "first paragraph" fallback below
// produced several generic hook-sentence descriptions ("Search has never
// stood still.") too short and vague to be useful in a SERP snippet. These
// are written from each article's actual heading structure, sized to use
// the available SERP width without truncating.
const DESCRIPTION_OVERRIDES: Record<string, string> = {
  'aeo-answer-engine-optimization-2026': 'What is Answer Engine Optimization (AEO)? How answer engines work, the AEO vs SEO vs GEO distinction, and the core pillars of getting your brand cited.',
  'ai-search-ranking-factors-2026': 'The ranking factors that actually determine AI search visibility: user intent, topical authority, E-E-A-T, information quality, and content structure.',
  'ecommerce-website-development-2026-checklist': 'A complete 2026 checklist for ecommerce website development: platform choice, performance, mobile-first design, product pages, checkout, and SEO architecture.',
  'entity-seo-vs-keyword-seo-2026': 'Why entities matter more than keywords in AI search: what entity SEO is, how it differs from keyword SEO, with real examples of entity relationships.',
  'future-of-search-seo-geo-llmo-2026': 'How SEO, GEO, and LLM Optimization fit together, and what businesses should do now to prepare for zero-click search and the next decade of search.',
  'geo-best-practices-2026': '10 GEO best practices for 2026: building topical authority, answering questions naturally, technical SEO foundations, and demonstrating real experience.',
  'geo-generative-engine-optimization-2026': 'What Generative Engine Optimization (GEO) is, how AI platforms retrieve information, and the content structures that actually earn AI citations.',
  'google-ai-overviews-geo-guide': 'How Google AI Overviews work, how sources get selected, and the E-E-A-T, technical SEO, and structured data requirements for AI-era visibility.',
  'hiring-nextjs-developer-vs-agency': 'Next.js developer or agency? A cost, skills, and long-term support comparison to help you choose the right hiring path for your project.',
  'how-google-ai-overviews-choose-content-2026': 'How Google actually chooses content for AI Overviews: the ranking signals, relevance, and topical authority behind AI-powered search results.',
  'how-to-find-an-affordable-web-development-company': 'How to find an affordable web development company without sacrificing quality: pricing models explained and what to actually expect for your budget.',
  'how-to-get-featured-in-chatgpt-ai-search-2026': 'A brand visibility playbook for getting featured in ChatGPT: building topical authority, answering real questions, and strengthening E-E-A-T signals.',
  'how-to-identify-the-best-it-company-2026': 'Six steps to identify the best IT company for your business: defining needs, evaluating services, checking portfolios, reviews, and technical expertise.',
  'how-to-measure-geo-success-kpis-2026': 'The KPIs that actually measure GEO success: organic traffic, AI search visibility, brand mentions, topical authority, and content engagement.',
  'how-to-optimize-website-for-chatgpt-2026': 'How to optimize your website so ChatGPT can actually read and cite it: topical authority, direct answers, heading structure, and comprehensive content.',
  'perplexity-seo-get-cited-ai-search-2026': 'How Perplexity AI retrieves and cites information, and what makes content citation-worthy — comprehensive coverage and clear structure explained.',
  'technical-seo-for-ai-search-geo-checklist-2026': 'A technical SEO checklist for AI search: crawlability, site architecture, internal linking, Core Web Vitals, and semantic HTML for GEO readiness.',
  'what-is-ai-seo-2026-guide': 'What AI SEO is and how it differs from traditional SEO: how AI search works, why it matters in 2026, and what makes content AI-friendly.',
  'what-to-expect-hiring-seo-services-2026': 'What to expect when you hire SEO services: the audit, keyword research, technical optimization, content strategy, and on-page work included.',
}

const CATEGORIES: Record<string, ArticleCategory> = {
  'aeo-answer-engine-optimization-2026': 'GEO / AEO',
  'ai-search-ranking-factors-2026': 'GEO / AEO',
  'ecommerce-website-development-2026-checklist': 'Web Development',
  'entity-seo-vs-keyword-seo-2026': 'SEO',
  'future-of-search-seo-geo-llmo-2026': 'GEO / AEO',
  'geo-best-practices-2026': 'GEO / AEO',
  'geo-generative-engine-optimization-2026': 'GEO / AEO',
  'google-ai-overviews-geo-guide': 'GEO / AEO',
  'hiring-nextjs-developer-vs-agency': 'Web Development',
  'how-google-ai-overviews-choose-content-2026': 'GEO / AEO',
  'how-to-find-an-affordable-web-development-company': 'Web Development',
  'how-to-get-featured-in-chatgpt-ai-search-2026': 'GEO / AEO',
  'how-to-identify-the-best-it-company-2026': 'Business',
  'how-to-measure-geo-success-kpis-2026': 'GEO / AEO',
  'how-to-optimize-website-for-chatgpt-2026': 'GEO / AEO',
  'perplexity-seo-get-cited-ai-search-2026': 'GEO / AEO',
  'technical-seo-for-ai-search-geo-checklist-2026': 'SEO',
  'what-is-ai-seo-2026-guide': 'SEO',
  'what-to-expect-hiring-seo-services-2026': 'SEO',
}

// The single most relevant service page section for each article, for a
// reciprocal blog -> service link (the services page already links the
// other direction). Articles with no clean single-service match are omitted.
export const ARTICLE_SERVICE_LINK: Record<string, { href: string; label: string }> = {
  'aeo-answer-engine-optimization-2026': { href: '/services#geo', label: 'GEO / AI Search Optimization' },
  'ai-search-ranking-factors-2026': { href: '/services#geo', label: 'GEO / AI Search Optimization' },
  'ecommerce-website-development-2026-checklist': { href: '/services#web', label: 'Web Development' },
  'entity-seo-vs-keyword-seo-2026': { href: '/services#seo', label: 'SEO Optimization' },
  'future-of-search-seo-geo-llmo-2026': { href: '/services#geo', label: 'GEO / AI Search Optimization' },
  'geo-best-practices-2026': { href: '/services#geo', label: 'GEO / AI Search Optimization' },
  'geo-generative-engine-optimization-2026': { href: '/services#geo', label: 'GEO / AI Search Optimization' },
  'google-ai-overviews-geo-guide': { href: '/services#geo', label: 'GEO / AI Search Optimization' },
  'hiring-nextjs-developer-vs-agency': { href: '/services#web', label: 'Web Development' },
  'how-google-ai-overviews-choose-content-2026': { href: '/services#geo', label: 'GEO / AI Search Optimization' },
  'how-to-find-an-affordable-web-development-company': { href: '/services#web', label: 'Web Development' },
  'how-to-get-featured-in-chatgpt-ai-search-2026': { href: '/services#geo', label: 'GEO / AI Search Optimization' },
  'how-to-measure-geo-success-kpis-2026': { href: '/services#geo', label: 'GEO / AI Search Optimization' },
  'how-to-optimize-website-for-chatgpt-2026': { href: '/services#geo', label: 'GEO / AI Search Optimization' },
  'perplexity-seo-get-cited-ai-search-2026': { href: '/services#geo', label: 'GEO / AI Search Optimization' },
  'technical-seo-for-ai-search-geo-checklist-2026': { href: '/services#seo', label: 'SEO Optimization' },
  'what-is-ai-seo-2026-guide': { href: '/services#geo', label: 'GEO / AI Search Optimization' },
  'what-to-expect-hiring-seo-services-2026': { href: '/services#seo', label: 'SEO Optimization' },
}

export const CATEGORY_SLUGS: Record<ArticleCategory, string> = {
  'GEO / AEO': 'geo-aeo',
  'SEO': 'seo',
  'Web Development': 'web-development',
  'Business': 'business',
}

export const CATEGORY_DESCRIPTIONS: Record<ArticleCategory, string> = {
  'GEO / AEO': 'Guides on Generative Engine Optimization and Answer Engine Optimization — getting your brand cited by ChatGPT, Google AI Overviews, Perplexity, and Copilot.',
  'SEO': 'Guides on technical SEO, keyword strategy, and what to actually expect when you hire an SEO service or agency.',
  'Web Development': 'Guides on choosing a web development approach — platforms, pricing models, and developer vs. agency tradeoffs.',
  'Business': 'Guides on evaluating and hiring the right IT partner for your business.',
}

const SLUG_TO_CATEGORY: Record<string, ArticleCategory> = Object.fromEntries(
  Object.entries(CATEGORY_SLUGS).map(([category, slug]) => [slug, category as ArticleCategory])
)

export function categoryFromSlug(slug: string): ArticleCategory | null {
  return SLUG_TO_CATEGORY[slug] ?? null
}

export interface ArticleMeta {
  slug: string
  title: string
  description: string
  date: string
  category: ArticleCategory
}

export interface Article extends ArticleMeta {
  contentHtml: string
}

function slugToFilePath(slug: string): string {
  return path.join(ARTICLES_DIR, `${slug}.md`)
}

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .trim()
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  return cut.slice(0, cut.lastIndexOf(' ')) + '…'
}

/** Parses `# Title` + the first prose paragraph out of a raw article markdown string. */
function parseMeta(slug: string, raw: string): ArticleMeta {
  const lines = raw.split('\n')
  const titleLine = lines.find(l => l.startsWith('# '))
  const title = titleLine ? stripMarkdown(titleLine.replace(/^#\s+/, '')) : slug

  const afterTitle = lines.slice(lines.indexOf(titleLine ?? '') + 1)
  const firstParagraph = afterTitle.find(l => l.trim() && !l.trim().startsWith('#') && !l.trim().startsWith('---'))
  const fallbackDescription = firstParagraph ? truncate(stripMarkdown(firstParagraph.trim()), 156) : ''
  const description = DESCRIPTION_OVERRIDES[slug] ?? fallbackDescription

  return { slug, title, description, date: PUBLISHED_DATE, category: CATEGORIES[slug] ?? 'Business' }
}

export function getAllArticles(): ArticleMeta[] {
  const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.md'))
  return files
    .map(file => {
      const slug = file.replace(/\.md$/, '')
      const raw = fs.readFileSync(path.join(ARTICLES_DIR, file), 'utf8')
      return parseMeta(slug, raw)
    })
    .sort((a, b) => a.title.localeCompare(b.title))
}

export function getArticleBySlug(slug: string): Article | null {
  const filePath = slugToFilePath(slug)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf8')
  const meta = parseMeta(slug, raw)

  // Drop the leading `# Title` line — the page renders its own <h1>.
  const body = raw.replace(/^#\s+.*(\r?\n)+/, '')
  const contentHtml = marked.parse(body, { async: false }) as string

  return { ...meta, contentHtml }
}
