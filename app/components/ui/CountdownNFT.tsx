'use client'

import { useEffect, useState, useMemo, Fragment } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface CountdownNFTProps {
  endDate: string
}

const CountdownNumber = ({ value }: { value: number }) => {
  return (
    <div className="relative flex h-[1.5em] items-center justify-center overflow-hidden">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}

const CountdownNFT = ({ endDate }: CountdownNFTProps) => {
  const targetDate = useMemo(() => new Date(`${endDate}T00:00:00`).getTime(), [endDate])
  const [timeLeft, setTimeLeft] = useState(0)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    setTimeLeft(Math.max(0, targetDate - Date.now()))

    const interval = setInterval(() => {
      setTimeLeft(Math.max(0, targetDate - Date.now()))
    }, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  if (!isMounted) {
    return (
      <div className="text-primary flex w-fit items-center justify-center gap-2 text-sm font-medium opacity-0">
        0D:0H:0M:0S
      </div>
    )
  }

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
  const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60)
  const seconds = Math.floor((timeLeft / 1000) % 60)

  const units = [
    { label: 'D', value: days },
    { label: 'H', value: hours },
    { label: 'M', value: minutes },
    { label: 'S', value: seconds },
  ]

  return (
    <div className="text-primary flex w-fit items-center justify-center gap-2 text-sm font-medium">
      {units.map((unit, index) => (
        <Fragment key={unit.label}>
          <div className="relative inline-flex items-center overflow-hidden text-center">
            <CountdownNumber value={unit.value} />
            <span>{unit.label}</span>
          </div>
          {index !== units.length - 1 && <span>:</span>}
        </Fragment>
      ))}
    </div>
  )
}

export default CountdownNFT
