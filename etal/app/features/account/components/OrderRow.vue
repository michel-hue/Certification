<script setup lang="ts">
import type { Order } from '#shared/types/order'

/** One order in a list: stacked thumbnails, number, date · item count, status, total. */
const props = defineProps<{ order: Order; to: string; thumbnails?: boolean }>()

const { t, d } = useI18n()
const { format } = usePrice()
const count = computed(() => props.order.lines.reduce((sum, line) => sum + line.quantity, 0))
</script>

<template>
  <NuxtLinkLocale
    :to="to"
    class="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-4 border-b border-border py-4 transition-colors duration-150 hover:bg-background"
  >
    <span class="flex min-w-0 items-center gap-3.5">
      <span v-if="thumbnails" class="flex shrink-0" aria-hidden="true">
        <span
          v-for="line in order.lines.slice(0, 3)"
          :key="line.productId"
          class="-mr-2.5 w-10 rounded-md border-2 border-background last:mr-0"
        >
          <SharedProductImage :src="line.thumbnail.src" alt="" sizes="40px" />
        </span>
      </span>
      <span class="flex min-w-0 flex-col gap-0.5" :class="thumbnails && 'pl-4'">
        <span class="font-medium tabular-nums">{{ order.id }}</span>
        <span class="text-meta text-foreground-muted">
          {{ d(new Date(order.createdAt), 'long') }} · {{ t('orders.items', { count }, count) }}
        </span>
      </span>
    </span>
    <OrderStatusBadge :status="order.status" />
    <span class="font-medium tabular-nums">{{ format(order.total) }}</span>
  </NuxtLinkLocale>
</template>
