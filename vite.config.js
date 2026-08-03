import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwind()],
  build: {
    // three is the only genuinely heavy dep; keep it out of the main chunk
    rollupOptions: { output: { manualChunks: { three: ['three'] } } },
  },
})
