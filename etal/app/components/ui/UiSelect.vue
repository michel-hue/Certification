<script setup lang="ts">
defineOptions({ inheritAttrs: false })

/**
 * Native select, styled. Native keeps mobile pickers and form autofill for free; the
 * mockup uses it everywhere (sort, admin filters, order status).
 */
withDefaults(
  defineProps<{
    options: readonly { value: string; label: string }[]
    size?: 'md' | 'sm'
    invalid?: boolean
    placeholder?: string
  }>(),
  { size: 'sm' },
)

const model = defineModel<string>()
</script>

<template>
  <div class="relative">
    <select
      v-model="model"
      v-bind="$attrs"
      :aria-invalid="invalid || undefined"
      class="w-full cursor-pointer appearance-none rounded-md border bg-surface pr-9 pl-3.5 font-medium text-foreground outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      :class="[
        size === 'md' ? 'h-12 text-body' : 'h-11 text-body-sm',
        invalid ? 'border-danger' : 'border-border-strong hover:border-foreground',
      ]"
    >
      <option v-if="placeholder" value="">{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option>
    </select>
    <Icon
      name="lucide:chevron-down"
      class="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-border-strong"
      aria-hidden="true"
    />
  </div>
</template>
