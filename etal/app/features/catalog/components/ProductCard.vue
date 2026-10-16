<script setup lang="ts">
import type { Product } from '#shared/types/catalog'
import { toProductParam } from '#shared/utils/slug'

/**
 * Product card (CDC graphique §11.4). Presentational: the parent decides what « add » and
 * « favourite » do. The whole card is one link (stretched title), while the two buttons
 * stay separate tab stops above it.
 */
const props = withDefaults(
  defineProps<{
    product: Product
    isFavorite?: boolean
    /** Shows « Ajouté ✓ » for a moment after an add to cart. */
    justAdded?: boolean
    eager?: boolean
    sizes?: string
  }>(),
  { sizes: '(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw' },
)
const emit = defineEmits<{ add: [product: Product]; 'toggle-favorite': [product: Product] }>()

const { t, n } = useI18n()
const localePath = useLocalePath()

const href = computed(() => localePath(`/products/${toProductParam(props.product)}`))
const outOfStock = computed(() => props.product.availability === 'out_of_stock')
const secondImage = computed(() => props.product.images[1]?.src)
const eyebrow = computed(() => props.product.brand ?? props.product.category.name)
const rating = computed(() =>
  n(props.product.rating.average, { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
)
const ctaLabel = computed(() => {
  if (props.justAdded) return t('product.added')
  return outOfStock.value ? t('product.soldOut') : t('product.addToCart')
})
</script>

<template>
  <article class="group relative flex flex-col gap-3.5">
    <SharedProductImage
      :src="product.thumbnail.src"
      :alt="product.thumbnail.alt"
      :hover-src="secondImage"
      :sizes="sizes"
      :eager="eager"
      zoom
    >
      <div class="absolute top-3 left-3 flex gap-1.5">
        <UiBadge v-if="product.discountPercent" tone="accent">
          {{ t('price.discount', { percent: product.discountPercent }) }}
        </UiBadge>
        <UiBadge v-else-if="outOfStock" tone="warning">{{ t('product.soldOut') }}</UiBadge>
        <UiBadge v-else-if="product.availability === 'low_stock'" tone="warning">{{
          t('product.lowStock')
        }}</UiBadge>
      </div>

      <button
        type="button"
        class="absolute top-2 right-2 z-10 flex size-11 cursor-pointer items-center justify-center rounded-full bg-surface transition-[color,transform] duration-250 ease-emphasized"
        :class="isFavorite ? 'animate-pop text-accent motion-reduce:animate-none' : 'text-foreground'"
        :aria-label="isFavorite ? t('product.removeFavorite') : t('product.addFavorite')"
        :aria-pressed="isFavorite"
        @click="emit('toggle-favorite', product)"
      >
        <Icon
          :name="isFavorite ? 'etal:heart-filled' : 'lucide:heart'"
          class="size-[18px]"
          aria-hidden="true"
        />
      </button>

      <button
        type="button"
        class="absolute inset-x-3 bottom-3 z-10 flex h-11 cursor-pointer items-center justify-center gap-2 rounded-md bg-primary text-body-sm font-medium text-primary-foreground transition-[opacity,translate] duration-250 ease-standard group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-40! motion-reduce:translate-y-0 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100"
        :class="justAdded ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'"
        :disabled="outOfStock"
        @click="emit('add', product)"
      >
        <span aria-live="polite">{{ ctaLabel }}</span>
      </button>
    </SharedProductImage>

    <div class="flex flex-col gap-1.5">
      <p class="m-0 text-overline-sm font-semibold text-foreground-muted uppercase">{{ eyebrow }}</p>
      <h3 class="m-0 font-sans text-ui leading-[1.4] font-medium">
        <NuxtLink
          :to="href"
          class="line-clamp-2 min-h-[2.8em] transition-colors duration-150 after:absolute after:inset-0 hover:text-accent-text"
        >
          {{ product.title }}
        </NuxtLink>
      </h3>
      <div class="flex items-baseline justify-between gap-2 pt-0.5">
        <SharedPrice :price="product.price" :compare-at="product.compareAtPrice" />
        <span class="flex items-center gap-1 text-meta text-foreground-muted tabular-nums">
          <Icon name="etal:star-filled" class="size-3.5" aria-hidden="true" />
          <span class="sr-only">{{ t('ui.rating.short') }}</span>
          {{ rating }}
        </span>
      </div>
    </div>
  </article>
</template>
