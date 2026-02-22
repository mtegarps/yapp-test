'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

// Layout
import { NavBar, Taglines } from '@/app/components/layout'

// Cards
import { ProductAltCard, ProductGrid } from '@/app/components/cards'

// Effects
import { RandomizedTextEffect, CharacterFadeEffect } from '@/app/components/effects'

// Sections
import {
  LoadingScreen,
  ExpandingTextSection,
  HorizontalScrollSection,
  CardSwipeSection,
  DontMissOutSection,
  RaffleCarousel,
  DarkSpacer,
  FooterSection,
} from '@/app/components/sections'

// UI
import Marquee from '@/app/components/ui/Marquee'
import CustomCursor from '@/app/components/ui/CustomCursor'
import BackgroundParticles from '@/app/components/ui/BackgroundParticles'
import SectionReveal from '@/app/components/ui/SectionReveal'
import HeroShaderCanvas from '@/app/components/ui/HeroShaderCanvas'

// Data & Utils
import { PRODUCTS } from '@/app/data'
import { createArray } from '@/app/lib/utils'

// Stagger variants buat hero entrance
const heroStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
}

const heroChild = {
  hidden: { opacity: 0, y: 30, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
}

const heroChildRight = {
  hidden: { opacity: 0, x: 40, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <main className="pt-[95vh] min-h-screen">
      <CustomCursor />
      <LoadingScreen onFinished={() => setIsLoading(false)} />
      {!isLoading && (
        <>
          <BackgroundParticles />
          <NavBar />

          {/* Hero section — fixed di belakang */}
          <header className="fixed top-0 left-0 w-full h-full bg-bg-surface2 pt-[60px]">
            <Taglines />
            <section className="w-full px-0 md:px-40">
              {/* Hero content dengan stagger entrance */}
              <motion.section
                variants={heroStagger}
                initial="hidden"
                animate="visible"
                className="w-full flex flex-col md:flex-row"
              >
                <motion.div
                  variants={heroChild}
                  className="w-full md:w-2/3 px-6 md:px-10 py-6 md:py-[53px] border-l border-r border-border"
                >
                  <RandomizedTextEffect
                    tag="h1"
                    className="text-left text-4xl md:text-6xl font-semibold"
                  >
                    OWN NFTS, TOKENS, OR RWA ASSETS
                  </RandomizedTextEffect>
                </motion.div>
                <motion.div
                  variants={heroChildRight}
                  className="w-full md:w-2/5 grid grid-cols-1 grid-rows-2"
                >
                  {/* Shader canvas replace static image */}
                  <div className="w-full h-32 border-l border-r border-b border-t md:border-t-0 border-border overflow-hidden relative">
                    <HeroShaderCanvas />
                  </div>
                  <div className="w-full px-9 md:px-6 flex items-center border-l border-r border-border">
                    <Link
                      href="#"
                      className="w-full bg-primary text-white text-center py-4 px-0 text-sm font-semibold relative overflow-hidden group"
                    >
                      <span className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-out" />
                      <span className="relative">BUY TICKETS NOW</span>
                    </Link>
                  </div>
                </motion.div>
              </motion.section>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <ProductGrid products={PRODUCTS.slice(0, 5)} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="w-full h-svh flex flex-col md:flex-row justify-between"
              >
                <div className="flex-1 md:flex-2/5 flex justify-end items-start pt-4 md:pt-[25.6px] pr-4 md:pr-[37px] border-l border-r border-b border-border">
                  <CharacterFadeEffect
                    tag="p"
                    className="text-sm font-medium text-end text-foreground-muted"
                    staggerDelay={0.03}
                    baseDelay={0.5}
                  >
                    Try Your Luck Today
                  </CharacterFadeEffect>
                </div>
                <div className="flex-1 md:flex-3/5 w-full pt-4 md:pt-[29px] pr-4 md:pr-14 border-r border-b border-border">
                  <CharacterFadeEffect
                    tag="h2"
                    className="text-xl md:text-2xl lg:text-5xl font-semibold tracking-tight text-end uppercase ml-4 md:ml-[47px] lg:ml-[141px]"
                    staggerDelay={0.03}
                    baseDelay={0.5}
                  >
                    STARTING AS LOW AS $10!
                  </CharacterFadeEffect>
                </div>
              </motion.div>
            </section>
          </header>

          {/* Scrollable content */}
          <section className="relative z-10 scroll-smooth">
            <div className="w-[280px] md:w-[553px] h-[35px] md:h-[49px] bg-bg [clip-path:polygon(10%_0,90%_0,100%_100%,0_100%)] relative top-0 left-4 md:left-[122px]" />

            <div className="relative">
              <section className="sticky top-[50px] md:top-[60px] z-30 bg-bg w-full flex">
                <div className="w-[155px] hidden md:block border-t border-r border-b border-border" />
                <div className="w-full flex justify-between px-6 py-[22px] border-t border-b border-border">
                  <p className="text-primary py-1.5 px-[18px] bg-primary/10">OUR MISSION</p>
                  <p className="hidden md:block text-primary py-1.5 px-[18px] bg-primary/10">OUR MISSION</p>
                </div>
                <div className="hidden md:block w-[155px] border-t border-b border-l border-border" />
              </section>

              <ExpandingTextSection />
            </div>

            {/* Future NFT Marketplace section */}
            <SectionReveal>
              <section className="relative bg-bg">
                <div className="hidden lg:grid grid-cols-6 absolute inset-0">
                  <div className="h-full border-r border-border" />
                  <div className="h-full border-r border-border col-span-2" />
                  <div className="h-full border-r border-border col-span-2" />
                  <div className="h-full border-r border-border" />
                </div>
                <div className="relative z-10 flex flex-col h-full w-full lg:justify-end py-10">
                  <div className="grid grid-cols-1 lg:grid-cols-6 lg:h-[436px]">
                    <div className="max-lg:hidden" />
                    <div className="col-span-1 lg:col-span-4 relative p-6 flex max-lg:flex-col gap-3 lg:items-center h-full">
                      <CharacterFadeEffect className="text-sm max-lg:order-1 lg:absolute top-6 right-6 uppercase text-foreground-muted lg:max-w-[200px] lg:text-right lg:mr-2">
                        LET&apos;S TO BE THE NEXT GENERATION OF NFT RAFLES
                      </CharacterFadeEffect>
                      <div className="space-y-3 lg:-translate-x-1/2">
                        <div
                          className="p-px w-fit bg-border transform-none"
                          style={{ clipPath: 'polygon(100% 0px, 100% 70%, 90% 100%, 0px 100%, 0px 30%, 10% 0px)' }}
                        >
                          <div
                            className="flex bg-bg items-center justify-center h-[60px] md:h-[83px] w-[260px] md:w-[341px]"
                            style={{ clipPath: 'polygon(100% 0px, 100% 70%, 90% 100%, 0px 100%, 0px 30%, 10% 0px)' }}
                          >
                            <RandomizedTextEffect className="lg:text-5xl text-4xl font-semibold uppercase overflow-hidden animate-neon-flicker">
                              THE FUTURE
                            </RandomizedTextEffect>
                          </div>
                        </div>
                        <RandomizedTextEffect className="lg:text-5xl text-4xl font-semibold uppercase">
                          NFT MARKETPLACE
                        </RandomizedTextEffect>
                      </div>
                    </div>
                  </div>

                  <div className="relative w-full overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-6 items-center">
                      <div className="hidden lg:flex justify-end">
                        <div className="h-[225px] w-[225px] border bg-bg border-b-0 border-border flex items-center justify-center p-4">
                          <p className="text-foreground-muted text-end text-sm font-medium">
                            RAFLUX SUPPORT ALL NFT AND TOKEN
                          </p>
                        </div>
                      </div>
                      <div className="col-span-1 lg:col-span-5 bg-bg border-t border-border flex h-full items-center overflow-hidden">
                        <Marquee gap="1rem" baseVelocity={1}>
                          {PRODUCTS.map(product => (
                            <ProductAltCard key={product.id} product={product} />
                          ))}
                        </Marquee>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-6 items-center border-t border-border">
                      <div className="col-span-1 lg:col-span-5 bg-bg h-full items-center lg:border-r border-b border-border overflow-hidden">
                        <div className="h-full flex items-center">
                          <Marquee gap="1rem" baseVelocity={1} direction="right">
                            {PRODUCTS.map(product => (
                              <ProductAltCard key={product.id} product={product} />
                            ))}
                          </Marquee>
                        </div>
                      </div>
                      <div className="hidden lg:flex">
                        <div className="h-[225px] w-[225px] border-r border-b bg-bg border-border flex items-center justify-center p-4">
                          <p className="text-foreground-muted text-start text-sm font-medium">ON BASE CHAIN</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </SectionReveal>

            <HorizontalScrollSection />

            <section className="bg-bg h-[280px] flex items-center justify-center border-b border-border [--gap:50px] md:[--gap:200px] lg:[--gap:200px] xl:[--gap:200px]">
              <div className="w-full transform-none">
                <Marquee baseVelocity={0.5} gap="var(--gap)" className="group flex overflow-hidden flex-row p-0">
                  {createArray(20).map(index => (
                    <div key={index} className="lg:max-w-[695px] max-w-[380px] w-full max-lg:space-y-4 h-fit relative">
                      <p className="lg:absolute top-4 right-4 lg:max-w-[143px] text-foreground-muted lg:text-right text-sm">
                        // EVM COMPATIBLE(BASE)
                      </p>
                      <p className="font-semibold uppercase lg:text-[72px] text-4xl">
                        Fair. transparent. fun
                      </p>
                    </div>
                  ))}
                </Marquee>
              </div>
            </section>

            <CardSwipeSection />

            <SectionReveal direction="left">
              <DontMissOutSection />
            </SectionReveal>

            <RaffleCarousel />
            <DarkSpacer />

            <SectionReveal direction="up" delay={0.1}>
              <FooterSection />
            </SectionReveal>

            <Taglines />
          </section>
        </>
      )}
    </main>
  )
}
