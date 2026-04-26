/**
 * Lightweight in-memory IP-based rate limiter with a swappable interface.
 *
 * v1 strategy is fixed-window per (key, bucket) stored in process memory.
 * That's fine for single-instance deploys; for multi-instance, swap the
 * RateLimitStore implementation for a Redis/Upstash-backed one without
 * touching call sites.
 */

export type RateLimitVerdict = {
  allowed: boolean
  limit: number
  remaining: number
  resetAt: number
}

export interface RateLimitStore {
  hit(key: string, windowMs: number, limit: number): Promise<RateLimitVerdict>
}

type Bucket = { count: number; resetAt: number }

class MemoryStore implements RateLimitStore {
  private buckets = new Map<string, Bucket>()
  private lastSweep = Date.now()
  private sweepEvery = 60_000

  async hit(key: string, windowMs: number, limit: number): Promise<RateLimitVerdict> {
    const now = Date.now()
    if (now - this.lastSweep > this.sweepEvery) this.sweep(now)

    const existing = this.buckets.get(key)
    if (!existing || existing.resetAt <= now) {
      const fresh: Bucket = { count: 1, resetAt: now + windowMs }
      this.buckets.set(key, fresh)
      return { allowed: true, limit, remaining: limit - 1, resetAt: fresh.resetAt }
    }
    existing.count += 1
    const remaining = Math.max(0, limit - existing.count)
    return {
      allowed: existing.count <= limit,
      limit,
      remaining,
      resetAt: existing.resetAt,
    }
  }

  private sweep(now: number) {
    for (const [k, b] of this.buckets) {
      if (b.resetAt <= now) this.buckets.delete(k)
    }
    this.lastSweep = now
  }
}

const globalForLimit = globalThis as unknown as { __tcd_rl?: RateLimitStore }
export const rateLimitStore: RateLimitStore = globalForLimit.__tcd_rl ?? new MemoryStore()
if (process.env.NODE_ENV !== 'production') globalForLimit.__tcd_rl = rateLimitStore

export function clientIpFrom(headers: Headers): string {
  const xff = headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0].trim()
  return headers.get('x-real-ip') ?? '0.0.0.0'
}

/**
 * Convenience wrapper. `bucket` namespaces independent counters so e.g.
 * /newsletter and /search don't share quota.
 */
export async function rateLimit(
  request: Request,
  bucket: string,
  opts: { limit: number; windowMs: number },
): Promise<RateLimitVerdict> {
  const ip = clientIpFrom(request.headers)
  const key = `${bucket}:${ip}`
  return rateLimitStore.hit(key, opts.windowMs, opts.limit)
}
