import { adminIdParamSchema } from '#shared/schemas/admin'
import { deleteUser } from '../../../adapters/dummyjson/admin'

export default defineEventHandler(async (event) => {
  const session = await requireAdmin(event)
  const { id } = await getValidatedRouterParams(event, adminIdParamSchema.parse)
  if (id === session.user.id) throw createError({ statusCode: 400, statusMessage: 'Cannot delete yourself' })
  try {
    await deleteUser(useCatalogApi(event).client, id)
    return { id }
  } catch (error) {
    throw toHttpError(error)
  }
})
