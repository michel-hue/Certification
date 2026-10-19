<script setup lang="ts">
import { ORDER_STATUSES, type OrderStatus } from '#shared/types/order'

/** Fictitious order status, editable locally (CDC §10.4). */
defineProps<{ label: string }>()
const model = defineModel<OrderStatus>({ required: true })

const { t } = useI18n()
const options = computed(() =>
  ORDER_STATUSES.map((status) => ({ value: status, label: t(`orders.status.${status}`) })),
)
const value = computed({
  get: () => model.value,
  set: (status) => (model.value = status as OrderStatus),
})
</script>

<template>
  <UiSelect v-model="value" :options="options" :aria-label="label" />
</template>
