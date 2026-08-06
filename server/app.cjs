const crypto = require('node:crypto');
const { query } = require('./db.cjs');
const fs = require('node:fs');
const path = require('node:path');
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');
const { PDFBool, PDFDocument, PDFName } = require('pdf-lib');
const {
  clearOAuthStateCookie,
  clearSessionCookie,
  createSessionToken,
  hashPassword,
  oauthStateCookie,
  oauthStateCookieName,
  parseCookies,
  randomId,
  readSessionToken,
  sessionCookie,
  sessionCookieName,
  verifyPassword
} = require('./security.cjs');

function sendJson(response, statusCode, body, headers = {}) {
  response.writeHead(statusCode, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    ...headers
  });
  response.end(JSON.stringify(body));
}

function sendXml(response, statusCode, body, headers = {}) {
  response.writeHead(statusCode, {
    'content-type': 'application/xml; charset=utf-8',
    'cache-control': 'public, max-age=300, stale-while-revalidate=3600',
    ...headers
  });
  response.end(body);
}

function sendHtml(response, statusCode, body, headers = {}) {
  response.writeHead(statusCode, {
    'content-type': 'text/html; charset=utf-8',
    'cache-control': 'public, max-age=300, stale-while-revalidate=3600',
    'x-content-type-options': 'nosniff',
    ...headers
  });
  response.end(body);
}

function sendRedirect(response, location, headers = {}) {
  response.writeHead(302, {
    location,
    'cache-control': 'no-store',
    ...headers
  });
  response.end();
}

function sendPdf(response, statusCode, buffer, fileName) {
  response.writeHead(statusCode, {
    'content-type': 'application/pdf',
    'content-length': buffer.length,
    'content-disposition': `attachment; filename="${fileName.replace(/"/g, '')}"`,
    'cache-control': 'no-store'
  });
  response.end(buffer);
}

function isUnknownColumnError(error) {
  return error && (error.code === 'ER_BAD_FIELD_ERROR' || error.errno === 1054);
}

const transientDatabaseErrorCodes = new Set(['ECONNREFUSED', 'ECONNRESET', 'EPIPE', 'ETIMEDOUT', 'PROTOCOL_CONNECTION_LOST']);

function isTransientDatabaseError(error) {
  return transientDatabaseErrorCodes.has(error?.code);
}

const publicSiteUrl = String(process.env.PUBLIC_SITE_URL || 'https://restartintegrace.dk-i.cz').replace(/\/$/, '');
const secondChanceStoryTag = 'Příběhy druhé šance';
const builtInNewsSitemapRows = [
  {
    id: 'field-update-zabradli-u-zakladny-2026-08',
    slug: 'vedle-zakladny-roste-nove-zabradli-krok-za-krokem',
    title: 'Vedle základny roste nové zábradlí. Krok za krokem',
    tag: 'Stavíme svépomocí',
    date: '2026-08-06',
    imageUrl: '/images/news/zabradli-u-zakladny/04-soucasny-stav-zabradli.jpg',
    excerpt:
      'U vstupu vedle základny postupně vzniká dřevěné zábradlí. Od přípravy prostoru přes osazení jednotlivých dílů až po zpevnění a ochranný nátěr.',
    body:
      '<p>Vedle základny postupně stavíme dřevěné zábradlí, které jasněji vymezí vstup a zvýší bezpečnost prostoru. Dokumentujeme přípravu místa, osazení jednotlivých částí, zpevnění konstrukce i ochranný nátěr.</p>'
  },
  {
    id: 'field-update-paletove-posezeni-2026-08',
    slug: 'makame-dal-paletove-posezeni-vznika-u-nas',
    title: 'Makáme dál: z palet roste vlastní posezení',
    tag: 'Práce v terénu',
    date: '2026-08-04',
    imageUrl: '/images/updates/srpen-2026/zakladna/03-zazemi-lavice.jpg',
    excerpt:
      'Inspirovali jsme se jednoduchým vzorem a pustili se do práce. Z použitých palet už vzniklo vlastní posezení — krok za krokem, vlastníma rukama a z materiálu, který dostal další využití.',
    body:
      '<p>Z použitých palet postupně vzniká funkční posezení pro základnu REST||ART. Ukazujeme nejen hotový výsledek, ale také cestu od rozebraného materiálu přes zpevnění konstrukce až po broušení, nátěr a finální sedáky.</p>'
  },
  {
    id: 'field-update-zazemi-2026-08',
    slug: 'bouda-z-darovanych-materialu-pevny-zaklad',
    title: 'Z darovaných materiálů stavíme pevné zázemí',
    tag: 'Stavíme svépomocí',
    date: '2026-08-04',
    imageUrl: '/images/updates/srpen-2026/zakladna/18-zakladna-celkem.jpg',
    excerpt:
      'Není to katalogová stavba — vzniká z toho, co nám kdo daruje. Má ale pevné základy, uvnitř už slouží a připravené plechy na střechu čekají na snýtování.',
    body:
      '<p>Boudu REST||ART stavíme svépomocí z darovaných a zachráněných materiálů. Uvnitř už vytváří funkční zázemí, zatímco zvenku pokračují práce na střeše, opláštění a uspořádání pracovního prostoru.</p>'
  },
  {
    id: 'field-update-zahrada-2026-08',
    slug: 'zahrada-dostava-svou-tvar',
    title: 'Zahrada dostává svou tvář: březen versus červenec',
    tag: 'Proměna místa',
    date: '2026-08-04',
    imageUrl: '/images/updates/srpen-2026/zakladna/10-ruze.jpg',
    excerpt:
      'Stejný kout na jaře a na konci července ukazuje skutečnou změnu. Vedle záhonů vznikají cesty, jezírko, skalky, truhlíky i drobné prvky vyrobené vlastníma rukama.',
    body:
      '<p>Porovnání stejného místa v březnu a červenci ukazuje každodenní práci na zahradě. Postupně přibývají cesty, jezírko, skalky, truhlíky, obrubníky i výsadba.</p>'
  },
  {
    id: 'field-update-reuse-zakladna-2026-08',
    slug: 'zakladna-roste-z-toho-co-dostalo-druhou-sanci',
    title: 'Základna roste z toho, co dostalo druhou šanci',
    tag: 'Práce v terénu',
    date: '2026-08-04',
    imageUrl: '/images/updates/srpen-2026/zakladna/08-proutene-kreslo-zakladna.jpg',
    excerpt:
      'Darované palety, místní dřevo, nalezené vybavení i vlastní ruční práce. Na jednom místě je vidět, jak z věcí určených k vyhození vznikají ploty, pracovní kouty a praktické zázemí.',
    body:
      '<p>Zachráněné palety, místní dřevo a nalezené vybavení se na základně mění v ploty, nábytek, pracovní kouty a další praktické zázemí. Recyklace tu není heslo, ale každodenní způsob práce.</p>'
  },
  {
    id: '0db6fc6b-1eea-42a0-ab3a-a6d381397d4f',
    slug: 'opszp',
    title: 'Dokumentace OPSZP',
    tag: 'Média a materiály',
    date: '2026-06-10',
    imageUrl: '/images/updates/archiv-2026/opszp-podklad-1.webp',
    excerpt: 'Podklady REST||ART pro konzultaci v rámci OPSZP.',
    body: '<p>Zveřejňujeme podkladový materiál REST||ART připravený pro odbornou konzultaci v rámci OPSZP.</p>'
  },
  {
    id: '76719b7a-e6cd-4fd9-a35b-68e3ef0d05f1',
    slug: 'majerpropusten',
    title: 'Jaroslav Majer jde ven!',
    tag: 'JAILBREAK',
    date: '2026-05-17',
    imageUrl: '/images/updates/archiv-2026/jaroslav-majer-propusten.jpg',
    excerpt: 'Můžete slavit — Jaroslav Majer byl podmíněně propuštěn a dostal další šanci.',
    body:
      '<p>Jaroslav Majer byl podmíněně propuštěn. REST||ART bude u navazujících kroků, které mají pomoci proměnit rozhodnutí soudu ve skutečný návrat do běžného života.</p>'
  },
  {
    id: '0d718647-7a13-4c93-9543-34e75adfee5a',
    slug: 'podmineneho-propusteni',
    title: 'Jaroslav Majer zítra čeká projednání PP',
    tag: 'JAILBREAK',
    date: '2026-05-14',
    imageUrl: '/images/updates/archiv-2026/jaroslav-majer-pp.jpg',
    excerpt: 'Jaroslava Majera zítra čeká projednání žádosti o podmíněné propuštění.',
    body:
      '<p>Projednání žádosti o podmíněné propuštění může být zásadním milníkem další životní cesty. REST||ART dlouhodobě upozorňuje na význam připravené návazné podpory a konkrétního plánu návratu.</p>'
  },
  {
    id: '21e08d15-89ce-4317-8abc-a29e8eabe3d1',
    slug: 'start',
    title: 'Nový Start pro REST||ART',
    tag: 'Aktuality projektu',
    date: '2026-05-04',
    imageUrl: '/images/updates/archiv-2026/novy-start.jpg',
    excerpt:
      'Po ukončení působení v Ústí nad Labem se projekt přesunul na venkov, kde příroda, zahrada a větší prostor otevírají nové možnosti.',
    body:
      '<p>Projekt se přesunul na venkov, kde příroda, zahrada a větší prostor otevírají nové možnosti pro komunitní práci, praktické zázemí a další rozvoj.</p>'
  },
  {
    id: '0b5b706c-8219-46c7-9521-d2e9f7497791',
    slug: 'emotional',
    title: 'Emotional',
    tag: 'Média a materiály',
    date: '2026-05-01',
    imageUrl: '/images/updates/archiv-2026/emotional.png',
    excerpt: 'Krátké video zachycující osobní a emotivní rovinu projektu REST||ART.',
    body: '<p>Projekt není jen systém, metodika a soubor kroků. Nese také lidskou a osobní rovinu, ze které REST||ART vznikl.</p>'
  },
  {
    id: '7d5463f2-6cd7-4ab9-a20a-efb4e5359d33',
    slug: 'architektura-druhe-sance',
    title: 'REST||ART: Architektura druhé šance',
    tag: 'Metodika',
    date: '2026-04-28',
    imageUrl: '/images/updates/archiv-2026/architektura-druhe-sance-cover.png',
    excerpt: 'Vizuální představení systému podpory, který propojuje jednotlivé kroky druhé šance.',
    body:
      '<p>Architektura druhé šance propojuje zázemí, práci, doprovod, odpovědnost a dlouhodobou oporu do jednoho návazného systému.</p>'
  },
  {
    id: '647e36e0-ab6e-4ac5-ae6b-005a73ab1f77',
    slug: 'zadost-o-pp-kaleja-jiri-rest-art-se-pripojuje',
    title: 'Žádost o PP: Kaleja Jiří — REST||ART znovu odpovídá',
    tag: 'JAILBREAK',
    date: '2026-04-11',
    excerpt:
      'REST||ART obdržel další dopis s plánem podání žádosti o podmíněné propuštění od registrovaného člena Jiřího Kaleji a připravil konkrétní příslib návazné podpory.',
    body:
      '<p>REST||ART potvrzuje připravenost spolupracovat na resocializaci po případném podmíněném propuštění a nabídnout podporu od prvního dne po výstupu.</p>'
  },
  {
    id: '58ffbf24-864b-4771-bc1f-ca77a4da9dd5',
    slug: 'zadost-o-pp-majer-jaroslav-rest-art-se-pripojuje',
    title: 'Žádost o PP: Majer Jaroslav — REST||ART se připojuje',
    tag: 'JAILBREAK',
    date: '2026-04-03',
    excerpt:
      'REST||ART se připojuje k žádosti o podmíněné propuštění a potvrzuje návaznou podporu po výstupu: doprovod, ubytování, práci, sociální asistenci a mentoring.',
    body:
      '<p>REST||ART se připojuje k žádosti a potvrzuje připravenost nabídnout po výstupu konkrétní doprovod, zázemí, pracovní návaznost, sociální asistenci a mentoring.</p>'
  },
  {
    id: 'news-darovane-knihy-a-jeden-nalez',
    title: 'Darované knihy dorazily. A přibyl i jeden nečekaný nález',
    tag: 'Komunita',
    date: '2026-08-05',
    imageUrl: '/images/news/darovane-knihy/dobrodruzne-knihy-kod.jpg',
    excerpt:
      'Do vznikající knihovny jsme převzali několik krabic darovaných knih a zachránili také jeden nalezený soubor. Děkujeme všem, kdo dávají knihám i jejich budoucím čtenářům další šanci.',
    body:
      '<p><strong>Naše sbírka knih se během července znovu rozrostla.</strong> Dorazilo k nám několik balíků a krabic darovaných knih – beletrie, dobrodružné romány, naučná literatura i starší edice, které mohou dál sloužit.</p><h2>Knihy, které nemusely skončit bez užitku</h2><p>Vedle darů jsme převzali také jeden nalezený soubor knih, kterému hrozilo, že zůstane zapomenutý. I ten čeká stejné pečlivé třídění jako ostatní.</p><img src="/images/news/darovane-knihy/nalezeny-soubor-knih.jpg" alt="Nalezený soubor knih před roztříděním" width="1200" height="900" loading="lazy" /><p><em>Nalezený soubor knih před roztříděním.</em></p><h2>Co bude následovat</h2><p>Knihy postupně prohlédneme, očistíme a roztřídíme podle stavu a zaměření. Použitelné tituly zařadíme do připravované sbírky; s ostatními naložíme odpovědně.</p><img src="/images/news/darovane-knihy/edice-aloise-jiraska.jpg" alt="Darovaná edice knih Aloise Jiráska" width="1200" height="675" loading="lazy" /><p><em>Část darované edice Aloise Jiráska.</em></p><img src="/images/news/darovane-knihy/krabice-beletrie-a-naucnych-knih.jpg" alt="Krabice darované beletrie a naučných knih" width="1200" height="853" loading="lazy" /><p><em>V zásilkách je beletrie, naučná literatura i knihy pro volný čas.</em></p><img src="/images/news/darovane-knihy/darovane-knihy-v-krabici.jpg" alt="Další darované knihy uložené v krabici" width="900" height="1200" loading="lazy" /><img src="/images/news/darovane-knihy/dobrodruzne-knihy-v-krabici.jpg" alt="Darované dobrodružné knihy v krabici" width="900" height="1200" loading="lazy" /><p><strong>Děkujeme všem dárcům.</strong> Darem knih nepředáváte jen věc. Pomáháte vytvářet prostor pro klid, vzdělávání a nový začátek lidí, se kterými projekt pracuje.</p><p>Chcete se také zapojit? Podrobnosti najdete na stránce <a href="/zapojeni/sbirka-knih">Sbírka knih</a>.</p>'
  },
  {
    id: 'news-vizualni-knihovna-metodiky',
    title: 'Vizuální knihovna metodiky je nově dostupná na jednom místě',
    tag: 'Média a materiály',
    date: '2026-07-30',
    imageUrl: '/images/methodology/vizualni-model-rest-art-integrace.webp',
    excerpt:
      'Diagram systému, životní cyklus klienta, šest programových pilířů i síť spolupráce jsou veřejně dostupné v přehledné vizuální knihovně.',
    body:
      '<p>Rozšířili jsme veřejnou část metodiky o vizuální podklady, které pomáhají rychle pochopit propojení cílových skupin, programů, partnerů, měření a výstupů.</p><h2>Od cílové skupiny ke stabilnímu člověku</h2><p>Ústřední diagram spojuje metodicky řízenou práci s klientem se zaměstnavateli, obcemi, institucemi, dobrovolníky, komunitou a odbornými partnery.</p><p><a href="/metodika#metodika-vizualy">Otevřít vizuální knihovnu metodiky</a>.</p>'
  },
  {
    id: 'news-oficialni-videa-projektu',
    title: 'Oficiální videa projektu mají vlastní sledovací stránky',
    tag: 'Média a materiály',
    date: '2026-07-29',
    imageUrl: '/videos/rest-art-intro-poster.png',
    excerpt:
      'Krátké představení projektu a animace vizuální identity jsou dostupné na samostatných stránkách s popisem, titulky a údaji pro vyhledávače.',
    body:
      '<p>Veřejná videa REST||ART Integrace mají samostatné sledovací stránky s vlastní adresou, náhledem, popisem a strukturovanými daty.</p><h2>Krátké představení projektu</h2><p><a href="/videa/predstaveni-projektu">Přehrát představení projektu</a>.</p><h2>Vizuální identita</h2><p><a href="/videa/logo-reveal">Přehrát logo reveal</a>.</p>'
  },
  {
    id: 'news-brozury-druhe-sance',
    title: 'Nové brožury REST||ART Integrace jsou veřejně ke stažení',
    tag: 'Média a materiály',
    date: '2026-06-26',
    imageUrl: '/images/media/restart-projekt-infografika.png',
    excerpt:
      'Veřejná knihovna obsahuje projektové brožury pro partnery, podporovatele i zájemce o program JAILBREAK.',
    body:
      '<p>Zveřejnili jsme nové projektové brožury REST||ART Integrace pro partnery, instituce, podporovatele a lidi, kteří chtějí rychle porozumět smyslu projektu.</p><h2>Značka druhé šance</h2><p>Materiály vysvětlují propojení prevence, doprovodu, práce, bydlení a stabilizace. Spolupráci chápeme jako společný směr, odpovědnost a ověřitelné výsledky.</p>'
  },
  {
    id: 'news-second-chance',
    title: 'Ne každý má možnosti. REST||ART umožňuje zkusit to znovu.',
    tag: 'Aktuality projektu',
    date: '2026-06-03',
    excerpt:
      'Druhá šance potřebuje konkrétní podmínky: práci, režim, bezpečné zázemí a podporu v okamžiku, kdy ji člověk skutečně potřebuje.',
    body:
      '<p>REST||ART Integrace propojuje praktickou pomoc s osobní odpovědností. Neobhajuje chyby ani neslibuje snadnou změnu. Vytváří cestu, na které lze znovu budovat práci, vztahy, režim a důvěru.</p>'
  },
  {
    id: 'news-meeting-support',
    title: '28.05.2026 - 10:00 schůzka',
    tag: 'Aktuality projektu',
    date: '2026-05-28',
    excerpt: 'Jednání o podpoře projektu a dalším rozvoji programů RESTART Integrace.',
    body:
      '<p>Jednání se zaměřilo na možnosti podpory projektu, rozvoj programů a jejich praktického zázemí. Ověřené výsledky a konkrétní výstupy zveřejňujeme průběžně v aktualitách a transparentní sekci.</p>'
  },
  {
    id: 'news-people-on-edge',
    title: 'Lidé na okraji společnosti',
    tag: 'Aktuality projektu',
    date: '2026-05-13',
    excerpt:
      'Konkrétní cesta pro lidi mimo systém začíná bezpečným kontaktem a pokračuje mentoringem, prací a stabilizací.',
    body:
      '<p>Lidé na okraji společnosti nepotřebují další obecný slib. Potřebují dostupný první kontakt, srozumitelný plán, odpovědnost a návaznost mezi prací, bydlením, mentoringem a odbornou podporou.</p>'
  },
  {
    id: 'story-z-praxe-ne-od-stolu',
    title: 'REST||ART vznikl z praxe, ne od stolu',
    tag: secondChanceStoryTag,
    date: '2026-07-02',
    excerpt:
      'Zakladatelský příběh projektu: osobní cesta přes závislost, ulici, výkon trestu, návrat do práce a vznik systému druhých šancí.',
    body:
      '<p><strong>REST||ART Integrace nevznikl od stolu ani jako teoretická úvaha.</strong> Vychází z osobní zkušenosti se závislostí, bezdomovectvím, výkonem trestu a návratem do práce.</p><h2>Proč vznikl RESTART</h2><p>Zkušenost ukázala, že svoboda bez plánu, práce, bydlení, vztahů a následné opory často nestačí. Projekt proto převádí praxi do otevřeného metodického systému, který lze ověřovat a rozvíjet s odbornými partnery.</p>'
  },
  {
    id: 'story-petr-s-druha-sance',
    title: 'Petr S.: Dopis, ve kterém se člověk nechce vzdát',
    tag: secondChanceStoryTag,
    date: '2026-06-24',
    excerpt:
      'Anonymizovaný příběh cesty přes ústavní péči, ulici, výkon trestu a rozhodnutí začít žít jinak.',
    body:
      '<p><strong>Příběh zveřejňujeme anonymizovaně a s respektem k soukromí klienta.</strong> Petr popisuje dětství bez pevného zázemí, ulici, výkon trestu i léčbu. Nehledá omluvu, ale cestu ke změně.</p><h2>Druhá šance v praxi</h2><p>Nejsilnější částí není popis pádu, ale rozhodnutí nevzdat se. Konkrétní plán, odpovědnost, práce, bydlení a dlouhodobá opora dávají tomuto rozhodnutí šanci vydržet.</p>'
  }
];

