import type { Product } from '#shared/types/catalog'
import {
  clampQuantity,
  computeTotals,
  isPromoCode,
  type CartItem,
  type ShippingMethod,
} from '~/features/cart/pricing'

/**
 * Cart (CDC §12.2): persisted in localStorage so it survives a reload — the old app's
 * main bug. Pricing lives in `features/cart/pricing.ts`; this store only owns the state.
 */
export const useCartStore = defineStore(
  'cart',
  () => {
    const { currency, checkout } = useAppConfig()

    const items = ref<CartItem[]>([])
    const promoApplied = ref(false)
    const shippingMethod = ref<ShippingMethod>('standard')

    const totals = computed(() =>
      computeTotals(items.value, {
        currency,
        rules: checkout,
        promoApplied: promoApplied.value,
        method: shippingMethod.value,
      }),
    )
    const itemCount = computed(() => totals.value.itemCount)
    const isEmpty = computed(() => items.value.length === 0)

    function find(productId: number) {
      return items.value.find((item) => item.productId === productId)
    }

    /** Adds up to the available stock; returns the quantity actually added. */
    function add(product: Product, quantity = 1): number {
      if (product.stock <= 0) return 0
      const existing = find(product.id)
      if (existing) {
        const next = clampQuantity(existing.quantity + quantity, product.stock)
        const added = next - existing.quantity
        existing.quantity = next
        existing.stock = product.stock
        return added
      }
      const initial = clampQuantity(quantity, product.stock)
      items.value.push({
        productId: product.id,
        slug: product.slug,
        title: product.title,
        eyebrow: product.brand ?? product.category.name,
        thumbnail: product.thumbnail,
        unitPrice: product.price,
        stock: product.stock,
        quantity: initial,
      })
      return initial
    }

    function updateQuantity(productId: number, quantity: number) {
      const item = find(productId)
      if (item) item.quantity = clampQuantity(quantity, item.stock)
    }

    /** Removes a line and returns what `restore` needs for an « Annuler » toast. */
    function remove(productId: number): { item: CartItem; index: number } | undefined {
      const index = items.value.findIndex((item) => item.productId === productId)
      if (index === -1) return undefined
      const [item] = items.value.splice(index, 1)
      return item ? { item, index } : undefined
    }

    function restore(removed: { item: CartItem; index: number }) {
      if (find(removed.item.productId)) return
      items.value.splice(Math.min(removed.index, items.value.length), 0, removed.item)
    }

    function clear() {
      items.value = []
      promoApplied.value = false
    }

    function applyPromo(code: string): boolean {
      promoApplied.value = isPromoCode(code, checkout)
      return promoApplied.value
    }

    function removePromo() {
      promoApplied.value = false
    }

    return {
      items,
      promoApplied,
      shippingMethod,
      totals,
      itemCount,
      isEmpty,
      add,
      updateQuantity,
      remove,
      restore,
      clear,
      applyPromo,
      removePromo,
    }
  },
  { persist: { storage: piniaPluginPersistedstate.localStorage() } },
)
