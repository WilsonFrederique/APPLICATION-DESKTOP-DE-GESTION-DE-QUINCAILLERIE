import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      }
    }
  },
  server: {
    port: 5173,
    host: '127.0.0.1',
    strictPort: true,
    cors: true,
    headers: {},
    fs: {
      strict: false,
      allow: ['..']
    },
    hmr: {
      host: '127.0.0.1',
      port: 5173,
      clientPort: 5173,
      protocol: 'ws'
    }
  },
  preview: {
    port: 4173,
    host: 'localhost'
  }
})