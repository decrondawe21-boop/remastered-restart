const fs = require('node:fs/promises');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { loadDotEnv } = require('../server/env.cjs');
const { getPool, query } = require('../server/db.cjs');

loadDotEnv();

const zipPath = process.argv[2] || process.env.FORM_PACKAGE_ZIP;
const archiveRoot = 'REST_ART_PROVOZNI_TEST_BALICEK_FINAL_FORMULARE_v1_0';
const manifestPath = `${archiveRoot}/00_README_A_MANIFEST/MANIFEST_FINALNI_FORMULARE.json`;
const publicRoot = path.join(process.cwd(), 'public', 'documents', 'forms');
const required = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];

function fail(message) {
  console.error(message);
  process.exit(1);
}

function readArchiveText(entry) {
  return execFileSync('tar', ['-xOf', zipPath, entry], { encoding: 'utf8' });
}

function readArchiveBuffer(entry) {
  return execFileSync('tar', ['-xOf', zipPath, entry]);
}

function listArchiveEntries() {
  return execFileSync('tar', ['-tf', zipPath], { encoding: 'utf8' })
    .split(/\r?\n/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function toSlug(value) {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 110);
}

function titleCase(value) {
  return value
    .toLowerCase()
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function categoryTitle(folder) {
  const withoutPrefix = folder.replace(/^\d+_/, '');
  const known = {
    GDPR_A_SOUHLASY: 'GDPR a souhlasy',
    KLIENTSKA_SLOZKA: 'Klientská složka',
    INTERVENCE: 'Intervence',
    KRIZOVY_REZIM: 'Krizový režim',
    EVALUACE_A_FOLLOW_UP: 'Evaluace a follow-up',
    REGISTRY: 'Registry',
    ETIKA_A_TYM: 'Etika a tým',
    DOPLNKOVE_LISTY: 'Doplňkové listy',
    ALL_IN_ONE_VOLITELNE: 'Volitelné all-in-one balíčky'
  };
  return known[withoutPrefix] || titleCase(withoutPrefix);
}

function documentTitle(filename) {
  return filename
    .replace(/^REST_ART_/, '')
    .replace(/_FILLABLE.*$/i, '')
    .replace(/_CONTENT_LOCKED.*$/i, '')
    .replace(/_ALL_IN_ONE.*$/i, ' all-in-one')
    .split('_')
    .filter(Boolean)
    .map((part) => {
      if (/^GDPR$/i.test(part) || /^A4$/i.test(part) || /^\d+$/.test(part)) return part.toUpperCase();
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    })
    .join(' ');
}

function documentCode(filename) {
  const gdpr = filename.match(/REST_ART_GDPR_(\d+)/i);
  if (gdpr) return `GDPR ${gdpr[1]}`;
  const base = filename.replace(/^REST_ART_/, '').replace(/_FILLABLE.*$/i, '').replace(/\.pdf$/i, '');
  return base.split('_').slice(0, 3).join(' ');
}

function versionFrom(filename) {
  const match = filename.match(/_v(\d+(?:_\d+)?)/i);
  return match ? `v${match[1].replace('_', '.')}` : '';
}

function sensitivityFor(folder, filename) {
  if (folder.includes('GDPR')) return 'gdpr';
  if (folder.includes('KRIZOVY') || filename.includes('INCIDENT')) return 'citlivé';
  if (folder.includes('KLIENTSKA') || folder.includes('INTERVENCE')) return 'klientské';
  return 'standard';
}

function archiveEntryFor(entries, file) {
  const suffix = `${file.folder}/${file.filename}`;
  return entries.find((entry) => entry.endsWith(suffix));
}

async function ensureSchema() {
  await query(
    `CREATE TABLE IF NOT EXISTS rest_art_document_files (
      id VARCHAR(120) PRIMARY KEY,
      category_code VARCHAR(80) NOT NULL,
      category_title VARCHAR(180) NOT NULL,
      document_code VARCHAR(80) NULL,
      title VARCHAR(220) NOT NULL,
      version VARCHAR(40) NULL,
      file_type VARCHAR(30) NOT NULL DEFAULT 'pdf',
      file_name VARCHAR(255) NOT NULL,
      file_path VARCHAR(500) NOT NULL,
      status VARCHAR(40) NOT NULL DEFAULT 'active',
      sensitivity VARCHAR(80) NULL,
      notes TEXT NULL,
      sort_order INT NOT NULL DEFAULT 0,
      size_bytes INT NULL,
      source_note VARCHAR(255) NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY rest_art_document_files_path_unique (file_path),
      KEY rest_art_document_files_category_idx (category_code, sort_order),
      KEY rest_art_document_files_status_idx (status, file_type)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
  );

  const columns = await query(
    `SELECT COLUMN_NAME AS columnName
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'rest_art_document_files'`,
    [process.env.DB_NAME]
  );
  const existing = new Set(columns.map((row) => row.columnName));
  if (!existing.has('size_bytes')) {
    await query('ALTER TABLE rest_art_document_files ADD COLUMN size_bytes INT NULL');
  }
  if (!existing.has('source_note')) {
    await query('ALTER TABLE rest_art_document_files ADD COLUMN source_note VARCHAR(255) NULL');
  }
}

async function importFile(file, archiveEntry, sortOrder) {
  const id = toSlug(`${file.folder}-${file.filename.replace(/\.pdf$/i, '')}`);
  const targetDir = path.join(publicRoot, file.folder);
  const targetPath = path.join(targetDir, file.filename);
  const publicPath = `/documents/forms/${file.folder}/${file.filename}`;

  await fs.mkdir(targetDir, { recursive: true });
  await fs.writeFile(targetPath, readArchiveBuffer(archiveEntry));

  await query(
    `INSERT INTO rest_art_document_files
       (id, category_code, category_title, document_code, title, version, file_type, file_name, file_path,
        status, sensitivity, notes, sort_order, size_bytes, source_note)
     VALUES (?, ?, ?, ?, ?, ?, 'pdf', ?, ?, 'active', ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       category_code = VALUES(category_code),
       category_title = VALUES(category_title),
       document_code = VALUES(document_code),
       title = VALUES(title),
       version = VALUES(version),
       file_type = 'pdf',
       file_name = VALUES(file_name),
       file_path = VALUES(file_path),
       status = 'active',
       sensitivity = VALUES(sensitivity),
       notes = VALUES(notes),
       sort_order = VALUES(sort_order),
       size_bytes = VALUES(size_bytes),
       source_note = VALUES(source_note)`,
    [
      id,
      file.folder,
      categoryTitle(file.folder),
      documentCode(file.filename),
      documentTitle(file.filename),
      versionFrom(file.filename),
      file.filename,
      publicPath,
      sensitivityFor(file.folder, file.filename),
      file.source_note || '',
      sortOrder,
      Number(file.size_bytes || 0),
      file.source || ''
    ]
  );

  return { id, publicPath };
}

(async () => {
  if (!zipPath) {
    fail('Missing ZIP path. Use: npm run db:import-forms -- "I:\\\\dkozak\\\\REST_ART_PROVOZNI_TEST_BALICEK_FINAL_FORMULARE_v1_0.zip"');
  }
  for (const key of required) {
    if (!process.env[key]) fail(`Missing required environment variable: ${key}`);
  }

  const archiveEntries = listArchiveEntries();
  const manifest = JSON.parse(readArchiveText(manifestPath));
  const files = Array.isArray(manifest.files) ? manifest.files : [];
  if (files.length === 0) fail('Manifest does not contain any files.');

  await ensureSchema();

  let imported = 0;
  let skipped = 0;
  for (const [index, file] of files.entries()) {
    const archiveEntry = archiveEntryFor(archiveEntries, file);
    if (!archiveEntry) {
      skipped += 1;
      console.warn(`Missing PDF in archive: ${file.folder}/${file.filename}`);
      continue;
    }
    await importFile(file, archiveEntry, (index + 1) * 10);
    imported += 1;
  }

  console.log(`Form package imported: ${imported} files, ${skipped} skipped.`);
  console.log(`Public PDF root: ${publicRoot}`);
})()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (process.env.DB_HOST) {
      await getPool().end().catch(() => {});
    }
  });
