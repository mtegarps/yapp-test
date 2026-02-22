'use client'

import Link from 'next/link'
import RandomizedTextEffect from '@/app/components/effects/RandomizedTextEffect'

export default function DontMissOutSection() {
  return (
    <section className="relative bg-bg border-t border-b border-border section-shadow">
      {/* 5-column grid lines background — hide di mobile biar gak menuh-menuhin */}
      <div className="absolute inset-0 hidden md:grid grid-cols-5 pointer-events-none">
        <div className="border-r border-border" />
        <div className="border-r border-border" />
        <div className="border-r border-border" />
        <div className="border-r border-border" />
        <div />
      </div>

      {/* === MOBILE LAYOUT (< md) === */}
      <div className="relative z-10 flex flex-col p-6 gap-6 md:hidden">
        {/* Browse Raflux */}
        <div className="flex items-center justify-end gap-2.5">
          <span className="text-foreground text-[13px] font-bold uppercase tracking-wide">
            BROWSE RAFLUX
          </span>
          <Link
            href="#"
            className="flex items-center justify-center w-8 h-8 bg-bg-surface border border-border"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M4 10L10 4M10 4H5.5M10 4V8.5" stroke="#FF7300" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        {/* EVM + Chainlink labels side by side */}
        <div className="flex justify-between">
          <p className="text-foreground-muted text-[11px] font-medium uppercase leading-relaxed tracking-wider">
            // EVM COMPATIBLE<br />(BASE)
          </p>
          <p className="text-foreground-muted text-[11px] font-medium uppercase text-right leading-relaxed tracking-wider">
            // CHAINLINK<br />VRF
          </p>
        </div>

        {/* Main CTA card */}
        <div className="bg-bg-surface p-6">
          <div className="mb-5">
            <span className="text-primary text-[11px] font-bold uppercase px-3.5 py-1.5 border border-primary/40 bg-primary/10 inline-block tracking-wider">
              FOR SELLERS
            </span>
          </div>
          <RandomizedTextEffect
            tag="h2"
            className="text-primary-light text-[32px] md:text-[40px] font-bold uppercase leading-[0.95] tracking-tight"
            duration={800}
            revealSpeed={35}
          >
            DON&apos;T MISS OUT
          </RandomizedTextEffect>
        </div>
      </div>

      {/* === DESKTOP LAYOUT (>= md) — original absolute positioning === */}
      <div className="relative z-10 min-h-[520px] lg:min-h-[580px] hidden md:block">
        {/* Browse Raflux — top right */}
        <div className="absolute top-6 right-6 flex items-center gap-2.5">
          <span className="text-foreground text-[13px] font-bold uppercase tracking-wide">
            BROWSE RAFLUX
          </span>
          <Link
            href="#"
            className="flex items-center justify-center w-8 h-8 bg-bg-surface border border-border"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M4 10L10 4M10 4H5.5M10 4V8.5" stroke="#FF7300" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        {/* EVM Compatible label */}
        <div className="absolute top-[120px] left-[50%] -translate-x-[10%]">
          <p className="text-foreground-muted text-[11px] font-medium uppercase text-center leading-relaxed tracking-wider">
            // EVM COMPATIBLE<br />(BASE)
          </p>
        </div>

        {/* Chainlink VRF label */}
        <div className="absolute bottom-8 right-8">
          <p className="text-foreground-muted text-[11px] font-medium uppercase text-right leading-relaxed tracking-wider">
            // CHAINLINK<br />VRF
          </p>
        </div>

        {/* Main CTA card */}
        <div className="absolute bottom-0 left-0 w-[40%] max-w-[580px] min-w-[320px]">
          <div className="bg-bg-surface m-6 lg:m-8 p-6 lg:p-8">
            <div className="mb-5">
              <span className="text-primary text-[11px] font-bold uppercase px-3.5 py-1.5 border border-primary/40 bg-primary/10 inline-block tracking-wider">
                FOR SELLERS
              </span>
            </div>

            <RandomizedTextEffect
              tag="h2"
              className="text-primary-light text-[48px] md:text-[60px] lg:text-[72px] font-bold uppercase leading-[0.95] tracking-tight"
              duration={800}
              revealSpeed={35}
            >
              DON&apos;T MISS OUT
            </RandomizedTextEffect>
          </div>
        </div>
      </div>
    </section>
  )
}
