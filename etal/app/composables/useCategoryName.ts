import type { CategoryRef } from '#shared/types/catalog'

/** French/English category label; falls back to the API's English name for unknown slugs. */
export function useCategoryName() {
  const { t, te } = useI18n()
  return (category: CategoryRef | string) => {
    const slug = typeof category === 'string' ? category : category.slug
    const key = `categories.${slug}`
    if (te(key)) return t(key)
    return typeof category === 'string' ? slug.replace(/-/g, ' ') : category.name
  }
}
