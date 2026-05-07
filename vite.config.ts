import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['image/logo.png'],
      manifest: {
        name: 'MaternityAI',
        short_name: 'MaternityAI',
        description: 'Plataforma de salud materna inteligente',
        theme_color: '#c2185b',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        lang: 'es',
        icons: [
          {
            src: 'image/logo.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'image/logo.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'image/logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        // Cachea todos los assets del build
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        // Estrategia: red primero para las llamadas a la API
        runtimeCaching: [
          {
            urlPattern: /^http:\/\/localhost:8000\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'maternity-api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, // 24 horas
              },
              networkTimeoutSeconds: 10,
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'maternity-images-cache',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 días
              },
            },
          },
        ],
      },
      devOptions: {
        // Activa el SW en desarrollo para poder probarlo
        enabled: true,
      },
    }),
  ],
});
