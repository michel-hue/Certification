<script setup lang="ts">
import type { RouteLocationAsPathGeneric } from 'vue-router'

/** Square 44 × 44 icon action (header, toolbars) with an optional counter or status dot. */
const props = withDefaults(
  defineProps<{
    icon: string
    label: string
    to?: string | RouteLocationAsPathGeneric
    count?: number
    /** `accent` for the cart, `primary` for favourites (mockup). */
    countTone?: 'accent' | 'primary'
    /** Small status dot, e.g. a signed-in account. */
    dot?: boolean
    /** Briefly enlarges the counter, e.g. right after an add to cart. */
    pulse?: boolean
    iconSize?: 'md' | 'lg'
  }>(),
  { countTone: 'accent', iconSize: 'md' },
)

const NuxtLinkLocale = resolveComponent('NuxtLinkLocale')
const showCount = computed(() => (props.count ?? 0) > 0)
</script>

<template>
  <component
    :is="to ? NuxtLinkLocale : 'button'"
    :to="to"
    :type="to ? undefined : 'button'"
    :aria-label="label"
    :title="label"
    class="relative flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-md text-foreground transition-colors duration-150 hover:bg-surface-muted"
  >
    <Icon :name="icon" :class="iconSize === 'lg' ? 'size-6' : 'size-5'" aria-hidden="true" />
    <span
      v-if="showCount"
      aria-hidden="true"
      class="absolute top-1 right-0.5 h-[18px] min-w-[18px] rounded-full px-[5px] text-center text-[11px] leading-[18px] font-semibold tabular-nums transition-transform duration-200 ease-emphasized motion-reduce:transition-none"
      :class="[
        countTone === 'accent' ? 'bg-accent text-accent-foreground' : 'bg-primary text-primary-foreground',
        pulse ? 'scale-135' : 'scale-100',
      ]"
    >
      {{ count }}
    </span>
    <span
      v-if="dot"
      aria-hidden="true"
      class="absolute top-2.5 right-2.5 size-[7px] rounded-full bg-success"
    />
  </component>
</template>
