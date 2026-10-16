<script setup lang="ts">
import { toMajorUnits } from '#shared/utils/money'
import { parseProductParam, toProductParam } from '#shared/utils/slug'
import { useProduct } from '~/features/product/composables/useProduct'

/** Product page (E5): `/products/<id>-<slug>`; a stale or missing slug redirects (301). */
const route = useRoute()
const { t } = useI18n()
const localePath = useLocalePath()
const sections = useSections()
const categoryName = useCategoryName()
const siteUrl = useRuntimeConfig().public.siteUrl

const id = parseProductParam(String(route.params.product))
if (!id) throw createError({ statusCode: 404, statusMessage: 'Product not found', fatal: true })

const { data: product, error, refresh, pending } = await useProduct(id)

if (product.value && route.params.product !== toProductParam(product.value)) {
  await navigateTo(localePath(`/products/${toProductParam(product.value)}`), {
    redirectCode: 301,
    replace: true,
  })
}

const tab = ref('description')
const tabsSection = useTemplateRef<HTMLElement>('tabsSection')
async function showReviews() {
  tab.value = 'reviews'
  await nextTick()
  tabsSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const section = computed(() =>
  product.value
    ? sections.value.find((item) => item.categories.includes(product.value!.category.slug))
    : undefined,
)
const breadcrumb = computed(() => {
  if (!product.value) return []
  return [
    { label: t('nav.homeShort'), to: '/' },
    ...(section.value ? [{ label: section.value.name, to: section.value.to }] : []),
    { label: categoryName(product.value.category), to: `/categories/${product.value.category.slug}` },
    { label: product.value.title },
  ]
})

useSeoMeta({
  title: () => product.value?.title,
  description: () => product.value?.description,
  ogTitle: () => product.value?.title,
  ogDescription: () => product.value?.description,
  ogImage: () => product.value?.thumbnail.src,
  ogType: 'website',
  twitterCard: 'summary_large_image',
})

// Structured data (CDC §8.6, §14.4): Product with offer and rating, plus the breadcrumb.
useHead(() => {
  const value = product.value
  if (!value) return {}
  const url = `${siteUrl}${localePath(`/products/${toProductParam(value)}`)}`
  return {
    link: [{ rel: 'canonical', href: url }],
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: value.title,
          description: value.description,
          image: value.images.map((image) => image.src),
          sku: value.sku,
          ...(value.brand && { brand: { '@type': 'Brand', name: value.brand } }),
          ...(value.rating.count && {
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: value.rating.average,
              reviewCount: value.rating.count,
            },
          }),
          offers: {
            '@type': 'Offer',
            url,
            price: toMajorUnits(value.price).toFixed(2),
            priceCurrency: value.price.currency,
            availability:
              value.availability === 'out_of_stock'
                ? 'https://schema.org/OutOfStock'
                : 'https://schema.org/InStock',
          },
        }),
      },
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumb.value.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.label,
            ...(item.to && { item: `${siteUrl}${localePath(item.to)}` }),
          })),
        }),
      },
    ],
  }
})
</script>

<template>
  <div class="mx-auto max-w-content px-gutter">
    <SharedErrorState
      v-if="error && !product"
      :title="t('product.error.title')"
      :text="t('catalog.error.text')"
      :retrying="pending"
      @retry="refresh()"
    />
    <template v-else-if="product">
      <UiBreadcrumb :items="breadcrumb" class="py-6" />

      <div class="flex flex-wrap items-start gap-[clamp(32px,5vw,80px)]">
        <ProductGallery
          :key="product.id"
          class="flex-[7_1_460px]"
          :images="product.images"
          :title="product.title"
          :discount-percent="product.discountPercent"
        />
        <ProductBuyBox class="flex-[5_1_360px]" :product="product" @show-reviews="showReviews" />
      </div>

      <section ref="tabsSection" class="scroll-mt-24 pt-[clamp(56px,7vw,96px)]">
        <h2 class="sr-only">{{ t('product.tabs.label') }}</h2>
        <ProductDetailsTabs v-model="tab" :product="product" />
      </section>

      <SimilarProducts :product="product" />
    </template>
  </div>
</template>
