<script setup lang="ts">
/** Asymmetric editorial block: wide image (7 columns), text (4 + 1 empty) — CDC graphique §6.3. */
const { t } = useI18n()
</script>

<template>
  <section class="flex flex-wrap items-center gap-[clamp(32px,5vw,96px)] pt-section">
    <figure
      class="bg-hatch m-0 flex aspect-7/6 flex-[7_1_460px] items-center justify-center p-6 text-center font-mono text-caption text-foreground-muted"
      aria-hidden="true"
    >
      {{ t('home.editorial.photo') }}
    </figure>
    <div class="flex max-w-[440px] flex-[4_1_320px] flex-col gap-5 pr-[clamp(0px,6vw,96px)]">
      <p class="text-overline font-semibold text-foreground-muted uppercase">
        {{ t('home.editorial.overline') }}
      </p>
      <h2 class="text-h2 text-balance">
        {{ t('home.editorial.titleStart') }} <em class="font-normal">{{ t('home.editorial.emphasis') }}</em>
        {{ t('home.editorial.titleEnd') }}
      </h2>
      <p class="text-body-lg text-pretty text-foreground-muted">{{ t('home.editorial.text') }}</p>
      <NuxtLinkLocale
        :to="{ path: '/products', query: { g: 'maison' } }"
        class="link-underlined inline-flex items-center gap-2 self-start text-ui font-medium transition-colors duration-150 hover:text-accent-text"
      >
        {{ t('home.editorial.cta') }}
        <Icon name="lucide:arrow-right" class="size-4" aria-hidden="true" />
      </NuxtLinkLocale>
    </div>
  </section>
</template>
