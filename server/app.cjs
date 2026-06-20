const crypto = require('node:crypto');
const { query } = require('./db.cjs');
const fs = require('node:fs');
const path = require('node:path');
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');
const {
  clearOAuthStateCookie,
  clearSessionCookie,
  createSessionToken,
  hashPassword,
  oauthStateCookie,
  oauthStateCookieName,
  parseCookies,
  randomId,
  readSessionToken,
  sessionCookie,
  sessionCookieName,
  verifyPassword
} = require('./security.cjs');

function sendJson(response, statusCode, body, headers = {}) {
  response.writeHead(statusCode, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    ...headers
  });
  response.end(JSON.stringify(body));
}

function sendRedirect(response, location, headers = {}) {
  response.writeHead(302, {
    location,
    'cache-control': 'no-store',
    ...headers
  });
  response.end();
}

const publicRoot = path.resolve(__dirname, '..', 'public');
const portalRoles = ['applicant', 'client', 'volunteer', 'investor', 'patron', 'contributor', 'donor', 'user'];
const assignableRoles = ['admin', 'editor', ...portalRoles];
const applicationRoles = ['client', 'volunteer', 'investor', 'patron', 'contributor', 'donor'];
const applicationStatuses = ['pending', 'approved', 'rejected'];
const roleLabels = {
  admin: 'Administrátor',
  editor: 'Editor',
  applicant: 'Uchazeč',
  client: 'Klient',
  volunteer: 'Dobrovolník',
  investor: 'Investor',
  patron: 'Mecenáš',
  contributor: 'Přispěvatel',
  donor: 'Jednorázový dárce',
  user: 'Uživatel'
};
const documentMimeTypes = {
  '.pdf': 'application/pdf',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
};

const isPortalRole = (role) => portalRoles.includes(String(role || ''));

async function servePublicDocument(request, response, url) {
  if (!['GET', 'HEAD'].includes(request.method) || !url.pathname.startsWith('/documents/')) {
    return false;
  }

  let decodedPath;
  try {
    decodedPath = decodeURIComponent(url.pathname);
  } catch {
    sendJson(response, 400, { error: 'Invalid file path.' });
    return true;
  }

  const filePath = path.resolve(publicRoot, `.${decodedPath}`);
  if (!filePath.startsWith(`${publicRoot}${path.sep}`)) {
    sendJson(response, 403, { error: 'Forbidden.' });
    return true;
  }

  let stat;
  try {
    stat = await fs.promises.stat(filePath);
  } catch {
    sendJson(response, 404, { error: 'File not found.' });
    return true;
  }

  if (!stat.isFile()) {
    sendJson(response, 404, { error: 'File not found.' });
    return true;
  }

  response.writeHead(200, {
    'content-type': documentMimeTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
    'content-length': stat.size,
    'cache-control': 'public, max-age=3600'
  });

  if (request.method === 'HEAD') {
    response.end();
    return true;
  }

  fs.createReadStream(filePath).pipe(response);
  return true;
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let raw = '';
    request.on('data', (chunk) => {
      raw += chunk.toString();
      if (raw.length > 12_000_000) {
        reject(new Error('Request body is too large.'));
        request.destroy();
      }
    });
    request.on('end', () => {
      if (!raw) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error('Invalid JSON body.'));
      }
    });
    request.on('error', reject);
  });
}

function publicUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    role: row.role,
    name: row.name,
    email: row.email,
    phone: row.phone || '',
    isActive: row.is_active === undefined ? true : Boolean(row.is_active),
    lastLoginAt: row.last_login_at || null,
    createdAt: row.created_at
  };
}

async function currentUser(request) {
  const cookies = parseCookies(request.headers.cookie || '');
  const payload = readSessionToken(cookies[sessionCookieName]);
  if (!payload) return null;
  const rows = await query(
    'SELECT id, role, name, email, phone, is_active, created_at FROM users WHERE id = ? AND is_active = 1 LIMIT 1',
    [payload.id]
  );
  return rows[0] || null;
}

function requireFields(body, fields) {
  for (const field of fields) {
    if (!String(body[field] || '').trim()) {
      return `${field} is required.`;
    }
  }
  return null;
}

async function requireAdmin(request, response) {
  const user = await currentUser(request);
  if (!user || user.role !== 'admin') {
    sendJson(response, 403, { error: 'Admin access required.' });
    return null;
  }
  return user;
}

function truncateText(value, maxLength = 150) {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
}

async function createSystemNotification({
  recipientId = null,
  title,
  body,
  tone = 'info',
  category = 'Systém',
  linkHref = '',
  createdBy = null
}) {
  try {
    await query(
      `INSERT INTO notifications (id, recipient_id, title, body, tone, category, link_href, created_by)
       VALUES (?, ?, ?, ?, ?, ?, NULLIF(?, ''), ?)`,
      [randomId(), recipientId, title, body, tone, category, linkHref, createdBy]
    );
  } catch (error) {
    console.warn('[notifications] system notification failed:', error.message);
  }
}

function publicBaseUrl(request) {
  const configured = String(process.env.APP_BASE_URL || process.env.PUBLIC_BASE_URL || '').trim();
  if (configured) return configured.replace(/\/+$/, '');
  const host = request.headers['x-forwarded-host'] || request.headers.host || 'localhost:3000';
  const proto = request.headers['x-forwarded-proto'] || (process.env.NODE_ENV === 'production' ? 'https' : 'http');
  return `${String(proto).split(',')[0]}://${String(host).split(',')[0]}`.replace(/\/+$/, '');
}

function resetRouteForRole(role) {
  return role === 'admin' ? '/admin' : '/klient';
}

function buildResetUrl(request, token, role) {
  return `${publicBaseUrl(request)}${resetRouteForRole(role)}?resetToken=${encodeURIComponent(token)}`;
}

let mailTransporter = null;

function smtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_FROM);
}

function getMailTransporter() {
  if (!smtpConfigured()) return null;
  if (mailTransporter) return mailTransporter;
  const port = Number(process.env.SMTP_PORT || 587);
  mailTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: process.env.SMTP_SECURE === '1' || port === 465,
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASS
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        : undefined
  });
  return mailTransporter;
}

async function sendPasswordResetEmail(user, resetUrl) {
  const transporter = getMailTransporter();
  if (!transporter) return false;
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: user.email,
    subject: 'Obnova hesla | REST||ART Integrace',
    text: [
      `Dobrý den${user.name ? `, ${user.name}` : ''},`,
      '',
      'pro obnovu hesla použijte tento odkaz:',
      resetUrl,
      '',
      'Odkaz je platný 60 minut. Pokud jste o obnovu hesla nežádali, zprávu ignorujte.',
      '',
      'REST||ART Integrace'
    ].join('\n'),
    html: [
      `<p>Dobrý den${user.name ? `, ${user.name}` : ''},</p>`,
      '<p>pro obnovu hesla použijte tento odkaz:</p>',
      `<p><a href="${resetUrl}">${resetUrl}</a></p>`,
      '<p>Odkaz je platný 60 minut. Pokud jste o obnovu hesla nežádali, zprávu ignorujte.</p>',
      '<p>REST||ART Integrace</p>'
    ].join('')
  });
  return true;
}

async function createPasswordResetForUser(user, request) {
  const token = crypto.randomBytes(32).toString('base64url');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const resetUrl = buildResetUrl(request, token, user.role);
  await query('DELETE FROM password_resets WHERE user_id = ? OR expires_at < NOW() OR used_at IS NOT NULL', [user.id]);
  await query(
    `INSERT INTO password_resets (id, user_id, token_hash, expires_at)
     VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 1 HOUR))`,
    [randomId(), user.id, tokenHash]
  );
  let emailSent = false;
  try {
    emailSent = await sendPasswordResetEmail(user, resetUrl);
  } catch (error) {
    console.warn('[mail] password reset email failed:', error.message);
  }
  const bodyResponse = {
    ok: true,
    message: emailSent
      ? 'Odkaz pro obnovu hesla byl odeslán e-mailem.'
      : 'Odkaz pro obnovu hesla byl připraven. E-mailová brána není nastavená nebo odeslání selhalo.',
    expiresInMinutes: 60,
    emailSent
  };
  if (process.env.NODE_ENV !== 'production' || process.env.RESET_TOKEN_IN_RESPONSE === '1') {
    bodyResponse.resetToken = token;
    bodyResponse.resetUrl = resetUrl;
  }
  return bodyResponse;
}

function googleOAuthConfig(request) {
  const clientId = String(process.env.GOOGLE_OAUTH_CLIENT_ID || '').trim();
  const clientSecret = String(process.env.GOOGLE_OAUTH_CLIENT_SECRET || '').trim();
  if (!clientId || !clientSecret) return null;
  const redirectUri =
    String(process.env.GOOGLE_OAUTH_REDIRECT_URI || '').trim() || `${publicBaseUrl(request)}/api/auth/google/callback`;
  return {
    clientId,
    redirectUri,
    client: new OAuth2Client(clientId, clientSecret, redirectUri)
  };
}

