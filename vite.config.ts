/**
 * @file vite.config.ts
 * @description Vite configuration for the React 19 + TypeScript project.
 *
 * @see {@link ./index.html}
 * @see {@link ./src/main.tsx}
 * @see {@link ./eslint.config.js}
 * @see {@link ./tsconfig.json}
 * @see {@link ./package.json}
 * @see https://vite.dev/config/
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
