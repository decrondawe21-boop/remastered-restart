const { spawn } = require('node:child_process');
const { loadDotEnv } = require('../server/env.cjs');
const { query, getPool } = require('../server/db.cjs');
const { randomId } = require('../server/security.cjs');

loadDotEnv();

const required = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD', 'AUTH_SECRET'];
const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

const port = String(5100 + Math.floor(Math.random() * 800));
const baseUrl = `http://127.0.0.1:${port}`;
const builtInNewsId = 'news-darovane-knihy-a-jeden-nalez';
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
  let response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers: {
        'content-type': 'application/json',
        ...(options.headers || {})
      }
    });
  } catch (error) {
    throw new Error(`Request ${path} failed: ${error.message}\n${output}`);
  }
  const text = await response.text();
  const body = text ? JSON.parse(text) : null;
  return { response, body };
}

(async () => {
  let email = '';
  let commentId = '';
  let replyId = '';
  const likedNewsIds = new Set();
  let testNewsId = '';
  let notificationId = '';
  let builtInNewsWasPresent = true;
  try {
    await waitForServer();
    const seoArticle = await fetch(
      `${baseUrl}/api/seo/news-page?scope=stories&publicPath=story-petr-s-druha-sance`
    );
    const seoArticleHtml = await seoArticle.text();
    if (
      !seoArticle.ok ||
      !seoArticleHtml.includes('<h1>Petr S.: Dopis, ve kterém se člověk nechce vzdát</h1>') ||
      !seoArticleHtml.includes('data-seo-snapshot="news-article"') ||
      !seoArticleHtml.includes(
        '<link rel="canonical" href="https://restartintegrace.dk-i.cz/pribehy-druhe-sance/story-petr-s-druha-sance"'
      ) ||
      !seoArticleHtml.includes('"@type":"NewsArticle"')
    ) {
      throw new Error(`Dynamic news SEO page failed: status=${seoArticle.status}`);
    }
    const seoArchive = await fetch(
      `${baseUrl}/api/seo/news-page?publicPath=aktuality-projektu`
    );
    const seoArchiveHtml = await seoArchive.text();
    if (
      !seoArchive.ok ||
      !seoArchiveHtml.includes('<h1>Aktuality projektu</h1>') ||
      !seoArchiveHtml.includes('data-seo-snapshot="news-archive"') ||
      !seoArchiveHtml.includes('"@type":"CollectionPage"')
    ) {
      throw new Error(`Dynamic news tag archive failed: status=${seoArchive.status}`);
    }
    const newsSitemap = await fetch(`${baseUrl}/api/sitemap/news.xml`);
    const newsSitemapXml = await newsSitemap.text();
    if (
      !newsSitemap.ok ||
      !newsSitemapXml.includes(
        '/aktuality/komunita/darovane-knihy-dorazily-a-pribyl-i-jeden-necekany-nalez'
      )
    ) {
      throw new Error(`Built-in news sitemap entry failed: status=${newsSitemap.status}`);
    }

    email = `client.${Date.now()}@example.test`;
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
    if (
      !registered.response.ok ||
      registered.body.user.email !== email ||
      registered.body.user.role !== 'applicant' ||
      registered.body.user.isActive !== true ||
      registered.body.pendingVerification !== false
    ) {
      throw new Error(`Applicant registration failed: ${JSON.stringify(registered.body)}`);
    }
    const registrationCookie = registered.response.headers.get('set-cookie');
    if (!registrationCookie || !registrationCookie.includes('restart_session=')) {
      throw new Error('Applicant registration should set a session cookie.');
    }

    const application = await request('/api/applications', {
      method: 'POST',
      headers: { cookie: registrationCookie },
      body: JSON.stringify({
        requestedRole: 'client',
        phone: '+420 777 111 222',
        motivation: 'Chci se zapojit do projektu.',
        availability: 'Podle domluvy',
        contribution: 'Testovací žádost',
        note: 'E2E'
      })
    });
    if (!application.response.ok || application.body.application.status !== 'pending' || application.body.application.requestedRole !== 'client') {
      throw new Error(`Project application failed: ${JSON.stringify(application.body)}`);
    }

    const login = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role: 'client' })
    });
    if (!login.response.ok || login.body.user.email !== email) {
      throw new Error(`Client login failed: ${JSON.stringify(login.body)}`);
    }
    const loginCookie = login.response.headers.get('set-cookie');
    if (!loginCookie || !loginCookie.includes('restart_session=')) {
      throw new Error('Login should set an HttpOnly session cookie.');
    }

    const me = await request('/api/auth/me', {
      headers: { cookie: loginCookie }
    });
    if (!me.response.ok || me.body.user.email !== email) {
      throw new Error(`Session lookup failed: ${JSON.stringify(me.body)}`);
    }

    notificationId = randomId();
    await query(
      `INSERT INTO notifications (id, recipient_id, title, body, tone, category)
       SELECT ?, id, ?, ?, 'info', 'Test' FROM users WHERE email = ? LIMIT 1`,
      [notificationId, 'Test notifikace', `Mazání notifikace pro ${email}`, email]
    );
    const prematureNotificationDelete = await request(`/api/notifications/${encodeURIComponent(notificationId)}`, {
      method: 'DELETE',
      headers: { cookie: loginCookie }
    });
    if (prematureNotificationDelete.response.status !== 409) {
      throw new Error(`Unread notification delete should be blocked: ${JSON.stringify(prematureNotificationDelete.body)}`);
    }
    const notificationRead = await request(`/api/notifications/${encodeURIComponent(notificationId)}/read`, {
      method: 'PATCH',
      headers: { cookie: loginCookie }
    });
    if (!notificationRead.response.ok || notificationRead.body.ok !== true) {
      throw new Error(`Notification read failed: ${JSON.stringify(notificationRead.body)}`);
    }
    const notificationDelete = await request(`/api/notifications/${encodeURIComponent(notificationId)}`, {
      method: 'DELETE',
      headers: { cookie: loginCookie }
    });
    if (!notificationDelete.response.ok || notificationDelete.body.ok !== true) {
      throw new Error(`Notification delete failed: ${JSON.stringify(notificationDelete.body)}`);
    }
    notificationId = '';

    const logout = await request('/api/auth/logout', {
      method: 'POST',
      headers: { cookie: loginCookie }
    });
    if (!logout.response.ok) {
      throw new Error(`Logout failed: ${JSON.stringify(logout.body)}`);
    }

    const reset = await request('/api/auth/reset', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
    if (!reset.response.ok || !reset.body.resetToken) {
      throw new Error(`Password reset should return a development token: ${JSON.stringify(reset.body)}`);
    }
    const newPassword = 'noveTajneHeslo123';
    const confirmedReset = await request('/api/auth/reset/confirm', {
      method: 'POST',
      body: JSON.stringify({ token: reset.body.resetToken, password: newPassword })
    });
    if (!confirmedReset.response.ok || confirmedReset.body.ok !== true) {
      throw new Error(`Password reset confirmation failed: ${JSON.stringify(confirmedReset.body)}`);
    }
    const relogin = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password: newPassword, role: 'client' })
    });
    if (!relogin.response.ok || relogin.body.user.email !== email) {
      throw new Error(`Login with reset password failed: ${JSON.stringify(relogin.body)}`);
    }

    testNewsId = randomId();
    await query(
      `INSERT INTO news (id, title, excerpt, body, published_at, status)
       VALUES (?, ?, ?, ?, NOW(), 'published')`,
      [
        testNewsId,
        `API test aktualita ${Date.now()}`,
        'Dočasná aktualita pro API test.',
        '<h1>Vnořený nadpis z editoru</h1><p>Testovací obsah.</p>'
      ]
    );

    const news = await request('/api/news');
    if (!news.response.ok || !Array.isArray(news.body.news)) {
      throw new Error(`News endpoint failed: ${JSON.stringify(news.body)}`);
    }
    const firstNews = news.body.news.find((item) => item.id === testNewsId);
    if (!firstNews?.id) {
      throw new Error('News endpoint should return the temporary item for interaction tests.');
    }
    const seoTestNews = await fetch(
      `${baseUrl}/api/seo/news-page?publicPath=aktuality-projektu/${encodeURIComponent(firstNews.slug)}`
    );
    const seoTestNewsHtml = await seoTestNews.text();
    if (
      !seoTestNews.ok ||
      (seoTestNewsHtml.match(/<h1\b/gi) || []).length !== 1 ||
      !seoTestNewsHtml.includes('<h3>Vnořený nadpis z editoru</h3>')
    ) {
      throw new Error(`Dynamic news heading normalization failed: status=${seoTestNews.status}`);
    }

    const discussion = await request('/api/news/discussion', {
      headers: { cookie: loginCookie }
    });
    if (!discussion.response.ok || !Array.isArray(discussion.body.likes) || !Array.isArray(discussion.body.comments)) {
      throw new Error(`News discussion endpoint failed: ${JSON.stringify(discussion.body)}`);
    }

    builtInNewsWasPresent = (await query('SELECT id FROM news WHERE id = ? LIMIT 1', [builtInNewsId])).length > 0;
    const builtInLiked = await request(`/api/news/${encodeURIComponent(builtInNewsId)}/like`, {
      method: 'POST',
      headers: { cookie: loginCookie }
    });
    if (!builtInLiked.response.ok || builtInLiked.body.like.newsId !== builtInNewsId || builtInLiked.body.like.likedByMe !== true) {
      throw new Error(`Built-in news like failed: ${JSON.stringify(builtInLiked.body)}`);
    }
    likedNewsIds.add(builtInNewsId);

    const builtInUnliked = await request(`/api/news/${encodeURIComponent(builtInNewsId)}/like`, {
      method: 'POST',
      headers: { cookie: loginCookie }
    });
    if (!builtInUnliked.response.ok || builtInUnliked.body.like.newsId !== builtInNewsId || builtInUnliked.body.like.likedByMe !== false) {
      throw new Error(`Built-in news unlike failed: ${JSON.stringify(builtInUnliked.body)}`);
    }
    likedNewsIds.delete(builtInNewsId);

    const liked = await request(`/api/news/${encodeURIComponent(firstNews.id)}/like`, {
      method: 'POST',
      headers: { cookie: loginCookie }
    });
    if (!liked.response.ok || liked.body.like.newsId !== firstNews.id || liked.body.like.likedByMe !== true) {
      throw new Error(`News like failed: ${JSON.stringify(liked.body)}`);
    }
    likedNewsIds.add(firstNews.id);

    const comment = await request(`/api/news/${encodeURIComponent(firstNews.id)}/comments`, {
      method: 'POST',
      headers: { cookie: loginCookie },
      body: JSON.stringify({ body: 'Testovací komentář' })
    });
    if (!comment.response.ok || comment.body.comment.body !== 'Testovací komentář' || !comment.body.comment.canEdit) {
      throw new Error(`Comment creation failed: ${JSON.stringify(comment.body)}`);
    }
    commentId = comment.body.comment.id;

    const reply = await request(`/api/news/${encodeURIComponent(firstNews.id)}/comments`, {
      method: 'POST',
      headers: { cookie: loginCookie },
      body: JSON.stringify({ body: 'Testovací odpověď', parentId: comment.body.comment.id })
    });
    if (!reply.response.ok || reply.body.comment.parentId !== comment.body.comment.id) {
      throw new Error(`Reply creation failed: ${JSON.stringify(reply.body)}`);
    }
    replyId = reply.body.comment.id;

    const updated = await request(`/api/comments/${encodeURIComponent(comment.body.comment.id)}`, {
      method: 'PATCH',
      headers: { cookie: loginCookie },
      body: JSON.stringify({ body: 'Upravený testovací komentář' })
    });
    if (!updated.response.ok || updated.body.comment.body !== 'Upravený testovací komentář') {
      throw new Error(`Comment update failed: ${JSON.stringify(updated.body)}`);
    }

    const deleted = await request(`/api/comments/${encodeURIComponent(comment.body.comment.id)}`, {
      method: 'DELETE',
      headers: { cookie: loginCookie }
    });
    if (!deleted.response.ok || deleted.body.ok !== true) {
      throw new Error(`Comment delete failed: ${JSON.stringify(deleted.body)}`);
    }

    console.log('API validation passed.');
  } finally {
    server.kill();
    if (email) {
      if (replyId) await query('DELETE FROM news_comments WHERE id = ?', [replyId]).catch(() => undefined);
      if (commentId) await query('DELETE FROM news_comments WHERE id = ?', [commentId]).catch(() => undefined);
      for (const likedNewsId of likedNewsIds) {
        await query(
          'DELETE news_likes FROM news_likes JOIN users ON users.id = news_likes.user_id WHERE news_likes.news_id = ? AND users.email = ?',
          [likedNewsId, email]
        ).catch(() => undefined);
      }
      if (notificationId) await query('DELETE FROM notifications WHERE id = ?', [notificationId]).catch(() => undefined);
      await query('DELETE FROM notifications WHERE recipient_id = (SELECT id FROM users WHERE email = ? LIMIT 1)', [email]).catch(() => undefined);
      await query('DELETE FROM notifications WHERE created_by = (SELECT id FROM users WHERE email = ? LIMIT 1)', [email]).catch(() => undefined);
      await query('DELETE FROM notifications WHERE body LIKE ? OR title LIKE ?', [`%${email}%`, '%API test aktualita%']).catch(() => undefined);
      await query('DELETE FROM project_applications WHERE user_id = (SELECT id FROM users WHERE email = ? LIMIT 1)', [email]).catch(() => undefined);
      await query('DELETE FROM users WHERE email = ?', [email]).catch(() => undefined);
      if (testNewsId) await query('DELETE FROM news WHERE id = ?', [testNewsId]).catch(() => undefined);
      if (!builtInNewsWasPresent) await query('DELETE FROM news WHERE id = ?', [builtInNewsId]).catch(() => undefined);
      await getPool().end().catch(() => undefined);
    }
  }
})().catch((error) => {
  server.kill();
  console.error(error.message);
  process.exit(1);
});
