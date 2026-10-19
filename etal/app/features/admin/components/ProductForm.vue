<script setup lang="ts">
import { useForm } from 'vee-validate'
import { productFormSchema, type ProductFormInput, type ProductFormValues } from '#shared/schemas/admin'
import type { CategoryRef, Product } from '#shared/types/catalog'
import { zodTypedSchema } from '~/utils/zodForm'
import { productFromForm } from '../product-form'

/**
 * Product create / edit form (E19), in sections, with the shop card previewed live.
 * Validation comes from the shared Zod schema; the parent performs the save.
 */
const props = defineProps<{ initial: ProductFormInput; product?: Product; saving?: boolean }>()
const emit = defineEmits<{ save: [values: ProductFormValues]; delete: [] }>()

const { t } = useI18n()
const toast = useToast()
const { currency } = useAppConfig()
const categoryName = useCategoryName()
const { data: categories } = useFetch<CategoryRef[]>('/api/products/categories', {
  key: 'products:categories',
  default: () => [],
})
const categoryOptions = computed(() =>
  categories.value.map((category) => ({ value: category.slug, label: categoryName(category) })),
)

const { handleSubmit, defineField, errors, values } = useForm({
  validationSchema: zodTypedSchema(productFormSchema),
  initialValues: props.initial,
})
/** Quiet while typing; once a field shows an error, it re-checks on every change. */
const config = (state: { errors: string[] }) => ({ validateOnModelUpdate: state.errors.length > 0 })
const [title] = defineField('title', config)
const [brand] = defineField('brand', config)
const [category] = defineField('category', config)
const [description] = defineField('description', config)
const [price] = defineField('price', config)
const [discountPercent] = defineField('discountPercent', config)
const [stock] = defineField('stock', config)
const [thumbnail] = defineField('thumbnail', config)

const error = (key: keyof ProductFormInput) => (errors.value[key] ? t(errors.value[key]!) : undefined)

/** Tolerant of half-typed values: the card always renders something sensible. */
const preview = computed(() => {
  const number = (value: string | undefined) => Number((value ?? '').replace(',', '.')) || 0
  return productFromForm(
    {
      title: values.title?.trim() || t('admin.products.form.previewTitle'),
      brand: values.brand ?? '',
      category: values.category ?? '',
      description: values.description ?? '',
      price: number(values.price),
      discountPercent: Math.min(90, number(values.discountPercent)),
      stock: values.stock === '' ? 1 : Math.trunc(number(values.stock)),
      thumbnail: values.thumbnail ?? '',
    },
    { id: props.product?.id ?? 0, currency, base: props.product },
  )
})

const submit = handleSubmit(
  (input) => emit('save', input),
  () => toast.error(t('checkout.errors.fix')),
)
</script>

