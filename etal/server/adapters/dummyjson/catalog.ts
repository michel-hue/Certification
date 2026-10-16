import type { ProductListQuery, ProductSort } from '#shared/schemas/catalog'
import type { CategoryRef, Paginated, Product, ProductDetail } from '#shared/types/catalog'
import type { CurrencyCode } from '#shared/types/money'
import type { DummyJsonClient } from './client'
import { toCategory, toProduct, toProductDetail } from './product.mapper'
import { dummyCategoryListSchema, dummyProductListSchema, dummyProductSchema } from './schemas'

const SORT_PARAMS: Record<ProductSort, { sortBy: string; order: 'asc' | 'desc' } | undefined> = {
  relevance: undefined,
  'price-asc': { sortBy: 'price', order: 'asc' },
  'price-desc': { sortBy: 'price', order: 'desc' },
  rating: { sortBy: 'rating', order: 'desc' },
  newest: { sortBy: 'meta.createdAt', order: 'desc' },
}

export async function listProducts(
  client: DummyJsonClient,
  query: ProductListQuery,
  currency: CurrencyCode,
): Promise<Paginated<Product>> {
  const path = query.category ? `/products/category/${query.category}` : '/products'
  const raw = await client.get(path, dummyProductListSchema, {
    limit: query.pageSize,
    skip: (query.page - 1) * query.pageSize,
    ...SORT_PARAMS[query.sort],
  })

  return {
    items: raw.products.map((product) => toProduct(product, currency)),
    total: raw.total,
    page: query.page,
    pageSize: query.pageSize,
    pageCount: Math.max(1, Math.ceil(raw.total / query.pageSize)),
  }
}

export async function getProduct(
  client: DummyJsonClient,
  id: number,
  currency: CurrencyCode,
): Promise<ProductDetail> {
  const raw = await client.get(`/products/${id}`, dummyProductSchema)
  return toProductDetail(raw, currency)
}

export async function listCategories(client: DummyJsonClient): Promise<CategoryRef[]> {
  const raw = await client.get('/products/categories', dummyCategoryListSchema)
  return raw.map(toCategory)
}
