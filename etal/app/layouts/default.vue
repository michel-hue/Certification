<script setup lang="ts">
const route = useRoute()
const { t } = useI18n()
const checkout = computed(() => route.meta.checkoutChrome === true)
</script>

<template>
  <div class="flex min-h-dvh flex-col">
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
    >
      {{ t('a11y.skipToContent') }}
    </a>
    <LayoutDemoBanner />
    <LayoutAppHeader :overlay="route.meta.headerOverlay === true" :minimal="checkout" />
    <main id="main" class="flex-1">
      <slot />
    </main>
    <LayoutAppFooter v-if="!checkout" />
  </div>
</template>
