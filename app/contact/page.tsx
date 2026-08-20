import type { Metadata } from 'next'
import ContactClient from '@/components/ContactClient'

const BASE = 'https://shahsolutions.vercel.app'

export const metadata: Metadata = {
  title: 'Contact Us — Free IT Consultation',
  description:
    'Contact Shah Solutions for IT services. Get a free consultation for SEO, GEO, web development, or app development. We respond within 2 hours.',
  alternates: { canonical: '/contact' },
  keywords: [
    'contact Shah Solutions', 'IT consultation Pakistan', 'free SEO consultation',
    'web development quote', 'hire IT company Pakistan',
  ],
  openGraph: { title: 'Contact Shah Solutions — Free IT Consultation', url: '/contact' },
}

const contactSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
        { '@type': 'ListItem', position: 2, name: 'Contact', item: `${BASE}/contact` },
      ],
    },
    {
      '@type': 'ContactPage',
      '@id': `${BASE}/contact#webpage`,
      url: `${BASE}/contact`,
      name: 'Contact Shah Solutions — Free IT Consultation',
      description: 'Contact Shah Solutions for IT services. Free consultation for SEO, GEO, web development, and app development. Response within 2 hours.',
      isPartOf: { '@id': `${BASE}/#website` },
      inLanguage: 'en-US',
    },
    {
      '@type': 'FAQPage',
      '@id': `${BASE}/contact#faq`,
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How long does a website project take?',
          acceptedAnswer: { '@type': 'Answer', text: 'A standard business website takes 2–4 weeks. Complex e-commerce or web apps take 6–12 weeks. We always agree on timelines upfront.' },
        },
        {
          '@type': 'Question',
          name: 'Do you offer post-launch support?',
          acceptedAnswer: { '@type': 'Answer', text: 'Yes — all projects include 30 days of free post-launch support. We also offer monthly retainer plans for ongoing maintenance.' },
        },
        {
          '@type': 'Question',
          name: 'How do you measure SEO success?',
          acceptedAnswer: { '@type': 'Answer', text: 'We track organic traffic, keyword rankings, click-through rates, and revenue attribution. Monthly reports are sent every 1st of the month.' },
        },
        {
          '@type': 'Question',
          name: 'Do you work with startups and small businesses?',
          acceptedAnswer: { '@type': 'Answer', text: 'Absolutely. We work with businesses of all sizes — from early-stage startups to established enterprises. Every client gets the same quality.' },
        },
      ],
    },
  ],
}

export default function ContactPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }} />
      <ContactClient />
    </>
  )
}
