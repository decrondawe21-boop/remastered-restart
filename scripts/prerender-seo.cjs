const fs = require('node:fs');
const path = require('node:path');
const methodologyDocuments = require('../src/methodologyDocuments.json');

const baseUrl = 'https://restartintegrace.dk-i.cz';
const ogImage = `${baseUrl}/images/og/restart-integrace-homepage-1200x630.png`;
const routeOgImages = {
  '/': `${baseUrl}/images/og/restart-integrace-homepage-1200x630.png`,
  '/zapojeni': `${baseUrl}/images/og/restart-integrace-zapojeni-1200x630.png`,
  '/povinne-zverejnovani': `${baseUrl}/images/og/restart-integrace-povinne-zverejnovani-1200x630.png`,
  '/aktuality': `${baseUrl}/images/og/restart-integrace-pribehy-1200x630.png`,
  '/programy/jailbreak': `${baseUrl}/images/og/restart-integrace-homepage-1200x630.png`
};
const today = new Date().toISOString().slice(0, 10);
const officialName = 'RESTART Integrace';
const styledName = 'REST||ART Integrace';
const alternateNames = [styledName, 'REST ART Integrace', 'Restart Integrace', 'RESTARTINTEGRACE'];
const defaultRobots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
const defaultKeywords =
  'RESTART Integrace, REST||ART Integrace, Restart Integrace, oficiální web RESTART Integrace, druhá šance, sociální integrace, mentoring, práce, bydlení, stabilizace, JAILBREAK, RESET, REWORK';
const googleTagId = 'G-8YXS6ZYRNH';
const googleConsentSnippet = `    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('consent', 'default', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        personalization_storage: 'denied',
        functionality_storage: 'granted',
        security_storage: 'granted',
        wait_for_update: 500
      });
    </script>`;
const criticalCss = `
@font-face{font-family:"Poppins";font-style:normal;font-weight:400;font-display:swap;src:url("/fonts/poppins/poppins-01.woff2") format("woff2")}
@font-face{font-family:"Poppins";font-style:normal;font-weight:500;font-display:swap;src:url("/fonts/poppins/poppins-02.woff2") format("woff2")}
@font-face{font-family:"Poppins";font-style:normal;font-weight:600;font-display:swap;src:url("/fonts/poppins/poppins-03.woff2") format("woff2")}
@font-face{font-family:"Poppins";font-style:normal;font-weight:700;font-display:swap;src:url("/fonts/poppins/poppins-04.woff2") format("woff2")}
@font-face{font-family:"Poppins";font-style:normal;font-weight:800;font-display:swap;src:url("/fonts/poppins/poppins-05.woff2") format("woff2")}
:root{color-scheme:light;--bg:#fff;--bg-soft:#f5f8f4;--text:#17211b;--muted:#617064;--line:#dce6dd;--green:#2f7d49;--green-dark:#1f5f36;--green-soft:#e4f2e7;--gold:#b8933a;--page-max:1640px;--page-gutter:clamp(22px,3.6vw,58px);--font-sans:"Poppins","Aptos","Segoe UI Variable","Segoe UI",ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,sans-serif;--weight-bold:800;font-family:var(--font-sans)}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--text);font-family:var(--font-sans);font-size:16px;line-height:1.5}
a{color:inherit}
.app-layout-provider{min-height:100vh;background:linear-gradient(180deg,#fff 0%,#f7faf7 100%)}
.site-header{position:sticky;top:0;z-index:40;display:flex;gap:18px;align-items:center;justify-content:space-between;padding:16px var(--page-gutter);border-bottom:1px solid var(--line);background:rgba(255,255,255,.94);backdrop-filter:blur(16px)}
.brand{display:inline-flex;align-items:center;text-decoration:none}
.brand img{width:220px;height:auto}
.desktop-nav{display:flex;gap:8px;align-items:center}
.desktop-nav a,.button{display:inline-flex;align-items:center;gap:8px;border-radius:14px;text-decoration:none;font-weight:700}
.desktop-nav a{padding:10px 12px;color:#34443a}
.button.primary{padding:13px 18px;background:var(--green);color:#fff}
.menu-button{display:none}
.hero{max-width:var(--page-max);margin:0 auto;padding:clamp(22px,4vw,58px) var(--page-gutter)}
.hero-banner{position:relative;overflow:hidden;min-height:clamp(420px,58vw,720px);border-radius:30px;background:#0a2117;box-shadow:0 24px 70px rgba(12,44,27,.18)}
.hero-banner-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:blur(24px) saturate(.9);transform:scale(1.08);opacity:.44}
.hero-banner-main{position:absolute;inset:0;width:100%;height:100%;object-fit:contain}
.hero-banner-overlay{position:relative;z-index:2;max-width:760px;padding:clamp(36px,6vw,78px);color:#fff}
.hero-banner-overlay h1{margin:0 0 16px;font-size:clamp(3rem,8vw,7.8rem);line-height:.9;letter-spacing:-.08em}
.quiet-label,.section-label{margin:0 0 10px;color:var(--green-dark);font-size:.78rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase}
.hero-banner-overlay .quiet-label{color:#d8efad}
.hero-text,.hero-program-motto{max-width:620px;margin:0 0 18px;font-size:clamp(1rem,2vw,1.35rem)}
.hero-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:22px}
.seo-document-snapshot{max-width:1120px;margin:0 auto;padding:56px var(--page-gutter) 96px}.seo-document-snapshot header{max-width:860px;margin-bottom:44px}.seo-document-snapshot h1{margin:0 0 18px;color:var(--green-dark);font-size:clamp(2.25rem,5vw,4.5rem);line-height:1.04}.seo-document-snapshot h2{margin:52px 0 18px;color:var(--green-dark);font-size:clamp(1.55rem,3vw,2.25rem)}.seo-document-snapshot h3{margin:30px 0 12px;color:var(--green-dark)}.seo-document-snapshot p,.seo-document-snapshot li,.seo-document-snapshot dd{max-width:82ch}.seo-document-snapshot blockquote{margin:28px 0;padding:20px 24px;border-left:4px solid var(--gold);background:var(--bg-soft)}.seo-document-snapshot dt{margin-top:24px;color:var(--green-dark);font-weight:800}.seo-document-snapshot dd{margin:6px 0 0}.seo-document-snapshot-download{display:inline-flex;margin-top:18px;padding:12px 16px;border-radius:8px;background:var(--green);color:#fff;text-decoration:none;font-weight:700}
.seo-video-watch-snapshot{max-width:1440px;margin:0 auto;padding:42px var(--page-gutter) 90px}.seo-video-watch-snapshot header{max-width:960px;margin-bottom:26px}.seo-video-watch-snapshot h1{margin:0 0 14px;color:var(--green-dark);font-size:clamp(2.25rem,5vw,4.8rem);line-height:1.02}.seo-video-watch-snapshot video{display:block;width:100%;max-height:calc(100vh - 240px);aspect-ratio:16/9;background:#050806;object-fit:contain}.seo-video-watch-snapshot footer{max-width:780px;padding-top:28px}
.seo-route-snapshot{max-width:1180px;margin:0 auto;padding:56px var(--page-gutter) 96px}.seo-route-snapshot>header{max-width:900px;margin-bottom:42px}.seo-route-snapshot h1{margin:0 0 18px;color:var(--green-dark);font-size:clamp(2.25rem,5vw,4.8rem);line-height:1.04}.seo-route-snapshot h2{margin:0 0 14px;color:var(--green-dark);font-size:clamp(1.45rem,3vw,2.15rem)}.seo-route-snapshot p,.seo-route-snapshot li{max-width:82ch}.seo-route-snapshot section{padding:30px 0;border-top:1px solid var(--line)}.seo-route-snapshot ul{display:grid;gap:8px;padding-left:22px}.seo-route-snapshot nav{display:flex;flex-wrap:wrap;gap:10px;margin-top:34px}.seo-route-snapshot nav a{padding:11px 14px;border:1px solid var(--line);border-radius:8px;background:#fff;color:var(--green-dark);font-weight:700;text-decoration:none}.seo-route-snapshot img{display:block;max-width:100%;height:auto;margin:24px 0}
@media(max-width:760px){.site-header{padding:12px 18px}.brand img{width:174px}.desktop-nav{display:none}.menu-button{display:inline-flex}.hero{padding:18px}.hero-banner{min-height:520px;border-radius:22px}.hero-banner-overlay{padding:28px}.hero-banner-overlay h1{font-size:clamp(2.6rem,16vw,4.5rem)}}
`.trim();
const videoAssets = [
  {
    id: 'predstaveni-projektu',
    watchPath: '/videa/predstaveni-projektu',
    name: 'RESTART Integrace - krátké představení projektu',
    description:
      'Krátké video představující RESTART Integrace jako projekt druhých šancí, praktické podpory a návratu lidí do života.',
    thumbnailUrl: `${baseUrl}/videos/rest-art-intro-poster.png`,
    contentUrl: `${baseUrl}/videos/rest-art-intro-z-podkladu-v1-720p.mp4`,
    uploadDate: '2026-06-23T00:00:00+02:00',
    duration: 'PT15S',
    durationSeconds: 15,
    width: 1280,
    height: 720,
    familyFriendly: true
  },
  {
    id: 'logo-reveal',
    watchPath: '/videa/logo-reveal',
    name: 'RESTART Integrace - logo reveal',
    description: 'Logo animace RESTART Integrace pro veřejnou prezentaci projektu druhých šancí.',
    thumbnailUrl: `${baseUrl}/videos/restart-logo-reveal-poster.png`,
    contentUrl: `${baseUrl}/videos/restart-logo-reveal.mp4`,
    uploadDate: '2026-06-23T00:00:00+02:00',
    duration: 'PT6S',
    durationSeconds: 6,
    width: 1920,
    height: 1080,
    familyFriendly: true
  }
];

