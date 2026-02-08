import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import yaml from '@rollup/plugin-yaml'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react(), yaml()],
  base: command === 'build' ? '/rn/' : '/',
}))
