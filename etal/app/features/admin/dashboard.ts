import type { AdminOrder } from '#shared/types/admin'
import type { Product } from '#shared/types/catalog'
import type { CurrencyCode, Money } from '#shared/types/money'
import { LOW_STOCK_THRESHOLD } from '#shared/utils/product-rules'

export interface CategorySales {
  slug: string
  total: Money
}

/** Revenue per category over every order, best first (E17 « Ventes par catégorie »). */
export function salesByCategory(
  orders: readonly AdminOrder[],
  products: readonly Product[],
  currency: CurrencyCode,
  limit = 6,
): CategorySales[] {
  const categoryOf = new Map(products.map((product) => [product.id, product.category.slug]))
  const totals = new Map<string, number>()
  for (const order of orders) {
    for (const line of order.lines) {
      const slug = categoryOf.get(line.productId) ?? 'other'
      totals.set(slug, (totals.get(slug) ?? 0) + line.unitPrice.amount * line.quantity)
    }
  }
  return [...totals]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([slug, amount]) => ({ slug, total: { amount, currency } }))
}

/** Products per rounded star rating, 5 ★ first (E17 « Répartition des notes »). */
export function ratingDistribution(products: readonly Product[]): { stars: number; count: number }[] {
  return [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: products.filter(
      (product) => Math.min(5, Math.max(1, Math.round(product.rating.average))) === stars,
    ).length,
  }))
}

/** Products under the low-stock threshold, the most urgent first. */
export function lowStock(products: readonly Product[], limit = 6): Product[] {
  return products
    .filter((product) => product.stock < LOW_STOCK_THRESHOLD)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, limit)
}

/** Simulated revenue: the sum of every order total (CDC §10.1). */
export function revenue(orders: readonly AdminOrder[], currency: CurrencyCode): Money {
  return { amount: orders.reduce((sum, order) => sum + order.total.amount, 0), currency }
}
