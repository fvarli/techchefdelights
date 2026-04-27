import type { Metadata } from 'next'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { ConsentBanner, GoogleAnalytics } from '@/components/analytics'
import '@fontsource/instrument-serif'
import '@fontsource-variable/geist'
import '@fontsource-variable/jetbrains-mono'
import '../globals.css'

export const metadata: Metadata = {
  title: 'TechChefDelights',
  description: 'Where tech meets taste — recipes in three languages.',
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const t = await getTranslations('Consent')
  const gaConfigured = Boolean(process.env.NEXT_PUBLIC_GA_ID)

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
        <ConsentBanner
          enabled={gaConfigured}
          labels={{
            title: t('title'),
            description: t('description'),
            analytics: t('analytics'),
            accept: t('accept'),
            reject: t('reject'),
          }}
        />
        <GoogleAnalytics />
      </body>
    </html>
  )
}
