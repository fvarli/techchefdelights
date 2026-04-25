import type { ApiRecipe } from '@/lib/api/types'
import styles from './DietaryCard.module.css'

type Props = {
  diets: ApiRecipe['diets']
  allergens: ApiRecipe['allergens']
  labels: {
    title: string
    diets: string
    contains: string
    mayContain: string
    none: string
  }
}

export function DietaryCard({ diets, allergens, labels }: Props) {
  const contains = allergens.filter((a) => a.presence === 'contains')
  const mayContain = allergens.filter((a) => a.presence === 'may-contain')

  if (diets.length === 0 && contains.length === 0 && mayContain.length === 0) {
    return null
  }

  return (
    <section className={styles.card} aria-labelledby="dietary-heading">
      <h2 id="dietary-heading" className={styles.title}>
        {labels.title}
      </h2>

      {diets.length > 0 && (
        <div className={styles.group}>
          <span className={styles.groupLabel}>{labels.diets}</span>
          <ul className={styles.list}>
            {diets.map((d) => (
              <li key={d.slug} className={`${styles.row} ${styles.rowYes}`}>
                <span className={styles.icon} aria-hidden>
                  ✓
                </span>
                <span className={styles.name}>{d.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {contains.length > 0 && (
        <div className={styles.group}>
          <span className={styles.groupLabel}>{labels.contains}</span>
          <ul className={styles.list}>
            {contains.map((a) => (
              <li key={a.slug} className={`${styles.row} ${styles.rowContains}`}>
                <span className={styles.icon} aria-hidden>
                  ●
                </span>
                <span className={styles.name}>{a.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {mayContain.length > 0 && (
        <div className={styles.group}>
          <span className={styles.groupLabel}>{labels.mayContain}</span>
          <ul className={styles.list}>
            {mayContain.map((a) => (
              <li key={a.slug} className={`${styles.row} ${styles.rowMay}`}>
                <span className={styles.icon} aria-hidden>
                  ◐
                </span>
                <span className={styles.name}>{a.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
