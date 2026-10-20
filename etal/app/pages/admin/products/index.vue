<script setup lang="ts">
import type { Product } from '#shared/types/catalog'
import { LOW_STOCK_THRESHOLD } from '#shared/utils/product-rules'
import { useAdminActions } from '~/features/admin/composables/useAdminActions'
import { useAdminProducts } from '~/features/admin/composables/useAdminData'
import { matchesSearch, nextSort, paginate, sortRows, type SortState } from '~/features/admin/table'

/** Product table (E18): search, category filter, sorting, paging, multi-select delete. */
type Column = 'title' | 'category' | 'price' | 'stock' | 'rating'
const PAGE_SIZE = 10

const { t, n, locale } = useI18n()
const { format } = usePrice()
const categoryName = useCategoryName()
const { products, pending, error, refresh } = useAdminProducts()
const { deleteProducts } = useAdminActions()

const search = ref('')
const category = ref('')
const sort = ref<SortState<Column>>({ key: 'title', direction: 'ascending' })
const page = ref(1)
const selected = ref<number[]>([])
watch([search, category], () => (page.value = 1))

const categoryOptions = computed(() =>
  [...new Set(products.value.map((product) => product.category.slug))]
    .map((slug) => ({ value: slug, label: categoryName(slug) }))
    .sort((a, b) => a.label.localeCompare(b.label, locale.value)),
)

const filtered = computed(() =>
  products.value.filter(
    (product) =>
      (!category.value || product.category.slug === category.value) &&
      matchesSearch(search.value, product.title, product.brand),
  ),
)

function valueOf(product: Product, key: Column): string | number {
  if (key === 'category') return categoryName(product.category)
  if (key === 'price') return product.price.amount
  if (key === 'rating') return product.rating.average
  return product[key]
}

const result = computed(() =>
  paginate(sortRows(filtered.value, sort.value, valueOf, locale.value), page.value, PAGE_SIZE),
)

const columns = computed(() => [
  { key: 'title' as const, label: t('admin.products.columns.product') },
  { key: 'category' as const, label: t('admin.products.columns.category') },
  { key: 'price' as const, label: t('admin.products.columns.price'), align: 'end' as const },
  { key: 'stock' as const, label: t('admin.products.columns.stock'), align: 'end' as const },
  { key: 'rating' as const, label: t('admin.products.columns.rating'), align: 'end' as const },
])

const pageIds = computed(() => result.value.items.map((product) => product.id))
const allSelected = computed(
  () => pageIds.value.length > 0 && pageIds.value.every((id) => selected.value.includes(id)),
)

function toggle(id: number) {
  selected.value = selected.value.includes(id)
    ? selected.value.filter((item) => item !== id)
    : [...selected.value, id]
}

function toggleAll() {
  selected.value = allSelected.value
    ? selected.value.filter((id) => !pageIds.value.includes(id))
    : [...new Set([...selected.value, ...pageIds.value])]
}

const pendingDelete = ref<Product[]>([])
const confirmOpen = ref(false)
const confirmTitle = computed(() =>
  pendingDelete.value.length === 1
    ? t('admin.products.confirm.titleOne', { title: pendingDelete.value[0]!.title })
    : t('admin.products.confirm.titleMany', { count: pendingDelete.value.length }),
)

function askDelete(items: Product[]) {
  pendingDelete.value = items
  confirmOpen.value = true
}

async function confirmDelete() {
  const ids = pendingDelete.value.map((product) => product.id)
  if (await deleteProducts(pendingDelete.value)) {
    selected.value = selected.value.filter((id) => !ids.includes(id))
  }
}

useSeoMeta({ title: () => t('admin.products.title') })
</script>

