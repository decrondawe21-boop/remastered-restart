import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { loadDotEnv } = require('../server/env.cjs');
const { createApp } = require('../server/app.cjs');

loadDotEnv();

export default function handler(request, response) {
  return createApp(request, response);
}
