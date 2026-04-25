import type { Money } from './api/types'
import type { ApiLocale } from './api/enums'

const LOCALE_MAP: Record<ApiLocale, string> = {
  en: 'en-US',
  tr: 'tr-TR',
  es: 'es-ES',
}

// ISO 4217 currencies with 0 fractional digits. Partial list — extend as needed.
const ZERO_DECIMAL = new Set(['JPY', 'KRW', 'VND'])

export function formatMoney(money: Money, locale: ApiLocale): string {
  const intlLocale = LOCALE_MAP[locale]
  const decimals = ZERO_DECIMAL.has(money.currency) ? 0 : 2
  const major = money.amountMinor / Math.pow(10, decimals)
  return new Intl.NumberFormat(intlLocale, {
    style: 'currency',
    currency: money.currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(major)
}
