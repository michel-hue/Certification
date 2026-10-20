import type { ProductImage } from './catalog'
import type { Money } from './money'

export type OrderStatus = 'pending' | 'preparing' | 'shipped' | 'delivered'
export const ORDER_STATUSES: readonly OrderStatus[] = ['pending', 'preparing', 'shipped', 'delivered']

export type ShippingMethod = 'standard' | 'relay' | 'express'

export interface OrderLine {
  productId: number
  slug: string
  title: string
  thumbnail: ProductImage
  unitPrice: Money
  quantity: number
}

/** A placed order: demo checkout orders and API carts are both shown this way. */
export interface Order {
  id: string
  createdAt: string
  lines: OrderLine[]
  subtotal: Money
  discount: Money
  shipping: Money
  total: Money
  shippingMethod: ShippingMethod
  firstName: string
  /** One line, as printed on the confirmation: « Emily Johnson, 12 rue des Halles, 75001 Paris ». */
  address: string
  email: string
  userId?: number
  status: OrderStatus
}
