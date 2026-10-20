<script setup lang="ts">
withDefaults(defineProps<{ orientation?: 'horizontal' | 'vertical'; label?: string; strong?: boolean }>(), {
  orientation: 'horizontal',
})
</script>

<template>
  <div
    v-if="label"
    role="separator"
    class="flex items-center gap-4 text-caption font-medium text-foreground-muted before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border"
  >
    {{ label }}
  </div>
  <div
    v-else
    role="separator"
    :aria-orientation="orientation"
    :class="[
      orientation === 'vertical' ? 'w-px self-stretch' : 'h-px w-full',
      strong ? 'bg-foreground' : 'bg-border',
    ]"
  />
</template>
