<script setup lang="ts">
import type { ProductListQuery, ProductListQueryInput } from '#shared/schemas/catalog'
import { useCatalogQuery } from '../composables/useCatalogQuery'
import { useProducts } from '../composables/useProducts'

/**
 * Listing screen shared by /products, /categories/[slug] and /search (E2, E3, E4).
 * Filters live in the URL; the page only says which mode it is and what is fixed.
 */
const props = defineProps<{
  mode: 'catalog' | 'category' | 'search'
  /** Path-bound parameters, e.g. `{ category: 'beauty' }`. */
  fixed?: Partial<ProductListQueryInput>
}>()

const { t } = useI18n()
const sections = useSections()
const categoryName = useCategoryName()
const isDesktop = useMediaQuery('(min-width: 1024px)')

const { query, update, reset } = useCatalogQuery(props.fixed)
const { data, pending, error, refresh } = useProducts(query)

const filtersOpen = ref(false)
const activeFilters = useTemplateRef<{ count: number }>('activeFilters')

const section = computed(
  () =>
    sections.value.find((item) => item.id === query.value.g) ??
    (query.value.category
      ? sections.value.find((item) => item.categories.includes(query.value.category!))
      : undefined),
)

const heading = computed(() => {
  const term = query.value.q ?? ''
  if (props.mode === 'search') {
    return {
      overline: t('catalog.search.overline'),
      title: t('catalog.search.title', { term }),
      chapo: t(
        'catalog.search.chapo',
        { count: data.value?.facets.termTotal ?? 0 },
        data.value?.facets.termTotal ?? 0,
      ),
    }
  }
  if (query.value.category) {
    return {
      overline: section.value
        ? t('catalog.sectionOverline', { num: section.value.num, name: section.value.name })
        : t('catalog.overline'),
      title: categoryName(query.value.category),
      chapo: section.value?.chapo ?? '',
      photo: section.value?.photo,
    }
  }
  if (section.value) {
    return {
      overline: t('catalog.sectionNumber', { num: section.value.num }),
      title: section.value.name,
      chapo: section.value.chapo,
      photo: section.value.photo,
    }
  }
  return { overline: t('catalog.overline'), title: t('catalog.title'), chapo: t('catalog.chapo') }
})

const breadcrumb = computed(() => {
  const items: { label: string; to?: string | { path: string; query: Record<string, string> } }[] = [
    { label: t('nav.homeShort'), to: '/' },
  ]
  if (props.mode === 'search') return [...items, { label: t('catalog.search.overline') }]
  if (section.value || query.value.category) items.push({ label: t('catalog.overline'), to: '/products' })
  if (query.value.category && section.value) items.push({ label: section.value.name, to: section.value.to })
  items.push({ label: heading.value.title })
  return items
})

const countLabel = computed(() =>
  pending.value && !data.value
    ? t('catalog.loading')
    : t('catalog.count', { count: data.value?.total ?? 0 }, data.value?.total ?? 0),
)
const emptyTitle = computed(() =>
  props.mode === 'search' && data.value?.facets.termTotal === 0
    ? t('catalog.empty.searchTitle', { term: query.value.q })
    : t('catalog.empty.title'),
)

const sortOptions = computed(() => [
  { value: 'relevance', label: t('catalog.sort.relevance') },
  { value: 'price-asc', label: t('catalog.sort.priceAsc') },
  { value: 'price-desc', label: t('catalog.sort.priceDesc') },
  { value: 'rating', label: t('catalog.sort.rating') },
  { value: 'newest', label: t('catalog.sort.newest') },
])

/** Reset keeps what defines the page: the term on /search, the rubrique on /products?g=. */
function resetFilters() {
  return reset(props.mode === 'search' ? ['q'] : ['g'])
}

function changePage(page: number) {
  update({ page })
  if (import.meta.client) window.scrollTo({ top: 0 })
}

watch(isDesktop, (desktop) => desktop && (filtersOpen.value = false))
</script>

