import type { AdminOrder, AdminUser } from '#shared/types/admin'
import type { Product } from '#shared/types/catalog'
import type { Order } from '#shared/types/order'
import { mergeOrders } from '~/features/account/composables/useMyOrders'

export const ADMIN_DATA_KEYS = ['admin:products', 'admin:users', 'admin:orders'] as const

/**
 * Back-office lists (CDC §10): the API's data through `/api/admin/*`, with the simulated
 * writes of this visit laid over it. One cache key per list, shared by every page.
 */
export function useAdminProducts() {
  const overrides = useAdminOverridesStore()
  const { data, pending, error, refresh } = useFetch<Product[]>('/api/admin/products', {
    key: ADMIN_DATA_KEYS[0],
    lazy: true,
    default: () => [],
  })
  const products = computed(() => overrides.applyProducts(data.value))
  return { products, pending, error, refresh }
}

export function useAdminUsers() {
  const overrides = useAdminOverridesStore()
  const { data, pending, error, refresh } = useFetch<AdminUser[]>('/api/admin/users', {
    key: ADMIN_DATA_KEYS[1],
    lazy: true,
    default: () => [],
  })
  const users = computed(() => overrides.applyUsers(data.value))
  return { users, pending, error, refresh }
}

/** Checkout orders only carry the delivery line: « Emily Johnson, 12 rue… ». */
export function toAdminOrder(order: Order): AdminOrder {
  return { ...order, customer: order.address.split(',')[0]?.trim() || order.firstName }
}

/** API carts plus the demo checkout orders of this browser, newest first. */
export function useAdminOrders() {
  const overrides = useAdminOverridesStore()
  const local = useOrdersStore()
  const mounted = useMounted()
  const { data, pending, error, refresh } = useFetch<AdminOrder[]>('/api/admin/orders', {
    key: ADMIN_DATA_KEYS[2],
    lazy: true,
    default: () => [],
  })
  const checkoutOrders = computed(() => (mounted.value ? local.orders.map(toAdminOrder) : []))
  const orders = computed(() => overrides.applyOrders(mergeOrders(checkoutOrders.value, data.value)))
  const checkoutCount = computed(() => checkoutOrders.value.length)
  return { orders, checkoutCount, pending, error, refresh }
}
