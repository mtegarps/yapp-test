'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface SectionRevealProps {
  children: React.ReactNode
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right'
  delay?: number
}

/**
 * Wrapper component buat reveal animation pas section masuk viewport.
 * Support berbagai direction dan configurable delay.
 */
export default function SectionReveal({
  children,
  className = '',
  direction = 'up',
  delay = 0,
}: SectionRevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.15 })

  const directionMap = {
    up: { y: 60, x: 0 },
    down: { y: -60, x: 0 },
    left: { y: 0, x: 60 },
    right: { y: 0, x: -60 },
  }

  const offset = directionMap[direction]

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        y: offset.y,
        x: offset.x,
        filter: 'blur(4px)',
      }}
      animate={isInView ? {
        opacity: 1,
        y: 0,
        x: 0,
        filter: 'blur(0px)',
      } : {}}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
