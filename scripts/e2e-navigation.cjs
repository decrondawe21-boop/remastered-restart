const { chromium } = require('playwright');

const baseUrl = process.env.RESTART_TEST_URL || 'http://127.0.0.1:4173';

(async () => {
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
  const signIn = page.getByRole('link', { name: 'Sign in', exact: true });
  if ((await signIn.getAttribute('href')) !== '#/admin') {
    throw new Error('Sign in icon should point to #/admin.');
  }
  const tooltipPosition = await signIn.evaluate((element) => {
    const style = window.getComputedStyle(element, '::after');
    return { top: Number.parseFloat(style.top) };
  });
  if (!Number.isFinite(tooltipPosition.top) || tooltipPosition.top <= 0) {
    throw new Error('Sign in tooltip should open below the icon so it stays inside the viewport.');
  }
  const signUp = page.getByRole('link', { name: 'Sign up', exact: true });
  if ((await signUp.getAttribute('href')) !== '#/klient') {
    throw new Error('Sign up should point to #/klient.');
  }

  const kontaktLink = mainNav.getByRole('link', {
    name: 'Kontakt',
    exact: true
  });
  const kontaktHref = await kontaktLink.getAttribute('href');
  if (kontaktHref !== '#/kontakt') {
    throw new Error(`Kontakt link should point to #/kontakt, got ${kontaktHref}`);
  }

  await kontaktLink.click();
  await page.waitForURL('**/#/kontakt');

  const bodyText = await page.locator('body').innerText();
  if (!bodyText.includes('Nacházíte se:')) {
    throw new Error('Breadcrumb label is missing.');
  }
  const breadcrumbText = await page.locator('.breadcrumb-bar').innerText();
  for (const item of ['Domů', 'Kontakt', 'Formulář']) {
    if (!breadcrumbText.includes(item)) {
      throw new Error(`Kontakt breadcrumb is missing ${item}.`);
    }
  }
  if (bodyText.includes('Šest cest podle konkrétní situace člověka')) {
    throw new Error('Kontakt page still contains unrelated one-page program section.');
  }

  await browser.close();
  console.log('Navigation validation passed.');
})().catch(async (error) => {
  console.error(error.message);
  process.exit(1);
});
