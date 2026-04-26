/**
 * Client-side observability bootstrap. Runs once per browser session
 * (Next.js client instrumentation hook). Sentry init is gated on
 * NEXT_PUBLIC_SENTRY_DSN — when unset, this is a no-op.
 */

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  import('@sentry/nextjs').then((Sentry) => {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      tracesSampleRate: 0.1,
      sendDefaultPii: false,
      environment: process.env.NEXT_PUBLIC_SENTRY_ENV ?? process.env.NODE_ENV,
    })
  })
}
