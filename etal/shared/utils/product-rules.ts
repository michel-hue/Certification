import type { Availability } from '../types/catalog'

/** Below this stock, cards show a « Stock faible » badge (home page mockup). */
export const LOW_STOCK_THRESHOLD = 10

/**
 * Almost every DummyJSON product carries a small discount. Below this percentage the
 * product is sold at its list price, so « −20 % » badges keep their meaning.
 */
export const PROMO_MIN_DISCOUNT = 10

export function toAvailability(stock: number): Availability {
  if (stock <= 0) return 'out_of_stock'
  if (stock < LOW_STOCK_THRESHOLD) return 'low_stock'
  return 'in_stock'
}
