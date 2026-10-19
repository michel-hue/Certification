import type { Product } from '#shared/types/catalog'

/** The whole catalogue: the back-office table sorts, filters and pages it in the browser. */
export default defineEventHandler(async (event): Promise<Product[]> => {
  await requireAdmin(event)
  try {
    return await getCatalog(event)
  } catch (error) {
    throw toHttpError(error)
  }
})
