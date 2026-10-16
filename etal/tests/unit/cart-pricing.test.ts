import { describe, expect, it } from 'vitest'
import {
  clampQuantity,
  computeTotals,
  isPromoCode,
  type CartItem,
  type CheckoutRules,
  type ShippingMethod,
} from '../../app/features/cart/pricing'

const rules: CheckoutRules = {
  freeShippingFromEur: 50,
  promo: { code: 'PORTFOLIO10', percent: 10 },
  shippingEur: { standard: 4.9, relay: 2.9, express: 9.9 },
}

const item = (cents: number, quantity: number, productId = cents): CartItem => ({
  productId,
  slug: 'item',
  title: 'Item',
  eyebrow: 'Brand',
  thumbnail: { src: '', alt: '' },
  unitPrice: { amount: cents, currency: 'EUR' },
  stock: 10,
  quantity,
})

const totals = (items: CartItem[], promoApplied = false, method: ShippingMethod = 'standard') =>
  computeTotals(items, { currency: 'EUR', rules, promoApplied, method })

describe('clampQuantity', () => {
  it.each([
    [0, 5, 1],
    [3, 5, 3],
    [9, 5, 5],
    [2.7, 5, 2],
    [4, 0, 0],
  ])('clamp(%d, stock %d) = %d', (quantity, stock, expected) => {
    expect(clampQuantity(quantity, stock)).toBe(expected)
  })
})

describe('isPromoCode', () => {
  it('accepts the demo code whatever the case and spacing', () => {
    expect(isPromoCode(' portfolio10 ', rules)).toBe(true)
    expect(isPromoCode('PORTFOLIO20', rules)).toBe(false)
  })
})

describe('computeTotals', () => {
  it('is all zero for an empty cart, shipping included', () => {
    expect(totals([])).toMatchObject({
      itemCount: 0,
      subtotal: { amount: 0 },
      shipping: { amount: 0 },
      total: { amount: 0 },
    })
  })

  it('adds standard shipping below the free threshold', () => {
    const result = totals([item(999, 2)])
    expect(result).toMatchObject({
      itemCount: 2,
      subtotal: { amount: 1998 },
      shipping: { amount: 490 },
      total: { amount: 2488 },
      freeShippingRemaining: { amount: 3002 },
    })
    expect(result.freeShippingProgress).toBeCloseTo(0.3996)
  })

  it('offers standard and relay delivery from 50 €, never express', () => {
    const cart = [item(2500, 2)]
    expect(totals(cart, false, 'standard').shipping.amount).toBe(0)
    expect(totals(cart, false, 'relay').shipping.amount).toBe(0)
    expect(totals(cart, false, 'express').shipping.amount).toBe(990)
    expect(totals(cart).freeShippingProgress).toBe(1)
  })

  it('applies the promo before the threshold and rounds the discount once', () => {
    const result = totals([item(1999, 3)], true)
    // 59,97 − 6,00 = 53,97 ≥ 50: still free.
    expect(result).toMatchObject({
      discount: { amount: 600 },
      shipping: { amount: 0 },
      total: { amount: 5397 },
    })

    const below = totals([item(2700, 2)], true)
    // 54,00 − 5,40 = 48,60 < 50: shipping is due again.
    expect(below).toMatchObject({
      discount: { amount: 540 },
      shipping: { amount: 490 },
      total: { amount: 5350 },
    })
  })

  it('keeps subtotal − discount + shipping equal to the total, to the cent', () => {
    for (const cents of [1, 333, 999, 1999, 4999, 12345]) {
      const result = totals([item(cents, 3), item(cents + 7, 1, cents + 100_000)], true, 'relay')
      expect(result.subtotal.amount - result.discount.amount + result.shipping.amount).toBe(
        result.total.amount,
      )
    }
  })

  it('converts thresholds and fees for CFA francs', () => {
    const result = computeTotals([item(10_000, 1)], {
      currency: 'XOF',
      rules,
      promoApplied: false,
      method: 'standard',
    })
    // 50 € = 32 798 F CFA; 4,90 € = 3 214 F CFA.
    expect(result.shipping).toEqual({ amount: 3214, currency: 'XOF' })
    expect(result.freeShippingRemaining.amount).toBe(32_798 - 10_000)
  })
})
