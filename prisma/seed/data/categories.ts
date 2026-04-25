type Locale = 'EN' | 'TR' | 'ES'

export type CategorySeed = {
  slug: string
  iconKey: string | null
  popularityRank: number
  translations: Array<{
    locale: Locale
    name: string
    slug: string
    description: string | null
  }>
}

export const categories: CategorySeed[] = [
  {
    slug: 'desserts',
    iconKey: 'cake',
    popularityRank: 1,
    translations: [
      { locale: 'EN', name: 'Desserts', slug: 'desserts', description: null },
      { locale: 'TR', name: 'Tatlılar', slug: 'tatlilar', description: null },
      { locale: 'ES', name: 'Postres', slug: 'postres', description: null },
    ],
  },
  {
    slug: 'main-courses',
    iconKey: 'fork-knife',
    popularityRank: 2,
    translations: [
      { locale: 'EN', name: 'Main Courses', slug: 'main-courses', description: null },
      { locale: 'TR', name: 'Ana Yemekler', slug: 'ana-yemekler', description: null },
      { locale: 'ES', name: 'Platos Principales', slug: 'platos-principales', description: null },
    ],
  },
  {
    slug: 'breakfast',
    iconKey: 'sunrise',
    popularityRank: 3,
    translations: [
      { locale: 'EN', name: 'Breakfast', slug: 'breakfast', description: null },
      { locale: 'TR', name: 'Kahvaltı', slug: 'kahvalti', description: null },
      { locale: 'ES', name: 'Desayuno', slug: 'desayuno', description: null },
    ],
  },
  {
    slug: 'bakery',
    iconKey: 'croissant',
    popularityRank: 4,
    translations: [
      { locale: 'EN', name: 'Bakery & Pastries', slug: 'bakery', description: null },
      { locale: 'TR', name: 'Hamur İşleri', slug: 'hamur-isleri', description: null },
      { locale: 'ES', name: 'Panadería y Pastelería', slug: 'panaderia-y-pasteleria', description: null },
    ],
  },
  {
    slug: 'soups',
    iconKey: 'bowl',
    popularityRank: 5,
    translations: [
      { locale: 'EN', name: 'Soups', slug: 'soups', description: null },
      { locale: 'TR', name: 'Çorbalar', slug: 'corbalar', description: null },
      { locale: 'ES', name: 'Sopas', slug: 'sopas', description: null },
    ],
  },
  {
    slug: 'salads',
    iconKey: 'leaf',
    popularityRank: 6,
    translations: [
      { locale: 'EN', name: 'Salads', slug: 'salads', description: null },
      { locale: 'TR', name: 'Salatalar', slug: 'salatalar', description: null },
      { locale: 'ES', name: 'Ensaladas', slug: 'ensaladas', description: null },
    ],
  },
  {
    slug: 'drinks',
    iconKey: 'glass',
    popularityRank: 7,
    translations: [
      { locale: 'EN', name: 'Drinks', slug: 'drinks', description: null },
      { locale: 'TR', name: 'İçecekler', slug: 'icecekler', description: null },
      { locale: 'ES', name: 'Bebidas', slug: 'bebidas', description: null },
    ],
  },
  {
    slug: 'snacks',
    iconKey: 'popcorn',
    popularityRank: 8,
    translations: [
      { locale: 'EN', name: 'Snacks', slug: 'snacks', description: null },
      { locale: 'TR', name: 'Atıştırmalıklar', slug: 'atistirmaliklar', description: null },
      { locale: 'ES', name: 'Aperitivos', slug: 'aperitivos', description: null },
    ],
  },
]
