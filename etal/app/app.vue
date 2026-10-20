<script setup lang="ts">
const head = useLocaleHead({ seo: true })
const { t } = useI18n()

useHead({
  htmlAttrs: { lang: () => head.value.htmlAttrs.lang },
  link: () => head.value.link,
  meta: () => head.value.meta,
  titleTemplate: (title) => (title ? `${title} · Étal` : `Étal — ${t('brand.tagline')}`),
})

/** Defaults for every page; pages override the title, description and image (CDC §14.4). */
useSeoMeta({
  ogSiteName: 'Étal',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  description: () => t('home.seo.description'),
})
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <UiToaster />
</template>
