import type { Order } from '#shared/types/order'
import { userOrders } from '../../adapters/dummyjson/auth'

/** The signed-in user's API carts, shown as past orders. Demo accounts have none. */
export default defineEventHandler(async (event): Promise<Order[]> => {
  const session = await requireUserSession(event)
  if (session.demo) return []
  const { client, currency } = useCatalogApi(event)
  try {
    return await userOrders(client, session.user.id, currency)
  } catch (error) {
    throw toHttpError(error)
  }
})
