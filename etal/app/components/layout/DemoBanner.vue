<script setup lang="ts">
const { t } = useI18n()
// A cookie rather than localStorage so the server never renders a banner the visitor closed.
const dismissed = useCookie<boolean>('etal-demo-banner-dismissed', {
  default: () => false,
  maxAge: 60 * 60 * 24 * 30,
  sameSite: 'lax',
})
</script>

<template>
  <div
    v-if="!dismissed"
    role="region"
    :aria-label="t('demoBanner.label')"
    class="relative flex items-center justify-center bg-primary px-12 py-2 text-center text-meta text-primary-foreground"
  >
    <p>{{ t('demoBanner.text') }}</p>
    <button
      type="button"
      class="absolute top-1/2 right-2 flex size-11 -translate-y-1/2 items-center justify-center rounded-md"
      :aria-label="t('demoBanner.close')"
      @click="dismissed = true"
    >
      <Icon name="lucide:x" class="size-4" aria-hidden="true" />
    </button>
  </div>
</template>
