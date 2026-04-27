/**
 * Request correlation ID — used for tracing a single request across logs,
 * Sentry events, and the response (returned via the x-request-id header).
 *
 * If an upstream proxy already sent a request id, we trust it (so a load
 * balancer's tracing header threads through). Otherwise we mint a new
 * one with crypto.randomUUID().
 */

import { randomUUID } from 'node:crypto'

export const REQUEST_ID_HEADER = 'x-request-id'

const SAFE_REQUEST_ID = /^[a-zA-Z0-9_-]{8,128}$/

export function getRequestId(request: Request): string {
  const incoming = request.headers.get(REQUEST_ID_HEADER)
  if (incoming && SAFE_REQUEST_ID.test(incoming)) return incoming
  return randomUUID()
}

/**
 * Merge a request id into a Headers / record-shaped header init.
 */
export function withRequestId(
  headers: HeadersInit | undefined,
  requestId: string,
): HeadersInit {
  if (headers instanceof Headers) {
    const cloned = new Headers(headers)
    cloned.set(REQUEST_ID_HEADER, requestId)
    return cloned
  }
  return { ...(headers as Record<string, string> | undefined), [REQUEST_ID_HEADER]: requestId }
}
