# Staging Deploy Walkthrough

Sıralı yürütme rehberi. Detaylı referans için **[`STAGING_DEPLOY.md`](./STAGING_DEPLOY.md)**'ye bak.

> **Kapsam:** `staging.techchefdelights.com` adresine self-hosted Ubuntu VPS deploy.
> **Süre:** ~3 saat aktif çalışma + 24 saat soak.
> **Production henüz yok** — bu rehber tamamen staging içindir; production cutover ayrı.

---

## Faz 0 — Hazırlık (15 dk)

VPS sahibi olduğunu ve DNS'in propagasyonunu yaptığını doğrula.

- [ ] **VPS hazır.** DigitalOcean / Hetzner / Linode — Ubuntu 24.04 LTS droplet, en az 4 GB RAM, 80 GB SSD. (Lunexa-web zaten bir VPS'te varsa, ayrı bir droplet aç — staging ile prod karışmasın.)
- [ ] **DNS:** Cloudflare zone'da `staging.techchefdelights.com` için A record → VPS public IP. **Orange cloud OFF** (Let's Encrypt cert challenge için). Production cutover sonrası ON yapılır.
- [ ] **SSH key:** Local makinene `~/.ssh/id_*` kayıtlı; public key VPS'in `~/.ssh/authorized_keys`'inde. Test: `ssh root@<vps-ip>` → şifresiz girebilmelisin.
- [ ] **DNS propagasyonu:** `dig staging.techchefdelights.com` → VPS IP'sini göstermeli (TTL süresi geçince).

Hazırsa Faz 1'e geç.

---

## Faz 1 — Sunucu kurulumu (30 dk)

VPS'e SSH yapıp aşağıdaki komutları sırayla çalıştır. Her komutu **tek tek** çalıştır, çıktıyı izle. Bir adımda takılırsan log'u Lunexa ChatGPT'ye veya Claude'a paste et — analiz eder.

```bash
ssh root@<vps-ip>

# System updates
sudo apt update && sudo apt upgrade -y

# Service user
sudo adduser --disabled-password --gecos "" tcd
sudo usermod -aG sudo tcd                       # sonradan kaldırabilirsin

# Node 22 (NodeSource)
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node --version                                  # → v22.x

# pnpm
sudo corepack enable
corepack prepare pnpm@latest --activate
pnpm --version                                  # → 9.x veya üstü

# PostgreSQL 16
sudo apt install -y postgresql-16
sudo systemctl enable --now postgresql
pg_lsclusters                                   # → 16 main 5432 online

# Redis (rate-limit + future)
sudo apt install -y redis-server
sudo systemctl enable --now redis-server
redis-cli ping                                  # → PONG

# nginx + certbot
sudo apt install -y nginx certbot python3-certbot-nginx

# UFW firewall
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

**Sık karşılaşılan takılma noktaları:**
- Ubuntu 22.04'te PostgreSQL paketi 14 default — `apt install postgresql-16` paketinin var olduğunu doğrula
- `corepack` Node 22'de bundled, ama eski Node'da yok — `node --version` ≥ 22 olmalı
- Redis port çakışması: başka bir Redis varsa `sudo systemctl status redis-server` kontrol

---

## Faz 2 — DB + repo (20 dk)

Strong password üret, password manager'a kaydet, sonraki adımlarda kullanacaksın.

```bash
# Password üret (kendi makinende)
openssl rand -hex 32        # bunu 'STRONG_PW' olarak kaydet

# VPS'te DB rolü + database
STRONG_PW='YAPIŞTIR_BURAYA'
sudo -u postgres psql <<SQL
CREATE ROLE tcd_staging WITH LOGIN PASSWORD '${STRONG_PW}';
CREATE DATABASE techchefdelights_staging OWNER tcd_staging;
GRANT ALL PRIVILEGES ON DATABASE techchefdelights_staging TO tcd_staging;
SQL

# Bağlantıyı doğrula
PGPASSWORD="$STRONG_PW" psql -h 127.0.0.1 -U tcd_staging -d techchefdelights_staging -c '\conninfo'

# tcd kullanıcısına geç + repo clone
sudo -iu tcd
mkdir -p /home/tcd/apps && cd /home/tcd/apps
git clone https://github.com/fvarli/techchefdelights.git
cd techchefdelights
pnpm install --frozen-lockfile

