<script setup lang="ts">
/** Order recap beside the checkout (desktop), collapsible above it on mobile. */
const { t } = useI18n()
const { format } = usePrice()
const cart = useCartStore()
const { checkout } = useAppConfig()
const isDesktop = useMediaQuery('(min-width: 1024px)')
const expanded = ref(false)
const shown = computed(() => isDesktop.value || expanded.value)
const panelId = useId()
</script>

<template>
  <aside
    class="flex flex-col gap-4 rounded-md border border-border bg-surface p-6 lg:sticky lg:top-24"
    :aria-label="t('cart.summary')"
  >
    <button
      type="button"
      class="flex items-center justify-between gap-3 text-left lg:cursor-default"
      :aria-expanded="shown"
      :aria-controls="panelId"
      @click="expanded = !expanded"
    >
      <span class="font-serif text-[22px] font-medium">
        {{ t('cart.summary') }}
        <span class="font-sans text-body-sm font-normal text-foreground-muted">({{ cart.itemCount }})</span>
      </span>
      <span class="flex items-center gap-2 text-price font-medium tabular-nums">
        {{ format(cart.totals.total) }}
        <Icon
          name="lucide:chevron-down"
          class="size-4 transition-transform duration-150 lg:hidden"
          :class="expanded && 'rotate-180'"
          aria-hidden="true"
        />
      </span>
    </button>

    <div v-show="shown" :id="panelId" class="flex flex-col gap-4">
      <ul class="flex max-h-80 flex-col gap-3.5 overflow-y-auto">
        <li
          v-for="item in cart.items"
          :key="item.productId"
          class="grid grid-cols-[56px_minmax(0,1fr)_auto] items-center gap-3"
        >
          <span class="relative">
            <SharedProductImage :src="item.thumbnail.src" alt="" sizes="56px" />
            <span
              class="absolute -top-1.5 -right-1.5 h-5 min-w-5 rounded-full bg-primary px-1 text-center text-[11px] leading-5 text-primary-foreground tabular-nums"
              :aria-label="t('checkout.summary.quantity', { count: item.quantity })"
            >
              {{ item.quantity }}
            </span>
          </span>
          <span class="line-clamp-2 text-body-sm leading-[1.35]">{{ item.title }}</span>
          <span class="text-body-sm tabular-nums">
            {{ format({ ...item.unitPrice, amount: item.unitPrice.amount * item.quantity }) }}
          </span>
        </li>
      </ul>
      <div class="border-t border-border pt-4">
        <OrderTotals
          :totals="cart.totals"
          :method="cart.shippingMethod"
          :promo-label="t('cart.discountWithCode', { code: checkout.promo.code })"
          compact
        />
      </div>
    </div>
  </aside>
</template>
