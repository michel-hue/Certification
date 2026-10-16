<script setup lang="ts">
import { useProducts } from '~/features/catalog/composables/useProducts'

/** « Parcourir l'étal »: one wide tile for the first rubrique, four smaller ones (magazine grid). */
const { t } = useI18n()
const sections = useSections()
const { data } = useProducts({ pageSize: 1 }, { lazy: true })

const count = (id: string) => {
  const value = data.value?.facets.sectionCounts[id]
  return value ? t('home.sections.count', { count: value }, value) : ''
}
const featured = computed(() => sections.value[0])
const others = computed(() => sections.value.slice(1))
</script>

<template>
  <section id="rubriques" class="flex flex-col gap-10 pt-section">
    <SharedSectionHeading
      :overline="t('nav.sections')"
      :title="t('home.sections.title')"
      :emphasis="t('home.sections.emphasis')"
    >
      <template #actions>
        <NuxtLinkLocale to="/products" class="link-reveal text-body-sm font-medium text-accent-text">
          {{ t('home.sections.catalog') }}
        </NuxtLinkLocale>
      </template>
    </SharedSectionHeading>

    <div class="flex flex-wrap gap-6">
      <NuxtLinkLocale
        v-if="featured"
        :to="featured.to"
        class="bg-hatch relative flex min-h-[min(560px,120vw)] flex-[1_1_520px] flex-col justify-end overflow-hidden"
      >
        <span class="absolute top-6 left-6 font-mono text-caption text-foreground-muted" aria-hidden="true">
          {{ featured.photo }}
        </span>
        <span class="flex max-w-[78%] flex-col gap-2 bg-background pt-6 pr-7">
          <span class="text-overline font-semibold text-foreground-muted uppercase"
            >{{ featured.num }} — {{ featured.name }}</span
          >
          <span class="font-serif text-h1 font-medium">
            {{ t('home.sections.featuredTitle') }}
            <em class="font-normal">{{ t('home.sections.featuredEmphasis') }}</em>
          </span>
          <span class="text-body-sm text-foreground-muted tabular-nums">{{ count(featured.id) }}</span>
        </span>
      </NuxtLinkLocale>

      <div class="grid flex-[1_1_480px] grid-cols-2 gap-6">
        <NuxtLinkLocale
          v-for="section in others"
          :key="section.id"
          :to="section.to"
          class="group flex flex-col gap-3"
        >
          <span
            class="bg-hatch flex aspect-4/5 items-center justify-center p-4 text-center font-mono text-[11px] text-foreground-muted"
            aria-hidden="true"
          >
            {{ section.photo }}
          </span>
          <span class="flex items-baseline justify-between gap-2 border-t border-border pt-3">
            <span class="flex flex-col gap-0.5">
              <span class="text-overline-sm font-semibold text-foreground-muted uppercase">{{
                section.num
              }}</span>
              <span
                class="font-serif text-h3 font-medium transition-colors duration-150 group-hover:text-accent-text"
              >
                {{ section.name }}
              </span>
            </span>
            <span class="text-meta whitespace-nowrap text-foreground-muted tabular-nums">{{
              count(section.id)
            }}</span>
          </span>
        </NuxtLinkLocale>
      </div>
    </div>
  </section>
</template>
