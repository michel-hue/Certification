export type PageItem = number | 'gap'

/**
 * Pages to display: always the first and last, the current one and its neighbours,
 * with a single `'gap'` standing for each run of hidden pages.
 */
export function pageItems(page: number, pageCount: number): PageItem[] {
  const items: PageItem[] = []
  for (let index = 1; index <= pageCount; index++) {
    if (index === 1 || index === pageCount || Math.abs(index - page) <= 1) items.push(index)
    else if (items.at(-1) !== 'gap') items.push('gap')
  }
  return items
}