function slugifyPathSegment(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\|\|/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'aktualita';
}

function publicNewsRow(row) {
  const { image_url: imageUrlFromDatabase, ...rest } = row;
  return {
    ...rest,
    slug: slugifyPathSegment(row.slug || row.title || row.id),
    imageUrl: row.imageUrl || imageUrlFromDatabase || ''
  };
}

function newsPublicPath(row) {
  if (row.tag === secondChanceStoryTag) return `/pribehy-druhe-sance/${encodeURIComponent(row.id)}`;
  return `/aktuality/${slugifyPathSegment(row.tag || 'Aktuality projektu')}/${slugifyPathSegment(row.slug || row.title || row.id)}`;
}

function escapeXml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function stripHtml(value) {
  return String(value || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function sanitizePublicArticleHtml(value) {
  return String(value || '')
    .replace(/<(script|style|iframe|object|embed|form)[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/\son\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/\s(?:href|src)\s*=\s*(["'])\s*javascript:[\s\S]*?\1/gi, '')
    .replace(/<h1(\s[^>]*)?>/gi, '<h3$1>')
    .replace(/<\/h1\s*>/gi, '</h3>');
}

function publicAbsoluteUrl(value) {
  const candidate = String(value || '');
  if (!/^(https?:\/\/|\/)/i.test(candidate)) return '';
  try {
    return new URL(candidate, publicSiteUrl).href;
  } catch {
    return '';
  }
}

async function uniqueNewsSlug(requestedSlug, title, id) {
  const base = slugifyPathSegment(requestedSlug || title);
  let candidate = base;
  let suffix = 2;
  try {
    while ((await query('SELECT id FROM news WHERE slug = ? AND id <> ? LIMIT 1', [candidate, id])).length > 0) {
      candidate = `${base}-${suffix}`;
      suffix += 1;
    }
  } catch (error) {
    if (!isUnknownColumnError(error)) throw error;
  }
  return candidate;
}

const publicRoot = path.resolve(__dirname, '..', 'public');
const portalRoles = ['applicant', 'client', 'volunteer', 'investor', 'patron', 'contributor', 'donor', 'user'];
const assignableRoles = ['admin', 'editor', ...portalRoles];
const applicationRoles = ['client', 'volunteer', 'investor', 'patron', 'contributor', 'donor'];
const applicationStatuses = ['pending', 'approved', 'rejected'];
const roleLabels = {
  admin: 'Administrátor',
  editor: 'Editor',
  applicant: 'Uchazeč',
  client: 'Klient',
  volunteer: 'Dobrovolník',
  investor: 'Investor',
  patron: 'Mecenáš',
  contributor: 'Přispěvatel',
  donor: 'Jednorázový dárce',
  user: 'Uživatel'
};
const documentMimeTypes = {
  '.pdf': 'application/pdf',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
};
const materialOfferTypes = ['clothing', 'equipment', 'books'];
const materialOfferTransports = ['donor-delivery', 'project-pickup', 'agreement'];
const materialOfferStatuses = ['new', 'reviewing', 'accepted', 'pickup_planned', 'received', 'declined', 'closed'];
const materialOfferImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
const materialOfferTypeLabels = {
  clothing: 'oblečení',
  equipment: 'vybavení',
  books: 'knihy'
};
const materialOfferStatusLabels = {
  new: 'Nová',
  reviewing: 'Prověřujeme',
  accepted: 'Přijato',
  pickup_planned: 'Svoz naplánován',
  received: 'Převzato',
  declined: 'Odmítnuto',
  closed: 'Uzavřeno'
};
const maxMaterialOfferPhotos = 4;
const maxMaterialOfferPhotoBytes = 2_000_000;

const isPortalRole = (role) => portalRoles.includes(String(role || ''));

async function servePublicDocument(request, response, url) {
  if (!['GET', 'HEAD'].includes(request.method) || !url.pathname.startsWith('/documents/')) {
    return false;
  }

  let decodedPath;
  try {
    decodedPath = decodeURIComponent(url.pathname);
  } catch {
    sendJson(response, 400, { error: 'Invalid file path.' });
    return true;
  }

  const filePath = path.resolve(publicRoot, `.${decodedPath}`);
  if (!filePath.startsWith(`${publicRoot}${path.sep}`)) {
    sendJson(response, 403, { error: 'Forbidden.' });
    return true;
  }

  let stat;
  try {
    stat = await fs.promises.stat(filePath);
  } catch {
    sendJson(response, 404, { error: 'File not found.' });
    return true;
  }

  if (!stat.isFile()) {
    sendJson(response, 404, { error: 'File not found.' });
    return true;
  }

  response.writeHead(200, {
    'content-type': documentMimeTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
    'content-length': stat.size,
    'cache-control': 'public, max-age=3600'
  });

  if (request.method === 'HEAD') {
    response.end();
    return true;
  }

  fs.createReadStream(filePath).pipe(response);
  return true;
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let raw = '';
    request.on('data', (chunk) => {
      raw += chunk.toString();
      if (raw.length > 12_000_000) {
        reject(new Error('Request body is too large.'));
        request.destroy();
      }
    });
    request.on('end', () => {
      if (!raw) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error('Invalid JSON body.'));
      }
    });
    request.on('error', reject);
  });
}

function publicUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    role: row.role,
    name: row.name,
    email: row.email,
    phone: row.phone || '',
    isActive: row.is_active === undefined ? true : Boolean(row.is_active),
    lastLoginAt: row.last_login_at || null,
    createdAt: row.created_at
  };
}

async function currentUser(request) {
  const cookies = parseCookies(request.headers.cookie || '');
  const payload = readSessionToken(cookies[sessionCookieName]);
  if (!payload) return null;
  const rows = await query(
    'SELECT id, role, name, email, phone, is_active, created_at FROM users WHERE id = ? AND is_active = 1 LIMIT 1',
    [payload.id]
  );
  return rows[0] || null;
}

function requireFields(body, fields) {
  for (const field of fields) {
    if (!String(body[field] || '').trim()) {
      return `${field} is required.`;
    }
  }
  return null;
}

async function requireAdmin(request, response) {
  const user = await currentUser(request);
  if (!user || user.role !== 'admin') {
    sendJson(response, 403, { error: 'Admin access required.' });
    return null;
  }
  return user;
}

function truncateText(value, maxLength = 150) {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
}

async function createSystemNotification({
  recipientId = null,
  title,
  body,
  tone = 'info',
  category = 'Systém',
  linkHref = '',
  createdBy = null
}) {
  try {
    await query(
      `INSERT INTO notifications (id, recipient_id, title, body, tone, category, link_href, created_by)
       VALUES (?, ?, ?, ?, ?, ?, NULLIF(?, ''), ?)`,
      [randomId(), recipientId, title, body, tone, category, linkHref, createdBy]
    );
  } catch (error) {
    console.warn('[notifications] system notification failed:', error.message);
  }
}

function publicBaseUrl(request) {
  const configured = String(process.env.APP_BASE_URL || process.env.PUBLIC_BASE_URL || '').trim();
  if (configured) return configured.replace(/\/+$/, '');
  const host = request.headers['x-forwarded-host'] || request.headers.host || 'localhost:3000';
  const proto = request.headers['x-forwarded-proto'] || (process.env.NODE_ENV === 'production' ? 'https' : 'http');
  return `${String(proto).split(',')[0]}://${String(host).split(',')[0]}`.replace(/\/+$/, '');
}

function resetRouteForRole(role) {
  return role === 'admin' ? '/admin' : '/klient';
}

function buildResetUrl(request, token, role) {
  return `${publicBaseUrl(request)}${resetRouteForRole(role)}?resetToken=${encodeURIComponent(token)}`;
}

let mailTransporter = null;

function smtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_FROM);
}

function getMailTransporter() {
  if (!smtpConfigured()) return null;
  if (mailTransporter) return mailTransporter;
  const port = Number(process.env.SMTP_PORT || 587);
  mailTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: process.env.SMTP_SECURE === '1' || port === 465,
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASS
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        : undefined
  });
  return mailTransporter;
}

async function sendPasswordResetEmail(user, resetUrl) {
  const transporter = getMailTransporter();
  if (!transporter) return false;
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: user.email,
    subject: 'Obnova hesla | REST||ART Integrace',
    text: [
      `Dobrý den${user.name ? `, ${user.name}` : ''},`,
      '',
      'pro obnovu hesla použijte tento odkaz:',
      resetUrl,
      '',
      'Odkaz je platný 60 minut. Pokud jste o obnovu hesla nežádali, zprávu ignorujte.',
      '',
      'REST||ART Integrace'
    ].join('\n'),
    html: [
      `<p>Dobrý den${user.name ? `, ${user.name}` : ''},</p>`,
      '<p>pro obnovu hesla použijte tento odkaz:</p>',
      `<p><a href="${resetUrl}">${resetUrl}</a></p>`,
      '<p>Odkaz je platný 60 minut. Pokud jste o obnovu hesla nežádali, zprávu ignorujte.</p>',
      '<p>REST||ART Integrace</p>'
    ].join('')
  });
  return true;
}

function escapeEmailHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderEmailTemplate(template, variables, html = false) {
  return String(template || '').replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_match, key) => {
    const value = variables[key] ?? '';
    return html ? escapeEmailHtml(value) : String(value);
  });
}

async function sendEmailTemplate(templateKey, recipients, variables) {
  const transporter = getMailTransporter();
  const to = [...new Set((Array.isArray(recipients) ? recipients : [recipients]).map((item) => String(item || '').trim()).filter(Boolean))];
  if (!transporter || to.length === 0) return false;
  const rows = await query(
    `SELECT template_key, subject AS subject_template, text_body AS text_template,
            html_body AS html_template, is_active
     FROM email_templates WHERE template_key = ? LIMIT 1`,
    [templateKey]
  );
  const template = rows[0];
  if (!template || !template.is_active) return false;
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: renderEmailTemplate(template.subject_template, variables),
    text: renderEmailTemplate(template.text_template, variables),
    html: renderEmailTemplate(template.html_template, variables, true)
  });
  return true;
}

async function materialOfferAdminEmails() {
  const configured = String(process.env.MATERIAL_OFFER_ADMIN_EMAILS || '')
    .split(/[;,]/)
    .map((email) => email.trim())
    .filter(Boolean);
  const rows = await query(
    `SELECT email FROM users
     WHERE role IN ('admin', 'editor') AND is_active = 1 AND email IS NOT NULL AND email <> ''`
  );
  return [...new Set([...configured, ...rows.map((row) => String(row.email || '').trim()).filter(Boolean)])];
}

function materialOfferEmailVariables(offer, request) {
  const pickupParts = [offer.pickup_at ? new Date(offer.pickup_at).toLocaleString('cs-CZ') : '', offer.pickup_address || ''].filter(Boolean);
  return {
    donorName: offer.donor_name || '',
    offerType: materialOfferTypeLabels[offer.offer_type] || offer.offer_type || '',
    offerId: offer.id || '',
    locality: offer.locality || '',
    quantity: offer.quantity || '',
    statusLabel: materialOfferStatusLabels[offer.status] || offer.status || '',
    pickupDetails: pickupParts.join(', '),
    adminUrl: `${publicBaseUrl(request)}/admin?tab=materialOffers`
  };
}

async function sendMaterialOfferCreatedEmails(offer, request) {
  const variables = materialOfferEmailVariables(offer, request);
  let donorSent = false;
  let adminSent = false;
  try {
    if (offer.email) donorSent = await sendEmailTemplate('material_offer_donor_confirmation', offer.email, variables);
  } catch (error) {
    console.warn('[mail] material offer donor confirmation failed:', error.message);
  }
  try {
    adminSent = await sendEmailTemplate('material_offer_admin_alert', await materialOfferAdminEmails(), variables);
  } catch (error) {
    console.warn('[mail] material offer admin alert failed:', error.message);
  }
  if (donorSent || adminSent) {
    await query(
      `UPDATE material_offers
       SET donor_notified_at = IF(?, NOW(), donor_notified_at),
           admin_notified_at = IF(?, NOW(), admin_notified_at)
       WHERE id = ?`,
      [donorSent ? 1 : 0, adminSent ? 1 : 0, offer.id]
    ).catch((error) => console.warn('[mail] material offer notification timestamp failed:', error.message));
  }
}

async function sendMaterialOfferStatusEmail(offer, request) {
  if (!offer.email) return false;
  try {
    return await sendEmailTemplate(
      'material_offer_status_update',
      offer.email,
      materialOfferEmailVariables(offer, request)
    );
  } catch (error) {
    console.warn('[mail] material offer status update failed:', error.message);
    return false;
  }
}

async function createPasswordResetForUser(user, request) {
  const token = crypto.randomBytes(32).toString('base64url');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const resetUrl = buildResetUrl(request, token, user.role);
  await query('DELETE FROM password_resets WHERE user_id = ? OR expires_at < NOW() OR used_at IS NOT NULL', [user.id]);
  await query(
    `INSERT INTO password_resets (id, user_id, token_hash, expires_at)
     VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 1 HOUR))`,
    [randomId(), user.id, tokenHash]
  );
  let emailSent = false;
  try {
    emailSent = await sendPasswordResetEmail(user, resetUrl);
  } catch (error) {
    console.warn('[mail] password reset email failed:', error.message);
  }
  const bodyResponse = {
    ok: true,
    message: emailSent
      ? 'Odkaz pro obnovu hesla byl odeslán e-mailem.'
      : 'Odkaz pro obnovu hesla byl připraven. E-mailová brána není nastavená nebo odeslání selhalo.',
    expiresInMinutes: 60,
    emailSent
  };
  if (process.env.NODE_ENV !== 'production' || process.env.RESET_TOKEN_IN_RESPONSE === '1') {
    bodyResponse.resetToken = token;
    bodyResponse.resetUrl = resetUrl;
  }
  return bodyResponse;
}

function googleOAuthConfig(request) {
  const clientId = String(process.env.GOOGLE_OAUTH_CLIENT_ID || '').trim();
  const clientSecret = String(process.env.GOOGLE_OAUTH_CLIENT_SECRET || '').trim();
  if (!clientId || !clientSecret) return null;
  const redirectUri =
    String(process.env.GOOGLE_OAUTH_REDIRECT_URI || '').trim() || `${publicBaseUrl(request)}/api/auth/google/callback`;
  return {
    clientId,
    redirectUri,
    client: new OAuth2Client(clientId, clientSecret, redirectUri)
  };
}

function googleRedirect(request, target, reason = '') {
  const path = target === 'admin' ? '/admin' : '/klient';
  return `${publicBaseUrl(request)}${path}${reason ? `?auth=${encodeURIComponent(reason)}` : ''}`;
}

async function registerClient(request, response) {
  const body = await readBody(request);
  const missing = requireFields(body, ['name', 'email', 'password']);
  if (missing) {
    sendJson(response, 400, { error: missing });
    return;
  }

  const existing = await query('SELECT id FROM users WHERE email = ? LIMIT 1', [body.email.trim().toLowerCase()]);
  if (existing.length > 0) {
    sendJson(response, 409, { error: 'Account already exists.' });
    return;
  }

  const id = randomId();
  const email = body.email.trim().toLowerCase();
  await query(
    `INSERT INTO users (id, role, name, email, phone, password_hash, password_algo, is_active)
     VALUES (?, 'applicant', ?, ?, ?, ?, 'scrypt', 1)`,
    [id, body.name.trim(), email, String(body.phone || '').trim(), hashPassword(body.password)]
  );

  const rows = await query('SELECT id, role, name, email, phone, is_active, created_at FROM users WHERE id = ? LIMIT 1', [id]);
  const user = rows[0];
  await createSystemNotification({
    title: 'Nový uchazeč se zaregistroval',
    body: `${user.name} (${user.email}) vytvořil/a profil uchazeče. Dalším krokem je žádost o vstup do projektu.`,
    tone: 'info',
    category: 'Registrace',
    linkHref: `#/admin?tab=users&user=${encodeURIComponent(user.id)}`,
    createdBy: user.id
  });
  sendJson(response, 201, {
    user: publicUser(user),
    pendingVerification: false,
    message: 'Profil uchazeče byl vytvořen. Teď můžete podat žádost o vstup do projektu.'
  }, { 'set-cookie': sessionCookie(createSessionToken(user)) });
}

async function login(request, response) {
  const body = await readBody(request);
  const missing = requireFields(body, ['email', 'password']);
  if (missing) {
    sendJson(response, 400, { error: missing });
    return;
  }

  const requestedRole = String(body.role || '').trim();
  const email = body.email.trim().toLowerCase();
  let roleClause = '';
  let params = [email];
  if (requestedRole === 'admin') {
    roleClause = 'AND role = ?';
    params = [email, 'admin'];
  } else if (requestedRole === 'client' || isPortalRole(requestedRole)) {
    roleClause = `AND role IN (${portalRoles.map(() => '?').join(', ')})`;
    params = [email, ...portalRoles];
  }
  const rows = await query(
    `SELECT id, role, name, email, phone, password_hash, is_active, created_at
     FROM users
     WHERE email = ? ${roleClause}
     LIMIT 1`,
    params
  );
  const user = rows[0];
  if (!user || !verifyPassword(body.password, user.password_hash)) {
    sendJson(response, 401, { error: 'Invalid credentials.' });
    return;
  }
  if (!user.is_active) {
    sendJson(response, 403, { error: 'Účet čeká na ověření nebo aktivaci administrátorem.' });
    return;
  }

  await query('UPDATE users SET last_login_at = NOW() WHERE id = ?', [user.id]);
  sendJson(response, 200, { user: publicUser(user) }, { 'set-cookie': sessionCookie(createSessionToken(user)) });
}

async function me(request, response) {
  const user = await currentUser(request);
  if (!user) {
    sendJson(response, 200, { user: null });
    return;
  }
  sendJson(response, 200, { user: publicUser(user) });
}

async function logout(_request, response) {
  sendJson(response, 200, { ok: true }, { 'set-cookie': clearSessionCookie() });
}

async function startGoogleLogin(request, response, url) {
  const config = googleOAuthConfig(request);
  if (!config) {
    sendJson(response, 501, { error: 'Google OAuth is not configured.' });
    return;
  }
  const role = url.searchParams.get('role') === 'admin' ? 'admin' : 'client';
  const state = crypto.randomBytes(24).toString('base64url');
  const stateCookieValue = [state, role].join('|');
  const authUrl = config.client.generateAuthUrl({
    access_type: 'online',
    prompt: 'select_account',
    scope: ['openid', 'email', 'profile'],
    state
  });
  sendRedirect(response, authUrl, { 'set-cookie': oauthStateCookie(stateCookieValue) });
}

