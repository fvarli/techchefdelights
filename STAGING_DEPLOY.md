# Staging Deploy — Self-Hosted Ubuntu

Single source of truth for putting **staging** up on a Ubuntu 24.04 LTS VPS. Walks the full lane: server prep → app deploy → verification → rollback.

**Production is held.** Walk this end-to-end on staging first, then ask for production sign-off.

---

## Required env vars (staging)

| Var | Required | Staging value |
|---|---|---|
| `DATABASE_URL` | yes | `postgresql://tcd_staging:<STRONG_PW>@127.0.0.1:5432/techchefdelights_staging` |
| `REDIS_URL` | yes | `redis://127.0.0.1:6379/1` (DB index 1 isolates from any other Redis use on the box) |
| `NEXT_PUBLIC_BASE_URL` | yes | `https://staging.techchefdelights.com` (no trailing slash) |
| `NODE_ENV` | yes | `production` (Next.js sets this automatically under `pnpm start`) |
| `SENTRY_DSN` | optional | server-side DSN — leave unset to skip Sentry on staging |
| `NEXT_PUBLIC_SENTRY_DSN` | optional | client-side DSN |
| `SENTRY_ENV` / `NEXT_PUBLIC_SENTRY_ENV` | optional | `staging` |
| `SENTRY_AUTH_TOKEN` / `SENTRY_ORG` / `SENTRY_PROJECT` | optional | only set if you want source-map upload from CI; without them `withSentryConfig` is skipped |
| `NEXT_PUBLIC_APP_VERSION` | recommended | git short SHA, e.g. `staging-abc1234` |
| `NEXT_PUBLIC_GA_ID` | **leave UNSET on staging** | GA loads only when this is set + `NODE_ENV=production` + user accepts consent. Skipping it keeps staging out of your analytics property. |
| `CLOUDINARY_*` | deferred | only when real images replace seed placeholders |

Staging-only env vars (not committed):

```bash
# /home/tcd/techchefdelights/.env.production.local  — chmod 600
DATABASE_URL="postgresql://tcd_staging:REPLACE_ME@127.0.0.1:5432/techchefdelights_staging"
REDIS_URL="redis://127.0.0.1:6379/1"
NEXT_PUBLIC_BASE_URL="https://staging.techchefdelights.com"
NEXT_PUBLIC_APP_VERSION="staging-$(git rev-parse --short HEAD)"
# Optional Sentry (recommend disabled on staging until you have separate project):
# SENTRY_DSN=
# NEXT_PUBLIC_SENTRY_DSN=
# SENTRY_ENV=staging
# NEXT_PUBLIC_SENTRY_ENV=staging
```

---

## 1. Server prep — one-time

Run as a sudo-capable user. Replace `tcd` with your service-user name and `REPLACE_ME` with strong passwords.

```bash
# --- system updates ---
sudo apt update
sudo apt upgrade -y

# --- service user ---
sudo adduser --disabled-password --gecos "" tcd
sudo usermod -aG sudo tcd                       # remove later if you don't want this

# --- Node 22 via nodesource ---
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node --version                                  # expect v22.x
sudo corepack enable
corepack prepare pnpm@latest --activate
pnpm --version                                  # expect 9.x or later

# --- PostgreSQL 16 ---
sudo apt install -y postgresql-16
sudo systemctl enable --now postgresql
pg_lsclusters                                   # expect: 16  main  5432  online

# --- Redis ---
sudo apt install -y redis-server
sudo systemctl enable --now redis-server
redis-cli ping                                  # expect: PONG

# --- nginx + certbot for HTTPS ---
sudo apt install -y nginx
sudo apt install -y certbot python3-certbot-nginx

# --- firewall ---
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## 2. Database — create role + DB

```bash
# Create staging role and DB. Use a strong password — keep it in your secret store.
STRONG_PW='REPLACE_ME_strong_random_passphrase'
sudo -u postgres psql <<SQL
CREATE ROLE tcd_staging WITH LOGIN PASSWORD '${STRONG_PW}';
CREATE DATABASE techchefdelights_staging OWNER tcd_staging;
GRANT ALL PRIVILEGES ON DATABASE techchefdelights_staging TO tcd_staging;
SQL

