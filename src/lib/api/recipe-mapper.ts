import type {
  ApiRecipe,
  ApiImage,
  ApiAuthor,
  ApiTaxonomyRef,
  ApiAllergenRef,
  ApiRecipeEquipment,
  ApiIngredientGroup,
  ApiStep,
  ApiVariation,
  ApiFAQ,
  ApiNutrition,
  ApiVideo,
} from './types'
import {
  toApiLocale,
  toApiSkill,
  toApiUnitKey,
  toApiAisleKey,
  toApiAllergenPresence,
  toApiVideoProvider,
  type ApiLocale,
} from './enums'
import type { Locale } from '@/generated/prisma/enums'

/**
 * Helper: pick the translation row for the requested locale,
 * falling back to EN if missing (per content-fallback rule).
 * URL slug lookup must be strict (slug, locale) — this fallback
 * only applies to internal content fields like name/body.
 */
function pickTranslation<T extends { locale: Locale }>(
  translations: T[],
  locale: Locale,
): T | undefined {
  return (
    translations.find((t) => t.locale === locale) ??
    translations.find((t) => t.locale === 'EN')
  )
}

type LoadedRecipe = {
  id: string
  publishedAt: Date
  updatedAt: Date
  skill: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  servings: number
  prepMinutes: number
  cookMinutes: number
  totalMinutes: number
  heroImageCloudinary: string
  heroBlurhash: string | null
  costPerServingCents: number | null
  costCurrency: string | null
  ratingAvg: number
  ratingCount: number
  ratingDist: number[]
  translations: Array<{
    locale: Locale
    slug: string
    title: string
    tagline: string
    description: string
    story: string
    seoTitle: string | null
    seoDescription: string | null
  }>
  author:
    | {
        slug: string
        name: string
        avatar: string | null
        translations: Array<{ locale: Locale; title: string | null; bio: string | null }>
      }
    | null
  cuisine:
    | {
        slug: string
        translations: Array<{ locale: Locale; name: string }>
      }
    | null
  ingredientGroups: Array<{
    position: number
    translations: Array<{ locale: Locale; label: string }>
    items: Array<{
      id: string
      position: number
      quantity: number | null
      unit: 'G' | 'KG' | 'ML' | 'L' | 'TSP' | 'TBSP' | 'CUP' | 'OZ' | 'LB' | 'PIECE' | 'PINCH' | null
      quantityUS: number | null
      unitUS: 'G' | 'KG' | 'ML' | 'L' | 'TSP' | 'TBSP' | 'CUP' | 'OZ' | 'LB' | 'PIECE' | 'PINCH' | null
      optional: boolean
      aisle: 'PRODUCE' | 'MEAT' | 'DAIRY' | 'PANTRY' | 'BAKERY' | 'FROZEN' | 'SPICES' | 'OTHER'
      translations: Array<{
        locale: Locale
        name: string
        prep: string | null
        substitutes: string[]
      }>
    }>
  }>
  steps: Array<{
    index: number
    timerSeconds: number | null
    ingredientRefs: string[]
    translations: Array<{
      locale: Locale
      title: string | null
      body: string
      note: string | null
      timerLabel: string | null
    }>
    images: Array<{
      cloudinaryId: string
      w: number
      h: number
      blurhash: string | null
      position: number
      translations: Array<{ locale: Locale; alt: string }>
    }>
  }>
  equipment: Array<{
    required: boolean
    quantity: number | null
    note: string | null
    position: number
    equipment: {
      slug: string
      iconKey: string | null
      translations: Array<{ locale: Locale; name: string }>
    }
  }>
  variations: Array<{
    position: number
    translations: Array<{ locale: Locale; title: string; body: string }>
  }>
  faq: Array<{
    position: number
    translations: Array<{ locale: Locale; q: string; a: string }>
  }>
  nutrition: {
    calories: number
    proteinG: number
    proteinDailyPct: number | null
    carbsG: number
    carbsDailyPct: number | null
    fatG: number
    fatDailyPct: number | null
    fiberG: number | null
    fiberDailyPct: number | null
    sugarG: number | null
    sodiumMg: number | null
    sodiumDailyPct: number | null
  } | null
  video: {
    provider: 'YOUTUBE' | 'VIMEO' | 'SELF'
    videoId: string
    poster: string | null
    duration: number | null
  } | null
  categories: Array<{
    category: {
      slug: string
      iconKey: string | null
      translations: Array<{ locale: Locale; name: string }>
    }
  }>
  tags: Array<{
    tag: { slug: string; translations: Array<{ locale: Locale; name: string }> }
  }>
  diets: Array<{
    diet: { slug: string; translations: Array<{ locale: Locale; name: string }> }
  }>
  allergens: Array<{
    presence: 'CONTAINS' | 'MAY_CONTAIN' | 'FREE'
    allergen: {
      slug: string
      translations: Array<{ locale: Locale; name: string }>
    }
  }>
  gallery: Array<{
    cloudinaryId: string
    w: number
    h: number
    blurhash: string | null
    position: number
    translations: Array<{ locale: Locale; alt: string }>
  }>
}

