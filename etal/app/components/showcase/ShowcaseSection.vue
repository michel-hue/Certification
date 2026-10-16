<script setup lang="ts">
defineProps<{ id: string; title: string; overline: string }>()
</script>

<template>
  <section :id="id" :aria-labelledby="`${id}-title`" class="flex scroll-mt-28 flex-col gap-8 pt-section">
    <div class="flex flex-col gap-3 border-b border-border pb-6">
      <p class="text-overline font-semibold text-foreground-muted uppercase">{{ overline }}</p>
      <h2 :id="`${id}-title`" class="text-h2">{{ title }}</h2>
    </div>
    <slot />
  </section>
</template>
