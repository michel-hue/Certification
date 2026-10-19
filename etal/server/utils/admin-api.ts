import type { H3Event } from 'h3'
import type { AdminOrder, AdminUser } from '#shared/types/admin'
import type { CurrencyCode } from '#shared/types/money'
import { listOrders, listUsers } from '../adapters/dummyjson/admin'
import { createDummyJsonClient } from '../adapters/dummyjson/client'

/**
 * Users and carts change only through simulated writes, so the back office reads them
 * from a 10-minute cache, like the catalogue (CDC §14.1).
 */
const cachedUsers = defineCachedFunction(
  async (apiBaseUrl: string, adminIds: string): Promise<AdminUser[]> =>
    listUsers(createDummyJsonClient(apiBaseUrl, $fetch), adminIds.split(',').map(Number)),
  { name: 'admin-users', maxAge: 60 * 10, swr: true, getKey: (_url: string, adminIds: string) => adminIds },
)

const cachedOrders = defineCachedFunction(
  async (apiBaseUrl: string, adminIds: string, currency: CurrencyCode): Promise<AdminOrder[]> => {
    const client = createDummyJsonClient(apiBaseUrl, $fetch)
    return listOrders(client, await cachedUsers(apiBaseUrl, adminIds), currency)
  },
  {
    name: 'admin-orders',
    maxAge: 60 * 10,
    swr: true,
    getKey: (_url: string, adminIds: string, currency: CurrencyCode) => `${adminIds}:${currency}`,
  },
)

export function getAdminUsers(event: H3Event): Promise<AdminUser[]> {
  return cachedUsers(useRuntimeConfig(event).apiBaseUrl, adminUserIds(event).join(','))
}

export function getAdminOrders(event: H3Event): Promise<AdminOrder[]> {
  const { currency } = useAppConfig()
  return cachedOrders(useRuntimeConfig(event).apiBaseUrl, adminUserIds(event).join(','), currency)
}
