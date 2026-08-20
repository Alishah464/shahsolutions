import Link from 'next/link'
import { Code2, Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react'

const services = [
  { label: 'SEO Optimization', href: '/services#seo' },
  { label: 'GEO / AI Search', href: '/services#geo' },
  { label: 'Web Development', href: '/services#web' },
  { label: 'App Development', href: '/services#app' },
  { label: 'Digital Marketing', href: '/services#marketing' },
  { label: 'Cloud Solutions', href: '/services#cloud' },
]

const pages = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
  { label: 'Book Consultation', href: '/book' },
]

export default function Footer() {
  return (
    <footer className="relative bg-dark-2 border-t border-white/5">
      <div className="gradient-line" />

      <div className="absolute bottom-0 left-1/4 w-96 h-96 orb orb-purple opacity-20 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 orb orb-blue opacity-15 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow-primary group-hover:scale-110 transition-transform">
                <Code2 size={20} className="text-white" />
              </div>
              <span className="font-display font-bold text-xl gradient-text-animate">Shah Solutions</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Engineering tomorrow&apos;s digital world. Premium IT services crafted with precision
              for businesses that demand excellence.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-display font-semibold text-white mb-6 text-sm uppercase tracking-widest">
              Services
            </h3>
            <ul className="space-y-3">
              {services.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-slate-400 hover:text-white text-sm transition-colors duration-200 flex items-center gap-1 group"
                  >
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 -ml-1 transition-all duration-200 text-primary" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-white mb-6 text-sm uppercase tracking-widest">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {pages.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-slate-400 hover:text-white text-sm transition-colors duration-200 flex items-center gap-1 group"
                  >
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 -ml-1 transition-all duration-200 text-primary" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold text-white mb-6 text-sm uppercase tracking-widest">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li>
                <a href="mailto:amaherwani@gmail.com" className="flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Mail size={14} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Email</p>
                    <p className="text-slate-300 text-sm group-hover:text-white transition-colors">amaherwani@gmail.com</p>
                  </div>
                </a>
              </li>
              <li>
                <a href="tel:+923032818320" className="flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-lg bg-secondary/10 border border-secondary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/20 transition-colors">
                    <Phone size={14} className="text-secondary" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Phone</p>
                    <p className="text-slate-300 text-sm group-hover:text-white transition-colors">0303 2818320</p>
                  </div>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
                  <MapPin size={14} className="text-accent" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Location</p>
                  <p className="text-slate-300 text-sm">Pakistan — Serving Worldwide</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-divider mb-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Shah Solutions. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-slate-500 text-sm">Privacy Policy</span>
            <span className="text-slate-500 text-sm">Terms of Service</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-400 text-xs">All Systems Operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
