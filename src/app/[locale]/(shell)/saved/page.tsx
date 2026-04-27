import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { loadRecipeList } from '@/lib/api/recipe-list-loader'
import { SavedRecipesGrid } from '@/components/account/SavedRecipesGrid'
import { localePath } from '@/lib/path'
import type { ApiLocale } from '@/lib/api/enums'
import styles from './saved.module.css'

export const revalidate = 3600

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: ApiLocale }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Saved' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    robots: { index: false, follow: false },
    alternates: {
      canonical: localePath(locale, '/saved'),
      languages: {
        en: localePath('en', '/saved'),
        tr: localePath('tr', '/saved'),
        es: localePath('es', '/saved'),
      },
    },
  }
}

export default async function SavedPage({
  params,
}: {
  params: Promise<{ locale: ApiLocale }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const [t, tRecipe, page] = await Promise.all([
    getTranslations('Saved'),
    getTranslations('Recipe'),
    loadRecipeList(locale, {}, undefined, 60),
  ])

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.kicker}>{t('kicker')}</span>
        <h1 className={styles.title}>{t('title')}</h1>
        <p className={styles.lede}>{t('lede')}</p>
      </header>

      <SavedRecipesGrid
        locale={locale}
        recipes={page.items}
        minutesLabel={tRecipe('signalBar.minutes')}
        emptyTitle={t('empty.title')}
        emptyBody={t('empty.body')}
        emptyAction={t('empty.action')}
        loadingLabel={t('loading')}
      />
    </div>
  )
}
