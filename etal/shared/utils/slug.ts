/** URL-safe slug: `Rolex Cellini Date` → `rolex-cellini-date`. Accents are dropped, not encoded. */
export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Route param for `/products/[id]-[slug]`. */
export function toProductParam(product: { id: number; slug: string }): string {
  return `${product.id}-${product.slug}`
}

/** Extracts the product id from `42-some-slug`; the slug is cosmetic and never trusted. */
export function parseProductParam(param: string): number | null {
  const match = /^(\d+)(?:-|$)/.exec(param)
  if (!match) return null
  const id = Number(match[1])
  return Number.isSafeInteger(id) && id > 0 ? id : null
}
