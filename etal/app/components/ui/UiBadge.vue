<script setup lang="ts">
import { tv, type VariantProps } from '~/utils/tv'

const badge = tv({
  base: 'inline-flex items-center gap-1 rounded-sm px-[7px] text-caption leading-[1.5] font-medium whitespace-nowrap tabular-nums',
  variants: {
    tone: {
      neutral: 'bg-surface-muted py-px text-foreground',
      accent: 'bg-accent py-px font-semibold text-accent-foreground',
      success: 'border border-success text-success',
      warning: 'border border-border bg-surface text-warning',
      danger: 'border border-danger text-danger',
      info: 'border border-info text-info',
      outline: 'border border-border-strong text-foreground-muted',
      demo: 'bg-info py-px text-[11px] font-bold tracking-[0.12em] text-surface',
    },
  },
  defaultVariants: { tone: 'neutral' },
})

defineProps<{ tone?: VariantProps<typeof badge>['tone']; icon?: string }>()
</script>

<template>
  <span :class="badge({ tone })">
    <Icon v-if="icon" :name="icon" class="size-3.5" aria-hidden="true" />
    <slot />
  </span>
</template>
