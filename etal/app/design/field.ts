import { tv } from '~/utils/tv'

/** Text-like controls share one look: 16px text (no iOS zoom), hairline border, red when invalid. */
export const fieldVariants = tv({
  base: 'w-full rounded-md border bg-surface text-body text-foreground transition-colors duration-150 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50',
  variants: {
    size: {
      md: 'h-12 px-3.5',
      sm: 'h-11 px-3 text-body-sm',
    },
    invalid: {
      true: 'border-danger',
      false: 'border-border-strong hover:border-foreground',
    },
  },
  defaultVariants: { size: 'md', invalid: false },
})
