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
          '/api/',
          '/search',
          '/saved',
          '/profile',
          '/plan',
          '/print/',
          '/design',
          // Per-locale variants
          '/tr/search',
          '/tr/saved',
          '/tr/profile',
          '/tr/plan',
          '/tr/print/',
          '/tr/design',
          '/es/search',
          '/es/saved',
          '/es/profile',
          '/es/plan',
          '/es/print/',
          '/es/design',
          // Cook mode
          '/r/*/cook',
          '/tr/r/*/cook',
          '/es/r/*/cook',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
