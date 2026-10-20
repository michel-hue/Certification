import { describe, expect, it } from 'vitest'
import { passwordScore } from '#shared/utils/password'
import { pageItems } from '../../app/utils/pagination'

describe('pageItems', () => {
  it('lists every page when there are few', () => {
    expect(pageItems(2, 3)).toEqual([1, 2, 3])
  })

  it('keeps first, last and neighbours, collapsing the rest into gaps', () => {
    expect(pageItems(8, 17)).toEqual([1, 'gap', 7, 8, 9, 'gap', 17])
  })

  it('does not add a gap next to the first or last page', () => {
    expect(pageItems(1, 17)).toEqual([1, 2, 'gap', 17])
    expect(pageItems(17, 17)).toEqual([1, 'gap', 16, 17])
    expect(pageItems(3, 17)).toEqual([1, 2, 3, 4, 'gap', 17])
  })

  it('handles a single page', () => {
    expect(pageItems(1, 1)).toEqual([1])
  })
})

describe('passwordScore', () => {
  it.each([
    ['', 0],
    ['abc', 0],
    ['abcdefgh', 1],
    ['Abcdefgh', 2],
    ['Abcdefg1', 3],
    ['Abcdef1!', 4],
    ['emilyspass', 1],
  ])('%j scores %i', (password, score) => {
    expect(passwordScore(password)).toBe(score)
  })
})
