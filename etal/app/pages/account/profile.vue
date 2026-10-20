<script setup lang="ts">
import { useForm } from 'vee-validate'
import { profileSchema } from '#shared/schemas/auth'
import { zodTypedSchema } from '~/utils/zodForm'

/** Profile (E15): editable details (simulated by the API) and the theme preference. */
const { t } = useI18n()
const toast = useToast()
const theme = useThemeToggle()
const { user, updateProfile } = useAuth()

const { handleSubmit, defineField, errors, isSubmitting } = useForm({
  validationSchema: zodTypedSchema(profileSchema),
  initialValues: {
    firstName: user.value?.firstName ?? '',
    lastName: user.value?.lastName ?? '',
    email: user.value?.email ?? '',
    phone: user.value?.phone ?? '',
  },
})
const config = { validateOnModelUpdate: false }
const [firstName] = defineField('firstName', config)
const [lastName] = defineField('lastName', config)
const [email] = defineField('email', config)
const [phone] = defineField('phone', config)

const darkTheme = computed({
  get: () => theme.isDark.value,
  set: () => theme.toggle(),
})

const submit = handleSubmit(
  async (input) => {
    try {
      await updateProfile(input)
      toast.success(t('account.profile.saved'))
    } catch {
      toast.error(t('auth.errors.unavailable'))
    }
  },
  () => toast.error(t('checkout.errors.fix')),
)

useSeoMeta({ title: () => t('account.profile.title') })
</script>

<template>
  <div class="flex flex-col gap-10">
    <div class="flex flex-col gap-3">
      <p class="text-overline font-semibold text-foreground-muted uppercase">{{ t('account.title') }}</p>
      <h1 class="text-[clamp(2rem,1.5rem+2.4vw,3.25rem)] leading-[1.05] font-normal">
        {{ t('account.profile.title') }}
      </h1>
    </div>

    <form class="flex max-w-[640px] flex-col gap-6" novalidate @submit="submit">
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
        />
        <CheckoutField
          v-model="phone"
          class="col-span-2"
          type="tel"
          :label="t('account.profile.phone')"
          :error="errors.phone"
          autocomplete="tel"
        />
      </div>

      <fieldset class="flex max-w-80 flex-col gap-3 border-t border-border pt-6">
        <legend class="sr-only">{{ t('account.profile.preferences') }}</legend>
        <p class="text-body-sm font-medium" aria-hidden="true">{{ t('account.profile.preferences') }}</p>
        <ClientOnly>
          <UiSwitch v-model="darkTheme" :label="t('account.profile.darkTheme')" />
        </ClientOnly>
      </fieldset>

      <UiButton type="submit" size="lg" class="self-start" :loading="isSubmitting">{{
        t('account.profile.save')
      }}</UiButton>
    </form>
  </div>
</template>
