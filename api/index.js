import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { loadDotEnv } = require('../server/env.cjs');
const { createApp } = require('../server/app.cjs');

loadDotEnv();

function restoreApiPath(request) {
  const url = new URL(request.url, `https://${request.headers.host || 'localhost'}`);
  const path = url.searchParams.get('path');
  if (!path) return;

  url.searchParams.delete('path');
  request.url = `/api/${path}${url.search}`;
}

export default function handler(request, response) {
  restoreApiPath(request);
  return createApp(request, response);
}
