# Architecture

## Folder structure

```
techchefdelights/
├─ prisma/
│  ├─ schema.prisma            41 models, 7 enums, translation tables
│  ├─ migrations/              including 20260425191951_search_vectors
│  └─ seed/                    8 recipes × 3 locales + taxonomies
├─ src/
│  ├─ app/
│  │  ├─ [locale]/
│  │  │  ├─ layout.tsx         html/body, NextIntlClientProvider, GA mount
│  │  │  ├─ (shell)/           SiteShell-wrapped pages (header/footer/mobile-nav)
│  │  │  │  ├─ page.tsx        home
│  │  │  │  ├─ recipes/        index w/ filters + cursor pagination
│  │  │  │  ├─ r/[slug]/       recipe detail (JSON-LD, ISR)
│  │  │  │  ├─ c/[category]/   per-locale category slug taxonomy
│  │  │  │  ├─ d/[diet]/       shared-slug diet taxonomy
│  │  │  │  ├─ search/         FTS over searchVector
│  │  │  │  ├─ saved/          localStorage-backed
│  │  │  │  ├─ profile/        usePrefs (allergies + units)
│  │  │  │  ├─ plan/           coming-soon stub
│  │  │  │  └─ design/         primitives showcase (noindex)
│  │  │  ├─ r/[slug]/cook/     CHROMELESS — outside (shell)
│  │  │  └─ print/[slug]/      CHROMELESS — BareShell, @media print
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
- **Translation**: server components use `getTranslations('Namespace')`; client components use `useTranslations('Namespace')`. Messages live in `src/i18n/messages/{en,tr,es}.json`.
- **Database translations**: every locale-variant entity (`Recipe`, `Step`, `Ingredient`, `Equipment`, `Variation`, `FAQ`, `Category`, `Tag`, `Diet`, `Cuisine`, `Allergen`, plus `EditorialPick`) has a sibling `*Translation` table keyed `(parentId, locale)`. Numbers, FKs, and structural fields stay locale-agnostic on the base row.
- **Slugs**:
  - Recipe slugs are **per-locale** (in `RecipeTranslation.slug`, unique by `(locale, slug)`).
  - Category slugs are **per-locale** in `CategoryTranslation.slug`. Strict `(locale, slug)` lookup; cross-locale slugs return 404.
  - Diet slugs are **shared** across locales (only on `Diet.slug`); only the name/description are translated.

## Routing strategy

- `[locale]/(shell)/...` — wrapped by `SiteShell` (Header, Footer, MobileBottomNav, skip-to-content link).
- `[locale]/r/[slug]/cook/page.tsx` — outside the shell group. Chromeless cook mode, `dynamic = 'force-dynamic'`, `robots: { index: false, follow: false }`.
- `[locale]/print/[slug]/page.tsx` — outside the shell group. BareShell with `@media print` styles.
- API at `/api/v1/...` is locale-agnostic and not under `[locale]`; resolves locale via `?locale=` query param using `resolveLocale()`.

## Cook Mode architecture

```
URL: /r/<slug>/cook?step=N      (N optional; 0 by default)
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

- **Rate limit**: `src/lib/rate-limit.ts` is fixed-window in-memory with a `RateLimitStore` interface — drop in Redis/Upstash without touching call sites.
- **Logger**: `src/lib/logger.ts` emits structured JSON in production, human-readable lines in development. Audit logs at: `newsletter.signup`, `search.query`, `*.rate_limited`, `*.failed`.
- **Sentry**: env-gated via `SENTRY_DSN` / `NEXT_PUBLIC_SENTRY_DSN`. No app crash when unset.
- **Security headers**: configured in `next.config.ts` (`headers()`). Includes `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, and production-only `Strict-Transport-Security`.

## Testing strategy

- **Unit** (`tests/unit/*.test.ts`) — vitest, fast loop for pure logic.
- **E2E** (`tests/e2e/*.spec.ts`) — Playwright. 4 critical flows: cook + timer + resume, save → /saved, search → recipe detail, locale routing.
- **A11y** (`tests/a11y/*.spec.ts`) — Playwright + axe-core, asserts zero critical WCAG 2 A/AA violations on home.
- **Cross-browser**: chromium / firefox / webkit projects via `playwright.config.ts`.
