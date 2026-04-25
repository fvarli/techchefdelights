import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { resolveLocale } from '@/lib/api/locale'
import { fromApiLocale } from '@/lib/api/enums'
import { mapRecipeToApi } from '@/lib/api/recipe-mapper'
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
    const prismaLocale = fromApiLocale(apiLocale)

    // Strict (slug, locale) lookup — wrong combo → 404.
    const translation = await db.recipeTranslation.findUnique({
      where: { locale_slug: { locale: prismaLocale, slug } },
      select: { recipeId: true },
    })

    if (!translation) {
      return ApiErrors.recipeNotFound(slug, apiLocale)
    }

    const recipe = await db.recipe.findUnique({
      where: { id: translation.recipeId, isDraft: false },
      include: {
        translations: true,
        author: { include: { translations: true } },
        cuisine: { include: { translations: true } },
        ingredientGroups: {
          include: {
            translations: true,
            items: { include: { translations: true } },
          },
        },
        steps: {
          include: {
            translations: true,
            images: { include: { translations: true } },
          },
        },
        equipment: { include: { equipment: { include: { translations: true } } } },
        variations: { include: { translations: true } },
        faq: { include: { translations: true } },
        nutrition: true,
        video: true,
        categories: { include: { category: { include: { translations: true } } } },
        tags: { include: { tag: { include: { translations: true } } } },
        diets: { include: { diet: { include: { translations: true } } } },
        allergens: { include: { allergen: { include: { translations: true } } } },
        gallery: { include: { translations: true } },
      },
    })

    if (!recipe) {
      return ApiErrors.recipeNotFound(slug, apiLocale)
    }

    const apiRecipe = mapRecipeToApi(recipe, prismaLocale)
    const body: ApiRecipeResponse = { recipe: apiRecipe, locale: apiLocale }

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
