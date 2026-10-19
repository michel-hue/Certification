<script setup lang="ts">
import type { UserRole } from '#shared/types/user'

/** Role pill; the word always comes with the colour. */
defineProps<{ role: UserRole }>()

const { t } = useI18n()
</script>

<template>
  <UiBadge :tone="role === 'admin' ? 'accent' : 'outline'">{{ t(`admin.users.roles.${role}`) }}</UiBadge>
</template>
