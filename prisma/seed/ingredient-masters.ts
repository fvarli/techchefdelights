/**
 * IngredientMaster bootstrap.
 *
 * v1 strategy: walk every recipe's ingredient list, derive a stable slug
 * from the EN name (lowercased, stripped of parentheticals, slugified),
 * and ensure an IngredientMaster + IngredientMasterTranslation row exists
 * for each unique slug. Then link every Ingredient row to its master.
 *
 * Deriving the slug from the EN name keeps recipe seed files unchanged
 * and gives a deterministic mapping. Future recipes that introduce a
 * new ingredient just create a new master automatically. To customize a
 * master (e.g. canonicalUnit, isStaple, defaultAisle), edit the master
 * row directly in the DB or extend this module with overrides.
 */

import type { PrismaClient } from '../../src/generated/prisma/client'
import type { Locale, RecipeSeed } from './types'

const LOCALES: Locale[] = ['EN', 'TR', 'ES']

export function ingredientMasterSlug(enName: string): string {
  return enName
    .toLowerCase()
    // Drop parentheticals like "(vegan butter for vegan)"
    .replace(/\([^)]*\)/g, '')
    // Drop suffixes after a comma: "Salt, kosher" -> "salt"
    .split(',')[0]
    // " or " variants: "Water or vegetable broth" -> "water"
    .split(' or ')[0]
    // Collapse non-alphanumeric to dash
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

type MasterDraft = {
  slug: string
  translations: Record<Locale, { name: string; pluralName: string | null; aliases: string[] }>
  defaultAisle: RecipeSeed['ingredientGroups'][number]['items'][number]['aisle'] | null
}

export function collectMasters(recipes: RecipeSeed[]): MasterDraft[] {
  const bySlug = new Map<string, MasterDraft>()
  for (const recipe of recipes) {
    for (const group of recipe.ingredientGroups) {
      for (const item of group.items) {
        const en = item.translations.EN.name
        const slug = ingredientMasterSlug(en)
        if (!slug) continue
        if (!bySlug.has(slug)) {
          const translations = LOCALES.reduce(
            (acc, locale) => {
              acc[locale] = {
                name: item.translations[locale].name,
                pluralName: null,
                aliases: item.translations[locale].substitutes ?? [],
              }
              return acc
            },
            {} as MasterDraft['translations'],
          )
          bySlug.set(slug, {
            slug,
            translations,
            defaultAisle: item.aisle ?? null,
          })
        }
      }
    }
  }
  return [...bySlug.values()].sort((a, b) => a.slug.localeCompare(b.slug))
}

export async function seedIngredientMasters(prisma: PrismaClient, recipes: RecipeSeed[]) {
  const drafts = collectMasters(recipes)
  for (const m of drafts) {
    const row = await prisma.ingredientMaster.upsert({
      where: { slug: m.slug },
      update: { defaultAisle: m.defaultAisle },
      create: {
        slug: m.slug,
        defaultAisle: m.defaultAisle,
      },
    })
    for (const locale of LOCALES) {
      const t = m.translations[locale]
      await prisma.ingredientMasterTranslation.upsert({
        where: { masterId_locale: { masterId: row.id, locale } },
        update: { name: t.name, pluralName: t.pluralName, aliases: t.aliases },
        create: {
          masterId: row.id,
          locale,
          name: t.name,
          pluralName: t.pluralName,
          aliases: t.aliases,
        },
      })
    }
  }
  return drafts.length
}
