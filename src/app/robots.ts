import type { MetadataRoute } from 'next'

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, '') ?? 'https://techchefdelights.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          // API
          '/api/',
          // EN private/dynamic
          '/search',
          '/saved',
          '/profile',
          '/plan',
          '/print/',
          '/design',
          // TR localized
          '/tr/ara',
          '/tr/kaydedilenler',
          '/tr/profil',
          '/tr/plan',
          '/tr/yazdir/',
          '/tr/design',
          // ES localized
          '/es/buscar',
          '/es/guardadas',
          '/es/perfil',
          '/es/plan',
          '/es/imprimir/',
          '/es/design',
          // Cook mode (chromeless, never indexable)
          '/recipes/*/cook',
          '/tr/tarifler/*/pisir',
          '/es/recetas/*/cocinar',
          // Legacy short-form paths (kept disallowed in case caches still resolve them
          // before the 301 redirects run)
          '/r/',
          '/c/',
          '/d/',
          '/tr/r/',
          '/tr/c/',
          '/tr/d/',
          '/es/r/',
          '/es/c/',
          '/es/d/',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
