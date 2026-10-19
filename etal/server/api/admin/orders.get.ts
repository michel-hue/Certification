import type { AdminOrder } from '#shared/types/admin'

/** API carts as orders; checkout orders live in the browser and are merged there. */
export default defineEventHandler(async (event): Promise<AdminOrder[]> => {
  await requireAdmin(event)
  try {
    return await getAdminOrders(event)
  } catch (error) {
    throw toHttpError(error)
  }
})
