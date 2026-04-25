'use client'

import clsx from 'clsx'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Pill } from '@/components/foundation'
import { useIngredientCheckoff } from '@/hooks/useIngredientCheckoff'
import { scaleQuantity, formatScaledQuantity, SCALE_MULTIPLIERS } from '@/lib/scaling'
import type { ApiRecipe } from '@/lib/api/types'
import styles from './IngredientsSection.module.css'

type IngredientsLabels = {
  title: string
  scaleLabel: string
  optional: string
  containsAllergen: string
  toTaste: string
}

type Props = {
  recipe: ApiRecipe
  labels: IngredientsLabels
}

function resolveServings(query: string | null, base: number): number {
  if (!query) return base
  const n = Number(query)
  if (!Number.isFinite(n) || n <= 0) return base
  const allowed = SCALE_MULTIPLIERS.map((m) => base * m)
  return allowed.includes(n) ? n : base
}

export function IngredientsSection({ recipe, labels }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const base = recipe.meta.servings
  const current = resolveServings(searchParams.get('servings'), base)
  const factor = current / base

  const { checked, toggle, hydrated } = useIngredientCheckoff(recipe.slug, current)

  // Map ingredient slug-ish refs (we use ingredient IDs from API) to allergen highlights.
  // Here we surface CONTAINS allergens at the row level only when the ingredient
  // name matches a substring of an allergen name — best-effort hint, not a guarantee.
  const containsAllergens = recipe.allergens.filter((a) => a.presence === 'contains')

  function setServings(target: number) {
    const params = new URLSearchParams()
    if (target !== base) params.set('servings', String(target))
    const search = params.toString()
    router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false })
  }

  function ingredientAllergens(name: string): string[] {
    const lower = name.toLowerCase()
    return containsAllergens
      .filter((a) => lower.includes(a.name.toLowerCase()) || lower.includes(a.slug))
      .map((a) => a.name)
  }

  return (
    <section id="ingredients" className={styles.section}>
      <div className={styles.head}>
        <h2 className={styles.title}>{labels.title}</h2>
        <div className={styles.scaler} role="group" aria-label={labels.scaleLabel}>
          {SCALE_MULTIPLIERS.map((m) => {
            const target = base * m
            const active = current === target
            return (
              <button
                key={m}
                type="button"
                onClick={() => setServings(target)}
                className={clsx(styles.scaleBtn, active && styles.scaleBtnActive)}
                aria-pressed={active}
              >
                {m}× <span className={styles.scaleCount}>({target})</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className={styles.groups}>
        {recipe.ingredientGroups.map((group, gi) => (
          <div key={gi} className={styles.group}>
            <h3 className={styles.groupLabel}>{group.label}</h3>
            <ul className={styles.items}>
              {group.items.map((item) => {
                const scaled = scaleQuantity(item.metric.quantity, factor, item.metric.unit)
                const isChecked = hydrated && checked.has(item.id)
                const rowAllergens = ingredientAllergens(item.name)
                const qtyText = formatScaledQuantity(scaled)
                const unitText = item.metric.unit ?? ''
                const isToTaste = item.metric.quantity === null && item.metric.unit === null

                return (
                  <li
                    key={item.id}
                    className={clsx(styles.item, isChecked && styles.itemChecked)}
                  >
                    <label className={styles.row}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggle(item.id)}
                        className={styles.checkbox}
                        aria-label={item.name}
                      />
                      <span className={styles.qty}>
                        {isToTaste ? (
                          <em className={styles.toTaste}>{labels.toTaste}</em>
                        ) : (
                          <>
                            {qtyText && <span className={styles.qtyNum}>{qtyText}</span>}
                            {unitText && <span className={styles.qtyUnit}>{unitText}</span>}
                          </>
                        )}
                      </span>
                      <span className={styles.name}>
                        {item.name}
                        {item.prep && <span className={styles.prep}>, {item.prep}</span>}
                        {item.optional && (
                          <span className={styles.optional}>({labels.optional})</span>
                        )}
                      </span>
                      {rowAllergens.length > 0 && (
                        <span className={styles.pills}>
                          {rowAllergens.map((name) => (
                            <Pill key={name} variant="terra">
                              {labels.containsAllergen.replace('{name}', name)}
                            </Pill>
                          ))}
                        </span>
                      )}
                    </label>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
