# Architecture

## Folder structure

```
techchefdelights/
├─ prisma/
│  ├─ schema.prisma            43 models, 7 enums, translation tables
│  │                           (RecipeEquipment carries usage metadata
│  │                            required/quantity/note/position; v1.1 will
│  │                            split note per-locale via translation table)
│  ├─ migrations/              including 20260425191951_search_vectors
│  └─ seed/                    8 recipes × 3 locales + taxonomies
├─ src/
│  ├─ app/
│  │  ├─ [locale]/
│  │  │  ├─ layout.tsx         html/body, NextIntlClientProvider, GA mount
│  │  │  ├─ (shell)/           SiteShell-wrapped pages (header/footer/mobile-nav)
│  │  │  │  ├─ page.tsx                         home
│  │  │  │  ├─ recipes/page.tsx                 index w/ filters + cursor pagination
│  │  │  │  ├─ recipes/[slug]/page.tsx          recipe detail (JSON-LD, ISR)
│  │  │  │  ├─ categories/[category]/page.tsx   per-locale category slug taxonomy
│  │  │  │  ├─ diets/[diet]/page.tsx            shared-slug diet taxonomy
│  │  │  │  ├─ search/                          FTS over searchVector
│  │  │  │  ├─ saved/                           localStorage-backed
│  │  │  │  ├─ profile/                         usePrefs (allergies + units)
│  │  │  │  ├─ plan/                            coming-soon stub
│  │  │  │  └─ design/                          primitives showcase (noindex)
│  │  │  ├─ recipes/[slug]/cook/                CHROMELESS — outside (shell)
│  │  │  └─ print/[slug]/                       CHROMELESS — BareShell, @media print
│  │  ├─ api/v1/
│  │  │  ├─ recipes/[slug]/    GET full recipe by (slug, locale)
│  │  │  ├─ search/            GET FTS, rate-limited
│  │  │  ├─ newsletter/        POST signup, rate-limited
│  │  │  ├─ live/              GET fake-but-stable cooks-now counter
│  │  │  └─ health/            GET liveness + DB ping
│  │  ├─ sitemap.ts            dynamic, hreflang per entry
│  │  ├─ robots.ts             noindex blocks for private/dynamic routes
│  │  └─ global-error.tsx      root React error boundary (Sentry-aware)
│  ├─ components/              foundation, navigation, home, recipe, cook, account, analytics
│  ├─ hooks/                   client localStorage hooks (saves, prefs, resume, timer, ingredients)
│  ├─ lib/
│  │  ├─ db.ts                 Prisma singleton w/ adapter-pg
│  │  ├─ logger.ts             structured JSON logger
│  │  ├─ rate-limit.ts         in-memory store w/ swappable interface
│  │  ├─ storage-keys.ts       tcd:* namespace lock
│  │  ├─ scaling.ts            ingredient quantity formatting
│  │  ├─ jsonld.ts             Recipe / FAQ / Breadcrumb builders
│  │  ├─ path.ts               localePath()
│  │  └─ api/                  loaders (recipe, recipe-list, search, account, home), enums, errors, types
│  ├─ i18n/                    request.ts, routing.ts, messages/{en,tr,es}.json
│  ├─ styles/                  tokens.css, reset.css
│  ├─ proxy.ts                 next-intl middleware (Next 16 rename)
│  ├─ instrumentation.ts       Sentry server/edge init (env-gated)
│  └─ instrumentation-client.ts Sentry client init (env-gated)
├─ tests/{unit, e2e, a11y}/
├─ next.config.ts              security headers, bundle analyzer wrap
├─ playwright.config.ts        chromium / firefox / webkit projects
└─ tsconfig.json               strict
```

## Data flow

```
RSC page (server component)
   │
   ├─ params/searchParams via Next.js 16 promised props
   │
   ├─ typed loader  src/lib/api/recipe-loader.ts (etc.)
   │     │
   │     └─ Prisma client via src/lib/db.ts
   │           │
   │           └─ PostgreSQL (translation table joins, FTS, GIN)
   │
   ├─ payload mapped to ApiRecipe / HomeRecipeCard / etc. (src/lib/api/types.ts)
   │
   └─ rendered via React Server Components; passes only serializable
      labels + data to client components for interactivity (timers,
      saves, search input).

External callers (future Flutter app, JS clients) hit /api/v1/* route
handlers which use the SAME loaders and return the SAME types — the
JSON shape is the public contract.
```

