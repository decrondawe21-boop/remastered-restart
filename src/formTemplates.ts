export type FormTemplateSeed = {
  id: string;
  formUid?: string;
  formGroup?: string;
  title: string;
  description: string;
  fields: Array<{ key: string; label: string; rows?: number }>;
  fileUrl?: string;
  folder?: string;
  sourceNote?: string;
  sizeBytes?: number;
  status?: string;
  isCurrent?: boolean;
  isActive?: boolean;
};
const productionGdprFormTemplates: FormTemplateSeed[] = [
  {
    id: 'rai-gdpr-001',
    title: 'RAI-FRM-GDPR-001 - Krycí list GDPR balíčku',
    description: 'Ostrý provozní GDPR formulář s čárovým kódem, v1.3.',
    fields: [
      { key: 'handoverNote', label: 'Poznámka k vyplnění / předání', rows: 3 },
      { key: 'signatureNote', label: 'Poznámka k podpisu nebo archivaci', rows: 3 }
    ],
    fileUrl: '/documents/forms/01_GDPR_A_SOUHLASY/RAI-FRM-GDPR-001_KRYCI_LIST_GDPR_BALICKU_FILLABLE_v1_3_CONTENT_LOCKED.pdf',
    folder: '01_GDPR_A_SOUHLASY',
    sourceNote: 'RAI-FRM-GDPR-001_KRYCI_LIST_GDPR_BALICKU_FILLABLE_v1_3_CONTENT_LOCKED.pdf | ostrý provoz',
    sizeBytes: 124533,
    isActive: true
  },
  {
    id: 'rai-gdpr-002',
    title: 'RAI-FRM-GDPR-002 - Informační memorandum',
    description: 'Ostrý provozní GDPR formulář s čárovým kódem, v1.3.',
    fields: [
      { key: 'handoverNote', label: 'Poznámka k vyplnění / předání', rows: 3 },
      { key: 'signatureNote', label: 'Poznámka k podpisu nebo archivaci', rows: 3 }
    ],
    fileUrl: '/documents/forms/01_GDPR_A_SOUHLASY/RAI-FRM-GDPR-002_INFORMACNI_MEMORANDUM_FILLABLE_v1_3_CONTENT_LOCKED.pdf',
    folder: '01_GDPR_A_SOUHLASY',
    sourceNote: 'RAI-FRM-GDPR-002_INFORMACNI_MEMORANDUM_FILLABLE_v1_3_CONTENT_LOCKED.pdf | ostrý provoz',
    sizeBytes: 119614,
    isActive: true
  },
  {
    id: 'rai-gdpr-003',
    title: 'RAI-FRM-GDPR-003 - Informovaný souhlas GDPR',
    description: 'Ostrý provozní GDPR formulář s čárovým kódem.',
    fields: [
      { key: 'handoverNote', label: 'Poznámka k vyplnění / předání', rows: 3 },
      { key: 'signatureNote', label: 'Poznámka k podpisu nebo archivaci', rows: 3 }
    ],
    fileUrl: '/documents/forms/01_GDPR_A_SOUHLASY/RAI-FRM-GDPR-003_INFORMOVANY_SOUHLAS_GDPR_FILLABLE_v1_3_CONTENT_LOCKED.pdf',
    folder: '01_GDPR_A_SOUHLASY',
    sourceNote: 'RAI-FRM-GDPR-003-INFORMOVANY-SOUHLAS_GDPR.pdf | ostrý provoz',
    sizeBytes: 98773,
    isActive: true
  },
  {
    id: 'rai-gdpr-004',
    title: 'RAI-FRM-GDPR-004 - Zvláštní kategorie údajů',
    description: 'Ostrý provozní GDPR formulář s čárovým kódem, v1.3.',
    fields: [
      { key: 'handoverNote', label: 'Poznámka k vyplnění / předání', rows: 3 },
      { key: 'signatureNote', label: 'Poznámka k podpisu nebo archivaci', rows: 3 }
    ],
    fileUrl: '/documents/forms/01_GDPR_A_SOUHLASY/RAI-FRM-GDPR-004_ZVLASTNI_KATEGORIE_UDAJU_FILLABLE_v1_3_CONTENT_LOCKED.pdf',
    folder: '01_GDPR_A_SOUHLASY',
    sourceNote: 'RAI-FRM-GDPR-004_ZVLASTNI_KATEGORIE_UDAJU_FILLABLE_v1_3_CONTENT_LOCKED.pdf | ostrý provoz',
    sizeBytes: 119601,
    isActive: true
  },
  {
    id: 'rai-gdpr-005',
    title: 'RAI-FRM-GDPR-005 - Foto, video, audio',
    description: 'Ostrý provozní GDPR formulář s čárovým kódem, v1.3.',
    fields: [
      { key: 'handoverNote', label: 'Poznámka k vyplnění / předání', rows: 3 },
      { key: 'signatureNote', label: 'Poznámka k podpisu nebo archivaci', rows: 3 }
    ],
    fileUrl: '/documents/forms/01_GDPR_A_SOUHLASY/RAI-FRM-GDPR-005_FOTO_VIDEO_AUDIO_FILLABLE_v1_3_CONTENT_LOCKED.pdf',
    folder: '01_GDPR_A_SOUHLASY',
    sourceNote: 'RAI-FRM-GDPR-005_FOTO_VIDEO_AUDIO_FILLABLE_v1_3_CONTENT_LOCKED.pdf | ostrý provoz',
    sizeBytes: 108266,
    isActive: true
  },
  {
    id: 'rai-gdpr-006',
    title: 'RAI-FRM-GDPR-006 - Příběh, citace, kazuistika',
    description: 'Ostrý provozní GDPR formulář s čárovým kódem, v1.3.',
    fields: [
      { key: 'handoverNote', label: 'Poznámka k vyplnění / předání', rows: 3 },
      { key: 'signatureNote', label: 'Poznámka k podpisu nebo archivaci', rows: 3 }
    ],
    fileUrl: '/documents/forms/01_GDPR_A_SOUHLASY/RAI-FRM-GDPR-006_PRIBEH_CITACE_KAZUISTIKA_FILLABLE_v1_3_CONTENT_LOCKED.pdf',
    folder: '01_GDPR_A_SOUHLASY',
    sourceNote: 'RAI-FRM-GDPR-006_PRIBEH_CITACE_KAZUISTIKA_FILLABLE_v1_3_CONTENT_LOCKED.pdf | ostrý provoz',
    sizeBytes: 108452,
    isActive: true
  },
  {
    id: 'rai-gdpr-007',
    title: 'RAI-FRM-GDPR-007 - Sdílení údajů s partnery',
    description: 'Ostrý provozní GDPR formulář s čárovým kódem, v1.3.',
    fields: [
      { key: 'handoverNote', label: 'Poznámka k vyplnění / předání', rows: 3 },
      { key: 'signatureNote', label: 'Poznámka k podpisu nebo archivaci', rows: 3 }
    ],
    fileUrl: '/documents/forms/01_GDPR_A_SOUHLASY/RAI-FRM-GDPR-007_SDILENI_UDAJU_S_PARTNERY_FILLABLE_v1_3_CONTENT_LOCKED.pdf',
    folder: '01_GDPR_A_SOUHLASY',
    sourceNote: 'RAI-FRM-GDPR-007_SDILENI_UDAJU_S_PARTNERY_FILLABLE_v1_3_CONTENT_LOCKED.pdf | ostrý provoz',
    sizeBytes: 120323,
    isActive: true
  },
  {
    id: 'rai-gdpr-008',
    title: 'RAI-FRM-GDPR-008 - Elektronická komunikace / follow-up',
    description: 'Ostrý provozní GDPR formulář s čárovým kódem, v1.3.',
    fields: [
      { key: 'handoverNote', label: 'Poznámka k vyplnění / předání', rows: 3 },
      { key: 'signatureNote', label: 'Poznámka k podpisu nebo archivaci', rows: 3 }
    ],
    fileUrl: '/documents/forms/01_GDPR_A_SOUHLASY/RAI-FRM-GDPR-008_ELEKTRONICKA_KOMUNIKACE_FOLLOW_UP_FILLABLE_v1_3_CONTENT_LOCKED.pdf',
    folder: '01_GDPR_A_SOUHLASY',
    sourceNote: 'RAI-FRM-GDPR-008_ELEKTRONICKA_KOMUNIKACE_FOLLOW_UP_FILLABLE_v1_3_CONTENT_LOCKED.pdf | ostrý provoz',
    sizeBytes: 119271,
    isActive: true
  },
  {
    id: 'rai-gdpr-009',
    title: 'RAI-FRM-GDPR-009 - Bod zlomu: mladistvý / zákonný zástupce',
    description: 'Ostrý provozní GDPR formulář s čárovým kódem, v1.3.',
    fields: [
      { key: 'handoverNote', label: 'Poznámka k vyplnění / předání', rows: 3 },
      { key: 'signatureNote', label: 'Poznámka k podpisu nebo archivaci', rows: 3 }
    ],
    fileUrl: '/documents/forms/01_GDPR_A_SOUHLASY/RAI-FRM-GDPR-009_BOD_ZLOMU_MLADISTVY_ZAKONNY_ZASTUPCE_FILLABLE_v1_3_CONTENT_LOCKED.pdf',
    folder: '01_GDPR_A_SOUHLASY',
    sourceNote: 'RAI-FRM-GDPR-009_BOD_ZLOMU_MLADISTVY_ZAKONNY_ZASTUPCE_FILLABLE_v1_3_CONTENT_LOCKED.pdf | ostrý provoz',
    sizeBytes: 109320,
    isActive: true
  },
  {
    id: 'rai-gdpr-010',
    title: 'RAI-FRM-GDPR-010 - Dobrovolník: osobní údaje',
    description: 'Ostrý provozní GDPR formulář s čárovým kódem, v1.3.',
    fields: [
      { key: 'handoverNote', label: 'Poznámka k vyplnění / předání', rows: 3 },
      { key: 'signatureNote', label: 'Poznámka k podpisu nebo archivaci', rows: 3 }
    ],
    fileUrl: '/documents/forms/01_GDPR_A_SOUHLASY/RAI-FRM-GDPR-010_DOBROVOLNIK_OSOBNI_UDAJE_FILLABLE_v1_3_CONTENT_LOCKED.pdf',
    folder: '01_GDPR_A_SOUHLASY',
    sourceNote: 'RAI-FRM-GDPR-0010_DOBROVOLNIK_OSOBNI_UDAJE_FILLABLE_v1_3_CONTENT_LOCKED.pdf | ostrý provoz',
    sizeBytes: 109758,
    isActive: true
  },
  {
    id: 'rai-gdpr-011',
    title: 'RAI-FRM-GDPR-011 - Pracovník / mentor: mlčenlivost',
    description: 'Ostrý provozní GDPR formulář s čárovým kódem, v1.3.',
    fields: [
      { key: 'handoverNote', label: 'Poznámka k vyplnění / předání', rows: 3 },
      { key: 'signatureNote', label: 'Poznámka k podpisu nebo archivaci', rows: 3 }
    ],
    fileUrl: '/documents/forms/01_GDPR_A_SOUHLASY/RAI-FRM-GDPR-011_PRACOVNIK_MENTOR_MLCENLIVOST_FILLABLE_v1_3_CONTENT_LOCKED.pdf',
    folder: '01_GDPR_A_SOUHLASY',
    sourceNote: 'RAI-FRM-GDPR-011_PRACOVNIK_MENTOR_MLCENLIVOST_FILLABLE_v1_3_CONTENT_LOCKED.pdf | ostrý provoz',
    sizeBytes: 109124,
    isActive: true
  },
  {
    id: 'rai-gdpr-012',
    title: 'RAI-FRM-GDPR-012 - Partner / externí subjekt',
    description: 'Ostrý provozní GDPR formulář s čárovým kódem, v1.3.',
    fields: [
      { key: 'handoverNote', label: 'Poznámka k vyplnění / předání', rows: 3 },
      { key: 'signatureNote', label: 'Poznámka k podpisu nebo archivaci', rows: 3 }
    ],
    fileUrl: '/documents/forms/01_GDPR_A_SOUHLASY/RAI-FRM-GDPR-012_PARTNER_EXTERNI_SUBJEKT_FILLABLE_v1_3_CONTENT_LOCKED.pdf',
    folder: '01_GDPR_A_SOUHLASY',
    sourceNote: 'RAI-FRM-GDPR-012_PARTNER_EXTERNI_SUBJEKT_FILLABLE_v1_3_CONTENT_LOCKED.pdf | ostrý provoz',
    sizeBytes: 119860,
    isActive: true
  },
  {
    id: 'rai-gdpr-013',
    title: 'RAI-FRM-GDPR-013 - Odvolání nebo omezení souhlasu',
    description: 'Ostrý provozní GDPR formulář s čárovým kódem, v1.3.',
    fields: [
      { key: 'handoverNote', label: 'Poznámka k vyplnění / předání', rows: 3 },
      { key: 'signatureNote', label: 'Poznámka k podpisu nebo archivaci', rows: 3 }
    ],
    fileUrl: '/documents/forms/01_GDPR_A_SOUHLASY/RAI-FRM-GDPR-013_ODVOLANI_NEBO_OMEZENI_SOUHLASU_FILLABLE_v1_3_CONTENT_LOCKED.pdf',
    folder: '01_GDPR_A_SOUHLASY',
    sourceNote: 'RAI-FRM-GDPR-013_ODVOLANI_NEBO_OMEZENI_SOUHLASU_FILLABLE_v1_3_CONTENT_LOCKED.pdf | ostrý provoz',
    sizeBytes: 109920,
    isActive: true
  },
  {
    id: 'rai-gdpr-014',
    title: 'RAI-FRM-GDPR-014 - Žádost subjektu údajů',
    description: 'Ostrý provozní GDPR formulář s čárovým kódem, v1.3.',
    fields: [
      { key: 'handoverNote', label: 'Poznámka k vyplnění / předání', rows: 3 },
      { key: 'signatureNote', label: 'Poznámka k podpisu nebo archivaci', rows: 3 }
    ],
    fileUrl: '/documents/forms/01_GDPR_A_SOUHLASY/RAI-FRM-GDPR-014_ZADOST_SUBJEKTU_UDAJU_FILLABLE_v1_3_CONTENT_LOCKED.pdf',
    folder: '01_GDPR_A_SOUHLASY',
    sourceNote: 'RAI-FRM-GDPR-014_ZADOST_SUBJEKTU_UDAJU_FILLABLE_v1_3_CONTENT_LOCKED.pdf | ostrý provoz',
    sizeBytes: 120872,
    isActive: true
  },
  {
    id: 'rai-gdpr-015',
    title: 'RAI-FRM-GDPR-015 - Záznam o incidentu',
    description: 'Ostrý provozní GDPR formulář s čárovým kódem, v1.3.',
    fields: [
      { key: 'handoverNote', label: 'Poznámka k vyplnění / předání', rows: 3 },
      { key: 'signatureNote', label: 'Poznámka k podpisu nebo archivaci', rows: 3 }
    ],
    fileUrl: '/documents/forms/01_GDPR_A_SOUHLASY/RAI-FRM-GDPR-015_ZAZNAM_O_INCIDENTU_FILLABLE_v1_3_CONTENT_LOCKED.pdf',
    folder: '01_GDPR_A_SOUHLASY',
    sourceNote: 'RAI-FRM-GDPR-015_ZAZNAM_O_INCIDENTU_FILLABLE_v1_3_CONTENT_LOCKED.pdf | ostrý provoz',
    sizeBytes: 121944,
    isActive: true
  },
  {
    id: 'rai-gdpr-016',
    title: 'RAI-FRM-GDPR-016 - Anonymizační donor export karta',
    description: 'Ostrý provozní GDPR formulář s čárovým kódem, v1.3.',
    fields: [
      { key: 'handoverNote', label: 'Poznámka k vyplnění / předání', rows: 3 },
      { key: 'signatureNote', label: 'Poznámka k podpisu nebo archivaci', rows: 3 }
    ],
    fileUrl: '/documents/forms/01_GDPR_A_SOUHLASY/RAI-FRM-GDPR-016_ANONYMIZACNI_DONOR_EXPORT_KARTA_FILLABLE_v1_3_CONTENT_LOCKED.pdf',
    folder: '01_GDPR_A_SOUHLASY',
    sourceNote: 'RAI-FRM-GDPR-016_ANONYMIZACNI_DONOR_EXPORT_KARTA_FILLABLE_v1_3_CONTENT_LOCKED.pdf | ostrý provoz',
    sizeBytes: 89187,
    isActive: true
  },
  {
    id: 'rai-gdpr-017',
    title: 'RAI-FRM-GDPR-017 - Archivace, skartace, přístupy',
    description: 'Ostrý provozní GDPR formulář s čárovým kódem, v1.3.',
    fields: [
      { key: 'handoverNote', label: 'Poznámka k vyplnění / předání', rows: 3 },
      { key: 'signatureNote', label: 'Poznámka k podpisu nebo archivaci', rows: 3 }
    ],
    fileUrl: '/documents/forms/01_GDPR_A_SOUHLASY/RAI-FRM-GDPR-017_ARCHIVACE_SKARTACE_PRISTUPY_FILLABLE_v1_3_CONTENT_LOCKED.pdf',
    folder: '01_GDPR_A_SOUHLASY',
    sourceNote: 'RAI-FRM-GDPR-017_ARCHIVACE_SKARTACE_PRISTUPY_FILLABLE_v1_3_CONTENT_LOCKED.pdf | ostrý provoz',
    sizeBytes: 121536,
    isActive: true
  }
];

