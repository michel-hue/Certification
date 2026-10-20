<script setup lang="ts">
import { emailSchema } from '#shared/schemas/forms'

/** Newsletter sign-up (CDC §8.2): validated, confirmed by a toast, nothing is sent anywhere. */
const { t } = useI18n()
const toast = useToast()
const email = ref('')
const error = ref('')
const done = ref(false)

function subscribe() {
  if (!emailSchema.safeParse(email.value).success) {
    error.value = t('forms.emailInvalid')
    return
  }
  error.value = ''
  done.value = true
  toast.success(t('home.newsletter.toast'))
}
</script>

<template>
  <section class="mt-section bg-surface-muted">
    <div
      class="mx-auto flex max-w-content flex-wrap items-end justify-between gap-10 px-gutter py-[clamp(3.5rem,7vw,6rem)]"
    >
      <div class="flex max-w-[560px] flex-[1_1_380px] flex-col gap-3">
        <p class="text-overline font-semibold text-foreground-muted uppercase">
          {{ t('home.newsletter.overline') }}
        </p>
        <h2 class="text-h2">
          {{ t('home.newsletter.title') }} <em class="font-normal">{{ t('home.newsletter.emphasis') }}</em>
        </h2>
        <p class="text-foreground-muted">{{ t('home.newsletter.text') }}</p>
      </div>
      <form class="flex max-w-[520px] flex-[1_1_380px] flex-col" novalidate @submit.prevent="subscribe">
        <UiFormField
          v-slot="{ id, describedBy, invalid }"
          :label="t('forms.email')"
          :error="error"
          :help="done ? t('home.newsletter.done') : t('home.newsletter.help')"
        >
          <div class="flex flex-wrap gap-2">
            <UiInput
              :id="id"
              v-model="email"
              type="email"
              autocomplete="email"
              :placeholder="t('forms.emailPlaceholder')"
              :aria-describedby="describedBy"
              :invalid="invalid"
              class="h-13!"
              wrapper-class="flex-[1_1_220px]"
              @input="error = ''"
            />
            <UiButton type="submit" size="lg">{{
              done ? t('home.newsletter.subscribed') : t('home.newsletter.submit')
            }}</UiButton>
          </div>
        </UiFormField>
      </form>
    </div>
  </section>
</template>
