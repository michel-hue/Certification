<script setup lang="ts">
import { useMyOrders } from '~/features/account/composables/useMyOrders'

/** Order history (E16). */
const { t } = useI18n()
const { orders, pending, error, refresh } = useMyOrders()

useSeoMeta({ title: () => t('account.orders.title') })
</script>

<template>
  <div class="flex flex-col gap-10">
    <div class="flex flex-col gap-3">
      <p class="text-overline font-semibold text-foreground-muted uppercase">{{ t('account.title') }}</p>
      <h1 class="text-[clamp(2rem,1.5rem+2.4vw,3.25rem)] leading-[1.05] font-normal">
        {{ t('account.orders.title') }}
      </h1>
    </div>

    <SharedErrorState
      v-if="error && !orders.length"
      :title="t('account.orders.error')"
      :retrying="pending"
      @retry="refresh()"
    />
    <div v-else-if="pending && !orders.length" class="flex flex-col gap-3" aria-busy="true">
      <UiSkeleton v-for="index in 4" :key="index" class="h-16" />
    </div>
    <div v-else-if="orders.length">
      <OrderRow
        v-for="order in orders"
        :key="order.id"
        :order="order"
        :to="`/account/orders/${order.id}`"
        thumbnails
      />
    </div>
    <p v-else class="text-foreground-muted">{{ t('account.noOrders') }}</p>
  </div>
</template>
