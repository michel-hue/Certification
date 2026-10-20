<script setup lang="ts">
/** Favourites (E8): grid of saved products, « Tout ajouter au panier », empty state. */
const { t } = useI18n()
const wishlist = useWishlistStore()
const toast = useToast()
const localePath = useLocalePath()
const { addToCart } = useProductActions()
const mounted = useMounted()

const count = computed(() => (mounted.value ? wishlist.count : 0))

function addAll() {
  const available = wishlist.products.filter((product) => product.availability !== 'out_of_stock')
  const added = available.filter((product) => addToCart(product, 1, { openDrawer: false }) > 0).length
  toast.success(t('wishlist.addedAll', { count: added }, added), {
    label: t('wishlist.seeCart'),
    altText: t('wishlist.seeCart'),
    run: () => navigateTo(localePath('/cart')),
  })
}

useSeoMeta({ title: () => t('wishlist.pageTitle'), robots: 'noindex, follow' })
</script>

<template>
  <div class="mx-auto max-w-content px-gutter pt-10">
    <div class="flex flex-wrap items-end justify-between gap-6 border-b border-border pb-8">
      <div class="flex flex-col gap-3">
        <p class="text-overline font-semibold text-foreground-muted uppercase tabular-nums">
          {{ t('wishlist.overline', { count }) }}
        </p>
        <h1 class="text-[clamp(2.25rem,1.6rem+3vw,4rem)] leading-[1.02] font-normal tracking-[-0.02em]">
          {{ t('wishlist.headingStart') }} <em>{{ t('wishlist.headingEmphasis') }}</em>
        </h1>
      </div>
      <UiButton v-if="count" variant="secondary" @click="addAll">{{ t('wishlist.addAll') }}</UiButton>
    </div>

    <div v-if="!mounted" class="pt-10"><ProductGrid pending :skeletons="4" /></div>
    <SharedEmptyState
      v-else-if="!count"
      :title="t('wishlist.empty.title')"
      :text="t('wishlist.empty.text')"
      :illustration="t('wishlist.empty.illustration')"
    >
      <UiButton to="/products" size="lg">{{ t('wishlist.empty.cta') }}</UiButton>
    </SharedEmptyState>
    <ProductGrid v-else class="pt-10" :products="wishlist.products" />
  </div>
</template>
