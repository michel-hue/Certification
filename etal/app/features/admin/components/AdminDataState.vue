<script setup lang="ts">
/**
 * The three loading states every back-office list handles (CDC §12.3): error with retry,
 * skeleton rows while the first load runs, then the content or an empty message.
 */
defineProps<{
  pending: boolean
  error: unknown
  ready: boolean
  empty: boolean
  emptyText: string
  rows?: number
}>()
const emit = defineEmits<{ retry: [] }>()

const { t } = useI18n()
</script>

<template>
  <SharedErrorState
    v-if="error && !ready"
    framed
    :title="t('admin.loadError')"
    :retrying="pending"
    @retry="emit('retry')"
  />
  <div v-else-if="!ready" class="flex flex-col gap-2" aria-busy="true">
    <UiSkeleton v-for="index in rows ?? 6" :key="index" class="h-14" />
  </div>
  <p
    v-else-if="empty"
    class="rounded-md border border-border bg-surface px-6 py-12 text-center text-foreground-muted"
  >
    {{ emptyText }}
  </p>
  <slot v-else />
</template>
