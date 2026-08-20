'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string
}

const COLORS = ['rgba(124,58,237,', 'rgba(37,99,235,', 'rgba(6,182,212,']
const MOUSE_RADIUS_SQ = 120 * 120
const LINE_RADIUS_SQ = 100 * 100

const MAX_PARTICLES = 140

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const rafRef = useRef<number>(0)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const pausedRef = useRef(false)

  useEffect(() => {
    // Respect the user's OS-level motion preference — skip the animation
    // (and its per-frame CPU/battery cost) entirely rather than overriding it.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let resizeTimer: ReturnType<typeof setTimeout>

    const init = () => {
      const count = Math.min(Math.floor((canvas.width * canvas.height) / 18000), MAX_PARTICLES)
      particlesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }))
    }

    // Debounced resize — avoids reallocating particles on every pixel of drag
    const resize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        init()
      }, 150)
    }

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    init()

    const draw = () => {
      if (pausedRef.current) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const particles = particlesRef.current

      particles.forEach((p) => {
        const dx = mouseRef.current.x - p.x
        const dy = mouseRef.current.y - p.y
        // Avoid sqrt — compare squared distances
        const distSq = dx * dx + dy * dy
        if (distSq < MOUSE_RADIUS_SQ) {
          const dist = Math.sqrt(distSq)
          p.vx -= (dx / dist) * 0.08
          p.vy -= (dy / dist) * 0.08
        }

        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.99
        p.vy *= 0.99

        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `${p.color}${p.opacity})`
        ctx.fill()
      })

      // O(n²) connection lines — skip sqrt, gate on squared distance first
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]
          const dx = p.x - q.x
          const dy = p.y - q.y
          const distSq = dx * dx + dy * dy
          if (distSq < LINE_RADIUS_SQ) {
            const dist = Math.sqrt(distSq)
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.strokeStyle = `rgba(124,58,237,${0.12 * (1 - dist / 100)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    const onVisibilityChange = () => {
      if (document.hidden) {
        pausedRef.current = true
        cancelAnimationFrame(rafRef.current)
      } else {
        pausedRef.current = false
        rafRef.current = requestAnimationFrame(draw)
      }
    }

    draw()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouse)
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      cancelAnimationFrame(rafRef.current)
      clearTimeout(resizeTimer)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouse)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.7 }}
    />
  )
}
