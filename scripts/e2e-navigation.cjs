const { chromium } = require('playwright');
const { withPreviewServer } = require('./e2e-preview-server.cjs');

(async () => withPreviewServer(async (baseUrl) => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  await page.goto(baseUrl, { waitUntil: 'networkidle' });

  const mainNav = page.getByRole('navigation', { name: 'Hlavní navigace' });
  const llmsResponse = await page.request.get(`${baseUrl}/llms.txt`);
  const llmsText = await llmsResponse.text();
  if (!llmsResponse.ok() || !llmsText.startsWith('# REST||ART Integrace\n') || !llmsText.includes('\n> REST||ART Integrace')) {
    throw new Error('llms.txt is missing or does not follow the expected Markdown structure.');
  }
  const headerWebMcpForm = page.locator('form[toolname="search_site_header"]');
  if ((await headerWebMcpForm.count()) !== 1 || !(await headerWebMcpForm.getAttribute('tooldescription'))) {
    throw new Error('Header search is missing a valid declarative WebMCP tool.');
  }
  const headerWebMcpQuery = headerWebMcpForm.locator('[name="query"]');
  if (!(await headerWebMcpQuery.getAttribute('toolparamdescription')) || !(await headerWebMcpQuery.evaluate((element) => element.hasAttribute('required')))) {
    throw new Error('Header WebMCP search parameter schema is incomplete.');
  }
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

  const galleryLink = mainNav.getByRole('link', {
    name: 'Galerie',
    exact: true
  });
  const galleryHref = await galleryLink.getAttribute('href');
  if (galleryHref !== '/galerie') {
    throw new Error(`Galerie link should point to /galerie, got ${galleryHref}`);
  }

  await page.goto(`${baseUrl}/galerie`, { waitUntil: 'networkidle' });
  await page.locator('.gallery-page h1').waitFor();
  const galleryCanonical = await page.locator('link[rel="canonical"]').getAttribute('href');
  if (!galleryCanonical?.endsWith('/galerie')) {
    throw new Error(`Gallery canonical URL mismatch: ${galleryCanonical}`);
  }
  if ((await page.locator('.gallery-tile').count()) === 0) {
    throw new Error('Gallery page did not render any photographs.');
  }
  await page.locator('.gallery-feature-image').click();
  const galleryDialog = page.getByRole('dialog');
  await galleryDialog.waitFor();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Escape');
  if (await galleryDialog.isVisible()) {
    throw new Error('Gallery lightbox did not close after pressing Escape.');
  }

  await page.goto(baseUrl, { waitUntil: 'networkidle' });

  await kontaktLink.click();
  await page.waitForURL('**/kontakt');

  const bodyText = await page.locator('body').innerText();
  const contactWebMcpForm = page.locator('form[toolname="prepare_contact_message"]');
  if ((await contactWebMcpForm.count()) !== 1 || await contactWebMcpForm.getAttribute('toolautosubmit') !== null) {
    throw new Error('Contact WebMCP tool must exist and require manual submission.');
  }
  for (const fieldName of ['name', 'contact', 'message']) {
    const field = contactWebMcpForm.locator(`[name="${fieldName}"]`);
    if (!(await field.getAttribute('toolparamdescription')) || !(await field.evaluate((element) => element.hasAttribute('required')))) {
      throw new Error(`Contact WebMCP schema is incomplete for ${fieldName}.`);
    }
  }
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
  if ((await page.locator('form[toolname="search_site_results"]').count()) !== 1) {
    throw new Error('Search results page is missing its declarative WebMCP tool.');
  }
  if ((await page.getByText(/výsled(?:ek|ky|ků) pro „metodika“/).count()) === 0) {
    throw new Error('Whole-site search did not render results for metodika.');
  }

  await page.goto(`${baseUrl}/zapojeni`, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: 'Pomoc může mít více podob', level: 1 }).waitFor();
  const supportRoutes = [
    ['/zapojeni/darovat-obleceni', 'Oblečení pro důstojný nový začátek'],
    ['/zapojeni/vybaveni-centra', 'Dejte vybavení další smysluplné využití'],
    ['/zapojeni/sbirka-knih', 'Knihy, které otevírají další cestu'],
    ['/darovat', 'Proměňte podporu v konkrétní krok']
  ];
  for (const [supportPath, heading] of supportRoutes) {
    const supportLink = page.locator(`a[href="${supportPath}"]`).first();
    if ((await supportLink.count()) !== 1) {
      throw new Error(`Support hub is missing a link to ${supportPath}.`);
    }
    await page.goto(`${baseUrl}${supportPath}`, { waitUntil: 'networkidle' });
    await page.getByRole('heading', { name: heading, level: 1 }).waitFor();
    const supportCanonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    if (!supportCanonical?.endsWith(supportPath)) {
      throw new Error(`Support page canonical URL mismatch for ${supportPath}: ${supportCanonical}`);
    }
    await page.getByRole('navigation', { name: 'Možnosti podpory' }).waitFor();
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
  const glossarySectionLink = page.locator('.methodology-document-toc a').last();
  const glossarySectionId = (await glossarySectionLink.getAttribute('href'))?.replace(/^#/, '');
  if (!glossarySectionId) throw new Error('Methodology glossary table of contents has no section target.');
  await glossarySectionLink.click();
  await page.waitForFunction((sectionId) => window.location.hash === `#${sectionId}`, glossarySectionId);
  await page.waitForFunction((sectionId) => {
    const target = document.getElementById(sectionId);
    if (!target) return false;
    const top = target.getBoundingClientRect().top;
    return top >= 0 && top <= 180;
  }, glossarySectionId);
  const glossarySectionBox = await page.locator(`#${glossarySectionId}`).boundingBox();
  if (!glossarySectionBox || glossarySectionBox.y < 0 || glossarySectionBox.y > 180) {
    throw new Error(`Methodology anchor did not scroll to its target: ${JSON.stringify(glossarySectionBox)}`);
  }

  await page.goto(`${baseUrl}/metodika`, { waitUntil: 'networkidle' });
  const compactTypography = await page.evaluate(() => ({
    body: Number.parseFloat(getComputedStyle(document.body).fontSize),
    heading: Number.parseFloat(getComputedStyle(document.querySelector('h1')).fontSize),
    subheading: Number.parseFloat(getComputedStyle(document.querySelector('h2')).fontSize),
    paragraph: Number.parseFloat(getComputedStyle(document.querySelector('main p:not(.section-label)')).fontSize)
  }));
  const expectedTypography = {
    body: [13.5, 14.5],
    heading: [30, 40.5],
    subheading: [20.5, 26.5],
    paragraph: [13.5, 14.5]
  };
  for (const [name, [minimum, maximum]] of Object.entries(expectedTypography)) {
    if (compactTypography[name] < minimum || compactTypography[name] > maximum) {
      throw new Error(`Standardized typography mismatch for ${name}: ${compactTypography[name]}px`);
    }
  }
  const charterCard = page.locator('.methodology-document-library-grid article').filter({ hasText: 'Charta' });
  if ((await charterCard.getByRole('link', { name: /Číst online/ }).getAttribute('href')) !== '/metodika/charta') {
    throw new Error('Methodology charter card should link to its public HTML page.');
  }
  if ((await charterCard.getByRole('link', { name: /Stáhnout DOCX/ }).getAttribute('href')) !== '/documents/methodology/charta-rest-art-integrace-v0-9.docx') {
    throw new Error('Methodology charter card should link to its source DOCX file.');
  }
  const charterDocumentResponse = await page.request.get(`${baseUrl}/documents/methodology/charta-rest-art-integrace-v0-9.docx`);
  const charterDocumentBody = await charterDocumentResponse.body();
  if (!charterDocumentResponse.ok() || charterDocumentBody.length < 100_000) {
    throw new Error(`Methodology charter DOCX is not downloadable: ${charterDocumentResponse.status()}`);
  }
  await Promise.all([
    page.waitForURL('**/metodika/charta'),
    charterCard.getByRole('link', { name: /Číst online/ }).click()
  ]);
  await page.getByRole('heading', { name: 'Charta REST||ART Integrace', level: 1 }).waitFor();

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

  await page.goto(`${baseUrl}/aktuality`, { waitUntil: 'domcontentloaded' });
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
  await page.getByRole('heading', { name: 'Veřejná knihovna projektu', level: 1 }).waitFor();
  await page.getByRole('heading', { name: 'Materiály, které vysvětlují systém v souvislostech', level: 2 }).waitFor();
  const mediaCategoryCards = page.locator('.news-gallery-card');
  if ((await mediaCategoryCards.count()) < 3) {
    throw new Error('Media and materials archive should contain at least three related articles.');
  }
  const articleLink = page.locator('.news-gallery-card .news-read-more').first();
  const articleHref = await articleLink.getAttribute('href');
  if (!articleHref?.startsWith('/aktuality/media-a-materialy/')) {
    throw new Error(`News article should have a category and slug URL, got ${articleHref}`);
  }
  await articleLink.click();
  await page.waitForURL(`**${articleHref}`);
  await page.locator('.story-detail-hero h1').waitFor();
  await page.getByRole('heading', { name: 'Související příspěvky', level: 2 }).waitFor();
  const canonicalHref = await page.locator('link[rel="canonical"]').getAttribute('href');
  if (!canonicalHref?.endsWith(articleHref)) {
    throw new Error(`News detail canonical URL mismatch: ${canonicalHref}`);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${baseUrl}/aktuality`, { waitUntil: 'domcontentloaded' });
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
