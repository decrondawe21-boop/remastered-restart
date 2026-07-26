const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const { PDFDocument } = require('pdf-lib');
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

async function requestRaw(path, options = {}) {
  return fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      'content-type': 'application/json',
      ...(options.headers || {})
    }
  });
}

(async () => {
  const stamp = Date.now();
  const stampText = String(stamp);
  const adminId = randomId();
  const managedUserId = randomId();
  const applicantUserId = randomId();
  const applicationId = randomId();
  const adminEmail = `admin.${stamp}@example.test`;
  const managedUserEmail = `managed.${stamp}@example.test`;
  const applicantEmail = `applicant.${stamp}@example.test`;
  const adminPassword = 'AdminTestHeslo123';
  let createdClientId = null;
  let createdNewsId = null;
  let createdMediaId = null;
  let createdDocumentId = null;
  let createdNotificationId = null;
  let createdMaterialOfferId = null;
  let duplicateClientId = null;
  let uploadedMediaPath = null;

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

    const materialOffer = await request('/api/material-offers', {
      method: 'POST',
      body: JSON.stringify({
        offerType: 'books',
        donorName: 'E2E Dárce',
        email: `darce.${stamp}@example.test`,
        phone: '',
        itemDescription: 'Testovací sada odborných knih',
        quantity: '2 krabice',
        locality: 'Počerady',
        transport: 'agreement',
        itemCondition: 'good',
        note: 'E2E integrační test',
        privacyConsent: true,
        photos: [{
          fileName: 'e2e-nabidka.png',
          mimeType: 'image/png',
          fileSize: 68,
          contentBase64: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='
        }]
      })
    });
    if (!materialOffer.response.ok || materialOffer.body.offer.status !== 'new') {
      throw new Error(`Material offer submission failed: ${JSON.stringify(materialOffer.body)}`);
    }
    createdMaterialOfferId = materialOffer.body.offer.id;

    const spoofedMaterialPhoto = await request('/api/material-offers', {
      method: 'POST',
      body: JSON.stringify({
        offerType: 'books',
        donorName: 'E2E Neplatný obrázek',
        email: `spatny-obrazek.${stamp}@example.test`,
        itemDescription: 'Kontrola MIME',
        quantity: '1 kus',
        locality: 'Počerady',
        transport: 'agreement',
        itemCondition: 'good',
        privacyConsent: true,
        photos: [{
          fileName: 'neni-obrazek.jpg',
          mimeType: 'image/jpeg',
          fileSize: 12,
          contentBase64: Buffer.from('neni obrazek').toString('base64')
        }]
      })
    });
    if (spoofedMaterialPhoto.response.status !== 400 || !String(spoofedMaterialPhoto.body?.error || '').includes('neodpovídá')) {
      throw new Error(`Spoofed material photo was not rejected: ${JSON.stringify(spoofedMaterialPhoto.body)}`);
    }

    const materialOfferList = await request('/api/admin/material-offers', { headers: { cookie } });
    const listedMaterialOffer = materialOfferList.body?.offers?.find((item) => item.id === createdMaterialOfferId);
    if (!materialOfferList.response.ok || !listedMaterialOffer || listedMaterialOffer.photos.length !== 1) {
      throw new Error(`Material offer list failed: ${JSON.stringify(materialOfferList.body)}`);
    }

    const materialPhoto = await requestRaw(listedMaterialOffer.photos[0].url, { headers: { cookie } });
    if (!materialPhoto.ok || materialPhoto.headers.get('content-type') !== 'image/png' || (await materialPhoto.arrayBuffer()).byteLength === 0) {
      throw new Error('Protected material offer photo could not be loaded.');
    }

    const reviewedMaterialOffer = await request(`/api/admin/material-offers/${encodeURIComponent(createdMaterialOfferId)}`, {
      method: 'PATCH',
      headers: { cookie },
      body: JSON.stringify({
        status: 'pickup_planned',
        adminNote: 'Vyzvednutí domluveno v E2E testu.',
        assignedTo: adminId,
        pickupAt: '2026-08-10T09:30:00.000Z',
        pickupAddress: 'Počerady 33',
        retentionUntil: '2027-01-31'
      })
    });
    if (
      !reviewedMaterialOffer.response.ok ||
      reviewedMaterialOffer.body.offer.status !== 'pickup_planned' ||
      reviewedMaterialOffer.body.offer.assignedTo !== adminId ||
      reviewedMaterialOffer.body.offer.pickupAddress !== 'Počerady 33' ||
      !reviewedMaterialOffer.body.offer.events.some((event) => event.eventType === 'status_changed')
    ) {
      throw new Error(`Material offer review failed: ${JSON.stringify(reviewedMaterialOffer.body)}`);
    }

    const emailTemplates = await request('/api/admin/email-templates', { headers: { cookie } });
    const confirmationTemplate = emailTemplates.body?.templates?.find((template) => template.key === 'material_offer_donor_confirmation');
    if (!emailTemplates.response.ok || !confirmationTemplate) {
      throw new Error(`Email templates list failed: ${JSON.stringify(emailTemplates.body)}`);
    }
    const savedEmailTemplate = await request(`/api/admin/email-templates/${encodeURIComponent(confirmationTemplate.key)}`, {
      method: 'PATCH',
      headers: { cookie },
      body: JSON.stringify(confirmationTemplate)
    });
    if (!savedEmailTemplate.response.ok || savedEmailTemplate.body.template.key !== confirmationTemplate.key) {
      throw new Error(`Email template update failed: ${JSON.stringify(savedEmailTemplate.body)}`);
    }

    const uploadedMedia = await request('/api/media/upload', {
      method: 'POST',
      headers: { cookie },
      body: JSON.stringify({
        fileName: `e2e-media-upload-${stamp}`,
        mimeType: 'text/plain',
        fileSize: 17,
        category: 'methodology',
        contentBase64: Buffer.from('E2E media upload').toString('base64')
      })
    });
    if (!uploadedMedia.response.ok || !uploadedMedia.body.media.fileUrl.startsWith('/documents/media/') || !uploadedMedia.body.media.fileUrl.endsWith('.txt')) {
      throw new Error(`Media upload routing failed: ${JSON.stringify(uploadedMedia.body)}`);
    }
    uploadedMediaPath = path.join(process.cwd(), 'public', ...uploadedMedia.body.media.fileUrl.split('/').filter(Boolean));
    if (!fs.existsSync(uploadedMediaPath)) {
      throw new Error(`Uploaded media file is missing at ${uploadedMediaPath}.`);
    }

    const users = await request('/api/admin/users', { headers: { cookie } });
    if (!users.response.ok || !users.body.users.some((user) => user.id === adminId && user.role === 'admin')) {
      throw new Error(`Temporary admin is missing from user list: ${JSON.stringify(users.body)}`);
    }

    await query(
      `INSERT INTO users (id, role, name, email, password_hash, is_active)
       VALUES (?, 'client', 'E2E Managed Client', ?, ?, 1)`,
      [managedUserId, managedUserEmail, hashPassword('ManagedClientHeslo123')]
    );

    await query(
      `INSERT INTO users (id, role, name, email, password_hash, is_active)
       VALUES (?, 'applicant', 'E2E Applicant', ?, ?, 1)`,
      [applicantUserId, applicantEmail, hashPassword('ApplicantHeslo123')]
    );
    await query(
      `INSERT INTO project_applications (id, user_id, requested_role, status, motivation)
       VALUES (?, ?, 'volunteer', 'pending', 'Chci pomoci jako dobrovolník.')`,
      [applicationId, applicantUserId]
    );

    const applications = await request('/api/admin/applications', { headers: { cookie } });
    if (!applications.response.ok || !applications.body.applications.some((item) => item.id === applicationId && item.status === 'pending')) {
      throw new Error(`Admin applications list failed: ${JSON.stringify(applications.body)}`);
    }

    const reviewedApplication = await request(`/api/admin/applications/${encodeURIComponent(applicationId)}`, {
      method: 'PATCH',
      headers: { cookie },
      body: JSON.stringify({ status: 'approved', approvedRole: 'volunteer', adminNote: 'E2E schválení.' })
    });
    if (!reviewedApplication.response.ok || reviewedApplication.body.application.status !== 'approved' || reviewedApplication.body.user.role !== 'volunteer') {
      throw new Error(`Admin application review failed: ${JSON.stringify(reviewedApplication.body)}`);
    }

    const resetManaged = await request(`/api/admin/users/${encodeURIComponent(managedUserId)}/reset-password`, {
      method: 'POST',
      headers: { cookie }
    });
    if (!resetManaged.response.ok || resetManaged.body.email !== managedUserEmail || !resetManaged.body.resetToken) {
      throw new Error(`Admin password reset failed: ${JSON.stringify(resetManaged.body)}`);
    }

    const deleteSelf = await request(`/api/admin/users/${encodeURIComponent(adminId)}`, {
      method: 'DELETE',
      headers: { cookie }
    });
    if (deleteSelf.response.status !== 400) {
      throw new Error(`Admin should not delete own account: ${JSON.stringify(deleteSelf.body)}`);
    }

    const deleteManaged = await request(`/api/admin/users/${encodeURIComponent(managedUserId)}`, {
      method: 'DELETE',
      headers: { cookie }
    });
    if (!deleteManaged.response.ok || deleteManaged.body.id !== managedUserId) {
      throw new Error(`Admin user delete failed: ${JSON.stringify(deleteManaged.body)}`);
    }

    const templates = await request('/api/forms/templates', { headers: { cookie } });
    if (!templates.response.ok || !Array.isArray(templates.body.templates) || templates.body.templates.length === 0) {
      throw new Error(`Form templates endpoint failed: ${JSON.stringify(templates.body)}`);
    }

    const filledPdf = await requestRaw('/api/forms/fill-pdf', {
      method: 'POST',
      headers: { cookie },
      body: JSON.stringify({
        fileUrl: '/documents/forms/01_GDPR_A_SOUHLASY/RAI-FRM-GDPR-001_KRYCI_LIST_GDPR_BALICKU_FILLABLE_v1_3_CONTENT_LOCKED.pdf',
        templateId: 'e2e-gdpr-cover',
        formUid: 'RAI-FRM-GDPR-001',
        templateTitle: 'Krycí list GDPR balíčku',
        client: {
          firstName: 'Andrea',
          lastName: 'Testova',
          birthDate: '1990-01-02',
          phone: '+420 777 333 444',
          email: `pdf-${stamp}@restart.test`,
          address: 'Testovaci 1',
          program: 'REWORK',
          operationalId: `AT-${stampText.slice(-6)}-1234-001`
        },
        draft: {}
      })
    });
    if (!filledPdf.ok || !String(filledPdf.headers.get('content-type') || '').includes('application/pdf')) {
      const text = await filledPdf.text().catch(() => '');
      throw new Error(`Filled PDF endpoint failed: ${filledPdf.status} ${text}`);
    }
    const filledGdprDoc = await PDFDocument.load(Buffer.from(await filledPdf.arrayBuffer()));
    const filledGdprName = filledGdprDoc.getForm().getTextField('gdpr_00_jmeno_prezdivka_subjekt').getText();
    if (filledGdprName !== 'Andrea Testova') {
      throw new Error(`Filled GDPR client name mismatch: ${filledGdprName || '(empty)'}`);
    }

    const filledQuestionnaire = await requestRaw('/api/forms/fill-pdf', {
      method: 'POST',
      headers: { cookie },
      body: JSON.stringify({
        fileUrl: '/documents/forms/11_PROGRAMOVE_DOTAZNIKY/RAI-FRM-JB-001_JAILBREAK_DOTAZNIK_REINTEGRACE_PO_VTOS_v2_0_RC1_POPPINS_FILLABLE.pdf',
        templateId: 'e2e-jailbreak-questionnaire',
        formUid: 'RAI-FRM-JB-001',
        templateTitle: 'JAILBREAK dotaznik reintegrace po VTOS',
        client: {
          firstName: 'Andrea',
          lastName: 'Testova',
          birthDate: '1990-01-02',
          phone: '+420 777 333 444',
          email: `pdf-questionnaire-${stamp}@restart.test`,
          address: 'Testovaci 1',
          program: 'JAILBREAK',
          operationalId: `AT-${stampText.slice(-6)}-1234-001`
        },
        draft: {}
      })
    });
    if (!filledQuestionnaire.ok || !String(filledQuestionnaire.headers.get('content-type') || '').includes('application/pdf')) {
      const text = await filledQuestionnaire.text().catch(() => '');
      throw new Error(`Filled questionnaire endpoint failed: ${filledQuestionnaire.status} ${text}`);
    }
    const questionnaireDoc = await PDFDocument.load(Buffer.from(await filledQuestionnaire.arrayBuffer()));
    const questionnaireForm = questionnaireDoc.getForm();
    const questionnaireClientName = questionnaireForm.getTextField('p14_klient_jmeno').getText();
    const questionnaireOpenQuestion = questionnaireForm.getTextField('p3_spec_5_je_klient_poprve_ve_vtos_nebo_opakovane').getText();
    if (questionnaireClientName !== 'Andrea Testova') {
      throw new Error(`Filled questionnaire client name mismatch: ${questionnaireClientName || '(empty)'}`);
    }
    if (questionnaireOpenQuestion === 'Andrea Testova') {
      throw new Error('Open questionnaire field was incorrectly filled with the client name.');
    }

    const filledClientBook = await requestRaw('/api/forms/fill-pdf', {
      method: 'POST',
      headers: { cookie },
      body: JSON.stringify({
        fileUrl: '/documents/forms/02_KLIENTSKA_SLOZKA/RAI-FRM-KLI-002_KNIHA_KLIENTA_FILLABLE_v1_6_COMPACT_CONTENT_LOCKED.pdf',
        templateId: 'e2e-client-book',
        formUid: 'RAI-FRM-KLI-002',
        templateTitle: 'Kniha klienta',
        client: {
          firstName: 'Miroslav',
          lastName: 'Reidl',
          birthDate: '1985-05-06',
          phone: '+420735975108',
          email: `reidlmiroslav-${stamp}@restart.test`,
          address: 'Testovaci 2',
          program: 'BOD ZLOMU',
          operationalId: `MR-${stampText.slice(-6)}-4321-001`
        },
        draft: {}
      })
    });
    if (!filledClientBook.ok || !String(filledClientBook.headers.get('content-type') || '').includes('application/pdf')) {
      const text = await filledClientBook.text().catch(() => '');
      throw new Error(`Filled client book endpoint failed: ${filledClientBook.status} ${text}`);
    }
    const clientBookDoc = await PDFDocument.load(Buffer.from(await filledClientBook.arrayBuffer()));
    const clientBookForm = clientBookDoc.getForm();
    const clientBookInternalId = clientBookForm.getTextField('RAI-FRM-KLI-002_intern_id_klienta_001').getText();
    const clientBookProgram = clientBookForm.getTextField('RAI-FRM-KLI-002_program_hlavn_pil_002').getText();
    const clientBookPhone = clientBookForm.getTextField('RAI-FRM-KLI-002_telefon_kontakt_007').getText();
    const clientBookEmail = clientBookForm.getTextField('RAI-FRM-KLI-002_e_mail_alternativn_kontakt_008').getText();
    const clientBookName = clientBookForm.getTextField('RAI-FRM-KLI-002_jm_no_p_ezd_vka_060').getText();
    const clientBookBirth = clientBookForm.getTextField('RAI-FRM-KLI-002_datum_narozen_v_k_061').getText();
    const clientBookAddress = clientBookForm.getTextField('RAI-FRM-KLI-002_adresa_kontaktn_m_sto_062').getText();
    const clientBookInterventionDate = clientBookForm.getTextField('RAI-FRM-KLI-002_interv_01_01').getText();
    const clientBookInterventionContact = clientBookForm.getTextField('RAI-FRM-KLI-002_interv_01_02').getText();
    const clientBookInterventionProgram = clientBookForm.getTextField('RAI-FRM-KLI-002_interv_01_03').getText();
    const clientBookFollowUpContact = clientBookForm.getTextField('RAI-FRM-KLI-002_follow_01_01').getText();
    const clientBookExitDate = clientBookForm.getTextField('RAI-FRM-KLI-002_datum_ukon_en_p_evodu_360').getText();
    if (!clientBookInternalId || clientBookProgram !== 'BOD ZLOMU' || clientBookPhone !== '+420735975108' || clientBookEmail !== `reidlmiroslav-${stamp}@restart.test`) {
      throw new Error('Filled client book header fields did not match expected client values.');
    }
    if (clientBookName !== 'Miroslav Reidl') {
      throw new Error(`Filled client book client name mismatch: ${clientBookName || '(empty)'}`);
    }
    if (clientBookBirth !== '1985-05-06' || clientBookAddress !== 'Testovaci 2') {
      throw new Error('Filled client book identity fields did not match expected client values.');
    }
    if (clientBookInterventionDate || clientBookInterventionContact || clientBookInterventionProgram || clientBookFollowUpContact || clientBookExitDate) {
      throw new Error('Client book operational tables were incorrectly prefilled.');
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
        institutionalCareHistory: 'yes',
        childhoodBackground: 'institutional_home',
        status: 'V mapování',
        operationalId: `AD-${stampText.slice(-6)}-1234-001`,
        notes: 'Založeno e2e admin testem.'
      })
    });
    if (!created.response.ok || created.body.client.program !== 'RESET' || !created.body.client.operationalId) {
      throw new Error(`Client creation failed: ${JSON.stringify(created.body)}`);
    }
    const clientBackgroundSupported = Object.prototype.hasOwnProperty.call(created.body.client, 'institutionalCareHistory');
    if (
      clientBackgroundSupported &&
      (created.body.client.institutionalCareHistory !== 'yes' || created.body.client.childhoodBackground !== 'institutional_home')
    ) {
      throw new Error(`Client background metrics were not persisted: ${JSON.stringify(created.body.client)}`);
    }
    createdClientId = created.body.client.id;

    const list = await request('/api/clients', { headers: { cookie } });
    if (
      !list.response.ok ||
      !list.body.clients.some(
        (client) =>
          client.id === created.body.client.id &&
          client.operationalId === created.body.client.operationalId &&
          (!clientBackgroundSupported || client.institutionalCareHistory === 'yes')
      )
    ) {
      throw new Error(`Created client is missing from database list: ${JSON.stringify(list.body)}`);
    }

    const duplicate = await request('/api/clients', {
      method: 'POST',
      headers: { cookie },
      body: JSON.stringify({
        firstName: 'Duplicitni',
        lastName: `Klient ${stamp}`,
        birthDate: '1991-01-02',
        phone: '+420 777 000 111',
        email: `duplicate-client-${stamp}@restart.test`,
        program: 'RESET',
        status: 'Nový kontakt',
        notes: 'Dočasný duplicitní klient pro test mazání.'
      })
    });
    if (!duplicate.response.ok || !duplicate.body.client.id) {
      throw new Error(`Duplicate client creation failed: ${JSON.stringify(duplicate.body)}`);
    }
    duplicateClientId = duplicate.body.client.id;
    const deletedClient = await request(`/api/clients/${encodeURIComponent(duplicateClientId)}`, {
      method: 'DELETE',
      headers: { cookie }
    });
    if (!deletedClient.response.ok || deletedClient.body.id !== duplicateClientId) {
      throw new Error(`Client deletion failed: ${JSON.stringify(deletedClient.body)}`);
    }
    const listAfterDelete = await request('/api/clients', { headers: { cookie } });
    if (!listAfterDelete.response.ok || listAfterDelete.body.clients.some((client) => client.id === duplicateClientId)) {
      throw new Error(`Deleted client is still present in database list: ${JSON.stringify(listAfterDelete.body)}`);
    }
    duplicateClientId = null;
    const newsTitle = `Aktualita databaze ${stamp}`;
    const newsSlug = `aktualita-databaze-${stamp}`;
    const createdNews = await request('/api/news', {
      method: 'POST',
      headers: { cookie },
      body: JSON.stringify({
        title: newsTitle,
        slug: newsSlug,
        tag: 'JAILBREAK',
        date: '2026-06-03',
        excerpt: 'Aktualita založená přes admin API test.',
        body: '<p>Testovací tělo aktuality.</p>'
      })
    });
    if (
      !createdNews.response.ok ||
      createdNews.body.news.title !== newsTitle ||
      createdNews.body.news.slug !== newsSlug ||
      !createdNews.body.news.body.includes('Testovací tělo')
    ) {
      throw new Error(`News creation failed: ${JSON.stringify(createdNews.body)}`);
    }
    const newsTagsSupported = Object.prototype.hasOwnProperty.call(createdNews.body.news, 'tag');
    if (newsTagsSupported && createdNews.body.news.tag !== 'JAILBREAK') {
      throw new Error(`News tag was not persisted: ${JSON.stringify(createdNews.body)}`);
    }
    createdNewsId = createdNews.body.news.id;

    const publicNews = await request('/api/news');
    if (
      !publicNews.response.ok ||
      !publicNews.body.news.some(
        (item) => item.id === createdNews.body.news.id && item.slug === newsSlug && (!newsTagsSupported || item.tag === 'JAILBREAK')
      )
    ) {
      throw new Error(`Created news is missing from public news list: ${JSON.stringify(publicNews.body)}`);
    }

    const newsSitemap = await requestRaw('/api/sitemap/news.xml');
    const newsSitemapXml = await newsSitemap.text();
    if (!newsSitemap.ok || !newsSitemapXml.includes(`/aktuality/jailbreak/${newsSlug}`)) {
      throw new Error(`Dynamic news sitemap is missing the created article: ${newsSitemapXml.slice(0, 500)}`);
    }

    const deletedNews = await request(`/api/news/${encodeURIComponent(createdNewsId)}`, {
      method: 'DELETE',
      headers: { cookie }
    });
    if (!deletedNews.response.ok || deletedNews.body.id !== createdNewsId) {
      throw new Error(`News deletion failed: ${JSON.stringify(deletedNews.body)}`);
    }
    createdNewsId = null;

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
    if (uploadedMediaPath) await fs.promises.rm(uploadedMediaPath, { force: true });
    await query('DELETE FROM news WHERE id = ?', [createdNewsId]);
    await query('DELETE FROM notifications WHERE title = ? AND body LIKE ?', ['Klient smazán', `%duplicate-client-${stamp}@restart.test%`]);
    await query('DELETE FROM clients WHERE id = ?', [duplicateClientId]);
    await query('DELETE FROM clients WHERE id = ?', [createdClientId]);
    await query('DELETE FROM client_documents WHERE id = ?', [createdDocumentId]);
    await query('DELETE FROM media_files WHERE id = ?', [createdMediaId]);
    await query('DELETE FROM notifications WHERE id = ?', [createdNotificationId]);
    await query('DELETE FROM notifications WHERE category = ? AND body LIKE ?', ['Materiální dary', '%E2E Dárce%']);
    await query('DELETE FROM material_offers WHERE id = ?', [createdMaterialOfferId]);
    await query('DELETE FROM notifications WHERE recipient_id = ? OR created_by = ?', [managedUserId, managedUserId]);
    await query('DELETE FROM notifications WHERE recipient_id = ? OR created_by = ?', [applicantUserId, applicantUserId]);
    await query('DELETE FROM notifications WHERE body LIKE ?', [`%${managedUserEmail}%`]);
    await query('DELETE FROM project_applications WHERE id = ?', [applicationId]);
    await query('DELETE FROM password_resets WHERE user_id = ?', [managedUserId]);
    await query('DELETE FROM users WHERE id = ?', [managedUserId]);
    await query('DELETE FROM users WHERE id = ?', [applicantUserId]);
    await query('DELETE FROM users WHERE id = ?', [adminId]);
    await getPool().end();
  }
})().catch((error) => {
  server.kill();
  console.error(error.message);
  process.exit(1);
});
