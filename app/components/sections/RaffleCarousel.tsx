'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useAnimation, PanInfo } from 'framer-motion'
import Image from 'next/image'
import { useCountdown } from '@/app/hooks/useCountdown'
import { padNumber } from '@/app/lib/utils'
import { DUMMY_RAFFLES } from '@/app/data'
import { RaffleItem } from '@/app/types'

/**
 * Carousel yang bisa di-drag horizontal.
 * Responsive: card width dan section height scale down di mobile.
 */
export default function RaffleCarousel() {
  const containerRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const controls = useAnimation()
  const [constraints, setConstraints] = useState({ left: 0, right: 0 })

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        const sw = containerRef.current.scrollWidth
        const cw = containerRef.current.clientWidth
        setConstraints({ left: -(sw - cw), right: 0 })
      }
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const nav = (dir: 'left' | 'right') => {
    const step = window.innerWidth < 768 ? 290 : 380
    const cur = x.get()
    const target =
      dir === 'left'
        ? Math.min(cur + step, 0)
        : Math.max(cur - step, constraints.left)
    controls.start({
      x: target,
      transition: { type: 'spring', stiffness: 300, damping: 40 },
    })
  }

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const cur = x.get()
    const target = cur + info.velocity.x * 0.3
    const clamped = Math.max(constraints.left, Math.min(0, target))
    controls.start({
      x: clamped,
      transition: { type: 'spring', stiffness: 300, damping: 40 },
    })
  }

  return (
    <section className="relative bg-bg border-t border-border overflow-hidden max-w-[1440px] mx-auto h-auto md:h-[570.67px]">
      <div className="flex flex-row items-stretch md:items-center h-full">
        {/* Panel navigasi kiri — slim di mobile */}
        <div className="flex-shrink-0 w-[60px] md:w-[160px] lg:w-[200px] bg-bg-surface border-r border-border flex items-center justify-center">
          <div className="flex flex-col md:flex-row gap-2">
            <NavButton direction="left" onClick={() => nav('left')} />
            <NavButton direction="right" onClick={() => nav('right')} />
          </div>
        </div>

        {/* Carousel area */}
        <div ref={containerRef} className="flex-1 overflow-hidden">
          <motion.div
            className="flex cursor-grab active:cursor-grabbing"
            drag="x"
            style={{ x }}
            animate={controls}
            dragConstraints={constraints}
            dragElastic={0.08}
            dragMomentum={false}
            onDragEnd={onDragEnd}
          >
            {DUMMY_RAFFLES.map(item => (
              <RaffleCard key={item.id} item={item} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function RaffleCard({ item }: { item: RaffleItem }) {
  const time = useCountdown(item.countdown)

  return (
    <div className="flex-none w-[280px] md:w-[379.67px] h-auto md:h-[570.67px] bg-bg border-r border-border flex flex-col justify-center items-start select-none isolate">
      <div className="px-4 md:px-5 pt-3 pb-3 border-b border-border w-full">
        <div className="w-full">
          <p className="text-primary text-[10px] md:text-[11px] font-semibold tracking-[0.15em] text-center mb-2">
            {padNumber(time.days)}D : {padNumber(time.hours)}H : {padNumber(time.minutes)}M : {padNumber(time.seconds)}S
          </p>
          <div className="w-full h-[5px] bg-[#2a2a2a] rounded-sm overflow-hidden">
            <div className="h-full bg-primary rounded-sm" style={{ width: '45%' }} />
          </div>
        </div>
      </div>

      <div className="relative w-full aspect-[4/3] bg-bg-surface overflow-hidden">
        <Image src={item.image} alt={item.name} fill className="object-cover" draggable={false} />
      </div>

      <div className="px-4 md:px-5 pt-3.5 pb-2 border-t border-border w-full">
        <p className="text-foreground text-[13px] md:text-[14px] font-bold">{item.name}</p>
        <div className="flex items-center gap-1.5 mt-1.5">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="flex-shrink-0">
            <circle cx="6" cy="6" r="5" stroke="#878787" strokeWidth="1" />
            <path d="M6 3V6L8 7.5" stroke="#878787" strokeWidth="1" strokeLinecap="round" />
          </svg>
          <p className="text-foreground-muted text-[10px] md:text-[11px] font-medium">
            Sale Ended <span className="text-foreground-muted ml-0.5">{item.saleEnded}</span>
          </p>
        </div>
      </div>

      <div className="px-4 md:px-5 pb-4 pt-2 w-full">
        <button className="w-full bg-primary text-white text-[11px] md:text-[12px] font-bold uppercase py-3 md:py-3.5 px-4 md:px-5 flex items-center justify-between hover:bg-primary/90 transition-colors tracking-wider">
          <span>START RAFFLING NOW</span>
          <span className="flex items-center gap-1.5 text-[11px] md:text-[12px]">
            {item.ticketPrice}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1L11 4.5V7.5L6 11L1 7.5V4.5L6 1Z" stroke="white" strokeWidth="0.8" />
              <path d="M6 3.5L8.5 5.25V6.75L6 8.5L3.5 6.75V5.25L6 3.5Z" fill="white" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  )
}

function NavButton({ direction, onClick }: { direction: 'left' | 'right'; onClick: () => void }) {
  const path = direction === 'left' ? 'M11 5L7 9L11 13' : 'M7 5L11 9L7 13'
  return (
    <button
      onClick={onClick}
      className="w-9 h-9 md:w-11 md:h-11 border border-border flex items-center justify-center hover:border-foreground-muted transition-colors"
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d={path} stroke="#878787" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}
