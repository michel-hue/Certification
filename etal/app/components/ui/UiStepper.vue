<script setup lang="ts">
/** Checkout progress: done steps get a ✓, the current one is announced with aria-current. */
defineProps<{ steps: readonly string[]; current: number; label?: string }>()
</script>

<template>
  <ol :aria-label="label" class="flex flex-wrap items-center gap-3">
    <li
      v-for="(step, index) in steps"
      :key="step"
      :aria-current="index + 1 === current ? 'step' : undefined"
      class="flex items-center gap-2.5 text-body-sm font-medium"
      :class="index + 1 <= current ? 'text-foreground' : 'text-foreground-muted'"
    >
      <span
        class="flex size-7 items-center justify-center rounded-full border text-meta tabular-nums"
        :class="[
          index + 1 < current && 'border-foreground bg-foreground text-background',
          index + 1 === current && 'border-foreground',
          index + 1 > current && 'border-border-strong',
        ]"
      >
        <Icon v-if="index + 1 < current" name="lucide:check" class="size-3.5" aria-hidden="true" />
        <template v-else>{{ index + 1 }}</template>
      </span>
      {{ step }}
      <span
        v-if="index < steps.length - 1"
        aria-hidden="true"
        class="ml-1 h-px w-[clamp(16px,5vw,64px)] bg-border-strong"
      />
    </li>
  </ol>
</template>
