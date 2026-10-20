<script setup lang="ts">
/** About (CDC §8.10): the project and its stack, for the portfolio. */
const { t } = useI18n()

const SECTIONS = ['project', 'architecture', 'security', 'quality'] as const
/** Product names: not translated. */
const STACK = [
  'Nuxt 4 · Vue 3',
  'TypeScript strict',
  'Tailwind CSS 4',
  'Pinia',
  'Reka UI',
  'VeeValidate · Zod',
  'nuxt-auth-utils',
  '@nuxtjs/i18n',
  '@nuxt/image',
  'Vitest',
  'Playwright · axe',
  'DummyJSON',
]

useSeoMeta({
  title: () => t('pages.about.pageTitle'),
  description: () => t('pages.about.lead'),
  ogTitle: () => t('pages.about.pageTitle'),
  ogDescription: () => t('pages.about.lead'),
})
</script>

<template>
  <ContentPage
    :overline="t('pages.about.overline')"
    :title-start="t('pages.about.titleStart')"
    :title-emphasis="t('pages.about.titleEmphasis')"
    :lead="t('pages.about.lead')"
  >
    <ContentSection
      v-for="section in SECTIONS"
      :key="section"
      :title="t(`pages.about.sections.${section}.title`)"
      :text="t(`pages.about.sections.${section}.text`)"
    />
    <ContentSection :title="t('pages.about.stack')">
      <ul class="flex flex-wrap gap-2">
        <li
          v-for="item in STACK"
          :key="item"
          class="rounded-sm border border-border-strong px-2.5 py-1 text-body-sm"
        >
          {{ item }}
        </li>
      </ul>
    </ContentSection>
    <ContentSection :title="t('pages.about.demo.title')" :text="t('pages.about.demo.text')">
      <div class="flex flex-wrap gap-3">
        <UiButton to="/login">{{ t('pages.about.demo.login') }}</UiButton>
        <UiButton to="/products" variant="secondary">{{ t('pages.about.demo.browse') }}</UiButton>
      </div>
    </ContentSection>
  </ContentPage>
</template>
