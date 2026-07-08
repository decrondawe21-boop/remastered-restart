CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) PRIMARY KEY,
  role ENUM('admin', 'editor', 'applicant', 'client', 'volunteer', 'investor', 'patron', 'contributor', 'donor', 'user') NOT NULL,
  name VARCHAR(180) NOT NULL,
  email VARCHAR(190) NOT NULL,
  phone VARCHAR(50) NULL,
  password_hash VARCHAR(255) NOT NULL,
  password_algo VARCHAR(40) NOT NULL DEFAULT 'bcrypt',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  password_reset_required TINYINT(1) NOT NULL DEFAULT 0,
  last_login_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY users_email_unique (email),
  KEY users_role_idx (role),
  KEY users_active_idx (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE users
  MODIFY role ENUM('admin', 'editor', 'applicant', 'client', 'volunteer', 'investor', 'patron', 'contributor', 'donor', 'user') NOT NULL;

CREATE TABLE IF NOT EXISTS clients (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NULL,
  first_name VARCHAR(120) NOT NULL,
  last_name VARCHAR(120) NOT NULL,
  birth_date DATE NULL,
  phone VARCHAR(50) NULL,
  email VARCHAR(190) NULL,
  address VARCHAR(255) NULL,
  target_group VARCHAR(190) NULL,
  program VARCHAR(80) NOT NULL DEFAULT 'JAILBREAK',
  institutional_care_history VARCHAR(20) NOT NULL DEFAULT 'unknown',
  childhood_background VARCHAR(80) NOT NULL DEFAULT 'unknown',
  status VARCHAR(80) NOT NULL DEFAULT 'Nový kontakt',
  notes TEXT NULL,
  operational_id VARCHAR(64) NULL,
  created_by CHAR(36) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT clients_user_fk FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL,
  CONSTRAINT clients_created_by_fk FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE SET NULL,
  UNIQUE KEY clients_operational_id_unique (operational_id),
  KEY clients_status_idx (status),
  KEY clients_program_idx (program),
  KEY clients_name_idx (last_name, first_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE clients
  ADD COLUMN IF NOT EXISTS operational_id VARCHAR(64) NULL AFTER notes,
  ADD COLUMN IF NOT EXISTS institutional_care_history VARCHAR(20) NOT NULL DEFAULT 'unknown' AFTER program,
  ADD COLUMN IF NOT EXISTS childhood_background VARCHAR(80) NOT NULL DEFAULT 'unknown' AFTER institutional_care_history;

CREATE UNIQUE INDEX IF NOT EXISTS clients_operational_id_unique ON clients (operational_id);

CREATE TABLE IF NOT EXISTS project_applications (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  requested_role ENUM('client', 'volunteer', 'investor', 'patron', 'contributor', 'donor') NOT NULL,
  status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  phone VARCHAR(50) NULL,
  motivation TEXT NULL,
  availability TEXT NULL,
  contribution TEXT NULL,
  note TEXT NULL,
  admin_note TEXT NULL,
  reviewed_by CHAR(36) NULL,
  reviewed_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT project_applications_user_fk FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT project_applications_reviewed_by_fk FOREIGN KEY (reviewed_by) REFERENCES users (id) ON DELETE SET NULL,
  KEY project_applications_user_status_idx (user_id, status, created_at),
  KEY project_applications_status_idx (status, created_at),
  KEY project_applications_requested_role_idx (requested_role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS client_notes (
  id CHAR(36) PRIMARY KEY,
  client_id CHAR(36) NOT NULL,
  author_id CHAR(36) NULL,
  note_type VARCHAR(80) NOT NULL DEFAULT 'poznámka',
  body TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT client_notes_client_fk FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE CASCADE,
  CONSTRAINT client_notes_author_fk FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE SET NULL,
  KEY client_notes_client_created_idx (client_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS form_templates (
  id VARCHAR(80) PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  description TEXT NULL,
  schema_json JSON NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS rest_art_document_files (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE rest_art_document_files
  ADD COLUMN IF NOT EXISTS size_bytes INT NULL,
  ADD COLUMN IF NOT EXISTS source_note VARCHAR(255) NULL;

CREATE TABLE IF NOT EXISTS form_submissions (
  id CHAR(36) PRIMARY KEY,
  template_id VARCHAR(80) NOT NULL,
  client_id CHAR(36) NOT NULL,
  created_by CHAR(36) NULL,
  data_json JSON NOT NULL,
  status VARCHAR(60) NOT NULL DEFAULT 'draft',
  signed_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT form_submissions_template_fk FOREIGN KEY (template_id) REFERENCES form_templates (id),
  CONSTRAINT form_submissions_client_fk FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE CASCADE,
  CONSTRAINT form_submissions_created_by_fk FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE SET NULL,
  KEY form_submissions_client_idx (client_id, created_at),
  KEY form_submissions_status_idx (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS news (
  id CHAR(36) PRIMARY KEY,
  title VARCHAR(220) NOT NULL,
  tag VARCHAR(80) NULL,
  excerpt TEXT NOT NULL,
  body MEDIUMTEXT NULL,
  published_at DATETIME NOT NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'published',
  author_id CHAR(36) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT news_author_fk FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE SET NULL,
  KEY news_status_published_idx (status, published_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE news
  ADD COLUMN IF NOT EXISTS tag VARCHAR(80) NULL AFTER title,
  ADD COLUMN IF NOT EXISTS image_url VARCHAR(500) NULL AFTER title;

INSERT INTO news (id, title, tag, excerpt, body, published_at, status, author_id)
VALUES (
  'story-petr-s-druha-sance',
  'Petr S.: Dopis, ve kterém se člověk nechce vzdát',
  'Příběhy druhé šance',
  'Petr S. ve svém dopise popisuje cestu přes ústavní péči, ulici, výkon trestu i léčbu. Nehledá výmluvu. Hledá způsob, jak začít žít jinak.',
  '<p><strong>Tenhle příběh zveřejňujeme anonymizovaně a s respektem k soukromí klienta.</strong> Jméno je zkrácené, fotografie dopisu nezveřejňujeme a konkrétní citlivé detaily ponecháváme mimo veřejný prostor.</p><h2>Život, který začal bez pevného zázemí</h2><p>Petr S. vyrůstal od dětství mimo vlastní rodinu. Ve svém dopise se vrací k dětskému domovu, ústavní výchově, samotě a pocitu, že musel příliš brzy nést věci, kterým jako dítě nemohl rozumět.</p><p>Ve škole se dokázal držet. Nebyl člověkem bez schopností ani bez snahy. Jenže za tím, co bylo vidět navenek, zůstávala bolest, nejistota a otázka, kam vlastně patří.</p><h2>Špatná rozhodnutí a kruh, ze kterého se těžko vystupuje</h2><p>Postupně přišla ulice, špatná rozhodnutí, trestná činnost, výkon trestu i pokusy o léčbu. Petr o minulosti nepíše proto, aby ji obhajoval. Píše o ní jako o kruhu, který se bez podpory a bezpečného zázemí velmi těžko přerušuje.</p><p>Po výkonu trestu se člověk může ocitnout formálně na svobodě, ale prakticky bez opory: bez stabilního bydlení, bez práce, bez vztahů, bez režimu a často i bez důvěry, že změna může vydržet.</p><h2>To nejdůležitější není minulost, ale směr</h2><p>Nejsilnější část dopisu není popis pádu. Je to snaha říct: ještě to nechci vzdát. Petr píše o touze žít normálně, naučit se fungovat, obnovit důvěru a nezůstat sám v okamžiku, kdy přijde první těžká chvíle.</p><p>Právě tady začíná smysl programu JAILBREAK. Druhá šance není smazání minulosti. Je to konkrétní plán, kontakt, odpovědnost, práce, bydlení, režim a člověk, který pomůže udržet směr, když je návrat do běžného života křehký.</p><h2>Druhá šance v praxi</h2><p>Petrův příběh není jednoduchý a nebude jednoduchý ani další krok. Ale dopis ukazuje něco podstatného: i člověk, který prošel těžkou minulostí, může pořád nést touhu změnit směr.</p><p>Ne každý návrat se povede napoprvé. Každý návrat ale musí někde začít. Někdy jedním dopisem. Jednou větou. Jedním rozhodnutím, že minulost už nemá být jediný scénář budoucnosti.</p>',
  '2026-06-24 00:00:00',
  'published',
  NULL
)
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  tag = VALUES(tag),
  excerpt = VALUES(excerpt),
  body = VALUES(body),
  published_at = VALUES(published_at),
  status = VALUES(status);

CREATE TABLE IF NOT EXISTS news_likes (
  news_id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (news_id, user_id),
  CONSTRAINT news_likes_news_fk FOREIGN KEY (news_id) REFERENCES news (id) ON DELETE CASCADE,
  CONSTRAINT news_likes_user_fk FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  KEY news_likes_user_idx (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS news_comments (
  id CHAR(36) PRIMARY KEY,
  news_id CHAR(36) NOT NULL,
  parent_id CHAR(36) NULL,
  author_id CHAR(36) NOT NULL,
  body TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT news_comments_news_fk FOREIGN KEY (news_id) REFERENCES news (id) ON DELETE CASCADE,
  CONSTRAINT news_comments_parent_fk FOREIGN KEY (parent_id) REFERENCES news_comments (id) ON DELETE CASCADE,
  CONSTRAINT news_comments_author_fk FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE CASCADE,
  KEY news_comments_news_created_idx (news_id, created_at),
  KEY news_comments_parent_idx (parent_id),
  KEY news_comments_author_idx (author_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS home_slides (
  id CHAR(36) PRIMARY KEY,
  title VARCHAR(220) NOT NULL,
  subtitle TEXT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  cta_label VARCHAR(120) NULL,
  cta_href VARCHAR(220) NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY home_slides_active_order_idx (is_active, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS media_files (
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
  CONSTRAINT media_files_uploaded_by_fk FOREIGN KEY (uploaded_by) REFERENCES users (id) ON DELETE SET NULL,
  KEY media_files_category_idx (category),
  KEY media_files_created_idx (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS client_documents (
  id CHAR(36) PRIMARY KEY,
  client_id CHAR(36) NULL,
  user_id CHAR(36) NULL,
  media_id CHAR(36) NULL,
  title VARCHAR(220) NOT NULL,
  document_type VARCHAR(90) NOT NULL DEFAULT 'form',
  status VARCHAR(70) NOT NULL DEFAULT 'draft',
  file_url VARCHAR(500) NULL,
  notes TEXT NULL,
  created_by CHAR(36) NULL,
  signed_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT client_documents_client_fk FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE CASCADE,
  CONSTRAINT client_documents_user_fk FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT client_documents_media_fk FOREIGN KEY (media_id) REFERENCES media_files (id) ON DELETE SET NULL,
  CONSTRAINT client_documents_created_by_fk FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE SET NULL,
  KEY client_documents_client_idx (client_id, created_at),
  KEY client_documents_user_idx (user_id, created_at),
  KEY client_documents_status_idx (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS notifications (
  id CHAR(36) PRIMARY KEY,
  recipient_id CHAR(36) NULL,
  title VARCHAR(220) NOT NULL,
  body TEXT NOT NULL,
  tone VARCHAR(40) NOT NULL DEFAULT 'info',
  category VARCHAR(80) NOT NULL DEFAULT 'system',
  link_href VARCHAR(255) NULL,
  read_at DATETIME NULL,
  created_by CHAR(36) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT notifications_recipient_fk FOREIGN KEY (recipient_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT notifications_created_by_fk FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE SET NULL,
  KEY notifications_recipient_read_idx (recipient_id, read_at, created_at),
  KEY notifications_category_idx (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS password_resets (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  token_hash VARCHAR(255) NOT NULL,
  expires_at DATETIME NOT NULL,
  used_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT password_resets_user_fk FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  UNIQUE KEY password_resets_token_unique (token_hash),
  KEY password_resets_user_idx (user_id, expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS audit_log (
  id CHAR(36) PRIMARY KEY,
  actor_id CHAR(36) NULL,
  entity_type VARCHAR(80) NOT NULL,
  entity_id VARCHAR(80) NOT NULL,
  action VARCHAR(80) NOT NULL,
  payload_json JSON NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT audit_log_actor_fk FOREIGN KEY (actor_id) REFERENCES users (id) ON DELETE SET NULL,
  KEY audit_log_entity_idx (entity_type, entity_id),
  KEY audit_log_created_idx (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO form_templates (id, title, description, schema_json)
VALUES
  (
    'intake',
    'Vstupní karta klienta',
    'Základní registrační list pro první kontakt a mapování situace.',
    JSON_ARRAY(
      JSON_OBJECT('key', 'currentSituation', 'label', 'Aktuální situace klienta', 'rows', 4),
      JSON_OBJECT('key', 'urgentNeeds', 'label', 'Naléhavé potřeby', 'rows', 3),
      JSON_OBJECT('key', 'housing', 'label', 'Bydlení a zázemí', 'rows', 3),
      JSON_OBJECT('key', 'employment', 'label', 'Práce, příjem a dluhy', 'rows', 3),
      JSON_OBJECT('key', 'plannedSteps', 'label', 'První domluvené kroky', 'rows', 4)
    )
  ),
  (
    'consent',
    'Souhlas se zapojením do programu',
    'Tiskový list pro potvrzení účasti, sdílení údajů a předání základních informací.',
    JSON_ARRAY(
      JSON_OBJECT('key', 'programScope', 'label', 'Rozsah podpory a zapojený program', 'rows', 4),
      JSON_OBJECT('key', 'dataScope', 'label', 'Rozsah zpracování a sdílení údajů', 'rows', 4),
      JSON_OBJECT('key', 'clientDeclaration', 'label', 'Prohlášení klienta', 'rows', 4)
    )
  ),
  (
    'stabilization',
    'Stabilizační plán',
    'Pracovní plán kroků, cílů, odpovědností a další kontroly.',
    JSON_ARRAY(
      JSON_OBJECT('key', 'mainGoal', 'label', 'Hlavní cíl na období', 'rows', 3),
      JSON_OBJECT('key', 'workPlan', 'label', 'Práce a příjem', 'rows', 3),
      JSON_OBJECT('key', 'housingPlan', 'label', 'Bydlení a bezpečné zázemí', 'rows', 3),
      JSON_OBJECT('key', 'supportPlan', 'label', 'Mentoring, zdraví a návazné služby', 'rows', 4),
      JSON_OBJECT('key', 'nextReview', 'label', 'Termín dalšího vyhodnocení', 'rows', 2)
    )
  )
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  description = VALUES(description),
  schema_json = VALUES(schema_json),
  is_active = 1;

INSERT INTO home_slides (id, title, subtitle, image_url, cta_label, cta_href, sort_order, is_active)
VALUES
  (
    'slide-vstup',
    'Zázemí, které roste krok za krokem',
    'To, co začíná jako malé semínko, může časem vytvořit bezpečný průchod.',
    '/images/crops/streetwise/streetwise-klenba.jpg',
    'STREETWISE',
    '#/programy',
    10,
    1
  ),
  (
    'slide-zazemi',
    'Z odepsaného vzniká zázemí',
    'Z nalezeného dřeva a materiálu stavíme prostor, který může sloužit dál.',
    '/images/crops/streetwise/streetwise-zelena-stena.jpg',
    'Jak pracujeme',
    '#/co-delame',
    20,
    1
  ),
  (
    'slide-detail',
    'Trpělivá péče má smysl',
    'Růže, zázemí i lidská změna rostou tehdy, když dostanou čas a oporu.',
    '/images/crops/streetwise/streetwise-ruze-detail.jpg',
    'Zapojit se',
    '#/zapojeni',
    30,
    1
  ),
  (
    'slide-streetwise-cesta',
    'Střecha pro první krok',
    'STREETWISE buduje bezpečné místo pro kontakt, podporu a první stabilní krok.',
    '/images/crops/streetwise/streetwise-cesta-branka.jpg',
    'Potřebuji pomoc',
    '#/kontakt',
    40,
    1
  ),
  (
    'slide-streetwise-bouda',
    'Stavíme z toho, co ještě může sloužit',
    'Dřevo z demolic, ruce, trpělivost a víra v druhou šanci. Pro věci i pro lidi.',
    '/images/crops/streetwise/streetwise-bouda-stavba.jpg',
    'Druhá šance v praxi',
    '#/co-delame',
    50,
    1
  ),
  (
    'slide-01',
    'REST||ART Integrace',
    'Neziskový projekt druhých šancí.',
    '/images/01.png',
    'Zobrazit programy',
    '#/programy',
    100,
    0
  ),
  (
    'slide-04',
    'Vizuál 04',
    'REST||ART Integrace - banner 04.',
    '/images/04.png',
    'Zobrazit programy',
    '#/programy',
    40,
    0
  ),
  (
    'slide-05',
    'Vizuál 05',
    'REST||ART Integrace - banner 05.',
    '/images/05.png',
    'Zobrazit programy',
    '#/programy',
    50,
    0
  ),
  (
    'slide-06',
    'Vizuál 06',
    'REST||ART Integrace - banner 06.',
    '/images/06.png',
    'Zobrazit programy',
    '#/programy',
    60,
    0
  ),
  (
    'slide-07',
    'Vizuál 07',
    'REST||ART Integrace - banner 07.',
    '/images/07.png',
    'Zobrazit programy',
    '#/programy',
    70,
    0
  ),
  (
    'slide-08',
    'Vizuál 08',
    'REST||ART Integrace - banner 08.',
    '/images/08.png',
    'Zobrazit programy',
    '#/programy',
    80,
    0
  ),
  (
    'slide-09',
    'Vizuál 09',
    'REST||ART Integrace - banner 09.',
    '/images/09.png',
    'Zobrazit programy',
    '#/programy',
    90,
    0
  ),
  (
    'slide-10',
    'Vizuál 10',
    'REST||ART Integrace - banner 10.',
    '/images/10.png',
    'Zobrazit programy',
    '#/programy',
    100,
    0
  ),
  (
    'slide-11',
    'Vizuál 11',
    'REST||ART Integrace - banner 11.',
    '/images/11.png',
    'Zobrazit programy',
    '#/programy',
    110,
    0
  ),
  (
    'slide-12',
    'Vizuál 12',
    'REST||ART Integrace - banner 12.',
    '/images/12.png',
    'Zobrazit programy',
    '#/programy',
    120,
    0
  ),
  (
    'slide-13',
    'Vizuál 13',
    'REST||ART Integrace - banner 13.',
    '/images/13.png',
    'Zobrazit programy',
    '#/programy',
    130,
    0
  ),
  (
    'slide-14',
    'Vizuál 14',
    'REST||ART Integrace - banner 14.',
    '/images/14.png',
    'Zobrazit programy',
    '#/programy',
    140,
    0
  ),
  (
    'slide-15',
    'Vizuál 15',
    'REST||ART Integrace - banner 15.',
    '/images/15.png',
    'Zobrazit programy',
    '#/programy',
    150,
    0
  ),
  (
    'slide-16',
    'Vizuál 16',
    'REST||ART Integrace - banner 16.',
    '/images/16.png',
    'Zobrazit programy',
    '#/programy',
    160,
    0
  ),
  (
    'slide-17',
    'Vizuál 17',
    'REST||ART Integrace - banner 17.',
    '/images/17.png',
    'Zobrazit programy',
    '#/programy',
    170,
    0
  ),
  (
    'slide-18',
    'Vizuál 18',
    'REST||ART Integrace - banner 18.',
    '/images/18.png',
    'Zobrazit programy',
    '#/programy',
    180,
    0
  ),
  (
    'slide-19',
    'Vizuál 19',
    'REST||ART Integrace - banner 19.',
    '/images/19.png',
    'Zobrazit programy',
    '#/programy',
    190,
    0
  ),
  (
    'slide-20',
    'Vizuál 20',
    'REST||ART Integrace - banner 20.',
    '/images/20.png',
    'Zobrazit programy',
    '#/programy',
    200,
    0
  )
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  subtitle = VALUES(subtitle),
  image_url = VALUES(image_url),
  cta_label = VALUES(cta_label),
  cta_href = VALUES(cta_href),
  sort_order = VALUES(sort_order),
  is_active = VALUES(is_active);

UPDATE home_slides
SET is_active = 0
WHERE id LIKE 'slide-home-%'
   OR id IN ('slide-02', 'slide-03');
