const { spawn } = require('node:child_process');

const required = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD', 'AUTH_SECRET'];
const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

const port = String(5100 + Math.floor(Math.random() * 800));
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
        // Keep polling while the child process starts.
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
    const email = `client.${Date.now()}@example.test`;
    const password = 'tajneheslo';

    const anonymous = await request('/api/auth/me');
    if (!anonymous.response.ok || anonymous.body.user !== null) {
      throw new Error(`Anonymous session should return user null: ${JSON.stringify(anonymous.body)}`);
    }

    const registered = await request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test Klient',
        email,
        phone: '+420 777 111 222',
        password
      })
    });
    if (!registered.response.ok || registered.body.user.email !== email || registered.body.user.role !== 'client') {
      throw new Error(`Client registration failed: ${JSON.stringify(registered.body)}`);
    }
    const cookie = registered.response.headers.get('set-cookie');
    if (!cookie || !cookie.includes('restart_session=')) {
      throw new Error('Registration should set an HttpOnly session cookie.');
    }

    const me = await request('/api/auth/me', {
      headers: { cookie }
    });
    if (!me.response.ok || me.body.user.email !== email) {
      throw new Error(`Session lookup failed: ${JSON.stringify(me.body)}`);
    }

    const logout = await request('/api/auth/logout', {
      method: 'POST',
      headers: { cookie }
    });
    if (!logout.response.ok) {
      throw new Error(`Logout failed: ${JSON.stringify(logout.body)}`);
    }

    const login = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role: 'client' })
    });
    if (!login.response.ok || login.body.user.email !== email) {
      throw new Error(`Client login failed: ${JSON.stringify(login.body)}`);
    }

    const news = await request('/api/news');
    if (!news.response.ok || !Array.isArray(news.body.news)) {
      throw new Error(`News endpoint failed: ${JSON.stringify(news.body)}`);
    }

    console.log('API validation passed.');
  } finally {
    server.kill();
  }
})().catch((error) => {
  server.kill();
  console.error(error.message);
  process.exit(1);
});
