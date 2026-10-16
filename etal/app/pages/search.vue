<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()
const localePath = useLocalePath()
const term = computed(() => String(route.query.q ?? '').trim())
if (!term.value) await navigateTo(localePath('/products'), { replace: true })

useSeoMeta({
  title: () => t('catalog.search.title', { term: term.value }),
  robots: 'noindex, follow',
})
</script>

<template>
  <CatalogView mode="search" />
</template>