export function mapRecipeToApi(recipe: LoadedRecipe, requestLocale: Locale): ApiRecipe {
  const tx = pickTranslation(recipe.translations, requestLocale)
  if (!tx) throw new Error(`No translation available for recipe ${recipe.id}`)

  const slugByLocale = recipe.translations.reduce<Record<ApiLocale, string>>(
    (acc, t) => {
      acc[toApiLocale(t.locale)] = t.slug
      return acc
    },
    { en: '', tr: '', es: '' },
  )

  const heroAlt = pickTranslation(
    recipe.gallery.find((g) => g.position === 0)?.translations ?? [],
    requestLocale,
  )?.alt ?? tx.title

  const heroImage = recipe.gallery.find((g) => g.position === 0)
  const hero: ApiImage = {
    cloudinaryId: recipe.heroImageCloudinary,
    alt: heroAlt,
    w: heroImage?.w ?? 1600,
    h: heroImage?.h ?? 1200,
    blurhash: recipe.heroBlurhash,
  }

  const author: ApiAuthor | null = recipe.author
    ? {
        slug: recipe.author.slug,
        name: recipe.author.name,
        avatar: recipe.author.avatar,
        title: pickTranslation(recipe.author.translations, requestLocale)?.title ?? null,
        bio: pickTranslation(recipe.author.translations, requestLocale)?.bio ?? null,
      }
    : null

  const cuisine = recipe.cuisine
    ? {
        slug: recipe.cuisine.slug,
        name: pickTranslation(recipe.cuisine.translations, requestLocale)?.name ?? recipe.cuisine.slug,
      }
    : null

  const categories: ApiTaxonomyRef[] = recipe.categories.map((rc) => ({
    slug: rc.category.slug,
    name: pickTranslation(rc.category.translations, requestLocale)?.name ?? rc.category.slug,
    iconKey: rc.category.iconKey,
  }))

  const tags: ApiTaxonomyRef[] = recipe.tags.map((rt) => ({
    slug: rt.tag.slug,
    name: pickTranslation(rt.tag.translations, requestLocale)?.name ?? rt.tag.slug,
  }))

  const diets: ApiTaxonomyRef[] = recipe.diets.map((rd) => ({
    slug: rd.diet.slug,
    name: pickTranslation(rd.diet.translations, requestLocale)?.name ?? rd.diet.slug,
  }))

  const allergens: ApiAllergenRef[] = recipe.allergens.map((ra) => ({
    slug: ra.allergen.slug,
    name: pickTranslation(ra.allergen.translations, requestLocale)?.name ?? ra.allergen.slug,
    presence: toApiAllergenPresence(ra.presence),
  }))

  const equipment: ApiRecipeEquipment[] = recipe.equipment
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((re) => ({
      slug: re.equipment.slug,
      name: pickTranslation(re.equipment.translations, requestLocale)?.name ?? re.equipment.slug,
      iconKey: re.equipment.iconKey,
      required: re.required,
      quantity: re.quantity,
      note: re.note,
      position: re.position,
    }))

  const ingredientGroups: ApiIngredientGroup[] = recipe.ingredientGroups
    .sort((a, b) => a.position - b.position)
    .map((g) => ({
      label: pickTranslation(g.translations, requestLocale)?.label ?? '',
      items: g.items
        .sort((a, b) => a.position - b.position)
        .map((it) => {
          const itx = pickTranslation(it.translations, requestLocale)
          return {
            id: it.id,
            name: itx?.name ?? '',
            prep: itx?.prep ?? null,
            substitutes: itx?.substitutes ?? [],
            optional: it.optional,
            aisle: toApiAisleKey(it.aisle),
            metric: {
              quantity: it.quantity,
              unit: it.unit ? toApiUnitKey(it.unit) : null,
            },
            us: {
              quantity: it.quantityUS,
              unit: it.unitUS ? toApiUnitKey(it.unitUS) : null,
            },
          }
        }),
    }))

  const steps: ApiStep[] = recipe.steps
    .sort((a, b) => a.index - b.index)
    .map((s) => {
      const stx = pickTranslation(s.translations, requestLocale)
      return {
        index: s.index,
        title: stx?.title ?? null,
        body: stx?.body ?? '',
        note: stx?.note ?? null,
        timer: s.timerSeconds
          ? { seconds: s.timerSeconds, label: stx?.timerLabel ?? null }
          : null,
        ingredientRefs: s.ingredientRefs,
        images: s.images
          .sort((a, b) => a.position - b.position)
          .map((img) => ({
            cloudinaryId: img.cloudinaryId,
            alt: pickTranslation(img.translations, requestLocale)?.alt ?? '',
            w: img.w,
            h: img.h,
            blurhash: img.blurhash,
          })),
      }
    })

  const variations: ApiVariation[] = recipe.variations
    .sort((a, b) => a.position - b.position)
    .map((v) => {
      const vtx = pickTranslation(v.translations, requestLocale)
      return { title: vtx?.title ?? '', body: vtx?.body ?? '' }
    })

  const faq: ApiFAQ[] = recipe.faq
    .sort((a, b) => a.position - b.position)
    .map((f) => {
      const ftx = pickTranslation(f.translations, requestLocale)
      return { q: ftx?.q ?? '', a: ftx?.a ?? '' }
    })

  const nutrition: ApiNutrition | null = recipe.nutrition
    ? {
        calories: recipe.nutrition.calories,
        macros: {
          proteinG: recipe.nutrition.proteinG,
          proteinDailyPct: recipe.nutrition.proteinDailyPct,
          carbsG: recipe.nutrition.carbsG,
          carbsDailyPct: recipe.nutrition.carbsDailyPct,
          fatG: recipe.nutrition.fatG,
          fatDailyPct: recipe.nutrition.fatDailyPct,
          fiberG: recipe.nutrition.fiberG,
          fiberDailyPct: recipe.nutrition.fiberDailyPct,
          sugarG: recipe.nutrition.sugarG,
          sodiumMg: recipe.nutrition.sodiumMg,
          sodiumDailyPct: recipe.nutrition.sodiumDailyPct,
        },
      }
    : null

  const video: ApiVideo | null = recipe.video
    ? {
        provider: toApiVideoProvider(recipe.video.provider),
        videoId: recipe.video.videoId,
        poster: recipe.video.poster,
        duration: recipe.video.duration,
      }
    : null

  const gallery: ApiImage[] = recipe.gallery
    .sort((a, b) => a.position - b.position)
    .map((img) => ({
      cloudinaryId: img.cloudinaryId,
      alt: pickTranslation(img.translations, requestLocale)?.alt ?? '',
      w: img.w,
      h: img.h,
      blurhash: img.blurhash,
    }))

  // ratingDist is a 5-element array; coerce to fixed tuple
  const dist = recipe.ratingDist
  const distribution: [number, number, number, number, number] = [
    dist[0] ?? 0,
    dist[1] ?? 0,
    dist[2] ?? 0,
    dist[3] ?? 0,
    dist[4] ?? 0,
  ]

  return {
    id: recipe.id,
    slug: tx.slug,
    slugByLocale,
    publishedAt: recipe.publishedAt.toISOString(),
    updatedAt: recipe.updatedAt.toISOString(),
    title: tx.title,
    tagline: tx.tagline,
    description: tx.description,
    story: tx.story,
    seo: { title: tx.seoTitle, description: tx.seoDescription },
    hero,
    meta: {
      skill: toApiSkill(recipe.skill),
      servings: recipe.servings,
      prepMinutes: recipe.prepMinutes,
      cookMinutes: recipe.cookMinutes,
      totalMinutes: recipe.totalMinutes,
    },
    costPerServing:
      recipe.costPerServingCents !== null && recipe.costCurrency
        ? { amountMinor: recipe.costPerServingCents, currency: recipe.costCurrency }
        : null,
    rating: {
      average: recipe.ratingAvg,
      count: recipe.ratingCount,
      distribution,
    },
    author,
    cuisine,
    categories,
    tags,
    diets,
    allergens,
    equipment,
    ingredientGroups,
    steps,
    variations,
    faq,
    nutrition,
    video,
    gallery,
  }
}