const storyRoutes = [
  {
    id: 'story-z-praxe-ne-od-stolu',
    path: '/pribehy-druhe-sance/story-z-praxe-ne-od-stolu',
    title: 'REST||ART vznikl z praxe, ne od stolu | Příběhy druhé šance',
    description:
      'Zakladatelský příběh projektu REST||ART / RESTART Integrace: osobní cesta přes závislost, ulici, výkon trestu, návrat do práce a vznik systému druhých šancí.',
    keywords:
      'REST||ART vznikl z praxe, zakladatelský příběh, RESTART Integrace, výkon trestu, bezdomovectví, závislost, návrat do života, druhá šance, JAILBREAK, reintegrace',
    datePublished: '2026-07-02',
    priority: '0.78',
    changefreq: 'weekly',
    articleHeadline: 'REST||ART vznikl z praxe, ne od stolu'
  },
  {
    id: 'story-petr-s-druha-sance',
    path: '/pribehy-druhe-sance/story-petr-s-druha-sance',
    title: 'Petr S.: Dopis, ve kterém se člověk nechce vzdát | Příběhy druhé šance',
    description:
      'Anonymizovaný příběh druhé šance: Petr S. popisuje cestu přes ústavní péči, ulici, výkon trestu i snahu začít žít jinak.',
    keywords:
      'Petr S., příběh druhé šance, anonymizovaný příběh, JAILBREAK, výkon trestu, ústavní péče, návrat do života, RESTART Integrace',
    datePublished: '2026-06-24',
    priority: '0.74',
    changefreq: 'monthly',
    articleHeadline: 'Petr S.: Dopis, ve kterém se člověk nechce vzdát'
  }
];

const methodologyDocumentRoutes = methodologyDocuments.map((document) => ({
  path: document.path,
  title: `${document.title} | RESTART Integrace`,
  description: document.description,
  keywords: document.keywords.join(', '),
  priority: document.id === 'slovnik-pojmu' ? '0.76' : '0.72',
  changefreq: 'monthly',
  methodologyDocumentId: document.id
}));

const videoWatchRoutes = videoAssets.map((video) => ({
  path: video.watchPath,
  title: `${video.name} | RESTART Integrace`,
  description: video.description,
  keywords:
    video.id === 'predstaveni-projektu'
      ? 'RESTART Integrace video, představení projektu, druhá šance, sociální reintegrace, návrat do života'
      : 'REST ART Integrace logo reveal, RESTART Integrace video, vizuální identita, projekt druhých šancí',
  priority: '0.72',
  changefreq: 'monthly',
  videoId: video.id
}));

const routes = [
  {
    path: '/',
    title: 'RESTART Integrace | REST||ART - oficiální projekt druhých šancí',
    description:
      'Oficiální web RESTART Integrace (REST||ART). Projekt druhých šancí pro stabilizaci, práci, bydlení a důstojný návrat do společnosti.',
    priority: '1.0',
    changefreq: 'weekly'
  },
  {
    path: '/co-delame',
    title: 'Co děláme | RESTART Integrace',
    description:
      'RESTART Integrace propojuje mentoring, práci, bydlení, stabilizaci a komunitní podporu pro lidi, kteří potřebují konkrétní druhou šanci.',
    priority: '0.8',
    changefreq: 'monthly'
  },
  {
    path: '/programy',
    title: 'Programy podpory | RESTART Integrace',
    description:
      'Programy RESTART Integrace: JAILBREAK, RESET, REWORK, STREETWISE, BOD ZLOMU a STABILIZACE propojují práci, režim, mentoring a návrat do života.',
    priority: '0.9',
    changefreq: 'monthly'
  },
  {
    path: '/programy/jailbreak',
    title: 'JAILBREAK | Návrat po výkonu trestu a druhá šance v praxi',
    description:
      'JAILBREAK je program RESTART Integrace pro lidi po výkonu trestu: mentoring, plán návratu, práce, bydlení, režim, vztahy a následná stabilizace po propuštění.',
    keywords:
      'JAILBREAK, program JAILBREAK, návrat po výkonu trestu, postpenitenciární péče, resocializace, reintegrace odsouzených, druhá šance, snížení recidivy, práce po propuštění, bydlení po propuštění, mentoring vězňů, RESTART Integrace',
    priority: '0.95',
    changefreq: 'weekly'
  },
  {
    path: '/programy/reset',
    title: 'RESET | Závislosti, krize a nový režim',
    description:
      'RESET podporuje lidi v závislosti, krizi nebo rozpadu režimu přes terapii, komunitu, mentoring a bezpečný rytmus dne.',
    priority: '0.8',
    changefreq: 'monthly'
  },
  {
    path: '/programy/rework',
    title: 'REWORK | Pracovní restart',
    description:
      'REWORK pomáhá dlouhodobě nezaměstnaným a lidem s bariérami najít pracovní směr, rekvalifikaci a férový návrat do praxe.',
    priority: '0.8',
    changefreq: 'monthly'
  },
  {
    path: '/programy/streetwise',
    title: 'STREETWISE | Nízkoprahová podpora',
    description:
      'STREETWISE je první bezpečný krok pro lidi bez domova nebo mimo dosah systému: terén, důvěra, zázemí a stabilizace.',
    priority: '0.8',
    changefreq: 'monthly'
  },
  {
    path: '/programy/bod-zlomu',
    title: 'BOD ZLOMU | Přechod do samostatnosti',
    description:
      'BOD ZLOMU podporuje mladé lidi po ústavní péči při přechodu do samostatnosti, vztahů, práce a vlastního směru.',
    priority: '0.8',
    changefreq: 'monthly'
  },
  {
    path: '/programy/stabilizace',
    title: 'STABILIZACE | Udržet změnu v životě',
    description:
      'STABILIZACE pomáhá udržet změnu v bydlení, práci, režimu, komunitě a běžném životě po zvládnutí prvního restartu.',
    priority: '0.8',
    changefreq: 'monthly'
  },
  {
    path: '/aktuality',
    title: 'Aktuality | RESTART Integrace',
    description:
      'Novinky, veřejné zprávy a průběžné informace z oficiálního projektu RESTART Integrace.',
    priority: '0.7',
    changefreq: 'weekly'
  },
  {
    path: '/galerie',
    title: 'Galerie z praxe | RESTART Integrace',
    description:
      'Fotodokumentace budování zázemí, společné práce a každodenní proměny projektu RESTART Integrace.',
    keywords:
      'RESTART Integrace galerie, fotografie z praxe, fotodokumentace, budování zázemí, STREETWISE, práce svépomocí, druhá šance v obrazech',
    priority: '0.76',
    changefreq: 'weekly'
  },
  {
    path: '/pribehy-druhe-sance',
    title: 'Příběhy druhé šance | RESTART Integrace',
    description:
      'Anonymizované příběhy druhé šance z projektu RESTART Integrace. Citlivě, bez bulváru a s důrazem na cestu ke stabilitě.',
    keywords:
      'Příběhy druhé šance, anonymizované příběhy, RESTART Integrace, sociální začleňování, druhá šance, návrat do života, JAILBREAK, RESET, stabilizace',
    priority: '0.85',
    changefreq: 'weekly'
  },
  ...storyRoutes,
  {
    path: '/zapojeni',
    title: 'Zapojení a možnosti podpory | RESTART Integrace',
    description:
      'Rozcestník podpory RESTART Integrace: darování oblečení, vybavení komunitního centra, sbírka knih, finanční dary a partnerství.',
    keywords:
      'podpora RESTART Integrace, darovat oblečení, darovat nábytek, sbírka knih, finanční dar, komunitní centrum, STREETWISE, reintegrace',
    priority: '0.8',
    changefreq: 'monthly'
  },
  {
    path: '/hledame',
    title: 'Hledáme kolegy a dobrovolníky | RESTART Integrace',
    description:
      'RESTART Integrace hledá sociálního pracovníka, adiktologa, psychologa, komunitního pracovníka a dobrovolníky pro praktickou podporu lidí na cestě ke stabilitě.',
    keywords:
      'sociální pracovník, adiktolog, psycholog, komunitní pracovník, dobrovolníci, práce v sociálních službách, RESTART Integrace, odborná spolupráce',
    priority: '0.82',
    changefreq: 'monthly'
  },
  {
    path: '/zapojeni/darovat-obleceni',
    title: 'Darovat oblečení lidem v nouzi | RESTART Integrace',
    description:
      'Darujte čisté oblečení a základní potřeby lidem bez prostředků, klientům programu STREETWISE a lidem po propuštění z výkonu trestu.',
    keywords:
      'darovat oblečení, oblečení pro lidi v nouzi, pomoc po propuštění z vězení, STREETWISE, lidé bez domova, materiální pomoc, základní potřeby',
    priority: '0.78',
    changefreq: 'monthly'
  },
  {
    path: '/zapojeni/vybaveni-centra',
    title: 'Darovat vybavení komunitnímu centru | RESTART Integrace',
    description:
      'Nabídněte funkční nábytek, kancelářské vybavení, techniku nebo nářadí pro komunitní centrum a kanceláře projektu RESTART Integrace.',
    keywords:
      'darovat nábytek, vybavení komunitního centra, kancelářské vybavení, darovat techniku, darovat nářadí, materiální pomoc, RESTART Integrace',
    priority: '0.76',
    changefreq: 'monthly'
  },
  {
    path: '/zapojeni/sbirka-knih',
    title: 'Sbírka knih pro mentoring a komunitní centrum | RESTART Integrace',
    description:
      'Darujte kvalitní knihy pro komunitní centrum, mentoring, vzdělávání a místa, kde mohou podpořit osobní rozvoj a návrat do společnosti.',
    keywords:
      'sbírka knih, darovat knihy, knihy pro komunitní centrum, knihy pro mentoring, vzdělávání, knihy do věznic, RESTART Integrace',
    priority: '0.76',
    changefreq: 'monthly'
  },
  {
    path: '/darovat',
    title: 'Darovat | Podpořte RESTART Integrace',
    description:
      'Podpořte RESTART Integrace přes bezpečný donate systém nebo přímý převod. Dary pomáhají pokrýt mentoring, materiály, práci a stabilizaci.',
    keywords:
      'darovat RESTART Integrace, podpora druhé šance, donate REST||ART, dar na resocializaci, podpora reintegrace',
    priority: '0.78',
    changefreq: 'monthly'
  },
  {
    path: '/metodika',
    title: 'Metodika | RESTART Integrace',
    description:
      'Veřejná metodika REST||ART Integrace: životní cyklus klienta, Manifest, Charta, Slovník pojmů, koncepční podklady, programové pilíře a dokumenty ke stažení.',
    keywords:
      'metodika REST||ART Integrace, Manifest REST ART, Charta REST ART, Slovník pojmů reintegrace, koncepční podklady, životní cyklus klienta, Stabilizační index, reintegrace, resocializace, JAILBREAK, RESET, STREETWISE, REWORK, BOD ZLOMU, STABILIZACE',
    priority: '0.75',
    changefreq: 'monthly'
  },
  ...methodologyDocumentRoutes,
  {
    path: '/povinne-zverejnovani',
    title: 'Povinné zveřejňování | RESTART Integrace',
    description:
      'Transparentní dokumenty, veřejné podklady a provozní informace oficiálního projektu RESTART Integrace.',
    priority: '0.7',
    changefreq: 'monthly'
  },
  {
    path: '/kontakt',
    title: 'Kontakt | RESTART Integrace',
    description:
      'Kontaktujte RESTART Integrace. E-mail, telefon, adresa a kontaktní formulář pro partnery, klienty i veřejnost.',
    priority: '0.7',
    changefreq: 'monthly'
  },
  {
    path: '/pro-firmy',
    title: 'Pro firmy | RESTART Integrace',
    description:
      'Partnerství pro firmy, které chtějí podpořit konkrétní druhou šanci: pracovní příležitosti, mentoring, materiál a zázemí.',
    priority: '0.6',
    changefreq: 'monthly'
  },
  {
    path: '/media',
    title: 'Média | RESTART Integrace',
    description:
      'Základní informace pro novináře, partnery a veřejnou komunikaci projektu RESTART Integrace.',
    priority: '0.5',
    changefreq: 'monthly'
  },
  ...videoWatchRoutes,
  {
    path: '/webove-gdpr',
    title: 'Webové GDPR | RESTART Integrace',
    description:
      'Informace o cookies, souhlasech, formulářích, klientské zóně a bezpečnostních principech webu.',
    priority: '0.4',
    changefreq: 'yearly'
  },
  {
    path: '/zasady-ochrany-osobnich-udaju',
    title: 'Zásady ochrany osobních údajů | RESTART Integrace',
    description:
      'Zásady ochrany osobních údajů projektu RESTART Integrace a informace o právech subjektů údajů.',
    priority: '0.4',
    changefreq: 'yearly'
  },
  {
    path: '/vyhledavani',
    title: 'Výsledky vyhledávání | RESTART Integrace',
    description: 'Vyhledávání ve veřejném obsahu webu RESTART Integrace.',
    noindex: true
  },
  {
    path: '/klient',
    title: 'Klientská zóna | RESTART Integrace',
    description: 'Chráněná klientská zóna projektu RESTART Integrace.',
    noindex: true
  },
  {
    path: '/admin',
    title: 'Administrace | RESTART Integrace',
    description: 'Chráněná administrace projektu RESTART Integrace.',
    noindex: true
  }
];

