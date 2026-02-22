'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import CharacterFadeEffect from '@/app/components/effects/CharacterFadeEffect'

/**
 * Section yang scroll horizontal pas user scroll vertical.
 * Ada 2 panel: "For Sellers" dan "For Buyers".
 * Di mobile jadi stack vertical biasa.
 */
export default function HorizontalScrollSection() {
  const targetRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: targetRef })
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-50%'])

  return (
    <section ref={targetRef} className="relative lg:h-[300vh] h-auto bg-bg border-b border-border">
      {/* Background grid lines */}
      <div className="absolute inset-0 grid grid-cols-6 pointer-events-none">
        <div className="border-border h-full border-r" />
        <div className="border-border col-span-2 h-full border-r" />
        <div className="border-border col-span-2 h-full border-r" />
        <div className="border-border h-full border-r" />
      </div>

      <div className="lg:sticky lg:top-0 h-auto lg:h-screen flex items-start lg:items-center overflow-visible lg:overflow-hidden">
        <motion.div
          style={{ x }}
          className="flex flex-col lg:flex-row gap-4 px-4 md:px-12 lg:px-20 lg:w-max w-full max-lg:!transform-none"
        >
          <InfoPanel
            badge="For Sellers"
            headings={['SECURE ESCROW', 'INSTANT LIQUIDITY']}
            descriptions={[
              'Smart contracts ensure your assets are safely held until the raffle is complete, protecting both buyers and sellers.',
              'Sell out your raffles in hours, not months. More buyers = faster sales, and quicker cash flow.',
            ]}
            heroTitle={<>MORE LIQUID<br />THAN OPENSEA</>}
            heroImage="/images/img-info-card-1.svg"
            heroAlt="More liquid than opensea"
          />
          <InfoPanel
            badge="For Buyers"
            headings={['LOW ENTRY COST', 'FAIR CHANCES']}
            descriptions={[
              'Buy tickets starting at $10 instead of paying $50K+ for premium NFTs',
              'Chainlink VRF ensures provably fair random selection',
            ]}
            heroTitle={<>JOIN INSTANTLY<br />WITH USDC/USDT</>}
            heroImage="/images/img-info-card-2.svg"
            heroAlt="Join instantly"
          />
        </motion.div>
      </div>
    </section>
  )
}

// Reusable panel component buat For Sellers dan For Buyers
interface InfoPanelProps {
  badge: string
  headings: [string, string]
  descriptions: [string, string]
  heroTitle: React.ReactNode
  heroImage: string
  heroAlt: string
}

function InfoPanel({ badge, headings, descriptions, heroTitle, heroImage, heroAlt }: InfoPanelProps) {
  return (
    <div className="flex max-lg:flex-col w-full lg:w-[100vw] items-center justify-center py-20 lg:py-0 first:pt-20 first:lg:pt-0">
      <div className="flex max-lg:flex-col border-y border-border w-full lg:h-[80vh] lg:gap-2">
        {/* Kolom kiri: badge + 2 text blocks */}
        <div className="bg-bg border-border flex w-full flex-col overflow-hidden border-x lg:w-[40%]">
          <div className="p-6">
            <div className="bg-primary/10 font-semibold text-lg uppercase text-primary flex items-center w-fit justify-center gap-2 px-4.5 py-1.4 text-nowrap">
              {badge}
            </div>
          </div>
          <div className="border-border flex h-full flex-col gap-4 border-y p-6 max-lg:min-h-[300px] max-lg:justify-center">
            <CharacterFadeEffect className="text-[24px] md:text-[32px] font-bold uppercase lg:text-right">
              {headings[0]}
            </CharacterFadeEffect>
            <CharacterFadeEffect
              text={descriptions[0]}
              className="text-foreground-muted font-medium lg:text-right"
            />
          </div>
          <div className="border-border flex h-full flex-col gap-4 p-6 max-lg:min-h-[300px] max-lg:justify-center max-lg:border-b">
            <CharacterFadeEffect className="text-[24px] md:text-[32px] font-bold uppercase">
              {headings[1]}
            </CharacterFadeEffect>
            <CharacterFadeEffect
              text={descriptions[1]}
              className="text-foreground-muted font-medium"
            />
          </div>
        </div>

        {/* Kolom kanan: hero image + title */}
        <div className="bg-bg-surface border-border relative flex h-full w-full items-start justify-end border-x p-8 max-lg:min-h-[300px] lg:w-[60%] lg:p-16 aspect-[4/3] lg:aspect-auto">
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full fill-border/20 stroke-border/20 mask-[linear-gradient(to_bottom_right,white,transparent,transparent)]"
          >
            <defs>
              <pattern id="_r_40_" width="40" height="40" patternUnits="userSpaceOnUse" x="-1" y="-1">
                <path d="M.5 40V.5H40" fill="none" strokeDasharray="0" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" strokeWidth="0" fill="url(#_r_40_)" />
          </svg>

          <Image
            alt={heroAlt}
            loading="lazy"
            width={900}
            height={900}
            className="absolute bottom-0 left-0 z-10 h-full w-auto object-contain max-lg:object-cover"
            src={heroImage}
          />

          <CharacterFadeEffect
            tag="h2"
            className="text-primary relative z-10 text-2xl md:text-4xl font-bold uppercase max-lg:m-auto text-end lg:ml-auto lg:max-w-[488px] lg:text-[56px]"
          >
            {heroTitle}
          </CharacterFadeEffect>
        </div>
      </div>
    </div>
  )
}
