<script setup lang="ts">
const props = withDefaults(
  defineProps<{ src?: string; name: string; size?: 24 | 32 | 36 | 40 | 64 | 96 }>(),
  {
    size: 40,
  },
)

const failed = ref(false)
const initials = computed(() =>
  props.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join(''),
)
</script>

<template>
  <span
    class="inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-muted font-serif leading-none"
    :style="{ width: `${size}px`, height: `${size}px`, fontSize: `${Math.round(size * 0.42)}px` }"
  >
    <img v-if="src && !failed" :src="src" alt="" class="size-full object-cover" @error="failed = true" />
    <span v-else aria-hidden="true">{{ initials }}</span>
    <span class="sr-only">{{ name }}</span>
  </span>
</template>
