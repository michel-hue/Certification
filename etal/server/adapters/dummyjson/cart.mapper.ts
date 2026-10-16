import type { Cart } from '#shared/types/cart'
import type { CurrencyCode } from '#shared/types/money'
import { fromUsd } from '#shared/utils/money'
import type { DummyCart } from './schemas'

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
