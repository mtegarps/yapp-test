'use client'

import React, { useEffect, useRef, useState } from 'react'

// ── Style injected once globally, not per-instance ──
const STYLE_ID = 'neon-blast-styles'
function injectStyles() {
  if (typeof document === 'undefined') return
  if (document.getElementById(STYLE_ID)) return
  const el = document.createElement('style')
  el.id = STYLE_ID
  el.textContent = `
    @keyframes neon-blast {
      0%   { opacity: 0; filter: brightness(1); text-shadow: none; }
      8%   { opacity: 1; filter: brightness(12) saturate(1.5);
             text-shadow: 0 0 2px #fff, 0 0 8px #fff, 0 0 20px #fff,
               0 0 40px #fff, 0 0 80px rgba(255,255,255,0.8), 0 0 140px rgba(255,255,255,0.5); }
      30%  { filter: brightness(6);
             text-shadow: 0 0 4px #fff, 0 0 16px #fff, 0 0 40px rgba(255,255,255,0.6); }
      100% { opacity: 1; filter: brightness(1); text-shadow: none; }
    }
    .ns-char          { display: inline-block; opacity: 0; }
    .ns-char.ns-visible { opacity: 1; }
    .ns-char.ns-flash   { animation: neon-blast 500ms cubic-bezier(0.16,1,0.3,1) forwards; }
  `
  document.head.appendChild(el)
}

interface CharacterFadeEffectProps {
  children?: React.ReactNode
  text?: string
  className?: string
  tag?: React.ElementType
  charDelay?: number
  baseDelay?: number
  flashDuration?: number
  trigger?: 'inview' | 'mount'
}

const CharacterFadeEffect: React.FC<CharacterFadeEffectProps> = ({
  children,
  text: textProp,
  className = '',
  tag: Tag = 'p',
  charDelay = 45,
  baseDelay = 200,
  flashDuration = 500,
  trigger = 'inview',
}) => {
  const text = textProp || (typeof children === 'string' ? children : '')

  // Kalau children adalah JSX (bukan string), render langsung tanpa animasi
  if (!text) {
    return <Tag className={className}>{children}</Tag>
  }

  const chars = Array.from(text)

  const [visibleCount, setVisibleCount] = useState(0)
  const [flashIndex, setFlashIndex] = useState<number | null>(null)
  const containerRef = useRef<HTMLElement>(null)
  const hasStarted = useRef(false)

  useEffect(() => { injectStyles() }, [])

  const startAnimation = () => {
    if (hasStarted.current) return
    hasStarted.current = true
    chars.forEach((_, i) => {
      setTimeout(() => {
        setVisibleCount(i + 1)
        setFlashIndex(i)
        setTimeout(() => {
          setFlashIndex(prev => (prev === i ? null : prev))
        }, flashDuration)
      }, baseDelay + i * charDelay)
    })
  }

  useEffect(() => {
    if (trigger === 'mount') { startAnimation(); return }
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { startAnimation(); observer.disconnect() } },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Tag ref={containerRef} className={className} aria-label={text}>
      {chars.map((char, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={[
            'ns-char',
            i < visibleCount ? 'ns-visible' : '',
            flashIndex === i ? 'ns-flash' : '',
          ].filter(Boolean).join(' ')}
          style={{ whiteSpace: char === ' ' ? 'pre' : undefined }}
        >
          {char}
        </span>
      ))}
    </Tag>
  )
}

export default CharacterFadeEffect