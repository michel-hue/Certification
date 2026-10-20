import type { Product } from '#shared/types/catalog'

/**
 * Favourites (CDC §8.8), persisted locally. Whole products are kept so the wishlist page
 * renders without refetching; prices may lag behind the catalogue, which is fine for a demo.
 */
export const useWishlistStore = defineStore(
  'wishlist',
  () => {
    const products = ref<Product[]>([])

    const count = computed(() => products.value.length)
    const has = (productId: number) => products.value.some((product) => product.id === productId)

    /** Returns true when the product is now a favourite. */
    function toggle(product: Product): boolean {
      if (has(product.id)) {
        products.value = products.value.filter((item) => item.id !== product.id)
        return false
      }
      products.value.push(product)
      return true
    }

    function remove(productId: number) {
      products.value = products.value.filter((item) => item.id !== productId)
    }

    return { products, count, has, toggle, remove }
  },
  { persist: { storage: piniaPluginPersistedstate.localStorage() } },
)
