import type { MetadataRoute } from 'next'
import { getAllArticles, CATEGORY_SLUGS } from '@/lib/articles'
import { SITE_URL as BASE } from '@/lib/site'

// Real per-page "last substantively edited" dates (from `git log -1 --format=%as`),
// not build time — bump the relevant entry when a page's content actually changes.
const PAGE_DATES = {
  home: '2026-07-31',
  services: '2026-07-31',
  blog: '2026-07-31',
  about: '2026-07-31',
  portfolio: '2026-06-29',
  contact: '2026-06-29',
  book: '2026-07-31',
} as const

export default function sitemap(): MetadataRoute.Sitemap {
  const d = (iso: string) => new Date(`${iso}T00:00:00Z`)

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                lastModified: d(PAGE_DATES.home),      changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/services`,  lastModified: d(PAGE_DATES.services),  changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/blog`,      lastModified: d(PAGE_DATES.blog),      changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/about`,     lastModified: d(PAGE_DATES.about),     changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/portfolio`, lastModified: d(PAGE_DATES.portfolio), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/contact`,   lastModified: d(PAGE_DATES.contact),   changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/book`,      lastModified: d(PAGE_DATES.book),      changeFrequency: 'monthly', priority: 0.7 },
  ]

  const categoryPages: MetadataRoute.Sitemap = Object.values(CATEGORY_SLUGS).map(slug => ({
    url: `${BASE}/blog/category/${slug}`,
    lastModified: d(PAGE_DATES.blog),
    changeFrequency: 'weekly',
    priority: 0.65,
  }))

  const articlePages: MetadataRoute.Sitemap = getAllArticles().map(a => ({
    url: `${BASE}/blog/${a.slug}`,
    lastModified: new Date(`${a.date}T00:00:00Z`),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticPages, ...categoryPages, ...articlePages]
}
