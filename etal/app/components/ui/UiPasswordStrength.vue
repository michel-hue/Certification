<script setup lang="ts">
import { passwordScore } from '#shared/utils/password'

/** Four segments + label; the rules mirror the register form validation (score ≥ 3). */
const props = defineProps<{ password: string }>()

const { t } = useI18n()
const score = computed(() => passwordScore(props.password))
const tones = ['bg-border-strong', 'bg-danger', 'bg-warning', 'bg-info', 'bg-success'] as const
const texts = ['text-foreground-muted', 'text-danger', 'text-warning', 'text-info', 'text-success'] as const
</script>

<template>
  <div class="flex flex-col gap-1.5" aria-live="polite">
    <div class="grid grid-cols-4 gap-1" aria-hidden="true">
      <span
        v-for="segment in 4"
        :key="segment"
        class="h-1 rounded-sm transition-colors duration-150"
        :class="segment <= score ? tones[score] : 'bg-surface-muted'"
      />
    </div>
    <p class="text-caption text-foreground-muted">
      {{ t('ui.password.strength') }}
      <strong class="font-semibold" :class="texts[score]">{{ t(`ui.password.levels.${score}`) }}</strong>
      · {{ t('ui.password.rules') }}
    </p>
  </div>
</template>
