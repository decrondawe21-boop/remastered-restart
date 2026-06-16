const http = require('node:http');
const path = require('node:path');
const { spawn } = require('node:child_process');

const DEFAULT_BASE_URL = 'http://127.0.0.1:4173';

function canReach(url) {
  return new Promise((resolve) => {
    const request = http.get(url, (response) => {
      response.resume();
      resolve(Boolean(response.statusCode && response.statusCode < 500));
    });
    request.setTimeout(1000, () => {
      request.destroy();
      resolve(false);
    });
    request.on('error', () => resolve(false));
  });
}

async function waitForUrl(url, server, getLogs, timeoutMs = 20000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    if (await canReach(url)) return;
    if (server.exitCode !== null) {
      throw new Error(`Preview server exited before it was ready.\n${getLogs()}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  throw new Error(`Preview server did not become ready at ${url}.\n${getLogs()}`);
}

async function withPreviewServer(callback) {
  const baseUrl = process.env.RESTART_TEST_URL || DEFAULT_BASE_URL;
  if (process.env.RESTART_TEST_URL || (await canReach(baseUrl))) {
    return await callback(baseUrl);
  }

  const viteCli = path.join(process.cwd(), 'node_modules', 'vite', 'bin', 'vite.js');
  const server = spawn(process.execPath, [viteCli, 'preview', '--host', '127.0.0.1', '--port', '4173'], {
    env: process.env,
    stdio: ['ignore', 'pipe', 'pipe']
  });
  let stdout = '';
  let stderr = '';
  const append = (chunk, target) => `${target}${chunk.toString()}`.slice(-4000);
  server.stdout.on('data', (chunk) => {
    stdout = append(chunk, stdout);
  });
  server.stderr.on('data', (chunk) => {
    stderr = append(chunk, stderr);
  });
  const getLogs = () => [stdout.trim(), stderr.trim()].filter(Boolean).join('\n');

  try {
    await waitForUrl(baseUrl, server, getLogs);
    return await callback(baseUrl);
  } finally {
    if (server.exitCode === null) {
      server.kill();
    }
  }
}

module.exports = { withPreviewServer };
