import { defineConfig } from 'vitest/config'
import path from 'path'

/**
 * Vitest configuration file.
 * Sets up module path aliases, test environment, and HTML coverage reporting.
 */
export default defineConfig({
  test: {
    environment: 'node',
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@ui': path.resolve(__dirname, './packages/ui'),
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      reportsDirectory: './coverage',
    },
  },
})