const distDir = path.join(process.cwd(), 'dist');
const indexPath = path.join(distDir, 'index.html');
const template = fs.readFileSync(indexPath, 'utf8');

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeXml(value) {
  return escapeHtml(value).replace(/'/g, '&apos;');
}

function routeUrl(routePath) {
  return `${baseUrl}${routePath === '/' ? '/' : routePath}`;
}

function routeOgImage(route) {
  const video = videoAssets.find((item) => item.id === route.videoId);
  if (video) return video.thumbnailUrl;
  if (route.path.startsWith('/zapojeni/')) return routeOgImages['/zapojeni'];
  return routeOgImages[route.path] || ogImage;
}

function routeLabel(routePath) {
  const labels = {
    '/': 'Úvod',
    '/co-delame': 'Co děláme',
    '/programy': 'Programy',
    '/programy/jailbreak': 'JAILBREAK',
    '/programy/reset': 'RESET',
    '/programy/rework': 'REWORK',
    '/programy/streetwise': 'STREETWISE',
    '/programy/bod-zlomu': 'BOD ZLOMU',
    '/programy/stabilizace': 'STABILIZACE',
    '/aktuality': 'Aktuality',
    '/galerie': 'Galerie',
    '/zapojeni': 'Zapojení',
    '/hledame': 'Hledáme',
    '/zapojeni/darovat-obleceni': 'Darovat oblečení',
    '/zapojeni/vybaveni-centra': 'Vybavení centra',
    '/zapojeni/sbirka-knih': 'Sbírka knih',
    '/darovat': 'Darovat',
    '/metodika': 'Metodika',
    '/povinne-zverejnovani': 'Povinné zveřejňování',
    '/kontakt': 'Kontakt',
    '/pro-firmy': 'Pro firmy',
    '/media': 'Média',
    '/webove-gdpr': 'Webové GDPR',
    '/zasady-ochrany-osobnich-udaju': 'Zásady ochrany osobních údajů',
    '/klient': 'Klientská zóna',
    '/admin': 'Administrace'
  };
  const story = storyRoutes.find((item) => item.path === routePath);
  if (story) return story.articleHeadline;
  const methodologyDocument = methodologyDocuments.find((item) => item.path === routePath);
  if (methodologyDocument) return methodologyDocument.shortTitle;
  const video = videoAssets.find((item) => item.watchPath === routePath);
  if (video) return video.name;
  return labels[routePath] || routePath.replace(/^\//, '').replace(/-/g, ' ');
}

const programSnapshotContent = {
  '/programy/jailbreak': {
    audience: 'Lidé ve výkonu trestu, po propuštění a lidé, kteří potřebují připravený návrat do běžného života.',
    purpose:
      'JAILBREAK propojuje přípravu ještě před propuštěním s konkrétním plánem práce, bydlení, vztahů, režimu a následné stabilizace.',
    items: [
      'mentoring, korespondence a návštěvy',
      'individuální plán návratu a příprava na podmíněné propuštění',
      'pracovní a ubytovací návaznost',
      'podpora rodinných vztahů a základní materiální pomoc',
      'follow-up po propuštění a včasná reakce na riziko relapsu'
    ]
  },
  '/programy/reset': {
    audience: 'Lidé v krizi, závislosti nebo rozpadu každodenního režimu.',
    purpose:
      'RESET vytváří bezpečný prostor pro zastavení, pojmenování situace a postupnou obnovu zdravějšího rytmu, odpovědnosti a vztahů.',
    items: [
      'vstupní posouzení potřeb a rizik',
      'individuální cíle a pravidelný mentoring',
      'obnova denního režimu a praktických návyků',
      'návaznost na odbornou, terapeutickou a komunitní podporu'
    ]
  },
  '/programy/rework': {
    audience: 'Lidé dlouhodobě mimo pracovní trh a lidé s bariérami při návratu do zaměstnání.',
    purpose:
      'REWORK používá práci jako prostředek obnovy identity, návyků a vlastní hodnoty. Zaměstnání není odměna, ale součást odpovědného návratu.',
    items: [
      'mapování schopností a pracovního směru',
      'pracovní trénink, rekvalifikace a finanční gramotnost',
      'spolupráce s odpovědnými zaměstnavateli',
      'podpora při nástupu a průběžné vyhodnocování stability'
    ]
  },
  '/programy/streetwise': {
    audience: 'Lidé bez domova, bez bezpečného zázemí nebo mimo dosah běžných služeb.',
    purpose:
      'STREETWISE nabízí první dostupný kontakt, praktickou pomoc a cestu od akutní nouze ke stabilizaci. Důvěra je vždy spojena s odpovědností.',
    items: [
      'terénní a nízkoprahový kontakt',
      'základní potřeby, oblečení a krizové nasměrování',
      'pomoc s dokumenty, komunikací a individuálním plánem',
      'návaznost na bydlení, práci, mentoring a odborné služby'
    ]
  },
  '/programy/bod-zlomu': {
    audience: 'Mladí lidé před odchodem z ústavní péče a při přechodu do samostatnosti.',
    purpose:
      'BOD ZLOMU vytváří rozhodující oporu dříve, než přijde selhání. Pomáhá převést motivaci do konkrétního směru, dovedností a bezpečných vztahů.',
    items: [
      'včasný mentoring a příprava na samostatnost',
      'praktické dovednosti, finanční gramotnost a orientace v systému',
      'podpora při hledání práce a bydlení',
      'dlouhodobější bezpečný vztah a plán pro krizové situace'
    ]
  },
  '/programy/stabilizace': {
    audience: 'Lidé, kteří zvládli první změnu a potřebují ji udržet v běžném životě.',
    purpose:
      'STABILIZACE sleduje, zda změna drží v práci, bydlení, režimu, vztazích a komunitě. Podpora se postupně omezuje podle reálné samostatnosti.',
    items: [
      'průběžné hodnocení stabilizačního indexu',
      'udržení zaměstnání, bydlení a každodenního režimu',
      'prevence relapsu a včasná krizová intervence',
      'follow-up po 30, 90, 180 a 365 dnech'
    ]
  }
};

const routeSnapshotContent = {
  '/': {
    eyebrow: 'Zkušenost, poznání, metodika, projekt',
    heading: 'RESTART Integrace',
    lead:
      'REST||ART Integrace je vznikající systém pracovní a sociální reintegrace. Propojuje praktickou zkušenost, odpovědné zaměstnavatele, veřejné instituce a odbornou podporu, aby návrat do společnosti nebyl otázkou náhody, ale připraveného procesu.',
    sections: [
      {
        title: 'Nevytváříme další službu',
        paragraphs: [
          'Většina projektů vzniká v pořadí problém, dotace, projekt. U nás je pořadí opačné: zkušenost, poznání, metodika, projekt. Systém vznikl z opakované zkušenosti s lidmi, kteří měli schopnosti i motivaci pracovat, ale systémové překážky jim návrat výrazně komplikovaly.',
          'Člověka nedefinujeme jeho trestem ani minulostí. Příležitost ale nikdy neznamená omluvu. Důvěra je spojena s odpovědností, konkrétním plánem a ověřitelnými kroky.'
        ]
      },
      {
        title: 'Druhá šance v praxi',
        items: [
          'mentoring a individuální plán',
          'práce, pracovní návyky a odpovědní zaměstnavatelé',
          'bydlení, režim a stabilní zázemí',
          'komunita, vztahy a návazná odborná podpora',
          'měřitelné výsledky a otevřené vyhodnocování podle principu ONLY TRUE'
        ]
      }
    ],
    links: [
      ['/co-delame', 'Jak systém funguje'],
      ['/programy', 'Programy podpory'],
      ['/metodika', 'Veřejná metodika'],
      ['/zapojeni', 'Možnosti zapojení']
    ]
  },
  '/co-delame': {
    eyebrow: 'Co děláme',
    heading: 'Obnova lidského potenciálu',
    lead:
      'Nejde pouze o zaměstnávání, projekt pro bývalé vězně ani náhradu sociální služby. RESTART Integrace vytváří praktický překlad mezi světem lidí, kteří se vracejí do společnosti, a světem zaměstnavatelů, institucí a odborných partnerů.',
    sections: [
      {
        title: 'Základní principy',
        items: [
          'Člověk není jeho trest. Pracujeme s budoucím potenciálem, ne s minulostí jako identitou.',
          'Důvěra není slepá. Klient dostává příležitost, odpovědnost a jasná pravidla.',
          'Práce není odměna. Je prostředkem obnovy identity, sebedůvěry a důstojnosti.',
          'Bod zlomu vytváříme dříve: ve vězení, škole, dětském domově nebo při prvním bezpečném kontaktu.',
          'Největší změna nastává, když člověk začne věřit, že má budoucnost, a převezme za ni odpovědnost.'
        ]
      },
      {
        title: 'Od prvního kontaktu k samostatnosti',
        paragraphs: [
          'Spolupráce prochází vstupním posouzením, zařazením do vhodného programu, individuálním plánem, intervencemi a průběžným hodnocením. Po stabilizaci následuje follow-up, aby se případná krize zachytila dříve, než zničí dosaženou změnu.'
        ]
      }
    ],
    links: [
      ['/programy', 'Prohlédnout programy'],
      ['/metodika', 'Metodický rámec'],
      ['/kontakt', 'Kontaktovat projekt']
    ]
  },
  '/programy': {
    eyebrow: 'Šest programových pilířů',
    heading: 'Programy RESTART Integrace',
    lead:
      'JAILBREAK, RESET, REWORK, STREETWISE, BOD ZLOMU a STABILIZACE tvoří propojený systém. Klient nevstupuje do univerzální služby; podle situace dostává individuální plán, odpovědnosti a návaznost mezi jednotlivými formami podpory.',
    sections: [
      {
        title: 'Jeden směr, rozdílné vstupní situace',
        paragraphs: [
          'Programy pokrývají přípravu na návrat z výkonu trestu, krizi a závislost, pracovní restart, nízkoprahovou pomoc, přechod mladých lidí do samostatnosti i dlouhodobé udržení změny. Společným cílem je samostatný člověk, který pomoc postupně přestane potřebovat.'
        ],
        items: Object.keys(programSnapshotContent).map((programPath) => routeLabel(programPath))
      }
    ],
    links: Object.keys(programSnapshotContent).map((programPath) => [programPath, routeLabel(programPath)])
  },
  '/aktuality': {
    eyebrow: 'Zprávy a veřejné informace',
    heading: 'Aktuality',
    lead:
      'Zveřejňujeme průběžné informace o rozvoji projektu, spolupráci, metodice, datech, programech a příbězích druhé šance. Každá aktualita má vlastní adresu, datum, tematický štítek a dohledatelný zdroj.',
    sections: [
      {
        title: 'Obsah podle principu ONLY TRUE',
        paragraphs: [
          'Ověřená fakta oddělujeme od praktické zkušenosti, návrhu a pracovní hypotézy. Nezveřejňujeme citlivé osobní údaje ani příběhy, které by klienty zneužívaly pro propagaci. Archiv aktualit je členěný podle témat, aby jej mohli snadno procházet lidé, vyhledávače i odborná veřejnost.'
        ]
      }
    ],
    links: [
      ['/pribehy-druhe-sance', 'Příběhy druhé šance'],
      ['/povinne-zverejnovani', 'Data a transparentnost'],
      ['/media', 'Média']
    ]
  },
  '/pribehy-druhe-sance': {
    eyebrow: 'Citlivě a bez bulváru',
    heading: 'Příběhy druhé šance',
    lead:
      'Příběhy ukazují cestu ke změně bez omlouvání minulosti a bez zjednodušování. Citlivé údaje chráníme, zkušenosti jasně označujeme a zveřejňujeme pouze to, co může pomoci porozumět reintegraci.',
    sections: [
      {
        title: 'Minulost není jediný scénář budoucnosti',
        paragraphs: [
          'Druhá šance není smazání minulosti. Je to konkrétní plán, odpovědnost, práce, bydlení, režim a člověk, který pomůže udržet směr v okamžiku, kdy je návrat do běžného života křehký.'
        ]
      }
    ],
    links: storyRoutes.map((story) => [story.path, story.articleHeadline])
  },
  '/pribehy-druhe-sance/story-z-praxe-ne-od-stolu': {
    eyebrow: 'Zakladatelský příběh',
    heading: 'REST||ART vznikl z praxe, ne od stolu',
    lead:
      'Projekt je odpovědí na osobní zkušenost se závislostí, ulicí, výkonem trestu, návratem do práce a budováním stability. Nejde o omluvu minulosti, ale o převod zkušenosti do otevřeného a ověřitelného systému.',
    sections: [
      {
        title: 'Když pomoc nepřichází včas',
        paragraphs: [
          'Cesta vedla přes ztrátu zázemí, bezdomovectví, neúspěšnou léčbu, relaps a šest let výkonu trestu. Ve vězení přišla zkušenost s pomocí ostatním odsouzeným, výukou, dluhy, přípravou na výstup i s limity přetíženého systému.',
          'Po propuštění bez práce a zázemí následoval odchod za prací, splacení dluhů, podnikání a vlastní firma. Právě tehdy vznikla myšlenka propojit práci, bydlení, mentoring, dokumenty, vztahy a následnou stabilizaci do praktické cesty.'
        ]
      },
      {
        title: 'Praxe jako začátek, nikoli jediná autorita',
        paragraphs: [
          'Osobní zkušenost dává projektu schopnost překládat mezi lidmi s trestní minulostí a zaměstnavateli. Metodika se ale musí dále ověřovat, doplňovat odborníky a hodnotit podle skutečných výsledků.'
        ]
      }
    ],
    links: [
      ['/metodika', 'Jak zkušenost převádíme do metodiky'],
      ['/programy/jailbreak', 'Program JAILBREAK']
    ]
  },
  '/pribehy-druhe-sance/story-petr-s-druha-sance': {
    eyebrow: 'Anonymizovaný příběh',
    heading: 'Petr S.: Dopis, ve kterém se člověk nechce vzdát',
    lead:
      'Petr ve svém dopise popisuje cestu přes ústavní péči, ulici, výkon trestu i léčbu. Nehledá výmluvu. Hledá způsob, jak začít žít jinak. Jméno je zkrácené a citlivé detaily zůstávají mimo veřejný prostor.',
    sections: [
      {
        title: 'Život bez pevného zázemí',
        paragraphs: [
          'Petr vyrůstal mimo vlastní rodinu. Postupně přišla ulice, špatná rozhodnutí, trestná činnost, výkon trestu a pokusy o léčbu. Po propuštění se člověk může ocitnout formálně na svobodě, ale prakticky bez bydlení, práce, vztahů, režimu a důvěry.',
          'Nejsilnější část dopisu není popis pádu. Je to rozhodnutí nevzdat se. Program JAILBREAK proto staví na konkrétním plánu, kontaktu, odpovědnosti, práci, bydlení a opoře pro první těžkou chvíli.'
        ]
      },
      {
        title: 'Druhá šance v praxi',
        paragraphs: [
          'Ne každý návrat se povede napoprvé. Každý ale musí někde začít: jedním dopisem, jedním ověřitelným krokem a rozhodnutím, že minulost už nebude jediným scénářem budoucnosti.'
        ]
      }
    ],
    links: [
      ['/programy/jailbreak', 'Program JAILBREAK'],
      ['/pribehy-druhe-sance', 'Další příběhy']
    ]
  },
  '/metodika': {
    eyebrow: 'Veřejný metodický rámec',
    heading: 'Metodika RESTART Integrace',
    lead:
      'Veřejná část metodiky popisuje principy, životní cyklus klienta, programové pilíře, pravidla práce s tvrzeními a dokumenty, které může odborná i široká veřejnost číst, ověřovat a připomínkovat.',
    sections: [
      {
        title: 'Otevřený systém, ne hotové dogma',
        paragraphs: [
          'Metodika převádí praktickou zkušenost do společného jazyka, měřitelných kroků a odpovědností. Manifest, Charta, Slovník pojmů a koncepční podklady mají samostatné veřejné stránky i původní dokumenty ke stažení.',
          'Interní standardy pro tvorbu a správu dokumentů jsou dostupné pouze oprávněným administrátorům. Veřejnost vždy vidí obsah, který vysvětluje fungování programu a umožňuje jeho práci posuzovat.'
        ]
      }
    ],
    links: methodologyDocuments.map((document) => [document.path, document.shortTitle])
  },
  '/povinne-zverejnovani': {
    eyebrow: 'Transparentnost',
    heading: 'Povinné zveřejňování a veřejná data',
    lead:
      'Na jednom místě zpřístupňujeme výroční zprávy, metodické dokumenty, statistické podklady, provozní informace a další soubory určené veřejnosti. Každý dokument má popis, datum, formát a přímý odkaz.',
    sections: [
      {
        title: 'ONLY TRUE',
        paragraphs: [
          'Každé veřejné tvrzení má být podloženo ověřitelnými daty nebo jednoznačně označeno jako odborný názor, praktická zkušenost, návrh či pracovní hypotéza. Zdroje statistických interpretací uvádíme přímo u grafů a textů.',
          'Výsledky programu chceme hodnotit otevřeně. Bezpečnost společnosti a úspěšná reintegrace nejsou protiklady; kvalitní data umožňují sledovat, zda se deklarované cíle skutečně naplňují.'
        ]
      }
    ],
    links: [
      ['/metodika', 'Veřejná metodika'],
      ['/aktuality', 'Aktuality a data'],
      ['/kontakt', 'Vyžádat informace']
    ]
  },
  '/hledame': {
    eyebrow: 'Přidejte se k nám',
    heading: 'Hledáme lidi, kteří spojí odbornost s lidskostí',
    lead:
      'Rozšiřujeme tým pro praktickou podporu lidí na cestě ke stabilitě. Hledáme odborníky i dobrovolníky, kteří dokážou spolupracovat, držet bezpečné hranice a proměnit pomoc v konkrétní kroky.',
    sections: [
      {
        title: 'Odborné role',
        items: [
          'sociální pracovník pro case management, individuální plán a návaznost na služby',
          'adiktolog pro prevenci relapsu, harm reduction a návaznou odbornou péči',
          'psycholog pro konzultace, stabilizaci a podporu při zvládání dlouhodobé zátěže',
          'komunitní pracovník pro každodenní kontakt, aktivity a propojování místní komunity'
        ]
      },
      {
        title: 'Dobrovolnictví',
        paragraphs: [
          'Dobrovolníci se mohou zapojit pravidelně i jednorázově při doučování, doprovázení, administrativě, sbírkách, řemeslných, zahradnických, technických nebo komunitních aktivitách.'
        ]
      }
    ],
    links: [
      ['/kontakt', 'Mám zájem o spolupráci'],
      ['/zapojeni', 'Další možnosti zapojení'],
      ['/co-delame', 'Jak pracujeme']
    ]
  },
  '/kontakt': {
    eyebrow: 'Kontakt',
    heading: 'Spojte se s RESTART Integrace',
    lead:
      'Kontakt je určen lidem hledajícím pomoc, rodinám, zaměstnavatelům, institucím, odborníkům, dobrovolníkům i dárcům. Citlivé osobní údaje neposílejte prostřednictvím veřejných komentářů.',
    sections: [
      {
        title: 'Kontaktní údaje',
        items: [
          'E-mail: restart@dk-i.cz',
          'Telefon: +420 778 564 279',
          'Adresa: Počerady 33, 440 01 Výškov-Louny',
          'Provozovatel: David Kozák International, s.r.o., IČ 23143614'
        ],
        paragraphs: [
          'Podle tématu zprávu předáme odpovědné osobě. V akutním ohrožení zdraví nebo života kontaktujte příslušné tísňové a odborné služby.'
        ]
      }
    ],
    links: [
      ['/zapojeni', 'Možnosti podpory'],
      ['/pro-firmy', 'Spolupráce pro firmy']
    ]
  },
  '/pro-firmy': {
    eyebrow: 'Odpovědné zaměstnávání',
    heading: 'Spolupráce pro firmy',
    lead:
      'RESTART Integrace propojuje zaměstnavatele s lidmi, kteří chtějí pracovat a převzít odpovědnost za svůj další směr. Firma na spolupráci nezůstává sama; součástí je příprava, mentoring a řešení rizik.',
    sections: [
      {
        title: 'Co partnerství může zahrnovat',
        items: [
          'pracovní příležitosti a bezpečný nástup',
          'pracovní trénink, rekvalifikaci nebo odborný mentoring',
          'materiální a technickou podporu komunitního zázemí',
          'sdílení know-how a rozvoj metodiky',
          'měřitelné cíle a otevřené vyhodnocení spolupráce'
        ]
      }
    ],
    links: [
      ['/kontakt', 'Projednat partnerství'],
      ['/programy/rework', 'Program REWORK'],
      ['/zapojeni/vybaveni-centra', 'Vybavení centra']
    ]
  },
  '/media': {
    eyebrow: 'Pro média a partnery',
    heading: 'Média',
    lead:
      'Základní informace, vizuální materiály, veřejná videa a kontakty pro komunikaci o RESTART Integrace. Při práci s příběhy klientů chráníme soukromí a odmítáme bulvární zjednodušení.',
    sections: [
      {
        title: 'Jak o projektu informujeme',
        paragraphs: [
          'RESTART Integrace je vznikající systém pracovní a sociální reintegrace založený na praktické zkušenosti a otevřené odborné spolupráci. Uvádíme, co již funguje, co je ve výstavbě a co je zatím pouze vizí.',
          'Fotografie, videa a dokumenty musí mít dohledatelný původ a popis. Pro rozhovor, ověření tvrzení nebo vyžádání podkladů použijte kontaktní stránku.'
        ]
      }
    ],
    links: [
      ['/videa/predstaveni-projektu', 'Video představení projektu'],
      ['/povinne-zverejnovani', 'Veřejné dokumenty'],
      ['/kontakt', 'Mediální kontakt']
    ]
  },
  '/galerie': {
    eyebrow: 'Fotodokumentace projektu',
    heading: 'Proměna, která je vidět',
    lead:
      'Fotografie zachycují skutečné budování zázemí, společnou práci a konkrétní kroky projektu RESTART Integrace.',
    sections: [
      {
        title: 'Místo, lidé a práce v obrazech',
        paragraphs: [
          'Galerie průběžně dokumentuje, jak se z dostupného materiálu, každodenní práce a spolupráce rodí funkční zázemí pro další kroky projektu.'
        ],
        items: [
          'budování a úpravy zázemí svépomocí',
          'praktická práce a nové využití dostupných věcí',
          'každodenní péče o místo a komunitu'
        ]
      }
    ],
    links: [
      ['/zapojeni', 'Jak se zapojit'],
      ['/aktuality', 'Aktuality projektu'],
      ['/kontakt', 'Kontakt']
    ]
  },
  '/webove-gdpr': {
    eyebrow: 'Soukromí na webu',
    heading: 'Webové GDPR',
    lead:
      'Tato stránka vysvětluje práci s cookies, analytikou, kontaktními formuláři, klientskou zónou a technickými záznamy webu. Nezbytné zpracování oddělujeme od volitelného souhlasu.',
    sections: [
      {
        title: 'Základní pravidla',
        items: [
          'analytické a marketingové ukládání je bez souhlasu vypnuté',
          'formuláře sbírají pouze údaje potřebné pro vyřízení konkrétního požadavku',
          'klientská a administrátorská zóna jsou chráněné a nejsou určeny k indexování',
          'souhlas lze změnit prostřednictvím nastavení cookies'
        ]
      }
    ],
    links: [
      ['/zasady-ochrany-osobnich-udaju', 'Zásady ochrany osobních údajů'],
      ['/kontakt', 'Kontakt na správce']
    ]
  },
  '/zasady-ochrany-osobnich-udaju': {
    eyebrow: 'Ochrana osobních údajů',
    heading: 'Zásady ochrany osobních údajů',
    lead:
      'Osobní údaje zpracováváme pouze pro konkrétní, srozumitelný a oprávněný účel. Zvláštní pozornost věnujeme citlivým situacím klientů, příběhům druhé šance a zabezpečení neveřejných zón.',
    sections: [
      {
        title: 'Práva a odpovědnost',
        paragraphs: [
          'Subjekt údajů může podle příslušných podmínek požadovat přístup, opravu, výmaz, omezení zpracování, přenositelnost nebo vznést námitku. Údaje nepoužíváme k jinému účelu bez odpovídajícího právního základu.',
          'Správcem souvisejících webových zpracování je provozovatel projektu. Dotazy a žádosti lze zaslat prostřednictvím kontaktních údajů uvedených na webu.'
        ]
      }
    ],
    links: [
      ['/webove-gdpr', 'Cookies a webové formuláře'],
      ['/kontakt', 'Kontakt na správce']
    ]
  }
};

function renderRouteSnapshot(route) {
  const program = programSnapshotContent[route.path];
  const content = program
    ? {
        eyebrow: 'Program RESTART Integrace',
        heading: routeLabel(route.path),
        lead: program.purpose,
        sections: [
          {
            title: 'Pro koho je program určen',
            paragraphs: [program.audience]
          },
          {
            title: 'Co program propojuje',
            items: program.items,
            paragraphs: [
              'Konkrétní rozsah podpory vždy vychází ze vstupního posouzení, individuálního plánu, dostupných kapacit a souhlasu klienta. Výsledky průběžně vyhodnocujeme.'
            ]
          }
        ],
        links: [
          ['/programy', 'Všechny programy'],
          ['/kontakt', 'Kontaktovat projekt'],
          ['/metodika', 'Metodický rámec']
        ]
      }
    : routeSnapshotContent[route.path];

  if (!content) {
    return `<main class="seo-route-snapshot" data-seo-snapshot="public-route">
      <header>
        <p class="section-label">${escapeHtml(routeLabel(route.path))}</p>
        <h1>${escapeHtml(routeLabel(route.path))}</h1>
        <p>${escapeHtml(route.description)}</p>
      </header>
      <section>
        <h2>RESTART Integrace</h2>
        <p>Oficiální veřejná stránka projektu RESTART Integrace. Obsah je součástí systému druhých šancí založeného na odpovědnosti, práci, mentoringu, stabilizaci a ověřitelných výsledcích.</p>
      </section>
      <nav aria-label="Související stránky">
        <a href="/">Úvod</a>
        <a href="/programy">Programy</a>
        <a href="/kontakt">Kontakt</a>
      </nav>
    </main>`;
  }

  return `<main class="seo-route-snapshot" data-seo-snapshot="public-route">
    <header>
      <p class="section-label">${escapeHtml(content.eyebrow)}</p>
      <h1>${escapeHtml(content.heading)}</h1>
      <p>${escapeHtml(content.lead)}</p>
    </header>
    ${content.sections
      .map(
        (section) => `<section>
      <h2>${escapeHtml(section.title)}</h2>
      ${(section.paragraphs || []).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('\n      ')}
      ${
        section.items?.length
          ? `<ul>${section.items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
          : ''
      }
    </section>`
      )
      .join('\n    ')}
    ${
      content.links?.length
        ? `<nav aria-label="Související stránky">
      ${content.links
        .map(([href, label]) => `<a href="${escapeHtml(href)}">${escapeHtml(label)}</a>`)
        .join('\n      ')}
    </nav>`
        : ''
    }
  </main>`;
}

function breadcrumbGraph(route) {
  const parts = route.path === '/' ? [] : route.path.split('/').filter(Boolean);
  const crumbs = [{ path: '/', name: routeLabel('/') }];
  let current = '';
  for (const part of parts) {
    current += `/${part}`;
    crumbs.push({ path: current, name: routeLabel(current) });
  }
  return {
    '@type': 'BreadcrumbList',
    '@id': `${routeUrl(route.path)}#breadcrumb`,
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: routeUrl(crumb.path)
    }))
  };
}

