import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getSql } from '@/lib/db'
import { generatedSiteSchema, type GeneratedSite } from '@/lib/aiBuilderSchema'
import GeneratedSiteView from '@/components/GeneratedSiteView'
import LeadForm from '@/components/LeadForm'

interface PublishedWebsite {
  id: number
  business_name: string
  site_data: GeneratedSite
}

async function getPublishedSite(slug: string): Promise<PublishedWebsite | null> {
  try {
    const db = getSql()
    const rows = await db`
      SELECT id, business_name, site_data FROM websites WHERE slug = ${slug} AND status = 'published'
    ` as { id: number; business_name: string; site_data: unknown }[]
    if (rows.length === 0) return null
    const parsed = generatedSiteSchema.safeParse(rows[0].site_data)
    if (!parsed.success) return null
    return { id: rows[0].id, business_name: rows[0].business_name, site_data: parsed.data }
  } catch (err) {
    console.error('getPublishedSite error:', err)
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const site = await getPublishedSite(slug)
  if (!site) return { title: 'Site not found' }
  return {
    title: site.site_data.seo.title,
    description: site.site_data.seo.description,
    robots: { index: false, follow: true }, // AI-generated preview sites — not indexed until the owner is ready
  }
}

export default async function PublishedSitePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const site = await getPublishedSite(slug)
  if (!site) notFound()

  return (
    <section className="relative min-h-screen pt-32 pb-24 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <GeneratedSiteView site={site.site_data} leadForm={<LeadForm websiteId={site.id} />} />
      </div>
    </section>
  )
}
