import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  site: 'https://blog.rdias66.codes',
  server: { port: 4322 },
  experimental: {
    contentLayer: true, // Enable Content Layer API
  },
})
