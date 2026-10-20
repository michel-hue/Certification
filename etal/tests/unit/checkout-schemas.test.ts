import { describe, expect, it } from 'vitest'
import {
  formatCardNumber,
  formatExpiry,
  paymentSchema,
  shippingDetailsSchema,
} from '#shared/schemas/checkout'
import { zodTypedSchema } from '../../app/utils/zodForm'

const validDetails = {
  firstName: 'Emily',
  lastName: 'Johnson',
  email: 'emily@example.com',
  address: '12 rue des Halles',
  postalCode: '75001',
  city: 'Paris',
  phone: '',
}

describe('shippingDetailsSchema', () => {
  it('accepts a complete address with or without phone', () => {
    expect(shippingDetailsSchema.safeParse(validDetails).success).toBe(true)
    expect(shippingDetailsSchema.safeParse({ ...validDetails, phone: '+33 6 12 34 56 78' }).success).toBe(
      true,
    )
  })

  it.each([
    ['firstName', '   ', 'forms.required'],
    ['email', 'emily', 'forms.emailInvalid'],
    ['postalCode', '7500', 'checkout.errors.postalCode'],
    ['phone', 'abc', 'checkout.errors.phone'],
  ])('rejects %s = %j with the %s message key', (field, value, message) => {
    const result = shippingDetailsSchema.safeParse({ ...validDetails, [field]: value })
    expect(result.success).toBe(false)
    expect(result.error?.issues.some((issue) => issue.path[0] === field && issue.message === message)).toBe(
      true,
    )
  })
})

describe('paymentSchema', () => {
  const card = { cardNumber: '4242 4242 4242 4242', holder: 'Emily Johnson', expiry: '12/29', cvc: '123' }

  it('accepts only the test card, spaces ignored', () => {
    expect(paymentSchema.safeParse(card).success).toBe(true)
    const real = paymentSchema.safeParse({ ...card, cardNumber: '5555 5555 5555 4444' })
    expect(real.error?.issues[0]?.message).toBe('checkout.errors.testCardOnly')
  })

  it.each([
    ['expiry', '13/29'],
    ['expiry', '1229'],
    ['cvc', '12'],
    ['holder', ''],
  ])('rejects %s = %j', (field, value) => {
    expect(paymentSchema.safeParse({ ...card, [field]: value }).success).toBe(false)
  })
})

describe('input formatters', () => {
  it.each([
    ['4242424242424242', '4242 4242 4242 4242'],
    ['4242-4242 42', '4242 4242 42'],
    ['42424242424242429999', '4242 4242 4242 4242'],
    ['', ''],
  ])('formatCardNumber(%j) = %j', (input, expected) => {
    expect(formatCardNumber(input)).toBe(expected)
  })

  it.each([
    ['1', '1'],
    ['12', '12'],
    ['122', '12/2'],
    ['12/29', '12/29'],
    ['122999', '12/29'],
  ])('formatExpiry(%j) = %j', (input, expected) => {
    expect(formatExpiry(input)).toBe(expected)
  })
})

describe('zodTypedSchema', () => {
  const typed = zodTypedSchema(shippingDetailsSchema)

  it('returns the parsed value when valid', async () => {
    const result = await typed.parse({ ...validDetails, city: '  Paris  ' })
    expect(result.errors).toEqual([])
    expect(result.value?.city).toBe('Paris')
  })

  it('groups error messages by field path', async () => {
    const result = await typed.parse({ ...validDetails, email: 'nope', postalCode: '1' })
    expect(result.errors).toEqual(
      expect.arrayContaining([
        { path: 'email', errors: ['forms.emailInvalid'] },
        { path: 'postalCode', errors: ['checkout.errors.postalCode'] },
      ]),
    )
  })
})
