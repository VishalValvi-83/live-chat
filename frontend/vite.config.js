import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      global: true,
      process: true,
      protocolImports: true,
    }),
  ],
  define: {
    global: 'window',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // 'readable-stream': 'vite-compatible-readable-stream',
    },
  },
  server: {
    port: 3000,
  },
})
