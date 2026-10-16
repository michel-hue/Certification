<script setup lang="ts">
/** Bordered radio option with a description and a trailing value (delivery methods). */
defineProps<{ value: string; name: string; label: string; description?: string; aside?: string }>()

const model = defineModel<string>()
</script>

<template>
  <label
    class="flex cursor-pointer items-center gap-3.5 rounded-md border p-4 transition-colors duration-150 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring"
    :class="model === value ? 'border-foreground bg-surface' : 'border-border hover:border-border-strong'"
  >
    <input
      v-model="model"
      type="radio"
      :name="name"
      :value="value"
      class="size-[18px] shrink-0 accent-foreground"
    />
    <span class="flex flex-1 flex-col">
      <span class="text-ui font-medium">{{ label }}</span>
      <span v-if="description" class="text-meta text-foreground-muted">{{ description }}</span>
    </span>
    <span v-if="aside" class="text-ui font-medium tabular-nums">{{ aside }}</span>
  </label>
</template>
