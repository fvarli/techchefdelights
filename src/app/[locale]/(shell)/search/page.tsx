import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { searchRecipes, normalizeQuery } from '@/lib/api/search-loader'
import { RecipeCard } from '@/components/home/RecipeCard'
import { localePath } from '@/lib/path'
import type { ApiLocale } from '@/lib/api/enums'
import styles from './search.module.css'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: ApiLocale }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Search' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    robots: { index: false, follow: true },
    alternates: {
      canonical: localePath(locale, '/search'),
      languages: {
        en: localePath('en', '/search'),
        tr: localePath('tr', '/search'),
        es: localePath('es', '/search'),
      },
    },
  }
}

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: ApiLocale }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const raw = await searchParams
  const rawQ = typeof raw.q === 'string' ? raw.q : ''
  const q = normalizeQuery(rawQ)

  const [t, tRecipe, result] = await Promise.all([
    getTranslations('Search'),
    getTranslations('Recipe'),
    q ? searchRecipes(locale, q) : Promise.resolve({ query: '', items: [], total: 0 }),
  ])

  const action = localePath(locale, '/search')

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.kicker}>{t('kicker')}</span>
        <h1 className={styles.title}>{t('title')}</h1>
      </header>

      <form action={action} method="GET" className={styles.form} role="search">
        <label className={styles.label} htmlFor="search-q">
          {t('inputLabel')}
        </label>
        <div className={styles.inputRow}>
          <input
            id="search-q"
            type="search"
            name="q"
            defaultValue={q}
            placeholder={t('inputPlaceholder')}
            className={styles.input}
            autoComplete="off"
            spellCheck="false"
            maxLength={200}
            autoFocus
          />
          <button type="submit" className={styles.submit}>
            {t('submit')}
          </button>
        </div>
      </form>

      {!q && (
        <div className={styles.hint}>
          <p className={styles.hintBody}>{t('emptyQuery.body')}</p>
          <p className={styles.hintExamples}>{t('emptyQuery.examples')}</p>
        </div>
      )}

      {q && result.items.length === 0 && (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>{t('noResults.title', { q })}</p>
          <p className={styles.emptyBody}>{t('noResults.body')}</p>
        </div>
      )}

      {q && result.items.length > 0 && (
        <>
          <span className={styles.summary}>
            {t('summary', { count: result.total, q })}
          </span>
          <ul className={styles.grid}>
            {result.items.map((recipe, i) => (
              <li key={recipe.id} className={styles.cell}>
                <RecipeCard
                  recipe={recipe}
                  locale={locale}
                  minutesLabel={tRecipe('signalBar.minutes')}
                  tone={(['warm', 'cool', 'sand', 'light'] as const)[i % 4]}
                />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
