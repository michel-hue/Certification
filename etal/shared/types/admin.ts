import type { Order } from './order'
import type { UserRole } from './user'

/** A user as the back office lists it (CDC §10.3); never carries credentials. */
export interface AdminUser {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  avatarUrl?: string
  role: UserRole
  phone?: string
  /** ISO date (`1996-05-30`). */
  birthDate?: string
  company?: string
  /** One line: « 626 Main Street, Phoenix, United States ». */
  address?: string
}

/** An order with the customer's name, for the back-office tables (CDC §10.4). */
export interface AdminOrder extends Order {
  customer: string
}
