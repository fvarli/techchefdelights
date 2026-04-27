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
import { getRequestId, REQUEST_ID_HEADER } from '@/lib/request-id'

export const dynamic = 'force-dynamic'

const Query = z.object({
  // …strict zod schema
})

export async function GET(request: Request) {
  const requestId = getRequestId(request)
  const meta = { requestId, ...reqMeta(request) }

  // Rate limit (optional but recommended for public endpoints)
  const v = await rateLimit(request, 'your-endpoint', { limit: 30, windowMs: 60_000 })
  if (!v.allowed) {
    const retryAfter = Math.max(1, Math.ceil((v.resetAt - Date.now()) / 1000))
    logger.warn('your-endpoint.rate_limited', { ...meta, context: { retryAfter } })
    return ApiErrors.rateLimited(retryAfter, requestId)
  }

  // Validate
  const url = new URL(request.url)
  const parsed = Query.safeParse({ /* extract from url.searchParams */ })
  if (!parsed.success)
    return apiError(400, 'INVALID_QUERY', 'Bad params.', parsed.error.issues, requestId)

  try {
    // …call a loader from src/lib/api
    return NextResponse.json(
      { /* response */ },
      { headers: { [REQUEST_ID_HEADER]: requestId } },
    )
  } catch (err) {
    logger.error('your-endpoint.failed', {
      ...meta,
      context: { error: err instanceof Error ? err.message : 'unknown' },
    })
    return ApiErrors.internal(requestId)
  }
}
```

**Always** thread `requestId` through:
1. The `x-request-id` response header (success and error paths).
2. The `error.requestId` field of the error envelope (`apiError` and `ApiErrors.*` accept it as the last arg).
3. Every `logger.*` call in the route (via the `meta` object).

Trusting upstream ids: `getRequestId()` accepts an existing `x-request-id` header from a load balancer / Cloudflare and only mints a new uuid when the header is absent or malformed.

## Debugging via request id

The `x-request-id` header threads through three places:
1. Server log line — `requestId: "..."` field in the JSON record (or `req=<first-8>` prefix in dev).
2. Sentry event — visible as a tag/extra when DSN is set.
3. Response — both `x-request-id` header and `body.error.requestId` on errors.

Workflow when a user reports an error:
1. Ask them to send the response header value (or the value in the JSON error body).
2. In your log viewer, search `requestId="<the-uuid>"` to find the exact server-side trace.
3. In Sentry, search by tag `requestId:<the-uuid>` to find the event with stack trace.
4. The three views describe the same request from different angles.

Conventions:
- Path is **always** `/api/v1/...` (versioned).
- Lowercase enums in/out (`'en'` not `'EN'`; convert with `fromApiLocale` / `toApiSkill`).
- Strict zod with caps (`.max(200)` for strings, `.max(50)` for limits).
- Standard error envelope only.
- Audit logs for important actions; error logs on failures with route meta only.

### Rate limit backend selection

`src/lib/rate-limit.ts` chooses one of three implementations at module
load time:

| Priority | Backend | Trigger | Best for |
|---|---|---|---|
| 1 | `StandardRedisStore` (ioredis) | `REDIS_URL` set | VPS / self-hosted production |
| 2 | `UpstashRedisStore` (REST) | `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` set | Serverless (Vercel, Cloudflare) |
| 3 | `MemoryStore` | none of the above | Local dev only |

In production, MemoryStore degrades the health endpoint and emits a
one-shot warn log. To run a quick local Redis for testing:
`docker run -p 6379:6379 redis:alpine` then
`REDIS_URL=redis://127.0.0.1:6379 pnpm dev`.

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

## How to add a new ingredient (and its master)

When you add a recipe with an ingredient that doesn't exist yet:

1. Write the ingredient into the recipe seed file (`prisma/seed/data/recipes/<slug>.ts`) using the existing `IngredientItemSeed` shape — EN/TR/ES `name`, optional `prep`, `substitutes`, `aisle`, `metric`/`us` quantity.
2. The seed runner derives a `slug` deterministically from the **EN name** (lowercased, parentheticals dropped, slugified) and creates a fresh `IngredientMaster` row + locale translations the next time `pnpm prisma db seed` runs.
3. The slug derivation lives in `prisma/seed/ingredient-masters.ts` (`ingredientMasterSlug`) — copy of the rules: lowercase → drop `(...)` parentheticals → split on first `,` or ` or ` → collapse non-alphanumeric to `-`.
4. To override master metadata (canonicalUnit, isStaple, defaultAisle), edit the master row in the database directly or extend `seedIngredientMasters` with explicit overrides. The seed uses `upsert` so it's safe to re-run.
5. To rename an ingredient consistently across recipes, change the EN name in every recipe seed file — the same slug is derived, so the master row stays the same. To change the slug itself you'd need a migration that updates `IngredientMaster.slug` before re-seeding.

