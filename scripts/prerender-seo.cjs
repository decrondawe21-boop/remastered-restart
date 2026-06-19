const fs = require('node:fs');
const path = require('node:path');

const baseUrl = 'https://restartintegrace.dk-i.cz';
const ogImage = `${baseUrl}/images/og/restart-integrace-og-1200x630.png`;
const today = new Date().toISOString().slice(0, 10);
const officialName = 'RESTART Integrace';
const styledName = 'REST||ART Integrace';
const alternateNames = [styledName, 'REST ART Integrace', 'Restart Integrace', 'RESTARTINTEGRACE'];
const defaultRobots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
const defaultKeywords =
  'RESTART Integrace, REST||ART Integrace, Restart Integrace, oficiální web RESTART Integrace, druhá šance, sociální integrace, mentoring, práce, bydlení, stabilizace, JAILBREAK, RESET, REWORK';

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

function routeUrl(routePath) {
  return `${baseUrl}${routePath === '/' ? '/' : routePath}`;
}

function replaceTag(html, pattern, replacement) {
  return pattern.test(html) ? html.replace(pattern, replacement) : html;
}

function structuredData(route, canonical) {
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
        image: ogImage,
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
          url: ogImage,
          width: 1200,
          height: 630
        },
        dateModified: today,
        keywords: route.noindex ? undefined : defaultKeywords
      }
    ]
  };
}

function renderRoute(route) {
  const canonical = routeUrl(route.path);
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
  html = replaceTag(html, /<meta\s+property="og:image"\s+content="[^"]*"\s*\/>/, `<meta property="og:image" content="${ogImage}" />`);
  html = replaceTag(
    html,
    /<meta\s+property="og:image:secure_url"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:image:secure_url" content="${ogImage}" />`
  );
  html = replaceTag(html, /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/>/, `<meta name="twitter:title" content="${escapeHtml(route.title)}" />`);
  html = replaceTag(
    html,
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:description" content="${escapeHtml(route.description)}" />`
  );
  html = replaceTag(html, /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/>/, `<meta name="twitter:image" content="${ogImage}" />`);
  html = html.replace(
    /<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/,
    `<script type="application/ld+json">\n${JSON.stringify(structuredData(route, canonical), null, 6)}\n    </script>`
  );
  return html;
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
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapRoutes
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

fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap);
console.log(`Prerendered SEO HTML for ${routes.length} routes.`);
