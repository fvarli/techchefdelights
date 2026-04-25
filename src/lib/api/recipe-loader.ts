import { db } from '@/lib/db'
import { mapRecipeToApi } from './recipe-mapper'
import { fromApiLocale, type ApiLocale } from './enums'
import type { ApiRecipe } from './types'

/**
 * Strict (slug, locale) lookup. Returns null when no recipe exists for that
 * combination. Used by both the public HTTP route handler and the RSC page —
 * single source of truth for the DTO shape that ships to clients (Flutter
 * included). Internal callers skip the HTTP roundtrip.
 */
export async function loadRecipeBySlug(
  slug: string,
  apiLocale: ApiLocale,
): Promise<ApiRecipe | null> {
  const prismaLocale = fromApiLocale(apiLocale)

  const translation = await db.recipeTranslation.findUnique({
    where: { locale_slug: { locale: prismaLocale, slug } },
    select: { recipeId: true },
  })
  if (!translation) return null

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
  if (!recipe) return null

  return mapRecipeToApi(recipe, prismaLocale)
}
