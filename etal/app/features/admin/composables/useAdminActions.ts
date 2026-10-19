import type { ProductFormValues } from '#shared/schemas/admin'
import type { AdminOrder, AdminUser } from '#shared/types/admin'
import type { Product } from '#shared/types/catalog'
import type { OrderStatus } from '#shared/types/order'
import type { UserRole } from '#shared/types/user'
import { productFromForm, toProductWrite } from '../product-form'
import { ADMIN_DATA_KEYS } from './useAdminData'

/**
 * Simulated writes (CDC §10.5, §12.4): the real API call first, then the optimistic local
 * update and a toast that says nothing was stored. Products created here have no
 * counterpart in DummyJSON, so their later edits stay local.
 */
export function useAdminActions() {
  const overrides = useAdminOverridesStore()
  const toast = useToast()
  const { t } = useI18n()
  const { currency } = useAppConfig()

  const demo = (message: string) => toast.success(`${message} · ${t('admin.demoNote')}`)
  const failed = () => toast.error(t('admin.writeFailed'))

  async function saveProduct(values: ProductFormValues, existing?: Product): Promise<Product | undefined> {
    const body = toProductWrite(values, currency)
    try {
      if (!existing) await $fetch('/api/admin/products', { method: 'POST', body })
      else if (!overrides.isLocalProduct(existing.id)) {
        await $fetch(`/api/admin/products/${existing.id}`, { method: 'PUT', body })
      }
    } catch {
      failed()
      return undefined
    }
    const product = productFromForm(values, {
      id: existing?.id ?? overrides.nextProductId(),
      currency,
      base: existing,
    })
    overrides.saveProduct(product)
    demo(t(existing ? 'admin.products.saved' : 'admin.products.created'))
    return product
  }

  async function deleteProducts(products: readonly Product[]): Promise<boolean> {
    try {
      await Promise.all(
        products
          .filter((product) => !overrides.isLocalProduct(product.id))
          .map((product) => $fetch(`/api/admin/products/${product.id}`, { method: 'DELETE' })),
      )
    } catch {
      failed()
      return false
    }
    overrides.deleteProducts(products.map((product) => product.id))
    demo(t('admin.products.deleted', { count: products.length }, products.length))
    return true
  }

  async function setUserRole(user: AdminUser, role: UserRole) {
    try {
      await $fetch(`/api/admin/users/${user.id}`, { method: 'PUT', body: { role } })
    } catch {
      return failed()
    }
    overrides.setUserRole(user.id, role)
    demo(t('admin.users.roleSaved'))
  }

  async function deleteUser(user: AdminUser): Promise<boolean> {
    try {
      await $fetch(`/api/admin/users/${user.id}`, { method: 'DELETE' })
    } catch {
      failed()
      return false
    }
    overrides.deleteUser(user.id)
    demo(t('admin.users.deleted'))
    return true
  }

  /** Statuses are fictitious (CDC §10.4): there is nothing to call. */
  function setOrderStatus(order: AdminOrder, status: OrderStatus) {
    overrides.setOrderStatus(order.id, status)
    demo(t('admin.orders.statusSaved'))
  }

  async function resetDemo() {
    overrides.reset()
    await refreshNuxtData([...ADMIN_DATA_KEYS])
    toast.info(t('admin.resetDone'))
  }

  return { saveProduct, deleteProducts, setUserRole, deleteUser, setOrderStatus, resetDemo }
}
