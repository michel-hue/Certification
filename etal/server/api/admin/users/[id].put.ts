import { adminIdParamSchema, userRoleSchema } from '#shared/schemas/admin'
import { updateUserRole } from '../../../adapters/dummyjson/admin'

export default defineEventHandler(async (event) => {
  const session = await requireAdmin(event)
  const { id } = await getValidatedRouterParams(event, adminIdParamSchema.parse)
  const { role } = await readValidatedBody(event, userRoleSchema.parse)
  if (id === session.user.id)
    throw createError({ statusCode: 400, statusMessage: 'Cannot change your own role' })
  try {
    await updateUserRole(useCatalogApi(event).client, id, role)
    return { id, role }
  } catch (error) {
    throw toHttpError(error)
  }
})