function googleRedirect(request, target, reason = '') {
  const path = target === 'admin' ? '/admin' : '/klient';
  return `${publicBaseUrl(request)}${path}${reason ? `?auth=${encodeURIComponent(reason)}` : ''}`;
}

async function registerClient(request, response) {
  const body = await readBody(request);
  const missing = requireFields(body, ['name', 'email', 'password']);
  if (missing) {
    sendJson(response, 400, { error: missing });
    return;
  }

  const existing = await query('SELECT id FROM users WHERE email = ? LIMIT 1', [body.email.trim().toLowerCase()]);
  if (existing.length > 0) {
    sendJson(response, 409, { error: 'Account already exists.' });
    return;
  }

  const id = randomId();
  const email = body.email.trim().toLowerCase();
  await query(
    `INSERT INTO users (id, role, name, email, phone, password_hash, password_algo, is_active)
     VALUES (?, 'applicant', ?, ?, ?, ?, 'scrypt', 1)`,
    [id, body.name.trim(), email, String(body.phone || '').trim(), hashPassword(body.password)]
  );

  const rows = await query('SELECT id, role, name, email, phone, is_active, created_at FROM users WHERE id = ? LIMIT 1', [id]);
  const user = rows[0];
  await createSystemNotification({
    title: 'Nový uchazeč se zaregistroval',
    body: `${user.name} (${user.email}) vytvořil/a profil uchazeče. Dalším krokem je žádost o vstup do projektu.`,
    tone: 'info',
    category: 'Registrace',
    linkHref: `#/admin?tab=users&user=${encodeURIComponent(user.id)}`,
    createdBy: user.id
  });
  sendJson(response, 201, {
    user: publicUser(user),
    pendingVerification: false,
    message: 'Profil uchazeče byl vytvořen. Teď můžete podat žádost o vstup do projektu.'
  }, { 'set-cookie': sessionCookie(createSessionToken(user)) });
}

async function login(request, response) {
  const body = await readBody(request);
  const missing = requireFields(body, ['email', 'password']);
  if (missing) {
    sendJson(response, 400, { error: missing });
    return;
  }

  const requestedRole = String(body.role || '').trim();
  const email = body.email.trim().toLowerCase();
  let roleClause = '';
  let params = [email];
  if (requestedRole === 'admin') {
    roleClause = 'AND role = ?';
    params = [email, 'admin'];
  } else if (requestedRole === 'client' || isPortalRole(requestedRole)) {
    roleClause = `AND role IN (${portalRoles.map(() => '?').join(', ')})`;
    params = [email, ...portalRoles];
  }
  const rows = await query(
    `SELECT id, role, name, email, phone, password_hash, is_active, created_at
     FROM users
     WHERE email = ? ${roleClause}
     LIMIT 1`,
    params
  );
  const user = rows[0];
  if (!user || !verifyPassword(body.password, user.password_hash)) {
    sendJson(response, 401, { error: 'Invalid credentials.' });
    return;
  }
  if (!user.is_active) {
    sendJson(response, 403, { error: 'Účet čeká na ověření nebo aktivaci administrátorem.' });
    return;
  }

  await query('UPDATE users SET last_login_at = NOW() WHERE id = ?', [user.id]);
  sendJson(response, 200, { user: publicUser(user) }, { 'set-cookie': sessionCookie(createSessionToken(user)) });
}

async function me(request, response) {
  const user = await currentUser(request);
  if (!user) {
    sendJson(response, 200, { user: null });
    return;
  }
  sendJson(response, 200, { user: publicUser(user) });
}

async function logout(_request, response) {
  sendJson(response, 200, { ok: true }, { 'set-cookie': clearSessionCookie() });
}

async function startGoogleLogin(request, response, url) {
  const config = googleOAuthConfig(request);
  if (!config) {
    sendJson(response, 501, { error: 'Google OAuth is not configured.' });
    return;
  }
  const role = url.searchParams.get('role') === 'admin' ? 'admin' : 'client';
  const state = crypto.randomBytes(24).toString('base64url');
  const stateCookieValue = [state, role].join('|');
  const authUrl = config.client.generateAuthUrl({
    access_type: 'online',
    prompt: 'select_account',
    scope: ['openid', 'email', 'profile'],
    state
  });
  sendRedirect(response, authUrl, { 'set-cookie': oauthStateCookie(stateCookieValue) });
}

async function finishGoogleLogin(request, response, url) {
  const config = googleOAuthConfig(request);
  if (!config) {
    sendRedirect(response, googleRedirect(request, 'client', 'google-error'));
    return;
  }
  const cookies = parseCookies(request.headers.cookie || '');
  const [expectedState, requestedRole = 'client'] = String(cookies[oauthStateCookieName] || '').split('|');
  const receivedState = String(url.searchParams.get('state') || '');
  const code = String(url.searchParams.get('code') || '');
  const target = requestedRole === 'admin' ? 'admin' : 'client';
  if (!expectedState || !receivedState || expectedState !== receivedState || !code) {
    sendRedirect(response, googleRedirect(request, target, 'google-error'), { 'set-cookie': clearOAuthStateCookie() });
    return;
  }
  try {
    const { tokens } = await config.client.getToken(code);
    if (!tokens.id_token) {
      sendRedirect(response, googleRedirect(request, target, 'google-error'), { 'set-cookie': clearOAuthStateCookie() });
      return;
    }
    const ticket = await config.client.verifyIdToken({
      idToken: tokens.id_token,
      audience: config.clientId
    });
    const payload = ticket.getPayload() || {};
    const email = String(payload.email || '').trim().toLowerCase();
    const emailVerified = payload.email_verified === true || payload.email_verified === 'true';
    if (!email || !emailVerified) {
      sendRedirect(response, googleRedirect(request, target, 'google-error'), { 'set-cookie': clearOAuthStateCookie() });
      return;
    }
    const rows = await query(
      'SELECT id, role, name, email, phone, is_active, created_at FROM users WHERE email = ? LIMIT 1',
      [email]
    );
    let user = rows[0];
    if (!user) {
      if (target === 'admin') {
        sendRedirect(response, googleRedirect(request, target, 'google-admin-denied'), { 'set-cookie': clearOAuthStateCookie() });
        return;
      }
      const id = randomId();
      const name = String(payload.name || email).trim();
      await query(
        `INSERT INTO users (id, role, name, email, phone, password_hash, password_algo, is_active)
         VALUES (?, 'applicant', ?, ?, '', ?, 'scrypt', 1)`,
        [id, name, email, hashPassword(crypto.randomBytes(32).toString('base64url'))]
      );
      const createdRows = await query(
        'SELECT id, role, name, email, phone, is_active, created_at FROM users WHERE id = ? LIMIT 1',
        [id]
      );
      user = createdRows[0];
      await createSystemNotification({
        title: 'Nový Google uchazeč',
        body: `${user.name} (${user.email}) se registroval/a přes Google. Dalším krokem je žádost o vstup do projektu.`,
        tone: 'info',
        category: 'Registrace',
        linkHref: `#/admin?tab=users&user=${encodeURIComponent(user.id)}`,
        createdBy: user.id
      });
      await query('UPDATE users SET last_login_at = NOW() WHERE id = ?', [user.id]);
      sendRedirect(response, googleRedirect(request, target), {
        'set-cookie': [clearOAuthStateCookie(), sessionCookie(createSessionToken(user))]
      });
      return;
    }
    if (target === 'admin' && user.role !== 'admin') {
      sendRedirect(response, googleRedirect(request, target, 'google-admin-denied'), { 'set-cookie': clearOAuthStateCookie() });
      return;
    }
    if (target !== 'admin' && user.role !== 'admin' && !isPortalRole(user.role)) {
      sendRedirect(response, googleRedirect(request, target, 'google-role-denied'), { 'set-cookie': clearOAuthStateCookie() });
      return;
    }
    if (!user.is_active) {
      sendRedirect(response, googleRedirect(request, target, 'google-inactive'), { 'set-cookie': clearOAuthStateCookie() });
      return;
    }
    await query('UPDATE users SET last_login_at = NOW() WHERE id = ?', [user.id]);
    sendRedirect(response, googleRedirect(request, target), {
      'set-cookie': [clearOAuthStateCookie(), sessionCookie(createSessionToken(user))]
    });
  } catch (error) {
    console.warn('[auth] google login failed:', error.message);
    sendRedirect(response, googleRedirect(request, target, 'google-error'), { 'set-cookie': clearOAuthStateCookie() });
  }
}

