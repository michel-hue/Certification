<script setup lang="ts">
/** Order confirmation (E11): editorial thank-you, order facts, lines, next steps. */
const route = useRoute()
const { t, d } = useI18n()
const { format } = usePrice()
const orders = useOrdersStore()
const mounted = useMounted()

const order = computed(() => (mounted.value ? orders.find(String(route.params.id)) : undefined))
const facts = computed(() => {
  if (!order.value) return []
  return [
    { label: t('checkout.success.number'), value: order.value.id },
    { label: t('checkout.success.paid'), value: format(order.value.total) },
    {
      label: t('checkout.success.delivery'),
      value: t(`checkout.methods.${order.value.shippingMethod}.label`),
    },
    { label: t('checkout.success.address'), value: order.value.address },
  ]
})

useSeoMeta({ title: () => t('checkout.success.pageTitle'), robots: 'noindex, nofollow' })
</script>

<template>
  <div class="mx-auto flex max-w-[960px] flex-col gap-10 px-gutter pt-[clamp(48px,8vw,112px)]">
    <div v-if="!mounted" class="h-96" aria-busy="true" />

    <template v-else-if="order">
      <div class="flex flex-col gap-5">
        <p class="flex items-center gap-2 text-overline font-semibold text-success uppercase">
          <Icon name="lucide:check" class="size-4" aria-hidden="true" />
          {{ t('checkout.success.overline') }}
        </p>
        <h1
          class="text-[clamp(2.75rem,1.6rem+4.9vw,5rem)] leading-none font-normal tracking-[-0.02em] text-balance [font-variation-settings:'opsz'_144]"
        >
          {{ t('checkout.success.thanks') }} <em class="text-accent">{{ order.firstName }}</em
          >.
        </h1>
        <p class="max-w-[32em] text-body-lg text-pretty text-foreground-muted">
          {{ t('checkout.success.text') }}
        </p>
      </div>

      <dl
        class="m-0 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6 border-t border-foreground pt-6"
      >
        <div v-for="fact in facts" :key="fact.label" class="flex flex-col gap-1">
          <dt class="text-overline-sm font-semibold text-foreground-muted uppercase">{{ fact.label }}</dt>
          <dd class="m-0 font-medium tabular-nums">{{ fact.value }}</dd>
        </div>
      </dl>

      <ul>
        <li
          v-for="line in order.lines"
          :key="line.productId"
          class="grid grid-cols-[64px_minmax(0,1fr)_auto] items-center gap-4 border-b border-border py-4"
        >
          <SharedProductImage :src="line.thumbnail.src" alt="" sizes="64px" />
          <span class="flex flex-col">
            <span class="text-ui font-medium">{{ line.title }}</span>
            <span class="text-meta text-foreground-muted tabular-nums">
              {{ t('checkout.success.lineDetail', { count: line.quantity, price: format(line.unitPrice) }) }}
            </span>
          </span>
          <span class="font-medium tabular-nums">
            {{ format({ ...line.unitPrice, amount: line.unitPrice.amount * line.quantity }) }}
          </span>
        </li>
      </ul>
      <p class="sr-only">
        {{ t('checkout.success.placedOn', { date: d(new Date(order.createdAt), 'long') }) }}
      </p>

      <div class="flex flex-wrap gap-4">
        <!-- « Suivre ma commande » replaces this link once accounts exist (lot 5). -->
        <UiButton to="/" size="lg">{{ t('checkout.success.home') }}</UiButton>
        <UiButton to="/products" size="lg" variant="secondary">{{ t('cart.continue') }}</UiButton>
      </div>
    </template>

    <div v-else class="flex flex-col items-start gap-4">
      <h1 class="text-[40px] font-normal">{{ t('checkout.success.notFound') }}</h1>
      <NuxtLinkLocale to="/" class="text-accent-text underline underline-offset-3">{{
        t('checkout.success.home')
      }}</NuxtLinkLocale>
    </div>
  </div>
</template>
