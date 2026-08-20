'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    let mouseX = 0
    let mouseY = 0

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (!isVisible) setIsVisible(true)
    }

    const loop = () => {
      setPosition({ x: mouseX, y: mouseY })
      rafRef.current = requestAnimationFrame(loop)
    }

    const onEnterLink = () => setIsHovering(true)
    const onLeaveLink = () => setIsHovering(false)
    const onLeave = () => setIsVisible(false)
    const onEnter = () => setIsVisible(true)

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)
    rafRef.current = requestAnimationFrame(loop)

    const bound = new WeakSet<Element>()
    const bindHoverables = () => {
      document.querySelectorAll('a, button, [data-cursor-hover]').forEach((el) => {
        if (bound.has(el)) return
        bound.add(el)
        el.addEventListener('mouseenter', onEnterLink)
        el.addEventListener('mouseleave', onLeaveLink)
      })
    }
    bindHoverables()
    const observer = new MutationObserver(bindHoverables)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      cancelAnimationFrame(rafRef.current)
      observer.disconnect()
    }
  }, [isVisible])

  if (typeof window === 'undefined') return null

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{ x: position.x - 4, y: position.y - 4 }}
        animate={{ opacity: isVisible ? 1 : 0, scale: isHovering ? 0 : 1 }}
        transition={{ duration: 0.1 }}
      >
        <div className="w-2 h-2 bg-white rounded-full" />
      </motion.div>

      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{ x: position.x - 20, y: position.y - 20 }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isHovering ? 1.8 : 1,
          borderColor: isHovering ? 'rgba(124, 58, 237, 0.8)' : 'rgba(124, 58, 237, 0.4)',
        }}
        transition={{ type: 'spring', stiffness: 150, damping: 20 }}
      >
        <div
          className="w-10 h-10 rounded-full border transition-all duration-200"
          style={{
            borderColor: isHovering ? 'rgba(124, 58, 237, 0.8)' : 'rgba(124, 58, 237, 0.4)',
            boxShadow: isHovering ? '0 0 20px rgba(124, 58, 237, 0.6)' : 'none',
            background: isHovering ? 'rgba(124, 58, 237, 0.1)' : 'transparent',
          }}
        />
      </motion.div>
    </>
  )
}
