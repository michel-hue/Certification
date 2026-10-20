<script setup lang="ts">
import { lowStock, ratingDistribution, revenue, salesByCategory } from '~/features/admin/dashboard'
import { useAdminOrders, useAdminProducts, useAdminUsers } from '~/features/admin/composables/useAdminData'

/** Back-office dashboard (E17): KPIs, two charts, latest orders and low stock. */
const { t, d } = useI18n()
const { format } = usePrice()
const { currency } = useAppConfig()
const categoryName = useCategoryName()

const products = useAdminProducts()
const users = useAdminUsers()
const orders = useAdminOrders()

const ready = computed(() => products.products.value.length > 0 && orders.orders.value.length > 0)
const error = computed(() => products.error.value ?? users.error.value ?? orders.error.value)
const pending = computed(() => products.pending.value || users.pending.value || orders.pending.value)

function retry() {
  void products.refresh()
  void users.refresh()
  void orders.refresh()
}

const lowStockProducts = computed(() => lowStock(products.products.value))
const adminCount = computed(() => users.users.value.filter((user) => user.role === 'admin').length)

const kpis = computed(() => [
  {
    label: t('admin.dashboard.kpis.products'),
    value: String(products.products.value.length),
    note: t('admin.dashboard.notes.lowStock', { count: lowStock(products.products.value, Infinity).length }),
  },
  {
    label: t('admin.dashboard.kpis.users'),
    value: users.users.value.length ? String(users.users.value.length) : '—',
    note: t('admin.dashboard.notes.admins', { count: adminCount.value }, adminCount.value),
  },
  {
    label: t('admin.dashboard.kpis.orders'),
    value: String(orders.orders.value.length),
    note: t('admin.dashboard.notes.checkout', { count: orders.checkoutCount.value }),
  },
  {
    label: t('admin.dashboard.kpis.revenue'),
    value: format(revenue(orders.orders.value, currency)),
    note: t('admin.dashboard.notes.revenue'),
  },
])

const sales = computed(() => {
  const rows = salesByCategory(orders.orders.value, products.products.value, currency)
  const max = Math.max(1, ...rows.map((row) => row.total.amount))
  return rows.map((row, index) => ({
    ...row,
    name: row.slug === 'other' ? t('admin.dashboard.otherCategory') : categoryName(row.slug),
    width: `${(row.total.amount / max) * 100}%`,
    highlight: index === 0,
  }))
})

const ratings = computed(() => {
  const buckets = ratingDistribution(products.products.value)
  const max = Math.max(1, ...buckets.map((bucket) => bucket.count))
  return buckets.map((bucket, index) => ({
    ...bucket,
    height: `${(bucket.count / max) * 100}%`,
    highlight: index === 0,
  }))
})

const latestOrders = computed(() => orders.orders.value.slice(0, 5))

useSeoMeta({ title: () => t('admin.dashboard.title') })
</script>

