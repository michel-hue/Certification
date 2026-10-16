import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test.describe('foundations (Lot 1)', () => {
  test('home renders in French by default', async ({ page }) => {
    await page.goto('/')

    await expect(page.locator('html')).toHaveAttribute('lang', 'fr-FR')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Les essentiels de la saison')
    await expect(page.getByRole('link', { name: 'Étal — accueil' }).first()).toBeVisible()
    await expect(page.getByText('Projet portfolio : aucune commande')).toBeVisible()
  })

  test('home renders in English under /en', async ({ page }) => {
    await page.goto('/en')

    await expect(page.locator('html')).toHaveAttribute('lang', 'en-US')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('The essentials of the season')
  })

  test('the demo banner stays closed after a reload', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Fermer le bandeau' }).click()
    await expect(page.getByText('Projet portfolio : aucune commande')).toBeHidden()

    await page.reload()
    await expect(page.getByText('Projet portfolio : aucune commande')).toBeHidden()
  })

  test('the dark theme is applied without a flash and persists', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Passer en thème sombre' }).first().click()
    await expect(page.locator('html')).toHaveClass(/dark/)

    await page.reload()
    await expect(page.locator('html')).toHaveClass(/dark/)
  })

  test('the API proxy serves typed products', async ({ request }) => {
    const response = await request.get('/api/products?pageSize=2&sort=rating')
    expect(response.ok()).toBe(true)

    const body = await response.json()
    expect(body).toMatchObject({ page: 1, pageSize: 2 })
    expect(body.items[0].price).toEqual({ amount: expect.any(Number), currency: 'EUR' })
  })

  test('the API proxy rejects invalid queries', async ({ request }) => {
    const response = await request.get('/api/products?sort=cheapest')
    expect(response.status()).toBe(400)
  })

  test('the home page has no critical accessibility violations', async ({ page }) => {
    for (const theme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme: theme })
      await page.goto('/')
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag22aa']).analyze()
      expect(results.violations.filter((violation) => violation.impact === 'critical')).toEqual([])
    }
  })
})
