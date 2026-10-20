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

/** An editorial rubrique and the DummyJSON categories it groups. */
export interface Section {
  id: string
  categories: readonly string[]
}

/** What the filter panel needs to describe the current result set. */
export interface CatalogFacets {
  /** Products per rubrique over the whole catalogue (home tiles). */
  sectionCounts: Record<string, number>
  /** Matches of the search term alone, before any other filter. */
  termTotal: number
  /** Products of the selected rubrique, within the search term. */
  sectionTotal: number
  /** Categories of the selected rubrique, counted within the search term. */
  categories: { slug: string; count: number }[]
  /** Brands available before the brand filter itself is applied. */
  brands: string[]
}

export interface CatalogPage extends Paginated<Product> {
  facets: CatalogFacets
}

export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  pageCount: number
}
