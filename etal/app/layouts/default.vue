<script setup lang="ts">
const route = useRoute()
const { t } = useI18n()
const checkout = computed(() => route.meta.checkoutChrome === true)

const cart = useCartStore()
const wishlist = useWishlistStore()
const { cartPulse } = useProductActions()
// Both stores restore from localStorage on the client only; counting before mount would
// make the server and client renders disagree.
const mounted = useMounted()
</script>

<template>
  <div class="flex min-h-dvh flex-col">
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
    >
      {{ t('a11y.skipToContent') }}
    </a>
    <LayoutDemoBanner />
    <LayoutAppHeader
      :overlay="route.meta.headerOverlay === true"
      :minimal="checkout"
      :cart-count="mounted ? cart.itemCount : 0"
      :wishlist-count="mounted ? wishlist.count : 0"
      :cart-pulse="cartPulse"
    />
    <main id="main" class="flex-1">
      <slot />
    </main>
    <LayoutAppFooter v-if="!checkout" />
    <CartDrawer />
  </div>
</template>
