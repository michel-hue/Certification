<script setup lang="ts">
import { useProducts } from '~/features/catalog/composables/useProducts'

/** Cart page (E7): lines, summary with promo code and free-delivery bar, empty state. */
const { t } = useI18n()
const cart = useCartStore()
const mounted = useMounted()
const { data: suggestions } = useProducts({ sort: 'rating', pageSize: 4 }, { lazy: true })

useSeoMeta({ title: () => t('cart.pageTitle'), robots: 'noindex, follow' })
</script>

<template>
  <div class="mx-auto max-w-content px-gutter pt-10">
    <div class="flex flex-col gap-3 border-b border-border pb-8">
      <p class="text-overline font-semibold text-foreground-muted uppercase">{{ t('cart.overline') }}</p>
      <h1 class="text-[clamp(2.25rem,1.6rem+3vw,4rem)] leading-[1.02] font-normal tracking-[-0.02em]">
        {{ t('cart.headingStart') }} <em>{{ t('cart.headingEmphasis') }}</em>
      </h1>
    </div>

    <!-- The cart lives in localStorage: render it once mounted, a skeleton before. -->
    <div v-if="!mounted" class="flex flex-col gap-4 pt-8" aria-busy="true">
      <UiSkeleton v-for="index in 2" :key="index" class="h-32" />
    </div>

    <template v-else-if="cart.isEmpty">
      <SharedEmptyState :title="t('cart.empty.title')" :illustration="t('cart.empty.pageIllustration')">
        <UiButton to="/products" size="lg">{{ t('cart.empty.cta') }}</UiButton>
      </SharedEmptyState>
      <section class="flex flex-col gap-8 border-t border-border pt-8">
        <h2 class="text-[28px]">{{ t('cart.empty.suggestions') }}</h2>
        <ProductGrid :products="suggestions?.items" :pending="!suggestions" :skeletons="4" />
      </section>
    </template>

    <div v-else class="flex flex-wrap items-start gap-[clamp(32px,5vw,80px)] pt-2">
      <div class="flex min-w-0 flex-[3_1_520px] flex-col">
        <ul>
          <CartLine v-for="item in cart.items" :key="item.productId" :item="item" />
        </ul>
        <NuxtLinkLocale
          to="/products"
          class="link-underlined mt-6 self-start text-ui font-medium transition-colors duration-150 hover:text-accent-text"
        >
          {{ t('cart.continue') }}
        </NuxtLinkLocale>
      </div>

      <aside
        class="flex flex-[2_1_340px] flex-col gap-5 rounded-md border border-border bg-surface p-7 lg:sticky lg:top-24"
        :aria-label="t('cart.summary')"
      >
        <h2 class="text-[26px]">{{ t('cart.summary') }}</h2>
        <FreeShippingProgress
          :remaining="cart.totals.freeShippingRemaining"
          :progress="cart.totals.freeShippingProgress"
        />
        <PromoCodeForm />
        <div class="border-t border-border pt-5">
          <OrderTotals :totals="cart.totals" :method="cart.shippingMethod" />
        </div>
        <UiButton to="/checkout" size="lg" block icon-right="lucide:arrow-right">{{
          t('cart.checkout')
        }}</UiButton>
        <p class="text-center text-caption text-foreground-muted">{{ t('cart.demoNote') }}</p>
      </aside>
    </div>
  </div>
</template>
