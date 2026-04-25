import { Pill } from '@/components/foundation'
import { formatScaledQuantity } from '@/lib/scaling'
import type { ApiRecipe } from '@/lib/api/types'
import styles from './IngredientsSection.module.css'

type Props = {
  recipe: ApiRecipe
  labels: {
    title: string
    optional: string
    containsAllergen: string
    toTaste: string
  }
}

/**
 * Server-rendered, non-interactive ingredients list. Used as the Suspense
 * fallback so SSR/SSG HTML contains the full ingredient list at base servings —
 * the client `IngredientsSection` then takes over with scaler + check-off after
 * hydration.
 */
export function IngredientsSectionFallback({ recipe, labels }: Props) {
  const containsAllergens = recipe.allergens.filter((a) => a.presence === 'contains')

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
      </div>
      <div className={styles.groups}>
        {recipe.ingredientGroups.map((group, gi) => (
          <div key={gi} className={styles.group}>
            <h3 className={styles.groupLabel}>{group.label}</h3>
            <ul className={styles.items}>
              {group.items.map((item) => {
                const qtyText = formatScaledQuantity(item.metric.quantity)
                const unitText = item.metric.unit ?? ''
                const isToTaste = item.metric.quantity === null && item.metric.unit === null
                const rowAllergens = ingredientAllergens(item.name)
                return (
                  <li key={item.id} className={styles.item}>
                    <div className={styles.row}>
                      <span aria-hidden />
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
                    </div>
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
