import { describe, expect, it, vi } from 'vitest'
import { productFormSchema, productWriteSchema } from '#shared/schemas/admin'
import type { AdminOrder } from '#shared/types/admin'
import type { Product } from '#shared/types/catalog'
import { fromMajorUnits, fromUsd, toUsd } from '#shared/utils/money'
import { lowStock, ratingDistribution, revenue, salesByCategory } from '../../app/features/admin/dashboard'
import {
  emptyProductForm,
  productFromForm,
  productToForm,
  toProductWrite,
} from '../../app/features/admin/product-form'
import { matchesSearch, nextSort, paginate, sortRows } from '../../app/features/admin/table'
import { sampleProducts } from '../../app/design/showcase-products'
import { listOrders, listUsers } from '../../server/adapters/dummyjson/admin'
import { createDummyJsonClient, type Fetcher } from '../../server/adapters/dummyjson/client'
import { toAdminUser, toIsoDate } from '../../server/adapters/dummyjson/user.mapper'
import rawCart from '../fixtures/dummyjson/cart.json'
import rawUser from '../fixtures/dummyjson/user.json'

const product = (overrides: Partial<Product>): Product => ({ ...sampleProducts[0]!, ...overrides })

const order = (overrides: Partial<AdminOrder>): AdminOrder => ({
  id: 'ET-C0001',
  createdAt: '2026-09-01T00:00:00.000Z',
  lines: [],
  subtotal: { amount: 0, currency: 'EUR' },
  discount: { amount: 0, currency: 'EUR' },
  shipping: { amount: 0, currency: 'EUR' },
  total: { amount: 0, currency: 'EUR' },
  shippingMethod: 'standard',
  firstName: '',
  address: '',
  email: '',
  status: 'pending',
  customer: 'Emily Johnson',
  ...overrides,
})

const line = (productId: number, cents: number, quantity: number) => ({
  productId,
  slug: 'p',
  title: 'P',
  thumbnail: { src: '', alt: '' },
  unitPrice: { amount: cents, currency: 'EUR' as const },
  quantity,
})

describe('money round trips', () => {
  it('reads typed amounts into minor units and converts back to USD', () => {
    expect(fromMajorUnits(12.4, 'EUR')).toEqual({ amount: 1240, currency: 'EUR' })
    expect(fromMajorUnits(1500, 'XOF')).toEqual({ amount: 1500, currency: 'XOF' })
    expect(toUsd(fromUsd(19.99, 'EUR'))).toBeCloseTo(19.99, 1)
  })
})

describe('productFormSchema', () => {
  const valid = {
    ...emptyProductForm(),
    title: 'Vase',
    price: '24,90',
    discountPercent: '15',
    stock: '7',
    thumbnail: 'https://cdn.dummyjson.com/vase.webp',
  }

  it('accepts French decimals and returns numbers', () => {
    expect(productFormSchema.parse(valid)).toMatchObject({ price: 24.9, discountPercent: 15, stock: 7 })
  })

  it('reports each invalid field with an i18n key', () => {
    const result = productFormSchema.safeParse({
      ...valid,
      title: ' ',
      price: '0',
      discountPercent: '95',
      stock: '-1',
      thumbnail: 'ftp://x',
    })
    const messages = Object.fromEntries(
      (result.error?.issues ?? []).map((issue) => [issue.path[0], issue.message]),
    )
    expect(messages).toEqual({
      title: 'admin.products.errors.title',
      price: 'admin.products.errors.price',
      discountPercent: 'admin.products.errors.discount',
      stock: 'admin.products.errors.stock',
      thumbnail: 'admin.products.errors.image',
    })
  })
})

describe('product form mapping', () => {
  it('fills the form with the list price and shows the promo again after saving', () => {
    const promo = product({
      price: { amount: 800, currency: 'EUR' },
      compareAtPrice: { amount: 1000, currency: 'EUR' },
      discountPercent: 20,
    })
    const form = productToForm(promo, 'fr')
    expect(form).toMatchObject({ price: '10', discountPercent: '20' })
    expect(productToForm({ ...promo, compareAtPrice: { amount: 827, currency: 'EUR' } }, 'fr').price).toBe(
      '8,27',
    )

    const saved = productFromForm(productFormSchema.parse(form), {
      id: promo.id,
      currency: 'EUR',
      base: promo,
    })
    expect(saved.price).toEqual({ amount: 800, currency: 'EUR' })
    expect(saved.compareAtPrice).toEqual({ amount: 1000, currency: 'EUR' })
    expect(saved.images[0]?.src).toBe(promo.thumbnail.src)
    expect(saved.rating).toEqual(promo.rating)
  })

  it('drops discounts too small to show and derives availability', () => {
    const values = productFormSchema.parse({
      ...emptyProductForm('furniture'),
      title: 'Chaise',
      price: '50',
      discountPercent: '5',
      stock: '3',
      thumbnail: 'https://cdn.dummyjson.com/chaise.webp',
    })
    const created = productFromForm(values, { id: 10_000, currency: 'EUR' })
    expect(created).toMatchObject({ slug: 'chaise', availability: 'low_stock', price: { amount: 5000 } })
    expect(created.compareAtPrice).toBeUndefined()

    const write = toProductWrite(values, 'EUR')
    expect(productWriteSchema.parse(write)).toEqual(write)
    expect(write.price).toBeCloseTo(50 / 0.92, 2)
    expect(write).not.toHaveProperty('brand')
  })
})

