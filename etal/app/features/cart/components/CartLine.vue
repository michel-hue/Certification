<script setup lang="ts">
import { toProductParam } from '#shared/utils/slug'
import type { CartItem } from '../pricing'
import { useCartLines } from '../composables/useCartLines'

/**
 * One cart line. `compact` is the mini-cart version (80px image, small stepper, text
 * « Retirer »); the cart page shows the eyebrow, the unit price and a larger stepper.
 */
const props = defineProps<{ item: CartItem; compact?: boolean }>()
const emit = defineEmits<{ navigate: [] }>()

const { t } = useI18n()
const { format } = usePrice()
const localePath = useLocalePath()
const { remove, setQuantity } = useCartLines()

const href = computed(() =>
  localePath(`/products/${toProductParam({ id: props.item.productId, slug: props.item.slug })}`),
)
const lineTotal = computed(() => ({
  ...props.item.unitPrice,
  amount: props.item.unitPrice.amount * props.item.quantity,
}))
const quantity = computed({
  get: () => props.item.quantity,
  set: (value: number) => setQuantity(props.item.productId, value),
})
</script>

<template>
  <li
    class="grid gap-4 border-b border-border py-5"
    :class="compact ? 'grid-cols-[80px_minmax(0,1fr)]' : 'grid-cols-[96px_minmax(0,1fr)] gap-5 py-6'"
  >
    <NuxtLink :to="href" tabindex="-1" aria-hidden="true" @click="emit('navigate')">
      <SharedProductImage :src="item.thumbnail.src" alt="" :sizes="compact ? '80px' : '96px'" />
    </NuxtLink>
    <div class="flex min-w-0 flex-col" :class="compact ? 'gap-2.5' : 'gap-3'">
      <div class="flex items-start justify-between gap-3">
        <div class="flex min-w-0 flex-col gap-1">
          <p v-if="!compact" class="text-overline-sm font-semibold text-foreground-muted uppercase">
            {{ item.eyebrow }}
          </p>
          <NuxtLink
            :to="href"
            class="line-clamp-2 leading-[1.4] font-medium transition-colors duration-150 hover:text-accent-text"
            :class="compact ? 'text-ui' : 'text-body'"
            @click="emit('navigate')"
          >
            {{ item.title }}
          </NuxtLink>
          <p v-if="!compact" class="text-meta text-foreground-muted tabular-nums">
            {{ t('cart.unitPrice', { price: format(item.unitPrice) }) }}
          </p>
        </div>
        <p class="font-medium whitespace-nowrap tabular-nums" :class="!compact && 'text-price'">
          {{ format(lineTotal) }}
        </p>
      </div>
      <div class="flex items-center justify-between gap-3">
        <UiQuantityStepper
          v-model="quantity"
          :max="item.stock"
          :size="compact ? 'sm' : 'md'"
          :label="t('cart.quantityOf', { title: item.title })"
        />
        <button
          type="button"
          class="inline-flex h-11 cursor-pointer items-center gap-1.5 text-foreground-muted transition-colors duration-150 hover:text-foreground"
          :class="compact ? 'text-meta underline underline-offset-3' : 'text-body-sm'"
          :aria-label="t('cart.removeAlt', { title: item.title })"
          @click="remove(item.productId)"
        >
          <Icon v-if="!compact" name="lucide:trash-2" class="size-4" aria-hidden="true" />
          {{ t('cart.remove') }}
        </button>
      </div>
    </div>
  </li>
</template>
