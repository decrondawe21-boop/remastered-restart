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
    uploadDate: '2026-06-23',
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
    uploadDate: '2026-06-23',
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
    '/zapojeni': 'Zapojení',
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
  return `<main class="seo-support-snapshot" data-seo-snapshot="support-page">
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
  .map(
    (entry) => `  <url>
    <loc>${escapeXml(entry.loc)}</loc>
    <lastmod>${entry.lastmod || today}</lastmod>
    <changefreq>${entry.changefreq || 'monthly'}</changefreq>
    <priority>${entry.priority || '0.4'}</priority>
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
  ...collectPublicFiles('images/statistics', ['.png', '.jpg', '.jpeg', '.webp']),
  ...collectPublicFiles('images/og', ['.png', '.jpg', '.jpeg', '.webp']),
  ...collectPublicFiles('videos', ['.mp4', '.webm', '.webp', '.png'], (publicPath) => publicPath.includes('rest-art-logo-reveal-standard'))
]);

const sitemapPages = renderRouteSitemap(pageSitemapRoutes);
const sitemapPrograms = renderRouteSitemap(programSitemapRoutes);
const sitemapStories = renderRouteSitemap(storySitemapRoutes);
const sitemapDonate = renderRouteSitemap(donateSitemapRoutes);
const sitemapMethodology = renderRouteSitemap(methodologySitemapRoutes);
const sitemapDocuments = renderFileSitemap(documentEntries);
const sitemapMedia = renderFileSitemap(mediaEntries);

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


