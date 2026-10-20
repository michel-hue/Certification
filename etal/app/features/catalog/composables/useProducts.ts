import type { ProductListQuery, ProductListQueryInput } from '#shared/schemas/catalog'
import type { CatalogPage } from '#shared/types/catalog'
import { toQueryString } from './useCatalogQuery'

/**
 * Products for a listing, carousel or suggestion list, through the Nitro proxy only
 * (CDC §6.1). The cache key is derived from the normalised query, so identical requests
 * across components are deduplicated.
 */
export function useProducts(
  query: MaybeRefOrGetter<Partial<ProductListQuery | ProductListQueryInput>>,
  options: { lazy?: boolean } = {},
) {
  const params = computed(() => {
    const value = toValue(query) as Partial<ProductListQuery>
    const out = toQueryString(value)
    if (value.pageSize) out.pageSize = String(value.pageSize)
    return out
  })
  const key = computed(() => `products:list:${new URLSearchParams(params.value).toString()}`)

  return useFetch<CatalogPage>('/api/products', {
    key,
    query: params,
    lazy: options.lazy,
    dedupe: 'defer',
  })
}
