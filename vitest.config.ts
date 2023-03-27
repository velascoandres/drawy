import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts']
  },
  resolve: {
    alias: {
      '@/pages': path.resolve(__dirname, './src/pages/'),
      '@/components': path.resolve(__dirname, './src/components/'),
      '@/layouts': path.resolve(__dirname, './src/layouts/'),
      '@/constants': path.resolve(__dirname, './src/constants/'),
      '@/services': path.resolve(__dirname, './src/services/'),
      '@/dtos': path.resolve(__dirname, './src/dtos/'),
      '@/types': path.resolve(__dirname, './src/types/'),
      '@/hooks': path.resolve(__dirname, './src/hooks/'),
      '@/test-utils': path.resolve(__dirname, './test-utils/'),
    }
  },
})