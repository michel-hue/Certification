import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import AppLogo from '~/components/layout/AppLogo.vue'

describe('AppLogo', () => {
  it('links home with an accessible name, the drawn accent being decorative', async () => {
    const wrapper = await mountSuspended(AppLogo, { props: { label: 'Étal — accueil' } })
    const link = wrapper.get('a')

    expect(link.attributes('href')).toBe('/')
    expect(link.attributes('aria-label')).toBe('Étal — accueil')
    expect(link.findAll('[aria-hidden="true"]')).toHaveLength(2)
  })

  it('uses the evening mark colour on the dark footer', async () => {
    const wrapper = await mountSuspended(AppLogo, { props: { label: 'Étal', inverse: true } })
    expect(wrapper.find('.bg-inverse-mark').exists()).toBe(true)
  })
})
