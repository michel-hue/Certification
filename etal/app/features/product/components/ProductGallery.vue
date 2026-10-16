<script setup lang="ts">
import type { ProductImage } from '#shared/types/catalog'

/**
 * Main image + thumbnails (vertical on desktop, dots on mobile). The main image opens the
 * full-screen lightbox; the promo badge sits on it like on the card.
 */
const props = defineProps<{ images: readonly ProductImage[]; title: string; discountPercent?: number }>()

const index = defineModel<number>('index', { default: 0 })
const lightboxOpen = ref(false)
const { t } = useI18n()

const current = computed(() => props.images[Math.min(index.value, props.images.length - 1)])
</script>

<template>
  <div class="flex min-w-0 flex-col-reverse gap-4 lg:flex-row">
    <div
      v-if="images.length > 1"
      role="group"
      :aria-label="t('product.gallery.thumbnails')"
      class="flex shrink-0 justify-center gap-2.5 lg:flex-col lg:justify-start"
    >
      <button
        v-for="(image, position) in images"
        :key="image.src"
        type="button"
        :aria-label="t('product.gallery.image', { n: position + 1 })"
        :aria-current="position === index ? 'true' : undefined"
        class="relative cursor-pointer overflow-hidden"
        @click="index = position"
      >
        <!-- Dots on mobile, framed thumbnails from lg up. -->
        <span
          class="block size-2.5 rounded-full border lg:hidden"
          :class="position === index ? 'border-foreground bg-foreground' : 'border-border-strong'"
        />
        <span
          class="hidden w-18 rounded-md border lg:block"
          :class="position === index ? 'border-foreground' : 'border-transparent'"
        >
          <SharedProductImage :src="image.src" alt="" sizes="72px" />
        </span>
      </button>
    </div>

    <button
      v-if="current"
      type="button"
      class="relative min-w-0 flex-1 cursor-zoom-in"
      :aria-label="t('product.gallery.zoom')"
      @click="lightboxOpen = true"
    >
      <SharedProductImage :src="current.src" :alt="title" sizes="100vw lg:50vw" eager>
        <UiBadge v-if="discountPercent" tone="accent" class="absolute top-4 left-4 text-meta!">
          {{ t('price.discount', { percent: discountPercent }) }}
        </UiBadge>
        <span
          class="absolute right-4 bottom-4 flex size-10 items-center justify-center rounded-full bg-surface"
        >
          <Icon name="lucide:maximize-2" class="size-[18px]" aria-hidden="true" />
        </span>
      </SharedProductImage>
    </button>

    <ProductLightbox v-model:open="lightboxOpen" v-model:index="index" :images="images" :title="title" />
  </div>
</template>
