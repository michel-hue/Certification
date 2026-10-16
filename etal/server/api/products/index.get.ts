import { productListQuerySchema } from '#shared/schemas/catalog'
import type { CatalogPage } from '#shared/types/catalog'
import { queryCatalog } from '../../catalog/query'

export default defineEventHandler(async (event): Promise<CatalogPage> => {
  const query = await getValidatedQuery(event, productListQuerySchema.parse)
  const { sections } = useAppConfig()
  try {
    return queryCatalog(await getCatalog(event), query, sections)
  } catch (error) {
    throw toHttpError(error)
  }
})
