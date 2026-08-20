'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Sparkles, ChevronRight, ArrowRight, Star, TrendingUp } from 'lucide-react'
import ScrollReveal from '@/components/ScrollReveal'

const categories = ['All', 'Web Dev', 'App Dev', 'SEO', 'GEO', 'Marketing']

const projects = [
  {
    id: 1, title: 'FinTech Pro Dashboard', category: 'Web Dev',
    tags: ['Next.js', 'TypeScript', 'AWS'],
    gradient: 'from-purple-600 to-blue-600',
    result: '2.1s load time · 95 Lighthouse score', impact: '+180% user retention',
    description: 'Enterprise financial dashboard with real-time data visualization, role-based access control, and multi-currency support for 50,000+ users.',
    emoji: '💹',
  },
  {
    id: 2, title: 'ShopSphere E-Commerce', category: 'Web Dev',
    tags: ['React', 'Node.js', 'Stripe'],
    gradient: 'from-cyan-600 to-blue-700',
    result: '40% higher conversion rate', impact: '+320% online revenue',
    description: 'Full-featured e-commerce platform with AI-powered recommendations, abandoned cart recovery, and 12 payment gateways.',
    emoji: '🛍️',
  },
  {
    id: 3, title: 'MediCare Mobile App', category: 'App Dev',
    tags: ['Flutter', 'Firebase', 'AI'],
    gradient: 'from-emerald-600 to-teal-700',
    result: '4.9 App Store rating', impact: '100K+ downloads in 6 months',
    description: 'Healthcare app connecting patients with doctors for instant video consultations, prescription management, and health record tracking.',
    emoji: '🏥',
  },
  {
    id: 4, title: 'RealEstate Hub', category: 'Web Dev',
    tags: ['Next.js', 'Maps API', 'CMS'],
    gradient: 'from-orange-600 to-red-700',
    result: '50,000 monthly active users', impact: '+270% organic traffic',
    description: 'Real estate platform with 3D virtual tours, AI property valuation, and integrated mortgage calculator.',
    emoji: '🏠',
  },
  {
    id: 5, title: 'TechBrand SEO Campaign', category: 'SEO',
    tags: ['Technical SEO', 'Content', 'Links'],
    gradient: 'from-violet-600 to-purple-800',
    result: 'Page 1 for 50+ keywords', impact: '+340% organic traffic in 4 months',
    description: 'Comprehensive SEO overhaul with technical fixes, content cluster strategy, and 200+ high-authority backlinks.',
    emoji: '🔍',
  },
  {
    id: 6, title: 'FoodDelight App', category: 'App Dev',
    tags: ['React Native', 'Node.js', 'Payments'],
    gradient: 'from-yellow-600 to-orange-700',
    result: '8-min average order time', impact: '30% repeat order rate',
    description: 'On-demand food delivery app with real-time GPS tracking, restaurant dashboard, and loyalty rewards system.',
    emoji: '🍔',
  },
  {
    id: 7, title: 'SaaS AI Search Visibility', category: 'GEO',
    tags: ['GEO', 'Schema', 'E-E-A-T'],
    gradient: 'from-blue-600 to-cyan-700',
    result: 'Featured in ChatGPT & Perplexity', impact: '+220% branded search volume',
    description: 'GEO strategy that positioned a B2B SaaS company as the go-to source in AI-generated responses across major LLMs.',
    emoji: '🤖',
  },
  {
    id: 8, title: 'EduLearn Platform', category: 'Web Dev',
    tags: ['Next.js', 'Video', 'Payments'],
    gradient: 'from-indigo-600 to-violet-700',
    result: '10,000 enrolled students', impact: '$200K+ revenue in year 1',
    description: 'Online learning platform with live classes, AI quiz generation, certificate issuance, and instructor analytics.',
    emoji: '🎓',
  },
  {
    id: 9, title: 'GrowthBrand PPC & Social', category: 'Marketing',
    tags: ['Google Ads', 'Meta', 'Email'],
    gradient: 'from-red-600 to-orange-600',
    result: '4.8x ROAS achieved', impact: '+580% qualified leads in 90 days',
    description: 'Full-funnel paid media campaign with Google Search, Meta retargeting, and email nurture sequences.',
    emoji: '📈',
  },
]

export default function PortfolioClient() {
  const [activeFilter, setActiveFilter] = useState('All')
  const filtered = activeFilter === 'All' ? projects : projects.filter((p) => p.category === activeFilter)

  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative pt-40 pb-24 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="orb orb-purple absolute top-20 right-0 w-[600px] h-[600px] opacity-20 animate-float" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <div className="section-tag mx-auto inline-flex">
              <Sparkles size={12} />
              Our Work
            </div>
            <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl text-white mt-4 mb-6 leading-tight">
              Proof in <span className="gradient-text-animate">Every Project</span>
            </h1>
            <p className="text-slate-400 text-xl max-w-2xl mx-auto">
              Real results for real businesses. Every project here has a measurable story of
              traffic, revenue, or user growth behind it.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── FILTER ────────────────────────────────────────────────────────── */}
      <section className="pb-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                    activeFilter === cat
                      ? 'bg-gradient-to-r from-primary to-secondary text-white glow-primary'
                      : 'glass-card text-slate-400 hover:text-white hover:border-primary/30'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── GRID ──────────────────────────────────────────────────────────── */}
      <section className="py-12 pb-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {filtered.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.5 }}
                  className="group"
                >
                  <div className="glass-card overflow-hidden glass-card-hover h-full flex flex-col">
                    <div className={`relative h-48 bg-gradient-to-br ${project.gradient} flex items-center justify-center overflow-hidden`}>
                      <div className="absolute inset-0 grid-bg opacity-20" />
                      <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                      <div className="absolute bottom-1/4 right-1/4 w-16 h-16 bg-white/15 rounded-full blur-xl" />
                      <span className="text-7xl relative z-10" role="img" aria-label={project.title}>
                        {project.emoji}
                      </span>
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                        <div className="text-center p-6">
                          <p className="text-white text-sm leading-relaxed mb-4">{project.description}</p>
                          <div className="flex items-center gap-1 justify-center text-yellow-400 text-xs font-semibold">
                            <TrendingUp size={12} />
                            {project.impact}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <span className="px-3 py-1 text-xs rounded-full bg-primary/15 border border-primary/25 text-primary font-semibold">
                          {project.category}
                        </span>
                        <ExternalLink size={14} className="text-slate-500 group-hover:text-primary transition-colors mt-0.5" />
                      </div>
                      <h3 className="font-display font-bold text-white text-lg mb-2">{project.title}</h3>
                      <div className="flex items-center gap-2 mb-4">
                        <Star size={12} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-slate-400 text-xs">{project.result}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-auto">
                        {project.tags.map((tag) => (
                          <span key={tag} className="px-2.5 py-1 text-xs rounded-full bg-white/5 border border-white/10 text-slate-400">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10" />
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h2 className="font-display font-black text-4xl sm:text-5xl text-white mb-6">
              Your Project Could Be <span className="gradient-text">Next</span>
            </h2>
            <p className="text-slate-400 text-lg mb-10">
              Let&apos;s build something remarkable together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-primary px-8 py-4 text-base">
                <span>Start Your Project</span>
                <ChevronRight size={16} />
              </Link>
              <Link href="/services" className="btn-secondary px-8 py-4 text-base">
                Explore Services
                <ArrowRight size={16} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
