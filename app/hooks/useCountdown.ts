'use client'

import { useState, useEffect } from 'react'

interface CountdownTime {
  days: number
  hours: number
  minutes: number
  seconds: number
}

/**
 * Hook buat countdown timer yang jalan tiap detik.
 * Bisa dipake di mana aja yang butuh timer mundur.
 */
export function useCountdown(initial: CountdownTime) {
  const [time, setTime] = useState(initial)

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => {
        let { days, hours, minutes, seconds } = prev
        seconds--
        if (seconds < 0) { seconds = 59; minutes-- }
        if (minutes < 0) { minutes = 59; hours-- }
        if (hours < 0) { hours = 23; days-- }
        if (days < 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
        return { days, hours, minutes, seconds }
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return time
}
