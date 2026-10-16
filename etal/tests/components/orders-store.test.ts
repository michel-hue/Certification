import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { sampleProducts } from '~/design/showcase-products'
import { useCartStore } from '~/stores/cart'
import { createOrderId, useOrdersStore } from '~/stores/orders'

const details = {
  firstName: 'Emily',
  lastName: 'Johnson',
  email: 'emily@example.com',
  address: '12 rue des Halles',
  postalCode: '75001',
  city: 'Paris',
}

beforeEach(() => setActivePinia(createPinia()))

describe('createOrderId', () => {
  it('produces ET- and six unambiguous characters', () => {
    expect(createOrderId()).toMatch(/^ET-[A-HJ-NP-Z2-9]{6}$/)
    expect(createOrderId(() => 0)).toBe('ET-AAAAAA')
  })
})

describe('orders store', () => {
  it('snapshots the cart into a new order, newest first', () => {
    const cart = useCartStore()
    const orders = useOrdersStore()
    cart.add(sampleProducts[0]!, 2)
    cart.shippingMethod = 'express'

    const first = orders.place({
      items: cart.items,
      totals: cart.totals,
      shippingMethod: cart.shippingMethod,
      details,
    })
    const second = orders.place({ items: cart.items, totals: cart.totals, shippingMethod: 'relay', details })

    expect(orders.orders.map((order) => order.id)).toEqual([second.id, first.id])
    expect(first).toMatchObject({
      status: 'preparing',
      shippingMethod: 'express',
      firstName: 'Emily',
      address: 'Emily Johnson, 12 rue des Halles, 75001 Paris',
      total: cart.totals.total,
    })
    expect(first.lines[0]).toMatchObject({ productId: sampleProducts[0]!.id, quantity: 2 })
    expect(orders.find(first.id)).toEqual(first)
    expect(orders.find('ET-NOPE00')).toBeUndefined()
  })

  it('keeps its lines when the cart is cleared afterwards', () => {
    const cart = useCartStore()
    const orders = useOrdersStore()
    cart.add(sampleProducts[1]!)
    const order = orders.place({
      items: cart.items,
      totals: cart.totals,
      shippingMethod: 'standard',
      details,
    })
    cart.clear()

    expect(orders.find(order.id)?.lines).toHaveLength(1)
  })
})