async function resetPassword(request, response) {
  const body = await readBody(request);
  if (!String(body.email || '').trim()) {
    sendJson(response, 400, { error: 'email is required.' });
    return;
  }
  const email = String(body.email).trim().toLowerCase();
  const rows = await query('SELECT id, role, name, email FROM users WHERE email = ? AND is_active = 1 LIMIT 1', [email]);
  const message = 'Pokud účet existuje, je připravený odkaz pro obnovu hesla.';
  if (rows.length === 0) {
    sendJson(response, 200, { ok: true, message });
    return;
  }
  const reset = await createPasswordResetForUser(rows[0], request);
  sendJson(response, 200, { ...reset, message });
}

async function confirmPasswordReset(request, response) {
  const body = await readBody(request);
  const token = String(body.token || '').trim();
  const password = String(body.password || '');
  if (!token) {
    sendJson(response, 400, { error: 'token is required.' });
    return;
  }
  if (password.length < 8) {
    sendJson(response, 400, { error: 'Password must be at least 8 characters.' });
    return;
  }
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const rows = await query(
    `SELECT resets.id, resets.user_id
     FROM password_resets resets
     JOIN users ON users.id = resets.user_id
     WHERE resets.token_hash = ?
       AND resets.used_at IS NULL
       AND resets.expires_at > NOW()
       AND users.is_active = 1
     LIMIT 1`,
    [tokenHash]
  );
  if (rows.length === 0) {
    sendJson(response, 400, { error: 'Reset token is invalid or expired.' });
    return;
  }
  await query(
    `UPDATE users
     SET password_hash = ?, password_algo = 'scrypt', password_reset_required = 0
     WHERE id = ?`,
    [hashPassword(password), rows[0].user_id]
  );
  await query('UPDATE password_resets SET used_at = NOW() WHERE id = ?', [rows[0].id]);
  sendJson(response, 200, { ok: true, message: 'Heslo bylo úspěšně změněno. Můžete se přihlásit.' });
}

async function listNews(_request, response) {
  const rows = await query(
    `SELECT id, title, DATE_FORMAT(published_at, '%Y-%m-%d') AS date, excerpt, body
     FROM news
     WHERE status = 'published'
     ORDER BY published_at DESC, created_at DESC
     LIMIT 50`
  );
  sendJson(response, 200, { news: rows });
}

async function saveNews(request, response) {
  const user = await currentUser(request);
  if (!user || user.role !== 'admin') {
    sendJson(response, 403, { error: 'Admin access required.' });
    return;
  }
  const body = await readBody(request);
  const missing = requireFields(body, ['title', 'excerpt']);
  if (missing) {
    sendJson(response, 400, { error: missing });
    return;
  }
  const id = body.id || randomId();
  const date = String(body.date || '').trim() || new Date().toISOString().slice(0, 10);
  await query(
    `INSERT INTO news (id, title, excerpt, body, published_at, status, author_id)
     VALUES (?, ?, ?, ?, ?, 'published', ?)
     ON DUPLICATE KEY UPDATE
       title = VALUES(title),
       excerpt = VALUES(excerpt),
       body = VALUES(body),
       published_at = VALUES(published_at),
       status = 'published',
       author_id = VALUES(author_id)`,
    [id, body.title.trim(), body.excerpt.trim(), body.body || null, `${date} 00:00:00`, user.id]
  );
  const rows = await query(
    `SELECT id, title, DATE_FORMAT(published_at, '%Y-%m-%d') AS date, excerpt, body
     FROM news
     WHERE id = ?
     LIMIT 1`,
    [id]
  );
  sendJson(response, 200, { news: rows[0] });
}

async function deleteNews(request, response, newsId) {
  const user = await currentUser(request);
  if (!user || user.role !== 'admin') {
    sendJson(response, 403, { error: 'Admin access required.' });
    return;
  }
  const existing = await query('SELECT id FROM news WHERE id = ? LIMIT 1', [newsId]);
  if (existing.length === 0) {
    sendJson(response, 404, { error: 'News item not found.' });
    return;
  }
  await query('DELETE FROM news WHERE id = ?', [newsId]);
  sendJson(response, 200, { ok: true, id: newsId });
}

function publicComment(row, user) {
  const authorId = row.authorId || row.author_id;
  return {
    id: row.id,
    newsId: row.newsId || row.news_id,
    parentId: row.parentId || row.parent_id || null,
    authorId,
    authorName: row.authorName || row.author_name || 'Uživatel',
    authorRole: row.authorRole || row.author_role || 'client',
    body: row.body,
    createdAt: row.createdAt || row.created_at,
    updatedAt: row.updatedAt || row.updated_at,
    canEdit: Boolean(user && (user.role === 'admin' || user.id === authorId)),
    canDelete: Boolean(user && (user.role === 'admin' || user.id === authorId))
  };
}

async function listNewsDiscussion(request, response) {
  const user = await currentUser(request);
  const likeRows = await query(
    `SELECT
       news_id AS newsId,
       COUNT(*) AS count,
       SUM(CASE WHEN user_id = ? THEN 1 ELSE 0 END) AS likedByMe
     FROM news_likes
     GROUP BY news_id`,
    [user?.id || '']
  );
  const commentRows = await query(
    `SELECT
       comments.id,
       comments.news_id AS newsId,
       comments.parent_id AS parentId,
       comments.author_id AS authorId,
       users.name AS authorName,
       users.role AS authorRole,
       comments.body,
       comments.created_at AS createdAt,
       comments.updated_at AS updatedAt
     FROM news_comments comments
     JOIN users ON users.id = comments.author_id
     JOIN news ON news.id = comments.news_id
     WHERE news.status = 'published'
     ORDER BY comments.created_at ASC`
  );
  sendJson(response, 200, {
    likes: likeRows.map((row) => ({
      newsId: row.newsId,
      count: Number(row.count || 0),
      likedByMe: Boolean(Number(row.likedByMe || 0))
    })),
    comments: commentRows.map((row) => publicComment(row, user))
  });
}

async function toggleNewsLike(request, response, newsId) {
  const user = await currentUser(request);
  if (!user) {
    sendJson(response, 401, { error: 'Login required.' });
    return;
  }
  const newsRows = await query('SELECT id, title FROM news WHERE id = ? AND status = ? LIMIT 1', [newsId, 'published']);
  if (newsRows.length === 0) {
    sendJson(response, 404, { error: 'News item not found.' });
    return;
  }
  const existing = await query('SELECT news_id FROM news_likes WHERE news_id = ? AND user_id = ? LIMIT 1', [newsId, user.id]);
  if (existing.length > 0) {
    await query('DELETE FROM news_likes WHERE news_id = ? AND user_id = ?', [newsId, user.id]);
  } else {
    await query('INSERT INTO news_likes (news_id, user_id) VALUES (?, ?)', [newsId, user.id]);
    await createSystemNotification({
      title: 'Nové srdíčko u aktuality',
      body: `${user.name || user.email} přidal/a srdíčko k aktualitě „${newsRows[0].title}“.`,
      tone: 'success',
      category: 'Aktuality',
      linkHref: `#/admin?tab=news&news=${encodeURIComponent(newsId)}`,
      createdBy: user.id
    });
  }
  const rows = await query(
    `SELECT
       COUNT(*) AS count,
       SUM(CASE WHEN user_id = ? THEN 1 ELSE 0 END) AS likedByMe
     FROM news_likes
     WHERE news_id = ?`,
    [user.id, newsId]
  );
  sendJson(response, 200, {
    like: {
      newsId,
      count: Number(rows[0]?.count || 0),
      likedByMe: Boolean(Number(rows[0]?.likedByMe || 0))
    }
  });
}

async function addNewsComment(request, response, newsId) {
  const user = await currentUser(request);
  if (!user) {
    sendJson(response, 401, { error: 'Login required.' });
    return;
  }
  const body = await readBody(request);
  const text = String(body.body || '').trim();
  if (!text) {
    sendJson(response, 400, { error: 'Comment body is required.' });
    return;
  }
  if (text.length > 3000) {
    sendJson(response, 400, { error: 'Comment is too long.' });
    return;
  }
  const newsRows = await query('SELECT id, title FROM news WHERE id = ? AND status = ? LIMIT 1', [newsId, 'published']);
  if (newsRows.length === 0) {
    sendJson(response, 404, { error: 'News item not found.' });
    return;
  }
  const parentId = String(body.parentId || '').trim() || null;
  if (parentId) {
    const parentRows = await query('SELECT id FROM news_comments WHERE id = ? AND news_id = ? LIMIT 1', [parentId, newsId]);
    if (parentRows.length === 0) {
      sendJson(response, 400, { error: 'Parent comment not found.' });
      return;
    }
  }
  const id = randomId();
  await query('INSERT INTO news_comments (id, news_id, parent_id, author_id, body) VALUES (?, ?, ?, ?, ?)', [
    id,
    newsId,
    parentId,
    user.id,
    text
  ]);
  const rows = await query(
    `SELECT
       comments.id,
       comments.news_id AS newsId,
       comments.parent_id AS parentId,
       comments.author_id AS authorId,
       users.name AS authorName,
       users.role AS authorRole,
       comments.body,
       comments.created_at AS createdAt,
       comments.updated_at AS updatedAt
     FROM news_comments comments
     JOIN users ON users.id = comments.author_id
     WHERE comments.id = ?
     LIMIT 1`,
    [id]
  );
  const comment = publicComment(rows[0], user);
  await createSystemNotification({
    title: parentId ? 'Nová odpověď u aktuality' : 'Nový komentář u aktuality',
    body: `${comment.authorName}: ${truncateText(comment.body)}`,
    tone: 'info',
    category: 'Komentáře',
    linkHref: `#/admin?tab=news&news=${encodeURIComponent(newsId)}&comment=${encodeURIComponent(comment.id)}`,
    createdBy: user.id
  });
  sendJson(response, 201, { comment });
}

