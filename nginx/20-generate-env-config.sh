#!/bin/sh
# Writes the runtime env config consumed by `src/lib/runtime-config.js`.
# Pulled from environment variables populated by the Kubernetes Secret
# referenced by the UI Deployment.

set -eu

OUT="/usr/share/nginx/html/env-config.js"

esc() {
    # Backslash-escape and quote-escape so a malicious or unusual secret
    # value can't break out of the JS string literal.
    printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g'
}

supabase_url="$(esc "${SUPABASE_URL:-}")"
supabase_key="$(esc "${SUPABASE_PUBLISHABLE_KEY:-}")"
api_base="$(esc "${API_BASE_URL:-/api}")"

cat > "$OUT" <<EOF
// Generated at container startup from the k8s Secret. Do not edit by hand.
window.__ENV__ = {
  SUPABASE_URL: "${supabase_url}",
  SUPABASE_PUBLISHABLE_KEY: "${supabase_key}",
  API_BASE_URL: "${api_base}"
};
EOF
