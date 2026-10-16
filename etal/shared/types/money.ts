export type CurrencyCode = 'EUR' | 'XOF'

/** Amount in minor units (cents for EUR, whole francs for XOF) — integers only, no float rounding. */
export interface Money {
  amount: number
  currency: CurrencyCode
}