async function finishGoogleLogin(request, response, url) {
  const config = googleOAuthConfig(request);
  if (!config) {
    sendRedirect(response, googleRedirect(request, 'client', 'google-error'));
    return;
  }
  const cookies = parseCookies(request.headers.cookie || '');
  const [expectedState, requestedRole = 'client'] = String(cookies[oauthStateCookieName] || '').split('|');
  const receivedState = String(url.searchParams.get('state') || '');
  const code = String(url.searchParams.get('code') || '');
  const target = requestedRole === 'admin' ? 'admin' : 'client';
  if (!expectedState || !receivedState || expectedState !== receivedState || !code) {
    sendRedirect(response, googleRedirect(request, target, 'google-error'), { 'set-cookie': clearOAuthStateCookie() });
    return;
  }
  try {
    const { tokens } = await config.client.getToken(code);
    if (!tokens.id_token) {
      sendRedirect(response, googleRedirect(request, target, 'google-error'), { 'set-cookie': clearOAuthStateCookie() });
      return;
    }
    const ticket = await config.client.verifyIdToken({
      idToken: tokens.id_token,
      audience: config.clientId
    });
    const payload = ticket.getPayload() || {};
    const email = String(payload.email || '').trim().toLowerCase();
    const emailVerified = payload.email_verified === true || payload.email_verified === 'true';
    if (!email || !emailVerified) {
      sendRedirect(response, googleRedirect(request, target, 'google-error'), { 'set-cookie': clearOAuthStateCookie() });
      return;
    }
    const rows = await query(
      'SELECT id, role, name, email, phone, is_active, created_at FROM users WHERE email = ? LIMIT 1',
      [email]
    );
    let user = rows[0];
    if (!user) {
      if (target === 'admin') {
        sendRedirect(response, googleRedirect(request, target, 'google-admin-denied'), { 'set-cookie': clearOAuthStateCookie() });
        return;
      }
      const id = randomId();
      const name = String(payload.name || email).trim();
      await query(
        `INSERT INTO users (id, role, name, email, phone, password_hash, password_algo, is_active)
         VALUES (?, 'applicant', ?, ?, '', ?, 'scrypt', 1)`,
        [id, name, email, hashPassword(crypto.randomBytes(32).toString('base64url'))]
      );
      const createdRows = await query(
        'SELECT id, role, name, email, phone, is_active, created_at FROM users WHERE id = ? LIMIT 1',
        [id]
      );
      user = createdRows[0];
      await createSystemNotification({
        title: 'Nový Google uchazeč',
        body: `${user.name} (${user.email}) se registroval/a přes Google. Dalším krokem je žádost o vstup do projektu.`,
        tone: 'info',
        category: 'Registrace',
        linkHref: `#/admin?tab=users&user=${encodeURIComponent(user.id)}`,
        createdBy: user.id
      });
      await query('UPDATE users SET last_login_at = NOW() WHERE id = ?', [user.id]);
      sendRedirect(response, googleRedirect(request, target), {
        'set-cookie': [clearOAuthStateCookie(), sessionCookie(createSessionToken(user))]
      });
      return;
    }
    if (target === 'admin' && user.role !== 'admin') {
      sendRedirect(response, googleRedirect(request, target, 'google-admin-denied'), { 'set-cookie': clearOAuthStateCookie() });
      return;
    }
    if (target !== 'admin' && user.role !== 'admin' && !isPortalRole(user.role)) {
      sendRedirect(response, googleRedirect(request, target, 'google-role-denied'), { 'set-cookie': clearOAuthStateCookie() });
      return;
    }
    if (!user.is_active) {
      sendRedirect(response, googleRedirect(request, target, 'google-inactive'), { 'set-cookie': clearOAuthStateCookie() });
      return;
    }
    await query('UPDATE users SET last_login_at = NOW() WHERE id = ?', [user.id]);
    sendRedirect(response, googleRedirect(request, target), {
      'set-cookie': [clearOAuthStateCookie(), sessionCookie(createSessionToken(user))]
    });
  } catch (error) {
    console.warn('[auth] google login failed:', error.message);
    sendRedirect(response, googleRedirect(request, target, 'google-error'), { 'set-cookie': clearOAuthStateCookie() });
  }
}

async function resetPassword(request, response) {
  const body = await readBody(request);
  if (!String(body.email || '').trim()) {
    sendJson(response, 400, { error: 'email is required.' });
    return;
  }
  const email = String(body.email).trim().toLowerCase();
  const rows = await query('SELECT id, role, name, email FROM users WHERE email = ? AND is_active = 1 LIMIT 1', [email]);
  const message = 'Pokud účet existuje, je připravený odkaz pro obnovu hesla.';
  if (rows.length === 0) {
    sendJson(response, 200, { ok: true, message });
    return;
  }
  const reset = await createPasswordResetForUser(rows[0], request);
  sendJson(response, 200, { ...reset, message });
}

async function confirmPasswordReset(request, response) {
  const body = await readBody(request);
  const token = String(body.token || '').trim();
  const password = String(body.password || '');
  if (!token) {
    sendJson(response, 400, { error: 'token is required.' });
    return;
  }
  if (password.length < 8) {
    sendJson(response, 400, { error: 'Password must be at least 8 characters.' });
    return;
  }
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const rows = await query(
    `SELECT resets.id, resets.user_id
     FROM password_resets resets
     JOIN users ON users.id = resets.user_id
     WHERE resets.token_hash = ?
       AND resets.used_at IS NULL
       AND resets.expires_at > NOW()
       AND users.is_active = 1
     LIMIT 1`,
    [tokenHash]
  );
  if (rows.length === 0) {
    sendJson(response, 400, { error: 'Reset token is invalid or expired.' });
    return;
  }
  await query(
    `UPDATE users
     SET password_hash = ?, password_algo = 'scrypt', password_reset_required = 0
     WHERE id = ?`,
    [hashPassword(password), rows[0].user_id]
  );
  await query('UPDATE password_resets SET used_at = NOW() WHERE id = ?', [rows[0].id]);
  sendJson(response, 200, { ok: true, message: 'Heslo bylo úspěšně změněno. Můžete se přihlásit.' });
}

async function loadPublishedNewsRows(limit = 500) {
  let rows;
  try {
    rows = await query(
      `SELECT id, title, slug, tag, image_url, DATE_FORMAT(published_at, '%Y-%m-%d') AS date, excerpt, body
       FROM news
       WHERE status = 'published'
       ORDER BY published_at DESC, created_at DESC
       LIMIT ?`,
      [limit]
    );
  } catch (error) {
    if (!isUnknownColumnError(error)) throw error;
    try {
      rows = await query(
        `SELECT id, title, tag, image_url, DATE_FORMAT(published_at, '%Y-%m-%d') AS date, excerpt, body
         FROM news
         WHERE status = 'published'
         ORDER BY published_at DESC, created_at DESC
         LIMIT ?`,
        [limit]
      );
    } catch (legacyError) {
      if (!isUnknownColumnError(legacyError)) throw legacyError;
      rows = await query(
        `SELECT id, title, DATE_FORMAT(published_at, '%Y-%m-%d') AS date, excerpt, body
         FROM news
         WHERE status = 'published'
         ORDER BY published_at DESC, created_at DESC
         LIMIT ?`,
        [limit]
      );
    }
  }
  return rows;
}

async function listNews(_request, response) {
  const rows = await loadPublishedNewsRows(500);
  sendJson(response, 200, { news: rows.map(publicNewsRow) });
}

let newsShellCache = { origin: '', html: '', expiresAt: 0 };

function fallbackNewsShell() {
  return `<!doctype html>
<html lang="cs">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Aktuality | RESTART Integrace</title>
    <meta name="description" content="Aktuality a veřejné informace projektu RESTART Integrace." />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
    <link rel="canonical" href="${publicSiteUrl}/aktuality" />
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;
}

async function loadNewsShell(request) {
  const forwardedHost = String(request.headers['x-forwarded-host'] || request.headers.host || '').split(',')[0].trim();
  const localDevelopmentHost =
    process.env.NODE_ENV !== 'production' && /^(?:localhost|127\.0\.0\.1)(?::\d+)?$/i.test(forwardedHost);
  const deploymentHost = String(process.env.VERCEL_URL || '').trim();
  const publicHost = new URL(publicSiteUrl).host;
  const origins = Array.from(
    new Set(
      [
        forwardedHost === publicHost ? publicSiteUrl : '',
        localDevelopmentHost ? `http://${forwardedHost}` : '',
        deploymentHost ? `https://${deploymentHost}` : '',
        publicSiteUrl
      ].filter(Boolean)
    )
  );
  if (newsShellCache.html && origins.includes(newsShellCache.origin) && newsShellCache.expiresAt > Date.now()) {
    return newsShellCache.html;
  }

  for (const origin of origins) {
    try {
      const shellResponse = await fetch(`${origin}/`, {
        headers: { accept: 'text/html', 'user-agent': 'RESTART-SEO-renderer/1.0' },
        signal: AbortSignal.timeout(5000)
      });
      if (!shellResponse.ok) continue;
      const html = await shellResponse.text();
      if (!html.includes('<div id="root"') || !/<script[^>]+src=["'][^"']*\/assets\//i.test(html)) continue;
      newsShellCache = { origin, html, expiresAt: Date.now() + 5 * 60 * 1000 };
      return html;
    } catch {
      // Try the next trusted origin. Preview deployments can be protected while the public origin remains available.
    }
  }

  return fallbackNewsShell();
}

function replaceHtmlMeta(html, pattern, replacement) {
  return pattern.test(html) ? html.replace(pattern, replacement) : html;
}

function renderNewsArchiveSnapshot(tag, items) {
  const mediaMaterialsIntro =
    tag === 'Média a materiály'
      ? `<section>
      <h2>Veřejná knihovna projektu</h2>
      <p>Brožury, metodické vizuály, programové podklady a videa projektu REST||ART Integrace s jasným původem a kontextem.</p>
      <ul>
        <li><a href="/media">Brožury, plakát a fotografie ke stažení</a></li>
        <li><a href="/metodika#metodika-vizualy">Vizuální knihovna metodiky</a></li>
        <li><a href="/programy">Programové podklady</a></li>
        <li><a href="/videa/predstaveni-projektu">Oficiální videa projektu</a></li>
      </ul>
    </section>`
      : '';
  return `<main class="seo-route-snapshot" data-seo-snapshot="news-archive">
    <header>
      <p class="section-label">Archiv aktualit</p>
      <h1>${escapeHtml(tag)}</h1>
      <p>Veřejné aktuality projektu RESTART Integrace zařazené pod tematickým štítkem ${escapeHtml(tag)}.</p>
    </header>
    ${mediaMaterialsIntro}
    <section>
      <h2>Publikované příspěvky</h2>
      <ul>
        ${items
          .map(
            (item) =>
              `<li><a href="${escapeHtml(newsPublicPath(item))}"><strong>${escapeHtml(item.title)}</strong></a> <time datetime="${escapeHtml(
                item.date
              )}">${escapeHtml(item.date)}</time><p>${escapeHtml(item.excerpt || stripHtml(item.body).slice(0, 220))}</p></li>`
          )
          .join('\n        ')}
      </ul>
    </section>
    <nav aria-label="Související stránky"><a href="/aktuality">Všechny aktuality</a><a href="/media">Média ke stažení</a><a href="/metodika">Metodika</a><a href="/">Úvod</a></nav>
  </main>`;
}

function renderNewsArticleSnapshot(item) {
  const safeBody =
    sanitizePublicArticleHtml(item.body) ||
    `<p>${escapeHtml(item.excerpt || 'Veřejná aktualita projektu RESTART Integrace.')}</p>`;
  const safeImage = publicAbsoluteUrl(item.imageUrl);
  return `<main class="seo-route-snapshot" data-seo-snapshot="news-article">
    <article>
      <header>
        <p class="section-label">${escapeHtml(item.tag || 'Aktuality projektu')}</p>
        <h1>${escapeHtml(item.title)}</h1>
        <p><time datetime="${escapeHtml(item.date)}">${escapeHtml(item.date)}</time></p>
        <p>${escapeHtml(item.excerpt || stripHtml(item.body).slice(0, 260))}</p>
        ${safeImage ? `<img src="${escapeHtml(safeImage)}" alt="${escapeHtml(item.title)}" loading="eager" />` : ''}
      </header>
      <section>
        <h2>Podrobnosti</h2>
        ${safeBody}
      </section>
    </article>
    <nav aria-label="Související stránky"><a href="/aktuality/${escapeHtml(slugifyPathSegment(item.tag || 'Aktuality projektu'))}">Další příspěvky v rubrice</a><a href="/aktuality">Všechny aktuality</a><a href="/media">Média ke stažení</a><a href="/kontakt">Kontakt</a></nav>
  </main>`;
}

function renderNewsHtml(shell, { canonical, title, description, snapshot, item, isArchive }) {
  const articleImage = publicAbsoluteUrl(item?.imageUrl);
  const graph = {
    '@context': 'https://schema.org',
    '@type': isArchive ? 'CollectionPage' : 'NewsArticle',
    ...(isArchive ? {} : { headline: title }),
    name: title,
    description,
    url: canonical,
    inLanguage: 'cs-CZ',
    image: articleImage || undefined,
    datePublished: item?.date || undefined,
    dateModified: item?.date || undefined,
    articleSection: item?.tag || undefined,
    mainEntityOfPage: canonical,
    publisher: {
      '@type': 'Organization',
      name: 'RESTART Integrace',
      url: `${publicSiteUrl}/`
    }
  };
  let html = shell;
  html = replaceHtmlMeta(html, /<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)} | RESTART Integrace</title>`);
  html = replaceHtmlMeta(
    html,
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${escapeHtml(description)}" />`
  );
  html = replaceHtmlMeta(
    html,
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${escapeHtml(canonical)}" />`
  );
  html = replaceHtmlMeta(
    html,
    /<meta\s+property="og:type"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:type" content="${isArchive ? 'website' : 'article'}" />`
  );
  html = replaceHtmlMeta(
    html,
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:title" content="${escapeHtml(title)}" />`
  );
  html = replaceHtmlMeta(
    html,
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:description" content="${escapeHtml(description)}" />`
  );
  html = replaceHtmlMeta(
    html,
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:url" content="${escapeHtml(canonical)}" />`
  );
  html = replaceHtmlMeta(
    html,
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`
  );
  html = replaceHtmlMeta(
    html,
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`
  );
  if (articleImage) {
    html = replaceHtmlMeta(
      html,
      /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/,
      `<meta property="og:image" content="${escapeHtml(articleImage)}" />`
    );
    html = replaceHtmlMeta(
      html,
      /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/,
      `<meta name="twitter:image" content="${escapeHtml(articleImage)}" />`
    );
  }
  const structuredDataTag = `<script type="application/ld+json">${JSON.stringify(graph).replace(
    /</g,
    '\\u003c'
  )}</script>`;
  html = /<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/.test(html)
    ? html.replace(/<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/, structuredDataTag)
    : html.replace('</head>', `    ${structuredDataTag}\n  </head>`);
  return html.replace(/<div id="root">[\s\S]*?<\/div>\s*<\/body>/, `<div id="root">${snapshot}</div>\n  </body>`);
}

async function newsSeoPage(request, response, url) {
  const suffix = decodeURIComponent(String(url.searchParams.get('publicPath') || ''))
    .replace(/^\/+|\/+$/g, '')
    .replace(/\.{2,}/g, '');
  const scope = url.searchParams.get('scope') === 'stories' ? 'stories' : 'news';
  if (!suffix) {
    sendRedirect(response, scope === 'stories' ? '/pribehy-druhe-sance' : '/aktuality');
    return;
  }

  let databaseRows = [];
  try {
    databaseRows = await loadPublishedNewsRows(5000);
  } catch (error) {
    if (!isTransientDatabaseError(error)) throw error;
    console.warn('[seo] Published news database is temporarily unavailable; serving built-in article fallbacks.');
  }
  const itemByPath = new Map();
  [...builtInNewsSitemapRows, ...databaseRows]
    .map(publicNewsRow)
    .forEach((item) => itemByPath.set(newsPublicPath(item), item));
  const items = Array.from(itemByPath.values());
  const publicPath = scope === 'stories' ? `/pribehy-druhe-sance/${suffix}` : `/aktuality/${suffix}`;
  const shell = await loadNewsShell(request);
  const item = itemByPath.get(publicPath);

  if (item) {
    const canonical = `${publicSiteUrl}${publicPath}`;
    const description = item.excerpt || stripHtml(item.body).slice(0, 300) || `Aktualita ${item.title}.`;
    sendHtml(
      response,
      200,
      renderNewsHtml(shell, {
        canonical,
        title: item.title,
        description,
        snapshot: renderNewsArticleSnapshot(item),
        item,
        isArchive: false
      })
    );
    return;
  }

  if (scope === 'news' && !suffix.includes('/')) {
    const archiveItems = items.filter(
      (candidate) =>
        candidate.tag !== secondChanceStoryTag && slugifyPathSegment(candidate.tag || 'Aktuality projektu') === suffix
    );
    if (archiveItems.length > 0) {
      const tag = archiveItems[0].tag || 'Aktuality projektu';
      const canonical = `${publicSiteUrl}${publicPath}`;
      const description =
        tag === 'Média a materiály'
          ? 'Veřejná knihovna brožur, metodických vizuálů, programových podkladů a videí projektu REST||ART Integrace.'
          : `Archiv veřejných aktualit projektu RESTART Integrace se štítkem ${tag}.`;
      sendHtml(
        response,
        200,
        renderNewsHtml(shell, {
          canonical,
          title: tag,
          description,
          snapshot: renderNewsArchiveSnapshot(tag, archiveItems),
          isArchive: true
        })
      );
      return;
    }
  }

  sendHtml(
    response,
    404,
    renderNewsHtml(shell, {
      canonical: `${publicSiteUrl}${publicPath}`,
      title: 'Aktualita nebyla nalezena',
      description: 'Požadovaná aktualita nebyla nalezena.',
      snapshot: `<main class="seo-route-snapshot"><header><h1>Aktualita nebyla nalezena</h1><p>Požadovaný příspěvek není veřejně dostupný.</p></header><nav><a href="/aktuality">Zpět na aktuality</a></nav></main>`,
      isArchive: true
    }),
    { 'x-robots-tag': 'noindex, follow' }
  );
}

