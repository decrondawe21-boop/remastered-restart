const { query } = require('./db.cjs');
const {
  clearSessionCookie,
  createSessionToken,
  hashPassword,
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

function readBody(request) {
  return new Promise((resolve, reject) => {
    let raw = '';
    request.on('data', (chunk) => {
      raw += chunk.toString();
      if (raw.length > 1_000_000) {
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
    createdAt: row.created_at
  };
}

async function currentUser(request) {
  const cookies = parseCookies(request.headers.cookie || '');
  const payload = readSessionToken(cookies[sessionCookieName]);
  if (!payload) return null;
  const rows = await query(
    'SELECT id, role, name, email, phone, created_at FROM users WHERE id = ? AND is_active = 1 LIMIT 1',
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
    `INSERT INTO users (id, role, name, email, phone, password_hash, password_algo)
     VALUES (?, 'client', ?, ?, ?, ?, 'scrypt')`,
    [id, body.name.trim(), email, String(body.phone || '').trim(), hashPassword(body.password)]
  );

  const rows = await query('SELECT id, role, name, email, phone, created_at FROM users WHERE id = ? LIMIT 1', [id]);
  const user = rows[0];
  sendJson(response, 201, { user: publicUser(user) }, { 'set-cookie': sessionCookie(createSessionToken(user)) });
}

async function login(request, response) {
  const body = await readBody(request);
  const missing = requireFields(body, ['email', 'password']);
  if (missing) {
    sendJson(response, 400, { error: missing });
    return;
  }

  const role = body.role === 'admin' ? 'admin' : body.role === 'client' ? 'client' : null;
  const params = role ? [body.email.trim().toLowerCase(), role] : [body.email.trim().toLowerCase()];
  const rows = await query(
    `SELECT id, role, name, email, phone, password_hash, created_at
     FROM users
     WHERE email = ? ${role ? 'AND role = ?' : ''} AND is_active = 1
     LIMIT 1`,
    params
  );
  const user = rows[0];
  if (!user || !verifyPassword(body.password, user.password_hash)) {
    sendJson(response, 401, { error: 'Invalid credentials.' });
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

async function resetPassword(request, response) {
  const body = await readBody(request);
  if (!String(body.email || '').trim()) {
    sendJson(response, 400, { error: 'email is required.' });
    return;
  }
  sendJson(response, 200, { ok: true, message: 'Instrukce pro obnovu hesla jsou připravené.' });
}

async function listNews(_request, response) {
  const rows = await query(
    `SELECT id, title, DATE_FORMAT(published_at, '%Y-%m-%d') AS date, excerpt
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
    `SELECT id, title, DATE_FORMAT(published_at, '%Y-%m-%d') AS date, excerpt
     FROM news
     WHERE id = ?
     LIMIT 1`,
    [id]
  );
  sendJson(response, 200, { news: rows[0] });
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
  const newsRows = await query('SELECT id FROM news WHERE id = ? AND status = ? LIMIT 1', [newsId, 'published']);
  if (newsRows.length === 0) {
    sendJson(response, 404, { error: 'News item not found.' });
    return;
  }
  const existing = await query('SELECT news_id FROM news_likes WHERE news_id = ? AND user_id = ? LIMIT 1', [newsId, user.id]);
  if (existing.length > 0) {
    await query('DELETE FROM news_likes WHERE news_id = ? AND user_id = ?', [newsId, user.id]);
  } else {
    await query('INSERT INTO news_likes (news_id, user_id) VALUES (?, ?)', [newsId, user.id]);
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
  const newsRows = await query('SELECT id FROM news WHERE id = ? AND status = ? LIMIT 1', [newsId, 'published']);
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
  sendJson(response, 201, { comment: publicComment(rows[0], user) });
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
  await query(
    `INSERT INTO clients
       (id, first_name, last_name, birth_date, phone, email, address, target_group, program, status, notes, created_by)
     VALUES (?, ?, ?, NULLIF(?, ''), ?, ?, ?, ?, ?, ?, ?, ?)
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
       notes = VALUES(notes)`,
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
       DATE_FORMAT(created_at, '%Y-%m-%d') AS createdAt
     FROM clients
     WHERE id = ?`,
    [id]
  );
  sendJson(response, 200, { client: rows[0] });
}

async function createApp(request, response) {
  try {
    const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);
    if (request.method === 'GET' && url.pathname === '/api/health') {
      sendJson(response, 200, { ok: true });
      return;
    }
    if (request.method === 'POST' && url.pathname === '/api/auth/register') return registerClient(request, response);
    if (request.method === 'POST' && url.pathname === '/api/auth/login') return login(request, response);
    if (request.method === 'GET' && url.pathname === '/api/auth/me') return me(request, response);
    if (request.method === 'POST' && url.pathname === '/api/auth/logout') return logout(request, response);
    if (request.method === 'POST' && url.pathname === '/api/auth/reset') return resetPassword(request, response);
    if (request.method === 'GET' && url.pathname === '/api/news') return listNews(request, response);
    if (request.method === 'POST' && url.pathname === '/api/news') return saveNews(request, response);
    if (request.method === 'GET' && url.pathname === '/api/news/discussion') return listNewsDiscussion(request, response);
    const newsLikeMatch = url.pathname.match(/^\/api\/news\/([^/]+)\/like$/);
    if (request.method === 'POST' && newsLikeMatch) return toggleNewsLike(request, response, newsLikeMatch[1]);
    const newsCommentMatch = url.pathname.match(/^\/api\/news\/([^/]+)\/comments$/);
    if (request.method === 'POST' && newsCommentMatch) return addNewsComment(request, response, newsCommentMatch[1]);
    const commentMatch = url.pathname.match(/^\/api\/comments\/([^/]+)$/);
    if (request.method === 'PATCH' && commentMatch) return updateNewsComment(request, response, commentMatch[1]);
    if (request.method === 'DELETE' && commentMatch) return deleteNewsComment(request, response, commentMatch[1]);
    if (request.method === 'GET' && url.pathname === '/api/slides') return listSlides(request, response);
    if (request.method === 'POST' && url.pathname === '/api/slides') return saveSlide(request, response);
    if (request.method === 'GET' && url.pathname === '/api/clients') return listClients(request, response);
    if (request.method === 'POST' && url.pathname === '/api/clients') return createClient(request, response);
    sendJson(response, 404, { error: 'Not found.' });
  } catch (error) {
    sendJson(response, 500, { error: error.message || 'Server error.' });
  }
}

module.exports = { createApp };
