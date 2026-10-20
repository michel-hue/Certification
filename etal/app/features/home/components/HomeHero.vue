<script setup lang="ts">
/** Editorial hero: text left aligned with the logo, ambient photo right (E1). */
const { t } = useI18n()
</script>

<template>
  <section class="flex min-h-[min(880px,94vh)] flex-wrap">
    <div
      class="flex flex-[5_1_380px] flex-col justify-end gap-7 px-gutter pt-32 pb-[clamp(3rem,6vw,6rem)] pl-[max(var(--spacing-gutter),calc((100vw-var(--container-content))/2+var(--spacing-gutter)))]"
    >
      <p class="flex items-center gap-3 text-overline font-semibold text-foreground-muted uppercase">
        <span class="h-px w-6 bg-border-strong" aria-hidden="true" />
        {{ t('home.hero.overline') }}
      </p>
      <h1 class="text-display font-normal text-balance [font-variation-settings:'opsz'_144]">
        <i18n-t keypath="home.hero.title" scope="global">
          <template #highlight>
            <em class="text-accent italic">{{ t('home.hero.titleHighlight') }}</em>
          </template>
        </i18n-t>
      </h1>
      <p class="max-w-[30em] text-body-lg text-pretty text-foreground-muted">{{ t('home.hero.lead') }}</p>
      <div class="flex flex-wrap items-center gap-6 pt-2">
        <NuxtLinkLocale
          to="/products"
          class="inline-flex h-13 items-center gap-2.5 rounded-md bg-primary px-7 text-ui font-medium text-primary-foreground transition-opacity duration-150 hover:opacity-88"
        >
          {{ t('home.hero.cta') }}
          <Icon name="lucide:arrow-right" class="size-[18px]" aria-hidden="true" />
        </NuxtLinkLocale>
        <NuxtLinkLocale
          :to="{ path: '/products', query: { promo: '1' } }"
          class="link-underlined text-ui font-medium transition-colors duration-150 hover:text-accent-text"
        >
          {{ t('home.hero.secondaryCta') }}
        </NuxtLinkLocale>
      </div>
    </div>
    <figure class="bg-hatch relative m-0 min-h-[440px] flex-[7_1_480px]">
      <figcaption
        class="absolute right-6 bottom-6 left-6 flex justify-between gap-4 text-caption text-foreground-muted"
      >
        <span>{{ t('home.hero.caption') }}</span>
        <span class="tabular-nums">01 / 04</span>
      </figcaption>
    </figure>
  </section>
</template>
