const fs = require('node:fs/promises');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { loadDotEnv } = require('../server/env.cjs');
const { getPool, query } = require('../server/db.cjs');

loadDotEnv();

const zipPath =
  process.argv[2] ||
  process.env.RESTART_PROGRAM_QUESTIONNAIRES_ZIP ||
  'I:\\dkozak\\REST_ART_PROGRAMOVE_DOTAZNIKY_v2_0_RC1.zip';

const RELEASE_NAME = 'REST_ART_PROGRAMOVE_DOTAZNIKY_v2_0_RC1';
const RELEASE_CODE = 'REST_ART_PROGRAMOVE_DOTAZNIKY';
const RELEASE_VERSION = 'v2.0 RC1';
const CATEGORY_CODE = '11_PROGRAMOVE_DOTAZNIKY';
const CATEGORY_TITLE = 'Programové dotazníky';
const MANIFEST_ENTRY = 'MANIFEST_PROGRAMOVE_DOTAZNIKY_v2_0_RC1.json';
const FIELD_MANIFEST_ENTRY = 'FIELD_MANIFEST_PROGRAMOVE_DOTAZNIKY_v2_0_RC1.json';
const PUBLIC_FORMS_ROOT = path.join(process.cwd(), 'public', 'documents', 'forms');
const PUBLIC_PROGRAM_ROOT = path.join(PUBLIC_FORMS_ROOT, CATEGORY_CODE);
const PUBLIC_RELEASE_ROOT = path.join(process.cwd(), 'public', 'documents', 'releases', RELEASE_NAME);
const TEMP_ROOT = path.join(process.cwd(), '.tmp-program-questionnaires-v2');
const required = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];

function fail(message) {
  console.error(message);
  process.exit(1);
}

function assertWorkspacePath(targetPath, label) {
  const workspace = path.resolve(process.cwd());
  const resolved = path.resolve(targetPath);
  const workspaceWithSep = workspace.endsWith(path.sep) ? workspace : `${workspace}${path.sep}`;
  if (resolved !== workspace && !resolved.startsWith(workspaceWithSep)) {
    throw new Error(`${label} is outside workspace: ${resolved}`);
  }
  return resolved;
}

function readArchiveText(entry) {
  return execFileSync('tar', ['-xOf', zipPath, entry], { encoding: 'utf8' });
}

