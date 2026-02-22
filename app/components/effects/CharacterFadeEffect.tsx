'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface CharacterFadeEffectProps {
  children?: React.ReactNode
  text?: string
  className?: string
  tag?: React.ElementType
  staggerDelay?: number
  baseDelay?: number
}

/**
 * Efek fade-in per karakter dengan blur.
 * Tiap huruf muncul satu-satu dari blur ke jelas,
 * bikin kesan typing futuristik.
 */
const CharacterFadeEffect: React.FC<CharacterFadeEffectProps> = ({
  children,
  text: textProp,
  className = '',
  tag: Tag = 'p',
  staggerDelay = 0.03,
  baseDelay = 0.5,
}) => {
  const text = textProp || (typeof children === 'string' ? children : '')

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: baseDelay,
      },
    },
  }

  const childVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' as const },
    },
  }

  // Optimize: animate per-word instead of per-character to reduce DOM nodes
  const renderAnimatedChildren = (node: React.ReactNode): React.ReactNode => {
    return React.Children.map(node, child => {
      if (typeof child === 'string') {
        // Split by spaces, animate each word
        const words = child.split(/(\s+)/)
        return words.map((word, index) => {
          if (word.match(/^\s+$/)) {
            return <span key={`space-${index}`} style={{ whiteSpace: 'pre' }}>{word}</span>
          }
          return (
            <motion.span
              key={index}
              variants={childVariants}
              className="inline-block"
            >
              {word}
            </motion.span>
          )
        })
      }
      if (React.isValidElement(child)) {
        const element = child as React.ReactElement<Record<string, unknown>>
        return React.cloneElement(element, {
          ...element.props,
          children: renderAnimatedChildren((element.props as React.PropsWithChildren).children),
        } as Record<string, unknown>)
      }
      return child
    })
  }

  return (
    <Tag className={className}>
      <motion.span
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        aria-label={typeof text === 'string' ? text : undefined}
        className="relative inline-block"
      >
        {children ? renderAnimatedChildren(children) : renderAnimatedChildren(text)}
      </motion.span>
    </Tag>
  )
}

export default CharacterFadeEffect
