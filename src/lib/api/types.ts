import type {
  ApiLocale,
  ApiSkill,
  ApiUnitKey,
  ApiAisleKey,
  ApiAllergenPresence,
  ApiVideoProvider,
} from './enums'

export type Money = {
  amountMinor: number
  currency: string
}

export type ApiError = {
  error: {
    code: string
    message: string
    details?: unknown
    requestId?: string
  }
}

export type PageInfo = {
  nextCursor: string | null
  hasMore: boolean
  count: number
}

export type ApiImage = {
  cloudinaryId: string
  alt: string
  w: number
  h: number
  blurhash: string | null
}

export type ApiAuthor = {
  slug: string
  name: string
  avatar: string | null
  title: string | null
  bio: string | null
}

export type ApiTaxonomyRef = {
  slug: string
  name: string
  iconKey?: string | null
}

export type ApiAllergenRef = ApiTaxonomyRef & {
  presence: ApiAllergenPresence
}

/**
 * Recipe equipment usage row. Extends ApiTaxonomyRef with optional
 * recipe-specific metadata: required flag, quantity, free-form note.
 * All metadata fields are optional — clients that read only slug/name/
 * iconKey continue to work unchanged.
 *
 * Note: `note` is locale-shared in v1 (same string for EN/TR/ES). Adding
 * a per-locale RecipeEquipmentTranslation table is tracked as a v1.1
 * enhancement; until then keep notes short and either English or
 * locale-neutral.
 */
export type ApiRecipeEquipment = ApiTaxonomyRef & {
  required: boolean
  quantity: number | null
  note: string | null
  position: number
}

export type ApiIngredient = {
  id: string
  name: string
  prep: string | null
  substitutes: string[]
  optional: boolean
  aisle: ApiAisleKey
  metric: { quantity: number | null; unit: ApiUnitKey | null }
  us: { quantity: number | null; unit: ApiUnitKey | null }
}

export type ApiIngredientGroup = {
  label: string
  items: ApiIngredient[]
}

export type ApiStep = {
  index: number
  title: string | null
  body: string
  note: string | null
  timer: { seconds: number; label: string | null } | null
  ingredientRefs: string[]
  images: ApiImage[]
}

export type ApiVariation = { title: string; body: string }
export type ApiFAQ = { q: string; a: string }

export type ApiNutrition = {
  calories: number
  macros: {
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
  }
}

export type ApiVideo = {
  provider: ApiVideoProvider
  videoId: string
  poster: string | null
  duration: number | null
}

export type ApiRecipe = {
  id: string
  slug: string
  slugByLocale: Record<ApiLocale, string>
  publishedAt: string
  updatedAt: string

  title: string
  tagline: string
  description: string
  story: string
  seo: { title: string | null; description: string | null }

  hero: ApiImage

  meta: {
    skill: ApiSkill
    servings: number
    prepMinutes: number
    cookMinutes: number
    totalMinutes: number
  }

  costPerServing: Money | null

  rating: {
    average: number
    count: number
    distribution: [number, number, number, number, number]
  }

  author: ApiAuthor | null
  cuisine: ApiTaxonomyRef | null
  categories: ApiTaxonomyRef[]
  tags: ApiTaxonomyRef[]
  diets: ApiTaxonomyRef[]
  allergens: ApiAllergenRef[]
  equipment: ApiRecipeEquipment[]

  ingredientGroups: ApiIngredientGroup[]
  steps: ApiStep[]
  variations: ApiVariation[]
  faq: ApiFAQ[]
  nutrition: ApiNutrition | null
  video: ApiVideo | null
  gallery: ApiImage[]
}

export type ApiRecipeResponse = {
  recipe: ApiRecipe
  locale: ApiLocale
}