## i18n system

- **Library**: next-intl 4.
- **Locales**: `en`, `tr`, `es`. EN is the default and is served unprefixed (`/`); TR and ES are prefixed (`/tr`, `/es`).
- **Route layout**: `[locale]` segment matches all three; `localePrefix: 'as-needed'` strips `/en` to `/` automatically.
- **Localized URL segments**: routing.pathnames maps each canonical English path (the file-system path) to per-locale URL forms. The user-facing URL is localized; Next.js still routes the request to the canonical file. Example:
  - File: `src/app/[locale]/(shell)/recipes/[slug]/page.tsx`
  - EN URL: `/recipes/<slug>`
  - TR URL: `/tr/tarifler/<slug>`
  - ES URL: `/es/recetas/<slug>`
  Add new public routes to `routing.pathnames` and to the `PATHNAMES` table inside `src/lib/path.ts`. Internal links go through `localePath(locale, '/canonical/path')` which returns the right URL for the locale.
- **Translation**: server components use `getTranslations('Namespace')`; client components use `useTranslations('Namespace')`. Messages live in `src/i18n/messages/{en,tr,es}.json`.
- **Database translations**: every locale-variant entity (`Recipe`, `Step`, `Ingredient`, `IngredientMaster`, `Equipment`, `Variation`, `FAQ`, `Category`, `Tag`, `Diet`, `Cuisine`, `Allergen`, plus `EditorialPick`) has a sibling `*Translation` table keyed `(parentId, locale)`. Numbers, FKs, and structural fields stay locale-agnostic on the base row.
- **Slugs**:
  - Recipe slugs are **per-locale** (in `RecipeTranslation.slug`, unique by `(locale, slug)`).
  - Category slugs are **per-locale** in `CategoryTranslation.slug`. Strict `(locale, slug)` lookup; cross-locale slugs return 404.
  - Diet slugs are **shared** across locales (only on `Diet.slug`); only the name/description are translated.

## Routing strategy

- `[locale]/(shell)/...` — wrapped by `SiteShell` (Header, Footer, MobileBottomNav, skip-to-content link).
- `[locale]/recipes/[slug]/cook/page.tsx` — outside the shell group. Chromeless cook mode, `dynamic = 'force-dynamic'`, `robots: { index: false, follow: false }`. Localized at `/tr/tarifler/<slug>/pisir`, `/es/recetas/<slug>/cocinar`.
- `[locale]/print/[slug]/page.tsx` — outside the shell group. BareShell with `@media print` styles. Localized at `/tr/yazdir/<slug>`, `/es/imprimir/<slug>`.
- Old short-form paths (`/r/<slug>`, `/c/<slug>`, `/d/<slug>`, plus old non-localized `/tr/recipes/...` / `/es/profile` etc.) are kept as **308 permanent redirects** in `next.config.ts → redirects()` so external links and cached search results don't 404.
- API at `/api/v1/...` is locale-agnostic and not under `[locale]`; resolves locale via `?locale=` query param using `resolveLocale()`.

## Cook Mode architecture

```
URL: /recipes/<slug>/cook?step=N      (N optional; 0 by default)
                  │
                  ├─ Page (RSC):  loads recipe via loadRecipeBySlug()
                  │                clamps step to [0, totalSteps-1]
                  │                renders CookHeader + StepCard + CookControls
                  │
                  ├─ TimerModule (client):
                  │     - performance.now() + requestAnimationFrame
                  │     - 4-state machine: idle | active | paused | complete
                  │     - re-mounted per step via key={stepIndex}
                  │
                  ├─ CookControls (client):
                  │     - Prev/Next via router.replace (no full reload)
                  │     - ArrowLeft/ArrowRight keyboard shortcuts
                  │     - Persists resume point on every step change
                  │
                  └─ ExitConfirmModal (Radix Dialog):
                        - focus trap, ESC cancels, ⌘+Enter confirms
                        - "Save & exit" writes tcd:resumePoint:<slug>
                        - On recipe detail page, ResumeBanner reads
                          the same key and offers a Resume link

State persistence: tcd:resumePoint:<slug> = { stepIndex, savedAt }
                   (localStorage; no server hit until auth lands)
```

