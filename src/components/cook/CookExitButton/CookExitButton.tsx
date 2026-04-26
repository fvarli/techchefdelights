'use client'

import { useEffect, useState } from 'react'
import { ExitConfirmModal } from '@/components/cook/ExitConfirmModal'
import styles from './CookExitButton.module.css'

type Props = {
  slug: string
  recipeHref: string
  stepIndex: number
  totalSteps: number
  labels: {
    exit: string
    modal: {
      title: string
      description: string
      progress: string
      saveAndExit: string
      stay: string
    }
  }
}

export function CookExitButton({
  slug,
  recipeHref,
  stepIndex,
  totalSteps,
  labels,
}: Props) {
  const [open, setOpen] = useState(false)

  // Generic browser-close guard while user is in cook mode.
  useEffect(() => {
    function onBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={styles.exit}
        aria-label={labels.exit}
      >
        <span aria-hidden>✕</span>
        <span className={styles.exitLabel}>{labels.exit}</span>
      </button>
      <ExitConfirmModal
        slug={slug}
        recipeHref={recipeHref}
        stepIndex={stepIndex}
        totalSteps={totalSteps}
        open={open}
        onOpenChange={setOpen}
        labels={labels.modal}
      />
    </>
  )
}
