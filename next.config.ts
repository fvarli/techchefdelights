import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import createBundleAnalyzer from '@next/bundle-analyzer'
import { withSentryConfig } from '@sentry/nextjs'

const isProd = process.env.NODE_ENV === 'production'

// Build a CSP that allows only what we actually use:
// - 'self' for our own assets
// - Cloudinary for images
// - Google Tag Manager for the gtag loader script (when GA enabled)
// - GA + Sentry for connect-src telemetry (always allowed; if not used,
//   browser simply makes no request)
// - 'unsafe-inline' for script + style is required by Next.js 16's
//   inline RSC bootstrap. Documented as a known compat allowance;
//   nonce-based hardening is a follow-up.
// In dev we add the websocket scheme for HMR and 'unsafe-eval' which
// Turbopack needs for source maps.
function buildCsp(): string {
  const directives: Record<string, string[]> = {
    'default-src': ["'self'"],
    'base-uri': ["'self'"],
    'object-src': ["'none'"],
    'frame-ancestors': ["'none'"],
    'form-action': ["'self'"],
    'img-src': [
      "'self'",
      'data:',
      'blob:',
      'https://res.cloudinary.com',
      'https://*.cloudinary.com',
    ],
    'font-src': ["'self'", 'data:'],
    'connect-src': [
      "'self'",
      'https://www.google-analytics.com',
      'https://analytics.google.com',
      'https://*.ingest.sentry.io',
    ],
    'script-src': [
      "'self'",
      "'unsafe-inline'",
      'https://www.googletagmanager.com',
      'https://www.google-analytics.com',
    ],
    'style-src': ["'self'", "'unsafe-inline'"],
    'worker-src': ["'self'", 'blob:'],
  }

  if (!isProd) {
    directives['connect-src'].push('ws:', 'wss:', 'http://localhost:*', 'http://127.0.0.1:*')
    directives['script-src'].push("'unsafe-eval'")
  }

  const parts = Object.entries(directives).map(([k, v]) => `${k} ${v.join(' ')}`)
  if (isProd) parts.push('upgrade-insecure-requests')
  return parts.join('; ')
}

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(self), geolocation=(), interest-cohort=()',
  },
  { key: 'Content-Security-Policy', value: buildCsp() },
  ...(isProd
    ? [
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload',
        },
      ]
    : []),
]

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: Boolean(
    process.env.SENTRY_AUTH_TOKEN && process.env.SENTRY_ORG && process.env.SENTRY_PROJECT,
  ),
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
  async redirects() {
    // Permanent (308 — Next.js's permanent redirect, equivalent to 301 for
    // search-engine signals while preserving the request method) redirects
    // from the legacy short-form URLs to the new SEO-friendly localized
    // paths. These cover every previously-shipped public path so external
    // links and search-index entries don't 404.
    return [
      // EN — short form -> canonical
      { source: '/r/:slug', destination: '/recipes/:slug', permanent: true },
      { source: '/r/:slug/cook', destination: '/recipes/:slug/cook', permanent: true },
      { source: '/c/:slug', destination: '/categories/:slug', permanent: true },
      { source: '/d/:slug', destination: '/diets/:slug', permanent: true },
      // TR — old non-localized prefix -> localized
      { source: '/tr/r/:slug', destination: '/tr/tarifler/:slug', permanent: true },
      { source: '/tr/r/:slug/cook', destination: '/tr/tarifler/:slug/pisir', permanent: true },
      { source: '/tr/c/:slug', destination: '/tr/kategoriler/:slug', permanent: true },
      { source: '/tr/d/:slug', destination: '/tr/diyetler/:slug', permanent: true },
      { source: '/tr/recipes', destination: '/tr/tarifler', permanent: true },
      { source: '/tr/recipes/:slug', destination: '/tr/tarifler/:slug', permanent: true },
      { source: '/tr/recipes/:slug/cook', destination: '/tr/tarifler/:slug/pisir', permanent: true },
      { source: '/tr/print/:slug', destination: '/tr/yazdir/:slug', permanent: true },
      { source: '/tr/categories/:slug', destination: '/tr/kategoriler/:slug', permanent: true },
      { source: '/tr/diets/:slug', destination: '/tr/diyetler/:slug', permanent: true },
      { source: '/tr/search', destination: '/tr/ara', permanent: true },
      { source: '/tr/saved', destination: '/tr/kaydedilenler', permanent: true },
      { source: '/tr/profile', destination: '/tr/profil', permanent: true },
      // ES — old non-localized prefix -> localized
      { source: '/es/r/:slug', destination: '/es/recetas/:slug', permanent: true },
      { source: '/es/r/:slug/cook', destination: '/es/recetas/:slug/cocinar', permanent: true },
      { source: '/es/c/:slug', destination: '/es/categorias/:slug', permanent: true },
      { source: '/es/d/:slug', destination: '/es/dietas/:slug', permanent: true },
      { source: '/es/recipes', destination: '/es/recetas', permanent: true },
      { source: '/es/recipes/:slug', destination: '/es/recetas/:slug', permanent: true },
      { source: '/es/recipes/:slug/cook', destination: '/es/recetas/:slug/cocinar', permanent: true },
      { source: '/es/print/:slug', destination: '/es/imprimir/:slug', permanent: true },
      { source: '/es/categories/:slug', destination: '/es/categorias/:slug', permanent: true },
      { source: '/es/diets/:slug', destination: '/es/dietas/:slug', permanent: true },
      { source: '/es/search', destination: '/es/buscar', permanent: true },
      { source: '/es/saved', destination: '/es/guardadas', permanent: true },
      { source: '/es/profile', destination: '/es/perfil', permanent: true },
    ]
  },
}

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const withBundleAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const composedConfig = withBundleAnalyzer(withNextIntl(nextConfig))

// Only run withSentryConfig (which uploads source maps) when CI has wired
// SENTRY_AUTH_TOKEN + SENTRY_ORG + SENTRY_PROJECT. Local dev and PR builds
// without a token pass through unmodified.
const sentryConfigured =
  process.env.SENTRY_AUTH_TOKEN && process.env.SENTRY_ORG && process.env.SENTRY_PROJECT

const release =
  process.env.NEXT_PUBLIC_APP_VERSION ||
  process.env.VERCEL_GIT_COMMIT_SHA ||
  process.env.APP_COMMIT_SHA ||
  undefined

export default sentryConfigured
  ? withSentryConfig(composedConfig, {
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      silent: !process.env.CI,
      release: release ? { name: release } : undefined,
      sourcemaps: {
        // Upload source maps to Sentry, then delete them from the
        // public build output so they aren't served to browsers.
        deleteSourcemapsAfterUpload: true,
      },
      disableLogger: true,
    })
  : composedConfig
