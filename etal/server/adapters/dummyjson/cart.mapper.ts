import type { Cart } from '#shared/types/cart'
import type { CurrencyCode } from '#shared/types/money'
import type { Order, OrderStatus } from '#shared/types/order'
import { fromUsd } from '#shared/utils/money'
import { slugify } from '#shared/utils/slug'
import type { DummyCart } from './schemas'

/** DummyJSON carts have no date or status; derive stable ones from the id (mockup). */
const CART_STATUSES: readonly OrderStatus[] = ['delivered', 'shipped', 'delivered', 'preparing']
const HISTORY_ANCHOR = Date.UTC(2026, 8, 28)
const DAY_MS = 24 * 60 * 60 * 1000

/** `ET-C0007` for cart 7: API orders never collide with checkout ids (`ET-XXXXXX`). */
export const cartOrderId = (cartId: number) => `ET-C${String(cartId).padStart(4, '0')}`

export function toCart(raw: DummyCart, currency: CurrencyCode): Cart {
  return {
    id: raw.id,
    userId: raw.userId,
    lines: raw.products.map((line) => ({
      productId: line.id,
      title: line.title,
      thumbnail: { src: line.thumbnail, alt: line.title },
      unitPrice: fromUsd(line.price, currency),
      quantity: line.quantity,
      total: fromUsd(line.discountedTotal, currency),
    })),
    itemCount: raw.totalQuantity,
    subtotal: fromUsd(raw.total, currency),
    total: fromUsd(raw.discountedTotal, currency),
  }
}

/** An API cart presented as a past order in the account and the back office. */
export function toOrderFromCart(raw: DummyCart, currency: CurrencyCode): Order {
  const subtotal = fromUsd(raw.total, currency)
  const total = fromUsd(raw.discountedTotal, currency)
  return {
    id: cartOrderId(raw.id),
    createdAt: new Date(HISTORY_ANCHOR - (raw.id % 26) * DAY_MS).toISOString(),
    lines: raw.products.map((line) => ({
      productId: line.id,
      slug: slugify(line.title),
      title: line.title,
      thumbnail: { src: line.thumbnail, alt: line.title },
      unitPrice: fromUsd(line.price, currency),
      quantity: line.quantity,
    })),
    subtotal,
    discount: { amount: subtotal.amount - total.amount, currency },
    shipping: { amount: 0, currency },
    total,
    shippingMethod: 'standard',
    firstName: '',
    address: '',
    email: '',
    userId: raw.userId,
    status: CART_STATUSES[raw.id % CART_STATUSES.length]!,
  }
}
