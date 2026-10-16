import { z } from 'zod'

export const PRODUCT_SORTS = ['relevance', 'price-asc', 'price-desc', 'rating', 'newest'] as const
export type ProductSort = (typeof PRODUCT_SORTS)[number]

export const DEFAULT_PAGE_SIZE = 12
export const MAX_PAGE_SIZE = 60

/** Catalog query string, shared by the listing page (URL state) and `GET /api/products`. */
export const productListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
  sort: z.enum(PRODUCT_SORTS).default('relevance'),
  category: z
    .string()
    .regex(/^[a-z0-9-]+$/)
    .optional(),
})

export type ProductListQuery = z.infer<typeof productListQuerySchema>

export const productIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
})
