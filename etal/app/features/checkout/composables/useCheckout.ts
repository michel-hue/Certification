import type { ShippingDetails } from '#shared/schemas/checkout'

export type CheckoutStep = 1 | 2

/**
 * Checkout progress shared by the steps. Shipping details survive going back and forth
 * between steps (and a mini-cart detour); payment details are never stored anywhere.
 */
export function useCheckout() {
  const step = useState<CheckoutStep>('checkout-step', () => 1)
  const details = useState<ShippingDetails | null>('checkout-details', () => null)

  function reset() {
    step.value = 1
    details.value = null
  }

  return { step, details, reset }
}
