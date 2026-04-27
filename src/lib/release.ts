/**
 * Resolves the current release identifier for Sentry / health endpoint.
 *
 * Resolution order (first non-empty wins):
 *   1. NEXT_PUBLIC_APP_VERSION  (explicit override, also returned by /health)
 *   2. VERCEL_GIT_COMMIT_SHA    (auto-set by Vercel deploys)
 *   3. APP_COMMIT_SHA           (CI-injected fallback for non-Vercel deploys)
 *
 * Falls back to `undefined` when none are set — Sentry will use 'unknown'
 * release and source maps won't bind, but builds and runs are unaffected.
 */
export function resolveRelease(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_APP_VERSION ||
    process.env.VERCEL_GIT_COMMIT_SHA ||
    process.env.APP_COMMIT_SHA ||
    undefined
  )
}
