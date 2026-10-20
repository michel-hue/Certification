import {
  parseProductListQuery,
  type ProductListQuery,
  type ProductListQueryInput,
} from '#shared/schemas/catalog'

export type CatalogPatch = { [K in keyof ProductListQuery]?: ProductListQuery[K] | null }

/** Serialises filters back to a clean query string: defaults and empty values are omitted. */
export function toQueryString(query: CatalogPatch): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === false || value === '') continue
    if (key === 'page' && value === 1) continue
    if (key === 'sort' && value === 'relevance') continue
    if (key === 'pageSize') continue
    if (Array.isArray(value)) {
      if (value.length) out[key] = value.join(',')
      continue
    }
    out[key] = value === true ? '1' : String(value)
  }
  return out
}

/**
 * Catalogue state lives in the URL (CDC §8.3): shareable, and the back button undoes a
 * filter. Every change except paging returns to page 1.
 */
export function useCatalogQuery(fixed: Partial<ProductListQueryInput> = {}) {
  const route = useRoute()
  const router = useRouter()

  const query = computed(() => parseProductListQuery({ ...route.query, ...fixed }))

  // Fixed params (e.g. the category of /categories/[slug]) live in the path, not the query.
  const withoutFixed = Object.fromEntries(Object.keys(fixed).map((key) => [key, null])) as CatalogPatch

  function update(patch: CatalogPatch) {
    const next: CatalogPatch = {
      ...query.value,
      ...patch,
      ...('page' in patch ? {} : { page: 1 }),
      ...withoutFixed,
    }
    return router.push({ query: toQueryString(next) })
  }

  function reset(keep: (keyof ProductListQuery)[] = []) {
    const kept: CatalogPatch = Object.fromEntries(keep.map((key) => [key, query.value[key]]))
    return router.push({ query: toQueryString({ ...kept, ...withoutFixed }) })
  }

  return { query, update, reset }
}
