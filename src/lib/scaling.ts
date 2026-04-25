// Pure ingredient quantity scaling. No React, no DOM.

import type { ApiUnitKey } from './api/enums'

const FRACTIONAL_DISPLAY: Record<string, string> = {
  '0.25': '¼',
  '0.5': '½',
  '0.75': '¾',
  '0.33': '⅓',
  '0.67': '⅔',
}

// Whole-piece units must round to integer (no half eggs).
const INTEGER_UNITS = new Set<ApiUnitKey>(['piece'])

export function scaleQuantity(
  baseQty: number | null,
  factor: number,
  unit: ApiUnitKey | null,
): number | null {
  if (baseQty === null) return null
  const scaled = baseQty * factor
  if (unit && INTEGER_UNITS.has(unit)) {
    return Math.max(1, Math.round(scaled))
  }
  // Round to nearest 0.25 for clean fractional display.
  return Math.round(scaled * 4) / 4
}

export function formatScaledQuantity(qty: number | null): string {
  if (qty === null) return ''
  if (Number.isInteger(qty)) return String(qty)
  const whole = Math.floor(qty)
  const frac = (qty - whole).toFixed(2)
  const fracDisplay = FRACTIONAL_DISPLAY[frac]
  if (fracDisplay) return whole > 0 ? `${whole} ${fracDisplay}` : fracDisplay
  return qty.toFixed(2).replace(/\.?0+$/, '')
}

export const SCALE_MULTIPLIERS = [1, 2, 4, 6] as const
export type ScaleMultiplier = (typeof SCALE_MULTIPLIERS)[number]
