'use client'

import { useRef, useState, useEffect, memo } from 'react'
import { motion, useMotionValue, useAnimation, PanInfo } from 'framer-motion'
import Image from 'next/image'
import { useCountdown } from '@/app/hooks/useCountdown'
import { padNumber } from '@/app/lib/utils'
import { DUMMY_RAFFLES } from '@/app/data'
import { RaffleItem } from '@/app/types'

export default function RaffleCarousel() {
  const containerRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const controls = useAnimation()
  const [constraints, setConstraints] = useState({ left: 0, right: 0 })
  const [activeIndex, setActiveIndex] = useState(0)
  const totalItems = DUMMY_RAFFLES.length

  // Mobile card width + gap = snap unit
  const MOBILE_CARD = 160
  const MOBILE_GAP = 16
  const MOBILE_SNAP = MOBILE_CARD + MOBILE_GAP

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

  useEffect(() => {
    const unsubscribe = x.on('change', (latest) => {
      if (window.innerWidth < 768) {
        const idx = Math.round(Math.abs(latest) / MOBILE_SNAP)
        setActiveIndex(Math.min(idx, totalItems - 1))
      }
    })
    return unsubscribe
  }, [x, totalItems, MOBILE_SNAP])

  const nav = (dir: 'left' | 'right') => {
    if (window.innerWidth < 768) {
      const nextIdx = dir === 'left'
        ? Math.max(activeIndex - 1, 0)
        : Math.min(activeIndex + 1, totalItems - 1)
      const target = -(nextIdx * MOBILE_SNAP)
      const clamped = Math.max(constraints.left, Math.min(0, target))
      controls.start({
        x: clamped,
        transition: { type: 'spring', stiffness: 300, damping: 40 },
      })
    } else {
      const step = 380
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
  }

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (window.innerWidth < 768) {
      const cur = x.get() + info.velocity.x * 0.15
      const idx = Math.round(Math.abs(cur) / MOBILE_SNAP)
      const clampedIdx = Math.max(0, Math.min(idx, totalItems - 1))
      const target = -(clampedIdx * MOBILE_SNAP)
      const clamped = Math.max(constraints.left, Math.min(0, target))
      controls.start({
        x: clamped,
        transition: { type: 'spring', stiffness: 300, damping: 40 },
      })
    } else {
      const cur = x.get()
      const target = cur + info.velocity.x * 0.3
      const clamped = Math.max(constraints.left, Math.min(0, target))
      controls.start({
        x: clamped,
        transition: { type: 'spring', stiffness: 300, damping: 40 },
      })
    }
  }

  return (
    <section className="relative bg-bg border-t border-border overflow-hidden max-w-[1440px] mx-auto md:h-[620px]">
      <div className="flex flex-col md:flex-row items-stretch md:items-center h-full">
        {/* Desktop nav panel */}
        <div className="hidden md:flex flex-shrink-0 w-[160px] lg:w-[200px] bg-bg border-r border-border items-center justify-center">
          <div className="flex flex-row gap-2">
            <NavButton direction="left" onClick={() => nav('left')} />
            <NavButton direction="right" onClick={() => nav('right')} />
          </div>
        </div>

        {/* Carousel */}
        <div ref={containerRef} className="flex-1 overflow-hidden">
          <motion.div
            className="flex cursor-grab active:cursor-grabbing pl-5 md:pl-0 py-5 md:py-0"
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
            <div className="flex-none w-5 md:hidden" />
          </motion.div>
        </div>

        {/* Mobile bottom: arrows + dots */}
        <div className="flex md:hidden items-center justify-between px-5 py-3 border-t border-border bg-bg">
          <NavButton direction="left" onClick={() => nav('left')} />
          <div className="flex items-center gap-1.5">
            {DUMMY_RAFFLES.map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-300 ${
                  i === activeIndex
                    ? 'w-5 h-[5px] bg-primary'
                    : 'w-[5px] h-[5px] bg-border'
                }`}
              />
            ))}
          </div>
          <NavButton direction="right" onClick={() => nav('right')} />
        </div>
      </div>
    </section>
  )
}

/* ─── Mobile Card ─── */
const MobileCard = memo(function MobileCard({ item }: { item: RaffleItem }) {
  const time = useCountdown(item.countdown)

  return (
    <div className="w-[160px] flex flex-col border border-border rounded-lg overflow-hidden bg-bg-surface">
      {/* Image */}
      <div className="relative w-full aspect-[4/3] bg-bg-surface overflow-hidden">
        <Image src={item.image} alt={item.name} fill className="object-cover" draggable={false} />
        {/* Countdown overlay */}
        <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-sm px-2.5 py-1.5">
          <p className="text-primary text-[9px] font-semibold tracking-[0.1em] text-center">
            {padNumber(time.days)}D : {padNumber(time.hours)}H : {padNumber(time.minutes)}M : {padNumber(time.seconds)}S
          </p>
          <div className="w-full h-[3px] bg-white/10 rounded-full overflow-hidden mt-1">
            <div className="h-full bg-primary rounded-full" style={{ width: '45%' }} />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="px-3 pt-2.5 pb-1.5">
        <p className="text-foreground text-[12px] font-bold leading-tight truncate">{item.name}</p>
        <div className="flex items-center gap-1 mt-1">
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="flex-shrink-0">
            <circle cx="6" cy="6" r="5" stroke="#878787" strokeWidth="1" />
            <path d="M6 3V6L8 7.5" stroke="#878787" strokeWidth="1" strokeLinecap="round" />
          </svg>
          <p className="text-foreground-muted text-[9px] font-medium truncate">
            Sale Ended {item.saleEnded}
          </p>
        </div>
      </div>

      {/* Button */}
      <div className="px-3 pb-3 pt-1.5">
        <button className="w-full bg-primary text-white text-[10px] font-bold uppercase py-2.5 px-3 flex items-center justify-between hover:bg-primary/90 transition-colors tracking-wider rounded-sm">
          <span>RAFFLE NOW</span>
          <span className="flex items-center gap-1 text-[10px]">
            {item.ticketPrice}
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <path d="M6 1L11 4.5V7.5L6 11L1 7.5V4.5L6 1Z" stroke="white" strokeWidth="0.8" />
              <path d="M6 3.5L8.5 5.25V6.75L6 8.5L3.5 6.75V5.25L6 3.5Z" fill="white" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  )
})

/* ─── Desktop Card (unchanged) ─── */
const DesktopCard = memo(function DesktopCard({ item }: { item: RaffleItem }) {
  const time = useCountdown(item.countdown)

  return (
    <div className="w-[379.67px] h-[620px] bg-bg border-r border-border flex flex-col justify-center items-start select-none isolate">
      <div className="px-5 pt-3 pb-3 border-b border-border w-full">
        <div className="w-full">
          <p className="text-primary text-[11px] font-semibold tracking-[0.15em] text-center mb-2">
            {padNumber(time.days)}D : {padNumber(time.hours)}H : {padNumber(time.minutes)}M : {padNumber(time.seconds)}S
          </p>
          <div className="w-full h-[5px] bg-[#2a2a2a] rounded-sm overflow-hidden">
            <div className="h-full bg-primary rounded-sm" style={{ width: '45%' }} />
          </div>
        </div>
      </div>

      <div className="relative w-full flex-1 bg-bg-surface overflow-hidden">
        <Image src={item.image} alt={item.name} fill className="object-cover" draggable={false} />
      </div>

      <div className="px-5 pt-3.5 pb-2 border-t border-border w-full">
        <p className="text-foreground text-[14px] font-bold">{item.name}</p>
        <div className="flex items-center gap-1.5 mt-1.5">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="flex-shrink-0">
            <circle cx="6" cy="6" r="5" stroke="#878787" strokeWidth="1" />
            <path d="M6 3V6L8 7.5" stroke="#878787" strokeWidth="1" strokeLinecap="round" />
          </svg>
          <p className="text-foreground-muted text-[11px] font-medium">
            Sale Ended <span className="text-foreground-muted ml-0.5">{item.saleEnded}</span>
          </p>
        </div>
      </div>

      <div className="px-5 pb-4 pt-2 w-full">
        <button className="w-full bg-primary text-white text-[12px] font-bold uppercase py-3.5 px-5 flex items-center justify-between hover:bg-primary/90 transition-colors tracking-wider">
          <span>START RAFFLING NOW</span>
          <span className="flex items-center gap-1.5 text-[12px]">
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
})

/* ─── Wrapper: picks mobile or desktop card ─── */
const RaffleCard = memo(function RaffleCard({ item }: { item: RaffleItem }) {
  return (
    <div className="flex-none mr-4 md:mr-0 select-none">
      {/* Mobile */}
      <div className="md:hidden">
        <MobileCard item={item} />
      </div>
      {/* Desktop */}
      <div className="hidden md:block">
        <DesktopCard item={item} />
      </div>
    </div>
  )
})

function NavButton({ direction, onClick }: { direction: 'left' | 'right'; onClick: () => void }) {
  const path = direction === 'left' ? 'M11 5L7 9L11 13' : 'M7 5L11 9L7 13'
  return (
    <button
      onClick={onClick}
      className="w-9 h-9 md:w-11 md:h-11 border border-white flex items-center justify-center hover:opacity-70 transition-opacity active:bg-white/10"
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d={path} stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}