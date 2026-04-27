// Locked tcd:* localStorage namespace. Single source of truth.
// All hooks that touch localStorage import from here.

export const SK = {
  saves: 'tcd:saves',
  shoppingList: 'tcd:shoppingList',
  ingredients: (slug: string, servings: number) =>
    `tcd:ingredients:${slug}:${servings}`,
  resumePoint: (slug: string) => `tcd:resumePoint:${slug}`,
  timers: 'tcd:timers',
  recentSearches: 'tcd:recentSearches',
  newsletterDismissed: 'tcd:newsletterDismissed',
  units: 'tcd:units',
  locale: 'tcd:locale',
  diet: 'tcd:diet',
  prefs: 'tcd:prefs',
  consent: 'tcd:consent',
} as const
