import type { CategoryRef, Product, ProductDetail, ProductImage } from '#shared/types/catalog'
import type { CurrencyCode } from '#shared/types/money'
import { fromUsd } from '#shared/utils/money'
import { PROMO_MIN_DISCOUNT, toAvailability } from '#shared/utils/product-rules'
import { slugify } from '#shared/utils/slug'
import type { DummyCategory, DummyProduct } from './schemas'

export { LOW_STOCK_THRESHOLD, PROMO_MIN_DISCOUNT, toAvailability } from '#shared/utils/product-rules'

export function toCategory(raw: DummyCategory): CategoryRef {
  return { slug: raw.slug, name: raw.name }
}

/** DummyJSON only returns the category slug on products; derive a readable name from it. */
function categoryFromSlug(slug: string): CategoryRef {
  const name = slug.replace(/-/g, ' ')
  return { slug, name: name.charAt(0).toUpperCase() + name.slice(1) }
}

function toImage(src: string, title: string): ProductImage {
  return { src, alt: title }
}

/**
 * DummyJSON's `price` is the list price and `discountPercentage` applies on top of it
 * (its carts compute `discountedTotal` that way), so the list price becomes the
 * struck-through price.
 */
export function toProduct(raw: DummyProduct, currency: CurrencyCode): Product {
  const hasPromo = raw.discountPercentage >= PROMO_MIN_DISCOUNT
  const sellingPriceUsd = hasPromo ? raw.price * (1 - raw.discountPercentage / 100) : raw.price
  const images = (raw.images.length ? raw.images : [raw.thumbnail]).map((src) => toImage(src, raw.title))

  return {
    id: raw.id,
    slug: slugify(raw.title),
    title: raw.title,
    description: raw.description,
    price: fromUsd(sellingPriceUsd, currency),
    ...(hasPromo && {
      compareAtPrice: fromUsd(raw.price, currency),
      discountPercent: Math.round(raw.discountPercentage),
    }),
    rating: { average: raw.rating, count: raw.reviews.length },
    stock: raw.stock,
    availability: toAvailability(raw.stock),
    minimumOrderQuantity: raw.minimumOrderQuantity,
    ...(raw.brand && { brand: raw.brand }),
    category: categoryFromSlug(raw.category),
    images,
    thumbnail: toImage(raw.thumbnail, raw.title),
    tags: raw.tags,
    createdAt: raw.meta?.createdAt ?? new Date(0).toISOString(),
  }
}

export function toProductDetail(raw: DummyProduct, currency: CurrencyCode): ProductDetail {
  return {
    ...toProduct(raw, currency),
    sku: raw.sku,
    weight: raw.weight,
    dimensions: raw.dimensions,
    warranty: raw.warrantyInformation,
    shipping: raw.shippingInformation,
    returnPolicy: raw.returnPolicy,
    // Reviewer e-mails are deliberately not forwarded to the client.
    reviews: raw.reviews.map((review) => ({
      rating: review.rating,
      comment: review.comment,
      date: review.date,
      author: review.reviewerName,
    })),
  }
}
