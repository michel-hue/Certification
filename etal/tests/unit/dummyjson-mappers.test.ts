import { describe, expect, it } from 'vitest'
import { toCart } from '../../server/adapters/dummyjson/cart.mapper'
import {
  LOW_STOCK_THRESHOLD,
  toAvailability,
  toProduct,
  toProductDetail,
} from '../../server/adapters/dummyjson/product.mapper'
import {
  dummyCartSchema,
  dummyProductSchema,
  dummyUserSchema,
  type DummyProduct,
} from '../../server/adapters/dummyjson/schemas'
import { toUser } from '../../server/adapters/dummyjson/user.mapper'
import rawCart from '../fixtures/dummyjson/cart.json'
import rawProduct from '../fixtures/dummyjson/product.json'
import rawUser from '../fixtures/dummyjson/user.json'

const product = dummyProductSchema.parse(rawProduct)
const withProduct = (overrides: Partial<DummyProduct>): DummyProduct => ({ ...product, ...overrides })

describe('toProduct', () => {
  it('maps a real DummyJSON product to the domain model', () => {
    expect(toProduct(product, 'EUR')).toMatchObject({
      id: 1,
      slug: 'essence-mascara-lash-princess',
      title: 'Essence Mascara Lash Princess',
      brand: 'Essence',
      category: { slug: 'beauty', name: 'Beauty' },
      rating: { average: 2.56, count: 3 },
      stock: 99,
      availability: 'in_stock',
      minimumOrderQuantity: 48,
      thumbnail: { src: product.thumbnail, alt: product.title },
      createdAt: '2025-10-09T14:47:01.588Z',
    })
  })

  it('sells at the discounted price and strikes through the list price', () => {
    const mapped = toProduct(withProduct({ price: 100, discountPercentage: 20 }), 'EUR')

    expect(mapped.price).toEqual({ amount: 7360, currency: 'EUR' })
    expect(mapped.compareAtPrice).toEqual({ amount: 9200, currency: 'EUR' })
    expect(mapped.discountPercent).toBe(20)
  })

  it('ignores token discounts below the promo threshold', () => {
    const mapped = toProduct(withProduct({ price: 100, discountPercentage: 4.99 }), 'EUR')

    expect(mapped.price).toEqual({ amount: 9200, currency: 'EUR' })
    expect(mapped).not.toHaveProperty('compareAtPrice')
    expect(mapped).not.toHaveProperty('discountPercent')
  })

  it('falls back to the thumbnail when the product has no gallery', () => {
    expect(toProduct(withProduct({ images: [] }), 'EUR').images).toEqual([
      { src: product.thumbnail, alt: product.title },
    ])
  })

  it('omits the brand and creation date gracefully when the API has none', () => {
    const mapped = toProduct(withProduct({ brand: undefined, meta: undefined }), 'EUR')
    expect(mapped).not.toHaveProperty('brand')
    expect(mapped.createdAt).toBe('1970-01-01T00:00:00.000Z')
  })

  it('humanises multi-word category slugs', () => {
    expect(toProduct(withProduct({ category: 'home-decoration' }), 'EUR').category).toEqual({
      slug: 'home-decoration',
      name: 'Home decoration',
    })
  })
})

describe('toAvailability', () => {
  it.each([
    [0, 'out_of_stock'],
    [1, 'low_stock'],
    [LOW_STOCK_THRESHOLD - 1, 'low_stock'],
    [LOW_STOCK_THRESHOLD, 'in_stock'],
  ] as const)('stock %i → %s', (stock, expected) => {
    expect(toAvailability(stock)).toBe(expected)
  })
})

describe('toProductDetail', () => {
  it('maps reviews without forwarding reviewer e-mails', () => {
    const detail = toProductDetail(product, 'EUR')

    expect(detail.reviews[0]).toEqual({
      rating: 3,
      comment: 'Would not recommend!',
      date: '2025-04-30T09:41:02.053Z',
      author: 'Eleanor Collins',
    })
    expect(JSON.stringify(detail)).not.toContain('@x.dummyjson.com')
    expect(detail).toMatchObject({ sku: 'BEA-ESS-ESS-001', warranty: '1 week warranty' })
  })
})

describe('toUser', () => {
  const user = dummyUserSchema.parse(rawUser)

  it('never exposes the password', () => {
    expect(JSON.stringify(toUser(user, []))).not.toContain(rawUser.password)
  })

  it('trusts the API admin role', () => {
    expect(toUser(user, []).role).toBe('admin')
  })

  it('promotes configured demo admins and defaults to customer', () => {
    const customer = { ...user, id: 7, role: 'user' }
    expect(toUser(customer, []).role).toBe('customer')
    expect(toUser(customer, [7]).role).toBe('admin')
  })

  it('maps the postal address', () => {
    expect(toUser(user, []).address).toEqual({
      line1: '626 Main Street',
      city: 'Phoenix',
      postalCode: '29112',
      country: 'United States',
    })
  })
})

describe('toCart', () => {
  it('converts every amount to integer minor units', () => {
    const cart = toCart(dummyCartSchema.parse(rawCart), 'EUR')

    expect(cart.itemCount).toBe(rawCart.totalQuantity)
    expect(cart.lines[0]).toMatchObject({
      productId: 162,
      quantity: 4,
      unitPrice: { amount: 2759, currency: 'EUR' },
    })
    for (const money of [cart.subtotal, cart.total, ...cart.lines.map((line) => line.total)]) {
      expect(Number.isInteger(money.amount)).toBe(true)
    }
  })
})
