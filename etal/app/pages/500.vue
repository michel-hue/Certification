<script setup lang="ts">
/** Demo route for the footer link: shows the 500 page (E24) on purpose. */
throw createError({ statusCode: 500, statusMessage: 'Demo server error', fatal: true })
</script>

<template>
  <div />
</template>
