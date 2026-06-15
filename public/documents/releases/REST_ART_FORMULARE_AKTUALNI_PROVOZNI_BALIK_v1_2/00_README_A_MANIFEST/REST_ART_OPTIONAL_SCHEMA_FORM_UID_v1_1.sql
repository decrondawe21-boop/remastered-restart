-- OPTIONAL: přidání samostatného sloupce form_uid.
-- Spouštět jen pokud chceš ID formuláře držet mimo document_code.
-- Pokud sloupce už existují, tento ALTER může selhat; v tom případě ho přeskoč.

ALTER TABLE rest_art_document_files
ADD COLUMN form_uid VARCHAR(80) NULL AFTER id,
ADD COLUMN form_group VARCHAR(50) NULL AFTER form_uid,
ADD COLUMN is_current TINYINT(1) DEFAULT 1 AFTER status;

UPDATE rest_art_document_files
SET form_uid = document_code,
    form_group = SUBSTRING_INDEX(SUBSTRING_INDEX(document_code, '-', 3), '-', -1),
    is_current = 1
WHERE release_id = (
    SELECT id FROM rest_art_document_releases
    WHERE release_code = 'REST_ART_FINAL_FORMS_RELEASE_V1_1'
    ORDER BY id DESC LIMIT 1
);
