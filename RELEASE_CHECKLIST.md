# Release Checklist

Single source of truth for shipping `techchefdelights.com`. Work top-to-bottom; do not skip the production gate.

## 1. Environment variables

Required in the deployment platform (Vercel / Railway / self-host):

| Var | Value | Notes |
|---|---|---|
| `DATABASE_URL` | `postgresql://USER:PASS@HOST:5432/DB?sslmode=require` | Pick provider: Neon, Vercel Postgres, Railway, self-hosted. Pgbouncer/transaction-mode is fine — Prisma 7 + adapter-pg handles it. |
| `NEXT_PUBLIC_BASE_URL` | `https://techchefdelights.com` | Used by sitemap, robots, JSON-LD, OpenGraph. **No trailing slash.** |
| `NEXT_PUBLIC_GA_ID` | `G-XXXXXXXXXX` (optional) | GA4 property ID. Loads only when set AND `NODE_ENV=production`. Skip for staging. |
| `SENTRY_DSN` | (optional) | Server-side DSN. App is a no-op when unset. |
| `NEXT_PUBLIC_SENTRY_DSN` | (optional) | Client-side DSN. Captures React render errors via `app/global-error.tsx`. |
| `SENTRY_ENV` / `NEXT_PUBLIC_SENTRY_ENV` | `staging` / `production` | Override Sentry environment tag (defaults to `NODE_ENV`). |
| `NEXT_PUBLIC_APP_VERSION` | git short SHA or release tag | Surfaced by `/api/v1/health`. |
| `CLOUDINARY_CLOUD_NAME` | (deferred) | Required only when real recipe images replace seed placeholders. |
| `CLOUDINARY_API_KEY` | (deferred) | Same. |
| `CLOUDINARY_API_SECRET` | (deferred) | Same. |

## 2. Database — migrate + seed

Run **once per environment** before the first request:

```bash
pnpm prisma migrate deploy   # applies all migrations including FTS triggers
pnpm prisma db seed          # 8 recipes × 3 locales + categories/tags/allergens/diets/cuisines/equipment + placeholder reviews
```

Re-run `migrate deploy` on every deploy that ships a new migration. **Never** run `migrate dev` against production.

Verify:
```bash
psql "$DATABASE_URL" -c 'SELECT COUNT(*) FROM "Recipe" WHERE "isDraft" = false;'  # expect 8
psql "$DATABASE_URL" -c "SELECT to_regprocedure('public.tcd_locale_to_regconfig(text)');"  # expect non-null
```

## 3. Staging smoke

Deploy to a staging URL first. Run on the live staging hostname:

- [ ] `/` (EN), `/tr`, `/es` return 200 with localized H1
- [ ] `/r/red-lentil-soup` (EN), `/tr/r/mercimek-corbasi`, `/es/r/sopa-lentejas-rojas` render full recipe + JSON-LD
- [ ] `/r/red-lentil-soup/cook` enters chromeless cook mode; arrow-key navigation advances steps; timer starts/pauses
- [ ] `/recipes` paginates; `?cuisine=turkish`, `?diet=vegetarian`, `?skill=beginner`, `?maxMinutes=30` filter
- [ ] `/c/desserts`, `/tr/c/tatlilar`, `/es/c/postres` resolve via per-locale slug; cross-locale slugs 404
- [ ] `/d/vegetarian` × 3 locales (shared slug)
- [ ] `/search?q=lentil` (EN), `/tr/search?q=mercimek`, `/es/search?q=lentejas` each return 1 result
- [ ] `/saved`, `/profile`, `/plan` render with localized labels (private; `noindex,nofollow`)
- [ ] `/print/red-lentil-soup` renders BareShell (no header/footer/MobileBottomNav); `@media print` styles apply when printed
- [ ] `/en` → 307 → `/`; `/en/r/<slug>` → 307 → `/r/<slug>`
- [ ] `/sitemap.xml` returns 22 URLs × 3 hreflang each (= 66 alternate links)
- [ ] `/robots.txt` lists Disallow for `/api/`, `/search`, `/saved`, `/profile`, `/plan`, `/print/`, `/design`, `/r/*/cook` for all locales
- [ ] Mobile viewport (390 × 844): MobileBottomNav visible at home, hidden in cook mode; Sticky cook CTA appears on recipe detail
- [ ] Cross-tab sync: save a recipe in tab A, open tab B at `/saved` — appears after focus
- [ ] `GET /api/v1/health` returns `{"status":"ok","db":"ok",...}` with 200
- [ ] `GET /api/v1/search?q=lentil` returns 200 with the recipe
- [ ] `GET /api/v1/search` (missing q) returns 400 with `INVALID_QUERY`
- [ ] `GET /api/v1/search?q=$(printf 'a%.0s' {1..201})` returns 400 (over-200 cap)
- [ ] **Rate limit**: 6 rapid `POST /api/v1/newsletter` from same IP — 6th returns 429 with `Retry-After` header and `RATE_LIMITED` envelope
- [ ] **Security headers** on `/`: X-Frame-Options=SAMEORIGIN, X-Content-Type-Options=nosniff, Referrer-Policy=strict-origin-when-cross-origin, Permissions-Policy set, Strict-Transport-Security on production HTTPS

## 4. Observability

### Analytics (Google Analytics 4)

