/**
 * Cart line actions with the mockup's safety net: removing a line shows a toast with
 * « Annuler », which puts the line back where it was (CDC §8.7).
 */
export function useCartLines() {
  const cart = useCartStore()
  const toast = useToast()
  const { t } = useI18n()

  function remove(productId: number) {
    const removed = cart.remove(productId)
    if (!removed) return
    toast.info(t('cart.removed', { title: removed.item.title }), {
      label: t('cart.undo'),
      altText: t('cart.undoAlt', { title: removed.item.title }),
      run: () => cart.restore(removed),
    })
  }

  return {
    remove,
    setQuantity: (productId: number, quantity: number) => cart.updateQuantity(productId, quantity),
  }
}
