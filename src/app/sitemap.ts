import type { MetadataRoute } from 'next'
import { db } from '@/lib/db'
import { localePath } from '@/lib/path'

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, '') ?? 'https://techchefdelights.com'

type LocaleUrls = { en: string; tr: string; es: string }

function entry(
  paths: LocaleUrls,
  lastModified: Date,
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'],
  priority: number,
): MetadataRoute.Sitemap[number] {
  return {
    url: `${BASE_URL}${paths.en}`,
    lastModified,
    changeFrequency,
    priority,
    alternates: {
      languages: {
        en: `${BASE_URL}${paths.en}`,
        tr: `${BASE_URL}${paths.tr}`,
        es: `${BASE_URL}${paths.es}`,
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
    entry(
      {
        en: localePath('en', '/'),
        tr: localePath('tr', '/'),
        es: localePath('es', '/'),
      },
      now,
      'daily',
      1.0,
    ),
    entry(
      {
        en: localePath('en', '/recipes'),
        tr: localePath('tr', '/recipes'),
        es: localePath('es', '/recipes'),
      },
      now,
      'daily',
      0.9,
    ),
  ]

  // Recipe detail pages — per-locale slugs, localized URL segments
  for (const r of recipes) {
    const slugByLocale: LocaleUrls = { en: '', tr: '', es: '' }
    for (const tx of r.translations) {
      const key = tx.locale.toLowerCase() as keyof LocaleUrls
      slugByLocale[key] = tx.slug
    }
    if (!slugByLocale.en || !slugByLocale.tr || !slugByLocale.es) continue
    entries.push(
      entry(
        {
          en: localePath('en', `/recipes/${slugByLocale.en}`),
          tr: localePath('tr', `/recipes/${slugByLocale.tr}`),
          es: localePath('es', `/recipes/${slugByLocale.es}`),
        },
        r.updatedAt,
        'weekly',
        0.8,
      ),
    )
  }

  // Category pages — per-locale slugs, localized URL segments
  for (const c of categories) {
    const slugByLocale: LocaleUrls = { en: '', tr: '', es: '' }
    for (const tx of c.translations) {
      const key = tx.locale.toLowerCase() as keyof LocaleUrls
      slugByLocale[key] = tx.slug
    }
    if (!slugByLocale.en || !slugByLocale.tr || !slugByLocale.es) continue
    entries.push(
      entry(
        {
          en: localePath('en', `/categories/${slugByLocale.en}`),
          tr: localePath('tr', `/categories/${slugByLocale.tr}`),
          es: localePath('es', `/categories/${slugByLocale.es}`),
        },
        now,
        'weekly',
        0.6,
      ),
    )
  }

  // Diet pages — slug shared across locales, localized URL segments
  for (const d of diets) {
    entries.push(
      entry(
        {
          en: localePath('en', `/diets/${d.slug}`),
          tr: localePath('tr', `/diets/${d.slug}`),
          es: localePath('es', `/diets/${d.slug}`),
        },
        now,
        'weekly',
        0.6,
      ),
    )
  }

  return entries
}
