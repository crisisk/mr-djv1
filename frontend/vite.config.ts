import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: /^react$/, // ensure modules outside the Vite root can resolve React
        replacement: fileURLToPath(new URL('./node_modules/react/index.js', import.meta.url)),
      },
      {
        find: /^react\/jsx-runtime$/,
        replacement: fileURLToPath(new URL('./node_modules/react/jsx-runtime.js', import.meta.url)),
      },
      {
        find: /^react\/jsx-dev-runtime$/,
        replacement: fileURLToPath(new URL('./node_modules/react/jsx-dev-runtime.js', import.meta.url)),
      },
      {
        find: /^react-day-picker$/,
        replacement: fileURLToPath(new URL('./node_modules/react-day-picker/dist/esm/index.js', import.meta.url)),
      },
      {
        find: /^react-day-picker\/dist\/style\.css$/,
        replacement: fileURLToPath(new URL('./node_modules/react-day-picker/src/style.css', import.meta.url)),
      },
    ],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
  },
})
