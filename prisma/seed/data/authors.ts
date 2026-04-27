type Locale = 'EN' | 'TR' | 'ES'

export type AuthorSeed = {
  slug: string
  name: string
  avatar: string | null
  translations: Array<{
    locale: Locale
    title: string | null
    bio: string | null
  }>
}

export const authors: AuthorSeed[] = [
  {
    slug: 'ferzender',
    name: 'Ferzender Varli',
    avatar: 'tcd/authors/ferzender/avatar',
    translations: [
      {
        locale: 'EN',
        title: 'Founder · Engineer · Home Chef',
        bio: 'Engineer by day, chef by night. Crafting code & desserts with love. From innovative solutions to sweet creations.',
      },
      {
        locale: 'TR',
        title: 'Kurucu · Mühendis · Ev Şefi',
        bio: 'Gündüz mühendis, gece şef. Kod ve tatlıları sevgiyle yoğuran biri. Yenilikçi çözümlerden tatlı yaratımlara.',
      },
      {
        locale: 'ES',
        title: 'Fundador · Ingeniero · Chef Casero',
        bio: 'Ingeniero de día, chef de noche. Tejiendo código y postres con cariño. De soluciones innovadoras a creaciones dulces.',
      },
    ],
  },
]
