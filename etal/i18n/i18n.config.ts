const datetimeFormats = {
  long: { day: 'numeric', month: 'long', year: 'numeric' },
  short: { day: 'numeric', month: 'short', year: 'numeric' },
} as const

export default defineI18nConfig(() => ({
  datetimeFormats: { fr: datetimeFormats, en: datetimeFormats },
}))
