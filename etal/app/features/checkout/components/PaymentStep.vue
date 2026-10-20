<script setup lang="ts">
import { useForm } from 'vee-validate'
import { formatCardNumber, formatExpiry, paymentSchema } from '#shared/schemas/checkout'
import type { Money } from '#shared/types/money'
import { zodTypedSchema } from '~/utils/zodForm'

/**
 * Step 2 (E10): clearly fake card form. Only the test card passes; the values live in this
 * component only and are dropped as soon as the order is placed (CDC §13.3).
 */
const props = defineProps<{ total: Money; holder: string }>()
const emit = defineEmits<{ back: []; paid: [] }>()

/** Simulated processing delay, so the button can show its loading state. */
const PAYMENT_DELAY_MS = 1200

const { t } = useI18n()
const { format } = usePrice()
const toast = useToast()

const { handleSubmit, defineField, errors, setValues, resetForm } = useForm({
  validationSchema: zodTypedSchema(paymentSchema),
  initialValues: { cardNumber: '', holder: props.holder, expiry: '', cvc: '' },
})
const config = { validateOnModelUpdate: false }
const [cardNumber] = defineField('cardNumber', config)
const [holderName] = defineField('holder', config)
const [expiry] = defineField('expiry', config)
const [cvc] = defineField('cvc', config)

watch(cardNumber, (value) => {
  const formatted = formatCardNumber(value ?? '')
  if (formatted !== value) cardNumber.value = formatted
})
watch(expiry, (value) => {
  const formatted = formatExpiry(value ?? '')
  if (formatted !== value) expiry.value = formatted
})
watch(cvc, (value) => {
  const digits = (value ?? '').replace(/\D/g, '').slice(0, 3)
  if (digits !== value) cvc.value = digits
})

const paying = ref(false)

function useTestCard() {
  setValues({
    cardNumber: '4242 4242 4242 4242',
    holder: props.holder || t('checkout.payment.demoHolder'),
    expiry: '12/29',
    cvc: '123',
  })
}

const submit = handleSubmit(
  () => {
    if (paying.value) return
    paying.value = true
    setTimeout(() => {
      resetForm()
      paying.value = false
      emit('paid')
    }, PAYMENT_DELAY_MS)
  },
  () => toast.error(t('checkout.errors.fix')),
)
</script>

<template>
  <form class="flex flex-col gap-7" novalidate @submit="submit">
    <div class="flex flex-col gap-3">
      <h1 class="text-h2">{{ t('checkout.payment.title') }}</h1>
      <UiAlert demo>{{ t('checkout.payment.demoNotice') }}</UiAlert>
    </div>

    <button
      type="button"
      class="h-11 cursor-pointer self-start rounded-md border border-dashed border-border-strong px-4 text-body-sm font-medium tabular-nums transition-colors duration-150 hover:border-foreground"
      @click="useTestCard"
    >
      {{ t('checkout.payment.useTestCard') }}
    </button>

    <div class="grid grid-cols-2 gap-x-4 gap-y-5">
      <CheckoutField
        v-model="cardNumber"
        class="col-span-2"
        :label="t('checkout.fields.cardNumber')"
        :error="errors.cardNumber"
        autocomplete="off"
        inputmode="numeric"
        placeholder="4242 4242 4242 4242"
      />
      <CheckoutField
        v-model="holderName"
        class="col-span-2"
        :label="t('checkout.fields.holder')"
        :error="errors.holder"
        autocomplete="off"
      />
      <CheckoutField
        v-model="expiry"
        :label="t('checkout.fields.expiry')"
        :error="errors.expiry"
        autocomplete="off"
        inputmode="numeric"
        :placeholder="t('checkout.fields.expiryPlaceholder')"
      />
      <CheckoutField
        v-model="cvc"
        :label="t('checkout.fields.cvc')"
        :error="errors.cvc"
        autocomplete="off"
        inputmode="numeric"
        placeholder="123"
      />
    </div>

    <div class="flex flex-wrap items-center justify-between gap-4">
      <button
        type="button"
        class="inline-flex h-11 cursor-pointer items-center gap-1.5 text-ui transition-colors duration-150 hover:text-accent-text"
        @click="emit('back')"
      >
        <Icon name="lucide:arrow-left" class="size-4" aria-hidden="true" />
        {{ t('checkout.payment.back') }}
      </button>
      <UiButton type="submit" size="lg" :loading="paying">
        {{ paying ? t('checkout.payment.processing') : t('checkout.payment.pay', { total: format(total) }) }}
      </UiButton>
    </div>
  </form>
</template>
