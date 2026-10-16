<script setup lang="ts">
/** « Nous n'arrivons pas à charger… » + Réessayer. Announced immediately (role=alert). */
withDefaults(defineProps<{ title: string; text?: string; retrying?: boolean; framed?: boolean }>(), {
  framed: false,
})
const emit = defineEmits<{ retry: [] }>()

const { t } = useI18n()
</script>

<template>
  <div
    role="alert"
    class="flex flex-col items-start gap-4"
    :class="
      framed ? 'flex-row flex-wrap items-center justify-between rounded-md border border-border p-8' : 'py-12'
    "
  >
    <div class="flex flex-col gap-2">
      <p class="m-0 font-serif text-[clamp(1.375rem,1.2rem+0.7vw,1.625rem)]">{{ title }}</p>
      <p v-if="text" class="m-0 text-foreground-muted">{{ text }}</p>
    </div>
    <UiButton :loading="retrying" icon-left="lucide:rotate-ccw" @click="emit('retry')">{{
      t('ui.retry')
    }}</UiButton>
  </div>
</template>
