import { createHash } from 'node:crypto'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { fromApiLocale } from '@/lib/api/enums'
import { ApiErrors, apiError } from '@/lib/api/errors'
import { logger, reqMeta } from '@/lib/logger'
import { rateLimit } from '@/lib/rate-limit'
import { getRequestId, REQUEST_ID_HEADER } from '@/lib/request-id'

export const dynamic = 'force-dynamic'

const NewsletterBody = z.object({
  email: z.string().email().max(254),
  locale: z.enum(['en', 'tr', 'es']).optional(),
})

function hashEmail(email: string): string {
  return createHash('sha256').update(email.trim().toLowerCase()).digest('hex')
}

export async function POST(request: Request) {
  const requestId = getRequestId(request)
  const meta = { requestId, ...reqMeta(request) }

  const verdict = await rateLimit(request, 'newsletter', { limit: 5, windowMs: 60_000 })
  if (!verdict.allowed) {
    const retryAfter = Math.max(1, Math.ceil((verdict.resetAt - Date.now()) / 1000))
    logger.warn('newsletter.rate_limited', { ...meta, context: { retryAfter } })
    return ApiErrors.rateLimited(retryAfter, requestId)
  }

  let json: unknown
  try {
    json = await request.json()
  } catch {
    return ApiErrors.invalidQuery({ message: 'Invalid JSON body' }, requestId)
  }

  const parsed = NewsletterBody.safeParse(json)
  if (!parsed.success) {
    return apiError(400, 'INVALID_EMAIL', 'Email failed validation.', parsed.error.issues, requestId)
  }

  const { email: _email, locale = 'en' } = parsed.data
  const emailHash = hashEmail(_email)

  try {
    const existing = await db.newsletterSignup.findUnique({ where: { emailHash } })
    if (!existing) {
      await db.newsletterSignup.create({
        data: {
          emailHash,
          locale: fromApiLocale(locale),
          status: 'PENDING',
        },
      })
      logger.info('newsletter.signup', { ...meta, context: { locale, status: 'created' } })
    } else {
      logger.info('newsletter.signup', { ...meta, context: { locale, status: 'duplicate' } })
    }
  } catch (err) {
    logger.error('newsletter.signup_failed', {
      ...meta,
      context: { locale, error: err instanceof Error ? err.message : 'unknown' },
    })
    return ApiErrors.internal(requestId)
  }

  return NextResponse.json(
    { ok: true, status: 'pending' as const },
    { headers: { [REQUEST_ID_HEADER]: requestId } },
  )
}
