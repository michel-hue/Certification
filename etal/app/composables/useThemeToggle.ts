/**
 * Light ↔ dark switch used across the mockup (header, footer, profile).
 * The first visit still follows the OS (`preference: 'system'`); one click pins a choice.
 */
export function useThemeToggle() {
  const colorMode = useColorMode()
  const { t } = useI18n()

  const isDark = computed(() => colorMode.value === 'dark')
  const label = computed(() => (isDark.value ? t('theme.toLight') : t('theme.toDark')))

  function toggle() {
    colorMode.preference = isDark.value ? 'light' : 'dark'
  }

  return { isDark, label, toggle }
}
