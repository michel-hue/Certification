<script setup lang="ts">
import type { ProductDetail } from '#shared/types/catalog'

/** Purchase block of the product page (CDC graphique §11.4 « ProductInfo »). */
const props = defineProps<{ product: ProductDetail }>()
const emit = defineEmits<{ 'show-reviews': [] }>()

const { t, n } = useI18n()
const { format } = usePrice()
const categoryName = useCategoryName()
const { addToCart, toggleFavorite, isFavorite, isJustAdded } = useProductActions()
const mounted = useMounted()

const quantity = ref(1)
const outOfStock = computed(() => props.product.availability === 'out_of_stock')
const favorite = computed(() => mounted.value && isFavorite(props.product.id))
const lineTotal = computed(() => ({
  ...props.product.price,
  amount: props.product.price.amount * quantity.value,
}))
const summary = computed(() => {
  const firstSentence = props.product.description.split('. ')[0] ?? ''
  return firstSentence.endsWith('.') ? firstSentence : `${firstSentence}.`
})

const stock = computed(() => {
  if (outOfStock.value) return { label: t('product.stock.out'), tone: 'text-danger' }
  if (props.product.availability === 'low_stock') {
    return {
      label: t('product.stock.low', { count: props.product.stock }, props.product.stock),
      tone: 'text-warning',
    }
  }
  return { label: t('product.stock.in'), tone: 'text-success' }
})

const addLabel = computed(() => {
  if (isJustAdded(props.product.id)) return t('product.added')
  if (outOfStock.value) return t('product.soldOut')
  return t('product.addWithTotal', { total: format(lineTotal.value) })
})
</script>

<template>
  <div class="flex min-w-0 flex-col gap-5 lg:sticky lg:top-24">
    <p class="text-overline font-semibold text-foreground-muted uppercase">
      {{ product.brand ?? categoryName(product.category) }}
    </p>
    <h1 class="-mt-2 text-[clamp(2rem,1.5rem+2vw,3rem)] leading-[1.08] tracking-[-0.015em] text-balance">
      {{ product.title }}
    </h1>
    <button
      type="button"
      class="flex cursor-pointer items-center gap-2 self-start text-body-sm"
      @click="emit('show-reviews')"
    >
      <UiRatingStars :value="product.rating.average" />
      <span class="tabular-nums" aria-hidden="true">
        {{ n(product.rating.average, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) }}
      </span>
      <span class="text-foreground-muted underline underline-offset-3">
        {{ t('product.reviewCount', { count: product.rating.count }, product.rating.count) }}
      </span>
    </button>

    <SharedPrice
      :price="product.price"
      :compare-at="product.compareAtPrice"
      :discount-percent="product.discountPercent"
      size="lg"
      show-percent
    />
    <p class="text-pretty text-foreground-muted">{{ summary }}</p>
    <p class="flex items-center gap-2 text-body-sm font-medium" :class="stock.tone">
      <span class="size-2 rounded-full bg-current" aria-hidden="true" />
      {{ stock.label }}
    </p>

    <div class="flex flex-wrap gap-3 pt-1">
      <UiQuantityStepper v-if="!outOfStock" v-model="quantity" :max="product.stock" size="lg" />
      <UiButton
        size="lg"
        class="flex-[1_1_200px]"
        :disabled="outOfStock"
        @click="addToCart(product, quantity)"
      >
        <span aria-live="polite">{{ addLabel }}</span>
      </UiButton>
      <button
        type="button"
        class="flex size-13 cursor-pointer items-center justify-center rounded-md border border-foreground transition-colors duration-150 hover:bg-surface-muted"
        :class="favorite ? 'text-accent' : 'text-foreground'"
        :aria-label="favorite ? t('product.removeFavorite') : t('product.addFavorite')"
        :aria-pressed="favorite"
        @click="toggleFavorite(product)"
      >
        <Icon :name="favorite ? 'etal:heart-filled' : 'lucide:heart'" class="size-5" aria-hidden="true" />
      </button>
    </div>

    <ul class="mt-2 flex flex-col gap-2.5 border-t border-border pt-5 text-body-sm text-foreground-muted">
      <li
        v-for="item in [
          t('product.reassure.shipping'),
          t('product.reassure.returns'),
          product.warranty || t('product.reassure.warranty'),
        ]"
        :key="item"
        class="flex items-start gap-2.5"
      >
        <Icon name="lucide:check" class="mt-[3px] size-4 shrink-0 text-foreground" aria-hidden="true" />
        {{ item }}
      </li>
    </ul>
  </div>
</template>
