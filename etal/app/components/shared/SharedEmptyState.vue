<script setup lang="ts">
/**
 * Empty panel: illustration slot (hatched placeholder until the fine-line illustrations
 * are drawn, CDC graphique D8), Fraunces title, short text, one call to action.
 */
withDefaults(defineProps<{ title: string; text?: string; illustration?: string; size?: 'md' | 'lg' }>(), {
  size: 'lg',
})
</script>

<template>
  <div class="flex flex-col items-center gap-5 py-16 text-center">
    <slot name="illustration">
      <div
        class="bg-hatch flex h-[120px] w-[150px] items-center justify-center p-2 font-mono text-[10px] leading-tight text-foreground-muted"
        aria-hidden="true"
      >
        {{ illustration }}
      </div>
    </slot>
    <p
      class="m-0 max-w-[16em] font-serif leading-tight"
      :class="size === 'lg' ? 'text-[30px]' : 'text-[24px]'"
    >
      {{ title }}
    </p>
    <p v-if="text" class="m-0 max-w-[28em] text-foreground-muted">{{ text }}</p>
    <slot />
  </div>
</template>
