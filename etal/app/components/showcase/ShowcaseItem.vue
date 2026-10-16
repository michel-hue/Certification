<script setup lang="ts">
defineProps<{ label: string }>()
</script>

<template>
  <div class="flex flex-col gap-3">
    <p class="text-overline-sm font-semibold text-foreground-muted uppercase">{{ label }}</p>
    <div class="flex flex-wrap items-center gap-3">
      <slot />
    </div>
  </div>
</template>
