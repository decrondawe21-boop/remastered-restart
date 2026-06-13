const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const { loadDotEnv } = require('../server/env.cjs');
const { getPool, query } = require('../server/db.cjs');

loadDotEnv();

const RELEASE_NAME = 'REST_ART_PROVOZNI_FORMULARE_RELEASE_v1_1';
const RELEASE_CODE = 'REST_ART_PROVOZNI_FORMULARE_RELEASE';
const RELEASE_VERSION = 'v1.1';
const SOURCE_ROOT = process.env.RESTART_BRAND_DOCS || 'I:\\RESTART-DOKUMENTACE BRAND';
const PROVOZ_ROOT = path.join(SOURCE_ROOT, 'PROVOZ');
const PUBLIC_FORMS_ROOT = path.join(process.cwd(), 'public', 'documents', 'forms');
const PUBLIC_RELEASE_ROOT = path.join(process.cwd(), 'public', 'documents', 'releases', RELEASE_NAME);
const MANIFEST_DIR = path.join(PUBLIC_RELEASE_ROOT, '00_README_A_MANIFEST');
const REQUIRED_ENV = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];

const categoryTitles = {
  '01_GDPR_A_SOUHLASY': 'GDPR a souhlasy',
  '02_KLIENTSKA_SLOZKA': 'Klientská složka',
  '03_INTERVENCE': 'Intervence',
  '04_KRIZOVY_REZIM': 'Krizový režim',
  '05_EVALUACE_A_FOLLOW_UP': 'Evaluace a follow-up',
  '06_REGISTRY': 'Registry',
  '07_ETIKA_A_TYM': 'Etika a tým',
  '08_DOPLNKOVE_LISTY': 'Doplňkové listy',
  '99_ALL_IN_ONE_VOLITELNE': 'Volitelné all-in-one balíčky'
};

const categoryGroups = {
  '01_GDPR_A_SOUHLASY': 'GDPR',
  '02_KLIENTSKA_SLOZKA': 'KLIENT',
  '03_INTERVENCE': 'INTERVENCE',
  '04_KRIZOVY_REZIM': 'KRIZE',
  '05_EVALUACE_A_FOLLOW_UP': 'EVALUACE',
  '06_REGISTRY': 'REGISTRY',
  '07_ETIKA_A_TYM': 'ETIKA',
  '08_DOPLNKOVE_LISTY': 'DOPLNKY',
  '99_ALL_IN_ONE_VOLITELNE': 'ALL_IN_ONE'
};

function fail(message) {
  console.error(message);
  process.exit(1);
}

