# Release Checklist

Single source of truth for shipping `techchefdelights.com`. Work top-to-bottom; do not skip the production gate.

## 1. Environment variables

Required in the deployment platform (Vercel / Railway / self-host):

| Var | Value | Notes |
|---|---|---|
| `DATABASE_URL` | `postgresql://USER:PASS@HOST:5432/DB?sslmode=require` | Pick provider. Pgbouncer/transaction-mode is fine — Prisma 7 + adapter-pg handles it. |
| `NEXT_PUBLIC_BASE_URL` | `https://techchefdelights.com` | Used by sitemap, robots, JSON-LD, OpenGraph. **No trailing slash.** |
| `NEXT_PUBLIC_GA_ID` | `G-XXXXXXXXXX` (optional) | GA4 ID. Loads only when set + `NODE_ENV=production` + user has accepted consent. Skip for staging. |
| `SENTRY_DSN` | optional | Server-side DSN. App is a no-op when unset. |
| `NEXT_PUBLIC_SENTRY_DSN` | optional | Client-side DSN. Captures React render errors via `app/global-error.tsx`. |
| `SENTRY_AUTH_TOKEN` | **CI/prod required for source maps** | Internal-integration auth token. Without it, `withSentryConfig` is skipped and Sentry events won't bind to source maps. |
| `SENTRY_ORG` | required for source maps | Sentry org slug. |
| `SENTRY_PROJECT` | required for source maps | Sentry project slug. |
| `SENTRY_ENV` / `NEXT_PUBLIC_SENTRY_ENV` | `staging` / `production` | Override Sentry environment tag. |
| `NEXT_PUBLIC_APP_VERSION` | git short SHA or release tag | Release id for Sentry + `version` in `/api/v1/health`. |
| `VERCEL_GIT_COMMIT_SHA` | auto-set on Vercel | Used for `commit` field in `/api/v1/health` and as a release fallback. |
| `APP_COMMIT_SHA` | optional | CI fallback for non-Vercel deploys. |
| `REDIS_URL` | **prod (self-hosted) required** | Standard Redis URL for distributed rate limiting via ioredis. `redis://host:6379` (or `rediss://` for TLS). Best fit for VPS / self-hosted deploys. **Without a Redis backend the app uses MemoryStore — fine for local dev, broken for any multi-instance prod.** |
| `UPSTASH_REDIS_REST_URL` | prod (serverless) required if no `REDIS_URL` | Upstash REST URL. Used only when `REDIS_URL` is unset. Best fit for Vercel / Cloudflare / other serverless platforms that can't hold TCP sockets. |
| `UPSTASH_REDIS_REST_TOKEN` | required when Upstash URL is set | Upstash REST token. |
| `CLOUDINARY_CLOUD_NAME` | deferred | Required when real recipe images replace seed placeholders. |
| `CLOUDINARY_API_KEY` | deferred | Same. |
| `CLOUDINARY_API_SECRET` | deferred | Same. |

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
psql "$DATABASE_URL" -c 'SELECT COUNT(*) FROM "RecipeTranslation";'               # expect 24
psql "$DATABASE_URL" -c 'SELECT COUNT(*) FROM "Ingredient";'                       # expect 82 (current seed)
psql "$DATABASE_URL" -c 'SELECT COUNT(*) FROM "IngredientMaster";'                 # expect 63
psql "$DATABASE_URL" -c 'SELECT COUNT(*) FROM "IngredientMasterTranslation";'      # expect 189 (63 × 3 locales)
psql "$DATABASE_URL" -c 'SELECT COUNT(*) FROM "Ingredient" WHERE "masterId" IS NOT NULL;'  # expect 82 (every row linked)
psql "$DATABASE_URL" -c 'SELECT COUNT(*) FROM "RecipeEquipment";'                              # expect 27 (current seed)
psql "$DATABASE_URL" -c 'SELECT COUNT(*) FROM "RecipeEquipment" WHERE NOT required;'           # expect 7 (optional rows)
psql "$DATABASE_URL" -c 'SELECT COUNT(*) FROM "RecipeEquipment" WHERE note IS NOT NULL;'       # expect 18 (rows with caveat note)
psql "$DATABASE_URL" -c "SELECT to_regprocedure('public.tcd_locale_to_regconfig(text)');"  # expect non-null
```

## 3. Staging smoke

Deploy to a staging URL first. Run on the live staging hostname:

- [ ] `/` (EN), `/tr`, `/es` return 200 with localized H1
- [ ] `/recipes/red-lentil-soup` (EN), `/tr/tarifler/mercimek-corbasi`, `/es/recetas/sopa-lentejas-rojas` render full recipe + JSON-LD
- [ ] `/recipes/red-lentil-soup/cook` enters chromeless cook mode; arrow-key navigation advances steps; timer starts/pauses
- [ ] `/recipes` paginates; `?cuisine=turkish`, `?diet=vegetarian`, `?skill=beginner`, `?maxMinutes=30` filter
- [ ] `/categories/desserts`, `/tr/kategoriler/tatlilar`, `/es/categorias/postres` resolve via per-locale slug; cross-locale slugs 404
- [ ] `/diets/vegetarian` × 3 locales (shared slug)
- [ ] `/search?q=lentil` (EN), `/tr/search?q=mercimek`, `/es/search?q=lentejas` each return 1 result
- [ ] `/saved`, `/profile`, `/plan` render with localized labels (private; `noindex,nofollow`)
- [ ] `/print/red-lentil-soup` renders BareShell (no header/footer/MobileBottomNav); `@media print` styles apply when printed
- [ ] `/en` → 307 → `/`; `/en/recipes/<slug>` → 307 → `/recipes/<slug>`
- [ ] `/sitemap.xml` returns 22 URLs × 3 hreflang each (= 66 alternate links)
- [ ] `/robots.txt` lists Disallow for `/api/`, `/search`, `/saved`, `/profile`, `/plan`, `/print/`, `/design`, `/recipes/*/cook` for all locales
- [ ] Mobile viewport (390 × 844): MobileBottomNav visible at home, hidden in cook mode; Sticky cook CTA appears on recipe detail
- [ ] Cross-tab sync: save a recipe in tab A, open tab B at `/saved` — appears after focus
- [ ] `GET /api/v1/health` returns `{"status":"ok","db":"ok",...}` with 200
- [ ] `GET /api/v1/search?q=lentil` returns 200 with the recipe
- [ ] `GET /api/v1/search` (missing q) returns 400 with `INVALID_QUERY`
- [ ] `GET /api/v1/search?q=$(printf 'a%.0s' {1..201})` returns 400 (over-200 cap)
- [ ] **Rate limit**: 6 rapid `POST /api/v1/newsletter` from same IP — 6th returns 429 with `Retry-After` header and `RATE_LIMITED` envelope
- [ ] **Security headers** on `/`: X-Frame-Options=SAMEORIGIN, X-Content-Type-Options=nosniff, Referrer-Policy=strict-origin-when-cross-origin, Permissions-Policy set, Strict-Transport-Security on production HTTPS

## 4. Observability

### Analytics (Google Analytics 4) + consent

- [ ] `NEXT_PUBLIC_GA_ID` set in production only (not staging)
- [ ] First load: ConsentBanner appears with EN/TR/ES copy depending on `<html lang>`
- [ ] Click **Reject** → `localStorage.tcd:consent.analytics === false`. View page source — **zero** `googletagmanager.com` script tags. GA4 real-time shows no event.
- [ ] Click **Accept** → `localStorage.tcd:consent.analytics === true`. `gtag/js` script loads. GA4 real-time shows the page view within ~30s.
- [ ] Click footer **Privacy settings** → banner reopens, choice can be flipped
- [ ] LCP not regressed (script is `afterInteractive`, lazy, gated)
- [ ] Confirm `pnpm dev` (NODE_ENV=development) loads zero gtag scripts even with `NEXT_PUBLIC_GA_ID` set

### Sentry — server + client + source maps

**Minimum (capture errors only):**
- [ ] `SENTRY_DSN` and `NEXT_PUBLIC_SENTRY_DSN` set in production
- [ ] `SENTRY_ENV=production` and `NEXT_PUBLIC_SENTRY_ENV=production`
- [ ] Server error test: hit a 500-throwing route — event appears in Sentry within 30s with `requestId` tag/extra
- [ ] Client error test: temporarily throw in a client component — `app/global-error.tsx` renders the recovery UI, event appears in Sentry

**Full (release tagging + source maps):**
- [ ] `SENTRY_AUTH_TOKEN` set in CI/build env (not in committed `.env`)
- [ ] `SENTRY_ORG` and `SENTRY_PROJECT` set in CI/build env
- [ ] `NEXT_PUBLIC_APP_VERSION` set to the deploy SHA / tag
- [ ] CI build log shows Sentry source map upload (look for `Successfully uploaded source maps`)
- [ ] Open DevTools network on production; confirm `.js.map` files return 404 (deleted from public output by `deleteSourcemapsAfterUpload: true`)
- [ ] Trigger a test error; in Sentry the stack trace shows original TypeScript file/line, not minified output
- [ ] Test build WITHOUT `SENTRY_AUTH_TOKEN`: `pnpm build` still succeeds (`withSentryConfig` is skipped)

### Request correlation

- [ ] Every `/api/v1/*` 200 response carries `x-request-id` header
- [ ] `/api/v1/health` body.requestId matches the response header
- [ ] Trigger a 4xx/5xx; the response body's `error.requestId` matches the response header
- [ ] Logs include the same `requestId` field — grep one error's id and find the matching log line
- [ ] If you proxy via Cloudflare / a load balancer that adds an upstream `x-request-id`, verify it's preserved (curl with `-H 'x-request-id: trace-test-abc'` echoes it back)

### Logging verification

Tail the application logs (hosting platform's log viewer or `docker logs`) and confirm:
- [ ] `pnpm start` (production mode) emits **structured JSON** lines, one record per line
- [ ] Each record has `level`, `message`, `timestamp`, `requestId`, optional `route`/`method`/`ip`/`userAgent`/`context`
- [ ] **No PII**: grep for emails, IPs of users you know, raw request bodies — none should appear
- [ ] **No secrets**: grep for `Bearer`, `cookie`, `authorization`, `password`, `SENTRY_AUTH_TOKEN`, `UPSTASH_REDIS_REST_TOKEN` — none present
- [ ] **At startup** in production with no Upstash env: a single `rateLimit.fallback_memory_store` warn record is emitted. This is a real signal — fix it for multi-instance deploys.
- [ ] Audit events fire on the right edges:
  - `newsletter.signup` on POST success (status: created | duplicate)
  - `newsletter.rate_limited` on 429
  - `search.query` on each search (logs only `qLength`, never the query text)
  - `search.rate_limited` on 429
  - `recipes.rate_limited` on 429
  - `recipes.get_failed` / `search.failed` / `health.db_check_failed` on errors

### Rate limit expectations

- **Backend selected at startup, in priority order**:
  1. `REDIS_URL` → ioredis (standard Redis). **Self-hosted production target.**
  2. `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` → Upstash REST. **Serverless production target.**
  3. Neither → in-process MemoryStore. **Local dev only.**
- **MemoryStore** is per-process and resets on restart. **Single-instance only.**
- **Health endpoint** reports `rateLimitStore: 'redis' | 'upstash' | 'memory'`. In production, `'memory'` flips `status` to `degraded`.
- **Self-hosted setup**: install Redis on the VPS (`apt install redis-server` or Docker), then set `REDIS_URL=redis://127.0.0.1:6379`. Verify with `/api/v1/health` showing `rateLimitStore: "redis"`.
- **Quotas (per IP)**:
  - `POST /api/v1/newsletter` — 5 req / 60s
  - `GET /api/v1/search` — 30 req / 60s
  - `GET /api/v1/recipes/[slug]` — 120 req / 60s
- 429 responses carry `Retry-After`, `x-request-id`, and `error.requestId`.

### Content Security Policy

- [ ] `curl -I /` shows `Content-Security-Policy` header with the expected directive set (default-src 'self', img-src includes Cloudinary, connect-src includes GA + Sentry ingest, etc.)
- [ ] In production, the header includes `upgrade-insecure-requests`
- [ ] Browser DevTools console clean of CSP violations on `/`, `/recipes/<slug>`, `/recipes`, `/recipes/<slug>/cook`
- [ ] After accepting consent, GA scripts load without CSP violations
- [ ] Cloudinary image domain reachable when real images are wired (`https://res.cloudinary.com/...`)
- [ ] **Known**: `'unsafe-inline'` for script-src and style-src is a temporary Next.js compatibility allowance. Nonce-based hardening tracked as follow-up.

### Health endpoint

`GET /api/v1/health` — public, no auth, no rate limit. Run a `SELECT 1` Prisma ping.

Response shape:
```json
{
  "status": "ok" | "degraded",
  "db": "ok" | "error",
  "rateLimitStore": "redis" | "memory",
  "timestamp": "ISO-8601",
  "uptimeSeconds": 1234,
  "memory": { "rssMb": 0, "heapUsedMb": 0, "heapTotalMb": 0 },
  "environment": "production" | ...,
  "commit": "<short-sha>",
  "version": "<release-id>",
  "requestId": "<uuid>"
}
```

- [ ] Configure your hosting platform's healthcheck to hit this every 30s
- [ ] Returns 200 only when `db === 'ok'` AND (in production) `rateLimitStore === 'redis'`. Otherwise 503.
- [ ] No secrets in body — grep response for `SENTRY`, `UPSTASH`, `DATABASE_URL`. None present.

## 5. Lighthouse

Run against staging URL with a clean Chrome instance:

```bash
pnpm exec lhci autorun \
  --collect.url=https://staging.techchefdelights.com/ \
  --collect.url=https://staging.techchefdelights.com/recipes/red-lentil-soup \
  --collect.url=https://staging.techchefdelights.com/recipes \
  --collect.url=https://staging.techchefdelights.com/recipes/red-lentil-soup/cook
```

**Required minimums** (mobile + desktop):
- Performance ≥ 90
- Accessibility ≥ 90
- Best Practices ≥ 90
- SEO ≥ 90

Investigate any LCP > 2.5s (4G), CLS > 0.05, or TBT > 200ms before promoting.

## 6. Rich Results

For each of the three locales, validate at https://search.google.com/test/rich-results :

- `https://staging.techchefdelights.com/recipes/red-lentil-soup` → expect `Recipe`, `FAQPage`, `BreadcrumbList`, `Review` (placeholder data)
- `https://staging.techchefdelights.com/tr/tarifler/mercimek-corbasi` → same set
- `https://staging.techchefdelights.com/es/recetas/sopa-lentejas-rojas` → same set

All four schema types must show "Valid items detected" with zero errors.

## 6b. Recipe images (production minimum)

Every recipe **published to production** (`Recipe.isDraft = false`) must have:

- [ ] One Cloudinary asset at `recipes/<en-slug>/hero` (full canonical convention; **not** a `tcd/seed/...` placeholder)
- [ ] `Recipe.heroImageCloudinary` matches that path
- [ ] `Recipe.heroBlurhash` populated (or accept the no-placeholder fallback for that recipe)
- [ ] Per-locale alt text on the hero in EN / TR / ES (≤ 125 chars each, no keyword stuffing, no "image of" prefix)
- [ ] `width` / `height` columns set to the actual image dimensions (CLS-critical)
- [ ] No text, logo, or watermark visible in the rendered image
- [ ] OG preview check: paste `https://techchefdelights.com/recipes/<slug>` into a real Slack/iMessage/WhatsApp paste — hero image renders, no broken thumbnail

Optional but recommended:
- [ ] At least one gallery image at `recipes/<en-slug>/gallery-1` for the home masonry section
- [ ] One step image per timed step (`recipes/<en-slug>/step-N`) for the cook-mode walkthrough

The full image workflow — Cloudinary `public_id` rules, AI prompt style guide, alt-text SEO, provider portability, future media schema — lives in **[`IMAGE_WORKFLOW.md`](./IMAGE_WORKFLOW.md)**.

DB sanity query before promotion:
```bash
psql "$DATABASE_URL" -c "SELECT COUNT(*) AS recipes_with_seed_hero
  FROM \"Recipe\" WHERE \"isDraft\" = false
  AND \"heroImageCloudinary\" LIKE 'tcd/seed/%';"
# expected: 0  (any non-zero blocks promotion)
```

Manifest + validator gate (must run with Cloudinary env present):
```bash
IMAGES_STRICT=1 pnpm images:validate
# expected: exit 0
# fails on: missing required hero, non-approved hero, placeholder
#   tcd/seed/* prefix, missing alt EN/TR/ES, alt > 125 chars,
#   duplicate publicIds, gallery-N gaps, missing aspectRatio on
#   uploaded/approved images, missing width+height on uploaded/
#   approved images (must be set together), aspectRatio outside
#   the role's allowlist (hero: 16:9 or 4:3, gallery: 4:3 or 1:1,
#   step: 4:3, og: 1200x630), Cloudinary asset missing (when env
#   is configured), seed/manifest hero mismatch.
```

The validator is **read-only** — it never uploads, deletes, renames, or mutates any Cloudinary asset.

## 7. Cross-browser smoke (manual, 5 minutes)

On staging, with the staging hostname in the URL bar:

- Chrome (latest, Win/Mac)
- Safari (latest macOS + iOS 16+)
- Firefox (latest)
- Edge (latest)
- Android Chrome (latest)

Walk: `/` → search → `/recipes/<slug>` → save → `/saved` → cook → timer → exit → resume.

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
