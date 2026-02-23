'use client'

import { useRef, useLayoutEffect, useState } from 'react'
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion'
import Image from 'next/image'

/**
 * Exact replica of raflux-mimicker HowItWorkSection + HowItWorkCard
 * Converted from GSAP ScrollTrigger to framer-motion useScroll/useTransform
 * 
 * Card shape: polygon shape with notch (vector-frontface-card.svg / vector-backface-card.svg)
 * Animation: fan -> spread -> flip (desktop only)
 * Mobile: cards shown flipped (back face) stacked vertically
 */

const SPRING_CONFIG = {
    stiffness: 80,
    damping: 20,
    mass: 0.5,
}

const HOW_IT_WORKS_DATA = [
    {
        id: 1,
        tagline: '// NFT TICKETS',
        title: 'NFT Tickets You Control',
        description: 'Every ticket is minted as an NFT on-chain. You can buy just one or as many as you want',
    },
    {
        id: 2,
        tagline: '// GET HIGHER ODDS',
        title: 'More Tickets, Higher Odds',
        description: 'Each ticket is an entry. The more you hold, the better your chance to win.',
    },
    {
        id: 3,
        tagline: '// EVM COMPATIBLE (BASE)',
        title: 'Fairness Guaranteed by Chainlink VRF',
        description: 'Even if you buy many tickets, the winner is always chosen randomly and provably fair using Chainlink VRF',
    },
]

