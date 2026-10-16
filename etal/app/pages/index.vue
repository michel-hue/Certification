<script setup lang="ts">
definePageMeta({ headerOverlay: true })

const { t } = useI18n()

useSeoMeta({
  title: () => t('home.seo.title'),
  description: () => t('home.seo.description'),
  ogTitle: () => t('home.seo.title'),
  ogDescription: () => t('home.seo.description'),
})
</script>

<template>
  <div>
    <HomeHero />
    <div class="mx-auto max-w-content px-gutter">
      <HomeSections />
      <ProductCarousel
        :overline="t('home.carousels.top.overline')"
        :title="t('home.carousels.top.title')"
        :emphasis="t('home.carousels.top.emphasis')"
        :query="{ sort: 'rating' }"
        :see-all="{ path: '/products', query: { sort: 'rating' } }"
      />
      <HomeEditorial />
      <ProductCarousel
        :overline="t('home.carousels.deals.overline')"
        :title="t('home.carousels.deals.title')"
        :emphasis="t('home.carousels.deals.emphasis')"
        :query="{ promo: '1', sort: 'discount' }"
        :see-all="{ path: '/products', query: { promo: '1', sort: 'price-asc' } }"
      />
      <ProductCarousel
        :overline="t('home.carousels.new.overline')"
        :title="t('home.carousels.new.title')"
        :emphasis="t('home.carousels.new.emphasis')"
        :query="{ sort: 'newest' }"
        :see-all="{ path: '/products', query: { sort: 'newest' } }"
      />
      <HomeReassurance />
    </div>
    <NewsletterForm />
  </div>
</template>
