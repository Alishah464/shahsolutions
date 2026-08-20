import type { Metadata } from 'next'
import PortfolioClient from '@/components/PortfolioClient'

const BASE = 'https://shahsolutions.vercel.app'

const portfolioSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
        { '@type': 'ListItem', position: 2, name: 'Portfolio', item: `${BASE}/portfolio` },
      ],
    },
    {
      '@type': 'CollectionPage',
      '@id': `${BASE}/portfolio#webpage`,
      url: `${BASE}/portfolio`,
      name: 'Portfolio — Web, App, SEO & Marketing Projects | Shah Solutions',
      description: 'Explore 150+ delivered projects: web development, app development, SEO campaigns, GEO optimization, and digital marketing. Real results for real businesses.',
      isPartOf: { '@id': `${BASE}/#website` },
      creator: { '@id': `${BASE}/#organization` },
      inLanguage: 'en-US',
    },
  ],
}

export const metadata: Metadata = {
  title: 'Portfolio — Web, App, SEO & Marketing Projects',
  description:
    'Explore Shah Solutions portfolio: 150+ delivered projects in web development, app development, SEO campaigns, GEO optimization, and digital marketing. Real results, real businesses.',
  alternates: { canonical: '/portfolio' },
  keywords: [
    'IT portfolio Pakistan', 'web development projects', 'app development portfolio',
    'SEO case studies', 'digital marketing results',
  ],
}

export default function PortfolioPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(portfolioSchema) }} />
      <PortfolioClient />
    </>
  )
}
