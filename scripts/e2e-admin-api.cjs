const { spawn } = require('node:child_process');

const required = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD', 'AUTH_SECRET', 'ADMIN_EMAIL', 'ADMIN_PASSWORD'];
const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

const port = String(6100 + Math.floor(Math.random() * 800));
const baseUrl = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ['server/index.cjs'], {
  cwd: process.cwd(),
  env: { ...process.env, API_PORT: port },
  stdio: ['ignore', 'pipe', 'pipe']
});

let output = '';
server.stdout.on('data', (chunk) => {
  output += chunk.toString();
});
server.stderr.on('data', (chunk) => {
  output += chunk.toString();
});

function waitForServer() {
  return new Promise((resolve, reject) => {
    const started = Date.now();
    const timer = setInterval(async () => {
      if (Date.now() - started > 12000) {
        clearInterval(timer);
        reject(new Error(`API server did not start.\n${output}`));
        return;
      }
      try {
        const response = await fetch(`${baseUrl}/api/health`);
        if (response.ok) {
          clearInterval(timer);
          resolve();
        }
      } catch {
        // Poll until ready.
      }
    }, 250);
  });
}

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      'content-type': 'application/json',
      ...(options.headers || {})
    }
  });
  const text = await response.text();
  const body = text ? JSON.parse(text) : null;
  return { response, body };
}

(async () => {
  try {
    await waitForServer();
    const login = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: 'admin'
      })
    });
    if (!login.response.ok || login.body.user.role !== 'admin') {
      throw new Error(`Admin login failed: ${JSON.stringify(login.body)}`);
    }
    const cookie = login.response.headers.get('set-cookie');
    const stamp = Date.now();
    const created = await request('/api/clients', {
      method: 'POST',
      headers: { cookie },
      body: JSON.stringify({
        firstName: 'Admin',
        lastName: `Databaze ${stamp}`,
        birthDate: '1990-01-02',
        phone: '+420 777 333 444',
        email: `admin-client-${stamp}@restart.test`,
        program: 'RESET',
        status: 'V mapování',
        notes: 'Založeno e2e admin testem.'
      })
    });
    if (!created.response.ok || created.body.client.program !== 'RESET') {
      throw new Error(`Client creation failed: ${JSON.stringify(created.body)}`);
    }
    const list = await request('/api/clients', { headers: { cookie } });
    if (!list.response.ok || !list.body.clients.some((client) => client.id === created.body.client.id)) {
      throw new Error(`Created client is missing from database list: ${JSON.stringify(list.body)}`);
    }
    const newsTitle = `Aktualita databaze ${stamp}`;
    const createdNews = await request('/api/news', {
      method: 'POST',
      headers: { cookie },
      body: JSON.stringify({
        title: newsTitle,
        date: '2026-06-03',
        excerpt: 'Aktualita založená přes admin API test.'
      })
    });
    if (!createdNews.response.ok || createdNews.body.news.title !== newsTitle) {
      throw new Error(`News creation failed: ${JSON.stringify(createdNews.body)}`);
    }
    const publicNews = await request('/api/news');
    if (!publicNews.response.ok || !publicNews.body.news.some((item) => item.id === createdNews.body.news.id)) {
      throw new Error(`Created news is missing from public news list: ${JSON.stringify(publicNews.body)}`);
    }
    console.log('Admin API validation passed.');
  } finally {
    server.kill();
  }
})().catch((error) => {
  server.kill();
  console.error(error.message);
  process.exit(1);
});
