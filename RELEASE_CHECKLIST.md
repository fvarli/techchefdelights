# Release Checklist

Single source of truth for shipping `techchefdelights.com`. Work top-to-bottom; do not skip the production gate.

## 1. Environment variables

Required in the deployment platform (Vercel / Railway / self-host):

| Var | Value | Notes |
|---|---|---|
| `DATABASE_URL` | `postgresql://USER:PASS@HOST:5432/DB?sslmode=require` | Pick provider: Neon, Vercel Postgres, Railway, self-hosted. Pgbouncer/transaction-mode is fine — Prisma 7 + adapter-pg handles it. |
| `NEXT_PUBLIC_BASE_URL` | `https://techchefdelights.com` | Used by sitemap, robots, JSON-LD, OpenGraph. **No trailing slash.** |
| `CLOUDINARY_CLOUD_NAME` | (deferred) | Required only when real recipe images replace seed placeholders. |
| `CLOUDINARY_API_KEY` | (deferred) | Same. |
| `CLOUDINARY_API_SECRET` | (deferred) | Same. |
| `SENTRY_DSN` | (deferred) | Optional — observability rolls in post-launch. |

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

## 4. Lighthouse

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

## 5. Rich Results

For each of the three locales, validate at https://search.google.com/test/rich-results :

- `https://staging.techchefdelights.com/r/red-lentil-soup` → expect `Recipe`, `FAQPage`, `BreadcrumbList`, `Review` (placeholder data)
- `https://staging.techchefdelights.com/tr/r/mercimek-corbasi` → same set
- `https://staging.techchefdelights.com/es/r/sopa-lentejas-rojas` → same set

All four schema types must show "Valid items detected" with zero errors.

## 6. Cross-browser smoke (manual, 5 minutes)

On staging, with the staging hostname in the URL bar:

- Chrome (latest, Win/Mac)
- Safari (latest macOS + iOS 16+)
- Firefox (latest)
- Edge (latest)
- Android Chrome (latest)

Walk: `/` → search → `/r/<slug>` → save → `/saved` → cook → timer → exit → resume.

## 7. Production sign-off gate

**Do not deploy to production until every box above is ticked.** When ready:

- [ ] Stakeholder approval recorded (note who, when)
- [ ] Staging soak ≥ 24 hours with no error rate above baseline
- [ ] DNS cutover plan documented (current TTL, rollback target)
- [ ] On-call assigned for the deploy window
- [ ] Rollback plan: previous build in the platform's deploy history is one click away

Promote staging → production via the platform's UI. Re-run §3 (staging smoke) against the production hostname immediately after promote, then `§5 Rich Results` against production URLs.

## 8. Post-launch

- [ ] Submit `https://techchefdelights.com/sitemap.xml` to Google Search Console
- [ ] Submit same to Bing Webmaster Tools
- [ ] Verify `/robots.txt` is reachable and parsed correctly in GSC
- [ ] Set up Sentry release with source maps when DSN is configured
- [ ] Schedule a weekly check on Search Console for crawl errors during the first month
