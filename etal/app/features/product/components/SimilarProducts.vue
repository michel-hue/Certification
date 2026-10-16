<script setup lang="ts">
import type { Product } from '#shared/types/catalog'
import { useProducts } from '~/features/catalog/composables/useProducts'

/** « Vous aimerez aussi »: four products of the same category, the current one excluded. */
const props = defineProps<{ product: Product }>()

const { t } = useI18n()
const { data, pending } = useProducts(
  () => ({ category: props.product.category.slug, exclude: props.product.id, sort: 'rating', pageSize: 4 }),
  { lazy: true },
)
</script>

<template>
  <section v-if="pending || data?.items.length" class="flex flex-col gap-8 pt-section">
    <SharedSectionHeading
      :overline="t('product.similar.overline')"
      :title="t('product.similar.title')"
      :emphasis="t('product.similar.emphasis')"
    />
    <ProductGrid :products="data?.items" :pending="pending && !data" :skeletons="4" />
  </section>
</template>
