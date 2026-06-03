const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const sourceFiles = [
  path.join(root, 'src', 'content.ts'),
  path.join(root, 'src', 'main.tsx')
];

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

if (failed) {
  process.exit(1);
}

console.log('Copy validation passed.');
