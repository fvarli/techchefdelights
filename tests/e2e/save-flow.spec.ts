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

test('save recipe → appears on /saved', async ({ page }) => {
  await clearStorage(page)

  await page.goto(`/recipes/${SLUG}`)
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/Red Lentil Soup/i)

  const saveBtn = page
    .getByRole('button', { name: /(save recipe|tarifi kaydet|guardar receta)/i })
    .first()
  await saveBtn.click()
  await expect(
    page.getByRole('button', { name: /(^saved$|kaydedildi|guardada)/i }),
  ).toBeVisible()

  await page.goto('/saved')
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    /(saved recipes|kaydedilen|guardadas)/i,
  )
  await expect(page.getByRole('link', { name: /Red Lentil Soup/i })).toBeVisible()
})

test('empty /saved when nothing saved', async ({ page }) => {
  await clearStorage(page)

  await page.goto('/saved')
  await expect(page.getByText(/(nothing saved|henüz kayıt|aún no hay)/i)).toBeVisible()
})
