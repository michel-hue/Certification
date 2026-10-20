import type { Product } from '#shared/types/catalog'
import { toProductParam } from '#shared/utils/slug'

/** French is unprefixed, English lives under /en (i18n `prefix_except_default`). */
const LOCALES = [
  { code: 'fr', hreflang: 'fr-FR', prefix: '' },
  { code: 'en', hreflang: 'en-US', prefix: '/en' },
] as const

/** Public, indexable pages; account, checkout and back office stay out (CDC §14.4). */
export const STATIC_PATHS = ['/', '/products', '/about', '/faq', '/legal'] as const

const escapeXml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const localized = (siteUrl: string, prefix: string, path: string) =>
  `${siteUrl}${prefix}${path === '/' && prefix ? '' : path}`

/** Every public path: static pages, one per category, one per product. */
export function sitemapPaths(products: readonly Product[]): string[] {
  const categories = [...new Set(products.map((product) => product.category.slug))].sort()
  return [
    ...STATIC_PATHS,
    ...categories.map((slug) => `/categories/${slug}`),
    ...products.map((product) => `/products/${toProductParam(product)}`),
  ]
}

/** One `<url>` per path and locale, each listing its alternates (Google's hreflang format). */
export function buildSitemap(siteUrl: string, paths: readonly string[]): string {
  const base = siteUrl.replace(/\/$/, '')
  const urls = paths.flatMap((path) => {
    const alternates = LOCALES.map(
      (locale) =>
        `    <xhtml:link rel="alternate" hreflang="${locale.hreflang}" href="${escapeXml(localized(base, locale.prefix, path))}"/>`,
    )
    const fallback = `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(localized(base, '', path))}"/>`
    return LOCALES.map((locale) =>
      [
        '  <url>',
        `    <loc>${escapeXml(localized(base, locale.prefix, path))}</loc>`,
        ...alternates,
        fallback,
        '  </url>',
      ].join('\n'),
    )
  })
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n')
}

export function buildRobots(siteUrl: string): string {
  const disallowed = ['/admin', '/account', '/checkout', '/cart', '/wishlist', '/search']
  return [
    'User-agent: *',
    ...disallowed.flatMap((path) => [`Disallow: ${path}`, `Disallow: /en${path}`]),
    '',
    `Sitemap: ${siteUrl.replace(/\/$/, '')}/sitemap.xml`,
    '',
  ].join('\n')
}
