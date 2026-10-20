<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()
const { sections } = useAppConfig()
const categoryName = useCategoryName()

const slug = computed(() => String(route.params.slug))
const known = sections.some((section) => section.categories.includes(slug.value))
if (!known) throw createError({ statusCode: 404, statusMessage: 'Category not found', fatal: true })

useSeoMeta({
  title: () => categoryName(slug.value),
  description: () => t('catalog.categoryDescription', { name: categoryName(slug.value) }),
})
</script>

<template>
  <CatalogView :key="slug" mode="category" :fixed="{ category: slug }" />
</template>
