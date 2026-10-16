<script setup lang="ts">
import { SwitchRoot, SwitchThumb } from 'reka-ui'

/** Label on the left, track on the right, the whole row is clickable (mockup filters & profile). */
defineProps<{ label: string; description?: string; disabled?: boolean }>()

const model = defineModel<boolean>({ default: false })
const id = useId()
</script>

<template>
  <div class="flex min-h-8 items-center justify-between gap-3">
    <label :for="id" class="flex cursor-pointer flex-col text-body-sm">
      {{ label }}
      <span v-if="description" class="text-meta text-foreground-muted">{{ description }}</span>
    </label>
    <SwitchRoot
      :id="id"
      v-model="model"
      :disabled="disabled"
      class="relative h-5 w-9 shrink-0 cursor-pointer rounded-full bg-border-strong transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-foreground"
    >
      <SwitchThumb
        class="block size-4 translate-x-0.5 rounded-full bg-surface transition-transform duration-150 ease-standard data-[state=checked]:translate-x-[18px]"
      />
    </SwitchRoot>
  </div>
</template>
