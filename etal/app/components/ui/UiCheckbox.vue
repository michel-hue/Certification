<script setup lang="ts">
defineOptions({ inheritAttrs: false })

defineProps<{ label: string; description?: string; invalid?: boolean }>()

const model = defineModel<boolean>({ default: false })
</script>

<template>
  <label class="flex min-h-9 cursor-pointer items-start gap-2.5 text-body-sm leading-normal">
    <input
      v-model="model"
      v-bind="$attrs"
      type="checkbox"
      :aria-invalid="invalid || undefined"
      class="mt-[3px] size-4 shrink-0 cursor-pointer accent-foreground"
    />
    <span class="flex flex-col">
      <span>{{ label }}</span>
      <span v-if="description" class="text-meta text-foreground-muted">{{ description }}</span>
    </span>
  </label>
</template>
