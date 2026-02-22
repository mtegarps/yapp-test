'use client'

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion'
import React, { useRef } from 'react'

interface MarqueeProps {
  children: React.ReactNode
  direction?: 'left' | 'right'
  className?: string
  baseVelocity?: number
  gap?: string
}

/**
 * Marquee component yang scroll infinite.
 * Velocity-nya responsif sama kecepatan scroll page,
 * jadi makin cepet user scroll, makin cepet juga marquee-nya.
 */
export default function Marquee({
  children,
  direction = 'left',
  className = '',
  baseVelocity = 1,
}: MarqueeProps) {
  const baseX = useMotionValue(0)
  const copyRef = useRef<HTMLDivElement>(null)

  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  })
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  })

  useAnimationFrame((_t, delta) => {
    const copyWidth = copyRef.current?.offsetWidth ?? 0
    if (copyWidth === 0) return

    let moveBy = baseVelocity
    const vel = velocityFactor.get()
    if (vel !== 0) moveBy += Math.abs(vel)

    const moveDirection = direction === 'left' ? -1 : 1
    const move = moveBy * (delta / 1000) * moveDirection * (copyWidth / 100)

    let newX = baseX.get() + move
    if (newX <= -copyWidth) newX += copyWidth
    else if (newX >= 0) newX -= copyWidth

    baseX.set(newX)
  })

  return (
    <div className={`overflow-hidden flex w-full ${className}`}>
      <motion.div className="flex flex-shrink-0" style={{ x: baseX }}>
        <div
          ref={copyRef}
          className="flex flex-shrink-0 items-center gap-[var(--gap,1rem)] pr-[var(--gap,1rem)]"
        >
          {children}
        </div>
        <div className="flex flex-shrink-0 items-center gap-[var(--gap,1rem)] pr-[var(--gap,1rem)]">
          {children}
        </div>
      </motion.div>
    </div>
  )
}
