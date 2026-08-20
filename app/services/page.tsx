import type { Metadata } from 'next'
import {
  Search, Globe, Code2, Smartphone, TrendingUp, Cloud,
  CheckCircle2, ArrowRight, Sparkles, ChevronRight,
  BarChart3, Link2, FileSearch, Bot, Map, Store,
  Layout, ShoppingCart, Cpu, Database, Lock, Server,
  Activity, Share2, Mail, MousePointerClick,
  Layers, GitBranch, Terminal, Gauge,
  MessageSquare, LineChart, Workflow, Puzzle, ShieldCheck, AlertTriangle, BookOpen,
} from 'lucide-react'
import Link from 'next/link'
import ScrollReveal from '@/components/ScrollReveal'
import { getAllArticles } from '@/lib/articles'

const BASE = 'https://shahsolutions.vercel.app'

// Contextual cross-links from each service into the blog — only where a
// genuinely relevant article exists, rather than forcing weak matches.
const RELATED_ARTICLES: Record<string, string[]> = {
  seo: ['what-to-expect-hiring-seo-services-2026', 'how-to-identify-the-best-it-company-2026'],
  geo: ['geo-generative-engine-optimization-2026', 'geo-best-practices-2026', 'aeo-answer-engine-optimization-2026'],
  web: ['hiring-nextjs-developer-vs-agency', 'how-to-find-an-affordable-web-development-company'],
  'ai-chatbots': ['how-to-optimize-website-for-chatgpt-2026', 'what-is-ai-seo-2026-guide'],
}

const serviceFaqs = [
  {
    q: 'What does Shah Solutions SEO optimization service include?',
    a: 'Our SEO service covers full technical SEO audits, keyword research and mapping, authority link building, on-page optimization, Core Web Vitals improvements, structured data implementation, and monthly reporting. We handle both on-page and off-page factors for comprehensive search visibility across Google and Bing.',
  },
  {
    q: 'What is GEO (Generative Engine Optimization) and how does it differ from SEO?',
    a: 'GEO is the technical and content discipline behind AI citations: structured data, clear entity signals, topical depth, and demonstrated E-E-A-T, so systems like ChatGPT, Perplexity, and Google AI Overviews treat your business as a source worth citing. It\'s a different skill set from classic keyword-and-backlink SEO, and most agencies haven\'t caught up to it yet.',
  },
  {
    q: 'How long does a web development project take at Shah Solutions?',
    a: 'A standard business website takes 2–4 weeks. E-commerce platforms take 4–8 weeks. Custom web applications take 6–16 weeks depending on complexity. Timelines are agreed upfront in our project proposal, with weekly updates and live preview environments throughout.',
  },
  {
    q: 'Do you build apps for both Android and iOS?',
    a: 'Yes. We build native Android and iOS apps as well as cross-platform applications using Flutter and React Native. Cross-platform development reduces cost and time-to-market while maintaining near-native performance. We also handle App Store and Google Play submission and post-launch support.',
  },
  {
    q: 'What cloud platforms does Shah Solutions support?',
    a: 'Shah Solutions designs and manages infrastructure on Amazon Web Services (AWS), Microsoft Azure, and Google Cloud Platform (GCP). We also deploy on Vercel, Cloudflare, and DigitalOcean. All cloud setups include CI/CD pipelines, monitoring, alerting, and cost optimization.',
  },
  {
    q: 'Do you offer ongoing support after project delivery?',
    a: 'Yes. All projects include 30 days of free post-launch support. We also offer monthly maintenance retainer plans covering updates, security patches, performance monitoring, and minor changes. SEO and digital marketing clients typically work with us on ongoing monthly contracts for sustained growth.',
  },
  {
    q: 'What is an AI agent, and can Shah Solutions build one for my business?',
    a: 'An AI agent is software that plans and takes action across your tools — not just answering questions, but completing multi-step tasks. We build custom AI agents scoped to your workflows, connected to your existing systems, with human-in-the-loop approval checkpoints so nothing happens without oversight where it matters.',
  },
  {
    q: 'Can you build an AI chatbot trained on our own content?',
    a: 'Yes. We build custom AI chatbots trained on your business content — services, FAQs, policies — so they answer accurately instead of guessing. They can be deployed on your website, WhatsApp, or Slack, capture leads, and hand off to your team when a conversation needs a human.',
  },
  {
    q: 'Do you build trading bots? Do you guarantee returns?',
    a: 'We build custom algorithmic trading bots to your own strategy and risk rules, including historical backtesting and exchange/broker API integration. This is custom software development, not financial or investment advice — we do not and cannot guarantee returns, and trading involves substantial risk. Backtested or simulated performance never guarantees future results.',
  },
]

const servicesPageSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
        { '@type': 'ListItem', position: 2, name: 'Services', item: `${BASE}/services` },
      ],
    },
    {
      '@type': 'WebPage',
      '@id': `${BASE}/services#webpage`,
      url: `${BASE}/services`,
      name: 'IT Services — SEO, GEO, Web & App Development | Shah Solutions',
      description: 'Explore Shah Solutions IT services: SEO optimization, GEO/AI search optimization, web development, app development, digital marketing, cloud solutions, AI agents, AI chatbots, and trading bots.',
      isPartOf: { '@id': `${BASE}/#website` },
      breadcrumb: { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: BASE }, { '@type': 'ListItem', position: 2, name: 'Services', item: `${BASE}/services` }] },
    },
    { '@type': 'Service', name: 'SEO Optimization', serviceType: 'Search Engine Optimization', description: 'Data-driven SEO: technical audits, keyword research, authority link building, on-page optimization, Core Web Vitals, and structured data. Average 300% traffic increase in 90 days.', provider: { '@id': `${BASE}/#organization` }, areaServed: 'Worldwide', url: `${BASE}/services#seo` },
    { '@type': 'Service', name: 'GEO / AI Search Optimization', serviceType: 'Generative Engine Optimization', description: 'Position your brand to be cited in ChatGPT, Google AI Overviews, Perplexity, and Copilot through E-E-A-T authority, entity signals, structured data, and AI citation strategy.', provider: { '@id': `${BASE}/#organization` }, areaServed: 'Worldwide', url: `${BASE}/services#geo` },
    { '@type': 'Service', name: 'Web Development', serviceType: 'Web Development', description: 'Custom websites and web applications using Next.js, React, and TypeScript. Mobile-first, sub-2s load times, 99.9% uptime. E-commerce, CMS, and web app development.', provider: { '@id': `${BASE}/#organization` }, areaServed: 'Worldwide', url: `${BASE}/services#web` },
    { '@type': 'Service', name: 'App Development', serviceType: 'Mobile App Development', description: 'Native iOS and Android apps and cross-platform Flutter/React Native applications. Full App Store submission support, real-time databases, and performance monitoring.', provider: { '@id': `${BASE}/#organization` }, areaServed: 'Worldwide', url: `${BASE}/services#app` },
    { '@type': 'Service', name: 'Digital Marketing', serviceType: 'Digital Marketing', description: 'Full-funnel digital marketing: Google and Meta PPC ads, social media management, email marketing automation, conversion rate optimization, and A/B testing.', provider: { '@id': `${BASE}/#organization` }, areaServed: 'Worldwide', url: `${BASE}/services#marketing` },
    { '@type': 'Service', name: 'Cloud Solutions', serviceType: 'Cloud Computing', description: 'Cloud infrastructure on AWS, Azure, and GCP. DevOps CI/CD pipelines, containerization, database management, security compliance, monitoring, and cost optimization.', provider: { '@id': `${BASE}/#organization` }, areaServed: 'Worldwide', url: `${BASE}/services#cloud` },
    { '@type': 'Service', name: 'AI Agents', serviceType: 'AI Agent Development', description: 'Custom autonomous AI agents that plan and take action across your tools and data, with API integrations and human-in-the-loop approval checkpoints.', provider: { '@id': `${BASE}/#organization` }, areaServed: 'Worldwide', url: `${BASE}/services#ai-agents` },
    { '@type': 'Service', name: 'AI Chatbots', serviceType: 'AI Chatbot Development', description: 'Custom AI chatbots trained on your business content, deployable on web, WhatsApp, or Slack, with lead capture and handoff to your team.', provider: { '@id': `${BASE}/#organization` }, areaServed: 'Worldwide', url: `${BASE}/services#ai-chatbots` },
    { '@type': 'Service', name: 'Trading Bots', serviceType: 'Algorithmic Trading Software Development', description: 'Custom algorithmic trading bots built to your own strategy and risk rules, with historical backtesting and exchange/broker API integration. Software development only — not financial or investment advice.', provider: { '@id': `${BASE}/#organization` }, areaServed: 'Worldwide', url: `${BASE}/services#trading-bots` },
    {
      '@type': 'FAQPage',
      '@id': `${BASE}/services#faq`,
      mainEntity: serviceFaqs.map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    },
  ],
}

