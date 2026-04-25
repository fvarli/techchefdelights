// Prisma enum → API lowercase string mapping. Single source of truth.
// Public API never leaks Prisma enum values; clients (Flutter included) only see these.

import type {
  Locale,
  Skill,
  UnitKey,
  AisleKey,
  AllergenPresence,
  VideoProvider,
  NewsletterStatus,
} from '@/generated/prisma/enums'

export type ApiLocale = 'en' | 'tr' | 'es'
export type ApiSkill = 'beginner' | 'intermediate' | 'advanced'
export type ApiUnitKey =
  | 'g' | 'kg' | 'ml' | 'l' | 'tsp' | 'tbsp' | 'cup' | 'oz' | 'lb' | 'piece' | 'pinch'
export type ApiAisleKey =
  | 'produce' | 'meat' | 'dairy' | 'pantry' | 'bakery' | 'frozen' | 'spices' | 'other'
export type ApiAllergenPresence = 'contains' | 'may-contain' | 'free'
export type ApiVideoProvider = 'youtube' | 'vimeo' | 'self'
export type ApiNewsletterStatus = 'pending' | 'confirmed' | 'unsubscribed'

export const toApiLocale = (locale: Locale): ApiLocale =>
  locale.toLowerCase() as ApiLocale

export const fromApiLocale = (locale: ApiLocale): Locale =>
  locale.toUpperCase() as Locale

export const toApiSkill = (skill: Skill): ApiSkill =>
  skill.toLowerCase() as ApiSkill

export const toApiUnitKey = (unit: UnitKey): ApiUnitKey =>
  unit.toLowerCase() as ApiUnitKey

export const toApiAisleKey = (aisle: AisleKey): ApiAisleKey =>
  aisle.toLowerCase() as ApiAisleKey

export const toApiAllergenPresence = (p: AllergenPresence): ApiAllergenPresence => {
  switch (p) {
    case 'CONTAINS': return 'contains'
    case 'MAY_CONTAIN': return 'may-contain'
    case 'FREE': return 'free'
  }
}

export const toApiVideoProvider = (p: VideoProvider): ApiVideoProvider =>
  p.toLowerCase() as ApiVideoProvider

export const toApiNewsletterStatus = (s: NewsletterStatus): ApiNewsletterStatus =>
  s.toLowerCase() as ApiNewsletterStatus