The `Ingredient.masterId` column is nullable so a partial seed run (or an ingredient with an empty/unparseable EN name) still succeeds; the seed runner logs a warning instead of failing. Zero recipes should be in that state in normal operation.

## How to add equipment to a recipe

`equipmentSlugs` on `RecipeSeed` accepts two shapes that may be mixed:

- **Plain slug** — `'saucepan'`. Equivalent to `{ slug: 'saucepan', required: true }` with auto-incremented `position` from array order.
- **Object form** — `{ slug, required?, quantity?, note?, position? }`. Use this when you need any of the four metadata fields.

Examples:

```ts
equipmentSlugs: [
  // strictly required, default ordering, no caveats
  { slug: 'oven', position: 0, required: true },

  // recipe needs 4 ramekins
  { slug: 'baking-sheet', position: 1, quantity: 4, required: true,
    note: '8 oz ramekins; 4 of them for individual soufflés' },

  // optional with a substitution hint
  { slug: 'mixer', position: 2, required: false,
    note: 'Hand whisk also works; takes a few minutes longer' },
]
```

Rules of thumb:
- `position` is the display order; explicit values give stable ordering across re-seeds. If omitted, the seed runner uses array-index order.
- `quantity` only renders when `> 1` (UI hides `× 1` as visual noise).
- `note` is **locale-shared in v1** — the same string is shown in EN / TR / ES. Keep it short and either English or locale-neutral until the per-locale translation table lands. Do not put long sentences here; recipe variations and step bodies are the right place for long-form guidance.
- `required: false` produces an "optional" badge on the equipment chip — use it when a substitution exists in the recipe (hand-whisk for mixer, fork for whisk, etc.).

The seed runner is backwards-compatible — old recipe files using `equipmentSlugs: ['saucepan', 'oven']` keep working with `required=true` and array-index `position`.

## How to add a recipe's images

The full workflow lives in **[`IMAGE_WORKFLOW.md`](./IMAGE_WORKFLOW.md)** — read that first, then come back here for the dev shortcuts.

### TL;DR

1. **Generate** the hero image with the brand style guide (see IMAGE_WORKFLOW.md "AI image generation"). Only the hero is required to ship; gallery/step are optional.
2. **Upload** to Cloudinary at the canonical path:
   ```
   recipes/<en-slug>/hero
   recipes/<en-slug>/gallery-1
   recipes/<en-slug>/gallery-2
   recipes/<en-slug>/step-1
   ```
   Use the **EN slug** even for TR/ES recipes — the asset side is locale-agnostic; only `alt` is per-locale.
3. **Edit the recipe seed file** at `prisma/seed/data/recipes/<slug>.ts`:
   ```ts
   heroImageCloudinary: 'recipes/red-lentil-soup/hero',
   heroBlurhash: '<run a blurhash generator on the source>',
   ```
   For gallery / step images, populate the `gallery: []` and `steps[].images: []` arrays with `cloudinaryId`, `w`, `h`, `blurhash`, plus per-locale `alt`.
4. **Re-seed**: `pnpm prisma db seed` (idempotent — upsert).

### Don't do this

- Don't store a full URL in `heroImageCloudinary` — store only the `public_id`. The URL is built at render time.
- Don't reuse the placeholder `tcd/seed/<slug>/hero` for production assets — that prefix is reserved for seed/test data.
- Don't put translated names in the `public_id` — assets are keyed by EN slug.
- Don't write `alt: 'Image of <recipe>'` — screen readers already announce it as an image. Describe the photographic content.
- Don't ship a recipe to production with `isDraft = false` if its hero is still pointing at a `tcd/seed/...` path.

### Adding image dimensions

`w` and `h` are CLS-critical (they prevent layout shift on first paint). Set them to the actual image dimensions, not the rendered size. Cloudinary returns these from the upload response; capture them in the per-recipe metadata template before re-seeding.

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
