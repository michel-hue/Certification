<script setup lang="ts">
/** Overline + title of a back-office page, with its main action on the right. */
defineProps<{ overline: string; title: string }>()
</script>

<template>
  <div class="flex flex-wrap items-end justify-between gap-4">
    <div class="flex min-w-0 flex-col gap-2">
      <p class="text-overline font-semibold text-foreground-muted uppercase">{{ overline }}</p>
      <h1 class="text-[clamp(1.75rem,1.4rem+1.6vw,2.5rem)] leading-[1.1] font-medium">{{ title }}</h1>
    </div>
    <slot name="actions" />
  </div>
</template>
