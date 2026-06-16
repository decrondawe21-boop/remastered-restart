const fs = require('node:fs/promises');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { loadDotEnv } = require('../server/env.cjs');
const { getPool, query } = require('../server/db.cjs');

loadDotEnv();

const zipPath =
  process.argv[2] ||
  process.env.RESTART_FORM_RELEASE_ZIP ||
  'I:\\dkozak\\AKTUAL_REST_ART_FORMULARE_AKTUALNI_PROVOZNI_BALIK_v1_2.zip';

const ARCHIVE_ROOT = 'REST_ART_PROVOZNI_FORMULARE_RELEASE_BARCODE_v1_2';
const RELEASE_NAME = 'REST_ART_FORMULARE_AKTUALNI_PROVOZNI_BALIK_v1_2';
const RELEASE_CODE = 'REST_ART_PROVOZNI_FORMULARE_RELEASE';
const RELEASE_VERSION = 'v1.2';
const MANIFEST_ENTRY = `${ARCHIVE_ROOT}/00_README_A_MANIFEST/MANIFEST_RELEASE_BARCODE_v1_2.json`;
const PUBLIC_FORMS_ROOT = path.join(process.cwd(), 'public', 'documents', 'forms');
const PUBLIC_TRANSPARENCY_ROOT = path.join(process.cwd(), 'public', 'documents', 'transparency');
const PUBLIC_RELEASE_ROOT = path.join(process.cwd(), 'public', 'documents', 'releases', RELEASE_NAME);
const TEMP_ROOT = path.join(process.cwd(), '.tmp-form-release-v1-2');
const required = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
const PROJECT_ONE_PAGE_UID = 'RAI-DOC-PROJ-001';
const GDPR_WITHDRAWAL_UID = 'RAI-FRM-GDPR-013';

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

function publicFormPath(file) {
  return `/documents/forms/${file.relative_path.replace(/\\/g, '/')}`;
}

function safeRelativePath(relativePath) {
  const normalized = String(relativePath || '').replace(/\\/g, '/');
  if (!normalized || normalized.includes('..') || path.isAbsolute(normalized)) {
    throw new Error(`Unsafe manifest path: ${relativePath}`);
  }
  return normalized;
}

function valueOrNull(value) {
  return value === undefined || value === null || value === '' ? null : value;
}

function boolNumber(value, fallback = 0) {
  if (value === undefined || value === null || value === '') return fallback;
  return value ? 1 : 0;
}

function sourceNoteFor(file) {
  return [`barcode_release_v1_2`, file.sha256_hash ? `sha256=${file.sha256_hash}` : '']
    .filter(Boolean)
    .join('; ')
    .slice(0, 255);
}

function isAllInOne(file) {
  return Boolean(file.is_all_in_one) || file.category_code === '99_ALL_IN_ONE_VOLITELNE' || String(file.form_uid || '').startsWith('RAI-AIO-');
}

function isProjectOnePage(file) {
  return file.form_uid === PROJECT_ONE_PAGE_UID || /ONE_PAGE_PROJEKT/i.test(file.file_name || '');
}

function isPublicMethodology(file) {
  return String(file.form_uid || '').startsWith('RAI-MET-') || /METODIKA/i.test(file.file_name || '');
}

function isPublicGdprWithdrawal(file) {
  return file.form_uid === GDPR_WITHDRAWAL_UID || /ODVOLANI_NEBO_OMEZENI_SOUHLASU/i.test(file.file_name || '');
}

