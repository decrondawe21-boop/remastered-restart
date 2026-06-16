-- REST||ART INTEGRACE - programové dotazníky v2.0 RC1
-- Před importem upravte file_path podle skutečné cesty na serveru.

INSERT INTO rest_art_document_releases
(release_code, title, version, file_name, file_path, file_type, status, description)
VALUES
('REST_ART_PROGRAMOVE_DOTAZNIKY_V2_0_RC1',
 'REST||ART programové dotazníky v2.0 RC1',
 'v2.0 RC1',
 'REST_ART_PROGRAMOVE_DOTAZNIKY_v2_0_RC1.zip',
 '/storage/rest_art/releases/v2_0_rc1/REST_ART_PROGRAMOVE_DOTAZNIKY_v2_0_RC1.zip',
 'zip',
 'test_ready',
 'Release candidate programových dotazníků pro 6 pilířů: JAILBREAK, RESET, REWORK, STREETWISE, STABILIZACE, BOD ZLOMU. Poppins, barcode, fillable PDF pole.');

SELECT LAST_INSERT_ID() AS release_id;
