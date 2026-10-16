import { z } from 'zod'

/**
 * Checkout forms (CDC §8.9). Messages are i18n keys, resolved by the form; the same
 * schemas would validate a real order endpoint server-side.
 */
const required = (max = 80) => z.string().trim().min(1, 'forms.required').max(max, 'forms.tooLong')

export const shippingDetailsSchema = z.object({
  firstName: required(),
  lastName: required(),
  email: z.email('forms.emailInvalid'),
  address: required(160),
  postalCode: z
    .string()
    .trim()
    .regex(/^\d{5}$/, 'checkout.errors.postalCode'),
  city: required(),
  phone: z
    .string()
    .trim()
    .regex(/^[\d +.]{8,20}$/, 'checkout.errors.phone')
    .or(z.literal(''))
    .optional(),
})

export type ShippingDetails = z.infer<typeof shippingDetailsSchema>

/** The only card number the demo accepts; nothing typed here leaves the browser. */
export const TEST_CARD_NUMBER = '4242424242424242'

export const paymentSchema = z.object({
  cardNumber: z
    .string()
    .transform((value) => value.replace(/\s/g, ''))
    .refine((value) => value === TEST_CARD_NUMBER, 'checkout.errors.testCardOnly'),
  holder: required(),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'checkout.errors.expiry'),
  cvc: z.string().regex(/^\d{3}$/, 'checkout.errors.cvc'),
})

export type PaymentDetails = z.input<typeof paymentSchema>

/** `4242424242424242` → `4242 4242 4242 4242`, digits only, 16 max. */
export function formatCardNumber(value: string): string {
  return value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim()
}

/** `1229` → `12/29`. */
export function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
}
