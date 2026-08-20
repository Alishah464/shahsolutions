'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile'
import {
  Mail, Phone, Clock, Send, CheckCircle2, AlertCircle,
  Sparkles, MessageSquare, User, Briefcase, Globe,
} from 'lucide-react'
import ScrollReveal from '@/components/ScrollReveal'

interface FormData {
  name: string
  email: string
  phone: string
  service: string
  budget: string
  message: string
}

const services = [
  'SEO Optimization',
  'GEO / AI Search',
  'Web Development',
  'App Development',
  'Digital Marketing',
  'Cloud Solutions',
  'Multiple Services',
]

const budgets = [
  'Under $500',
  '$500 – $2,000',
  '$2,000 – $5,000',
  '$5,000 – $15,000',
  '$15,000+',
  'Let\'s Discuss',
]

const contactInfo = [
  {
    icon: Mail,
    label: 'Email Us',
    value: 'amaherwani@gmail.com',
    link: 'mailto:amaherwani@gmail.com',
    gradient: 'from-primary to-secondary',
    desc: 'We respond within 2 hours',
  },
  {
    icon: Phone,
    label: 'Call Us',
    value: '0303 2818320',
    link: 'tel:+923032818320',
    gradient: 'from-secondary to-accent',
    desc: 'Mon – Fri, 9 AM – 8 PM PKT',
  },
  {
    icon: Clock,
    label: 'Business Hours',
    value: '9:00 AM – 8:00 PM',
    link: null,
    gradient: 'from-accent to-emerald-500',
    desc: 'Pakistan Standard Time (UTC+5)',
  },
  {
    icon: Globe,
    label: 'Global Delivery',
    value: 'Serving Worldwide',
    link: null,
    gradient: 'from-orange-500 to-primary',
    desc: 'Clients in 12+ countries',
  },
]

export const faqs = [
  {
    q: 'How long does a website project take?',
    a: 'A standard business website takes 2–4 weeks. Complex e-commerce or web apps take 6–12 weeks. We always agree on timelines upfront.',
  },
  {
    q: 'Do you offer post-launch support?',
    a: 'Yes — all projects include 30 days of free post-launch support. We also offer monthly retainer plans for ongoing maintenance.',
  },
  {
    q: 'How do you measure SEO success?',
    a: 'We track organic traffic, keyword rankings, click-through rates, and revenue attribution. Monthly reports are sent every 1st of the month.',
  },
  {
    q: 'Do you work with startups and small businesses?',
    a: 'Absolutely. We work with businesses of all sizes — from early-stage startups to established enterprises. Every client gets the same quality.',
  },
]

