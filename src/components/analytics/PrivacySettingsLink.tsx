'use client'

import { useConsent } from '@/hooks/useConsent'
import styles from './PrivacySettingsLink.module.css'

type Props = {
  label: string
  /**
   * If GA isn't configured site-wide, the link stays hidden — there's
   * nothing for the user to manage.
   */
  enabled: boolean
}

export function PrivacySettingsLink({ label, enabled }: Props) {
  const { reopen, hydrated } = useConsent()
  if (!enabled) return null
  if (!hydrated) return null

  return (
    <button type="button" className={styles.link} onClick={reopen}>
      {label}
    </button>
  )
}
