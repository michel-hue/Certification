<script setup lang="ts">
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogRoot,
  AlertDialogTitle,
} from 'reka-ui'
import { buttonVariants } from '~/design/button'

/** Destructive confirmation (E22). Cancel gets the initial focus, as an alertdialog should. */
withDefaults(
  defineProps<{
    title: string
    description: string
    confirmLabel: string
    cancelLabel?: string
    tone?: 'danger' | 'primary'
  }>(),
  { tone: 'danger' },
)
const emit = defineEmits<{ confirm: [] }>()

const open = defineModel<boolean>('open', { default: false })
const { t } = useI18n()
</script>

<template>
  <AlertDialogRoot v-model:open="open">
    <AlertDialogPortal>
      <AlertDialogOverlay class="overlay fixed inset-0 z-80 bg-[rgb(18_18_18/0.45)]" />
      <AlertDialogContent
        class="modal fixed top-1/2 left-1/2 z-81 flex w-[min(460px,calc(100vw-32px))] -translate-1/2 flex-col gap-4 rounded-lg border border-border bg-surface p-7 shadow-lg outline-none"
      >
        <AlertDialogTitle class="font-serif text-[24px] leading-tight font-medium">{{
          title
        }}</AlertDialogTitle>
        <AlertDialogDescription class="text-ui leading-[1.55] text-foreground-muted">
          {{ description }}
        </AlertDialogDescription>
        <div class="flex flex-wrap justify-end gap-2 pt-2">
          <AlertDialogCancel :class="buttonVariants({ variant: 'outline' })">
            {{ cancelLabel ?? t('ui.cancel') }}
          </AlertDialogCancel>
          <AlertDialogAction :class="buttonVariants({ variant: tone })" @click="emit('confirm')">
            {{ confirmLabel }}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialogPortal>
  </AlertDialogRoot>
</template>