<template>
  <div class="flex flex-col gap-8">
    <AdminPageHeader :overline="t('admin.dashboard.overline')" :title="t('admin.dashboard.title')" />

    <AdminDataState
      :pending="pending"
      :error="error"
      :ready="ready"
      :empty="false"
      empty-text=""
      :rows="4"
      @retry="retry"
    >
      <dl class="m-0 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
        <AdminStatCard v-for="kpi in kpis" :key="kpi.label" v-bind="kpi" />
      </dl>

      <div class="flex flex-wrap gap-4">
        <AdminPanel
          class="flex-[3_1_420px]"
          :title="t('admin.dashboard.sales')"
          :hint="t('admin.dashboard.salesHint')"
        >
          <ul class="flex flex-col gap-3">
            <li
              v-for="row in sales"
              :key="row.slug"
              class="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1.5 text-meta sm:grid-cols-[minmax(90px,140px)_minmax(0,1fr)_96px]"
            >
              <span class="truncate text-foreground-muted">{{ row.name }}</span>
              <span
                class="h-2.5 overflow-hidden rounded-sm bg-surface-muted max-sm:order-last max-sm:col-span-2"
                aria-hidden="true"
              >
                <span
                  class="block h-full rounded-sm"
                  :class="row.highlight ? 'bg-accent' : 'bg-foreground'"
                  :style="{ width: row.width }"
                />
              </span>
              <span class="text-right tabular-nums">{{ format(row.total) }}</span>
            </li>
          </ul>
        </AdminPanel>

        <AdminPanel
          class="flex-[2_1_300px]"
          :title="t('admin.dashboard.ratings')"
          :hint="t('admin.dashboard.ratingsHint', { count: products.products.value.length })"
        >
          <ul class="grid min-h-45 flex-1 grid-cols-5 items-end gap-3">
            <li
              v-for="bucket in ratings"
              :key="bucket.stars"
              class="flex h-full flex-col items-center justify-end gap-1.5 text-caption"
              :aria-label="t('admin.dashboard.ratingBucket', { stars: bucket.stars, count: bucket.count })"
            >
              <span class="tabular-nums" aria-hidden="true">{{ bucket.count }}</span>
              <span
                class="min-h-0.5 w-full rounded-t-sm"
                :class="bucket.highlight ? 'bg-accent' : 'bg-border-strong'"
                :style="{ height: bucket.height }"
                aria-hidden="true"
              />
              <span class="text-foreground-muted" aria-hidden="true">{{
                t('admin.dashboard.stars', { count: bucket.stars })
              }}</span>
            </li>
          </ul>
        </AdminPanel>
      </div>

      <div class="flex flex-wrap gap-4">
        <AdminPanel
          class="flex-[3_1_420px] gap-2"
          :title="t('admin.dashboard.latestOrders')"
          :link="{ to: '/admin/orders', label: t('admin.dashboard.seeAll') }"
        >
          <ul>
            <li v-for="order in latestOrders" :key="order.id" class="border-t border-border">
              <NuxtLinkLocale
                :to="`/admin/orders/${order.id}`"
                class="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-4 py-3 text-body-sm transition-colors duration-150 hover:bg-background"
              >
                <span class="flex min-w-0 flex-col">
                  <span class="font-medium whitespace-nowrap tabular-nums">{{ order.id }}</span>
                  <span class="truncate text-caption text-foreground-muted">
                    {{ order.customer }} · {{ d(new Date(order.createdAt), 'short') }}
                  </span>
                </span>
                <OrderStatusBadge :status="order.status" />
                <span class="font-medium tabular-nums">{{ format(order.total) }}</span>
              </NuxtLinkLocale>
            </li>
          </ul>
        </AdminPanel>

        <AdminPanel
          class="flex-[2_1_300px] gap-2"
          :title="t('admin.dashboard.lowStock')"
          :link="{ to: '/admin/products', label: t('admin.dashboard.manage') }"
        >
          <ul v-if="lowStockProducts.length">
            <li v-for="product in lowStockProducts" :key="product.id" class="border-t border-border">
              <NuxtLinkLocale
                :to="`/admin/products/${product.id}`"
                class="grid grid-cols-[36px_minmax(0,1fr)_auto] items-center gap-3 py-2.5 text-body-sm transition-colors duration-150 hover:bg-background"
              >
                <SharedProductImage :src="product.thumbnail.src" alt="" sizes="36px" rounded="sm" />
                <span class="truncate">{{ product.title }}</span>
                <span class="text-meta font-semibold text-warning tabular-nums">
                  {{ t('admin.dashboard.units', { count: product.stock }) }}
                </span>
              </NuxtLinkLocale>
            </li>
          </ul>
          <p v-else class="text-body-sm text-foreground-muted">{{ t('admin.dashboard.noLowStock') }}</p>
        </AdminPanel>
      </div>
    </AdminDataState>
  </div>
</template>
