import type { AdminUser } from '#shared/types/admin'
import type { User } from '#shared/types/user'
import type { DummyAdminUser, DummyUser } from './schemas'

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

/** DummyJSON writes birth dates without padding (`1996-5-30`). */
export function toIsoDate(value: string): string | undefined {
  const match = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(value)
  if (!match) return undefined
  const [, year, month, day] = match
  return `${year}-${month!.padStart(2, '0')}-${day!.padStart(2, '0')}`
}

export function toAdminUser(raw: DummyAdminUser, adminUserIds: readonly number[]): AdminUser {
  const { address, ...user } = toUser(raw, adminUserIds)
  const birthDate = raw.birthDate && toIsoDate(raw.birthDate)
  return {
    ...user,
    ...(birthDate && { birthDate }),
    ...(raw.company && { company: `${raw.company.name} · ${raw.company.title}` }),
    ...(address && { address: `${address.line1}, ${address.city}, ${address.country}` }),
  }
}
