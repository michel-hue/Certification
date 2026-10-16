<script setup lang="ts">
/** Mini-cart (E6): right drawer, opened from the header or right after an add. */
const { t } = useI18n()
const { format } = usePrice()
const cart = useCartStore()
const open = useCartDrawer()
const localePath = useLocalePath()

function go(path: string) {
  open.value = false
  return navigateTo(localePath(path))
}
</script>

<template>
  <UiDrawer v-model:open="open" :title="t('cart.title')">
    <template #title>
      {{ t('cart.title') }}
      <span class="font-sans text-body-sm font-normal text-foreground-muted tabular-nums"
        >({{ cart.itemCount }})</span
      >
    </template>

    <template v-if="!cart.isEmpty">
      <div class="border-b border-border px-6 py-4">
        <FreeShippingProgress
          :remaining="cart.totals.freeShippingRemaining"
          :progress="cart.totals.freeShippingProgress"
        />
      </div>
      <ul class="px-6">
        <CartLine
          v-for="item in cart.items"
          :key="item.productId"
          :item="item"
          compact
          @navigate="open = false"
        />
      </ul>
    </template>
    <SharedEmptyState
      v-else
      class="my-auto px-8"
      :title="t('cart.empty.title')"
      :illustration="t('cart.empty.illustration')"
      size="md"
    >
      <UiButton @click="go('/products')">{{ t('cart.empty.cta') }}</UiButton>
    </SharedEmptyState>

    <template v-if="!cart.isEmpty" #footer>
      <div class="flex items-baseline justify-between">
        <span class="text-body-sm text-foreground-muted">{{ t('cart.subtotal') }}</span>
        <span class="text-[20px] font-medium tabular-nums">{{ format(cart.totals.subtotal) }}</span>
      </div>
      <UiButton size="lg" block @click="go('/checkout')">{{ t('cart.checkout') }}</UiButton>
      <UiButton size="lg" variant="secondary" block @click="go('/cart')">{{ t('cart.seeCart') }}</UiButton>
    </template>
  </UiDrawer>
</template>
