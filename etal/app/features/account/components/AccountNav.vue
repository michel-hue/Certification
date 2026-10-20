<script setup lang="ts">
/** Account navigation (E14): identity, sections, back office for admins, sign out. */
const { t } = useI18n()
const route = useRoute()
const localePath = useLocalePath()
const toast = useToast()
const { user, isAdmin, logout } = useAuth()

const links = computed(() => [
  { to: '/account', icon: 'lucide:layout-grid', label: t('account.nav.overview'), exact: true },
  { to: '/account/orders', icon: 'lucide:receipt', label: t('account.nav.orders') },
  { to: '/account/profile', icon: 'lucide:user', label: t('account.nav.profile') },
  { to: '/wishlist', icon: 'lucide:heart', label: t('account.nav.wishlist') },
  ...(isAdmin.value ? [{ to: '/admin', icon: 'lucide:shield', label: t('account.nav.admin') }] : []),
])

function isCurrent(link: { to: string; exact?: boolean }) {
  const path = localePath(link.to)
  return link.exact ? route.path === path : route.path.startsWith(path)
}

async function signOut() {
  await logout()
  toast.info(t('account.signedOut'))
  await navigateTo(localePath('/'))
}
</script>

<template>
  <nav :aria-label="t('account.nav.label')" class="flex flex-col gap-0.5">
    <div v-if="user" class="mb-3 hidden items-center gap-3 border-b border-border pb-6 lg:flex">
      <UiAvatar :name="`${user.firstName} ${user.lastName}`" :src="user.avatarUrl" />
      <span class="flex min-w-0 flex-col">
        <span class="text-ui font-semibold">{{ user.firstName }} {{ user.lastName }}</span>
        <span class="truncate text-caption text-foreground-muted">{{ user.email }}</span>
      </span>
    </div>
    <ul class="flex gap-0.5 overflow-x-auto [scrollbar-width:none] lg:flex-col">
      <li v-for="link in links" :key="link.to">
        <NuxtLinkLocale
          :to="link.to"
          :aria-current="isCurrent(link) ? 'page' : undefined"
          class="flex min-h-11 items-center gap-3 rounded-md px-3 text-ui font-medium whitespace-nowrap transition-colors duration-150 hover:bg-surface-muted hover:text-foreground"
          :class="isCurrent(link) ? 'bg-surface-muted text-foreground' : 'text-foreground-muted'"
        >
          <Icon :name="link.icon" class="size-[18px]" aria-hidden="true" />
          {{ link.label }}
        </NuxtLinkLocale>
      </li>
      <li>
        <button
          type="button"
          class="flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-md px-3 text-ui font-medium whitespace-nowrap text-foreground-muted transition-colors duration-150 hover:bg-surface-muted hover:text-foreground"
          @click="signOut"
        >
          <Icon name="lucide:log-out" class="size-[18px]" aria-hidden="true" />
          {{ t('account.nav.signOut') }}
        </button>
      </li>
    </ul>
  </nav>
</template>
