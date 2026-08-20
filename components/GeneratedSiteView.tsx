import type { ReactNode } from 'react'
import { MessageCircle, Phone } from 'lucide-react'
import type { GeneratedSite } from '@/lib/aiBuilderSchema'

/** Pure presentational renderer for a GeneratedSite — shared between the interactive
    builder preview (components/AiBuilderClient.tsx) and the public published page
    (app/sites/[slug]/page.tsx), so both render from one JSX tree instead of two
    copies drifting apart. No builder-only chrome (regenerate/start-over/save) lives
    here — that's the caller's responsibility via surrounding UI. */
export default function GeneratedSiteView({ site, leadForm }: { site: GeneratedSite; leadForm?: ReactNode }) {
  const whatsappHref = site.contact.whatsappNumber
    ? `https://wa.me/${site.contact.whatsappNumber.replace(/\D/g, '')}`
    : null

  return (
    <div>
      {/* Hero */}
      <div className="glass-card p-10 text-center mb-6">
        <div className="section-tag mx-auto">{site.business.category} · {site.business.city}</div>
        <h2 className="font-display font-black text-3xl sm:text-4xl text-white mt-4 mb-2">{site.business.name}</h2>
        <p className="text-primary-light font-medium mb-4">{site.business.tagline}</p>
        <h3 className="font-display font-bold text-xl text-white mb-2">{site.hero.title}</h3>
        <p className="text-slate-400 max-w-xl mx-auto mb-6">{site.hero.subtitle}</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="btn-primary pointer-events-none"><span>{site.hero.ctaLabel}</span></span>
          {whatsappHref ? (
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              <MessageCircle size={16} />
              <span>WhatsApp Us</span>
            </a>
          ) : (
            <PlaceholderPill label="+ Add your WhatsApp number" />
          )}
        </div>
      </div>

      {/* About */}
      <div className="glass-card p-8 mb-6">
        <h3 className="font-display font-bold text-2xl text-white mb-3">{site.about.heading}</h3>
        <p className="text-slate-400 leading-relaxed">{site.about.body}</p>
      </div>

      {/* Services */}
      <div className="mb-6">
        <h3 className="font-display font-bold text-2xl text-white mb-4">Services</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {site.services.map((s, i) => (
            <div key={i} className="glass-card glass-card-hover p-6">
              <div className="text-3xl mb-3">{s.emoji}</div>
              <h4 className="text-white font-semibold mb-1">{s.title}</h4>
              <p className="text-slate-400 text-sm">{s.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Why Us */}
      <div className="mb-6">
        <h3 className="font-display font-bold text-2xl text-white mb-4">Why Choose Us</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {site.whyUs.map((w, i) => (
            <div key={i} className="glass-card glass-card-hover p-6">
              <h4 className="text-white font-semibold mb-1">{w.title}</h4>
              <p className="text-slate-400 text-sm">{w.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials placeholder */}
      <div className="glass-card p-6 mb-6 text-center">
        <p className="text-gold text-lg mb-1">★★★★★</p>
        <p className="text-slate-400 text-sm">Be the first to leave a review for {site.business.name}.</p>
      </div>

      {/* FAQ */}
      <div className="mb-6">
        <h3 className="font-display font-bold text-2xl text-white mb-4">FAQ</h3>
        <div className="space-y-3">
          {site.faq.map((f, i) => (
            <details key={i} className="glass-card group p-5">
              <summary className="flex items-center justify-between cursor-pointer text-white font-medium">
                {f.question}
                <span className="text-primary text-xl transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="text-slate-400 text-sm mt-3">{f.answer}</p>
            </details>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="glass-card p-6 flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 text-slate-300 text-sm">
          <Phone size={16} className="text-primary" />
          {site.contact.phone ?? <PlaceholderPill label="+ Add your phone number" />} · {site.contact.city}
        </div>
        {whatsappHref ? (
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn-secondary">
            <MessageCircle size={16} />
            <span>Chat on WhatsApp</span>
          </a>
        ) : (
          <PlaceholderPill label="+ Add your WhatsApp number" />
        )}
      </div>

      {leadForm}
    </div>
  )
}

/** Marks a field the AI deliberately left blank rather than fabricate a
    realistic-looking fact — visually distinct so it never reads as real data. */
export function PlaceholderPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-dashed border-white/20 text-slate-500 text-sm italic">
      {label}
    </span>
  )
}
