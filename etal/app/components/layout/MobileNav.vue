<script setup lang="ts">
/** Left drawer with rubriques in large Fraunces, then account, favourites, cart and theme. */
defineProps<{ cartCount: number; wishlistCount: number }>()

const open = defineModel<boolean>('open', { default: false })
const { t } = useI18n()
const sections = useSections()
const theme = useThemeToggle()

const close = () => (open.value = false)
</script>

<template>
  <UiDrawer v-model:open="open" side="left" title-style="overline" :title="t('nav.sections')">
    <nav :aria-label="t('nav.sections')" class="flex flex-col px-6 pb-8">
      <NuxtLinkLocale
        v-for="section in sections"
        :key="section.id"
        :to="section.to"
        class="border-b border-border py-1.5 font-serif text-[40px] leading-[1.25] transition-colors duration-150 hover:text-accent-text"
        @click="close"
      >
        {{ section.name }}
      </NuxtLinkLocale>
      <ul class="flex flex-col gap-1 pt-6 text-body">
        <li>
          <NuxtLinkLocale to="/login" class="flex min-h-11 items-center" @click="close">{{
            t('header.signIn')
          }}</NuxtLinkLocale>
        </li>
        <li>
          <NuxtLinkLocale to="/wishlist" class="flex min-h-11 items-center" @click="close">
            {{ t('header.wishlistCount', { count: wishlistCount }) }}
          </NuxtLinkLocale>
        </li>
        <li>
          <NuxtLinkLocale to="/cart" class="flex min-h-11 items-center" @click="close">
            {{ t('header.cartCount', { count: cartCount }) }}
          </NuxtLinkLocale>
        </li>
        <li>
          <button type="button" class="flex min-h-11 cursor-pointer items-center" @click="theme.toggle">
            {{ theme.label.value }}
          </button>
        </li>
      </ul>
    </nav>
  </UiDrawer>
</template>
