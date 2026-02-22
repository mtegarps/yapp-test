'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion'
import Image from 'next/image'
import Marquee from '@/app/components/ui/Marquee'
import { CARD_DATA, CARD_POSITIONS } from '@/app/data'
import { CardData } from '@/app/types'
import { createArray } from '@/app/lib/utils'

/**
 * Breakpoint strategy:
 * - ≤1024px  (mobile + semua tablet termasuk iPad Pro 1024px): StaticCards
 *   · <768px : vertikal
 *   · 768–1024px: horizontal row
 * - ≥1025px  (desktop/laptop): ScrollAnimatedCards — fan → spread → flip
 *
 * Pakai <style> tag dengan @media query custom supaya threshold 1025px
 * bisa precise tanpa ubah tailwind.config, dan SSR-safe karena CSS-only.
 */
export default function CardSwipeSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  return (
    <section className="relative bg-bg">
      {/* Inject CSS untuk show/hide dua layout berdasarkan 1025px threshold */}
      <style>{`
        .css-static  { display: block; }
        .css-desktop { display: none;  }
        @media (min-width: 1025px) {
          .css-static  { display: none;  }
          .css-desktop { display: block; }
        }
        .css-cards-row { flex-direction: column; }
        @media (min-width: 768px) and (max-width: 1024px) {
          .css-cards-row { flex-direction: row; }
        }
        .css-card-size {
          width: 100%;
          max-width: 300px;
          margin-left: auto;
          margin-right: auto;
        }
        @media (min-width: 768px) and (max-width: 1024px) {
          .css-card-size {
            flex: 1;
            max-width: none;
            margin-left: 0;
            margin-right: 0;
          }
        }
      `}</style>

      {/* ══ MOBILE + TABLET (≤1024px) ══ */}
      <div className="css-static py-16 px-4 relative overflow-hidden">
        <SectionBackground />
        <div className="css-cards-row relative z-10 flex gap-5 items-stretch justify-center">
          {CARD_DATA.map((card, index) => (
            <StaticCard key={index} card={card} index={index} />
          ))}
        </div>
      </div>

      {/* ══ DESKTOP (≥1025px) — animasi scroll original ══ */}
      <div ref={containerRef} className="css-desktop h-[350vh] relative">
        <div className="sticky top-0 h-screen overflow-hidden">
          <SectionBackground />
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

// ─── Static card (mobile / tablet) ───────────────────────────────────────────
function StaticCard({ card, index }: { card: CardData; index: number }) {
  const rotates = [-2, 1.5, -1]
  const rotate = rotates[index] ?? 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4, ease: 'easeOut' }}
      className="css-card-size relative"
      style={{ aspectRatio: '3/4', rotate: `${rotate}deg` }}
    >
      <div className="absolute inset-0 bg-bg-surface rounded-xl border border-border flex flex-col shadow-xl shadow-black/40">
        <div className="absolute top-4 right-4 z-10">
          <svg width="26" height="26" viewBox="0 0 30 30" fill="none">
            <rect x="0.5" y="0.5" width="29" height="29" rx="4" stroke="#FF7300" strokeWidth="1" />
            <path d="M11 19L19 11M19 11H13M19 11V17" stroke="#FF7300" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="px-5 pt-5 pr-11 flex-1 flex items-start">
          <h3 className="text-primary text-[28px] font-bold uppercase leading-[1.05]">
            {card.backTitle}
          </h3>
        </div>
        <div className="px-5 pb-5">
          <p className="text-foreground-muted text-[11px] font-medium leading-[1.6]">
            {card.backDescription}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Animated card (desktop only) ────────────────────────────────────────────
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

// ─── Shared background ────────────────────────────────────────────────────────
function SectionBackground() {
  return (
    <>
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
      <div className="absolute inset-0 flex items-center pointer-events-none z-[1]">
        <Marquee baseVelocity={0.4} gap="30px">
          {createArray(4).map(i => (
            <span
              key={i}
              className="text-[80px] md:text-[120px] lg:text-[160px] font-black uppercase text-foreground/[0.04] whitespace-nowrap select-none tracking-[0.15em]"
            >
              RAFLUX
            </span>
          ))}
        </Marquee>
      </div>
    </>
  )
}