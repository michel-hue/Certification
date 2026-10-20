import { expect, test, type Page } from '@playwright/test'

/**
 * Critical journeys of CDC §15.2 (2 to 5), against the production build and the live
 * DummyJSON API. Journey 1 (home → filter → cart) is not automated yet. Desktop only: the
 * mobile header search is behind a toggle.
 */
test.skip(({ isMobile }) => isMobile, 'desktop journeys')
test.describe.configure({ timeout: 60_000 })

/** Pages are server-rendered: wait for hydration before interacting. */
async function open(page: Page, path: string) {
  await page.goto(path, { waitUntil: 'networkidle' })
}

async function signIn(page: Page, username: string, password: string) {
  await open(page, '/login')
  await page.getByLabel('Identifiant').fill(username)
  await page.getByLabel('Mot de passe', { exact: true }).fill(password)
  await page.getByRole('button', { name: 'Se connecter' }).click()
  await page.waitForURL(/\/account$/)
}

test('2 · visitor: live search suggestions → product page', async ({ page }) => {
  await open(page, '/')
  const search = page.getByRole('combobox', { name: 'Rechercher un produit' })
  await search.fill('mascara')

  const options = page.getByRole('listbox', { name: 'Suggestions' }).getByRole('option')
  await expect(options.first()).toBeVisible()
  const title = (await options.first().innerText()).split('\n')[0]!.trim()
  await search.press('ArrowDown')
  await search.press('Enter')

  await expect(page).toHaveURL(/\/products\/\d+-/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(title)
})

test('3 · guest checkout through to the confirmation', async ({ page }) => {
  await open(page, '/products?stock=1&sort=rating')
  await page.getByRole('main').getByRole('button', { name: 'Ajouter au panier' }).first().click()
  await expect(page.getByRole('dialog', { name: 'Votre panier' })).toBeVisible()

  await open(page, '/cart')
  await page.getByRole('link', { name: 'Commander' }).click()
  await page.waitForURL(/\/checkout$/)
  await page.waitForLoadState('networkidle')

  await page.getByLabel('Prénom').fill('Camille')
  await page.getByLabel('Nom', { exact: true }).fill('Durand')
  await page.getByLabel('E-mail').fill('camille@example.com')
  await page.getByLabel('Adresse').fill('12 rue des Halles')
  await page.getByLabel('Code postal').fill('75001')
  await page.getByLabel('Ville').fill('Paris')
  await page.getByRole('button', { name: 'Continuer vers le paiement' }).click()

  await page.getByRole('button', { name: /Utiliser la carte de test/ }).click()
  await page.getByRole('button', { name: /^Payer/ }).click()

  await page.waitForURL(/\/checkout\/success\//)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Merci')
  await expect(page.getByRole('main')).toContainText(/ET-[A-Z0-9]{6}/)
})

test('4 · customer: sign in → orders → order detail → sign out', async ({ page }) => {
  await signIn(page, 'michaelw', 'michaelwpass')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Michael')

  await page.getByRole('navigation', { name: 'Mon compte' }).getByRole('link', { name: 'Commandes' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Mes commandes')
  const firstOrder = page
    .getByRole('main')
    .getByRole('link', { name: /ET-C\d{4}/ })
    .first()
  await expect(firstOrder).toBeVisible()
  const id = (await firstOrder.innerText()).match(/ET-C\d{4}/)![0]
  await firstOrder.click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(id)

  await page.getByRole('button', { name: 'Déconnexion' }).click()
  await page.waitForURL((url) => url.pathname === '/')
  await open(page, '/account')
  await expect(page).toHaveURL(/\/login\?redirect=/)
})

test('5 · admin: sign in → create a product → back to the list', async ({ page }) => {
  await signIn(page, 'emilys', 'emilyspass')
  await open(page, '/admin/products')
  await page.getByRole('link', { name: 'Nouveau produit' }).click()
  await page.waitForURL(/\/admin\/products\/new$/)
  await page.waitForLoadState('networkidle')

  await page.getByRole('textbox', { name: /^Titre/ }).fill('Vase en grès E2E')
  await page.getByRole('textbox', { name: /^Prix/ }).fill('49,90')
  await page.getByRole('textbox', { name: 'Remise (%)' }).fill('20')
  await page.getByRole('textbox', { name: /^Stock/ }).fill('4')
  await page
    .getByRole('textbox', { name: /^URL de l'image/ })
    .fill('https://cdn.dummyjson.com/product-images/beauty/red-lipstick/thumbnail.webp')
  await page.getByRole('button', { name: 'Créer le produit' }).click()

  await page.waitForURL(/\/admin\/products$/)
  await expect(page.getByText(/Produit créé/).last()).toBeVisible()
  await page.getByLabel('Rechercher un produit').fill('E2E')
  const row = page.getByRole('row').filter({ hasText: 'Vase en grès E2E' })
  await expect(row).toContainText('39,92')
})

test('the back office is closed to customers, client and server side', async ({ page, request }) => {
  expect((await request.get('/api/admin/products')).status()).toBe(401)
  await signIn(page, 'michaelw', 'michaelwpass')
  expect((await page.request.get('/api/admin/products')).status()).toBe(403)
  await open(page, '/admin')
  await expect(page).toHaveURL(/\/account$/)
})
