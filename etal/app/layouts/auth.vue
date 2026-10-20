<script setup lang="ts">
/** Sign-in and sign-up (E12–E13): editorial photo beside a narrow form column. */
const { t } = useI18n()
</script>

<template>
  <div class="flex min-h-dvh flex-wrap">
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
    >
      {{ t('a11y.skipToContent') }}
    </a>
    <figure class="bg-hatch relative m-0 hidden min-h-dvh flex-[1_1_50%] lg:block">
      <span
        class="absolute inset-0 flex items-center justify-center p-6 text-center font-mono text-caption text-foreground-muted"
        aria-hidden="true"
      >
        {{ t('auth.photo') }}
      </span>
      <figcaption
        class="absolute right-12 bottom-12 left-12 max-w-[14em] font-serif text-[clamp(1.75rem,1.2rem+1.6vw,2.75rem)] leading-[1.15]"
      >
        {{ t('auth.taglineStart') }} <em>{{ t('auth.taglineEmphasis') }}</em>
      </figcaption>
    </figure>
    <div class="flex flex-[1_1_420px] flex-col px-[clamp(20px,5vw,80px)] pt-8 pb-12">
      <div class="flex items-center justify-between">
        <LayoutAppLogo class="text-[30px]" :label="t('nav.home')" />
        <NuxtLinkLocale
          to="/"
          class="text-body-sm text-foreground-muted transition-colors duration-150 hover:text-foreground"
        >
          {{ t('auth.backToShop') }}
        </NuxtLinkLocale>
      </div>
      <main id="main" class="mx-auto flex w-full max-w-[440px] flex-1 flex-col justify-center py-12">
        <slot />
      </main>
    </div>
  </div>
</template>
