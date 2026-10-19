<script setup lang="ts">
/** Ink footer: link columns, preferences, giant logotype, portfolio disclaimer (full mockup). */
const { t } = useI18n()
const sections = useSections()
const theme = useThemeToggle()
const { loggedIn } = useAuth()

const columns = computed(() => [
  {
    title: t('nav.sections'),
    links: sections.value.map((section) => ({ to: section.to, label: section.name })),
  },
  {
    title: t('footer.shop'),
    links: [
      { to: '/products', label: t('footer.links.catalog') },
      { to: { path: '/products', query: { promo: '1' } }, label: t('footer.links.deals') },
      { to: { path: '/products', query: { sort: 'newest' } }, label: t('footer.links.new') },
      { to: '/wishlist', label: t('footer.links.wishlist') },
    ],
  },
  {
    title: t('footer.account'),
    links: [
      loggedIn.value
        ? { to: '/account', label: t('footer.links.myAccount') }
        : { to: '/login', label: t('footer.links.login') },
      { to: '/account/orders', label: t('footer.links.orders') },
      { to: '/register', label: t('footer.links.register') },
      { to: '/admin', label: t('footer.links.admin') },
    ],
  },
  {
    title: t('footer.demo'),
    links: [
      { to: '/page-introuvable', label: t('footer.links.notFound') },
      { to: '/500', label: t('footer.links.serverError') },
    ],
  },
])
</script>

<template>
  <footer class="mt-section bg-inverse text-inverse-foreground">
    <div class="mx-auto flex max-w-content flex-col gap-16 px-gutter pt-[clamp(3.5rem,7vw,6rem)] pb-8">
      <div class="grid grid-cols-[repeat(auto-fit,minmax(min(100%,170px),1fr))] gap-8">
        <nav v-for="column in columns" :key="column.title" :aria-label="column.title">
          <h2 class="mb-3 font-sans text-overline-sm font-semibold text-inverse-muted uppercase">
            {{ column.title }}
          </h2>
          <ul class="flex flex-col gap-3 text-ui">
            <li v-for="link in column.links" :key="link.label">
              <NuxtLinkLocale :to="link.to" class="transition-colors duration-150 hover:text-inverse-accent">
                {{ link.label }}
              </NuxtLinkLocale>
            </li>
          </ul>
        </nav>
        <div class="flex flex-col items-start gap-3">
          <h2 class="font-sans text-overline-sm font-semibold text-inverse-muted uppercase">
            {{ t('footer.preferences') }}
          </h2>
          <ClientOnly>
            <button
              type="button"
              class="h-10 cursor-pointer rounded-md border border-inverse-border px-3.5 text-body-sm font-medium transition-colors duration-150 hover:border-inverse-foreground"
              @click="theme.toggle"
            >
              {{ theme.label.value }}
            </button>
          </ClientOnly>
          <LayoutLocaleSwitcher />
        </div>
      </div>

      <div
        aria-hidden="true"
        class="flex items-end overflow-hidden border-t border-inverse-border pt-[0.18em] font-serif text-[clamp(7rem,24vw,22rem)] leading-[0.8] font-medium tracking-[-0.03em] [font-variation-settings:'opsz'_144]"
      >
        <span class="relative inline-block">
          E<span
            class="absolute top-[-0.14em] left-[0.1em] h-[0.06em] w-[0.46em] -rotate-12 bg-inverse-mark"
          />
        </span>
        <span>tal</span>
      </div>

      <div class="flex flex-wrap justify-between gap-4 text-meta text-inverse-muted">
        <p>{{ t('brand.tagline') }} · {{ t('footer.credits') }}</p>
        <p>{{ t('footer.disclaimer') }}</p>
      </div>
    </div>
  </footer>
</template>
