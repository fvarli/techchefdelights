import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { logger, reqMeta } from '@/lib/logger'
import { getRequestId, REQUEST_ID_HEADER } from '@/lib/request-id'

export const dynamic = 'force-dynamic'

type HealthResponse = {
  status: 'ok' | 'degraded'
  db: 'ok' | 'fail'
  timestamp: string
  version?: string
  requestId: string
}

export async function GET(request: Request) {
  const requestId = getRequestId(request)
  let dbStatus: 'ok' | 'fail' = 'fail'
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

  const body: HealthResponse = {
    status: dbStatus === 'ok' ? 'ok' : 'degraded',
    db: dbStatus,
    timestamp: new Date().toISOString(),
    version: process.env.NEXT_PUBLIC_APP_VERSION,
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