<template>
  <div class="flex flex-col gap-6">
    <AdminPageHeader :overline="t('admin.products.overline')" :title="t('admin.products.title')">
      <template #actions>
        <UiButton to="/admin/products/new" icon-left="lucide:plus">{{ t('admin.products.new') }}</UiButton>
      </template>
    </AdminPageHeader>

    <div class="flex flex-wrap items-center gap-3">
      <UiInput
        v-model="search"
        type="search"
        size="sm"
        icon-left="lucide:search"
        wrapper-class="flex-[1_1_260px] max-w-90"
        :placeholder="t('admin.products.search')"
        :aria-label="t('admin.products.searchLabel')"
      />
      <UiSelect
        v-model="category"
        :options="categoryOptions"
        :placeholder="t('admin.products.allCategories')"
        :aria-label="t('admin.products.categoryFilter')"
      />
      <UiButton
        v-if="selected.length"
        variant="danger-outline"
        icon-left="lucide:trash-2"
        @click="askDelete(products.filter((product) => selected.includes(product.id)))"
      >
        {{ t('admin.products.deleteSelection', { count: selected.length }) }}
      </UiButton>
    </div>

    <AdminDataState
      :pending="pending"
      :error="error"
      :ready="products.length > 0"
      :empty="!result.total"
      :empty-text="t('admin.products.empty')"
      @retry="refresh()"
    >
      <div class="overflow-x-auto rounded-md border border-border bg-surface">
        <table class="w-full min-w-[860px] border-collapse text-body-sm">
          <caption class="sr-only">
            {{
              t('admin.products.title')
            }}
          </caption>
          <thead>
            <tr class="border-b border-border">
              <th scope="col" class="w-11 px-2">
                <input
                  type="checkbox"
                  class="size-4 cursor-pointer accent-foreground"
                  :checked="allSelected"
                  :aria-label="t('admin.products.selectAll')"
                  @change="toggleAll"
                />
              </th>
              <th scope="col" class="w-14">
                <span class="sr-only">{{ t('admin.products.columns.image') }}</span>
              </th>
              <AdminSortHeader
                v-for="column in columns"
                :key="column.key"
                :label="column.label"
                :column="column.key"
                :sort="sort"
                :align="column.align"
                @sort="sort = nextSort(sort, $event)"
              />
              <th
                scope="col"
                class="px-2 text-right text-overline-sm font-semibold text-foreground-muted uppercase"
              >
                {{ t('admin.products.columns.actions') }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="product in result.items"
              :key="product.id"
              class="border-b border-border last:border-b-0"
              :class="selected.includes(product.id) && 'bg-background'"
            >
              <td class="px-2 text-center">
                <input
                  type="checkbox"
                  class="size-4 cursor-pointer accent-foreground"
                  :checked="selected.includes(product.id)"
                  :aria-label="t('admin.products.select', { title: product.title })"
                  @change="toggle(product.id)"
                />
              </td>
              <td class="w-14 py-2">
                <SharedProductImage
                  :src="product.thumbnail.src"
                  alt=""
                  sizes="40px"
                  rounded="sm"
                  class="w-10"
                />
              </td>
              <td class="max-w-0 px-2">
                <NuxtLinkLocale
                  :to="`/admin/products/${product.id}`"
                  class="flex flex-col hover:text-accent-text"
                >
                  <span class="truncate font-medium">{{ product.title }}</span>
                  <span class="text-caption text-foreground-muted">{{
                    t('admin.products.reference', { id: product.id, brand: product.brand ?? '—' })
                  }}</span>
                </NuxtLinkLocale>
              </td>
              <td class="px-2 text-foreground-muted">{{ categoryName(product.category) }}</td>
              <td class="px-2 text-right tabular-nums">{{ format(product.price) }}</td>
              <td
                class="px-2 text-right tabular-nums"
                :class="product.stock < LOW_STOCK_THRESHOLD && 'font-semibold text-warning'"
              >
                {{ product.stock }}
              </td>
              <td class="px-2 text-right tabular-nums">
                {{ n(product.rating.average, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) }}
              </td>
              <td class="px-2">
                <div class="flex justify-end gap-0.5">
                  <UiButton
                    :to="`/admin/products/${product.id}`"
                    variant="ghost"
                    icon="lucide:pencil"
                    :label="t('admin.products.edit', { title: product.title })"
                  />
                  <UiButton
                    variant="ghost"
                    icon="lucide:trash-2"
                    class="text-danger"
                    :label="t('admin.products.delete', { title: product.title })"
                    @click="askDelete([product])"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <AdminTableFooter
        :count="t('admin.products.count', { count: result.total }, result.total)"
        :page="result.page"
        :page-count="result.pageCount"
        @change="page = $event"
      />
    </AdminDataState>

    <UiConfirmDialog
      v-model:open="confirmOpen"
      :title="confirmTitle"
      :description="t('admin.products.confirm.text')"
      :confirm-label="t('admin.products.confirm.ok')"
      @confirm="confirmDelete"
    />
  </div>
</template>
