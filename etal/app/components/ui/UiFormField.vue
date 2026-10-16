<script setup lang="ts">
/**
 * Label + control + help/error. The control is rendered through the default slot, which
 * receives the ids to wire (`id`, `describedBy`, `invalid`) so any input stays accessible.
 */
const props = defineProps<{
  label: string
  error?: string
  help?: string
  /** Overrides the generated id, e.g. to match an existing `for`. */
  id?: string
  required?: boolean
  /** Visually hides the label (it stays available to screen readers). */
  hideLabel?: boolean
}>()

const generatedId = useId()
const controlId = computed(() => props.id ?? `field-${generatedId}`)
const messageId = computed(() => `${controlId.value}-message`)
const describedBy = computed(() => (props.error || props.help ? messageId.value : undefined))
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label :for="controlId" class="text-body-sm font-medium" :class="hideLabel && 'sr-only'">
      {{ label }}<span v-if="required" aria-hidden="true" class="text-foreground-muted"> *</span>
    </label>
    <slot :id="controlId" :described-by="describedBy" :invalid="!!error" />
    <p v-if="error" :id="messageId" role="alert" class="flex items-center gap-1.5 text-meta text-danger">
      <Icon name="lucide:circle-alert" class="size-3.5 shrink-0" aria-hidden="true" />
      {{ error }}
    </p>
    <p v-else-if="help" :id="messageId" class="text-meta text-foreground-muted">{{ help }}</p>
  </div>
</template>
