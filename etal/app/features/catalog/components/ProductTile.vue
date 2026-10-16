<script setup lang="ts">
import type { Product } from '#shared/types/catalog'

/** ProductCard wired to the cart and wishlist stores. */
defineProps<{ product: Product; eager?: boolean; sizes?: string }>()

const { addToCart, toggleFavorite, isFavorite, isJustAdded } = useProductActions()
// Favourites come from localStorage: only known once mounted, so the server and the first
// client render agree (no hydration mismatch on the heart).
const mounted = useMounted()
</script>

<template>
  <ProductCard
    :product="product"
    :eager="eager"
    :sizes="sizes"
    :is-favorite="mounted && isFavorite(product.id)"
    :just-added="isJustAdded(product.id)"
    @add="addToCart"
    @toggle-favorite="toggleFavorite"
  />
</template>
