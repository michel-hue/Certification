<script setup lang="ts">
const head = useLocaleHead({ seo: true })
const { t } = useI18n()

useHead({
  htmlAttrs: { lang: () => head.value.htmlAttrs.lang },
  link: () => head.value.link,
  meta: () => head.value.meta,
  titleTemplate: (title) => (title ? `${title} · Étal` : `Étal — ${t('brand.tagline')}`),
})
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <UiToaster />
</template>
