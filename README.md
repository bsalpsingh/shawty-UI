# shawty-ui

The web front end for [shawty](../shawty) — a URL shortener. React + Vite, Supabase auth (GitHub only), Material 3 Expressive UI.

## What it does

- **Sign in with GitHub** — Supabase OAuth, GitHub is the only provider wired up. Signed out, the app shows nothing but the wordmark and a GitHub button.
- **Home** — a Google-style search field: paste a long link, press *Shorten*, get a short url back with a one-tap copy button. On narrow screens the button drops below the field so the url gets the whole row.
- **My urls** — a paginated table of every link you created: short code, destination, age, expiry, copy/open actions. Reached through the list icon in the top right.

The app is a single page on `/` — the table is a view toggle, not a route. The nginx image routes accordingly:

| path | served by |
| ---- | --------- |
| `/` | the UI bundle |
| `/api/...` | the shawty API (prefix stripped) |
| `/assets/...`, `/favicon.svg`, `/env-config.js` | static |
| anything else (`/s5sLgmeH`) | the shawty API, which owns `/{short_code}` and issues the redirect |

So the app and the short links can share one host: `example.com` opens the shortener, `example.com/s5sLgmeH` redirects to the target.
- **Top right cluster** — my-urls toggle and the account menu (name, email, sign out). The `shawty` mark on the list view links back to the shortener.
- **Dark only** — there is no light theme and no toggle; the palette is Gemini-style with a slow colour sweep behind the content.

Type is [Comfortaa](https://fonts.google.com/specimen/Comfortaa) for display and [Inter](https://fonts.google.com/specimen/Inter) for everything else.

## Run it

### 1. Point the UI at the API

The API runs in the local kind cluster (`shawty` namespace). Forward it to your machine:

```bash
kubectl port-forward -n shawty svc/shawty-svc 8010:8000
```

The Vite dev server proxies `/api/*` to that target, so the browser only talks to one origin — no CORS handshake in development.

### 2. Configure the environment

`.env.local` (already created, adjust if your setup differs):

```bash
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
VITE_API_BASE_URL=/api
VITE_DEV_API_TARGET=http://localhost:8010
```

- `VITE_API_BASE_URL` — path the app calls. Keep `/api` to use the dev proxy, or set an absolute URL (`https://api.example.com`) to talk to a deployed API directly (that needs CORS enabled on the backend, see `CORS_ORIGINS` in the API's `.env`).
- `VITE_DEV_API_TARGET` — where the dev server proxies `/api` to.

### 3. Supabase setup

In the Supabase dashboard:

1. **Authentication → Providers → GitHub** — enable it and paste the client id / secret of your GitHub OAuth app. GitHub's callback URL must be `https://<your-project>.supabase.co/auth/v1/callback`.
2. **Authentication → URL Configuration → Redirect URLs** — add `http://localhost:5173/` (and `http://localhost:5174/` if you use another port). The OAuth round trip lands back on the app root.
3. Leave every other provider disabled — the UI only offers GitHub.

### 4. Start it

```bash
npm install
npm run dev      # http://localhost:5173
```

Other scripts: `npm run build` (production bundle in `dist/`), `npm run lint`, `npm run preview`.

## Layout

```
src/
  components.css            Material 3 Expressive component layer
  index.css                 design tokens, colour schemes, type scale
  App.jsx                   shell + view toggle
  components/               search bar, result, table, pagination, sign-in, user menu, icons
  context/                  auth and toast providers (and their hooks)
  hooks/                    useUrls (fetch + pagination state), useCopy
  lib/                      api client, supabase client, runtime config, formatters
  pages/                    Home (shortener), Urls (table)
```

## API contract

Both calls need `Authorization: Bearer <supabase access token>`.

| Method | Path                        | Body / query                       | Response                          |
| ------ | --------------------------- | ---------------------------------- | --------------------------------- |
| `POST` | `/short-url`                | `{ url, expires_at }`              | `{ status, url, shortURL }`       |
| `GET`  | `/urls`                     | `?skip=0&limit=10&order=desc`      | `{ status, urls: [...] }`         |

`limit` must be between 5 and 100 — the page-size picker offers 5 / 10 / 20 / 50. The API returns no total count, so *Next* stays enabled while a page comes back full.
