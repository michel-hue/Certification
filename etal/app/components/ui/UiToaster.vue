<script setup lang="ts">
import { ToastAction, ToastClose, ToastDescription, ToastProvider, ToastRoot, ToastViewport } from 'reka-ui'

/**
 * Renders the `useToast()` queue: ink pill with a coloured dot, bottom-right on desktop,
 * bottom-centre on mobile. Mounted once in app.vue.
 */
const { toasts, dismiss } = useToast()
const { t } = useI18n()

const dot = { success: 'bg-inverse-success', error: 'bg-inverse-danger', info: 'bg-inverse-info' } as const
</script>

<template>
  <ToastProvider :duration="5000" :label="t('ui.toast.region')" swipe-direction="right">
    <ToastRoot
      v-for="toast in toasts"
      :key="toast.id"
      :type="toast.kind === 'error' ? 'foreground' : 'background'"
      class="modal flex min-h-12 w-full items-center gap-3.5 rounded-md bg-inverse py-2.5 pr-2.5 pl-4 text-body-sm text-inverse-foreground shadow-lg"
      @update:open="(open) => !open && dismiss(toast.id)"
    >
      <span aria-hidden="true" class="size-2 shrink-0 rounded-full" :class="dot[toast.kind]" />
      <ToastDescription class="flex-1 leading-[1.4]">{{ toast.message }}</ToastDescription>
      <ToastAction
        v-if="toast.action"
        :alt-text="toast.action.altText"
        class="h-9 cursor-pointer px-2.5 font-semibold text-inverse-accent"
        @click="toast.action.run()"
      >
        {{ toast.action.label }}
      </ToastAction>
      <ToastClose
        class="flex size-9 shrink-0 cursor-pointer items-center justify-center text-inverse-muted hover:text-inverse-foreground"
        :aria-label="t('ui.toast.close')"
      >
        <Icon name="lucide:x" class="size-4" aria-hidden="true" />
      </ToastClose>
    </ToastRoot>
    <ToastViewport
      class="fixed right-4 bottom-6 left-4 z-90 m-0 flex list-none flex-col items-center gap-2 outline-none sm:left-auto sm:w-[420px] sm:items-end"
    />
  </ToastProvider>
</template>
