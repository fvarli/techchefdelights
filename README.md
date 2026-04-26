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
| `NEXT_PUBLIC_GA_ID` | optional | Google Analytics 4 ID. Loads only when set AND `NODE_ENV=production`. |
| `SENTRY_DSN` | optional | Sentry server DSN. Init is a no-op when unset. |
| `NEXT_PUBLIC_SENTRY_DSN` | optional | Sentry client DSN. |
| `SENTRY_ENV` / `NEXT_PUBLIC_SENTRY_ENV` | optional | Override Sentry environment tag. |
| `NEXT_PUBLIC_APP_VERSION` | optional | Surfaced by `/api/v1/health`. |
| `CLOUDINARY_CLOUD_NAME` | deferred | Required when real images replace placeholders. |
| `CLOUDINARY_API_KEY` | deferred | Same. |
| `CLOUDINARY_API_SECRET` | deferred | Same. |

## Architecture summary

- **Routing**: `[locale]` segment with next-intl. `(shell)` route group wraps pages with header/footer/MobileBottomNav; cook mode and print pages sit outside the group for chromeless layouts.
- **Data flow**: RSC page → typed loader in `src/lib/api/*` → Prisma → translation tables. Public APIs at `/api/v1/*` (versioned, lowercase enums, single error envelope) are Flutter-ready.
- **Storage abstractions**: localStorage namespace `tcd:*` for v1 saves / prefs / resume points / timers / shopping list; hooks return v2-compatible shapes so swapping to a real backend is a one-call change.
- **JSON-LD**: Recipe + FAQPage + BreadcrumbList on every recipe detail page.

See **[`ARCHITECTURE.md`](./ARCHITECTURE.md)** for the full breakdown and **[`DEVELOPER_GUIDE.md`](./DEVELOPER_GUIDE.md)** for "how do I add X?" recipes.

## Operations

- **Health check**: `GET /api/v1/health` returns `{ status, db, timestamp, version }`. Returns 503 when DB ping fails.
- **Sitemap**: `/sitemap.xml` — 22 URLs with hreflang per locale.
- **Robots**: `/robots.txt` — Disallow on `/api/`, `/search`, `/saved`, `/profile`, `/plan`, `/print/`, `/r/*/cook`, `/design`.
- **Rate limits** (in-memory IP-based, swappable to Redis later):
  - `POST /api/v1/newsletter` — 5 req / 60s
  - `GET /api/v1/search` — 30 req / 60s
- **Error envelope** for every `/api/v1/*` route:
  ```json
  { "error": { "code": "RATE_LIMITED", "message": "...", "details": {} } }
  ```

## Deployment

See **[`RELEASE_CHECKLIST.md`](./RELEASE_CHECKLIST.md)** for the full pre-prod walk: env vars, migrate/seed, staging smoke, Lighthouse, Rich Results, sign-off gate.

## Sentry setup (optional)

1. Create a Sentry project (Next.js platform).
2. Copy the DSN.
3. Set `SENTRY_DSN` (server) and `NEXT_PUBLIC_SENTRY_DSN` (client) in your hosting platform.
4. Optionally set `SENTRY_ENV` / `NEXT_PUBLIC_SENTRY_ENV` to override the environment tag (defaults to `NODE_ENV`).
5. The app captures: server errors via the Next.js `instrumentation.onRequestError` hook, unhandled exceptions, and React render errors via `app/global-error.tsx`. No app crash if either DSN is missing.
6. Source-map upload is **not** wired (skipped to avoid CI complexity). To enable, wrap `next.config.ts` with `withSentryConfig` per the `@sentry/nextjs` docs.