## Equipment model — usage row vs canonical master

Same two-layer pattern as ingredients:

- **`Equipment`** — canonical taxonomy (saucepan, oven, whisk, …). One row per real-world piece of equipment. Localized name via `EquipmentTranslation`.
- **`RecipeEquipment`** — recipe-specific usage row. Carries:
  - `required` (bool, default `true`) — strictly required vs nice-to-have
  - `quantity` (int?) — when more than one is needed (e.g. 4 ramekins)
  - `note` (string?) — recipe-specific caveat ("a 4-litre, heavy-bottom pot is ideal", "hand whisk also works")
  - `position` (int, default `0`) — stable display order on the recipe page
- API exposes `ApiRecipeEquipment` (extends `ApiTaxonomyRef`) with all four optional metadata fields. Old consumers that read only `slug`/`name`/`iconKey` keep working.
- UI: `EquipmentList` shows the name, an `×N` quantity badge when > 1, an `optional` chip when `required=false`, and the note as a sub-line.

**v1 limitation**: `note` is locale-shared (single string used for EN/TR/ES). Keep notes short and either English or locale-neutral. A per-locale `RecipeEquipmentTranslation` table is tracked as a v1.1 enhancement; until then, write notes in English (the dominant content language for v1) or keep them universal ("4 × 8 oz ramekins").

## Ingredient model — usage row vs canonical master

Two layers, on purpose:

- **`Ingredient`** — per-recipe **usage row**. "200 g flour, sifted" inside the dough group of recipe X. Carries the recipe-specific `quantity`, `unit`, `position`, `optional`, and `aisle` override. One row per recipe-ingredient occurrence; ~10 rows per recipe.
- **`IngredientMaster`** — canonical, recipe-agnostic concept of an ingredient: "flour", "olive oil", "egg". Exists once per real-world ingredient and is referenced by many `Ingredient` rows via the optional `Ingredient.masterId` foreign key.
- **`IngredientMasterTranslation`** — per-locale `name`, optional `pluralName`, and `aliases[]` (e.g. `['plain flour', 'all-purpose flour']`) used for search and ingredient-page SEO.

Why split?
- **Ingredient pages** — `/ingredients/<slug>` lists every recipe that uses it (forthcoming). Without a canonical master, "Olive oil" and "olive-oil" and "Extra virgin olive oil" would each anchor a different page.
- **Allergen automation** — link allergens to masters, not usage rows; one declaration covers every recipe that uses the master.
- **Shopping-list merge** — combining "200 g flour" + "300 g flour" across recipes only works when both rows point at the same master.
- **Nutrition calculation** — per-100g macros live on the master; usage rows scale by quantity.
- **Substitutions** — substitution graph lives between masters, not usage rows.

v1 status:
- Schema in place (`IngredientMaster`, `IngredientMasterTranslation`, `Ingredient.masterId` nullable).
- Seed derives master slug from each recipe's EN ingredient name (`prisma/seed/ingredient-masters.ts`), creates master rows, and connects every `Ingredient` to its master via slug. Today: 63 masters across 8 recipes; 82/82 ingredient rows linked.
- API and recipe pages do not surface `masterId` yet — public types are unchanged. The relation is available for future ingredient pages, allergen automation, etc.

## Master assets — content-graph entities with their own images

`IngredientMaster` and `Equipment` aren't just taxonomies — they're **content-graph nodes**. The site is a graph of recipes, ingredients, equipment, diets, categories, and their relationships, and the SEO/UX upside of that graph only lands when each node has its own surface:

```
/ingredients/avocado          "Recipes with avocado"
/equipment/saucepan           "Recipes using a saucepan"
```

Those pages need a hero image and (often) an icon, and those images are **reusable across every recipe that uses the same master** — one image of avocado covers all 12 recipes that include avocado. To enable that without a future migration, the schema carries:

