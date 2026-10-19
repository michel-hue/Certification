import { z } from 'zod'

/** Messages are i18n keys, resolved by the forms. */
const decimal = (message: string) =>
  z
    .string()
    .trim()
    .transform((value) => value.replace(',', '.'))
    .pipe(z.string().regex(/^\d+(\.\d{1,2})?$/, message))
    .transform(Number)

/**
 * Back-office product form (E19). Amounts are typed as text, in major units of the display
 * currency; `price` is the list price, the discount applies on top of it (DummyJSON model).
 */
export const productFormSchema = z.object({
  title: z.string().trim().min(1, 'admin.products.errors.title').max(120, 'forms.tooLong'),
  brand: z.string().trim().max(60, 'forms.tooLong'),
  category: z.string().regex(/^[a-z0-9-]+$/, 'forms.required'),
  description: z.string().trim().max(400, 'forms.tooLong'),
  price: decimal('admin.products.errors.price').refine((value) => value > 0, 'admin.products.errors.price'),
  discountPercent: decimal('admin.products.errors.discount').refine(
    (value) => value <= 90,
    'admin.products.errors.discount',
  ),
  stock: z
    .string()
    .trim()
    .regex(/^\d{1,6}$/, 'admin.products.errors.stock')
    .transform(Number),
  thumbnail: z.url({ protocol: /^https?$/, error: 'admin.products.errors.image' }),
})
export type ProductFormInput = z.input<typeof productFormSchema>
export type ProductFormValues = z.output<typeof productFormSchema>

/** Body of the back-office write routes, as sent to DummyJSON (USD prices). */
export const productWriteSchema = z.object({
  title: z.string().trim().min(1).max(120),
  brand: z.string().trim().max(60).optional(),
  category: z.string().regex(/^[a-z0-9-]+$/),
  description: z.string().trim().max(400),
  price: z.number().positive().max(1_000_000),
  discountPercentage: z.number().min(0).max(90),
  stock: z.number().int().min(0).max(999_999),
  thumbnail: z.url({ protocol: /^https?$/ }),
})
export type ProductWrite = z.infer<typeof productWriteSchema>

export const userRoleSchema = z.object({ role: z.enum(['customer', 'admin']) })

export const adminIdParamSchema = z.object({ id: z.coerce.number().int().positive() })
