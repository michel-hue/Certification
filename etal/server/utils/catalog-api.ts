import type { H3Event } from 'h3'
import type { Product } from '#shared/types/catalog'
import type { CurrencyCode } from '#shared/types/money'
import { listAllProducts } from '../adapters/dummyjson/catalog'
import { createDummyJsonClient, UpstreamError } from '../adapters/dummyjson/client'

/** Per-request access to the catalog adapter, configured from runtime and app config. */
export function useCatalogApi(event: H3Event) {
  const { apiBaseUrl } = useRuntimeConfig(event)
  const { currency } = useAppConfig()
  return { client: createDummyJsonClient(apiBaseUrl, $fetch), currency }
}

/**
 * The mapped catalogue, fetched once and shared by every listing request for 10 minutes
 * (served stale while revalidating) instead of hitting DummyJSON for each filter change.
 */
const cachedCatalog = defineCachedFunction(
  async (apiBaseUrl: string, currency: CurrencyCode): Promise<Product[]> =>
    listAllProducts(createDummyJsonClient(apiBaseUrl, $fetch), currency),
  { name: 'catalog', maxAge: 60 * 10, swr: true, getKey: (_url: string, currency: CurrencyCode) => currency },
)

export function getCatalog(event: H3Event): Promise<Product[]> {
  const { apiBaseUrl } = useRuntimeConfig(event)
  const { currency } = useAppConfig()
  return cachedCatalog(apiBaseUrl, currency)
}

/** Converts adapter failures into HTTP errors without leaking upstream details. */
export function toHttpError(error: unknown): Error {
  if (error instanceof UpstreamError) {
    return createError({
      statusCode: error.status,
      statusMessage: error.status === 404 ? 'Not Found' : 'Bad Gateway',
    })
  }
  return error instanceof Error ? error : createError({ statusCode: 500 })
}
