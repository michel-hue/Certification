import { adminIdParamSchema } from '#shared/schemas/admin'
import { deleteProduct } from '../../../adapters/dummyjson/admin'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const { id } = await getValidatedRouterParams(event, adminIdParamSchema.parse)
  try {
    await deleteProduct(useCatalogApi(event).client, id)
    return { id }
  } catch (error) {
    throw toHttpError(error)
  }
})
