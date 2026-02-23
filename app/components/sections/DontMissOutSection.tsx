'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import CountdownNFT from '@/app/components/ui/CountdownNFT'
import { nftDataDummy } from '@/app/data'

/* ─── Inline SVG icons*/
const PixelArtArrowRight = ({ className }: { className?: string }) => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M7.51476 22.5997L9.40038 24.4853L20.7141 13.1716L22.5997 15.0573L24.4853 13.1716L22.5997 11.286L24.4853 9.4004L22.5997 7.51478L20.7141 9.4004L18.8285 7.51478L16.9429 9.4004L18.8285 11.286L7.51476 22.5997ZM13.1716 9.4004L15.0572 7.51478L16.9429 9.4004L15.0572 11.286L13.1716 9.4004ZM13.1716 9.4004L11.286 11.286L9.40038 9.4004L11.286 7.51478L13.1716 9.4004ZM22.5997 18.8285L24.4853 16.9429L22.5997 15.0573L20.7141 16.9429L22.5997 18.8285ZM22.5997 18.8285L20.7141 20.7141L22.5997 22.5997L24.4853 20.7141L22.5997 18.8285Z" fill="currentColor"/>
  </svg>
)

const PixelArtChevronLeft = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.998 6.99951L15.998 4.99951L13.998 4.99951L13.998 6.99951L11.998 6.99951L11.998 8.99951L9.99805 8.99951L9.99805 10.9995L7.99805 10.9995L7.99805 12.9995L9.99805 12.9995L9.99805 14.9995L11.998 14.9995L11.998 16.9995L13.998 16.9995L13.998 18.9995L15.998 18.9995L15.998 16.9995L13.998 16.9995L13.998 14.9995L11.998 14.9995L11.998 12.9995L9.99805 12.9995L9.99805 10.9995L11.998 10.9995L11.998 8.99951L13.998 8.99951L13.998 6.99951L15.998 6.99951Z" fill="currentColor"/>
  </svg>
)

const PixelArtChevronRight = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.00195 17.0005L8.00195 19.0005L10.002 19.0005L10.002 17.0005L12.002 17.0005L12.002 15.0005L14.002 15.0005L14.002 13.0005L16.002 13.0005L16.002 11.0005L14.002 11.0005L14.002 9.00049L12.002 9.00049L12.002 7.00049L10.002 7.00049L10.002 5.00049L8.00195 5.00049L8.00195 7.00049L10.002 7.00049L10.002 9.00049L12.002 9.00049L12.002 11.0005L14.002 11.0005L14.002 13.0005L12.002 13.0005L12.002 15.0005L10.002 15.0005L10.002 17.0005L8.00195 17.0005Z" fill="currentColor"/>
  </svg>
)

