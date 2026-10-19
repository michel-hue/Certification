import type { Order } from '#shared/types/order'

/** Newest first; ids break ties so the order is stable across renders. */
export function mergeOrders(...sources: readonly (readonly Order[])[]): Order[] {
  return sources.flat().sort((a, b) => b.createdAt.localeCompare(a.createdAt) || a.id.localeCompare(b.id))
}

/**
 * The signed-in customer's history (CDC §9.2): API carts fetched through `/api/account/orders`,
 * merged with the orders they placed through the demo checkout. The latter live in
 * localStorage, so they only join once the component is mounted.
 */
export function useMyOrders() {
  const { user } = useAuth()
  const store = useOrdersStore()
  const mounted = useMounted()

  const { data, pending, error, refresh } = useFetch<Order[]>('/api/account/orders', {
    key: 'account:orders',
    lazy: true,
    default: () => [],
  })

  const orders = computed(() => {
    const userId = user.value?.id
    const local =
      mounted.value && userId !== undefined ? store.orders.filter((order) => order.userId === userId) : []
    return mergeOrders(local, data.value)
  })

  const find = (id: string) => orders.value.find((order) => order.id === id)

  return { orders, pending, error, refresh, find }
}
