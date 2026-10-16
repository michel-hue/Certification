<script setup lang="ts">
/**
 * Filter chip. By default a toggle (aria-pressed); with `removable` it becomes an
 * active-filter pill whose × emits `remove`.
 */
const props = defineProps<{ label: string; selected?: boolean; removable?: boolean; removeLabel?: string }>()
const emit = defineEmits<{ toggle: []; remove: [] }>()

function onClick() {
  if (props.removable) emit('remove')
  else emit('toggle')
}
</script>

<template>
  <button
    type="button"
    :aria-pressed="removable ? undefined : selected"
    :aria-label="removable ? removeLabel : undefined"
    class="inline-flex cursor-pointer items-center gap-1.5 rounded-sm border text-meta font-medium transition-colors duration-150"
    :class="
      removable
        ? 'h-8 border-border-strong bg-surface pr-2.5 pl-3 hover:border-foreground'
        : selected
          ? 'h-9 border-primary bg-primary px-3 text-primary-foreground'
          : 'h-9 border-border-strong px-3 hover:border-foreground'
    "
    @click="onClick"
  >
    {{ label }}
    <Icon v-if="removable" name="lucide:x" class="size-3.5" aria-hidden="true" />
  </button>
</template>
