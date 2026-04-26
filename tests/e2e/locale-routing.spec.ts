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

test('/en/r/<slug> redirects to /r/<slug>', async ({ page }) => {
  await page.goto('/en/r/red-lentil-soup', { waitUntil: 'commit' })
  await page.waitForURL((url) => url.pathname === '/r/red-lentil-soup')
})

test('per-locale recipe slugs resolve and TR/EN slug at TR locale 404s', async ({ page, request }) => {
  // TR with TR slug works
  let r = await request.get('/tr/r/mercimek-corbasi')
  expect(r.status()).toBe(200)

  // ES with ES slug works
  r = await request.get('/es/r/sopa-lentejas-rojas')
  expect(r.status()).toBe(200)

  // TR with EN slug 404s (strict locale lookup)
  r = await request.get('/tr/r/red-lentil-soup')
  expect(r.status()).toBe(404)
})

test('category strict-locale lookup', async ({ request }) => {
  // EN slug at EN
  expect((await request.get('/c/desserts')).status()).toBe(200)
  // TR slug at TR
  expect((await request.get('/tr/c/tatlilar')).status()).toBe(200)
  // ES slug at ES
  expect((await request.get('/es/c/postres')).status()).toBe(200)
  // TR locale + EN slug → 404
  expect((await request.get('/tr/c/desserts')).status()).toBe(404)
})

test('hreflang alternates emitted on recipe page', async ({ page }) => {
  await page.goto('/r/red-lentil-soup')
  const enAlt = page.locator('link[rel="alternate"][hreflang="en"]').first()
  const trAlt = page.locator('link[rel="alternate"][hreflang="tr"]').first()
  const esAlt = page.locator('link[rel="alternate"][hreflang="es"]').first()
  await expect(enAlt).toHaveAttribute('href', '/r/red-lentil-soup')
  await expect(trAlt).toHaveAttribute('href', '/tr/r/mercimek-corbasi')
  await expect(esAlt).toHaveAttribute('href', '/es/r/sopa-lentejas-rojas')
})
