const path = require('node:path');
const fs = require('node:fs');
const { chromium } = require('playwright');
const { loadDotEnv } = require(path.join(process.cwd(), 'server/env.cjs'));
const { getPool, query } = require(path.join(process.cwd(), 'server/db.cjs'));
const { hashPassword, randomId } = require(path.join(process.cwd(), 'server/security.cjs'));

loadDotEnv();

const baseUrl = 'http://127.0.0.1:3000';
const outDir = path.join(process.cwd(), 'output', 'playwright', 'context-menu-guide');
fs.mkdirSync(outDir, { recursive: true });

const stamp = Date.now();
const adminId = randomId();
const managedUserId = randomId();
const applicantUserId = randomId();
const applicationId = randomId();
const commentId = randomId();
const notificationId = randomId();
const adminEmail = `screenshot.admin.${stamp}@example.test`;
const adminPassword = 'ScreenshotAdmin123!';
const newsTitle = `Ukázková aktualita - kontextové menu ${stamp}`;
let createdNewsId = null;

async function fetchJson(context, url, options = {}) {
  const response = await context.request.fetch(url, {
    ...options,
    headers: {
      'content-type': 'application/json',
      ...(options.headers || {})
    }
  });
  const text = await response.text();
  const body = text ? JSON.parse(text) : null;
  if (!response.ok()) {
    throw new Error(`${options.method || 'GET'} ${url} failed: ${response.status()} ${text}`);
  }
  return body;
}

async function clearGuide(page) {
  await page.evaluate(() => document.getElementById('codex-guide-layer')?.remove()).catch(() => {});
}

async function annotate(page, specs, caption) {
  const marks = [];
  for (const spec of specs) {
    const locator = spec.locator.first ? spec.locator.first() : spec.locator;
    await locator.scrollIntoViewIfNeeded().catch(() => {});
    const box = await locator.boundingBox();
    if (!box) continue;
    marks.push({
      label: spec.label,
      x: Math.max(6, box.x),
      y: Math.max(6, box.y),
      width: box.width,
      height: box.height
    });
  }

  await page.evaluate(({ marks, captionText }) => {
    document.getElementById('codex-guide-layer')?.remove();
    const layer = document.createElement('div');
    layer.id = 'codex-guide-layer';
    Object.assign(layer.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '2147483647',
      pointerEvents: 'none',
      fontFamily: 'Arial, sans-serif'
    });

    const caption = document.createElement('div');
    caption.textContent = captionText;
    Object.assign(caption.style, {
      position: 'absolute',
      top: '12px',
      left: '12px',
      maxWidth: '760px',
      padding: '10px 14px',
      borderRadius: '12px',
      background: 'rgba(225, 29, 72, 0.96)',
      color: '#fff',
      fontSize: '17px',
      fontWeight: '800',
      boxShadow: '0 12px 32px rgba(0,0,0,.25)'
    });
    layer.appendChild(caption);

    marks.forEach((mark, index) => {
      const rect = document.createElement('div');
      Object.assign(rect.style, {
        position: 'absolute',
        left: `${mark.x - 5}px`,
        top: `${mark.y - 5}px`,
        width: `${mark.width + 10}px`,
        height: `${mark.height + 10}px`,
        border: '4px solid #e11d48',
        borderRadius: '14px',
        boxSizing: 'border-box',
        boxShadow: '0 0 0 9999px rgba(255,255,255,.02), 0 0 0 2px rgba(255,255,255,.9)'
      });
      layer.appendChild(rect);

      const label = document.createElement('div');
      label.textContent = mark.label;
      const top = mark.y > 82 ? mark.y - 48 : mark.y + mark.height + 12;
      Object.assign(label.style, {
        position: 'absolute',
        left: `${Math.max(12, Math.min(mark.x, window.innerWidth - 420))}px`,
        top: `${top}px`,
        maxWidth: '390px',
        padding: '8px 11px',
        borderRadius: '999px',
        background: index === 0 ? '#e11d48' : '#0f7f48',
        color: '#fff',
        fontSize: '14px',
        fontWeight: '800',
        lineHeight: '1.2',
        boxShadow: '0 10px 24px rgba(0,0,0,.22)'
      });
      layer.appendChild(label);
    });

    document.body.appendChild(layer);
  }, { marks, captionText: caption });
}

