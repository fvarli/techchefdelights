# TechChefDelights

A 3-language (EN / TR / ES) recipe site. Tested recipes, full Cook Mode with timers, and a JSON API ready for a future Flutter mobile app.

- **Live**: [techchefdelights.com](https://techchefdelights.com) (post-launch)
- **Stack**: Next.js 16 (App Router, RSC, ISR) · TypeScript · PostgreSQL + Prisma 7 · next-intl · CSS Modules
- **Status**: pre-traffic hardening complete; staging-ready

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 — App Router, RSC + ISR (`revalidate: 3600` on recipe pages) |
| Language | TypeScript 5 strict |
| Database | PostgreSQL + Prisma 7 with `@prisma/adapter-pg` |
| i18n | next-intl 4 — `localePrefix: 'as-needed'` (EN unprefixed) |
| Search | Postgres FTS — per-locale `tsvector` + GIN, snowball stemmers (en/tr/es) |
| Styling | CSS variables + CSS Modules (no Tailwind) |
| UI primitives | Radix UI Dialog only (used for ExitConfirmModal) |
| Forms | react-hook-form + zod |
| Testing | Vitest + Playwright (chromium / firefox / webkit) + axe-core |
| Observability | Structured JSON logger; Sentry env-gated; GA4 production-only |
| Images | Cloudinary (deferred to launch) |

## Getting started

Prerequisites: Node 22+, pnpm, PostgreSQL 16 (local install or Docker).

```bash
pnpm install
pnpm prisma generate
pnpm prisma migrate deploy
pnpm prisma db seed     # 8 recipes × 3 locales + categories/tags/diets/...
pnpm dev                # http://localhost:3000
```

## Build / test commands

```bash
pnpm typecheck          # tsc --noEmit, strict
pnpm build              # Next.js production build (Turbopack)
pnpm test               # vitest unit
pnpm test:e2e           # Playwright e2e (chromium)
pnpm test:a11y          # axe-core a11y smoke (chromium)

# Cross-browser
pnpm exec playwright test --project=firefox
pnpm exec playwright test --project=webkit

# Bundle analyzer (webpack mode)
ANALYZE=true pnpm next build --webpack
```

## Environment variables

Set in your hosting platform (or `.env.local` for development):

| Var | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | yes | Postgres connection. `postgresql://USER:PASS@HOST:PORT/DB?sslmode=require` |
| `NEXT_PUBLIC_BASE_URL` | yes (prod) | Used by sitemap, robots, JSON-LD, OpenGraph. No trailing slash. |
| `NEXT_PUBLIC_GA_ID` | optional | GA4 ID. Loads only when set + `NODE_ENV=production` + user has accepted analytics consent. |
| `SENTRY_DSN` | optional | Sentry server DSN. Init is a no-op when unset. |
| `NEXT_PUBLIC_SENTRY_DSN` | optional | Sentry client DSN. |
| `SENTRY_AUTH_TOKEN` | prod CI | Required for source map upload. Without it, `withSentryConfig` is skipped at build time. |
| `SENTRY_ORG` / `SENTRY_PROJECT` | prod CI | Sentry org + project slugs for source map upload. |
| `SENTRY_ENV` / `NEXT_PUBLIC_SENTRY_ENV` | optional | Override Sentry environment tag (defaults to `NODE_ENV`). |
| `NEXT_PUBLIC_APP_VERSION` | optional | Release id for Sentry + `/api/v1/health`. Falls back to `VERCEL_GIT_COMMIT_SHA` or `APP_COMMIT_SHA`. |
| `VERCEL_GIT_COMMIT_SHA` | auto (Vercel) | Auto-injected. Surfaced as `commit` in `/api/v1/health`. |
| `APP_COMMIT_SHA` | optional | CI fallback for the commit field on non-Vercel deploys. |
| `REDIS_URL` | **prod (recommended)** | Standard Redis URL for distributed rate limiting (`redis://host:6379` or `rediss://...` for TLS). Used via ioredis. Best fit for VPS / self-hosted deploys. |
| `UPSTASH_REDIS_REST_URL` | prod (serverless alt) | Upstash Redis REST URL — used only when `REDIS_URL` is unset. Best for serverless platforms (Vercel, Cloudflare) that can't hold TCP sockets. |
| `UPSTASH_REDIS_REST_TOKEN` | prod (serverless alt) | Upstash REST token. Required if `UPSTASH_REDIS_REST_URL` is set. |
| `CLOUDINARY_CLOUD_NAME` | deferred | Required when real images replace placeholders. |
| `CLOUDINARY_API_KEY` | deferred | Same. |
| `CLOUDINARY_API_SECRET` | deferred | Same. |

**Behavior summary:**
- All Sentry / GA / Redis vars are **optional**. Missing values produce no-op behavior (Sentry inactive, GA hidden, MemoryStore fallback).
- **Rate limit backend selection** (priority): `REDIS_URL` → `UPSTASH_REDIS_REST_URL`+`TOKEN` → MemoryStore. The `/api/v1/health.rateLimitStore` field reports which one is active (`'redis'` | `'upstash'` | `'memory'`).
- In **production**, MemoryStore flips `/api/v1/health.status` to `degraded` and emits a `rateLimit.fallback_memory_store` warn log. **Self-hosted: set `REDIS_URL`. Serverless: set Upstash vars.**
- Without `SENTRY_AUTH_TOKEN`+`SENTRY_ORG`+`SENTRY_PROJECT`, builds skip source map upload (production builds still work; just not bound to releases in Sentry).

## Recipe images

- **Production minimum**: one hero image per recipe, with localized alt text in EN / TR / ES.
- **Storage**: Cloudinary `public_id` only — the DB never stores a full URL. Path convention: `recipes/<en-slug>/hero`, `recipes/<en-slug>/gallery-N`, `recipes/<en-slug>/step-N`.
- **AI-generated** with a brand style guide for visual consistency; no text / logos / watermarks in the image. The Cloudinary path uses the EN slug deliberately (locale-agnostic on the asset side; only `alt` is localized).
- **Manifest + validator**: `content/image-manifest.ts` tracks every planned image (status: `planned` → `generated` → `uploaded` → `approved`). Each entry carries `width`/`height` and an `aspectRatio` token (`16:9`, `4:3`, `1:1`, or `1200x630` for OG) — validated against a per-role allowlist (hero: 16:9/4:3, gallery: 4:3/1:1, step: 4:3, og: 1200x630). Hero is required for production; `gallery-1` and `gallery-2` are tracked but optional. `pnpm images:validate` runs all checks; `IMAGES_STRICT=1` is the hard production gate.
- **Provider abstraction**: switching off Cloudinary later is a helper change, not a DB migration. The schema stores provider-neutral public_ids + dimensions + blurhash.

See **[`IMAGE_WORKFLOW.md`](./IMAGE_WORKFLOW.md)** for the full workflow: Cloudinary `public_id` rules, hero/gallery/step/OG roles, AI prompt style guide, alt-text SEO rules, the per-recipe metadata template, and the pre-promotion verification checklist.

## Architecture summary

- **Routing**: `[locale]` segment with next-intl. `(shell)` route group wraps pages with header/footer/MobileBottomNav; cook mode and print pages sit outside the group for chromeless layouts.
- **Data flow**: RSC page → typed loader in `src/lib/api/*` → Prisma → translation tables. Public APIs at `/api/v1/*` (versioned, lowercase enums, single error envelope) are Flutter-ready.
- **Storage abstractions**: localStorage namespace `tcd:*` for v1 saves / prefs / resume points / timers / shopping list; hooks return v2-compatible shapes so swapping to a real backend is a one-call change.
- **JSON-LD**: Recipe + FAQPage + BreadcrumbList on every recipe detail page.

See **[`ARCHITECTURE.md`](./ARCHITECTURE.md)** for the full breakdown and **[`DEVELOPER_GUIDE.md`](./DEVELOPER_GUIDE.md)** for "how do I add X?" recipes.

## Operations

- **Health check**: `GET /api/v1/health` — `{ status, db, rateLimitStore, timestamp, uptimeSeconds, memory:{rssMb,heapUsedMb,heapTotalMb}, environment, commit, version, requestId }`. 503 when DB ping fails or (in production) when running on memory-store rate limiting.
- **Sitemap**: `/sitemap.xml` — 22 URLs with hreflang per locale.
- **Robots**: `/robots.txt` — Disallow on `/api/`, `/search`, `/saved`, `/profile`, `/plan`, `/print/`, `/recipes/*/cook`, `/design`.
- **Rate limits** (Redis when configured, MemoryStore fallback):
  - `POST /api/v1/newsletter` — 5 req / 60s / IP
  - `GET /api/v1/search` — 30 req / 60s / IP
  - `GET /api/v1/recipes/[slug]` — 120 req / 60s / IP
- **Request correlation**: every `/api/v1/*` response carries an `x-request-id` header. Errors also include the same id at `error.requestId` in the body. Logs include the id under `requestId` for trace lookups.
- **Error envelope** for every `/api/v1/*` route:
  ```json
  { "error": { "code": "RATE_LIMITED", "message": "...", "details": {}, "requestId": "..." } }
  ```

## Debugging via request id

When a user reports an error, the response payload (or response header `x-request-id`) carries a uuid that ties together:
1. The structured log line in your platform's log viewer (search `requestId=<uuid>` or for the `req=<first-8>` prefix in dev).
2. The Sentry event (look up by tag / extra `requestId`).
3. The 429 / 4xx / 5xx response the user saw.

This is the primary tool for "what happened on request X?" investigations.

## Deployment

See **[`RELEASE_CHECKLIST.md`](./RELEASE_CHECKLIST.md)** for the full pre-prod walk: env vars, migrate/seed, staging smoke, Lighthouse, Rich Results, sign-off gate.

## Sentry setup

**Minimum (just capture errors)**:
1. Create a Sentry project (Next.js platform), copy the DSN.
2. Set `SENTRY_DSN` (server) and `NEXT_PUBLIC_SENTRY_DSN` (client) in your hosting platform.
3. The app captures server errors via `instrumentation.onRequestError`, unhandled exceptions, and React render errors via `app/global-error.tsx`. No app crash if either DSN is missing.

**Full (release tagging + source map upload)**:
4. In Sentry, create an internal integration with `project:write` and copy the auth token.
5. Set `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT` in your CI/build environment (NOT in committed `.env` files).
6. Set `NEXT_PUBLIC_APP_VERSION` to your deploy SHA / tag (or rely on auto-detection from `VERCEL_GIT_COMMIT_SHA` / `APP_COMMIT_SHA`).
7. `pnpm build` will now wrap with `withSentryConfig`, upload source maps to Sentry, and delete them from the public bundle. Builds without the auth token simply skip the upload — local dev never breaks.
8. Set `SENTRY_ENV` / `NEXT_PUBLIC_SENTRY_ENV` (e.g. `staging` / `production`) to separate environments in Sentry.

## Analytics consent (KVKK / GDPR)

GA4 never loads on first paint. The flow:
1. On first visit, `ConsentBanner` (a `role="dialog"` card) shows "Accept analytics" / "Reject" buttons in the user's locale (EN/TR/ES).
2. Choice persists to `localStorage.tcd:consent = { analytics, decidedAt, version: 1 }`.
3. `<GoogleAnalytics />` only renders gtag scripts when `analytics === true`. Reject keeps GA disabled.
4. Footer carries a "Privacy settings" / "Gizlilik ayarları" / "Privacidad" button (`PrivacySettingsLink`) that clears `tcd:consent`, re-opening the banner so users can flip the choice any time.

If `NEXT_PUBLIC_GA_ID` is unset, the banner and link are both hidden — there's nothing to consent to.
