import { setRequestLocale } from 'next-intl/server'
import { SiteShell } from '@/components/navigation/SiteShell'
import type { ApiLocale } from '@/lib/api/enums'

export default async function ShellLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  return <SiteShell locale={locale as ApiLocale}>{children}</SiteShell>
}
