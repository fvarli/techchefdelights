'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export type TimerState = 'idle' | 'active' | 'paused' | 'complete'

export type UseTimerResult = {
  state: TimerState
  remainingMs: number
  totalMs: number
  start: () => void
  pause: () => void
  resume: () => void
  reset: () => void
  addMinute: () => void
}

/**
 * Drift-corrected timer using performance.now() and requestAnimationFrame.
 * State machine: idle | active | paused | complete. Resets when initialSeconds
 * changes (e.g. step navigation triggers a new instance).
 */
export function useTimer(initialSeconds: number): UseTimerResult {
  const totalMs = initialSeconds * 1000
  const [state, setState] = useState<TimerState>('idle')
  const [remainingMs, setRemainingMs] = useState(totalMs)

  // Authoritative timer state held in refs to avoid stale closures.
  const baseRemainingRef = useRef<number>(totalMs)
  const startedAtRef = useRef<number | null>(null)

  // When the input changes (e.g. step swap), reset everything.
  useEffect(() => {
    baseRemainingRef.current = totalMs
    startedAtRef.current = null
    setRemainingMs(totalMs)
    setState('idle')
  }, [totalMs])

  // Tick loop: only runs while state === 'active'.
  useEffect(() => {
    if (state !== 'active') return
    let frameId: number
    function tick() {
      if (startedAtRef.current === null) return
      const elapsed = performance.now() - startedAtRef.current
      const r = Math.max(0, baseRemainingRef.current - elapsed)
      setRemainingMs(r)
      if (r === 0) {
        setState('complete')
        return
      }
      frameId = window.requestAnimationFrame(tick)
    }
    frameId = window.requestAnimationFrame(tick)
    return () => {
      if (frameId) window.cancelAnimationFrame(frameId)
    }
  }, [state])

  const start = useCallback(() => {
    startedAtRef.current = performance.now()
    setState('active')
  }, [])

  const pause = useCallback(() => {
    if (startedAtRef.current === null) return
    const elapsed = performance.now() - startedAtRef.current
    baseRemainingRef.current = Math.max(0, baseRemainingRef.current - elapsed)
    setRemainingMs(baseRemainingRef.current)
    startedAtRef.current = null
    setState('paused')
  }, [])

  const resume = useCallback(() => {
    startedAtRef.current = performance.now()
    setState('active')
  }, [])

  const reset = useCallback(() => {
    startedAtRef.current = null
    baseRemainingRef.current = totalMs
    setRemainingMs(totalMs)
    setState('idle')
  }, [totalMs])

  const addMinute = useCallback(() => {
    baseRemainingRef.current += 60_000
    if (state !== 'active') {
      setRemainingMs(baseRemainingRef.current)
    }
  }, [state])

  return {
    state,
    remainingMs,
    totalMs,
    start,
    pause,
    resume,
    reset,
    addMinute,
  }
}
