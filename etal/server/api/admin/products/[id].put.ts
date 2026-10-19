import { adminIdParamSchema, productWriteSchema } from '#shared/schemas/admin'
import { updateProduct } from '../../../adapters/dummyjson/admin'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const { id } = await getValidatedRouterParams(event, adminIdParamSchema.parse)
  const product = await readValidatedBody(event, productWriteSchema.parse)
  try {
    await updateProduct(useCatalogApi(event).client, id, product)
    return { id }
  } catch (error) {
    throw toHttpError(error)
  }
})
