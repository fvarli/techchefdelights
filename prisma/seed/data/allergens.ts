type Locale = 'EN' | 'TR' | 'ES'

export type AllergenSeed = {
  slug: string
  translations: Array<{ locale: Locale; name: string }>
}

// EU FIC 14 allergens
export const allergens: AllergenSeed[] = [
  {
    slug: 'gluten',
    translations: [
      { locale: 'EN', name: 'Gluten' },
      { locale: 'TR', name: 'Gluten' },
      { locale: 'ES', name: 'Gluten' },
    ],
  },
  {
    slug: 'crustaceans',
    translations: [
      { locale: 'EN', name: 'Crustaceans' },
      { locale: 'TR', name: 'Kabuklular' },
      { locale: 'ES', name: 'Crustáceos' },
    ],
  },
  {
    slug: 'eggs',
    translations: [
      { locale: 'EN', name: 'Eggs' },
      { locale: 'TR', name: 'Yumurta' },
      { locale: 'ES', name: 'Huevos' },
    ],
  },
  {
    slug: 'fish',
    translations: [
      { locale: 'EN', name: 'Fish' },
      { locale: 'TR', name: 'Balık' },
      { locale: 'ES', name: 'Pescado' },
    ],
  },
  {
    slug: 'peanuts',
    translations: [
      { locale: 'EN', name: 'Peanuts' },
      { locale: 'TR', name: 'Yer Fıstığı' },
      { locale: 'ES', name: 'Cacahuetes' },
    ],
  },
  {
    slug: 'soybeans',
    translations: [
      { locale: 'EN', name: 'Soybeans' },
      { locale: 'TR', name: 'Soya' },
      { locale: 'ES', name: 'Soja' },
    ],
  },
  {
    slug: 'milk',
    translations: [
      { locale: 'EN', name: 'Milk' },
      { locale: 'TR', name: 'Süt' },
      { locale: 'ES', name: 'Leche' },
    ],
  },
  {
    slug: 'tree-nuts',
    translations: [
      { locale: 'EN', name: 'Tree Nuts' },
      { locale: 'TR', name: 'Sert Kabuklu Yemişler' },
      { locale: 'ES', name: 'Frutos Secos' },
    ],
  },
  {
    slug: 'celery',
    translations: [
      { locale: 'EN', name: 'Celery' },
      { locale: 'TR', name: 'Kereviz' },
      { locale: 'ES', name: 'Apio' },
    ],
  },
  {
    slug: 'mustard',
    translations: [
      { locale: 'EN', name: 'Mustard' },
      { locale: 'TR', name: 'Hardal' },
      { locale: 'ES', name: 'Mostaza' },
    ],
  },
  {
    slug: 'sesame',
    translations: [
      { locale: 'EN', name: 'Sesame' },
      { locale: 'TR', name: 'Susam' },
      { locale: 'ES', name: 'Sésamo' },
    ],
  },
  {
    slug: 'sulphites',
    translations: [
      { locale: 'EN', name: 'Sulphites' },
      { locale: 'TR', name: 'Sülfitler' },
      { locale: 'ES', name: 'Sulfitos' },
    ],
  },
  {
    slug: 'lupin',
    translations: [
      { locale: 'EN', name: 'Lupin' },
      { locale: 'TR', name: 'Acı Bakla' },
      { locale: 'ES', name: 'Altramuces' },
    ],
  },
  {
    slug: 'molluscs',
    translations: [
      { locale: 'EN', name: 'Molluscs' },
      { locale: 'TR', name: 'Yumuşakçalar' },
      { locale: 'ES', name: 'Moluscos' },
    ],
  },
]
