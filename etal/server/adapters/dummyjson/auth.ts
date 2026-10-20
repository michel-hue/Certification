import { z } from 'zod'
import type { Order } from '#shared/types/order'
import type { CurrencyCode } from '#shared/types/money'
import type { User } from '#shared/types/user'
import type { DummyJsonClient } from './client'
import { toOrderFromCart } from './cart.mapper'
import { dummyCartSchema, dummyUserSchema } from './schemas'
import { toUser } from './user.mapper'

/** Access tokens are short-lived on purpose: the refresh flow is part of the demo (CDC §13.1). */
export const ACCESS_TOKEN_MINUTES = 60

const tokensSchema = z.object({ accessToken: z.string().min(1), refreshToken: z.string().min(1) })
export type AuthTokens = z.infer<typeof tokensSchema>

const userCartsSchema = z.object({ carts: z.array(dummyCartSchema) })

export async function login(
  client: DummyJsonClient,
  credentials: { username: string; password: string },
): Promise<AuthTokens> {
  return client.send('POST', '/auth/login', tokensSchema, {
    ...credentials,
    expiresInMins: ACCESS_TOKEN_MINUTES,
  })
}

export async function refreshTokens(client: DummyJsonClient, refreshToken: string): Promise<AuthTokens> {
  return client.send('POST', '/auth/refresh', tokensSchema, {
    refreshToken,
    expiresInMins: ACCESS_TOKEN_MINUTES,
  })
}

export async function currentUser(
  client: DummyJsonClient,
  accessToken: string,
  adminUserIds: readonly number[],
): Promise<User> {
  const raw = await client.get('/auth/me', dummyUserSchema, { token: accessToken })
  return toUser(raw, adminUserIds)
}

/** DummyJSON simulates the creation and answers with a fresh id; nothing is stored. */
export async function registerUser(
  client: DummyJsonClient,
  input: { firstName: string; lastName: string; email: string },
): Promise<{ id: number }> {
  return client.send('POST', '/users/add', z.object({ id: z.number().int() }), input)
}

/** Simulated update: the API echoes the change but does not persist it. */
export async function updateUser(
  client: DummyJsonClient,
  id: number,
  changes: Record<string, unknown>,
  accessToken: string,
): Promise<void> {
  await client.send('PUT', `/users/${id}`, z.object({ id: z.number() }), changes, { token: accessToken })
}

export async function userOrders(
  client: DummyJsonClient,
  userId: number,
  currency: CurrencyCode,
): Promise<Order[]> {
  const raw = await client.get(`/carts/user/${userId}`, userCartsSchema)
  return raw.carts.map((cart) => toOrderFromCart(cart, currency))
}
