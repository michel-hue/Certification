<script setup lang="ts">
/** Decorative loading block; the surrounding region carries `aria-busy`. */
withDefaults(defineProps<{ variant?: 'text' | 'block' | 'circle'; lines?: number }>(), {
  variant: 'block',
  lines: 1,
})
</script>

<template>
  <span v-if="variant === 'text'" class="flex flex-col gap-2" aria-hidden="true">
    <span
      v-for="line in lines"
      :key="line"
      class="skeleton block h-[0.9em] rounded-sm"
      :class="line === lines && lines > 1 ? 'w-3/5' : 'w-full'"
    />
  </span>
  <span
    v-else
    aria-hidden="true"
    class="skeleton block"
    :class="variant === 'circle' ? 'rounded-full' : 'rounded-md'"
  />
</template>
