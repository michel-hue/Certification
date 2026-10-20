import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { sampleProducts } from '~/design/showcase-products'
import { useCartStore } from '~/stores/cart'
import { useWishlistStore } from '~/stores/wishlist'

const [echo, perfume, rolex, soldOut] = sampleProducts as [
  (typeof sampleProducts)[0],
  (typeof sampleProducts)[0],
  (typeof sampleProducts)[0],
  (typeof sampleProducts)[0],
]

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('cart store', () => {
  it('adds a product, then merges quantities on the same line', () => {
    const cart = useCartStore()
    expect(cart.add(echo, 2)).toBe(2)
    expect(cart.add(echo)).toBe(1)

    expect(cart.items).toHaveLength(1)
    expect(cart.items[0]).toMatchObject({ productId: echo.id, quantity: 3, eyebrow: 'Amazon' })
    expect(cart.itemCount).toBe(3)
    expect(cart.isEmpty).toBe(false)
  })

  it('never exceeds the stock and ignores sold-out products', () => {
    const cart = useCartStore()
    expect(cart.add(rolex, 10)).toBe(4)
    expect(cart.add(rolex)).toBe(0)
    expect(cart.add(soldOut)).toBe(0)
    expect(cart.itemCount).toBe(4)
  })

  it('updates quantities within [1, stock]', () => {
    const cart = useCartStore()
    cart.add(rolex)
    cart.updateQuantity(rolex.id, 99)
    expect(cart.items[0]!.quantity).toBe(4)
    cart.updateQuantity(rolex.id, 0)
    expect(cart.items[0]!.quantity).toBe(1)
  })

  it('removes a line and restores it at its place (« Annuler »)', () => {
    const cart = useCartStore()
    cart.add(echo)
    cart.add(perfume)
    cart.add(rolex)

    const removed = cart.remove(perfume.id)
    expect(cart.items.map((item) => item.productId)).toEqual([echo.id, rolex.id])

    cart.restore(removed!)
    expect(cart.items.map((item) => item.productId)).toEqual([echo.id, perfume.id, rolex.id])
    expect(cart.remove(12345)).toBeUndefined()
  })

  it('applies the promo code and clears everything', () => {
    const cart = useCartStore()
    cart.add(perfume, 2)
    expect(cart.applyPromo('nope')).toBe(false)
    expect(cart.applyPromo('portfolio10')).toBe(true)
    expect(cart.totals.discount.amount).toBe(Math.round((perfume.price.amount * 2) / 10))

    cart.clear()
    expect(cart.isEmpty).toBe(true)
    expect(cart.promoApplied).toBe(false)
  })
})

describe('wishlist store', () => {
  it('toggles favourites and reports membership', () => {
    const wishlist = useWishlistStore()
    expect(wishlist.toggle(echo)).toBe(true)
    expect(wishlist.has(echo.id)).toBe(true)
    expect(wishlist.count).toBe(1)

    expect(wishlist.toggle(echo)).toBe(false)
    expect(wishlist.has(echo.id)).toBe(false)
  })

  it('removes by id', () => {
    const wishlist = useWishlistStore()
    wishlist.toggle(echo)
    wishlist.toggle(perfume)
    wishlist.remove(echo.id)
    expect(wishlist.products.map((product) => product.id)).toEqual([perfume.id])
  })
})
