import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { logger, reqMeta } from '@/lib/logger'

export const dynamic = 'force-dynamic'

type HealthResponse = {
  status: 'ok' | 'degraded'
  db: 'ok' | 'fail'
  timestamp: string
  version?: string
}

export async function GET(request: Request) {
  let dbStatus: 'ok' | 'fail' = 'fail'
  try {
    await db.$queryRaw`SELECT 1`
    dbStatus = 'ok'
  } catch (err) {
    logger.error('health.db_check_failed', {
      ...reqMeta(request),
      context: { error: err instanceof Error ? err.message : 'unknown' },
    })
  }

  const body: HealthResponse = {
    status: dbStatus === 'ok' ? 'ok' : 'degraded',
    db: dbStatus,
    timestamp: new Date().toISOString(),
    version: process.env.NEXT_PUBLIC_APP_VERSION,
  }

  return NextResponse.json(body, {
    status: body.status === 'ok' ? 200 : 503,
    headers: { 'Cache-Control': 'no-store' },
  })
}
