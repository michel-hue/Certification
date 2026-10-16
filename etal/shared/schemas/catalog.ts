import { z } from 'zod'

/** `discount` only feeds the « Prix doux » carousel; the sort select offers the others. */
export const PRODUCT_SORTS = ['relevance', 'price-asc', 'price-desc', 'rating', 'newest', 'discount'] as const
export type ProductSort = (typeof PRODUCT_SORTS)[number]

export const DEFAULT_PAGE_SIZE = 12
export const MAX_PAGE_SIZE = 60
export const RATING_FILTERS = [4, 4.5] as const

const slug = z.string().regex(/^[a-z0-9-]+$/)
const flag = z.enum(['1', 'true']).transform(() => true)
const list = z
  .string()
  .transform((value) =>
    value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
  )
  .pipe(z.array(z.string().max(60)).max(20))

/**
 * Catalog query string, shared by the listing pages (URL state, CDC §8.3) and
 * `GET /api/products`. Prices are in major units of the display currency.
 */
export const productListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
  sort: z.enum(PRODUCT_SORTS).default('relevance'),
  /** Editorial rubrique (`beaute`, `maison`…). */
  g: slug.optional(),
  category: slug.optional(),
  q: z.string().trim().min(1).max(80).optional(),
  brands: list.optional(),
  min: z.coerce.number().nonnegative().optional(),
  max: z.coerce.number().nonnegative().optional(),
  rating: z.coerce.number().min(0).max(5).optional(),
  stock: flag.optional(),
  promo: flag.optional(),
  /** Leave one product out, e.g. the current one in « Vous aimerez aussi ». */
  exclude: z.coerce.number().int().positive().optional(),
})

export type ProductListQuery = z.infer<typeof productListQuerySchema>
export type ProductListQueryInput = z.input<typeof productListQuerySchema>

/**
 * Lenient parse for URLs typed or shared by people: an invalid parameter is dropped
 * instead of failing the whole page (the API stays strict).
 */
export function parseProductListQuery(raw: Record<string, unknown>): ProductListQuery {
  const input: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(raw)) {
    const first = Array.isArray(value) ? value[0] : value
    if (typeof first === 'string' && first !== '') input[key] = first
  }

  const result = productListQuerySchema.safeParse(input)
  if (result.success) return result.data

  const invalid = new Set(result.error.issues.map((issue) => issue.path[0]))
  return productListQuerySchema.parse(
    Object.fromEntries(Object.entries(input).filter(([key]) => !invalid.has(key))),
  )
}

export const productIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
})
