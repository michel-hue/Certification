// @ts-check
import prettier from 'eslint-config-prettier'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-alert': 'error',
      'vue/require-default-prop': 'off',
    },
  },
  {
    files: ['app/**/*.vue'],
    // The design-system sheet is a French-only developer page.
    ignores: ['app/pages/_ui.vue', 'app/components/showcase/**'],
    rules: {
      // Visible text goes through i18n (CDC §7.1).
      'vue/no-bare-strings-in-template': [
        'error',
        {
          allowlist: [
            'Étal',
            'É',
            'E',
            'tal',
            '/',
            '·',
            '—',
            '(',
            ')',
            '01 / 04',
            '×',
            '*',
            '…',
            '«',
            '»',
            '.',
            '−',
          ],
        },
      ],
    },
  },
  prettier,
)
