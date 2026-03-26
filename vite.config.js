import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: { chunkSizeWarningLimit: 2000 },
  optimizeDeps: {
    include: [
      '@apollo/client/core',
      '@apollo/client/react',
      '@apollo/client/link/context',
      '@apollo/client/link/error',
    ],
  },
})
