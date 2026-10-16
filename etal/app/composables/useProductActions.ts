import type { Product } from '#shared/types/catalog'

/** How long « Ajouté ✓ » stays on the button (mockup). */
const ADDED_FEEDBACK_MS = 1600
/** Duration of the header badge pulse (CDC graphique §10.2). */
const PULSE_MS = 220

/**
 * Add-to-cart and favourite behaviour shared by every product surface (cards, product
 * page): store update, button feedback, header badge pulse and toast.
 */
export function useProductActions() {
  const cart = useCartStore()
  const wishlist = useWishlistStore()
  const toast = useToast()
  const { t } = useI18n()

  const justAddedId = useState<number | null>('cart-just-added', () => null)
  const cartPulse = useState('cart-pulse', () => false)

  function addToCart(product: Product, quantity = 1) {
    const added = cart.add(product, quantity)
    if (added === 0) {
      toast.info(t('cart.stockLimit', { count: product.stock }))
      return
    }
    justAddedId.value = product.id
    cartPulse.value = true
    setTimeout(() => (cartPulse.value = false), PULSE_MS)
    setTimeout(() => {
      if (justAddedId.value === product.id) justAddedId.value = null
    }, ADDED_FEEDBACK_MS)
    toast.success(t('cart.added'))
  }

  function toggleFavorite(product: Product) {
    const isFavorite = wishlist.toggle(product)
    if (isFavorite) toast.success(t('wishlist.added'))
  }

  return {
    addToCart,
    toggleFavorite,
    isFavorite: (productId: number) => wishlist.has(productId),
    isJustAdded: (productId: number) => justAddedId.value === productId,
    cartPulse: readonly(cartPulse),
  }
}
