# Build artefact from the React/Vite app and serve it with nginx, which also
# reverse-proxies /api to the shawty backend service.
#
# The runtime env (Supabase URL / publishable key, API base URL) is injected
# from the Kubernetes Secret by nginx's docker-entrypoint.d hook script.

# syntax=docker/dockerfile:1.7

FROM --platform=linux/arm64 node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
# VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY are intentionally *not*
# passed at build time — they're injected at runtime from the k8s Secret.

RUN npm run build

FROM --platform=linux/arm64 nginx:1.27-alpine

# Replace the default site with our template (processed by the official
# entrypoint's envsubst pass) and add the runtime-config hook script.
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY nginx/20-generate-env-config.sh /docker-entrypoint.d/20-generate-env-config.sh
RUN chmod +x /docker-entrypoint.d/20-generate-env-config.sh

# Static SPA bundle.
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
