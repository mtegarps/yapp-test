'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useInView } from 'framer-motion'

interface RandomizedTextEffectProps {
  children?: React.ReactNode
  text?: string
  className?: string
  tag?: React.ElementType
  duration?: number
  revealSpeed?: number
  randomChars?: string
}

/**
 * Text effect yang bikin huruf-hurufnya scramble random dulu
 * sebelum akhirnya nge-reveal text aslinya.
 * Trigger pas element masuk viewport.
 */
const RandomizedTextEffect: React.FC<RandomizedTextEffectProps> = ({
  children,
  text: textProp,
  className = '',
  tag: Tag = 'p',
  duration = 600,
  revealSpeed = 30,
  randomChars,
}) => {
  // Extract text dari children kalo gak dikasih prop text langsung
  const extractText = (node: React.ReactNode): string => {
    let result = ''
    React.Children.forEach(node, child => {
      if (typeof child === 'string' || typeof child === 'number') {
        result += String(child)
      } else if (React.isValidElement(child)) {
        result += extractText((child as React.ReactElement<Record<string, unknown>>).props.children as React.ReactNode)
      }
    })
    return result
  }

  const text = textProp || extractText(children)
  const [displayedText, setDisplayedText] = useState('')
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  const scramble = useCallback(() => {
    // Pake karakter dari text aslinya biar width-nya konsisten
    const charPool =
      randomChars ||
      Array.from(new Set(text.split('')))
        .filter(c => c !== ' ')
        .join('') ||
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

    let iteration = 0

    const interval = setInterval(() => {
      const newText = text
        .split('')
        .map((letter, index) => {
          if (index < iteration) return text[index]
          if (text[index] === ' ') return ' '
          return charPool[Math.floor(Math.random() * charPool.length)]
        })
        .join('')

      setDisplayedText(newText)

      if (iteration >= text.length) clearInterval(interval)
      iteration += text.length / (duration / revealSpeed)
    }, revealSpeed)

    return () => clearInterval(interval)
  }, [text, duration, revealSpeed, randomChars])

  useEffect(() => {
    if (isInView) return scramble()
  }, [scramble, isInView])

  // Render scrambled text sambil preserve children structure (kalo ada nested elements)
  const renderScrambledChildren = (
    node: React.ReactNode,
    state: { currentIndex: number }
  ): React.ReactNode => {
    return React.Children.map(node, child => {
      if (typeof child === 'string' || typeof child === 'number') {
        const str = String(child)
        const scrambledPart = (displayedText || '').slice(
          state.currentIndex,
          state.currentIndex + str.length
        )
        state.currentIndex += str.length
        return scrambledPart
      }
      if (React.isValidElement(child)) {
        const element = child as React.ReactElement<Record<string, unknown>>
        return React.cloneElement(element, {
          ...element.props,
          children: renderScrambledChildren((element.props as React.PropsWithChildren).children, state),
        } as Record<string, unknown>)
      }
      return child
    })
  }

  return (
    <Tag ref={ref} className={className}>
      {children
        ? renderScrambledChildren(children, { currentIndex: 0 })
        : displayedText}
    </Tag>
  )
}

export default RandomizedTextEffect
