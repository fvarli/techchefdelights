import { NextResponse } from 'next/server'
import type { ApiError } from './types'

export function apiError(
  status: number,
  code: string,
  message: string,
  details?: unknown,
): NextResponse<ApiError> {
  const body: ApiError = {
    error: { code, message, ...(details !== undefined ? { details } : {}) },
  }
  return NextResponse.json(body, { status })
}

export const ApiErrors = {
  recipeNotFound: (slug: string, locale: string) =>
    apiError(404, 'RECIPE_NOT_FOUND', `No recipe found for slug "${slug}" in locale "${locale}".`, {
      slug,
      locale,
    }),
  invalidLocale: (locale: string) =>
    apiError(400, 'INVALID_LOCALE', `Locale "${locale}" is not supported.`, { locale }),
  invalidQuery: (issues: unknown) =>
    apiError(400, 'INVALID_QUERY', 'Query parameters failed validation.', issues),
  internal: () =>
    apiError(500, 'INTERNAL_ERROR', 'An unexpected error occurred.'),
  rateLimited: (retryAfterSec: number) => {
    const body: ApiError = {
      error: {
        code: 'RATE_LIMITED',
        message: 'Too many requests. Please try again later.',
        details: { retryAfterSec },
      },
    }
    return NextResponse.json(body, {
      status: 429,
      headers: { 'Retry-After': String(retryAfterSec) },
    })
  },
}
