import type { AdminOrder, AdminUser } from '#shared/types/admin'
import type { Product } from '#shared/types/catalog'
import type { OrderStatus } from '#shared/types/order'
import type { UserRole } from '#shared/types/user'

/** Products created in the back office get ids above the API's, so they never collide. */
export const LOCAL_PRODUCT_ID_FROM = 10_000

/**
 * Back-office writes are simulated by the API (CDC §12.4), so their effect is kept here
 * and laid over every API list. Memory only, as the CDC asks (§12.1): a reload, or
 * « Réinitialiser la démo », brings back the API's data.
 */
export const useAdminOverridesStore = defineStore('adminOverrides', () => {
  const createdProducts = ref<Product[]>([])
  const editedProducts = ref<Record<number, Product>>({})
  const deletedProducts = ref<number[]>([])
  const userRoles = ref<Record<number, UserRole>>({})
  const deletedUsers = ref<number[]>([])
  const orderStatuses = ref<Record<string, OrderStatus>>({})

  const isLocalProduct = (id: number) => id >= LOCAL_PRODUCT_ID_FROM

  function applyProducts(products: readonly Product[]): Product[] {
    const deleted = new Set(deletedProducts.value)
    const fromApi = products.map((product) => editedProducts.value[product.id] ?? product)
    return [...createdProducts.value, ...fromApi].filter((product) => !deleted.has(product.id))
  }

  function nextProductId(): number {
    return Math.max(LOCAL_PRODUCT_ID_FROM - 1, ...createdProducts.value.map((product) => product.id)) + 1
  }

  function saveProduct(product: Product) {
    if (isLocalProduct(product.id)) {
      const others = createdProducts.value.filter((item) => item.id !== product.id)
      createdProducts.value = [product, ...others]
    } else {
      editedProducts.value = { ...editedProducts.value, [product.id]: product }
    }
  }

  function deleteProducts(ids: readonly number[]) {
    deletedProducts.value = [...new Set([...deletedProducts.value, ...ids])]
  }

  function applyUsers(users: readonly AdminUser[]): AdminUser[] {
    const deleted = new Set(deletedUsers.value)
    return users
      .filter((user) => !deleted.has(user.id))
      .map((user) => (userRoles.value[user.id] ? { ...user, role: userRoles.value[user.id]! } : user))
  }

  function setUserRole(id: number, role: UserRole) {
    userRoles.value = { ...userRoles.value, [id]: role }
  }

  function deleteUser(id: number) {
    deletedUsers.value = [...new Set([...deletedUsers.value, id])]
  }

  function applyOrders(orders: readonly AdminOrder[]): AdminOrder[] {
    return orders.map((order) =>
      orderStatuses.value[order.id] ? { ...order, status: orderStatuses.value[order.id]! } : order,
    )
  }

  function setOrderStatus(id: string, status: OrderStatus) {
    orderStatuses.value = { ...orderStatuses.value, [id]: status }
  }

  function reset() {
    createdProducts.value = []
    editedProducts.value = {}
    deletedProducts.value = []
    userRoles.value = {}
    deletedUsers.value = []
    orderStatuses.value = {}
  }

  return {
    createdProducts,
    editedProducts,
    deletedProducts,
    userRoles,
    deletedUsers,
    orderStatuses,
    isLocalProduct,
    applyProducts,
    nextProductId,
    saveProduct,
    deleteProducts,
    applyUsers,
    setUserRole,
    deleteUser,
    applyOrders,
    setOrderStatus,
    reset,
  }
})
