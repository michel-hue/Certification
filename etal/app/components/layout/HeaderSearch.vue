<script setup lang="ts">
/**
 * Header search field. Submits to `/search?q=`; live suggestions arrive with the catalogue
 * (Lot 3). `/` or Ctrl/⌘+K focuses it from anywhere (CDC §8.5).
 */
const emit = defineEmits<{ submitted: [] }>()

const { t } = useI18n()
const localePath = useLocalePath()
const query = ref('')
const input = useTemplateRef<HTMLElement>('field')

function focus() {
  input.value?.querySelector('input')?.focus()
}

function submit() {
  const term = query.value.trim()
  if (!term) return
  emit('submitted')
  navigateTo(localePath({ path: '/search', query: { q: term } }))
}

useEventListener('keydown', (event: KeyboardEvent) => {
  const target = event.target as HTMLElement | null
  const typing = !!target?.closest('input, textarea, select, [contenteditable="true"]')
  const shortcut =
    (event.key === '/' && !typing) || (event.key.toLowerCase() === 'k' && (event.ctrlKey || event.metaKey))
  if (!shortcut) return
  event.preventDefault()
  focus()
})

defineExpose({ focus })
</script>

<template>
  <form ref="field" role="search" @submit.prevent="submit">
    <UiInput
      v-model="query"
      type="search"
      size="sm"
      icon-left="lucide:search"
      kbd="/"
      :placeholder="t('header.searchPlaceholder')"
      :aria-label="t('header.searchLabel')"
      enterkeyhint="search"
      class="border-border!"
    />
  </form>
</template>
