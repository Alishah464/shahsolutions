import type { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen, ArrowRight, Sparkles } from 'lucide-react'
import ScrollReveal from '@/components/ScrollReveal'
import { getAllArticles, CATEGORY_SLUGS, type ArticleCategory } from '@/lib/articles'

const BASE = 'https://shahsolutions.vercel.app'

// Order reflects how central each topic is to Shah Solutions' positioning —
// GEO/AEO first since it's the differentiator, not alphabetical.
const CATEGORY_ORDER: ArticleCategory[] = ['GEO / AEO', 'SEO', 'Web Development', 'Business']

export const metadata: Metadata = {
  title: 'Blog — SEO, GEO & Web Development Insights',
  description:
    'Guides on SEO, GEO/AI search optimization, AEO, and web development from Shah Solutions — practical, 2026-dated insights for businesses navigating AI-powered search.',
  alternates: { canonical: '/blog' },
  keywords: [
    'SEO blog', 'GEO guide', 'AEO answer engine optimization',
    'AI search optimization', 'generative engine optimization guide',
  ],
}

export default function BlogIndexPage() {
  const articles = getAllArticles()

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${BASE}/blog#blog`,
    name: 'Shah Solutions Blog',
    url: `${BASE}/blog`,
    publisher: { '@id': `${BASE}/#organization` },
    blogPost: articles.map(a => ({
      '@type': 'BlogPosting',
      headline: a.title,
      url: `${BASE}/blog/${a.slug}`,
      datePublished: a.date,
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="orb orb-purple absolute top-20 -left-32 w-[600px] h-[600px] opacity-20 animate-float" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <div className="section-tag mx-auto inline-flex">
              <Sparkles size={12} />
              Insights &amp; Guides
            </div>
            <h1 className="font-display font-black text-4xl sm:text-6xl text-white mt-4 mb-6 leading-tight">
              The Shah Solutions <span className="gradient-text-animate">Blog</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Practical guides on SEO, GEO/AI search optimization, and web development —
              written for business owners deciding what to do next, not for search engines.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="pb-24 relative">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          {CATEGORY_ORDER.map(category => {
            const inCategory = articles.filter(a => a.category === category)
            if (inCategory.length === 0) return null
            return (
              <div key={category}>
                <ScrollReveal>
                  <Link
                    href={`/blog/category/${CATEGORY_SLUGS[category]}`}
                    className="font-display font-bold text-white text-xl mb-5 flex items-center gap-3 group w-fit hover:text-primary-light transition-colors"
                  >
                    {category}
                    <span className="text-slate-500 text-sm font-normal">({inCategory.length})</span>
                    <ArrowRight size={16} className="text-primary/60 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </ScrollReveal>
                <div className="space-y-4">
                  {inCategory.map((a, i) => (
                    <ScrollReveal key={a.slug} delay={Math.min(i * 0.04, 0.4)}>
                      <Link
                        href={`/blog/${a.slug}`}
                        className="glass-card glass-card-hover p-6 sm:p-7 flex items-start gap-5 group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 mt-1">
                          <BookOpen size={16} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display font-bold text-white text-lg sm:text-xl mb-2 leading-snug group-hover:text-primary-light transition-colors">
                            {a.title}
                          </h3>
                          <p className="text-slate-400 text-sm leading-relaxed">{a.description}</p>
                        </div>
                        <ArrowRight size={18} className="text-primary/60 flex-shrink-0 mt-2 group-hover:translate-x-1 transition-transform hidden sm:block" />
                      </Link>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}