# .env.production.local
cat > .env.production.local <<EOF
DATABASE_URL="postgresql://tcd_staging:${STRONG_PW}@127.0.0.1:5432/techchefdelights_staging"
REDIS_URL="redis://127.0.0.1:6379/1"
NEXT_PUBLIC_BASE_URL="https://staging.techchefdelights.com"
NEXT_PUBLIC_APP_VERSION=staging-$(git rev-parse --short HEAD)
EOF
chmod 600 .env.production.local
```

`STRONG_PW`'yi password manager'ında **mutlaka** kaydet — Faz 3 sanity check'lerinde de gerekecek.

---

## Faz 3 — Migrate + seed (10 dk)

```bash
pnpm prisma migrate deploy
pnpm prisma db seed

# Sanity check
PGPASSWORD="$STRONG_PW" psql -h 127.0.0.1 -U tcd_staging -d techchefdelights_staging \
  -c 'SELECT COUNT(*) FROM "Recipe" WHERE "isDraft" = false;' \
  -c 'SELECT COUNT(*) FROM "RecipeTranslation";' \
  -c 'SELECT COUNT(*) FROM "Ingredient";' \
  -c 'SELECT COUNT(*) FROM "IngredientMaster";'
```

**Beklenen:** 8 / 24 / 82 / 63

Sapma varsa `STAGING_DEPLOY.md §4`'teki tam sanity query setine bak.

---

## Faz 4 — Build + systemd (15 dk)

```bash
pnpm build                                      # Turbopack ~3 sn

# systemd unit (root yetkisiyle)
exit                                            # tcd → root'a dön
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
Environment=PORT=3000
Environment=HOSTNAME=127.0.0.1
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

**Beklenen:** `active (running)` görünmeli.

`active (running)` görünmüyorsa:
```bash
sudo journalctl -u techchefdelights -n 50 --no-pager
```
çıktısını al, hatayı analiz et veya destek iste.

---

## Faz 5 — Nginx + HTTPS (15 dk)

```bash
# nginx vhost
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
        proxy_set_header   X-Request-ID      $request_id;
        proxy_read_timeout 60s;
    }
}
NGINX

sudo ln -sf /etc/nginx/sites-available/techchefdelights /etc/nginx/sites-enabled/
sudo nginx -t                                   # → syntax OK olmalı
sudo systemctl reload nginx

# Let's Encrypt cert (Cloudflare orange cloud OFF olmalı bu adımda!)
sudo certbot --nginx -d staging.techchefdelights.com \
  --redirect --agree-tos -m hello@uselunexa.com -n
```

Certbot başarılıysa "Successfully received certificate" göreceksin.

**Cloudflare:** cert geldikten sonra DNS panel'inde orange cloud'u **ON** yapabilirsin (artık Cloudflare proxy kullanılabilir).

---

## Faz 6 — Smoke testler (20 dk)

VPS dışında bir terminal'den çalıştır:

```bash
B=https://staging.techchefdelights.com

# Health endpoint
curl -s $B/api/v1/health | jq
# Beklenen: status=ok, db=ok, rateLimitStore=redis, environment=production, version=staging-<sha>

# Sitemap + robots
curl -s $B/sitemap.xml | grep -c '<loc>'        # → 22
curl -s $B/robots.txt | head -25                # Disallow listesi görmeli

# Page smoke (15 sayfa: 3 locale × 5 path)
for path in "/" "/recipes" "/recipes/red-lentil-soup" "/recipes/red-lentil-soup/cook" "/categories/desserts"; do
  echo "--- $path ---"
  for prefix in "" "/tr" "/es"; do
    full="${prefix}${path}"
    full=${full//\/tr\/recipes\/red-lentil-soup/\/tr\/tarifler\/mercimek-corbasi}
    full=${full//\/es\/recipes\/red-lentil-soup/\/es\/recetas\/sopa-lentejas-rojas}
    full=${full//\/tr\/categories\/desserts/\/tr\/kategoriler\/tatlilar}
    full=${full//\/es\/categories\/desserts/\/es\/categorias\/postres}
    s=$(curl -s -o /dev/null -w "%{http_code}" "$B$full")
    echo "  $s  $full"
  done
done
# 15 → 200 olmalı

# Security headers
curl -sI $B/ | grep -iE '^(content-security|x-frame|x-content|referrer|permissions|strict-transport)'

# Rate limit (6 newsletter post)
for i in 1 2 3 4 5 6; do
  s=$(curl -s -o /dev/null -w "%{http_code}" -X POST $B/api/v1/newsletter \
    -H 'content-type: application/json' \
    -d '{"email":"smoke@staging.example"}')
  echo "  #$i -> $s"
done
# Beklenen: 200 200 200 200 200 429
```

