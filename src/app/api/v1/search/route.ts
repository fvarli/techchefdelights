import { NextResponse } from 'next/server'
import { z } from 'zod'
import { resolveLocale } from '@/lib/api/locale'
import { searchRecipes } from '@/lib/api/search-loader'
import { ApiErrors, apiError } from '@/lib/api/errors'
import { logger, reqMeta } from '@/lib/logger'
import { rateLimit } from '@/lib/rate-limit'
import { getRequestId, REQUEST_ID_HEADER } from '@/lib/request-id'

export const dynamic = 'force-dynamic'

const SearchQuery = z.object({
  q: z.string().trim().min(1).max(200),
  locale: z.enum(['en', 'tr', 'es']).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional(),
})

export async function GET(request: Request) {
  const requestId = getRequestId(request)
  const meta = { requestId, ...reqMeta(request) }

  const verdict = await rateLimit(request, 'search', { limit: 30, windowMs: 60_000 })
  if (!verdict.allowed) {
    const retryAfter = Math.max(1, Math.ceil((verdict.resetAt - Date.now()) / 1000))
    logger.warn('search.rate_limited', { ...meta, context: { retryAfter } })
    return ApiErrors.rateLimited(retryAfter, requestId)
  }

  const url = new URL(request.url)
  const parsed = SearchQuery.safeParse({
    q: url.searchParams.get('q') ?? '',
    locale: url.searchParams.get('locale') ?? undefined,
    limit: url.searchParams.get('limit') ?? undefined,
  })
  if (!parsed.success) {
    return apiError(400, 'INVALID_QUERY', 'Invalid search parameters.', parsed.error.issues, requestId)
  }

  const apiLocale = await resolveLocale(parsed.data.locale ?? null)
  const limit = parsed.data.limit ?? 20

  try {
    const result = await searchRecipes(apiLocale, parsed.data.q, limit)
    logger.info('search.query', {
      ...meta,
      context: {
        locale: apiLocale,
        qLength: parsed.data.q.length,
        results: result.items.length,
      },
    })
    return NextResponse.json(
      {
        query: result.query,
        locale: apiLocale,
        total: result.total,
        items: result.items,
      },
      { headers: { [REQUEST_ID_HEADER]: requestId } },
    )
  } catch (err) {
    logger.error('search.failed', {
      ...meta,
      context: { locale: apiLocale, error: err instanceof Error ? err.message : 'unknown' },
    })
    return ApiErrors.internal(requestId)
  }
}
