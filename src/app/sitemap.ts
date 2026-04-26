import type { MetadataRoute } from 'next'
import { db } from '@/lib/db'

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, '') ?? 'https://techchefdelights.com'

type LocaleSlug = { en: string; tr: string; es: string }

function entry(
  path: LocaleSlug,
  lastModified: Date,
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'],
  priority: number,
): MetadataRoute.Sitemap[number] {
  return {
    url: `${BASE_URL}${path.en}`,
    lastModified,
    changeFrequency,
    priority,
    alternates: {
      languages: {
        en: `${BASE_URL}${path.en}`,
        tr: `${BASE_URL}${path.tr}`,
        es: `${BASE_URL}${path.es}`,
      },
    },
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const [recipes, categories, diets] = await Promise.all([
    db.recipe.findMany({
      where: { isDraft: false },
      select: {
        id: true,
        updatedAt: true,
        translations: { select: { locale: true, slug: true } },
      },
    }),
    db.category.findMany({
      where: { recipes: { some: { recipe: { isDraft: false } } } },
      select: {
        slug: true,
        translations: { select: { locale: true, slug: true } },
      },
    }),
    db.diet.findMany({
      where: { recipes: { some: { recipe: { isDraft: false } } } },
      select: { slug: true },
    }),
  ])

  const entries: MetadataRoute.Sitemap = [
    // Home
    entry({ en: '/', tr: '/tr', es: '/es' }, now, 'daily', 1.0),
    // Recipes index
    entry({ en: '/recipes', tr: '/tr/recipes', es: '/es/recipes' }, now, 'daily', 0.9),
  ]

  // Recipe detail pages — per-locale slugs
  for (const r of recipes) {
    const byLocale: LocaleSlug = { en: '', tr: '', es: '' }
    for (const tx of r.translations) {
      const key = tx.locale.toLowerCase() as keyof LocaleSlug
      byLocale[key] = tx.slug
    }
    if (!byLocale.en || !byLocale.tr || !byLocale.es) continue
    entries.push(
      entry(
        {
          en: `/r/${byLocale.en}`,
          tr: `/tr/r/${byLocale.tr}`,
          es: `/es/r/${byLocale.es}`,
        },
        r.updatedAt,
        'weekly',
        0.8,
      ),
    )
  }

  // Category pages — per-locale slugs
  for (const c of categories) {
    const byLocale: LocaleSlug = { en: '', tr: '', es: '' }
    for (const tx of c.translations) {
      const key = tx.locale.toLowerCase() as keyof LocaleSlug
      byLocale[key] = tx.slug
    }
    if (!byLocale.en || !byLocale.tr || !byLocale.es) continue
    entries.push(
      entry(
        {
          en: `/c/${byLocale.en}`,
          tr: `/tr/c/${byLocale.tr}`,
          es: `/es/c/${byLocale.es}`,
        },
        now,
        'weekly',
        0.6,
      ),
    )
  }

  // Diet pages — slug shared across locales
  for (const d of diets) {
    entries.push(
      entry(
        {
          en: `/d/${d.slug}`,
          tr: `/tr/d/${d.slug}`,
          es: `/es/d/${d.slug}`,
        },
        now,
        'weekly',
        0.6,
      ),
    )
  }

  return entries
}
