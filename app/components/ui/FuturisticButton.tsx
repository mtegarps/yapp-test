'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface FuturisticButtonProps {
  href?: string
  children: React.ReactNode
  className?: string
  variant?: 'primary' | 'ghost'
  onClick?: () => void
}

/**
 * Button dengan efek futuristik:
 * - Sweep color effect on hover
 * - Scanning border animation
 * - Ripple on click
 * - Subtle glow
 */
export default function FuturisticButton({
  href,
  children,
  className = '',
  variant = 'primary',
  onClick,
}: FuturisticButtonProps) {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([])
  const rippleId = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleClick = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setRipples(prev => [...prev, { x, y, id: rippleId.current++ }])
    setTimeout(() => {
      setRipples(prev => prev.slice(1))
    }, 800)

    onClick?.()
  }

  const baseClasses = variant === 'primary'
    ? 'bg-primary text-white'
    : 'bg-transparent text-primary border border-primary/40'

  const content = (
    <div
      ref={containerRef}
      onClick={handleClick}
      className={`relative overflow-hidden group cursor-pointer ${baseClasses} ${className}`}
    >
      {/* Sweep effect */}
      <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-700 ease-out" />

      {/* Scanning border */}
      <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-light to-transparent animate-scan-x" />
        <span className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-light to-transparent animate-scan-x-reverse" />
      </span>

      {/* Glow effect */}
      <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ boxShadow: 'inset 0 0 20px rgba(255, 115, 0, 0.15)' }}
      />

      {/* Ripple effects */}
      {ripples.map(ripple => (
        <motion.span
          key={ripple.id}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute rounded-full bg-white/30 pointer-events-none"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
          }}
        />
      ))}

      {/* Content */}
      <span className="relative z-10">{children}</span>
    </div>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}
