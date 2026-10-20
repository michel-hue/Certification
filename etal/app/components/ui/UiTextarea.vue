<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{ invalid?: boolean; rows?: number; maxlength?: number }>(), {
  rows: 4,
})

const model = defineModel<string>({ default: '' })
const { t } = useI18n()
const counter = computed(() =>
  props.maxlength ? t('ui.textarea.counter', { count: model.value.length, max: props.maxlength }) : '',
)
</script>

<template>
  <div class="flex flex-col gap-1">
    <textarea
      v-model="model"
      v-bind="$attrs"
      :rows="rows"
      :maxlength="maxlength"
      :aria-invalid="invalid || undefined"
      class="w-full resize-y rounded-md border bg-surface px-3.5 py-2.5 text-body text-foreground outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      :class="invalid ? 'border-danger' : 'border-border-strong hover:border-foreground'"
    />
    <span
      v-if="maxlength"
      class="self-end text-caption text-foreground-muted tabular-nums"
      aria-live="polite"
    >
      {{ counter }}
    </span>
  </div>
</template>
