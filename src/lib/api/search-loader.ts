import { db } from '@/lib/db'
import { fromApiLocale, toApiSkill, type ApiLocale } from './enums'
import type { HomeRecipeCard } from './home-loaders'

const MAX_QUERY_LEN = 200
const DEFAULT_LIMIT = 50

type SearchRow = {
  id: string
  slug: string
  title: string
  tagline: string
  totalMinutes: number
  servings: number
  skill: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  ratingAvg: number
  ratingCount: number
  heroImageCloudinary: string
  cuisine: string | null
  rank: number
}

export type SearchResult = {
  query: string
  items: HomeRecipeCard[]
  total: number
}

export function normalizeQuery(raw: string | null | undefined): string {
  if (!raw) return ''
  return raw.trim().slice(0, MAX_QUERY_LEN)
}

export async function searchRecipes(
  locale: ApiLocale,
  rawQuery: string,
  limit: number = DEFAULT_LIMIT,
): Promise<SearchResult> {
  const q = normalizeQuery(rawQuery)
  if (!q) return { query: '', items: [], total: 0 }

  const prismaLocale = fromApiLocale(locale)
  const safeLimit = Math.min(Math.max(1, limit), 100)

  const rows = await db.$queryRaw<SearchRow[]>`
    WITH tsq AS (
      SELECT plainto_tsquery(
        public.tcd_locale_to_regconfig(${prismaLocale}::text),
        ${q}
      ) AS query
    )
    SELECT
      r.id,
      rt.slug,
      rt.title,
      rt.tagline,
      r."totalMinutes",
      r.servings,
      r.skill::text AS skill,
      r."ratingAvg",
      r."ratingCount",
      r."heroImageCloudinary",
      ct.name AS cuisine,
      ts_rank_cd(rt."searchVector", tsq.query) AS rank
    FROM "Recipe" r
    JOIN "RecipeTranslation" rt
      ON rt."recipeId" = r.id AND rt.locale = ${prismaLocale}::"Locale"
    LEFT JOIN "Cuisine" cu
      ON cu.id = r."cuisineId"
    LEFT JOIN "CuisineTranslation" ct
      ON ct."cuisineId" = cu.id AND ct.locale = ${prismaLocale}::"Locale",
      tsq
    WHERE r."isDraft" = false
      AND rt."searchVector" @@ tsq.query
    ORDER BY rank DESC, r."publishedAt" DESC, r.id DESC
    LIMIT ${safeLimit}
  `

  const items: HomeRecipeCard[] = rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    tagline: r.tagline,
    totalMinutes: r.totalMinutes,
    servings: r.servings,
    skill: toApiSkill(r.skill),
    ratingAvg: Number(r.ratingAvg),
    ratingCount: r.ratingCount,
    cuisine: r.cuisine,
    heroImageCloudinary: r.heroImageCloudinary,
  }))

  return { query: q, items, total: items.length }
}
