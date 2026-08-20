import type { Metadata } from 'next'
import BookClient from '@/components/BookClient'
import { bookFaqs } from '@/lib/bookFaqs'

const BASE = 'https://shahsolutions.vercel.app'

export const metadata: Metadata = {
  title: 'Book a Free Consultation — Shah Solutions',
  description:
    'Book a free 30-minute IT consultation with Shah Solutions. Available Monday–Friday. Select your preferred date and time for SEO, web development, or app development.',
  alternates: { canonical: '/book' },
  keywords: [
    'book IT consultation Pakistan', 'free web development consultation', 'book SEO consultation',
    'schedule meeting Shah Solutions', 'free consultation Pakistan IT',
  ],
  openGraph: { title: 'Book a Free IT Consultation | Shah Solutions', url: '/book' },
}

const bookSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
        { '@type': 'ListItem', position: 2, name: 'Book Consultation', item: `${BASE}/book` },
      ],
    },
    {
      '@type': 'WebPage',
      '@id': `${BASE}/book#webpage`,
      url: `${BASE}/book`,
      name: 'Book a Free IT Consultation | Shah Solutions',
      description: 'Book a free 30-minute consultation with Shah Solutions specialists. Available Monday–Friday.',
      isPartOf: { '@id': `${BASE}/#website` },
      inLanguage: 'en-US',
    },
    {
      '@type': 'Service',
      name: 'Free IT Consultation',
      description: 'Free 30-minute consultation with Shah Solutions IT specialists for SEO, GEO, web development, app development, and digital marketing.',
      provider: { '@id': `${BASE}/#organization` },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        name: 'Free 30-minute IT Consultation',
        availability: 'https://schema.org/InStock',
      },
    },
    {
      '@type': 'FAQPage',
      '@id': `${BASE}/book#faq`,
      mainEntity: bookFaqs.map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    },
  ],
}

export default function BookPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bookSchema) }} />
      <BookClient />
    </>
  )
}