async function updateNewsComment(request, response, commentId) {
  const user = await currentUser(request);
  if (!user) {
    sendJson(response, 401, { error: 'Login required.' });
    return;
  }
  const body = await readBody(request);
  const text = String(body.body || '').trim();
  if (!text) {
    sendJson(response, 400, { error: 'Comment body is required.' });
    return;
  }
  if (text.length > 3000) {
    sendJson(response, 400, { error: 'Comment is too long.' });
    return;
  }
  const existing = await query('SELECT id, author_id FROM news_comments WHERE id = ? LIMIT 1', [commentId]);
  if (existing.length === 0) {
    sendJson(response, 404, { error: 'Comment not found.' });
    return;
  }
  if (user.role !== 'admin' && existing[0].author_id !== user.id) {
    sendJson(response, 403, { error: 'You can edit only your own comment.' });
    return;
  }
  await query('UPDATE news_comments SET body = ? WHERE id = ?', [text, commentId]);
  const rows = await query(
    `SELECT
       comments.id,
       comments.news_id AS newsId,
       comments.parent_id AS parentId,
       comments.author_id AS authorId,
       users.name AS authorName,
       users.role AS authorRole,
       comments.body,
       comments.created_at AS createdAt,
       comments.updated_at AS updatedAt
     FROM news_comments comments
     JOIN users ON users.id = comments.author_id
     WHERE comments.id = ?
     LIMIT 1`,
    [commentId]
  );
  sendJson(response, 200, { comment: publicComment(rows[0], user) });
}

async function deleteNewsComment(request, response, commentId) {
  const user = await currentUser(request);
  if (!user) {
    sendJson(response, 401, { error: 'Login required.' });
    return;
  }
  const existing = await query('SELECT id, author_id FROM news_comments WHERE id = ? LIMIT 1', [commentId]);
  if (existing.length === 0) {
    sendJson(response, 404, { error: 'Comment not found.' });
    return;
  }
  if (user.role !== 'admin' && existing[0].author_id !== user.id) {
    sendJson(response, 403, { error: 'You can delete only your own comment.' });
    return;
  }
  await query('DELETE FROM news_comments WHERE id = ?', [commentId]);
  sendJson(response, 200, { ok: true, id: commentId });
}

function publicSlide(row) {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    imageUrl: row.imageUrl,
    ctaLabel: row.ctaLabel || '',
    ctaHref: row.ctaHref || '',
    sortOrder: Number(row.sortOrder || 0),
    isActive: Boolean(row.isActive)
  };
}

async function listSlides(_request, response) {
  const rows = await query(
    `SELECT
       id,
       title,
       subtitle,
       image_url AS imageUrl,
       cta_label AS ctaLabel,
       cta_href AS ctaHref,
       sort_order AS sortOrder,
       is_active AS isActive
     FROM home_slides
     WHERE is_active = 1
     ORDER BY sort_order ASC, created_at ASC
     LIMIT 40`
  );
  sendJson(response, 200, { slides: rows.map(publicSlide) });
}

async function saveSlide(request, response) {
  const user = await currentUser(request);
  if (!user || user.role !== 'admin') {
    sendJson(response, 403, { error: 'Admin access required.' });
    return;
  }
  const body = await readBody(request);
  const missing = requireFields(body, ['title', 'subtitle', 'imageUrl']);
  if (missing) {
    sendJson(response, 400, { error: missing });
    return;
  }
  const id = body.id || randomId();
  const sortOrder = Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0;
  const isActive = body.isActive === false ? 0 : 1;
  await query(
    `INSERT INTO home_slides (id, title, subtitle, image_url, cta_label, cta_href, sort_order, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       title = VALUES(title),
       subtitle = VALUES(subtitle),
       image_url = VALUES(image_url),
       cta_label = VALUES(cta_label),
       cta_href = VALUES(cta_href),
       sort_order = VALUES(sort_order),
       is_active = VALUES(is_active)`,
    [
      id,
      body.title.trim(),
      body.subtitle.trim(),
      body.imageUrl.trim(),
      String(body.ctaLabel || '').trim(),
      String(body.ctaHref || '').trim(),
      sortOrder,
      isActive
    ]
  );
  const rows = await query(
    `SELECT
       id,
       title,
       subtitle,
       image_url AS imageUrl,
       cta_label AS ctaLabel,
       cta_href AS ctaHref,
       sort_order AS sortOrder,
       is_active AS isActive
     FROM home_slides
     WHERE id = ?
     LIMIT 1`,
    [id]
  );
  sendJson(response, 200, { slide: publicSlide(rows[0]) });
}

async function listClients(request, response) {
  const user = await currentUser(request);
  if (!user || user.role !== 'admin') {
    sendJson(response, 403, { error: 'Admin access required.' });
    return;
  }
  const rows = await query(
    `SELECT
       id,
       first_name AS firstName,
       last_name AS lastName,
       DATE_FORMAT(birth_date, '%Y-%m-%d') AS birthDate,
       phone,
       email,
       address,
       target_group AS targetGroup,
       program,
       status,
       notes,
       operational_id AS operationalId,
       DATE_FORMAT(created_at, '%Y-%m-%d') AS createdAt
     FROM clients
     ORDER BY created_at DESC
     LIMIT 200`
  );
  sendJson(response, 200, { clients: rows });
}

async function createClient(request, response) {
  const user = await currentUser(request);
  if (!user || user.role !== 'admin') {
    sendJson(response, 403, { error: 'Admin access required.' });
    return;
  }
  const body = await readBody(request);
  const missing = requireFields(body, ['firstName', 'lastName']);
  if (missing) {
    sendJson(response, 400, { error: missing });
    return;
  }
  const id = body.id || randomId();
  const operationalId = String(body.operationalId || '').trim() || null;
  await query(
    `INSERT INTO clients
       (id, first_name, last_name, birth_date, phone, email, address, target_group, program, status, notes, operational_id, created_by)
     VALUES (?, ?, ?, NULLIF(?, ''), ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       first_name = VALUES(first_name),
       last_name = VALUES(last_name),
       birth_date = VALUES(birth_date),
       phone = VALUES(phone),
       email = VALUES(email),
       address = VALUES(address),
       target_group = VALUES(target_group),
       program = VALUES(program),
       status = VALUES(status),
       notes = VALUES(notes),
       operational_id = VALUES(operational_id)`,
    [
      id,
      body.firstName.trim(),
      body.lastName.trim(),
      body.birthDate || '',
      body.phone || '',
      body.email || '',
      body.address || '',
      body.targetGroup || '',
      body.program || 'JAILBREAK',
      body.status || 'Nový kontakt',
      body.notes || '',
      operationalId,
      user.id
    ]
  );
  const rows = await query(
    `SELECT
       id,
       first_name AS firstName,
       last_name AS lastName,
       DATE_FORMAT(birth_date, '%Y-%m-%d') AS birthDate,
       phone,
       email,
       address,
       target_group AS targetGroup,
       program,
       status,
       notes,
       operational_id AS operationalId,
       DATE_FORMAT(created_at, '%Y-%m-%d') AS createdAt
     FROM clients
     WHERE id = ?`,
    [id]
  );
  sendJson(response, 200, { client: rows[0] });
}

function parseJsonValue(value, fallback) {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }
  return value;
}

function publicFormTemplate(row) {
  const schema = parseJsonValue(row.schemaJson || row.schema_json, []);
  const fields = Array.isArray(schema) ? schema : Array.isArray(schema.fields) ? schema.fields : [];
  const meta = Array.isArray(schema) ? {} : schema;
  const status = String(row.status || meta.status || '').trim() || (row.isCurrent === 0 || row.is_current === 0 ? 'legacy' : 'active');
  const isCurrent = row.isCurrent === undefined && row.is_current === undefined ? status === 'active' : Boolean(row.isCurrent ?? row.is_current);
  return {
    id: row.id,
    formUid: row.formUid || row.form_uid || meta.formUid || meta.form_uid || '',
    formGroup: row.formGroup || row.form_group || meta.formGroup || meta.form_group || '',
    title: row.title,
    description: row.description || '',
    fields: fields
      .filter((field) => field && field.key && field.label)
      .map((field) => ({
        key: String(field.key),
        label: String(field.label),
        rows: Number.isFinite(Number(field.rows)) ? Number(field.rows) : undefined
      })),
    fileUrl: meta.fileUrl || meta.file_url || '',
    folder: meta.folder || '',
    sourceNote: meta.sourceNote || meta.source_note || '',
    sizeBytes: Number(meta.sizeBytes || meta.size_bytes || 0),
    status,
    isCurrent,
    isActive: Boolean(row.isActive ?? row.is_active ?? (status === 'active' && isCurrent))
  };
}

