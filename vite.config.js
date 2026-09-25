import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    // Without this, Vite's PostCSS loader walks up to the repo root and picks up
    // the Next.js mockup's postcss.config.mjs (which needs @tailwindcss/postcss,
    // not installed here). This app uses Bootstrap, not Tailwind, so no PostCSS
    // plugins are needed — passing an explicit empty config stops that lookup.
    postcss: {},
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
