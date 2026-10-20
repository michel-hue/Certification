import { describe, expect, it } from 'vitest'
import { useToast } from '~/composables/useToast'

describe('useToast', () => {
  it('queues toasts and keeps at most three on screen', () => {
    const toast = useToast()
    for (const message of ['1', '2', '3', '4']) toast.success(message)

    expect(toast.toasts.value.map((item) => item.message)).toEqual(['2', '3', '4'])
  })

  it('carries kind and action, and dismisses by id', () => {
    const toast = useToast()
    const run = () => {}
    const id = toast.info('Article retiré.', { label: 'Annuler', altText: 'Annuler le retrait', run })

    const queued = toast.toasts.value.find((item) => item.id === id)
    expect(queued).toMatchObject({ kind: 'info', action: { label: 'Annuler' } })

    toast.dismiss(id)
    expect(toast.toasts.value.some((item) => item.id === id)).toBe(false)
  })
})
