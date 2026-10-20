<script setup lang="ts">
/**
 * One checkout input bound to VeeValidate: label, error (an i18n key from the Zod schema)
 * or help, wired through UiFormField for accessibility.
 */
defineProps<{
  label: string
  error?: string
  help?: string
  type?: 'text' | 'email' | 'tel'
  autocomplete?: string
  inputmode?: 'text' | 'numeric' | 'email' | 'tel' | 'decimal'
  placeholder?: string
}>()

const model = defineModel<string>({ default: '' })
const { t } = useI18n()
</script>

<template>
  <UiFormField
    v-slot="{ id, describedBy, invalid }"
    :label="label"
    :error="error ? t(error) : undefined"
    :help="help"
  >
    <UiInput
      :id="id"
      v-model="model"
      :type="type ?? 'text'"
      :autocomplete="autocomplete"
      :inputmode="inputmode"
      :placeholder="placeholder"
      :aria-describedby="describedBy"
      :invalid="invalid"
      class="tabular-nums"
    />
  </UiFormField>
</template>
