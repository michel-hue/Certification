import type { Paginated } from '#shared/types/catalog'

export type SortDirection = 'ascending' | 'descending'
export interface SortState<K extends string> {
  key: K
  direction: SortDirection
}

/** Clicking the sorted column flips it; another column starts ascending. */
export function nextSort<K extends string>(current: SortState<K>, key: K): SortState<K> {
  if (current.key !== key) return { key, direction: 'ascending' }
  return { key, direction: current.direction === 'ascending' ? 'descending' : 'ascending' }
}

/** Stable sort on a derived value: numbers numerically, strings with the locale's collation. */
export function sortRows<T, K extends string>(
  rows: readonly T[],
  sort: SortState<K>,
  valueOf: (row: T, key: K) => string | number,
  locale: string,
): T[] {
  const collator = new Intl.Collator(locale, { sensitivity: 'base', numeric: true })
  const sign = sort.direction === 'ascending' ? 1 : -1
  return rows.toSorted((a, b) => {
    const x = valueOf(a, sort.key)
    const y = valueOf(b, sort.key)
    const order =
      typeof x === 'number' && typeof y === 'number' ? x - y : collator.compare(String(x), String(y))
    return order * sign
  })
}

/** Case- and accent-insensitive « contains », for the toolbar search fields. */
export function matchesSearch(term: string, ...fields: (string | undefined)[]): boolean {
  const normalize = (value: string) =>
    value
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase()
  const needle = normalize(term.trim())
  return !needle || fields.some((field) => field && normalize(field).includes(needle))
}

export function paginate<T>(rows: readonly T[], page: number, pageSize: number): Paginated<T> {
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize))
  const current = Math.min(Math.max(1, page), pageCount)
  return {
    items: rows.slice((current - 1) * pageSize, current * pageSize),
    total: rows.length,
    page: current,
    pageSize,
    pageCount,
  }
}
