import type { ApiLocale } from './api/enums'

/**
 * Locale-aware URL builder for **public** routes.
 *
 * The first arg is the canonical English-form path (e.g. `/recipes`,
 * `/recipes/<slug>`, `/categories/<slug>`); this function returns the
 * URL the user should see for the requested locale, applying both the
 * locale prefix (TR/ES are prefixed; EN is unprefixed) and the
 * localized URL segments configured in `src/i18n/routing.ts`
 * (e.g. /recipes -> /tr/tarifler).
 *
 * Use this for any href that targets a route mapped in routing.pathnames.
 * For routes not in the map (admin, internal, raw filesystem), the path
 * is returned with the locale prefix applied as before.
 */

type LocalePathMap = Record<ApiLocale, string>

const PATHNAMES: Record<string, LocalePathMap | string> = {
  '/': '/',
  '/recipes': { en: '/recipes', tr: '/tarifler', es: '/recetas' },
  '/recipes/[slug]': { en: '/recipes/[slug]', tr: '/tarifler/[slug]', es: '/recetas/[slug]' },
  '/recipes/[slug]/cook': {
    en: '/recipes/[slug]/cook',
    tr: '/tarifler/[slug]/pisir',
    es: '/recetas/[slug]/cocinar',
  },
  '/print/[slug]': { en: '/print/[slug]', tr: '/yazdir/[slug]', es: '/imprimir/[slug]' },
  '/categories/[category]': {
    en: '/categories/[category]',
    tr: '/kategoriler/[category]',
    es: '/categorias/[category]',
  },
  '/diets/[diet]': { en: '/diets/[diet]', tr: '/diyetler/[diet]', es: '/dietas/[diet]' },
  '/search': { en: '/search', tr: '/ara', es: '/buscar' },
  '/saved': { en: '/saved', tr: '/kaydedilenler', es: '/guardadas' },
  '/profile': { en: '/profile', tr: '/profil', es: '/perfil' },
  '/plan': '/plan',
  '/design': '/design',
}

function withLocalePrefix(locale: ApiLocale, path: string): string {
  if (locale === 'en') return path
  if (path === '/' || path === '') return `/${locale}`
  return `/${locale}${path}`
}

/**
 * Match a concrete path against a parameterized pathnames key.
 * Returns the key + a substitution map of dynamic segments, or null.
 *
 *   matchPattern('/recipes/red-lentil-soup')
 *     -> { key: '/recipes/[slug]', params: { slug: 'red-lentil-soup' } }
 *   matchPattern('/recipes/red-lentil-soup/cook')
 *     -> { key: '/recipes/[slug]/cook', params: { slug: 'red-lentil-soup' } }
 */
function matchPattern(path: string): { key: string; params: Record<string, string> } | null {
  const pathSegs = path.split('/').filter(Boolean)
  for (const key of Object.keys(PATHNAMES)) {
    const keySegs = key.split('/').filter(Boolean)
    if (keySegs.length !== pathSegs.length) continue
    const params: Record<string, string> = {}
    let ok = true
    for (let i = 0; i < keySegs.length; i++) {
      const k = keySegs[i]
      const p = pathSegs[i]
      if (k.startsWith('[') && k.endsWith(']')) {
        params[k.slice(1, -1)] = p
      } else if (k !== p) {
        ok = false
        break
      }
    }
    if (ok) return { key, params }
  }
  return null
}

export function localePath(locale: ApiLocale, path: string): string {
  if (path === '/' || path === '') return withLocalePrefix(locale, '/')

  const matched = matchPattern(path)
  if (!matched) {
    // Not a registered public pathname — apply locale prefix only.
    return withLocalePrefix(locale, path)
  }

  const entry = PATHNAMES[matched.key]
  const template = typeof entry === 'string' ? entry : entry[locale]

  let resolved = template
  for (const [k, v] of Object.entries(matched.params)) {
    resolved = resolved.replace(`[${k}]`, v)
  }
  return withLocalePrefix(locale, resolved)
}
