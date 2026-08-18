/// <reference types="vitest" />
// позволяет TypeScript получить корректную типизацию для Vitest
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  base: '/3_2_3_patterns_react/',
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: [
      "./src/test/setup.ts",
    ],
    globals: true,
  },
})
