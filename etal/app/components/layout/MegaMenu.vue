<script setup lang="ts">
/** Rubriques in columns + the hovered rubrique featured on the right (CDC graphique §11.3). */
const props = defineProps<{ activeId: string }>()
const emit = defineEmits<{ navigate: [] }>()

const { t } = useI18n()
const sections = useSections()
const featured = computed(
  () => sections.value.find((section) => section.id === props.activeId) ?? sections.value[0],
)
</script>

<template>
  <div class="absolute inset-x-0 top-header border-y border-border bg-background shadow-md">
    <div
      class="mx-auto grid max-w-content grid-cols-[repeat(5,minmax(0,1fr))_minmax(0,1.6fr)] gap-8 px-gutter pt-8 pb-10"
    >
      <div v-for="section in sections" :key="section.id" class="flex flex-col gap-2">
        <NuxtLinkLocale
          :to="section.to"
          class="mb-1.5 font-serif text-[22px] font-medium transition-colors duration-150 hover:text-accent-text"
          :class="section.id === activeId ? 'text-accent-text' : 'text-foreground'"
          @click="emit('navigate')"
        >
          {{ section.name }}
        </NuxtLinkLocale>
        <NuxtLinkLocale
          v-for="category in section.categoryLinks.slice(0, 6)"
          :key="category.slug"
          :to="category.to"
          class="text-body-sm text-foreground-muted transition-colors duration-150 hover:text-foreground"
          @click="emit('navigate')"
        >
          {{ category.name }}
        </NuxtLinkLocale>
      </div>
      <NuxtLinkLocale
        v-if="featured"
        :to="featured.to"
        class="flex flex-col gap-2.5"
        @click="emit('navigate')"
      >
        <span
          class="bg-hatch flex aspect-16/10 items-center justify-center p-3 text-center font-mono text-[11px] leading-snug text-foreground-muted"
          aria-hidden="true"
        >
          {{ featured.photo }}
        </span>
        <span class="text-overline-sm font-semibold text-foreground-muted uppercase">
          {{ t('nav.featured', { name: featured.name }) }}
        </span>
        <span class="font-serif text-[18px] leading-[1.3]">{{ featured.chapo }}</span>
      </NuxtLinkLocale>
    </div>
  </div>
</template>
