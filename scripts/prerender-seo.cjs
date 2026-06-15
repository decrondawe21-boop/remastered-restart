const fs = require('node:fs');
const path = require('node:path');

const baseUrl = 'https://restartintegrace.dk-i.cz';
const ogImage = `${baseUrl}/images/slides/restart-og01.png`;
const today = '2026-06-15';

const routes = [
  {
    path: '/',
    title: 'REST||ART Integrace | Druhá šance v praxi',
    description:
      'REST||ART Integrace je projekt druhých šancí. Pomáhá lidem v sociální krizi znovu získat stabilitu, práci, bydlení a důstojnost.',
    priority: '1.0',
    changefreq: 'weekly'
  },
  {
    path: '/co-delame',
    title: 'Co děláme | REST||ART Integrace',
    description:
      'Mentoring, práce, bydlení, stabilizace a komunitní podpora pro lidi, kteří potřebují konkrétní druhou šanci.',
    priority: '0.8',
    changefreq: 'monthly'
  },
  {
    path: '/programy',
    title: 'Programy podpory | REST||ART Integrace',
    description:
      'Programy JAILBREAK, RESET, REWORK, STREETWISE, BOD ZLOMU a STABILIZACE propojují práci, režim, mentoring a návrat do života.',
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
    title: 'Aktuality | REST||ART Integrace',
    description:
      'Novinky, veřejné zprávy a průběžné informace z projektu REST||ART Integrace.',
    priority: '0.7',
    changefreq: 'weekly'
  },
  {
    path: '/zapojeni',
    title: 'Zapojení a podpora | REST||ART Integrace',
    description:
      'Zapojte se jako partner, dobrovolník nebo dárce. Podpora pomáhá pokrýt mentoring, materiály, práci a zázemí.',
    priority: '0.7',
    changefreq: 'monthly'
  },
  {
    path: '/povinne-zverejnovani',
    title: 'Povinné zveřejňování | REST||ART Integrace',
    description:
      'Transparentní dokumenty projektu, veřejné podklady a provozní informace REST||ART Integrace.',
    priority: '0.7',
    changefreq: 'monthly'
  },
  {
    path: '/kontakt',
    title: 'Kontakt | REST||ART Integrace',
    description:
      'Kontaktujte REST||ART Integrace. E-mail, telefon, adresa a kontaktní formulář pro partnery, klienty i veřejnost.',
    priority: '0.7',
    changefreq: 'monthly'
  },
  {
    path: '/pro-firmy',
    title: 'Pro firmy | REST||ART Integrace',
    description:
      'Partnerství pro firmy, které chtějí podpořit konkrétní druhou šanci: pracovní příležitosti, mentoring, materiál a zázemí.',
    priority: '0.6',
    changefreq: 'monthly'
  },
  {
    path: '/media',
    title: 'Média | REST||ART Integrace',
    description:
      'Základní informace pro novináře, partnery a veřejnou komunikaci projektu REST||ART Integrace.',
    priority: '0.5',
    changefreq: 'monthly'
  },
  {
    path: '/webove-gdpr',
    title: 'Webové GDPR | REST||ART Integrace',
    description:
      'Informace o cookies, souhlasech, formulářích, klientské zóně a bezpečnostních principech webu.',
    priority: '0.4',
    changefreq: 'yearly'
  },
  {
    path: '/zasady-ochrany-osobnich-udaju',
    title: 'Zásady ochrany osobních údajů | REST||ART Integrace',
    description:
      'Zásady ochrany osobních údajů projektu REST||ART Integrace a informace o právech subjektů údajů.',
    priority: '0.4',
    changefreq: 'yearly'
  },
  {
    path: '/klient',
    title: 'Klientská zóna | REST||ART Integrace',
    description: 'Chráněná klientská zóna projektu REST||ART Integrace.',
    noindex: true
  },
  {
    path: '/admin',
    title: 'Administrace | REST||ART Integrace',
    description: 'Chráněná administrace projektu REST||ART Integrace.',
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
    `<meta name="robots" content="${
      route.noindex ? 'noindex, nofollow, noarchive' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    }" />`
  );
  html = replaceTag(html, /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/, `<link rel="canonical" href="${canonical}" />`);
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
    /"url": "https:\/\/restartintegrace\.dk-i\.cz\/"/,
    `"url": "${canonical}"`
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
