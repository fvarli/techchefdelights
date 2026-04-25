import { Placeholder } from '@/components/foundation'
import { Kicker } from '@/components/foundation'
import type { ApiRecipe } from '@/lib/api/types'
import type { ApiLocale } from '@/lib/api/enums'
import styles from './RecipeHero.module.css'

type RecipeHeroProps = {
  recipe: ApiRecipe
  locale: ApiLocale
  breadcrumb: { home: string; recipes: string }
}

const LOCALE_DATE_FORMAT: Record<ApiLocale, string> = {
  en: 'en-US',
  tr: 'tr-TR',
  es: 'es-ES',
}

function formatDate(iso: string, locale: ApiLocale) {
  try {
    return new Date(iso).toLocaleDateString(LOCALE_DATE_FORMAT[locale], {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return iso.slice(0, 10)
  }
}

export function RecipeHero({ recipe, locale, breadcrumb }: RecipeHeroProps) {
  const homePath = locale === 'en' ? '/' : `/${locale}`
  const recipesPath = locale === 'en' ? '/recipes' : `/${locale}/recipes`
  const kickerLabel = [recipe.cuisine?.name, recipe.categories[0]?.name]
    .filter(Boolean)
    .join(' · ')

  return (
    <header className={styles.hero}>
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <a href={homePath}>{breadcrumb.home}</a>
        <span className={styles.crumbDot} aria-hidden>
          ›
        </span>
        <a href={recipesPath}>{breadcrumb.recipes}</a>
        <span className={styles.crumbDot} aria-hidden>
          ›
        </span>
        <span className={styles.crumbCurrent}>{recipe.title}</span>
      </nav>

      <div className={styles.body}>
        <div className={styles.text}>
          {kickerLabel && <Kicker className={styles.kicker}>{kickerLabel}</Kicker>}
          <h1 className={styles.title}>{recipe.title}</h1>
          <p className={styles.tagline}>{recipe.tagline}</p>
          <p className={styles.description}>{recipe.description}</p>
          {recipe.author && (
            <div className={styles.byline}>
              <div className={styles.avatar} aria-hidden>
                {recipe.author.name.charAt(0)}
              </div>
              <div className={styles.bylineText}>
                <span className={styles.authorName}>{recipe.author.name}</span>
                {recipe.author.title && (
                  <span className={styles.authorTitle}>{recipe.author.title}</span>
                )}
              </div>
              <span className={styles.bylineDot} aria-hidden>
                ·
              </span>
              <time className={styles.publishedAt} dateTime={recipe.publishedAt}>
                {formatDate(recipe.publishedAt, locale)}
              </time>
            </div>
          )}
        </div>

        <div className={styles.image}>
          <Placeholder
            label={recipe.title.toUpperCase().slice(0, 16)}
            tone="warm"
            ratio={4 / 3}
          />
        </div>
      </div>
    </header>
  )
}