function articleGraph(route, canonical, image) {
  const story = storyRoutes.find((item) => item.path === route.path);
  if (story) {
    return [
      {
        '@type': 'Article',
        '@id': `${canonical}#article-${story.id}`,
        headline: story.articleHeadline,
        description: story.description,
        image,
        datePublished: story.datePublished,
        dateModified: today,
        inLanguage: 'cs-CZ',
        articleSection: 'Příběhy druhé šance',
        author: {
          '@id': `${baseUrl}/#organization`
        },
        publisher: {
          '@id': `${baseUrl}/#organization`
        },
        mainEntityOfPage: {
          '@id': `${canonical}#webpage`
        }
      }
    ];
  }
  const methodologyDocument = methodologyDocuments.find((item) => item.id === route.methodologyDocumentId);
  if (methodologyDocument) {
    return [
      {
        '@type': 'Article',
        '@id': `${canonical}#article-${methodologyDocument.id}`,
        headline: methodologyDocument.title,
        description: methodologyDocument.description,
        image,
        datePublished: methodologyDocument.published,
        dateModified: today,
        inLanguage: 'cs-CZ',
        articleSection: 'Metodika a veřejné dokumenty',
        keywords: methodologyDocument.keywords,
        author: {
          '@id': `${baseUrl}/#organization`
        },
        publisher: {
          '@id': `${baseUrl}/#organization`
        },
        mainEntityOfPage: {
          '@id': `${canonical}#webpage`
        }
      }
    ];
  }
  if (!['/aktuality', '/pribehy-druhe-sance'].includes(route.path)) return [];
  return [
    {
      '@type': 'Article',
      '@id': `${canonical}#article-pribehy-druhe-sance`,
      headline: 'Příběhy druhé šance',
      description:
        'Citlivě zpracované anonymizované příběhy lidí, kteří se s podporou projektu RESTART Integrace vracejí do běžného života.',
      image,
      datePublished: '2026-06-24',
      dateModified: today,
      inLanguage: 'cs-CZ',
      author: {
        '@id': `${baseUrl}/#organization`
      },
      publisher: {
        '@id': `${baseUrl}/#organization`
      },
      mainEntityOfPage: {
        '@id': `${canonical}#webpage`
      }
    }
  ];
}

