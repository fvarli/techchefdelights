/**
 * Deterministic-by-5min "now cooking" counter. Stable within each 5-minute
 * window so SSR + client polling agree, varies through the day.
 */
export function deterministicLiveCount(now: Date = new Date()): number {
  const hour = now.getUTCHours()
  const day = now.getUTCDate()
  const fiveMinBucket = Math.floor(now.getUTCMinutes() / 5)
  const base = 800 + ((hour * 137 + day * 53) % 1600)
  return base + fiveMinBucket * 7
}

export const LIVE_COUNTER_TTL_SECONDS = 30
