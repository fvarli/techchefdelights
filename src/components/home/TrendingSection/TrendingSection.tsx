import { Kicker } from '@/components/foundation'
import { RecipeCard } from '@/components/home/RecipeCard'
import type { ApiLocale } from '@/lib/api/enums'
import type { HomeRecipeCard } from '@/lib/api/home-loaders'
import styles from './TrendingSection.module.css'

type Props = {
  recipes: HomeRecipeCard[]
  locale: ApiLocale
  labels: {
    kicker: string
    title: string
    rangeWeek: string
    minutes: string
  }
}

const TONES = ['warm', 'cool', 'light', 'sand'] as const

export function TrendingSection({ recipes, locale, labels }: Props) {
  if (recipes.length === 0) return null
  return (
    <section className={styles.section}>
      <header className={styles.head}>
        <div className={styles.headLeft}>
          <Kicker num="02">{labels.kicker}</Kicker>
          <h2 className={styles.title}>{labels.title}</h2>
        </div>
        <span className={styles.rangeBadge}>{labels.rangeWeek}</span>
      </header>
      <div className={styles.grid}>
        {recipes.map((recipe, i) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            locale={locale}
            minutesLabel={labels.minutes}
            tone={TONES[i % TONES.length]}
          />
        ))}
      </div>
    </section>
  )
}
