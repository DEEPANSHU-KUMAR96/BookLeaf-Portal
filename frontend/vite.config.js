import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    // Dev proxy: the browser talks to the same origin, so the refresh-token
    // cookie works without any CORS or SameSite headaches.
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true
      }
    },
  },
})
