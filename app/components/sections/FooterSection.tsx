'use client'

import Image from 'next/image'
import AbstractCanvas from '@/app/components/sections/AbstractCanvas'

/* ─── Inline SVG icons ─── */
const IconDot = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="6" cy="6" r="6" fill="#471903"/>
    <circle cx="6" cy="6" r="3" fill="#FF7300"/>
  </svg>
)

const IconDiscord = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.8469 3.55341C11.9602 3.14008 11.0002 2.84008 10.0002 2.66675C9.98266 2.667 9.96588 2.67419 9.95357 2.68675C9.83357 2.90675 9.69357 3.19341 9.60024 3.41341C8.53957 3.25352 7.46092 3.25352 6.40024 3.41341C6.30691 3.18675 6.16691 2.90675 6.04024 2.68675C6.03357 2.67341 6.01357 2.66675 5.99357 2.66675C4.99357 2.84008 4.04024 3.14008 3.14691 3.55341C3.14024 3.55341 3.13357 3.56008 3.12691 3.56675C1.31357 6.28008 0.813574 8.92008 1.06024 11.5334C1.06024 11.5467 1.06691 11.5601 1.08024 11.5667C2.28024 12.4467 3.43357 12.9801 4.57357 13.3334C4.59357 13.3401 4.61357 13.3334 4.62024 13.3201C4.88691 12.9534 5.12691 12.5667 5.33357 12.1601C5.34691 12.1334 5.33357 12.1067 5.30691 12.1001C4.92691 11.9534 4.56691 11.7801 4.21357 11.5801C4.18691 11.5667 4.18691 11.5267 4.20691 11.5067C4.28024 11.4534 4.35357 11.3934 4.42691 11.3401C4.44024 11.3267 4.46024 11.3267 4.47357 11.3334C6.76691 12.3801 9.24024 12.3801 11.5069 11.3334C11.5202 11.3267 11.5402 11.3267 11.5536 11.3401C11.6269 11.4001 11.7002 11.4534 11.7736 11.5134C11.8002 11.5334 11.8002 11.5734 11.7669 11.5867C11.4202 11.7934 11.0536 11.9601 10.6736 12.1067C10.6469 12.1134 10.6402 12.1467 10.6469 12.1667C10.8602 12.5734 11.1002 12.9601 11.3602 13.3267C11.3802 13.3334 11.4002 13.3401 11.4202 13.3334C12.5669 12.9801 13.7202 12.4467 14.9202 11.5667C14.9336 11.5601 14.9402 11.5467 14.9402 11.5334C15.2336 8.51341 14.4536 5.89341 12.8736 3.56675C12.8669 3.56008 12.8602 3.55341 12.8469 3.55341ZM5.68024 9.94008C4.99357 9.94008 4.42024 9.30675 4.42024 8.52675C4.42024 7.74675 4.98024 7.11341 5.68024 7.11341C6.38691 7.11341 6.94691 7.75341 6.94024 8.52675C6.94024 9.30675 6.38024 9.94008 5.68024 9.94008ZM10.3269 9.94008C9.64024 9.94008 9.06691 9.30675 9.06691 8.52675C9.06691 7.74675 9.62691 7.11341 10.3269 7.11341C11.0336 7.11341 11.5936 7.75341 11.5869 8.52675C11.5869 9.30675 11.0336 9.94008 10.3269 9.94008Z" fill="currentColor"/>
  </svg>
)

const IconTwitter = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_tw)">
      <mask id="mask0_tw" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <path d="M0 0H16V16H0V0Z" fill="white"/>
      </mask>
      <g mask="url(#mask0_tw)">
        <path d="M12.025 1.99951H14.172L9.482 7.08211L15 13.9995H10.68L7.294 9.805L3.424 13.9995H1.275L6.291 8.5613L1 2.00046H5.43L8.486 5.83369L12.025 1.99951ZM11.27 12.7814H12.46L4.78 3.1543H3.504L11.27 12.7814Z" fill="currentColor"/>
      </g>
    </g>
    <defs>
      <clipPath id="clip0_tw">
        <rect width="16" height="16" fill="white"/>
      </clipPath>
    </defs>
  </svg>
)

