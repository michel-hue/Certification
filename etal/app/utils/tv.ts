import { createTV } from 'tailwind-variants'

/**
 * tailwind-merge cannot tell Étal's custom text sizes (`text-ui`, `text-meta`…) from
 * colours and would drop one of them, so variants are concatenated without merging.
 */
export const tv = createTV({ twMerge: false })

export type { VariantProps } from 'tailwind-variants'
