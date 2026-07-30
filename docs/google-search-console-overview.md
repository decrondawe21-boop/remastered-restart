# Google Search Console: přehled URL a úkolů

Aktualizováno: 30. července 2026 v 2:46

Produkční web: https://restartintegrace.dk-i.cz/

Hlavní sitemap index: https://restartintegrace.dk-i.cz/sitemap.xml

## Aktuální stav

- Sitemap segmentů: **9**
- Záznamů napříč sitemapami: **70**
- Unikátních URL: **61**
- HTML stránek: **47**
- URL vyžadujících technickou kontrolu: **0**
- Kompletní strojově zpracovatelný seznam je v `docs/google-search-console-urls.csv`.

## Sitemapy

| Segment | URL sitemap | Počet záznamů |
|---|---|---:|
| Hlavní veřejné stránky | https://restartintegrace.dk-i.cz/sitemap-pages.xml | 8 |
| Programy | https://restartintegrace.dk-i.cz/sitemap-programs.xml | 7 |
| Příběhy druhé šance | https://restartintegrace.dk-i.cz/sitemap-stories.xml | 4 |
| Aktuality a tematické archivy | https://restartintegrace.dk-i.cz/sitemap-news.xml | 19 |
| Veřejné dokumenty PDF | https://restartintegrace.dk-i.cz/sitemap-documents.xml | 14 |
| Metodika | https://restartintegrace.dk-i.cz/sitemap-methodology.xml | 5 |
| Obrázky a média | https://restartintegrace.dk-i.cz/sitemap-media.xml | 6 |
| Zapojení a dary | https://restartintegrace.dk-i.cz/sitemap-donate.xml | 5 |
| Stránky pro sledování videí | https://restartintegrace.dk-i.cz/sitemap-videos.xml | 2 |

## Co zadat do Google Search Console

1. Otevřít správnou vlastnost pro `https://restartintegrace.dk-i.cz/` nebo doménovou vlastnost `dk-i.cz`.
2. V části **Indexování > Soubory Sitemap** odeslat pouze `sitemap.xml`. Jde o index, který odkazuje na všech devět dílčích sitemap.
3. Pokud je v GSC stará nebo chybná sitemap, odstranit její záznam z přehledu a znovu odeslat aktuální `sitemap.xml`.
4. V **Kontrole adresy URL** postupně otestovat prioritní stránky uvedené níže: nejprve **Otestovat publikovanou URL**, potom **Požádat o indexování**.
5. V **Indexování > Stránky** filtrovat na „Všechny odeslané stránky“ a následně jednotlivé sitemapy. U opravených problémů použít **Ověřit opravu**.
6. V **Vylepšení > Videa** zkontrolovat obě samostatné stránky sledování videa. Video má být hlavním obsahem stránky.
7. Zkontrolovat **Ruční zásahy**, **Bezpečnostní problémy**, **HTTPS** a **Core Web Vitals**.
8. Starou doménu `restartintegrace.david-kozak.com` trvale přesměrovat serverovým `301` nebo `308` na odpovídající URL nové domény. Potom v její GSC vlastnosti zkontrolovat změnu adresy.
9. Po odeslání vyčkat alespoň týden. Google negarantuje okamžité ani úplné zaindexování všech URL.

## Priorita ručního požadavku na indexování

1. https://restartintegrace.dk-i.cz/
2. https://restartintegrace.dk-i.cz/co-delame
3. https://restartintegrace.dk-i.cz/programy
4. https://restartintegrace.dk-i.cz/programy/jailbreak
5. https://restartintegrace.dk-i.cz/metodika
6. https://restartintegrace.dk-i.cz/metodika/manifest
7. https://restartintegrace.dk-i.cz/aktuality
8. https://restartintegrace.dk-i.cz/pribehy-druhe-sance/story-petr-s-druha-sance
9. https://restartintegrace.dk-i.cz/zapojeni
10. https://restartintegrace.dk-i.cz/videa/predstaveni-projektu

Není vhodné ručně odesílat všech 61 URL. Ručně odešlete klíčové rozcestníky a několik reprezentativních detailů; zbytek má Google objevit přes sitemap a interní odkazy.

## Pravidelná kontrola

- **Po každé větší publikaci:** znovu vygenerovat tento přehled příkazem `npm run report:gsc`.
- **Jednou týdně první měsíc:** Stránky, Sitemapy, Videa, Ruční zásahy a Bezpečnostní problémy.
- **Jednou měsíčně:** Výkon ve vyhledávání, dotazy, CTR, průměrná pozice, Core Web Vitals a neindexované URL.
- **Při nové aktualitě:** ověřit její canonical, `NewsArticle`, jeden `H1`, interní odkaz a přítomnost v `sitemap-news.xml`.
- **Při novém videu:** samostatná watch page, `VideoObject`, náhled, datum, popis a přítomnost v `sitemap-videos.xml`.

## Oficiální podklady Google

