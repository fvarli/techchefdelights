import { NextResponse } from 'next/server'
import { REQUEST_ID_HEADER } from '@/lib/request-id'
import type { ApiError } from './types'

export function apiError(
  status: number,
  code: string,
  message: string,
  details?: unknown,
  requestId?: string,
): NextResponse<ApiError> {
  const body: ApiError = {
    error: {
      code,
      message,
      ...(details !== undefined ? { details } : {}),
      ...(requestId ? { requestId } : {}),
    },
  }
  const headers: Record<string, string> = {}
  if (requestId) headers[REQUEST_ID_HEADER] = requestId
  return NextResponse.json(body, { status, headers })
}

export const ApiErrors = {
  recipeNotFound: (slug: string, locale: string, requestId?: string) =>
    apiError(
      404,
      'RECIPE_NOT_FOUND',
      `No recipe found for slug "${slug}" in locale "${locale}".`,
      { slug, locale },
      requestId,
    ),
  invalidLocale: (locale: string, requestId?: string) =>
    apiError(400, 'INVALID_LOCALE', `Locale "${locale}" is not supported.`, { locale }, requestId),
  invalidQuery: (issues: unknown, requestId?: string) =>
    apiError(400, 'INVALID_QUERY', 'Query parameters failed validation.', issues, requestId),
  internal: (requestId?: string) =>
    apiError(500, 'INTERNAL_ERROR', 'An unexpected error occurred.', undefined, requestId),
  rateLimited: (retryAfterSec: number, requestId?: string) => {
    const body: ApiError = {
      error: {
        code: 'RATE_LIMITED',
        message: 'Too many requests. Please try again later.',
        details: { retryAfterSec },
        ...(requestId ? { requestId } : {}),
      },
    }
    const headers: Record<string, string> = { 'Retry-After': String(retryAfterSec) }
    if (requestId) headers[REQUEST_ID_HEADER] = requestId
    return NextResponse.json(body, { status: 429, headers })
  },
}
