<script setup lang="ts">
import type { Money } from '#shared/types/money'

/** Current price, struck-through list price and optional « −20 % ». Terracotta only on promo. */
const props = withDefaults(
  defineProps<{
    price: Money
    compareAt?: Money
    discountPercent?: number
    size?: 'sm' | 'md' | 'lg'
    showPercent?: boolean
  }>(),
  { size: 'md' },
)

const { format } = usePrice()
const { t } = useI18n()
const onSale = computed(() => !!props.compareAt)
const sizes = {
  sm: { price: 'text-body-sm', old: 'text-caption' },
  md: { price: 'text-price', old: 'text-meta' },
  lg: { price: 'text-[28px]', old: 'text-price' },
} as const
</script>

<template>
  <span class="inline-flex flex-wrap items-baseline gap-x-2 gap-y-1 tabular-nums">
    <span class="font-medium" :class="[sizes[size].price, onSale ? 'text-accent-text' : 'text-foreground']">
      <span v-if="onSale" class="sr-only">{{ t('price.current') }}</span>
      {{ format(price) }}
    </span>
    <s v-if="compareAt" class="text-foreground-muted" :class="sizes[size].old">
      <span class="sr-only">{{ t('price.before') }}</span>
      {{ format(compareAt) }}
    </s>
    <span v-if="showPercent && discountPercent" class="text-meta font-semibold text-accent-text">
      {{ t('price.discount', { percent: discountPercent }) }}
    </span>
  </span>
</template>