async function listFormTemplates(request, response) {
  const user = await requireAdmin(request, response);
  if (!user) return;
  try {
    const documentRows = await query(
      `SELECT
         id,
         form_uid AS formUid,
         form_group AS formGroup,
         category_code AS categoryCode,
         category_title AS categoryTitle,
         document_code AS documentCode,
         title,
         version,
         file_name AS fileName,
         file_path AS filePath,
         sensitivity,
         status,
         is_current AS isCurrent,
         notes,
         sort_order AS sortOrder,
         size_bytes AS sizeBytes,
         source_note AS sourceNote
       FROM rest_art_document_files
       WHERE file_type = 'pdf'
         AND status = 'active'
         AND is_current = 1
       ORDER BY is_current DESC, category_code ASC, sort_order ASC, title ASC
       LIMIT 500`
    );
    if (documentRows.length > 0) {
      sendJson(response, 200, {
        templates: documentRows.map((row) => {
          const isProgramQuestionnaire = row.categoryCode === '11_PROGRAMOVE_DOTAZNIKY';
          return {
            id: `rest-art-doc-${row.id}`,
            title: row.documentCode ? `${row.documentCode} - ${row.title}` : row.title,
            description: `${row.categoryTitle || row.categoryCode || 'Formulář'}${row.version ? `, ${row.version}` : ''}. ${row.notes || ''}`.trim(),
            fields: isProgramQuestionnaire
              ? [
                  { key: 'internalId', label: 'Interní ID klienta', rows: 1 },
                  { key: 'clientName', label: 'Jméno klienta', rows: 1 },
                  { key: 'birthDate', label: 'Datum narození', rows: 1 },
                  { key: 'program', label: 'Program / vazba na podporu', rows: 1 },
                  { key: 'contact', label: 'Kontakt a adresa', rows: 2 },
                  { key: 'processingDate', label: 'Datum kontaktu / zpracování', rows: 1 },
                  { key: 'workerNote', label: 'Poznámka pracovníka k dotazníku', rows: 3 }
                ]
              : [
                  { key: 'handoverNote', label: 'Poznámka k vyplnění / předání', rows: 3 },
                  { key: 'signatureNote', label: 'Poznámka k podpisu nebo archivaci', rows: 3 }
                ],
            fileUrl: row.filePath || '',
            folder: row.categoryCode || '',
            formUid: row.formUid || '',
            formGroup: row.formGroup || '',
            status: row.status || 'active',
            isCurrent: Boolean(row.isCurrent),
            sourceNote: [row.fileName, row.sensitivity ? `citlivost: ${row.sensitivity}` : '', row.sourceNote || ''].filter(Boolean).join(' | '),
            sizeBytes: Number(row.sizeBytes || 0),
            isActive: row.status === 'active' && Boolean(row.isCurrent)
          };
        })
      });
      return;
    }
  } catch (error) {
    if (!String(error.message || '').includes("rest_art_document_files")) {
      throw error;
    }
  }
  const rows = await query(
    `SELECT
       id,
       title,
       description,
       schema_json AS schemaJson,
       is_active AS isActive
     FROM form_templates
     WHERE is_active = 1
     ORDER BY title ASC`
  );
  sendJson(response, 200, { templates: rows.map(publicFormTemplate) });
}

function publicManagedUser(row) {
  return {
    id: row.id,
    role: row.role,
    name: row.name,
    email: row.email,
    phone: row.phone || '',
    isActive: Boolean(row.isActive ?? row.is_active),
    lastLoginAt: row.lastLoginAt || row.last_login_at || null,
    createdAt: row.createdAt || row.created_at
  };
}

function publicProjectApplication(row) {
  return {
    id: row.id,
    userId: row.userId || row.user_id,
    userName: row.userName || row.user_name || '',
    userEmail: row.userEmail || row.user_email || '',
    requestedRole: row.requestedRole || row.requested_role,
    status: row.status,
    phone: row.phone || '',
    motivation: row.motivation || '',
    availability: row.availability || '',
    contribution: row.contribution || '',
    note: row.note || '',
    adminNote: row.adminNote || row.admin_note || '',
    reviewedBy: row.reviewedBy || row.reviewed_by || null,
    reviewedAt: row.reviewedAt || row.reviewed_at || null,
    createdAt: row.createdAt || row.created_at
  };
}

async function listMyProjectApplications(request, response) {
  const user = await currentUser(request);
  if (!user) {
    sendJson(response, 401, { error: 'Login required.' });
    return;
  }
  const rows = await query(
    `SELECT
       applications.id,
       applications.user_id AS userId,
       users.name AS userName,
       users.email AS userEmail,
       applications.requested_role AS requestedRole,
       applications.status,
       applications.phone,
       applications.motivation,
       applications.availability,
       applications.contribution,
       applications.note,
       applications.admin_note AS adminNote,
       applications.reviewed_by AS reviewedBy,
       applications.reviewed_at AS reviewedAt,
       applications.created_at AS createdAt
     FROM project_applications applications
     JOIN users ON users.id = applications.user_id
     WHERE applications.user_id = ?
     ORDER BY applications.created_at DESC
     LIMIT 20`,
    [user.id]
  );
  sendJson(response, 200, { applications: rows.map(publicProjectApplication) });
}

async function submitProjectApplication(request, response) {
  const user = await currentUser(request);
  if (!user || (!isPortalRole(user.role) && user.role !== 'admin')) {
    sendJson(response, 401, { error: 'Login required.' });
    return;
  }
  const body = await readBody(request);
  const requestedRole = String(body.requestedRole || '').trim();
  if (!applicationRoles.includes(requestedRole)) {
    sendJson(response, 400, { error: 'Valid requested role is required.' });
    return;
  }
  const pendingRows = await query(
    'SELECT id FROM project_applications WHERE user_id = ? AND status = ? LIMIT 1',
    [user.id, 'pending']
  );
  if (pendingRows.length > 0) {
    sendJson(response, 409, { error: 'Už máte jednu žádost čekající na vyřízení.' });
    return;
  }
  const id = randomId();
  await query(
    `INSERT INTO project_applications
       (id, user_id, requested_role, phone, motivation, availability, contribution, note)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      user.id,
      requestedRole,
      String(body.phone || user.phone || '').trim(),
      String(body.motivation || '').trim(),
      String(body.availability || '').trim(),
      String(body.contribution || '').trim(),
      String(body.note || '').trim()
    ]
  );
  const rows = await query(
    `SELECT
       applications.id,
       applications.user_id AS userId,
       users.name AS userName,
       users.email AS userEmail,
       applications.requested_role AS requestedRole,
       applications.status,
       applications.phone,
       applications.motivation,
       applications.availability,
       applications.contribution,
       applications.note,
       applications.admin_note AS adminNote,
       applications.reviewed_by AS reviewedBy,
       applications.reviewed_at AS reviewedAt,
       applications.created_at AS createdAt
     FROM project_applications applications
     JOIN users ON users.id = applications.user_id
     WHERE applications.id = ?
     LIMIT 1`,
    [id]
  );
  await createSystemNotification({
    title: 'Nová žádost o vstup do projektu',
    body: `${user.name || user.email} žádá o roli ${roleLabels[requestedRole] || requestedRole}.`,
    tone: 'warning',
    category: 'Žádosti',
    linkHref: `#/admin?tab=users&application=${encodeURIComponent(id)}`,
    createdBy: user.id
  });
  sendJson(response, 201, { application: publicProjectApplication(rows[0]) });
}

async function listProjectApplications(request, response) {
  const user = await requireAdmin(request, response);
  if (!user) return;
  const rows = await query(
    `SELECT
       applications.id,
       applications.user_id AS userId,
       users.name AS userName,
       users.email AS userEmail,
       applications.requested_role AS requestedRole,
       applications.status,
       applications.phone,
       applications.motivation,
       applications.availability,
       applications.contribution,
       applications.note,
       applications.admin_note AS adminNote,
       applications.reviewed_by AS reviewedBy,
       applications.reviewed_at AS reviewedAt,
       applications.created_at AS createdAt
     FROM project_applications applications
     JOIN users ON users.id = applications.user_id
     ORDER BY FIELD(applications.status, 'pending', 'approved', 'rejected'), applications.created_at DESC
     LIMIT 300`
  );
  sendJson(response, 200, { applications: rows.map(publicProjectApplication) });
}

