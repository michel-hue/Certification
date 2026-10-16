<script setup lang="ts">
/** − value + with bounds; buttons disable at the limits instead of silently clamping. */
const props = withDefaults(
  defineProps<{ min?: number; max?: number; size?: 'sm' | 'md' | 'lg'; label?: string }>(),
  { min: 1, max: 99, size: 'md' },
)

const model = defineModel<number>({ required: true })
const { t } = useI18n()

const atMin = computed(() => model.value <= props.min)
const atMax = computed(() => model.value >= props.max)
const sizes = {
  sm: { box: 'h-9', button: 'w-9' },
  md: { box: 'h-11', button: 'w-11' },
  lg: { box: 'h-13', button: 'w-12' },
} as const

function step(delta: number) {
  model.value = Math.min(props.max, Math.max(props.min, model.value + delta))
}
</script>

<template>
  <div
    role="group"
    :aria-label="label ?? t('ui.quantity.label')"
    class="inline-flex items-center rounded-md border border-border-strong"
    :class="sizes[size].box"
  >
    <button
      type="button"
      class="flex h-full cursor-pointer items-center justify-center disabled:cursor-not-allowed disabled:opacity-35"
      :class="sizes[size].button"
      :disabled="atMin"
      :aria-label="t('ui.quantity.decrease')"
      @click="step(-1)"
    >
      <Icon name="lucide:minus" class="size-4" aria-hidden="true" />
    </button>
    <output class="min-w-8 text-center font-medium tabular-nums" aria-live="polite">{{ model }}</output>
    <button
      type="button"
      class="flex h-full cursor-pointer items-center justify-center disabled:cursor-not-allowed disabled:opacity-35"
      :class="sizes[size].button"
      :disabled="atMax"
      :aria-label="t('ui.quantity.increase')"
      @click="step(1)"
    >
      <Icon name="lucide:plus" class="size-4" aria-hidden="true" />
    </button>
  </div>
</template>
