<script setup lang="ts">
import type { ProductListQuery } from '#shared/schemas/catalog'
import type { CatalogPatch } from '../composables/useCatalogQuery'

/** Chips for the active refinements, each removable, plus « Tout effacer ». */
const props = defineProps<{ query: ProductListQuery }>()
const emit = defineEmits<{ update: [patch: CatalogPatch]; reset: [] }>()

const { t, n } = useI18n()
const { format } = usePrice()
const { currency } = useAppConfig()

const price = (value: number) =>
  format({ amount: Math.round(value * (currency === 'XOF' ? 1 : 100)), currency })

const chips = computed(() => {
  const query = props.query
  const list: { label: string; patch: CatalogPatch }[] = []
  for (const brand of query.brands ?? []) {
    list.push({ label: brand, patch: { brands: (query.brands ?? []).filter((item) => item !== brand) } })
  }
  if (query.min !== undefined || query.max !== undefined) {
    list.push({
      label: t('filters.priceRange', {
        min: query.min !== undefined ? price(query.min) : '0',
        max: query.max !== undefined ? price(query.max) : '∞',
      }),
      patch: { min: null, max: null },
    })
  }
  if (query.rating !== undefined) {
    list.push({
      label: t('filters.ratingAtLeast', { value: n(query.rating, { maximumFractionDigits: 1 }) }),
      patch: { rating: null },
    })
  }
  if (query.stock) list.push({ label: t('filters.inStockShort'), patch: { stock: null } })
  if (query.promo) list.push({ label: t('filters.onSale'), patch: { promo: null } })
  return list
})

defineExpose({ count: computed(() => chips.value.length) })
</script>

<template>
  <div v-if="chips.length" class="flex flex-wrap items-center gap-2 pt-4">
    <UiChip
      v-for="chip in chips"
      :key="chip.label"
      :label="chip.label"
      removable
      :remove-label="t('filters.remove', { label: chip.label })"
      @remove="emit('update', chip.patch)"
    />
    <UiButton variant="link" size="sm" class="text-meta!" @click="emit('reset')">{{
      t('filters.clearAll')
    }}</UiButton>
  </div>
</template>
