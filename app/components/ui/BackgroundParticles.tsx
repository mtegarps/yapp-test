'use client'

import { useEffect, useRef, useCallback } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  flickerSpeed: number
  flickerOffset: number
}

/**
 * Subtle floating particles di seluruh page.
 * Pake canvas 2D biar ringan (bukan Three.js — overkill buat ini).
 * Particles drift pelan ke atas, flicker opacity,
 * dan ada sedikit parallax efek dari scroll.
 */
export default function BackgroundParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const scrollRef = useRef(0)
  const particlesRef = useRef<Particle[]>([])

  const init = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()

    // Spawn particles
    const count = Math.min(80, Math.floor(window.innerWidth / 20))
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.15,
      vy: -(Math.random() * 0.3 + 0.1),
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.3 + 0.05,
      flickerSpeed: Math.random() * 0.02 + 0.005,
      flickerOffset: Math.random() * Math.PI * 2,
    }))

    const onScroll = () => { scrollRef.current = window.scrollY }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', resize)

    let time = 0
    const animate = () => {
      animRef.current = requestAnimationFrame(animate)
      time += 1
      const { width, height } = canvas
      ctx.clearRect(0, 0, width, height)

      const scrollOffset = scrollRef.current * 0.05

      for (const p of particlesRef.current) {
        p.x += p.vx
        p.y += p.vy

        // Wrap around
        if (p.y < -10) { p.y = height + 10; p.x = Math.random() * width }
        if (p.x < -10) p.x = width + 10
        if (p.x > width + 10) p.x = -10

        // Parallax dari scroll
        const drawY = p.y + scrollOffset * (p.size / 2)

        // Flicker opacity
        const flicker = Math.sin(time * p.flickerSpeed + p.flickerOffset) * 0.5 + 0.5
        const alpha = p.opacity * (0.3 + flicker * 0.7)

        // Orange tint particles
        ctx.beginPath()
        ctx.arc(p.x, drawY % (height + 20), p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 115, 0, ${alpha})`
        ctx.fill()

        // Occasional white particle
        if (p.flickerOffset > 5) {
          ctx.fillStyle = `rgba(255, 242, 211, ${alpha * 0.5})`
          ctx.fill()
        }
      }
    }

    animate()

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', resize)
    }
  }, [])

  useEffect(() => {
    const cleanup = init()
    return () => cleanup?.()
  }, [init])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[1] pointer-events-none motion-reduce:hidden"
      style={{ opacity: 0.6 }}
    />
  )
}
