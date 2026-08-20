import type { Metadata } from 'next'
import AiBuilderClient from '@/components/AiBuilderClient'
import { SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'AI Website Builder (Preview) — Shah Solutions',
  description:
    'Describe your business and get an AI-generated website preview in seconds. An early look at Shah Solutions’ AI-powered business tools.',
  alternates: { canonical: '/ai-builder' },
  robots: { index: false, follow: true },
}

const aiBuilderSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'AI Website Builder', item: `${SITE_URL}/ai-builder` },
      ],
    },
    {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/ai-builder#webpage`,
      url: `${SITE_URL}/ai-builder`,
      name: 'AI Website Builder (Preview) — Shah Solutions',
      description: 'Describe your business and get an AI-generated website preview in seconds.',
      isPartOf: { '@id': `${SITE_URL}/#website` },
      inLanguage: 'en-US',
    },
  ],
}

export default function AiBuilderPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aiBuilderSchema) }} />
      <AiBuilderClient />
    </>
  )
}