async function newsSitemap(_request, response) {
  let rows = [];
  try {
    rows = await query(
      `SELECT id, title, slug, tag, DATE_FORMAT(published_at, '%Y-%m-%d') AS date
       FROM news
       WHERE status = 'published'
       ORDER BY published_at DESC, created_at DESC
       LIMIT 5000`
    );
  } catch (error) {
    if (isUnknownColumnError(error)) {
      rows = await query(
        `SELECT id, title, tag, DATE_FORMAT(published_at, '%Y-%m-%d') AS date
         FROM news
         WHERE status = 'published'
         ORDER BY published_at DESC, created_at DESC
         LIMIT 5000`
      );
    } else if (isTransientDatabaseError(error)) {
      console.warn('[seo] Published news database is temporarily unavailable; serving the built-in sitemap.');
    } else {
      throw error;
    }
  }

  const itemByPath = new Map();
  [...builtInNewsSitemapRows, ...rows].map(publicNewsRow).forEach((item) => itemByPath.set(newsPublicPath(item), item));
  const items = Array.from(itemByPath.values()).sort((a, b) => String(b.date).localeCompare(String(a.date)));
  const tagEntries = new Map();
  for (const item of items) {
    if (item.tag === secondChanceStoryTag) continue;
    const path = `/aktuality/${slugifyPathSegment(item.tag || 'Aktuality projektu')}`;
    const previousDate = tagEntries.get(path);
    if (!previousDate || item.date > previousDate) tagEntries.set(path, item.date);
  }
  const urls = [
    { path: '/aktuality', date: items[0]?.date || new Date().toISOString().slice(0, 10) },
    ...Array.from(tagEntries, ([path, date]) => ({ path, date })),
    ...items.map((item) => ({ path: newsPublicPath(item), date: item.date }))
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (entry) => `  <url>
    <loc>${escapeXml(`${publicSiteUrl}${entry.path}`)}</loc>
    <lastmod>${escapeXml(entry.date)}</lastmod>
    <changefreq>${entry.path === '/aktuality' ? 'daily' : 'weekly'}</changefreq>
    <priority>${entry.path === '/aktuality' ? '0.8' : '0.7'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;
  sendXml(response, 200, xml);
}

async function saveNews(request, response) {
  const user = await currentUser(request);
  if (!user || user.role !== 'admin') {
    sendJson(response, 403, { error: 'Admin access required.' });
    return;
  }
  const body = await readBody(request);
  const missing = requireFields(body, ['title', 'excerpt']);
  if (missing) {
    sendJson(response, 400, { error: missing });
    return;
  }
  const id = body.id || randomId();
  const date = String(body.date || '').trim() || new Date().toISOString().slice(0, 10);
  const tag = String(body.tag || '').trim() || null;
  const imageUrl = String(body.imageUrl || '').trim() || null;
  const slug = await uniqueNewsSlug(body.slug, body.title, id);
  try {
    await query(
      `INSERT INTO news (id, title, slug, tag, image_url, excerpt, body, published_at, status, author_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'published', ?)
       ON DUPLICATE KEY UPDATE
         title = VALUES(title),
         slug = VALUES(slug),
         tag = VALUES(tag),
         image_url = VALUES(image_url),
         excerpt = VALUES(excerpt),
         body = VALUES(body),
         published_at = VALUES(published_at),
         status = 'published',
         author_id = VALUES(author_id)`,
      [id, body.title.trim(), slug, tag, imageUrl, body.excerpt.trim(), body.body || null, `${date} 00:00:00`, user.id]
    );
  } catch (error) {
    if (!isUnknownColumnError(error)) throw error;
    try {
      await query(
        `INSERT INTO news (id, title, tag, image_url, excerpt, body, published_at, status, author_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'published', ?)
         ON DUPLICATE KEY UPDATE
           title = VALUES(title),
           tag = VALUES(tag),
           image_url = VALUES(image_url),
           excerpt = VALUES(excerpt),
           body = VALUES(body),
           published_at = VALUES(published_at),
           status = 'published',
           author_id = VALUES(author_id)`,
        [id, body.title.trim(), tag, imageUrl, body.excerpt.trim(), body.body || null, `${date} 00:00:00`, user.id]
      );
    } catch (legacyError) {
      if (!isUnknownColumnError(legacyError)) throw legacyError;
      await query(
        `INSERT INTO news (id, title, excerpt, body, published_at, status, author_id)
         VALUES (?, ?, ?, ?, ?, 'published', ?)
         ON DUPLICATE KEY UPDATE
           title = VALUES(title),
           excerpt = VALUES(excerpt),
           body = VALUES(body),
           published_at = VALUES(published_at),
           status = 'published',
           author_id = VALUES(author_id)`,
        [id, body.title.trim(), body.excerpt.trim(), body.body || null, `${date} 00:00:00`, user.id]
      );
    }
  }
  let rows;
  try {
    rows = await query(
      `SELECT id, title, slug, tag, image_url, DATE_FORMAT(published_at, '%Y-%m-%d') AS date, excerpt, body
       FROM news
       WHERE id = ?
       LIMIT 1`,
      [id]
    );
  } catch (error) {
    if (!isUnknownColumnError(error)) throw error;
    try {
      rows = await query(
        `SELECT id, title, tag, image_url, DATE_FORMAT(published_at, '%Y-%m-%d') AS date, excerpt, body
         FROM news
         WHERE id = ?
         LIMIT 1`,
        [id]
      );
    } catch (legacyError) {
      if (!isUnknownColumnError(legacyError)) throw legacyError;
      rows = await query(
        `SELECT id, title, DATE_FORMAT(published_at, '%Y-%m-%d') AS date, excerpt, body
         FROM news
         WHERE id = ?
         LIMIT 1`,
        [id]
      );
    }
  }
  sendJson(response, 200, { news: publicNewsRow(rows[0]) });
}

async function deleteNews(request, response, newsId) {
  const user = await currentUser(request);
  if (!user || user.role !== 'admin') {
    sendJson(response, 403, { error: 'Admin access required.' });
    return;
  }
  const existing = await query('SELECT id FROM news WHERE id = ? LIMIT 1', [newsId]);
  if (existing.length === 0) {
    sendJson(response, 404, { error: 'News item not found.' });
    return;
  }
  await query('DELETE FROM news WHERE id = ?', [newsId]);
  sendJson(response, 200, { ok: true, id: newsId });
}

function publicComment(row, user) {
  const authorId = row.authorId || row.author_id;
  return {
    id: row.id,
    newsId: row.newsId || row.news_id,
    parentId: row.parentId || row.parent_id || null,
    authorId,
    authorName: row.authorName || row.author_name || 'Uživatel',
    authorRole: row.authorRole || row.author_role || 'client',
    body: row.body,
    createdAt: row.createdAt || row.created_at,
    updatedAt: row.updatedAt || row.updated_at,
    canEdit: Boolean(user && (user.role === 'admin' || user.id === authorId)),
    canDelete: Boolean(user && (user.role === 'admin' || user.id === authorId))
  };
}

async function findPublishedNewsForInteraction(newsId) {
  const selectNews = () => query('SELECT id, title FROM news WHERE id = ? AND status = ? LIMIT 1', [newsId, 'published']);
  let rows = await selectNews();
  if (rows.length > 0) return rows;

  const builtInItem = builtInNewsSitemapRows.find((item) => item.id === newsId);
  if (!builtInItem) return rows;

  const slug = slugifyPathSegment(builtInItem.slug || builtInItem.title || builtInItem.id);
  try {
    await query(
      `INSERT IGNORE INTO news (id, title, slug, tag, image_url, excerpt, body, published_at, status, author_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'published', NULL)`,
      [
        builtInItem.id,
        builtInItem.title,
        slug,
        builtInItem.tag || null,
        builtInItem.imageUrl || null,
        builtInItem.excerpt,
        builtInItem.body || null,
        `${builtInItem.date} 00:00:00`
      ]
    );
  } catch (error) {
    if (!isUnknownColumnError(error)) throw error;
    try {
      await query(
        `INSERT IGNORE INTO news (id, title, tag, image_url, excerpt, body, published_at, status, author_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'published', NULL)`,
        [
          builtInItem.id,
          builtInItem.title,
          builtInItem.tag || null,
          builtInItem.imageUrl || null,
          builtInItem.excerpt,
          builtInItem.body || null,
          `${builtInItem.date} 00:00:00`
        ]
      );
    } catch (legacyError) {
      if (!isUnknownColumnError(legacyError)) throw legacyError;
      await query(
        `INSERT IGNORE INTO news (id, title, excerpt, body, published_at, status, author_id)
         VALUES (?, ?, ?, ?, ?, 'published', NULL)`,
        [builtInItem.id, builtInItem.title, builtInItem.excerpt, builtInItem.body || null, `${builtInItem.date} 00:00:00`]
      );
    }
  }

  rows = await selectNews();
  return rows;
}

async function listNewsDiscussion(request, response) {
  const user = await currentUser(request);
  const likeRows = await query(
    `SELECT
       news_id AS newsId,
       COUNT(*) AS count,
       SUM(CASE WHEN user_id = ? THEN 1 ELSE 0 END) AS likedByMe
     FROM news_likes
     GROUP BY news_id`,
    [user?.id || '']
  );
  const commentRows = await query(
    `SELECT
       comments.id,
       comments.news_id AS newsId,
       comments.parent_id AS parentId,
       comments.author_id AS authorId,
       users.name AS authorName,
       users.role AS authorRole,
       comments.body,
       comments.created_at AS createdAt,
       comments.updated_at AS updatedAt
     FROM news_comments comments
     JOIN users ON users.id = comments.author_id
     JOIN news ON news.id = comments.news_id
     WHERE news.status = 'published'
     ORDER BY comments.created_at ASC`
  );
  sendJson(response, 200, {
    likes: likeRows.map((row) => ({
      newsId: row.newsId,
      count: Number(row.count || 0),
      likedByMe: Boolean(Number(row.likedByMe || 0))
    })),
    comments: commentRows.map((row) => publicComment(row, user))
  });
}

async function toggleNewsLike(request, response, newsId) {
  const user = await currentUser(request);
  if (!user) {
    sendJson(response, 401, { error: 'Login required.' });
    return;
  }
  const newsRows = await findPublishedNewsForInteraction(newsId);
  if (newsRows.length === 0) {
    sendJson(response, 404, { error: 'News item not found.' });
    return;
  }
  const existing = await query('SELECT news_id FROM news_likes WHERE news_id = ? AND user_id = ? LIMIT 1', [newsId, user.id]);
  if (existing.length > 0) {
    await query('DELETE FROM news_likes WHERE news_id = ? AND user_id = ?', [newsId, user.id]);
  } else {
    await query('INSERT INTO news_likes (news_id, user_id) VALUES (?, ?)', [newsId, user.id]);
    await createSystemNotification({
      title: 'Nové srdíčko u aktuality',
      body: `${user.name || user.email} přidal/a srdíčko k aktualitě „${newsRows[0].title}“.`,
      tone: 'success',
      category: 'Aktuality',
      linkHref: `#/admin?tab=news&news=${encodeURIComponent(newsId)}`,
      createdBy: user.id
    });
  }
  const rows = await query(
    `SELECT
       COUNT(*) AS count,
       SUM(CASE WHEN user_id = ? THEN 1 ELSE 0 END) AS likedByMe
     FROM news_likes
     WHERE news_id = ?`,
    [user.id, newsId]
  );
  sendJson(response, 200, {
    like: {
      newsId,
      count: Number(rows[0]?.count || 0),
      likedByMe: Boolean(Number(rows[0]?.likedByMe || 0))
    }
  });
}

async function addNewsComment(request, response, newsId) {
  const user = await currentUser(request);
  if (!user) {
    sendJson(response, 401, { error: 'Login required.' });
    return;
  }
  const body = await readBody(request);
  const text = String(body.body || '').trim();
  if (!text) {
    sendJson(response, 400, { error: 'Comment body is required.' });
    return;
  }
  if (text.length > 3000) {
    sendJson(response, 400, { error: 'Comment is too long.' });
    return;
  }
  const newsRows = await findPublishedNewsForInteraction(newsId);
  if (newsRows.length === 0) {
    sendJson(response, 404, { error: 'News item not found.' });
    return;
  }
  const parentId = String(body.parentId || '').trim() || null;
  if (parentId) {
    const parentRows = await query('SELECT id FROM news_comments WHERE id = ? AND news_id = ? LIMIT 1', [parentId, newsId]);
    if (parentRows.length === 0) {
      sendJson(response, 400, { error: 'Parent comment not found.' });
      return;
    }
  }
  const id = randomId();
  await query('INSERT INTO news_comments (id, news_id, parent_id, author_id, body) VALUES (?, ?, ?, ?, ?)', [
    id,
    newsId,
    parentId,
    user.id,
    text
  ]);
  const rows = await query(
    `SELECT
       comments.id,
       comments.news_id AS newsId,
       comments.parent_id AS parentId,
       comments.author_id AS authorId,
       users.name AS authorName,
       users.role AS authorRole,
       comments.body,
       comments.created_at AS createdAt,
       comments.updated_at AS updatedAt
     FROM news_comments comments
     JOIN users ON users.id = comments.author_id
     WHERE comments.id = ?
     LIMIT 1`,
    [id]
  );
  const comment = publicComment(rows[0], user);
  await createSystemNotification({
    title: parentId ? 'Nová odpověď u aktuality' : 'Nový komentář u aktuality',
    body: `${comment.authorName}: ${truncateText(comment.body)}`,
    tone: 'info',
    category: 'Komentáře',
    linkHref: `#/admin?tab=news&news=${encodeURIComponent(newsId)}&comment=${encodeURIComponent(comment.id)}`,
    createdBy: user.id
  });
  sendJson(response, 201, { comment });
}

async function updateNewsComment(request, response, commentId) {
  const user = await currentUser(request);
  if (!user) {
    sendJson(response, 401, { error: 'Login required.' });
    return;
  }
  const body = await readBody(request);
  const text = String(body.body || '').trim();
  if (!text) {
    sendJson(response, 400, { error: 'Comment body is required.' });
    return;
  }
  if (text.length > 3000) {
    sendJson(response, 400, { error: 'Comment is too long.' });
    return;
  }
  const existing = await query('SELECT id, author_id FROM news_comments WHERE id = ? LIMIT 1', [commentId]);
  if (existing.length === 0) {
    sendJson(response, 404, { error: 'Comment not found.' });
    return;
  }
  if (user.role !== 'admin' && existing[0].author_id !== user.id) {
    sendJson(response, 403, { error: 'You can edit only your own comment.' });
    return;
  }
  await query('UPDATE news_comments SET body = ? WHERE id = ?', [text, commentId]);
  const rows = await query(
    `SELECT
       comments.id,
       comments.news_id AS newsId,
       comments.parent_id AS parentId,
       comments.author_id AS authorId,
       users.name AS authorName,
       users.role AS authorRole,
       comments.body,
       comments.created_at AS createdAt,
       comments.updated_at AS updatedAt
     FROM news_comments comments
     JOIN users ON users.id = comments.author_id
     WHERE comments.id = ?
     LIMIT 1`,
    [commentId]
  );
  sendJson(response, 200, { comment: publicComment(rows[0], user) });
}

async function deleteNewsComment(request, response, commentId) {
  const user = await currentUser(request);
  if (!user) {
    sendJson(response, 401, { error: 'Login required.' });
    return;
  }
  const existing = await query('SELECT id, author_id FROM news_comments WHERE id = ? LIMIT 1', [commentId]);
  if (existing.length === 0) {
    sendJson(response, 404, { error: 'Comment not found.' });
    return;
  }
  if (user.role !== 'admin' && existing[0].author_id !== user.id) {
    sendJson(response, 403, { error: 'You can delete only your own comment.' });
    return;
  }
  await query('DELETE FROM news_comments WHERE id = ?', [commentId]);
  sendJson(response, 200, { ok: true, id: commentId });
}

function publicSlide(row) {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    imageUrl: row.imageUrl,
    ctaLabel: row.ctaLabel || '',
    ctaHref: row.ctaHref || '',
    sortOrder: Number(row.sortOrder || 0),
    isActive: Boolean(row.isActive)
  };
}

function homepageContentRow(row) {
  return {
    id: row.id,
    contentType: row.contentType,
    label: row.label || '',
    title: row.title,
    body: row.body,
    imageUrl: row.imageUrl || '',
    ctaLabel: row.ctaLabel || '',
    ctaHref: row.ctaHref || '',
    sortOrder: Number(row.sortOrder) || 0,
    isActive: Boolean(row.isActive),
    updatedAt: row.updatedAt
  };
}

const institutionalCareLabelMap = {
  yes: 'Ano - dětský domov / ústavní péče',
  no: 'Ne',
  unknown: 'Nezjištěno / neuvedeno'
};

const childhoodBackgroundLabelMap = {
  institutional_home: 'Dětský domov',
  educational_institute: 'Výchovný ústav',
  foster_care: 'Pěstounská péče',
  incomplete_family: 'Neúplná rodina',
  standard_family: 'Běžná rodina',
  street_or_homelessness: 'Ulice / bez stabilního zázemí',
  other: 'Jiné',
  unknown: 'Nezjištěno / neuvedeno'
};

function normalizeInstitutionalCare(value) {
  const normalized = String(value || '').trim().toLowerCase();
  return ['yes', 'no', 'unknown'].includes(normalized) ? normalized : 'unknown';
}

function normalizeChildhoodBackground(value) {
  const normalized = String(value || '').trim().toLowerCase();
  return Object.prototype.hasOwnProperty.call(childhoodBackgroundLabelMap, normalized) ? normalized : 'unknown';
}

function aggregateJailbreakBackgroundStats(rows, totalOverride = null) {
  const total = totalOverride === null ? rows.length : Number(totalOverride || 0);
  const minPublicSample = 10;
  const institutionalCareCounts = new Map([
    ['yes', 0],
    ['no', 0],
    ['unknown', 0]
  ]);
  const backgroundCounts = new Map(Object.keys(childhoodBackgroundLabelMap).map((key) => [key, 0]));

  for (const row of rows) {
    const institutionalCare = normalizeInstitutionalCare(row.institutionalCareHistory || row.institutional_care_history);
    const childhoodBackground = normalizeChildhoodBackground(row.childhoodBackground || row.childhood_background);
    institutionalCareCounts.set(institutionalCare, (institutionalCareCounts.get(institutionalCare) || 0) + 1);
    backgroundCounts.set(childhoodBackground, (backgroundCounts.get(childhoodBackground) || 0) + 1);
  }

  const bucket = ([key, count], labelMap) => ({
    key,
    label: labelMap[key] || key,
    count,
    share: total > 0 ? Math.round((count / total) * 100) : 0
  });

  return {
    program: 'JAILBREAK',
    total,
    minPublicSample,
    canPublish: total >= minPublicSample,
    institutionalCare: Array.from(institutionalCareCounts.entries()).map((entry) => bucket(entry, institutionalCareLabelMap)),
    childhoodBackground: Array.from(backgroundCounts.entries())
      .map((entry) => bucket(entry, childhoodBackgroundLabelMap))
      .filter((item) => item.count > 0 || item.key === 'unknown'),
    updatedAt: new Date().toISOString(),
    note:
      'Anonymizovaná agregovaná data z klientské evidence programu JAILBREAK. Nejde o statistiku celé populace VTOS.'
  };
}

async function publicJailbreakBackgroundStats(_request, response) {
  try {
    const rows = await query(
      `SELECT institutional_care_history AS institutionalCareHistory, childhood_background AS childhoodBackground
       FROM clients
       WHERE program = ?`,
      ['JAILBREAK']
    );
    sendJson(response, 200, { stats: aggregateJailbreakBackgroundStats(rows) });
  } catch (error) {
    if (!isUnknownColumnError(error)) throw error;
    const rows = await query('SELECT COUNT(*) AS count FROM clients WHERE program = ?', ['JAILBREAK']);
    sendJson(response, 200, { stats: aggregateJailbreakBackgroundStats([], rows[0]?.count || 0) });
  }
}

async function listSlides(_request, response) {
  const rows = await query(
    `SELECT
       id,
       title,
       subtitle,
       image_url AS imageUrl,
       cta_label AS ctaLabel,
       cta_href AS ctaHref,
       sort_order AS sortOrder,
       is_active AS isActive
     FROM home_slides
     WHERE is_active = 1
     ORDER BY sort_order ASC, created_at ASC
     LIMIT 40`
  );
  sendJson(response, 200, { slides: rows.map(publicSlide) });
}

