<script setup lang="ts">
/**
 * Editorial frame shared by the annex pages (CDC §8.10): overline, serif title with an
 * italic ending, lead paragraph, then the page's own sections.
 */
defineProps<{ overline: string; titleStart: string; titleEmphasis: string; lead: string }>()
</script>

<template>
  <article class="mx-auto flex max-w-[880px] flex-col gap-12 px-gutter pt-[clamp(48px,8vw,112px)]">
    <header class="flex flex-col gap-5">
      <p class="text-overline font-semibold text-foreground-muted uppercase">{{ overline }}</p>
      <h1
        class="text-[clamp(2.25rem,1.6rem+3vw,4rem)] leading-[1.04] font-normal tracking-[-0.02em] text-balance"
      >
        {{ titleStart }} <em>{{ titleEmphasis }}</em>
      </h1>
      <p class="max-w-[34em] text-[18px] leading-[1.6] text-foreground-muted text-pretty">{{ lead }}</p>
    </header>
    <slot />
  </article>
</template>
