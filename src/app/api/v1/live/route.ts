import { NextResponse } from 'next/server'
import { deterministicLiveCount, LIVE_COUNTER_TTL_SECONDS } from '@/lib/api/live-counter'

export const dynamic = 'force-dynamic'

export type ApiLiveResponse = {
  nowCooking: number
  ttlSeconds: number
}

export async function GET(): Promise<NextResponse<ApiLiveResponse>> {
  const body: ApiLiveResponse = {
    nowCooking: deterministicLiveCount(),
    ttlSeconds: LIVE_COUNTER_TTL_SECONDS,
  }
  return NextResponse.json(body, {
    headers: {
      'Cache-Control': 'public, s-maxage=20, stale-while-revalidate=60',
    },
  })
}
