<script setup lang="ts">
/** Framed dashboard block: heading, optional hint or link, content. */
defineProps<{ title: string; hint?: string; link?: { to: string; label: string } }>()

const id = useId()
</script>

<template>
  <section
    class="flex min-w-0 flex-col gap-5 rounded-md border border-border bg-surface p-6"
    :aria-labelledby="id"
  >
    <div class="flex items-baseline justify-between gap-4">
      <h2 :id="id" class="font-sans text-ui font-semibold">{{ title }}</h2>
      <NuxtLinkLocale v-if="link" :to="link.to" class="text-meta text-accent-text">{{
        link.label
      }}</NuxtLinkLocale>
      <span v-else-if="hint" class="text-caption text-foreground-muted">{{ hint }}</span>
    </div>
    <slot />
  </section>
</template>