async function saveSlide(request, response) {
  const user = await currentUser(request);
  if (!user || user.role !== 'admin') {
    sendJson(response, 403, { error: 'Admin access required.' });
    return;
  }
  const body = await readBody(request);
  const missing = requireFields(body, ['title', 'subtitle', 'imageUrl']);
  if (missing) {
    sendJson(response, 400, { error: missing });
    return;
  }
  const id = body.id || randomId();
  const sortOrder = Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0;
  const isActive = body.isActive === false ? 0 : 1;
  await query(
    `INSERT INTO home_slides (id, title, subtitle, image_url, cta_label, cta_href, sort_order, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       title = VALUES(title),
       subtitle = VALUES(subtitle),
       image_url = VALUES(image_url),
       cta_label = VALUES(cta_label),
       cta_href = VALUES(cta_href),
       sort_order = VALUES(sort_order),
       is_active = VALUES(is_active)`,
    [
      id,
      body.title.trim(),
      body.subtitle.trim(),
      body.imageUrl.trim(),
      String(body.ctaLabel || '').trim(),
      String(body.ctaHref || '').trim(),
      sortOrder,
      isActive
    ]
  );
  const rows = await query(
    `SELECT
       id,
       title,
       subtitle,
       image_url AS imageUrl,
       cta_label AS ctaLabel,
       cta_href AS ctaHref,
       sort_order AS sortOrder,
       is_active AS isActive
     FROM home_slides
     WHERE id = ?
     LIMIT 1`,
    [id]
  );
  sendJson(response, 200, { slide: publicSlide(rows[0]) });
}

async function listHomepageContent(request, response) {
  const user = await currentUser(request);
  const canViewDrafts = user && ['admin', 'editor'].includes(user.role);
  const rows = await query(
    `SELECT
       id,
       content_type AS contentType,
       label,
       title,
       body,
       image_url AS imageUrl,
       cta_label AS ctaLabel,
       cta_href AS ctaHref,
       sort_order AS sortOrder,
       is_active AS isActive,
       updated_at AS updatedAt
     FROM homepage_content
     ${canViewDrafts ? '' : 'WHERE is_active = 1'}
     ORDER BY content_type ASC, sort_order ASC, created_at ASC
     LIMIT 200`
  );
  sendJson(response, 200, { items: rows.map(homepageContentRow) });
}

async function saveHomepageContent(request, response) {
  const admin = await requireAdmin(request, response);
  if (!admin) return;
  const body = await readBody(request);
  const missing = requireFields(body, ['id', 'title', 'body']);
  if (missing) {
    sendJson(response, 400, { error: missing });
    return;
  }
  const contentType = ['section', 'gallery'].includes(body.contentType) ? body.contentType : 'section';
  if (contentType === 'gallery' && !String(body.imageUrl || '').trim()) {
    sendJson(response, 400, { error: 'imageUrl is required for gallery items.' });
    return;
  }
  const sortOrder = Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0;
  const isActive = body.isActive === false ? 0 : 1;
  await query(
    `INSERT INTO homepage_content
       (id, content_type, label, title, body, image_url, cta_label, cta_href, sort_order, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       content_type = VALUES(content_type),
       label = VALUES(label),
       title = VALUES(title),
       body = VALUES(body),
       image_url = VALUES(image_url),
       cta_label = VALUES(cta_label),
       cta_href = VALUES(cta_href),
       sort_order = VALUES(sort_order),
       is_active = VALUES(is_active)`,
    [
      String(body.id).trim().slice(0, 120),
      contentType,
      String(body.label || '').trim(),
      String(body.title).trim(),
      String(body.body).trim(),
      String(body.imageUrl || '').trim(),
      String(body.ctaLabel || '').trim(),
      String(body.ctaHref || '').trim(),
      sortOrder,
      isActive
    ]
  );
  const rows = await query(
    `SELECT
       id,
       content_type AS contentType,
       label,
       title,
       body,
       image_url AS imageUrl,
       cta_label AS ctaLabel,
       cta_href AS ctaHref,
       sort_order AS sortOrder,
       is_active AS isActive,
       updated_at AS updatedAt
     FROM homepage_content
     WHERE id = ?
     LIMIT 1`,
    [String(body.id).trim().slice(0, 120)]
  );
  sendJson(response, 200, { item: homepageContentRow(rows[0]) });
}

async function listClients(request, response) {
  const user = await currentUser(request);
  if (!user || user.role !== 'admin') {
    sendJson(response, 403, { error: 'Admin access required.' });
    return;
  }
  let rows;
  try {
    rows = await query(
      `SELECT
         id,
         first_name AS firstName,
         last_name AS lastName,
         DATE_FORMAT(birth_date, '%Y-%m-%d') AS birthDate,
         phone,
         email,
         address,
         target_group AS targetGroup,
         program,
         institutional_care_history AS institutionalCareHistory,
         childhood_background AS childhoodBackground,
         status,
         notes,
         operational_id AS operationalId,
         DATE_FORMAT(created_at, '%Y-%m-%d') AS createdAt
       FROM clients
       ORDER BY created_at DESC
       LIMIT 200`
    );
  } catch (error) {
    if (!isUnknownColumnError(error)) throw error;
    rows = await query(
      `SELECT
         id,
         first_name AS firstName,
         last_name AS lastName,
         DATE_FORMAT(birth_date, '%Y-%m-%d') AS birthDate,
         phone,
         email,
         address,
         target_group AS targetGroup,
         program,
         status,
         notes,
         operational_id AS operationalId,
         DATE_FORMAT(created_at, '%Y-%m-%d') AS createdAt
       FROM clients
       ORDER BY created_at DESC
       LIMIT 200`
    );
  }
  sendJson(response, 200, { clients: rows });
}

async function createClient(request, response) {
  const user = await currentUser(request);
  if (!user || user.role !== 'admin') {
    sendJson(response, 403, { error: 'Admin access required.' });
    return;
  }
  const body = await readBody(request);
  const missing = requireFields(body, ['firstName', 'lastName']);
  if (missing) {
    sendJson(response, 400, { error: missing });
    return;
  }
  const id = body.id || randomId();
  const operationalId = String(body.operationalId || '').trim() || null;
  const institutionalCareHistory = normalizeInstitutionalCare(body.institutionalCareHistory);
  const childhoodBackground = normalizeChildhoodBackground(body.childhoodBackground);
  try {
    await query(
      `INSERT INTO clients
         (id, first_name, last_name, birth_date, phone, email, address, target_group, program, institutional_care_history, childhood_background, status, notes, operational_id, created_by)
       VALUES (?, ?, ?, NULLIF(?, ''), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         first_name = VALUES(first_name),
         last_name = VALUES(last_name),
         birth_date = VALUES(birth_date),
         phone = VALUES(phone),
         email = VALUES(email),
         address = VALUES(address),
         target_group = VALUES(target_group),
         program = VALUES(program),
         institutional_care_history = VALUES(institutional_care_history),
         childhood_background = VALUES(childhood_background),
         status = VALUES(status),
         notes = VALUES(notes),
         operational_id = VALUES(operational_id)`,
      [
        id,
        body.firstName.trim(),
        body.lastName.trim(),
        body.birthDate || '',
        body.phone || '',
        body.email || '',
        body.address || '',
        body.targetGroup || '',
        body.program || 'JAILBREAK',
        institutionalCareHistory,
        childhoodBackground,
        body.status || 'Nový kontakt',
        body.notes || '',
        operationalId,
        user.id
      ]
    );
  } catch (error) {
    if (!isUnknownColumnError(error)) throw error;
    await query(
      `INSERT INTO clients
         (id, first_name, last_name, birth_date, phone, email, address, target_group, program, status, notes, operational_id, created_by)
       VALUES (?, ?, ?, NULLIF(?, ''), ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         first_name = VALUES(first_name),
         last_name = VALUES(last_name),
         birth_date = VALUES(birth_date),
         phone = VALUES(phone),
         email = VALUES(email),
         address = VALUES(address),
         target_group = VALUES(target_group),
         program = VALUES(program),
         status = VALUES(status),
         notes = VALUES(notes),
         operational_id = VALUES(operational_id)`,
      [
        id,
        body.firstName.trim(),
        body.lastName.trim(),
        body.birthDate || '',
        body.phone || '',
        body.email || '',
        body.address || '',
        body.targetGroup || '',
        body.program || 'JAILBREAK',
        body.status || 'Nový kontakt',
        body.notes || '',
        operationalId,
        user.id
      ]
    );
  }
  let rows;
  try {
    rows = await query(
      `SELECT
         id,
         first_name AS firstName,
         last_name AS lastName,
         DATE_FORMAT(birth_date, '%Y-%m-%d') AS birthDate,
         phone,
         email,
         address,
         target_group AS targetGroup,
         program,
         institutional_care_history AS institutionalCareHistory,
         childhood_background AS childhoodBackground,
         status,
         notes,
         operational_id AS operationalId,
         DATE_FORMAT(created_at, '%Y-%m-%d') AS createdAt
       FROM clients
       WHERE id = ?`,
      [id]
    );
  } catch (error) {
    if (!isUnknownColumnError(error)) throw error;
    rows = await query(
      `SELECT
         id,
         first_name AS firstName,
         last_name AS lastName,
         DATE_FORMAT(birth_date, '%Y-%m-%d') AS birthDate,
         phone,
         email,
         address,
         target_group AS targetGroup,
         program,
         status,
         notes,
         operational_id AS operationalId,
         DATE_FORMAT(created_at, '%Y-%m-%d') AS createdAt
       FROM clients
       WHERE id = ?`,
      [id]
    );
  }
  sendJson(response, 200, { client: rows[0] });
}

async function deleteClient(request, response, clientId) {
  const user = await requireAdmin(request, response);
  if (!user) return;
  const rows = await query(
    `SELECT
       id,
       first_name AS firstName,
       last_name AS lastName,
       email
     FROM clients
     WHERE id = ?
     LIMIT 1`,
    [clientId]
  );
  if (rows.length === 0) {
    sendJson(response, 404, { error: 'Client not found.' });
    return;
  }
  const documentRows = await query('SELECT COUNT(*) AS count FROM client_documents WHERE client_id = ?', [clientId]);
  const detachedDocuments = Number(documentRows[0]?.count || 0);
  await query('UPDATE client_documents SET client_id = NULL WHERE client_id = ?', [clientId]);
  await query('DELETE FROM clients WHERE id = ?', [clientId]);
  await createSystemNotification({
    title: 'Klient smazán',
    body: `${rows[0].firstName} ${rows[0].lastName}${rows[0].email ? ` (${rows[0].email})` : ''} byl/a odstraněn/a z registru klientů. Navázané dokumenty ponechány: ${detachedDocuments}.`,
    tone: 'warning',
    category: 'Klienti',
    createdBy: user.id
  });
  sendJson(response, 200, { ok: true, id: clientId, detachedDocuments });
}

function parseJsonValue(value, fallback) {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }
  return value;
}

function publicFormTemplate(row) {
  const schema = parseJsonValue(row.schemaJson || row.schema_json, []);
  const fields = Array.isArray(schema) ? schema : Array.isArray(schema.fields) ? schema.fields : [];
  const meta = Array.isArray(schema) ? {} : schema;
  const status = String(row.status || meta.status || '').trim() || (row.isCurrent === 0 || row.is_current === 0 ? 'legacy' : 'active');
  const isCurrent = row.isCurrent === undefined && row.is_current === undefined ? status === 'active' : Boolean(row.isCurrent ?? row.is_current);
  return {
    id: row.id,
    formUid: row.formUid || row.form_uid || meta.formUid || meta.form_uid || '',
    formGroup: row.formGroup || row.form_group || meta.formGroup || meta.form_group || '',
    title: row.title,
    description: row.description || '',
    fields: fields
      .filter((field) => field && field.key && field.label)
      .map((field) => ({
        key: String(field.key),
        label: String(field.label),
        rows: Number.isFinite(Number(field.rows)) ? Number(field.rows) : undefined
      })),
    fileUrl: meta.fileUrl || meta.file_url || '',
    folder: meta.folder || '',
    sourceNote: meta.sourceNote || meta.source_note || '',
    sizeBytes: Number(meta.sizeBytes || meta.size_bytes || 0),
    status,
    isCurrent,
    isActive: Boolean(row.isActive ?? row.is_active ?? (status === 'active' && isCurrent))
  };
}

async function listFormTemplates(request, response) {
  const user = await requireAdmin(request, response);
  if (!user) return;
  try {
    const documentRows = await query(
      `SELECT
         id,
         form_uid AS formUid,
         form_group AS formGroup,
         category_code AS categoryCode,
         category_title AS categoryTitle,
         document_code AS documentCode,
         title,
         version,
         file_name AS fileName,
         file_path AS filePath,
         sensitivity,
         status,
         is_current AS isCurrent,
         notes,
         sort_order AS sortOrder,
         size_bytes AS sizeBytes,
         source_note AS sourceNote
        FROM rest_art_document_files
        WHERE file_type = 'pdf'
          AND status = 'active'
          AND is_current = 1
          AND category_code NOT IN ('99_ALL_IN_ONE_VOLITELNE', '10_METODIKY_A_PODKLADY')
        ORDER BY is_current DESC, category_code ASC, sort_order ASC, title ASC
        LIMIT 500`
    );
    if (documentRows.length > 0) {
      sendJson(response, 200, {
        templates: documentRows.map((row) => {
          const isProgramQuestionnaire = row.categoryCode === '11_PROGRAMOVE_DOTAZNIKY';
          return {
            id: `rest-art-doc-${row.id}`,
            title: row.documentCode ? `${row.documentCode} - ${row.title}` : row.title,
            description: `${row.categoryTitle || row.categoryCode || 'Formulář'}${row.version ? `, ${row.version}` : ''}. ${row.notes || ''}`.trim(),
            fields: isProgramQuestionnaire
              ? [
                  { key: 'internalId', label: 'Interní ID klienta', rows: 1 },
                  { key: 'clientName', label: 'Jméno klienta', rows: 1 },
                  { key: 'birthDate', label: 'Datum narození', rows: 1 },
                  { key: 'program', label: 'Program / vazba na podporu', rows: 1 },
                  { key: 'contact', label: 'Kontakt a adresa', rows: 2 },
                  { key: 'processingDate', label: 'Datum kontaktu / zpracování', rows: 1 },
                  { key: 'workerNote', label: 'Poznámka pracovníka k dotazníku', rows: 3 }
                ]
              : [
                  { key: 'handoverNote', label: 'Poznámka k vyplnění / předání', rows: 3 },
                  { key: 'signatureNote', label: 'Poznámka k podpisu nebo archivaci', rows: 3 }
                ],
            fileUrl: row.filePath || '',
            folder: row.categoryCode || '',
            formUid: row.formUid || '',
            formGroup: row.formGroup || '',
            status: row.status || 'active',
            isCurrent: Boolean(row.isCurrent),
            sourceNote: [row.fileName, row.sensitivity ? `citlivost: ${row.sensitivity}` : '', row.sourceNote || ''].filter(Boolean).join(' | '),
            sizeBytes: Number(row.sizeBytes || 0),
            isActive: row.status === 'active' && Boolean(row.isCurrent)
          };
        })
      });
      return;
    }
  } catch (error) {
    if (!String(error.message || '').includes("rest_art_document_files")) {
      throw error;
    }
  }
  const rows = await query(
    `SELECT
       id,
       title,
       description,
       schema_json AS schemaJson,
       is_active AS isActive
     FROM form_templates
     WHERE is_active = 1
     ORDER BY title ASC`
  );
  sendJson(response, 200, { templates: rows.map(publicFormTemplate) });
}

function stripPdfDiacritics(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

const legacyPdfFormPaths = new Map([
  [
    '/documents/forms/02_KLIENTSKA_SLOZKA/RAI-FRM-KLI-002_KNIHA_KLIENTA_FILLABLE_v1_6_COMPACT_CONTENT_LOCKED.pdf',
    '/documents/forms/02_KLIENTSKA_SLOZKA/RAI-FRM-KLI-002_KNIHA_KLIENTA_v2_0_RC1_REBUILD_FROM_ZERO_FILLABLE.pdf'
  ]
]);

function safePdfFormPath(fileUrl) {
  const rawValue = String(fileUrl || '').trim();
  if (!rawValue) throw new Error('PDF fileUrl is required.');
  const pathname = new URL(rawValue, 'http://restart.local').pathname;
  const decodedPath = legacyPdfFormPaths.get(decodeURIComponent(pathname)) || decodeURIComponent(pathname);
  if (!decodedPath.startsWith('/documents/forms/') || path.extname(decodedPath).toLowerCase() !== '.pdf') {
    throw new Error('Only operational form PDFs can be prefilled.');
  }
  const filePath = path.resolve(publicRoot, `.${decodedPath}`);
  if (!filePath.startsWith(`${publicRoot}${path.sep}`)) {
    throw new Error('Invalid PDF path.');
  }
  return filePath;
}

function czechDate(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('cs-CZ');
}

function safePdfFileName(value) {
  return String(value || 'restart-formular')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 120) || 'restart-formular';
}

function compactPdfFieldName(normalizedFieldName) {
  return String(normalizedFieldName || '').trim().replace(/\s+/g, '_');
}

function isPdfInternalIdField(normalizedFieldName, compactFieldName) {
  return /interni.*id|intern.*id|operational.*id|client.*id/.test(normalizedFieldName) || compactFieldName === 'p1_interni_id';
}

function isPdfBirthDateField(normalizedFieldName, compactFieldName) {
  return /datum.*narozeni|datum.*narozen|birth/.test(normalizedFieldName) || /(^|_)narozeni?($|_vek|_v_k)/.test(compactFieldName);
}

function isPdfEmailField(compactFieldName) {
  return ['email', 'e_mail', 'kk01_email'].includes(compactFieldName) || /(^|_)e_mail_alternativn_kontakt_\d+$/.test(compactFieldName);
}

function isPdfPhoneField(compactFieldName) {
  return ['telefon', 'phone', 'kk01_telefon'].includes(compactFieldName) || /(^|_)telefon_kontakt_\d+$/.test(compactFieldName);
}

function isPdfContactField(compactFieldName) {
  return ['kontakt', 'p1_kontakt', 'gdpr_00_kontakt'].includes(compactFieldName);
}

function isPdfAddressField(compactFieldName) {
  return compactFieldName === 'adresa'
    || compactFieldName === 'address'
    || compactFieldName.endsWith('_adresa')
    || /(^|_)adresa_kontaktn_m_sto_\d+$/.test(compactFieldName);
}

function isPdfProgramField(compactFieldName) {
  return ['program', 'p1_program', 'program_oblast', 'gdpr_00_program_oblast', 'kk01_program_hlavni_pilir'].includes(compactFieldName)
    || /(^|_)program_hlavn_pil_\d+$/.test(compactFieldName);
}

function isPdfClientNameField(normalizedFieldName) {
  const normalized = String(normalizedFieldName || '').trim().replace(/\s+/g, ' ');
  const compact = compactPdfFieldName(normalized);

  if (/^(p\d+_)?klient_jmeno$/.test(compact)) return true;
  if (/^(kk\d+_)?jmeno$/.test(compact)) return true;
  if (/(^|_)jm_no_p_ezd_vka_\d+$/.test(compact)) return true;
  if (/^(gdpr_\d+_)?jmeno_(prezdivka_)?subjekt(.*)?$/.test(compact)) return true;
  if (/^(klient|client|subjekt|subjekt_udaju|jmeno|full_name)$/.test(compact)) return true;
  if (/jmeno.*(prijmeni|prezdivka|subjekt|klient)|client.*name|full.*name/.test(normalized)) return true;

  return false;
}

function isPdfPrintDateField(compactFieldName) {
  return [
    'datum',
    'date',
    'p1_datum',
    'datum_tisku',
    'datum_zaznamu',
    'gdpr_00_datum_zaznamu',
    'gdpr_00_datum_kontroly',
    'print_date'
  ].includes(compactFieldName);
}

