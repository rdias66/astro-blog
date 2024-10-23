import { defineConfig } from 'astro/config'

export default defineConfig({
  server: { port: 4322 },
  experimental: {
    contentLayer: true,
  },
  devToolbar: {
    enabled: false,
  },
})