<template>
  <div class="mx-auto max-w-content px-gutter">
    <UiBreadcrumb :items="breadcrumb" class="pt-6" />

    <header class="flex flex-wrap items-end gap-8 border-b border-border pt-8 pb-10">
      <div class="flex flex-[1_1_420px] flex-col gap-3.5">
        <p class="text-overline font-semibold text-foreground-muted uppercase">{{ heading.overline }}</p>
        <h1
          class="text-[clamp(2.25rem,1.6rem+3vw,4rem)] leading-[1.02] font-normal tracking-[-0.02em] [font-variation-settings:'opsz'_144]"
        >
          {{ heading.title }}
        </h1>
        <p v-if="heading.chapo" class="max-w-[34em] text-body-lg text-pretty text-foreground-muted">
          {{ heading.chapo }}
        </p>
      </div>
      <div
        v-if="heading.photo"
        class="bg-hatch flex aspect-video flex-[0_1_420px] items-center justify-center p-4 text-center font-mono text-[11px] text-foreground-muted"
        aria-hidden="true"
      >
        {{ heading.photo }}
      </div>
    </header>

    <div class="sticky top-header z-10 border-b border-border bg-background py-5">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <UiButton
            variant="secondary"
            icon-left="lucide:sliders-horizontal"
            class="lg:hidden"
            @click="filtersOpen = true"
          >
            {{ t('filters.title') }}
            <span
              v-if="activeFilters?.count"
              class="h-5 min-w-5 rounded-full bg-accent text-center text-[11px] leading-5 text-accent-foreground"
            >
              {{ activeFilters.count }}
            </span>
          </UiButton>
          <p class="text-body-sm text-foreground-muted tabular-nums" aria-live="polite">{{ countLabel }}</p>
        </div>
        <label class="flex items-center gap-2.5 text-body-sm text-foreground-muted">
          {{ t('catalog.sort.label') }}
          <UiSelect
            :model-value="query.sort === 'discount' ? 'relevance' : query.sort"
            :options="sortOptions"
            class="min-w-44"
            @update:model-value="update({ sort: $event as ProductListQuery['sort'] })"
          />
        </label>
      </div>
      <ActiveFilters ref="activeFilters" :query="query" @update="update" @reset="resetFilters" />
    </div>

    <div class="flex items-start gap-10 pt-8">
      <aside
        :aria-label="t('filters.title')"
        class="sticky top-[160px] hidden lg:block max-h-[calc(100vh-180px)] w-62 shrink-0 overflow-y-auto pr-2 pb-6"
      >
        <FilterPanel
          :query="query"
          :facets="data?.facets"
          :mode="mode"
          @update="update"
          @reset="resetFilters"
        />
      </aside>

      <div class="flex min-w-0 flex-1 flex-col gap-12">
        <SharedErrorState
          v-if="error"
          :title="t('catalog.error.title')"
          :text="t('catalog.error.text')"
          :retrying="pending"
          @retry="refresh()"
        />
        <SharedEmptyState
          v-else-if="data && data.total === 0"
          :title="emptyTitle"
          :text="t('catalog.empty.text')"
          :illustration="t('catalog.empty.illustration')"
          size="md"
        >
          <UiButton @click="resetFilters">{{ t('catalog.empty.reset') }}</UiButton>
        </SharedEmptyState>
        <ProductGrid
          v-else
          :products="data?.items"
          :pending="pending && !data"
          :skeletons="12"
          :eager-count="4"
        />

        <div v-if="data && data.pageCount > 1" class="border-t border-border pt-8">
          <UiPagination
            class="hidden lg:flex"
            :page="data.page"
            :page-count="data.pageCount"
            @change="changePage"
          />
          <UiPagination
            class="lg:hidden"
            :page="data.page"
            :page-count="data.pageCount"
            compact
            @change="changePage"
          />
        </div>
      </div>
    </div>

    <UiDrawer v-model:open="filtersOpen" side="bottom" :title="t('filters.title')">
      <div class="p-5 pb-2">
        <FilterPanel
          :query="query"
          :facets="data?.facets"
          :mode="mode"
          @update="update"
          @reset="resetFilters"
        >
          <template #actions>
            <UiButton size="lg" block @click="filtersOpen = false">{{
              t('filters.show', { label: countLabel })
            }}</UiButton>
          </template>
        </FilterPanel>
      </div>
    </UiDrawer>
  </div>
</template>
