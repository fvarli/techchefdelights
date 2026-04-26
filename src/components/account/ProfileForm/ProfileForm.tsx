'use client'

import { usePrefs } from '@/hooks/usePrefs'
import type { AllergenOption } from '@/lib/api/account-loaders'
import styles from './ProfileForm.module.css'

type Labels = {
  loading: string
  allergiesTitle: string
  allergiesDesc: string
  noAllergies: string
  unitsTitle: string
  unitsDesc: string
  unitMetric: string
  unitUS: string
  saved: string
  resetAll: string
}

type Props = {
  allergens: AllergenOption[]
  labels: Labels
}

export function ProfileForm({ allergens, labels }: Props) {
  const { prefs, update, hydrated } = usePrefs()

  if (!hydrated) {
    return (
      <p className={styles.loading} aria-live="polite">
        {labels.loading}
      </p>
    )
  }

  function toggleAllergy(slug: string) {
    const next = prefs.allergies.includes(slug)
      ? prefs.allergies.filter((s) => s !== slug)
      : [...prefs.allergies, slug]
    update({ allergies: next })
  }

  return (
    <div className={styles.form}>
      <fieldset className={styles.section}>
        <legend className={styles.legend}>{labels.allergiesTitle}</legend>
        <p className={styles.desc}>{labels.allergiesDesc}</p>
        {allergens.length === 0 ? (
          <p className={styles.empty}>{labels.noAllergies}</p>
        ) : (
          <div className={styles.allergyGrid} role="group">
            {allergens.map((a) => {
              const checked = prefs.allergies.includes(a.slug)
              return (
                <label
                  key={a.slug}
                  className={styles.allergyChip}
                  data-checked={checked || undefined}
                >
                  <input
                    type="checkbox"
                    className={styles.allergyInput}
                    checked={checked}
                    onChange={() => toggleAllergy(a.slug)}
                  />
                  <span className={styles.allergyLabel}>{a.name}</span>
                </label>
              )
            })}
          </div>
        )}
      </fieldset>

      <fieldset className={styles.section}>
        <legend className={styles.legend}>{labels.unitsTitle}</legend>
        <p className={styles.desc}>{labels.unitsDesc}</p>
        <div className={styles.unitRow} role="radiogroup">
          <label className={styles.unitOption} data-checked={prefs.unitSystem === 'metric' || undefined}>
            <input
              type="radio"
              name="unitSystem"
              value="metric"
              className={styles.unitInput}
              checked={prefs.unitSystem === 'metric'}
              onChange={() => update({ unitSystem: 'metric' })}
            />
            <span>{labels.unitMetric}</span>
          </label>
          <label className={styles.unitOption} data-checked={prefs.unitSystem === 'us' || undefined}>
            <input
              type="radio"
              name="unitSystem"
              value="us"
              className={styles.unitInput}
              checked={prefs.unitSystem === 'us'}
              onChange={() => update({ unitSystem: 'us' })}
            />
            <span>{labels.unitUS}</span>
          </label>
        </div>
      </fieldset>

      <p className={styles.savedHint} aria-live="polite">
        {labels.saved}
      </p>
    </div>
  )
}
