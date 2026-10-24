// Runtime configuration for the browser bundle.
//
// Vite injects `import.meta.env.VITE_*` at build time. In a containerised
// deployment (Docker + Kubernetes) those values are baked into the image and
// cannot be changed per environment, so we layer a runtime override on top:
//
//   1. The container's entrypoint writes `window.__ENV__` from a Kubernetes
//      Secret into `/env-config.js`, loaded by `index.html` before this app.
//   2. `getEnv` prefers `window.__ENV__` so the live Secret wins; the
//      `VITE_*` values still act as a sensible fallback for `npm run dev` and
//      local production builds without a populated Secret.
//
// `window.__ENV__` keys are uppercase, no `VITE_` prefix — the entrypoint
// generates them from the k8s Secret keys directly.

const readWindowEnv = () => {
  if (typeof window === 'undefined') return null
  return window.__ENV__ || null
}

export function getEnv(key) {
  const fromWindow = readWindowEnv()
  if (fromWindow && fromWindow[key]) return fromWindow[key]
  return import.meta.env[`VITE_${key}`] || ''
}
