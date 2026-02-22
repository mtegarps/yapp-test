'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'

interface TypingEffectProps {
  children?: React.ReactNode
  text?: string
  className?: string
  tag?: React.ElementType
  speed?: number
  cursorClassName?: string
  startDelay?: number
}

/**
 * Typewriter effect — text muncul satu huruf satu huruf
 * lengkap sama cursor yang blink.
 */
const TypingEffect: React.FC<TypingEffectProps> = ({
  children,
  text: textProp,
  className = '',
  tag: Tag = 'p',
  speed = 50,
  cursorClassName = '',
  startDelay = 0,
}) => {
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
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isStarted, setIsStarted] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setIsStarted(true), startDelay)
      return () => clearTimeout(timer)
    }
  }, [startDelay, isInView])

  useEffect(() => {
    if (!isStarted || currentIndex >= text.length) return

    const timeout = setTimeout(() => {
      setDisplayedText(prev => prev + text[currentIndex])
      setCurrentIndex(prev => prev + 1)
    }, speed)

    return () => clearTimeout(timeout)
  }, [currentIndex, text, speed, isStarted])

  const renderTypedChildren = (
    node: React.ReactNode,
    state: { currentIndex: number }
  ): React.ReactNode => {
    return React.Children.map(node, child => {
      if (typeof child === 'string' || typeof child === 'number') {
        const str = String(child)
        const remaining = currentIndex - state.currentIndex
        const take = Math.min(str.length, Math.max(0, remaining))
        const part = str.slice(0, take)
        state.currentIndex += str.length
        return part || null
      }
      if (React.isValidElement(child)) {
        const element = child as React.ReactElement<Record<string, unknown>>
        const innerChildren = renderTypedChildren((element.props as React.PropsWithChildren).children, state)
        return React.cloneElement(element, {
          ...element.props,
          children: innerChildren,
        } as Record<string, unknown>)
      }
      return child
    })
  }

  return (
    <Tag ref={ref} className={className}>
      {children
        ? renderTypedChildren(children, { currentIndex: 0 })
        : displayedText}
      <AnimatePresence mode="wait">
        {currentIndex < text.length && (
          <motion.span
            key={currentIndex}
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: speed / 1000, ease: 'easeOut' }}
            className={`inline-block w-[3px] h-[1em] bg-white ml-1 align-middle font-bold ${cursorClassName}`}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </Tag>
  )
}

export default TypingEffect
