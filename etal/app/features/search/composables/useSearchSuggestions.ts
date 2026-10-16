import type { CatalogPage } from '#shared/types/catalog'

export const SUGGESTION_MIN_LENGTH = 2
export const SUGGESTION_LIMIT = 5
export const SUGGESTION_DEBOUNCE_MS = 300

/**
 * Live suggestions for the header search (CDC §8.5): debounced, client-only, at most five
 * products. The cache key follows the term, so typing back to a previous term is instant.
 */
export function useSearchSuggestions(term: Ref<string>) {
  const debounced = refDebounced(term, SUGGESTION_DEBOUNCE_MS)
  const query = computed(() => debounced.value.trim())
  const enabled = computed(() => query.value.length >= SUGGESTION_MIN_LENGTH)

  const { data, status } = useAsyncData(
    () => `search:suggestions:${query.value}`,
    () =>
      enabled.value
        ? $fetch<CatalogPage>('/api/products', { query: { q: query.value, pageSize: SUGGESTION_LIMIT } })
        : Promise.resolve(null),
    { server: false, lazy: true, dedupe: 'cancel' },
  )

  return {
    query,
    enabled,
    suggestions: computed(() => (enabled.value ? (data.value?.items ?? []) : [])),
    total: computed(() => data.value?.total ?? 0),
    pending: computed(() => status.value === 'pending'),
  }
}
