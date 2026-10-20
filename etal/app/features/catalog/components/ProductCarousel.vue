<script setup lang="ts">
import type { ProductListQueryInput } from '#shared/schemas/catalog'
import type { RouteLocationAsPathGeneric } from 'vue-router'
import { useProducts } from '../composables/useProducts'

/**
 * Home carousel: overline + title, « Tout voir » and arrows, then a horizontally
 * scroll-snapped row of four cards per view (one and a bit on mobile).
 */
const props = defineProps<{
  overline: string
  title: string
  emphasis: string
  query: ProductListQueryInput
  seeAll: string | RouteLocationAsPathGeneric
}>()

const { t } = useI18n()
const { data, pending, error, refresh } = useProducts(() => ({ ...props.query, pageSize: 10 }), {
  lazy: true,
})
const track = useTemplateRef<HTMLElement>('track')

function scroll(direction: 1 | -1) {
  const element = track.value
  if (!element) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  element.scrollBy({ left: direction * element.clientWidth * 0.75, behavior: reduce ? 'auto' : 'smooth' })
}
</script>

<template>
  <section class="flex flex-col gap-8 pt-section">
    <SharedSectionHeading :overline="overline" :title="title" :emphasis="emphasis">
      <template #actions>
        <NuxtLinkLocale
          :to="seeAll"
          class="mr-3 text-body-sm font-medium text-accent-text hover:text-foreground"
        >
          {{ t('home.seeAll') }}
        </NuxtLinkLocale>
        <UiButton
          variant="outline"
          icon="lucide:chevron-left"
          :label="t('home.previous')"
          @click="scroll(-1)"
        />
        <UiButton variant="outline" icon="lucide:chevron-right" :label="t('home.next')" @click="scroll(1)" />
      </template>
    </SharedSectionHeading>

    <SharedErrorState
      v-if="error"
      :title="t('catalog.error.title')"
      framed
      :retrying="pending"
      @retry="refresh()"
    />
    <div
      v-else
      ref="track"
      class="-mx-1 flex snap-x snap-mandatory gap-6 overflow-x-auto px-1 pb-1 [scrollbar-width:none]"
      role="group"
      :aria-busy="pending"
      tabindex="0"
      :aria-label="`${title} ${emphasis}`"
    >
      <template v-if="pending || !data">
        <div
          v-for="index in 4"
          :key="index"
          class="w-[calc((100%-72px)/4)] min-w-[232px] shrink-0 snap-start"
        >
          <ProductCardSkeleton />
        </div>
      </template>
      <div
        v-for="product in data?.items"
        v-else
        :key="product.id"
        class="flex w-[calc((100%-72px)/4)] min-w-[232px] shrink-0 snap-start"
      >
        <ProductTile :product="product" class="w-full" />
      </div>
    </div>
  </section>
</template>
