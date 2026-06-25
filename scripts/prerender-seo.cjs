const fs = require('node:fs');
const path = require('node:path');

const baseUrl = 'https://restartintegrace.dk-i.cz';
const ogImage = `${baseUrl}/images/og/restart-integrace-homepage-1200x630.png`;
const routeOgImages = {
  '/': `${baseUrl}/images/og/restart-integrace-homepage-1200x630.png`,
  '/zapojeni': `${baseUrl}/images/og/restart-integrace-zapojeni-1200x630.png`,
  '/povinne-zverejnovani': `${baseUrl}/images/og/restart-integrace-povinne-zverejnovani-1200x630.png`,
  '/aktuality': `${baseUrl}/images/og/restart-integrace-pribehy-1200x630.png`
};
const today = new Date().toISOString().slice(0, 10);
const officialName = 'RESTART Integrace';
const styledName = 'REST||ART Integrace';
const alternateNames = [styledName, 'REST ART Integrace', 'Restart Integrace', 'RESTARTINTEGRACE'];
const defaultRobots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
const defaultKeywords =
  'RESTART Integrace, REST||ART Integrace, Restart Integrace, oficiální web RESTART Integrace, druhá šance, sociální integrace, mentoring, práce, bydlení, stabilizace, JAILBREAK, RESET, REWORK';
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
@media(max-width:760px){.site-header{padding:12px 18px}.brand img{width:174px}.desktop-nav{display:none}.menu-button{display:inline-flex}.hero{padding:18px}.hero-banner{min-height:520px;border-radius:22px}.hero-banner-overlay{padding:28px}.hero-banner-overlay h1{font-size:clamp(2.6rem,16vw,4.5rem)}}
`.trim();
const videoAssets = [
  {
    routes: ['/'],
    name: 'RESTART Integrace - krátké představení projektu',
    description:
      'Krátké video představující RESTART Integrace jako projekt druhých šancí, praktické podpory a návratu lidí do života.',
    thumbnailUrl: `${baseUrl}/images/video/rest-art-intro-preview-strip-v1.jpg`,
    contentUrl: `${baseUrl}/videos/rest-art-intro-z-podkladu-v1-720p.mp4`,
    embedUrl: `${baseUrl}/#projektove-video`,
    uploadDate: '2026-06-23',
    familyFriendly: true
  },
  {
    routes: ['/'],
    name: 'RESTART Integrace - logo reveal',
    description: 'Logo animace RESTART Integrace pro veřejnou prezentaci projektu druhých šancí.',
    thumbnailUrl: `${baseUrl}/videos/restart-logo-reveal-poster.webp`,
    contentUrl: `${baseUrl}/videos/restart-logo-reveal.mp4`,
    embedUrl: `${baseUrl}/#projektove-video`,
    uploadDate: '2026-06-23',
    familyFriendly: true
  }
];

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
    title: 'JAILBREAK | Návrat po výkonu trestu',
    description:
      'JAILBREAK pomáhá lidem po výkonu trestu vytvořit plán návratu, práci, režim, vztahy a stabilní každodenní strukturu.',
    priority: '0.8',
    changefreq: 'monthly'
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
    path: '/zapojeni',
    title: 'Zapojení a podpora | RESTART Integrace',
    description:
      'Zapojte se do RESTART Integrace jako partner, dobrovolník nebo dárce. Podpora pomáhá pokrýt mentoring, materiály, práci a zázemí.',
    priority: '0.7',
    changefreq: 'monthly'
  },
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
    '/povinne-zverejnovani': 'Povinné zveřejňování',
    '/kontakt': 'Kontakt',
    '/pro-firmy': 'Pro firmy',
    '/media': 'Média',
    '/webove-gdpr': 'Webové GDPR',
    '/zasady-ochrany-osobnich-udaju': 'Zásady ochrany osobních údajů',
    '/klient': 'Klientská zóna',
    '/admin': 'Administrace'
  };
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
  if (route.path !== '/aktuality') return [];
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

function replaceTag(html, pattern, replacement) {
  return pattern.test(html) ? html.replace(pattern, replacement) : html;
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
  const routeVideos = videoAssets.filter((video) => video.routes.includes(route.path));
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
        keywords: route.noindex ? undefined : defaultKeywords
      },
      breadcrumbGraph(route),
      ...articleGraph(route, canonical, currentOgImage),
      ...routeVideos.map((video) => ({
        '@type': 'VideoObject',
        '@id': `${video.contentUrl}#video`,
        name: video.name,
        description: video.description,
        thumbnailUrl: [video.thumbnailUrl],
        uploadDate: video.uploadDate,
        contentUrl: video.contentUrl,
        embedUrl: video.embedUrl,
        inLanguage: 'cs-CZ',
        isFamilyFriendly: video.familyFriendly,
        publisher: {
          '@id': `${baseUrl}/#organization`
        }
      }))
    ]
  };
}

function renderRoute(route) {
  const canonical = routeUrl(route.path);
  const currentOgImage = routeOgImage(route);
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
    `<meta name="keywords" content="${escapeHtml(defaultKeywords)}" />`
  );
  html = replaceTag(html, /<meta\s+name="application-name"\s+content="[^"]*"\s*\/>/, `<meta name="application-name" content="${officialName}" />`);
  html = replaceTag(
    html,
    /<meta\s+name="apple-mobile-web-app-title"\s+content="[^"]*"\s*\/>/,
    `<meta name="apple-mobile-web-app-title" content="${officialName}" />`
  );
  html = replaceTag(html, /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/, `<link rel="canonical" href="${canonical}" />`);
  html = replaceTag(html, /<meta\s+property="og:site_name"\s+content="[^"]*"\s*\/>/, `<meta property="og:site_name" content="${officialName}" />`);
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
  return deferRenderBlockingCss(html);
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
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${sitemapRoutes
  .map((route) => {
    const routeVideos = videoAssets.filter((video) => video.routes.includes(route.path));
    const videoXml = routeVideos
      .map(
        (video) => `
    <video:video>
      <video:thumbnail_loc>${escapeXml(video.thumbnailUrl)}</video:thumbnail_loc>
      <video:title>${escapeXml(video.name)}</video:title>
      <video:description>${escapeXml(video.description)}</video:description>
      <video:content_loc>${escapeXml(video.contentUrl)}</video:content_loc>
      <video:player_loc>${escapeXml(video.embedUrl)}</video:player_loc>
      <video:publication_date>${video.uploadDate}</video:publication_date>
      <video:family_friendly>${video.familyFriendly ? 'yes' : 'no'}</video:family_friendly>
    </video:video>`
      )
      .join('');
    return `  <url>
    <loc>${routeUrl(route.path)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq || 'monthly'}</changefreq>
    <priority>${route.priority || '0.5'}</priority>
${videoXml}
  </url>`;
  })
  .join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap);
console.log(`Prerendered SEO HTML for ${routes.length} routes.`);
