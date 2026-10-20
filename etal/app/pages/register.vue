<script setup lang="ts">
import { useForm } from 'vee-validate'
import { registerSchema, safeRedirect } from '#shared/schemas/auth'
import { zodTypedSchema } from '~/utils/zodForm'

/** Register (E13): demo account, strength meter, terms. The visitor is told nothing is kept. */
definePageMeta({ layout: 'auth', middleware: 'guest' })

const { t } = useI18n()
const route = useRoute()
const localePath = useLocalePath()
const toast = useToast()
const { register } = useAuth()

const { handleSubmit, defineField, errors, isSubmitting } = useForm({
  validationSchema: zodTypedSchema(registerSchema),
  initialValues: { firstName: '', lastName: '', email: '', password: '', confirm: '', terms: false },
})
const config = { validateOnModelUpdate: false }
const [firstName] = defineField('firstName', config)
const [lastName] = defineField('lastName', config)
const [email] = defineField('email', config)
const [password] = defineField('password', config)
const [confirm] = defineField('confirm', config)
const [terms] = defineField('terms')

const message = (key?: string) => (key ? t(key) : undefined)

const submit = handleSubmit(
  async (input) => {
    try {
      await register(input)
      toast.info(t('auth.register.created'))
      await navigateTo(localePath(safeRedirect(route.query.redirect)))
    } catch {
      toast.error(t('auth.errors.unavailable'))
    }
  },
  () => toast.error(t('checkout.errors.fix')),
)

useSeoMeta({ title: () => t('auth.register.pageTitle'), robots: 'noindex, follow' })
</script>

<template>
  <div class="flex flex-col gap-7">
    <div class="flex flex-col gap-2.5">
      <h1 class="text-[clamp(2rem,1.5rem+2vw,3rem)] leading-[1.05]">
        {{ t('auth.register.titleStart') }}
        <em class="font-normal">{{ t('auth.register.titleEmphasis') }}</em>
      </h1>
      <p class="text-foreground-muted">{{ t('auth.register.lead') }}</p>
    </div>

    <form class="flex flex-col gap-5" novalidate @submit="submit">
      <div class="grid grid-cols-2 gap-x-3.5 gap-y-4.5">
        <UiFormField
          v-slot="{ id, describedBy, invalid }"
          :label="t('checkout.fields.firstName')"
          :error="message(errors.firstName)"
        >
          <UiInput
            :id="id"
            v-model="firstName"
            autocomplete="given-name"
            :aria-describedby="describedBy"
            :invalid="invalid"
          />
        </UiFormField>
        <UiFormField
          v-slot="{ id, describedBy, invalid }"
          :label="t('checkout.fields.lastName')"
          :error="message(errors.lastName)"
        >
          <UiInput
            :id="id"
            v-model="lastName"
            autocomplete="family-name"
            :aria-describedby="describedBy"
            :invalid="invalid"
          />
        </UiFormField>
        <UiFormField
          v-slot="{ id, describedBy, invalid }"
          class="col-span-2"
          :label="t('checkout.fields.email')"
          :error="message(errors.email)"
        >
          <UiInput
            :id="id"
            v-model="email"
            type="email"
            autocomplete="email"
            :aria-describedby="describedBy"
            :invalid="invalid"
          />
        </UiFormField>
        <div class="col-span-2 flex flex-col gap-2">
          <UiFormField
            v-slot="{ id, describedBy, invalid }"
            :label="t('auth.fields.password')"
            :error="message(errors.password)"
          >
            <UiInput
              :id="id"
              v-model="password"
              type="password"
              autocomplete="new-password"
              :aria-describedby="describedBy"
              :invalid="invalid"
            />
          </UiFormField>
          <UiPasswordStrength :password="password ?? ''" />
        </div>
        <UiFormField
          v-slot="{ id, describedBy, invalid }"
          class="col-span-2"
          :label="t('auth.fields.confirm')"
          :error="message(errors.confirm)"
        >
          <UiInput
            :id="id"
            v-model="confirm"
            type="password"
            autocomplete="new-password"
            :aria-describedby="describedBy"
            :invalid="invalid"
          />
        </UiFormField>
      </div>

      <div class="flex flex-col gap-1">
        <UiCheckbox
          v-model="terms"
          :label="t('auth.register.terms')"
          :invalid="!!errors.terms"
          aria-describedby="terms-error"
        />
        <p v-if="errors.terms" id="terms-error" role="alert" class="text-meta text-danger">
          {{ t(errors.terms) }}
        </p>
      </div>

      <UiButton type="submit" size="lg" block :loading="isSubmitting">{{
        t('auth.register.submit')
      }}</UiButton>
    </form>

    <p class="text-center text-ui text-foreground-muted">
      {{ t('auth.register.hasAccount') }}
      <NuxtLinkLocale to="/login" class="font-medium text-accent-text">{{
        t('auth.register.login')
      }}</NuxtLinkLocale>
    </p>
  </div>
</template>
