<script setup lang="ts">
import { useForm } from 'vee-validate'
import { shippingDetailsSchema, type ShippingDetails } from '#shared/schemas/checkout'
import type { ShippingMethod } from '#shared/types/order'
import { zodTypedSchema } from '~/utils/zodForm'
import { fromEur } from '#shared/utils/money'

/** Step 1 (E9): contact & address, then the delivery method. */
const props = defineProps<{ initial?: Partial<ShippingDetails> | null }>()
const emit = defineEmits<{ done: [details: ShippingDetails] }>()

const { t } = useI18n()
const { format } = usePrice()
const toast = useToast()
const cart = useCartStore()
const { currency, checkout } = useAppConfig()

const { handleSubmit, defineField, errors } = useForm({
  validationSchema: zodTypedSchema(shippingDetailsSchema),
  initialValues: {
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    postalCode: '',
    city: '',
    phone: '',
    ...props.initial,
  },
})
const config = { validateOnModelUpdate: false }
const [firstName] = defineField('firstName', config)
const [lastName] = defineField('lastName', config)
const [email] = defineField('email', config)
const [address] = defineField('address', config)
const [postalCode] = defineField('postalCode', config)
const [city] = defineField('city', config)
const [phone] = defineField('phone', config)

watch(postalCode, (value) => {
  const digits = (value ?? '').replace(/\D/g, '').slice(0, 5)
  if (digits !== value) postalCode.value = digits
})

const methods = computed(() =>
  (['standard', 'relay', 'express'] as const).map((method) => {
    const base = cart.totals.subtotal.amount - cart.totals.discount.amount
    const free = method !== 'express' && base >= fromEur(checkout.freeShippingFromEur, currency).amount
    return {
      method,
      label: t(`checkout.methods.${method}.label`),
      description: t(`checkout.methods.${method}.description`),
      price: free ? t('cart.free') : format(fromEur(checkout.shippingEur[method], currency)),
    }
  }),
)
const shippingMethod = computed({
  get: () => cart.shippingMethod,
  set: (value: string) => (cart.shippingMethod = value as ShippingMethod),
})

const submit = handleSubmit(
  (values) => emit('done', values),
  () => toast.error(t('checkout.errors.fix')),
)
</script>

<template>
  <form class="flex flex-col gap-8" novalidate @submit="submit">
    <div class="flex flex-col gap-2">
      <h1 class="text-h2">{{ t('checkout.shipping.title') }}</h1>
      <slot name="hint" />
    </div>

    <div class="grid grid-cols-2 gap-x-4 gap-y-5">
      <CheckoutField
        v-model="firstName"
        :label="t('checkout.fields.firstName')"
        :error="errors.firstName"
        autocomplete="given-name"
      />
      <CheckoutField
        v-model="lastName"
        :label="t('checkout.fields.lastName')"
        :error="errors.lastName"
        autocomplete="family-name"
      />
      <CheckoutField
        v-model="email"
        class="col-span-2"
        type="email"
        :label="t('checkout.fields.email')"
        :error="errors.email"
        autocomplete="email"
        inputmode="email"
      />
      <CheckoutField
        v-model="address"
        class="col-span-2"
        :label="t('checkout.fields.address')"
        :error="errors.address"
        autocomplete="street-address"
        :placeholder="t('checkout.fields.addressPlaceholder')"
      />
      <CheckoutField
        v-model="postalCode"
        :label="t('checkout.fields.postalCode')"
        :error="errors.postalCode"
        autocomplete="postal-code"
        inputmode="numeric"
      />
      <CheckoutField
        v-model="city"
        :label="t('checkout.fields.city')"
        :error="errors.city"
        autocomplete="address-level2"
      />
      <CheckoutField
        v-model="phone"
        class="col-span-2"
        type="tel"
        :label="t('checkout.fields.phone')"
        :error="errors.phone"
        :help="t('checkout.fields.phoneHelp')"
        autocomplete="tel"
        inputmode="tel"
      />
    </div>

    <fieldset class="flex flex-col gap-2.5">
      <legend class="mb-2.5 text-body-sm font-medium">{{ t('checkout.shipping.method') }}</legend>
      <UiRadioCard
        v-for="option in methods"
        :key="option.method"
        v-model="shippingMethod"
        name="shipping-method"
        :value="option.method"
        :label="option.label"
        :description="option.description"
        :aside="option.price"
      />
    </fieldset>

    <div class="flex flex-wrap items-center justify-between gap-4">
      <NuxtLinkLocale
        to="/cart"
        class="inline-flex items-center gap-1.5 text-ui transition-colors duration-150 hover:text-accent-text"
      >
        <Icon name="lucide:arrow-left" class="size-4" aria-hidden="true" />
        {{ t('checkout.shipping.back') }}
      </NuxtLinkLocale>
      <UiButton type="submit" size="lg">{{ t('checkout.shipping.continue') }}</UiButton>
    </div>
  </form>
</template>
