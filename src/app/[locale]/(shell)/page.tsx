import { setRequestLocale, getTranslations } from 'next-intl/server'
import { db } from '@/lib/db'
import { fromApiLocale, type ApiLocale } from '@/lib/api/enums'
import { deterministicLiveCount, LIVE_COUNTER_TTL_SECONDS } from '@/lib/api/live-counter'
import {
  loadTrending,
  loadFeatured,
  loadLatest,
  loadCategoryTiles,
  loadDietTiles,
} from '@/lib/api/home-loaders'
import { HomeHero } from '@/components/home/HomeHero'
import { DiscoveryQuadrant } from '@/components/home/DiscoveryQuadrant'
import { TrendingSection } from '@/components/home/TrendingSection'
import { EditorialFeature } from '@/components/home/EditorialFeature'
import { VisualMasonry } from '@/components/home/VisualMasonry'
import { CategoryGrid } from '@/components/home/CategoryGrid'
import { DietInk } from '@/components/home/DietInk'
import styles from './page.module.css'

export const revalidate = 3600

async function loadQuickChipTags(locale: ApiLocale, limit = 8) {
  const prismaLocale = fromApiLocale(locale)
  const tags = await db.tag.findMany({
    take: limit,
    include: { translations: { where: { locale: prismaLocale } } },
  })
  return tags
    .filter((t) => t.translations[0])
    .map((t) => ({ slug: t.slug, name: t.translations[0].name }))
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: rawLocale } = await params
  const locale = rawLocale as ApiLocale
  setRequestLocale(locale)

  const [t, tRecipe, trending, featured, masonry, categoryTiles, dietTiles, quickChips] =
    await Promise.all([
      getTranslations('Home'),
      getTranslations('Recipe'),
      loadTrending(locale, 4),
      loadFeatured(locale),
      loadLatest(locale, 8),
      loadCategoryTiles(locale),
      loadDietTiles(locale, 4),
      loadQuickChipTags(locale, 8),
    ])

  const spotlight = trending[0] ?? null

  return (
    <div className={styles.page}>
      <HomeHero
        locale={locale}
        liveCount={deterministicLiveCount()}
        liveTtlSeconds={LIVE_COUNTER_TTL_SECONDS}
        quickChips={quickChips}
        spotlight={spotlight}
        labels={{
          kicker: t('kicker'),
          title: t('title'),
          tagline: t('tagline'),
          liveLabel: t('liveLabel'),
          searchPlaceholder: t('searchPlaceholder'),
          searchHint: t('searchHint'),
          quickChipsLabel: t('quickChipsLabel'),
        }}
      />

      <DiscoveryQuadrant
        locale={locale}
        labels={{
          kicker: t('discovery.kicker'),
          title: t('discovery.title'),
          ingredient: {
            title: t('discovery.ingredient.title'),
            desc: t('discovery.ingredient.desc'),
          },
          diet: {
            title: t('discovery.diet.title'),
            desc: t('discovery.diet.desc'),
          },
          cuisine: {
            title: t('discovery.cuisine.title'),
            desc: t('discovery.cuisine.desc'),
          },
          time: {
            title: t('discovery.time.title'),
            desc: t('discovery.time.desc'),
          },
        }}
      />

      <TrendingSection
        recipes={trending}
        locale={locale}
        labels={{
          kicker: t('trending.kicker'),
          title: t('trending.title'),
          rangeWeek: t('trending.rangeWeek'),
          minutes: tRecipe('signalBar.minutes'),
        }}
      />

      {featured && (
        <EditorialFeature
          feature={featured}
          locale={locale}
          labels={{
            kicker: t('editorial.kicker'),
            cta: t('editorial.cta'),
            minutes: tRecipe('signalBar.minutes'),
          }}
        />
      )}

      <VisualMasonry
        recipes={masonry}
        locale={locale}
        labels={{
          kicker: t('masonry.kicker'),
          title: t('masonry.title'),
        }}
      />

      <CategoryGrid
        categories={categoryTiles}
        locale={locale}
        labels={{
          kicker: t('categories.kicker'),
          title: t('categories.title'),
          recipesSuffix: t('categories.recipesSuffix'),
        }}
      />

      <DietInk
        diets={dietTiles}
        locale={locale}
        labels={{
          kicker: t('diets.kicker'),
          title: t('diets.title'),
          desc: t('diets.desc'),
          recipesSuffix: t('diets.recipesSuffix'),
        }}
      />

      {/* Sections 07–09 land in next commit. */}
    </div>
  )
}
