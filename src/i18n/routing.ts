import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'tr', 'es'],
  defaultLocale: 'en',
  // English is served unprefixed at /, TR at /tr, ES at /es
  localePrefix: 'as-needed',
  localeCookie: { name: 'tcd_locale' },
})
