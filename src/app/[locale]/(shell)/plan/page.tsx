import type { Metadata } from 'next'
import Link from 'next/link'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { localePath } from '@/lib/path'
import type { ApiLocale } from '@/lib/api/enums'
import styles from './plan.module.css'

export const revalidate = 3600

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: ApiLocale }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Plan' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    robots: { index: false, follow: false },
    alternates: {
      canonical: locale === 'en' ? '/plan' : `/${locale}/plan`,
      languages: { en: '/plan', tr: '/tr/plan', es: '/es/plan' },
    },
  }
}

export default async function PlanPage({
  params,
}: {
  params: Promise<{ locale: ApiLocale }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('Plan')

  const features = ['feature1', 'feature2', 'feature3', 'feature4'] as const

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.kicker}>{t('kicker')}</span>
        <h1 className={styles.title}>{t('title')}</h1>
        <p className={styles.lede}>{t('lede')}</p>
      </header>

      <section className={styles.preview} aria-label={t('previewLabel')}>
        <span className={styles.previewBadge}>{t('previewBadge')}</span>
        <ul className={styles.featureList}>
          {features.map((key) => (
            <li key={key} className={styles.featureItem}>
              <span className={styles.featureMarker} aria-hidden>
                ◧
              </span>
              <div>
                <p className={styles.featureTitle}>{t(`features.${key}.title`)}</p>
                <p className={styles.featureBody}>{t(`features.${key}.body`)}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <div className={styles.cta}>
        <Link href={localePath(locale, '/recipes')} className={styles.ctaPrimary}>
          {t('cta.recipes')}
        </Link>
        <Link href={localePath(locale, '/saved')} className={styles.ctaSecondary}>
          {t('cta.saved')}
        </Link>
      </div>
    </div>
  )
}
