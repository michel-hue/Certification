<script setup lang="ts">
import { pageItems } from '~/utils/pagination'

/**
 * Numbered pagination (first, last, current ± 1, ellipses); `compact` shows « Page x / y »
 * for small screens. Emits the page; the parent owns URL state.
 */
const props = defineProps<{ page: number; pageCount: number; compact?: boolean }>()
const emit = defineEmits<{ change: [page: number] }>()

const { t } = useI18n()
const items = computed(() => pageItems(props.page, props.pageCount))
const arrow =
  'flex size-11 cursor-pointer items-center justify-center rounded-md border border-border-strong transition-colors duration-150 hover:border-foreground disabled:cursor-not-allowed disabled:opacity-40'
</script>

<template>
  <nav
    v-if="pageCount > 1"
    :aria-label="t('ui.pagination.label')"
    class="flex items-center justify-center gap-1.5"
  >
    <button
      type="button"
      :class="arrow"
      :disabled="page <= 1"
      :aria-label="t('ui.pagination.previous')"
      @click="emit('change', page - 1)"
    >
      <Icon name="lucide:chevron-left" class="size-[18px]" aria-hidden="true" />
    </button>
    <span v-if="compact" class="px-4 text-body-sm tabular-nums">
      {{ t('ui.pagination.status', { page, count: pageCount }) }}
    </span>
    <template v-else>
      <template v-for="(item, index) in items" :key="index">
        <span v-if="item === 'gap'" aria-hidden="true" class="min-w-11 text-center text-foreground-muted"
          >…</span
        >
        <button
          v-else
          type="button"
          :aria-current="item === page ? 'page' : undefined"
          :aria-label="t('ui.pagination.page', { page: item })"
          class="h-11 min-w-11 cursor-pointer rounded-md px-1.5 text-body-sm font-medium tabular-nums transition-colors duration-150"
          :class="item === page ? 'bg-primary text-primary-foreground' : 'hover:bg-surface-muted'"
          @click="emit('change', item)"
        >
          {{ item }}
        </button>
      </template>
    </template>
    <button
      type="button"
      :class="arrow"
      :disabled="page >= pageCount"
      :aria-label="t('ui.pagination.next')"
      @click="emit('change', page + 1)"
    >
      <Icon name="lucide:chevron-right" class="size-[18px]" aria-hidden="true" />
    </button>
  </nav>
</template>
