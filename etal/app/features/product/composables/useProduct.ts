import type { ProductDetail } from '#shared/types/catalog'

/** One product with reviews, through the Nitro proxy. A 404 becomes the error page. */
export async function useProduct(id: MaybeRefOrGetter<number>) {
  const result = await useFetch<ProductDetail>(() => `/api/products/${toValue(id)}`, {
    key: computed(() => `product:${toValue(id)}`),
  })
  if (result.error.value?.statusCode === 404) {
    throw createError({ statusCode: 404, statusMessage: 'Product not found', fatal: true })
  }
  return result
}