# Verify
PGPASSWORD="$STRONG_PW" psql -h 127.0.0.1 -U tcd_staging -d techchefdelights_staging -c '\conninfo'
```

## 3. App — clone, install, env file

```bash
sudo -iu tcd
mkdir -p /home/tcd/apps && cd /home/tcd/apps
git clone <YOUR_GIT_REMOTE_URL> techchefdelights
cd techchefdelights

pnpm install --frozen-lockfile

# Env file — chmod 600 so only the service user can read it
cat > .env.production.local <<'EOF'
DATABASE_URL="postgresql://tcd_staging:REPLACE_ME@127.0.0.1:5432/techchefdelights_staging"
REDIS_URL="redis://127.0.0.1:6379/1"
NEXT_PUBLIC_BASE_URL="https://staging.techchefdelights.com"
EOF
chmod 600 .env.production.local

# Inject the version
echo "NEXT_PUBLIC_APP_VERSION=staging-$(git rev-parse --short HEAD)" >> .env.production.local
```

## 4. Migrate + seed

```bash
# Schema (includes FTS triggers from migration 20260425191951_search_vectors)
pnpm prisma migrate deploy

# Seed: 8 recipes × 3 locales + categories/tags/diets/cuisines/equipment + placeholder reviews
pnpm prisma db seed

# Sanity check
PGPASSWORD="$STRONG_PW" psql -h 127.0.0.1 -U tcd_staging -d techchefdelights_staging \
  -c 'SELECT COUNT(*) AS recipes FROM "Recipe" WHERE "isDraft" = false;' \
  -c 'SELECT COUNT(*) AS recipe_translations FROM "RecipeTranslation";' \
  -c 'SELECT COUNT(*) AS reviews FROM "Review";' \
  -c 'SELECT COUNT(*) AS allergen_links FROM "RecipeAllergen";' \
  -c "SELECT to_regprocedure('public.tcd_locale_to_regconfig(text)');"
# expected: 8 recipes, 24 translations, 24 reviews, 112 allergen_links, function present
```

## 5. Build

```bash
pnpm build                                      # turbopack, ~3s compile
```

## 6. Run as a systemd service

```bash
# /etc/systemd/system/techchefdelights.service  (write as root)
sudo tee /etc/systemd/system/techchefdelights.service >/dev/null <<'UNIT'
[Unit]
Description=TechChefDelights Next.js (staging)
After=network.target postgresql.service redis-server.service
Wants=postgresql.service redis-server.service

[Service]
Type=simple
User=tcd
WorkingDirectory=/home/tcd/apps/techchefdelights
EnvironmentFile=/home/tcd/apps/techchefdelights/.env.production.local
ExecStart=/usr/bin/pnpm start
Restart=on-failure
RestartSec=5
# Bind to localhost only — nginx fronts TLS
Environment=PORT=3000
Environment=HOSTNAME=127.0.0.1
# Hardening
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=read-only
ReadWritePaths=/home/tcd/apps/techchefdelights/.next
PrivateTmp=true

[Install]
WantedBy=multi-user.target
UNIT

sudo systemctl daemon-reload
sudo systemctl enable --now techchefdelights
sudo systemctl status techchefdelights --no-pager
```

## 7. nginx reverse proxy + HTTPS

```bash
# /etc/nginx/sites-available/techchefdelights
sudo tee /etc/nginx/sites-available/techchefdelights >/dev/null <<'NGINX'
server {
    listen 80;
    server_name staging.techchefdelights.com;

    location / {
        proxy_pass         http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_set_header   X-Forwarded-Host  $host;
        # Pass upstream request id if your CDN adds one; else Next.js mints one.
        proxy_set_header   X-Request-ID      $request_id;
        proxy_read_timeout 60s;
    }
}
NGINX

sudo ln -sf /etc/nginx/sites-available/techchefdelights /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# DNS prerequisite: point staging.techchefdelights.com A/AAAA at this server FIRST,
# wait for propagation, then issue cert:
sudo certbot --nginx -d staging.techchefdelights.com --redirect --agree-tos -m you@yours.com -n
```

## 8. Health endpoint smoke

```bash
B=https://staging.techchefdelights.com   # or http://127.0.0.1:3000 for in-server check

