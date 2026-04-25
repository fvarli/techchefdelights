// schema.org JSON-LD builders for recipe pages.
// Outputs are passed to <script type="application/ld+json"> in RSC.

import type { ApiRecipe } from './api/types'
import type { ApiLocale } from './api/enums'

const SKILL_TO_SCHEMA: Record<string, string> = {
  beginner: 'Easy',
  intermediate: 'Medium',
  advanced: 'Hard',
}

const LOCALE_TO_SCHEMA_LANG: Record<ApiLocale, string> = {
  en: 'en',
  tr: 'tr',
  es: 'es',
}

function recipePath(locale: ApiLocale, slug: string): string {
  return locale === 'en' ? `/r/${slug}` : `/${locale}/r/${slug}`
}

function homePath(locale: ApiLocale): string {
  return locale === 'en' ? '/' : `/${locale}`
}

function recipesPath(locale: ApiLocale): string {
  return locale === 'en' ? '/recipes' : `/${locale}/recipes`
}

function isoDuration(minutes: number): string {
  return `PT${minutes}M`
}

function ingredientLine(item: ApiRecipe['ingredientGroups'][number]['items'][number]): string {
  const qty = item.metric.quantity
  const unit = item.metric.unit
  const parts: string[] = []
  if (qty !== null && unit) parts.push(`${qty} ${unit}`)
  else if (qty !== null) parts.push(String(qty))
  parts.push(item.name)
  if (item.prep) parts.push(`(${item.prep})`)
  return parts.join(' ')
}

export function recipeJsonLd(recipe: ApiRecipe, locale: ApiLocale, baseUrl: string) {
  const url = `${baseUrl}${recipePath(locale, recipe.slug)}`
  const heroUrl = recipe.hero.cloudinaryId
    ? `${baseUrl}/__placeholder/${recipe.hero.cloudinaryId}`
    : null

  return {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    '@id': url,
    inLanguage: LOCALE_TO_SCHEMA_LANG[locale],
    name: recipe.title,
    description: recipe.description,
    ...(heroUrl ? { image: [heroUrl] } : {}),
    ...(recipe.author
      ? {
          author: {
            '@type': 'Person',
            name: recipe.author.name,
            url: `${baseUrl}/authors/${recipe.author.slug}`,
          },
        }
      : {}),
    datePublished: recipe.publishedAt,
    dateModified: recipe.updatedAt,
    ...(recipe.cuisine ? { recipeCuisine: recipe.cuisine.name } : {}),
    ...(recipe.categories.length > 0
      ? { recipeCategory: recipe.categories.map((c) => c.name).join(', ') }
      : {}),
    ...(recipe.tags.length > 0
      ? { keywords: recipe.tags.map((t) => t.name).join(', ') }
      : {}),
    recipeYield: String(recipe.meta.servings),
    prepTime: isoDuration(recipe.meta.prepMinutes),
    cookTime: isoDuration(recipe.meta.cookMinutes),
    totalTime: isoDuration(recipe.meta.totalMinutes),
    suitableForDiet: recipe.diets
      .map((d) => slugToSchemaDiet(d.slug))
      .filter((s): s is string => s !== null)
      .map((s) => `https://schema.org/${s}`),
    ...(recipe.nutrition
      ? {
          nutrition: {
            '@type': 'NutritionInformation',
            calories: `${recipe.nutrition.calories} kcal`,
            proteinContent: `${recipe.nutrition.macros.proteinG} g`,
            carbohydrateContent: `${recipe.nutrition.macros.carbsG} g`,
            fatContent: `${recipe.nutrition.macros.fatG} g`,
            ...(recipe.nutrition.macros.fiberG !== null
              ? { fiberContent: `${recipe.nutrition.macros.fiberG} g` }
              : {}),
            ...(recipe.nutrition.macros.sugarG !== null
              ? { sugarContent: `${recipe.nutrition.macros.sugarG} g` }
              : {}),
            ...(recipe.nutrition.macros.sodiumMg !== null
              ? { sodiumContent: `${recipe.nutrition.macros.sodiumMg} mg` }
              : {}),
            servingSize: '1 serving',
          },
        }
      : {}),
    recipeIngredient: recipe.ingredientGroups.flatMap((g) => g.items.map(ingredientLine)),
    recipeInstructions: recipe.steps.map((s) => ({
      '@type': 'HowToStep',
      position: s.index + 1,
      name: s.title ?? `Step ${s.index + 1}`,
      text: s.body,
      ...(s.images.length > 0 && s.images[0]
        ? { image: `${baseUrl}/__placeholder/${s.images[0].cloudinaryId}` }
        : {}),
    })),
    ...(recipe.rating.count > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: recipe.rating.average.toFixed(2),
            reviewCount: recipe.rating.count,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
    ...(SKILL_TO_SCHEMA[recipe.meta.skill]
      ? { recipeDifficulty: SKILL_TO_SCHEMA[recipe.meta.skill] }
      : {}),
  }
}

function slugToSchemaDiet(slug: string): string | null {
  switch (slug) {
    case 'vegan':
      return 'VeganDiet'
    case 'vegetarian':
      return 'VegetarianDiet'
    case 'gluten-free':
      return 'GlutenFreeDiet'
    case 'halal':
      return 'HalalDiet'
    default:
      return null
  }
}

export function faqJsonLd(faqs: ApiRecipe['faq']) {
  if (faqs.length === 0) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

export function breadcrumbJsonLd(
  recipe: ApiRecipe,
  locale: ApiLocale,
  baseUrl: string,
  labels: { home: string; recipes: string },
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: labels.home,
        item: `${baseUrl}${homePath(locale)}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: labels.recipes,
        item: `${baseUrl}${recipesPath(locale)}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: recipe.title,
        item: `${baseUrl}${recipePath(locale, recipe.slug)}`,
      },
    ],
  }
}
