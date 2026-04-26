'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      import('@sentry/nextjs').then((Sentry) => Sentry.captureException(error))
    }
  }, [error])

  return (
    <html lang="en">
      <body
        style={{
          fontFamily: 'system-ui, sans-serif',
          padding: '4rem 1.5rem',
          maxWidth: 560,
          margin: '0 auto',
        }}
      >
        <h1 style={{ fontSize: 28, marginBottom: 12 }}>Something went wrong</h1>
        <p style={{ color: '#555', marginBottom: 20 }}>
          The page hit an unexpected error. Try again, or head back home.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            padding: '8px 20px',
            border: '1px solid #111',
            borderRadius: 999,
            background: '#111',
            color: '#fff',
            cursor: 'pointer',
            marginRight: 8,
          }}
        >
          Try again
        </button>
        <a
          href="/"
          style={{
            padding: '8px 20px',
            border: '1px solid #111',
            borderRadius: 999,
            color: '#111',
            textDecoration: 'none',
            display: 'inline-block',
          }}
        >
          Home
        </a>
      </body>
    </html>
  )
}
