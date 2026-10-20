<script setup lang="ts">
/** One titled block of an annex page: heading on the left from `md`, text on the right. */
defineProps<{ title: string; text?: string }>()

const id = useId()
</script>

<template>
  <section
    class="grid gap-3 border-t border-border pt-8 md:grid-cols-[minmax(160px,1fr)_minmax(0,2.4fr)] md:gap-10"
    :aria-labelledby="id"
  >
    <h2 :id="id" class="text-[24px] leading-tight font-medium">{{ title }}</h2>
    <div class="flex flex-col gap-4 text-ui leading-[1.65] text-pretty">
      <p v-if="text">{{ text }}</p>
      <slot />
    </div>
  </section>
</template>
