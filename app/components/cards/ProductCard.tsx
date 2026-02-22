'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Product } from '@/app/types'

interface ProductCardProps {
  product: Product
  allProducts: Product[]
}

/**
 * Card produk dengan:
 * - 3D tilt effect berdasarkan posisi mouse
 * - Glow border pas hover (orange)
 * - Corner brackets yang expand
 * - Slot machine spin animation
 */
export default function ProductCard({ product, allProducts }: ProductCardProps) {
  const [displayItem, setDisplayItem] = useState(product)
  const [rollingItems, setRollingItems] = useState<Product[]>([])
  const [isSpinning, setIsSpinning] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)
  const isAnimatingRef = useRef(false)

  // 3D tilt calculation berdasarkan posisi mouse di card
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: y * -12, y: x * 12 }) // Invert biar natural
  }, [])

  const handleMouseLeave = () => {
    setIsHovered(false)
    setTilt({ x: 0, y: 0 })
  }

  const startRolling = () => {
    setIsHovered(true)
    if (isAnimatingRef.current || isSpinning) return
    isAnimatingRef.current = true

    const finalItem = allProducts[Math.floor(Math.random() * allProducts.length)]
    const generated = Array.from({ length: 19 }).map(
      () => allProducts[Math.floor(Math.random() * allProducts.length)]
    )
    generated.push(finalItem)

    setRollingItems(generated)
    setDisplayItem(finalItem)
    setIsSpinning(true)

    const el = scrollRef.current
    if (!el) { isAnimatingRef.current = false; return }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const totalHeight = el.scrollHeight - el.clientHeight
        const duration = 1500
        const start = performance.now()

        const animate = (now: number) => {
          if (!isAnimatingRef.current) {
            if (animationRef.current) cancelAnimationFrame(animationRef.current)
            return
          }
          const elapsed = now - start
          const progress = Math.min(elapsed / duration, 1)
          const easeOutCubic = 1 - Math.pow(1 - progress, 3)
          if (el) el.scrollTop = easeOutCubic * totalHeight

          if (progress < 1) {
            animationRef.current = requestAnimationFrame(animate)
          } else {
            setIsSpinning(false)
            setRollingItems([])
            if (el) el.scrollTop = 0
            isAnimatingRef.current = false
            animationRef.current = null
          }
        }
        animationRef.current = requestAnimationFrame(animate)
      })
    })
  }

  return (
    <motion.div
      ref={containerRef}
      onMouseEnter={startRolling}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: tilt.x,
        rotateY: tilt.y,
      }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className="w-full bg-bg-surface border border-border relative"
      style={{
        height: '225px',
        overflow: 'hidden',
        transformStyle: 'preserve-3d',
        perspective: '800px',
        boxShadow: isHovered
          ? '0 0 20px rgba(255, 115, 0, 0.15), inset 0 0 20px rgba(255, 115, 0, 0.05)'
          : 'none',
        borderColor: isHovered ? 'rgba(255, 115, 0, 0.4)' : undefined,
        transition: 'box-shadow 0.3s, border-color 0.3s',
      }}
    >
      {/* Shine reflection effect */}
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none z-20 opacity-20"
          style={{
            background: `radial-gradient(circle at ${(tilt.y / 12 + 0.5) * 100}% ${(tilt.x / -12 + 0.5) * 100}%, rgba(255,115,0,0.3) 0%, transparent 60%)`,
          }}
        />
      )}

      <div
        ref={scrollRef}
        style={{
          overflow: 'hidden',
          height: '225px',
          width: '100%',
          scrollBehavior: 'auto',
          position: 'relative',
        }}
      >
        {isSpinning ? (
          <div>
            {rollingItems.map((item, i) => (
              <div key={i} style={{ height: '225px', width: '100%' }}>
                <ProductContent item={item} isHovered={false} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ height: '225px', width: '100%' }}>
            <ProductContent item={displayItem} isHovered={isHovered} />
          </div>
        )}
      </div>
    </motion.div>
  )
}

function ProductContent({ item, isHovered }: { item: Product; isHovered: boolean }) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      {/* Corner brackets — expand pas hover */}
      <CornerBrackets expanded={isHovered} position="top" />

      <Image src={item.imageSrc} alt={item.name} width={80} height={80} className="rounded-sm mt-4" />
      <p className="text-center text-[16px] font-bold uppercase mt-2.5">{item.name}</p>
      <p className="text-primary-dark text-center text-xs uppercase line-through tracking-tight">
        {item.price}
      </p>

      <div className="flex gap-2 mb-1">
        <Image src="./icons/ic_solar_ticket.svg" alt="Ticket Icon" width={16} height={16} />
        <p className="text-primary text-[16px] font-semibold">{item.ticket}</p>
      </div>

      <CornerBrackets expanded={isHovered} position="bottom" />
    </div>
  )
}

// Corner brackets yang expand/contract pas hover
function CornerBrackets({ expanded, position }: { expanded: boolean; position: 'top' | 'bottom' }) {
  const size = expanded ? 'w-2.5 h-2.5' : 'w-1.5 h-1.5'
  const borderDir = position === 'top' ? 'border-t' : 'border-b'

  return (
    <div className={`absolute ${position === 'top' ? 'top-2' : 'bottom-2'} left-0 right-0 w-full flex justify-between px-2 pointer-events-none`}>
      <div className={`${size} border-l ${borderDir} border-primary transition-all duration-300`} />
      <div className={`${size} border-r ${borderDir} border-primary transition-all duration-300`} />
    </div>
  )
}
