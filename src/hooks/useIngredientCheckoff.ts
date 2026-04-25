'use client'

import { useEffect, useState } from 'react'
import { SK } from '@/lib/storage-keys'

/**
 * Per-recipe per-servings ingredient check-off, persisted to localStorage.
 * Switching servings count yields a different key — checkboxes reset, by design.
 */
export function useIngredientCheckoff(slug: string, servings: number) {
  const key = SK.ingredients(slug, servings)
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key)
      setChecked(raw ? new Set(JSON.parse(raw) as string[]) : new Set())
    } catch {
      setChecked(new Set())
    }
    setHydrated(true)
  }, [key])

  function toggle(id: string) {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      try {
        localStorage.setItem(key, JSON.stringify(Array.from(next)))
      } catch {
        // localStorage full or disabled — ignore.
      }
      return next
    })
  }

  function clear() {
    setChecked(new Set())
    try {
      localStorage.removeItem(key)
    } catch {}
  }

  return { checked, toggle, clear, hydrated }
}
