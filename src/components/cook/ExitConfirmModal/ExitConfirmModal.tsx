'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import * as Dialog from '@radix-ui/react-dialog'
import { useResumePoint } from '@/hooks/useResumePoint'
import styles from './ExitConfirmModal.module.css'

type Props = {
  slug: string
  recipeHref: string
  stepIndex: number
  totalSteps: number
  open: boolean
  onOpenChange: (open: boolean) => void
  labels: {
    title: string
    description: string
    progress: string
    saveAndExit: string
    stay: string
  }
}

export function ExitConfirmModal({
  slug,
  recipeHref,
  stepIndex,
  totalSteps,
  open,
  onOpenChange,
  labels,
}: Props) {
  const router = useRouter()
  const { save } = useResumePoint(slug)
  const handlerRef = useRef<() => void>(() => {})

  function handleSaveAndExit() {
    save(stepIndex)
    onOpenChange(false)
    router.replace(recipeHref)
  }
  handlerRef.current = handleSaveAndExit

  // ⌘+Enter / Ctrl+Enter confirms; Radix Dialog handles ESC → cancel.
  useEffect(() => {
    if (!open) return
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault()
        handlerRef.current()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open])

  const progressText = labels.progress
    .replace('{current}', String(stepIndex + 1))
    .replace('{total}', String(totalSteps))

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content}>
          <Dialog.Title className={styles.title}>{labels.title}</Dialog.Title>
          <Dialog.Description className={styles.description}>
            {labels.description}
          </Dialog.Description>
          <p className={styles.progress}>{progressText}</p>
          <div className={styles.actions}>
            <Dialog.Close asChild>
              <button type="button" className={styles.stayBtn}>
                {labels.stay}
              </button>
            </Dialog.Close>
            <button
              type="button"
              onClick={handleSaveAndExit}
              className={styles.exitBtn}
              autoFocus
            >
              {labels.saveAndExit}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
