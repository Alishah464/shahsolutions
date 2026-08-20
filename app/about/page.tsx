import type { Metadata } from 'next'
import { Target, Eye, Heart, Rocket, Users, Award, Code2, Sparkles, CheckCircle2, ArrowRight, HelpCircle } from 'lucide-react'
import Link from 'next/link'
import ScrollReveal from '@/components/ScrollReveal'

const BASE = 'https://shahsolutions.vercel.app'

const aboutFaqs = [
  {
    q: 'When was Shah Solutions founded, and how has it grown?',
    a: 'Shah Solutions was founded in 2019. Since then it has crossed 50 clients (2021), delivered 100+ projects across 12 countries (2022), and pioneered Generative Engine Optimization (GEO) services in Pakistan (2023).',
  },
  {
    q: 'Does Shah Solutions only work with clients in Pakistan?',
    a: 'No. Shah Solutions is based in Pakistan but serves businesses worldwide, with client communication available in both English and Urdu.',
  },
  {
    q: 'What makes Shah Solutions different from other IT agencies?',
    a: 'Four things: measuring success by client outcomes rather than deliverables, radical transparency in reporting and pricing, a client-first culture, and staying ahead of shifts like AI search and GEO rather than reacting to them late.',
  },
]

const aboutPageSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
        { '@type': 'ListItem', position: 2, name: 'About', item: `${BASE}/about` },
      ],
    },
    {
      '@type': 'AboutPage',
      '@id': `${BASE}/about#webpage`,
      url: `${BASE}/about`,
      name: 'About Shah Solutions — Pakistan\'s Premier IT Agency',
      description: 'Learn about Shah Solutions — our mission, team, values, and journey as a premium IT services company serving businesses worldwide from Pakistan.',
      isPartOf: { '@id': `${BASE}/#website` },
      about: { '@id': `${BASE}/#organization` },
      inLanguage: 'en-US',
    },
    {
      '@type': 'FAQPage',
      '@id': `${BASE}/about#faq`,
      mainEntity: aboutFaqs.map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    },
  ],
}

export const metadata: Metadata = {
  title: 'About Shah Solutions — Pakistan\'s Premier IT Company',
  description:
    'Learn about Shah Solutions — our mission, values, and the expert team behind Pakistan\'s leading IT services company. SEO, web & app development excellence since day one.',
  alternates: { canonical: '/about' },
  keywords: [
    'about Shah Solutions', 'IT company Pakistan history', 'Shah Solutions team',
    'IT agency values Pakistan', 'premium IT services company',
  ],
  openGraph: { title: 'About Shah Solutions', url: '/about' },
}

const values = [
  {
    icon: Target,
    title: 'Results-Obsessed',
    desc: 'Every strategy, every line of code, every campaign is tied to measurable business outcomes.',
  },
  {
    icon: Eye,
    title: 'Radical Transparency',
    desc: 'Real-time reporting, honest timelines, and zero hidden fees. You always know exactly what\'s happening.',
  },
  {
    icon: Heart,
    title: 'Client-First Culture',
    desc: 'Your success is our success. We go beyond the brief to ensure you achieve your goals.',
  },
  {
    icon: Rocket,
    title: 'Innovation-Driven',
    desc: 'We stay ahead of technology shifts — AI, GEO, Web3 — so you\'re always on the cutting edge.',
  },
]

const team = [
  {
    name: 'Alishah',
    role: 'Founder & CEO',
    expertise: 'Full-Stack Development, Business Strategy',
    gradient: 'from-primary to-secondary',
  },
  {
    name: 'Dev Lead',
    role: 'Head of Engineering',
    expertise: 'React, Next.js, Cloud Architecture',
    gradient: 'from-secondary to-accent',
  },
  {
    name: 'SEO Director',
    role: 'SEO & GEO Specialist',
    expertise: 'Technical SEO, AI Search, Content Strategy',
    gradient: 'from-accent to-emerald-500',
  },
  {
    name: 'Creative Director',
    role: 'UI/UX Design Lead',
    expertise: 'Figma, Motion Design, Brand Identity',
    gradient: 'from-orange-500 to-primary',
  },
]

