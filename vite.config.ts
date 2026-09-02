import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.svg'],
      manifest: {
        name: 'Weight Tracker',
        short_name: 'Weight',
        description: 'A simple personal weight tracker.',
        theme_color: '#09090B',
        background_color: '#09090B',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'apple-touch-icon.svg',
            sizes: '180x180',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,ico,woff2}'],
      },
    }),
  ],
})
