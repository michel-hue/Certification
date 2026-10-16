import { z } from 'zod'

/*
 * Raw DummyJSON payloads. Only the fields Étal maps are declared; Zod drops the rest,
 * so an unexpected API change fails here instead of deep inside a component.
 */

export const dummyReviewSchema = z.object({
  rating: z.number(),
  comment: z.string(),
  date: z.string(),
  reviewerName: z.string(),
})

export const dummyProductSchema = z.object({
  id: z.number().int(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  price: z.number().nonnegative(),
  discountPercentage: z.number().min(0).max(100).default(0),
  rating: z.number().min(0).max(5),
  stock: z.number().int().nonnegative(),
  tags: z.array(z.string()).default([]),
  brand: z.string().optional(),
  sku: z.string().default(''),
  weight: z.number().default(0),
  dimensions: z
    .object({ width: z.number(), height: z.number(), depth: z.number() })
    .default({ width: 0, height: 0, depth: 0 }),
  warrantyInformation: z.string().default(''),
  shippingInformation: z.string().default(''),
  returnPolicy: z.string().default(''),
  minimumOrderQuantity: z.number().int().positive().default(1),
  reviews: z.array(dummyReviewSchema).default([]),
  meta: z.object({ createdAt: z.string() }).optional(),
  images: z.array(z.url()).default([]),
  thumbnail: z.url(),
})

export const dummyProductListSchema = z.object({
  products: z.array(dummyProductSchema),
  total: z.number().int().nonnegative(),
  skip: z.number().int().nonnegative(),
  limit: z.number().int().nonnegative(),
})

export const dummyCategorySchema = z.object({
  slug: z.string(),
  name: z.string(),
})

export const dummyCategoryListSchema = z.array(dummyCategorySchema)

export const dummyUserSchema = z.object({
  id: z.number().int(),
  username: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  image: z.string().optional(),
  role: z.string().optional(),
  phone: z.string().optional(),
  address: z
    .object({
      address: z.string(),
      city: z.string(),
      postalCode: z.string(),
      country: z.string(),
    })
    .optional(),
})

export const dummyCartSchema = z.object({
  id: z.number().int(),
  userId: z.number().int(),
  products: z.array(
    z.object({
      id: z.number().int(),
      title: z.string(),
      price: z.number(),
      quantity: z.number().int().positive(),
      discountedTotal: z.number(),
      thumbnail: z.url(),
    }),
  ),
  total: z.number(),
  discountedTotal: z.number(),
  totalQuantity: z.number().int(),
})

export type DummyProduct = z.infer<typeof dummyProductSchema>
export type DummyProductList = z.infer<typeof dummyProductListSchema>
export type DummyCategory = z.infer<typeof dummyCategorySchema>
export type DummyUser = z.infer<typeof dummyUserSchema>
export type DummyCart = z.infer<typeof dummyCartSchema>
