# REST||ART API server

This is the local Node API layer for the React app. It connects to the Webglobe MariaDB database and exposes `/api/*`
endpoints.

## Local development

Create a local `.env` file from `.env.example` and fill in:

- `DB_PASSWORD`
- `AUTH_SECRET`

Then run:

```powershell
npm run api:dev
npm run dev
```

Vite proxies `/api` requests from `http://localhost:3000` to `http://127.0.0.1:4000`.

## Current endpoints

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `POST /api/auth/reset`
- `GET /api/news`
- `GET /api/clients`
- `POST /api/clients`

The frontend still keeps a local fallback so the UI remains usable when the API is not running.
