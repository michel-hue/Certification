<script setup lang="ts">
import { useMyOrders } from '~/features/account/composables/useMyOrders'

/** Account overview (E14): greeting, counters and the latest orders. */
const { t } = useI18n()
const { user } = useAuth()
const { orders, pending, error, refresh } = useMyOrders()

const cart = useCartStore()
const wishlist = useWishlistStore()
// Both stores restore from localStorage on the client only.
const mounted = useMounted()

const stats = computed(() => [
  { to: '/account/orders', label: t('account.stats.orders'), value: orders.value.length },
  { to: '/wishlist', label: t('account.stats.wishlist'), value: mounted.value ? wishlist.count : 0 },
  { to: '/cart', label: t('account.stats.cart'), value: mounted.value ? cart.itemCount : 0 },
])
const latest = computed(() => orders.value.slice(0, 3))

useSeoMeta({ title: () => t('account.title') })
</script>

<template>
  <div class="flex flex-col gap-10">
    <div class="flex flex-col gap-3">
      <p class="text-overline font-semibold text-foreground-muted uppercase">{{ t('account.title') }}</p>
      <h1 class="text-[clamp(2.25rem,1.6rem+3vw,4rem)] leading-[1.02] font-normal tracking-[-0.02em]">
        {{ t('account.hello') }} <em>{{ user?.firstName }}</em>
      </h1>
    </div>

    <ul class="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
      <li v-for="stat in stats" :key="stat.to">
        <NuxtLinkLocale
          :to="stat.to"
          class="flex flex-col gap-2 rounded-md border border-border bg-surface p-5 transition-colors duration-150 hover:border-border-strong"
        >
          <span class="text-overline-sm font-semibold text-foreground-muted uppercase">{{ stat.label }}</span>
          <span class="font-serif text-[40px] leading-none tabular-nums">{{ stat.value }}</span>
        </NuxtLinkLocale>
      </li>
    </ul>

    <section class="flex flex-col gap-2" aria-labelledby="latest-orders">
      <div class="flex items-baseline justify-between border-b border-border pb-4">
        <h2 id="latest-orders" class="text-[26px] font-medium">{{ t('account.latestOrders') }}</h2>
        <NuxtLinkLocale to="/account/orders" class="text-body-sm text-accent-text">{{
          t('account.allOrders')
        }}</NuxtLinkLocale>
      </div>

      <SharedErrorState
        v-if="error && !orders.length"
        :title="t('account.orders.error')"
        :retrying="pending"
        @retry="refresh()"
      />
      <div v-else-if="pending && !orders.length" class="flex flex-col gap-3" aria-busy="true">
        <UiSkeleton v-for="index in 3" :key="index" class="h-16" />
      </div>
      <div v-else-if="latest.length">
        <OrderRow
          v-for="order in latest"
          :key="order.id"
          :order="order"
          :to="`/account/orders/${order.id}`"
        />
      </div>
      <p v-else class="py-6 text-foreground-muted">
        {{ t('account.noOrders') }}
        <NuxtLinkLocale to="/products" class="text-accent-text">{{ t('account.discover') }}</NuxtLinkLocale>
      </p>
    </section>
  </div>
</template>