function routeSpecificGraph(route, canonical) {
  const methodologyDocument = methodologyDocuments.find((item) => item.id === route.methodologyDocumentId);
  if (methodologyDocument) {
    const definitions = methodologyDocument.sections.flatMap((section) =>
      section.blocks.flatMap((block) => (block.type === 'definitions' ? block.items : []))
    );
    if (definitions.length > 0) {
      return [
        {
          '@type': 'DefinedTermSet',
          '@id': `${canonical}#defined-term-set`,
          name: methodologyDocument.title,
          description: methodologyDocument.description,
          url: canonical,
          inLanguage: 'cs-CZ',
          hasDefinedTerm: definitions.map((item) => ({
            '@type': 'DefinedTerm',
            name: item.term,
            description: item.definition,
            inDefinedTermSet: `${canonical}#defined-term-set`
          }))
        }
      ];
    }
    return [];
  }
  if (route.path === '/programy/streetwise') {
    return [
      {
        '@type': 'Service',
        '@id': `${canonical}#service-streetwise`,
        name: 'STREETWISE',
        alternateName: ['Program STREETWISE', 'STREETWISE - první bezpečný krok'],
        description:
          'STREETWISE je program RESTART Integrace pro první dostupný kontakt, praktickou pomoc, režim, odpovědnost a cestu od akutní nouze ke stabilizaci.',
        serviceType: 'Nízkoprahová podpora a sociální stabilizace',
        provider: {
          '@id': `${baseUrl}/#organization`
        },
        areaServed: {
          '@type': 'Country',
          name: 'Česká republika'
        },
        audience: {
          '@type': 'Audience',
          audienceType: 'Lidé bez stabilního zázemí, lidé mimo dosah systému a osoby ohrožené sociálním vyloučením'
        },
        image: {
          '@id': `${baseUrl}/images/program-pillars/streetwise-program-vizual.webp#image`
        },
        mainEntityOfPage: {
          '@id': `${canonical}#webpage`
        }
      },
      {
        '@type': 'ImageObject',
        '@id': `${baseUrl}/images/program-pillars/streetwise-program-vizual.webp#image`,
        contentUrl: `${baseUrl}/images/program-pillars/streetwise-program-vizual.webp`,
        name: 'STREETWISE: dovednosti, disciplína, důstojnost a nový směr',
        caption:
          'Vizuál programu STREETWISE s principy praktických dovedností, režimu, odpovědnosti, postupných kroků a skutečné druhé šance.',
        encodingFormat: 'image/webp',
        width: 1280,
        height: 1280,
        inLanguage: 'cs-CZ',
        representativeOfPage: true
      }
    ];
  }
  if (route.path === '/metodika') {
    return [
      {
        '@type': 'ImageObject',
        '@id': `${baseUrl}/images/methodology/vizualni-model-rest-art-integrace.webp#image`,
        contentUrl: `${baseUrl}/images/methodology/vizualni-model-rest-art-integrace.webp`,
        name: 'Vizuální model systému REST ART Integrace',
        caption:
          'Diagram metodického toku, spolupracující sítě a společného výsledku systému REST ART Integrace.',
        encodingFormat: 'image/webp',
        width: 1168,
        height: 576,
        inLanguage: 'cs-CZ',
        representativeOfPage: true
      }
    ];
  }
  if (route.path !== '/programy/jailbreak') return [];
  return [
    {
      '@type': 'Service',
      '@id': `${canonical}#service-jailbreak`,
      name: 'JAILBREAK',
      alternateName: ['Program JAILBREAK', 'JAILBREAK - druhá šance po výkonu trestu'],
      description:
        'JAILBREAK je program RESTART Integrace pro přípravu a stabilizaci lidí po výkonu trestu: mentoring, korespondence, plán návratu, práce, bydlení, vztahy a následná opora po propuštění.',
      serviceType: 'Sociální reintegrace a postpenitenciární podpora',
      provider: {
        '@id': `${baseUrl}/#organization`
      },
      areaServed: {
        '@type': 'Country',
        name: 'Česká republika'
      },
      audience: {
        '@type': 'Audience',
        audienceType: 'Osoby po výkonu trestu, osoby ve výkonu trestu připravující návrat, lidé v sociálním vyloučení'
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Podpora programu JAILBREAK',
        itemListElement: [
          'mentoring',
          'korespondence a návštěvy',
          'plán návratu po výkonu trestu',
          'pracovní návaznost',
          'bydlení a stabilizace',
          'podpora rodinných vztahů',
          'follow-up po propuštění'
        ].map((name, index) => ({
          '@type': 'Offer',
          position: index + 1,
          itemOffered: {
            '@type': 'Service',
            name
          }
        }))
      },
      mainEntityOfPage: {
        '@id': `${canonical}#webpage`
      }
    },
    {
      '@type': 'Article',
      '@id': `${canonical}#article-jailbreak`,
      headline: 'JAILBREAK: návrat po výkonu trestu a druhá šance v praxi',
      description: route.description,
      image: routeOgImage(route),
      datePublished: '2026-06-19',
      dateModified: today,
      inLanguage: 'cs-CZ',
      author: {
        '@id': `${baseUrl}/#organization`
      },
      publisher: {
        '@id': `${baseUrl}/#organization`
      },
      mainEntityOfPage: {
        '@id': `${canonical}#webpage`
      }
    }
  ];
}

