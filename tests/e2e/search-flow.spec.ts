import { test, expect } from '@playwright/test'

test('search "lentil" → click result → land on recipe detail', async ({ page }) => {
  await page.goto('/search')

  const form = page.locator('form[role="search"]').first()
  await form.getByRole('searchbox').fill('lentil')
  await form.getByRole('button', { name: /(^search$|^ara$|^buscar$)/i }).click()

  await page.waitForURL(/\?q=lentil/)
  const result = page.getByRole('link', { name: /Red Lentil Soup/i })
  await expect(result).toBeVisible()
  await result.click()

  await page.waitForURL(/\/r\/red-lentil-soup$/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/Red Lentil Soup/i)
})

test('search with no matches shows empty state echoing the query', async ({ page }) => {
  await page.goto('/search?q=zzzdoesnotexist')
  await expect(
    page.getByText(/(no matches|sonuç yok|sin coincidencias).*zzzdoesnotexist/i),
  ).toBeVisible()
})
