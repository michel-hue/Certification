<script setup lang="ts">
/**
 * Uniform frame for heterogeneous API photos (CDC graphique §9.2): sand 4:5 box, image
 * contained with 10 % padding, multiplied into the sand in light theme, set on a light
 * plate in dark theme. A failed image falls back to the « É » monogram.
 */
withDefaults(
  defineProps<{
    src: string
    alt: string
    /** Second image revealed when the parent `.group` is hovered. */
    hoverSrc?: string
    sizes?: string
    eager?: boolean
    rounded?: 'sm' | 'md'
    /** Scale the image slightly when the parent `.group` is hovered and there is no second image. */
    zoom?: boolean
  }>(),
  { sizes: '(min-width: 1024px) 25vw, 50vw', rounded: 'md' },
)

const failed = ref(false)
</script>

<template>
  <div
    class="relative aspect-4/5 overflow-hidden bg-surface-muted"
    :class="rounded === 'sm' ? 'rounded-sm' : 'rounded-md'"
  >
    <span class="absolute inset-[10%] rounded-lg bg-plate" aria-hidden="true" />
    <template v-if="!failed">
      <NuxtImg
        :src="src"
        :alt="alt"
        :sizes="sizes"
        :loading="eager ? 'eager' : 'lazy'"
        :fetchpriority="eager ? 'high' : undefined"
        format="webp"
        class="absolute inset-[10%] size-4/5 object-contain mix-blend-multiply transition-[transform,opacity] duration-400 ease-emphasized motion-reduce:transition-none dark:mix-blend-normal"
        :class="[
          hoverSrc && 'group-hover:opacity-0',
          zoom && !hoverSrc && 'group-hover:scale-103 motion-reduce:group-hover:scale-100',
        ]"
        @error="failed = true"
      />
      <NuxtImg
        v-if="hoverSrc"
        :src="hoverSrc"
        alt=""
        :sizes="sizes"
        loading="lazy"
        format="webp"
        class="absolute inset-[10%] size-4/5 object-contain opacity-0 mix-blend-multiply transition-opacity duration-400 group-hover:opacity-100 dark:mix-blend-normal"
      />
    </template>
    <span
      v-else
      role="img"
      :aria-label="alt"
      class="absolute inset-0 flex items-center justify-center font-serif text-[clamp(2.5rem,8vw,4.5rem)] text-border-strong"
    >
      É
    </span>
    <slot />
  </div>
</template>
