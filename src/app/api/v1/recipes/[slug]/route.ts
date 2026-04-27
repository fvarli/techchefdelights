import { NextResponse } from 'next/server'
import { resolveLocale } from '@/lib/api/locale'
import { loadRecipeBySlug } from '@/lib/api/recipe-loader'
import { ApiErrors } from '@/lib/api/errors'
import { logger, reqMeta } from '@/lib/logger'
import { getRequestId, REQUEST_ID_HEADER } from '@/lib/request-id'
import type { ApiRecipeResponse } from '@/lib/api/types'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const requestId = getRequestId(request)
  const meta = { requestId, ...reqMeta(request) }
  try {
    const { slug } = await params
    const url = new URL(request.url)
    const queryLocale = url.searchParams.get('locale')
    const apiLocale = await resolveLocale(queryLocale)

    const recipe = await loadRecipeBySlug(slug, apiLocale)
    if (!recipe) return ApiErrors.recipeNotFound(slug, apiLocale, requestId)

    const body: ApiRecipeResponse = { recipe, locale: apiLocale }

    return NextResponse.json(body, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=300',
        [REQUEST_ID_HEADER]: requestId,
      },
    })
  } catch (err) {
    logger.error('recipes.get_failed', {
      ...meta,
      context: { error: err instanceof Error ? err.message : 'unknown' },
    })
    return ApiErrors.internal(requestId)
  }
}
