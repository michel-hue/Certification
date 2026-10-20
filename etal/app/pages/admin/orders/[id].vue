<script setup lang="ts">
import type { OrderStatus } from '#shared/types/order'
import { useAdminActions } from '~/features/admin/composables/useAdminActions'
import { useAdminOrders } from '~/features/admin/composables/useAdminData'

/** Order detail (E21): product lines, totals, customer and a locally editable status. */
const route = useRoute()
const { t, d } = useI18n()
const { format } = usePrice()
const { orders, pending, error, refresh } = useAdminOrders()
const { setOrderStatus } = useAdminActions()

const order = computed(() => orders.value.find((item) => item.id === String(route.params.id)))
const itemCount = computed(() => order.value?.lines.reduce((sum, line) => sum + line.quantity, 0) ?? 0)
/** API carts get `ET-C` ids; the demo checkout `ET-` + six characters. */
const fromCheckout = computed(() => !!order.value && !order.value.id.startsWith('ET-C'))

const status = computed({
  get: () => order.value?.status ?? 'pending',
  set: (value: OrderStatus) => {
    if (order.value && value !== order.value.status) setOrderStatus(order.value, value)
  },
})

const meta = computed(() => {
  const value = order.value
  if (!value) return []
  return [
    { label: t('admin.orders.meta.customer'), value: value.customer },
    { label: t('admin.orders.meta.date'), value: d(new Date(value.createdAt), 'long') },
    {
      label: t('admin.orders.meta.items'),
      value: t('orders.items', { count: itemCount.value }, itemCount.value),
    },
    { label: t('admin.orders.meta.delivery'), value: value.address || '—' },
    {
      label: t('admin.orders.meta.source'),
      value: t(fromCheckout.value ? 'admin.orders.sources.checkout' : 'admin.orders.sources.api'),
    },
  ]
})

useSeoMeta({ title: () => order.value?.id ?? t('admin.orders.title') })
</script>

<template>
  <div class="flex flex-col gap-8">
    <NuxtLinkLocale
      to="/admin/orders"
      class="inline-flex items-center gap-1.5 self-start text-body-sm text-foreground-muted transition-colors duration-150 hover:text-foreground"
    >
      <Icon name="lucide:arrow-left" class="size-4" aria-hidden="true" />
      {{ t('admin.orders.back') }}
    </NuxtLinkLocale>

    <AdminDataState
      :pending="pending"
      :error="error"
      :ready="orders.length > 0"
      :empty="!order"
      :empty-text="t('admin.orders.notFound')"
      :rows="4"
      @retry="refresh()"
    >
      <template v-if="order">
        <div class="flex flex-wrap items-end justify-between gap-4">
          <div class="flex flex-col gap-2">
            <p class="text-overline font-semibold text-foreground-muted uppercase">
              {{ t('account.orders.placedOn', { date: d(new Date(order.createdAt), 'long') }) }}
            </p>
            <h1 class="text-[clamp(1.75rem,1.4rem+1.6vw,2.5rem)] leading-[1.1] font-medium tabular-nums">
              {{ order.id }}
            </h1>
          </div>
          <OrderStatusBadge :status="order.status" />
        </div>

        <div class="flex flex-wrap items-start gap-6">
          <section
            class="flex min-w-0 flex-[3_1_420px] flex-col rounded-md border border-border bg-surface px-6 py-2"
            :aria-label="t('admin.orders.lines')"
          >
            <ul>
              <li
                v-for="line in order.lines"
                :key="line.productId"
                class="grid grid-cols-[48px_minmax(0,1fr)_auto] items-center gap-4 border-b border-border py-4"
              >
                <SharedProductImage :src="line.thumbnail.src" alt="" sizes="48px" rounded="sm" />
                <span class="flex min-w-0 flex-col">
                  <NuxtLinkLocale
                    :to="`/admin/products/${line.productId}`"
                    class="truncate font-medium hover:text-accent-text"
                  >
                    {{ line.title }}
                  </NuxtLinkLocale>
                  <span class="text-meta text-foreground-muted tabular-nums">
                    {{
                      t('checkout.success.lineDetail', {
                        count: line.quantity,
                        price: format(line.unitPrice),
                      })
                    }}
                  </span>
                </span>
                <span class="font-medium tabular-nums">
                  {{ format({ ...line.unitPrice, amount: line.unitPrice.amount * line.quantity }) }}
                </span>
              </li>
            </ul>
            <dl class="m-0 flex flex-col gap-2 py-4 text-ui tabular-nums">
              <div class="flex justify-between">
                <dt class="text-foreground-muted">{{ t('cart.subtotal') }}</dt>
                <dd class="m-0">{{ format(order.subtotal) }}</dd>
              </div>
              <div v-if="order.discount.amount" class="flex justify-between">
                <dt class="text-foreground-muted">{{ t('cart.discount') }}</dt>
                <dd class="m-0">−{{ format(order.discount) }}</dd>
              </div>
              <div class="flex justify-between border-t border-border pt-2.5">
                <dt class="font-semibold">{{ t('cart.total') }}</dt>
                <dd class="m-0 text-[20px] font-medium">{{ format(order.total) }}</dd>
              </div>
            </dl>
          </section>

          <section
            class="flex flex-[2_1_280px] flex-col gap-5 rounded-md border border-border bg-surface p-6"
            :aria-label="t('admin.orders.details')"
          >
            <UiFormField
              v-slot="field"
              :label="t('admin.orders.columns.status')"
              :help="t('admin.orders.statusNote')"
            >
              <OrderStatusSelect
                :id="field.id"
                v-model="status"
                :label="t('admin.orders.statusOf', { id: order.id })"
              />
            </UiFormField>
            <dl class="m-0 flex flex-col gap-3 border-t border-border pt-5">
              <div v-for="item in meta" :key="item.label" class="flex flex-col gap-0.5">
                <dt class="text-overline-sm font-semibold text-foreground-muted uppercase">
                  {{ item.label }}
                </dt>
                <dd class="m-0 text-body-sm">{{ item.value }}</dd>
              </div>
            </dl>
          </section>
        </div>
      </template>
    </AdminDataState>
  </div>
</template>