curl -s $B/api/v1/health | jq
# expected (critical fields):
#   "status": "ok"
#   "db": "ok"
#   "rateLimitStore": "redis"
#   "environment": "production"
#   "version": "staging-<sha>"

curl -i $B/api/v1/health | grep -i x-request-id
# x-request-id matches body.requestId
```

If `rateLimitStore` is `"memory"`, your `REDIS_URL` env isn't visible to the systemd unit — re-check `EnvironmentFile=` path and `chmod 600`.

## 9. Sitemap & robots smoke

```bash
curl -s $B/sitemap.xml | grep -c '<loc>'
# expected: 22

curl -s $B/sitemap.xml | grep -oE '<xhtml:link[^>]+/>' | head -6
# expected: hreflang en/tr/es triplets per entry

curl -s $B/robots.txt | head -25
# expected disallows: /api/, /search, /saved, /profile, /plan, /print/, /design,
# plus per-locale variants for tr/es and /recipes/*/cook for all three
```

## 10. Page smoke (3 locales × 5 routes)

```bash
for path in "/" "/recipes" "/recipes/red-lentil-soup" "/recipes/red-lentil-soup/cook" "/categories/desserts"; do
  echo "--- $path ---"
  for prefix in "" "/tr" "/es"; do
    full="${prefix}${path}"
    # tr / es use locale-specific recipe and category slugs:
    full=${full//\/tr\/r\/red-lentil-soup/\/tr\/r\/mercimek-corbasi}
    full=${full//\/es\/r\/red-lentil-soup/\/es\/r\/sopa-lentejas-rojas}
    full=${full//\/tr\/c\/desserts/\/tr\/c\/tatlilar}
    full=${full//\/es\/c\/desserts/\/es\/c\/postres}
    s=$(curl -s -o /dev/null -w "%{http_code}" "$B$full")
    echo "  $s  $full"
  done
done
```

All 15 should return 200. /en redirects:

```bash
curl -s -o /dev/null -w "%{http_code}->%{redirect_url}\n" $B/en
# 307 -> https://staging.techchefdelights.com/
```

## 11. Security headers smoke

```bash
curl -sI $B/ | grep -iE '^(content-security|x-frame|x-content|referrer|permissions|strict-transport)'
# expected: all six present (HSTS only over HTTPS)
```

## 12. Rate-limit verification

```bash
# 6 rapid newsletter posts from the same IP — limit is 5/60s. Last one must be 429.
for i in 1 2 3 4 5 6; do
  s=$(curl -s -o /dev/null -w "%{http_code}" -X POST $B/api/v1/newsletter \
    -H 'content-type: application/json' \
    -d '{"email":"smoke@staging.example"}')
  echo "  #$i -> $s"
done
# expected: 200 200 200 200 200 429

# 429 envelope shape:
curl -s -X POST $B/api/v1/newsletter -H 'content-type: application/json' \
  -d '{"email":"smoke@staging.example"}' | jq
# expected: { "error": { "code":"RATE_LIMITED", "message":"...",
#             "details":{"retryAfterSec":<n>}, "requestId":"<uuid>" } }
```

## 13. Rich Results validation

For each of the three locales, paste the URL into <https://search.google.com/test/rich-results>:

- `https://staging.techchefdelights.com/recipes/red-lentil-soup`
- `https://staging.techchefdelights.com/tr/tarifler/mercimek-corbasi`
- `https://staging.techchefdelights.com/es/recetas/sopa-lentejas-rojas`

Expect, for each: **Recipe**, **FAQPage**, **BreadcrumbList**, **Review** all show "Valid items detected", zero errors.

If any locale fails, check the JSON-LD blocks in the rendered HTML:
```bash
curl -s $B/recipes/red-lentil-soup | grep -oE '"@type":"[^"]+"' | sort -u
# expected: BreadcrumbList, FAQPage, ListItem, Question, Recipe, Review, Person, AggregateRating, NutritionInformation
```

## 14. Cross-browser sanity (5 minutes, manual)

On staging hostname:
- Chrome (latest)
- Safari (latest macOS + iOS 16+)
- Firefox (latest)
- Edge (latest)
- Android Chrome (latest)

Walk: `/` → search → `/recipes/<slug>` → save → `/saved` → cook → timer → exit → resume.

## 15. Lighthouse (mobile + desktop)

Run from a clean machine (NOT the server):

```bash
pnpm exec lhci autorun \
  --collect.url=https://staging.techchefdelights.com/ \
  --collect.url=https://staging.techchefdelights.com/recipes/red-lentil-soup \
  --collect.url=https://staging.techchefdelights.com/recipes \
  --collect.url=https://staging.techchefdelights.com/recipes/red-lentil-soup/cook
```

Required minimums (mobile + desktop): Performance / A11y / Best Practices / SEO ≥ 90.

---

## Rollback

If staging is broken or you need to revert to a previous build:

### Fast: previous git ref

```bash
sudo -iu tcd
cd /home/tcd/apps/techchefdelights

# 1. find the last known-good ref (commit hash, tag, or branch)
git log --oneline -10

# 2. checkout it
git fetch --all
git checkout <PREVIOUS_GOOD_SHA>

# 3. install + build (lockfile may have changed)
pnpm install --frozen-lockfile
pnpm build

# 4. restart
sudo systemctl restart techchefdelights
sudo systemctl status techchefdelights --no-pager

# 5. verify
curl -s https://staging.techchefdelights.com/api/v1/health | jq
```

### If a migration broke the DB

The schema migrations don't have automatic down scripts. Recovery options:

1. **Undo the bad migration manually**:
   ```bash
   pnpm prisma migrate resolve --rolled-back <MIGRATION_NAME>
   sudo -u postgres psql -d techchefdelights_staging -f rollback.sql
   ```
2. **Restore from backup** (recommended path):
   ```bash
   sudo systemctl stop techchefdelights
   sudo -u postgres psql -d postgres -c 'DROP DATABASE techchefdelights_staging;'
   sudo -u postgres psql -d postgres -c 'CREATE DATABASE techchefdelights_staging OWNER tcd_staging;'
   PGPASSWORD="$STRONG_PW" pg_restore -h 127.0.0.1 -U tcd_staging \
     -d techchefdelights_staging --clean --if-exists /path/to/staging-pre-migration.dump
   sudo systemctl start techchefdelights
   ```

**Take a `pg_dump` before every migrate-deploy.** Hook it in your CD pipeline:
```bash
PGPASSWORD="$STRONG_PW" pg_dump -h 127.0.0.1 -U tcd_staging \
  -d techchefdelights_staging --format=custom \
  --file=/var/backups/tcd/staging-$(date +%Y%m%d-%H%M%S).dump
```

### If the systemd service won't start

```bash
sudo journalctl -u techchefdelights -n 200 --no-pager
sudo systemctl status techchefdelights --no-pager

# Common causes:
#   .env.production.local unreadable -> chmod 600 + chown tcd:tcd
#   port 3000 busy             -> change PORT= in unit, lsof -i :3000
#   Prisma client outdated     -> pnpm prisma generate, restart
#   db unreachable             -> systemctl status postgresql; check pg_hba.conf
```

### If nginx returns 502

```bash
sudo systemctl status techchefdelights --no-pager      # is the upstream up?
curl -i http://127.0.0.1:3000/                          # bypass nginx
sudo nginx -t                                            # config sane?
sudo tail -100 /var/log/nginx/error.log
```

---

## Acceptance gate

Tick all of these before promoting staging → production:

- [ ] All §8–§12 smoke checks pass on the **public staging hostname**
- [ ] Rich Results validator green for all three locales (§13)
- [ ] Cross-browser walk green on Chrome / Safari / Firefox / Edge / Android Chrome (§14)
- [ ] Lighthouse ≥ 90 on all four categories, mobile and desktop (§15)
- [ ] `journalctl -u techchefdelights --since "1 hour ago"` shows zero error-level lines that are actual errors (rate-limit warns are fine; ignore those)
- [ ] At least one full `pg_dump` snapshot taken and stored off-server
- [ ] Stakeholder sign-off recorded

When all ticked, ask for explicit approval before running the production lane.
