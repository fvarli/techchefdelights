type Locale = 'EN' | 'TR' | 'ES'

export type CuisineSeed = {
  slug: string
  translations: Array<{ locale: Locale; name: string }>
}

export const cuisines: CuisineSeed[] = [
  {
    slug: 'turkish',
    translations: [
      { locale: 'EN', name: 'Turkish' },
      { locale: 'TR', name: 'Türk Mutfağı' },
      { locale: 'ES', name: 'Cocina Turca' },
    ],
  },
  {
    slug: 'italian',
    translations: [
      { locale: 'EN', name: 'Italian' },
      { locale: 'TR', name: 'İtalyan' },
      { locale: 'ES', name: 'Italiana' },
    ],
  },
  {
    slug: 'mediterranean',
    translations: [
      { locale: 'EN', name: 'Mediterranean' },
      { locale: 'TR', name: 'Akdeniz' },
      { locale: 'ES', name: 'Mediterránea' },
    ],
  },
  {
    slug: 'middle-eastern',
    translations: [
      { locale: 'EN', name: 'Middle Eastern' },
      { locale: 'TR', name: 'Orta Doğu' },
      { locale: 'ES', name: 'Oriente Medio' },
    ],
  },
  {
    slug: 'mexican',
    translations: [
      { locale: 'EN', name: 'Mexican' },
      { locale: 'TR', name: 'Meksika' },
      { locale: 'ES', name: 'Mexicana' },
    ],
  },
  {
    slug: 'japanese',
    translations: [
      { locale: 'EN', name: 'Japanese' },
      { locale: 'TR', name: 'Japon' },
      { locale: 'ES', name: 'Japonesa' },
    ],
  },
  {
    slug: 'american',
    translations: [
      { locale: 'EN', name: 'American' },
      { locale: 'TR', name: 'Amerikan' },
      { locale: 'ES', name: 'Estadounidense' },
    ],
  },
  {
    slug: 'french',
    translations: [
      { locale: 'EN', name: 'French' },
      { locale: 'TR', name: 'Fransız' },
      { locale: 'ES', name: 'Francesa' },
    ],
  },
  {
    slug: 'spanish',
    translations: [
      { locale: 'EN', name: 'Spanish' },
      { locale: 'TR', name: 'İspanyol' },
      { locale: 'ES', name: 'Española' },
    ],
  },
  {
    slug: 'greek',
    translations: [
      { locale: 'EN', name: 'Greek' },
      { locale: 'TR', name: 'Yunan' },
      { locale: 'ES', name: 'Griega' },
    ],
  },
  {
    slug: 'indian',
    translations: [
      { locale: 'EN', name: 'Indian' },
      { locale: 'TR', name: 'Hint' },
      { locale: 'ES', name: 'India' },
    ],
  },
  {
    slug: 'korean',
    translations: [
      { locale: 'EN', name: 'Korean' },
      { locale: 'TR', name: 'Kore' },
      { locale: 'ES', name: 'Coreana' },
    ],
  },
]
