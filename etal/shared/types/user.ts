export type UserRole = 'customer' | 'admin'

export interface Address {
  line1: string
  city: string
  postalCode: string
  country: string
}

export interface User {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  avatarUrl?: string
  role: UserRole
  phone?: string
  address?: Address
}
