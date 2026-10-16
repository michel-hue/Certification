import type { Product } from '#shared/types/catalog'

const img = (category: string, slug: string, file = 'thumbnail.webp') =>
  `https://cdn.dummyjson.com/product-images/${category}/${slug}/${file}`

const base = {
  description: '',
  rating: { average: 4.6, count: 3 },
  stock: 40,
  availability: 'in_stock',
  minimumOrderQuantity: 1,
  tags: [],
  createdAt: '2026-08-30T00:00:00.000Z',
} satisfies Partial<Product>

/** Fixed products covering every card state, so the showcase never depends on the API. */
export const sampleProducts: Product[] = [
  {
    ...base,
    id: 99,
    slug: 'amazon-echo-plus',
    title: 'Amazon Echo Plus',
    brand: 'Amazon',
    category: { slug: 'mobile-accessories', name: 'Mobile accessories' },
    price: { amount: 9199, currency: 'EUR' },
    rating: { average: 4.99, count: 3 },
    thumbnail: { src: img('mobile-accessories', 'amazon-echo-plus'), alt: 'Amazon Echo Plus' },
    images: [
      { src: img('mobile-accessories', 'amazon-echo-plus', '1.webp'), alt: 'Amazon Echo Plus' },
      { src: img('mobile-accessories', 'amazon-echo-plus', '2.webp'), alt: 'Amazon Echo Plus' },
    ],
  },
  {
    ...base,
    id: 6,
    slug: 'calvin-klein-ck-one',
    title: 'Calvin Klein CK One',
    brand: 'Calvin Klein',
    category: { slug: 'fragrances', name: 'Fragrances' },
    price: { amount: 3586, currency: 'EUR' },
    compareAtPrice: { amount: 4600, currency: 'EUR' },
    discountPercent: 22,
    thumbnail: { src: img('fragrances', 'calvin-klein-ck-one'), alt: 'Calvin Klein CK One' },
    images: [{ src: img('fragrances', 'calvin-klein-ck-one', '1.webp'), alt: 'Calvin Klein CK One' }],
  },
  {
    ...base,
    id: 95,
    slug: 'rolex-cellini-date-black-dial',
    title: 'Rolex Cellini Date Black Dial, un titre volontairement long pour tester la troncature',
    brand: 'Rolex',
    category: { slug: 'mens-watches', name: 'Mens watches' },
    price: { amount: 1_234_500, currency: 'EUR' },
    stock: 4,
    availability: 'low_stock',
    thumbnail: { src: img('mens-watches', 'rolex-cellini-date-black-dial'), alt: 'Rolex Cellini Date' },
    images: [
      { src: img('mens-watches', 'rolex-cellini-date-black-dial', '1.webp'), alt: 'Rolex Cellini Date' },
    ],
  },
  {
    ...base,
    id: 42,
    slug: 'water',
    title: 'Water',
    category: { slug: 'groceries', name: 'Groceries' },
    price: { amount: 91, currency: 'EUR' },
    rating: { average: 0, count: 0 },
    stock: 0,
    availability: 'out_of_stock',
    thumbnail: {
      src: 'https://cdn.dummyjson.com/product-images/groceries/missing/thumbnail.webp',
      alt: 'Water',
    },
    images: [],
  },
]
