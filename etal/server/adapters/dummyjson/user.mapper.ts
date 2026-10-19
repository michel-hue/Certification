import type { User } from '#shared/types/user'
import type { DummyUser } from './schemas'

/**
 * Maps a DummyJSON user; passwords, tokens and other personal fields never leave the server.
 * The API's own `role` is not used: it marks several demo customers as admins, so the
 * back office is opened from a server-side list instead (CDC §13.2).
 */
export function toUser(raw: DummyUser, adminUserIds: readonly number[]): User {
  const isAdmin = adminUserIds.includes(raw.id)
  return {
    id: raw.id,
    username: raw.username,
    email: raw.email,
    firstName: raw.firstName,
    lastName: raw.lastName,
    role: isAdmin ? 'admin' : 'customer',
    ...(raw.image && { avatarUrl: raw.image }),
    ...(raw.phone && { phone: raw.phone }),
    ...(raw.address && {
      address: {
        line1: raw.address.address,
        city: raw.address.city,
        postalCode: raw.address.postalCode,
        country: raw.address.country,
      },
    }),
  }
}
