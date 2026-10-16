<script setup lang="ts">
import { DialogClose, DialogContent, DialogOverlay, DialogPortal, DialogRoot, DialogTitle } from 'reka-ui'
import type { ProductImage } from '#shared/types/catalog'

/** Full-screen image viewer: always dark, ← → to browse, Escape to close (mockup E5). */
const props = defineProps<{ images: readonly ProductImage[]; title: string }>()

const open = defineModel<boolean>('open', { default: false })
const index = defineModel<number>('index', { default: 0 })
const { t } = useI18n()

const count = computed(() => props.images.length)
const current = computed(() => props.images[index.value])

function step(direction: 1 | -1) {
  index.value = (index.value + direction + count.value) % count.value
}

function onKeydown(event: KeyboardEvent) {
  if (count.value < 2) return
  if (event.key === 'ArrowRight') step(1)
  if (event.key === 'ArrowLeft') step(-1)
}

const control =
  'flex size-12 cursor-pointer items-center justify-center rounded-full border border-inverse-border bg-inverse text-inverse-foreground hover:border-inverse-foreground'
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogPortal>
      <DialogOverlay class="overlay fixed inset-0 z-70 bg-inverse" />
      <DialogContent
        class="modal fixed inset-0 z-71 flex items-center justify-center outline-none"
        :aria-describedby="undefined"
        @keydown="onKeydown"
      >
        <DialogTitle class="sr-only">{{ title }}</DialogTitle>
        <img
          v-if="current"
          :src="current.src"
          :alt="title"
          class="max-h-[84vh] max-w-[min(88vw,1100px)] rounded-md bg-sand object-contain"
        />
        <DialogClose :class="control" class="absolute top-4 right-4" :aria-label="t('ui.close')">
          <Icon name="lucide:x" class="size-5" aria-hidden="true" />
        </DialogClose>
        <template v-if="count > 1">
          <button
            type="button"
            :class="control"
            class="absolute top-1/2 left-4 -translate-y-1/2"
            :aria-label="t('product.gallery.previous')"
            @click="step(-1)"
          >
            <Icon name="lucide:chevron-left" class="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            :class="control"
            class="absolute top-1/2 right-4 -translate-y-1/2"
            :aria-label="t('product.gallery.next')"
            @click="step(1)"
          >
            <Icon name="lucide:chevron-right" class="size-5" aria-hidden="true" />
          </button>
        </template>
        <p
          class="absolute bottom-5 left-1/2 -translate-x-1/2 text-meta text-inverse-muted tabular-nums"
          aria-live="polite"
        >
          {{ index + 1 }} / {{ count }}
        </p>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
