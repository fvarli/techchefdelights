import type { Metadata } from 'next'
import Link from 'next/link'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import {
  loadRecipeList,
  loadFilterOptions,
  type RecipeListFilters,
} from '@/lib/api/recipe-list-loader'
import { RecipeCard } from '@/components/home/RecipeCard'
import { FilterPillRow, type FilterPill } from '@/components/recipe/FilterPillRow'
import { localePath } from '@/lib/path'
import type { ApiLocale, ApiSkill } from '@/lib/api/enums'
import styles from './recipes.module.css'

export const revalidate = 3600

const PAGE_SIZE = 24
const SKILLS: readonly ApiSkill[] = ['beginner', 'intermediate', 'advanced'] as const
const TIME_BUCKETS = [15, 30, 60] as const

function parseSearchParams(raw: Record<string, string | string[] | undefined>): {
  filters: RecipeListFilters
  cursor: string | undefined
} {
  const single = (k: string): string | undefined => {
    const v = raw[k]
    return typeof v === 'string' && v ? v : undefined
  }
  const skill = single('skill')
  const skillFilter = SKILLS.includes(skill as ApiSkill) ? (skill as ApiSkill) : undefined
  const maxMinutesRaw = single('maxMinutes')
  const maxMinutes = maxMinutesRaw && /^\d+$/.test(maxMinutesRaw) ? Number(maxMinutesRaw) : undefined
  return {
    filters: {
      cuisine: single('cuisine'),
      diet: single('diet'),
      category: single('category'),
      skill: skillFilter,
      maxMinutes,
    },
    cursor: single('cursor'),
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: ApiLocale }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Recipes' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: localePath(locale, '/recipes'),
      languages: {
        en: localePath('en', '/recipes'),
        tr: localePath('tr', '/recipes'),
        es: localePath('es', '/recipes'),
      },
    },
  }
}

export default async function RecipesIndexPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: ApiLocale }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const raw = await searchParams
  const { filters, cursor } = parseSearchParams(raw)

  const [t, tRecipe, page, options] = await Promise.all([
    getTranslations('Recipes'),
    getTranslations('Recipe'),
    loadRecipeList(locale, filters, cursor, PAGE_SIZE),
    loadFilterOptions(locale),
  ])

  const basePath = localePath(locale, '/recipes')

  // Drop cursor on filter change so user starts from page 1.
  const baseFilterParams: Record<string, string | undefined> = {
    cuisine: filters.cuisine,
    diet: filters.diet,
    category: filters.category,
    skill: filters.skill,
    maxMinutes: filters.maxMinutes ? String(filters.maxMinutes) : undefined,
  }

  const allParams = (overrides: Record<string, string | undefined>) => ({
    ...baseFilterParams,
    ...overrides,
    cursor: undefined,
  })

  const cuisinePills: FilterPill[] = [
    {
      label: t('filters.all'),
      searchParams: allParams({ cuisine: undefined }),
      active: !filters.cuisine,
    },
    ...options.cuisines.slice(0, 8).map((c) => ({
      label: c.name,
      searchParams: allParams({ cuisine: filters.cuisine === c.slug ? undefined : c.slug }),
      active: filters.cuisine === c.slug,
    })),
  ]

  const dietPills: FilterPill[] = [
    {
      label: t('filters.all'),
      searchParams: allParams({ diet: undefined }),
      active: !filters.diet,
    },
    ...options.diets.slice(0, 8).map((d) => ({
      label: d.name,
      searchParams: allParams({ diet: filters.diet === d.slug ? undefined : d.slug }),
      active: filters.diet === d.slug,
    })),
  ]

  const categoryPills: FilterPill[] = [
    {
      label: t('filters.all'),
      searchParams: allParams({ category: undefined }),
      active: !filters.category,
    },
    ...options.categories.slice(0, 8).map((c) => ({
      label: c.name,
      searchParams: allParams({ category: filters.category === c.slug ? undefined : c.slug }),
      active: filters.category === c.slug,
    })),
  ]

  const skillPills: FilterPill[] = [
    {
      label: t('filters.all'),
      searchParams: allParams({ skill: undefined }),
      active: !filters.skill,
    },
    ...SKILLS.map((s) => ({
      label: tRecipe(`skill.${s}`),
      searchParams: allParams({ skill: filters.skill === s ? undefined : s }),
      active: filters.skill === s,
    })),
  ]

  const timePills: FilterPill[] = [
    {
      label: t('filters.any'),
      searchParams: allParams({ maxMinutes: undefined }),
      active: !filters.maxMinutes,
    },
    ...TIME_BUCKETS.map((m) => ({
      label: t('filters.under', { minutes: m }),
      searchParams: allParams({ maxMinutes: filters.maxMinutes === m ? undefined : String(m) }),
      active: filters.maxMinutes === m,
    })),
  ]

  const hasActiveFilter = Boolean(
    filters.cuisine || filters.diet || filters.category || filters.skill || filters.maxMinutes,
  )

  const nextHref = page.nextCursor
    ? `${basePath}?${new URLSearchParams(
        Object.entries({ ...baseFilterParams, cursor: page.nextCursor }).filter(
          (entry): entry is [string, string] => typeof entry[1] === 'string' && entry[1] !== '',
        ),
      ).toString()}`
    : null

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.kicker}>{t('kicker')}</span>
        <h1 className={styles.title}>{t('title')}</h1>
        <p className={styles.lede}>{t('lede')}</p>
      </header>

      <section className={styles.filters} aria-label={t('filters.heading')}>
        <FilterPillRow label={t('filters.cuisine')} basePath={basePath} pills={cuisinePills} />
        <FilterPillRow label={t('filters.diet')} basePath={basePath} pills={dietPills} />
        <FilterPillRow label={t('filters.category')} basePath={basePath} pills={categoryPills} />
        <FilterPillRow label={t('filters.skill')} basePath={basePath} pills={skillPills} />
        <FilterPillRow label={t('filters.time')} basePath={basePath} pills={timePills} />
      </section>

      <div className={styles.summaryRow}>
        <span className={styles.summary}>
          {t('summary', { count: page.total })}
        </span>
        {hasActiveFilter && (
          <Link href={basePath} className={styles.reset}>
            {t('resetFilters')}
          </Link>
        )}
      </div>

      {page.items.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>{t('empty.title')}</p>
          <p className={styles.emptyBody}>{t('empty.body')}</p>
          {hasActiveFilter && (
            <Link href={basePath} className={styles.emptyAction}>
              {t('resetFilters')}
            </Link>
          )}
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
            {t('loadMore')}
            <span aria-hidden> →</span>
          </Link>
        </div>
      )}
    </div>
  )
}
