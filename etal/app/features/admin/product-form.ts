import type { ProductFormInput, ProductFormValues, ProductWrite } from '#shared/schemas/admin'
import type { Product } from '#shared/types/catalog'
import type { CurrencyCode } from '#shared/types/money'
import { fromMajorUnits, toMajorUnits, toUsd } from '#shared/utils/money'
import { PROMO_MIN_DISCOUNT, toAvailability } from '#shared/utils/product-rules'
import { slugify } from '#shared/utils/slug'

/** « 8,27 » in French, « 8.27 » in English: the schema reads both. */
const decimalText = (value: number, locale: string) =>
  new Intl.NumberFormat(locale, { maximumFractionDigits: 2, useGrouping: false }).format(value)

/** Form values for an existing product: the list price is the struck-through one, if any. */
export function productToForm(product: Product, locale: string): ProductFormInput {
  return {
    title: product.title,
    brand: product.brand ?? '',
    category: product.category.slug,
    description: product.description,
    price: decimalText(toMajorUnits(product.compareAtPrice ?? product.price), locale),
    discountPercent: decimalText(product.discountPercent ?? 0, locale),
    stock: String(product.stock),
    thumbnail: product.thumbnail.src,
  }
}

export function emptyProductForm(category = 'beauty'): ProductFormInput {
  return {
    title: '',
    brand: '',
    category,
    description: '',
    price: '',
    discountPercent: '0',
    stock: '',
    thumbnail: '',
  }
}

/**
 * The product as the shop would show it after the edit (live card preview, optimistic
 * update). Same promo rule as the API mapper: a discount below 10 % is not displayed.
 */
export function productFromForm(
  values: ProductFormValues,
  options: { id: number; currency: CurrencyCode; base?: Product },
): Product {
  const { base, currency } = options
  const listPrice = fromMajorUnits(values.price, currency)
  const hasPromo = values.discountPercent >= PROMO_MIN_DISCOUNT
  const thumbnail = { src: values.thumbnail, alt: values.title }
  const keptImages = base?.images.filter((image) => image.src !== base.thumbnail.src) ?? []

  return {
    id: options.id,
    slug: slugify(values.title) || 'produit',
    title: values.title,
    description: values.description,
    price: hasPromo
      ? { amount: Math.round(listPrice.amount * (1 - values.discountPercent / 100)), currency }
      : listPrice,
    ...(hasPromo && { compareAtPrice: listPrice, discountPercent: Math.round(values.discountPercent) }),
    rating: base?.rating ?? { average: 0, count: 0 },
    stock: values.stock,
    availability: toAvailability(values.stock),
    minimumOrderQuantity: base?.minimumOrderQuantity ?? 1,
    ...(values.brand && { brand: values.brand }),
    category: { slug: values.category, name: values.category.replace(/-/g, ' ') },
    images: [thumbnail, ...keptImages.map((image) => ({ ...image, alt: values.title }))],
    thumbnail,
    tags: base?.tags ?? [],
    createdAt: base?.createdAt ?? new Date().toISOString(),
  }
}

/** Body for the simulated DummyJSON write: prices go back to USD. */
export function toProductWrite(values: ProductFormValues, currency: CurrencyCode): ProductWrite {
  return {
    title: values.title,
    ...(values.brand && { brand: values.brand }),
    category: values.category,
    description: values.description,
    price: Math.max(0.01, toUsd(fromMajorUnits(values.price, currency))),
    discountPercentage: values.discountPercent,
    stock: values.stock,
    thumbnail: values.thumbnail,
  }
}
