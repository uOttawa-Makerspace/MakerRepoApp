import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';
import autoprefixer from 'autoprefixer'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Makerepo App',
        short_name: 'Makerepo',
        description: 'Makerepo PWA',
        theme_color: '#000000',
        icons: [
          {
            src: '/logo192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/logo512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
      },
    },
    postcss: {
      plugins: [autoprefixer],
    },
  },
})