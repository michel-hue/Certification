import { describe, expect, it, vi } from 'vitest'
import { productListQuerySchema } from '#shared/schemas/catalog'
import { getProduct, listCategories, listProducts } from '../../server/adapters/dummyjson/catalog'
import { createDummyJsonClient, UpstreamError, type Fetcher } from '../../server/adapters/dummyjson/client'
import categories from '../fixtures/dummyjson/categories.json'
import productList from '../fixtures/dummyjson/product-list.json'
import product from '../fixtures/dummyjson/product.json'

const BASE_URL = 'https://api.test'

function clientReturning(body: unknown) {
  const fetcher = vi.fn<Fetcher>().mockResolvedValue(body)
  return { fetcher, client: createDummyJsonClient(BASE_URL, fetcher) }
}

describe('listProducts', () => {
  it('translates page and sort into DummyJSON limit/skip/sortBy', async () => {
    const { client, fetcher } = clientReturning(productList)
    const query = productListQuerySchema.parse({ page: '3', pageSize: '12', sort: 'price-desc' })

    const page = await listProducts(client, query, 'EUR')

    expect(fetcher).toHaveBeenCalledWith('/products', {
      baseURL: BASE_URL,
      query: { limit: 12, skip: 24, sortBy: 'price', order: 'desc' },
    })
    expect(page).toMatchObject({ total: 194, page: 3, pageSize: 12, pageCount: 17 })
    expect(page.items).toHaveLength(3)
  })

  it('sorts newest first on the creation date', async () => {
    const { client, fetcher } = clientReturning(productList)
    await listProducts(client, productListQuerySchema.parse({ sort: 'newest' }), 'EUR')

    expect(fetcher.mock.calls[0]?.[1].query).toMatchObject({ sortBy: 'meta.createdAt', order: 'desc' })
  })

  it('scopes the request to a category', async () => {
    const { client, fetcher } = clientReturning(productList)
    await listProducts(client, productListQuerySchema.parse({ category: 'beauty' }), 'EUR')

    expect(fetcher.mock.calls[0]?.[0]).toBe('/products/category/beauty')
  })
})

describe('getProduct and listCategories', () => {
  it('returns a product detail', async () => {
    const { client } = clientReturning(product)
    expect((await getProduct(client, 1, 'EUR')).slug).toBe('essence-mascara-lash-princess')
  })

  it('returns categories as slug and name only', async () => {
    const { client } = clientReturning(categories)
    expect((await listCategories(client))[0]).toEqual({ slug: 'beauty', name: 'Beauty' })
  })
})

describe('createDummyJsonClient errors', () => {
  it('reports a 404 from the API as not found', async () => {
    const fetcher = vi.fn<Fetcher>().mockRejectedValue(Object.assign(new Error('Not Found'), { status: 404 }))
    const client = createDummyJsonClient(BASE_URL, fetcher)

    await expect(getProduct(client, 99999, 'EUR')).rejects.toMatchObject({
      name: 'UpstreamError',
      status: 404,
    })
  })

  it('reports network failures as a bad gateway', async () => {
    const fetcher = vi.fn<Fetcher>().mockRejectedValue(new TypeError('fetch failed'))
    const client = createDummyJsonClient(BASE_URL, fetcher)

    await expect(listCategories(client)).rejects.toMatchObject({ status: 502 })
  })

  it('rejects payloads that do not match the expected shape', async () => {
    const { client } = clientReturning({ products: 'nope' })

    await expect(listProducts(client, productListQuerySchema.parse({}), 'EUR')).rejects.toBeInstanceOf(
      UpstreamError,
    )
  })
})

describe('productListQuerySchema', () => {
  it('applies defaults', () => {
    expect(productListQuerySchema.parse({})).toEqual({ page: 1, pageSize: 12, sort: 'relevance' })
  })

  it.each([{ page: '0' }, { pageSize: '500' }, { sort: 'cheapest' }, { category: '../users' }])(
    'rejects %j',
    (query) => {
      expect(productListQuerySchema.safeParse(query).success).toBe(false)
    },
  )
})
