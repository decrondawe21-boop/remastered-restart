# REST||ART Integrace database

The application database schema lives in `db/schema.sql`.

## Required environment variables

Copy `.env.example` to a local `.env` file or export these variables in the shell:

```powershell
$env:DB_HOST='your-database-host'
$env:DB_PORT='3306'
$env:DB_NAME='your-database-name'
$env:DB_USER='your-database-user'
$env:DB_PASSWORD='...'
npm run db:migrate
```

Import provozního balíčku PDF formulářů:

```powershell
npm run db:import-forms -- "I:\dkozak\REST_ART_PROVOZNI_TEST_BALICEK_FINAL_FORMULARE_v1_0.zip"
```

Skript z manifestu vytvoří záznamy v `rest_art_document_files` a zkopíruje PDF do
`public/documents/forms/...`, odkud je umí admin sekce nabídnout k otevření nebo tisku.

Seed the first administrator account:

```powershell
$env:ADMIN_EMAIL='admin@restart.local'
$env:ADMIN_PASSWORD='...'
npm run db:seed-admin
```

Do not commit real passwords. `.env` and `.env.*` are ignored.

## Webglobe checklist

If migration returns `Access denied`, check these items in Webglobe Admin:

1. Open the target project database.
2. Open `Uživatelé`.
3. Confirm the database user exists and is assigned to the database.
4. Reset the database user's password and use the new value locally.
5. If Webglobe offers remote access restrictions, allow the current development IP or run the migration from the hosting environment.

## Tables

- `users`: admin and client accounts.
- `clients`: client register for social work.
- `client_notes`: worker notes and history.
- `form_templates`: printable/signable form definitions.
- `rest_art_document_files`: imported PDF form package shown in the admin form picker.
- `form_submissions`: filled forms for clients.
- `news`: public news/CMS entries.
- `password_resets`: password reset tokens.
- `audit_log`: important changes and traceability.
