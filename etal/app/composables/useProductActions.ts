import type { Product } from '#shared/types/catalog'

/** How long « Ajouté ✓ » stays on the button (mockup). */
const ADDED_FEEDBACK_MS = 1600
/** Duration of the header badge pulse (CDC graphique §10.2). */
const PULSE_MS = 220
/** The mini-cart opens once the button has said « Ajouté ✓ » (mockup). */
const DRAWER_DELAY_MS = 500

/** Mini-cart drawer state, shared by the header, product surfaces and the layout. */
export function useCartDrawer() {
  return useState('cart-drawer-open', () => false)
}

/**
 * Add-to-cart and favourite behaviour shared by every product surface (cards, product
 * page): store update, button feedback, header badge pulse, then the mini-cart.
 */
export function useProductActions() {
  const cart = useCartStore()
  const wishlist = useWishlistStore()
  const toast = useToast()
  const { t } = useI18n()
  const drawerOpen = useCartDrawer()
  const localePath = useLocalePath()

  const justAddedId = useState<number | null>('cart-just-added', () => null)
  const cartPulse = useState('cart-pulse', () => false)

  function addToCart(product: Product, quantity = 1, options: { openDrawer?: boolean } = {}) {
    const added = cart.add(product, quantity)
    if (added === 0) {
      toast.info(t('cart.stockLimit', { count: product.stock }))
      return 0
    }
    justAddedId.value = product.id
    cartPulse.value = true
    setTimeout(() => (cartPulse.value = false), PULSE_MS)
    setTimeout(() => {
      if (justAddedId.value === product.id) justAddedId.value = null
    }, ADDED_FEEDBACK_MS)
    if (options.openDrawer !== false) setTimeout(() => (drawerOpen.value = true), DRAWER_DELAY_MS)
    return added
  }

  function toggleFavorite(product: Product) {
    const isFavorite = wishlist.toggle(product)
    if (isFavorite) {
      toast.success(t('wishlist.added'), {
        label: t('wishlist.see'),
        altText: t('wishlist.seeAlt'),
        run: () => navigateTo(localePath('/wishlist')),
      })
    }
  }

  return {
    addToCart,
    toggleFavorite,
    isFavorite: (productId: number) => wishlist.has(productId),
    isJustAdded: (productId: number) => justAddedId.value === productId,
    cartPulse: readonly(cartPulse),
  }
}