function isPdfWorkerField(compactFieldName) {
  return [
    'p1_pracovnik',
    'pracovnik',
    'pracovnik_projektu',
    'gdpr_00_pracovnik_projektu',
    'gdpr_00_odpovedny_pracovnik',
    'kk01_klicovy_pracovnik'
  ].includes(compactFieldName);
}

function isPdfWorkerNoteField(compactFieldName) {
  return ['gdpr_00_poznamka_balicku'].includes(compactFieldName);
}

function pdfAutofillValue(fieldName, payload) {
  const normalized = stripPdfDiacritics(fieldName).replace(/[_-]+/g, ' ');
  const compact = compactPdfFieldName(normalized);
  if (/podpis/.test(normalized)) return null;

  const client = payload.client || {};
  const draft = payload.draft || {};
  const values = payload.values || {};
  const fullName = values.clientName || [client.firstName, client.lastName].filter(Boolean).join(' ').trim();
  const phone = values.phone || client.phone || '';
  const email = values.email || client.email || '';
  const address = values.address || client.address || '';
  const contact = values.contact || [phone, email, address].filter(Boolean).join(' | ');
  const printDate = values.printDate || czechDate();
  const workerNote = values.workerNote || draft.workerNote || draft.handoverNote || '';

  if (isPdfInternalIdField(normalized, compact)) return values.internalId || client.operationalId || '';
  if (isPdfBirthDateField(normalized, compact)) return values.birthDate || client.birthDate || '';
  if (isPdfEmailField(compact)) return email;
  if (isPdfPhoneField(compact)) return phone;
  if (isPdfContactField(compact)) return contact;
  if (isPdfAddressField(compact)) return address;
  if (isPdfProgramField(compact)) return values.program || client.program || '';
  if (isPdfClientNameField(normalized)) return fullName;
  if (isPdfPrintDateField(compact)) return printDate;
  if (isPdfWorkerField(compact)) return values.workerName || '';
  if (isPdfWorkerNoteField(compact)) return workerNote;

  return null;
}

async function fillFormPdf(request, response) {
  const user = await requireAdmin(request, response);
  if (!user) return;
  const body = await readBody(request);
  const filePath = safePdfFormPath(body.fileUrl);
  const sourceBytes = await fs.promises.readFile(filePath);
  const pdfDoc = await PDFDocument.load(sourceBytes);
  const form = pdfDoc.getForm();
  let filledCount = 0;

  for (const field of form.getFields()) {
    if (typeof field.setText !== 'function') continue;
    const value = pdfAutofillValue(field.getName(), body);
    if (value === null || value === undefined) continue;
    field.setText(String(value));
    filledCount += 1;
  }

  try {
    const acroForm = pdfDoc.catalog.lookup(PDFName.of('AcroForm'));
    if (acroForm && typeof acroForm.set === 'function') {
      acroForm.set(PDFName.of('NeedAppearances'), PDFBool.True);
    }
  } catch {
    // Some PDFs may not expose the AcroForm dictionary directly; filled values still remain in the field data.
  }

  const pdfBytes = await pdfDoc.save({ updateFieldAppearances: false });
  const client = body.client || {};
  const baseName = safePdfFileName(
    [
      body.formUid || body.templateId || 'formular',
      client.operationalId || [client.firstName, client.lastName].filter(Boolean).join('_') || 'klient',
      'vyplneno'
    ]
      .filter(Boolean)
      .join('_')
  );
  response.setHeader('x-rest-art-filled-fields', String(filledCount));
  sendPdf(response, 200, Buffer.from(pdfBytes), `${baseName}.pdf`);
}

function publicManagedUser(row) {
  return {
    id: row.id,
    role: row.role,
    name: row.name,
    email: row.email,
    phone: row.phone || '',
    isActive: Boolean(row.isActive ?? row.is_active),
    lastLoginAt: row.lastLoginAt || row.last_login_at || null,
    createdAt: row.createdAt || row.created_at
  };
}

function publicProjectApplication(row) {
  return {
    id: row.id,
    userId: row.userId || row.user_id,
    userName: row.userName || row.user_name || '',
    userEmail: row.userEmail || row.user_email || '',
    requestedRole: row.requestedRole || row.requested_role,
    status: row.status,
    phone: row.phone || '',
    motivation: row.motivation || '',
    availability: row.availability || '',
    contribution: row.contribution || '',
    note: row.note || '',
    adminNote: row.adminNote || row.admin_note || '',
    reviewedBy: row.reviewedBy || row.reviewed_by || null,
    reviewedAt: row.reviewedAt || row.reviewed_at || null,
    createdAt: row.createdAt || row.created_at
  };
}

async function listMyProjectApplications(request, response) {
  const user = await currentUser(request);
  if (!user) {
    sendJson(response, 401, { error: 'Login required.' });
    return;
  }
  const rows = await query(
    `SELECT
       applications.id,
       applications.user_id AS userId,
       users.name AS userName,
       users.email AS userEmail,
       applications.requested_role AS requestedRole,
       applications.status,
       applications.phone,
       applications.motivation,
       applications.availability,
       applications.contribution,
       applications.note,
       applications.admin_note AS adminNote,
       applications.reviewed_by AS reviewedBy,
       applications.reviewed_at AS reviewedAt,
       applications.created_at AS createdAt
     FROM project_applications applications
     JOIN users ON users.id = applications.user_id
     WHERE applications.user_id = ?
     ORDER BY applications.created_at DESC
     LIMIT 20`,
    [user.id]
  );
  sendJson(response, 200, { applications: rows.map(publicProjectApplication) });
}

async function submitProjectApplication(request, response) {
  const user = await currentUser(request);
  if (!user || (!isPortalRole(user.role) && user.role !== 'admin')) {
    sendJson(response, 401, { error: 'Login required.' });
    return;
  }
  const body = await readBody(request);
  const requestedRole = String(body.requestedRole || '').trim();
  if (!applicationRoles.includes(requestedRole)) {
    sendJson(response, 400, { error: 'Valid requested role is required.' });
    return;
  }
  const pendingRows = await query(
    'SELECT id FROM project_applications WHERE user_id = ? AND status = ? LIMIT 1',
    [user.id, 'pending']
  );
  if (pendingRows.length > 0) {
    sendJson(response, 409, { error: 'Už máte jednu žádost čekající na vyřízení.' });
    return;
  }
  const id = randomId();
  await query(
    `INSERT INTO project_applications
       (id, user_id, requested_role, phone, motivation, availability, contribution, note)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      user.id,
      requestedRole,
      String(body.phone || user.phone || '').trim(),
      String(body.motivation || '').trim(),
      String(body.availability || '').trim(),
      String(body.contribution || '').trim(),
      String(body.note || '').trim()
    ]
  );
  const rows = await query(
    `SELECT
       applications.id,
       applications.user_id AS userId,
       users.name AS userName,
       users.email AS userEmail,
       applications.requested_role AS requestedRole,
       applications.status,
       applications.phone,
       applications.motivation,
       applications.availability,
       applications.contribution,
       applications.note,
       applications.admin_note AS adminNote,
       applications.reviewed_by AS reviewedBy,
       applications.reviewed_at AS reviewedAt,
       applications.created_at AS createdAt
     FROM project_applications applications
     JOIN users ON users.id = applications.user_id
     WHERE applications.id = ?
     LIMIT 1`,
    [id]
  );
  await createSystemNotification({
    title: 'Nová žádost o vstup do projektu',
    body: `${user.name || user.email} žádá o roli ${roleLabels[requestedRole] || requestedRole}.`,
    tone: 'warning',
    category: 'Žádosti',
    linkHref: `#/admin?tab=users&application=${encodeURIComponent(id)}`,
    createdBy: user.id
  });
  sendJson(response, 201, { application: publicProjectApplication(rows[0]) });
}

async function listProjectApplications(request, response) {
  const user = await requireAdmin(request, response);
  if (!user) return;
  const rows = await query(
    `SELECT
       applications.id,
       applications.user_id AS userId,
       users.name AS userName,
       users.email AS userEmail,
       applications.requested_role AS requestedRole,
       applications.status,
       applications.phone,
       applications.motivation,
       applications.availability,
       applications.contribution,
       applications.note,
       applications.admin_note AS adminNote,
       applications.reviewed_by AS reviewedBy,
       applications.reviewed_at AS reviewedAt,
       applications.created_at AS createdAt
     FROM project_applications applications
     JOIN users ON users.id = applications.user_id
     ORDER BY FIELD(applications.status, 'pending', 'approved', 'rejected'), applications.created_at DESC
     LIMIT 300`
  );
  sendJson(response, 200, { applications: rows.map(publicProjectApplication) });
}

async function reviewProjectApplication(request, response, applicationId) {
  const admin = await requireAdmin(request, response);
  if (!admin) return;
  const body = await readBody(request);
  const status = applicationStatuses.includes(body.status) ? body.status : null;
  if (!status || status === 'pending') {
    sendJson(response, 400, { error: 'Use approved or rejected status.' });
    return;
  }
  const rows = await query(
    `SELECT applications.id, applications.user_id, applications.requested_role, applications.status, users.role AS user_role, users.name, users.email
     FROM project_applications applications
     JOIN users ON users.id = applications.user_id
     WHERE applications.id = ?
     LIMIT 1`,
    [applicationId]
  );
  if (rows.length === 0) {
    sendJson(response, 404, { error: 'Application not found.' });
    return;
  }
  const requestedRole = String(body.approvedRole || rows[0].requested_role || '').trim();
  const approvedRole = applicationRoles.includes(requestedRole) ? requestedRole : null;
  if (status === 'approved' && !approvedRole) {
    sendJson(response, 400, { error: 'Approved role is required.' });
    return;
  }
  await query(
    `UPDATE project_applications
     SET status = ?, admin_note = ?, reviewed_by = ?, reviewed_at = NOW()
     WHERE id = ?`,
    [status, String(body.adminNote || '').trim(), admin.id, applicationId]
  );
  if (status === 'approved') {
    await query('UPDATE users SET role = ?, is_active = 1 WHERE id = ?', [approvedRole, rows[0].user_id]);
  }
  const adminNote = String(body.adminNote || '').trim();
  const approvedMessage = `Dobrá zpráva: vaše žádost byla schválena. Účet je nyní vedený jako ${roleLabels[approvedRole] || approvedRole}. V portálu můžete pokračovat dalším krokem podle instrukcí týmu REST||ART Integrace.`;
  const rejectedMessage =
    adminNote ||
    'Bohužel vaši žádost nyní nemůžeme schválit z kapacitních důvodů. Děkujeme za pochopení. Pokud se možnosti projektu rozšíří, můžeme se k žádosti vrátit.';
  await createSystemNotification({
    recipientId: rows[0].user_id,
    title: status === 'approved' ? 'Žádost byla schválena' : 'Žádost zatím nemůžeme schválit',
    body: status === 'approved' ? approvedMessage : rejectedMessage,
    tone: status === 'approved' ? 'success' : 'error',
    category: 'Žádosti',
    linkHref: '#/klient',
    createdBy: admin.id
  });
  const updatedRows = await query(
    `SELECT
       applications.id,
       applications.user_id AS userId,
       users.name AS userName,
       users.email AS userEmail,
       applications.requested_role AS requestedRole,
       applications.status,
       applications.phone,
       applications.motivation,
       applications.availability,
       applications.contribution,
       applications.note,
       applications.admin_note AS adminNote,
       applications.reviewed_by AS reviewedBy,
       applications.reviewed_at AS reviewedAt,
       applications.created_at AS createdAt
     FROM project_applications applications
     JOIN users ON users.id = applications.user_id
     WHERE applications.id = ?
     LIMIT 1`,
    [applicationId]
  );
  const userRows = await query(
    `SELECT
       id,
       role,
       name,
       email,
       phone,
       is_active AS isActive,
       last_login_at AS lastLoginAt,
       created_at AS createdAt
     FROM users
     WHERE id = ?
     LIMIT 1`,
    [rows[0].user_id]
  );
  sendJson(response, 200, { application: publicProjectApplication(updatedRows[0]), user: publicManagedUser(userRows[0]) });
}

async function listUsers(request, response) {
  const user = await requireAdmin(request, response);
  if (!user) return;
  const rows = await query(
    `SELECT
       id,
       role,
       name,
       email,
       phone,
       is_active AS isActive,
       last_login_at AS lastLoginAt,
       created_at AS createdAt
     FROM users
     ORDER BY created_at DESC
     LIMIT 300`
  );
  sendJson(response, 200, { users: rows.map(publicManagedUser) });
}

async function updateUser(request, response, userId) {
  const user = await requireAdmin(request, response);
  if (!user) return;
  const body = await readBody(request);
  const allowedRoles = new Set(assignableRoles);
  const role = allowedRoles.has(body.role) ? body.role : null;
  const isActive = body.isActive === false ? 0 : 1;
  if (!role) {
    sendJson(response, 400, { error: 'Valid role is required.' });
    return;
  }
  const currentRows = await query('SELECT id, role, name, email, is_active FROM users WHERE id = ? LIMIT 1', [userId]);
  if (currentRows.length === 0) {
    sendJson(response, 404, { error: 'User not found.' });
    return;
  }
  const wasActive = Boolean(currentRows[0].is_active);
  await query('UPDATE users SET role = ?, is_active = ? WHERE id = ?', [role, isActive, userId]);
  const rows = await query(
    `SELECT
       id,
       role,
       name,
       email,
       phone,
       is_active AS isActive,
       last_login_at AS lastLoginAt,
       created_at AS createdAt
     FROM users
     WHERE id = ?
     LIMIT 1`,
    [userId]
  );
  if (!wasActive && isActive === 1) {
    await createSystemNotification({
      recipientId: userId,
      title: 'Účet ověřen',
      body: `Váš účet byl ověřen administrátorem. Aktuální role: ${roleLabels[role] || role}.`,
      tone: 'success',
      category: 'Ověření účtu',
      linkHref: '#/klient',
      createdBy: user.id
    });
  }
  sendJson(response, 200, { user: publicManagedUser(rows[0]) });
}

async function resetUserPassword(request, response, userId) {
  const admin = await requireAdmin(request, response);
  if (!admin) return;
  const rows = await query(
    'SELECT id, role, name, email, is_active FROM users WHERE id = ? LIMIT 1',
    [userId]
  );
  if (rows.length === 0) {
    sendJson(response, 404, { error: 'User not found.' });
    return;
  }
  if (!rows[0].is_active) {
    sendJson(response, 409, { error: 'Inactive users must be activated before password reset.' });
    return;
  }
  const reset = await createPasswordResetForUser(rows[0], request);
  await createSystemNotification({
    recipientId: userId,
    title: 'Reset hesla připraven',
    body: reset.emailSent
      ? 'Administrátor vám odeslal odkaz pro obnovu hesla.'
      : 'Administrátor připravil reset hesla. Kontaktujte ho pro další postup.',
    tone: 'info',
    category: 'Bezpečnost',
    linkHref: '#/klient',
    createdBy: admin.id
  });
  sendJson(response, 200, { ...reset, email: rows[0].email });
}

async function deleteUser(request, response, userId) {
  const admin = await requireAdmin(request, response);
  if (!admin) return;
  if (admin.id === userId) {
    sendJson(response, 400, { error: 'You cannot delete your own account.' });
    return;
  }
  const rows = await query('SELECT id, role, name, email, is_active FROM users WHERE id = ? LIMIT 1', [userId]);
  if (rows.length === 0) {
    sendJson(response, 404, { error: 'User not found.' });
    return;
  }
  if (rows[0].role === 'admin' && rows[0].is_active) {
    const activeAdmins = await query("SELECT COUNT(*) AS count FROM users WHERE role = 'admin' AND is_active = 1");
    if (Number(activeAdmins[0]?.count || 0) <= 1) {
      sendJson(response, 409, { error: 'Cannot delete the last active admin account.' });
      return;
    }
  }
  await query('DELETE FROM users WHERE id = ?', [userId]);
  await createSystemNotification({
    title: 'Uživatel smazán',
    body: `${rows[0].name} (${rows[0].email}) byl/a smazán/a administrátorem.`,
    tone: 'warning',
    category: 'Bezpečnost',
    createdBy: admin.id
  });
  sendJson(response, 200, { ok: true, id: userId });
}

function publicMedia(row) {
  return {
    id: row.id,
    title: row.title,
    fileName: row.fileName || row.file_name,
    fileUrl: row.fileUrl || row.file_url,
    mimeType: row.mimeType || row.mime_type || '',
    fileSize: Number(row.fileSize || row.file_size || 0),
    category: row.category,
    altText: row.altText || row.alt_text || '',
    uploadedBy: row.uploadedBy || row.uploaded_by || null,
    createdAt: row.createdAt || row.created_at
  };
}

function normalizeMediaCategory(category, fallback = 'transparency') {
  return String(category || '').trim().toLowerCase() || fallback;
}

function sanitizeUploadedFileName(value) {
  const fileName = String(value || '').trim();
  const safe = fileName.replace(/[^a-zA-Z0-9._-]/g, '-').replace(/-+/g, '-').replace(/\.{2,}/g, '.');
  return safe || `soubor-${Date.now()}`;
}

async function uploadMediaToPublicFolder(request, response) {
  const user = await requireAdmin(request, response);
  if (!user) return;

  const body = await readBody(request);
  const fileName = String(body.fileName || '').trim();
  const mimeType = String(body.mimeType || '').trim() || 'application/pdf';
  const contentBase64 = String(body.contentBase64 || '').trim();
  const category = normalizeMediaCategory(body.category);

  if (!fileName) {
    sendJson(response, 400, { error: 'fileName is required.' });
    return;
  }
  if (!contentBase64) {
    sendJson(response, 400, { error: 'contentBase64 is required.' });
    return;
  }

  let binary;
  try {
    binary = Buffer.from(contentBase64, 'base64');
  } catch (error) {
    sendJson(response, 400, { error: 'Invalid file payload.' });
    return;
  }

  if (!binary.length) {
    sendJson(response, 400, { error: 'Uploaded file is empty.' });
    return;
  }
  if (binary.length > 10_000_000) {
    sendJson(response, 413, { error: 'Uploaded file is too large.' });
    return;
  }

  const extensionByMime = {
    'application/pdf': '.pdf',
    'application/msword': '.doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    'application/rtf': '.rtf',
    'application/vnd.oasis.opendocument.text': '.odt',
    'application/vnd.ms-excel': '.xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
    'application/vnd.oasis.opendocument.spreadsheet': '.ods',
    'application/vnd.ms-powerpoint': '.ppt',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
    'application/vnd.oasis.opendocument.presentation': '.odp',
    'application/json': '.json',
    'application/xml': '.xml',
    'application/zip': '.zip',
    'application/gzip': '.gz',
    'application/x-7z-compressed': '.7z',
    'application/vnd.rar': '.rar',
    'application/x-tar': '.tar',
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/avif': '.avif',
    'image/gif': '.gif',
    'image/svg+xml': '.svg',
    'image/tiff': '.tiff',
    'image/bmp': '.bmp',
    'image/heic': '.heic',
    'image/heif': '.heif',
    'text/plain': '.txt',
    'text/html': '.html',
    'text/markdown': '.md',
    'text/csv': '.csv',
    'text/calendar': '.ics',
    'text/vcard': '.vcf',
    'video/mp4': '.mp4',
    'video/webm': '.webm',
    'video/quicktime': '.mov',
    'video/mpeg': '.mpeg',
    'video/x-msvideo': '.avi',
    'video/x-matroska': '.mkv',
    'audio/mpeg': '.mp3',
    'audio/mp4': '.m4a',
    'audio/wav': '.wav',
    'audio/ogg': '.ogg',
    'audio/flac': '.flac',
    'font/woff': '.woff',
    'font/woff2': '.woff2',
    'font/ttf': '.ttf',
    'font/otf': '.otf'
  };
  const originalExtension = path.extname(fileName);
  const extension = (originalExtension || extensionByMime[mimeType.toLowerCase()] || '.bin').toLowerCase();
  const baseName = sanitizeUploadedFileName(path.basename(fileName, originalExtension) || 'soubor');
  const safeName = `${randomId()}-${baseName}${extension}`;
  const uploadFolder = category === 'transparency' ? 'transparency' : 'media';
  const destination = path.resolve(__dirname, '..', 'public', 'documents', uploadFolder);

  await fs.promises.mkdir(destination, { recursive: true });
  const filePath = path.join(destination, safeName);
  await fs.promises.writeFile(filePath, binary);

  sendJson(response, 200, {
    media: {
      fileName: safeName,
      fileUrl: `/documents/${uploadFolder}/${safeName}`,
      mimeType,
      fileSize: binary.length
    }
  });
}

