import { cookies, headers } from 'next/headers'
import { z } from 'zod'
import type { ApiLocale } from './enums'

const ApiLocaleSchema = z.enum(['en', 'tr', 'es'])

const LOCALE_COOKIE = 'tcd_locale'
const SUPPORTED: ApiLocale[] = ['en', 'tr', 'es']
const DEFAULT_LOCALE: ApiLocale = 'en'

/**
 * Resolve API locale by precedence:
 *   1. ?locale query param
 *   2. Accept-Language header (best-effort match)
 *   3. tcd_locale cookie
 *   4. default 'en'
 */
export async function resolveLocale(queryLocale?: string | null): Promise<ApiLocale> {
  if (queryLocale) {
    const parsed = ApiLocaleSchema.safeParse(queryLocale.toLowerCase())
    if (parsed.success) return parsed.data
  }

  const headerList = await headers()
  const acceptLanguage = headerList.get('accept-language')
  if (acceptLanguage) {
    const preferred = acceptLanguage
      .split(',')
      .map((part) => part.split(';')[0].trim().slice(0, 2).toLowerCase())
    for (const code of preferred) {
      if (SUPPORTED.includes(code as ApiLocale)) return code as ApiLocale
    }
  }

  const cookieStore = await cookies()
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value
  if (cookieLocale) {
    const parsed = ApiLocaleSchema.safeParse(cookieLocale.toLowerCase())
    if (parsed.success) return parsed.data
  }

  return DEFAULT_LOCALE
}
