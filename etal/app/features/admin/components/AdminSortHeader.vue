<script setup lang="ts" generic="K extends string">
import type { SortState } from '../table'

/** Sortable column header: a real button inside the `<th>`, `aria-sort` on the cell. */
const props = defineProps<{ label: string; column: K; sort: SortState<K>; align?: 'start' | 'end' }>()
const emit = defineEmits<{ sort: [column: K] }>()

const active = computed(() => props.sort.key === props.column)
</script>

<template>
  <th
    scope="col"
    :aria-sort="active ? sort.direction : 'none'"
    class="p-0"
    :class="align === 'end' && 'text-right'"
  >
    <button
      type="button"
      class="inline-flex h-12 cursor-pointer items-center gap-1 px-2 text-overline-sm font-semibold uppercase transition-colors duration-150 hover:text-foreground"
      :class="[active ? 'text-foreground' : 'text-foreground-muted', align === 'end' && 'flex-row-reverse']"
      @click="emit('sort', column)"
    >
      {{ label }}
      <Icon
        :name="active && sort.direction === 'descending' ? 'lucide:arrow-down' : 'lucide:arrow-up'"
        class="size-3.5"
        :class="!active && 'opacity-0'"
        aria-hidden="true"
      />
    </button>
  </th>
</template>
