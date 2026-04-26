import { db } from '@/lib/db'
import {
  fromApiLocale,
  toApiSkill,
  type ApiLocale,
  type ApiSkill,
} from './enums'
import type { Prisma } from '@/generated/prisma/client'
import type { HomeRecipeCard } from './home-loaders'

export type RecipeListFilters = {
  cuisine?: string
  diet?: string
  category?: string
  skill?: ApiSkill
  maxMinutes?: number
}

export type RecipeListPage = {
  items: HomeRecipeCard[]
  nextCursor: string | null
  total: number
}

export type FilterOption = { slug: string; name: string; count: number }

const PAGE_SIZE = 24
const MAX_PAGE_SIZE = 60

function buildWhere(
  locale: ApiLocale,
  filters: RecipeListFilters,
): Prisma.RecipeWhereInput {
  const prismaLocale = fromApiLocale(locale)
  const where: Prisma.RecipeWhereInput = {
    isDraft: false,
    translations: { some: { locale: prismaLocale } },
  }
  if (filters.cuisine) where.cuisine = { slug: filters.cuisine }
  if (filters.diet) where.diets = { some: { diet: { slug: filters.diet } } }
  if (filters.category)
    where.categories = { some: { category: { slug: filters.category } } }
  if (filters.skill) where.skill = filters.skill.toUpperCase() as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  if (filters.maxMinutes && filters.maxMinutes > 0)
    where.totalMinutes = { lte: filters.maxMinutes }
  return where
}

export async function loadRecipeList(
  locale: ApiLocale,
  filters: RecipeListFilters = {},
  cursor?: string,
  limit: number = PAGE_SIZE,
): Promise<RecipeListPage> {
  const prismaLocale = fromApiLocale(locale)
  const safeLimit = Math.min(Math.max(1, limit), MAX_PAGE_SIZE)
  const where = buildWhere(locale, filters)

  const [rows, total] = await Promise.all([
    db.recipe.findMany({
      where,
      orderBy: [{ publishedAt: 'desc' }, { id: 'desc' }],
      take: safeLimit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      include: {
        translations: { where: { locale: prismaLocale } },
        cuisine: { include: { translations: { where: { locale: prismaLocale } } } },
      },
    }),
    db.recipe.count({ where }),
  ])

  const hasMore = rows.length > safeLimit
  const pageRows = hasMore ? rows.slice(0, safeLimit) : rows
  const items: HomeRecipeCard[] = pageRows
    .map((r) => {
      const tx = r.translations[0]
      if (!tx) return null
      return {
        id: r.id,
        slug: tx.slug,
        title: tx.title,
        tagline: tx.tagline,
        totalMinutes: r.totalMinutes,
        servings: r.servings,
        skill: toApiSkill(r.skill),
        ratingAvg: r.ratingAvg,
        ratingCount: r.ratingCount,
        cuisine: r.cuisine?.translations[0]?.name ?? null,
        heroImageCloudinary: r.heroImageCloudinary,
      }
    })
    .filter((c): c is HomeRecipeCard => c !== null)

  const nextCursor = hasMore ? pageRows[pageRows.length - 1].id : null
  return { items, nextCursor, total }
}

export async function loadFilterOptions(locale: ApiLocale): Promise<{
  cuisines: FilterOption[]
  diets: FilterOption[]
  categories: FilterOption[]
}> {
  const prismaLocale = fromApiLocale(locale)
  const [cuisines, diets, categories] = await Promise.all([
    db.cuisine.findMany({
      include: {
        translations: { where: { locale: prismaLocale } },
        _count: { select: { recipes: true } },
      },
    }),
    db.diet.findMany({
      include: {
        translations: { where: { locale: prismaLocale } },
        _count: { select: { recipes: true } },
      },
    }),
    db.category.findMany({
      orderBy: { popularityRank: 'asc' },
      include: {
        translations: { where: { locale: prismaLocale } },
        _count: { select: { recipes: true } },
      },
    }),
  ])

  const toOption = (
    rows: Array<{
      slug: string
      translations: Array<{ name: string }>
      _count: { recipes: number }
    }>,
  ): FilterOption[] =>
    rows
      .filter((r) => r.translations[0] && r._count.recipes > 0)
      .map((r) => ({ slug: r.slug, name: r.translations[0].name, count: r._count.recipes }))
      .sort((a, b) => b.count - a.count)

  return {
    cuisines: toOption(cuisines),
    diets: toOption(diets),
    categories: toOption(categories),
  }
}
