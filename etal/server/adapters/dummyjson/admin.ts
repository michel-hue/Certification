import { z } from 'zod'
import type { ProductWrite } from '#shared/schemas/admin'
import type { AdminOrder, AdminUser } from '#shared/types/admin'
import type { CurrencyCode } from '#shared/types/money'
import type { UserRole } from '#shared/types/user'
import { toOrderFromCart } from './cart.mapper'
import type { DummyJsonClient } from './client'
import { dummyCartSchema, dummyUserListSchema } from './schemas'
import { toAdminUser } from './user.mapper'

/** Only the fields the back office shows; DummyJSON otherwise sends bank and SSN details. */
const USER_FIELDS = 'id,username,email,firstName,lastName,image,role,phone,address,birthDate,company'

const cartListSchema = z.object({ carts: z.array(dummyCartSchema) })
/** DummyJSON echoes the written record; only the id matters here. */
const writeAckSchema = z.object({ id: z.number().int() })

export async function listUsers(
  client: DummyJsonClient,
  adminUserIds: readonly number[],
): Promise<AdminUser[]> {
  const raw = await client.get('/users', dummyUserListSchema, { query: { limit: 0, select: USER_FIELDS } })
  return raw.users.map((user) => toAdminUser(user, adminUserIds))
}

/** Every API cart as an order, with the customer's name taken from `users`. */
export async function listOrders(
  client: DummyJsonClient,
  users: readonly AdminUser[],
  currency: CurrencyCode,
): Promise<AdminOrder[]> {
  const raw = await client.get('/carts', cartListSchema, { query: { limit: 0 } })
  const names = new Map(users.map((user) => [user.id, `${user.firstName} ${user.lastName}`]))
  return raw.carts.map((cart) => ({
    ...toOrderFromCart(cart, currency),
    customer: names.get(cart.userId) ?? `#${cart.userId}`,
  }))
}

/** The writes below are simulated by DummyJSON: it answers as if it stored them (CDC §12.4). */
export async function addProduct(client: DummyJsonClient, product: ProductWrite): Promise<{ id: number }> {
  return client.send('POST', '/products/add', writeAckSchema, product)
}

export async function updateProduct(
  client: DummyJsonClient,
  id: number,
  product: ProductWrite,
): Promise<void> {
  await client.send('PUT', `/products/${id}`, writeAckSchema, product)
}

export async function deleteProduct(client: DummyJsonClient, id: number): Promise<void> {
  await client.send('DELETE', `/products/${id}`, writeAckSchema)
}

/** Étal's roles map onto DummyJSON's `admin` / `user`. */
export async function updateUserRole(client: DummyJsonClient, id: number, role: UserRole): Promise<void> {
  await client.send('PUT', `/users/${id}`, writeAckSchema, { role: role === 'admin' ? 'admin' : 'user' })
}

export async function deleteUser(client: DummyJsonClient, id: number): Promise<void> {
  await client.send('DELETE', `/users/${id}`, writeAckSchema)
}
