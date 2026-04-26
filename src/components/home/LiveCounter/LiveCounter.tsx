'use client'

import { useEffect, useState } from 'react'
import styles from './LiveCounter.module.css'

type Props = {
  initial: number
  ttlSeconds: number
  label: string
}

/**
 * Polls /api/v1/live every ttlSeconds. Server-rendered with `initial` so
 * there's no flicker; hydrates and starts polling client-side.
 */
export function LiveCounter({ initial, ttlSeconds, label }: Props) {
  const [count, setCount] = useState(initial)

  useEffect(() => {
    let cancelled = false

    async function fetchCount() {
      try {
        const res = await fetch('/api/v1/live', { cache: 'no-store' })
        if (!res.ok) return
        const data = (await res.json()) as { nowCooking: number }
        if (!cancelled) setCount(data.nowCooking)
      } catch {
        // network error — keep last value
      }
    }

    const id = window.setInterval(fetchCount, Math.max(ttlSeconds, 5) * 1000)
    return () => {
      cancelled = true
      window.clearInterval(id)
    }
  }, [ttlSeconds])

  return (
    <span className={styles.counter}>
      <span className={styles.dot} aria-hidden />
      <span className={styles.num}>{count.toLocaleString()}</span>
      <span className={styles.label}>{label}</span>
    </span>
  )
}
