import Link from 'next/link'
import { Placeholder } from '@/components/foundation'
import { localePath } from '@/lib/path'
import type { ApiLocale } from '@/lib/api/enums'
import type { HomeRecipeCard } from '@/lib/api/home-loaders'
import styles from './RecipeCard.module.css'

type Props = {
  recipe: HomeRecipeCard
  locale: ApiLocale
  minutesLabel: string
  tone?: 'warm' | 'cool' | 'light' | 'sand'
}

export function RecipeCard({ recipe, locale, minutesLabel, tone = 'warm' }: Props) {
  return (
    <Link href={localePath(locale, `/r/${recipe.slug}`)} className={styles.card}>
      <div className={styles.imageWrap}>
        <Placeholder tone={tone} ratio={4 / 3} label={recipe.title.toUpperCase().slice(0, 16)} />
      </div>
      <div className={styles.body}>
        {recipe.cuisine && <span className={styles.kicker}>{recipe.cuisine}</span>}
        <h3 className={styles.title}>{recipe.title}</h3>
        <p className={styles.tagline}>{recipe.tagline}</p>
        <span className={styles.meta}>
          <span className={styles.metaTime}>
            {recipe.totalMinutes} {minutesLabel}
          </span>
          {recipe.ratingCount > 0 && (
            <>
              <span className={styles.metaDot} aria-hidden>·</span>
              <span className={styles.metaRating}>
                ★ {recipe.ratingAvg.toFixed(1)} ({recipe.ratingCount})
              </span>
            </>
          )}
        </span>
      </div>
    </Link>
  )
}
