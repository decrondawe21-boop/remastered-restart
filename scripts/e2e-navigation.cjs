const { chromium } = require('playwright');
const { withPreviewServer } = require('./e2e-preview-server.cjs');

(async () => withPreviewServer(async (baseUrl) => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  await page.goto(baseUrl, { waitUntil: 'networkidle' });

  const mainNav = page.getByRole('navigation', { name: 'Hlavní navigace' });
  if ((await mainNav.getByRole('link', { name: 'Admin', exact: true }).count()) !== 0) {
    throw new Error('Admin should not be a text item in the main navigation.');
  }
  if ((await mainNav.getByRole('link', { name: 'Klientská zóna', exact: true }).count()) !== 0) {
    throw new Error('Klientská zóna should be hidden from the anonymous main navigation.');
  }
  const adminEntry = page.getByRole('link', { name: 'Administrace', exact: true });
  if ((await adminEntry.getAttribute('href')) !== '/admin') {
    throw new Error('Administrace should point to /admin.');
  }
  const clientEntry = page.getByRole('link', { name: 'Klientská zóna', exact: true });
  if ((await clientEntry.getAttribute('href')) !== '/klient') {
    throw new Error('Klientská zóna should point to /klient.');
  }

  const kontaktLink = mainNav.getByRole('link', {
    name: 'Kontakt',
    exact: true
  });
  const kontaktHref = await kontaktLink.getAttribute('href');
  if (kontaktHref !== '/kontakt') {
    throw new Error(`Kontakt link should point to /kontakt, got ${kontaktHref}`);
  }

  await kontaktLink.click();
  await page.waitForURL('**/kontakt');

  const bodyText = await page.locator('body').innerText();
  if (!bodyText.includes('Nacházíte se:')) {
    throw new Error('Breadcrumb label is missing.');
  }
  await page.waitForFunction(() => {
    const items = Array.from(document.querySelectorAll('.breadcrumb-bar a, .breadcrumb-bar strong')).map((element) =>
      element.textContent?.trim()
    );
    return ['Domů', 'Kontakt', 'Formulář'].every((item) => items.includes(item));
  });
  const breadcrumbItems = await page.locator('.breadcrumb-bar a, .breadcrumb-bar strong').allInnerTexts();
  for (const item of ['Domů', 'Kontakt', 'Formulář']) {
    if (!breadcrumbItems.includes(item)) {
      throw new Error(`Kontakt breadcrumb is missing ${item}.`);
    }
  }
  if (bodyText.includes('Šest cest podle konkrétní situace člověka')) {
    throw new Error('Kontakt page still contains unrelated one-page program section.');
  }

  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  const siteSearch = page.getByRole('search').first();
  await siteSearch.getByRole('textbox', { name: 'Vyhledat na celém webu' }).fill('metodika');
  await siteSearch.getByRole('button', { name: 'Vyhledat na webu' }).click();
  await page.waitForURL('**/vyhledavani?q=metodika');
  await page.getByRole('heading', { name: 'Výsledky vyhledávání', level: 1 }).waitFor();
  if ((await page.getByText(/výsled(?:ek|ky|ků) pro „metodika“/).count()) === 0) {
    throw new Error('Whole-site search did not render results for metodika.');
  }

  await page.goto(`${baseUrl}/metodika/slovnik-pojmu`, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: 'Slovník pojmů REST||ART Integrace', level: 1 }).waitFor();
  await page.getByText('Case management', { exact: true }).first().waitFor();
  const methodologyCanonical = await page.locator('link[rel="canonical"]').getAttribute('href');
  if (!methodologyCanonical?.endsWith('/metodika/slovnik-pojmu')) {
    throw new Error(`Methodology document canonical URL mismatch: ${methodologyCanonical}`);
  }
  const methodologyDownload = page.getByRole('link', { name: /Stáhnout originál DOCX/ }).first();
  if ((await methodologyDownload.getAttribute('href')) !== '/documents/methodology/slovnik-pojmu-rest-art-integrace-v0-9.docx') {
    throw new Error('Methodology glossary should link to its source DOCX file.');
  }

  await page.goto(`${baseUrl}/videa/predstaveni-projektu`, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: 'RESTART Integrace: krátké představení projektu', level: 1 }).waitFor();
  const watchVideo = page.locator('.video-watch-page video');
  if ((await watchVideo.count()) !== 1) {
    throw new Error('A watch page must contain exactly one primary video player.');
  }
  const watchVideoSource = await watchVideo.locator('source').getAttribute('src');
  if (watchVideoSource !== '/videos/rest-art-intro-z-podkladu-v1-720p.mp4') {
    throw new Error(`Unexpected watch page video source: ${watchVideoSource}`);
  }
  const videoPosition = await watchVideo.evaluate((element) => ({
    top: element.getBoundingClientRect().top,
    viewportHeight: window.innerHeight
  }));
  if (videoPosition.top >= videoPosition.viewportHeight) {
    throw new Error(`Primary video is below the first viewport: ${JSON.stringify(videoPosition)}`);
  }
  const videoCanonical = await page.locator('link[rel="canonical"]').getAttribute('href');
  if (!videoCanonical?.endsWith('/videa/predstaveni-projektu')) {
    throw new Error(`Video watch page canonical URL mismatch: ${videoCanonical}`);
  }
  const videoSchema = await page.locator('#video-watch-structured-data').textContent();
  if (!videoSchema?.includes('VideoObject') || !videoSchema.includes('rest-art-intro-z-podkladu-v1-720p.mp4')) {
    throw new Error('Video watch page is missing matching VideoObject structured data.');
  }

  await page.goto(`${baseUrl}/aktuality`, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: 'Co se v projektu děje', level: 1 }).waitFor();
  if ((await page.locator('.news-gallery-card').count()) < 3) {
    throw new Error('News listing should render the three-column card collection.');
  }
  const categoryLink = page.getByRole('link', { name: 'Média a materiály', exact: true }).first();
  if ((await categoryLink.getAttribute('href')) !== '/aktuality/media-a-materialy') {
    throw new Error('News category should have its own stable archive URL.');
  }
  await categoryLink.click();
  await page.waitForURL('**/aktuality/media-a-materialy');
  const articleLink = page.locator('.news-gallery-card .news-read-more').first();
  const articleHref = await articleLink.getAttribute('href');
  if (!articleHref?.startsWith('/aktuality/media-a-materialy/')) {
    throw new Error(`News article should have a category and slug URL, got ${articleHref}`);
  }
  await articleLink.click();
  await page.waitForURL(`**${articleHref}`);
  await page.locator('.story-detail-hero h1').waitFor();
  const canonicalHref = await page.locator('link[rel="canonical"]').getAttribute('href');
  if (!canonicalHref?.endsWith(articleHref)) {
    throw new Error(`News detail canonical URL mismatch: ${canonicalHref}`);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${baseUrl}/aktuality`, { waitUntil: 'networkidle' });
  const mobileLayout = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    cardWidth: document.querySelector('.news-gallery-card')?.getBoundingClientRect().width || 0
  }));
  if (mobileLayout.scrollWidth > mobileLayout.viewport + 1 || mobileLayout.cardWidth > mobileLayout.viewport) {
    throw new Error(`News listing overflows on mobile: ${JSON.stringify(mobileLayout)}`);
  }
  await page.setViewportSize({ width: 1280, height: 900 });

  const testAdmin = {
    id: 'e2e-media-admin',
    role: 'admin',
    name: 'E2E Media Admin',
    email: 'e2e-media-admin@restart.test',
    phone: '',
    password: 'not-used-in-test',
    createdAt: '2026-07-20'
  };
  await page.evaluate((account) => {
    window.localStorage.setItem('restart-auth-accounts', JSON.stringify([account]));
    window.localStorage.setItem('restart-auth-session', JSON.stringify(account.id));
  }, testAdmin);
  await page.goto(`${baseUrl}/#/admin`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Přidat médium', exact: true }).click();
  await page.getByRole('button', { name: 'Nové médium', exact: true }).click();
  await page.getByRole('dialog', { name: 'Detail média' }).waitFor({ state: 'visible' });

  const categorySelect = page.getByLabel('Kategorie', { exact: true });
  const mimeTypeSelect = page.getByLabel('MIME typ', { exact: true });
  if ((await categorySelect.evaluate((element) => element.tagName)) !== 'SELECT') {
    throw new Error('Media category should be a dropdown.');
  }
  if ((await mimeTypeSelect.evaluate((element) => element.tagName)) !== 'SELECT') {
    throw new Error('Media MIME type should be a dropdown.');
  }
  const categoryValues = await categorySelect.locator('option').evaluateAll((options) => options.map((option) => option.value));
  for (const expectedCategory of ['transparency', 'program-jailbreak', 'video', 'data-spreadsheet', 'source-file']) {
    if (!categoryValues.includes(expectedCategory)) {
      throw new Error(`Media category dropdown is missing ${expectedCategory}.`);
    }
  }
  const mimeTypeValues = await mimeTypeSelect.locator('option').evaluateAll((options) => options.map((option) => option.value));
  for (const expectedMimeType of [
    'application/pdf',
    'image/svg+xml',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'video/mp4',
    'application/zip',
    'font/woff2'
  ]) {
    if (!mimeTypeValues.includes(expectedMimeType)) {
      throw new Error(`Media MIME type dropdown is missing ${expectedMimeType}.`);
    }
  }

  await page.getByRole('dialog', { name: 'Detail média' }).getByRole('button', { name: 'Zavřít', exact: true }).click();
  const adminSidebar = page.getByRole('complementary', { name: 'Admin menu' });
  await adminSidebar.getByRole('button', { name: /Aktuality Publikace a archiv/ }).click();
  await page.getByRole('button', { name: 'Nová aktualita', exact: true }).click();
  const newsDialog = page.getByRole('dialog', { name: 'Editor aktuality' });
  await newsDialog.waitFor({ state: 'visible' });
  const newsTagSelect = newsDialog.locator('label').filter({ hasText: 'Rubrika / tag' }).locator('select');
  if ((await newsTagSelect.evaluate((element) => element.tagName)) !== 'SELECT') {
    throw new Error('News category should be a defined dropdown.');
  }
  const newsTagValues = await newsTagSelect.locator('option').evaluateAll((options) => options.map((option) => option.value));
  for (const expectedTag of ['JAILBREAK', 'Příběhy druhé šance', 'Data a výzkum', 'Pracovní příležitosti']) {
    if (!newsTagValues.includes(expectedTag)) {
      throw new Error(`News category dropdown is missing ${expectedTag}.`);
    }
  }
  await newsDialog.locator('label').filter({ hasText: 'Nadpis' }).locator('input').fill('Nová testovací aktualita');
  const generatedSlug = await newsDialog.locator('label').filter({ hasText: 'URL název stránky' }).locator('input').inputValue();
  if (generatedSlug !== 'nova-testovaci-aktualita') {
    throw new Error(`News slug was not generated from title: ${generatedSlug}`);
  }

  await browser.close();
  console.log('Navigation validation passed.');
}))().catch(async (error) => {
  console.error(error.message);
  process.exit(1);
});
