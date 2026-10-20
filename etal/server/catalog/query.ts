import type { ProductListQuery, ProductSort } from '#shared/schemas/catalog'
import type { CatalogFacets, CatalogPage, Product, Section } from '#shared/types/catalog'
import { toMajorUnits } from '#shared/utils/money'

/** Brands listed in the filter panel; beyond this the list stops being scannable. */
export const MAX_BRAND_FACETS = 12

const byNumber =
  <T>(pick: (item: T) => number, direction: 1 | -1) =>
  (a: T, b: T) =>
    (pick(a) - pick(b)) * direction

const SORTS: Record<ProductSort, ((a: Product, b: Product) => number) | undefined> = {
  relevance: undefined,
  'price-asc': byNumber((product) => product.price.amount, 1),
  'price-desc': byNumber((product) => product.price.amount, -1),
  rating: byNumber((product) => product.rating.average, -1),
  newest: (a, b) => b.createdAt.localeCompare(a.createdAt),
  discount: byNumber((product) => product.discountPercent ?? 0, -1),
}

function matchesTerm(product: Product, term: string): boolean {
  const haystack = [
    product.title,
    product.brand,
    product.category.slug,
    product.category.name,
    ...product.tags,
  ]
    .join(' ')
    .toLowerCase()
  return haystack.includes(term.toLowerCase())
}

/**
 * Filters, sorts and paginates the full catalogue (CDC §8.3: filters the API lacks are
 * applied server-side). Facets are computed at the step before their own filter, so a
 * selected brand never hides the other brands.
 */
export function queryCatalog(
  products: readonly Product[],
  query: ProductListQuery,
  sections: readonly Section[],
): CatalogPage {
  const section =
    sections.find((item) => item.id === query.g) ??
    // A category page implies its rubrique (breadcrumb, sub-category list).
    (query.category ? sections.find((item) => item.categories.includes(query.category!)) : undefined)

  const inTerm = query.q ? products.filter((product) => matchesTerm(product, query.q!)) : [...products]
  const inSection = section
    ? inTerm.filter((product) => section.categories.includes(product.category.slug))
    : inTerm
  const inCategory = query.category
    ? inSection.filter((product) => product.category.slug === query.category)
    : inSection

  let results = inCategory
  if (query.brands?.length)
    results = results.filter((product) => product.brand && query.brands!.includes(product.brand))
  if (query.min !== undefined)
    results = results.filter((product) => toMajorUnits(product.price) >= query.min!)
  if (query.max !== undefined)
    results = results.filter((product) => toMajorUnits(product.price) <= query.max!)
  if (query.rating !== undefined)
    results = results.filter((product) => product.rating.average >= query.rating!)
  if (query.stock) results = results.filter((product) => product.availability !== 'out_of_stock')
  if (query.promo) results = results.filter((product) => product.discountPercent !== undefined)
  if (query.exclude !== undefined) results = results.filter((product) => product.id !== query.exclude)

  const compare = SORTS[query.sort]
  if (compare) results = [...results].sort(compare)

  const total = results.length
  const pageCount = Math.max(1, Math.ceil(total / query.pageSize))
  const page = Math.min(query.page, pageCount)
  const start = (page - 1) * query.pageSize

  const facets: CatalogFacets = {
    sectionCounts: Object.fromEntries(
      sections.map((item) => [
        item.id,
        products.filter((product) => item.categories.includes(product.category.slug)).length,
      ]),
    ),
    termTotal: inTerm.length,
    sectionTotal: inSection.length,
    categories: section
      ? section.categories.map((slug) => ({
          slug,
          count: inTerm.filter((product) => product.category.slug === slug).length,
        }))
      : [],
    brands: [...new Set(inCategory.flatMap((product) => (product.brand ? [product.brand] : [])))]
      .sort((a, b) => a.localeCompare(b))
      .slice(0, MAX_BRAND_FACETS),
  }

  return {
    items: results.slice(start, start + query.pageSize),
    total,
    page,
    pageSize: query.pageSize,
    pageCount,
    facets,
  }
}
