# Materiální nabídky: produkční checklist

## Nasazení

1. Zálohujte databázi a ověřte možnost obnovy.
2. Spusťte `npm run db:migrate`.
3. Nastavte `APP_BASE_URL`, SMTP proměnné a `MATERIAL_OFFER_ADMIN_EMAILS`.
4. Nastavte `MATERIAL_OFFER_RETENTION_DAYS` v rozmezí 30 až 730 dnů.
5. Ověřte, že reverzní proxy přijme JSON request do 12 MB a používá HTTPS.
6. Sestavte aplikaci příkazem `npm run build` a nasaďte frontend i API ze stejného commitu.

## E-mail a workflow

- Odešlete jednu testovací nabídku oblečení, vybavení a knih.
- Ověřte potvrzení dárci a upozornění administrátorům.
- V administraci otestujte přiřazení odpovědné osoby, změnu stavu, termín a adresu svozu.
- Ověřte, že změna stavu vytvoří položku historie a odešle dárci aktualizaci.
- Zkontrolujte textovou i HTML podobu všech tří e-mailových šablon.

## Fotografie a ochrana údajů

- Nahrajte JPEG, PNG a WebP; v prohlížeči se musí automaticky převést a zmenšit.
- Zkuste soubor s falešnou příponou obrázku; API ho musí odmítnout.
- Ověřte, že URL fotografie bez administrátorského přihlášení nevrátí obsah.
- Otestujte ruční anonymizaci na testovací nabídce.
- Naplánujte denní spuštění `npm run db:anonymize-material-offers`.
- Do záloh a logů neukládejte těla formulářů ani binární obsah fotografií déle, než vyžaduje provoz.

## Monitoring

- Sledujte odpovědi API `400`, `413`, `429` a `500` na trase `/api/material-offers`.
- Sledujte selhání SMTP označená `[mail]`; přijetí nabídky má fungovat i při výpadku pošty.
- Kontrolujte zaplnění tabulek `material_offer_photos`, `material_offer_events` a `material_offer_rate_limits`.
- Po nasazení ověřte události `material_offer_view`, `material_offer_start`, `material_offer_submit_success`, `material_offer_submit_error` a `material_offer_validation_error` v analytice.

## SEO a indexace

- Otevřete všechny tři veřejné stránky a zkontrolujte titulek, canonical URL a FAQ.
- Ověřte FAQ JSON-LD v Rich Results Testu.
- Znovu odešlete hlavní sitemapu v Google Search Console.
- Pomocí Kontroly URL požádejte o indexaci tří stránek materiální podpory.
- Formulářové API, administrační stránky a fotografie se do sitemap nepřidávají a nesmějí být veřejně indexované.

## Návrat zpět

1. Vraťte aplikaci na předchozí ověřený commit.
2. Nové tabulky a sloupce ponechte; starší aplikace je ignoruje.
3. Pokud je problém pouze v poště, vypněte SMTP nebo konkrétní šablonu v administraci.
4. Pokud je problém v přílohách, dočasně komunikujte nabídky přes kontaktní stránku a zachovejte databázová data pro následné zpracování.
