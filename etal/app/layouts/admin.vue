<script setup lang="ts">
const { t } = useI18n()

const links = [
  { to: '/admin', icon: 'lucide:layout-dashboard', label: 'admin.nav.dashboard' },
  { to: '/admin/products', icon: 'lucide:package', label: 'admin.nav.products' },
  { to: '/admin/users', icon: 'lucide:users', label: 'admin.nav.users' },
  { to: '/admin/orders', icon: 'lucide:receipt', label: 'admin.nav.orders' },
] as const
</script>

<template>
  <div class="flex min-h-dvh">
    <aside class="flex w-64 shrink-0 flex-col gap-8 border-r border-border bg-surface px-4 py-6">
      <LayoutAppLogo class="self-start px-3 text-[26px]" :label="t('nav.home')" />
      <nav :aria-label="t('admin.nav.label')">
        <ul class="flex flex-col gap-1">
          <li v-for="link in links" :key="link.to">
            <NuxtLinkLocale
              :to="link.to"
              class="flex h-11 items-center gap-3 rounded-md px-3 text-body-sm font-medium text-foreground-muted transition-colors duration-150 hover:bg-surface-muted hover:text-foreground"
              exact-active-class="bg-surface-muted !text-foreground"
            >
              <Icon :name="link.icon" class="size-5" aria-hidden="true" />
              {{ t(link.label) }}
            </NuxtLinkLocale>
          </li>
        </ul>
      </nav>
    </aside>
    <main id="main" class="min-w-0 flex-1 px-gutter py-8">
      <slot />
    </main>
  </div>
</template>
