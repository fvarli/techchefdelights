'use client'

import { useCallback, useEffect, useState } from 'react'
import { SK } from '@/lib/storage-keys'

export const CONSENT_VERSION = 1

export type ConsentState = {
  analytics: boolean
  decidedAt: string
  version: number
}

export type ConsentDecision = 'pending' | 'accepted' | 'rejected'

const CONSENT_CHANGED_EVENT = 'tcd:consent-changed'

function readStored(): ConsentState | null {
  try {
    const raw = localStorage.getItem(SK.consent)
    if (!raw) return null
    const parsed = JSON.parse(raw) as ConsentState
    if (parsed.version !== CONSENT_VERSION) return null
    return parsed
  } catch {
    return null
  }
}

/**
 * Reads tcd:consent and exposes accept / reject / reopen helpers.
 * Subscribes to:
 *   - cross-tab `storage` events
 *   - same-tab custom 'tcd:consent-changed' events (so the banner
 *     and the GA loader stay in sync without a re-render dance)
 */
export function useConsent(): {
  decision: ConsentDecision
  analyticsAllowed: boolean
  hydrated: boolean
  accept: () => void
  reject: () => void
  reopen: () => void
} {
  const [state, setState] = useState<ConsentState | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setState(readStored())
    setHydrated(true)
    const onStorage = (e: StorageEvent) => {
      if (e.key === SK.consent) setState(readStored())
    }
    const onCustom = () => setState(readStored())
    window.addEventListener('storage', onStorage)
    window.addEventListener(CONSENT_CHANGED_EVENT, onCustom)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener(CONSENT_CHANGED_EVENT, onCustom)
    }
  }, [])

  const persist = useCallback((next: ConsentState | null) => {
    try {
      if (next) localStorage.setItem(SK.consent, JSON.stringify(next))
      else localStorage.removeItem(SK.consent)
    } catch {}
    setState(next)
    window.dispatchEvent(new Event(CONSENT_CHANGED_EVENT))
  }, [])

  const accept = useCallback(() => {
    persist({ analytics: true, decidedAt: new Date().toISOString(), version: CONSENT_VERSION })
  }, [persist])

  const reject = useCallback(() => {
    persist({ analytics: false, decidedAt: new Date().toISOString(), version: CONSENT_VERSION })
  }, [persist])

  const reopen = useCallback(() => {
    persist(null)
  }, [persist])

  const decision: ConsentDecision = state ? (state.analytics ? 'accepted' : 'rejected') : 'pending'

  return {
    decision,
    analyticsAllowed: state?.analytics === true,
    hydrated,
    accept,
    reject,
    reopen,
  }
}
