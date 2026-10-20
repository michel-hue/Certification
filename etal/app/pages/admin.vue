<script setup lang="ts">
/** Back-office shell: every /admin page is admin-only and kept out of search engines. */
definePageMeta({ layout: 'admin', middleware: 'admin' })
useSeoMeta({ robots: 'noindex, nofollow' })
</script>

<template>
  <NuxtPage />
</template>