**Rich Results (manuel):**
[https://search.google.com/test/rich-results](https://search.google.com/test/rich-results) sayfasına 3 URL'yi sırayla yapıştır:
- `https://staging.techchefdelights.com/recipes/red-lentil-soup`
- `https://staging.techchefdelights.com/tr/tarifler/mercimek-corbasi`
- `https://staging.techchefdelights.com/es/recetas/sopa-lentejas-rojas`

Her biri için `Recipe`, `FAQPage`, `BreadcrumbList`, `Review` "Valid items detected" yeşil olmalı, sıfır hata.

---

## Faz 7 — Lighthouse + cross-browser (30 dk)

**Lighthouse** (clean Chrome instance'ında):
```bash
pnpm exec lhci autorun \
  --collect.url=https://staging.techchefdelights.com/ \
  --collect.url=https://staging.techchefdelights.com/recipes/red-lentil-soup \
  --collect.url=https://staging.techchefdelights.com/recipes \
  --collect.url=https://staging.techchefdelights.com/recipes/red-lentil-soup/cook
```

**Hedef minimum (mobile + desktop):** Performance / Accessibility / Best Practices / SEO ≥ 90.

**Cross-browser smoke (manuel, 5 dk):**
- Chrome (latest, Win/Mac)
- Safari (latest macOS + iOS 16+)
- Firefox
- Edge
- Android Chrome

Her tarayıcıda walkthrough: `/` → search → `/recipes/<slug>` → save → `/saved` → cook → timer → exit → resume.

---

## Faz 8 — 24 saat soak

Bu süre içinde:

- [ ] `journalctl -u techchefdelights --since "24 hours ago"` — error-level satır olmamalı (rate-limit warn'lar OK)
- [ ] BetterStack `/api/v1/health` monitor'ü staging.techchefdelights.com için yeşil
- [ ] **Bir kez `pg_dump` snapshot al** (rollback hazır):
   ```bash
   PGPASSWORD="$STRONG_PW" pg_dump -h 127.0.0.1 -U tcd_staging \
     -d techchefdelights_staging --format=custom \
     --file=/var/backups/tcd/staging-$(date +%Y%m%d-%H%M%S).dump
   ```

24 saat bittiğinde: production sign-off gate'ine geç (`RELEASE_CHECKLIST.md §8`). Production'a çıkmadan önce stakeholder onayı + rollback planı belge.

---

## Karar destek

Her fazın çıktısını paylaşabilirsin (Claude veya ChatGPT TechChef session'ı):

| Sorun | Ne paylaş |
|-------|-----------|
| Komut hata verdi | Tam komut + hata çıktısı |
| nginx config kabul etmedi | `sudo nginx -t` çıktısı |
| Health `degraded` döndü | `curl -s $B/api/v1/health \| jq` çıktısı |
| Rich Results yeşil değil | Hangi schema kırmızı + Validator'ın hata mesajı |
| systemd start etmedi | `sudo journalctl -u techchefdelights -n 200 --no-pager` |
| Sitemap 22 değil | `curl -s $B/sitemap.xml \| grep -c '<loc>'` + `wc -l sitemap.ts` |

---

## Rollback

`STAGING_DEPLOY.md §Rollback`'ten:

**Önceki git ref'e dön:**
```bash
sudo -iu tcd
cd /home/tcd/apps/techchefdelights
git log --oneline -10                           # son 10 commit
git fetch --all
git checkout <PREVIOUS_GOOD_SHA>
pnpm install --frozen-lockfile
pnpm build
sudo systemctl restart techchefdelights
curl -s https://staging.techchefdelights.com/api/v1/health | jq
```

**Migration kırdıysa:**
1. `pnpm prisma migrate resolve --rolled-back <MIGRATION_NAME>`
2. Veya pg_dump'tan restore (bkz. STAGING_DEPLOY.md)

Her zaman migration deploy öncesi `pg_dump` al. CD pipeline'a gömüldüğünde otomatik olur.
