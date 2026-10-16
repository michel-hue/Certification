import type { Money } from './money'

export interface CategoryRef {
  slug: string
  name: string
}

export interface ProductImage {
  src: string
  alt: string
}

export type Availability = 'in_stock' | 'low_stock' | 'out_of_stock'

export interface ProductRating {
  average: number
  count: number
}

/** Catalog item as shown on cards and listings. */
export interface Product {
  id: number
  slug: string
  title: string
  description: string
  price: Money
  /** Pre-discount price, only set when the discount is worth showing. */
  compareAtPrice?: Money
  discountPercent?: number
  rating: ProductRating
  stock: number
  availability: Availability
  minimumOrderQuantity: number
  brand?: string
  category: CategoryRef
  images: ProductImage[]
  thumbnail: ProductImage
  tags: string[]
  createdAt: string
}

export interface ProductReview {
  rating: number
  comment: string
  date: string
  author: string
}

export interface ProductDimensions {
  width: number
  height: number
  depth: number
}

/** Full product page payload. */
export interface ProductDetail extends Product {
  sku: string
  weight: number
  dimensions: ProductDimensions
  warranty: string
  shipping: string
  returnPolicy: string
  reviews: ProductReview[]
}

export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  pageCount: number
}
