<script setup lang="ts">
/** KPI tile (E17): label, big serif figure, a factual note below. */
defineProps<{ label: string; value: string; note?: string }>()
</script>

<template>
  <div class="flex flex-col gap-2.5 rounded-md border border-border bg-surface p-5">
    <dt class="text-overline-sm font-semibold text-foreground-muted uppercase">{{ label }}</dt>
    <dd
      class="m-0 font-serif text-[clamp(1.75rem,1rem+1.4vw,2.5rem)] leading-none whitespace-nowrap tabular-nums"
    >
      {{ value }}
    </dd>
    <dd v-if="note" class="m-0 text-meta text-foreground-muted tabular-nums">{{ note }}</dd>
  </div>
</template>