<template>
  <div class="flex flex-wrap items-start gap-8">
    <form class="flex min-w-0 flex-[3_1_480px] flex-col gap-8" novalidate @submit="submit">
      <fieldset class="grid grid-cols-2 gap-x-4 gap-y-5">
        <legend class="col-span-2 mb-5 font-sans text-ui font-semibold">
          {{ t('admin.products.form.info') }}
        </legend>
        <UiFormField
          v-slot="field"
          class="col-span-2"
          :label="t('admin.products.form.title')"
          :error="error('title')"
          required
        >
          <UiInput
            :id="field.id"
            v-model="title"
            :aria-describedby="field.describedBy"
            :invalid="field.invalid"
          />
        </UiFormField>
        <UiFormField
          v-slot="field"
          class="max-sm:col-span-2"
          :label="t('admin.products.form.brand')"
          :error="error('brand')"
        >
          <UiInput
            :id="field.id"
            v-model="brand"
            :aria-describedby="field.describedBy"
            :invalid="field.invalid"
          />
        </UiFormField>
        <UiFormField
          v-slot="field"
          class="max-sm:col-span-2"
          :label="t('admin.products.form.category')"
          :error="error('category')"
        >
          <UiSelect
            :id="field.id"
            v-model="category"
            size="md"
            :options="categoryOptions"
            :aria-describedby="field.describedBy"
            :invalid="field.invalid"
          />
        </UiFormField>
        <UiFormField
          v-slot="field"
          class="col-span-2"
          :label="t('admin.products.form.description')"
          :error="error('description')"
        >
          <UiTextarea
            :id="field.id"
            v-model="description"
            :maxlength="400"
            :aria-describedby="field.describedBy"
            :invalid="field.invalid"
          />
        </UiFormField>
      </fieldset>

      <fieldset class="grid grid-cols-3 gap-x-4 gap-y-5 border-t border-border pt-6">
        <legend class="sr-only">{{ t('admin.products.form.pricing') }}</legend>
        <p class="col-span-3 font-sans text-ui font-semibold" aria-hidden="true">
          {{ t('admin.products.form.pricing') }}
        </p>
        <UiFormField
          v-slot="field"
          class="max-sm:col-span-3"
          :label="t('admin.products.form.price', { currency })"
          :error="error('price')"
          required
        >
          <UiInput
            :id="field.id"
            v-model="price"
            inputmode="decimal"
            class="tabular-nums"
            :aria-describedby="field.describedBy"
            :invalid="field.invalid"
          />
        </UiFormField>
        <UiFormField
          v-slot="field"
          class="max-sm:col-span-3"
          :label="t('admin.products.form.discount')"
          :error="error('discountPercent')"
          :help="t('admin.products.form.discountHelp')"
        >
          <UiInput
            :id="field.id"
            v-model="discountPercent"
            inputmode="decimal"
            class="tabular-nums"
            :aria-describedby="field.describedBy"
            :invalid="field.invalid"
          />
        </UiFormField>
        <UiFormField
          v-slot="field"
          class="max-sm:col-span-3"
          :label="t('admin.products.form.stock')"
          :error="error('stock')"
          required
        >
          <UiInput
            :id="field.id"
            v-model="stock"
            inputmode="numeric"
            class="tabular-nums"
            :aria-describedby="field.describedBy"
            :invalid="field.invalid"
          />
        </UiFormField>
      </fieldset>

      <fieldset class="flex flex-col gap-5 border-t border-border pt-6">
        <legend class="sr-only">{{ t('admin.products.form.image') }}</legend>
        <p class="font-sans text-ui font-semibold" aria-hidden="true">{{ t('admin.products.form.image') }}</p>
        <UiFormField
          v-slot="field"
          :label="t('admin.products.form.thumbnail')"
          :error="error('thumbnail')"
          :help="t('admin.products.form.thumbnailHelp')"
          required
        >
          <UiInput
            :id="field.id"
            v-model="thumbnail"
            type="url"
            :placeholder="t('admin.products.form.thumbnailPlaceholder')"
            :aria-describedby="field.describedBy"
            :invalid="field.invalid"
          />
        </UiFormField>
      </fieldset>

      <div class="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
        <UiButton to="/admin/products" variant="ghost">{{ t('admin.products.form.cancel') }}</UiButton>
        <div class="flex gap-3">
          <UiButton v-if="product" variant="danger-outline" @click="emit('delete')">
            {{ t('admin.products.form.delete') }}
          </UiButton>
          <UiButton type="submit" :loading="saving">
            {{ product ? t('admin.products.form.save') : t('admin.products.form.create') }}
          </UiButton>
        </div>
      </div>
    </form>

    <aside
      class="flex flex-[1_1_260px] flex-col gap-3 lg:sticky lg:top-26 lg:max-w-80"
      :aria-label="t('admin.products.form.preview')"
    >
      <p class="text-overline-sm font-semibold text-foreground-muted uppercase">
        {{ t('admin.products.form.preview') }}
      </p>
      <div class="pointer-events-none" inert>
        <ProductCard :product="preview" sizes="320px" />
      </div>
    </aside>
  </div>
</template>