const TimeIcon = ({ className }: { className?: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M7.99998 1.3335C11.682 1.3335 14.6666 4.31816 14.6666 8.00016C14.6666 11.6822 11.682 14.6668 7.99998 14.6668C4.31798 14.6668 1.33331 11.6822 1.33331 8.00016C1.33331 4.31816 4.31798 1.3335 7.99998 1.3335ZM7.99998 4.00016C7.82317 4.00016 7.6536 4.0704 7.52857 4.19542C7.40355 4.32045 7.33331 4.49002 7.33331 4.66683V8.00016C7.33335 8.17696 7.40361 8.3465 7.52865 8.4715L9.52865 10.4715C9.65438 10.5929 9.82278 10.6601 9.99758 10.6586C10.1724 10.6571 10.3396 10.587 10.4632 10.4634C10.5868 10.3398 10.6569 10.1726 10.6584 9.99776C10.6599 9.82296 10.5928 9.65456 10.4713 9.52883L8.66665 7.72416V4.66683C8.66665 4.49002 8.59641 4.32045 8.47138 4.19542C8.34636 4.0704 8.17679 4.00016 7.99998 4.00016Z" fill="currentColor"/>
  </svg>
)

const RaffleIcon = ({ className }: { className?: string }) => (
  <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g clipPath="url(#clip0_raffle)">
      <path fillRule="evenodd" clipRule="evenodd" d="M3.52899 0.114746H12.6918C12.9104 0.114746 13.1124 0.219541 13.2214 0.389556L15.891 4.55203C16.0294 4.76789 15.9883 5.04035 15.7908 5.21538L8.44292 11.7291C8.2049 11.9401 7.82199 11.9401 7.58397 11.7291L0.246035 5.22419C0.0439842 5.04508 0.00614911 4.76467 0.154727 4.54747L3.00821 0.376201C3.11935 0.213749 3.31655 0.114746 3.52899 0.114746ZM11.5087 1.97315V3.14107H8.89862V3.95083C10.7318 4.03736 12.1071 4.39277 12.1173 4.81877L12.1173 5.70684C12.1071 6.13284 10.7318 6.48824 8.89862 6.57477V8.56201H7.16546V6.57477C5.33229 6.48824 3.95693 6.13284 3.94672 5.70684L3.94679 4.81877C3.95698 4.39277 5.33229 4.03736 7.16546 3.95083V3.14107H4.55534V1.97315H11.5087ZM8.03204 5.96466C9.98835 5.96466 11.6235 5.66413 12.0237 5.2628C11.6843 4.92246 10.4569 4.65462 8.89862 4.58107V5.42888C8.61931 5.44207 8.32938 5.44901 8.03204 5.44901C7.73469 5.44901 7.44475 5.44207 7.16546 5.42888V4.58107C5.60718 4.65462 4.37974 4.92246 4.0404 5.2628C4.44057 5.66413 6.07572 5.96466 8.03204 5.96466Z" fill="#FFCA6D"/>
    </g>
    <defs>
      <clipPath id="clip0_raffle">
        <rect width="16" height="12" fill="white"/>
      </clipPath>
    </defs>
  </svg>
)

const ITEM_WIDTH = 380

const ShowcaseSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMounted, setIsMounted] = useState(false)
  const [translateX, setTranslateX] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const getLimits = useCallback(() => {
    const isDesktop = typeof window !== 'undefined' ? window.innerWidth >= 1024 : false
    const maxIndex = isDesktop ? Math.max(0, nftDataDummy.length - 3) : nftDataDummy.length - 1
    return { isDesktop, maxIndex }
  }, [])

  const nextSlide = useCallback(() => {
    const { maxIndex } = getLimits()
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }, [getLimits])

  const prevSlide = useCallback(() => {
    const { maxIndex } = getLimits()
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
  }, [getLimits])

  useEffect(() => {
    setIsMounted(true)
    const interval = setInterval(nextSlide, 3000)
    return () => clearInterval(interval)
  }, [nextSlide])

  useEffect(() => {
    const handleResize = () => {
      const { maxIndex } = getLimits()
      setCurrentIndex((prev) => Math.min(prev, maxIndex))
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [getLimits])

  // Calculate translation based on currentIndex
  useEffect(() => {
    if (typeof window === 'undefined') return
    const { isDesktop } = getLimits()
    const translationValue = isDesktop ? ITEM_WIDTH : (window.innerWidth - 48 + 24)
    setTranslateX(-currentIndex * translationValue)
  }, [currentIndex, getLimits])

  return (
    <section style={{ backgroundColor: '#0B0B0B' }}>
      <div className="grid" style={{ borderTop: '1px solid #2c2c2c', borderBottom: '1px solid #2c2c2c' }}>
        {/* ─── Don't Miss Out header ─── */}
        <div className="relative grid gap-6 max-lg:px-6 lg:h-[580px] lg:grid-cols-8">
          {/* Grid overlay columns */}
          <div className="absolute inset-0 grid grid-cols-6 lg:grid-cols-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className={`h-full ${index !== 0 && index !== 3 ? "col-span-2 grid grid-cols-2 lg:col-span-3" : ""}`} style={{ borderRight: '1px solid #2c2c2c' }}>
                {index !== 0 && index !== 3 && Array.from({ length: 2 }).map((_, subIndex) => (
                  <div key={subIndex} className="h-full hidden lg:block" style={{ borderRight: '1px solid #2c2c2c' }} />
                ))}
              </div>
            ))}
          </div>
          <div className="h-full w-full max-lg:hidden" />
          <div className="relative z-10 col-span-6 flex h-full w-full items-center justify-between py-[58px] max-lg:flex-col max-lg:gap-6">
            <div className="flex w-full gap-6 max-lg:flex-col lg:gap-[136px]">
              <div className="w-full space-y-11 border px-8 py-6 lg:-ml-5 lg:max-w-[462px]" style={{ borderColor: '#484848', backgroundColor: '#201f1f' }}>
                <div className="font-semibold text-lg uppercase text-primary flex items-center w-fit justify-center gap-2 text-nowrap" style={{ padding: '5.6px 18px', backgroundColor: 'rgba(255, 115, 0, 0.1)' }}>
                  For Sellers
                </div>
                <h1 className="text-4xl leading-[120%] font-semibold uppercase lg:text-[80px]" style={{ color: '#FFF2D3' }}>
                  Don&apos;t Miss Out
                </h1>
              </div>
              <p className="text-right text-sm uppercase max-lg:hidden lg:max-w-[143px]" style={{ color: '#747474' }}>
                // EVM Compatible (Base)
              </p>
            </div>
            <div className="flex flex-col justify-between max-lg:w-full max-lg:gap-2 lg:h-full lg:items-end">
              <button
                className="group text-primary flex cursor-pointer items-center gap-4 text-2xl font-medium text-nowrap uppercase"
                onClick={() => { window.open('https://app.raflux.io', '_blank') }}
              >
                <div className="overflow-hidden">
                  <span>BROWSE RAFLUX</span>
                </div>
                <div className="border p-2" style={{ borderColor: '#484848', backgroundColor: '#201f1f' }}>
                  <PixelArtArrowRight className="text-primary ml-auto" />
                </div>
              </button>
              <p className="mr-2 text-right text-sm uppercase max-lg:hidden lg:max-w-[101px]" style={{ color: '#747474' }}>// chainlink vrf</p>
            </div>
          </div>
        </div>

        {/* ─── Carousel section ─── */}
        <div className="relative grid overflow-x-hidden max-lg:w-full max-lg:py-6 lg:h-[580px] lg:grid-cols-8" style={{ borderTop: '1px solid #2c2c2c' }}>
          {/* Grid overlay columns */}
          <div className="absolute inset-0 grid grid-cols-6 lg:grid-cols-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className={`h-full ${index !== 0 && index !== 3 ? "col-span-2 grid grid-cols-2 lg:col-span-3" : ""}`} style={{ borderRight: '1px solid #2c2c2c' }}>
                {index !== 0 && index !== 3 && <div className="h-full hidden lg:block" style={{ borderRight: '1px solid #2c2c2c' }} />}
              </div>
            ))}
          </div>

          <div />

          <div className="relative z-10 col-span-7 flex w-full gap-6 max-lg:flex-col max-lg:justify-center lg:items-center">
            {/* Navigation buttons */}
            <div className="z-10 flex items-center -space-x-px max-lg:px-6 lg:-translate-x-[calc(50%+0.5px)]">
              <button
                onClick={prevSlide}
                className="flex h-[150px] w-[60px] cursor-pointer items-center justify-center border-x border-y transition-all duration-300 hover:z-10 hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                style={{ backgroundColor: '#171616', borderColor: '#2c2c2c', color: '#FFF2D3' }}
              >
                <PixelArtChevronLeft />
              </button>
              <button
                onClick={nextSlide}
                className="flex h-[150px] w-[60px] cursor-pointer items-center justify-center border-x border-y transition-all duration-300 hover:z-10 hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                style={{ backgroundColor: '#171616', borderColor: '#2c2c2c', color: '#FFF2D3' }}
              >
                <PixelArtChevronRight />
              </button>
            </div>

            {/* Carousel container */}
            <div className="relative w-full overflow-hidden" style={{ borderLeft: '1px solid #2c2c2c' }}>
              <motion.div
                ref={containerRef}
                className="flex h-[580px] max-lg:gap-6 max-lg:px-6"
                animate={{ x: translateX }}
                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
              >
                {/* Products */}
                {nftDataDummy.map((item, index) => (
                  <div key={index} className="flex h-[580px] w-[calc(100vw-48px)] flex-col lg:w-[380px] lg:min-w-[380px]" style={{ border: '1px solid #2c2c2c', borderTop: 'none', borderLeft: 'none' }}>
                    <div className="flex w-full flex-col items-end gap-2.5 px-7 py-4" style={{ backgroundColor: '#201f1f', borderBottom: '1px solid #2c2c2c' }}>
                      {/* Countdown */}
                      <CountdownNFT endDate={item.saleEnd} />
                      {/* Progress */}
                      <div className="relative h-[6px] w-full rounded-full" style={{ backgroundColor: 'rgb(67, 20, 0)' }}>
                        <div
                          className="absolute inset-0 h-full rounded-full"
                          style={item.sold > 0 ? { boxShadow: 'rgb(255, 115, 0) 0px 0px 4px 2px', width: `${(item.sold / item.quota) * 100}%`, background: 'rgb(255, 214, 181)' } : undefined}
                        />
                      </div>
                    </div>

                    <div className="flex h-full flex-col justify-between px-7 py-5" style={{ backgroundColor: '#201f1f' }}>
                      <div className="space-y-4">
                        <Image src={item.image} alt={item.name} loading="lazy" width={500} height={500} className="aspect-square h-[300px] lg:h-[321px] w-full lg:w-[321px] object-cover" />
                        <div className="space-y-2">
                          <h2 className="text-xl font-medium" style={{ color: '#FFF2D3' }}>{item.name}</h2>
                          <div className="flex items-center gap-2 text-sm" style={{ color: '#878787' }}>
                            <TimeIcon className="w-4 h-4" />
                            <p>Sale Ended</p>
                            <p className="text-xs font-semibold" style={{ color: 'white' }}>
                              {isMounted ? new Date(item.saleEnd).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                              }) : '...'}
                            </p>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => { window.open('https://app.raflux.io', '_blank') }}
                        className="flex h-12 w-full items-center justify-between gap-2 px-4 bg-primary text-white text-sm font-medium uppercase transition-all hover:bg-primary/60 cursor-pointer"
                      >
                        Start Raffling Now
                        <div className="flex items-center justify-center gap-1 text-sm" style={{ color: '#FFCA6D' }}>
                          {item.rafflePrice}
                          <RaffleIcon className="mt-0.5" />
                        </div>
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Trapezoid spacer (bottom) ─── */}
      <div className="grid h-[200px] grid-cols-8 max-lg:hidden">
        <div className="col-span-3" style={{ borderRight: '1px solid #2c2c2c' }} />
        <div className="relative col-span-4 flex items-center justify-center" style={{ borderRight: '1px solid #2c2c2c' }}>
          <div className="absolute top-full h-12 w-[550px]" style={{ backgroundColor: '#0B0B0B', clipPath: 'polygon(0% 0px, 100% 0px, 90% 100%, 10% 100%)' }} />
        </div>
      </div>
    </section>
  )
}

export default ShowcaseSection
