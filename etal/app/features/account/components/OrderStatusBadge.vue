<script setup lang="ts">
import type { OrderStatus } from '#shared/types/order'

/** Outlined status pill; the colour always comes with the word (CDC graphique §14). */
defineProps<{ status: OrderStatus }>()

const { t } = useI18n()
const tones = {
  pending: 'border-border-strong text-foreground-muted',
  preparing: 'border-warning text-warning',
  shipped: 'border-info text-info',
  delivered: 'border-success text-success',
} as const
</script>

<template>
  <span
    class="rounded-sm border px-2 py-0.5 text-caption font-medium whitespace-nowrap"
    :class="tones[status]"
  >
    {{ t(`orders.status.${status}`) }}
  </span>
</template>
