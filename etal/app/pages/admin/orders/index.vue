<script setup lang="ts">
import type { AdminOrder } from '#shared/types/admin'
import { ORDER_STATUSES, type OrderStatus } from '#shared/types/order'
import { useAdminActions } from '~/features/admin/composables/useAdminActions'
import { useAdminOrders } from '~/features/admin/composables/useAdminData'
import { matchesSearch, nextSort, paginate, sortRows, type SortState } from '~/features/admin/table'

/** Order table (E21): API carts and checkout orders, with their fictitious status. */
type Column = 'id' | 'customer' | 'items' | 'total' | 'date'
const PAGE_SIZE = 15

const { t, d, locale } = useI18n()
const { format } = usePrice()
const { orders, pending, error, refresh } = useAdminOrders()
const { setOrderStatus } = useAdminActions()

const search = ref('')
const status = ref('')
const sort = ref<SortState<Column>>({ key: 'date', direction: 'descending' })
const page = ref(1)
watch([search, status], () => (page.value = 1))

const itemCount = (order: AdminOrder) => order.lines.reduce((sum, line) => sum + line.quantity, 0)

function valueOf(order: AdminOrder, key: Column): string | number {
  if (key === 'items') return itemCount(order)
  if (key === 'total') return order.total.amount
  if (key === 'date') return order.createdAt
  return order[key]
}

const statusOptions = computed(() =>
  ORDER_STATUSES.map((value) => ({ value, label: t(`orders.status.${value}`) })),
)

const result = computed(() => {
  const rows = orders.value.filter(
    (order) =>
      (!status.value || order.status === status.value) &&
      matchesSearch(search.value, order.id, order.customer),
  )
  return paginate(sortRows(rows, sort.value, valueOf, locale.value), page.value, PAGE_SIZE)
})

const columns = computed(() => [
  { key: 'id' as const, label: t('admin.orders.columns.id') },
  { key: 'customer' as const, label: t('admin.orders.columns.customer') },
  { key: 'items' as const, label: t('admin.orders.columns.items'), align: 'end' as const },
  { key: 'total' as const, label: t('admin.orders.columns.total'), align: 'end' as const },
  { key: 'date' as const, label: t('admin.orders.columns.date') },
])

function changeStatus(order: AdminOrder, value: OrderStatus) {
  if (value !== order.status) setOrderStatus(order, value)
}

useSeoMeta({ title: () => t('admin.orders.title') })
</script>

<template>
  <div class="flex flex-col gap-6">
    <AdminPageHeader :overline="t('admin.orders.overline')" :title="t('admin.orders.title')" />

    <div class="flex flex-wrap items-center gap-3">
      <UiInput
        v-model="search"
        type="search"
        size="sm"
        icon-left="lucide:search"
        wrapper-class="flex-[1_1_260px] max-w-90"
        :placeholder="t('admin.orders.search')"
        :aria-label="t('admin.orders.searchLabel')"
      />
      <UiSelect
        v-model="status"
        :options="statusOptions"
        :placeholder="t('admin.orders.allStatuses')"
        :aria-label="t('admin.orders.statusFilter')"
      />
    </div>

    <AdminDataState
      :pending="pending"
      :error="error"
      :ready="orders.length > 0"
      :empty="!result.total"
      :empty-text="t('admin.orders.empty')"
      @retry="refresh()"
    >
      <div class="overflow-x-auto rounded-md border border-border bg-surface">
        <table class="w-full min-w-[820px] border-collapse text-body-sm">
          <caption class="sr-only">
            {{
              t('admin.orders.title')
            }}
          </caption>
          <thead>
            <tr class="border-b border-border">
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
                class="px-2 text-left text-overline-sm font-semibold text-foreground-muted uppercase"
              >
                {{ t('admin.orders.columns.status') }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in result.items" :key="order.id" class="border-b border-border last:border-b-0">
              <td class="px-2 py-2.5 font-medium tabular-nums">
                <NuxtLinkLocale :to="`/admin/orders/${order.id}`" class="hover:text-accent-text">{{
                  order.id
                }}</NuxtLinkLocale>
              </td>
              <td class="px-2">{{ order.customer }}</td>
              <td class="px-2 text-right tabular-nums">{{ itemCount(order) }}</td>
              <td class="px-2 text-right font-medium tabular-nums">{{ format(order.total) }}</td>
              <td class="px-2 text-foreground-muted tabular-nums">
                {{ d(new Date(order.createdAt), 'short') }}
              </td>
              <td class="w-48 px-2 py-2">
                <OrderStatusSelect
                  :model-value="order.status"
                  :label="t('admin.orders.statusOf', { id: order.id })"
                  @update:model-value="changeStatus(order, $event)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <AdminTableFooter
        :count="t('admin.orders.count', { count: result.total }, result.total)"
        :page="result.page"
        :page-count="result.pageCount"
        @change="page = $event"
      />
    </AdminDataState>
  </div>
</template>
