const { chromium } = require('playwright');
const { withPreviewServer } = require('./e2e-preview-server.cjs');

(async () => withPreviewServer(async (baseUrl) => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 920 } });

  await page.goto(`${baseUrl}/#/admin`, { waitUntil: 'networkidle' });
  const cookieButton = page.getByRole('button', { name: 'Pouze nezbytné' });
  if ((await cookieButton.count()) > 0) {
    await cookieButton.click();
  }
  if (!(await page.getByRole('heading', { name: 'Přihlášení do administrace' }).isVisible())) {
    throw new Error('Admin route should show a protected login screen.');
  }

  const adminPassword = page.getByLabel('Heslo', { exact: true });
  if ((await adminPassword.getAttribute('type')) !== 'password') {
    throw new Error('Admin password should be hidden by default.');
  }
  await page.getByRole('button', { name: 'Zobrazit heslo' }).click();
  if ((await adminPassword.getAttribute('type')) !== 'text') {
    throw new Error('Password visibility toggle should reveal the current password.');
  }

  await page.getByRole('button', { name: 'Zapomenuté heslo' }).click();
  await page.getByLabel('E-mail pro obnovu').fill('admin@restart.test');
  await page.getByRole('button', { name: 'Odeslat obnovu' }).click();
  await page.getByRole('dialog', { name: 'Obnova hesla' }).waitFor({ state: 'visible', timeout: 5000 });
  if ((await page.getByText(/Pokud účet existuje|Instrukce pro obnovu hesla/).count()) === 0) {
    throw new Error('Password reset confirmation is missing.');
  }
  if (!(await page.getByRole('dialog', { name: 'Obnova hesla' }).isVisible())) {
    throw new Error('Password reset modal is missing.');
  }
  await page.getByRole('button', { name: 'Rozumím' }).click();

  await page.goto(`${baseUrl}/#/klient`, { waitUntil: 'networkidle' });
  const testEmail = `jan-${Date.now()}@example.test`;
  if (!(await page.getByRole('heading', { name: 'Klientský portál' }).isVisible())) {
    throw new Error('Client route should show client profile authentication.');
  }
  await page.getByRole('button', { name: 'Registrace uchazeče' }).click();
  await page.getByLabel('Jméno a příjmení').fill('Jan Novak');
  await page.getByLabel('E-mail').fill(testEmail);
  await page.getByLabel('Telefon').fill('+420 777 111 222');
  await page.getByLabel('Heslo', { exact: true }).fill('tajneheslo');
  await page.getByRole('button', { name: 'Vytvořit profil' }).click();
  if ((await page.getByText('Souhlas chybí').count()) === 0) {
    throw new Error('Registration should require consent checkbox.');
  }
  await page.getByLabel('Souhlasím se zpracováním údajů').click();
  await page.getByRole('button', { name: 'Vytvořit profil' }).click();

  const registrationResult = await Promise.race([
    page.getByRole('heading', { name: 'Jan Novak', level: 1 }).waitFor({ state: 'visible', timeout: 10000 }).then(() => 'profile'),
    page.getByText(/Registrace byla přijata|čeká na ověření administrátorem/).first().waitFor({ state: 'visible', timeout: 10000 }).then(() => 'pending')
  ]);

  if (registrationResult === 'pending') {
    await browser.close();
    console.log('Auth validation passed.');
    return;
  }

  if (!(await page.getByRole('heading', { name: 'Jan Novak', level: 1 }).isVisible())) {
    throw new Error('Registered client should land in profile GUI.');
  }
  await page.getByRole('button', { name: /Můj profil/ }).click();
  if (!(await page.getByRole('heading', { name: 'Můj profil', level: 1 }).isVisible())) {
    throw new Error('Client profile should expose a profile GUI section.');
  }
  await page.getByRole('button', { name: /Žádost o vstup/ }).click();
  if (!(await page.getByRole('heading', { name: 'Žádost o vstup do projektu' }).isVisible())) {
    throw new Error('Applicant profile should expose the project application form.');
  }

  await browser.close();
  console.log('Auth validation passed.');
}))().catch(async (error) => {
  console.error(error.message);
  process.exit(1);
});