async function captureMenu(page, trigger, popover, fileName, caption, clickLabel, menuLabel) {
  await clearGuide(page);
  await trigger.first().scrollIntoViewIfNeeded();
  await trigger.first().click();
  await popover.first().waitFor({ state: 'visible', timeout: 5000 });
  await annotate(page, [
    { locator: trigger, label: clickLabel },
    { locator: popover, label: menuLabel }
  ], caption);
  const filePath = path.join(outDir, fileName);
  await page.screenshot({ path: filePath, fullPage: false });
  await clearGuide(page);
  return filePath;
}

async function selectAdminTab(page, tabName, headingName) {
  await page.goto(`${baseUrl}/#/admin`, { waitUntil: 'domcontentloaded' });
  const cookieButton = page.getByRole('button', { name: /Pouze nezbytné|Přijmout/ }).first();
  if (await cookieButton.count()) await cookieButton.click().catch(() => {});
  await page.getByRole('button', { name: new RegExp(tabName) }).first().click();
  await page.getByRole('heading', { name: new RegExp(headingName) }).first().waitFor({ state: 'visible', timeout: 10000 });
}

(async () => {
  const createdFiles = [];
  let browser;
  try {
    await query(
      `INSERT INTO users (id, role, name, email, password_hash, is_active)
       VALUES (?, 'admin', 'Screenshot Admin', ?, ?, 1)`,
      [adminId, adminEmail, hashPassword(adminPassword)]
    );
    await query(
      `INSERT INTO users (id, role, name, email, password_hash, is_active)
       VALUES (?, 'client', 'Demo Klient Kontext', ?, ?, 1)`,
      [managedUserId, `screenshot.client.${stamp}@example.test`, hashPassword('DemoClient123!')]
    );
    await query(
      `INSERT INTO users (id, role, name, email, password_hash, is_active)
       VALUES (?, 'applicant', 'Demo Žadatel Kontext', ?, ?, 1)`,
      [applicantUserId, `screenshot.applicant.${stamp}@example.test`, hashPassword('DemoApplicant123!')]
    );
    await query(
      `INSERT INTO project_applications (id, user_id, requested_role, status, motivation)
       VALUES (?, ?, 'volunteer', 'pending', 'Ukázková žádost pro screenshot kontextového menu.')`,
      [applicationId, applicantUserId]
    );

    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
    const page = await context.newPage();

    await fetchJson(context, `${baseUrl}/api/auth/login`, {
      method: 'POST',
      data: { email: adminEmail, password: adminPassword, role: 'admin' }
    });

    const createdNews = await fetchJson(context, `${baseUrl}/api/news`, {
      method: 'POST',
      data: {
        title: newsTitle,
        date: '2026-06-18',
        excerpt: 'Ukázková aktualita pro ověření admin kontextového menu.',
        body: '<p>Ukázkové tělo aktuality pro screenshot test.</p>'
      }
    });
    createdNewsId = createdNews.news.id;

    await query(
      'INSERT INTO news_comments (id, news_id, parent_id, author_id, body) VALUES (?, ?, NULL, ?, ?)',
      [commentId, createdNewsId, applicantUserId, 'Ukázkový komentář uživatele pro admin akce.']
    );

    await fetchJson(context, `${baseUrl}/api/notifications`, {
      method: 'POST',
      data: {
        id: notificationId,
        title: 'Ukázková notifikace pro kontextové menu',
        body: 'Tady admin vidí detail, označení přečtené a otevření cíle pod třemi tečkami.',
        tone: 'info',
        category: 'Test menu',
        linkHref: '#/admin?tab=news'
      }
    });

    await selectAdminTab(page, 'Aktuality', 'Aktuality');
    await page.getByText(newsTitle).first().waitFor({ state: 'visible', timeout: 10000 });

    const newsRow = page.locator('.news-admin-row').filter({ hasText: newsTitle }).first();
    createdFiles.push(await captureMenu(
      page,
      newsRow.locator('.admin-context-trigger'),
      page.locator('.admin-context-popover'),
      '01-admin-aktuality-menu.png',
      'Aktuality v administraci: správa je pod tlačítkem se třemi tečkami.',
      '1) Klikni na tři tečky u aktuality',
      '2) Vyber Upravit nebo Smazat'
    ));

    await page.keyboard.press('Escape');
    await newsRow.locator('.news-admin-main').click();
    const dialog = page.locator('.news-editor-dialog').first();
    await dialog.waitFor({ state: 'visible', timeout: 5000 });
    createdFiles.push(await captureMenu(
      page,
      dialog.locator('.admin-context-trigger'),
      page.locator('.admin-context-popover'),
      '02-editor-aktuality-menu.png',
      'Editor aktuality: destruktivní akce zůstává schovaná v menu.',
      '1) V editoru klikni na tři tečky',
      '2) Tady je Smazat aktualitu'
    ));

    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: /Zavřít editor/ }).click();
    await page.goto(`${baseUrl}/aktuality`, { waitUntil: 'domcontentloaded' });
    await page.getByText(newsTitle).first().waitFor({ state: 'visible', timeout: 10000 });
    const publicNewsCard = page.locator('article').filter({ hasText: newsTitle }).first();
    const commentsToggle = publicNewsCard.getByRole('button', { name: /Zobrazit komentáře|Skrýt komentáře/ }).first();
    if (await commentsToggle.count()) await commentsToggle.click();
    const commentCard = publicNewsCard.locator('.comment-card').filter({ hasText: 'Ukázkový komentář' }).first();
    await commentCard.waitFor({ state: 'visible', timeout: 5000 });
    createdFiles.push(await captureMenu(
      page,
      commentCard.locator('.admin-context-trigger'),
      page.locator('.admin-context-popover'),
      '03-verejny-komentar-menu.png',
      'Komentář uživatele: admin akce jsou kompaktně pod menu.',
      '1) Klikni na tři tečky u komentáře',
      '2) Vyber Upravit nebo Smazat'
    ));

    await selectAdminTab(page, 'Uživatelé', 'Uživatelé');
    await page.getByText('Demo Žadatel Kontext').first().waitFor({ state: 'visible', timeout: 10000 });
    const applicationRow = page.locator('.application-review-row').filter({ hasText: 'Demo Žadatel Kontext' }).first();
    createdFiles.push(await captureMenu(
      page,
      applicationRow.locator('.admin-context-trigger'),
      page.locator('.admin-context-popover'),
      '04-zadost-menu.png',
      'Žádost o vstup: schválení i zamítnutí je v jednom admin menu.',
      '1) Klikni na tři tečky u žádosti',
      '2) Vyber Schválit nebo Uzavřít'
    ));

    await page.keyboard.press('Escape');
    const userRow = page.locator('.user-admin-row').filter({ hasText: 'Demo Klient Kontext' }).first();
    await userRow.waitFor({ state: 'visible', timeout: 10000 });
    createdFiles.push(await captureMenu(
      page,
      userRow.locator('.admin-context-trigger'),
      page.locator('.admin-context-popover'),
      '05-uzivatel-menu.png',
      'Uživatelé: detail, reset hesla a smazání účtu jsou schované pod menu.',
      '1) Klikni na tři tečky u uživatele',
      '2) Vyber Detail, Reset hesla nebo Smazat účet'
    ));

    await selectAdminTab(page, 'Notifikace', 'Notifikace');
    await page.getByText('Ukázková notifikace pro kontextové menu').first().waitFor({ state: 'visible', timeout: 10000 });
    const notificationRow = page.locator('.notification-admin-list article').filter({ hasText: 'Ukázková notifikace pro kontextové menu' }).first();
    createdFiles.push(await captureMenu(
      page,
      notificationRow.locator('.admin-context-trigger'),
      page.locator('.admin-context-popover'),
      '06-notifikace-menu.png',
      'Notifikace: detail, archivace přečtením a otevření cíle jsou pod jedním menu.',
      '1) Klikni na tři tečky u notifikace',
      '2) Vyber Detail, Označit přečtené nebo Otevřít cíl'
    ));

    console.log(createdFiles.join('\n'));
  } finally {
    if (browser) await browser.close();
    if (createdNewsId) {
      await query('DELETE FROM news_likes WHERE news_id = ?', [createdNewsId]).catch(() => {});
      await query('DELETE FROM news_comments WHERE news_id = ?', [createdNewsId]).catch(() => {});
      await query('DELETE FROM news WHERE id = ?', [createdNewsId]).catch(() => {});
    }
    await query('DELETE FROM notifications WHERE id = ? OR created_by = ?', [notificationId, adminId]).catch(() => {});
    await query('DELETE FROM project_applications WHERE id = ?', [applicationId]).catch(() => {});
    await query('DELETE FROM password_resets WHERE user_id IN (?, ?, ?)', [adminId, managedUserId, applicantUserId]).catch(() => {});
    await query('DELETE FROM users WHERE id IN (?, ?, ?)', [managedUserId, applicantUserId, adminId]).catch(() => {});
    await getPool().end().catch(() => {});
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});



