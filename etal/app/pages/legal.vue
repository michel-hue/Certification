<script setup lang="ts">
/** Legal notice and privacy, portfolio version (CDC §8.10). */
const { t } = useI18n()

const SECTIONS = ['publisher', 'hosting', 'data', 'storage', 'content'] as const

useSeoMeta({
  title: () => t('pages.legal.pageTitle'),
  description: () => t('pages.legal.lead'),
})
</script>

<template>
  <ContentPage
    :overline="t('pages.legal.overline')"
    :title-start="t('pages.legal.titleStart')"
    :title-emphasis="t('pages.legal.titleEmphasis')"
    :lead="t('pages.legal.lead')"
  >
    <ContentSection
      v-for="section in SECTIONS"
      :key="section"
      :title="t(`pages.legal.sections.${section}.title`)"
      :text="t(`pages.legal.sections.${section}.text`)"
    />
  </ContentPage>
</template>