| Master | Field | Purpose |
|---|---|---|
| `IngredientMaster.imagePublicId` | optional Cloudinary `public_id` | hero for `/ingredients/<slug>` |
| `IngredientMaster.iconPublicId` | optional `public_id` | small icon (recipe overlays, search hits, ingredient pills) |
| `Equipment.imagePublicId` | optional `public_id` | hero for `/equipment/<slug>` |
| `Equipment.iconPublicId` | optional `public_id` | small icon (equipment chips on recipe pages) |

All four columns are nullable. Today every row has them set to `NULL` — fields exist for future content; no data migration is required to start using them.

### Why `IngredientMaster` and not `Ingredient`

`Ingredient` is the **per-recipe usage row** ("200 g flour, sifted, in this recipe's dough group"). It's transient — flour gets a different `Ingredient` row for every recipe that uses it. Putting an image on `Ingredient` would mean uploading the same flour photo dozens of times, one per recipe. The image describes the canonical ingredient; the canonical ingredient is `IngredientMaster`. Same logic for `Equipment` (already canonical) vs `RecipeEquipment` (the per-recipe usage join).

### Public ID conventions

```
ingredients/<en-slug>/hero
ingredients/<en-slug>/icon
equipment/<en-slug>/hero
equipment/<en-slug>/icon
```

Same locale-agnostic, EN-slug-keyed convention as recipes. `tcd/seed/*` placeholders are forbidden for production master assets, same as the recipe gate.

### Provider portability — same property as recipe images

The DB stores **only the `public_id`** for master assets too. Switching off Cloudinary later is a URL-helper swap, not a schema migration. See `IMAGE_WORKFLOW.md` for the full breakdown.

### What's NOT in v1 (deliberately)

- `/ingredients/<slug>` and `/equipment/<slug>` pages — schema is ready, page implementation deferred
- Per-locale alt-text on master assets — would require new translation tables; deferred until at least one master batch has shipped
- `IMAGES_STRICT=1` gate for master assets — strict mode covers recipe heroes only today; master fields are advisory until the workflow is real
- `content/master-image-manifest.ts` — recipe manifest exists; master manifest deferred until manual master batch is in production

See `IMAGE_WORKFLOW.md` "Master assets — ingredient + equipment images" for the full operational rules.

## Image storage & provider portability

Images for a recipe come in four roles: **hero** (1, required for production), **gallery** (0–N), **step** (0–N per step), and **OG / social** (derived from hero by default).

Schema layout:
- `Recipe.heroImageCloudinary` — required string, holds the Cloudinary `public_id` for the hero
- `Recipe.heroBlurhash` — optional preview placeholder
- `RecipeImage` — gallery rows: `cloudinaryId`, `w`, `h`, `blurhash`, `position`; `RecipeImageTranslation` carries per-locale `alt`
- `StepImage` — same shape as `RecipeImage`, scoped per `Step`

Provider portability is by design:
- The DB stores **only the `public_id`**, never a full URL or transformation string. Today that path is shaped for Cloudinary (`recipes/<slug>/hero`); a future move to imgix / Bunny.net / R2 + Cloudflare Images / self-hosted Imgproxy is a **URL-builder swap**, not a schema migration.
- `w`, `h`, `blurhash`, `alt` are provider-neutral.
- Convention: production assets live at `recipes/<en-slug>/<role>(-N)?` (locale-agnostic on the asset side; only `alt` is per-locale). Seed data uses `tcd/seed/<slug>/...` so test environments don't collide with real assets.

See **`IMAGE_WORKFLOW.md`** for the full operational doc: hero/gallery/step roles, AI image generation style guide, alt-text SEO rules, per-recipe metadata template, future schema additions (caption, role enum, color palette, AI-content flag), and the pre-promotion verification checklist.

## Storage abstraction

Single namespace lock (`src/lib/storage-keys.ts`):

| Key | Purpose |
|---|---|
| `tcd:saves` | string[] of saved recipe slugs |
| `tcd:shoppingList` | shopping list state |
| `tcd:ingredients:<slug>:<servings>` | ingredient checkoff state per recipe + scale |
| `tcd:resumePoint:<slug>` | cook mode resume point |
| `tcd:timers` | active timer snapshots |
| `tcd:recentSearches` | recent search terms (UI-only) |
| `tcd:newsletterDismissed` | dismissed newsletter banner |
| `tcd:units` | metric / us preference |
| `tcd:locale` | last selected locale |
| `tcd:diet` | dietary filter preference |
| `tcd:prefs` | full UserPreferences blob (allergies + unitSystem) |

