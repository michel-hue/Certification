<script setup lang="ts">
import type { ProductFormValues } from '#shared/schemas/admin'
import { useAdminActions } from '~/features/admin/composables/useAdminActions'
import { emptyProductForm } from '~/features/admin/product-form'

/** Product creation (E19). */
const { t } = useI18n()
const localePath = useLocalePath()
const { saveProduct } = useAdminActions()
const saving = ref(false)

async function save(values: ProductFormValues) {
  saving.value = true
  const product = await saveProduct(values)
  saving.value = false
  if (product) await navigateTo(localePath('/admin/products'))
}

useSeoMeta({ title: () => t('admin.products.form.newTitle') })
</script>

<template>
  <div class="flex flex-col gap-8">
    <AdminPageHeader
      :overline="t('admin.products.form.creating')"
      :title="t('admin.products.form.newTitle')"
    />
    <ProductForm :initial="emptyProductForm()" :saving="saving" @save="save" />
  </div>
</template>