- https://support.google.com/webmasters/answer/7451001
- https://support.google.com/webmasters/answer/12482179
- https://support.google.com/webmasters/answer/7440203
- https://developers.google.com/search/docs/crawling-indexing/301-redirects

## Úplný seznam URL podle sitemap

### Hlavní veřejné stránky

| URL | HTTP | Typ | Stav |
|---|---:|---|---|
| https://restartintegrace.dk-i.cz/ | 200 | text/html | OK |
| https://restartintegrace.dk-i.cz/co-delame | 200 | text/html | OK |
| https://restartintegrace.dk-i.cz/povinne-zverejnovani | 200 | text/html | OK |
| https://restartintegrace.dk-i.cz/kontakt | 200 | text/html | OK |
| https://restartintegrace.dk-i.cz/pro-firmy | 200 | text/html | OK |
| https://restartintegrace.dk-i.cz/media | 200 | text/html | OK |
| https://restartintegrace.dk-i.cz/webove-gdpr | 200 | text/html | OK |
| https://restartintegrace.dk-i.cz/zasady-ochrany-osobnich-udaju | 200 | text/html | OK |

### Programy

| URL | HTTP | Typ | Stav |
|---|---:|---|---|
| https://restartintegrace.dk-i.cz/programy | 200 | text/html | OK |
| https://restartintegrace.dk-i.cz/programy/jailbreak | 200 | text/html | OK |
| https://restartintegrace.dk-i.cz/programy/reset | 200 | text/html | OK |
| https://restartintegrace.dk-i.cz/programy/rework | 200 | text/html | OK |
| https://restartintegrace.dk-i.cz/programy/streetwise | 200 | text/html | OK |
| https://restartintegrace.dk-i.cz/programy/bod-zlomu | 200 | text/html | OK |
| https://restartintegrace.dk-i.cz/programy/stabilizace | 200 | text/html | OK |

### Příběhy druhé šance

| URL | HTTP | Typ | Stav |
|---|---:|---|---|
| https://restartintegrace.dk-i.cz/aktuality | 200 | text/html | OK |
| https://restartintegrace.dk-i.cz/pribehy-druhe-sance | 200 | text/html | OK |
| https://restartintegrace.dk-i.cz/pribehy-druhe-sance/story-z-praxe-ne-od-stolu | 200 | text/html | OK |
| https://restartintegrace.dk-i.cz/pribehy-druhe-sance/story-petr-s-druha-sance | 200 | text/html | OK |

### Aktuality a tematické archivy

| URL | HTTP | Typ | Stav |
|---|---:|---|---|
| https://restartintegrace.dk-i.cz/aktuality | 200 | text/html | OK |
| https://restartintegrace.dk-i.cz/aktuality/volna-pozice | 200 | text/html | OK |
| https://restartintegrace.dk-i.cz/aktuality/jailbreak | 200 | text/html | OK |
| https://restartintegrace.dk-i.cz/aktuality/dokumentace | 200 | text/html | OK |
| https://restartintegrace.dk-i.cz/aktuality/media-a-materialy | 200 | text/html | OK |
| https://restartintegrace.dk-i.cz/aktuality/aktuality | 200 | text/html | OK |
| https://restartintegrace.dk-i.cz/aktuality/aktuality-projektu | 200 | text/html | OK |
| https://restartintegrace.dk-i.cz/aktuality/volna-pozice/hledame | 200 | text/html | OK |
| https://restartintegrace.dk-i.cz/aktuality/jailbreak/restart-jailbreak-problematika-preplnenych-veznic | 200 | text/html | OK |
| https://restartintegrace.dk-i.cz/aktuality/dokumentace/manifest-restart-integrace | 200 | text/html | OK |
| https://restartintegrace.dk-i.cz/pribehy-druhe-sance/story-z-praxe-ne-od-stolu | 200 | text/html | OK |
| https://restartintegrace.dk-i.cz/aktuality/media-a-materialy/nove-brozury-restart-integrace-jsou-verejne-ke-stazeni | 200 | text/html | OK |
| https://restartintegrace.dk-i.cz/aktuality/media-a-materialy/brozurynew | 200 | text/html | OK |
| https://restartintegrace.dk-i.cz/pribehy-druhe-sance/story-petr-s-druha-sance | 200 | text/html | OK |
| https://restartintegrace.dk-i.cz/aktuality/aktuality/novy-web-restart-integrace-je-otevreny | 200 | text/html | OK |
| https://restartintegrace.dk-i.cz/aktuality/aktuality-projektu/ne-kazdy-ma-moznosti-restart-umoznuje-zkusit-to-znovu | 200 | text/html | OK |
| https://restartintegrace.dk-i.cz/aktuality/aktuality-projektu/druhasance | 200 | text/html | OK |
| https://restartintegrace.dk-i.cz/aktuality/aktuality-projektu/28-05-2026-10-00-schuzka | 200 | text/html | OK |
| https://restartintegrace.dk-i.cz/aktuality/aktuality-projektu/lide-na-okraji-spolecnosti | 200 | text/html | OK |

