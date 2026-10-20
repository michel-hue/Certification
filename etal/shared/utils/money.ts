import type { CurrencyCode, Money } from '../types/money'

const MINOR_UNIT_DIGITS: Record<CurrencyCode, number> = { EUR: 2, XOF: 0 }

/** Fixed demo rate from the API's USD prices: Étal sells nothing, prices only need to be stable. */
const USD_TO_EUR = 0.92

/** The CFA franc is pegged to the euro at this exact parity. */
export const EUR_TO_XOF = 655.957

export const USD_EXCHANGE_RATES: Record<CurrencyCode, number> = {
  EUR: USD_TO_EUR,
  XOF: USD_TO_EUR * EUR_TO_XOF,
}

/** Converts an API price (USD, decimal) into integer minor units of `currency`. */
export function fromUsd(amountUsd: number, currency: CurrencyCode): Money {
  const factor = 10 ** MINOR_UNIT_DIGITS[currency]
  return { amount: Math.round(amountUsd * USD_EXCHANGE_RATES[currency] * factor), currency }
}

/** Converts a euro amount from the app config (thresholds, shipping fees) into minor units. */
export function fromEur(amountEur: number, currency: CurrencyCode): Money {
  const rate = currency === 'EUR' ? 1 : EUR_TO_XOF
  return { amount: Math.round(amountEur * rate * 10 ** MINOR_UNIT_DIGITS[currency]), currency }
}

/** Integer minor units from a typed amount, e.g. 12.4 → 1240 cents. */
export function fromMajorUnits(amount: number, currency: CurrencyCode): Money {
  return { amount: Math.round(amount * 10 ** MINOR_UNIT_DIGITS[currency]), currency }
}

export function toMajorUnits(money: Money): number {
  return money.amount / 10 ** MINOR_UNIT_DIGITS[money.currency]
}

/** Locale-aware price, e.g. `12,40 €` in fr-FR or `€12.40` in en-US. */
export function formatPrice(money: Money, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: money.currency,
    minimumFractionDigits: MINOR_UNIT_DIGITS[money.currency],
    maximumFractionDigits: MINOR_UNIT_DIGITS[money.currency],
  }).format(toMajorUnits(money))
}

/** Back to an API price (USD, two decimals), e.g. for a back-office edit sent to DummyJSON. */
export function toUsd(money: Money): number {
  return Math.round((toMajorUnits(money) / USD_EXCHANGE_RATES[money.currency]) * 100) / 100
}
