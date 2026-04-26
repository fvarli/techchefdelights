'use client'

import { useCallback, useEffect, useState } from 'react'
import { SK } from '@/lib/storage-keys'

/**
 * v1 logged-out save — backed by localStorage `tcd:saves` (string[] of slugs).
 * Hook contract is the same shape v2 will use when wired to a server endpoint
 * (POST /api/v1/saves), so call-sites won't change.
 */
export function useSaveRecipe(slug: string): {
  saved: boolean
  toggle: () => void
  hydrated: boolean
} {
  const [saved, setSaved] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SK.saves)
      const list = raw ? (JSON.parse(raw) as string[]) : []
      setSaved(list.includes(slug))
    } catch {
      setSaved(false)
    }
    setHydrated(true)
  }, [slug])

  const toggle = useCallback(() => {
    setSaved((prev) => {
      const next = !prev
      try {
        const raw = localStorage.getItem(SK.saves)
        const list = raw ? (JSON.parse(raw) as string[]) : []
        const updated = next
          ? Array.from(new Set([...list, slug]))
          : list.filter((s) => s !== slug)
        localStorage.setItem(SK.saves, JSON.stringify(updated))
      } catch {}
      return next
    })
  }, [slug])

  return { saved, toggle, hydrated }
}

/**
 * Returns the full set of saved recipe slugs from `tcd:saves`. Subscribes to
 * cross-tab `storage` events so toggles in another tab reflect here.
 */
export function useSavedSlugs(): { slugs: string[]; hydrated: boolean } {
  const [slugs, setSlugs] = useState<string[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const read = () => {
      try {
        const raw = localStorage.getItem(SK.saves)
        setSlugs(raw ? (JSON.parse(raw) as string[]) : [])
      } catch {
        setSlugs([])
      }
    }
    read()
    setHydrated(true)
    const onStorage = (e: StorageEvent) => {
      if (e.key === SK.saves) read()
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  return { slugs, hydrated }
}