### Veřejné dokumenty PDF

| URL | HTTP | Typ | Stav |
|---|---:|---|---|
| https://restartintegrace.dk-i.cz/documents/methodology/metodika-restart-integrace.pdf | 200 | application/pdf | OK |
| https://restartintegrace.dk-i.cz/documents/transparency/RAI-DOC-PROJ-001_ONE_PAGE_PROJEKT_2026_v1_5_CONTENT_LOCKED.pdf | 200 | application/pdf | OK |
| https://restartintegrace.dk-i.cz/documents/transparency/RAI-FRM-GDPR-013_ODVOLANI_NEBO_OMEZENI_SOUHLASU_FILLABLE_v1_3_CONTENT_LOCKED.pdf | 200 | application/pdf | OK |
| https://restartintegrace.dk-i.cz/documents/transparency/RAI-MET-JB-001_METODIKA_JAILBREAK_v1_5_CONTENT_LOCKED.pdf | 200 | application/pdf | OK |
| https://restartintegrace.dk-i.cz/documents/transparency/REST_ART_KAPITOLA_INSTITUCIONALNI_PARTNERSTVI_v1.pdf | 200 | application/pdf | OK |
| https://restartintegrace.dk-i.cz/documents/transparency/REST_ART_KPZ_OPZ_051_REALIZACNI_FAZE_v1.pdf | 200 | application/pdf | OK |
| https://restartintegrace.dk-i.cz/documents/transparency/REST_ART_KPZ_POLITIKY_KTERE_FUNGUJI_v1.pdf | 200 | application/pdf | OK |
| https://restartintegrace.dk-i.cz/documents/transparency/REST_ART_PODKLAD_KONZULTACE_OPZ_051_59_v1.pdf | 200 | application/pdf | OK |
| https://restartintegrace.dk-i.cz/documents/transparency/REST_ART_PODKLAD_KONZULTACE_OPZ_051_v1.pdf | 200 | application/pdf | OK |
| https://restartintegrace.dk-i.cz/documents/transparency/vyrocni-zprava-restart-integrace.pdf | 200 | application/pdf | OK |
| https://restartintegrace.dk-i.cz/documents/media/brochure-jailbreak.pdf | 200 | application/pdf | OK |
| https://restartintegrace.dk-i.cz/documents/media/brochure-rozkladaci-03.pdf | 200 | application/pdf | OK |
| https://restartintegrace.dk-i.cz/documents/media/elegant-brochure.pdf | 200 | application/pdf | OK |
| https://restartintegrace.dk-i.cz/documents/media/restart-plakat.pdf | 200 | application/pdf | OK |

### Metodika

| URL | HTTP | Typ | Stav |
|---|---:|---|---|
| https://restartintegrace.dk-i.cz/metodika | 200 | text/html | OK |
| https://restartintegrace.dk-i.cz/metodika/manifest | 200 | text/html | OK |
| https://restartintegrace.dk-i.cz/metodika/charta | 200 | text/html | OK |
| https://restartintegrace.dk-i.cz/metodika/slovnik-pojmu | 200 | text/html | OK |
| https://restartintegrace.dk-i.cz/metodika/koncepcni-podklady | 200 | text/html | OK |

### Obrázky a média

| URL | HTTP | Typ | Stav |
|---|---:|---|---|
| https://restartintegrace.dk-i.cz/ | 200 | text/html | OK |
| https://restartintegrace.dk-i.cz/programy/streetwise | 200 | text/html | OK |
| https://restartintegrace.dk-i.cz/povinne-zverejnovani | 200 | text/html | OK |
| https://restartintegrace.dk-i.cz/pribehy-druhe-sance | 200 | text/html | OK |
| https://restartintegrace.dk-i.cz/zapojeni | 200 | text/html | OK |
| https://restartintegrace.dk-i.cz/media | 200 | text/html | OK |

### Zapojení a dary

| URL | HTTP | Typ | Stav |
|---|---:|---|---|
| https://restartintegrace.dk-i.cz/zapojeni | 200 | text/html | OK |
| https://restartintegrace.dk-i.cz/zapojeni/darovat-obleceni | 200 | text/html | OK |
| https://restartintegrace.dk-i.cz/zapojeni/vybaveni-centra | 200 | text/html | OK |
| https://restartintegrace.dk-i.cz/zapojeni/sbirka-knih | 200 | text/html | OK |
| https://restartintegrace.dk-i.cz/darovat | 200 | text/html | OK |

### Stránky pro sledování videí

| URL | HTTP | Typ | Stav |
|---|---:|---|---|
| https://restartintegrace.dk-i.cz/videa/predstaveni-projektu | 200 | text/html | OK |
| https://restartintegrace.dk-i.cz/videa/logo-reveal | 200 | text/html | OK |

