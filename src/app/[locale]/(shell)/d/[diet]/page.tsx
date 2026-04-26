import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import {
  loadRecipeList,
  loadDietBySlug,
} from '@/lib/api/recipe-list-loader'
import { RecipeCard } from '@/components/home/RecipeCard'
import { localePath } from '@/lib/path'
import type { ApiLocale } from '@/lib/api/enums'
import styles from './diet.module.css'

export const revalidate = 3600

const PAGE_SIZE = 24

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: ApiLocale; diet: string }>
}): Promise<Metadata> {
  const { locale, diet } = await params
  const d = await loadDietBySlug(locale, diet)
  if (!d) return { title: 'Diet not found' }
  const t = await getTranslations({ locale, namespace: 'Taxonomy' })
  const path = locale === 'en' ? `/d/${d.slug}` : `/${locale}/d/${d.slug}`
  return {
    title: t('diet.metaTitle', { name: d.name }),
    description: d.description ?? t('diet.metaDescription', { name: d.name }),
    alternates: {
      canonical: path,
      languages: {
        en: `/d/${d.slug}`,
        tr: `/tr/d/${d.slug}`,
        es: `/es/d/${d.slug}`,
      },
    },
  }
}

export default async function DietPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: ApiLocale; diet: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { locale, diet } = await params
  setRequestLocale(locale)
  const raw = await searchParams
  const cursor = typeof raw.cursor === 'string' ? raw.cursor : undefined

  const d = await loadDietBySlug(locale, diet)
  if (!d) notFound()

  const [t, tRecipe, tCommon, page] = await Promise.all([
    getTranslations('Taxonomy'),
    getTranslations('Recipe'),
    getTranslations('Recipes'),
    loadRecipeList(locale, { diet: d.slug }, cursor, PAGE_SIZE),
  ])

  const basePath = localePath(locale, `/d/${d.slug}`)
  const recipesPath = localePath(locale, '/recipes')
  const nextHref = page.nextCursor
    ? `${basePath}?${new URLSearchParams({ cursor: page.nextCursor }).toString()}`
    : null

  return (
    <div className={styles.page}>
      <nav className={styles.crumbs} aria-label={tRecipe('breadcrumb.home')}>
        <Link href={localePath(locale, '/')} className={styles.crumb}>
          {tRecipe('breadcrumb.home')}
        </Link>
        <span className={styles.crumbSep} aria-hidden>
          /
        </span>
        <Link href={recipesPath} className={styles.crumb}>
          {tRecipe('breadcrumb.recipes')}
        </Link>
        <span className={styles.crumbSep} aria-hidden>
          /
        </span>
        <span className={styles.crumbCurrent}>{d.name}</span>
      </nav>

      <header className={styles.header}>
        <span className={styles.kicker}>{t('diet.kicker')}</span>
        <h1 className={styles.title}>{d.name}</h1>
        {d.description && <p className={styles.lede}>{d.description}</p>}
        <span className={styles.summary}>
          {tCommon('summary', { count: page.total })}
        </span>
      </header>

      {page.items.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>{t('emptyDiet.title')}</p>
          <p className={styles.emptyBody}>{t('emptyDiet.body')}</p>
          <Link href={recipesPath} className={styles.emptyAction}>
            {t('browseAll')}
          </Link>
        </div>
      ) : (
        <ul className={styles.grid}>
          {page.items.map((recipe, i) => (
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
      )}

      {nextHref && (
        <div className={styles.pagination}>
          <Link href={nextHref} className={styles.next}>
            {tCommon('loadMore')}
            <span aria-hidden> →</span>
          </Link>
        </div>
      )}
    </div>
  )
}