async function listPublicMedia(request, response) {
  const params = new URL(request.url, `http://${request.headers.host || 'localhost'}`);
  const category = normalizeMediaCategory(params.searchParams.get('category') || 'transparency');
  const rows = await query(
    `SELECT
       id,
       title,
       file_name AS fileName,
       file_url AS fileUrl,
       mime_type AS mimeType,
       file_size AS fileSize,
       category,
       alt_text AS altText,
       uploaded_by AS uploadedBy,
       created_at AS createdAt
     FROM media_files
     WHERE category = ?
     ORDER BY created_at DESC
     LIMIT 300`,
    [category]
  );
  sendJson(response, 200, { media: rows.map(publicMedia) });
}

async function listMedia(request, response) {
  const user = await requireAdmin(request, response);
  if (!user) return;
  const rows = await query(
    `SELECT
       id,
       title,
       file_name AS fileName,
       file_url AS fileUrl,
       mime_type AS mimeType,
       file_size AS fileSize,
       category,
       alt_text AS altText,
       uploaded_by AS uploadedBy,
       created_at AS createdAt
     FROM media_files
     ORDER BY created_at DESC
     LIMIT 300`
  );
  sendJson(response, 200, { media: rows.map(publicMedia) });
}

async function saveMedia(request, response) {
  const user = await requireAdmin(request, response);
  if (!user) return;
  const body = await readBody(request);
  const missing = requireFields(body, ['title', 'fileUrl']);
  if (missing) {
    sendJson(response, 400, { error: missing });
    return;
  }
  const id = body.id || randomId();
  const fileUrl = String(body.fileUrl).trim();
  const fileName = String(body.fileName || fileUrl.split('/').pop() || body.title).trim();
  await query(
    `INSERT INTO media_files (id, title, file_name, file_url, mime_type, file_size, category, alt_text, uploaded_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       title = VALUES(title),
       file_name = VALUES(file_name),
       file_url = VALUES(file_url),
       mime_type = VALUES(mime_type),
       file_size = VALUES(file_size),
       category = VALUES(category),
       alt_text = VALUES(alt_text),
       uploaded_by = VALUES(uploaded_by)`,
    [
      id,
      String(body.title).trim(),
      fileName,
      fileUrl,
      String(body.mimeType || '').trim() || null,
      Number.isFinite(Number(body.fileSize)) ? Number(body.fileSize) : null,
      String(body.category || 'image').trim(),
      String(body.altText || '').trim(),
      user.id
    ]
  );
  const rows = await query(
    `SELECT
       id,
       title,
       file_name AS fileName,
       file_url AS fileUrl,
       mime_type AS mimeType,
       file_size AS fileSize,
       category,
       alt_text AS altText,
       uploaded_by AS uploadedBy,
       created_at AS createdAt
     FROM media_files
     WHERE id = ?
     LIMIT 1`,
    [id]
  );
  sendJson(response, 200, { media: publicMedia(rows[0]) });
}

function publicDocument(row) {
  return {
    id: row.id,
    clientId: row.clientId || row.client_id || null,
    userId: row.userId || row.user_id || null,
    mediaId: row.mediaId || row.media_id || null,
    title: row.title,
    documentType: row.documentType || row.document_type,
    status: row.status,
    fileUrl: row.fileUrl || row.file_url || '',
    notes: row.notes || '',
    signedAt: row.signedAt || row.signed_at || null,
    createdAt: row.createdAt || row.created_at
  };
}

async function listDocuments(request, response) {
  const user = await currentUser(request);
  if (!user) {
    sendJson(response, 401, { error: 'Login required.' });
    return;
  }
  const isAdmin = user.role === 'admin';
  const rows = await query(
    `SELECT
       id,
       client_id AS clientId,
       user_id AS userId,
       media_id AS mediaId,
       title,
       document_type AS documentType,
       status,
       file_url AS fileUrl,
       notes,
       signed_at AS signedAt,
       created_at AS createdAt
     FROM client_documents
     ${isAdmin ? '' : 'WHERE user_id = ?'}
     ORDER BY created_at DESC
     LIMIT 300`,
    isAdmin ? [] : [user.id]
  );
  sendJson(response, 200, { documents: rows.map(publicDocument) });
}

async function saveDocument(request, response) {
  const user = await requireAdmin(request, response);
  if (!user) return;
  const body = await readBody(request);
  const missing = requireFields(body, ['title']);
  if (missing) {
    sendJson(response, 400, { error: missing });
    return;
  }
  const id = body.id || randomId();
  await query(
    `INSERT INTO client_documents
       (id, client_id, user_id, media_id, title, document_type, status, file_url, notes, created_by, signed_at)
     VALUES (?, NULLIF(?, ''), NULLIF(?, ''), NULLIF(?, ''), ?, ?, ?, NULLIF(?, ''), ?, ?, NULLIF(?, ''))
     ON DUPLICATE KEY UPDATE
       client_id = VALUES(client_id),
       user_id = VALUES(user_id),
       media_id = VALUES(media_id),
       title = VALUES(title),
       document_type = VALUES(document_type),
       status = VALUES(status),
       file_url = VALUES(file_url),
       notes = VALUES(notes),
       signed_at = VALUES(signed_at)`,
    [
      id,
      body.clientId || '',
      body.userId || '',
      body.mediaId || '',
      String(body.title).trim(),
      String(body.documentType || 'form').trim(),
      String(body.status || 'draft').trim(),
      String(body.fileUrl || '').trim(),
      String(body.notes || '').trim(),
      user.id,
      body.signedAt || ''
    ]
  );
  const rows = await query(
    `SELECT
       id,
       client_id AS clientId,
       user_id AS userId,
       media_id AS mediaId,
       title,
       document_type AS documentType,
       status,
       file_url AS fileUrl,
       notes,
       signed_at AS signedAt,
       created_at AS createdAt
     FROM client_documents
     WHERE id = ?
     LIMIT 1`,
    [id]
  );
  sendJson(response, 200, { document: publicDocument(rows[0]) });
}

function publicNotification(row) {
  return {
    id: row.id,
    recipientId: row.recipientId || row.recipient_id || null,
    title: row.title,
    body: row.body,
    tone: row.tone,
    category: row.category,
    linkHref: row.linkHref || row.link_href || '',
    readAt: row.readAt || row.read_at || null,
    createdAt: row.createdAt || row.created_at
  };
}

async function listNotifications(request, response) {
  const user = await currentUser(request);
  if (!user) {
    sendJson(response, 401, { error: 'Login required.' });
    return;
  }
  const isAdmin = user.role === 'admin';
  const rows = await query(
    `SELECT
       id,
       recipient_id AS recipientId,
       title,
       body,
       tone,
       category,
       link_href AS linkHref,
       read_at AS readAt,
       created_at AS createdAt
     FROM notifications
     WHERE ${isAdmin ? 'recipient_id IS NULL OR recipient_id = ?' : 'recipient_id = ?'}
     ORDER BY created_at DESC
     LIMIT 100`,
    [user.id]
  );
  sendJson(response, 200, { notifications: rows.map(publicNotification) });
}

async function saveNotification(request, response) {
  const user = await requireAdmin(request, response);
  if (!user) return;
  const body = await readBody(request);
  const missing = requireFields(body, ['title', 'body']);
  if (missing) {
    sendJson(response, 400, { error: missing });
    return;
  }
  const id = body.id || randomId();
  await query(
    `INSERT INTO notifications (id, recipient_id, title, body, tone, category, link_href, created_by)
     VALUES (?, NULLIF(?, ''), ?, ?, ?, ?, NULLIF(?, ''), ?)
     ON DUPLICATE KEY UPDATE
       recipient_id = VALUES(recipient_id),
       title = VALUES(title),
       body = VALUES(body),
       tone = VALUES(tone),
       category = VALUES(category),
       link_href = VALUES(link_href)`,
    [
      id,
      body.recipientId || '',
      String(body.title).trim(),
      String(body.body).trim(),
      String(body.tone || 'info').trim(),
      String(body.category || 'system').trim(),
      String(body.linkHref || '').trim(),
      user.id
    ]
  );
  const rows = await query(
    `SELECT
       id,
       recipient_id AS recipientId,
       title,
       body,
       tone,
       category,
       link_href AS linkHref,
       read_at AS readAt,
       created_at AS createdAt
     FROM notifications
     WHERE id = ?
     LIMIT 1`,
    [id]
  );
  sendJson(response, 200, { notification: publicNotification(rows[0]) });
}

async function markNotificationRead(request, response, notificationId) {
  const user = await currentUser(request);
  if (!user) {
    sendJson(response, 401, { error: 'Login required.' });
    return;
  }
  const params = user.role === 'admin' ? [notificationId] : [notificationId, user.id];
  const existing = await query(
    `SELECT id FROM notifications WHERE id = ? ${user.role === 'admin' ? '' : 'AND recipient_id = ?'} LIMIT 1`,
    params
  );
  if (existing.length === 0) {
    sendJson(response, 404, { error: 'Notification not found.' });
    return;
  }
  await query('UPDATE notifications SET read_at = NOW() WHERE id = ?', [notificationId]);
  sendJson(response, 200, { ok: true, id: notificationId });
}

async function deleteNotification(request, response, notificationId) {
  const user = await currentUser(request);
  if (!user) {
    sendJson(response, 401, { error: 'Login required.' });
    return;
  }
  const isAdmin = user.role === 'admin';
  const params = isAdmin ? [notificationId] : [notificationId, user.id];
  const existing = await query(
    `SELECT id, read_at AS readAt FROM notifications WHERE id = ? ${isAdmin ? '' : 'AND recipient_id = ?'} LIMIT 1`,
    params
  );
  if (existing.length === 0) {
    sendJson(response, 404, { error: 'Notification not found.' });
    return;
  }
  if (!isAdmin && !existing[0].readAt) {
    sendJson(response, 409, { error: 'Nejdřív notifikaci označte jako přečtenou.' });
    return;
  }
  await query('DELETE FROM notifications WHERE id = ?', [notificationId]);
  sendJson(response, 200, { ok: true, id: notificationId });
}

function materialOfferEventRow(row) {
  return {
    id: row.id,
    eventType: row.event_type,
    actorId: row.actor_id || null,
    actorName: row.actor_name || '',
    fromStatus: row.from_status || null,
    toStatus: row.to_status || null,
    note: row.note || '',
    metadata: (() => {
      try {
        return row.metadata_json ? JSON.parse(row.metadata_json) : {};
      } catch {
        return {};
      }
    })(),
    createdAt: row.created_at
  };
}

