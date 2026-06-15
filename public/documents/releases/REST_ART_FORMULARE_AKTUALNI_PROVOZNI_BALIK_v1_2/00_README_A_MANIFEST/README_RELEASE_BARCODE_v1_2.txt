REST_ART_PROVOZNI_FORMULARE_RELEASE_BARCODE_v1_2

Obsah:
- finální provozní formuláře REST||ART INTEGRACE
- Code 128 čárové kódy podle form_uid
- manifest CSV/JSON
- seznam ID formulářů
- barcode placement report
- changelog v1.1 -> v1.2

Pravidlo barcode:
- obsah barcode = form_uid, např. RAI-FRM-INT-001
- typ = Code 128
- kód neobsahuje osobní údaje

Umístění:
- portrait hlavní formuláře: vpravo nahoře
- doplňkové / landscape / all-in-one / metodiky: vlevo dole
- GDPR formuláře již měly barcode; ponecháno beze změny.

Doporučený test:
- otevřít PDF v Adobe Readeru
- ověřit čitelnost barcode
- vyplnit pole
- uložit a znovu otevřít
- vytisknout testovací list
