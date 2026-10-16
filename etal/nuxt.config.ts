import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',
  devtools: { enabled: true },

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxtjs/color-mode',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@vueuse/nuxt',
    '@nuxt/test-utils/module',
  ],

  css: ['~/assets/css/main.css'],

  // Feature components live next to their logic (CDC §6.2) and are auto-imported without a prefix.
  components: [
    { path: '~/components' },
    { path: '~/features', pattern: '*/components/**', pathPrefix: false },
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },

  runtimeConfig: {
    apiBaseUrl: 'https://dummyjson.com',
    // Comma-separated DummyJSON user ids treated as admins, on top of the API's own `role`.
    adminUserIds: '1',
    public: {
      siteUrl: 'http://localhost:3000',
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'fr' },
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
    storage: 'cookie',
    storageKey: 'etal-color-mode',
  },

  i18n: {
    defaultLocale: 'fr',
    strategy: 'prefix_except_default',
    locales: [
      { code: 'fr', language: 'fr-FR', name: 'Français', file: 'fr.json' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'etal-locale',
      redirectOn: 'root',
    },
  },

  fonts: {
    families: [
      { name: 'Fraunces', provider: 'google', weights: ['400 600'], styles: ['normal', 'italic'] },
      { name: 'Inter', provider: 'google', weights: ['400 600'] },
    ],
    defaults: { fallbacks: { serif: ['Georgia'], 'sans-serif': ['Arial'] } },
  },

  icon: {
    mode: 'svg',
    class: 'icon',
    serverBundle: { collections: ['lucide'] },
    // Filled variants Lucide does not ship (favourite heart, rating star).
    customCollections: [{ prefix: 'etal', dir: './app/assets/icons' }],
  },

  image: {
    domains: ['cdn.dummyjson.com'],
    format: ['avif', 'webp'],
  },

  eslint: {
    config: { stylistic: false },
  },
})
