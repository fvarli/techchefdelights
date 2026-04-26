import { setRequestLocale, getTranslations } from 'next-intl/server'

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('Home')

  return (
    <main
      style={{
        padding: 'var(--space-8)',
        maxWidth: 720,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          letterSpacing: '0.18em',
          color: 'var(--color-terra)',
          textTransform: 'uppercase',
        }}
      >
        ◆ {t('localeBadge')} / {t('kicker')}
      </div>
      <h1
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 64,
          lineHeight: 1.05,
          letterSpacing: '-0.02em',
          color: 'var(--color-ink)',
          margin: 0,
        }}
      >
        {t('title')}
      </h1>
      <p
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 18,
          color: 'var(--color-sub)',
          margin: 0,
        }}
      >
        {t('tagline')}
      </p>
    </main>
  )
}
