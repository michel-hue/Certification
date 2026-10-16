<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="grid min-h-dvh lg:grid-cols-2">
    <div class="bg-hatch relative hidden lg:block" aria-hidden="true" />
    <div class="flex flex-col px-gutter py-8">
      <LayoutAppLogo class="self-start text-[30px]" :label="t('nav.home')" />
      <main id="main" class="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">
        <slot />
      </main>
    </div>
  </div>
</template>
