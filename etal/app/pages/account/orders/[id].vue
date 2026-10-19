<script setup lang="ts">
import { ORDER_STATUSES } from '#shared/types/order'
import { toProductParam } from '#shared/utils/slug'
import { useMyOrders } from '~/features/account/composables/useMyOrders'

/** Order detail (E16): tracking bar, lines, delivery and totals. */
const route = useRoute()
const { t, d } = useI18n()
const { format } = usePrice()
const { find, pending } = useMyOrders()

const order = computed(() => find(String(route.params.id)))
const progress = computed(() => (order.value ? ORDER_STATUSES.indexOf(order.value.status) : -1))

useSeoMeta({ title: () => order.value?.id ?? t('account.orders.title') })
</script>

<template>
  <div class="flex flex-col gap-10">
    <NuxtLinkLocale
      to="/account/orders"
      class="inline-flex items-center gap-1.5 self-start text-body-sm text-foreground-muted transition-colors duration-150 hover:text-foreground"
    >
      <Icon name="lucide:arrow-left" class="size-4" aria-hidden="true" />
      {{ t('account.orders.title') }}
    </NuxtLinkLocale>

    <div v-if="!order && pending" class="h-64" aria-busy="true" />
    <p v-else-if="!order" class="font-serif text-[28px]">{{ t('checkout.success.notFound') }}</p>

    <template v-else>
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div class="flex flex-col gap-2">
          <p class="text-overline font-semibold text-foreground-muted uppercase">
            {{ t('account.orders.placedOn', { date: d(new Date(order.createdAt), 'long') }) }}
          </p>
          <h1 class="text-[clamp(2rem,1.5rem+2.4vw,3.25rem)] leading-[1.05] font-normal tabular-nums">
            {{ order.id }}
          </h1>
        </div>
        <OrderStatusBadge :status="order.status" />
      </div>

      <ol class="grid grid-cols-4 gap-2" :aria-label="t('account.orders.tracking')">
        <li
          v-for="(status, index) in ORDER_STATUSES"
          :key="status"
          class="flex flex-col gap-2"
          :aria-current="index === progress ? 'step' : undefined"
        >
          <span
            class="h-[3px] rounded-sm"
            :class="index <= progress ? 'bg-foreground' : 'bg-border'"
            aria-hidden="true"
          />
          <span class="text-meta" :class="index <= progress ? 'text-foreground' : 'text-foreground-muted'">
            {{ t(`orders.status.${status}`) }}
          </span>
        </li>
      </ol>

      <ul>
        <li
          v-for="line in order.lines"
          :key="line.productId"
          class="grid grid-cols-[64px_minmax(0,1fr)_auto] items-center gap-4 border-b border-border py-4"
        >
          <SharedProductImage :src="line.thumbnail.src" alt="" sizes="64px" />
          <span class="flex flex-col">
            <NuxtLinkLocale
              :to="`/products/${toProductParam({ id: line.productId, slug: line.slug })}`"
              class="text-ui font-medium hover:text-accent-text"
            >
              {{ line.title }}
            </NuxtLinkLocale>
            <span class="text-meta text-foreground-muted tabular-nums">
              {{ t('checkout.success.lineDetail', { count: line.quantity, price: format(line.unitPrice) }) }}
            </span>
          </span>
          <span class="font-medium tabular-nums">
            {{ format({ ...line.unitPrice, amount: line.unitPrice.amount * line.quantity }) }}
          </span>
        </li>
      </ul>

      <div class="flex flex-wrap gap-8">
        <div class="flex flex-[1_1_240px] flex-col gap-1.5">
          <p class="text-overline-sm font-semibold text-foreground-muted uppercase">
            {{ t('checkout.success.delivery') }}
          </p>
          <p class="text-ui">{{ order.address || t('account.orders.profileAddress') }}</p>
          <p class="text-body-sm text-foreground-muted">
            {{ t(`checkout.methods.${order.shippingMethod}.label`) }}
          </p>
        </div>
        <dl class="m-0 flex flex-[1_1_240px] flex-col gap-2 text-ui tabular-nums">
          <div class="flex justify-between">
            <dt class="text-foreground-muted">{{ t('cart.subtotal') }}</dt>
            <dd class="m-0">{{ format(order.subtotal) }}</dd>
          </div>
          <div v-if="order.discount.amount" class="flex justify-between">
            <dt class="text-foreground-muted">{{ t('cart.discount') }}</dt>
            <dd class="m-0">−{{ format(order.discount) }}</dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-foreground-muted">{{ t('checkout.success.delivery') }}</dt>
            <dd class="m-0">{{ order.shipping.amount ? format(order.shipping) : t('cart.free') }}</dd>
          </div>
          <div class="flex justify-between border-t border-border pt-2.5">
            <dt class="font-semibold">{{ t('cart.total') }}</dt>
            <dd class="m-0 text-[20px] font-medium">{{ format(order.total) }}</dd>
          </div>
        </dl>
      </div>
    </template>
  </div>
</template>
