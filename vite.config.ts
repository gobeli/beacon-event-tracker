import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    exclude: [
      // Do not pre-bundle `@evolu/common-web`. Why? Worker relative import path resolution fails on registration because `@evolu/common-web/dist/*.worker.js`
      // is not present in Vite's pre-bundled dependencies cache (typically `node_modules/.vite/deps`).
      // @see https://github.com/vitejs/vite/issues/13314#issuecomment-1560745780
      "@evolu/common-web",
    ],
    // Another workaround for Vite bug: https://github.com/radix-ui/primitives/discussions/1915#discussioncomment-5733178
    include: ["react-dom"],
  },
  worker: {
    format: "es",
  },
  plugins: [react(), VitePWA({ 
    registerType: 'autoUpdate',
    manifest: {
      name: 'Event tracker',
      short_name: 'ET',
      description: 'iBeacon event tracking',
      theme_color: '#ffffff',
      icons: [
        {
          src: "/pwa-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ]
    }
  })],
})
