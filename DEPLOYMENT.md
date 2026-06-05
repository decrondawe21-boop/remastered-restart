# Production deployment

This checklist assumes one Linux machine runs MariaDB, the Node API and the built Vite frontend.

## 1. Environment

Create `.env` on the server. Do not commit it.

```env
NODE_ENV=production
DB_HOST=localhost
DB_PORT=3306
DB_NAME=restartintegrace
DB_USER=restartapp
DB_PASSWORD=change-me
AUTH_SECRET=change-this-to-a-long-random-secret
API_HOST=127.0.0.1
API_PORT=4000
COOKIE_SECURE=1
```

Use `COOKIE_SECURE=1` only when the public site uses HTTPS. For local HTTP testing, use `COOKIE_SECURE=0`.

## 2. Install and build

```bash
npm ci
npm run build
npm run db:migrate
npm run db:seed-admin
```

## 3. Run services

The API should stay behind a reverse proxy:

```bash
NODE_ENV=production npm run api:dev
```

Serve `dist/` as the public website and proxy `/api` to:

```text
http://127.0.0.1:4000
```

For Apache or Nginx, keep the browser on one public origin, for example:

```text
https://restartintegrace.cz/
https://restartintegrace.cz/api/health
```

## 4. Smoke checks

```bash
curl https://your-domain.example/api/health
```

Expected response:

```json
{"ok":true}
```

Then check:

- Public homepage loads.
- Login works for the administrator.
- News can be created, edited and deleted.
- Client registration/login works.
- Cookies dialog can be opened from the footer.
- Printable forms load from the admin section.

## 5. Production notes

- Never expose MariaDB directly to the internet.
- Keep `API_HOST=127.0.0.1` unless a reverse proxy cannot run on the same machine.
- Use a dedicated MariaDB user for the app, not `root`.
- Rotate `AUTH_SECRET` and passwords if they were ever pasted in a public place.
