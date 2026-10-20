import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import SharedPrice from '~/components/shared/SharedPrice.vue'
import { sampleProducts } from '~/design/showcase-products'
import ProductCard from '~/features/catalog/components/ProductCard.vue'

const [plain, onSale, lowStock, soldOut] = sampleProducts as [
  (typeof sampleProducts)[0],
  (typeof sampleProducts)[0],
  (typeof sampleProducts)[0],
  (typeof sampleProducts)[0],
]
const normalise = (value: string) => value.replace(/\s+/g, ' ').trim()

describe('SharedPrice', () => {
  it('shows the struck-through list price only on sale, in terracotta', async () => {
    const wrapper = await mountSuspended(SharedPrice, {
      props: {
        price: onSale.price,
        compareAt: onSale.compareAtPrice,
        discountPercent: 22,
        showPercent: true,
      },
    })
    expect(normalise(wrapper.get('s').text())).toContain('46,00 €')
    expect(wrapper.find('.text-accent-text').exists()).toBe(true)
    expect(normalise(wrapper.text())).toContain('−22 %')
  })

  it('stays in ink without a discount', async () => {
    const wrapper = await mountSuspended(SharedPrice, { props: { price: plain.price } })
    expect(wrapper.find('s').exists()).toBe(false)
    expect(normalise(wrapper.text())).toBe('91,99 €')
  })
})

describe('ProductCard', () => {
  it('links the whole card to the product page', async () => {
    const wrapper = await mountSuspended(ProductCard, { props: { product: plain } })
    expect(wrapper.get('h3 a').attributes('href')).toBe('/products/99-amazon-echo-plus')
    expect(wrapper.text()).toContain('Amazon')
  })

  it('shows one badge by priority: discount, then sold out, then low stock', async () => {
    const sale = await mountSuspended(ProductCard, { props: { product: onSale } })
    expect(normalise(sale.text())).toContain('−22 %')

    const low = await mountSuspended(ProductCard, { props: { product: lowStock } })
    expect(low.text()).toContain('Stock faible')

    const out = await mountSuspended(ProductCard, { props: { product: soldOut } })
    expect(out.text()).toContain('Épuisé')
  })

  it('emits add and toggle-favorite with the product', async () => {
    const wrapper = await mountSuspended(ProductCard, { props: { product: plain } })
    await wrapper.get('button[aria-label="Ajouter aux favoris"]').trigger('click')
    await wrapper.get('button:not([aria-label])').trigger('click')

    expect(wrapper.emitted('toggle-favorite')?.[0]).toEqual([plain])
    expect(wrapper.emitted('add')?.[0]).toEqual([plain])
  })

  it('reflects favourite and just-added states', async () => {
    const wrapper = await mountSuspended(ProductCard, {
      props: { product: plain, isFavorite: true, justAdded: true },
    })
    const favorite = wrapper.get('button[aria-pressed]')
    expect(favorite.attributes('aria-pressed')).toBe('true')
    expect(favorite.attributes('aria-label')).toBe('Retirer des favoris')
    expect(wrapper.text()).toContain('Ajouté ✓')
  })

  it('disables « add » when the product is sold out', async () => {
    const wrapper = await mountSuspended(ProductCard, { props: { product: soldOut } })
    expect(wrapper.get('button:not([aria-label])').attributes('disabled')).toBeDefined()
  })
})
