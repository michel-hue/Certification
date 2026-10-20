import { describe, expect, it } from 'vitest'
import { formatPrice, fromUsd, toMajorUnits } from '#shared/utils/money'

describe('fromUsd', () => {
  it('converts to integer euro cents', () => {
    expect(fromUsd(9.99, 'EUR')).toEqual({ amount: 919, currency: 'EUR' })
  })

  it('converts to whole CFA francs, which have no minor unit', () => {
    expect(fromUsd(9.99, 'XOF')).toEqual({ amount: 6029, currency: 'XOF' })
  })

  it('keeps zero prices at zero', () => {
    expect(fromUsd(0, 'EUR').amount).toBe(0)
  })
})

describe('toMajorUnits', () => {
  it('turns cents back into euros', () => {
    expect(toMajorUnits({ amount: 1240, currency: 'EUR' })).toBe(12.4)
  })
})

describe('formatPrice', () => {
  // Intl uses narrow no-break spaces in fr-FR; normalise them to compare readable strings.
  const normalise = (value: string) => value.replace(/\s/g, ' ')

  it('formats euros the French way', () => {
    expect(normalise(formatPrice({ amount: 1240, currency: 'EUR' }, 'fr-FR'))).toBe('12,40 €')
  })

  it('formats euros the English way', () => {
    expect(formatPrice({ amount: 1240, currency: 'EUR' }, 'en-US')).toBe('€12.40')
  })

  it('formats five-digit prices with grouping', () => {
    expect(normalise(formatPrice({ amount: 1_234_500, currency: 'EUR' }, 'fr-FR'))).toBe('12 345,00 €')
  })

  it('formats CFA francs without decimals', () => {
    expect(normalise(formatPrice({ amount: 6029, currency: 'XOF' }, 'fr-FR'))).toBe('6 029 F CFA')
  })
})
