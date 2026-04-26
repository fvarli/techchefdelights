import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import {
  loadRecipeList,
  loadCategoryBySlug,
} from '@/lib/api/recipe-list-loader'
import { RecipeCard } from '@/components/home/RecipeCard'
import { localePath } from '@/lib/path'
import type { ApiLocale } from '@/lib/api/enums'
import styles from './category.module.css'

export const revalidate = 3600

const PAGE_SIZE = 24

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: ApiLocale; category: string }>
}): Promise<Metadata> {
  const { locale, category } = await params
  const cat = await loadCategoryBySlug(locale, category)
  if (!cat) return { title: 'Category not found' }
  const t = await getTranslations({ locale, namespace: 'Taxonomy' })
  const path = locale === 'en' ? `/c/${cat.slugByLocale.en}` : `/${locale}/c/${cat.slugByLocale[locale]}`
  return {
    title: t('category.metaTitle', { name: cat.name }),
    description: cat.description ?? t('category.metaDescription', { name: cat.name }),
    alternates: {
      canonical: path,
      languages: {
        en: `/c/${cat.slugByLocale.en}`,
        tr: `/tr/c/${cat.slugByLocale.tr}`,
        es: `/es/c/${cat.slugByLocale.es}`,
      },
    },
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: ApiLocale; category: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { locale, category } = await params
  setRequestLocale(locale)
  const raw = await searchParams
  const cursor = typeof raw.cursor === 'string' ? raw.cursor : undefined

  const cat = await loadCategoryBySlug(locale, category)
  if (!cat) notFound()

  const [t, tRecipe, tCommon, page] = await Promise.all([
    getTranslations('Taxonomy'),
    getTranslations('Recipe'),
    getTranslations('Recipes'),
    loadRecipeList(locale, { category: cat.baseSlug }, cursor, PAGE_SIZE),
  ])

  const basePath = localePath(locale, `/c/${cat.slugByLocale[locale]}`)
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
        <span className={styles.crumbCurrent}>{cat.name}</span>
      </nav>

      <header className={styles.header}>
        <span className={styles.kicker}>{t('category.kicker')}</span>
        <h1 className={styles.title}>{cat.name}</h1>
        {cat.description && <p className={styles.lede}>{cat.description}</p>}
        <span className={styles.summary}>
          {tCommon('summary', { count: page.total })}
        </span>
      </header>

      {page.items.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>{t('emptyCategory.title')}</p>
          <p className={styles.emptyBody}>{t('emptyCategory.body')}</p>
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