function stripDiacritics(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function slug(value) {
  return stripDiacritics(value)
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function titleFromFileName(fileName) {
  return fileName
    .replace(/\.pdf$/i, '')
    .replace(/^RAI-FRM-/, '')
    .replace(/^REST_ART_/, '')
    .replace(/_FILLABLE.*$/i, '')
    .replace(/_CONTENT_LOCKED.*$/i, '')
    .replace(/_A4_LANDSCAPE.*$/i, '')
    .replace(/_COMPACT.*$/i, '')
    .split(/[_-]+/)
    .filter(Boolean)
    .map((part) => {
      if (/^(RAI|FRM|GDPR|REST|ART|A4|QR|ID)$/i.test(part) || /^\d+$/.test(part)) return part.toUpperCase();
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    })
    .join(' ');
}

function versionFromFileName(fileName) {
  const match = fileName.match(/_v(\d+(?:_\d+)?)/i);
  return match ? `v${match[1].replace('_', '.')}` : RELEASE_VERSION;
}

function uidFromFileName(fileName) {
  const rai = fileName.match(/^(RAI-FRM-GDPR-\d+)/i);
  if (rai) return rai[1].toUpperCase();
  const rules = [
    [/JAILBREAK_DOTAZNIK/i, 'REST-JAILBREAK-001'],
    [/INTAKE_FORM/i, 'REST-INTAKE-001'],
    [/KNIHA_KLIENTA/i, 'REST-KNIHA-KLIENTA-001'],
    [/EXIT_FORM/i, 'REST-EXIT-001'],
    [/KNIHA_INTERVENCI/i, 'REST-KNIHA-INTERVENCI-001'],
    [/KNIHA_KRIZOVYCH_INTERVENCI/i, 'REST-KNIHA-KRIZOVYCH-INTERVENCI-001'],
    [/FOLLOW_UP_TRACKING/i, 'REST-FOLLOW-UP-001'],
    [/STABILIZACNI_INDEX/i, 'REST-STABILIZACNI-INDEX-001'],
    [/EVIDENCE_KOMUNITNICH_AKTIVIT/i, 'REST-EVIDENCE-KOMUNITNICH-AKTIVIT-001'],
    [/REGISTR_DOBROVOLNIKU/i, 'REST-REGISTR-DOBROVOLNIKU-001'],
    [/REGISTR_PARTNERU/i, 'REST-REGISTR-PARTNERU-001'],
    [/REGISTR_RIZIK/i, 'REST-REGISTR-RIZIK-001'],
    [/REGISTR_STIZNOSTI/i, 'REST-REGISTR-STIZNOSTI-001'],
    [/MLCENLIVOST_ETICKY_ZAVAZEK/i, 'REST-MLCENLIVOST-ETICKY-ZAVAZEK-001'],
    [/LIST_INCIDENTU/i, 'REST-LIST-INCIDENTU-001'],
    [/LIST_HRANIC_PODPORY/i, 'REST-LIST-HRANIC-PODPORY-001'],
    [/DOPLNKOVE_LISTY_INCIDENTY_HRANICE/i, 'REST-DOPLNKOVE-LISTY-ALL-IN-ONE-001'],
    [/GDPR_BALICEK_FILLABLE_ALL_TYPES/i, 'REST-GDPR-BALICEK-ALL-IN-ONE-001'],
    [/REGISTRY_FILLABLE/i, 'REST-REGISTRY-ALL-IN-ONE-001']
  ];
  return rules.find(([pattern]) => pattern.test(fileName))?.[1] || `REST-${slug(fileName.replace(/\.pdf$/i, ''))}`;
}

function sensitivityFor(categoryCode, fileName) {
  if (categoryCode.includes('GDPR')) return 'gdpr';
  if (categoryCode.includes('KRIZOVY') || /INCIDENT|RIZIK/i.test(fileName)) return 'citlivé';
  if (categoryCode.includes('KLIENTSKA') || categoryCode.includes('INTERVENCE')) return 'klientské';
  return 'standard';
}

function isAllInOne(fileName, categoryCode) {
  return categoryCode.startsWith('99_') || /ALL_IN_ONE/i.test(fileName);
}

function csvEscape(value) {
  const text = String(value ?? '');
  return /[",\r\n;]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function listPdfFiles(folder) {
  const items = await fs.readdir(folder, { withFileTypes: true });
  const files = [];
  for (const item of items) {
    const itemPath = path.join(folder, item.name);
    if (item.isDirectory()) {
      files.push(...await listPdfFiles(itemPath));
    } else if (/\.pdf$/i.test(item.name)) {
      files.push(itemPath);
    }
  }
  return files;
}

async function collectReleaseFiles() {
  const files = [];

  const raiGdprFiles = (await fs.readdir(SOURCE_ROOT, { withFileTypes: true }))
    .filter((item) => item.isFile() && /^RAI-FRM-GDPR-.*\.pdf$/i.test(item.name))
    .map((item) => path.join(SOURCE_ROOT, item.name))
    .sort((left, right) => path.basename(left).localeCompare(path.basename(right), 'cs'));

  for (const sourcePath of raiGdprFiles) {
    files.push({ sourcePath, categoryCode: '01_GDPR_A_SOUHLASY', formGroup: 'GDPR', sourceNote: 'RAI GDPR ostrý provoz v1.1, čárový kód' });
  }

  const provozFiles = await listPdfFiles(PROVOZ_ROOT);
  for (const sourcePath of provozFiles) {
    const relative = path.relative(PROVOZ_ROOT, sourcePath);
    const categoryCode = relative.split(path.sep)[0];
    if (categoryCode === '00_README_A_MANIFEST' || categoryCode === '01_GDPR_A_SOUHLASY') continue;
    files.push({
      sourcePath,
      categoryCode,
      formGroup: categoryGroups[categoryCode] || slug(categoryCode),
      sourceNote: 'PROVOZ final content locked'
    });
  }

  const jailbreakPath = path.join(SOURCE_ROOT, 'REST_ART_JAILBREAK_DOTAZNIK_FILLABLE_v1_5_CONTENT_LOCKED.pdf');
  if (await pathExists(jailbreakPath)) {
    files.push({ sourcePath: jailbreakPath, categoryCode: '03_INTERVENCE', formGroup: 'JAILBREAK', sourceNote: 'JAILBREAK dotazník ostrý provoz' });
  }

  const seen = new Set();
  return files
    .map((file, index) => {
      const fileName = path.basename(file.sourcePath);
      const formUid = uidFromFileName(fileName);
      const publicPath = `/documents/forms/${file.categoryCode}/${fileName}`;
      const releasePath = `/documents/releases/${RELEASE_NAME}/${file.categoryCode}/${fileName}`;
      const statPromise = fs.stat(file.sourcePath);
      return { ...file, fileName, formUid, publicPath, releasePath, statPromise, sortOrder: (index + 1) * 10 };
    })
    .filter((file) => {
      const key = `${file.categoryCode}/${file.fileName}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

async function ensureSchema() {
  const columns = await query(
    `SELECT COLUMN_NAME AS columnName
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'rest_art_document_files'`,
    [process.env.DB_NAME]
  );
  const existing = new Set(columns.map((row) => row.columnName));
  if (!existing.has('form_uid')) {
    await query('ALTER TABLE rest_art_document_files ADD form_uid VARCHAR(50) NULL AFTER id');
  }
  if (!existing.has('form_group')) {
    await query('ALTER TABLE rest_art_document_files ADD form_group VARCHAR(50) NULL AFTER form_uid');
  }
  if (!existing.has('is_current')) {
    await query('ALTER TABLE rest_art_document_files ADD is_current TINYINT(1) DEFAULT 1 AFTER status');
  }

  const indexes = await query(
    `SELECT INDEX_NAME AS indexName
     FROM INFORMATION_SCHEMA.STATISTICS
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'rest_art_document_files'`,
    [process.env.DB_NAME]
  );
  const indexNames = new Set(indexes.map((row) => row.indexName));
  if (!indexNames.has('rest_art_document_files_uid_idx')) {
    await query('ALTER TABLE rest_art_document_files ADD INDEX rest_art_document_files_uid_idx (form_uid)');
  }
  if (!indexNames.has('rest_art_document_files_current_idx')) {
    await query('ALTER TABLE rest_art_document_files ADD INDEX rest_art_document_files_current_idx (is_current, status)');
  }
}

async function upsertRelease() {
  const existing = await query(
    'SELECT id FROM rest_art_document_releases WHERE release_code = ? AND version = ? ORDER BY id DESC LIMIT 1',
    [RELEASE_CODE, RELEASE_VERSION]
  );
  if (existing.length > 0) {
    await query(
      `UPDATE rest_art_document_releases
       SET title = ?, file_name = ?, file_path = ?, file_type = ?, status = ?, description = ?
       WHERE id = ?`,
      [
        'REST||ART provozní formuláře release v1.1',
        RELEASE_NAME,
        `/documents/releases/${RELEASE_NAME}`,
        'directory',
        'active',
        'Ostrý release provozních formulářů v1.1: GDPR RAI formuláře s čárovým kódem, JAILBREAK dotazník a provozní sada formulářů.',
        existing[0].id
      ]
    );
    return existing[0].id;
  }

  const result = await query(
    `INSERT INTO rest_art_document_releases
       (release_code, title, version, file_name, file_path, file_type, status, description)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      RELEASE_CODE,
      'REST||ART provozní formuláře release v1.1',
      RELEASE_VERSION,
      RELEASE_NAME,
      `/documents/releases/${RELEASE_NAME}`,
      'directory',
      'active',
      'Ostrý release provozních formulářů v1.1: GDPR RAI formuláře s čárovým kódem, JAILBREAK dotazník a provozní sada formulářů.'
    ]
  );
  return result.insertId;
}

async function copyReleaseFile(file) {
  const formsTarget = path.join(PUBLIC_FORMS_ROOT, file.categoryCode, file.fileName);
  const releaseTarget = path.join(PUBLIC_RELEASE_ROOT, file.categoryCode, file.fileName);
  await fs.mkdir(path.dirname(formsTarget), { recursive: true });
  await fs.mkdir(path.dirname(releaseTarget), { recursive: true });
  await fs.copyFile(file.sourcePath, formsTarget);
  await fs.copyFile(file.sourcePath, releaseTarget);
}

async function sha256(filePath) {
  const buffer = await fs.readFile(filePath);
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

async function upsertDocument(file, releaseId, index) {
  const title = titleFromFileName(file.fileName);
  const version = versionFromFileName(file.fileName);
  const isAll = isAllInOne(file.fileName, file.categoryCode);
  const notes = `${RELEASE_NAME}; ${file.sourceNote}`;
  const existing = await query(
    'SELECT id FROM rest_art_document_files WHERE form_uid = ? OR file_path = ? ORDER BY is_current DESC, id DESC LIMIT 1',
    [file.formUid, file.publicPath]
  );
  const params = [
    releaseId,
    file.formUid,
    file.formGroup,
    file.categoryCode,
    categoryTitles[file.categoryCode] || titleFromFileName(file.categoryCode),
    file.formUid,
    title,
    version,
    file.fileName,
    file.publicPath,
    'pdf',
    1,
    isAll ? 1 : 0,
    sensitivityFor(file.categoryCode, file.fileName),
    'active',
    1,
    1,
    isAll ? 0 : 1,
    notes,
    (index + 1) * 10,
    file.sizeBytes,
    `${file.sourceNote}; sha256=${file.sha256}`
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
      [...params, existing[0].id]
    );
    return existing[0].id;
  }

  const result = await query(
    `INSERT INTO rest_art_document_files
       (release_id, form_uid, form_group, category_code, category_title, document_code, title, version, file_name, file_path,
        file_type, is_fillable, is_all_in_one, sensitivity, status, is_current, crm_use, reporting_export, notes, sort_order, size_bytes, source_note)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    params
  );
  return result.insertId;
}

async function archiveLegacyDocuments(categoryCodes, releaseId) {
  await query(
    `UPDATE rest_art_document_files
     SET status = 'legacy', is_current = 0
     WHERE file_type = 'pdf'
       AND release_id <> ?
       AND category_code IN (${categoryCodes.map(() => '?').join(',')})
       AND (status <> 'legacy' OR is_current <> 0)`,
    [releaseId, ...categoryCodes]
  );
}

async function writeReleaseDocs(files) {
  await fs.mkdir(MANIFEST_DIR, { recursive: true });
  const now = new Date().toISOString();
  const manifest = {
    release: RELEASE_NAME,
    version: RELEASE_VERSION,
    createdAt: now,
    sourceRoot: SOURCE_ROOT,
    publicFormsRoot: '/documents/forms',
    publicReleaseRoot: `/documents/releases/${RELEASE_NAME}`,
    countFiles: files.length,
    files: files.map((file) => ({
      form_uid: file.formUid,
      form_group: file.formGroup,
      category_code: file.categoryCode,
      category_title: categoryTitles[file.categoryCode] || file.categoryCode,
      title: titleFromFileName(file.fileName),
      version: versionFromFileName(file.fileName),
      file_name: file.fileName,
      file_path: file.publicPath,
      release_path: file.releasePath,
      status: 'active',
      is_current: 1,
      size_bytes: file.sizeBytes,
      sha256: file.sha256,
      source_note: file.sourceNote
    }))
  };
  const csvHeader = ['form_uid', 'form_group', 'category_code', 'title', 'version', 'file_name', 'file_path', 'status', 'is_current', 'size_bytes', 'sha256'];
  const csvRows = [
    csvHeader.join(';'),
    ...manifest.files.map((file) => csvHeader.map((field) => csvEscape(file[field])).join(';'))
  ];

  await fs.writeFile(path.join(MANIFEST_DIR, 'MANIFEST_DB_WEB.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  await fs.writeFile(path.join(MANIFEST_DIR, 'MANIFEST_DB_WEB.csv'), `${csvRows.join('\n')}\n`, 'utf8');
  await fs.writeFile(path.join(MANIFEST_DIR, 'SEZNAM_ID_FORMULARU.csv'), `${csvRows.join('\n')}\n`, 'utf8');
  await fs.writeFile(
    path.join(MANIFEST_DIR, 'CHANGELOG_v1_1.md'),
    `# CHANGELOG ${RELEASE_NAME}\n\n- Uzavřen ostrý release provozních formulářů ${RELEASE_VERSION}.\n- Aktivní GDPR sada nahrazena RAI-FRM-GDPR formuláři s čárovým kódem.\n- Doplněn JAILBREAK dotazník do provozní sady.\n- Doplněn manifest pro DB/web v JSON a CSV.\n- Starší záznamy v DB se při importu označují jako legacy, historie se nemaže.\n`,
    'utf8'
  );
  await fs.writeFile(
    path.join(MANIFEST_DIR, 'RELEASE_PROTOKOL_v1_1.md'),
    `# Release protokol ${RELEASE_NAME}\n\nDatum: ${now.slice(0, 10)}\nVerze: ${RELEASE_VERSION}\nPočet souborů: ${files.length}\n\n## Pilotní workflow\n\n1. GDPR\n2. Intake\n3. JAILBREAK dotazník\n4. Kniha klienta\n5. Intervence\n6. Stabilizační index\n7. Follow-up\n8. Exit\n\n## Provozní pravidla\n\n- Staré formuláře zůstávají v historii jako legacy.\n- Nové formuláře jsou označené jako active/current.\n- Další změny zapisovat do changelogu.\n`,
    'utf8'
  );
  await fs.mkdir(path.join(PUBLIC_RELEASE_ROOT, 'TEST-REST-0001'), { recursive: true });
  await fs.writeFile(
    path.join(PUBLIC_RELEASE_ROOT, 'TEST-REST-0001', 'PILOTNI_SLOZKA_TEST-REST-0001.md'),
    `# Pilotní klientská složka TEST-REST-0001\n\n- [ ] GDPR\n- [ ] Intake\n- [ ] JAILBREAK dotazník\n- [ ] Kniha klienta\n- [ ] Intervence\n- [ ] Stabilizační index\n- [ ] Follow-up\n- [ ] Exit\n\nPoznámka: testovací složka slouží jen pro ověření workflow, neobsahuje osobní údaje.\n`,
    'utf8'
  );
}

(async () => {
  for (const key of REQUIRED_ENV) {
    if (!process.env[key]) fail(`Missing required environment variable: ${key}`);
  }

  const files = await collectReleaseFiles();
  if (files.length === 0) fail(`No release PDFs found in ${SOURCE_ROOT}`);

  for (const file of files) {
    const stat = await file.statPromise;
    file.sizeBytes = stat.size;
    file.sha256 = await sha256(file.sourcePath);
    await copyReleaseFile(file);
  }

  await writeReleaseDocs(files);
  await ensureSchema();
  const releaseId = await upsertRelease();
  const categoryCodes = [...new Set(files.map((file) => file.categoryCode))];
  await archiveLegacyDocuments(categoryCodes, releaseId);

  let upserted = 0;
  for (const [index, file] of files.entries()) {
    await upsertDocument(file, releaseId, index);
    upserted += 1;
  }

  console.log(`${RELEASE_NAME}: ${upserted} files imported.`);
  console.log(`Release root: ${PUBLIC_RELEASE_ROOT}`);
  console.log(`Forms root: ${PUBLIC_FORMS_ROOT}`);
})()
  .catch(async (error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    try {
      await getPool().end();
    } catch {
      // ignore shutdown errors
    }
  });
