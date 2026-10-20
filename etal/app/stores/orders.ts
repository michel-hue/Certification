import type { ShippingDetails } from '#shared/schemas/checkout'
import type { Order, ShippingMethod } from '#shared/types/order'
import type { CartItem, CartTotals } from '~/features/cart/pricing'

/** `ET-` + 6 random characters, e.g. `ET-7K2Q9F` (mockup confirmation). */
export function createOrderId(random: () => number = Math.random): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let id = 'ET-'
  for (let index = 0; index < 6; index++) id += alphabet[Math.floor(random() * alphabet.length)]
  return id
}

/**
 * Orders placed through the demo checkout (CDC §12.1), kept in localStorage. Order history
 * from the API (user carts) is merged in at display time, in the account space.
 */
export const useOrdersStore = defineStore(
  'orders',
  () => {
    const orders = ref<Order[]>([])

    function place(input: {
      items: readonly CartItem[]
      totals: CartTotals
      shippingMethod: ShippingMethod
      details: ShippingDetails
      userId?: number
    }): Order {
      const { details, totals } = input
      const order: Order = {
        id: createOrderId(),
        createdAt: new Date().toISOString(),
        lines: input.items.map((item) => ({
          productId: item.productId,
          slug: item.slug,
          title: item.title,
          thumbnail: item.thumbnail,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
        })),
        subtotal: totals.subtotal,
        discount: totals.discount,
        shipping: totals.shipping,
        total: totals.total,
        shippingMethod: input.shippingMethod,
        firstName: details.firstName,
        address: `${details.firstName} ${details.lastName}, ${details.address}, ${details.postalCode} ${details.city}`,
        email: details.email,
        ...(input.userId !== undefined && { userId: input.userId }),
        status: 'preparing',
      }
      orders.value = [order, ...orders.value]
      return order
    }

    const find = (id: string) => orders.value.find((order) => order.id === id)

    return { orders, place, find }
  },
  { persist: { storage: piniaPluginPersistedstate.localStorage() } },
)
