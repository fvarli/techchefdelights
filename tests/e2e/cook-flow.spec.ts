import { test, expect } from '@playwright/test'

const SLUG = 'red-lentil-soup'

async function clearStorage(page: import('@playwright/test').Page) {
  await page.goto('/')
  await page.evaluate(() => {
    try {
      localStorage.clear()
    } catch {}
  })
}

test('discover → recipe → cook → step nav → exit → resume', async ({ page }) => {
  await clearStorage(page)

  // Discover from home
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

  // Land on the recipe via direct URL
  await page.goto(`/r/${SLUG}`)
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/Red Lentil Soup/i)

  // Enter cook mode
  await page.goto(`/r/${SLUG}/cook`)
  await expect(page).toHaveURL(/\/cook$/)

  // Use Next button (more deterministic than keyboard timing)
  const nextBtn = page.getByRole('button', { name: /(^next$|^sonraki$|^siguiente$)/i }).first()
  await nextBtn.click()
  await page.waitForURL(/\?step=1$/)

  await nextBtn.click()
  await page.waitForURL(/\?step=2$/)

  // Open exit modal
  const exitButton = page.getByRole('button', { name: /(^exit$|^çık$|^salir$)/i }).first()
  await exitButton.click()

  // Confirm save & exit
  const saveAndExit = page.getByRole('button', { name: /(save.*exit|kaydet.*çık|guardar.*salir)/i })
  await expect(saveAndExit).toBeVisible()
  await saveAndExit.click()

  // Back on recipe detail page; resume banner should appear after hydration
  await page.waitForURL(new RegExp(`/r/${SLUG}$`))
  const resumeBanner = page.getByRole('status').filter({
    hasText: /(resume|devam|reanud)/i,
  })
  await expect(resumeBanner).toBeVisible()

  // Click resume — go back into cook mode at saved step
  const resumeLink = resumeBanner.getByRole('link', { name: /(resume|devam|reanud)/i })
  await resumeLink.click()
  await page.waitForURL(/\/cook(\?step=\d+)?$/)
})

test('cook timer transitions: idle → active → paused', async ({ page }) => {
  await clearStorage(page)

  // Step index 0 of red-lentil-soup ("Sweat the aromatics" — 8 min) has a timer.
  await page.goto(`/r/${SLUG}/cook`)
  const timer = page.getByRole('timer')
  await expect(timer).toBeVisible()

  // Start the timer — clx adds state-active class, observable on the timer node
  const startBtn = page.getByRole('button', { name: /(start|başlat|iniciar)/i })
  await startBtn.click()
  await expect(timer).toHaveClass(/state-active/)

  // Pause — only paused state has no dedicated CSS class, so assert via the
  // toggle-button label: it flips back to "Resume / Devam et / Reanudar"
  const pauseBtn = page.getByRole('button', { name: /(pause|duraklat|pausar)/i })
  await pauseBtn.click()
  await expect(
    page.getByRole('button', { name: /(resume|devam|reanud)/i }),
  ).toBeVisible()
})
