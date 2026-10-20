import type { Money } from './money'
import type { ProductImage } from './catalog'

export interface CartLine {
  productId: number
  title: string
  thumbnail: ProductImage
  unitPrice: Money
  quantity: number
  /** Line total after the product discount. */
  total: Money
}

export interface Cart {
  id: number
  userId: number
  lines: CartLine[]
  itemCount: number
  subtotal: Money
  total: Money
}
