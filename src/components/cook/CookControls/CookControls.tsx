'use client'

import { useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'
import { useResumePoint } from '@/hooks/useResumePoint'
import styles from './CookControls.module.css'

type Props = {
  slug: string
  basePath: string
  recipeHref: string
  stepIndex: number
  totalSteps: number
  labels: { previous: string; next: string; complete: string }
}

function stepHref(basePath: string, step: number): string {
  return step === 0 ? basePath : `${basePath}?step=${step}`
}

export function CookControls({
  slug,
  basePath,
  recipeHref,
  stepIndex,
  totalSteps,
  labels,
}: Props) {
  const router = useRouter()
  const { save, clear } = useResumePoint(slug)

  // Persist resume point whenever step changes.
  useEffect(() => {
    save(stepIndex)
  }, [stepIndex, save])

  const goPrev = useCallback(() => {
    if (stepIndex > 0) router.replace(stepHref(basePath, stepIndex - 1))
  }, [router, basePath, stepIndex])

  const goNext = useCallback(() => {
    if (stepIndex < totalSteps - 1) router.replace(stepHref(basePath, stepIndex + 1))
  }, [router, basePath, stepIndex, totalSteps])

  const complete = useCallback(() => {
    clear()
    router.replace(recipeHref)
  }, [clear, router, recipeHref])

  // Arrow-key navigation. Skip when typing in an input/textarea.
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const tgt = e.target
      if (
        tgt instanceof HTMLElement &&
        (tgt.tagName === 'INPUT' ||
          tgt.tagName === 'TEXTAREA' ||
          tgt.isContentEditable)
      ) {
        return
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        goNext()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goPrev()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [goPrev, goNext])

  const prevAvailable = stepIndex > 0
  const isLast = stepIndex === totalSteps - 1

  return (
    <nav className={styles.bar} aria-label="Cook navigation">
      <div className={styles.inner}>
        <button
          type="button"
          onClick={goPrev}
          disabled={!prevAvailable}
          className={clsx(styles.btn, !prevAvailable && styles.btnDisabled)}
          data-direction="prev"
        >
          <span aria-hidden>←</span>
          <span>{labels.previous}</span>
        </button>

        <span className={styles.dotsRow} aria-hidden>
          {Array.from({ length: totalSteps }).map((_, i) => (
            <span
              key={i}
              className={clsx(
                styles.dot,
                i === stepIndex && styles.dotActive,
                i < stepIndex && styles.dotPast,
              )}
            />
          ))}
        </span>

        {isLast ? (
          <button
            type="button"
            onClick={complete}
            className={clsx(styles.btn, styles.btnPrimary)}
            data-direction="complete"
          >
            <span>{labels.complete}</span>
            <span aria-hidden>✓</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={goNext}
            className={clsx(styles.btn, styles.btnPrimary)}
            data-direction="next"
          >
            <span>{labels.next}</span>
            <span aria-hidden>→</span>
          </button>
        )}
      </div>
    </nav>
  )
}
