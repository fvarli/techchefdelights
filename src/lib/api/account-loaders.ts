import { db } from '@/lib/db'
import { fromApiLocale, type ApiLocale } from './enums'

export type AllergenOption = { slug: string; name: string }

export async function loadAllergens(locale: ApiLocale): Promise<AllergenOption[]> {
  const prismaLocale = fromApiLocale(locale)
  const rows = await db.allergen.findMany({
    include: { translations: { where: { locale: prismaLocale } } },
  })
  return rows
    .filter((a) => a.translations[0])
    .map((a) => ({ slug: a.slug, name: a.translations[0].name }))
    .sort((a, b) => a.name.localeCompare(b.name))
}