export const metadata: Metadata = {
  title: 'IT Services — SEO, GEO, Web, App & AI Development',
  description:
    'Full-stack IT services: SEO, GEO/AI search, web & app dev, digital marketing, cloud, AI agents, chatbots & trading bots. Shah Solutions, Pakistan.',
  alternates: { canonical: '/services' },
  keywords: [
    'SEO services Pakistan', 'GEO optimization', 'web development services',
    'app development Pakistan', 'digital marketing agency', 'cloud solutions Pakistan',
    'AI agent development', 'AI chatbot development', 'trading bot development',
  ],
}

const serviceCategories = [
  {
    id: 'seo',
    icon: Search,
    color: 'from-purple-600 to-violet-800',
    borderColor: 'border-purple-500/20',
    glowColor: 'rgba(124,58,237,0.3)',
    title: 'SEO Optimization',
    subtitle: 'Rank Higher. Get Found. Grow Faster.',
    longDesc:
      'Our data-driven SEO strategies are built on deep technical audits, competitive analysis, and content frameworks that get you to page 1 — and keep you there. We don\'t chase rankings; we build authority.',
    features: [
      { icon: FileSearch, label: 'Technical SEO Audit & Fix' },
      { icon: BarChart3, label: 'Keyword Research & Mapping' },
      { icon: Link2, label: 'Authority Link Building' },
      { icon: Layout, label: 'On-Page Optimization' },
      { icon: Gauge, label: 'Core Web Vitals Optimization' },
      { icon: Activity, label: 'SEO Analytics & Reporting' },
    ],
    results: ['300% average traffic increase', 'Page 1 rankings in 90 days', 'Measurable ROI tracking'],
  },
  {
    id: 'geo',
    icon: Globe,
    color: 'from-blue-600 to-cyan-700',
    borderColor: 'border-blue-500/20',
    glowColor: 'rgba(37,99,235,0.3)',
    title: 'GEO / AI Search Optimization',
    subtitle: 'Own the AI-Powered Search Landscape.',
    longDesc:
      'Generative Engine Optimization (GEO) is the next frontier of search. We position your brand to be cited, featured, and recommended by AI systems like ChatGPT, Perplexity, Google AI Overview, and Gemini — where millions of users are now getting their answers.',
    features: [
      { icon: Bot, label: 'AI Citation Strategy' },
      { icon: FileSearch, label: 'Structured Data & Schema' },
      { icon: Globe, label: 'E-E-A-T Authority Building' },
      { icon: Map, label: 'Local GEO Targeting' },
      { icon: Store, label: 'Google Business Optimization' },
      { icon: Activity, label: 'AI Search Monitoring' },
    ],
    results: ['Featured in AI search results', 'Authority E-E-A-T signals', 'Local pack dominance'],
  },
  {
    id: 'web',
    icon: Code2,
    color: 'from-cyan-600 to-blue-700',
    borderColor: 'border-cyan-500/20',
    glowColor: 'rgba(6,182,212,0.3)',
    title: 'Web Development',
    subtitle: 'Websites That Perform Like Products.',
    longDesc:
      'We build high-performance websites and web applications using modern tech stacks — Next.js, React, TypeScript, and more. Every project is engineered for speed, accessibility, and conversion from day one.',
    features: [
      { icon: Layout, label: 'Custom Website Design' },
      { icon: ShoppingCart, label: 'E-Commerce Platforms' },
      { icon: Cpu, label: 'Web App Development' },
      { icon: Database, label: 'CMS Integration' },
      { icon: Gauge, label: 'Performance Optimization' },
      { icon: Lock, label: 'Security Hardening' },
    ],
    results: ['Sub-2s load times', '99.9% uptime SLA', 'Mobile-first responsive'],
  },
  {
    id: 'app',
    icon: Smartphone,
    color: 'from-emerald-600 to-teal-700',
    borderColor: 'border-emerald-500/20',
    glowColor: 'rgba(16,185,129,0.3)',
    title: 'App Development',
    subtitle: 'Apps That Users Love. Businesses Rely On.',
    longDesc:
      'From concept to App Store launch, we build native iOS & Android and cross-platform mobile applications with Flutter and React Native. Intuitive UX, robust architecture, and seamless backend integration.',
    features: [
      { icon: Smartphone, label: 'Flutter Cross-Platform' },
      { icon: Layers, label: 'React Native Apps' },
      { icon: Server, label: 'Backend API Development' },
      { icon: Database, label: 'Real-time Database' },
      { icon: Lock, label: 'App Store Submission' },
      { icon: Activity, label: 'Performance Monitoring' },
    ],
    results: ['4.8+ App Store ratings', '50ms response APIs', 'Offline-first architecture'],
  },
  {
    id: 'marketing',
    icon: TrendingUp,
    color: 'from-orange-600 to-red-700',
    borderColor: 'border-orange-500/20',
    glowColor: 'rgba(234,88,12,0.3)',
    title: 'Digital Marketing',
    subtitle: 'Marketing That Converts, Not Just Impresses.',
    longDesc:
      'Full-funnel digital marketing backed by data, not gut feeling. We run targeted PPC campaigns, build engaged social followings, and create email sequences that nurture leads into paying customers.',
    features: [
      { icon: MousePointerClick, label: 'Google & Meta PPC Ads' },
      { icon: Share2, label: 'Social Media Management' },
      { icon: Mail, label: 'Email Marketing & Automation' },
      { icon: BarChart3, label: 'Conversion Rate Optimization' },
      { icon: Activity, label: 'Marketing Analytics' },
      { icon: GitBranch, label: 'A/B Testing & Optimization' },
    ],
    results: ['Average 4.5x ROAS', '60% higher conversion rates', 'Full attribution reporting'],
  },
  {
    id: 'cloud',
    icon: Cloud,
    color: 'from-violet-600 to-indigo-700',
    borderColor: 'border-violet-500/20',
    glowColor: 'rgba(139,92,246,0.3)',
    title: 'Cloud Solutions',
    subtitle: 'Infrastructure Built to Scale Infinitely.',
    longDesc:
      'Architect, deploy, and manage cloud infrastructure on AWS, Azure, or GCP with DevOps best practices. We handle everything from containerization to CI/CD pipelines, monitoring, and cost optimization.',
    features: [
      { icon: Server, label: 'AWS / Azure / GCP Setup' },
      { icon: Terminal, label: 'DevOps & CI/CD Pipelines' },
      { icon: Lock, label: 'Cloud Security & Compliance' },
      { icon: Database, label: 'Database Management' },
      { icon: Activity, label: 'Monitoring & Alerting' },
      { icon: Gauge, label: 'Cost Optimization' },
    ],
    results: ['99.99% uptime', '40% average cost reduction', 'Auto-scaling architecture'],
  },
  {
    id: 'ai-agents',
    icon: Bot,
    color: 'from-fuchsia-600 to-purple-800',
    borderColor: 'border-fuchsia-500/20',
    glowColor: 'rgba(192,38,211,0.3)',
    title: 'AI Agents',
    subtitle: 'Autonomous Software That Gets Work Done.',
    longDesc:
      'We design and build custom AI agents that plan, reason, and take action across your tools — automating multi-step workflows instead of just answering questions. Every agent is scoped to your business logic, connected to your existing systems, and built with human-in-the-loop checkpoints where it matters.',
    features: [
      { icon: Workflow, label: 'Custom Workflow Automation' },
      { icon: Puzzle, label: 'Tool & API Integrations' },
      { icon: ShieldCheck, label: 'Human-in-the-Loop Controls' },
      { icon: Database, label: 'Connects to Your Existing Data' },
      { icon: Activity, label: 'Usage Monitoring & Logging' },
      { icon: Cpu, label: 'Built on Leading LLM Providers' },
    ],
    results: ['Tailored to your exact workflow', 'Safe-by-design approval checkpoints', 'Works alongside your existing team'],
  },
  {
    id: 'ai-chatbots',
    icon: MessageSquare,
    color: 'from-pink-600 to-rose-700',
    borderColor: 'border-pink-500/20',
    glowColor: 'rgba(219,39,119,0.3)',
    title: 'AI Chatbots',
    subtitle: 'Conversational AI, Trained On Your Business.',
    longDesc:
      'We build custom AI chatbots — for your website, WhatsApp, or internal tools — trained on your own content so they answer accurately, capture leads, and hand off to a human exactly when needed. Not a generic script: a chatbot that actually knows your business.',
    features: [
      { icon: MessageSquare, label: 'Custom Conversational Flows' },
      { icon: FileSearch, label: 'Trained on Your Content' },
      { icon: Share2, label: 'Web, WhatsApp & Slack Deployment' },
      { icon: Mail, label: 'Lead Capture & Handoff' },
      { icon: Lock, label: 'Data Privacy Safeguards' },
      { icon: Activity, label: 'Conversation Analytics' },
    ],
    results: ['Answers grounded in your real content', 'Escalates to your team when needed', 'Deployed wherever your customers are'],
  },
  {
    id: 'trading-bots',
    icon: LineChart,
    color: 'from-yellow-600 to-amber-700',
    borderColor: 'border-yellow-500/20',
    glowColor: 'rgba(234,179,8,0.3)',
    title: 'Trading Bots',
    subtitle: 'Algorithmic Trading, Built To Your Strategy.',
    longDesc:
      'We build custom trading bots that execute your strategy programmatically — from signal generation to order execution — across the exchanges and brokers you use. Every bot is built to your rules, backtested against historical data, and handed over with full source code ownership.',
    features: [
      { icon: LineChart, label: 'Custom Strategy Implementation' },
      { icon: Activity, label: 'Historical Backtesting' },
      { icon: Server, label: 'Exchange & Broker API Integration' },
      { icon: Gauge, label: 'Risk & Position Management Rules' },
      { icon: Lock, label: 'Secure Key & Credential Handling' },
      { icon: Terminal, label: 'Full Source Code Ownership' },
    ],
    results: ['Built to your exact strategy and risk rules', 'Backtested against historical market data'],
    disclaimer: 'This is custom software development, not financial or investment advice. Trading involves substantial risk — backtested or simulated performance does not guarantee future results.',
  },
]

