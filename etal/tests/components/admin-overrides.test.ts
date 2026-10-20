import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import type { AdminOrder, AdminUser } from '#shared/types/admin'
import { sampleProducts } from '~/design/showcase-products'
import { LOCAL_PRODUCT_ID_FROM, useAdminOverridesStore } from '~/stores/adminOverrides'

beforeEach(() => setActivePinia(createPinia()))

const user = (id: number): AdminUser => ({
  id,
  username: `u${id}`,
  email: `u${id}@example.com`,
  firstName: 'U',
  lastName: String(id),
  role: 'customer',
})

describe('admin overrides store', () => {
  it('lays created, edited and deleted products over the API list', () => {
    const store = useAdminOverridesStore()
    const [first, second] = sampleProducts
    const id = store.nextProductId()
    expect(id).toBe(LOCAL_PRODUCT_ID_FROM)

    store.saveProduct({ ...first!, id, title: 'Nouveau' })
    store.saveProduct({ ...first!, title: 'Renommé' })
    store.deleteProducts([second!.id])
    expect(store.nextProductId()).toBe(id + 1)

    const list = store.applyProducts(sampleProducts)
    expect(list.map((product) => product.title).slice(0, 2)).toEqual(['Nouveau', 'Renommé'])
    expect(list.some((product) => product.id === second!.id)).toBe(false)

    store.saveProduct({ ...first!, id, title: 'Nouveau 2' })
    expect(store.createdProducts).toHaveLength(1)
    expect(store.isLocalProduct(id)).toBe(true)
  })

  it('changes roles, removes users and overrides order statuses until reset', () => {
    const store = useAdminOverridesStore()
    store.setUserRole(2, 'admin')
    store.deleteUser(3)
    store.setOrderStatus('ET-C0001', 'delivered')

    expect(store.applyUsers([user(2), user(3)])).toEqual([{ ...user(2), role: 'admin' }])
    const order = { id: 'ET-C0001', status: 'pending' } as AdminOrder
    expect(store.applyOrders([order])[0]?.status).toBe('delivered')

    store.reset()
    expect(store.applyUsers([user(2)])[0]?.role).toBe('customer')
    expect(store.applyOrders([order])[0]?.status).toBe('pending')
  })
})
