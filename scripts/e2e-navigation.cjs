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

  await browser.close();
  console.log('Navigation validation passed.');
}))().catch(async (error) => {
  console.error(error.message);
  process.exit(1);
});
