'use client'

import Link from 'next/link'
import { useSavedSlugs } from '@/hooks/useSaveRecipe'
import { RecipeCard } from '@/components/home/RecipeCard'
import { localePath } from '@/lib/path'
import type { ApiLocale } from '@/lib/api/enums'
import type { HomeRecipeCard } from '@/lib/api/home-loaders'
import styles from './SavedRecipesGrid.module.css'

type Props = {
  locale: ApiLocale
  recipes: HomeRecipeCard[]
  minutesLabel: string
  emptyTitle: string
  emptyBody: string
  emptyAction: string
  loadingLabel: string
}

export function SavedRecipesGrid({
  locale,
  recipes,
  minutesLabel,
  emptyTitle,
  emptyBody,
  emptyAction,
  loadingLabel,
}: Props) {
  const { slugs, hydrated } = useSavedSlugs()
  const recipesPath = localePath(locale, '/recipes')

  if (!hydrated) {
    return (
      <p className={styles.loading} aria-live="polite">
        {loadingLabel}
      </p>
    )
  }

  const saved = recipes.filter((r) => slugs.includes(r.slug))

  if (saved.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyTitle}>{emptyTitle}</p>
        <p className={styles.emptyBody}>{emptyBody}</p>
        <Link href={recipesPath} className={styles.emptyAction}>
          {emptyAction}
        </Link>
      </div>
    )
  }

  return (
    <ul className={styles.grid}>
      {saved.map((recipe, i) => (
        <li key={recipe.id} className={styles.cell}>
          <RecipeCard
            recipe={recipe}
            locale={locale}
            minutesLabel={minutesLabel}
            tone={(['warm', 'cool', 'sand', 'light'] as const)[i % 4]}
          />
        </li>
      ))}
    </ul>
  )
}
