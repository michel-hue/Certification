import { describe, expect, it } from 'vitest'
import type { Product } from '#shared/types/catalog'
import { buildRobots, buildSitemap, sitemapPaths, STATIC_PATHS } from '../../server/seo/sitemap'
import { sampleProducts } from '../../app/design/showcase-products'

const products: Product[] = sampleProducts.slice(0, 2)

describe('sitemap', () => {
  it('lists static pages, each category once and every product', () => {
    const paths = sitemapPaths(products)
    expect(paths.slice(0, STATIC_PATHS.length)).toEqual([...STATIC_PATHS])
    expect(paths).toContain(`/products/${products[0]!.id}-${products[0]!.slug}`)
    const categories = paths.filter((path) => path.startsWith('/categories/'))
    expect(new Set(categories).size).toBe(categories.length)
    expect(paths).not.toContain('/admin')
  })

  it('writes one url per locale with hreflang alternates and escapes XML', () => {
    const xml = buildSitemap('https://etal.test/', ['/', '/products?a=1&b=2'])
    expect(xml).toContain('<loc>https://etal.test/</loc>')
    expect(xml).toContain('<loc>https://etal.test/en</loc>')
    expect(xml).toContain('hreflang="en-US" href="https://etal.test/en/products?a=1&amp;b=2"')
    expect(xml).toContain('hreflang="x-default" href="https://etal.test/"')
    expect(xml.match(/<url>/g)).toHaveLength(4)
  })
})

describe('robots.txt', () => {
  it('keeps private areas out in both locales and points to the sitemap', () => {
    const robots = buildRobots('https://etal.test/')
    expect(robots).toContain('Disallow: /admin')
    expect(robots).toContain('Disallow: /en/account')
    expect(robots).toContain('Sitemap: https://etal.test/sitemap.xml')
  })
})
