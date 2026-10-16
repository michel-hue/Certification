<script setup lang="ts">
/**
 * Read-only stars with half-star precision. Screen readers get the numeric value only,
 * never five separate images.
 */
const props = withDefaults(defineProps<{ value: number; size?: 14 | 16 | 20 }>(), { size: 16 })

const { t, n } = useI18n()
// Clip-path ids must be unique per instance: a page shows many ratings at once.
const uid = useId()

/** Each star is 'full', 'half' or 'empty', rounded to the nearest half. */
const stars = computed(() => {
  const rounded = Math.round(props.value * 2) / 2
  return [1, 2, 3, 4, 5].map((index) =>
    rounded >= index ? 'full' : rounded >= index - 0.5 ? 'half' : 'empty',
  )
})
const label = computed(() =>
  t('ui.rating.label', { value: n(props.value, { maximumFractionDigits: 1, minimumFractionDigits: 1 }) }),
)
</script>

<template>
  <span role="img" :aria-label="label" class="inline-flex gap-0.5 text-foreground">
    <svg
      v-for="(star, index) in stars"
      :key="index"
      :width="size"
      :height="size"
      viewBox="0 0 24 24"
      aria-hidden="true"
      class="shrink-0"
    >
      <defs v-if="star === 'half'">
        <clipPath :id="`half-${uid}-${index}`"><rect x="0" y="0" width="12" height="24" /></clipPath>
      </defs>
      <polygon
        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linejoin="round"
      />
      <polygon
        v-if="star !== 'empty'"
        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
        fill="currentColor"
        :clip-path="star === 'half' ? `url(#half-${uid}-${index})` : undefined"
      />
    </svg>
  </span>
</template>
