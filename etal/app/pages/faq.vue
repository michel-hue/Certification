<script setup lang="ts">
import { fromEur } from '#shared/utils/money'

/** FAQ / help (CDC §8.10): native disclosure widgets, keyboard-friendly for free. */
const { t } = useI18n()
const { format } = usePrice()
const { checkout, currency } = useAppConfig()

const QUESTIONS = ['order', 'payment', 'promo', 'shipping', 'account', 'cart', 'admin', 'prices'] as const
const params = computed(() => ({
  code: checkout.promo.code,
  percent: checkout.promo.percent,
  threshold: format(fromEur(checkout.freeShippingFromEur, currency)),
}))

/** FAQPage structured data, from the same strings as the page. */
useHead(() => ({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: QUESTIONS.map((id) => ({
          '@type': 'Question',
          name: t(`pages.faq.items.${id}.question`),
          acceptedAnswer: { '@type': 'Answer', text: t(`pages.faq.items.${id}.answer`, params.value) },
        })),
      }),
    },
  ],
}))

useSeoMeta({
  title: () => t('pages.faq.pageTitle'),
  description: () => t('pages.faq.lead'),
  ogTitle: () => t('pages.faq.pageTitle'),
  ogDescription: () => t('pages.faq.lead'),
})
</script>

<template>
  <ContentPage
    :overline="t('pages.faq.overline')"
    :title-start="t('pages.faq.titleStart')"
    :title-emphasis="t('pages.faq.titleEmphasis')"
    :lead="t('pages.faq.lead')"
  >
    <div class="border-b border-border">
      <details v-for="id in QUESTIONS" :key="id" class="group border-t border-border">
        <summary
          class="flex min-h-11 cursor-pointer list-none items-center justify-between gap-6 py-5 text-[20px] leading-snug font-medium [&::-webkit-details-marker]:hidden"
        >
          {{ t(`pages.faq.items.${id}.question`) }}
          <Icon
            name="lucide:plus"
            class="size-5 shrink-0 transition-transform duration-200 group-open:rotate-45"
            aria-hidden="true"
          />
        </summary>
        <p class="max-w-[40em] pb-6 text-ui leading-[1.65] text-foreground-muted">
          {{ t(`pages.faq.items.${id}.answer`, params) }}
        </p>
      </details>
    </div>
    <p class="text-ui text-foreground-muted">
      {{ t('pages.faq.more') }}
      <NuxtLinkLocale to="/about" class="text-accent-text underline underline-offset-3">{{
        t('pages.faq.aboutLink')
      }}</NuxtLinkLocale>
    </p>
  </ContentPage>
</template>
