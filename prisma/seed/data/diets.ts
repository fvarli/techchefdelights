type Locale = 'EN' | 'TR' | 'ES'

export type DietSeed = {
  slug: string
  translations: Array<{ locale: Locale; name: string; description: string | null }>
}

export const diets: DietSeed[] = [
  {
    slug: 'vegetarian',
    translations: [
      { locale: 'EN', name: 'Vegetarian', description: null },
      { locale: 'TR', name: 'Vejetaryen', description: null },
      { locale: 'ES', name: 'Vegetariano', description: null },
    ],
  },
  {
    slug: 'vegan',
    translations: [
      { locale: 'EN', name: 'Vegan', description: null },
      { locale: 'TR', name: 'Vegan', description: null },
      { locale: 'ES', name: 'Vegano', description: null },
    ],
  },
  {
    slug: 'gluten-free',
    translations: [
      { locale: 'EN', name: 'Gluten-Free', description: null },
      { locale: 'TR', name: 'Glutensiz', description: null },
      { locale: 'ES', name: 'Sin Gluten', description: null },
    ],
  },
  {
    slug: 'dairy-free',
    translations: [
      { locale: 'EN', name: 'Dairy-Free', description: null },
      { locale: 'TR', name: 'Sütsüz', description: null },
      { locale: 'ES', name: 'Sin Lácteos', description: null },
    ],
  },
  {
    slug: 'high-protein',
    translations: [
      { locale: 'EN', name: 'High-Protein', description: null },
      { locale: 'TR', name: 'Yüksek Protein', description: null },
      { locale: 'ES', name: 'Alto en Proteínas', description: null },
    ],
  },
  {
    slug: 'halal',
    translations: [
      { locale: 'EN', name: 'Halal', description: null },
      { locale: 'TR', name: 'Helal', description: null },
      { locale: 'ES', name: 'Halal', description: null },
    ],
  },
]
