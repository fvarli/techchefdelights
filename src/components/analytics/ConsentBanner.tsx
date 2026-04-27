'use client'

import { useConsent } from '@/hooks/useConsent'
import styles from './ConsentBanner.module.css'

type Labels = {
  title: string
  description: string
  analytics: string
  accept: string
  reject: string
}

type Props = {
  labels: Labels
  /**
   * If false (no GA id configured at all), the banner stays hidden —
   * we only need consent for analytics that we actually load.
   */
  enabled: boolean
}

export function ConsentBanner({ labels, enabled }: Props) {
  const { decision, hydrated, accept, reject } = useConsent()

  if (!enabled) return null
  if (!hydrated) return null
  if (decision !== 'pending') return null

  return (
    <div role="dialog" aria-label={labels.title} className={styles.banner}>
      <div className={styles.text}>
        <strong className={styles.title}>{labels.title}</strong>
        <p className={styles.body}>{labels.description}</p>
        <p className={styles.scope}>
          <span aria-hidden>·</span> {labels.analytics}
        </p>
      </div>
      <div className={styles.actions}>
        <button type="button" className={styles.reject} onClick={reject}>
          {labels.reject}
        </button>
        <button type="button" className={styles.accept} onClick={accept} autoFocus>
          {labels.accept}
        </button>
      </div>
    </div>
  )
}
