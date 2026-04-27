/**
 * Client-side observability bootstrap. Runs once per browser session
 * (Next.js client instrumentation hook). Sentry init is gated on
 * NEXT_PUBLIC_SENTRY_DSN — when unset, this is a no-op.
 *
 * The release id is resolved at build time from NEXT_PUBLIC_APP_VERSION
 * (the only release-related var that survives client bundling). Server
 * builds resolve a wider chain via src/lib/release.ts.
 */

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  import('@sentry/nextjs').then((Sentry) => {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      tracesSampleRate: 0.1,
      sendDefaultPii: false,
      environment: process.env.NEXT_PUBLIC_SENTRY_ENV ?? process.env.NODE_ENV,
      release: process.env.NEXT_PUBLIC_APP_VERSION,
    })
  })
}
