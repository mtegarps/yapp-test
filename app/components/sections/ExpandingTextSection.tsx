'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion'
import RandomizedTextEffect from '@/app/components/effects/RandomizedTextEffect'

interface AnimatedLineProps {
  text: string
  align: 'start' | 'end'
  progress: MotionValue<number>
}

/**
 * Satu baris text yang word spacing-nya expand seiring scroll.
 * Triknya: animate padding di sisi yg berlawanan sama alignment,
 * jadi kata-katanya "melar" karena justify-between.
 */
function AnimatedLine({ text, align, progress }: AnimatedLineProps) {
  const words = text.split(' ')
  const maxPadding = '40%'

  const pLeft = useTransform(
    progress,
    [0, 1],
    align === 'end' ? [maxPadding, '0%'] : ['0%', '0%']
  )
  const pRight = useTransform(
    progress,
    [0, 1],
    align === 'start' ? [maxPadding, '0%'] : ['0%', '0%']
  )

  return (
    <motion.div
      className="flex justify-between items-center w-full border-t border-b border-border/15"
      style={{ paddingLeft: pLeft, paddingRight: pRight }}
    >
      {words.map((word, i) => (
        <RandomizedTextEffect
          key={i}
          className="text-[22px] md:text-[32px] lg:text-7xl tracking-tight font-semibold"
          duration={800}
          revealSpeed={40}
        >
          {word}
        </RandomizedTextEffect>
      ))}
    </motion.div>
  )
}

export default function ExpandingTextSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  return (
    <section className="relative z-20 bg-bg-surface2">
      <div ref={containerRef} className="h-[200vh] md:h-[300vh] relative">
        <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center bg-bg-surface2 z-20 pt-[100px] md:pt-[130px]">
          <Image
            src="/star_left_decor.svg"
            alt="Star Decor"
            width={200}
            height={200}
            loading="lazy"
            className="absolute bottom-0 left-0 hidden md:block w-[120px] lg:w-[200px] h-auto"
          />
          <Image
            src="/star_right_decor.svg"
            alt="Star Decor"
            width={200}
            height={200}
            loading="lazy"
            className="absolute top-0 right-0 hidden md:block w-[120px] lg:w-[200px] h-auto"
          />

          <div className="grid grid-rows-4 grid-cols-1 gap-3 md:gap-6 w-full px-4 md:px-12">
            <AnimatedLine text="EMPOWER COMMUNITIES" align="start" progress={scrollYProgress} />
            <AnimatedLine text="A FAIR CHANCE" align="end" progress={scrollYProgress} />
            <AnimatedLine text="TO WIN, OWN, AND" align="start" progress={scrollYProgress} />
            <AnimatedLine text="GROW TOGETHER" align="end" progress={scrollYProgress} />
          </div>
        </div>
      </div>
    </section>
  )
}
