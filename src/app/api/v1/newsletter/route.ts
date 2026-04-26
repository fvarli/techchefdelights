import { createHash } from 'node:crypto'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { fromApiLocale } from '@/lib/api/enums'
import { ApiErrors, apiError } from '@/lib/api/errors'

export const dynamic = 'force-dynamic'

const NewsletterBody = z.object({
  email: z.string().email().max(254),
  locale: z.enum(['en', 'tr', 'es']).optional(),
})

function hashEmail(email: string): string {
  return createHash('sha256').update(email.trim().toLowerCase()).digest('hex')
}

export async function POST(request: Request) {
  let json: unknown
  try {
    json = await request.json()
  } catch {
    return ApiErrors.invalidQuery({ message: 'Invalid JSON body' })
  }

  const parsed = NewsletterBody.safeParse(json)
  if (!parsed.success) {
    return apiError(400, 'INVALID_EMAIL', 'Email failed validation.', parsed.error.issues)
  }

  const { email, locale = 'en' } = parsed.data
  const emailHash = hashEmail(email)

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
    }
  } catch (err) {
    console.error('newsletter signup failed:', err)
    return ApiErrors.internal()
  }

  return NextResponse.json({ ok: true, status: 'pending' as const })
}
