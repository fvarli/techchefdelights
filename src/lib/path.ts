import type { ApiLocale } from './api/enums'

/**
 * Build a locale-aware URL path. EN is the default and is served unprefixed
 * (`/r/<slug>`); TR and ES are prefixed (`/tr/r/<slug>`, `/es/r/<slug>`).
 */
export function localePath(locale: ApiLocale, path: string): string {
  if (locale === 'en') return path
  if (path === '/' || path === '') return `/${locale}`
  return `/${locale}${path}`
}
