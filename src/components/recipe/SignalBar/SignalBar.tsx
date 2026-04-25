import type { ApiRecipe } from '@/lib/api/types'
import styles from './SignalBar.module.css'

type SignalBarProps = {
  recipe: ApiRecipe
  labels: {
    prep: string
    cook: string
    total: string
    serves: string
    difficulty: string
    rating: string
    minutes: string
    skill: { beginner: string; intermediate: string; advanced: string }
  }
}

export function SignalBar({ recipe, labels }: SignalBarProps) {
  const cells: Array<{ label: string; value: string; sub?: string }> = [
    {
      label: labels.prep,
      value: String(recipe.meta.prepMinutes),
      sub: labels.minutes,
    },
    {
      label: labels.cook,
      value: String(recipe.meta.cookMinutes),
      sub: labels.minutes,
    },
    {
      label: labels.total,
      value: String(recipe.meta.totalMinutes),
      sub: labels.minutes,
    },
    {
      label: labels.serves,
      value: String(recipe.meta.servings),
    },
    {
      label: labels.difficulty,
      value: labels.skill[recipe.meta.skill],
    },
    {
      label: labels.rating,
      value: recipe.rating.count > 0 ? recipe.rating.average.toFixed(1) : '—',
      sub: recipe.rating.count > 0 ? `(${recipe.rating.count})` : undefined,
    },
  ]

  return (
    <dl className={styles.bar} aria-label="Recipe stats">
      {cells.map((c, i) => (
        <div key={i} className={styles.cell}>
          <dt className={styles.label}>{c.label}</dt>
          <dd className={styles.value}>
            <span className={styles.number}>{c.value}</span>
            {c.sub && <span className={styles.sub}>{c.sub}</span>}
          </dd>
        </div>
      ))}
    </dl>
  )
}
