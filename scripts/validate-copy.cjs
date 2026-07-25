const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const sourceFiles = [
  path.join(root, 'src', 'content.ts'),
  path.join(root, 'src', 'main.tsx')
];
const llmsPath = path.join(root, 'public', 'llms.txt');

const forbiddenProgramNames = [
  'MÍSTO ZLOMU',
  'MISTO ZLOMU'
];

let failed = false;

for (const file of sourceFiles) {
  const content = fs.readFileSync(file, 'utf8');
  for (const phrase of forbiddenProgramNames) {
    if (content.includes(phrase)) {
      console.error(`${path.relative(root, file)} contains forbidden program name: ${phrase}`);
      failed = true;
    }
  }
}

if (!fs.existsSync(llmsPath)) {
  console.error('public/llms.txt is missing.');
  failed = true;
} else {
  const llms = fs.readFileSync(llmsPath, 'utf8');
  const h1Count = (llms.match(/^# .+$/gm) || []).length;
  const publicLinks = llms.match(/\[.+?\]\(https:\/\/restartintegrace\.dk-i\.cz\/[^)]*\)/g) || [];

  if (h1Count !== 1) {
    console.error(`public/llms.txt must contain exactly one H1, found ${h1Count}.`);
    failed = true;
  }
  if (!/^> .+$/m.test(llms)) {
    console.error('public/llms.txt must contain a project summary blockquote.');
    failed = true;
  }
  if (publicLinks.length < 10) {
    console.error(`public/llms.txt should curate at least 10 public links, found ${publicLinks.length}.`);
    failed = true;
  }
  if (/restartintegrace\.dk-i\.cz\/(?:admin|klient)(?:[\/)#?]|$)/.test(llms)) {
    console.error('public/llms.txt must not link to private admin or client areas.');
    failed = true;
  }
}

const mainSource = fs.readFileSync(path.join(root, 'src', 'main.tsx'), 'utf8');
if (mainSource.includes('toolautosubmit')) {
  console.error('Public WebMCP forms must require manual user submission.');
  failed = true;
}
for (const toolName of ['search_site_header', 'search_site_mobile', 'search_site_results', 'prepare_contact_message']) {
  if (!mainSource.includes(`'${toolName}'`)) {
    console.error(`Missing public WebMCP tool declaration: ${toolName}`);
    failed = true;
  }
}

if (failed) {
  process.exit(1);
}

console.log('Copy validation passed.');
