<script setup lang="ts">
import { useAdminActions } from '~/features/admin/composables/useAdminActions'

/** Back office (E17–E22): collapsible sidebar, top bar with the section and the demo badge. */
const { t } = useI18n()
const route = useRoute()
const localePath = useLocalePath()
const toast = useToast()
const theme = useThemeToggle()
const { user, logout } = useAuth()
const { resetDemo } = useAdminActions()

/** Remembered in a cookie so the server renders the sidebar at the right width. */
const collapsed = useCookie<boolean>('etal-admin-sidebar', { default: () => false, sameSite: 'lax' })

const links = [
  { to: '/admin', icon: 'lucide:layout-dashboard', label: 'admin.nav.dashboard', exact: true },
  { to: '/admin/products', icon: 'lucide:package', label: 'admin.nav.products' },
  { to: '/admin/users', icon: 'lucide:users', label: 'admin.nav.users' },
  { to: '/admin/orders', icon: 'lucide:receipt', label: 'admin.nav.orders' },
] as const

function isCurrent(link: { to: string; exact?: boolean }) {
  const path = localePath(link.to)
  return link.exact ? route.path === path : route.path.startsWith(path)
}

const section = computed(() => [...links].reverse().find((link) => isCurrent(link)) ?? links[0])
/** Below `lg` the sidebar always shows icons only; above, it follows the toggle. */
const labelClass = computed(() => (collapsed.value ? 'sr-only' : 'sr-only lg:not-sr-only'))

async function signOut() {
  await logout()
  toast.info(t('account.signedOut'))
  await navigateTo(localePath('/'))
}
</script>

<template>
  <div class="flex min-h-dvh bg-background">
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
    >
      {{ t('a11y.skipToContent') }}
    </a>
    <aside
      :aria-label="t('admin.nav.label')"
      class="sticky top-0 flex h-dvh w-[72px] shrink-0 flex-col gap-1 overflow-hidden border-r border-border bg-surface px-3 py-5 transition-[width] duration-250 ease-standard"
      :class="!collapsed && 'lg:w-60'"
    >
      <div class="mb-3 flex min-h-11 items-end gap-2.5 border-b border-border px-1 pb-5 whitespace-nowrap">
        <LayoutAppLogo to="/admin" class="text-[26px]" :label="t('admin.nav.home')" />
        <span
          class="pb-0.5 text-overline-sm font-semibold text-foreground-muted uppercase"
          :class="labelClass"
          aria-hidden="true"
        >
          {{ t('admin.nav.label') }}
        </span>
      </div>

      <nav :aria-label="t('admin.nav.sections')">
        <ul class="flex flex-col gap-1">
          <li v-for="link in links" :key="link.to">
            <NuxtLinkLocale
              :to="link.to"
              :title="t(link.label)"
              :aria-current="isCurrent(link) ? 'page' : undefined"
              class="relative flex h-11 items-center gap-3 rounded-md px-3 text-body-sm font-medium whitespace-nowrap transition-colors duration-150 hover:bg-surface-muted hover:text-foreground"
              :class="isCurrent(link) ? 'bg-surface-muted text-foreground' : 'text-foreground-muted'"
            >
              <span
                class="absolute inset-y-2.5 left-0 w-0.5 rounded-sm"
                :class="isCurrent(link) ? 'bg-accent' : 'bg-transparent'"
                aria-hidden="true"
              />
              <Icon :name="link.icon" class="size-5 shrink-0" aria-hidden="true" />
              <span :class="labelClass">{{ t(link.label) }}</span>
            </NuxtLinkLocale>
          </li>
        </ul>
      </nav>

      <div class="flex-1" />

      <button
        type="button"
        :title="t('admin.nav.reset')"
        class="flex h-11 cursor-pointer items-center gap-3 rounded-md px-3 text-body-sm font-medium whitespace-nowrap text-foreground-muted transition-colors duration-150 hover:bg-surface-muted hover:text-foreground"
        @click="resetDemo"
      >
        <Icon name="lucide:rotate-ccw" class="size-5 shrink-0" aria-hidden="true" />
        <span :class="labelClass">{{ t('admin.nav.reset') }}</span>
      </button>
      <NuxtLinkLocale
        to="/"
        :title="t('admin.nav.shop')"
        class="flex h-11 items-center gap-3 rounded-md px-3 text-body-sm font-medium whitespace-nowrap text-foreground-muted transition-colors duration-150 hover:bg-surface-muted hover:text-foreground"
      >
        <Icon name="lucide:store" class="size-5 shrink-0" aria-hidden="true" />
        <span :class="labelClass">{{ t('admin.nav.shop') }}</span>
      </NuxtLinkLocale>
      <button
        type="button"
        :aria-label="collapsed ? t('admin.nav.expand') : t('admin.nav.collapse')"
        :aria-expanded="!collapsed"
        class="hidden h-11 cursor-pointer items-center gap-3 rounded-md px-3 text-body-sm font-medium whitespace-nowrap text-foreground-muted transition-colors duration-150 hover:bg-surface-muted hover:text-foreground lg:flex"
        @click="collapsed = !collapsed"
      >
        <Icon
          name="lucide:panel-left-close"
          class="size-5 shrink-0 transition-transform duration-250"
          :class="collapsed && 'rotate-180'"
          aria-hidden="true"
        />
        <span :class="labelClass" aria-hidden="true">{{ t('admin.nav.collapseShort') }}</span>
      </button>
    </aside>

    <div class="flex min-w-0 flex-1 flex-col">
      <header
        class="sticky top-0 z-20 flex h-18 items-center justify-between gap-4 border-b border-border bg-background px-[clamp(16px,3vw,40px)]"
      >
        <div class="flex min-w-0 items-center gap-3">
          <p class="truncate text-meta text-foreground-muted">
            {{ t('admin.nav.label') }} / {{ t(section.label) }}
          </p>
          <UiBadge tone="demo">{{ t('ui.demo') }}</UiBadge>
        </div>
        <div class="flex items-center gap-2">
          <ClientOnly>
            <template #fallback><span class="size-11" aria-hidden="true" /></template>
            <UiIconButton
              :icon="theme.isDark.value ? 'lucide:sun' : 'lucide:moon'"
              :label="theme.label.value"
              @click="theme.toggle"
            />
          </ClientOnly>
          <template v-if="user">
            <UiAvatar :name="`${user.firstName} ${user.lastName}`" :src="user.avatarUrl" :size="36" />
            <span class="hidden text-body-sm font-medium lg:inline"
              >{{ user.firstName }} {{ user.lastName }}</span
            >
          </template>
          <UiIconButton icon="lucide:log-out" :label="t('account.nav.signOut')" @click="signOut" />
        </div>
      </header>
      <main id="main" class="flex w-full max-w-[1400px] flex-col gap-8 px-[clamp(16px,3vw,40px)] pt-8 pb-16">
        <slot />
      </main>
    </div>
  </div>
</template>