export default function CardSwipeSection() {
    const sectionRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start start', 'end end'],
    })

    // Apply spring to the raw scroll progress so ALL cards share one smoothed value
    const smoothProgress = useSpring(scrollYProgress, SPRING_CONFIG)

    return (
        <section ref={sectionRef} className="lg:h-[250vh] w-full bg-bg">
            <div className="flex max-lg:flex-col max-lg:relative gap-6 lg:gap-8 max-lg:p-6 w-full lg:sticky top-0 items-center justify-center lg:h-screen">
                {/* Grid background pattern */}
                <div className="absolute inset-0">
                    <svg
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 h-full w-full fill-placeholder/20 stroke-placeholder/20"
                        style={{ mask: 'linear-gradient(to bottom right, white, transparent, transparent)' }}
                    >
                        <defs>
                            <pattern
                                id="_r_42_"
                                width={40}
                                height={40}
                                patternUnits="userSpaceOnUse"
                                x={-1}
                                y={-1}
                            >
                                <path
                                    d="M.5 40V.5H40"
                                    fill="none"
                                    strokeDasharray="0"
                                />
                            </pattern>
                        </defs>
                        <rect
                            width="100%"
                            height="100%"
                            strokeWidth={0}
                            fill="url(#_r_42_)"
                        />
                    </svg>
                </div>

                {/* Cards */}
                {HOW_IT_WORKS_DATA.map((item) => (
                    <HowItWorkCard
                        key={item.id}
                        id={item.id}
                        tagline={item.tagline}
                        title={item.title}
                        description={item.description}
                        scrollYProgress={smoothProgress}
                    />
                ))}

                {/* Marquee behind cards */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full">
                    <div className="group flex gap-[var(--gap)] overflow-hidden flex-row p-0" style={{ '--duration': '40s', '--gap': '1rem' } as React.CSSProperties}>
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className="flex shrink-0 justify-around gap-[var(--gap)] animate-marquee flex-row">
                                {Array.from({ length: 10 }).map((_, j) => (
                                    <div key={`${i}-${j}`} className="text-muted text-[80px] uppercase font-medium">RAFLUX</div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

// ─── HowItWorkCard ─── exact replica of raflux component ───

type HowItWorkCardProps = {
    id: number
    tagline: string
    title: string
    description: string
    scrollYProgress: MotionValue<number>
}

const imgCardPaths = [
    '/cards/img-card-1.svg',
    '/cards/img-card-2.svg',
    '/cards/img-card-3.svg',
]

function HowItWorkCard({ id, tagline, title, description, scrollYProgress }: HowItWorkCardProps) {
    const index = id - 1
    const [isMobile, setIsMobile] = useState(() => 
        typeof window !== 'undefined' ? window.innerWidth < 1024 : false
    )

    useLayoutEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 1024)
        check()
        window.addEventListener('resize', check)
        return () => window.removeEventListener('resize', check)
    }, [])

    // GSAP original fan positions:
    // card[0]: x: 190, y: 30, rotation: -14  → spread: x:0, y:0, rot:0
    // card[1]: x: 0, y: -20, rotation: 0    → spread: x:0, y:0 (only y changes)
    // card[2]: x: -190, y: 30, rotation: 14  → spread: x:0, y:0, rot:0
    const fanPositions = [
        { x: 190, y: 30, rotate: -14 },
        { x: 0, y: -20, rotate: 0 },
        { x: -190, y: 30, rotate: 14 },
    ]

    const fan = fanPositions[index]

    // Phase 1 (0 → 0.5): fan → spread (cards come together)
    // Phase 2 (0.5 → 1.0): flip all cards 180°
    // scrollYProgress here is already spring-smoothed from the parent
    const x = useTransform(scrollYProgress, [0, 0.5, 1], [fan.x, 0, 0])
    const y = useTransform(scrollYProgress, [0, 0.5, 1], [fan.y, 0, 0])
    const rotate = useTransform(scrollYProgress, [0, 0.5, 1], [fan.rotate, 0, 0])
    const rotateY = useTransform(scrollYProgress, [0, 0.5, 0.95, 1], [0, 0, 180, 180])

    // z-index: card[0]=10, card[1]=20, card[2]=30 (matching raflux)
    const zIndex = (index + 1) * 10

    return (
        <motion.div
            className="how-it-work-card relative w-full lg:w-[379px] h-[510px] perspective-1000 z-10"
            style={
                isMobile
                    ? {}
                    : { x, y, rotate, zIndex, transformOrigin: '50% 120%' }
            }
        >
            <motion.div
                className="how-it-work-card-inner relative w-full h-full preserve-3d"
                style={
                    isMobile
                        ? { transform: 'rotateY(180deg)' }
                        : { rotateY }
                }
            >
                {/* ── FRONT FACE ── */}
                <div className="absolute inset-0 w-full h-full backface-hidden">
                    {/* Front card SVG shape */}
                    <VectorFrontfaceCard />

                    {/* Top tagline with corner marks */}
                    <div className="absolute top-0 left-0 pl-8 pr-3.5 pt-6 w-full">
                        <div className="w-full flex items-center justify-between">
                            <div className="size-2.5 border-l border-t border-orange-800" />
                            <div className="size-2.5 border-r border-t border-orange-800" />
                        </div>
                        <p className="text-sm uppercase ml-2 text-primary">{tagline}</p>
                    </div>

                    {/* Card image */}
                    <div className="absolute right-0 w-[297px] h-full flex items-center justify-center">
                        <Image
                            src={imgCardPaths[index]}
                            alt={tagline}
                            loading="lazy"
                            width={500}
                            height={500}
                            className="w-full h-fit object-contain"
                        />
                    </div>

                    {/* Bottom tagline with corner marks */}
                    <div className="absolute bottom-0 left-0 space-y-6 px-3.5 pb-3.5 w-full">
                        <div className="w-[150px] h-[150px] -rotate-90">
                            <p className="text-sm uppercase text-primary text-right">{tagline}</p>
                        </div>
                        <div className="w-full flex items-center justify-between">
                            <div className="size-2.5 border-l border-b border-orange-800" />
                            <div className="size-2.5 border-r border-b border-orange-800" />
                        </div>
                    </div>
                </div>

                {/* ── BACK FACE ── */}
                <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                    {/* Back card SVG shape (mirrored) */}
                    <VectorBackfaceCard />

                    <div className="flex z-10 relative h-full flex-col justify-between pb-8 pl-7 pt-2 pr-7">
                        <div>
                            <PixelArtArrowRight />
                            <h2 className="text-5xl text-primary max-w-[258px] uppercase">{title}</h2>
                        </div>
                        <p className="text-xs max-w-[185px] text-muted-2 ml-auto">{description}</p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}

// ─── Inline SVG Components (exact from raflux vectors) ───

function VectorFrontfaceCard() {
    return (
        <svg
            viewBox="0 0 379 510"
            className="absolute inset-0 h-full w-full pointer-events-none"
            preserveAspectRatio="none"
        >
            <mask id="path-1-inside-front" fill="#201F1F">
                <path
                    d="M16 267L5.2267e-06 289.294L-1.4068e-05 510L379 510L379 16L345.697 -2.91142e-06L16 -3.17345e-05L16 267Z"
                    vectorEffect="non-scaling-stroke"
                />
            </mask>
            <path
                d="M16 267L5.2267e-06 289.294L-1.4068e-05 510L379 510L379 16L345.697 -2.91142e-06L16 -3.17345e-05L16 267Z"
                fill="#201F1F"
                vectorEffect="non-scaling-stroke"
            />
            <path
                d="M16 267L17 267L17 267.322L16.8124 267.583L16 267ZM5.2267e-06 289.294L-0.999995 289.294L-0.999995 288.972L-0.81242 288.711L5.2267e-06 289.294ZM-1.4068e-05 510L-1.41555e-05 511L-1.00001 511L-1.00001 510L-1.4068e-05 510ZM379 510L380 510L380 511L379 511L379 510ZM379 16L379.433 15.0986L380 15.371L380 16L379 16ZM345.697 -2.91142e-06L345.697 -1L345.925 -1L346.13 -0.901371L345.697 -2.91142e-06ZM16 -3.17345e-05L15 -3.18219e-05L15 -1.00003L16 -1.00003L16 -3.17345e-05ZM16 267L16.8124 267.583L0.812431 289.877L5.2267e-06 289.294L-0.81242 288.711L15.1876 266.417L16 267ZM5.2267e-06 289.294L1.00001 289.294L0.999986 510L-1.4068e-05 510L-1.00001 510L-0.999995 289.294L5.2267e-06 289.294ZM-1.4068e-05 510L-1.39806e-05 509L379 509L379 510L379 511L-1.41555e-05 511L-1.4068e-05 510ZM379 510L378 510L378 16L379 16L380 16L380 510L379 510ZM379 16L378.567 16.9014L345.264 0.901365L345.697 -2.91142e-06L346.13 -0.901371L379.433 15.0986L379 16ZM345.697 -2.91142e-06L345.697 0.999997L16 0.999968L16 -3.17345e-05L16 -1.00003L345.697 -1L345.697 -2.91142e-06ZM16 -3.17345e-05L17 -3.1647e-05L17 267L16 267L15 267L15 -3.18219e-05L16 -3.17345e-05Z"
                fill="#484848"
                mask="url(#path-1-inside-front)"
                vectorEffect="non-scaling-stroke"
            />
        </svg>
    )
}

function VectorBackfaceCard() {
    return (
        <svg
            viewBox="0 0 379 510"
            className="absolute inset-0 h-full w-full scale-x-[-1]"
            preserveAspectRatio="none"
        >
            <mask id="path-1-inside-back" fill="#201F1F">
                <path
                    d="M16 267L5.2267e-06 289.294L-1.4068e-05 510L379 510L379 16L345.697 -2.91142e-06L16 -3.17345e-05L16 267Z"
                    vectorEffect="non-scaling-stroke"
                />
            </mask>
            <path
                d="M16 267L5.2267e-06 289.294L-1.4068e-05 510L379 510L379 16L345.697 -2.91142e-06L16 -3.17345e-05L16 267Z"
                fill="#201F1F"
                vectorEffect="non-scaling-stroke"
            />
            <path
                d="M16 267L17 267L17 267.322L16.8124 267.583L16 267ZM5.2267e-06 289.294L-0.999995 289.294L-0.999995 288.972L-0.81242 288.711L5.2267e-06 289.294ZM-1.4068e-05 510L-1.41555e-05 511L-1.00001 511L-1.00001 510L-1.4068e-05 510ZM379 510L380 510L380 511L379 511L379 510ZM379 16L379.433 15.0986L380 15.371L380 16L379 16ZM345.697 -2.91142e-06L345.697 -1L345.925 -1L346.13 -0.901371L345.697 -2.91142e-06ZM16 -3.17345e-05L15 -3.18219e-05L15 -1.00003L16 -1.00003L16 -3.17345e-05ZM16 267L16.8124 267.583L0.812431 289.877L5.2267e-06 289.294L-0.81242 288.711L15.1876 266.417L16 267ZM5.2267e-06 289.294L1.00001 289.294L0.999986 510L-1.4068e-05 510L-1.00001 510L-0.999995 289.294L5.2267e-06 289.294ZM-1.4068e-05 510L-1.39806e-05 509L379 509L379 510L379 511L-1.41555e-05 511L-1.4068e-05 510ZM379 510L378 510L378 16L379 16L380 16L380 510L379 510ZM379 16L378.567 16.9014L345.264 0.901365L345.697 -2.91142e-06L346.13 -0.901371L379.433 15.0986L379 16ZM345.697 -2.91142e-06L345.697 0.999997L16 0.999968L16 -3.17345e-05L16 -1.00003L345.697 -1L345.697 -2.91142e-06ZM16 -3.17345e-05L17 -3.1647e-05L17 267L16 267L15 267L15 -3.18219e-05L16 -3.17345e-05Z"
                fill="#484848"
                mask="url(#path-1-inside-back)"
                vectorEffect="non-scaling-stroke"
            />
        </svg>
    )
}

function PixelArtArrowRight() {
    return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="size-8 text-primary ml-auto">
            <path d="M7.51476 22.5997L9.40038 24.4853L20.7141 13.1716L22.5997 15.0573L24.4853 13.1716L22.5997 11.286L24.4853 9.4004L22.5997 7.51478L20.7141 9.4004L18.8285 7.51478L16.9429 9.4004L18.8285 11.286L7.51476 22.5997ZM13.1716 9.4004L15.0572 7.51478L16.9429 9.4004L15.0572 11.286L13.1716 9.4004ZM13.1716 9.4004L11.286 11.286L9.40038 9.4004L11.286 7.51478L13.1716 9.4004ZM22.5997 18.8285L24.4853 16.9429L22.5997 15.0573L20.7141 16.9429L22.5997 18.8285ZM22.5997 18.8285L20.7141 20.7141L22.5997 22.5997L24.4853 20.7141L22.5997 18.8285Z" fill="currentColor" />
        </svg>
    )
}