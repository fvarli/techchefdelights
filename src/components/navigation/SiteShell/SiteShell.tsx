import { getTranslations } from 'next-intl/server'
import { Header } from '@/components/navigation/Header'
import { Footer } from '@/components/navigation/Footer'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'
import type { ApiLocale } from '@/lib/api/enums'
import styles from './SiteShell.module.css'

type Props = {
  locale: ApiLocale
  children: React.ReactNode
}

export async function SiteShell({ locale, children }: Props) {
  const [tHeader, tFooter, tMobile, tCommon, tConsent] = await Promise.all([
    getTranslations('Header'),
    getTranslations('Footer'),
    getTranslations('MobileNav'),
    getTranslations('Common'),
    getTranslations('Consent'),
  ])

  const headerLabels = {
    recipes: tHeader('recipes'),
    categories: tHeader('categories'),
    search: tHeader('search'),
    saved: tHeader('saved'),
    profile: tHeader('profile'),
  }

  const footerLabels = {
    tagline: tFooter('tagline'),
    popularCategories: tFooter('popularCategories'),
    explore: {
      title: tFooter('explore.title'),
      recipes: tFooter('explore.recipes'),
      categories: tFooter('explore.categories'),
      diets: tFooter('explore.diets'),
      cuisines: tFooter('explore.cuisines'),
    },
    company: {
      title: tFooter('company.title'),
      about: tFooter('company.about'),
      contact: tFooter('company.contact'),
      privacy: tFooter('company.privacy'),
      terms: tFooter('company.terms'),
    },
    connect: {
      title: tFooter('connect.title'),
      instagram: tFooter('connect.instagram'),
      newsletter: tFooter('connect.newsletter'),
    },
    copyright: tFooter('copyright', { year: new Date().getFullYear() }),
    privacySettings: tConsent('manage'),
    builtBy: tFooter('builtBy'),
    builtByStudio: tFooter('builtByStudio'),
  }

  const mobileNavLabels = {
    home: tMobile('home'),
    search: tMobile('search'),
    saved: tMobile('saved'),
    plan: tMobile('plan'),
    profile: tMobile('profile'),
  }

  return (
    <>
      <a href="#main-content" className={styles.skipLink}>
        {tCommon('skipToContent')}
      </a>
      <Header locale={locale} labels={headerLabels} />
      <main id="main-content" className={styles.main}>
        {children}
      </main>
      <Footer locale={locale} labels={footerLabels} />
      <MobileBottomNav locale={locale} labels={mobileNavLabels} />
    </>
  )
}
