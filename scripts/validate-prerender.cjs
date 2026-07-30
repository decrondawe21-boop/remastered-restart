const fs = require('node:fs');
const path = require('node:path');

const distDir = path.join(process.cwd(), 'dist');
const baseUrl = 'https://restartintegrace.dk-i.cz';
const failures = [];
const checked = [];

function collectIndexFiles(directory, files = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) collectIndexFiles(filePath, files);
    else if (entry.name === 'index.html') files.push(filePath);
  }
  return files;
}

function expectedCanonical(filePath) {
  const relative = path.relative(distDir, path.dirname(filePath)).split(path.sep).filter(Boolean);
  return `${baseUrl}/${relative.length > 0 ? relative.join('/') : ''}`;
}

function rootMarkup(html) {
  const start = html.indexOf('<div id="root">');
  const end = html.lastIndexOf('</div>');
  if (start < 0 || end <= start) return '';
  return html.slice(start, end + 6);
}

function visibleText(markup) {
  return markup
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(?:[a-z]+|#\d+);/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

for (const filePath of collectIndexFiles(distDir)) {
  const html = fs.readFileSync(filePath, 'utf8');
  const relative = path.relative(distDir, filePath).split(path.sep).join('/');
  const markup = rootMarkup(html);
  const noindex = /<meta\s+name="robots"\s+content="noindex\b/i.test(html);
  const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1] || '';
  const h1Count = (markup.match(/<h1\b/gi) || []).length;
  const textLength = visibleText(markup).length;

  if (!markup) failures.push(`${relative}: chybí neprázdný #root.`);
  if (h1Count !== 1) failures.push(`${relative}: očekáván právě jeden H1, nalezeno ${h1Count}.`);
  if (!noindex && textLength < 240) {
    failures.push(`${relative}: indexovatelný HTML snapshot je příliš krátký (${textLength} znaků).`);
  }
  if (canonical !== expectedCanonical(filePath)) {
    failures.push(`${relative}: canonical "${canonical}" neodpovídá "${expectedCanonical(filePath)}".`);
  }
  if (!noindex && !/data-seo-snapshot=/.test(markup)) {
    failures.push(`${relative}: chybí označený SEO snapshot.`);
  }

  checked.push({ relative, noindex, h1Count, textLength });
}

for (const requiredFile of ['robots.txt', 'sitemap.xml', 'llms.txt']) {
  if (!fs.existsSync(path.join(distDir, requiredFile))) failures.push(`dist/${requiredFile}: soubor chybí.`);
}

const robots = fs.readFileSync(path.join(distDir, 'robots.txt'), 'utf8');
if (!robots.includes(`Sitemap: ${baseUrl}/sitemap.xml`)) {
  failures.push('robots.txt: chybí odkaz na hlavní sitemapu.');
}

const sitemapIndex = fs.readFileSync(path.join(distDir, 'sitemap.xml'), 'utf8');
if (!sitemapIndex.includes('<sitemapindex')) failures.push('sitemap.xml: soubor není sitemap index.');

const mediaSitemapPath = path.join(distDir, 'sitemap-media.xml');
if (!fs.existsSync(mediaSitemapPath)) {
  failures.push('sitemap-media.xml: soubor chybí.');
} else {
  const mediaSitemap = fs.readFileSync(mediaSitemapPath, 'utf8');
  if (!mediaSitemap.includes('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"')) {
    failures.push('sitemap-media.xml: chybí jmenný prostor obrazové sitemapy.');
  }
  if (!/<image:image>[\s\S]*?<image:loc>https:\/\/restartintegrace\.dk-i\.cz\//.test(mediaSitemap)) {
    failures.push('sitemap-media.xml: neobsahuje žádné obrazové záznamy.');
  }
  const submittedPageUrls = [...mediaSitemap.matchAll(/<url>[\s\S]*?<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  const directBinaryPage = submittedPageUrls.find((url) => /\.(?:avif|gif|jpe?g|mp4|png|webm|webp)(?:$|\?)/i.test(url));
  if (directBinaryPage) {
    failures.push(`sitemap-media.xml: binární soubor je chybně odeslaný jako stránka (${directBinaryPage}).`);
  }
}

if (failures.length > 0) {
  console.error(`Kontrola prerenderu selhala (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

const indexed = checked.filter((item) => !item.noindex);
console.log(
  `Prerender je v pořádku: ${indexed.length} indexovatelných a ${checked.length - indexed.length} noindex tras, každá s H1, canonical a neprázdným HTML.`
);
