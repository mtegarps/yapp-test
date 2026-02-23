'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'

/**
 * Navbar yang:
 * - Backdrop blur intensitas berubah seiring scroll
 * - Hide on scroll down, show on scroll up
 * - Ada scroll progress bar tipis di bawahnya
 * - Logo subtle glow animation
 */
export default function NavBar() {
  const [hidden, setHidden] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const lastScrollY = useRef(0)

  const { scrollYProgress, scrollY } = useScroll()
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  // Track scroll direction buat hide/show
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const diff = latest - lastScrollY.current
    // Hide kalo scroll down > 10px, show kalo scroll up
    // if (diff > 10 && latest > 100) setHidden(true)
    if (diff < -5) setHidden(false)
    setHasScrolled(latest > 50)
    lastScrollY.current = latest
  })

  // Keyboard shortcut: Escape buat toggle navbar
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setHidden(h => !h)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <motion.nav
      initial={{ y: 0 }}
      animate={{ y: hidden ? -80 : 0 }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="fixed top-0 left-0 w-full z-50 border-b border-border"
      style={{
        backdropFilter: hasScrolled ? 'blur(12px) saturate(1.2)' : 'blur(0px)',
        WebkitBackdropFilter: hasScrolled ? 'blur(12px) saturate(1.2)' : 'blur(0px)',
      }}
    >
      {/* Background layer — opacity berubah */}
      <motion.div
        className="absolute inset-0"
        animate={{
          backgroundColor: hasScrolled ? 'rgba(23, 22, 22, 0.85)' : 'rgba(23, 22, 22, 1)',
        }}
        transition={{ duration: 0.3 }}
      />

      <div className="relative flex items-center justify-between px-6 py-3">
        {/* Logo dengan subtle glow */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative"
        >
          <Image src="/logo.png" alt="Raflux Logo" width={83} height={26} />
          {/* Glow behind logo */}
          <div
            className="absolute inset-0 blur-lg opacity-20 pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(255,115,0,0.4) 0%, transparent 70%)' }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex items-center"
        >
          <Link
            href=""
            className="relative overflow-hidden bg-primary text-white px-2 py-2.5 text-xs font-semibold group"
          >
            {/* Sweep effect on hover */}
            <span className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-out" />
            <span className="relative">GET STARTED</span>
          </Link>
        </motion.div>
      </div>

      {/* Scroll progress bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-[1px] bg-primary"
        style={{ width: progressWidth }}
      />

      {/* Subtle glow line di bawah navbar */}
      <div
        className="absolute bottom-0 left-0 w-full h-[1px] opacity-30"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, #FF7300 50%, transparent 100%)',
        }}
      />
    </motion.nav>
  )
}