'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion'
import Image from 'next/image'
import Marquee from '@/app/components/ui/Marquee'
import { CARD_DATA, CARD_POSITIONS } from '@/app/data'
import { CardData } from '@/app/types'
import { createArray } from '@/app/lib/utils'

/**
 * Section dengan 3 kartu yang animated berdasarkan scroll:
 * 1. Fan (numpuk miring) -> Spread (merenggang) -> Flip 180° (kebalik)
 * Background-nya ada grid pattern + RAFLUX marquee yang super subtle.
 */
export default function CardSwipeSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  return (
    <section className="relative bg-bg">
      <div ref={containerRef} className="h-[200vh] md:h-[350vh] relative">
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* Background grid pattern */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="csg" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-foreground" />
                </pattern>
                <linearGradient id="csgf" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="white" stopOpacity="0.06" />
                  <stop offset="40%" stopColor="white" stopOpacity="0.025" />
                  <stop offset="100%" stopColor="white" stopOpacity="0" />
                </linearGradient>
                <mask id="csgm">
                  <rect width="100%" height="100%" fill="url(#csgf)" />
                </mask>
              </defs>
              <rect width="100%" height="100%" fill="url(#csg)" mask="url(#csgm)" />
            </svg>
          </div>

          {/* RAFLUX marquee background */}
          <div className="absolute inset-0 flex items-center pointer-events-none z-[1]">
            <Marquee baseVelocity={0.4} gap="30px">
              {createArray(10).map(i => (
                <span
                  key={i}
                  className="text-[80px] md:text-[120px] lg:text-[160px] font-black uppercase text-foreground/[0.04] whitespace-nowrap select-none tracking-[0.15em]"
                >
                  RAFLUX
                </span>
              ))}
            </Marquee>
          </div>

          {/* Cards */}
          <div
            className="absolute inset-0 flex items-center justify-center z-10"
            style={{ perspective: '2000px' }}
          >
            <div className="relative w-[280px] h-[380px] md:w-[360px] md:h-[490px] lg:w-[400px] lg:h-[550px]">
              {CARD_DATA.map((card, index) => (
                <AnimatedCard
                  key={index}
                  card={card}
                  index={index}
                  scrollYProgress={scrollYProgress}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Kartu yang animated — handle posisi, rotasi, dan flip
function AnimatedCard({
  card,
  index,
  scrollYProgress,
}: {
  card: CardData
  index: number
  scrollYProgress: MotionValue<number>
}) {
  const fan = CARD_POSITIONS.fan[index]
  const spread = CARD_POSITIONS.spread[index]
  const flat = CARD_POSITIONS.flat[index]

  const rotateY = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [0, 0, 180, 180])
  const x = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [fan.x, spread.x, flat.x, flat.x])
  const y = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [fan.y, spread.y, flat.y, flat.y])
  const rotate = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [fan.rotate, spread.rotate, flat.rotate, flat.rotate])
  const scale = useTransform(scrollYProgress, [0, 0.35, 0.50, 0.65, 1], [1, 1, 1.04, 0.95, 0.95])

  return (
    <motion.div
      className="absolute inset-0"
      style={{
        x, y, rotate, rotateY, scale,
        zIndex: index + 1,
        transformStyle: 'preserve-3d',
        transformOrigin: 'center center',
      }}
    >
      <CardFrontFace card={card} />
      <CardBackFace card={card} />
    </motion.div>
  )
}

function CardFrontFace({ card }: { card: CardData }) {
  return (
    <div
      className="absolute inset-0 rounded-xl overflow-hidden shadow-2xl shadow-black/50"
      style={{ backfaceVisibility: 'hidden' }}
    >
      <Image
        src={card.frontImage}
        alt="Card"
        fill
        className="object-cover"
        sizes="(max-width: 768px) 300px, (max-width: 1024px) 380px, 430px"
        priority
      />
    </div>
  )
}

function CardBackFace({ card }: { card: CardData }) {
  return (
    <div
      className="absolute inset-0"
      style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
    >
      <div className="absolute inset-0 bg-bg-surface rounded-xl border border-border flex flex-col">
        {/* Arrow icon */}
        <div className="absolute top-5 right-5 z-10">
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <rect x="0.5" y="0.5" width="29" height="29" rx="4" stroke="#FF7300" strokeWidth="1" />
            <path d="M11 19L19 11M19 11H13M19 11V17" stroke="#FF7300" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="px-7 pt-7 pr-16 flex-1 flex items-start">
          <h3 className="text-primary text-[36px] md:text-[42px] lg:text-[48px] font-bold uppercase leading-[1.05]">
            {card.backTitle}
          </h3>
        </div>

        <div className="px-7 pb-7">
          <p className="text-foreground-muted text-[12px] md:text-[13px] font-medium leading-[1.6] max-w-[240px]">
            {card.backDescription}
          </p>
        </div>
      </div>
    </div>
  )
}
