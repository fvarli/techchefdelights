# Developer Guide

How to do common things. Skim the section that matches your task.

## Coding standards

- **TypeScript strict** is non-negotiable. `pnpm typecheck` must be clean before every commit.
- **CSS Modules** for component styles. Use design tokens from `src/styles/tokens.css` (no hardcoded colors / spacings).
- **No comments** unless they explain a non-obvious *why*. Code should read itself.
- **No client JS for server data** — render on the server (RSC) and pass labels/data down. Only mark `'use client'` when you need state, effects, or browser APIs.
- **Single error envelope** for `/api/v1/*`: always `{ error: { code, message, details? } }` via `apiError()` or `ApiErrors.*`.
- **Lowercase enums** at the API boundary (`'beginner'`, not `'BEGINNER'`). `src/lib/api/enums.ts` has converters.
- **Logging**: import `{ logger, reqMeta }` from `@/lib/logger`. Never log emails, hashes, full payloads, auth headers, or cookies. Pass sanitized `context` only.

## How to add a new page

1. Decide layout group:
   - Wrapped (header + footer + mobile-nav)? → `src/app/[locale]/(shell)/your-route/page.tsx`
   - Chromeless (cook, print)? → `src/app/[locale]/your-route/page.tsx`
2. Make it an `async` server component. Read `params` and `searchParams` as Promises (Next.js 16):
   ```ts
   export default async function Page({
     params,
     searchParams,
   }: {
     params: Promise<{ locale: ApiLocale }>
     searchParams: Promise<Record<string, string | string[] | undefined>>
   }) {
     const { locale } = await params
     setRequestLocale(locale)
     // ...
   }
   ```
