import type { Money } from '#shared/types/money'
import { formatPrice } from '#shared/utils/money'

/** Formats prices in the active locale (`12,40 €` in French, `€12.40` in English). */
export function usePrice() {
  const { localeProperties } = useI18n()
  return {
    format: (money: Money) => formatPrice(money, localeProperties.value.language ?? 'fr-FR'),
  }
}
