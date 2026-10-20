import type { AdminUser } from '#shared/types/admin'

export default defineEventHandler(async (event): Promise<AdminUser[]> => {
  await requireAdmin(event)
  try {
    return await getAdminUsers(event)
  } catch (error) {
    throw toHttpError(error)
  }
})