function publicDocumentDefinition(file) {
  if (isProjectOnePage(file)) {
    return {
      id: 'rest-art-one-page-projekt-2026-v1-5',
      title: 'REST||ART One page projektu 2026',
      altText: 'Veřejný one-page dokument projektu REST||ART Integrace'
    };
  }
  if (isPublicMethodology(file)) {
    return {
      id: `rest-art-public-${toSlug(file.form_uid || file.file_name)}`,
      title: file.title || 'REST||ART metodika programu',
      altText: 'Veřejná metodika programu REST||ART Integrace'
    };
  }
  if (isPublicGdprWithdrawal(file)) {
    return {
      id: 'rest-art-gdpr-odvolani-omezeni-souhlasu',
      title: 'GDPR - Odvolání nebo omezení souhlasu',
      altText: 'Veřejný formulář pro odvolání nebo omezení souhlasu se zpracováním osobních údajů'
    };
  }
  return null;
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

  await query(
    `CREATE TABLE IF NOT EXISTS media_files (
      id CHAR(36) PRIMARY KEY,
      title VARCHAR(220) NOT NULL,
      file_name VARCHAR(255) NOT NULL,
      file_url VARCHAR(500) NOT NULL,
      mime_type VARCHAR(120) NULL,
      file_size INT NULL,
      category VARCHAR(80) NOT NULL DEFAULT 'image',
      alt_text VARCHAR(255) NULL,
      uploaded_by CHAR(36) NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      KEY media_files_category_idx (category),
      KEY media_files_created_idx (created_at)
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
    'REST||ART provozní formuláře release v1.2 barcode',
    RELEASE_VERSION,
    RELEASE_NAME,
    `/documents/releases/${RELEASE_NAME}`,
    'directory',
    'active',
    'Aktuální provozní balík v1.2: formuláře s čárovými kódy, manifestem a provozními importy.'
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

async function archiveAllDocuments() {
  await query(
    `UPDATE rest_art_document_files
     SET status = 'legacy', is_current = 0
     WHERE file_type = 'pdf'
       AND (status <> 'legacy' OR is_current <> 0)`
  );
}

async function upsertDocument(file, releaseId, index) {
  const relativePath = safeRelativePath(file.relative_path);
  const filePath = publicFormPath(file);
  const sourceFile = path.join(PUBLIC_FORMS_ROOT, ...relativePath.split('/'));
  const stats = await fs.stat(sourceFile);
  const existing = await query(
    'SELECT id FROM rest_art_document_files WHERE form_uid = ? OR file_path = ? ORDER BY is_current DESC, id DESC LIMIT 1',
    [file.form_uid, filePath]
  );

  const id = existing.length > 0 ? existing[0].id : toSlug(`${file.form_uid || file.document_code || file.file_name}-${RELEASE_VERSION}`);
  const values = [
    releaseId,
    valueOrNull(file.form_uid),
    valueOrNull(file.form_group),
    file.category_code,
    file.category_title,
    valueOrNull(file.form_uid || file.document_code),
    file.title,
    valueOrNull(file.version),
    file.file_name,
    filePath,
    'pdf',
    boolNumber(file.is_fillable, 1),
    boolNumber(file.is_all_in_one, 0),
    valueOrNull(file.sensitivity) || 'standard',
    'active',
    1,
    boolNumber(file.crm_use, 1),
    boolNumber(file.reporting_export, 0),
    `${RELEASE_NAME}; ${file.notes || 'formulář s čárovým kódem'}`,
    Number(file.sort_order || index + 1),
    Number(file.size_bytes || stats.size || 0),
    sourceNoteFor(file)
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

async function copyPublicForms(manifest, extractedRoot) {
  const formsRoot = await clearDirectory(PUBLIC_FORMS_ROOT, 'public forms root');
  let copied = 0;

  for (const file of manifest) {
    const relativePath = safeRelativePath(file.relative_path);
    const source = path.join(extractedRoot, ...relativePath.split('/'));
    const target = path.join(formsRoot, ...relativePath.split('/'));
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.copyFile(source, target);
    copied += 1;
  }

  return copied;
}

async function copyPublicDocument(file, extractedRoot) {
  const definition = publicDocumentDefinition(file);
  if (!definition) return null;

  const relativePath = safeRelativePath(file.relative_path);
  const source = path.join(extractedRoot, ...relativePath.split('/'));
  const targetDir = assertWorkspacePath(PUBLIC_TRANSPARENCY_ROOT, 'public transparency root');
  const target = path.join(targetDir, file.file_name);

  await fs.mkdir(targetDir, { recursive: true });
  await fs.copyFile(source, target);

  const stats = await fs.stat(target);
  return {
    id: definition.id,
    title: definition.title,
    fileName: file.file_name,
    fileUrl: `/documents/transparency/${file.file_name}`,
    mimeType: 'application/pdf',
    fileSize: Number(file.size_bytes || stats.size || 0),
    category: 'transparency',
    altText: definition.altText
  };
}

async function upsertPublicMedia(media) {
  if (!media) return false;

  await query(
    `INSERT INTO media_files (id, title, file_name, file_url, mime_type, file_size, category, alt_text, uploaded_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL)
     ON DUPLICATE KEY UPDATE
       title = VALUES(title),
       file_name = VALUES(file_name),
       file_url = VALUES(file_url),
       mime_type = VALUES(mime_type),
       file_size = VALUES(file_size),
       category = VALUES(category),
       alt_text = VALUES(alt_text)`,
    [
      media.id,
      media.title,
      media.fileName,
      media.fileUrl,
      media.mimeType,
      media.fileSize,
      media.category,
      media.altText
    ]
  );

  return true;
}

async function copyReleaseArchive(extractedRoot) {
  const releaseRoot = await clearDirectory(PUBLIC_RELEASE_ROOT, 'public release root');
  await fs.cp(extractedRoot, releaseRoot, { recursive: true });
  return releaseRoot;
}

(async () => {
  if (!zipPath) fail('Missing ZIP path.');
  for (const key of required) {
    if (!process.env[key]) fail(`Missing required environment variable: ${key}`);
  }

  await fs.access(zipPath);
  const tempRoot = await clearDirectory(TEMP_ROOT, 'temporary release root');
  extractArchive(tempRoot);

  const extractedRoot = path.join(tempRoot, ARCHIVE_ROOT);
  await fs.access(extractedRoot);

  const manifest = JSON.parse(readArchiveText(MANIFEST_ENTRY));
  if (!Array.isArray(manifest) || manifest.length === 0) {
    fail('Release manifest is empty or invalid.');
  }
  const publicDocuments = manifest.filter((file) => isProjectOnePage(file) || isPublicMethodology(file) || isPublicGdprWithdrawal(file));
  const operationalForms = manifest.filter((file) => !isAllInOne(file) && !isProjectOnePage(file) && !isPublicMethodology(file));

  await copyReleaseArchive(extractedRoot);
  const copied = await copyPublicForms(operationalForms, extractedRoot);
  const publicMediaItems = [];
  for (const file of publicDocuments) {
    const media = await copyPublicDocument(file, extractedRoot);
    if (media) publicMediaItems.push(media);
  }

  await ensureSchema();
  const releaseId = await upsertRelease();
  await archiveAllDocuments();
  for (const media of publicMediaItems) {
    await upsertPublicMedia(media);
  }

  let imported = 0;
  for (const [index, file] of operationalForms.entries()) {
    await upsertDocument(file, releaseId, index);
    imported += 1;
  }

  await clearDirectory(TEMP_ROOT, 'temporary release root cleanup');
  await fs.rm(TEMP_ROOT, { recursive: true, force: true });

  console.log(`Release imported: ${RELEASE_NAME}`);
  console.log(`Public forms replaced: ${copied}`);
  console.log(`All-in-one files excluded: ${manifest.filter(isAllInOne).length}`);
  console.log(`Public documents copied: ${publicMediaItems.map((item) => item.fileUrl).join(', ') || 'none'}`);
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