function materialOfferRow(row, photos = [], events = []) {
  return {
    id: row.id,
    offerType: row.offer_type,
    donorName: row.donor_name,
    email: row.email || '',
    phone: row.phone || '',
    itemDescription: row.item_description,
    quantity: row.quantity,
    locality: row.locality,
    transport: row.transport,
    itemCondition: row.item_condition,
    note: row.note || '',
    status: row.status,
    adminNote: row.admin_note || '',
    reviewedBy: row.reviewed_by || null,
    assignedTo: row.assigned_to || null,
    assignedName: row.assigned_name || '',
    pickupAt: row.pickup_at || null,
    pickupAddress: row.pickup_address || '',
    consentVersion: row.consent_version || '',
    consentAt: row.consent_at || null,
    retentionUntil: row.retention_until || null,
    donorNotifiedAt: row.donor_notified_at || null,
    adminNotifiedAt: row.admin_notified_at || null,
    anonymizedAt: row.anonymized_at || null,
    photos,
    events,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function materialOfferPhotoRow(row) {
  return {
    id: row.id,
    fileName: row.file_name,
    mimeType: row.mime_type,
    fileSize: Number(row.file_size || 0),
    url: `/api/admin/material-offers/${encodeURIComponent(row.offer_id)}/photos/${encodeURIComponent(row.id)}`
  };
}

function materialOfferRateLimitKey(request) {
  const address = String(request.headers['x-forwarded-for'] || request.socket.remoteAddress || 'unknown').split(',')[0].trim();
  return crypto.createHash('sha256').update(`${process.env.AUTH_SECRET || 'material-offer'}:${address}`).digest('hex');
}

async function materialOfferRequestAllowed(request) {
  const keyHash = materialOfferRateLimitKey(request);
  const rows = await query(
    `SELECT attempts FROM material_offer_rate_limits
     WHERE limit_key = ? AND window_started_at > DATE_SUB(NOW(), INTERVAL 30 MINUTE)
     LIMIT 1`,
    [keyHash]
  );
  if (Number(rows[0]?.attempts || 0) >= 5) return false;
  await query(
    `INSERT INTO material_offer_rate_limits (limit_key, window_started_at, attempts)
     VALUES (?, NOW(), 1)
     ON DUPLICATE KEY UPDATE
       attempts = IF(window_started_at > DATE_SUB(NOW(), INTERVAL 30 MINUTE), attempts + 1, 1),
       window_started_at = IF(window_started_at > DATE_SUB(NOW(), INTERVAL 30 MINUTE), window_started_at, NOW())`,
    [keyHash]
  );
  if (Math.random() < 0.05) {
    await query('DELETE FROM material_offer_rate_limits WHERE window_started_at < DATE_SUB(NOW(), INTERVAL 2 DAY)').catch(() => undefined);
  }
  return true;
}

function detectedImageMimeType(content) {
  if (content.length >= 3 && content[0] === 0xff && content[1] === 0xd8 && content[2] === 0xff) return 'image/jpeg';
  if (
    content.length >= 8 &&
    content[0] === 0x89 &&
    content[1] === 0x50 &&
    content[2] === 0x4e &&
    content[3] === 0x47 &&
    content[4] === 0x0d &&
    content[5] === 0x0a &&
    content[6] === 0x1a &&
    content[7] === 0x0a
  ) return 'image/png';
  if (content.length >= 12 && content.toString('ascii', 0, 4) === 'RIFF' && content.toString('ascii', 8, 12) === 'WEBP') {
    return 'image/webp';
  }
  return '';
}

function trimOfferField(value, maxLength) {
  return String(value || '').trim().slice(0, maxLength);
}

async function submitMaterialOffer(request, response) {
  if (!(await materialOfferRequestAllowed(request))) {
    sendJson(response, 429, { error: 'Příliš mnoho nabídek. Zkuste to prosím později.' });
    return;
  }

  const body = await readBody(request);
  if (trimOfferField(body.website, 200)) {
    sendJson(response, 201, { offer: { id: randomId(), status: 'new', createdAt: new Date().toISOString() } });
    return;
  }

  const offerType = trimOfferField(body.offerType, 30);
  const transport = trimOfferField(body.transport, 40);
  const donorName = trimOfferField(body.donorName, 180);
  const email = trimOfferField(body.email, 190);
  const phone = trimOfferField(body.phone, 50);
  const itemDescription = trimOfferField(body.itemDescription, 5000);
  const quantity = trimOfferField(body.quantity, 120);
  const locality = trimOfferField(body.locality, 180);
  const itemCondition = trimOfferField(body.itemCondition, 80);
  const note = trimOfferField(body.note, 5000);
  const photos = Array.isArray(body.photos) ? body.photos : [];

  if (!materialOfferTypes.includes(offerType)) {
    sendJson(response, 400, { error: 'Vyberte platný typ nabídky.' });
    return;
  }
  if (!materialOfferTransports.includes(transport)) {
    sendJson(response, 400, { error: 'Vyberte způsob dopravy.' });
    return;
  }
  if (!donorName || !itemDescription || !quantity || !locality || !itemCondition) {
    sendJson(response, 400, { error: 'Doplňte jméno, popis, množství, lokalitu a stav věcí.' });
    return;
  }
  if (!email && !phone) {
    sendJson(response, 400, { error: 'Doplňte alespoň e-mail nebo telefon.' });
    return;
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    sendJson(response, 400, { error: 'E-mail nemá platný formát.' });
    return;
  }
  if (body.privacyConsent !== true) {
    sendJson(response, 400, { error: 'Pro odeslání je nutný souhlas se zpracováním údajů.' });
    return;
  }
  if (photos.length > maxMaterialOfferPhotos) {
    sendJson(response, 400, { error: `Lze přiložit nejvýše ${maxMaterialOfferPhotos} fotografie.` });
    return;
  }

  const decodedPhotos = [];
  for (const [index, photo] of photos.entries()) {
    const mimeType = trimOfferField(photo?.mimeType, 80).toLowerCase();
    const fileName = trimOfferField(photo?.fileName, 255) || `fotografie-${index + 1}`;
    if (!materialOfferImageTypes.includes(mimeType)) {
      sendJson(response, 400, { error: 'Fotografie musí být ve formátu JPEG, PNG nebo WebP.' });
      return;
    }
    let content;
    try {
      content = Buffer.from(String(photo?.contentBase64 || ''), 'base64');
    } catch {
      content = Buffer.alloc(0);
    }
    if (!content.length || content.length > maxMaterialOfferPhotoBytes) {
      sendJson(response, 400, { error: 'Každá fotografie musí mít nejvýše 2 MB.' });
      return;
    }
    const detectedMimeType = detectedImageMimeType(content);
    if (!detectedMimeType || detectedMimeType !== mimeType) {
      sendJson(response, 400, { error: 'Obsah fotografie neodpovídá uvedenému formátu.' });
      return;
    }
    decodedPhotos.push({ fileName, mimeType: detectedMimeType, content, sortOrder: index });
  }

  const id = randomId();
  const retentionDays = Math.max(30, Math.min(730, Number.parseInt(process.env.MATERIAL_OFFER_RETENTION_DAYS || '180', 10) || 180));
  try {
    await query(
      `INSERT INTO material_offers
       (id, offer_type, donor_name, email, phone, item_description, quantity, locality, transport, item_condition, note,
        consent_version, consent_at, retention_until)
       VALUES (?, ?, ?, NULLIF(?, ''), NULLIF(?, ''), ?, ?, ?, ?, ?, NULLIF(?, ''), 'material-offer-v1', NOW(),
        DATE_ADD(CURDATE(), INTERVAL ${retentionDays} DAY))`,
      [id, offerType, donorName, email, phone, itemDescription, quantity, locality, transport, itemCondition, note]
    );
    for (const photo of decodedPhotos) {
      await query(
        `INSERT INTO material_offer_photos (id, offer_id, file_name, mime_type, file_size, content, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [randomId(), id, photo.fileName, photo.mimeType, photo.content.length, photo.content, photo.sortOrder]
      );
    }
    await query(
      `INSERT INTO material_offer_events (id, offer_id, event_type, to_status, note, metadata_json)
       VALUES (?, ?, 'created', 'new', 'Nabídka byla přijata z veřejného formuláře.', ?)`,
      [randomId(), id, JSON.stringify({ offerType, photoCount: decodedPhotos.length })]
    );
  } catch (error) {
    await query('DELETE FROM material_offers WHERE id = ?', [id]).catch(() => undefined);
    throw error;
  }

  await createSystemNotification({
    title: 'Nová materiální nabídka',
    body: `${donorName} nabízí ${offerType === 'clothing' ? 'oblečení' : offerType === 'equipment' ? 'vybavení' : 'knihy'} z lokality ${locality}.`,
    tone: 'info',
    category: 'Materiální dary',
    linkHref: '/admin?tab=materialOffers'
  });
  const insertedRows = await query('SELECT * FROM material_offers WHERE id = ? LIMIT 1', [id]);
  if (insertedRows[0]) await sendMaterialOfferCreatedEmails(insertedRows[0], request);
  sendJson(response, 201, { offer: { id, status: 'new', createdAt: new Date().toISOString() } });
}

async function listMaterialOffers(request, response) {
  const admin = await requireAdmin(request, response);
  if (!admin) return;
  const rows = await query(
    `SELECT material_offers.*, assigned_user.name AS assigned_name
     FROM material_offers
     LEFT JOIN users assigned_user ON assigned_user.id = material_offers.assigned_to
     ORDER BY material_offers.created_at DESC`
  );
  if (rows.length === 0) {
    sendJson(response, 200, { offers: [] });
    return;
  }
  const placeholders = rows.map(() => '?').join(', ');
  const photoRows = await query(
    `SELECT id, offer_id, file_name, mime_type, file_size, sort_order
     FROM material_offer_photos WHERE offer_id IN (${placeholders}) ORDER BY offer_id, sort_order`,
    rows.map((row) => row.id)
  );
  const eventRows = await query(
    `SELECT material_offer_events.*, users.name AS actor_name
     FROM material_offer_events
     LEFT JOIN users ON users.id = material_offer_events.actor_id
     WHERE material_offer_events.offer_id IN (${placeholders})
     ORDER BY material_offer_events.created_at DESC`,
    rows.map((row) => row.id)
  );
  const photosByOffer = new Map();
  for (const photo of photoRows) {
    const current = photosByOffer.get(photo.offer_id) || [];
    current.push(materialOfferPhotoRow(photo));
    photosByOffer.set(photo.offer_id, current);
  }
  const eventsByOffer = new Map();
  for (const event of eventRows) {
    const current = eventsByOffer.get(event.offer_id) || [];
    current.push(materialOfferEventRow(event));
    eventsByOffer.set(event.offer_id, current);
  }
  sendJson(response, 200, {
    offers: rows.map((row) => materialOfferRow(row, photosByOffer.get(row.id) || [], eventsByOffer.get(row.id) || []))
  });
}

async function updateMaterialOffer(request, response, offerId) {
  const admin = await requireAdmin(request, response);
  if (!admin) return;
  const body = await readBody(request);
  const status = trimOfferField(body.status, 40);
  const adminNote = trimOfferField(body.adminNote, 5000);
  const assignedTo = trimOfferField(body.assignedTo, 80);
  const pickupAddress = trimOfferField(body.pickupAddress, 500);
  const pickupAt = body.pickupAt ? new Date(body.pickupAt) : null;
  const retentionUntil = body.retentionUntil ? new Date(body.retentionUntil) : null;
  if (!materialOfferStatuses.includes(status)) {
    sendJson(response, 400, { error: 'Vyberte platný stav nabídky.' });
    return;
  }
  if (pickupAt && Number.isNaN(pickupAt.getTime())) {
    sendJson(response, 400, { error: 'Termín svozu nemá platný formát.' });
    return;
  }
  if (retentionUntil && Number.isNaN(retentionUntil.getTime())) {
    sendJson(response, 400, { error: 'Retenční datum nemá platný formát.' });
    return;
  }
  if (assignedTo) {
    const assigneeRows = await query(
      `SELECT id FROM users WHERE id = ? AND role IN ('admin', 'editor') AND is_active = 1 LIMIT 1`,
      [assignedTo]
    );
    if (!assigneeRows[0]) {
      sendJson(response, 400, { error: 'Vyberte aktivního administrátora nebo editora.' });
      return;
    }
  }
  const existingRows = await query('SELECT * FROM material_offers WHERE id = ? LIMIT 1', [offerId]);
  const existing = existingRows[0];
  if (!existing) {
    sendJson(response, 404, { error: 'Nabídka nebyla nalezena.' });
    return;
  }
  const result = await query(
    `UPDATE material_offers
     SET status = ?, admin_note = NULLIF(?, ''), reviewed_by = ?, assigned_to = NULLIF(?, ''),
         pickup_at = ?, pickup_address = NULLIF(?, ''),
         retention_until = COALESCE(?, retention_until)
     WHERE id = ?`,
    [
      status,
      adminNote,
      admin.id,
      assignedTo,
      pickupAt ? pickupAt.toISOString().slice(0, 19).replace('T', ' ') : null,
      pickupAddress,
      retentionUntil ? retentionUntil.toISOString().slice(0, 10) : null,
      offerId
    ]
  );
  if (!result.affectedRows) {
    sendJson(response, 404, { error: 'Nabídka nebyla nalezena.' });
    return;
  }
  const changes = {
    status,
    adminNote,
    assignedTo: assignedTo || null,
    pickupAt: pickupAt?.toISOString() || null,
    pickupAddress,
    retentionUntil: retentionUntil?.toISOString() || existing.retention_until || null
  };
  await query(
    `INSERT INTO audit_log (id, actor_id, entity_type, entity_id, action, payload_json)
     VALUES (?, ?, 'material_offer', ?, 'status_update', ?)`,
    [randomId(), admin.id, offerId, JSON.stringify(changes)]
  );
  await query(
    `INSERT INTO material_offer_events
     (id, offer_id, actor_id, event_type, from_status, to_status, note, metadata_json)
     VALUES (?, ?, ?, ?, ?, ?, NULLIF(?, ''), ?)`,
    [
      randomId(),
      offerId,
      admin.id,
      existing.status !== status ? 'status_changed' : 'workflow_updated',
      existing.status,
      status,
      adminNote,
      JSON.stringify(changes)
    ]
  );
  const rows = await query(
    `SELECT material_offers.*, assigned_user.name AS assigned_name
     FROM material_offers
     LEFT JOIN users assigned_user ON assigned_user.id = material_offers.assigned_to
     WHERE material_offers.id = ? LIMIT 1`,
    [offerId]
  );
  const photoRows = await query(
    'SELECT id, offer_id, file_name, mime_type, file_size, sort_order FROM material_offer_photos WHERE offer_id = ? ORDER BY sort_order',
    [offerId]
  );
  const eventRows = await query(
    `SELECT material_offer_events.*, users.name AS actor_name
     FROM material_offer_events LEFT JOIN users ON users.id = material_offer_events.actor_id
     WHERE material_offer_events.offer_id = ? ORDER BY material_offer_events.created_at DESC`,
    [offerId]
  );
  if (existing.status !== status) await sendMaterialOfferStatusEmail(rows[0], request);
  sendJson(response, 200, {
    offer: materialOfferRow(rows[0], photoRows.map(materialOfferPhotoRow), eventRows.map(materialOfferEventRow))
  });
}

async function anonymizeMaterialOffer(request, response, offerId) {
  const admin = await requireAdmin(request, response);
  if (!admin) return;
  const rows = await query('SELECT id, status, anonymized_at FROM material_offers WHERE id = ? LIMIT 1', [offerId]);
  if (!rows[0]) {
    sendJson(response, 404, { error: 'Nabídka nebyla nalezena.' });
    return;
  }
  if (rows[0].anonymized_at) {
    sendJson(response, 409, { error: 'Nabídka už byla anonymizována.' });
    return;
  }
  await query('DELETE FROM material_offer_photos WHERE offer_id = ?', [offerId]);
  await query(
    `UPDATE material_offers
     SET donor_name = 'Anonymizovaný dárce', email = NULL, phone = NULL, pickup_address = NULL,
         note = NULL, admin_note = NULL, anonymized_at = NOW()
     WHERE id = ?`,
    [offerId]
  );
  await query(
    `INSERT INTO material_offer_events (id, offer_id, actor_id, event_type, from_status, to_status, note)
     VALUES (?, ?, ?, 'anonymized', ?, ?, 'Osobní údaje a fotografie byly odstraněny administrátorem.')`,
    [randomId(), offerId, admin.id, rows[0].status, rows[0].status]
  );
  await query(
    `INSERT INTO audit_log (id, actor_id, entity_type, entity_id, action, payload_json)
     VALUES (?, ?, 'material_offer', ?, 'anonymize', '{}')`,
    [randomId(), admin.id, offerId]
  );
  sendJson(response, 200, { ok: true, id: offerId });
}

function emailTemplateRow(row) {
  return {
    key: row.template_key,
    displayName: row.display_name,
    subjectTemplate: row.subject_template,
    textTemplate: row.text_template,
    htmlTemplate: row.html_template,
    isActive: Boolean(row.is_active),
    updatedAt: row.updated_at
  };
}

async function listEmailTemplates(request, response) {
  const admin = await requireAdmin(request, response);
  if (!admin) return;
  const rows = await query(
    `SELECT template_key, display_name, subject AS subject_template, text_body AS text_template,
            html_body AS html_template, is_active, updated_at
     FROM email_templates ORDER BY display_name`
  );
  sendJson(response, 200, { templates: rows.map(emailTemplateRow) });
}

async function updateEmailTemplate(request, response, templateKey) {
  const admin = await requireAdmin(request, response);
  if (!admin) return;
  const body = await readBody(request);
  const subjectTemplate = trimOfferField(body.subjectTemplate, 255);
  const textTemplate = trimOfferField(body.textTemplate, 20000);
  const htmlTemplate = trimOfferField(body.htmlTemplate, 30000);
  const isActive = body.isActive !== false;
  if (!subjectTemplate || !textTemplate || !htmlTemplate) {
    sendJson(response, 400, { error: 'Předmět, textová i HTML verze šablony jsou povinné.' });
    return;
  }
  const result = await query(
    `UPDATE email_templates
     SET subject = ?, text_body = ?, html_body = ?, is_active = ?, updated_by = ?
     WHERE template_key = ?`,
    [subjectTemplate, textTemplate, htmlTemplate, isActive ? 1 : 0, admin.id, templateKey]
  );
  if (!result.affectedRows) {
    sendJson(response, 404, { error: 'E-mailová šablona nebyla nalezena.' });
    return;
  }
  const rows = await query(
    `SELECT template_key, display_name, subject AS subject_template, text_body AS text_template,
            html_body AS html_template, is_active, updated_at
     FROM email_templates WHERE template_key = ? LIMIT 1`,
    [templateKey]
  );
  sendJson(response, 200, { template: emailTemplateRow(rows[0]) });
}

async function getMaterialOfferPhoto(request, response, offerId, photoId) {
  const admin = await requireAdmin(request, response);
  if (!admin) return;
  const rows = await query(
    'SELECT file_name, mime_type, file_size, content FROM material_offer_photos WHERE id = ? AND offer_id = ? LIMIT 1',
    [photoId, offerId]
  );
  if (!rows[0]) {
    sendJson(response, 404, { error: 'Fotografie nebyla nalezena.' });
    return;
  }
  const photo = rows[0];
  response.writeHead(200, {
    'content-type': photo.mime_type,
    'content-length': photo.file_size,
    'content-disposition': `inline; filename="${String(photo.file_name).replace(/["\r\n]/g, '')}"`,
    'cache-control': 'private, max-age=300',
    'x-content-type-options': 'nosniff'
  });
  response.end(photo.content);
}

async function createApp(request, response) {
  try {
    const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);
    if (await servePublicDocument(request, response, url)) return;

    if (request.method === 'GET' && url.pathname === '/api/health') {
      sendJson(response, 200, { ok: true });
      return;
    }
    if (request.method === 'GET' && url.pathname === '/api/health/db') {
      const rows = await query('SELECT DATABASE() AS databaseName, CURRENT_USER() AS currentUser');
      sendJson(response, 200, {
        ok: true,
        database: rows[0]?.databaseName || null,
        user: rows[0]?.currentUser || null
      });
      return;
    }
    if (request.method === 'GET' && url.pathname === '/api/auth/google/start') return await startGoogleLogin(request, response, url);
    if (request.method === 'GET' && url.pathname === '/api/auth/google/callback') return await finishGoogleLogin(request, response, url);
    if (request.method === 'POST' && url.pathname === '/api/auth/register') return await registerClient(request, response);
    if (request.method === 'POST' && url.pathname === '/api/auth/login') return await login(request, response);
    if (request.method === 'GET' && url.pathname === '/api/auth/me') return await me(request, response);
    if (request.method === 'POST' && url.pathname === '/api/auth/logout') return await logout(request, response);
    if (request.method === 'POST' && url.pathname === '/api/auth/reset') return await resetPassword(request, response);
    if (request.method === 'POST' && url.pathname === '/api/auth/reset/confirm') return await confirmPasswordReset(request, response);
    if (request.method === 'GET' && url.pathname === '/api/applications/me') return await listMyProjectApplications(request, response);
    if (request.method === 'POST' && url.pathname === '/api/applications') return await submitProjectApplication(request, response);
    if (request.method === 'POST' && url.pathname === '/api/material-offers') return await submitMaterialOffer(request, response);
    if (request.method === 'GET' && url.pathname === '/api/public/jailbreak-background-stats') return await publicJailbreakBackgroundStats(request, response);
    if (request.method === 'GET' && url.pathname === '/api/sitemap/news.xml') return await newsSitemap(request, response);
    if (request.method === 'GET' && url.pathname === '/api/seo/news-page') return await newsSeoPage(request, response, url);
    if (request.method === 'GET' && url.pathname === '/api/news') return await listNews(request, response);
    if (request.method === 'POST' && url.pathname === '/api/news') return await saveNews(request, response);
    if (request.method === 'GET' && url.pathname === '/api/news/discussion') return await listNewsDiscussion(request, response);
    const newsItemMatch = url.pathname.match(/^\/api\/news\/([^/]+)$/);
    if (request.method === 'DELETE' && newsItemMatch) return await deleteNews(request, response, newsItemMatch[1]);
    const newsLikeMatch = url.pathname.match(/^\/api\/news\/([^/]+)\/like$/);
    if (request.method === 'POST' && newsLikeMatch) return await toggleNewsLike(request, response, newsLikeMatch[1]);
    const newsCommentMatch = url.pathname.match(/^\/api\/news\/([^/]+)\/comments$/);
    if (request.method === 'POST' && newsCommentMatch) return await addNewsComment(request, response, newsCommentMatch[1]);
    const commentMatch = url.pathname.match(/^\/api\/comments\/([^/]+)$/);
    if (request.method === 'PATCH' && commentMatch) return await updateNewsComment(request, response, commentMatch[1]);
    if (request.method === 'DELETE' && commentMatch) return await deleteNewsComment(request, response, commentMatch[1]);
    if (request.method === 'GET' && url.pathname === '/api/slides') return await listSlides(request, response);
    if (request.method === 'POST' && url.pathname === '/api/slides') return await saveSlide(request, response);
    if (request.method === 'GET' && url.pathname === '/api/homepage-content') return await listHomepageContent(request, response);
    if (request.method === 'POST' && url.pathname === '/api/homepage-content') return await saveHomepageContent(request, response);
    if (request.method === 'GET' && url.pathname === '/api/clients') return await listClients(request, response);
    if (request.method === 'POST' && url.pathname === '/api/clients') return await createClient(request, response);
    const clientMatch = url.pathname.match(/^\/api\/clients\/([^/]+)$/);
    if (request.method === 'DELETE' && clientMatch) return await deleteClient(request, response, decodeURIComponent(clientMatch[1]));
    if (request.method === 'GET' && url.pathname === '/api/forms/templates') return await listFormTemplates(request, response);
    if (request.method === 'POST' && url.pathname === '/api/forms/fill-pdf') return await fillFormPdf(request, response);
    if (request.method === 'GET' && url.pathname === '/api/admin/users') return await listUsers(request, response);
    if (request.method === 'GET' && url.pathname === '/api/admin/applications') return await listProjectApplications(request, response);
    if (request.method === 'GET' && url.pathname === '/api/admin/material-offers') return await listMaterialOffers(request, response);
    if (request.method === 'GET' && url.pathname === '/api/admin/email-templates') return await listEmailTemplates(request, response);
    const emailTemplateMatch = url.pathname.match(/^\/api\/admin\/email-templates\/([^/]+)$/);
    if (request.method === 'PATCH' && emailTemplateMatch) return await updateEmailTemplate(request, response, decodeURIComponent(emailTemplateMatch[1]));
    const materialOfferPhotoMatch = url.pathname.match(/^\/api\/admin\/material-offers\/([^/]+)\/photos\/([^/]+)$/);
    if (request.method === 'GET' && materialOfferPhotoMatch) return await getMaterialOfferPhoto(request, response, materialOfferPhotoMatch[1], materialOfferPhotoMatch[2]);
    const materialOfferAnonymizeMatch = url.pathname.match(/^\/api\/admin\/material-offers\/([^/]+)\/anonymize$/);
    if (request.method === 'POST' && materialOfferAnonymizeMatch) return await anonymizeMaterialOffer(request, response, materialOfferAnonymizeMatch[1]);
    const materialOfferMatch = url.pathname.match(/^\/api\/admin\/material-offers\/([^/]+)$/);
    if (request.method === 'PATCH' && materialOfferMatch) return await updateMaterialOffer(request, response, materialOfferMatch[1]);
    const projectApplicationMatch = url.pathname.match(/^\/api\/admin\/applications\/([^/]+)$/);
    if (request.method === 'PATCH' && projectApplicationMatch) return await reviewProjectApplication(request, response, projectApplicationMatch[1]);
    const userResetMatch = url.pathname.match(/^\/api\/admin\/users\/([^/]+)\/reset-password$/);
    if (request.method === 'POST' && userResetMatch) return await resetUserPassword(request, response, userResetMatch[1]);
    const userMatch = url.pathname.match(/^\/api\/admin\/users\/([^/]+)$/);
    if (request.method === 'PATCH' && userMatch) return await updateUser(request, response, userMatch[1]);
    if (request.method === 'DELETE' && userMatch) return await deleteUser(request, response, userMatch[1]);
    if (request.method === 'GET' && url.pathname === '/api/media/public') return await listPublicMedia(request, response);
    if (request.method === 'GET' && url.pathname === '/api/media') return await listMedia(request, response);
    if (request.method === 'POST' && url.pathname === '/api/media') return await saveMedia(request, response);
    if (request.method === 'POST' && url.pathname === '/api/media/upload') return await uploadMediaToPublicFolder(request, response);
    if (request.method === 'GET' && url.pathname === '/api/documents') return await listDocuments(request, response);
    if (request.method === 'POST' && url.pathname === '/api/documents') return await saveDocument(request, response);
    if (request.method === 'GET' && url.pathname === '/api/notifications') return await listNotifications(request, response);
    if (request.method === 'POST' && url.pathname === '/api/notifications') return await saveNotification(request, response);
    const notificationMatch = url.pathname.match(/^\/api\/notifications\/([^/]+)\/read$/);
    if (request.method === 'PATCH' && notificationMatch) return await markNotificationRead(request, response, notificationMatch[1]);
    const notificationDeleteMatch = url.pathname.match(/^\/api\/notifications\/([^/]+)$/);
    if (request.method === 'DELETE' && notificationDeleteMatch) return await deleteNotification(request, response, notificationDeleteMatch[1]);
    sendJson(response, 404, { error: 'Not found.' });
  } catch (error) {
    sendJson(response, 500, { error: error.message || 'Server error.' });
  }
}

module.exports = { createApp };
