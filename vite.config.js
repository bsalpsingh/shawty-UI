import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// The shawty API runs in the kind cluster. During development the Vite server
// proxies `/api/*` to it, so the browser only ever talks to one origin and no
// CORS handshake is required.
//
//   kubectl port-forward -n shawty svc/shawty-svc 8010:8000
//
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.VITE_DEV_API_TARGET || 'http://localhost:8000'

  const proxy = {
    '/api': {
      target: apiTarget,
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  }

  return {
    plugins: [react()],
    server: {
      proxy,
    },
    preview: {
      proxy,
    },
  }
})
