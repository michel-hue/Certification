import { defineConfig, devices } from '@playwright/test'

const port = 3100
const baseURL = `http://localhost:${port}`

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  // French is the default locale; a French browser stays on unprefixed routes.
  use: { baseURL, locale: 'fr-FR', trace: 'on-first-retry' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  // E2E runs against the production build, as in CI.
  webServer: {
    command: `node .output/server/index.mjs`,
    url: baseURL,
    env: {
      PORT: String(port),
      NUXT_PUBLIC_SITE_URL: baseURL,
      // The production build needs a session secret; this one only ever seals test cookies.
      NUXT_SESSION_PASSWORD: process.env.NUXT_SESSION_PASSWORD ?? 'e2e-only-session-password-not-a-secret',
    },
    reuseExistingServer: !process.env.CI,
  },
})
