<script setup lang="ts">
import type { UserRole } from '#shared/types/user'
import { useAdminActions } from '~/features/admin/composables/useAdminActions'
import { useAdminOrders, useAdminUsers } from '~/features/admin/composables/useAdminData'

/** User page (E20): identity, role (simulated write), details, orders, deletion. */
const route = useRoute()
const { t, d } = useI18n()
const localePath = useLocalePath()
const { user: me } = useAuth()
const { users, pending, error, refresh } = useAdminUsers()
const { orders } = useAdminOrders()
const { setUserRole, deleteUser } = useAdminActions()

const user = computed(() => users.value.find((item) => item.id === Number(route.params.id)))
const name = computed(() => (user.value ? `${user.value.firstName} ${user.value.lastName}` : ''))
const isMe = computed(() => user.value?.id === me.value?.id)
const userOrders = computed(() => orders.value.filter((order) => order.userId === user.value?.id))
const confirmOpen = ref(false)

const roleOptions = computed(() =>
  (['customer', 'admin'] as const).map((role) => ({ value: role, label: t(`admin.users.roles.${role}`) })),
)
const role = computed({
  get: () => user.value?.role ?? 'customer',
  set: (value: string) => {
    if (user.value) void setUserRole(user.value, value as UserRole)
  },
})

const fields = computed(() => {
  const value = user.value
  if (!value) return []
  return [
    { label: t('admin.users.fields.username'), value: value.username },
    { label: t('admin.users.fields.email'), value: value.email },
    { label: t('admin.users.fields.phone'), value: value.phone },
    { label: t('admin.users.fields.company'), value: value.company },
    { label: t('admin.users.fields.address'), value: value.address },
    {
      label: t('admin.users.fields.birthDate'),
      value: value.birthDate && d(new Date(value.birthDate), 'long'),
    },
  ]
})

async function remove() {
  if (user.value && (await deleteUser(user.value))) await navigateTo(localePath('/admin/users'))
}

useSeoMeta({ title: () => name.value || t('admin.users.title') })
</script>

<template>
  <div class="flex flex-col gap-8">
    <NuxtLinkLocale
      to="/admin/users"
      class="inline-flex items-center gap-1.5 self-start text-body-sm text-foreground-muted transition-colors duration-150 hover:text-foreground"
    >
      <Icon name="lucide:arrow-left" class="size-4" aria-hidden="true" />
      {{ t('admin.users.back') }}
    </NuxtLinkLocale>

    <AdminDataState
      :pending="pending"
      :error="error"
      :ready="users.length > 0"
      :empty="!user"
      :empty-text="t('admin.users.notFound')"
      :rows="4"
      @retry="refresh()"
    >
      <div v-if="user" class="flex flex-wrap items-start gap-6">
        <section
          class="flex flex-[1_1_280px] flex-col items-center gap-4 rounded-md border border-border bg-surface p-6 text-center"
          :aria-label="name"
        >
          <UiAvatar :name="name" :src="user.avatarUrl" :size="96" />
          <div class="flex flex-col items-center gap-2">
            <h1 class="text-[28px] leading-tight font-medium">{{ name }}</h1>
            <UserRoleBadge :role="user.role" />
          </div>
          <UiFormField
            v-slot="field"
            class="w-full text-left"
            :label="t('admin.users.role')"
            :help="isMe ? t('admin.users.self') : undefined"
          >
            <UiSelect
              :id="field.id"
              v-model="role"
              :options="roleOptions"
              :disabled="isMe"
              :aria-describedby="field.describedBy"
            />
          </UiFormField>
          <UiButton
            v-if="!isMe"
            variant="danger-outline"
            block
            icon-left="lucide:trash-2"
            @click="confirmOpen = true"
          >
            {{ t('admin.users.delete') }}
          </UiButton>
        </section>

        <div class="flex min-w-0 flex-[2_1_420px] flex-col gap-6">
          <dl
            class="m-0 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-x-6 gap-y-5 rounded-md border border-border bg-surface p-6"
          >
            <div v-for="field in fields" :key="field.label" class="flex min-w-0 flex-col gap-1">
              <dt class="text-overline-sm font-semibold text-foreground-muted uppercase">
                {{ field.label }}
              </dt>
              <dd class="m-0 text-ui break-words">{{ field.value || '—' }}</dd>
            </div>
          </dl>

          <AdminPanel class="gap-2" :title="t('admin.users.orders', { count: userOrders.length })">
            <div v-if="userOrders.length">
              <OrderRow
                v-for="order in userOrders"
                :key="order.id"
                :order="order"
                :to="`/admin/orders/${order.id}`"
              />
            </div>
            <p v-else class="text-body-sm text-foreground-muted">{{ t('account.noOrders') }}</p>
          </AdminPanel>
        </div>
      </div>
    </AdminDataState>

    <UiConfirmDialog
      v-if="user"
      v-model:open="confirmOpen"
      :title="t('admin.users.confirm.title', { name })"
      :description="t('admin.users.confirm.text')"
      :confirm-label="t('admin.users.confirm.ok')"
      @confirm="remove"
    />
  </div>
</template>