describe('dashboard aggregates', () => {
  const products = [
    product({
      id: 1,
      category: { slug: 'beauty', name: 'Beauty' },
      stock: 2,
      rating: { average: 4.6, count: 1 },
    }),
    product({
      id: 2,
      category: { slug: 'furniture', name: 'Furniture' },
      stock: 30,
      rating: { average: 3.2, count: 1 },
    }),
    product({
      id: 3,
      category: { slug: 'beauty', name: 'Beauty' },
      stock: 0,
      rating: { average: 0.4, count: 1 },
    }),
  ]
  const orders = [
    order({ lines: [line(1, 1000, 2), line(2, 5000, 1)], total: { amount: 6500, currency: 'EUR' } }),
    order({
      id: 'ET-C0002',
      lines: [line(3, 400, 1), line(99, 100, 1)],
      total: { amount: 500, currency: 'EUR' },
    }),
  ]

  it('sums sales per category, best first, with unknown products apart', () => {
    expect(salesByCategory(orders, products, 'EUR').map(({ slug, total }) => [slug, total.amount])).toEqual([
      ['furniture', 5000],
      ['beauty', 2400],
      ['other', 100],
    ])
  })

  it('buckets ratings, lists low stock and adds up revenue', () => {
    expect(ratingDistribution(products).map((bucket) => bucket.count)).toEqual([1, 0, 1, 0, 1])
    expect(lowStock(products).map((item) => item.id)).toEqual([3, 1])
    expect(revenue(orders, 'EUR')).toEqual({ amount: 7000, currency: 'EUR' })
  })
})

describe('table helpers', () => {
  const rows = [
    { name: 'Émile', stock: 9 },
    { name: 'anna', stock: 10 },
    { name: 'Zoé', stock: 2 },
  ]

  it('toggles and applies sorting', () => {
    const byName = nextSort({ key: 'stock', direction: 'descending' }, 'name')
    expect(byName).toEqual({ key: 'name', direction: 'ascending' })
    expect(nextSort(byName, 'name').direction).toBe('descending')
    const value = (row: (typeof rows)[number], key: 'name' | 'stock') => row[key]
    expect(sortRows(rows, byName, value, 'fr').map((row) => row.name)).toEqual(['anna', 'Émile', 'Zoé'])
    expect(
      sortRows(rows, { key: 'stock', direction: 'descending' }, value, 'fr').map((row) => row.stock),
    ).toEqual([10, 9, 2])
  })

  it('searches without case or accents and clamps pages', () => {
    expect(matchesSearch('emile', 'Émile Dupont')).toBe(true)
    expect(matchesSearch('', undefined)).toBe(true)
    expect(matchesSearch('zz', 'Émile', undefined)).toBe(false)
    expect(paginate(rows, 9, 2)).toMatchObject({ page: 2, pageCount: 2, total: 3, items: [rows[2]] })
  })
})

describe('back-office adapter', () => {
  it('maps users without credentials and pads birth dates', () => {
    const user = toAdminUser(rawUser, [1])
    expect(user).toMatchObject({
      id: 1,
      role: 'admin',
      birthDate: '1996-05-30',
      company: expect.stringContaining('·'),
    })
    expect(user).not.toHaveProperty('password')
    expect(toIsoDate('soon')).toBeUndefined()
  })

  it('asks for selected user fields and names order customers', async () => {
    const fetcher = vi
      .fn<Fetcher>()
      .mockResolvedValueOnce({ users: [rawUser], total: 1 })
      .mockResolvedValueOnce({
        carts: [
          { ...rawCart, userId: 1 },
          { ...rawCart, id: 99, userId: 404 },
        ],
      })
    const client = createDummyJsonClient('https://api.test', fetcher)

    const users = await listUsers(client, [])
    expect(fetcher.mock.calls[0]?.[1].query).toMatchObject({
      limit: 0,
      select: expect.stringContaining('birthDate'),
    })
    expect(users[0]?.role).toBe('customer')

    const orders = await listOrders(client, users, 'EUR')
    expect(orders.map((item) => item.customer)).toEqual(['Emily Johnson', '#404'])
  })
})