Hooks (`src/hooks/*.ts`) return v1=v2-compatible shapes — `{ saved, toggle, hydrated }` etc. — so the eventual swap to a real backend changes only the implementation, not call sites.

## Future migration path (auth & backend)

When auth lands:
1. `useAuth()` becomes real (`{ user: User, status: 'auth' }`).
2. Each storage hook grows a guard: `if (user) { useQuery + useMutation } else { local path }`.
3. On login, run a one-time merge: read all `tcd:*` blobs, POST to `/api/v1/saves/merge` and `/api/v1/shopping-list/merge`, clear local.
4. **Component call sites do not change.**

The `/api/v1/*` route handlers are designed to be the JSON contract for both the web frontend (post-auth) and the future Flutter app — the shapes in `src/lib/api/types.ts` are stable and versioned.

## Security & observability

- **Rate limit** (`src/lib/rate-limit.ts`): swappable `RateLimitStore` interface with three implementations — `StandardRedisStore` (ioredis over `REDIS_URL`, preferred for self-hosted VPS), `UpstashRedisStore` (REST API, for serverless), and `MemoryStore` (per-process, dev only). Backend chosen at module load with priority `REDIS_URL` → Upstash → memory. Production with MemoryStore emits a one-shot warn log and `/api/v1/health.status === "degraded"` so the misconfiguration is visible. Quotas: newsletter 5/60s, search 30/60s, recipes 120/60s — all per-IP.
- **Logger** (`src/lib/logger.ts`): structured JSON in production, human-readable lines in development. Every log record carries `requestId`. Audit events: `newsletter.signup`, `*.rate_limited`, `search.query` (length only), `*.failed`, `health.db_check_failed`. Never logs bodies, headers, emails, hashes, or tokens.
- **Request correlation** (`src/lib/request-id.ts`): every `/api/v1/*` request gets a uuid (or trusts an upstream `x-request-id`). Threaded through the response header, the error envelope (`error.requestId`), and every log line for a given request. See README "Debugging via request id".
- **Sentry** (`src/instrumentation.ts` + `src/instrumentation-client.ts`): env-gated via `SENTRY_DSN` / `NEXT_PUBLIC_SENTRY_DSN`. No app crash when unset. Release id resolved from `NEXT_PUBLIC_APP_VERSION` → `VERCEL_GIT_COMMIT_SHA` → `APP_COMMIT_SHA`. Source map upload is conditional on `SENTRY_AUTH_TOKEN` + `SENTRY_ORG` + `SENTRY_PROJECT` being set at build time; maps are uploaded then deleted from the public bundle.
- **Security headers** (`next.config.ts`): `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Content-Security-Policy`, and production-only `Strict-Transport-Security`. CSP allow-lists Cloudinary for images, Google Tag Manager + GA + Sentry ingest for connect/script, and uses `'unsafe-inline'` (a documented Next.js compat allowance).
- **Analytics consent** (`src/hooks/useConsent.ts`, `ConsentBanner`, `PrivacySettingsLink`): `tcd:consent` localStorage shape `{ analytics, decidedAt, version: 1 }`. GA4 only loads after explicit accept. Footer button reopens the banner so users can change choice. Banner stays hidden when `NEXT_PUBLIC_GA_ID` is unset.
- **Health endpoint** (`src/app/api/v1/health/route.ts`): liveness + readiness probe. Reports DB ping, rate-limit backend, uptime, memory, environment, commit, version, requestId. 503 in production when DB fails or running on memory store.

## Testing strategy

- **Unit** (`tests/unit/*.test.ts`) — vitest, fast loop for pure logic.
- **E2E** (`tests/e2e/*.spec.ts`) — Playwright. 4 critical flows: cook + timer + resume, save → /saved, search → recipe detail, locale routing.
- **A11y** (`tests/a11y/*.spec.ts`) — Playwright + axe-core, asserts zero critical WCAG 2 A/AA violations on home.
- **Cross-browser**: chromium / firefox / webkit projects via `playwright.config.ts`.