function replaceTag(html, pattern, replacement) {
  return pattern.test(html) ? html.replace(pattern, replacement) : html;
}

function ensureGoogleTag(html) {
  if (html.includes(googleTagId)) return html;
  return html.replace(/<head>/, `<head>\n${googleConsentSnippet}`);
}

function deferRenderBlockingCss(html) {
  const withCriticalCss = html.includes('data-critical-css')
    ? html
    : html.replace('</head>', `    <style data-critical-css>\n${criticalCss}\n    </style>\n  </head>`);

  return withCriticalCss.replace(
    /<link\s+rel="stylesheet"\s+([^>]*href="([^"]+)"[^>]*)>/g,
    (match, attrs, href) => {
      if (!href.includes('/assets/')) return match;
      const crossorigin = /\bcrossorigin\b/i.test(attrs) ? ' crossorigin' : '';
      return `<link rel="preload" href="${href}" as="style"${crossorigin} onload="this.onload=null;this.rel='stylesheet'" /><noscript><link rel="stylesheet" href="${href}"${crossorigin} /></noscript>`;
    }
  );
}

function structuredData(route, canonical) {
  const routeVideos = videoAssets.filter((video) => video.watchPath === route.path);
  const currentOgImage = routeOgImage(route);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        name: officialName,
        alternateName: alternateNames,
        url: `${baseUrl}/`,
        logo: `${baseUrl}/images/brand/restart-integrace-full-logo.png`,
        image: currentOgImage,
        description:
          'RESTART Integrace (REST||ART) je oficiální projekt druhých šancí zaměřený na stabilizaci, práci, bydlení a důstojný návrat do společnosti.',
        foundingDate: '2025-05-06',
        email: 'restart@dk-i.cz',
        telephone: '+420778564279',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Počerady 33',
          postalCode: '440 01',
          addressLocality: 'Výškov-Louny',
          addressCountry: 'CZ'
        },
        parentOrganization: {
          '@type': 'Organization',
          name: 'David Kozák International, s.r.o.'
        }
      },
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        url: `${baseUrl}/`,
        name: officialName,
        alternateName: alternateNames,
        inLanguage: 'cs-CZ',
        publisher: {
          '@id': `${baseUrl}/#organization`
        }
      },
      {
        '@type': 'WebPage',
        '@id': `${canonical}#webpage`,
        url: canonical,
        name: route.title,
        description: route.description,
        inLanguage: 'cs-CZ',
        isPartOf: {
          '@id': `${baseUrl}/#website`
        },
        about: {
          '@id': `${baseUrl}/#organization`
        },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: currentOgImage,
          width: 1200,
          height: 630
        },
        dateModified: today,
        keywords: route.noindex ? undefined : route.keywords || defaultKeywords
      },
      breadcrumbGraph(route),
      ...articleGraph(route, canonical, currentOgImage),
      ...routeSpecificGraph(route, canonical),
      ...routeVideos.map((video) => ({
        '@type': 'VideoObject',
        '@id': `${video.contentUrl}#video`,
        name: video.name,
        description: video.description,
        thumbnailUrl: [video.thumbnailUrl],
        uploadDate: video.uploadDate,
        duration: video.duration,
        contentUrl: video.contentUrl,
        width: video.width,
        height: video.height,
        inLanguage: 'cs-CZ',
        isFamilyFriendly: video.familyFriendly,
        isAccessibleForFree: true,
        mainEntityOfPage: {
          '@id': `${canonical}#webpage`
        },
        publisher: {
          '@id': `${baseUrl}/#organization`
        }
      }))
    ]
  };
}

