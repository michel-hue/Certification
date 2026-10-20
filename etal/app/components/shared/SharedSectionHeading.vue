<script setup lang="ts">
/**
 * The editorial signature: overline + Fraunces title with an italic word, over a hairline.
 * The italic `emphasis` goes where `title` has `{em}`, or at the end otherwise (the form
 * translations use, since vue-i18n reads `{em}` as a variable).
 */
const props = withDefaults(
  defineProps<{
    overline: string
    title: string
    emphasis?: string
    level?: 1 | 2
    /** Page title size (h1 on listing pages) instead of section size. */
    large?: boolean
  }>(),
  { level: 2 },
)

const parts = computed(() =>
  props.title.includes('{em}') ? props.title.split('{em}') : [`${props.title} `, ''],
)
</script>

<template>
  <div class="flex flex-wrap items-end justify-between gap-6 border-b border-border pb-6">
    <div class="flex flex-col gap-3">
      <p class="text-overline font-semibold text-foreground-muted uppercase">{{ overline }}</p>
      <component
        :is="`h${level}`"
        class="m-0 text-balance"
        :class="
          large
            ? 'text-[clamp(2.25rem,1.6rem+3vw,4rem)] leading-[1.02] font-normal tracking-[-0.02em]'
            : 'text-h2'
        "
      >
        <template v-for="(part, index) in parts" :key="index">
          <em v-if="index > 0 && emphasis" :class="large ? 'italic' : 'font-normal'">{{ emphasis }}</em
          >{{ part }}
        </template>
      </component>
    </div>
    <div v-if="$slots.actions" class="flex items-center gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>
