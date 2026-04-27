/**
 * IP-based rate limiter with a swappable backend.
 *
 *   - MemoryStore: per-process buckets. Fine for single-instance deploys
 *     and dev. Loses state on restart and doesn't share across replicas.
 *   - RedisStore: Upstash REST client. Shared across instances; persists
 *     across restarts.
 *
 * Backend is selected at module load: if UPSTASH_REDIS_REST_URL +
 * UPSTASH_REDIS_REST_TOKEN are set, RedisStore is used. Otherwise we
 * fall back to MemoryStore. The selection is exposed via
 * `rateLimitStoreKind` so the health endpoint can report which one is
 * live.
 */

import { Redis } from '@upstash/redis'

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

class RedisStore implements RateLimitStore {
  constructor(private readonly redis: Redis) {}

  async hit(key: string, windowMs: number, limit: number): Promise<RateLimitVerdict> {
    const now = Date.now()
    const windowSec = Math.max(1, Math.ceil(windowMs / 1000))
    const bucket = `tcd:rl:${key}:${Math.floor(now / windowMs)}`
    const ttlKey = `${bucket}:ttl`

    // INCR establishes the counter; the first caller in the window also
    // sets the absolute reset timestamp so every subsequent caller sees
    // the same resetAt.
    const count = await this.redis.incr(bucket)
    let resetAt = now + windowMs
    if (count === 1) {
      await this.redis.expire(bucket, windowSec)
      await this.redis.set(ttlKey, String(resetAt), { ex: windowSec })
    } else {
      const stored = await this.redis.get<string>(ttlKey)
      if (stored) resetAt = Number(stored)
    }

    return {
      allowed: count <= limit,
      limit,
      remaining: Math.max(0, limit - count),
      resetAt,
    }
  }
}

function makeStore(): { store: RateLimitStore; kind: 'redis' | 'memory' } {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (url && token) {
    const redis = new Redis({ url, token })
    return { store: new RedisStore(redis), kind: 'redis' }
  }
  if (process.env.NODE_ENV === 'production') {
    // Loud signal in production logs that we're running on a single-instance
    // store. Not a hard failure — single-instance deploys still work — but
    // multi-instance deploys MUST configure Upstash.
    // eslint-disable-next-line no-console
    console.warn(
      JSON.stringify({
        level: 'warn',
        message: 'rateLimit.fallback_memory_store',
        timestamp: new Date().toISOString(),
        context: { hint: 'set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN for multi-instance deploys' },
      }),
    )
  }
  return { store: new MemoryStore(), kind: 'memory' }
}

const globalForLimit = globalThis as unknown as {
  __tcd_rl?: { store: RateLimitStore; kind: 'redis' | 'memory' }
}
const selected = globalForLimit.__tcd_rl ?? makeStore()
if (process.env.NODE_ENV !== 'production') globalForLimit.__tcd_rl = selected

export const rateLimitStore: RateLimitStore = selected.store
export const rateLimitStoreKind: 'redis' | 'memory' = selected.kind

export function clientIpFrom(headers: Headers): string {
  const xff = headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0].trim()
  return headers.get('x-real-ip') ?? '0.0.0.0'
}

export async function rateLimit(
  request: Request,
  bucket: string,
  opts: { limit: number; windowMs: number },
): Promise<RateLimitVerdict> {
  const ip = clientIpFrom(request.headers)
  const key = `${bucket}:${ip}`
  return rateLimitStore.hit(key, opts.windowMs, opts.limit)
}
