import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { loadAllergens } from '@/lib/api/account-loaders'
import { ProfileForm } from '@/components/account/ProfileForm'
import type { ApiLocale } from '@/lib/api/enums'
import styles from './profile.module.css'

export const revalidate = 3600

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: ApiLocale }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Profile' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    robots: { index: false, follow: false },
    alternates: {
      canonical: locale === 'en' ? '/profile' : `/${locale}/profile`,
      languages: { en: '/profile', tr: '/tr/profile', es: '/es/profile' },
    },
  }
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: ApiLocale }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const [t, allergens] = await Promise.all([
    getTranslations('Profile'),
    loadAllergens(locale),
  ])

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.kicker}>{t('kicker')}</span>
        <h1 className={styles.title}>{t('title')}</h1>
        <p className={styles.lede}>{t('lede')}</p>
      </header>

      <ProfileForm
        allergens={allergens}
        labels={{
          loading: t('loading'),
          allergiesTitle: t('allergies.title'),
          allergiesDesc: t('allergies.desc'),
          noAllergies: t('allergies.none'),
          unitsTitle: t('units.title'),
          unitsDesc: t('units.desc'),
          unitMetric: t('units.metric'),
          unitUS: t('units.us'),
          saved: t('savedHint'),
          resetAll: t('resetAll'),
        }}
      />
    </div>
  )
}
