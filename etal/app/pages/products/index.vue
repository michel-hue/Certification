<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()
const sections = useSections()
const section = computed(() => sections.value.find((item) => item.id === route.query.g))

useSeoMeta({
  title: () => section.value?.name ?? t('catalog.title'),
  description: () => section.value?.chapo ?? t('catalog.chapo'),
})
</script>

<template>
  <CatalogView mode="catalog" />
</template>
