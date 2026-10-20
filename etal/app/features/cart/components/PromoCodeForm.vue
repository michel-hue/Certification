<script setup lang="ts">
/** Fictitious promo code (CDC §8.7): only PORTFOLIO10 works, the error says so. */
const { t } = useI18n()
const cart = useCartStore()
const toast = useToast()
const { checkout } = useAppConfig()

const code = ref('')
const error = ref('')

function apply() {
  if (!code.value.trim()) {
    error.value = t('cart.promo.empty')
    return
  }
  if (cart.applyPromo(code.value)) {
    error.value = ''
    toast.success(t('cart.promo.applied', { code: checkout.promo.code, percent: checkout.promo.percent }))
  } else {
    error.value = t('cart.promo.invalid', { code: checkout.promo.code })
  }
}

function removePromo() {
  cart.removePromo()
  code.value = ''
}
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <div
      v-if="cart.promoApplied"
      class="flex h-11 items-center justify-between rounded-md border border-dashed border-success px-3 text-body-sm font-medium text-success"
    >
      {{ t('cart.promo.badge', { code: checkout.promo.code, percent: checkout.promo.percent }) }}
      <button
        type="button"
        class="cursor-pointer text-meta font-normal text-foreground-muted underline"
        @click="removePromo"
      >
        {{ t('cart.remove') }}
      </button>
    </div>
    <form v-else novalidate @submit.prevent="apply">
      <UiFormField v-slot="{ id, describedBy, invalid }" :label="t('cart.promo.label')" :error="error">
        <div class="flex gap-2">
          <UiInput
            :id="id"
            v-model="code"
            size="sm"
            :placeholder="checkout.promo.code"
            autocomplete="off"
            :aria-describedby="describedBy"
            :invalid="invalid"
            class="bg-background! font-medium tracking-[0.04em] uppercase"
            wrapper-class="min-w-0 flex-1"
            @input="error = ''"
          />
          <UiButton type="submit" variant="secondary">{{ t('cart.promo.apply') }}</UiButton>
        </div>
      </UiFormField>
    </form>
  </div>
</template>