function renderMethodologyDocumentSnapshot(document) {
  const renderBlock = (block) => {
    if (block.type === 'paragraph') return `<p>${escapeHtml(block.text)}</p>`;
    if (block.type === 'heading') return `<h3>${escapeHtml(block.text)}</h3>`;
    if (block.type === 'quote') return `<blockquote><p>${escapeHtml(block.text)}</p></blockquote>`;
    if (block.type === 'list') {
      return `<ul>${block.items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
    }
    if (block.type === 'definitions') {
      return `<dl>${block.items
        .map((item) => `<div><dt>${escapeHtml(item.term)}</dt><dd>${escapeHtml(item.definition)}</dd></div>`)
        .join('')}</dl>`;
    }
    return '';
  };

  return `<main class="seo-document-snapshot" data-seo-snapshot="methodology-document">
    <header>
      <p class="section-label">${escapeHtml(document.eyebrow)}</p>
      <h1>${escapeHtml(document.title)}</h1>
      <p>${escapeHtml(document.lead)}</p>
      <p><strong>${escapeHtml(document.version)}</strong> · ${escapeHtml(document.status)} · zveřejněno ${escapeHtml(
        document.published
      )}</p>
      <a class="seo-document-snapshot-download" href="${escapeHtml(document.downloadDocx)}" download>Stáhnout původní dokument DOCX</a>
    </header>
    <article>
      ${document.sections
        .map(
          (section) => `<section id="${escapeHtml(section.id)}">
        <h2>${escapeHtml(section.title)}</h2>
        ${section.blocks.map(renderBlock).join('\n        ')}
      </section>`
        )
        .join('\n      ')}
    </article>
  </main>`;
}

function renderVideoWatchSnapshot(video) {
  return `<main class="seo-video-watch-snapshot" data-seo-snapshot="video-watch-page">
    <header>
      <p class="section-label">Oficiální video projektu</p>
      <h1>${escapeHtml(video.name)}</h1>
      <p>${escapeHtml(video.description)}</p>
    </header>
    <video controls preload="metadata" poster="${escapeHtml(video.thumbnailUrl)}" width="${video.width}" height="${
      video.height
    }" aria-label="${escapeHtml(video.name)}">
      <source src="${escapeHtml(video.contentUrl)}" type="video/mp4" />
      Váš prohlížeč neumí přehrát toto video.
    </video>
    <footer>
      <p>Video je součástí veřejné prezentace projektu RESTART Integrace.</p>
      <a href="/">Zpět na úvod projektu</a>
    </footer>
  </main>`;
}

function renderSupportSnapshot(route) {
  const supportLinks = [
    ['/zapojeni', 'Přehled podpory'],
    ['/zapojeni/darovat-obleceni', 'Darovat oblečení'],
    ['/zapojeni/vybaveni-centra', 'Vybavení centra'],
    ['/zapojeni/sbirka-knih', 'Sbírka knih'],
    ['/darovat', 'Finanční dary']
  ];
  return `<main class="seo-route-snapshot seo-support-snapshot" data-seo-snapshot="support-page">
    <header>
      <p class="section-label">Zapojení a podpora</p>
      <h1>${escapeHtml(routeLabel(route.path))}</h1>
      <p>${escapeHtml(route.description)}</p>
    </header>
    <nav aria-label="Možnosti podpory">
      ${supportLinks
        .map(([href, label]) => `<a href="${escapeHtml(href)}">${escapeHtml(label)}</a>`)
        .join('\n      ')}
    </nav>
    <p>Každou materiální nabídku předem konzultujeme, aby odpovídala skutečné potřebě a možnostem převzetí.</p>
    <a href="/kontakt">Kontaktovat projekt RESTART Integrace</a>
  </main>`;
}

function renderRoute(route) {
  const canonical = routeUrl(route.path);
  const currentOgImage = routeOgImage(route);
  const currentVideo = videoAssets.find((video) => video.id === route.videoId);
  let html = template;
  html = replaceTag(html, /<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(route.title)}</title>`);
  html = replaceTag(
    html,
    /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
    `<meta name="description" content="${escapeHtml(route.description)}" />`
  );
  html = replaceTag(
    html,
    /<meta\s+name="robots"\s+content="[^"]*"\s*\/>/,
    `<meta name="robots" content="${route.noindex ? 'noindex, nofollow, noarchive' : defaultRobots}" />`
  );
  html = replaceTag(
    html,
    /<meta\s+name="keywords"\s+content="[^"]*"\s*\/>/,
    `<meta name="keywords" content="${escapeHtml(route.keywords || defaultKeywords)}" />`
  );
  html = replaceTag(html, /<meta\s+name="application-name"\s+content="[^"]*"\s*\/>/, `<meta name="application-name" content="${officialName}" />`);
  html = replaceTag(
    html,
    /<meta\s+name="apple-mobile-web-app-title"\s+content="[^"]*"\s*\/>/,
    `<meta name="apple-mobile-web-app-title" content="${officialName}" />`
  );
  html = replaceTag(html, /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/, `<link rel="canonical" href="${canonical}" />`);
  html = replaceTag(html, /<meta\s+property="og:site_name"\s+content="[^"]*"\s*\/>/, `<meta property="og:site_name" content="${officialName}" />`);
  html = replaceTag(
    html,
    /<meta\s+property="og:type"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:type" content="${currentVideo ? 'video.other' : 'website'}" />`
  );
  html = replaceTag(html, /<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/, `<meta property="og:title" content="${escapeHtml(route.title)}" />`);
  html = replaceTag(
    html,
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:description" content="${escapeHtml(route.description)}" />`
  );
  html = replaceTag(html, /<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/, `<meta property="og:url" content="${canonical}" />`);
  html = replaceTag(html, /<meta\s+property="og:image"\s+content="[^"]*"\s*\/>/, `<meta property="og:image" content="${currentOgImage}" />`);
  html = replaceTag(
    html,
    /<meta\s+property="og:image:secure_url"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:image:secure_url" content="${currentOgImage}" />`
  );
  html = replaceTag(
    html,
    /<meta\s+property="og:image:alt"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:image:alt" content="${escapeHtml(route.title)}" />`
  );
  html = replaceTag(html, /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/>/, `<meta name="twitter:title" content="${escapeHtml(route.title)}" />`);
  html = replaceTag(
    html,
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:description" content="${escapeHtml(route.description)}" />`
  );
  html = replaceTag(html, /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/>/, `<meta name="twitter:image" content="${currentOgImage}" />`);
  html = replaceTag(
    html,
    /<meta\s+name="twitter:image:alt"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:image:alt" content="${escapeHtml(route.title)}" />`
  );
  html = html.replace(
    /<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/,
    `<script type="application/ld+json">\n${JSON.stringify(structuredData(route, canonical), null, 6)}\n    </script>`
  );
  if (currentVideo) {
    html = html.replace(
      '</head>',
      `    <meta property="og:video" content="${currentVideo.contentUrl}" />
    <meta property="og:video:secure_url" content="${currentVideo.contentUrl}" />
    <meta property="og:video:type" content="video/mp4" />
    <meta property="og:video:width" content="${currentVideo.width}" />
    <meta property="og:video:height" content="${currentVideo.height}" />
  </head>`
    );
  }
  const methodologyDocument = methodologyDocuments.find((item) => item.id === route.methodologyDocumentId);
  if (methodologyDocument) {
    html = html.replace('<div id="root"></div>', `<div id="root">${renderMethodologyDocumentSnapshot(methodologyDocument)}</div>`);
  } else if (currentVideo) {
    html = html.replace('<div id="root"></div>', `<div id="root">${renderVideoWatchSnapshot(currentVideo)}</div>`);
  } else if (route.path === '/zapojeni' || route.path.startsWith('/zapojeni/') || route.path === '/darovat') {
    html = html.replace('<div id="root"></div>', `<div id="root">${renderSupportSnapshot(route)}</div>`);
  } else {
    html = html.replace('<div id="root"></div>', `<div id="root">${renderRouteSnapshot(route)}</div>`);
  }
  return ensureGoogleTag(deferRenderBlockingCss(html));
}

