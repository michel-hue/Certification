<script setup lang="ts">
import type { Product } from '#shared/types/catalog'

/** Responsive grid (2 → 4 columns) with its loading state; `skeletons` sets the placeholder count. */
withDefaults(
  defineProps<{
    products?: readonly Product[]
    pending?: boolean
    skeletons?: number
    eagerCount?: number
  }>(),
  {
    products: () => [],
    skeletons: 8,
    eagerCount: 0,
  },
)

const { t } = useI18n()
</script>

<template>
  <div
    class="grid grid-cols-[repeat(auto-fill,minmax(min(100%,150px),1fr))] gap-x-4 gap-y-10 sm:grid-cols-[repeat(auto-fill,minmax(min(100%,220px),1fr))] sm:gap-x-6"
    :aria-busy="pending"
    :role="pending ? 'status' : undefined"
    :aria-label="pending ? t('catalog.loading') : undefined"
  >
    <template v-if="pending">
      <ProductCardSkeleton v-for="index in skeletons" :key="index" />
    </template>
    <ProductTile
      v-for="(product, index) in products"
      v-else
      :key="product.id"
      :product="product"
      :eager="index < eagerCount"
    />
  </div>
</template>