- [ ] `NEXT_PUBLIC_GA_ID` set in production only (not staging)
- [ ] View page source on a public route — `gtag` script tag present
- [ ] First page load: GA4 real-time view shows the request, no `gtag` errors in DevTools console
- [ ] LCP not regressed (script is `afterInteractive`, should not block)
- [ ] **Do not** set `NEXT_PUBLIC_GA_ID` in development — verified by `pnpm dev` showing zero gtag scripts

### Sentry (optional but recommended for production)

- [ ] `SENTRY_DSN` and `NEXT_PUBLIC_SENTRY_DSN` set in production
- [ ] `SENTRY_ENV=production` and `NEXT_PUBLIC_SENTRY_ENV=production`
- [ ] Trigger a test error: hit `https://staging.../api/v1/recipes/__force-error__` (or briefly throw in a route) — event appears in Sentry within 30s
- [ ] React render error: temporarily throw in a client component — `app/global-error.tsx` renders the recovery UI, event appears in Sentry
- [ ] Confirm `tracesSampleRate: 0.1` is acceptable for free-tier quota; tune as needed
- [ ] **Source maps**: not auto-uploaded by default. To enable, wrap `next.config.ts` with `withSentryConfig` per `@sentry/nextjs` docs.

### Logging verification

Tail the application logs (your hosting platform's log viewer or `docker logs`) and confirm:
- [ ] `pnpm start` (production mode) emits **structured JSON** lines, one record per line
- [ ] Each record has `level`, `message`, `timestamp`, optional `route`/`method`/`ip`/`userAgent`/`context`
- [ ] **No PII**: grep logs for emails, IPs of users you know, raw request bodies — none should appear
- [ ] **No secrets**: grep for `Bearer`, `cookie`, `authorization`, `password` — none present
- [ ] Audit events fire on the right edges:
  - `newsletter.signup` on POST success (status: created | duplicate)
  - `newsletter.rate_limited` on 429
  - `search.query` on each search (logs only `qLength`, never the query text)
  - `search.rate_limited` on 429
  - `recipes.get_failed` / `search.failed` / `health.db_check_failed` on errors

### Rate limit expectations

- **In-memory only**. Counters reset on restart and don't share across instances.
- **OK for single-instance** deploys (Vercel hobby, Railway single replica).
- **For multi-instance**: swap `MemoryStore` in `src/lib/rate-limit.ts` with a Redis/Upstash implementation that satisfies `RateLimitStore`. No call-site changes needed.
- **Behavior**:
  - `POST /api/v1/newsletter` — 5 req / 60s per IP
  - `GET /api/v1/search` — 30 req / 60s per IP
  - 429 response includes `Retry-After` header with seconds-until-reset

### Health check

- `GET /api/v1/health` — public, no auth, no rate limit. Pings the DB with `SELECT 1`.
- Configure your hosting platform's healthcheck to hit this every 30s.
- Returns 200 when DB is up, 503 when DB ping fails.
- Response: `{ status, db, timestamp, version }`. `version` comes from `NEXT_PUBLIC_APP_VERSION` env (typically the deploy SHA).

## 5. Lighthouse

Run against staging URL with a clean Chrome instance:

```bash
pnpm exec lhci autorun \
  --collect.url=https://staging.techchefdelights.com/ \
  --collect.url=https://staging.techchefdelights.com/r/red-lentil-soup \
  --collect.url=https://staging.techchefdelights.com/recipes \
  --collect.url=https://staging.techchefdelights.com/r/red-lentil-soup/cook
```

**Required minimums** (mobile + desktop):
- Performance ≥ 90
- Accessibility ≥ 90
- Best Practices ≥ 90
- SEO ≥ 90

Investigate any LCP > 2.5s (4G), CLS > 0.05, or TBT > 200ms before promoting.

## 6. Rich Results

For each of the three locales, validate at https://search.google.com/test/rich-results :

- `https://staging.techchefdelights.com/r/red-lentil-soup` → expect `Recipe`, `FAQPage`, `BreadcrumbList`, `Review` (placeholder data)
- `https://staging.techchefdelights.com/tr/r/mercimek-corbasi` → same set
- `https://staging.techchefdelights.com/es/r/sopa-lentejas-rojas` → same set

All four schema types must show "Valid items detected" with zero errors.

## 7. Cross-browser smoke (manual, 5 minutes)

On staging, with the staging hostname in the URL bar:

- Chrome (latest, Win/Mac)
- Safari (latest macOS + iOS 16+)
- Firefox (latest)
- Edge (latest)
- Android Chrome (latest)

Walk: `/` → search → `/r/<slug>` → save → `/saved` → cook → timer → exit → resume.

## 8. Production sign-off gate

**Do not deploy to production until every box above is ticked.** When ready:

- [ ] Stakeholder approval recorded (note who, when)
- [ ] Staging soak ≥ 24 hours with no error rate above baseline
- [ ] DNS cutover plan documented (current TTL, rollback target)
- [ ] On-call assigned for the deploy window
- [ ] Rollback plan: previous build in the platform's deploy history is one click away

Promote staging → production via the platform's UI. Re-run §3 (staging smoke) against the production hostname immediately after promote, then `§5 Rich Results` against production URLs.

## 9. Post-launch

- [ ] Submit `https://techchefdelights.com/sitemap.xml` to Google Search Console
- [ ] Submit same to Bing Webmaster Tools
- [ ] Verify `/robots.txt` is reachable and parsed correctly in GSC
- [ ] Set up Sentry release with source maps when DSN is configured
- [ ] Schedule a weekly check on Search Console for crawl errors during the first month
