<script setup lang="ts">
import type { Money } from '#shared/types/money'

/** « Plus que 12,40 € pour la livraison offerte » + terracotta bar (CDC graphique §11.4). */
const props = defineProps<{ remaining: Money; progress: number }>()

const { t } = useI18n()
const { format } = usePrice()
const reached = computed(() => props.remaining.amount === 0)
</script>

<template>
  <div class="flex flex-col gap-2.5">
    <p class="text-body-sm" aria-live="polite">
      <template v-if="reached">
        {{ t('cart.freeShippingReached') }}
        <Icon name="lucide:check" class="inline size-4 align-[-2px] text-success" aria-hidden="true" />
      </template>
      <template v-else>{{ t('cart.freeShippingRemaining', { amount: format(remaining) }) }}</template>
    </p>
    <div
      class="h-1 overflow-hidden rounded-sm bg-surface-muted"
      role="progressbar"
      :aria-valuenow="Math.round(progress * 100)"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-label="t('cart.freeShippingProgress')"
    >
      <div
        class="h-full bg-accent transition-[width] duration-400 ease-emphasized motion-reduce:transition-none"
        :style="{ width: `${progress * 100}%` }"
      />
    </div>
  </div>
</template>
