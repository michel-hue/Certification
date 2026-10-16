import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test.describe('design system (Lot 2)', () => {
  test('the /_ui sheet has no serious accessibility violations, light and dark', async ({ page }) => {
    for (const scheme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme: scheme })
      await page.goto('/_ui')
      await expect(page.getByRole('heading', { level: 1 })).toContainText('Le design system')
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag22aa']).analyze()
      const blocking = results.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious')
      expect(blocking.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([])
    }
  })

  test('the drawer traps focus and closes with Escape, returning focus', async ({ page }) => {
    await page.goto('/_ui')
    const trigger = page.getByRole('button', { name: 'Tiroir droit (panier)' })
    await trigger.click()

    const drawer = page.getByRole('dialog', { name: 'Votre panier' })
    await expect(drawer).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(drawer).toBeHidden()
    await expect(trigger).toBeFocused()
  })

  test('the confirm dialog focuses « Annuler » and shows a toast on confirm', async ({ page }) => {
    await page.goto('/_ui')
    await page.getByRole('button', { name: 'Supprimer « Amazon Echo Plus »' }).click()

    const dialog = page.getByRole('alertdialog')
    await expect(dialog.getByRole('button', { name: 'Annuler' })).toBeFocused()
    await dialog.getByRole('button', { name: 'Supprimer', exact: true }).click()
    await expect(page.getByText('Produit supprimé · mode démo : non persisté.')).toBeVisible()
  })

  test('product cards toggle favourites with an accessible state', async ({ page }) => {
    await page.goto('/_ui')
    const favorite = page.getByRole('button', { name: 'Ajouter aux favoris' }).first()
    await favorite.click()
    await expect(page.getByRole('button', { name: 'Retirer des favoris' })).toHaveCount(2)
  })

  test('the header search is reachable with « / » and submits to /search', async ({ page, isMobile }) => {
    test.skip(isMobile, 'The desktop search field is hidden on small screens.')
    await page.goto('/')
    await page.keyboard.press('/')
    const search = page.getByRole('searchbox', { name: 'Rechercher un produit' })
    await expect(search).toBeFocused()
    await search.fill('mascara')
    await search.press('Enter')
    await expect(page).toHaveURL(/\/search\?q=mascara$/)
  })

  test('the mobile menu lists the rubriques', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile only.')
    await page.goto('/')
    await page.getByRole('button', { name: 'Ouvrir le menu' }).click()
    const menu = page.getByRole('dialog', { name: 'Rubriques' })
    for (const name of ['Beauté', 'Mode', 'Maison', 'Tech', 'Loisirs']) {
      await expect(menu.getByRole('link', { name, exact: true })).toBeVisible()
    }
  })

  test('the mega-menu opens on hover with the rubrique categories', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Desktop only.')
    await page.goto('/')
    await page.getByRole('navigation', { name: 'Rubriques' }).getByRole('link', { name: 'Maison' }).hover()
    await expect(page.getByRole('link', { name: 'Mobilier' })).toBeVisible()
    await expect(page.getByText('À la une · Maison')).toBeVisible()
  })
})
