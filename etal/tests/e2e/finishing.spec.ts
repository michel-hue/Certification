import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

/** Lot 7: annex and error pages, SEO files, and axe on the key pages (CDC §14.2, §15.2). */
test.describe.configure({ timeout: 60_000 })

async function blockingViolations(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag22aa']).analyze()
  return results.violations
    .filter((violation) => violation.impact === 'critical' || violation.impact === 'serious')
    .map((violation) => `${violation.id}: ${violation.nodes.map((node) => node.target.join(' ')).join(', ')}`)
}

const PUBLIC_PAGES = [
  { path: '/products', heading: /./ },
  { path: '/products/1-essence-mascara-lash-princess', heading: 'Essence Mascara Lash Princess' },
  { path: '/cart', heading: /panier/ },
  { path: '/login', heading: /Bon/ },
  { path: '/about', heading: /Un étal/ },
  { path: '/faq', heading: /Questions/ },
  { path: '/legal', heading: /Mentions/ },
]

for (const { path, heading } of PUBLIC_PAGES) {
  test(`${path} has no serious accessibility violations, light and dark`, async ({ page }) => {
    for (const scheme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme: scheme })
      await page.goto(path, { waitUntil: 'networkidle' })
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading)
      expect(await blockingViolations(page)).toEqual([])
    }
  })
}

test('the back-office dashboard has no serious accessibility violations', async ({ page }) => {
  await page.goto('/login', { waitUntil: 'networkidle' })
  await page.getByLabel('Identifiant').fill('emilys')
  await page.getByLabel('Mot de passe', { exact: true }).fill('emilyspass')
  await page.getByRole('button', { name: 'Se connecter' }).click()
  await page.waitForURL(/\/account$/)
  await page.goto('/admin', { waitUntil: 'networkidle' })
  await expect(page.getByText('Ventes par catégorie')).toBeVisible()
  expect(await blockingViolations(page)).toEqual([])
})

test('an unknown address shows the 404 page with a 404 status', async ({ page }) => {
  const response = await page.goto('/page-introuvable')
  expect(response?.status()).toBe(404)
  await expect(page.getByRole('heading', { level: 1 })).toContainText("Cette page n'est plus")
  expect(await blockingViolations(page)).toEqual([])
  await page.waitForLoadState('networkidle')
  await page.getByRole('button', { name: 'Parcourir le catalogue' }).click()
  await expect(page).toHaveURL(/\/products$/)
})

test('the demo 500 page keeps the shop chrome', async ({ page }) => {
  const response = await page.goto('/500')
  expect(response?.status()).toBe(500)
  await expect(page.getByRole('heading', { level: 1 })).toContainText("L'étal est momentanément")
  await expect(page.getByRole('button', { name: 'Réessayer' })).toBeVisible()
  await expect(page.getByRole('contentinfo')).toBeVisible()
})

test('the FAQ answers open with the keyboard', async ({ page }) => {
  await page.goto('/faq', { waitUntil: 'networkidle' })
  const question = page.getByText('Existe-t-il un code promo ?')
  await question.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByText(/PORTFOLIO10 retire 10 %/)).toBeVisible()
})

test('robots.txt and the sitemap are served', async ({ request }) => {
  const robots = await (await request.get('/robots.txt')).text()
  expect(robots).toContain('Disallow: /admin')
  expect(robots).toMatch(/Sitemap: https?:\/\/.+\/sitemap\.xml/)

  const sitemap = await request.get('/sitemap.xml')
  expect(sitemap.headers()['content-type']).toContain('xml')
  const xml = await sitemap.text()
  expect(xml).toContain('<urlset')
  expect(xml).toContain('/products/1-essence-mascara-lash-princess</loc>')
  expect(xml).toContain('hreflang="en-US"')
})

test('the home page exposes Organization structured data', async ({ page }) => {
  await page.goto('/')
  const json = await page.locator('script[type="application/ld+json"]').first().textContent()
  expect(JSON.parse(json ?? '{}')['@graph'][0]).toMatchObject({ '@type': 'Organization', name: 'Étal' })
})
