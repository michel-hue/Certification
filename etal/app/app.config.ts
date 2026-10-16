import type { CurrencyCode } from '#shared/types/money'

export default defineAppConfig({
  /** Display currency for every price (CDC §14.6). Switch to 'XOF' for FCFA. */
  currency: 'EUR' as CurrencyCode,

  /** Fictitious commercial rules from the full mockup, in euros (converted for XOF). */
  checkout: {
    freeShippingFromEur: 50,
    promo: { code: 'PORTFOLIO10', percent: 10 },
    /** Express is never free; the other methods are once the threshold is reached. */
    shippingEur: { standard: 4.9, relay: 2.9, express: 9.9 },
  },

  /**
   * Editorial « rubriques » (full app mockup): each groups several DummyJSON categories.
   * Listing URL: `/products?g=<id>`; a single category keeps `/categories/<slug>`.
   */
  sections: [
    { id: 'beaute', num: '01', categories: ['beauty', 'fragrances', 'skin-care'] },
    {
      id: 'mode',
      num: '02',
      categories: [
        'womens-dresses',
        'tops',
        'mens-shirts',
        'womens-shoes',
        'mens-shoes',
        'womens-bags',
        'womens-jewellery',
        'sunglasses',
        'womens-watches',
        'mens-watches',
      ],
    },
    {
      id: 'maison',
      num: '03',
      categories: ['furniture', 'home-decoration', 'kitchen-accessories', 'groceries'],
    },
    { id: 'tech', num: '04', categories: ['laptops', 'smartphones', 'tablets', 'mobile-accessories'] },
    { id: 'loisirs', num: '05', categories: ['sports-accessories', 'motorcycle', 'vehicle'] },
  ],
})
