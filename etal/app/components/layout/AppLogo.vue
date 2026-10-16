<script setup lang="ts">
/**
 * Étal logotype: the acute accent is drawn as a tilted terracotta blade — the board of
 * a market stall. Sized through `font-size` so it scales from the header to the footer.
 */
withDefaults(defineProps<{ label: string; to?: string; inverse?: boolean }>(), {
  to: '/',
  inverse: false,
})
</script>

<template>
  <NuxtLinkLocale
    :to="to"
    :aria-label="label"
    class="inline-flex items-end font-serif leading-none font-medium tracking-[-0.01em] text-current no-underline [font-variation-settings:'opsz'_72]"
  >
    <span class="relative inline-block" aria-hidden="true">
      E<span
        class="absolute top-[-0.2em] left-[0.1em] h-[0.075em] w-[0.46em] -rotate-12 rounded-[1px]"
        :class="inverse ? 'bg-inverse-mark' : 'bg-accent'"
      />
    </span>
    <span aria-hidden="true">tal</span>
  </NuxtLinkLocale>
</template>
