<script setup lang="ts">
import { fieldVariants } from '~/design/field'

defineOptions({ inheritAttrs: false })

/** Text input with optional leading icon, keyboard hint and show/hide toggle for passwords. */
const props = withDefaults(
  defineProps<{
    type?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url' | 'number'
    size?: 'md' | 'sm'
    invalid?: boolean
    iconLeft?: string
    /** Keyboard shortcut shown inside the field, e.g. `/`. */
    kbd?: string
    /** Classes for the wrapper (layout); `class` styles the input itself. */
    wrapperClass?: string
  }>(),
  { type: 'text', size: 'md' },
)

const model = defineModel<string | number>()
const { t } = useI18n()
const revealed = ref(false)
const isPassword = computed(() => props.type === 'password')
const inputType = computed(() => (isPassword.value && revealed.value ? 'text' : props.type))
</script>

<template>
  <div class="relative" :class="wrapperClass">
    <Icon
      v-if="iconLeft"
      :name="iconLeft"
      class="pointer-events-none absolute top-1/2 left-3 size-[18px] -translate-y-1/2 text-foreground-muted"
      aria-hidden="true"
    />
    <input
      v-model="model"
      v-bind="$attrs"
      :type="inputType"
      :aria-invalid="invalid || undefined"
      :class="[fieldVariants({ size, invalid }), iconLeft && 'pl-10', (isPassword || kbd) && 'pr-12']"
    />
    <kbd
      v-if="kbd"
      aria-hidden="true"
      class="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-sm border border-border bg-background px-1.5 py-px font-sans text-[11px] font-medium text-foreground-muted"
    >
      {{ kbd }}
    </kbd>
    <button
      v-if="isPassword"
      type="button"
      class="absolute top-1/2 right-0.5 flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-foreground-muted hover:text-foreground"
      :aria-label="revealed ? t('ui.password.hide') : t('ui.password.show')"
      :aria-pressed="revealed"
      @click="revealed = !revealed"
    >
      <Icon :name="revealed ? 'lucide:eye-off' : 'lucide:eye'" class="size-[18px]" aria-hidden="true" />
    </button>
  </div>
</template>
