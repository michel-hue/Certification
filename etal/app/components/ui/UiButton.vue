<script setup lang="ts">
import type { RouteLocationAsPathGeneric } from 'vue-router'
import { buttonVariants, type ButtonVariants } from '~/design/button'

/**
 * Button, or link styled as a button when `to` is set (locale-aware).
 * While `loading` the label stays in place, so the button keeps its width.
 */
const props = withDefaults(
  defineProps<{
    variant?: ButtonVariants['variant']
    size?: ButtonVariants['size']
    to?: string | RouteLocationAsPathGeneric
    type?: 'button' | 'submit' | 'reset'
    iconLeft?: string
    iconRight?: string
    /** Icon-only button: `label` becomes the accessible name. */
    icon?: string
    label?: string
    block?: boolean
    loading?: boolean
    disabled?: boolean
  }>(),
  { type: 'button' },
)

const classes = computed(() =>
  buttonVariants({ variant: props.variant, size: props.size, iconOnly: !!props.icon, block: props.block }),
)
const iconSize = computed(() => (props.size === 'lg' ? 'size-[18px]' : 'size-4'))
</script>

<template>
  <NuxtLinkLocale
    v-if="to && !disabled"
    :to="to"
    :class="classes"
    :aria-label="icon ? label : undefined"
    :title="icon ? label : undefined"
  >
    <Icon v-if="icon" :name="icon" class="size-5" aria-hidden="true" />
    <template v-else>
      <Icon v-if="iconLeft" :name="iconLeft" :class="iconSize" aria-hidden="true" />
      <slot>{{ label }}</slot>
      <Icon v-if="iconRight" :name="iconRight" :class="iconSize" aria-hidden="true" />
    </template>
  </NuxtLinkLocale>
  <button
    v-else
    :type="type"
    :class="classes"
    :disabled="disabled"
    :aria-busy="loading || undefined"
    :aria-label="icon ? label : undefined"
    :title="icon ? label : undefined"
    @click="loading && $event.preventDefault()"
  >
    <UiSpinner v-if="loading" />
    <Icon v-else-if="icon" :name="icon" class="size-5" aria-hidden="true" />
    <Icon v-else-if="iconLeft" :name="iconLeft" :class="iconSize" aria-hidden="true" />
    <slot v-if="!icon">{{ label }}</slot>
    <Icon v-if="iconRight && !icon" :name="iconRight" :class="iconSize" aria-hidden="true" />
  </button>
</template>
