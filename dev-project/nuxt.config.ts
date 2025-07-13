export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

modules: [
  '@nuxtjs/tailwindcss',
  '@pinia/nuxt'
],


  app: {
    head: {
      script: [
        {
          src: 'https://kit.fontawesome.com/8a8255d9e7.js',
          crossorigin: 'anonymous'
        }
      ]
    }
  }
})


