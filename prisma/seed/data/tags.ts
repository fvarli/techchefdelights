type Locale = 'EN' | 'TR' | 'ES'

export type TagSeed = {
  slug: string
  translations: Array<{ locale: Locale; name: string }>
}

export const tags: TagSeed[] = [
  {
    slug: 'quick-easy',
    translations: [
      { locale: 'EN', name: 'Quick & Easy' },
      { locale: 'TR', name: 'Hızlı ve Kolay' },
      { locale: 'ES', name: 'Rápido y Fácil' },
    ],
  },
  {
    slug: 'one-pot',
    translations: [
      { locale: 'EN', name: 'One Pot' },
      { locale: 'TR', name: 'Tek Tencere' },
      { locale: 'ES', name: 'Una Sola Olla' },
    ],
  },
  {
    slug: 'make-ahead',
    translations: [
      { locale: 'EN', name: 'Make-Ahead' },
      { locale: 'TR', name: 'Önceden Hazır' },
      { locale: 'ES', name: 'Para Adelantar' },
    ],
  },
  {
    slug: 'kid-friendly',
    translations: [
      { locale: 'EN', name: 'Kid-Friendly' },
      { locale: 'TR', name: 'Çocuklara Uygun' },
      { locale: 'ES', name: 'Para Niños' },
    ],
  },
  {
    slug: 'comfort-food',
    translations: [
      { locale: 'EN', name: 'Comfort Food' },
      { locale: 'TR', name: 'Geleneksel Lezzet' },
      { locale: 'ES', name: 'Comida Reconfortante' },
    ],
  },
  {
    slug: 'holiday',
    translations: [
      { locale: 'EN', name: 'Holiday' },
      { locale: 'TR', name: 'Bayram & Tatil' },
      { locale: 'ES', name: 'Festivo' },
    ],
  },
  {
    slug: 'summer',
    translations: [
      { locale: 'EN', name: 'Summer' },
      { locale: 'TR', name: 'Yaz' },
      { locale: 'ES', name: 'Verano' },
    ],
  },
  {
    slug: 'winter',
    translations: [
      { locale: 'EN', name: 'Winter' },
      { locale: 'TR', name: 'Kış' },
      { locale: 'ES', name: 'Invierno' },
    ],
  },
  {
    slug: 'spicy',
    translations: [
      { locale: 'EN', name: 'Spicy' },
      { locale: 'TR', name: 'Acılı' },
      { locale: 'ES', name: 'Picante' },
    ],
  },
  {
    slug: 'healthy',
    translations: [
      { locale: 'EN', name: 'Healthy' },
      { locale: 'TR', name: 'Sağlıklı' },
      { locale: 'ES', name: 'Saludable' },
    ],
  },
]