const milestones = [
  { year: '2019', event: 'Shah Solutions founded with a mission to democratize premium IT services.' },
  { year: '2020', event: 'Expanded services to include GEO and AI-driven SEO strategies.' },
  { year: '2021', event: 'Crossed 50 clients milestone; launched mobile app development division.' },
  { year: '2022', event: 'Delivered 100+ projects across 12 countries with 98% satisfaction rate.' },
  { year: '2023', event: 'Pioneered Generative Engine Optimization (GEO) services in Pakistan.' },
  { year: '2024', event: 'Launched cloud solutions division; team expanded to 20+ specialists.' },
]

const techStack = [
  'Next.js', 'React', 'TypeScript', 'Flutter', 'Node.js',
  'Python', 'AWS', 'Vercel', 'PostgreSQL', 'MongoDB', 'Tailwind', 'Figma',
]

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }} />
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative pt-40 pb-24 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="orb orb-purple absolute top-20 -right-32 w-[600px] h-[600px] opacity-25 animate-float" />
        <div className="orb orb-blue absolute bottom-0 -left-32 w-[400px] h-[400px] opacity-20" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="max-w-3xl">
            <div className="section-tag">
              <Sparkles size={12} />
              Our Story
            </div>
            <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl text-white mt-4 mb-6 leading-tight">
              We Are{' '}
              <span className="gradient-text-animate">Shah Solutions</span>
            </h1>
            <p className="text-slate-300 text-xl leading-relaxed mb-8">
              Born from a passion for technology and a relentless drive for results, Shah Solutions
              has grown into Pakistan&apos;s most trusted IT partner for businesses that refuse to
              settle for average.
            </p>
            <p className="text-slate-400 leading-relaxed">
              We combine Silicon Valley-level engineering with deep local market knowledge to
              deliver IT services that truly move the needle — whether you&apos;re a local startup
              or scaling globally.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── MISSION / VISION ──────────────────────────────────────────────── */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-dark-2/50" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <ScrollReveal direction="left">
              <div className="glass-card p-6 sm:p-10 h-full gradient-border">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6">
                  <Target size={24} className="text-white" />
                </div>
                <h2 className="font-display font-bold text-2xl text-white mb-4">Our Mission</h2>
                <p className="text-slate-400 leading-relaxed">
                  To empower businesses of all sizes with premium IT solutions — making
                  enterprise-grade SEO, development, and marketing accessible, affordable,
                  and impactful. We measure success only when our clients succeed.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <div className="glass-card p-6 sm:p-10 h-full" style={{ border: '1px solid rgba(37,99,235,0.25)' }}>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center mb-6">
                  <Eye size={24} className="text-white" />
                </div>
                <h2 className="font-display font-bold text-2xl text-white mb-4">Our Vision</h2>
                <p className="text-slate-400 leading-relaxed">
                  To be the #1 IT services partner for South Asian businesses competing on the
                  global stage — known for innovation, integrity, and delivering results that
                  redefine what&apos;s possible in digital transformation.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── VALUES ────────────────────────────────────────────────────────── */}
      <section className="py-20 relative overflow-hidden">
        <div className="orb orb-cyan absolute top-0 left-1/2 w-[400px] h-[400px] opacity-15" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-16">
            <div className="section-tag mx-auto inline-flex">
              <Heart size={12} />
              Our Core Values
            </div>
            <h2 className="font-display font-black text-4xl sm:text-5xl text-white mt-4">
              Principles That <span className="gradient-text">Drive Us</span>
            </h2>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => {
              const Icon = v.icon
              return (
                <ScrollReveal key={v.title} delay={i * 0.1}>
                  <div className="glass-card glass-card-hover p-8 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20 flex items-center justify-center mx-auto mb-5">
                      <Icon size={26} className="text-primary" />
                    </div>
                    <h3 className="font-display font-bold text-white text-lg mb-3">{v.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{v.desc}</p>
                  </div>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── TEAM ──────────────────────────────────────────────────────────── */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-dark-2/40" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-16">
            <div className="section-tag mx-auto inline-flex">
              <Users size={12} />
              The Team
            </div>
            <h2 className="font-display font-black text-4xl sm:text-5xl text-white mt-4">
              Experts Behind <span className="gradient-text">Every Win</span>
            </h2>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <ScrollReveal key={member.name} delay={i * 0.1}>
                <div className="glass-card glass-card-hover p-6 text-center">
                  <div
                    className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${member.gradient} flex items-center justify-center mx-auto mb-5 text-3xl font-display font-black text-white`}
                    style={{ boxShadow: '0 8px 30px rgba(124,58,237,0.3)' }}
                  >
                    {member.name[0]}
                  </div>
                  <h3 className="font-display font-bold text-white text-lg mb-1">{member.name}</h3>
                  <p className="text-primary text-sm font-semibold mb-3">{member.role}</p>
                  <p className="text-slate-400 text-xs leading-relaxed">{member.expertise}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── MILESTONES ────────────────────────────────────────────────────── */}
      <section className="py-20 relative">
        <div className="orb orb-purple absolute right-0 top-1/2 w-96 h-96 opacity-15" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-16">
            <div className="section-tag mx-auto inline-flex">
              <Award size={12} />
              Our Journey
            </div>
            <h2 className="font-display font-black text-4xl sm:text-5xl text-white mt-4">
              A Story of <span className="gradient-text">Growth</span>
            </h2>
          </ScrollReveal>

          <div className="relative">
            <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-secondary to-accent" />
            <div className="space-y-6 sm:space-y-8">
              {milestones.map((m, i) => (
                <ScrollReveal key={m.year} delay={i * 0.1} direction="left">
                  <div className="flex gap-4 sm:gap-8 items-start pl-0">
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-display font-bold text-white text-xs sm:text-sm z-10 relative glow-primary">
                        {m.year}
                      </div>
                    </div>
                    <div className="glass-card p-4 sm:p-5 flex-1 glass-card-hover">
                      <p className="text-slate-300 text-sm leading-relaxed">{m.event}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TECH STACK ────────────────────────────────────────────────────── */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-dark-2/50" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-12">
            <div className="section-tag mx-auto inline-flex">
              <Code2 size={12} />
              Our Tech Stack
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white mt-4">
              Technologies We <span className="gradient-text">Master</span>
            </h2>
          </ScrollReveal>

          <ScrollReveal>
            <div className="flex flex-wrap justify-center gap-3">
              {techStack.map((tech, i) => (
                <div
                  key={tech}
                  className="px-5 py-2.5 glass-card text-slate-300 text-sm font-mono glass-card-hover font-medium"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  {tech}
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-dark-2/40" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-12">
            <div className="section-tag mx-auto inline-flex">
              <HelpCircle size={12} />
              Common Questions
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white mt-4">
              About Us <span className="gradient-text">FAQ</span>
            </h2>
          </ScrollReveal>
          <div className="space-y-3">
            {aboutFaqs.map((faq, i) => (
              <ScrollReveal key={faq.q} delay={i * 0.05}>
                <details className="glass-card overflow-hidden group">
                  <summary className="flex items-center justify-between p-5 sm:p-6 cursor-pointer list-none hover:bg-white/3 transition-colors">
                    <span className="font-semibold text-white text-sm sm:text-base pr-4">{faq.q}</span>
                    <span className="text-primary text-2xl flex-shrink-0 transition-transform duration-300 group-open:rotate-45">+</span>
                  </summary>
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-slate-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                    {faq.a}
                  </div>
                </details>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10" />
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h2 className="font-display font-black text-4xl sm:text-5xl text-white mb-6">
              Ready to Work <span className="gradient-text">Together?</span>
            </h2>
            <p className="text-slate-400 mb-8 text-lg">
              Let&apos;s have a conversation about your project goals.
              No pressure, no commitment — just good ideas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-primary px-8 py-4 text-base">
                <span>Start the Conversation</span>
                <ArrowRight size={16} />
              </Link>
              <Link href="/services" className="btn-secondary px-8 py-4 text-base">
                See Our Services
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
