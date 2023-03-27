import path from 'path'
import { defineConfig } from 'vite'

import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
