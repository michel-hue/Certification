<script setup lang="ts">
import type { ProductDetail } from '#shared/types/catalog'

/** Description · Caractéristiques · Livraison & retours · Avis (E5). */
const props = defineProps<{ product: ProductDetail }>()

const tab = defineModel<string>({ default: 'description' })
const { t, n, d } = useI18n()
const categoryName = useCategoryName()

const tabs = computed(() => [
  { value: 'description', label: t('product.tabs.description') },
  { value: 'specs', label: t('product.tabs.specs') },
  { value: 'shipping', label: t('product.tabs.shipping') },
  { value: 'reviews', label: t('product.tabs.reviews', { count: props.product.reviews.length }) },
])

const decimal = (value: number) => n(value, { maximumFractionDigits: 2 })
const specs = computed(() => {
  const { dimensions } = props.product
  return [
    [t('product.specs.brand'), props.product.brand ?? '—'],
    [t('product.specs.category'), categoryName(props.product.category)],
    [t('product.specs.sku'), props.product.sku || '—'],
    [
      t('product.specs.dimensions'),
      dimensions.width
        ? t('product.specs.dimensionsValue', {
            w: decimal(dimensions.width),
            h: decimal(dimensions.height),
            d: decimal(dimensions.depth),
          })
        : '—',
    ],
    [
      t('product.specs.weight'),
      props.product.weight ? t('product.specs.weightValue', { value: decimal(props.product.weight) }) : '—',
    ],
    [t('product.specs.warranty'), props.product.warranty || '—'],
    [t('product.specs.minimumOrder'), String(props.product.minimumOrderQuantity)],
  ] as const
})

const shipping = computed(() => [
  {
    title: t('product.shipping.dispatch'),
    text: props.product.shipping || t('product.shipping.dispatchDefault'),
  },
  {
    title: t('product.shipping.returns'),
    text: props.product.returnPolicy || t('product.shipping.returnsDefault'),
  },
  { title: t('product.shipping.free'), text: t('product.shipping.freeText') },
])

const histogram = computed(() =>
  [5, 4, 3, 2, 1].map((stars) => {
    const count = props.product.reviews.filter((review) => Math.round(review.rating) === stars).length
    const total = props.product.reviews.length
    return { stars, count, percent: total ? (count / total) * 100 : 0 }
  }),
)
</script>

<template>
  <UiTabs v-model="tab" :tabs="tabs" :label="t('product.tabs.label')">
    <template #description>
      <div class="flex max-w-[720px] flex-col gap-4">
        <p class="text-body-lg leading-[1.7] text-pretty">{{ product.description }}</p>
        <ul v-if="product.tags.length" class="flex flex-wrap gap-1.5">
          <li v-for="tag in product.tags" :key="tag">
            <UiBadge tone="outline">{{ tag }}</UiBadge>
          </li>
        </ul>
      </div>
    </template>

    <template #specs>
      <dl class="m-0 grid max-w-[720px] grid-cols-[minmax(120px,220px)_minmax(0,1fr)]">
        <template v-for="[label, value] in specs" :key="label">
          <dt class="border-b border-border py-3.5 text-body-sm text-foreground-muted">{{ label }}</dt>
          <dd class="m-0 border-b border-border py-3.5 text-ui tabular-nums">{{ value }}</dd>
        </template>
      </dl>
    </template>

    <template #shipping>
      <div class="grid max-w-[720px] grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6">
        <div
          v-for="block in shipping"
          :key="block.title"
          class="flex flex-col gap-1.5 border-t border-foreground pt-4"
        >
          <p class="font-semibold">{{ block.title }}</p>
          <p class="text-body-sm text-foreground-muted">{{ block.text }}</p>
        </div>
      </div>
    </template>

    <template #reviews>
      <div class="flex flex-wrap items-start gap-[clamp(32px,6vw,96px)]">
        <div class="flex flex-[0_1_300px] flex-col gap-4">
          <p class="font-serif text-[72px] leading-none tabular-nums">
            {{ n(product.rating.average, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) }}
          </p>
          <p class="text-body-sm text-foreground-muted">
            {{ t('product.reviews.outOf', { count: product.reviews.length }, product.reviews.length) }}
          </p>
          <ul class="flex flex-col gap-2 pt-2" :aria-label="t('product.reviews.distribution')">
            <li
              v-for="bar in histogram"
              :key="bar.stars"
              class="grid grid-cols-[28px_minmax(0,1fr)_24px] items-center gap-2.5 text-meta text-foreground-muted tabular-nums"
            >
              <span>{{ t('product.reviews.stars', { count: bar.stars }) }}</span>
              <span class="h-1 overflow-hidden rounded-sm bg-surface-muted" aria-hidden="true">
                <span class="block h-full bg-foreground" :style="{ width: `${bar.percent}%` }" />
              </span>
              <span class="text-right">{{ bar.count }}</span>
            </li>
          </ul>
        </div>
        <div class="flex flex-[1_1_420px] flex-col">
          <article
            v-for="(review, index) in product.reviews"
            :key="index"
            class="flex flex-col gap-2 border-b border-border py-6"
          >
            <div class="flex flex-wrap justify-between gap-3">
              <UiRatingStars :value="review.rating" :size="14" />
              <time :datetime="review.date" class="text-meta text-foreground-muted">
                {{ d(new Date(review.date), 'long') }}
              </time>
            </div>
            <p class="font-serif text-[20px] leading-[1.35]">« {{ review.comment }} »</p>
            <p class="text-meta text-foreground-muted">{{ review.author }}</p>
          </article>
          <p v-if="!product.reviews.length" class="text-foreground-muted">{{ t('product.reviews.none') }}</p>
        </div>
      </div>
    </template>
  </UiTabs>
</template>
