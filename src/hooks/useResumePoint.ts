'use client'

import { useCallback, useEffect, useState } from 'react'
import { SK } from '@/lib/storage-keys'

export type ResumePoint = {
  stepIndex: number
  updatedAt: string
}

/**
 * Per-recipe cook-mode resume point in localStorage. Allows the recipe detail
 * page to surface a "Resume from step N" banner when the user paused mid-cook.
 */
export function useResumePoint(slug: string): {
  point: ResumePoint | null
  save: (stepIndex: number) => void
  clear: () => void
  hydrated: boolean
} {
  const key = SK.resumePoint(slug)
  const [point, setPoint] = useState<ResumePoint | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key)
      if (raw) {
        setPoint(JSON.parse(raw) as ResumePoint)
      } else {
        setPoint(null)
      }
    } catch {
      setPoint(null)
    }
    setHydrated(true)
  }, [key])

  const save = useCallback(
    (stepIndex: number) => {
      const next: ResumePoint = {
        stepIndex,
        updatedAt: new Date().toISOString(),
      }
      setPoint(next)
      try {
        localStorage.setItem(key, JSON.stringify(next))
      } catch {}
    },
    [key],
  )

  const clear = useCallback(() => {
    setPoint(null)
    try {
      localStorage.removeItem(key)
    } catch {}
  }, [key])

  return { point, save, clear, hydrated }
}
