<script setup lang="ts">
/** Customer area shell (E14–E16): navigation beside the current section. */
definePageMeta({ middleware: 'auth' })
useSeoMeta({ robots: 'noindex, nofollow' })
</script>

<template>
  <div class="mx-auto flex max-w-content flex-wrap items-start gap-[clamp(24px,5vw,72px)] px-gutter pt-10">
    <AccountNav class="w-full lg:sticky lg:top-24 lg:w-60 lg:shrink-0" />
    <div class="min-w-0 flex-[1_1_560px]">
      <NuxtPage />
    </div>
  </div>
</template>
