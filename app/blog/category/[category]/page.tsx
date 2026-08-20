import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BookOpen, ArrowRight, ChevronRight } from 'lucide-react'
import ScrollReveal from '@/components/ScrollReveal'
import { getAllArticles, categoryFromSlug, CATEGORY_SLUGS, CATEGORY_DESCRIPTIONS } from '@/lib/articles'

const BASE = 'https://shahsolutions.vercel.app'

interface Props {
  params: Promise<{ category: string }>
}

export function generateStaticParams() {
  return Object.values(CATEGORY_SLUGS).map(category => ({ category }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: categorySlug } = await params
  const category = categoryFromSlug(categorySlug)
  if (!category) return {}

  return {
    title: `${category} Articles`,
    description: CATEGORY_DESCRIPTIONS[category],
    alternates: { canonical: `/blog/category/${categorySlug}` },
  }
}

export default async function CategoryPage({ params }: Props) {
  const { category: categorySlug } = await params
  const category = categoryFromSlug(categorySlug)
  if (!category) notFound()

  const articles = getAllArticles().filter(a => a.category === category)

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE}/blog` },
          { '@type': 'ListItem', position: 3, name: category, item: `${BASE}/blog/category/${categorySlug}` },
        ],
      },
      {
        '@type': 'CollectionPage',
        '@id': `${BASE}/blog/category/${categorySlug}#collection`,
        name: `${category} Articles`,
        description: CATEGORY_DESCRIPTIONS[category],
        url: `${BASE}/blog/category/${categorySlug}`,
        isPartOf: { '@id': `${BASE}/#website` },
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: articles.map((a, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `${BASE}/blog/${a.slug}`,
            name: a.title,
          })),
        },
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="relative pt-40 pb-16 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="orb orb-purple absolute top-20 -left-32 w-[500px] h-[500px] opacity-20" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1.5 text-sm text-slate-500 mb-6">
              <Link href="/" className="hover:text-primary-light transition-colors">Home</Link>
              <ChevronRight size={13} className="text-slate-600" />
              <Link href="/blog" className="hover:text-primary-light transition-colors">Blog</Link>
              <ChevronRight size={13} className="text-slate-600" />
              <span className="text-slate-400">{category}</span>
            </nav>

            <h1 className="font-display font-black text-3xl sm:text-5xl text-white mb-4 leading-tight text-balance">
              {category} <span className="text-slate-500 text-2xl sm:text-3xl font-normal">({articles.length})</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
              {CATEGORY_DESCRIPTIONS[category]}
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="pb-24 relative">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {articles.map((a, i) => (
              <ScrollReveal key={a.slug} delay={Math.min(i * 0.04, 0.4)}>
                <Link
                  href={`/blog/${a.slug}`}
                  className="glass-card glass-card-hover p-6 sm:p-7 flex items-start gap-5 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 mt-1">
                    <BookOpen size={16} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-display font-bold text-white text-lg sm:text-xl mb-2 leading-snug group-hover:text-primary-light transition-colors">
                      {a.title}
                    </h2>
                    <p className="text-slate-400 text-sm leading-relaxed">{a.description}</p>
                  </div>
                  <ArrowRight size={18} className="text-primary/60 flex-shrink-0 mt-2 group-hover:translate-x-1 transition-transform hidden sm:block" />
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