async function reviewProjectApplication(request, response, applicationId) {
  const admin = await requireAdmin(request, response);
  if (!admin) return;
  const body = await readBody(request);
  const status = applicationStatuses.includes(body.status) ? body.status : null;
  if (!status || status === 'pending') {
    sendJson(response, 400, { error: 'Use approved or rejected status.' });
    return;
  }
  const rows = await query(
    `SELECT applications.id, applications.user_id, applications.requested_role, applications.status, users.role AS user_role, users.name, users.email
     FROM project_applications applications
     JOIN users ON users.id = applications.user_id
     WHERE applications.id = ?
     LIMIT 1`,
    [applicationId]
  );
  if (rows.length === 0) {
    sendJson(response, 404, { error: 'Application not found.' });
    return;
  }
  const requestedRole = String(body.approvedRole || rows[0].requested_role || '').trim();
  const approvedRole = applicationRoles.includes(requestedRole) ? requestedRole : null;
  if (status === 'approved' && !approvedRole) {
    sendJson(response, 400, { error: 'Approved role is required.' });
    return;
  }
  await query(
    `UPDATE project_applications
     SET status = ?, admin_note = ?, reviewed_by = ?, reviewed_at = NOW()
     WHERE id = ?`,
    [status, String(body.adminNote || '').trim(), admin.id, applicationId]
  );
  if (status === 'approved') {
    await query('UPDATE users SET role = ?, is_active = 1 WHERE id = ?', [approvedRole, rows[0].user_id]);
  }
  const adminNote = String(body.adminNote || '').trim();
  const approvedMessage = `Dobrá zpráva: vaše žádost byla schválena. Účet je nyní vedený jako ${roleLabels[approvedRole] || approvedRole}. V portálu můžete pokračovat dalším krokem podle instrukcí týmu REST||ART Integrace.`;
  const rejectedMessage =
    adminNote ||
    'Bohužel vaši žádost nyní nemůžeme schválit z kapacitních důvodů. Děkujeme za pochopení. Pokud se možnosti projektu rozšíří, můžeme se k žádosti vrátit.';
  await createSystemNotification({
    recipientId: rows[0].user_id,
    title: status === 'approved' ? 'Žádost byla schválena' : 'Žádost zatím nemůžeme schválit',
    body: status === 'approved' ? approvedMessage : rejectedMessage,
    tone: status === 'approved' ? 'success' : 'error',
    category: 'Žádosti',
    linkHref: '#/klient',
    createdBy: admin.id
  });
  const updatedRows = await query(
    `SELECT
       applications.id,
       applications.user_id AS userId,
       users.name AS userName,
       users.email AS userEmail,
       applications.requested_role AS requestedRole,
       applications.status,
       applications.phone,
       applications.motivation,
       applications.availability,
       applications.contribution,
       applications.note,
       applications.admin_note AS adminNote,
       applications.reviewed_by AS reviewedBy,
       applications.reviewed_at AS reviewedAt,
       applications.created_at AS createdAt
     FROM project_applications applications
     JOIN users ON users.id = applications.user_id
     WHERE applications.id = ?
     LIMIT 1`,
    [applicationId]
  );
  const userRows = await query(
    `SELECT
       id,
       role,
       name,
       email,
       phone,
       is_active AS isActive,
       last_login_at AS lastLoginAt,
       created_at AS createdAt
     FROM users
     WHERE id = ?
     LIMIT 1`,
    [rows[0].user_id]
  );
  sendJson(response, 200, { application: publicProjectApplication(updatedRows[0]), user: publicManagedUser(userRows[0]) });
}

async function listUsers(request, response) {
  const user = await requireAdmin(request, response);
  if (!user) return;
  const rows = await query(
    `SELECT
       id,
       role,
       name,
       email,
       phone,
       is_active AS isActive,
       last_login_at AS lastLoginAt,
       created_at AS createdAt
     FROM users
     ORDER BY created_at DESC
     LIMIT 300`
  );
  sendJson(response, 200, { users: rows.map(publicManagedUser) });
}

async function updateUser(request, response, userId) {
  const user = await requireAdmin(request, response);
  if (!user) return;
  const body = await readBody(request);
  const allowedRoles = new Set(assignableRoles);
  const role = allowedRoles.has(body.role) ? body.role : null;
  const isActive = body.isActive === false ? 0 : 1;
  if (!role) {
    sendJson(response, 400, { error: 'Valid role is required.' });
    return;
  }
  const currentRows = await query('SELECT id, role, name, email, is_active FROM users WHERE id = ? LIMIT 1', [userId]);
  if (currentRows.length === 0) {
    sendJson(response, 404, { error: 'User not found.' });
    return;
  }
  const wasActive = Boolean(currentRows[0].is_active);
  await query('UPDATE users SET role = ?, is_active = ? WHERE id = ?', [role, isActive, userId]);
  const rows = await query(
    `SELECT
       id,
       role,
       name,
       email,
       phone,
       is_active AS isActive,
       last_login_at AS lastLoginAt,
       created_at AS createdAt
     FROM users
     WHERE id = ?
     LIMIT 1`,
    [userId]
  );
  if (!wasActive && isActive === 1) {
    await createSystemNotification({
      recipientId: userId,
      title: 'Účet ověřen',
      body: `Váš účet byl ověřen administrátorem. Aktuální role: ${roleLabels[role] || role}.`,
      tone: 'success',
      category: 'Ověření účtu',
      linkHref: '#/klient',
      createdBy: user.id
    });
  }
  sendJson(response, 200, { user: publicManagedUser(rows[0]) });
}

async function resetUserPassword(request, response, userId) {
  const admin = await requireAdmin(request, response);
  if (!admin) return;
  const rows = await query(
    'SELECT id, role, name, email, is_active FROM users WHERE id = ? LIMIT 1',
    [userId]
  );
  if (rows.length === 0) {
    sendJson(response, 404, { error: 'User not found.' });
    return;
  }
  if (!rows[0].is_active) {
    sendJson(response, 409, { error: 'Inactive users must be activated before password reset.' });
    return;
  }
  const reset = await createPasswordResetForUser(rows[0], request);
  await createSystemNotification({
    recipientId: userId,
    title: 'Reset hesla připraven',
    body: reset.emailSent
      ? 'Administrátor vám odeslal odkaz pro obnovu hesla.'
      : 'Administrátor připravil reset hesla. Kontaktujte ho pro další postup.',
    tone: 'info',
    category: 'Bezpečnost',
    linkHref: '#/klient',
    createdBy: admin.id
  });
  sendJson(response, 200, { ...reset, email: rows[0].email });
}

async function deleteUser(request, response, userId) {
  const admin = await requireAdmin(request, response);
  if (!admin) return;
  if (admin.id === userId) {
    sendJson(response, 400, { error: 'You cannot delete your own account.' });
    return;
  }
  const rows = await query('SELECT id, role, name, email, is_active FROM users WHERE id = ? LIMIT 1', [userId]);
  if (rows.length === 0) {
    sendJson(response, 404, { error: 'User not found.' });
    return;
  }
  if (rows[0].role === 'admin' && rows[0].is_active) {
    const activeAdmins = await query("SELECT COUNT(*) AS count FROM users WHERE role = 'admin' AND is_active = 1");
    if (Number(activeAdmins[0]?.count || 0) <= 1) {
      sendJson(response, 409, { error: 'Cannot delete the last active admin account.' });
      return;
    }
  }
  await query('DELETE FROM users WHERE id = ?', [userId]);
  await createSystemNotification({
    title: 'Uživatel smazán',
    body: `${rows[0].name} (${rows[0].email}) byl/a smazán/a administrátorem.`,
    tone: 'warning',
    category: 'Bezpečnost',
    createdBy: admin.id
  });
  sendJson(response, 200, { ok: true, id: userId });
}

function publicMedia(row) {
  return {
    id: row.id,
    title: row.title,
    fileName: row.fileName || row.file_name,
    fileUrl: row.fileUrl || row.file_url,
    mimeType: row.mimeType || row.mime_type || '',
    fileSize: Number(row.fileSize || row.file_size || 0),
    category: row.category,
    altText: row.altText || row.alt_text || '',
    uploadedBy: row.uploadedBy || row.uploaded_by || null,
    createdAt: row.createdAt || row.created_at
  };
}

function normalizeUploadCategory(category) {
  const normalized = String(category || '').trim().toLowerCase();
  if (normalized === 'media') return 'media';
  return 'transparency';
}

function sanitizeUploadedFileName(value) {
  const fileName = String(value || '').trim();
  const safe = fileName.replace(/[^a-zA-Z0-9._-]/g, '-').replace(/-+/g, '-').replace(/\.{2,}/g, '.');
  return safe || `soubor-${Date.now()}`;
}

