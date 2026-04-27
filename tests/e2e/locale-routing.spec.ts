import { test, expect } from '@playwright/test'

test('EN unprefixed home', async ({ page }) => {
  const response = await page.goto('/')
  expect(response?.status()).toBe(200)
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
})

test('TR prefixed home', async ({ page }) => {
  const response = await page.goto('/tr')
  expect(response?.status()).toBe(200)
  await expect(page.locator('html')).toHaveAttribute('lang', 'tr')
})

test('ES prefixed home', async ({ page }) => {
  const response = await page.goto('/es')
  expect(response?.status()).toBe(200)
  await expect(page.locator('html')).toHaveAttribute('lang', 'es')
})

test('/en redirects to /', async ({ page }) => {
  const response = await page.goto('/en', { waitUntil: 'commit' })
  await page.waitForURL((url) => url.pathname === '/')
  expect(page.url()).toMatch(/\/$/)
  expect(response).toBeTruthy()
})

test('legacy /r/<slug> redirects to /recipes/<slug>', async ({ page }) => {
  await page.goto('/r/red-lentil-soup', { waitUntil: 'commit' })
  await page.waitForURL((url) => url.pathname === '/recipes/red-lentil-soup')
})

test('per-locale recipe slugs resolve and TR/EN slug at TR locale 404s', async ({ request }) => {
  // TR with TR slug works at the localized URL
  let r = await request.get('/tr/tarifler/mercimek-corbasi')
  expect(r.status()).toBe(200)

  // ES with ES slug works at the localized URL
  r = await request.get('/es/recetas/sopa-lentejas-rojas')
  expect(r.status()).toBe(200)

  // TR with EN slug 404s (strict locale lookup)
  r = await request.get('/tr/tarifler/red-lentil-soup')
  expect(r.status()).toBe(404)
})

test('category strict-locale lookup at localized URLs', async ({ request }) => {
  // EN slug at EN canonical
  expect((await request.get('/categories/desserts')).status()).toBe(200)
  // TR slug at TR localized
  expect((await request.get('/tr/kategoriler/tatlilar')).status()).toBe(200)
  // ES slug at ES localized
  expect((await request.get('/es/categorias/postres')).status()).toBe(200)
  // TR locale + EN slug → 404
  expect((await request.get('/tr/kategoriler/desserts')).status()).toBe(404)
})

test('hreflang alternates emitted on recipe page point at localized URLs', async ({ page }) => {
  await page.goto('/recipes/red-lentil-soup')
  const enAlt = page.locator('link[rel="alternate"][hreflang="en"]').first()
  const trAlt = page.locator('link[rel="alternate"][hreflang="tr"]').first()
  const esAlt = page.locator('link[rel="alternate"][hreflang="es"]').first()
  await expect(enAlt).toHaveAttribute('href', '/recipes/red-lentil-soup')
  await expect(trAlt).toHaveAttribute('href', '/tr/tarifler/mercimek-corbasi')
  await expect(esAlt).toHaveAttribute('href', '/es/recetas/sopa-lentejas-rojas')
})

test('legacy TR/ES short-form paths 308 redirect to localized URLs', async ({ request }) => {
  // /tr/r/<slug> -> /tr/tarifler/<slug>
  let r = await request.get('/tr/r/mercimek-corbasi', { maxRedirects: 0 })
  expect(r.status()).toBe(308)
  expect(r.headers()['location']).toMatch(/\/tr\/tarifler\/mercimek-corbasi/)

  // /es/c/<slug> -> /es/categorias/<slug>
  r = await request.get('/es/c/postres', { maxRedirects: 0 })
  expect(r.status()).toBe(308)
  expect(r.headers()['location']).toMatch(/\/es\/categorias\/postres/)
})
