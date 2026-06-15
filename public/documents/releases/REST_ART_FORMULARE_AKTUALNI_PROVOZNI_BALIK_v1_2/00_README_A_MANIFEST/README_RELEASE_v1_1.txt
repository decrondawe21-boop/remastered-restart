REST||ART INTEGRACE - PROVOZNI FORMULARE RELEASE v1.1
=========================================================

Release code: REST_ART_FINAL_FORMS_RELEASE_V1_1
Status: ACTIVE / provozni pouziti
Vytvoreno: 2026-06-13 14:51

Obsah:
- 17 GDPR formulářů s RAI-FRM-GDPR ID a čárovými kódy
- klientská složka: Intake, Kniha klienta, Exit
- JAILBREAK dotazník doplněný ve v1.1
- intervence, krizový režim, evaluace a follow-up
- registry, etika a tým
- doplňkové A4 listy na šířku
- metodické a projektové podklady
- manifest CSV/JSON
- SQL import pro databázi

Důležité:
- ZIP neobsahuje fontové soubory.
- Interní názvy PDF polí zůstávají web-safe bez diakritiky.
- Dokumenty s citlivými údaji nepoužívat ve veřejném reportingu.
- Veřejné výstupy pouze agregovaně nebo anonymizovaně.

Doporučená cesta na serveru:
/storage/rest_art/releases/v1_1/

DB:
1. Nahraj a rozbal ZIP na server.
2. Spusť SQL: 00_README_A_MANIFEST/REST_ART_DOCUMENT_FILES_IMPORT_RELEASE_v1_1.sql
3. Volitelně spusť: 00_README_A_MANIFEST/REST_ART_OPTIONAL_SCHEMA_FORM_UID_v1_1.sql