3. Add `generateMetadata` with `alternates.canonical` and `alternates.languages` for hreflang.
4. Set `export const revalidate = 3600` for ISR (or `dynamic = 'force-dynamic'` if it must be SSR'd every request).
5. If you read searchParams, the route is automatically dynamic (`ƒ`).
6. Add the route to `sitemap.ts` if it's public.
7. Update `robots.ts` Disallow if it should be private.

## How to add an API endpoint

`src/app/api/v1/your-endpoint/route.ts`:

```ts
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { ApiErrors, apiError } from '@/lib/api/errors'
import { logger, reqMeta } from '@/lib/logger'
import { rateLimit } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

const Query = z.object({
  // …strict zod schema
})

export async function GET(request: Request) {
  const meta = reqMeta(request)

  // Rate limit (optional but recommended for public endpoints)
  const v = await rateLimit(request, 'your-endpoint', { limit: 30, windowMs: 60_000 })
  if (!v.allowed) {
    const retryAfter = Math.max(1, Math.ceil((v.resetAt - Date.now()) / 1000))
    logger.warn('your-endpoint.rate_limited', { ...meta, context: { retryAfter } })
    return ApiErrors.rateLimited(retryAfter)
  }

  // Validate
  const url = new URL(request.url)
  const parsed = Query.safeParse({ /* extract from url.searchParams */ })
  if (!parsed.success)
    return apiError(400, 'INVALID_QUERY', 'Bad params.', parsed.error.issues)

  try {
    // …call a loader from src/lib/api
    return NextResponse.json({ /* response */ })
  } catch (err) {
    logger.error('your-endpoint.failed', {
      ...meta,
      context: { error: err instanceof Error ? err.message : 'unknown' },
    })
    return ApiErrors.internal()
  }
}
```

Conventions:
- Path is **always** `/api/v1/...` (versioned).
- Lowercase enums in/out (`'en'` not `'EN'`; convert with `fromApiLocale` / `toApiSkill`).
- Strict zod with caps (`.max(200)` for strings, `.max(50)` for limits).
- Standard error envelope only.
- Audit logs for important actions; error logs on failures with route meta only.

## How to use hooks

All hooks live in `src/hooks/` and follow the v1=v2 contract. Patterns:

```tsx
'use client'
import { useSaveRecipe } from '@/hooks/useSaveRecipe'

function SaveButton({ slug }: { slug: string }) {
  const { saved, toggle, hydrated } = useSaveRecipe(slug)
  if (!hydrated) return null   // avoids flashing wrong state pre-hydration
  return <button onClick={toggle}>{saved ? 'Saved' : 'Save'}</button>
}
```

Available hooks:
| Hook | Purpose |
|---|---|
| `useSaveRecipe(slug)` | per-slug save toggle |
| `useSavedSlugs()` | full list of saved slugs (cross-tab sync) |
| `useShoppingList()` | shopping list state |
| `usePrefs()` | `{ allergies, unitSystem }` |
| `useResumePoint(slug)` | cook mode resume |
| `useTimer(seconds, opts)` | 4-state timer with drift correction |
| `useIngredientCheckoff(slug, servings)` | per-recipe per-scale checkoff |

When swapping to a server backend, modify the hook implementation only — call sites stay the same.

## How to add translations

1. Add the key to **all three** locale files in the same shape:
   ```jsonc
   // src/i18n/messages/en.json
   "MyNamespace": { "greeting": "Hello {name}" }
   ```
   ```jsonc
   // src/i18n/messages/tr.json
   "MyNamespace": { "greeting": "Merhaba {name}" }
   ```
   ```jsonc
   // src/i18n/messages/es.json
   "MyNamespace": { "greeting": "Hola {name}" }
   ```
2. Server component:
   ```tsx
   import { getTranslations } from 'next-intl/server'
   const t = await getTranslations('MyNamespace')
   <p>{t('greeting', { name: 'Ada' })}</p>
   ```
3. Client component:
   ```tsx
   'use client'
   import { useTranslations } from 'next-intl'
   const t = useTranslations('MyNamespace')
   ```
4. **Always pass ICU variables at the call site**, even if the consumer plans to interpolate later. next-intl throws `FORMATTING_ERROR` otherwise. If a server-rendered label has a placeholder the client will fill in:
   ```ts
   // Pass the literal placeholder back as the value:
   resumeBody: t('resumeBanner.body', { step: '{step}' }),
   ```
   The output keeps `{step}` as a literal string; the client `.replace('{step}', actual)` then works.
5. Pluralization uses ICU:
   ```jsonc
   "summary": "{count, plural, =0 {No recipes} =1 {1 recipe} other {# recipes}}"
   ```

## How to add a new recipe field

Recipe data lives in two tables: `Recipe` (locale-agnostic) and `RecipeTranslation` (per-locale). Decide which one your field belongs to.

1. **Schema** — add the field to `prisma/schema.prisma` on the right model.
2. **Migration**:
   ```bash
   pnpm prisma migrate dev --name add_recipe_x
   pnpm prisma generate
   ```
3. **Seed** — extend `prisma/seed/data/recipes/*.ts` and the seed type. Re-run `pnpm prisma db seed`.
4. **API type** — add to `ApiRecipe` (or `ApiRecipeTranslation`-equivalent) in `src/lib/api/types.ts`.
5. **Mapper** — extend `src/lib/api/recipe-mapper.ts` (or wherever the Prisma row → API type happens).
6. **Loader** — make sure `loadRecipeBySlug` selects the new column.
7. **UI** — render in the appropriate component under `src/components/recipe/`.
8. **JSON-LD** — if SEO-relevant, extend `src/lib/jsonld.ts` to include the new field.
9. **API route** — `/api/v1/recipes/[slug]` automatically picks it up via the loader.

## How to test

- **Unit**: vitest, in `tests/unit/*.test.ts`. Use for pure logic (scaling, formatters, validators).
- **E2E**: Playwright, in `tests/e2e/*.spec.ts`. Reset state with:
   ```ts
   async function clearStorage(page) {
     await page.goto('/')
     await page.evaluate(() => { try { localStorage.clear() } catch {} })
   }
   ```
   `addInitScript` runs on every navigation, so don't use it to clear localStorage if you also want writes between pages to persist.
- **A11y**: Playwright + axe in `tests/a11y/*.spec.ts`. Smoke for zero criticals on key routes.
- **Cross-browser**: `pnpm exec playwright test --project={firefox,webkit}` before merging UI changes.

## Performance notes

- Server components fetch data; client components only for state/effects/browser APIs.
- Cook mode is dynamic (`force-dynamic`) — needed for arbitrary `?step=N`.
- Recipe detail uses `revalidate: 3600` ISR. Static at build, refreshed hourly.
- Use `pnpm exec next build --webpack` with `ANALYZE=true` to inspect bundles. Per-route First Load JS targets: home ≤ 180 KB gz, recipe ≤ 220 KB gz.

## Don't do this

- Don't hardcode hex colors / pixel values in CSS Modules — use tokens.
- Don't put Prisma in client components — it'll bloat the bundle and leak secrets.
- Don't `console.log` — use `logger.{info,warn,error}` so production output stays structured.
- Don't add new Radix packages without an actual import in the codebase — bundle hygiene.
- Don't bypass the `(slug, locale)` strict lookup pattern — cross-locale slugs must 404.
- Don't add `Authorization` / `Cookie` to log context. Don't log raw request bodies.
