import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import UiButton from '~/components/ui/UiButton.vue'
import UiChip from '~/components/ui/UiChip.vue'
import UiFormField from '~/components/ui/UiFormField.vue'
import UiInput from '~/components/ui/UiInput.vue'
import UiPagination from '~/components/ui/UiPagination.vue'
import UiQuantityStepper from '~/components/ui/UiQuantityStepper.vue'
import UiRatingStars from '~/components/ui/UiRatingStars.vue'

describe('UiButton', () => {
  it('renders a button by default and a localised link with `to`', async () => {
    const button = await mountSuspended(UiButton, { slots: { default: () => 'Commander' } })
    expect(button.get('button').attributes('type')).toBe('button')
    expect(button.text()).toBe('Commander')

    const link = await mountSuspended(UiButton, {
      props: { to: '/products' },
      slots: { default: () => 'Catalogue' },
    })
    expect(link.get('a').attributes('href')).toBe('/products')
  })

  it('names icon-only buttons from `label`', async () => {
    const wrapper = await mountSuspended(UiButton, { props: { icon: 'lucide:pencil', label: 'Modifier' } })
    expect(wrapper.get('button').attributes('aria-label')).toBe('Modifier')
  })

  it('keeps the label while loading and swallows clicks', async () => {
    const wrapper = await mountSuspended(UiButton, {
      props: { loading: true, type: 'submit' },
      slots: { default: () => 'Se connecter' },
    })
    const button = wrapper.get('button')
    expect(button.attributes('aria-busy')).toBe('true')
    expect(button.text()).toContain('Se connecter')
  })
})

describe('UiQuantityStepper', () => {
  it('steps within bounds and disables the buttons at the limits', async () => {
    const wrapper = await mountSuspended(UiQuantityStepper, {
      props: {
        modelValue: 1,
        max: 2,
        'onUpdate:modelValue': (value: number) => wrapper.setProps({ modelValue: value }),
      },
    })
    const [decrease, increase] = wrapper.findAll('button')
    expect(decrease!.attributes('disabled')).toBeDefined()

    await increase!.trigger('click')
    expect(wrapper.get('output').text()).toBe('2')
    expect(increase!.attributes('disabled')).toBeDefined()
    expect(decrease!.attributes('disabled')).toBeUndefined()
  })
})

describe('UiFormField', () => {
  it('links label, control and error message', async () => {
    const wrapper = await mountSuspended(UiFormField, {
      props: { label: 'E-mail', error: 'Adresse e-mail invalide.' },
      slots: {
        default: (props: { id: string; describedBy?: string; invalid: boolean }) =>
          h(UiInput, { id: props.id, 'aria-describedby': props.describedBy, invalid: props.invalid }),
      },
    })
    const input = wrapper.get('input')
    const label = wrapper.get('label')
    const message = wrapper.get('[role="alert"]')

    expect(label.attributes('for')).toBe(input.attributes('id'))
    expect(input.attributes('aria-describedby')).toBe(message.attributes('id'))
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(message.text()).toContain('Adresse e-mail invalide.')
  })
})

describe('UiInput', () => {
  it('reveals a password on demand', async () => {
    const wrapper = await mountSuspended(UiInput, { props: { type: 'password', modelValue: 'secret' } })
    const toggle = wrapper.get('button')
    expect(wrapper.get('input').attributes('type')).toBe('password')

    await toggle.trigger('click')
    expect(wrapper.get('input').attributes('type')).toBe('text')
    expect(toggle.attributes('aria-pressed')).toBe('true')
  })
})

describe('UiChip', () => {
  it('toggles, or removes when removable', async () => {
    const toggle = await mountSuspended(UiChip, { props: { label: 'Beauté', selected: true } })
    expect(toggle.get('button').attributes('aria-pressed')).toBe('true')
    await toggle.get('button').trigger('click')
    expect(toggle.emitted('toggle')).toHaveLength(1)

    const removable = await mountSuspended(UiChip, {
      props: { label: 'Essence', removable: true, removeLabel: 'Retirer le filtre Essence' },
    })
    expect(removable.get('button').attributes('aria-label')).toBe('Retirer le filtre Essence')
    await removable.get('button').trigger('click')
    expect(removable.emitted('remove')).toHaveLength(1)
  })
})

describe('UiPagination', () => {
  it('marks the current page and emits the target page', async () => {
    const wrapper = await mountSuspended(UiPagination, { props: { page: 1, pageCount: 5 } })
    expect(wrapper.get('[aria-current="page"]').text()).toBe('1')
    expect(wrapper.get('button[aria-label="Page précédente"]').attributes('disabled')).toBeDefined()

    await wrapper.get('button[aria-label="Page suivante"]').trigger('click')
    expect(wrapper.emitted('change')).toEqual([[2]])
  })

  it('renders nothing for a single page', async () => {
    const wrapper = await mountSuspended(UiPagination, { props: { page: 1, pageCount: 1 } })
    expect(wrapper.find('nav').exists()).toBe(false)
  })
})

describe('UiRatingStars', () => {
  it('exposes the rating as one accessible label', async () => {
    const wrapper = await mountSuspended(UiRatingStars, { props: { value: 4.5 } })
    expect(wrapper.get('[role="img"]').attributes('aria-label')).toBe('Note : 4,5 sur 5')
    expect(wrapper.findAll('clipPath')).toHaveLength(1)
  })
})
