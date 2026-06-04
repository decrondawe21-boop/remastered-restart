const { spawn } = require('node:child_process');
const { loadDotEnv } = require('../server/env.cjs');
const { getPool, query } = require('../server/db.cjs');
const { hashPassword, randomId } = require('../server/security.cjs');

loadDotEnv();

const required = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD', 'AUTH_SECRET'];
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
  const stamp = Date.now();
  const adminId = randomId();
  const adminEmail = `admin.${stamp}@example.test`;
  const adminPassword = 'AdminTestHeslo123';
  let createdClientId = null;
  let createdNewsId = null;
  let createdMediaId = null;
  let createdDocumentId = null;
  let createdNotificationId = null;

  try {
    await query(
      `INSERT INTO users (id, role, name, email, password_hash, is_active)
       VALUES (?, 'admin', 'E2E Admin', ?, ?, 1)`,
      [adminId, adminEmail, hashPassword(adminPassword)]
    );

    await waitForServer();
    const login = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: adminEmail,
        password: adminPassword,
        role: 'admin'
      })
    });
    if (!login.response.ok || login.body.user.role !== 'admin') {
      throw new Error(`Admin login failed: ${JSON.stringify(login.body)}`);
    }
    const cookie = login.response.headers.get('set-cookie');

    const users = await request('/api/admin/users', { headers: { cookie } });
    if (!users.response.ok || !users.body.users.some((user) => user.id === adminId && user.role === 'admin')) {
      throw new Error(`Temporary admin is missing from user list: ${JSON.stringify(users.body)}`);
    }

    const templates = await request('/api/forms/templates', { headers: { cookie } });
    if (!templates.response.ok || !Array.isArray(templates.body.templates) || templates.body.templates.length === 0) {
      throw new Error(`Form templates endpoint failed: ${JSON.stringify(templates.body)}`);
    }

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
    createdClientId = created.body.client.id;

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
    createdNewsId = createdNews.body.news.id;

    const publicNews = await request('/api/news');
    if (!publicNews.response.ok || !publicNews.body.news.some((item) => item.id === createdNews.body.news.id)) {
      throw new Error(`Created news is missing from public news list: ${JSON.stringify(publicNews.body)}`);
    }

    const createdMedia = await request('/api/media', {
      method: 'POST',
      headers: { cookie },
      body: JSON.stringify({
        title: `Test media ${stamp}`,
        fileName: `test-media-${stamp}.jpg`,
        fileUrl: `/images/test-media-${stamp}.jpg`,
        mimeType: 'image/jpeg',
        fileSize: 12345,
        category: 'image',
        altText: 'Dočasný testovací soubor'
      })
    });
    if (!createdMedia.response.ok || createdMedia.body.media.title !== `Test media ${stamp}`) {
      throw new Error(`Media creation failed: ${JSON.stringify(createdMedia.body)}`);
    }
    createdMediaId = createdMedia.body.media.id;

    const mediaList = await request('/api/media', { headers: { cookie } });
    if (!mediaList.response.ok || !mediaList.body.media.some((item) => item.id === createdMediaId)) {
      throw new Error(`Created media is missing from media list: ${JSON.stringify(mediaList.body)}`);
    }

    const createdDocument = await request('/api/documents', {
      method: 'POST',
      headers: { cookie },
      body: JSON.stringify({
        title: `Test dokument ${stamp}`,
        documentType: 'form',
        status: 'draft',
        fileUrl: `/documents/test-${stamp}.pdf`,
        notes: 'Dočasný test tiskových formulářů.'
      })
    });
    if (!createdDocument.response.ok || createdDocument.body.document.title !== `Test dokument ${stamp}`) {
      throw new Error(`Document creation failed: ${JSON.stringify(createdDocument.body)}`);
    }
    createdDocumentId = createdDocument.body.document.id;

    const documentList = await request('/api/documents', { headers: { cookie } });
    if (!documentList.response.ok || !documentList.body.documents.some((item) => item.id === createdDocumentId)) {
      throw new Error(`Created document is missing from document list: ${JSON.stringify(documentList.body)}`);
    }

    const createdNotification = await request('/api/notifications', {
      method: 'POST',
      headers: { cookie },
      body: JSON.stringify({
        title: `Test notifikace ${stamp}`,
        body: 'Dočasné systémové upozornění.',
        tone: 'info',
        category: 'system'
      })
    });
    if (!createdNotification.response.ok || createdNotification.body.notification.title !== `Test notifikace ${stamp}`) {
      throw new Error(`Notification creation failed: ${JSON.stringify(createdNotification.body)}`);
    }
    createdNotificationId = createdNotification.body.notification.id;

    const notificationList = await request('/api/notifications', { headers: { cookie } });
    if (!notificationList.response.ok || !notificationList.body.notifications.some((item) => item.id === createdNotificationId)) {
      throw new Error(`Created notification is missing from notification list: ${JSON.stringify(notificationList.body)}`);
    }

    const readNotification = await request(`/api/notifications/${createdNotificationId}/read`, {
      method: 'PATCH',
      headers: { cookie }
    });
    if (!readNotification.response.ok || readNotification.body.id !== createdNotificationId) {
      throw new Error(`Notification read update failed: ${JSON.stringify(readNotification.body)}`);
    }

    console.log('Admin API validation passed.');
  } finally {
    server.kill();
    await query('DELETE FROM news WHERE id = ?', [createdNewsId]);
    await query('DELETE FROM clients WHERE id = ?', [createdClientId]);
    await query('DELETE FROM client_documents WHERE id = ?', [createdDocumentId]);
    await query('DELETE FROM media_files WHERE id = ?', [createdMediaId]);
    await query('DELETE FROM notifications WHERE id = ?', [createdNotificationId]);
    await query('DELETE FROM users WHERE id = ?', [adminId]);
    await getPool().end();
  }
})().catch((error) => {
  server.kill();
  console.error(error.message);
  process.exit(1);
});
