<script setup lang="ts">
import type { ProductFormValues } from '#shared/schemas/admin'
import { useAdminActions } from '~/features/admin/composables/useAdminActions'
import { useAdminProducts } from '~/features/admin/composables/useAdminData'
import { productToForm } from '~/features/admin/product-form'

/** Product edit (E19), with deletion behind a confirmation (E22). */
const route = useRoute()
const { t, locale } = useI18n()
const localePath = useLocalePath()
const { products, pending, error, refresh } = useAdminProducts()
const { saveProduct, deleteProducts } = useAdminActions()

const id = computed(() => Number(route.params.id))
const product = computed(() => products.value.find((item) => item.id === id.value))
const saving = ref(false)
const confirmOpen = ref(false)

async function save(values: ProductFormValues) {
  saving.value = true
  const saved = await saveProduct(values, product.value)
  saving.value = false
  if (saved) await navigateTo(localePath('/admin/products'))
}

async function remove() {
  if (product.value && (await deleteProducts([product.value])))
    await navigateTo(localePath('/admin/products'))
}

useSeoMeta({ title: () => product.value?.title ?? t('admin.products.title') })
</script>

<template>
  <div class="flex flex-col gap-8">
    <AdminPageHeader
      :overline="t('admin.products.form.editing', { id: route.params.id })"
      :title="product?.title ?? t('admin.products.title')"
    />
    <AdminDataState
      :pending="pending"
      :error="error"
      :ready="products.length > 0"
      :empty="!product"
      :empty-text="t('admin.products.form.notFound')"
      :rows="5"
      @retry="refresh()"
    >
      <ProductForm
        v-if="product"
        :key="product.id"
        :initial="productToForm(product, locale)"
        :product="product"
        :saving="saving"
        @save="save"
        @delete="confirmOpen = true"
      />
    </AdminDataState>
    <UiConfirmDialog
      v-if="product"
      v-model:open="confirmOpen"
      :title="t('admin.products.confirm.titleOne', { title: product.title })"
      :description="t('admin.products.confirm.text')"
      :confirm-label="t('admin.products.confirm.ok')"
      @confirm="remove"
    />
  </div>
</template>