export default function ContactClient() {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [turnstileToken, setTurnstileToken] = useState('')
  const turnstileRef = useRef<TurnstileInstance>(null)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    if (!turnstileToken) {
      setError('Please complete the CAPTCHA before submitting.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, turnstileToken }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Failed to send')
      setSubmitted(true)
      reset()
      setTurnstileToken('')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong.'
      setError(msg + ' You can also email us at amaherwani@gmail.com')
      turnstileRef.current?.reset()
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="orb orb-purple absolute top-20 -right-32 w-[500px] h-[500px] opacity-20 animate-float" />
        <div className="orb orb-blue absolute bottom-0 -left-32 w-[400px] h-[400px] opacity-20" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <div className="section-tag mx-auto inline-flex">
              <Sparkles size={12} />
              Get In Touch
            </div>
            <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl text-white mt-4 mb-6 leading-tight">
              Let&apos;s Build{' '}
              <span className="gradient-text-animate">Something Great</span>
            </h1>
            <p className="text-slate-400 text-xl max-w-2xl mx-auto">
              Tell us about your project. We&apos;ll respond within 2 hours with a custom plan.
              No templates, no generic proposals — just real solutions.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── CONTACT INFO ──────────────────────────────────────────────────── */}
      <section className="py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {contactInfo.map((info, i) => {
              const Icon = info.icon
              const content = (
                <ScrollReveal key={info.label} delay={i * 0.08}>
                  <div className="glass-card p-5 glass-card-hover flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${info.gradient} flex items-center justify-center flex-shrink-0`}>
                      <Icon size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5 uppercase tracking-wider">{info.label}</p>
                      <p className="text-white font-semibold text-sm mb-0.5">{info.value}</p>
                      <p className="text-slate-500 text-xs">{info.desc}</p>
                    </div>
                  </div>
                </ScrollReveal>
              )

              return info.link ? (
                <a key={info.label} href={info.link}>{content}</a>
              ) : (
                <div key={info.label}>{content}</div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── FORM & SIDEBAR ────────────────────────────────────────────────── */}
      <section className="py-16 pb-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Form */}
            <div className="lg:col-span-2">
              <ScrollReveal>
                <div className="glass-card p-4 sm:p-8 gradient-border">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <MessageSquare size={18} className="text-white" />
                    </div>
                    <div>
                      <h2 className="font-display font-bold text-white text-xl">Send Us a Message</h2>
                      <p className="text-slate-400 text-sm">We&apos;ll get back to you within 2 hours</p>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {submitted ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-16"
                      >
                        <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
                          <CheckCircle2 size={36} className="text-emerald-400" />
                        </div>
                        <h3 className="font-display font-bold text-2xl text-white mb-3">Message Sent!</h3>
                        <p className="text-slate-400 mb-6">
                          Thank you! We&apos;ve received your message and will respond within 2 hours at
                          the latest. Check your inbox!
                        </p>
                        <button
                          onClick={() => setSubmitted(false)}
                          className="btn-secondary text-sm px-6 py-2.5"
                        >
                          Send Another Message
                        </button>
                      </motion.div>
                    ) : (
                      <motion.form
                        key="form"
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <div className="grid sm:grid-cols-2 gap-5">
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                              <User size={13} className="inline mr-1.5" />Full Name *
                            </label>
                            <input
                              type="text"
                              placeholder="Your full name"
                              className={`form-input ${errors.name ? 'border-red-500/60' : ''}`}
                              {...register('name', { required: 'Name is required' })}
                            />
                            {errors.name && (
                              <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                              <Mail size={13} className="inline mr-1.5" />Email Address *
                            </label>
                            <input
                              type="email"
                              placeholder="your@email.com"
                              className={`form-input ${errors.email ? 'border-red-500/60' : ''}`}
                              {...register('email', {
                                required: 'Email is required',
                                pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' },
                              })}
                            />
                            {errors.email && (
                              <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
                            )}
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-5">
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                              <Phone size={13} className="inline mr-1.5" />Phone Number
                            </label>
                            <input
                              type="tel"
                              placeholder="+92 3XX XXXXXXX"
                              className="form-input"
                              {...register('phone')}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                              <Briefcase size={13} className="inline mr-1.5" />Service Needed *
                            </label>
                            <select
                              className={`form-input ${errors.service ? 'border-red-500/60' : ''}`}
                              {...register('service', { required: 'Please select a service' })}
                            >
                              <option value="" style={{ background: '#0A0A1A' }}>Select a service...</option>
                              {services.map((s) => (
                                <option key={s} value={s} style={{ background: '#0A0A1A' }}>{s}</option>
                              ))}
                            </select>
                            {errors.service && (
                              <p className="text-red-400 text-xs mt-1">{errors.service.message}</p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Approximate Budget
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {budgets.map((b) => (
                              <label
                                key={b}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 text-slate-300 text-xs cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 has-[:checked]:border-primary/60 has-[:checked]:bg-primary/10 has-[:checked]:text-white"
                              >
                                <input
                                  type="radio"
                                  value={b}
                                  className="sr-only"
                                  {...register('budget')}
                                />
                                {b}
                              </label>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            <MessageSquare size={13} className="inline mr-1.5" />Project Details *
                          </label>
                          <textarea
                            rows={5}
                            placeholder="Tell us about your project, goals, timeline, and any specific requirements..."
                            className={`form-input resize-none ${errors.message ? 'border-red-500/60' : ''}`}
                            {...register('message', {
                              required: 'Please describe your project',
                              minLength: { value: 20, message: 'Please provide more details (min 20 chars)' },
                            })}
                          />
                          {errors.message && (
                            <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>
                          )}
                        </div>

                        <div className="flex justify-center">
                          <Turnstile
                            ref={turnstileRef}
                            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '1x00000000000000000000AA'}
                            onSuccess={setTurnstileToken}
                            onExpire={() => setTurnstileToken('')}
                            onError={() => setTurnstileToken('')}
                            options={{ theme: 'dark', size: 'normal' }}
                          />
                        </div>

                        {error && (
                          <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                            <AlertCircle size={16} />
                            {error}
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={loading || !turnstileToken}
                          className="btn-primary w-full justify-center py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {loading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span>Sending...</span>
                            </>
                          ) : (
                            <>
                              <span>Send Message</span>
                              <Send size={16} />
                            </>
                          )}
                        </button>

                        <p className="text-slate-500 text-xs text-center">
                          By submitting you agree to be contacted by Shah Solutions.
                          We respect your privacy — no spam, ever.
                        </p>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>
              </ScrollReveal>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <ScrollReveal direction="right">
                <div className="glass-card p-6">
                  <h3 className="font-display font-bold text-white text-lg mb-5">What Happens Next?</h3>
                  <div className="space-y-4">
                    {[
                      { step: '1', text: 'We review your message within 2 hours' },
                      { step: '2', text: 'Schedule a free 30-min strategy call' },
                      { step: '3', text: 'Receive a custom proposal with pricing' },
                      { step: '4', text: 'Kick off your project — we move fast!' },
                    ].map((item) => (
                      <div key={item.step} className="flex gap-3 items-start">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {item.step}
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="right" delay={0.1}>
                <div className="glass-card p-6">
                  <h3 className="font-display font-bold text-white text-lg mb-4">Prefer Direct Contact?</h3>
                  <div className="space-y-3">
                    <a
                      href="mailto:amaherwani@gmail.com"
                      className="flex items-center gap-3 p-3 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors text-sm text-white group"
                    >
                      <Mail size={16} className="text-primary" />
                      <div>
                        <p className="font-medium">amaherwani@gmail.com</p>
                        <p className="text-slate-400 text-xs">Email us directly</p>
                      </div>
                    </a>
                    <a
                      href="tel:+923032818320"
                      className="flex items-center gap-3 p-3 rounded-xl bg-secondary/10 border border-secondary/20 hover:bg-secondary/20 transition-colors text-sm text-white"
                    >
                      <Phone size={16} className="text-secondary" />
                      <div>
                        <p className="font-medium">0303 2818320</p>
                        <p className="text-slate-400 text-xs">Call or WhatsApp</p>
                      </div>
                    </a>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="right" delay={0.2}>
                <div className="glass-card p-6">
                  <div className="space-y-3">
                    {[
                      '✓ Free initial consultation',
                      '✓ No-commitment proposal',
                      '✓ 100% confidential discussion',
                      '✓ Response within 2 hours',
                      '✓ No setup or hidden fees',
                    ].map((item) => (
                      <p key={item} className="text-slate-400 text-sm">{item}</p>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-dark-2/50" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-12">
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
          </ScrollReveal>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <ScrollReveal key={faq.q} delay={i * 0.08}>
                <div className="glass-card overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-white/3 transition-colors"
                  >
                    <span className="font-semibold text-white text-sm pr-4">{faq.q}</span>
                    <span className={`text-primary text-xl flex-shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 text-slate-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
