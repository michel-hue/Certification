<script setup lang="ts">
const { t, locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
</script>

<template>
  <nav :aria-label="t('preferences.language')" class="flex items-center gap-2 text-meta">
    <span class="text-inverse-muted">{{ t('preferences.language') }}</span>
    <ul class="flex gap-1">
      <li v-for="item in locales" :key="item.code">
        <NuxtLink
          :to="switchLocalePath(item.code)"
          :lang="item.language"
          :aria-current="item.code === locale ? 'true' : undefined"
          class="flex h-10 items-center rounded-md px-2.5 font-medium transition-colors duration-150 hover:text-inverse-accent aria-[current]:bg-inverse-border"
        >
          {{ item.name }}
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
