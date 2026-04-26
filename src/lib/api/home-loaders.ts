import { db } from '@/lib/db'
import { fromApiLocale, toApiSkill, type ApiLocale, type ApiSkill } from './enums'

export type HomeRecipeCard = {
  id: string
  slug: string
  title: string
  tagline: string
  totalMinutes: number
  servings: number
  skill: ApiSkill
  ratingAvg: number
  ratingCount: number
  cuisine: string | null
  heroImageCloudinary: string
}

export type HomeFeaturedItem = {
  recipe: HomeRecipeCard
  pullQuote: string | null
  byline: string | null
}

export type HomeCategoryTile = {
  slug: string
  name: string
  iconKey: string | null
  popularityRank: number
  recipeCount: number
}

export type HomeDietTile = {
  slug: string
  name: string
  recipeCount: number
}

function mapRecipeRowToCard(
  recipe: {
    id: string
    totalMinutes: number
    servings: number
    skill: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
    ratingAvg: number
    ratingCount: number
    heroImageCloudinary: string
    translations: Array<{
      slug: string
      title: string
      tagline: string
    }>
    cuisine: { translations: Array<{ name: string }> } | null
  },
): HomeRecipeCard | null {
  const tx = recipe.translations[0]
  if (!tx) return null
  return {
    id: recipe.id,
    slug: tx.slug,
    title: tx.title,
    tagline: tx.tagline,
    totalMinutes: recipe.totalMinutes,
    servings: recipe.servings,
    skill: toApiSkill(recipe.skill),
    ratingAvg: recipe.ratingAvg,
    ratingCount: recipe.ratingCount,
    cuisine: recipe.cuisine?.translations[0]?.name ?? null,
    heroImageCloudinary: recipe.heroImageCloudinary,
  }
}

/**
 * Trending: top-rated recipes (ratingAvg DESC, then ratingCount DESC).
 * v1 placeholder until we have real engagement metrics (saves, cooks).
 */
export async function loadTrending(locale: ApiLocale, limit = 4): Promise<HomeRecipeCard[]> {
  const prismaLocale = fromApiLocale(locale)
  const rows = await db.recipe.findMany({
    where: { isDraft: false, translations: { some: { locale: prismaLocale } } },
    orderBy: [{ ratingAvg: 'desc' }, { ratingCount: 'desc' }],
    take: limit,
    include: {
      translations: { where: { locale: prismaLocale } },
      cuisine: { include: { translations: { where: { locale: prismaLocale } } } },
    },
  })
  return rows.map(mapRecipeRowToCard).filter((c): c is HomeRecipeCard => c !== null)
}

/**
 * Latest: newest recipes by publishedAt.
 */
export async function loadLatest(locale: ApiLocale, limit = 6): Promise<HomeRecipeCard[]> {
  const prismaLocale = fromApiLocale(locale)
  const rows = await db.recipe.findMany({
    where: { isDraft: false, translations: { some: { locale: prismaLocale } } },
    orderBy: { publishedAt: 'desc' },
    take: limit,
    include: {
      translations: { where: { locale: prismaLocale } },
      cuisine: { include: { translations: { where: { locale: prismaLocale } } } },
    },
  })
  return rows.map(mapRecipeRowToCard).filter((c): c is HomeRecipeCard => c !== null)
}

/**
 * Editorial feature: active EditorialPick (lowest position) → recipe card +
 * locale-specific pullQuote/byline. Falls back to latest when no pick exists.
 */
export async function loadFeatured(locale: ApiLocale): Promise<HomeFeaturedItem | null> {
  const prismaLocale = fromApiLocale(locale)
  const pick = await db.editorialPick.findFirst({
    where: { isActive: true },
    orderBy: { position: 'asc' },
    include: {
      translations: { where: { locale: prismaLocale } },
      recipe: {
        include: {
          translations: { where: { locale: prismaLocale } },
          cuisine: { include: { translations: { where: { locale: prismaLocale } } } },
        },
      },
    },
  })
  if (pick) {
    const card = mapRecipeRowToCard(pick.recipe)
    if (!card) return null
    return {
      recipe: card,
      pullQuote: pick.translations[0]?.pullQuote ?? null,
      byline: pick.translations[0]?.byline ?? null,
    }
  }
  // Fallback: most recent recipe
  const [latest] = await loadLatest(locale, 1)
  if (!latest) return null
  return { recipe: latest, pullQuote: null, byline: null }
}

/**
 * Category tiles: all categories ordered by popularityRank, with translation
 * + recipe count from the join table.
 */
export async function loadCategoryTiles(locale: ApiLocale): Promise<HomeCategoryTile[]> {
  const prismaLocale = fromApiLocale(locale)
  const categories = await db.category.findMany({
    orderBy: { popularityRank: 'asc' },
    include: {
      translations: { where: { locale: prismaLocale } },
      _count: { select: { recipes: true } },
    },
  })
  return categories
    .filter((c) => c.translations[0])
    .map((c) => ({
      slug: c.translations[0].slug,
      name: c.translations[0].name,
      iconKey: c.iconKey,
      popularityRank: c.popularityRank,
      recipeCount: c._count.recipes,
    }))
}

/**
 * Diet tiles: top diets by recipe count.
 */
export async function loadDietTiles(locale: ApiLocale, limit = 4): Promise<HomeDietTile[]> {
  const prismaLocale = fromApiLocale(locale)
  const diets = await db.diet.findMany({
    include: {
      translations: { where: { locale: prismaLocale } },
      _count: { select: { recipes: true } },
    },
  })
  return diets
    .filter((d) => d.translations[0])
    .map((d) => ({
      slug: d.slug,
      name: d.translations[0].name,
      recipeCount: d._count.recipes,
    }))
    .sort((a, b) => b.recipeCount - a.recipeCount)
    .slice(0, limit)
}
