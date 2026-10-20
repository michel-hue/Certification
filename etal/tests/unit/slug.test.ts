import { describe, expect, it } from 'vitest'
import { parseProductParam, slugify, toProductParam } from '#shared/utils/slug'

describe('slugify', () => {
  it.each([
    ['Rolex Cellini Date Black Dial', 'rolex-cellini-date-black-dial'],
    ['Crème brûlée & Café', 'creme-brulee-cafe'],
    ['  --Apple   iPhone 13 Pro!  ', 'apple-iphone-13-pro'],
    ['', ''],
  ])('slugify(%j) → %j', (input, expected) => {
    expect(slugify(input)).toBe(expected)
  })
})

describe('product route param', () => {
  it('round-trips the id', () => {
    const param = toProductParam({ id: 42, slug: 'water' })
    expect(param).toBe('42-water')
    expect(parseProductParam(param)).toBe(42)
  })

  it('accepts a bare id and ignores a stale slug', () => {
    expect(parseProductParam('42')).toBe(42)
    expect(parseProductParam('42-old-title')).toBe(42)
  })

  it.each(['', 'water', '0-water', '-1', '4x2', '99999999999999999999'])('rejects %j', (param) => {
    expect(parseProductParam(param)).toBeNull()
  })
})
