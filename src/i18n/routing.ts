import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'tr', 'es'],
  defaultLocale: 'en',
  // English is served unprefixed at /, TR at /tr, ES at /es
  localePrefix: 'as-needed',
  localeCookie: { name: 'tcd_locale' },
  // Localized URL segments. The KEY is the file-system canonical path
  // (English-form); next-intl rewrites the localized URL to that file
  // path internally. Add new public routes here as they ship.
  pathnames: {
    '/': '/',
    '/recipes': {
      en: '/recipes',
      tr: '/tarifler',
      es: '/recetas',
    },
    '/recipes/[slug]': {
      en: '/recipes/[slug]',
      tr: '/tarifler/[slug]',
      es: '/recetas/[slug]',
    },
    '/recipes/[slug]/cook': {
      en: '/recipes/[slug]/cook',
      tr: '/tarifler/[slug]/pisir',
      es: '/recetas/[slug]/cocinar',
    },
    '/print/[slug]': {
      en: '/print/[slug]',
      tr: '/yazdir/[slug]',
      es: '/imprimir/[slug]',
    },
    '/categories/[category]': {
      en: '/categories/[category]',
      tr: '/kategoriler/[category]',
      es: '/categorias/[category]',
    },
    '/diets/[diet]': {
      en: '/diets/[diet]',
      tr: '/diyetler/[diet]',
      es: '/dietas/[diet]',
    },
    '/search': {
      en: '/search',
      tr: '/ara',
      es: '/buscar',
    },
    '/saved': {
      en: '/saved',
      tr: '/kaydedilenler',
      es: '/guardadas',
    },
    '/profile': {
      en: '/profile',
      tr: '/profil',
      es: '/perfil',
    },
    '/plan': '/plan',
    '/design': '/design',
  },
})
