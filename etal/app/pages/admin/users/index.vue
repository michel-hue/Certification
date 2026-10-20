<script setup lang="ts">
import type { AdminUser } from '#shared/types/admin'
import { useAdminUsers } from '~/features/admin/composables/useAdminData'
import { matchesSearch, nextSort, paginate, sortRows, type SortState } from '~/features/admin/table'

/** User table (E20): search, sorting, paging; each name opens the user's page. */
type Column = 'name' | 'email' | 'role' | 'birthDate'
const PAGE_SIZE = 10

const { t, d, locale } = useI18n()
const { users, pending, error, refresh } = useAdminUsers()

const search = ref('')
const sort = ref<SortState<Column>>({ key: 'name', direction: 'ascending' })
const page = ref(1)
watch(search, () => (page.value = 1))

const fullName = (user: AdminUser) => `${user.firstName} ${user.lastName}`

function valueOf(user: AdminUser, key: Column): string {
  if (key === 'name') return fullName(user)
  if (key === 'role') return t(`admin.users.roles.${user.role}`)
  return user[key] ?? ''
}

const result = computed(() => {
  const rows = users.value.filter((user) =>
    matchesSearch(search.value, fullName(user), user.email, user.username),
  )
  return paginate(sortRows(rows, sort.value, valueOf, locale.value), page.value, PAGE_SIZE)
})

const columns = computed(() => [
  { key: 'name' as const, label: t('admin.users.columns.name') },
  { key: 'email' as const, label: t('admin.users.columns.email') },
  { key: 'role' as const, label: t('admin.users.columns.role') },
  { key: 'birthDate' as const, label: t('admin.users.columns.birthDate') },
])

useSeoMeta({ title: () => t('admin.users.title') })
</script>

<template>
  <div class="flex flex-col gap-6">
    <AdminPageHeader :overline="t('admin.users.overline')" :title="t('admin.users.title')" />

    <UiInput
      v-model="search"
      type="search"
      size="sm"
      icon-left="lucide:search"
      wrapper-class="max-w-90"
      :placeholder="t('admin.users.search')"
      :aria-label="t('admin.users.searchLabel')"
    />

    <AdminDataState
      :pending="pending"
      :error="error"
      :ready="users.length > 0"
      :empty="!result.total"
      :empty-text="t('admin.users.empty')"
      @retry="refresh()"
    >
      <div class="overflow-x-auto rounded-md border border-border bg-surface">
        <table class="w-full min-w-[760px] border-collapse text-body-sm">
          <caption class="sr-only">
            {{
              t('admin.users.title')
            }}
          </caption>
          <thead>
            <tr class="border-b border-border">
              <th scope="col" class="w-16">
                <span class="sr-only">{{ t('admin.users.columns.avatar') }}</span>
              </th>
              <AdminSortHeader
                v-for="column in columns"
                :key="column.key"
                :label="column.label"
                :column="column.key"
                :sort="sort"
                @sort="sort = nextSort(sort, $event)"
              />
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="user in result.items"
              :key="user.id"
              class="border-b border-border last:border-b-0 hover:bg-background"
            >
              <td class="px-3 py-2.5">
                <UiAvatar :name="fullName(user)" :src="user.avatarUrl" :size="36" />
              </td>
              <td class="px-2 font-medium">
                <NuxtLinkLocale :to="`/admin/users/${user.id}`" class="hover:text-accent-text">{{
                  fullName(user)
                }}</NuxtLinkLocale>
              </td>
              <td class="px-2 text-foreground-muted">{{ user.email }}</td>
              <td class="px-2"><UserRoleBadge :role="user.role" /></td>
              <td class="px-2 text-foreground-muted tabular-nums">
                {{ user.birthDate ? d(new Date(user.birthDate), 'short') : '—' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <AdminTableFooter
        :count="t('admin.users.count', { count: result.total }, result.total)"
        :page="result.page"
        :page-count="result.pageCount"
        @change="page = $event"
      />
    </AdminDataState>
  </div>
</template>
