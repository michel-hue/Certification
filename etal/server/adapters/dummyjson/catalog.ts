import type { CategoryRef, Product, ProductDetail } from '#shared/types/catalog'
import type { CurrencyCode } from '#shared/types/money'
import type { DummyJsonClient } from './client'
import { toCategory, toProduct, toProductDetail } from './product.mapper'
import { dummyCategoryListSchema, dummyProductListSchema, dummyProductSchema } from './schemas'

/** The whole catalogue (~200 products): small enough to filter server-side in one go. */
export async function listAllProducts(client: DummyJsonClient, currency: CurrencyCode): Promise<Product[]> {
  const raw = await client.get('/products', dummyProductListSchema, { query: { limit: 0 } })
  return raw.products.map((product) => toProduct(product, currency))
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
