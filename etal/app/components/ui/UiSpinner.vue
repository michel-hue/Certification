<script setup lang="ts">
withDefaults(defineProps<{ size?: 'sm' | 'md'; label?: string }>(), { size: 'sm' })
</script>

<template>
  <span
    :role="label ? 'status' : undefined"
    :aria-label="label"
    :aria-hidden="label ? undefined : 'true'"
    class="inline-block shrink-0 animate-spin rounded-full border-[1.5px] border-current border-r-transparent"
    :class="size === 'sm' ? 'size-4' : 'size-6'"
  />
</template>
