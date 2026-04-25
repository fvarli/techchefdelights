'use client'

import { useState } from 'react'
import clsx from 'clsx'
import { useSaveRecipe } from '@/hooks/useSaveRecipe'
import { useShoppingList } from '@/hooks/useShoppingList'
import { usePrefs } from '@/hooks/usePrefs'
import type { ApiRecipe } from '@/lib/api/types'
import styles from './UtilitiesCard.module.css'

type UtilitiesLabels = {
  title: string
  save: string
  saved: string
  addToList: string
  inList: string
  plan: string
  planSoon: string
  print: string
  share: string
  shareCopied: string
  units: string
  unitMetric: string
  unitUS: string
}

type Props = {
  recipe: ApiRecipe
  labels: UtilitiesLabels
}

export function UtilitiesCard({ recipe, labels }: Props) {
  const { saved, toggle: toggleSave, hydrated: savedHydrated } = useSaveRecipe(recipe.slug)
  const { hasRecipe, addRecipe, removeRecipe, hydrated: listHydrated } = useShoppingList()
  const { prefs, update, hydrated: prefsHydrated } = usePrefs()
  const [shareCopied, setShareCopied] = useState(false)

  const inList = listHydrated ? hasRecipe(recipe.slug) : false

  function handleAddToList() {
    if (inList) {
      removeRecipe(recipe.slug)
      return
    }
    const flatItems = recipe.ingredientGroups.flatMap((g) =>
      g.items.map((it) => ({
        name: it.name,
        quantity: it.metric.quantity,
        unit: it.metric.unit,
        aisle: it.aisle,
      })),
    )
    addRecipe(recipe.slug, flatItems)
  }

  function handlePrint() {
    if (typeof window !== 'undefined') window.print()
  }

  async function handleShare() {
    if (typeof window === 'undefined') return
    const url = window.location.href
    const shareData = { title: recipe.title, text: recipe.tagline, url }
    if (navigator.share) {
      try {
        await navigator.share(shareData)
        return
      } catch {
        // user cancelled or failed; fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(url)
      setShareCopied(true)
      window.setTimeout(() => setShareCopied(false), 2000)
    } catch {
      // ignore
    }
  }

  function toggleUnits() {
    update({ unitSystem: prefs.unitSystem === 'metric' ? 'us' : 'metric' })
  }

  return (
    <section className={styles.card} aria-labelledby="utilities-heading">
      <h2 id="utilities-heading" className={styles.title}>
        {labels.title}
      </h2>

      <button
        type="button"
        onClick={toggleSave}
        className={clsx(styles.btn, saved && styles.btnActive)}
        aria-pressed={savedHydrated ? saved : undefined}
      >
        <span className={styles.icon} aria-hidden>
          {saved ? '♥' : '♡'}
        </span>
        <span className={styles.label}>{saved ? labels.saved : labels.save}</span>
      </button>

      <button
        type="button"
        onClick={handleAddToList}
        className={clsx(styles.btn, inList && styles.btnActive)}
        aria-pressed={listHydrated ? inList : undefined}
      >
        <span className={styles.icon} aria-hidden>
          {inList ? '✓' : '+'}
        </span>
        <span className={styles.label}>{inList ? labels.inList : labels.addToList}</span>
      </button>

      <button type="button" disabled className={clsx(styles.btn, styles.btnDisabled)}>
        <span className={styles.icon} aria-hidden>
          ◧
        </span>
        <span className={styles.label}>{labels.plan}</span>
        <span className={styles.badge}>{labels.planSoon}</span>
      </button>

      <button type="button" onClick={handlePrint} className={styles.btn}>
        <span className={styles.icon} aria-hidden>
          ⎙
        </span>
        <span className={styles.label}>{labels.print}</span>
      </button>

      <button type="button" onClick={handleShare} className={styles.btn}>
        <span className={styles.icon} aria-hidden>
          ↗
        </span>
        <span className={styles.label}>{shareCopied ? labels.shareCopied : labels.share}</span>
      </button>

      <button
        type="button"
        onClick={toggleUnits}
        className={styles.btn}
        aria-label={labels.units}
      >
        <span className={styles.icon} aria-hidden>
          ⇄
        </span>
        <span className={styles.label}>{labels.units}</span>
        <span className={styles.unitTag}>
          {prefsHydrated && prefs.unitSystem === 'us' ? labels.unitUS : labels.unitMetric}
        </span>
      </button>
    </section>
  )
}