const process = [
  { step: '01', title: 'Discovery Call', desc: 'We learn your goals, constraints, and success metrics. No templates — pure listening.' },
  { step: '02', title: 'Strategy & Proposal', desc: 'Custom strategy document with timeline, deliverables, and transparent pricing.' },
  { step: '03', title: 'Design & Build', desc: 'Iterative development with weekly check-ins and live preview environments.' },
  { step: '04', title: 'Launch & Grow', desc: 'Launch with confidence. Then ongoing optimization to keep scaling your results.' },
]

export default function ServicesPage() {
  const articleTitles: Record<string, string> = Object.fromEntries(getAllArticles().map(a => [a.slug, a.title]))

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesPageSchema) }} />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative pt-40 pb-24 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="orb orb-purple absolute top-20 -left-32 w-[600px] h-[600px] opacity-20 animate-float" />
        <div className="orb orb-blue absolute bottom-0 -right-32 w-[400px] h-[400px] opacity-20" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <div className="section-tag mx-auto inline-flex">
              <Sparkles size={12} />
              What We Offer
            </div>
            <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl text-white mt-4 mb-6 leading-tight">
              Services That{' '}
              <span className="gradient-text-animate">Drive Results</span>
            </h1>
            <p className="text-slate-400 text-xl max-w-3xl mx-auto leading-relaxed">
              Every service we offer is built around one question: <em className="text-slate-300">&ldquo;What outcome does this create for the client?&rdquo;</em>
              {' '}If it doesn&apos;t move your metrics, we don&apos;t offer it.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── SERVICE CARDS ─────────────────────────────────────────────────── */}
      <section className="py-16 relative">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          {serviceCategories.map((svc, i) => {
            const Icon = svc.icon
            const isEven = i % 2 === 0
            return (
              <div
                key={svc.id}
                id={svc.id}
                className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-center"
              >
                <ScrollReveal direction={isEven ? 'left' : 'right'} className={!isEven ? 'lg:order-2' : ''}>
                  <div className="section-tag">
                    <Icon size={12} />
                    {svc.title}
                  </div>
                  <h2 className="font-display font-black text-3xl sm:text-4xl text-white mt-4 mb-3 leading-tight">
                    {svc.subtitle}
                  </h2>
                  <p className="text-slate-400 leading-relaxed mb-8">{svc.longDesc}</p>

                  <div className="space-y-2 mb-8">
                    {svc.results.map((r) => (
                      <div key={r} className="flex items-center gap-3">
                        <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                        <span className="text-slate-300 text-sm">{r}</span>
                      </div>
                    ))}
                    {'disclaimer' in svc && svc.disclaimer && (
                      <div className="flex items-start gap-3 pt-1">
                        <AlertTriangle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-400 text-xs leading-relaxed italic">{svc.disclaimer}</span>
                      </div>
                    )}
                  </div>

                  <Link href="/contact" className="btn-primary inline-flex text-sm">
                    <span className="hidden sm:inline">Get Started with {svc.title}</span>
                    <span className="sm:hidden">Get Started</span>
                    <ChevronRight size={16} />
                  </Link>

                  {RELATED_ARTICLES[svc.id] && (
                    <div className="mt-6 pt-6 border-t border-white/5">
                      <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-3">Related Reading</p>
                      <div className="flex flex-col gap-2">
                        {RELATED_ARTICLES[svc.id].map(slug => {
                          const title = articleTitles[slug]
                          if (!title) return null
                          return (
                            <Link
                              key={slug}
                              href={`/blog/${slug}`}
                              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-primary-light transition-colors"
                            >
                              <BookOpen size={13} className="flex-shrink-0" />
                              <span>{title}</span>
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </ScrollReveal>

                <ScrollReveal direction={isEven ? 'right' : 'left'} delay={0.1} className={!isEven ? 'lg:order-1' : ''}>
                  <div
                    className={`glass-card p-6 sm:p-8 border ${svc.borderColor}`}
                    style={{ boxShadow: `0 20px 60px ${svc.glowColor}` }}
                  >
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${svc.color} flex items-center justify-center mb-8`}>
                      <Icon size={30} className="text-white" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {svc.features.map(({ icon: FIcon, label }) => (
                        <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 hover:bg-white/6 transition-colors duration-200">
                          <div className="w-7 h-7 rounded-lg bg-white/8 flex items-center justify-center flex-shrink-0">
                            <FIcon size={14} className="text-slate-300" />
                          </div>
                          <span className="text-slate-300 text-xs font-medium">{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── PROCESS ───────────────────────────────────────────────────────── */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-dark-2/50" />
        <div className="orb orb-blue absolute top-1/2 right-0 w-96 h-96 opacity-15" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-16">
            <div className="section-tag mx-auto inline-flex">
              <Layers size={12} />
              How We Work
            </div>
            <h2 className="font-display font-black text-4xl sm:text-5xl text-white mt-4">
              Our Proven <span className="gradient-text">Process</span>
            </h2>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((p, i) => (
              <ScrollReveal key={p.step} delay={i * 0.1}>
                <div className="glass-card glass-card-hover p-8 relative">
                  <div className="text-6xl font-display font-black text-white/5 absolute top-4 right-6 select-none">
                    {p.step}
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6 font-display font-bold text-white text-sm">
                    {p.step}
                  </div>
                  <h3 className="font-display font-bold text-white text-lg mb-3">{p.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{p.desc}</p>
                  {i < process.length - 1 && (
                    <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                      <ArrowRight size={16} className="text-primary/50" />
                    </div>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-dark-2/50" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-12">
            <div className="section-tag mx-auto inline-flex">
              <ChevronRight size={12} />
              Got Questions?
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white mt-4">
              Services <span className="gradient-text">FAQ</span>
            </h2>
          </ScrollReveal>
          <div className="space-y-3">
            {serviceFaqs.map((faq, i) => (
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
              Not Sure Which Service{' '}
              <span className="gradient-text">You Need?</span>
            </h2>
            <p className="text-slate-400 text-lg mb-10">
              Book a free 30-minute strategy call. We&apos;ll analyze your current digital presence
              and recommend exactly what will move the needle for your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-primary px-8 py-4 text-base">
                <span>Book Free Strategy Call</span>
                <ArrowRight size={16} />
              </Link>
              <a href="tel:+923032818320" className="btn-secondary px-8 py-4 text-base">
                Call Now: 0303 2818320
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
