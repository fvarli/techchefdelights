// Pure TS types for seed data files. No Prisma runtime imports.

export type Locale = 'EN' | 'TR' | 'ES'
export type Skill = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
export type UnitKey =
  | 'G' | 'KG' | 'ML' | 'L' | 'TSP' | 'TBSP' | 'CUP' | 'OZ' | 'LB' | 'PIECE' | 'PINCH'
export type AisleKey =
  | 'PRODUCE' | 'MEAT' | 'DAIRY' | 'PANTRY' | 'BAKERY' | 'FROZEN' | 'SPICES' | 'OTHER'
export type AllergenPresence = 'CONTAINS' | 'MAY_CONTAIN' | 'FREE'

export type LocalizedString = Record<Locale, string>
export type LocalizedOptional = Record<Locale, string | null>

export type RecipeTranslationSeed = {
  slug: string
  title: string
  tagline: string
  description: string
  story: string
  seoTitle: string
  seoDescription: string
}

export type IngredientItemSeed = {
  ref: string                                       // symbolic ref for step.ingredientRefs lookup
  position: number
  metric: { quantity: number | null; unit: UnitKey | null }
  us: { quantity: number | null; unit: UnitKey | null }
  optional: boolean
  aisle: AisleKey
  translations: Record<Locale, {
    name: string
    prep: string | null
    substitutes: string[]
  }>
}

export type IngredientGroupSeed = {
  position: number
  translations: Record<Locale, { label: string }>
  items: IngredientItemSeed[]
}

export type StepSeed = {
  index: number
  timerSeconds: number | null
  ingredientRefs: string[]                          // symbolic refs, resolved to Ingredient.id at insert time
  translations: Record<Locale, {
    title: string | null
    body: string
    note: string | null
    timerLabel: string | null
  }>
}

export type VariationSeed = {
  position: number
  translations: Record<Locale, { title: string; body: string }>
}

export type FAQSeed = {
  position: number
  translations: Record<Locale, { q: string; a: string }>
}

export type NutritionSeed = {
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
}

export type GalleryImageSeed = {
  cloudinaryId: string
  w: number
  h: number
  blurhash: string | null
  position: number
  translations: Record<Locale, { alt: string }>
}

export type PlaceholderReviewSeed = {
  rating: 4 | 5
  authorLocale: Locale
  body: Record<Locale, string>                      // localized review body
}

export type AllergenMappingSeed = {
  slug: string
  presence: AllergenPresence
}

export type EquipmentUsageSeed = {
  slug: string
  required?: boolean
  quantity?: number
  note?: string
  position?: number
}

export type RecipeSeed = {
  seedId: string                                    // stable id, e.g. recipe_<slug>_seed
  cuisineSlug: string
  authorSlug: string
  skill: Skill
  servings: number
  prepMinutes: number
  cookMinutes: number
  totalMinutes: number
  heroImageCloudinary: string
  heroBlurhash: string | null
  costPerServingCents: number | null
  costCurrency: string | null
  translations: Record<Locale, RecipeTranslationSeed>
  ingredientGroups: IngredientGroupSeed[]
  steps: StepSeed[]
  /**
   * Recipe equipment usage rows. Accepts either:
   *   - a plain slug string (legacy shape; required=true, no metadata)
   *   - or an EquipmentUsageSeed with required/quantity/note/position
   * Both forms may be mixed within the same recipe during transition.
   */
  equipmentSlugs: Array<string | EquipmentUsageSeed>
  variations: VariationSeed[]
  faq: FAQSeed[]
  nutrition: NutritionSeed
  categorySlugs: string[]
  tagSlugs: string[]
  dietSlugs: string[]
  allergens: AllergenMappingSeed[]
  gallery: GalleryImageSeed[]
  reviews: PlaceholderReviewSeed[]
}
