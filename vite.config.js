import process from 'node:process'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// La ruta base depende del host:
//  - Netlify/Vercel/dominio propio -> raíz "/" (por defecto)
//  - GitHub Pages de proyecto       -> "/<nombre-repo>/" (se pasa por BASE_PATH)
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? process.env.BASE_PATH || '/' : '/',
}))
