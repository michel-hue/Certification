import { productWriteSchema } from '#shared/schemas/admin'
import { addProduct } from '../../../adapters/dummyjson/admin'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const product = await readValidatedBody(event, productWriteSchema.parse)
  try {
    return await addProduct(useCatalogApi(event).client, product)
  } catch (error) {
    throw toHttpError(error)
  }
})