export const fallbackFormTemplates: FormTemplateSeed[] = [
  {
    id: 'intake',
    title: 'Vstupní karta klienta',
    description: 'Základní registrační list pro první kontakt a mapování situace.',
    fields: [
      { key: 'currentSituation', label: 'Aktuální situace klienta', rows: 4 },
      { key: 'urgentNeeds', label: 'Naléhavé potřeby', rows: 3 },
      { key: 'housing', label: 'Bydlení a zázemí', rows: 3 },
      { key: 'employment', label: 'Práce, příjem a dluhy', rows: 3 },
      { key: 'plannedSteps', label: 'První domluvené kroky', rows: 4 }
    ]
  },
  {
    id: 'consent',
    title: 'Souhlas se zapojením do programu',
    description: 'Tiskový list pro potvrzení účasti, sdílení údajů a předání základních informací.',
    fields: [
      { key: 'programScope', label: 'Rozsah podpory a zapojený program', rows: 4 },
      { key: 'dataScope', label: 'Rozsah zpracování a sdílení údajů', rows: 4 },
      { key: 'clientDeclaration', label: 'Prohlášení klienta', rows: 4 }
    ]
  },
  {
    id: 'stabilization',
    title: 'Stabilizační plán',
    description: 'Pracovní plán kroků, cílů, odpovědností a další kontroly.',
    fields: [
      { key: 'mainGoal', label: 'Hlavní cíl na období', rows: 3 },
      { key: 'workPlan', label: 'Práce a příjem', rows: 3 },
      { key: 'housingPlan', label: 'Bydlení a bezpečné zázemí', rows: 3 },
      { key: 'supportPlan', label: 'Mentoring, zdraví a návazné služby', rows: 4 },
      { key: 'nextReview', label: 'Termín dalšího vyhodnocení', rows: 2 }
    ]
  },
  ...productionGdprFormTemplates
];

