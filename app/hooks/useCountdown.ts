'use client'

import { useState, useEffect, useRef } from 'react'

interface CountdownTime {
  days: number
  hours: number
  minutes: number
  seconds: number
}

/**
 * Hook buat countdown timer yang jalan tiap detik.
 * Optimized: uses ref to avoid closure stale state.
 */
export function useCountdown(initial: CountdownTime) {
  const [time, setTime] = useState(initial)
  const timeRef = useRef(initial)

  useEffect(() => {
    const interval = setInterval(() => {
      const prev = timeRef.current
      let { days, hours, minutes, seconds } = prev
      seconds--
      if (seconds < 0) { seconds = 59; minutes-- }
      if (minutes < 0) { minutes = 59; hours-- }
      if (hours < 0) { hours = 23; days-- }
      if (days < 0) {
        clearInterval(interval)
        const zero = { days: 0, hours: 0, minutes: 0, seconds: 0 }
        timeRef.current = zero
        setTime(zero)
        return
      }
      const next = { days, hours, minutes, seconds }
      timeRef.current = next
      setTime(next)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return time
}
