import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  experimental: {
    contentLayer: true, // Enable Content Layer API
  },
})
