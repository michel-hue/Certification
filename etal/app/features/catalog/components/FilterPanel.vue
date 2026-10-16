<script setup lang="ts">
import { RATING_FILTERS, type ProductListQuery } from '#shared/schemas/catalog'
import type { CatalogFacets } from '#shared/types/catalog'
import type { CatalogPatch } from '../composables/useCatalogQuery'

/**
 * Filters (E2/E3): rubrique, category within the rubrique, price, minimum rating, brand,
 * availability. Emits URL patches; on a category page the category is fixed by the path.
 */
const props = defineProps<{
  query: ProductListQuery
  facets?: CatalogFacets
  /**
   * `catalog`: /products · `category`: /categories/[slug], the category is in the path ·
   * `search`: /search, every choice stays in the query so the term is kept.
   */
  mode: 'catalog' | 'category' | 'search'
}>()
const emit = defineEmits<{ update: [patch: CatalogPatch]; reset: [] }>()

const { t, n } = useI18n()
const sections = useSections()
const categoryName = useCategoryName()
const localePath = useLocalePath()

const activeSection = computed(
  () =>
    sections.value.find((section) => section.id === props.query.g) ??
    (props.query.category
      ? sections.value.find((section) => section.categories.includes(props.query.category!))
      : undefined),
)

const priceMin = ref(props.query.min?.toString() ?? '')
const priceMax = ref(props.query.max?.toString() ?? '')
watch(
  () => [props.query.min, props.query.max],
  ([min, max]) => {
    priceMin.value = min?.toString() ?? ''
    priceMax.value = max?.toString() ?? ''
  },
)

function applyPrice() {
  const parse = (value: string) =>
    value.trim() === '' || Number.isNaN(Number(value)) ? null : Math.max(0, Number(value))
  emit('update', { min: parse(priceMin.value), max: parse(priceMax.value) })
}

function selectSection(id: string | undefined) {
  if (props.mode === 'category')
    return navigateTo(localePath({ path: '/products', query: id ? { g: id } : {} }))
  emit('update', { g: id ?? null, category: null, brands: null })
}

function selectCategory(slug: string | undefined) {
  if (props.mode === 'search') return emit('update', { category: slug ?? null, brands: null })
  const section = activeSection.value?.id
  return navigateTo(
    localePath(slug ? `/categories/${slug}` : { path: '/products', query: section ? { g: section } : {} }),
  )
}

function toggleBrand(brand: string, on: boolean) {
  const current = props.query.brands ?? []
  emit('update', { brands: on ? [...current, brand] : current.filter((item) => item !== brand) })
}

const ratingLabel = (value: number) =>
  t('filters.ratingAtLeast', { value: n(value, { maximumFractionDigits: 1 }) })
</script>

<template>
  <div class="flex flex-col gap-7">
    <fieldset class="flex flex-col gap-3">
      <legend class="mb-3 text-overline-sm font-semibold text-foreground-muted uppercase">
        {{ t('filters.section') }}
      </legend>
      <div class="flex flex-wrap gap-1.5">
        <UiChip :label="t('filters.all')" :selected="!activeSection" @toggle="selectSection(undefined)" />
        <UiChip
          v-for="section in sections"
          :key="section.id"
          :label="section.name"
          :selected="activeSection?.id === section.id"
          @toggle="selectSection(section.id)"
        />
      </div>
    </fieldset>

    <fieldset v-if="activeSection && facets?.categories.length" class="flex flex-col gap-1" role="radiogroup">
      <legend class="mb-2 text-overline-sm font-semibold text-foreground-muted uppercase">
        {{ t('filters.category') }}
      </legend>
      <button
        v-for="option in [{ slug: undefined, count: facets.sectionTotal }, ...facets.categories]"
        :key="option.slug ?? 'all'"
        type="button"
        role="radio"
        :aria-checked="query.category === option.slug"
        class="flex min-h-9 cursor-pointer items-center justify-between gap-3 text-left text-body-sm"
        :class="
          query.category === option.slug
            ? 'font-semibold text-foreground'
            : 'text-foreground-muted hover:text-foreground'
        "
        @click="selectCategory(option.slug)"
      >
        <span class="flex items-center gap-2.5">
          <span
            class="flex size-4 items-center justify-center rounded-full border border-border-strong"
            aria-hidden="true"
          >
            <span v-if="query.category === option.slug" class="size-2 rounded-full bg-foreground" />
          </span>
          {{ option.slug ? categoryName(option.slug) : t('filters.wholeSection') }}
        </span>
        <span class="text-caption tabular-nums">{{ option.count }}</span>
      </button>
    </fieldset>

    <fieldset class="flex flex-col gap-3">
      <legend class="mb-3 text-overline-sm font-semibold text-foreground-muted uppercase">
        {{ t('filters.price') }}
      </legend>
      <form
        class="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] items-end gap-2"
        @submit.prevent="applyPrice"
      >
        <label class="flex flex-col gap-1 text-caption text-foreground-muted">
          {{ t('filters.min') }}
          <UiInput v-model="priceMin" type="number" size="sm" min="0" inputmode="numeric" class="h-10!" />
        </label>
        <label class="flex flex-col gap-1 text-caption text-foreground-muted">
          {{ t('filters.max') }}
          <UiInput v-model="priceMax" type="number" size="sm" min="0" inputmode="numeric" class="h-10!" />
        </label>
        <UiButton type="submit" size="sm" class="h-10!">{{ t('filters.apply') }}</UiButton>
      </form>
    </fieldset>

    <fieldset class="flex flex-col gap-3">
      <legend class="mb-3 text-overline-sm font-semibold text-foreground-muted uppercase">
        {{ t('filters.rating') }}
      </legend>
      <div class="flex flex-wrap gap-1.5">
        <UiChip
          :label="t('filters.all')"
          :selected="query.rating === undefined"
          @toggle="emit('update', { rating: null })"
        />
        <UiChip
          v-for="value in RATING_FILTERS"
          :key="value"
          :label="ratingLabel(value)"
          :selected="query.rating === value"
          @toggle="emit('update', { rating: value })"
        />
      </div>
    </fieldset>

    <fieldset v-if="facets && facets.brands.length > 1" class="flex flex-col">
      <legend class="mb-2 text-overline-sm font-semibold text-foreground-muted uppercase">
        {{ t('filters.brand') }}
      </legend>
      <UiCheckbox
        v-for="brand in facets.brands"
        :key="brand"
        :label="brand"
        :model-value="query.brands?.includes(brand) ?? false"
        @update:model-value="toggleBrand(brand, $event)"
      />
    </fieldset>

    <fieldset class="flex flex-col gap-3.5">
      <legend class="mb-3 text-overline-sm font-semibold text-foreground-muted uppercase">
        {{ t('filters.availability') }}
      </legend>
      <UiSwitch
        :model-value="!!query.stock"
        :label="t('filters.inStock')"
        @update:model-value="emit('update', { stock: $event || null })"
      />
      <UiSwitch
        :model-value="!!query.promo"
        :label="t('filters.onSale')"
        @update:model-value="emit('update', { promo: $event || null })"
      />
    </fieldset>

    <div class="flex flex-col gap-2 pt-1">
      <slot name="actions" />
      <UiButton variant="outline" block @click="emit('reset')">{{ t('filters.reset') }}</UiButton>
    </div>
  </div>
</template>
