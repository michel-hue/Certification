import { tv, type VariantProps } from '~/utils/tv'

/** Shared by UiButton and anything that must look like a button (e.g. a NuxtLink CTA). */
export const buttonVariants = tv({
  base: 'inline-flex shrink-0 cursor-pointer items-center justify-center gap-2.5 rounded-md font-medium whitespace-nowrap transition-[opacity,background-color,border-color,color] duration-150 ease-standard disabled:cursor-not-allowed disabled:opacity-40 aria-disabled:cursor-not-allowed aria-disabled:opacity-40',
  variants: {
    variant: {
      primary: 'bg-primary text-primary-foreground hover:opacity-88',
      accent: 'bg-accent text-accent-foreground hover:opacity-88',
      secondary: 'border border-foreground bg-transparent text-foreground hover:bg-surface-muted',
      outline: 'border border-border-strong bg-transparent text-foreground hover:border-foreground',
      ghost: 'bg-transparent text-foreground hover:bg-surface-muted',
      danger: 'bg-danger text-danger-foreground hover:opacity-88',
      'danger-outline': 'border border-danger bg-transparent text-danger hover:bg-surface-muted',
      link: 'h-auto! px-0! text-accent-text underline underline-offset-3 hover:text-foreground',
    },
    size: {
      sm: 'h-9 px-3.5 text-body-sm',
      md: 'h-11 px-5 text-body-sm',
      lg: 'h-13 px-7 text-ui',
    },
    iconOnly: { true: 'px-0!' },
    block: { true: 'w-full' },
  },
  compoundVariants: [
    { iconOnly: true, size: 'sm', class: 'w-9' },
    { iconOnly: true, size: 'md', class: 'w-11' },
    { iconOnly: true, size: 'lg', class: 'w-13' },
  ],
  defaultVariants: { variant: 'primary', size: 'md' },
})

export type ButtonVariants = VariantProps<typeof buttonVariants>