function outputPath(routePath) {
  if (routePath === '/') return indexPath;
  return path.join(distDir, routePath.replace(/^\//, ''), 'index.html');
}

for (const route of routes) {
  const filePath = outputPath(route.path);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, renderRoute(route));
}

const sitemapRoutes = routes.filter((route) => !route.noindex);
const programSitemapRoutes = sitemapRoutes.filter((route) => route.path === '/programy' || route.path.startsWith('/programy/'));
const storySitemapRoutes = sitemapRoutes.filter(
  (route) => route.path === '/aktuality' || route.path === '/pribehy-druhe-sance' || route.path.startsWith('/pribehy-druhe-sance/')
);
const donateSitemapRoutes = sitemapRoutes.filter(
  (route) => route.path === '/zapojeni' || route.path.startsWith('/zapojeni/') || route.path === '/darovat'
);
const methodologySitemapRoutes = sitemapRoutes.filter(
  (route) => route.path === '/metodika' || route.path.startsWith('/metodika/')
);
const videoWatchSitemapRoutes = sitemapRoutes.filter((route) => route.path.startsWith('/videa/'));
const pageSitemapRoutes = sitemapRoutes.filter(
  (route) =>
    !programSitemapRoutes.includes(route) &&
    !storySitemapRoutes.includes(route) &&
    !donateSitemapRoutes.includes(route) &&
    !methodologySitemapRoutes.includes(route) &&
    !videoWatchSitemapRoutes.includes(route)
);

function renderRouteSitemap(routeList) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routeList
  .map(
    (route) => `  <url>
    <loc>${routeUrl(route.path)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq || 'monthly'}</changefreq>
    <priority>${route.priority || '0.5'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;
}

function collectPublicFiles(relativeDir, extensions, exclude = () => false) {
  const root = path.join(distDir, relativeDir);
  if (!fs.existsSync(root)) return [];
  const output = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
        continue;
      }
      const ext = path.extname(entry.name).toLowerCase();
      const publicPath = `/${path.relative(distDir, fullPath).replace(/\\/g, '/')}`;
      if (extensions.includes(ext) && !exclude(publicPath)) {
        output.push({
          loc: `${baseUrl}${encodeURI(publicPath)}`,
          lastmod: today,
          changefreq: 'monthly',
          priority: '0.45'
        });
      }
    }
  };
  walk(root);
  return output.sort((left, right) => left.loc.localeCompare(right.loc));
}

function uniqueEntries(entries) {
  const seen = new Set();
  return entries.filter((entry) => {
    if (seen.has(entry.loc)) return false;
    seen.add(entry.loc);
    return true;
  });
}

function renderFileSitemap(entries) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uniqueEntries(entries)
  .map((entry) => `  <url>
    <loc>${escapeXml(entry.loc)}</loc>
  </url>`)
  .join('\n')}
</urlset>
`;
}

function preferredImageEntries(entries) {
  const preferred = new Map();
  const priority = { '.webp': 4, '.avif': 3, '.jpg': 2, '.jpeg': 2, '.png': 1 };

  for (const entry of entries) {
    const url = new URL(entry.loc);
    const extension = path.extname(url.pathname).toLowerCase();
    if (!priority[extension]) continue;
    const key = url.pathname.slice(0, -extension.length).toLowerCase();
    const current = preferred.get(key);
    if (!current || priority[extension] > priority[path.extname(new URL(current.loc).pathname).toLowerCase()]) {
      preferred.set(key, entry);
    }
  }

  return Array.from(preferred.values());
}

function renderImageSitemap(groups) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${groups
  .filter((group) => group.images.length > 0)
  .map(
    (group) => `  <url>
    <loc>${escapeXml(`${baseUrl}${group.path}`)}</loc>
${group.images
  .map(
    (entry) => `    <image:image>
      <image:loc>${escapeXml(entry.loc)}</image:loc>
    </image:image>`
  )
  .join('\n')}
  </url>`
  )
  .join('\n')}
</urlset>
`;
}

const documentEntries = uniqueEntries([
  {
    loc: `${baseUrl}/documents/methodology/metodika-restart-integrace.pdf`,
    lastmod: today,
    changefreq: 'monthly',
    priority: '0.65'
  },
  ...collectPublicFiles('documents/transparency', ['.pdf']),
  ...collectPublicFiles('documents/media', ['.pdf'])
]);

const mediaEntries = uniqueEntries([
  ...collectPublicFiles('images/media', ['.png', '.jpg', '.jpeg', '.webp'], (publicPath) => publicPath.includes('/internal/')),
  ...collectPublicFiles('images/crops', ['.png', '.jpg', '.jpeg', '.webp']),
  ...collectPublicFiles('images/program-pillars', ['.png', '.jpg', '.jpeg', '.webp']),
  ...collectPublicFiles('images/methodology', ['.png', '.jpg', '.jpeg', '.webp']),
  ...collectPublicFiles('images/statistics', ['.png', '.jpg', '.jpeg', '.webp']),
  ...collectPublicFiles('images/og', ['.png', '.jpg', '.jpeg', '.webp'])
]);
const preferredMediaImages = preferredImageEntries(mediaEntries);
const mediaImageGroups = [
  {
    path: '/',
    images: preferredMediaImages.filter(
      (entry) =>
        entry.loc.includes('/images/crops/camera-202607/') ||
        entry.loc.includes('/images/crops/new-photos/') ||
        entry.loc.includes('/images/crops/roses-20260608/') ||
        entry.loc.endsWith('/images/og/restart-integrace-homepage-1200x630.png') ||
        entry.loc.endsWith('/images/og/restart-integrace-og-1200x630.png')
    )
  },
  {
    path: '/galerie',
    images: preferredMediaImages.filter(
      (entry) =>
        entry.loc.includes('/images/crops/camera-202607/') ||
        entry.loc.includes('/images/crops/new-photos/') ||
        entry.loc.includes('/images/crops/roses-20260608/')
    )
  },
  {
    path: '/programy/streetwise',
    images: preferredMediaImages.filter(
      (entry) =>
        entry.loc.includes('/images/crops/streetwise/') ||
        entry.loc.endsWith('/images/program-pillars/streetwise-program-vizual.webp')
    )
  },
  {
    path: '/metodika',
    images: preferredMediaImages.filter((entry) =>
      entry.loc.endsWith('/images/methodology/vizualni-model-rest-art-integrace.webp')
    )
  },
  {
    path: '/povinne-zverejnovani',
    images: preferredMediaImages.filter(
      (entry) =>
        entry.loc.includes('/images/statistics/') ||
        entry.loc.endsWith('/images/og/restart-integrace-povinne-zverejnovani-1200x630.png')
    )
  },
  {
    path: '/pribehy-druhe-sance',
    images: preferredMediaImages.filter((entry) =>
      entry.loc.endsWith('/images/og/restart-integrace-pribehy-1200x630.png')
    )
  },
  {
    path: '/zapojeni',
    images: preferredMediaImages.filter((entry) =>
      entry.loc.endsWith('/images/og/restart-integrace-zapojeni-1200x630.png')
    )
  },
  {
    path: '/media',
    images: preferredMediaImages.filter((entry) => entry.loc.includes('/images/media/'))
  }
];

const sitemapPages = renderRouteSitemap(pageSitemapRoutes);
const sitemapPrograms = renderRouteSitemap(programSitemapRoutes);
const sitemapStories = renderRouteSitemap(storySitemapRoutes);
const sitemapDonate = renderRouteSitemap(donateSitemapRoutes);
const sitemapMethodology = renderRouteSitemap(methodologySitemapRoutes);
const sitemapDocuments = renderFileSitemap(documentEntries);
const sitemapMedia = renderImageSitemap(mediaImageGroups);

const sitemapVideos = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${videoAssets
  .map(
    (video) => `  <url>
    <loc>${routeUrl(video.watchPath)}</loc>
    <video:video>
      <video:thumbnail_loc>${escapeXml(video.thumbnailUrl)}</video:thumbnail_loc>
      <video:title>${escapeXml(video.name)}</video:title>
      <video:description>${escapeXml(video.description)}</video:description>
      <video:content_loc>${escapeXml(video.contentUrl)}</video:content_loc>
      <video:publication_date>${video.uploadDate}</video:publication_date>
      <video:duration>${video.durationSeconds}</video:duration>
      <video:family_friendly>${video.familyFriendly ? 'yes' : 'no'}</video:family_friendly>
    </video:video>
  </url>`
  )
  .join('\n')}
</urlset>
`;

const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap-pages.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-programs.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-stories.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-news.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-documents.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-methodology.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-media.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-donate.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-videos.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>
`;

fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapIndex);
fs.writeFileSync(path.join(distDir, 'sitemap-pages.xml'), sitemapPages);
fs.writeFileSync(path.join(distDir, 'sitemap-programs.xml'), sitemapPrograms);
fs.writeFileSync(path.join(distDir, 'sitemap-stories.xml'), sitemapStories);
fs.writeFileSync(path.join(distDir, 'sitemap-documents.xml'), sitemapDocuments);
fs.writeFileSync(path.join(distDir, 'sitemap-methodology.xml'), sitemapMethodology);
fs.writeFileSync(path.join(distDir, 'sitemap-media.xml'), sitemapMedia);
fs.writeFileSync(path.join(distDir, 'sitemap-donate.xml'), sitemapDonate);
fs.writeFileSync(path.join(distDir, 'sitemap-videos.xml'), sitemapVideos);
console.log(
  `Prerendered SEO HTML for ${routes.length} routes. Sitemap segments: pages=${pageSitemapRoutes.length}, programs=${programSitemapRoutes.length}, stories=${storySitemapRoutes.length}, methodology=${methodologySitemapRoutes.length}, documents=${documentEntries.length}, media=${mediaEntries.length}, donate=${donateSitemapRoutes.length}, videos=${videoWatchSitemapRoutes.length}.`
);


