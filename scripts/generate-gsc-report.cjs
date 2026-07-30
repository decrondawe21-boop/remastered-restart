const fs = require('node:fs');
const path = require('node:path');

const siteOrigin = 'https://restartintegrace.dk-i.cz';
const sitemapIndexUrl = `${siteOrigin}/sitemap.xml`;
const outputDirectory = path.resolve(__dirname, '..', 'docs');
const markdownPath = path.join(outputDirectory, 'google-search-console-overview.md');
const csvPath = path.join(outputDirectory, 'google-search-console-urls.csv');
const concurrency = 10;

const sitemapLabels = {
  'sitemap-pages.xml': 'Hlavní veřejné stránky',
  'sitemap-programs.xml': 'Programy',
  'sitemap-stories.xml': 'Příběhy druhé šance',
  'sitemap-news.xml': 'Aktuality a tematické archivy',
  'sitemap-documents.xml': 'Veřejné dokumenty PDF',
  'sitemap-methodology.xml': 'Metodika',
  'sitemap-media.xml': 'Obrázky a média',
  'sitemap-donate.xml': 'Zapojení a dary',
  'sitemap-videos.xml': 'Stránky pro sledování videí'
};

const priorityUrls = [
  `${siteOrigin}/`,
  `${siteOrigin}/co-delame`,
  `${siteOrigin}/programy`,
  `${siteOrigin}/programy/jailbreak`,
  `${siteOrigin}/metodika`,
  `${siteOrigin}/metodika/manifest`,
  `${siteOrigin}/aktuality`,
  `${siteOrigin}/pribehy-druhe-sance/story-petr-s-druha-sance`,
  `${siteOrigin}/zapojeni`,
  `${siteOrigin}/videa/predstaveni-projektu`
];

function decodeXml(value) {
  return String(value || '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function firstTag(block, tag) {
  const match = block.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return match ? decodeXml(match[1].trim()) : '';
}

function parseSitemapIndex(xml) {
  return [...xml.matchAll(/<sitemap>([\s\S]*?)<\/sitemap>/gi)].map((match) => ({
    url: firstTag(match[1], 'loc'),
    lastmod: firstTag(match[1], 'lastmod')
  }));
}

function parseUrlSet(xml) {
  return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/gi)].map((match) => ({
    url: firstTag(match[1], 'loc'),
    lastmod: firstTag(match[1], 'lastmod'),
    changefreq: firstTag(match[1], 'changefreq'),
    priority: firstTag(match[1], 'priority')
  }));
}

function normalizedUrl(value) {
  try {
    const url = new URL(value);
    url.hash = '';
    if (url.pathname !== '/') url.pathname = url.pathname.replace(/\/+$/, '');
    return url.href;
  } catch {
    return value;
  }
}

function csvCell(value) {
  const text = String(value ?? '');
  return `"${text.replace(/"/g, '""')}"`;
}

function markdownCell(value) {
  return String(value ?? '')
    .replace(/\|/g, '\\|')
    .replace(/\r?\n/g, ' ');
}

async function fetchText(url) {
  const response = await fetch(url, {
    redirect: 'follow',
    headers: { accept: '*/*', 'user-agent': 'RESTART-GSC-audit/1.0' },
    signal: AbortSignal.timeout(15000)
  });
  return { response, body: await response.text() };
}

async function inspectUrl(entry) {
  try {
    const { response, body } = await fetchText(entry.url);
    const contentType = response.headers.get('content-type') || '';
    const isHtml = contentType.includes('text/html');
    const canonical = isHtml
      ? (body.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i) || [])[1] || ''
      : '';
    const metaRobots = isHtml
      ? (body.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)/i) || [])[1] || ''
      : '';
    const headerRobots = response.headers.get('x-robots-tag') || '';
    const robots = [metaRobots, headerRobots].filter(Boolean).join(', ');
    const schemaTypes = isHtml
      ? [...new Set([...body.matchAll(/"@type"\s*:\s*"([^"]+)"/g)].map((match) => match[1]))].join('; ')
      : '';
    return {
      ...entry,
      finalUrl: response.url,
      status: response.status,
      contentType,
      h1: isHtml ? (body.match(/<h1\b/gi) || []).length : '',
      rootFilled: isHtml ? /<div id="root">\s*\S[\s\S]*?<\/div>/.test(body) : '',
      canonical,
      canonicalMatches: isHtml ? normalizedUrl(canonical) === normalizedUrl(entry.url) : '',
      robots,
      noindex: /noindex/i.test(robots),
      schemaTypes,
      bytes: Buffer.byteLength(body)
    };
  } catch (error) {
    return {
      ...entry,
      finalUrl: '',
      status: 'ERROR',
      contentType: '',
      h1: '',
      rootFilled: '',
      canonical: '',
      canonicalMatches: '',
      robots: '',
      noindex: '',
      schemaTypes: '',
      bytes: 0,
      error: error.message
    };
  }
}

