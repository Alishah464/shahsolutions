'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Code2, Menu, X, ChevronRight } from 'lucide-react'

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
      const el = document.documentElement
      const scrolled = el.scrollTop || document.body.scrollTop
      const total = el.scrollHeight - el.clientHeight
      setScrollProgress(total > 0 ? (scrolled / total) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <div className="progress-bar" style={{ width: `${scrollProgress}%` }} />

      <motion.header
        className="fixed top-0 left-0 right-0 z-50"
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
      >
        <div
          className={`transition-all duration-300 ${
            scrolled
              ? 'bg-[rgba(5,5,16,0.92)] backdrop-blur-xl border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
              : 'bg-transparent'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-3 group min-w-0 flex-shrink">
                <div className="relative w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary glow-primary group-hover:scale-110 transition-transform duration-300">
                  <Code2 size={20} className="text-white" />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary to-secondary opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-display font-bold text-lg sm:text-xl leading-none gradient-text-animate truncate">
                    Shah Solutions
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase leading-none mt-0.5">
                    IT Services
                  </span>
                </div>
              </Link>

              {/* Desktop Nav */}
              <nav className="hidden md:flex items-center gap-1">
                {links.map((link) => {
                  const isActive = pathname === link.href
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="relative px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200 group"
                    >
                      {isActive && (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute inset-0 bg-white/5 rounded-lg"
                        />
                      )}
                      <span className="relative z-10">{link.label}</span>
                      {isActive && (
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full" />
                      )}
                    </Link>
                  )
                })}
              </nav>

              {/* CTA */}
              <div className="hidden md:flex items-center gap-3">
                <Link href="/book" className="text-sm font-medium px-4 py-2.5 border border-purple-500/50 text-purple-300 hover:text-white hover:border-purple-400 rounded-lg transition-colors duration-200">
                  Book Consultation
                </Link>
                <Link href="/contact" className="btn-primary text-sm py-2.5 px-6">
                  <span>Get Started</span>
                  <ChevronRight size={16} />
                </Link>
              </div>

              {/* Mobile Toggle */}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="md:hidden flex-shrink-0 relative w-10 h-10 flex items-center justify-center rounded-xl border border-white/10 text-white hover:border-primary/50 transition-colors duration-200"
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait">
                  {mobileOpen ? (
                    <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <X size={20} />
                    </motion.span>
                  ) : (
                    <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <Menu size={20} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-[rgba(5,5,16,0.98)] backdrop-blur-2xl"
            initial={{ opacity: 0, clipPath: 'circle(0% at calc(100% - 56px) 40px)' }}
            animate={{ opacity: 1, clipPath: 'circle(150% at calc(100% - 56px) 40px)' }}
            exit={{ opacity: 0, clipPath: 'circle(0% at calc(100% - 56px) 40px)' }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="absolute inset-0 grid-bg opacity-20" />
            <nav className="flex flex-col items-center gap-6 relative z-10">
              {links.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ delay: i * 0.07 + 0.1 }}
                >
                  <Link
                    href={link.href}
                    className={`text-4xl font-display font-bold transition-all duration-200 ${
                      pathname === link.href ? 'gradient-text' : 'text-white/70 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: links.length * 0.07 + 0.15 }}
              >
                <Link href="/book" className="text-2xl font-display font-bold text-purple-400 hover:text-purple-300 transition-colors">
                  Book Consultation
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: links.length * 0.07 + 0.2 }}
                className="mt-4"
              >
                <Link href="/contact" className="btn-primary">
                  <span>Get Started</span>
                  <ChevronRight size={16} />
                </Link>
              </motion.div>
            </nav>

            <div className="absolute bottom-10 text-slate-500 text-sm">
              amaherwani@gmail.com
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
