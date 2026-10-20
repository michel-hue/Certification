<script setup lang="ts">
import type { ShippingDetails } from '#shared/schemas/checkout'
import { useCheckout } from '~/features/checkout/composables/useCheckout'

/** Checkout tunnel (E9 → E10), accessible as a guest. Header and footer are trimmed. */
definePageMeta({ checkoutChrome: true })

const { t } = useI18n()
const localePath = useLocalePath()
const cart = useCartStore()
const orders = useOrdersStore()
const mounted = useMounted()
const { step, details, reset } = useCheckout()
const { user, loggedIn } = useAuth()

/** Signed-in customers start with their profile; the guest hint is replaced. */
const initialDetails = computed(() => {
  if (details.value || !user.value) return details.value
  const address = user.value.address
  return {
    firstName: user.value.firstName,
    lastName: user.value.lastName,
    email: user.value.email,
    phone: user.value.phone ?? '',
    ...(address &&
      /^\d{5}$/.test(address.postalCode) && {
        address: address.line1,
        postalCode: address.postalCode,
        city: address.city,
      }),
  }
})

const steps = computed(() => [
  t('checkout.steps.shipping'),
  t('checkout.steps.payment'),
  t('checkout.steps.confirmation'),
])
const holder = computed(() => (details.value ? `${details.value.firstName} ${details.value.lastName}` : ''))

function toTop() {
  if (import.meta.client) window.scrollTo({ top: 0 })
}

function onShippingDone(values: ShippingDetails) {
  details.value = values
  step.value = 2
  toTop()
}

async function onPaid() {
  if (!details.value) return
  const order = orders.place({
    items: cart.items,
    totals: cart.totals,
    shippingMethod: cart.shippingMethod,
    details: details.value,
    userId: user.value?.id,
  })
  cart.clear()
  reset()
  await navigateTo(localePath(`/checkout/success/${order.id}`))
}

useSeoMeta({ title: () => t('checkout.pageTitle'), robots: 'noindex, nofollow' })
</script>

<template>
  <div class="mx-auto max-w-[1200px] px-gutter pt-10 pb-section">
    <UiStepper :steps="steps" :current="step" :label="t('checkout.steps.label')" class="mb-10" />

    <div v-if="!mounted" class="h-96" aria-busy="true" />

    <div v-else-if="cart.isEmpty" class="flex flex-col items-start gap-4 py-12">
      <p class="font-serif text-[28px]">{{ t('checkout.empty') }}</p>
      <NuxtLinkLocale to="/products" class="link-underlined text-accent-text">{{
        t('checkout.backToCatalog')
      }}</NuxtLinkLocale>
    </div>

    <div v-else class="flex flex-wrap-reverse items-start gap-[clamp(32px,5vw,72px)]">
      <div class="flex min-w-0 flex-[3_1_460px] flex-col">
        <ShippingStep v-if="step === 1" :initial="initialDetails" @done="onShippingDone">
          <template v-if="!loggedIn" #hint>
            <p class="text-body-sm text-foreground-muted">
              {{ t('checkout.shipping.guest') }}
              <NuxtLinkLocale
                :to="{ path: '/login', query: { redirect: '/checkout' } }"
                class="text-accent-text underline underline-offset-3"
              >
                {{ t('checkout.shipping.signIn') }}
              </NuxtLinkLocale>
              {{ t('checkout.shipping.toPrefill') }}
            </p>
          </template>
        </ShippingStep>
        <PaymentStep v-else :total="cart.totals.total" :holder="holder" @back="step = 1" @paid="onPaid" />
      </div>
      <CheckoutSummary class="flex-[2_1_320px]" />
    </div>
  </div>
</template>
