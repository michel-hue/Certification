<script setup lang="ts">
/**
 * Shop header (full mockup). Desktop: logo · rubriques with mega-menu · search · theme,
 * account, favourites, cart. Below `lg`: menu button · centred logo · search toggle · cart.
 * `minimal` is the checkout variant: no navigation, a reassurance line instead.
 */
const props = withDefaults(
  defineProps<{
    /** Transparent over a full-bleed hero until the page scrolls (home page, desktop). */
    overlay?: boolean
    minimal?: boolean
    cartCount?: number
    wishlistCount?: number
    /** Briefly enlarges the cart counter after an add. */
    cartPulse?: boolean
    userName?: string
  }>(),
  { cartCount: 0, wishlistCount: 0 },
)

const { t } = useI18n()
const sections = useSections()
const theme = useThemeToggle()
const { y } = useWindowScroll()
const isDesktop = useMediaQuery('(min-width: 1024px)')

const megaId = ref<string | null>(null)
const mobileNavOpen = ref(false)
const mobileSearchOpen = ref(false)
const mobileSearch = useTemplateRef<{ focus: () => void }>('mobileSearch')

const scrolled = computed(() => y.value > 40)
// Transparency only applies from lg up; the breakpoint is in CSS so server and client agree.
const transparent = computed(() => props.overlay && !scrolled.value && !megaId.value)
const accountLabel = computed(() =>
  props.userName ? t('header.accountOf', { name: props.userName }) : t('header.signIn'),
)

async function toggleMobileSearch() {
  mobileSearchOpen.value = !mobileSearchOpen.value
  if (mobileSearchOpen.value) {
    await nextTick()
    mobileSearch.value?.focus()
  }
}

const route = useRoute()
watch(
  () => route.fullPath,
  () => {
    megaId.value = null
    mobileSearchOpen.value = false
  },
)
</script>

<template>
  <header
    class="sticky top-0 z-30 h-header border-b transition-[background-color,box-shadow,border-color] duration-250 ease-standard"
    :class="[
      'border-border bg-background',
      transparent && 'lg:border-transparent lg:bg-transparent',
      scrolled && !transparent && 'shadow-sm',
      overlay && 'lg:-mb-header',
    ]"
    @mouseleave="megaId = null"
    @keydown.esc="megaId = null"
  >
    <div class="mx-auto flex h-full max-w-content items-center gap-6 px-[clamp(12px,4vw,48px)]">
      <UiIconButton
        class="lg:hidden"
        icon="lucide:menu"
        icon-size="lg"
        :label="t('nav.openMenu')"
        :aria-expanded="mobileNavOpen"
        @click="mobileNavOpen = true"
      />

      <div class="flex flex-1 justify-center lg:flex-none lg:justify-start">
        <LayoutAppLogo class="pt-1.5 text-[30px]" :label="t('nav.home')" />
      </div>

      <nav v-if="!minimal" :aria-label="t('nav.sections')" class="hidden flex-1 lg:block">
        <ul class="flex gap-7 text-body-sm font-medium">
          <li v-for="section in sections" :key="section.id">
            <NuxtLinkLocale
              :to="section.to"
              class="link-reveal block pt-6 whitespace-nowrap"
              :class="megaId === section.id && 'bg-size-[100%_1px]'"
              :aria-expanded="megaId === section.id"
              @mouseenter="megaId = section.id"
              @focus="megaId = section.id"
            >
              {{ section.name }}
            </NuxtLinkLocale>
          </li>
        </ul>
      </nav>

      <p
        v-if="minimal"
        class="hidden flex-1 items-center justify-center gap-2 text-meta text-foreground-muted lg:flex"
      >
        <Icon name="lucide:lock" class="size-4" aria-hidden="true" />
        {{ t('nav.secureCheckout') }}
      </p>

      <LayoutHeaderSearch v-if="!minimal" class="hidden w-full max-w-80 flex-[0_1_320px] lg:block" />

      <div class="ml-auto flex items-center gap-0.5">
        <UiIconButton
          v-if="!minimal"
          class="lg:hidden"
          icon="lucide:search"
          :label="t('header.search')"
          :aria-expanded="mobileSearchOpen"
          @click="toggleMobileSearch"
        />
        <ClientOnly>
          <!-- Same footprint before mount, so the icons do not shift (CLS). -->
          <template #fallback><span class="hidden size-11 lg:block" aria-hidden="true" /></template>
          <UiIconButton
            class="hidden lg:flex"
            :icon="theme.isDark.value ? 'lucide:sun' : 'lucide:moon'"
            :label="theme.label.value"
            @click="theme.toggle"
          />
        </ClientOnly>
        <UiIconButton
          class="hidden lg:flex"
          icon="lucide:user"
          to="/account"
          :label="accountLabel"
          :dot="!!userName"
        />
        <UiIconButton
          class="hidden lg:flex"
          icon="lucide:heart"
          to="/wishlist"
          :label="t('header.wishlist')"
          :count="wishlistCount"
          count-tone="primary"
        />
        <UiIconButton
          icon="lucide:shopping-bag"
          to="/cart"
          :label="t('header.cart', { count: cartCount }, cartCount)"
          :count="cartCount"
          :pulse="cartPulse"
        />
      </div>
    </div>

    <div
      v-if="mobileSearchOpen && !minimal"
      class="absolute inset-x-0 top-header border-b border-border bg-background p-3 lg:hidden"
    >
      <LayoutHeaderSearch ref="mobileSearch" @submitted="mobileSearchOpen = false" />
    </div>

    <LayoutMegaMenu v-if="megaId && isDesktop" :active-id="megaId" @navigate="megaId = null" />
  </header>

  <LayoutMobileNav v-model:open="mobileNavOpen" :cart-count="cartCount" :wishlist-count="wishlistCount" />
</template>
