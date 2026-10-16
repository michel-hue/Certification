<script setup lang="ts">
import { DialogClose, DialogContent, DialogOverlay, DialogPortal, DialogRoot, DialogTitle } from 'reka-ui'

/**
 * Side sheet: right (mini-cart), left (mobile menu), bottom (mobile filters).
 * Slides with the slow emphasized curve; reduced motion keeps only the fade.
 */
const props = withDefaults(
  defineProps<{
    title: string
    side?: 'right' | 'left' | 'bottom'
    /** Hide the visual title when the content brings its own heading. */
    hideTitle?: boolean
    /** `overline` renders the title as a small caps label (mobile menu). */
    titleStyle?: 'serif' | 'overline'
  }>(),
  { side: 'right', titleStyle: 'serif' },
)

const open = defineModel<boolean>('open', { default: false })
const { t } = useI18n()

const placement = computed(
  () =>
    ({
      right: 'inset-y-0 right-0 w-[min(440px,100vw)] rounded-l-lg',
      left: 'inset-y-0 left-0 w-[min(400px,100vw)]',
      bottom: 'inset-x-0 bottom-0 top-[8vh] rounded-t-lg',
    })[props.side],
)
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogPortal>
      <DialogOverlay class="overlay fixed inset-0 z-40 bg-[rgb(18_18_18/0.4)]" />
      <DialogContent
        :class="placement"
        class="sheet fixed z-50 flex flex-col bg-surface shadow-lg outline-none"
        :data-side="side"
      >
        <div
          class="flex items-center justify-between gap-4 border-b border-border px-6 py-4"
          :class="hideTitle && 'sr-only'"
        >
          <DialogTitle
            :class="
              titleStyle === 'overline'
                ? 'text-overline-sm font-semibold text-foreground-muted uppercase'
                : 'font-serif text-[26px] font-medium'
            "
          >
            <slot name="title">{{ title }}</slot>
          </DialogTitle>
          <DialogClose
            class="flex size-11 cursor-pointer items-center justify-center rounded-md hover:bg-surface-muted"
            :aria-label="t('ui.close')"
          >
            <Icon name="lucide:x" class="size-5" aria-hidden="true" />
          </DialogClose>
        </div>
        <div class="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <slot />
        </div>
        <div v-if="$slots.footer" class="flex flex-col gap-3 border-t border-border px-6 pt-5 pb-6">
          <slot name="footer" />
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
