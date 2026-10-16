import { describe, expect, it } from 'vitest'
import { parseProductListQuery, productListQuerySchema } from '#shared/schemas/catalog'
import type { Product, Section } from '#shared/types/catalog'
import { MAX_BRAND_FACETS, queryCatalog } from '../../server/catalog/query'

const sections: Section[] = [
  { id: 'beaute', categories: ['beauty', 'fragrances'] },
  { id: 'tech', categories: ['laptops'] },
]

let nextId = 1
function product(overrides: Partial<Product> & { category: string; price?: number }): Product {
  const id = nextId++
  const { category, price = 10, ...rest } = overrides
  return {
    id,
    slug: `p-${id}`,
    title: `Product ${id}`,
    description: '',
    price: { amount: price * 100, currency: 'EUR' },
    rating: { average: 4, count: 1 },
    stock: 20,
    availability: 'in_stock',
    minimumOrderQuantity: 1,
    category: { slug: category, name: category },
    images: [],
    thumbnail: { src: '', alt: '' },
    tags: [],
    createdAt: `2026-01-${String(id).padStart(2, '0')}T00:00:00.000Z`,
    ...rest,
  }
}

const catalog = [
  product({
    category: 'beauty',
    title: 'Essence Mascara',
    brand: 'Essence',
    price: 9,
    rating: { average: 2.5, count: 3 },
  }),
  product({ category: 'beauty', title: 'Red Lipstick', brand: 'Chic', price: 13, discountPercent: 20 }),
  product({
    category: 'fragrances',
    title: 'CK One',
    brand: 'Calvin Klein',
    price: 46,
    rating: { average: 4.8, count: 2 },
  }),
  product({
    category: 'laptops',
    title: 'MacBook Pro',
    brand: 'Apple',
    price: 1800,
    stock: 0,
    availability: 'out_of_stock',
  }),
  product({ category: 'groceries', title: 'Kiwi', price: 2, tags: ['fruit'] }),
]

const run = (input: Record<string, unknown>) =>
  queryCatalog(catalog, productListQuerySchema.parse(input), sections)
const titles = (input: Record<string, unknown>) => run(input).items.map((item) => item.title)

describe('queryCatalog filters', () => {
  it('returns everything in API order by default', () => {
    expect(run({}).total).toBe(5)
    expect(titles({})[0]).toBe('Essence Mascara')
  })

  it('narrows to a rubrique, then a category', () => {
    expect(titles({ g: 'beaute' })).toEqual(['Essence Mascara', 'Red Lipstick', 'CK One'])
    expect(titles({ g: 'beaute', category: 'fragrances' })).toEqual(['CK One'])
  })

  it('searches title, brand, category and tags, case-insensitively', () => {
    expect(titles({ q: 'MASCARA' })).toEqual(['Essence Mascara'])
    expect(titles({ q: 'calvin' })).toEqual(['CK One'])
    expect(titles({ q: 'fruit' })).toEqual(['Kiwi'])
  })

  it('combines brand, price, rating, stock and promo filters', () => {
    expect(titles({ brands: 'Essence,Chic' })).toEqual(['Essence Mascara', 'Red Lipstick'])
    expect(titles({ min: '10', max: '50' })).toEqual(['Red Lipstick', 'CK One'])
    expect(titles({ rating: '4.5' })).toEqual(['CK One'])
    expect(titles({ g: 'tech', stock: '1' })).toEqual([])
    expect(titles({ promo: '1' })).toEqual(['Red Lipstick'])
  })

  it('leaves out an excluded product', () => {
    expect(titles({ g: 'beaute', exclude: String(catalog[0]!.id) })).not.toContain('Essence Mascara')
  })
})

describe('queryCatalog sorting and paging', () => {
  it.each([
    ['price-asc', 'Kiwi'],
    ['price-desc', 'MacBook Pro'],
    ['rating', 'CK One'],
    ['newest', 'Kiwi'],
    ['discount', 'Red Lipstick'],
  ])('sort %s puts %s first', (sort, first) => {
    expect(titles({ sort })[0]).toBe(first)
  })

  it('paginates and clamps an out-of-range page to the last one', () => {
    expect(run({ pageSize: '2', page: '2' })).toMatchObject({ page: 2, pageCount: 3, total: 5 })
    expect(run({ pageSize: '2', page: '9' }).page).toBe(3)
    expect(run({ pageSize: '2', page: '9' }).items).toHaveLength(1)
  })
})

describe('queryCatalog facets', () => {
  it('counts every rubrique over the whole catalogue', () => {
    expect(run({ q: 'kiwi' }).facets.sectionCounts).toEqual({ beaute: 3, tech: 1 })
  })

  it('infers the rubrique from a category and counts its categories within the term', () => {
    const { facets } = run({ category: 'beauty' })
    expect(facets.categories).toEqual([
      { slug: 'beauty', count: 2 },
      { slug: 'fragrances', count: 1 },
    ])
    expect(facets.sectionTotal).toBe(3)
  })

  it('keeps every brand listed while one is selected', () => {
    expect(run({ g: 'beaute', brands: 'Chic' }).facets.brands).toEqual(['Calvin Klein', 'Chic', 'Essence'])
  })

  it('reports how many products match the term alone', () => {
    expect(run({ q: 'o', promo: '1' }).facets.termTotal).toBe(run({ q: 'o' }).total)
  })

  it('caps the brand list', () => {
    const many = Array.from({ length: MAX_BRAND_FACETS + 5 }, (_, index) =>
      product({ category: 'beauty', brand: `Brand ${String(index).padStart(2, '0')}` }),
    )
    const result = queryCatalog(many, productListQuerySchema.parse({}), sections)
    expect(result.facets.brands).toHaveLength(MAX_BRAND_FACETS)
  })
})

describe('parseProductListQuery', () => {
  it('reads a shared URL, arrays included', () => {
    expect(
      parseProductListQuery({ g: 'maison', brands: 'Ikea,Essence', page: '2', stock: '1' }),
    ).toMatchObject({
      g: 'maison',
      brands: ['Ikea', 'Essence'],
      page: 2,
      stock: true,
    })
  })

  it('drops invalid parameters instead of failing the page', () => {
    expect(parseProductListQuery({ sort: 'cheapest', page: '-3', g: 'tech' })).toEqual({
      page: 1,
      pageSize: 12,
      sort: 'relevance',
      g: 'tech',
    })
  })

  it('ignores empty values and keeps the first of repeated ones', () => {
    expect(parseProductListQuery({ q: '', category: ['beauty', 'laptops'] })).toMatchObject({
      category: 'beauty',
    })
  })
})
