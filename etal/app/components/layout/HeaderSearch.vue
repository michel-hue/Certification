<script setup lang="ts">
import type { Product } from '#shared/types/catalog'
import { toProductParam } from '#shared/utils/slug'
import {
  SUGGESTION_MIN_LENGTH,
  useSearchSuggestions,
} from '~/features/search/composables/useSearchSuggestions'

/**
 * Header search with live suggestions (CDC §8.5, E4): debounced 300 ms, five results with
 * thumbnail and price, ARIA combobox keyboard model (↑ ↓ Entrée Échap). `/` or Ctrl/⌘+K
 * focuses it from anywhere.
 */
const emit = defineEmits<{ submitted: [] }>()

const { t } = useI18n()
const localePath = useLocalePath()
const categoryName = useCategoryName()
const { format } = usePrice()
const listboxId = useId()

const term = ref('')
const open = ref(false)
const activeIndex = ref(-1)
const root = useTemplateRef<HTMLElement>('root')

const { query, enabled, suggestions, pending } = useSearchSuggestions(term)
watch(query, () => (activeIndex.value = -1))

const showPanel = computed(
  () => open.value && enabled.value && term.value.trim().length >= SUGGESTION_MIN_LENGTH,
)
const optionId = (index: number) => `${listboxId}-option-${index}`

/** Splits a title around the first match so the term can be highlighted with <mark>. */
function highlight(title: string) {
  const needle = query.value.toLowerCase()
  const index = title.toLowerCase().indexOf(needle)
  if (index === -1 || !needle) return { before: title, match: '', after: '' }
  return {
    before: title.slice(0, index),
    match: title.slice(index, index + needle.length),
    after: title.slice(index + needle.length),
  }
}

function productPath(product: Product) {
  return localePath(`/products/${toProductParam(product)}`)
}

function close() {
  open.value = false
  activeIndex.value = -1
}

function go(path: string) {
  close()
  emit('submitted')
  ;(document.activeElement as HTMLElement | null)?.blur()
  return navigateTo(path)
}

function searchAll() {
  const value = term.value.trim()
  if (value) return go(localePath({ path: '/search', query: { q: value } }))
}

function onKeydown(event: KeyboardEvent) {
  const count = suggestions.value.length
  if (event.key === 'ArrowDown' && count) {
    event.preventDefault()
    open.value = true
    activeIndex.value = (activeIndex.value + 1) % count
  } else if (event.key === 'ArrowUp' && count) {
    event.preventDefault()
    activeIndex.value = activeIndex.value <= 0 ? count - 1 : activeIndex.value - 1
  } else if (event.key === 'Enter') {
    event.preventDefault()
    const product = suggestions.value[activeIndex.value]
    if (product) go(productPath(product))
    else searchAll()
  } else if (event.key === 'Escape') {
    if (open.value) {
      event.stopPropagation()
      close()
    }
  }
}

function focus() {
  root.value?.querySelector('input')?.focus()
}

onClickOutside(root, close)

useEventListener('keydown', (event: KeyboardEvent) => {
  const target = event.target as HTMLElement | null
  const typing = !!target?.closest('input, textarea, select, [contenteditable="true"]')
  const shortcut =
    (event.key === '/' && !typing) || (event.key.toLowerCase() === 'k' && (event.ctrlKey || event.metaKey))
  if (!shortcut || !root.value?.offsetParent) return
  event.preventDefault()
  focus()
})

defineExpose({ focus })
</script>

<template>
  <div ref="root" class="relative" role="search">
    <UiInput
      v-model="term"
      type="search"
      size="sm"
      icon-left="lucide:search"
      kbd="/"
      role="combobox"
      autocomplete="off"
      enterkeyhint="search"
      :placeholder="t('header.searchPlaceholder')"
      :aria-label="t('header.searchLabel')"
      :aria-expanded="showPanel"
      aria-autocomplete="list"
      :aria-controls="listboxId"
      :aria-activedescendant="activeIndex >= 0 ? optionId(activeIndex) : undefined"
      class="border-border!"
      @focus="open = true"
      @input="open = true"
      @keydown="onKeydown"
    />

    <div
      v-show="showPanel"
      class="absolute top-[calc(100%+8px)] right-0 z-40 flex w-[max(100%,380px)] max-w-[calc(100vw-24px)] flex-col gap-0.5 rounded-lg border border-border bg-surface p-2 shadow-md"
    >
      <ul :id="listboxId" role="listbox" :aria-label="t('search.suggestions')" :aria-busy="pending">
        <li
          v-for="(product, index) in suggestions"
          :id="optionId(index)"
          :key="product.id"
          role="option"
          :aria-selected="index === activeIndex"
        >
          <NuxtLink
            :to="productPath(product)"
            tabindex="-1"
            class="grid grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-3 rounded-md p-2 hover:bg-surface-muted"
            :class="index === activeIndex && 'bg-surface-muted'"
            @click.prevent="go(productPath(product))"
          >
            <SharedProductImage :src="product.thumbnail.src" alt="" sizes="44px" rounded="sm" />
            <span class="flex min-w-0 flex-col">
              <span class="truncate text-body-sm font-medium">
                {{ highlight(product.title).before }}<mark>{{ highlight(product.title).match }}</mark
                >{{ highlight(product.title).after }}
              </span>
              <span class="text-caption text-foreground-muted">{{
                product.brand ?? categoryName(product.category)
              }}</span>
            </span>
            <span class="text-body-sm font-medium tabular-nums">{{ format(product.price) }}</span>
          </NuxtLink>
        </li>
      </ul>
      <p
        v-if="enabled && !pending && suggestions.length === 0"
        class="px-2 py-3 text-body-sm text-foreground-muted"
      >
        {{ t('search.noMatch', { term: query }) }}
      </p>
      <button
        type="button"
        class="mt-1 cursor-pointer border-t border-border px-2 pt-2.5 pb-1.5 text-left text-body-sm font-medium text-accent-text hover:text-foreground"
        @click="searchAll"
      >
        {{ t('search.seeAll', { term: term.trim() }) }}
      </button>
      <p class="px-2 pb-1 text-[11px] text-foreground-muted">{{ t('search.keyboardHint') }}</p>
    </div>
  </div>
</template>
