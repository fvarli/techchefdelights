/**
 * IP-based rate limiter with three swappable backends:
 *
 *   1. StandardRedisStore — connects via REDIS_URL using ioredis. Best for
 *      VPS / self-hosted production where you run your own Redis.
 *   2. UpstashRedisStore — Upstash REST API. For serverless/edge deploys
 *      that can't hold a TCP socket (Vercel, Cloudflare).
 *   3. MemoryStore — per-process buckets. Local dev / single-instance only.
 *
 * Backend is selected at module load. Priority:
 *   REDIS_URL > (UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN) > memory
 *
 * In production, MemoryStore emits a one-shot warn log and the health
 * endpoint reports `degraded` so misconfigurations are visible.
 */

import { Redis as Upstash } from '@upstash/redis'
import IORedis, { type Redis as IORedisClient } from 'ioredis'

export type RateLimitStoreKind = 'redis' | 'upstash' | 'memory'

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

/**
 * Standard Redis (ioredis) — fixed window using INCR + EXPIRE on the
 * counter, with a sibling `:ttl` key so all callers in the same window
 * see the same absolute resetAt.
 */
class StandardRedisStore implements RateLimitStore {
  constructor(private readonly redis: IORedisClient) {}

  async hit(key: string, windowMs: number, limit: number): Promise<RateLimitVerdict> {
    const now = Date.now()
    const windowSec = Math.max(1, Math.ceil(windowMs / 1000))
    const bucket = `tcd:rl:${key}:${Math.floor(now / windowMs)}`
    const ttlKey = `${bucket}:ttl`

    const count = await this.redis.incr(bucket)
    let resetAt = now + windowMs
    if (count === 1) {
      await this.redis.expire(bucket, windowSec)
      await this.redis.set(ttlKey, String(resetAt), 'EX', windowSec)
    } else {
      const stored = await this.redis.get(ttlKey)
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

class UpstashRedisStore implements RateLimitStore {
  constructor(private readonly redis: Upstash) {}

  async hit(key: string, windowMs: number, limit: number): Promise<RateLimitVerdict> {
    const now = Date.now()
    const windowSec = Math.max(1, Math.ceil(windowMs / 1000))
    const bucket = `tcd:rl:${key}:${Math.floor(now / windowMs)}`
    const ttlKey = `${bucket}:ttl`

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

function makeStore(): { store: RateLimitStore; kind: RateLimitStoreKind } {
  const redisUrl = process.env.REDIS_URL
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN

  if (redisUrl) {
    const redis = new IORedis(redisUrl, {
      // Don't crash the process if Redis is briefly unreachable; let
      // the operation throw and the caller's try/catch (or the rate
      // limit endpoint's swallow path) handle it.
      lazyConnect: false,
      maxRetriesPerRequest: 2,
      enableReadyCheck: true,
    })
    return { store: new StandardRedisStore(redis), kind: 'redis' }
  }

  if (upstashUrl && upstashToken) {
    const redis = new Upstash({ url: upstashUrl, token: upstashToken })
    return { store: new UpstashRedisStore(redis), kind: 'upstash' }
  }

  if (process.env.NODE_ENV === 'production') {
    // eslint-disable-next-line no-console
    console.warn(
      JSON.stringify({
        level: 'warn',
        message: 'rateLimit.fallback_memory_store',
        timestamp: new Date().toISOString(),
        context: {
          hint: 'set REDIS_URL (self-hosted) or UPSTASH_REDIS_REST_URL+TOKEN (serverless) for multi-instance deploys',
        },
      }),
    )
  }
  return { store: new MemoryStore(), kind: 'memory' }
}

const globalForLimit = globalThis as unknown as {
  __tcd_rl?: { store: RateLimitStore; kind: RateLimitStoreKind }
}
const selected = globalForLimit.__tcd_rl ?? makeStore()
if (process.env.NODE_ENV !== 'production') globalForLimit.__tcd_rl = selected

export const rateLimitStore: RateLimitStore = selected.store
export const rateLimitStoreKind: RateLimitStoreKind = selected.kind

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
