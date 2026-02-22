'use client'

import Link from 'next/link'
import RandomizedTextEffect from '@/app/components/effects/RandomizedTextEffect'
import AbstractCanvas from '@/app/components/sections/AbstractCanvas'

export default function FooterSection() {
  return (
    <footer className="relative bg-[#171616]">
      <div className="relative mx-auto max-w-[1440px]">
        {/* Main area — CTA + Crosshair + Title */}
        <div
          className="relative mx-4 md:mx-6 lg:mx-[157px]"
          style={{
            borderWidth: '0px 1px 1px 1px',
            borderStyle: 'solid',
            borderColor: '#484848',
            minHeight: '350px',
          }}
        >
          {/* Notch kanan atas — scale down di mobile */}
          <div
            className="absolute top-0 right-0 bg-[#0B0B0B] z-10 w-[200px] md:w-[380px] lg:w-[553px] h-[35px] md:h-[49px]"
            style={{
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 8% 100%)',
            }}
          />

          {/* CTA button + crosshair line */}
          <div className="absolute top-0 right-0 z-30 flex">
            <div className="relative">
              {/* Crosshair SVG — hide di mobile, terlalu lebar */}
              <svg
                className="absolute text-primary pointer-events-none z-0 hidden md:block"
                style={{ width: '400px', height: '150px', right: '100%', top: '0' }}
                viewBox="0 0 400 150"
                fill="none"
              >
                <path d="M 400 24.5 H 150 L 100 74.5" stroke="currentColor" strokeWidth="1" />
                <g transform="translate(100, 74.5)">
                  <circle cx="0" cy="0" r="22" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" />
                  <circle cx="0" cy="0" r="8" stroke="currentColor" strokeWidth="1" />
                  <circle cx="0" cy="0" r="4" fill="currentColor" />
                </g>
              </svg>
              <Link
                href="#"
                className="relative z-10 flex items-center justify-center bg-primary text-white text-[11px] md:text-[13px] font-bold uppercase px-6 md:px-12 tracking-wider hover:bg-primary/90 transition-colors rounded-none"
                style={{ height: '49px' }}
              >
                GET STARTED
              </Link>
            </div>
          </div>

          <div className="relative z-20 flex flex-col h-full min-h-[350px] px-4 md:px-10 lg:px-[60px]">
            <div className="mt-auto pb-[30px] md:pb-[50px]">
              <RandomizedTextEffect
                tag="h2"
                className="text-primary-light text-[28px] md:text-[48px] lg:text-[72px] font-bold uppercase leading-[1.0] tracking-tight max-w-[900px]"
                duration={1000}
                revealSpeed={35}
              >
                DECENTRALIZED RAFFLES FOR DIGITAL ASSET
              </RandomizedTextEffect>
            </div>
          </div>
        </div>

        {/* Info bar — stack vertical di mobile */}
        <div
          className="relative mx-4 md:mx-6 lg:mx-[157px] grid grid-cols-1 md:grid-cols-3"
          style={{
            minHeight: '80px',
            borderWidth: '0px 1px 1px 1px',
            borderStyle: 'solid',
            borderColor: '#484848',
          }}
        >
          <div className="flex flex-col justify-center px-4 md:px-8 py-3 md:py-0 border-b md:border-b-0 md:border-r border-[#484848]">
            <p className="text-primary text-[11px] font-bold uppercase tracking-wider">RAFLUX @2026. COPYRIGHT</p>
            <p className="text-foreground-muted text-[11px] font-medium mt-0.5 uppercase tracking-wide">ALL RIGHT RESERVED</p>
          </div>
          <div className="flex items-center justify-center px-4 md:px-8 py-3 md:py-0 border-b md:border-b-0 md:border-r border-[#484848]">
            <p className="text-foreground-muted text-[11px] font-medium text-center uppercase tracking-wide leading-relaxed">
              // STOP WAITING MONTHS ON<br />TRADITIONAL MARKETPLACES
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end justify-center px-4 md:px-8 py-3 md:py-0">
            <p className="text-foreground text-[11px] font-bold uppercase tracking-wider">CONTACT</p>
            <p className="text-foreground-muted text-[11px] font-medium mt-0.5">hi@raflux.io</p>
          </div>
        </div>

        {/* Abstract canvas — scale height di mobile */}
        <div
          className="relative mx-4 md:mx-6 lg:mx-[157px] overflow-hidden h-[150px] md:h-[210px]"
          style={{
            borderWidth: '0px 1px 0px 1px',
            borderStyle: 'solid',
            borderColor: '#484848',
          }}
        >
          <AbstractCanvas />
        </div>
      </div>
    </footer>
  )
}