function extractArchive(targetDir) {
  execFileSync('tar', ['-xf', zipPath, '-C', targetDir], { stdio: 'inherit' });
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

function valueOrNull(value) {
  return value === undefined || value === null || value === '' ? null : value;
}

async function clearDirectory(targetPath, label) {
  const resolved = assertWorkspacePath(targetPath, label);
  await fs.rm(resolved, { recursive: true, force: true });
  await fs.mkdir(resolved, { recursive: true });
  return resolved;
}

async function ensureColumn(table, existing, name, definition) {
  if (!existing.has(name)) {
    await query(`ALTER TABLE ${table} ADD COLUMN ${definition}`);
    existing.add(name);
  }
}

async function ensureIndex(table, existing, name, definition) {
  if (!existing.has(name)) {
    await query(`ALTER TABLE ${table} ADD INDEX ${name} ${definition}`);
    existing.add(name);
  }
}

async function ensureSchema() {
  await query(
    `CREATE TABLE IF NOT EXISTS rest_art_document_releases (
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      release_code VARCHAR(120) NOT NULL,
      title VARCHAR(220) NOT NULL,
      version VARCHAR(40) NULL,
      file_name VARCHAR(255) NOT NULL,
      file_path VARCHAR(500) NOT NULL,
      file_type VARCHAR(30) NOT NULL DEFAULT 'directory',
      status VARCHAR(40) NOT NULL DEFAULT 'active',
      description TEXT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      KEY rest_art_document_releases_code_idx (release_code, version),
      KEY rest_art_document_releases_status_idx (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
  );

  await query(
    `CREATE TABLE IF NOT EXISTS rest_art_document_files (
      id VARCHAR(120) PRIMARY KEY,
      release_id INT NULL,
      form_uid VARCHAR(50) NULL,
      form_group VARCHAR(50) NULL,
      category_code VARCHAR(80) NOT NULL,
      category_title VARCHAR(180) NOT NULL,
      document_code VARCHAR(80) NULL,
      title VARCHAR(220) NOT NULL,
      version VARCHAR(40) NULL,
      file_type VARCHAR(30) NOT NULL DEFAULT 'pdf',
      file_name VARCHAR(255) NOT NULL,
      file_path VARCHAR(500) NOT NULL,
      is_fillable TINYINT(1) NOT NULL DEFAULT 1,
      is_all_in_one TINYINT(1) NOT NULL DEFAULT 0,
      status VARCHAR(40) NOT NULL DEFAULT 'active',
      is_current TINYINT(1) NOT NULL DEFAULT 1,
      sensitivity VARCHAR(80) NULL,
      crm_use TINYINT(1) NOT NULL DEFAULT 1,
      reporting_export TINYINT(1) NOT NULL DEFAULT 0,
      notes TEXT NULL,
      sort_order INT NOT NULL DEFAULT 0,
      size_bytes INT NULL,
      source_note VARCHAR(255) NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY rest_art_document_files_path_unique (file_path),
      KEY rest_art_document_files_category_idx (category_code, sort_order),
      KEY rest_art_document_files_status_idx (status, file_type),
      KEY rest_art_document_files_uid_idx (form_uid),
      KEY rest_art_document_files_current_idx (is_current, status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
  );

  const columns = await query(
    `SELECT COLUMN_NAME AS columnName
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'rest_art_document_files'`,
    [process.env.DB_NAME]
  );
  const existingColumns = new Set(columns.map((row) => row.columnName));
  await ensureColumn('rest_art_document_files', existingColumns, 'release_id', 'release_id INT NULL AFTER id');
  await ensureColumn('rest_art_document_files', existingColumns, 'form_uid', 'form_uid VARCHAR(50) NULL AFTER release_id');
  await ensureColumn('rest_art_document_files', existingColumns, 'form_group', 'form_group VARCHAR(50) NULL AFTER form_uid');
  await ensureColumn('rest_art_document_files', existingColumns, 'is_fillable', 'is_fillable TINYINT(1) NOT NULL DEFAULT 1 AFTER file_path');
  await ensureColumn('rest_art_document_files', existingColumns, 'is_all_in_one', 'is_all_in_one TINYINT(1) NOT NULL DEFAULT 0 AFTER is_fillable');
  await ensureColumn('rest_art_document_files', existingColumns, 'is_current', 'is_current TINYINT(1) NOT NULL DEFAULT 1 AFTER status');
  await ensureColumn('rest_art_document_files', existingColumns, 'crm_use', 'crm_use TINYINT(1) NOT NULL DEFAULT 1 AFTER sensitivity');
  await ensureColumn('rest_art_document_files', existingColumns, 'reporting_export', 'reporting_export TINYINT(1) NOT NULL DEFAULT 0 AFTER crm_use');
  await ensureColumn('rest_art_document_files', existingColumns, 'size_bytes', 'size_bytes INT NULL');
  await ensureColumn('rest_art_document_files', existingColumns, 'source_note', 'source_note VARCHAR(255) NULL');

  const indexes = await query(
    `SELECT INDEX_NAME AS indexName
     FROM INFORMATION_SCHEMA.STATISTICS
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'rest_art_document_files'`,
    [process.env.DB_NAME]
  );
  const existingIndexes = new Set(indexes.map((row) => row.indexName));
  await ensureIndex('rest_art_document_files', existingIndexes, 'rest_art_document_files_uid_idx', '(form_uid)');
  await ensureIndex('rest_art_document_files', existingIndexes, 'rest_art_document_files_current_idx', '(is_current, status)');
}

async function upsertRelease() {
  const existing = await query(
    'SELECT id FROM rest_art_document_releases WHERE release_code = ? AND version = ? ORDER BY id DESC LIMIT 1',
    [RELEASE_CODE, RELEASE_VERSION]
  );

  const values = [
    RELEASE_CODE,
    'REST||ART programové dotazníky v2.0 RC1',
    RELEASE_VERSION,
    RELEASE_NAME,
    `/documents/releases/${RELEASE_NAME}`,
    'directory',
    'active',
    'Programové dotazníky jednotlivých programů s čárovým kódem a field manifestem pro admin autofill.'
  ];

  if (existing.length > 0) {
    await query(
      `UPDATE rest_art_document_releases
       SET release_code = ?, title = ?, version = ?, file_name = ?, file_path = ?, file_type = ?, status = ?, description = ?
       WHERE id = ?`,
      [...values, existing[0].id]
    );
    return existing[0].id;
  }

  const result = await query(
    `INSERT INTO rest_art_document_releases
       (release_code, title, version, file_name, file_path, file_type, status, description)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    values
  );
  return result.insertId;
}

async function archivePreviousProgramQuestionnaires(releaseId) {
  await query(
    `UPDATE rest_art_document_files
     SET status = 'legacy', is_current = 0
     WHERE file_type = 'pdf'
       AND category_code = ?
       AND (release_id IS NULL OR release_id <> ?)
       AND (status <> 'legacy' OR is_current <> 0)`,
    [CATEGORY_CODE, releaseId]
  );
}

async function upsertDocument(file, releaseId, index, fieldCountsByFormUid) {
  const source = path.join(PUBLIC_PROGRAM_ROOT, file.file_name);
  const stats = await fs.stat(source);
  const filePath = `/documents/forms/${CATEGORY_CODE}/${file.file_name}`;
  const existing = await query(
    'SELECT id FROM rest_art_document_files WHERE form_uid = ? OR file_path = ? ORDER BY is_current DESC, id DESC LIMIT 1',
    [file.form_uid, filePath]
  );

  const id = existing.length > 0 ? existing[0].id : toSlug(`${file.form_uid}-${RELEASE_VERSION}`);
  const fieldCount = fieldCountsByFormUid.get(file.form_uid) || Number(file.field_count || 0);
  const values = [
    releaseId,
    valueOrNull(file.form_uid),
    valueOrNull(file.program),
    CATEGORY_CODE,
    CATEGORY_TITLE,
    valueOrNull(file.form_uid),
    file.title,
    RELEASE_VERSION,
    file.file_name,
    filePath,
    'pdf',
    1,
    0,
    'klientské',
    'active',
    1,
    1,
    1,
    `${RELEASE_NAME}; program ${file.program}; ${fieldCount} polí; ${file.barcode || 'Code 128'}`,
    (index + 1) * 10,
    Number(stats.size || 0),
    [`program_questionnaire_v2_rc1`, file.sha256 ? `sha256=${file.sha256}` : ''].filter(Boolean).join('; ').slice(0, 255)
  ];

  if (existing.length > 0) {
    await query(
      `UPDATE rest_art_document_files
       SET release_id = ?,
           form_uid = ?,
           form_group = ?,
           category_code = ?,
           category_title = ?,
           document_code = ?,
           title = ?,
           version = ?,
           file_name = ?,
           file_path = ?,
           file_type = ?,
           is_fillable = ?,
           is_all_in_one = ?,
           sensitivity = ?,
           status = ?,
           is_current = ?,
           crm_use = ?,
           reporting_export = ?,
           notes = ?,
           sort_order = ?,
           size_bytes = ?,
           source_note = ?
       WHERE id = ?`,
      [...values, id]
    );
    return id;
  }

  await query(
    `INSERT INTO rest_art_document_files
       (id, release_id, form_uid, form_group, category_code, category_title, document_code, title, version, file_name, file_path,
        file_type, is_fillable, is_all_in_one, sensitivity, status, is_current, crm_use, reporting_export, notes, sort_order, size_bytes, source_note)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, ...values]
  );
  return id;
}

async function copyProgramQuestionnaires(manifest, extractedRoot) {
  const programRoot = await clearDirectory(PUBLIC_PROGRAM_ROOT, 'public program questionnaires root');
  let copied = 0;

  for (const file of manifest) {
    const source = path.join(extractedRoot, file.file_name);
    const target = path.join(programRoot, file.file_name);
    await fs.copyFile(source, target);
    copied += 1;
  }

  return copied;
}

async function copyReleaseArchive(extractedRoot) {
  const releaseRoot = await clearDirectory(PUBLIC_RELEASE_ROOT, 'public program questionnaire release root');
  await fs.cp(extractedRoot, releaseRoot, { recursive: true });
  return releaseRoot;
}

(async () => {
  if (!zipPath) fail('Missing ZIP path.');
  for (const key of required) {
    if (!process.env[key]) fail(`Missing required environment variable: ${key}`);
  }

  await fs.access(zipPath);
  const tempRoot = await clearDirectory(TEMP_ROOT, 'temporary program questionnaire root');
  extractArchive(tempRoot);

  const manifest = JSON.parse(readArchiveText(MANIFEST_ENTRY));
  const fieldManifest = JSON.parse(readArchiveText(FIELD_MANIFEST_ENTRY));
  if (!Array.isArray(manifest) || manifest.length === 0) {
    fail('Program questionnaire manifest is empty or invalid.');
  }

  const fieldCountsByFormUid = new Map();
  for (const field of Array.isArray(fieldManifest) ? fieldManifest : []) {
    fieldCountsByFormUid.set(field.form_uid, (fieldCountsByFormUid.get(field.form_uid) || 0) + 1);
  }

  await copyReleaseArchive(tempRoot);
  const copied = await copyProgramQuestionnaires(manifest, tempRoot);

  await ensureSchema();
  const releaseId = await upsertRelease();
  await archivePreviousProgramQuestionnaires(releaseId);

  let imported = 0;
  for (const [index, file] of manifest.entries()) {
    await upsertDocument(file, releaseId, index, fieldCountsByFormUid);
    imported += 1;
  }

  await fs.rm(assertWorkspacePath(TEMP_ROOT, 'temporary program questionnaire cleanup'), { recursive: true, force: true });

  console.log(`Program questionnaire release imported: ${RELEASE_NAME}`);
  console.log(`Program questionnaires copied: ${copied}`);
  console.log(`Database rows active/current: ${imported}`);
  console.log(`Release id: ${releaseId}`);
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
