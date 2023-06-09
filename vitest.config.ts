import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    deps: {
      inline: ['vitest-canvas-mock'],
    },
  },
  resolve: {
    alias: {
      '@/pages': path.resolve(__dirname, './src/pages/'),
      '@/utils': path.resolve(__dirname, './src/utils/'),
      '@/components': path.resolve(__dirname, './src/components/'),
      '@/layouts': path.resolve(__dirname, './src/layouts/'),
      '@/constants': path.resolve(__dirname, './src/constants/'),
      '@/services': path.resolve(__dirname, './src/services/'),
      '@/queries': path.resolve(__dirname, './src/queries/'),
      '@/mutations': path.resolve(__dirname, './src/mutations/'),
      '@/dtos': path.resolve(__dirname, './src/dtos/'),
      '@/types': path.resolve(__dirname, './src/types/'),
      '@/hooks': path.resolve(__dirname, './src/hooks/'),
      '@/store': path.resolve(__dirname, './src/store/'),
      '@/modals': path.resolve(__dirname, './src/modals/'),
      '@/test-utils': path.resolve(__dirname, './test-utils/'),
      '@/styles': path.resolve(__dirname, './src/styles/'),
    }
  },
})