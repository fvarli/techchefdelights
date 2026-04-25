'use client'

import { useMemo } from 'react'
import { usePrefs } from '@/hooks/usePrefs'
import type { ApiRecipe } from '@/lib/api/types'
import styles from './AllergyAlert.module.css'

type Props = {
  allergens: ApiRecipe['allergens']
  labels: { title: string; contains: string }
}

/**
 * Banner shown only when the user has set allergy preferences in localStorage
 * and at least one of those allergens is present (CONTAINS) in this recipe.
 * Server-render returns null until hydration to avoid layout shift.
 */
export function AllergyAlert({ allergens, labels }: Props) {
  const { prefs, hydrated } = usePrefs()

  const matched = useMemo(() => {
    if (!hydrated || prefs.allergies.length === 0) return []
    const userSet = new Set(prefs.allergies)
    return allergens.filter((a) => a.presence === 'contains' && userSet.has(a.slug))
  }, [allergens, prefs.allergies, hydrated])

  if (matched.length === 0) return null

  return (
    <div className={styles.alert} role="alert">
      <span className={styles.icon} aria-hidden>
        ⚠
      </span>
      <div className={styles.body}>
        <strong className={styles.title}>{labels.title}</strong>
        <span className={styles.list}>
          {labels.contains}: {matched.map((a) => a.name).join(', ')}
        </span>
      </div>
    </div>
  )
}