const IconQuestion = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.00004 14.6668C4.31804 14.6668 1.33337 11.6822 1.33337 8.00016C1.33337 4.31816 4.31804 1.3335 8.00004 1.3335C11.682 1.3335 14.6667 4.31816 14.6667 8.00016C14.6667 11.6822 11.682 14.6668 8.00004 14.6668ZM8.00004 13.3335C9.41453 13.3335 10.7711 12.7716 11.7713 11.7714C12.7715 10.7712 13.3334 9.41465 13.3334 8.00016C13.3334 6.58567 12.7715 5.22912 11.7713 4.22893C10.7711 3.22873 9.41453 2.66683 8.00004 2.66683C6.58555 2.66683 5.229 3.22873 4.2288 4.22893C3.22861 5.22912 2.66671 6.58567 2.66671 8.00016C2.66671 9.41465 3.22861 10.7712 4.2288 11.7714C5.229 12.7716 6.58555 13.3335 8.00004 13.3335ZM7.33337 10.0002H8.66671V11.3335H7.33337V10.0002ZM8.66671 8.9035V9.3335H7.33337V8.3335C7.33337 8.15668 7.40361 7.98712 7.52864 7.86209C7.65366 7.73707 7.82323 7.66683 8.00004 7.66683C8.18943 7.66682 8.37491 7.61303 8.53492 7.51172C8.69493 7.4104 8.82288 7.26574 8.90389 7.09455C8.98489 6.92336 9.01562 6.73269 8.99249 6.54472C8.96937 6.35676 8.89334 6.17922 8.77326 6.03277C8.65318 5.88632 8.49398 5.77698 8.31419 5.71748C8.13439 5.65797 7.9414 5.65074 7.75766 5.69663C7.57392 5.74252 7.40698 5.83965 7.27628 5.97671C7.14559 6.11376 7.05649 6.28512 7.01937 6.47083L5.71137 6.20883C5.79246 5.80355 5.97971 5.42708 6.25399 5.11789C6.52826 4.8087 6.87972 4.57788 7.27243 4.44904C7.66515 4.3202 8.08503 4.29795 8.48916 4.38457C8.89329 4.47119 9.26717 4.66357 9.57259 4.94205C9.878 5.22052 10.104 5.5751 10.2274 5.96954C10.3509 6.36398 10.3674 6.78413 10.2753 7.18703C10.1831 7.58994 9.98568 7.96116 9.70305 8.26274C9.42043 8.56432 9.0628 8.78544 8.66671 8.9035Z" fill="currentColor"/>
  </svg>
)

const VectorFooter = ({ className }: { className?: string }) => (
  <svg width="224" height="50" viewBox="0 0 224 50" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M0.381836 49L41.3818 0.5H223.382" stroke="currentColor"/>
  </svg>
)

/* ─── RafluxMarquee ─── */
const RafluxMarquee = () => {
  const marqueeItems = [
    "NFTs starting from just $10!",
    "Join the wave",
    "More liquid than opensea",
    "Start selling on raflux"
  ]

  return (
    <div className="group flex overflow-hidden flex-row p-0" style={{ gap: 'var(--marquee-gap, 100px)' }}>
      <style>{`
        @keyframes raflux-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(calc(-100% - var(--marquee-gap, 100px))); }
        }
        .raflux-marquee-item {
          animation: raflux-marquee 40s linear infinite;
        }
      `}</style>
      {Array.from({ length: 10 }).map((_, index) => (
        <div key={index} className="raflux-marquee-item flex shrink-0 justify-around flex-row" style={{ gap: 'var(--marquee-gap, 100px)' }}>
          {marqueeItems.map((item, idx) => (
            <span key={idx} className="text-[10px] uppercase" style={{ color: '#747474' }}>{item}</span>
          ))}
        </div>
      ))}
    </div>
  )
}

