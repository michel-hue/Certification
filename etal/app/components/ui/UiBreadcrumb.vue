<script setup lang="ts">
import type { RouteLocationAsPathGeneric } from 'vue-router'

/** The last item is the current page: plain text, never a link. */
defineProps<{ items: readonly { label: string; to?: string | RouteLocationAsPathGeneric }[] }>()

const { t } = useI18n()
</script>

<template>
  <nav :aria-label="t('ui.breadcrumb')">
    <ol class="flex flex-wrap items-center gap-2 text-meta text-foreground-muted">
      <li v-for="(item, index) in items" :key="index" class="flex min-w-0 items-center gap-2">
        <NuxtLinkLocale
          v-if="item.to && index < items.length - 1"
          :to="item.to"
          class="transition-colors duration-150 hover:text-foreground"
        >
          {{ item.label }}
        </NuxtLinkLocale>
        <span v-else aria-current="page" class="max-w-[40ch] truncate text-foreground">{{ item.label }}</span>
        <span v-if="index < items.length - 1" aria-hidden="true" class="text-border-strong">/</span>
      </li>
    </ol>
  </nav>
</template>
