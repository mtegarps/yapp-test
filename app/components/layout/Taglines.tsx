import Link from 'next/link'
import Marquee from '@/app/components/ui/Marquee'
import { TAGLINES } from '@/app/data'

export default function Taglines() {
  return (
    <>
      {/* Scrolling tagline marquee */}
      <section
        className="w-full bg-bg-surface2 overflow-hidden border-b border-border py-3.5 [--gap:50px] md:[--gap:200px] lg:[--gap:200px] xl:[--gap:200px] isolate"
        style={{ clipPath: 'inset(0)' }}
      >
        <Marquee baseVelocity={1.5} gap="var(--gap)">
          {TAGLINES.map(tagline => (
            <p
              key={tagline}
              className="text-center text-[10px] text-foreground-muted whitespace-nowrap"
            >
              {tagline}
            </p>
          ))}
        </Marquee>
      </section>

      {/* Status bar — di mobile cuma icon, di desktop full label */}
      <div
        className="flex items-center justify-between px-2 md:px-4 overflow-hidden"
        style={{ background: '#181717', height: 32, borderTop: '1px solid #484848' }}
      >
        {/* Kiri: status indicators — di mobile hide label kedua */}
        <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
          <StatusIndicator label="Client Network" showLabel />
          <StatusIndicator label="Websocket" showLabel={false} />
        </div>

        {/* Kanan: social links & info — di mobile hide text links */}
        <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
          <Link href="#" className="transition-colors flex-shrink-0" style={{ color: '#7C7C7C' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.046.046 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.028-.07 8.735 8.735 0 0 1-1.248-.595.05.05 0 0 1-.005-.084c.084-.063.168-.129.248-.195a.048.048 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.047.047 0 0 1 .053.007c.08.066.164.132.248.195a.05.05 0 0 1-.004.085c-.399.233-.813.44-1.249.594a.05.05 0 0 0-.027.07c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Z" />
            </svg>
          </Link>

          <Link href="#" className="transition-colors flex-shrink-0" style={{ color: '#7C7C7C' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </Link>

          {/* Text links — hide di mobile */}
          <Link
            href="#"
            className="hidden md:block transition-colors"
            style={{ fontFamily: "'Kode Mono', monospace", fontSize: 12, fontWeight: 400, color: '#7C7C7C' }}
          >
            Terms of Service
          </Link>

          <Link
            href="#"
            className="hidden md:flex items-center gap-2 transition-colors"
            style={{ fontFamily: "'Kode Mono', monospace", fontSize: 12, fontWeight: 400, color: '#7C7C7C' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1" />
              <path
                d="M6 6.5C6 5.67 6.67 5 7.5 5C8.33 5 9 5.67 9 6.5C9 7.17 8.5 7.5 7.5 7.5V8.5"
                stroke="currentColor" strokeWidth="1" strokeLinecap="round"
              />
              <circle cx="7.5" cy="10.5" r="0.75" fill="currentColor" />
            </svg>
            Help and Support
          </Link>
        </div>
      </div>
    </>
  )
}

// Status indicator — showLabel controls apakah text keliatan di mobile
function StatusIndicator({ label, showLabel = true }: { label: string; showLabel?: boolean }) {
  return (
    <div className="flex items-center gap-1">
      <div className="relative flex-shrink-0" style={{ width: 12, height: 12 }}>
        <div className="absolute inset-0 rounded-full" style={{ background: '#471903' }} />
        <div
          className="absolute rounded-full"
          style={{ width: 6, height: 6, top: 3, left: 3, background: '#FF7300' }}
        />
      </div>
      <span
        className={showLabel ? '' : 'hidden md:inline'}
        style={{
          fontFamily: "'Kode Mono', monospace",
          fontSize: 12,
          fontWeight: 500,
          color: '#FF7300',
          lineHeight: 1,
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
    </div>
  )
}
