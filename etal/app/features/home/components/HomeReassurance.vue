<script setup lang="ts">
/** Four promises, all explicitly fictitious (CDC §8.2). */
const { t } = useI18n()
const items = ['shipping', 'returns', 'payment', 'advice'] as const
</script>

<template>
  <section class="pt-section">
    <h2 class="sr-only">{{ t('home.reassurance.title') }}</h2>
    <ul class="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-6">
      <li
        v-for="(item, index) in items"
        :key="item"
        class="flex flex-col gap-2 border-t border-foreground pt-5"
      >
        <span class="font-serif text-body-sm text-accent-text tabular-nums" aria-hidden="true">{{
          String(index + 1).padStart(2, '0')
        }}</span>
        <span class="text-body-lg leading-[1.3] font-semibold">{{
          t(`home.reassurance.${item}.title`)
        }}</span>
        <span class="text-body-sm text-foreground-muted">{{ t(`home.reassurance.${item}.text`) }}</span>
      </li>
    </ul>
  </section>
</template>
