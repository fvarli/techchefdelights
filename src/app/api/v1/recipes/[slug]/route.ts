import { NextResponse } from 'next/server'
import { resolveLocale } from '@/lib/api/locale'
import { loadRecipeBySlug } from '@/lib/api/recipe-loader'
import { ApiErrors } from '@/lib/api/errors'
import type { ApiRecipeResponse } from '@/lib/api/types'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params
    const url = new URL(request.url)
    const queryLocale = url.searchParams.get('locale')
    const apiLocale = await resolveLocale(queryLocale)

    const recipe = await loadRecipeBySlug(slug, apiLocale)
    if (!recipe) return ApiErrors.recipeNotFound(slug, apiLocale)

    const body: ApiRecipeResponse = { recipe, locale: apiLocale }

    return NextResponse.json(body, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=300',
      },
    })
  } catch (err) {
    console.error('GET /api/v1/recipes/[slug] failed:', err)
    return ApiErrors.internal()
  }
}
