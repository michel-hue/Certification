<script setup lang="ts">
import type { ShippingMethod } from '#shared/types/order'
import type { CartTotals } from '../pricing'

/** Sous-total · Remise · Livraison · Total, shared by the cart page and the checkout summary. */
defineProps<{ totals: CartTotals; method: ShippingMethod; promoLabel?: string; compact?: boolean }>()

const { t } = useI18n()
const { format } = usePrice()
</script>

<template>
  <dl class="m-0 flex flex-col tabular-nums" :class="compact ? 'gap-2 text-body-sm' : 'gap-2.5 text-ui'">
    <div class="flex justify-between">
      <dt class="text-foreground-muted">{{ t('cart.subtotal') }}</dt>
      <dd class="m-0">{{ format(totals.subtotal) }}</dd>
    </div>
    <div v-if="totals.discount.amount" class="flex justify-between">
      <dt class="text-foreground-muted">{{ promoLabel ?? t('cart.discount') }}</dt>
      <dd class="m-0 text-accent-text">−{{ format(totals.discount) }}</dd>
    </div>
    <div class="flex justify-between">
      <dt class="text-foreground-muted">
        {{ t('cart.shippingLine', { method: t(`checkout.methods.${method}.label`) }) }}
      </dt>
      <dd class="m-0">{{ totals.shipping.amount ? format(totals.shipping) : t('cart.free') }}</dd>
    </div>
    <div class="mt-1 flex items-baseline justify-between border-t border-border pt-3.5">
      <dt class="font-semibold">{{ t('cart.total') }}</dt>
      <dd class="m-0 font-medium" :class="compact ? 'text-[20px]' : 'text-[22px]'">
        {{ format(totals.total) }}
      </dd>
    </div>
  </dl>
</template>
