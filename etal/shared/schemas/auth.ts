import { z } from 'zod'
import { passwordScore } from '../utils/password'

/** Messages are i18n keys, resolved by the forms. */
const name = z.string().trim().min(1, 'forms.required').max(60, 'forms.tooLong')

export const loginSchema = z.object({
  username: z.string().trim().min(1, 'auth.errors.username').max(60),
  password: z.string().min(1, 'auth.errors.password').max(120),
  remember: z.boolean().default(true),
})
export type LoginInput = z.input<typeof loginSchema>

/** « Solide » or better on the strength meter (score ≥ 3), as the mockup requires. */
export const MIN_PASSWORD_SCORE = 3

export const registerSchema = z
  .object({
    firstName: name,
    lastName: name,
    email: z.email('forms.emailInvalid'),
    password: z
      .string()
      .max(120)
      .refine((value) => passwordScore(value) >= MIN_PASSWORD_SCORE, 'auth.errors.weakPassword'),
    confirm: z.string(),
    terms: z.boolean().refine((value) => value, 'auth.errors.terms'),
  })
  .refine((value) => value.confirm === value.password, { path: ['confirm'], message: 'auth.errors.mismatch' })
export type RegisterInput = z.input<typeof registerSchema>

export const profileSchema = z.object({
  firstName: name,
  lastName: name,
  email: z.email('forms.emailInvalid'),
  phone: z
    .string()
    .trim()
    .regex(/^[\d +().-]{8,24}$/, 'checkout.errors.phone')
    .or(z.literal(''))
    .optional(),
})
export type ProfileInput = z.input<typeof profileSchema>

/**
 * Only same-site paths are followed after login (`/account/orders`), never `//evil.tld`
 * or `https://…`: an open redirect would turn the login page into a phishing relay.
 */
export function safeRedirect(value: unknown, fallback = '/account'): string {
  if (typeof value !== 'string') return fallback
  if (!value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) return fallback
  return value
}
