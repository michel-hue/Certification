<script setup lang="ts">
import { useForm } from 'vee-validate'
import { loginSchema, safeRedirect } from '#shared/schemas/auth'
import { zodTypedSchema } from '~/utils/zodForm'

/** Login (E12): one-click demo accounts, show/hide password, « Se souvenir de moi ». */
definePageMeta({ layout: 'auth', middleware: 'guest' })

const DEMO_ACCOUNTS = [
  { role: 'customer', username: 'michaelw', password: 'michaelwpass' },
  { role: 'admin', username: 'emilys', password: 'emilyspass' },
] as const

const { t } = useI18n()
const route = useRoute()
const localePath = useLocalePath()
const toast = useToast()
const { login } = useAuth()

const { handleSubmit, defineField, errors, setValues, values, isSubmitting } = useForm({
  validationSchema: zodTypedSchema(loginSchema),
  initialValues: { username: '', password: '', remember: true },
})
const [username] = defineField('username', { validateOnModelUpdate: false })
const [password] = defineField('password', { validateOnModelUpdate: false })
const [remember] = defineField('remember')

const failure = ref('')
const redirect = computed(() => safeRedirect(route.query.redirect))
const redirected = computed(() => typeof route.query.redirect === 'string')

watch([username, password], () => (failure.value = ''))

function useDemo(account: (typeof DEMO_ACCOUNTS)[number]) {
  setValues({ username: account.username, password: account.password })
}

const submit = handleSubmit(async (input) => {
  failure.value = ''
  try {
    await login(input)
    toast.success(t('auth.welcome'))
    await navigateTo(localePath(redirect.value))
  } catch (error) {
    const status = (error as { statusCode?: number }).statusCode
    failure.value = status === 401 ? t('auth.errors.invalid') : t('auth.errors.unavailable')
  }
})

function forgot() {
  toast.info(t('auth.forgotDemo'))
}

useSeoMeta({ title: () => t('auth.login.pageTitle'), robots: 'noindex, follow' })
</script>

<template>
  <div class="flex flex-col gap-7">
    <div class="flex flex-col gap-2.5">
      <h1 class="text-[clamp(2rem,1.5rem+2vw,3rem)] leading-[1.05]">
        {{ t('auth.login.titleStart') }} <em class="font-normal">{{ t('auth.login.titleEmphasis') }}</em>
      </h1>
      <p class="text-foreground-muted">{{ t('auth.login.lead') }}</p>
    </div>

    <UiAlert v-if="redirected">{{ t('auth.login.redirectHint') }}</UiAlert>

    <section class="flex flex-col gap-2.5 rounded-md bg-surface-muted p-4" :aria-labelledby="'demo-accounts'">
      <h2 id="demo-accounts" class="font-sans text-overline-sm font-semibold text-foreground-muted uppercase">
        {{ t('auth.login.demoAccounts') }}
      </h2>
      <div class="grid grid-cols-2 gap-2">
        <button
          v-for="account in DEMO_ACCOUNTS"
          :key="account.username"
          type="button"
          class="flex cursor-pointer flex-col items-start gap-0.5 rounded-md border bg-surface p-3 text-left transition-colors duration-150 hover:border-foreground"
          :class="values.username === account.username ? 'border-foreground' : 'border-border'"
          :aria-label="t('auth.login.useDemo', { role: t(`auth.roles.${account.role}`) })"
          @click="useDemo(account)"
        >
          <span class="text-body-sm font-semibold">{{ t(`auth.roles.${account.role}`) }}</span>
          <span class="font-mono text-caption text-foreground-muted"
            >{{ account.username }} · {{ account.password }}</span
          >
        </button>
      </div>
    </section>

    <form class="flex flex-col gap-4.5" novalidate @submit="submit">
      <UiFormField
        v-slot="{ id, describedBy, invalid }"
        :label="t('auth.fields.username')"
        :error="errors.username && t(errors.username)"
      >
        <UiInput
          :id="id"
          v-model="username"
          autocomplete="username"
          :aria-describedby="describedBy"
          :invalid="invalid || !!failure"
        />
      </UiFormField>
      <UiFormField
        v-slot="{ id, describedBy, invalid }"
        :label="t('auth.fields.password')"
        :error="errors.password && t(errors.password)"
      >
        <UiInput
          :id="id"
          v-model="password"
          type="password"
          autocomplete="current-password"
          :aria-describedby="describedBy"
          :invalid="invalid || !!failure"
        />
      </UiFormField>

      <p v-if="failure" role="alert" class="flex items-center gap-2 text-body-sm text-danger">
        <Icon name="lucide:circle-alert" class="size-4 shrink-0" aria-hidden="true" />
        {{ failure }}
      </p>

      <div class="flex flex-wrap items-center justify-between gap-3">
        <UiCheckbox v-model="remember" :label="t('auth.fields.remember')" />
        <button
          type="button"
          class="cursor-pointer text-body-sm text-accent-text underline underline-offset-3"
          @click="forgot"
        >
          {{ t('auth.login.forgot') }}
        </button>
      </div>

      <UiButton type="submit" size="lg" block :loading="isSubmitting">
        {{ isSubmitting ? t('auth.login.submitting') : t('auth.login.submit') }}
      </UiButton>
    </form>

    <p class="text-center text-ui text-foreground-muted">
      {{ t('auth.login.noAccount') }}
      <NuxtLinkLocale
        :to="{ path: '/register', query: route.query.redirect ? { redirect: route.query.redirect } : {} }"
        class="font-medium text-accent-text"
      >
        {{ t('auth.login.register') }}
      </NuxtLinkLocale>
    </p>
  </div>
</template>