async function uploadMediaToPublicFolder(request, response) {
  const user = await requireAdmin(request, response);
  if (!user) return;

  const body = await readBody(request);
  const fileName = String(body.fileName || '').trim();
  const mimeType = String(body.mimeType || '').trim() || 'application/pdf';
  const contentBase64 = String(body.contentBase64 || '').trim();
  const category = normalizeUploadCategory(body.category);

  if (!fileName) {
    sendJson(response, 400, { error: 'fileName is required.' });
    return;
  }
  if (!contentBase64) {
    sendJson(response, 400, { error: 'contentBase64 is required.' });
    return;
  }

  let binary;
  try {
    binary = Buffer.from(contentBase64, 'base64');
  } catch (error) {
    sendJson(response, 400, { error: 'Invalid file payload.' });
    return;
  }

  if (!binary.length) {
    sendJson(response, 400, { error: 'Uploaded file is empty.' });
    return;
  }
  if (binary.length > 10_000_000) {
    sendJson(response, 413, { error: 'Uploaded file is too large.' });
    return;
  }

  const extensionByMime = {
    'application/pdf': '.pdf',
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp'
  };
  const extension = path.extname(fileName) || extensionByMime[mimeType.toLowerCase()] || '.pdf';
  const baseName = sanitizeUploadedFileName(path.basename(fileName, extension) || 'dokument');
  const safeName = `${randomId()}-${baseName}${extension}`;
  const uploadFolder = category === 'media' ? 'media' : 'transparency';
  const destination = path.resolve(__dirname, '..', 'public', 'documents', uploadFolder);

  await fs.promises.mkdir(destination, { recursive: true });
  const filePath = path.join(destination, safeName);
  await fs.promises.writeFile(filePath, binary);

  sendJson(response, 200, {
    media: {
      fileName: safeName,
      fileUrl: `/documents/${uploadFolder}/${safeName}`,
      mimeType,
      fileSize: binary.length
    }
  });
}

async function listPublicMedia(request, response) {
  const params = new URL(request.url, `http://${request.headers.host || 'localhost'}`);
  const category = normalizeUploadCategory(params.searchParams.get('category') || 'transparency');
  const rows = await query(
    `SELECT
       id,
       title,
       file_name AS fileName,
       file_url AS fileUrl,
       mime_type AS mimeType,
       file_size AS fileSize,
       category,
       alt_text AS altText,
       uploaded_by AS uploadedBy,
       created_at AS createdAt
     FROM media_files
     WHERE category = ?
     ORDER BY created_at DESC
     LIMIT 300`,
    [category]
  );
  sendJson(response, 200, { media: rows.map(publicMedia) });
}

async function listMedia(request, response) {
  const user = await requireAdmin(request, response);
  if (!user) return;
  const rows = await query(
    `SELECT
       id,
       title,
       file_name AS fileName,
       file_url AS fileUrl,
       mime_type AS mimeType,
       file_size AS fileSize,
       category,
       alt_text AS altText,
       uploaded_by AS uploadedBy,
       created_at AS createdAt
     FROM media_files
     ORDER BY created_at DESC
     LIMIT 300`
  );
  sendJson(response, 200, { media: rows.map(publicMedia) });
}

async function saveMedia(request, response) {
  const user = await requireAdmin(request, response);
  if (!user) return;
  const body = await readBody(request);
  const missing = requireFields(body, ['title', 'fileUrl']);
  if (missing) {
    sendJson(response, 400, { error: missing });
    return;
  }
  const id = body.id || randomId();
  const fileUrl = String(body.fileUrl).trim();
  const fileName = String(body.fileName || fileUrl.split('/').pop() || body.title).trim();
  await query(
    `INSERT INTO media_files (id, title, file_name, file_url, mime_type, file_size, category, alt_text, uploaded_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       title = VALUES(title),
       file_name = VALUES(file_name),
       file_url = VALUES(file_url),
       mime_type = VALUES(mime_type),
       file_size = VALUES(file_size),
       category = VALUES(category),
       alt_text = VALUES(alt_text),
       uploaded_by = VALUES(uploaded_by)`,
    [
      id,
      String(body.title).trim(),
      fileName,
      fileUrl,
      String(body.mimeType || '').trim() || null,
      Number.isFinite(Number(body.fileSize)) ? Number(body.fileSize) : null,
      String(body.category || 'image').trim(),
      String(body.altText || '').trim(),
      user.id
    ]
  );
  const rows = await query(
    `SELECT
       id,
       title,
       file_name AS fileName,
       file_url AS fileUrl,
       mime_type AS mimeType,
       file_size AS fileSize,
       category,
       alt_text AS altText,
       uploaded_by AS uploadedBy,
       created_at AS createdAt
     FROM media_files
     WHERE id = ?
     LIMIT 1`,
    [id]
  );
  sendJson(response, 200, { media: publicMedia(rows[0]) });
}

function publicDocument(row) {
  return {
    id: row.id,
    clientId: row.clientId || row.client_id || null,
    userId: row.userId || row.user_id || null,
    mediaId: row.mediaId || row.media_id || null,
    title: row.title,
    documentType: row.documentType || row.document_type,
    status: row.status,
    fileUrl: row.fileUrl || row.file_url || '',
    notes: row.notes || '',
    signedAt: row.signedAt || row.signed_at || null,
    createdAt: row.createdAt || row.created_at
  };
}

async function listDocuments(request, response) {
  const user = await currentUser(request);
  if (!user) {
    sendJson(response, 401, { error: 'Login required.' });
    return;
  }
  const isAdmin = user.role === 'admin';
  const rows = await query(
    `SELECT
       id,
       client_id AS clientId,
       user_id AS userId,
       media_id AS mediaId,
       title,
       document_type AS documentType,
       status,
       file_url AS fileUrl,
       notes,
       signed_at AS signedAt,
       created_at AS createdAt
     FROM client_documents
     ${isAdmin ? '' : 'WHERE user_id = ?'}
     ORDER BY created_at DESC
     LIMIT 300`,
    isAdmin ? [] : [user.id]
  );
  sendJson(response, 200, { documents: rows.map(publicDocument) });
}

async function saveDocument(request, response) {
  const user = await requireAdmin(request, response);
  if (!user) return;
  const body = await readBody(request);
  const missing = requireFields(body, ['title']);
  if (missing) {
    sendJson(response, 400, { error: missing });
    return;
  }
  const id = body.id || randomId();
  await query(
    `INSERT INTO client_documents
       (id, client_id, user_id, media_id, title, document_type, status, file_url, notes, created_by, signed_at)
     VALUES (?, NULLIF(?, ''), NULLIF(?, ''), NULLIF(?, ''), ?, ?, ?, NULLIF(?, ''), ?, ?, NULLIF(?, ''))
     ON DUPLICATE KEY UPDATE
       client_id = VALUES(client_id),
       user_id = VALUES(user_id),
       media_id = VALUES(media_id),
       title = VALUES(title),
       document_type = VALUES(document_type),
       status = VALUES(status),
       file_url = VALUES(file_url),
       notes = VALUES(notes),
       signed_at = VALUES(signed_at)`,
    [
      id,
      body.clientId || '',
      body.userId || '',
      body.mediaId || '',
      String(body.title).trim(),
      String(body.documentType || 'form').trim(),
      String(body.status || 'draft').trim(),
      String(body.fileUrl || '').trim(),
      String(body.notes || '').trim(),
      user.id,
      body.signedAt || ''
    ]
  );
  const rows = await query(
    `SELECT
       id,
       client_id AS clientId,
       user_id AS userId,
       media_id AS mediaId,
       title,
       document_type AS documentType,
       status,
       file_url AS fileUrl,
       notes,
       signed_at AS signedAt,
       created_at AS createdAt
     FROM client_documents
     WHERE id = ?
     LIMIT 1`,
    [id]
  );
  sendJson(response, 200, { document: publicDocument(rows[0]) });
}

function publicNotification(row) {
  return {
    id: row.id,
    recipientId: row.recipientId || row.recipient_id || null,
    title: row.title,
    body: row.body,
    tone: row.tone,
    category: row.category,
    linkHref: row.linkHref || row.link_href || '',
    readAt: row.readAt || row.read_at || null,
    createdAt: row.createdAt || row.created_at
  };
}

async function listNotifications(request, response) {
  const user = await currentUser(request);
  if (!user) {
    sendJson(response, 401, { error: 'Login required.' });
    return;
  }
  const isAdmin = user.role === 'admin';
  const rows = await query(
    `SELECT
       id,
       recipient_id AS recipientId,
       title,
       body,
       tone,
       category,
       link_href AS linkHref,
       read_at AS readAt,
       created_at AS createdAt
     FROM notifications
     WHERE ${isAdmin ? 'recipient_id IS NULL OR recipient_id = ?' : 'recipient_id = ?'}
     ORDER BY created_at DESC
     LIMIT 100`,
    [user.id]
  );
  sendJson(response, 200, { notifications: rows.map(publicNotification) });
}