const FooterSection = () => {
  return (
    <footer className="w-full" style={{ backgroundColor: '#171616' }}>
      <div className="lg:grid-cols-8 lg:grid" style={{ borderBottom: '1px solid #484848', minHeight: 'calc(100vh - 42px)' }}>
        <div className="hidden lg:block" style={{ borderRight: '1px solid #484848' }} />

        <div className="col-span-6 flex flex-col justify-end" style={{ borderRight: '1px solid #484848' }}>
          <div className="relative flex flex-col justify-end px-6 py-[42px] max-lg:gap-6 lg:pl-[60px] 2xl:w-fit">
            <h1 className="text-4xl font-semibold uppercase lg:text-[64px]" style={{ color: '#FFF2D3' }}>
              Decentralized raffles for digital asset
            </h1>
            <div className="-top-12 -bottom-[60px] flex h-12 items-center lg:absolute lg:right-0 lg:justify-center">
              <div className="relative max-lg:hidden">
                <div className="absolute -bottom-12 -left-6 flex items-center justify-center rounded-full" style={{ width: 52, height: 52, border: '1px dashed #FF7300' }}>
                  <div className="flex items-center justify-center rounded-full" style={{ width: 36, height: 36, border: '1px solid #FF7300' }}>
                    <div className="rounded-full" style={{ width: 16, height: 16, backgroundColor: '#FF7300' }} />
                  </div>
                </div>
                <VectorFooter className="h-12 translate-y-1/2 lg:w-[160px] 2xl:w-[224px] text-primary" />
              </div>
              <button
                className="h-12 w-[262px] text-sm bg-primary text-white font-medium uppercase transition-all hover:bg-primary/60 cursor-pointer inline-flex items-center justify-center"
                onClick={() => { window.open('https://app.raflux.io', '_blank') }}
              >
                Get Started
              </button>
            </div>
          </div>

          <div className="grid lg:h-20 lg:grid-cols-3" style={{ borderTop: '1px solid #484848', borderBottom: '1px solid #484848' }}>
            <div className="flex flex-col items-start justify-center gap-1.5 px-6 max-lg:py-4 uppercase">
              <p className="text-primary text-sm">RAFLUX @{new Date().getFullYear()}. COPYRIGHT</p>
              <p className="text-[10px]" style={{ color: '#747474' }}>ALL RIGHT RESERVED</p>
            </div>
            <div className="flex items-start px-6 max-lg:py-4 lg:items-center lg:justify-center" style={{ borderLeft: '1px solid #484848', borderRight: '1px solid #484848' }}>
              <p className="max-w-[225px] text-xs font-medium uppercase lg:text-center text-white">// Stop waiting months on traditional marketplaces</p>
            </div>
            <div className="flex flex-col items-start justify-center px-6 max-lg:py-4 lg:items-end">
              <span className="text-sm uppercase" style={{ color: '#747474' }}>contact</span>
              <button className="cursor-pointer text-[10px] uppercase transition-all duration-300 hover:text-white" style={{ color: '#747474' }}>hi@raflux.id</button>
            </div>
          </div>
          <AbstractCanvas />
        </div>

        <div />
      </div>

      <div className="flex h-[42px] w-full items-center justify-center overflow-hidden" style={{ ['--marquee-gap' as string]: '100px' }}>
        <RafluxMarquee />
      </div>

      <div className="flex w-full items-center justify-between gap-1 py-2 text-xs text-white max-lg:flex-col lg:h-[32px] lg:px-6" style={{ backgroundColor: '#171616', borderTop: '1px solid #484848', borderRadius: '12px 12px 0 0' }}>
        <div className="text-primary flex items-center space-x-4">
          <div className="flex items-center gap-1 space-x-1">
            <IconDot />
            <span>Client Network</span>
          </div>
          <div className="flex items-center gap-1 space-x-1">
            <IconDot />
            <span>Websocket Connection</span>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-xs leading-[120%]" style={{ color: '#747474' }}>
          <button onClick={() => { window.open('https://discord.com/invite/raflux', '_blank') }} className="cursor-pointer">
            <IconDiscord />
          </button>
          <button onClick={() => { window.open('https://x.com/Raflux_io', '_blank') }} className="cursor-pointer">
            <IconTwitter />
          </button>
          <span className="hidden cursor-pointer transition-all duration-300 hover:text-white lg:flex">
            Terms of Service
          </span>
          <button className="flex cursor-pointer items-center gap-[8px] transition-all duration-300 hover:text-white">
            <IconQuestion />
            <span className="hidden lg:flex">Help and Support</span>
          </button>
        </div>
      </div>
    </footer>
  )
}

export default FooterSection
