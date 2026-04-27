import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { logger, reqMeta } from '@/lib/logger'
import { rateLimitStoreKind } from '@/lib/rate-limit'
import { getRequestId, REQUEST_ID_HEADER } from '@/lib/request-id'
import { resolveRelease } from '@/lib/release'

export const dynamic = 'force-dynamic'

type HealthResponse = {
  status: 'ok' | 'degraded'
  db: 'ok' | 'error'
  rateLimitStore: 'redis' | 'memory'
  timestamp: string
  uptimeSeconds: number
  memory: {
    rssMb: number
    heapUsedMb: number
    heapTotalMb: number
  }
  environment: string
  commit?: string
  version?: string
  requestId: string
}

const toMb = (bytes: number) => Math.round((bytes / (1024 * 1024)) * 10) / 10

export async function GET(request: Request) {
  const requestId = getRequestId(request)

  let dbStatus: 'ok' | 'error' = 'error'
  try {
    await db.$queryRaw`SELECT 1`
    dbStatus = 'ok'
  } catch (err) {
    logger.error('health.db_check_failed', {
      requestId,
      ...reqMeta(request),
      context: { error: err instanceof Error ? err.message : 'unknown' },
    })
  }

  const isProd = process.env.NODE_ENV === 'production'
  const rlOk = !isProd || rateLimitStoreKind === 'redis'
  const status: 'ok' | 'degraded' = dbStatus === 'ok' && rlOk ? 'ok' : 'degraded'

  const mem = process.memoryUsage()

  const body: HealthResponse = {
    status,
    db: dbStatus,
    rateLimitStore: rateLimitStoreKind,
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.round(process.uptime()),
    memory: {
      rssMb: toMb(mem.rss),
      heapUsedMb: toMb(mem.heapUsed),
      heapTotalMb: toMb(mem.heapTotal),
    },
    environment: process.env.NODE_ENV ?? 'unknown',
    commit: process.env.VERCEL_GIT_COMMIT_SHA || process.env.APP_COMMIT_SHA,
    version: resolveRelease(),
    requestId,
  }

  return NextResponse.json(body, {
    status: body.status === 'ok' ? 200 : 503,
    headers: {
      'Cache-Control': 'no-store',
      [REQUEST_ID_HEADER]: requestId,
    },
  })
}