async function saveNotification(request, response) {
  const user = await requireAdmin(request, response);
  if (!user) return;
  const body = await readBody(request);
  const missing = requireFields(body, ['title', 'body']);
  if (missing) {
    sendJson(response, 400, { error: missing });
    return;
  }
  const id = body.id || randomId();
  await query(
    `INSERT INTO notifications (id, recipient_id, title, body, tone, category, link_href, created_by)
     VALUES (?, NULLIF(?, ''), ?, ?, ?, ?, NULLIF(?, ''), ?)
     ON DUPLICATE KEY UPDATE
       recipient_id = VALUES(recipient_id),
       title = VALUES(title),
       body = VALUES(body),
       tone = VALUES(tone),
       category = VALUES(category),
       link_href = VALUES(link_href)`,
    [
      id,
      body.recipientId || '',
      String(body.title).trim(),
      String(body.body).trim(),
      String(body.tone || 'info').trim(),
      String(body.category || 'system').trim(),
      String(body.linkHref || '').trim(),
      user.id
    ]
  );
  const rows = await query(
    `SELECT
       id,
       recipient_id AS recipientId,
       title,
       body,
       tone,
       category,
       link_href AS linkHref,
       read_at AS readAt,
       created_at AS createdAt
     FROM notifications
     WHERE id = ?
     LIMIT 1`,
    [id]
  );
  sendJson(response, 200, { notification: publicNotification(rows[0]) });
}

async function markNotificationRead(request, response, notificationId) {
  const user = await currentUser(request);
  if (!user) {
    sendJson(response, 401, { error: 'Login required.' });
    return;
  }
  const params = user.role === 'admin' ? [notificationId] : [notificationId, user.id];
  const existing = await query(
    `SELECT id FROM notifications WHERE id = ? ${user.role === 'admin' ? '' : 'AND recipient_id = ?'} LIMIT 1`,
    params
  );
  if (existing.length === 0) {
    sendJson(response, 404, { error: 'Notification not found.' });
    return;
  }
  await query('UPDATE notifications SET read_at = NOW() WHERE id = ?', [notificationId]);
  sendJson(response, 200, { ok: true, id: notificationId });
}

async function deleteNotification(request, response, notificationId) {
  const user = await currentUser(request);
  if (!user) {
    sendJson(response, 401, { error: 'Login required.' });
    return;
  }
  const isAdmin = user.role === 'admin';
  const params = isAdmin ? [notificationId] : [notificationId, user.id];
  const existing = await query(
    `SELECT id, read_at AS readAt FROM notifications WHERE id = ? ${isAdmin ? '' : 'AND recipient_id = ?'} LIMIT 1`,
    params
  );
  if (existing.length === 0) {
    sendJson(response, 404, { error: 'Notification not found.' });
    return;
  }
  if (!isAdmin && !existing[0].readAt) {
    sendJson(response, 409, { error: 'Nejdřív notifikaci označte jako přečtenou.' });
    return;
  }
  await query('DELETE FROM notifications WHERE id = ?', [notificationId]);
  sendJson(response, 200, { ok: true, id: notificationId });
}

async function createApp(request, response) {
  try {
    const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);
    if (await servePublicDocument(request, response, url)) return;

    if (request.method === 'GET' && url.pathname === '/api/health') {
      sendJson(response, 200, { ok: true });
      return;
    }
    if (request.method === 'GET' && url.pathname === '/api/health/db') {
      const rows = await query('SELECT DATABASE() AS databaseName, CURRENT_USER() AS currentUser');
      sendJson(response, 200, {
        ok: true,
        database: rows[0]?.databaseName || null,
        user: rows[0]?.currentUser || null
      });
      return;
    }
    if (request.method === 'GET' && url.pathname === '/api/auth/google/start') return await startGoogleLogin(request, response, url);
    if (request.method === 'GET' && url.pathname === '/api/auth/google/callback') return await finishGoogleLogin(request, response, url);
    if (request.method === 'POST' && url.pathname === '/api/auth/register') return await registerClient(request, response);
    if (request.method === 'POST' && url.pathname === '/api/auth/login') return await login(request, response);
    if (request.method === 'GET' && url.pathname === '/api/auth/me') return await me(request, response);
    if (request.method === 'POST' && url.pathname === '/api/auth/logout') return await logout(request, response);
    if (request.method === 'POST' && url.pathname === '/api/auth/reset') return await resetPassword(request, response);
    if (request.method === 'POST' && url.pathname === '/api/auth/reset/confirm') return await confirmPasswordReset(request, response);
    if (request.method === 'GET' && url.pathname === '/api/applications/me') return await listMyProjectApplications(request, response);
    if (request.method === 'POST' && url.pathname === '/api/applications') return await submitProjectApplication(request, response);
    if (request.method === 'GET' && url.pathname === '/api/news') return await listNews(request, response);
    if (request.method === 'POST' && url.pathname === '/api/news') return await saveNews(request, response);
    if (request.method === 'GET' && url.pathname === '/api/news/discussion') return await listNewsDiscussion(request, response);
    const newsItemMatch = url.pathname.match(/^\/api\/news\/([^/]+)$/);
    if (request.method === 'DELETE' && newsItemMatch) return await deleteNews(request, response, newsItemMatch[1]);
    const newsLikeMatch = url.pathname.match(/^\/api\/news\/([^/]+)\/like$/);
    if (request.method === 'POST' && newsLikeMatch) return await toggleNewsLike(request, response, newsLikeMatch[1]);
    const newsCommentMatch = url.pathname.match(/^\/api\/news\/([^/]+)\/comments$/);
    if (request.method === 'POST' && newsCommentMatch) return await addNewsComment(request, response, newsCommentMatch[1]);
    const commentMatch = url.pathname.match(/^\/api\/comments\/([^/]+)$/);
    if (request.method === 'PATCH' && commentMatch) return await updateNewsComment(request, response, commentMatch[1]);
    if (request.method === 'DELETE' && commentMatch) return await deleteNewsComment(request, response, commentMatch[1]);
    if (request.method === 'GET' && url.pathname === '/api/slides') return await listSlides(request, response);
    if (request.method === 'POST' && url.pathname === '/api/slides') return await saveSlide(request, response);
    if (request.method === 'GET' && url.pathname === '/api/clients') return await listClients(request, response);
    if (request.method === 'POST' && url.pathname === '/api/clients') return await createClient(request, response);
    if (request.method === 'GET' && url.pathname === '/api/forms/templates') return await listFormTemplates(request, response);
    if (request.method === 'GET' && url.pathname === '/api/admin/users') return await listUsers(request, response);
    if (request.method === 'GET' && url.pathname === '/api/admin/applications') return await listProjectApplications(request, response);
    const projectApplicationMatch = url.pathname.match(/^\/api\/admin\/applications\/([^/]+)$/);
    if (request.method === 'PATCH' && projectApplicationMatch) return await reviewProjectApplication(request, response, projectApplicationMatch[1]);
    const userResetMatch = url.pathname.match(/^\/api\/admin\/users\/([^/]+)\/reset-password$/);
    if (request.method === 'POST' && userResetMatch) return await resetUserPassword(request, response, userResetMatch[1]);
    const userMatch = url.pathname.match(/^\/api\/admin\/users\/([^/]+)$/);
    if (request.method === 'PATCH' && userMatch) return await updateUser(request, response, userMatch[1]);
    if (request.method === 'DELETE' && userMatch) return await deleteUser(request, response, userMatch[1]);
    if (request.method === 'GET' && url.pathname === '/api/media/public') return await listPublicMedia(request, response);
    if (request.method === 'GET' && url.pathname === '/api/media') return await listMedia(request, response);
    if (request.method === 'POST' && url.pathname === '/api/media') return await saveMedia(request, response);
    if (request.method === 'POST' && url.pathname === '/api/media/upload') return await uploadMediaToPublicFolder(request, response);
    if (request.method === 'GET' && url.pathname === '/api/documents') return await listDocuments(request, response);
    if (request.method === 'POST' && url.pathname === '/api/documents') return await saveDocument(request, response);
    if (request.method === 'GET' && url.pathname === '/api/notifications') return await listNotifications(request, response);
    if (request.method === 'POST' && url.pathname === '/api/notifications') return await saveNotification(request, response);
    const notificationMatch = url.pathname.match(/^\/api\/notifications\/([^/]+)\/read$/);
    if (request.method === 'PATCH' && notificationMatch) return await markNotificationRead(request, response, notificationMatch[1]);
    const notificationDeleteMatch = url.pathname.match(/^\/api\/notifications\/([^/]+)$/);
    if (request.method === 'DELETE' && notificationDeleteMatch) return await deleteNotification(request, response, notificationDeleteMatch[1]);
    sendJson(response, 404, { error: 'Not found.' });
  } catch (error) {
    sendJson(response, 500, { error: error.message || 'Server error.' });
  }
}

module.exports = { createApp };
