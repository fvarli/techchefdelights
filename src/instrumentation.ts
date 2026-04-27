/**
 * Server-side observability bootstrap. Runs once per server start (Next.js
 * instrumentation hook). Sentry init is gated on SENTRY_DSN — when unset,
 * this is a no-op and the app behaves exactly as before.
 */

import { resolveRelease } from '@/lib/release'

export async function register() {
  if (!process.env.SENTRY_DSN) return

  const release = resolveRelease()
  const environment = process.env.SENTRY_ENV ?? process.env.NODE_ENV

  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const Sentry = await import('@sentry/nextjs')
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: 0.1,
      sendDefaultPii: false,
      environment,
      release,
    })
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    const Sentry = await import('@sentry/nextjs')
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: 0.1,
      sendDefaultPii: false,
      environment,
      release,
    })
  }
}

type SentryOnRequestError = typeof import('@sentry/nextjs')['captureRequestError']

export const onRequestError: SentryOnRequestError = async (err, request, context) => {
  if (!process.env.SENTRY_DSN) return
  const Sentry = await import('@sentry/nextjs')
  return Sentry.captureRequestError(err, request, context)
}
