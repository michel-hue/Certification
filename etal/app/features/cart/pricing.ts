import type { ProductImage } from '#shared/types/catalog'
import type { CurrencyCode, Money } from '#shared/types/money'
import type { ShippingMethod } from '#shared/types/order'
import { fromEur } from '#shared/utils/money'

export type { ShippingMethod }

export interface CartItem {
  productId: number
  slug: string
  title: string
  /** Brand, or the category when the product has none (eyebrow line). */
  eyebrow: string
  thumbnail: ProductImage
  unitPrice: Money
  /** Stock when added: quantities never exceed it (CDC §12.2). */
  stock: number
  quantity: number
}

export interface CheckoutRules {
  freeShippingFromEur: number
  promo: { code: string; percent: number }
  shippingEur: Record<ShippingMethod, number>
}

export interface CartTotals {
  itemCount: number
  subtotal: Money
  discount: Money
  shipping: Money
  total: Money
  /** What is still missing for free delivery (0 once reached). */
  freeShippingRemaining: Money
  /** 0–1, drives the free-delivery progress bar. */
  freeShippingProgress: number
}

/** Quantity clamped to [1, stock]; 0 when the product is sold out. */
export function clampQuantity(quantity: number, stock: number): number {
  if (stock <= 0) return 0
  return Math.min(stock, Math.max(1, Math.floor(quantity)))
}

export function isPromoCode(code: string, rules: CheckoutRules): boolean {
  return code.trim().toUpperCase() === rules.promo.code
}

/**
 * Every amount stays in integer minor units: the discount is rounded once, then
 * subtracted, so subtotal − discount + shipping always equals the total to the cent.
 */
export function computeTotals(
  items: readonly CartItem[],
  options: { currency: CurrencyCode; rules: CheckoutRules; promoApplied: boolean; method: ShippingMethod },
): CartTotals {
  const { currency, rules } = options
  const money = (amount: number): Money => ({ amount, currency })

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice.amount * item.quantity, 0)
  const discount = options.promoApplied ? Math.round((subtotal * rules.promo.percent) / 100) : 0
  const afterDiscount = subtotal - discount

  const threshold = fromEur(rules.freeShippingFromEur, currency).amount
  const reached = afterDiscount >= threshold
  const fee = fromEur(rules.shippingEur[options.method], currency).amount
  const shipping = itemCount === 0 || (reached && options.method !== 'express') ? 0 : fee

  return {
    itemCount,
    subtotal: money(subtotal),
    discount: money(discount),
    shipping: money(shipping),
    total: money(afterDiscount + shipping),
    freeShippingRemaining: money(Math.max(0, threshold - afterDiscount)),
    freeShippingProgress: threshold > 0 ? Math.min(1, afterDiscount / threshold) : 1,
  }
}
