<script setup lang="ts">
import { tv, type VariantProps } from '~/utils/tv'

/** In-content notice. Tone is always doubled by an icon, never colour alone (CDC §14). */
const alert = tv({
  base: 'flex items-start gap-3 rounded-md border bg-surface p-4 text-body-sm leading-normal text-foreground',
  variants: {
    tone: {
      info: 'border-info',
      success: 'border-success',
      warning: 'border-warning',
      danger: 'border-danger',
    },
  },
  defaultVariants: { tone: 'info' },
})

const props = withDefaults(
  defineProps<{ tone?: VariantProps<typeof alert>['tone']; title?: string; demo?: boolean }>(),
  { tone: 'info' },
)

const { t } = useI18n()
const icons = {
  info: 'lucide:info',
  success: 'lucide:circle-check',
  warning: 'lucide:triangle-alert',
  danger: 'lucide:circle-alert',
} as const
const iconColor = {
  info: 'text-info',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
} as const
const role = computed(() => (props.tone === 'danger' ? 'alert' : 'status'))
</script>

<template>
  <div :role="role" :class="alert({ tone })">
    <UiBadge v-if="demo" tone="demo" class="mt-0.5">{{ t('ui.demo') }}</UiBadge>
    <Icon
      v-else
      :name="icons[tone]"
      class="mt-0.5 size-[18px] shrink-0"
      :class="iconColor[tone]"
      aria-hidden="true"
    />
    <div class="flex flex-col gap-0.5">
      <p v-if="title" class="font-semibold">{{ title }}</p>
      <div><slot /></div>
    </div>
  </div>
</template>
