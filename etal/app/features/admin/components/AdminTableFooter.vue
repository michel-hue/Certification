<script setup lang="ts">
/** Result count and pagination under a back-office table. */
defineProps<{ count: string; page: number; pageCount: number }>()
const emit = defineEmits<{ change: [page: number] }>()
</script>

<template>
  <div class="flex flex-wrap items-center justify-between gap-3">
    <p class="text-meta text-foreground-muted tabular-nums" aria-live="polite">{{ count }}</p>
    <UiPagination
      v-if="pageCount > 1"
      :page="page"
      :page-count="pageCount"
      compact
      @change="emit('change', $event)"
    />
  </div>
</template>
