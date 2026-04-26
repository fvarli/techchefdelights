import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export type ApiLiveResponse = {
  nowCooking: number
  ttlSeconds: number
}

/**
 * Deterministic-by-5min "now cooking" counter for the home hero. Returns a
 * stable count within each 5-minute window (so SSR + client polling agree)
 * but varies through the day. Real engagement metrics replace this in v1.5.
 */
function deterministicCount(now: Date): number {
  const hour = now.getUTCHours()
  const day = now.getUTCDate()
  const fiveMinBucket = Math.floor(now.getUTCMinutes() / 5)
  const base = 800 + ((hour * 137 + day * 53) % 1600)
  return base + fiveMinBucket * 7
}

export async function GET(): Promise<NextResponse<ApiLiveResponse>> {
  const body: ApiLiveResponse = {
    nowCooking: deterministicCount(new Date()),
    ttlSeconds: 30,
  }
  return NextResponse.json(body, {
    headers: {
      'Cache-Control': 'public, s-maxage=20, stale-while-revalidate=60',
    },
  })
}
