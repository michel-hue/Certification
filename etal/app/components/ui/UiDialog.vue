<script setup lang="ts">
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from 'reka-ui'

/** Centred modal (forms, information). Focus is trapped and restored by Reka UI. */
defineProps<{ title: string; description?: string }>()

const open = defineModel<boolean>('open', { default: false })
const { t } = useI18n()
</script>

<template>
  <DialogRoot v-model:open="open">
    <slot name="trigger" />
    <DialogPortal>
      <DialogOverlay class="overlay fixed inset-0 z-80 bg-[rgb(18_18_18/0.45)]" />
      <DialogContent
        class="modal fixed top-1/2 left-1/2 z-81 flex max-h-[90vh] w-[min(520px,calc(100vw-32px))] -translate-1/2 flex-col gap-4 overflow-y-auto rounded-lg border border-border bg-surface p-7 shadow-lg outline-none"
      >
        <DialogTitle class="pr-10 font-serif text-[24px] leading-tight font-medium">{{ title }}</DialogTitle>
        <DialogDescription v-if="description" class="text-ui leading-normal text-foreground-muted">
          {{ description }}
        </DialogDescription>
        <slot />
        <div v-if="$slots.footer" class="flex flex-wrap justify-end gap-2 pt-2">
          <slot name="footer" />
        </div>
        <DialogClose
          class="absolute top-4 right-4 flex size-11 cursor-pointer items-center justify-center rounded-md hover:bg-surface-muted"
          :aria-label="t('ui.close')"
        >
          <Icon name="lucide:x" class="size-5" aria-hidden="true" />
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