async function inspectAll(entries) {
  const results = [];
  for (let index = 0; index < entries.length; index += concurrency) {
    const batch = entries.slice(index, index + concurrency);
    results.push(...(await Promise.all(batch.map(inspectUrl))));
  }
  return results;
}

function statusLabel(row) {
  if (row.status !== 200) return `PROVĚŘIT: HTTP ${row.status}`;
  if (row.noindex) return 'NOINDEX';
  if (row.contentType.includes('text/html')) {
    if (row.h1 !== 1) return `PROVĚŘIT: H1=${row.h1}`;
    if (!row.rootFilled) return 'PROVĚŘIT: prázdné HTML';
    if (!row.canonicalMatches) return 'PROVĚŘIT: canonical';
  }
  return 'OK';
}

async function main() {
  const { response: indexResponse, body: indexXml } = await fetchText(sitemapIndexUrl);
  if (!indexResponse.ok) throw new Error(`Sitemap index returned HTTP ${indexResponse.status}.`);

  const sitemaps = parseSitemapIndex(indexXml);
  const entries = [];
  for (const sitemap of sitemaps) {
    const { response, body } = await fetchText(sitemap.url);
    if (!response.ok) throw new Error(`${sitemap.url} returned HTTP ${response.status}.`);
    const sitemapName = new URL(sitemap.url).pathname.split('/').filter(Boolean).pop();
    for (const item of parseUrlSet(body)) {
      entries.push({
        ...item,
        sitemap: sitemapName,
        sitemapUrl: sitemap.url,
        sitemapLabel: sitemapLabels[sitemapName] || sitemapName
      });
    }
  }

  const uniqueEntries = Array.from(new Map(entries.map((entry) => [entry.url, entry])).values());
  const inspectedUnique = await inspectAll(uniqueEntries);
  const inspectedByUrl = new Map(inspectedUnique.map((entry) => [entry.url, entry]));
  const inspectedEntries = entries.map((entry) => ({ ...inspectedByUrl.get(entry.url), ...entry }));
  const generatedAt = new Intl.DateTimeFormat('cs-CZ', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'Europe/Prague'
  }).format(new Date());
  const htmlRows = inspectedUnique.filter((row) => row.contentType.includes('text/html'));
  const issues = inspectedUnique.filter((row) => statusLabel(row).startsWith('PROVĚŘIT'));

  const markdown = [
    '# Google Search Console: přehled URL a úkolů',
    '',
    `Aktualizováno: ${generatedAt}`,
    '',
    `Produkční web: ${siteOrigin}/`,
    '',
    `Hlavní sitemap index: ${sitemapIndexUrl}`,
    '',
    '## Aktuální stav',
    '',
    `- Sitemap segmentů: **${sitemaps.length}**`,
    `- Záznamů napříč sitemapami: **${entries.length}**`,
    `- Unikátních URL: **${uniqueEntries.length}**`,
    `- HTML stránek: **${htmlRows.length}**`,
    `- URL vyžadujících technickou kontrolu: **${issues.length}**`,
    '- Kompletní strojově zpracovatelný seznam je v `docs/google-search-console-urls.csv`.',
    '',
    '## Sitemapy',
    '',
    '| Segment | URL sitemap | Počet záznamů |',
    '|---|---|---:|',
    ...sitemaps.map((sitemap) => {
      const sitemapName = new URL(sitemap.url).pathname.split('/').filter(Boolean).pop();
      const count = entries.filter((entry) => entry.sitemap === sitemapName).length;
      return `| ${markdownCell(sitemapLabels[sitemapName] || sitemapName)} | ${sitemap.url} | ${count} |`;
    }),
    '',
    '## Co zadat do Google Search Console',
    '',
    '1. Otevřít správnou vlastnost pro `https://restartintegrace.dk-i.cz/` nebo doménovou vlastnost `dk-i.cz`.',
    '2. V části **Indexování > Soubory Sitemap** odeslat pouze `sitemap.xml`. Jde o index, který odkazuje na všech devět dílčích sitemap.',
    '3. Pokud je v GSC stará nebo chybná sitemap, odstranit její záznam z přehledu a znovu odeslat aktuální `sitemap.xml`.',
    '4. V **Kontrole adresy URL** postupně otestovat prioritní stránky uvedené níže: nejprve **Otestovat publikovanou URL**, potom **Požádat o indexování**.',
    '5. V **Indexování > Stránky** filtrovat na „Všechny odeslané stránky“ a následně jednotlivé sitemapy. U opravených problémů použít **Ověřit opravu**.',
    '6. V **Vylepšení > Videa** zkontrolovat obě samostatné stránky sledování videa. Video má být hlavním obsahem stránky.',
    '7. Zkontrolovat **Ruční zásahy**, **Bezpečnostní problémy**, **HTTPS** a **Core Web Vitals**.',
    '8. Starou doménu `restartintegrace.david-kozak.com` trvale přesměrovat serverovým `301` nebo `308` na odpovídající URL nové domény. Potom v její GSC vlastnosti zkontrolovat změnu adresy.',
    '9. Po odeslání vyčkat alespoň týden. Google negarantuje okamžité ani úplné zaindexování všech URL.',
    '',
    '## Priorita ručního požadavku na indexování',
    '',
    ...priorityUrls.map((url, index) => `${index + 1}. ${url}`),
    '',
    `Není vhodné ručně odesílat všech ${uniqueEntries.length} URL. Ručně odešlete klíčové rozcestníky a několik reprezentativních detailů; zbytek má Google objevit přes sitemap a interní odkazy.`,
    '',
    '## Pravidelná kontrola',
    '',
    '- **Po každé větší publikaci:** znovu vygenerovat tento přehled příkazem `npm run report:gsc`.',
    '- **Jednou týdně první měsíc:** Stránky, Sitemapy, Videa, Ruční zásahy a Bezpečnostní problémy.',
    '- **Jednou měsíčně:** Výkon ve vyhledávání, dotazy, CTR, průměrná pozice, Core Web Vitals a neindexované URL.',
    '- **Při nové aktualitě:** ověřit její canonical, `NewsArticle`, jeden `H1`, interní odkaz a přítomnost v `sitemap-news.xml`.',
    '- **Při novém videu:** samostatná watch page, `VideoObject`, náhled, datum, popis a přítomnost v `sitemap-videos.xml`.',
    '',
    '## Oficiální podklady Google',
    '',
    '- https://support.google.com/webmasters/answer/7451001',
    '- https://support.google.com/webmasters/answer/12482179',
    '- https://support.google.com/webmasters/answer/7440203',
    '- https://developers.google.com/search/docs/crawling-indexing/301-redirects',
    '',
    '## Úplný seznam URL podle sitemap',
    ''
  ];

  for (const sitemap of sitemaps) {
    const sitemapName = new URL(sitemap.url).pathname.split('/').filter(Boolean).pop();
    const rows = inspectedEntries.filter((entry) => entry.sitemap === sitemapName);
    markdown.push(`### ${sitemapLabels[sitemapName] || sitemapName}`, '');
    markdown.push('| URL | HTTP | Typ | Stav |');
    markdown.push('|---|---:|---|---|');
    for (const row of rows) {
      const type = row.contentType.split(';')[0] || 'neznámý';
      markdown.push(`| ${markdownCell(row.url)} | ${row.status} | ${markdownCell(type)} | ${statusLabel(row)} |`);
    }
    markdown.push('');
  }

  const csvHeaders = [
    'sitemap',
    'segment',
    'url',
    'lastmod',
    'changefreq',
    'priority',
    'http_status',
    'content_type',
    'final_url',
    'h1_count',
    'root_filled',
    'canonical',
    'canonical_matches',
    'robots',
    'noindex',
    'schema_types',
    'bytes',
    'audit_status',
    'error'
  ];
  const csvRows = inspectedEntries.map((row) =>
    [
      row.sitemap,
      row.sitemapLabel,
      row.url,
      row.lastmod,
      row.changefreq,
      row.priority,
      row.status,
      row.contentType,
      row.finalUrl,
      row.h1,
      row.rootFilled,
      row.canonical,
      row.canonicalMatches,
      row.robots,
      row.noindex,
      row.schemaTypes,
      row.bytes,
      statusLabel(row),
      row.error || ''
    ]
      .map(csvCell)
      .join(',')
  );

  fs.mkdirSync(outputDirectory, { recursive: true });
  fs.writeFileSync(markdownPath, `${markdown.join('\n')}\n`, 'utf8');
  fs.writeFileSync(csvPath, `${csvHeaders.map(csvCell).join(',')}\n${csvRows.join('\n')}\n`, 'utf8');
  console.log(
    `GSC report generated: ${sitemaps.length} sitemaps, ${entries.length} records, ${uniqueEntries.length} unique URLs, ${issues.length} issues.`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
