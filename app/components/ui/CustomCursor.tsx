'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'

/**
 * Custom cursor futuristik.
 * - Inner dot: ngikut mouse langsung
 * - Outer ring: ngikut dengan spring delay (ekor)
 * - Membesar + glow pas hover elemen clickable
 * - Trail particles yang fade out
 * - Hidden di mobile/touch devices
 */
export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const trailRef = useRef<{ x: number; y: number; id: number }[]>([])
  const trailIdRef = useRef(0)
  const [trails, setTrails] = useState<{ x: number; y: number; id: number }[]>([])

  // Raw mouse position
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Smooth spring buat outer ring — delay bikin efek trailing
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 }
  const ringX = useSpring(mouseX, springConfig)
  const ringY = useSpring(mouseY, springConfig)

  // Even smoother trail ring
  const trailSpring = { damping: 35, stiffness: 120, mass: 0.8 }
  const trailX = useSpring(mouseX, trailSpring)
  const trailY = useSpring(mouseY, trailSpring)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseX.set(e.clientX)
    mouseY.set(e.clientY)
    setIsVisible(true)

    // Spawn trail particle setiap ~60px movement
    const newTrail = { x: e.clientX, y: e.clientY, id: trailIdRef.current++ }
    trailRef.current = [...trailRef.current.slice(-6), newTrail]
    setTrails([...trailRef.current])
  }, [mouseX, mouseY])

  useEffect(() => {
    // Detect touch device — skip cursor
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    setIsTouchDevice(isTouch)
    if (isTouch) return

    const handleEnter = () => setIsVisible(true)
    const handleLeave = () => setIsVisible(false)
    const handleDown = () => setIsClicking(true)
    const handleUp = () => setIsClicking(false)

    // Track hover state buat clickable elements
    const handleOverTarget = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isClickable = target.closest('a, button, [role="button"], input, select, textarea, [data-cursor-hover]')
      setIsHovering(!!isClickable)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseover', handleOverTarget)
    document.addEventListener('mouseenter', handleEnter)
    document.addEventListener('mouseleave', handleLeave)
    document.addEventListener('mousedown', handleDown)
    document.addEventListener('mouseup', handleUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseover', handleOverTarget)
      document.removeEventListener('mouseenter', handleEnter)
      document.removeEventListener('mouseleave', handleLeave)
      document.removeEventListener('mousedown', handleDown)
      document.removeEventListener('mouseup', handleUp)
    }
  }, [handleMouseMove])

  // Cleanup trails setiap 500ms
  useEffect(() => {
    const cleanup = setInterval(() => {
      trailRef.current = trailRef.current.slice(-3)
      setTrails([...trailRef.current])
    }, 500)
    return () => clearInterval(cleanup)
  }, [])

  if (isTouchDevice) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[9998] mix-blend-difference motion-reduce:hidden">
      {/* Trail particles — fade out */}
      <AnimatePresence>
        {trails.map(trail => (
          <motion.div
            key={trail.id}
            initial={{ opacity: 0.4, scale: 1 }}
            animate={{ opacity: 0, scale: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute w-1 h-1 rounded-full bg-primary/40"
            style={{ left: trail.x - 2, top: trail.y - 2 }}
          />
        ))}
      </AnimatePresence>

      {/* Outer trail ring — slowest, biggest */}
      <motion.div
        className="absolute rounded-full border border-primary/10"
        style={{
          x: trailX,
          y: trailY,
          width: isHovering ? 70 : 50,
          height: isHovering ? 70 : 50,
          translateX: isHovering ? -35 : -25,
          translateY: isHovering ? -35 : -25,
        }}
        animate={{
          opacity: isVisible ? 0.3 : 0,
          scale: isClicking ? 0.8 : 1,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Outer ring — delayed spring follow */}
      <motion.div
        className="absolute rounded-full"
        style={{
          x: ringX,
          y: ringY,
          translateX: isHovering ? -24 : -18,
          translateY: isHovering ? -24 : -18,
        }}
        animate={{
          width: isHovering ? 48 : 36,
          height: isHovering ? 48 : 36,
          opacity: isVisible ? 1 : 0,
          borderWidth: isHovering ? 2 : 1,
          scale: isClicking ? 0.8 : 1,
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      >
        <div
          className="w-full h-full rounded-full transition-colors duration-200"
          style={{
            border: `${isHovering ? 2 : 1}px solid ${isHovering ? '#FF7300' : 'rgba(255, 255, 255, 0.5)'}`,
            boxShadow: isHovering ? '0 0 20px rgba(255, 115, 0, 0.3), inset 0 0 20px rgba(255, 115, 0, 0.1)' : 'none',
          }}
        />
      </motion.div>

      {/* Inner dot — direct follow */}
      <motion.div
        className="absolute rounded-full"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: -4,
          translateY: -4,
        }}
        animate={{
          width: isHovering ? 8 : 8,
          height: isHovering ? 8 : 8,
          opacity: isVisible ? 1 : 0,
          scale: isClicking ? 0.5 : 1,
          backgroundColor: isHovering ? '#FF7300' : '#ffffff',
          boxShadow: isHovering ? '0 0 12px rgba(255, 115, 0, 0.6)' : '0 0 4px rgba(255, 255, 255, 0.3)',
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 500 }}
      />
    </div>
  )
}
