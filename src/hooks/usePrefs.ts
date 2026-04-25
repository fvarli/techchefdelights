'use client'

import { useEffect, useState } from 'react'
import { SK } from '@/lib/storage-keys'

export type UserPrefs = {
  allergies: string[] // allergen slugs
  unitSystem: 'metric' | 'us'
}

const DEFAULT: UserPrefs = { allergies: [], unitSystem: 'metric' }

export function usePrefs(): {
  prefs: UserPrefs
  update: (partial: Partial<UserPrefs>) => void
  hydrated: boolean
} {
  const [prefs, setPrefs] = useState<UserPrefs>(DEFAULT)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SK.prefs)
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<UserPrefs>
        setPrefs({ ...DEFAULT, ...parsed })
      }
    } catch {
      // ignore
    }
    setHydrated(true)
  }, [])

  function update(partial: Partial<UserPrefs>) {
    setPrefs((prev) => {
      const next = { ...prev, ...partial }
      try {
        localStorage.setItem(SK.prefs, JSON.stringify(next))
      } catch {}
      return next
    })
  }

  return { prefs, update, hydrated }
}
