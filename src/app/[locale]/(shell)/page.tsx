import { setRequestLocale, getTranslations } from 'next-intl/server'
import { db } from '@/lib/db'
import { fromApiLocale, type ApiLocale } from '@/lib/api/enums'
import { deterministicLiveCount, LIVE_COUNTER_TTL_SECONDS } from '@/lib/api/live-counter'
import { loadTrending } from '@/lib/api/home-loaders'
import { HomeHero } from '@/components/home/HomeHero'
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

  const [t, [spotlight], quickChips] = await Promise.all([
    getTranslations('Home'),
    loadTrending(locale, 1),
    loadQuickChipTags(locale, 8),
  ])

  return (
    <div className={styles.page}>
      <HomeHero
        locale={locale}
        liveCount={deterministicLiveCount()}
        liveTtlSeconds={LIVE_COUNTER_TTL_SECONDS}
        quickChips={quickChips}
        spotlight={spotlight ?? null}
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

      {/* Sections 01–09 land in subsequent commits. */}
    </div>
  )
}
