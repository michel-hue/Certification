import { createRequire } from 'node:module'
import { dirname, join, posix } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineVitestProject } from '@nuxt/test-utils/config'
import type { Plugin } from 'vite'
import { defineConfig } from 'vitest/config'

const shared = fileURLToPath(new URL('./shared', import.meta.url))
const nuxtAppDir = join(
  dirname(createRequire(import.meta.url).resolve('nuxt/package.json')),
  'dist/app',
).replaceAll('\\', '/')

/**
 * On Windows, @nuxt/test-utils keeps its stub app entry as the root-relative URL
 * `/node_modules/.pnpm/nuxt…/nuxt-vitest-app-entry.js`; Vitest then loads it as
 * `file:///node_modules/…` (drive root) and the Nuxt environment cannot boot.
 * Pin the entry, and the relative imports it makes, to Nuxt's real `dist/app` directory.
 */
const fixWindowsStubEntry: Plugin = {
  name: 'etal:fix-windows-stub-entry',
  enforce: 'pre',
  resolveId(id, importer) {
    if (/nuxt-vitest-app-entry(\.js)?$/.test(id)) {
      return posix.join(nuxtAppDir, 'nuxt-vitest-app-entry.js')
    }
    if (importer?.includes('nuxt-vitest-app-entry') && id.startsWith('./')) return posix.join(nuxtAppDir, id)
  },
}

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      include: ['shared/**/*.ts', 'server/adapters/**/*.ts', 'app/stores/**/*.ts', 'app/utils/**/*.ts'],
      thresholds: { lines: 80, functions: 80, branches: 80, statements: 80 },
    },
    projects: [
      {
        // Pure TypeScript (shared utils, adapters, stores logic): plain Node, fast.
        resolve: { alias: { '#shared': shared } },
        test: { name: 'unit', include: ['tests/unit/**/*.test.ts'], environment: 'node' },
      },
      await defineVitestProject({
        plugins: [fixWindowsStubEntry],
        test: {
          name: 'nuxt',
          include: ['tests/components/**/*.test.ts'],
          environment: 'nuxt',
          environmentOptions: {
            nuxt: { rootDir: fileURLToPath(new URL('.', import.meta.url)), domEnvironment: 'happy-dom' },
          },
          // Booting a Nuxt app (i18n, fonts, icons) takes a while on a cold cache.
          hookTimeout: 60_000,
          testTimeout: 30_000,
        },
      }),
    ],
  },
})
