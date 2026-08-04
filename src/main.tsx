import React from 'react';
import { createPortal } from 'react-dom';
import { createRoot } from 'react-dom/client';
import {
  ArrowRight,
  AlertCircle,
  Barcode,
  Bell,
  BookOpen,
  Bold,
  ChevronLeft,
  CheckCircle2,
  ClipboardList,
  Copy,
  Download,
  Eye,
  EyeOff,
  FileStack,
  FileText,
  FolderOpen,
  Heart,
  Image as ImageIcon,
  ImagePlus,
  Info,
  Italic,
  KeyRound,
  LayoutDashboard,
  Link,
  Linkedin,
  List,
  LockKeyhole,
  LogOut,
  Mail,
  MessageCircle,
  Menu,
  MoreHorizontal,
  Newspaper,
  PackageOpen,
  Phone,
  Plus,
  Printer,
  QrCode,
  Reply,
  RotateCcw,
  Save,
  Search,
  Settings,
  ShieldCheck,
  Shirt,
  Star,
  Trash2,
  Underline,
  Undo2,
  Upload,
  UserCog,
  UserRound,
  Users,
  Video,
  Wrench,
  X
} from 'lucide-react';
import {
  contacts,
  focusAreas,
  impactMetrics,
  partnerTypes,
  principles,
  programs,
  realityCards,
  solutionPrinciples,
  starterNews,
  stats,
  supportPaths
} from './content';
import methodologyDocumentsData from './methodologyDocuments.json';
import {
  getSession,
  addNewsComment,
  confirmPasswordReset,
  deleteClient as deleteClientRecord,
  deleteUser as deleteUserRecord,
  deleteNewsComment,
  deleteNews as deleteNewsRecord,
  fillFormPdf,
  fileToBase64,
  getJailbreakBackgroundStats,
  listClients,
  listDocuments,
  listEmailTemplates,
  listFormTemplates,
  listMedia,
  listMaterialOffers,
  listHomepageContent,
  listNews,
  listNewsDiscussion,
  listNotifications,
  listMyProjectApplications,
  listProjectApplications,
  listPublicMedia,
  listSlides,
  listUsers,
  uploadMediaFile,
  loginUser,
  logoutUser,
  markNotificationRead as markNotificationReadRecord,
  registerClient as registerClientAccount,
  requestPasswordReset,
  reviewProjectApplication as reviewProjectApplicationRecord,
  resetUserPassword as resetUserPasswordRecord,
  saveClient as saveClientRecord,
  saveDocument as saveDocumentRecord,
  saveMedia as saveMediaRecord,
  saveNews as saveNewsRecord,
  saveNotification as saveNotificationRecord,
  saveHomepageContent as saveHomepageContentRecord,
  saveSlide as saveSlideRecord,
  submitProjectApplication,
  submitMaterialOffer,
  toggleNewsLike,
  anonymizeMaterialOffer,
  updateEmailTemplate,
  updateMaterialOffer,
  updateNewsComment,
  updateUser as updateUserRecord,
  ApiRequestError,
  type ApiAdminPasswordResetResponse,
  type ApiClientDocument,
  type ApiClientRecord,
  type ApiFormTemplate,
  type ApiEmailTemplate,
  type ApiJailbreakBackgroundStats,
  type ApiManagedUser,
  type ApiMaterialOffer,
  type ApiMaterialOfferStatus,
  type ApiMaterialOfferType,
  type ApiMaterialOfferTransport,
  type ApiMediaFile,
  type ApiHomepageContentItem,
  type ApiNewsComment,
  type ApiNewsLike,
  type ApiHomeSlide,
  type ApiNotification,
  type ApiPasswordResetRequest,
  type ApiProjectApplication,
  type ApiProjectApplicationType,
  type ApiRole,
  type ApiUser
} from './api';
import './styles.css';
import './redesign.css';

type MethodologyDocumentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'quote'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'definitions'; items: Array<{ term: string; definition: string }> };

type MethodologyDocument = {
  id: string;
  path: string;
  shortTitle: string;
  title: string;
  eyebrow: string;
  lead: string;
  description: string;
  version: string;
  status: string;
  published: string;
  sourceFileName: string;
  downloadDocx: string;
  keywords: string[];
  sections: Array<{
    id: string;
    title: string;
    blocks: MethodologyDocumentBlock[];
  }>;
};

const methodologyDocuments = methodologyDocumentsData as MethodologyDocument[];

type VideoWatchPageData = {
  id: string;
  path: string;
  shortTitle: string;
  title: string;
  eyebrow: string;
  description: string;
  caption: string;
  contentUrl: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration: string;
  width: number;
  height: number;
};

const videoWatchPages: VideoWatchPageData[] = [
  {
    id: 'predstaveni-projektu',
    path: '/videa/predstaveni-projektu',
    shortTitle: 'Představení projektu',
    title: 'RESTART Integrace: krátké představení projektu',
    eyebrow: 'Oficiální video projektu',
    description:
      'Krátké video představuje RESTART Integrace jako projekt druhých šancí, praktické podpory a bezpečného návratu lidí do běžného života.',
    caption: 'Proč projekt vzniká, komu pomáhá a jak propojuje práci, odpovědnost, podporu a stabilizaci.',
    contentUrl: '/videos/rest-art-intro-z-podkladu-v1-720p.mp4',
    thumbnailUrl: '/videos/rest-art-intro-poster.png',
    uploadDate: '2026-06-23T00:00:00+02:00',
    duration: 'PT15S',
    width: 1280,
    height: 720
  },
  {
    id: 'logo-reveal',
    path: '/videa/logo-reveal',
    shortTitle: 'Logo reveal',
    title: 'REST||ART Integrace: logo reveal projektu',
    eyebrow: 'Vizuální identita projektu',
    description:
      'Krátká logo animace REST||ART Integrace představuje vizuální identitu projektu druhých šancí a návratu do společnosti.',
    caption: 'Krátký vizuální podpis projektu REST||ART Integrace a jeho myšlenky nového začátku.',
    contentUrl: '/videos/restart-logo-reveal.mp4',
    thumbnailUrl: '/videos/restart-logo-reveal-poster.png',
    uploadDate: '2026-06-23T00:00:00+02:00',
    duration: 'PT6S',
    width: 1920,
    height: 1080
  }
];

const navItems = [
  { href: '/co-delame', label: 'Co děláme' },
  { href: '/programy', label: 'Programy' },
  { href: '/metodika', label: 'Metodika' },
  { href: '/aktuality', label: 'Aktuality' },
  { href: '/zapojeni', label: 'Zapojení' },
  { href: '/povinne-zverejnovani', label: 'Transparentnost' },
  { href: '/kontakt', label: 'Kontakt' },
  { href: '/klient', label: 'Klientská zóna' }
];

const routeLabels: Record<string, string> = {
  '/': 'Domů',
  '/co-delame': 'Co děláme',
  '/programy': 'Programy',
  '/metodika': 'Metodika',
  '/aktuality': 'Aktuality',
  '/pribehy-druhe-sance': 'Příběhy druhé šance',
  '/zapojeni': 'Zapojení',
  '/zapojeni/darovat-obleceni': 'Darovat oblečení',
  '/zapojeni/vybaveni-centra': 'Vybavení centra',
  '/zapojeni/sbirka-knih': 'Sbírka knih',
  '/darovat': 'Darovat',
  '/kontakt': 'Kontakt',
  '/kontakt/formular': 'Formulář',
  '/vyhledavani': 'Výsledky vyhledávání',
  '/klient': 'Klientský profil',
  '/admin': 'Administrace',
  '/pro-firmy': 'Pro firmy',
  '/media': 'Média',
  '/zasady-ochrany-osobnich-udaju': 'Zásady ochrany osobních údajů',
  '/povinne-zverejnovani': 'Povinné zveřejňování',
  '/webove-gdpr': 'Webové GDPR',
  ...Object.fromEntries(methodologyDocuments.map((document) => [document.path, document.shortTitle])),
  ...Object.fromEntries(videoWatchPages.map((video) => [video.path, video.shortTitle]))
};

const storyDetailPrefix = '/pribehy-druhe-sance/';

const footerNavGroups = [
  {
    title: 'Navigace',
    links: [
      { href: '/', label: 'Domů' },
      { href: '/co-delame', label: 'Co děláme' },
      { href: '/programy', label: 'Programy' },
      { href: '/aktuality', label: 'Aktuality' },
      { href: '/zapojeni', label: 'Zapojení' },
      { href: '/zapojeni/darovat-obleceni', label: 'Darovat oblečení' },
      { href: '/zapojeni/vybaveni-centra', label: 'Vybavení centra' },
      { href: '/zapojeni/sbirka-knih', label: 'Sbírka knih' },
      { href: '/darovat', label: 'Finanční dary' },
      { href: '/kontakt', label: 'Kontakt' }
    ]
  },
  {
    title: 'Projekt',
    links: [
      { href: '/pro-firmy', label: 'Pro firmy' },
      { href: '/metodika', label: 'Metodika' },
      { href: '/media', label: 'Média' },
      { href: '/povinne-zverejnovani', label: 'Povinné zveřejňování' },
      { href: '/webove-gdpr', label: 'Webové GDPR' },
      { href: '/zasady-ochrany-osobnich-udaju', label: 'Zásady ochrany osobních údajů' }
    ]
  }
];

const staticPages: Record<string, { label: string; title: string; lead: string; sections: Array<{ title: string; text: string }> }> = {
  '/pro-firmy': {
    label: 'Spolupráce',
    title: 'Pro firmy',
    lead: 'REST||ART Integrace hledá partnery, kteří chtějí proměnit druhou šanci v konkrétní práci, mentoring a stabilní návrat do běžného života.',
    sections: [
      { title: 'Partnerství v praxi', text: 'Firmy mohou nabídnout pracovní příležitosti, materiál, odborný mentoring, vybavení nebo podporu konkrétní výzvy.' },
      { title: 'Smysluplný dopad', text: 'Podpora směřuje do programů JAILBREAK, REWORK, RESET, STREETWISE, BOD ZLOMU a STABILIZACE.' }
    ]
  },
  '/media': {
    label: 'Média',
    title: 'Média',
    lead: 'Základní informace pro novináře, partnery a veřejnou komunikaci projektu.',
    sections: [
      { title: 'O projektu', text: 'REST||ART Integrace je neziskový projekt druhých šancí zaměřený na mentoring, práci, bydlení, stabilizaci a návrat lidí zpět do života.' },
      { title: 'Kontakt pro média', text: 'Pro mediální dotazy použijte kontaktní formulář nebo e-mail restartintegrace@dk-i.cz.' }
    ]
  },
  '/zasady-ochrany-osobnich-udaju': {
    label: 'Soukromí',
    title: 'Zásady ochrany osobních údajů',
    lead: 'Osobní údaje zpracováváme pouze v rozsahu potřebném pro komunikaci, registraci, klientskou podporu, administraci a zákonné povinnosti.',
    sections: [
      { title: 'Rozsah údajů', text: 'Typicky zpracováváme identifikační, kontaktní, registrační a provozní údaje. Citlivé údaje patří pouze do chráněné administrace a formulářů.' },
      { title: 'Práva subjektu údajů', text: 'Uživatel může požádat o přístup, opravu, omezení zpracování nebo výmaz tam, kde tomu nebrání zákonná povinnost.' }
    ]
  },
  '/povinne-zverejnovani': {
    label: 'Transparentnost',
    title: 'Povinné zveřejňování',
    lead: 'Tato část je připravená pro absolutní transparentnost projektu: dokumenty, kontakty, účel podpory, financování a veřejné výstupy.',
    sections: [
      { title: 'Dokumenty projektu', text: 'Po produkčním spuštění zde budou přehledně dostupné zakládací dokumenty, výroční nebo provozní reporty, výzvy a veřejné informace.' },
      { title: 'Financování a dary', text: 'Transparentní podpora má jasně ukazovat, kam prostředky směřují a jaký konkrétní krok pomohly pokrýt.' }
    ]
  },
  '/webove-gdpr': {
    label: 'GDPR',
    title: 'Webové GDPR',
    lead: 'Web pracuje s technickými cookies a může používat statistické nebo marketingové nástroje pouze podle zvoleného souhlasu.',
    sections: [
      { title: 'Cookies', text: 'Technické cookies jsou nutné pro základní fungování webu. Statistiky a marketing lze spravovat v nastavení cookies.' },
      { title: 'Formuláře a účty', text: 'Přihlašovací a registrační formuláře používají potvrzení vstupu do chráněné zóny a oddělují klientské a administrátorské prostředí.' }
    ]
  }
};

const programSlug = (title: string) =>
  title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\|\|/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const slugifyPathSegment = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\|\|/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'aktualita';

const getProgramBySlug = (slug: string) => programs.find((program) => programSlug(program.title) === slug);

const programPillarVisuals: Record<string, { src: string; alt: string; shortLabel: string }> = {
  JAILBREAK: {
    src: '/images/program-pillars/jailbreak.png',
    alt: 'Černobílá kresba programu JAILBREAK s otevřenou branou a cestou ven',
    shortLabel: 'návrat po VTOS'
  },
  RESET: {
    src: '/images/program-pillars/reset.png',
    alt: 'Černobílá kresba programu RESET se symbolem podpory a abstinence',
    shortLabel: 'závislosti a krize'
  },
  REWORK: {
    src: '/images/program-pillars/rework.png',
    alt: 'Černobílá kresba programu REWORK s člověkem u pracovního stolu',
    shortLabel: 'dlouhodobě nezaměstnaní'
  },
  STREETWISE: {
    src: '/images/program-pillars/streetwise.png',
    alt: 'Černobílá kresba programu STREETWISE s člověkem na ulici u lavičky',
    shortLabel: 'lidé bez domova'
  },
  'BOD ZLOMU': {
    src: '/images/program-pillars/bod-zlomu.png',
    alt: 'Černobílá kresba programu BOD ZLOMU se dvěma dětmi a plyšovým medvědem',
    shortLabel: 'mladí lidé z dětských domovů'
  },
  STABILIZACE: {
    src: '/images/program-pillars/stabilizace.png',
    alt: 'Černobílá kresba programu STABILIZACE se dvěma lidmi při podání ruky',
    shortLabel: 'konečná podpora'
  }
};

const getProgramPillarVisual = (programTitle: string) => programPillarVisuals[programTitle];

const getRouteLabel = (path: string) => {
  if (routeLabels[path]) return routeLabels[path];
  if (path.startsWith(storyDetailPrefix)) {
    const storyId = path.slice(storyDetailPrefix.length);
    return starterNews.find((item) => item.id === storyId)?.title ?? 'Příběh druhé šance';
  }
  if (path.startsWith('/programy/')) {
    const program = getProgramBySlug(path.replace('/programy/', ''));
    return program?.title ?? 'Program';
  }
  if (path.startsWith('/metodika/')) {
    return methodologyDocuments.find((document) => document.path === path)?.shortTitle ?? 'Veřejná metodika';
  }
  if (path.startsWith('/videa/')) {
    return videoWatchPages.find((video) => video.path === path)?.shortTitle ?? 'Video';
  }
  if (path.startsWith('/aktuality/')) return 'Aktuality';
  if (path.startsWith('/aktualita/')) return 'Aktualita';
  return 'Domů';
};

const normalizePath = (value: string) => {
  const path = (value.replace(/^#/, '').split('?')[0] || '/') as string;
  if (routeLabels[path]) return path;
  if (/^\/pribehy-druhe-sance\/[^/]+$/.test(path)) return path;
  if (/^\/aktuality\/[^/]+(?:\/[^/]+)?$/.test(path)) return path;
  if (/^\/aktualita\/[^/]+$/.test(path)) return path;
  if (methodologyDocuments.some((document) => document.path === path)) return path;
  if (videoWatchPages.some((video) => video.path === path)) return path;
  if (path.startsWith('/programy/') && getProgramBySlug(path.replace('/programy/', ''))) return path;
  return '/';
};

const localAuthFallbackEnabled = () =>
  ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname) || window.location.protocol === 'file:';

const currentBrowserPath = () => {
  if (window.location.hash.startsWith('#/')) return normalizePath(window.location.hash);
  return normalizePath(`${window.location.pathname}${window.location.search}`);
};

const internalHrefPath = (href: string) => normalizePath(href.replace(/^#/, ''));

const navigateToPath = (path: string) => {
  const nextPath = normalizePath(path);
  window.history.pushState(null, '', nextPath);
  window.dispatchEvent(new Event('popstate'));
};

type ClientRecord = {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  phone: string;
  email: string;
  address: string;
  targetGroup: string;
  program: string;
  institutionalCareHistory: string;
  childhoodBackground: string;
  status: string;
  notes: string;
  operationalId: string;
  createdAt: string;
};

type NewsItem = {
  id: string;
  title: string;
  slug?: string;
  date: string;
  excerpt: string;
  body?: string;
  tag?: string;
  imageUrl?: string;
};

const storyTag = 'Příběhy druhé šance';
const isSecondChanceStory = (item: Pick<NewsItem, 'tag'>) => item.tag === storyTag;
const storyPath = (item: Pick<NewsItem, 'id'>) => `${storyDetailPrefix}${encodeURIComponent(item.id)}`;
const newsTagLabel = (item: Pick<NewsItem, 'tag'>) => item.tag?.trim() || 'Aktuality projektu';
const newsTagSlug = (item: Pick<NewsItem, 'tag'>) => slugifyPathSegment(newsTagLabel(item));
const newsItemSlug = (item: Pick<NewsItem, 'id' | 'title' | 'slug'>) => slugifyPathSegment(item.slug || item.title || item.id);
const newsPath = (item: Pick<NewsItem, 'id' | 'title' | 'slug' | 'tag'>) =>
  isSecondChanceStory(item) ? storyPath(item) : `/aktuality/${newsTagSlug(item)}/${newsItemSlug(item)}`;
const newsTagPath = (tag: string) => `/aktuality/${slugifyPathSegment(tag)}`;

const newsTagOptions = [
  'Aktuality projektu',
  'Práce v terénu',
  'Stavíme svépomocí',
  'Proměna místa',
  'JAILBREAK',
  'RESET',
  'REWORK',
  'STREETWISE',
  'BOD ZLOMU',
  'STABILIZACE',
  'Příběhy druhé šance',
  'Události a konference',
  'Partnerství',
  'Data a výzkum',
  'Metodika',
  'Média a materiály',
  'Transparentnost',
  'Dobrovolnictví',
  'Pracovní příležitosti',
  'Komunita'
];

const mergeNewsItems = (fallbackItems: NewsItem[], apiItems: NewsItem[]) => {
  const byId = new Map<string, NewsItem>();
  fallbackItems.forEach((item) => byId.set(item.id, item));
  apiItems.forEach((item) => byId.set(item.id, item));
  return Array.from(byId.values()).sort((a, b) => {
    const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
    return dateDiff || a.title.localeCompare(b.title, 'cs');
  });
};

type NewsDiscussion = {
  likes: Record<string, ApiNewsLike>;
  comments: ApiNewsComment[];
};

type HomeSlide = ApiHomeSlide;
type HomepageContentItem = ApiHomepageContentItem;
type ContentEditorTab = 'hero' | 'gallery' | 'sections';

type FormDraft = Record<string, string>;

type FormTemplate = {
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

type ManagedUser = ApiManagedUser;
type ProjectApplication = ApiProjectApplication;
type MediaFile = ApiMediaFile;
type ClientDocument = ApiClientDocument;
type NotificationItem = ApiNotification;
type MaterialOffer = ApiMaterialOffer;
const materialOfferTypeLabels: Record<ApiMaterialOfferType, string> = {
  clothing: 'Oblečení',
  equipment: 'Vybavení',
  books: 'Knihy'
};
const materialOfferStatusOptions: Array<{ value: ApiMaterialOfferStatus; label: string }> = [
  { value: 'new', label: 'Nová' },
  { value: 'reviewing', label: 'Prověřujeme' },
  { value: 'accepted', label: 'Přijata' },
  { value: 'pickup_planned', label: 'Předání domluveno' },
  { value: 'received', label: 'Převzata' },
  { value: 'declined', label: 'Odmítnuta' },
  { value: 'closed', label: 'Uzavřena' }
];
const materialOfferTransportLabels: Record<ApiMaterialOfferTransport, string> = {
  'donor-delivery': 'Dárce může přivézt',
  'project-pickup': 'Potřebuje odvoz projektu',
  agreement: 'Dopravu domluvíme'
};
const materialOfferConditionLabels: Record<string, string> = {
  new: 'Nové / nepoužité',
  excellent: 'Velmi dobrý stav',
  good: 'Dobrý, běžně použitelný stav',
  usable: 'Použitelné s drobným opotřebením',
  repair: 'Vyžaduje opravu nebo kompletaci'
};
const roleLabels: Record<ApiRole, string> = {
  admin: 'Administrátor',
  editor: 'Editor',
  applicant: 'Uchazeč',
  client: 'Klient',
  volunteer: 'Dobrovolník',
  investor: 'Investor',
  patron: 'Mecenáš',
  contributor: 'Přispěvatel',
  donor: 'Jednorázový dárce',
  user: 'Uživatel'
};
const portalRoles: ApiRole[] = ['applicant', 'client', 'volunteer', 'investor', 'patron', 'contributor', 'donor', 'user'];
const applicationRoleOptions: Array<{ value: ApiProjectApplicationType; label: string; description: string }> = [
  { value: 'client', label: 'Klient', description: 'Žádám o podporu, práci s plánem a zapojení do programu.' },
  { value: 'volunteer', label: 'Dobrovolník', description: 'Chci pomáhat časem, dovedností nebo doprovodem lidí.' },
  { value: 'investor', label: 'Investor', description: 'Chci podpořit rozvoj projektu dlouhodobě nebo strategicky.' },
  { value: 'patron', label: 'Mecenáš', description: 'Chci být stabilní oporou projektu a jeho zázemí.' },
  { value: 'contributor', label: 'Přispěvatel', description: 'Chci přispívat opakovaně nebo podle možností.' },
  { value: 'donor', label: 'Jednorázový dárce', description: 'Chci poslat jednorázový dar nebo konkrétní podporu.' }
];
const adminRoleOptions: ApiRole[] = ['admin', 'editor', 'applicant', ...applicationRoleOptions.map((item) => item.value), 'user'];
const isPortalRole = (role?: ApiRole) => Boolean(role && portalRoles.includes(role));
const TRANSPARENCY_DOCUMENT_CATEGORY = 'transparency';
type MediaSelectGroup = {
  label: string;
  options: Array<{ value: string; label: string }>;
};
const mediaCategoryGroups: MediaSelectGroup[] = [
  {
    label: 'Obecné použití',
    options: [
      { value: 'visual', label: 'Obrázek / fotografie' },
      { value: 'document', label: 'Obecný dokument' },
      { value: 'other', label: 'Ostatní soubor' },
      { value: 'media', label: 'Mediální knihovna (starší kategorie)' }
    ]
  },
  {
    label: 'Web a komunikace',
    options: [
      { value: 'hero', label: 'Hero / banner webu' },
      { value: 'news', label: 'Aktualita / článek' },
      { value: 'gallery', label: 'Galerie / fotodokumentace' },
      { value: 'infographic', label: 'Infografika / graf / statistika' },
      { value: 'logo-brand', label: 'Logo / vizuální identita' },
      { value: 'social-media', label: 'Sociální sítě' },
      { value: 'press-media', label: 'Média / tiskové podklady' },
      { value: 'brochure', label: 'Brožura / leták / plakát' },
      { value: 'presentation', label: 'Prezentace' }
    ]
  },
  {
    label: 'Dokumenty a transparentnost',
    options: [
      { value: TRANSPARENCY_DOCUMENT_CATEGORY, label: 'Povinné zveřejňování' },
      { value: 'methodology', label: 'Metodika / standard' },
      { value: 'forms-templates', label: 'Formulář / šablona' },
      { value: 'annual-report', label: 'Výroční zpráva' },
      { value: 'financial-report', label: 'Finanční zpráva / rozpočet' },
      { value: 'legal-gdpr', label: 'Právní dokument / GDPR' },
      { value: 'partner-materials', label: 'Materiály pro partnery' },
      { value: 'internal-standard', label: 'Interní standard' }
    ]
  },
  {
    label: 'Programy REST||ART',
    options: [
      { value: 'program-jailbreak', label: 'Program JAILBREAK' },
      { value: 'program-reset', label: 'Program RESET' },
      { value: 'program-rework', label: 'Program REWORK' },
      { value: 'program-streetwise', label: 'Program STREETWISE' },
      { value: 'program-bod-zlomu', label: 'Program BOD ZLOMU' },
      { value: 'program-stabilizace', label: 'Program STABILIZACE' }
    ]
  },
  {
    label: 'Audiovizuální obsah',
    options: [
      { value: 'video', label: 'Video' },
      { value: 'audio', label: 'Audio' },
      { value: 'podcast', label: 'Podcast / rozhovor' }
    ]
  },
  {
    label: 'Data a technické soubory',
    options: [
      { value: 'data-spreadsheet', label: 'Tabulka / datový přehled' },
      { value: 'data-export', label: 'Datový export' },
      { value: 'archive', label: 'Archiv' },
      { value: 'font', label: 'Písmo' },
      { value: 'source-file', label: 'Zdrojový / pracovní soubor' }
    ]
  }
];
const mediaMimeTypeGroups: MediaSelectGroup[] = [
  {
    label: 'Obrázky',
    options: [
      { value: 'image/jpeg', label: 'JPEG obrázek (.jpg, .jpeg)' },
      { value: 'image/png', label: 'PNG obrázek (.png)' },
      { value: 'image/webp', label: 'WebP obrázek (.webp)' },
      { value: 'image/avif', label: 'AVIF obrázek (.avif)' },
      { value: 'image/gif', label: 'GIF obrázek / animace (.gif)' },
      { value: 'image/svg+xml', label: 'SVG vektorový obrázek (.svg)' },
      { value: 'image/tiff', label: 'TIFF obrázek (.tif, .tiff)' },
      { value: 'image/bmp', label: 'Bitmapový obrázek (.bmp)' },
      { value: 'image/heic', label: 'HEIC fotografie (.heic)' },
      { value: 'image/heif', label: 'HEIF fotografie (.heif)' }
    ]
  },
  {
    label: 'Dokumenty a text',
    options: [
      { value: 'application/pdf', label: 'PDF dokument (.pdf)' },
      { value: 'application/msword', label: 'Microsoft Word 97-2003 (.doc)' },
      { value: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', label: 'Microsoft Word (.docx)' },
      { value: 'application/rtf', label: 'Rich Text Format (.rtf)' },
      { value: 'application/vnd.oasis.opendocument.text', label: 'OpenDocument text (.odt)' },
      { value: 'text/plain', label: 'Prostý text (.txt)' },
      { value: 'text/html', label: 'HTML dokument (.html)' },
      { value: 'text/markdown', label: 'Markdown dokument (.md)' }
    ]
  },
  {
    label: 'Tabulky a data',
    options: [
      { value: 'application/vnd.ms-excel', label: 'Microsoft Excel 97-2003 (.xls)' },
      { value: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', label: 'Microsoft Excel (.xlsx)' },
      { value: 'application/vnd.oasis.opendocument.spreadsheet', label: 'OpenDocument tabulka (.ods)' },
      { value: 'text/csv', label: 'CSV data (.csv)' },
      { value: 'application/json', label: 'JSON data (.json)' },
      { value: 'application/xml', label: 'XML data (.xml)' }
    ]
  },
  {
    label: 'Prezentace',
    options: [
      { value: 'application/vnd.ms-powerpoint', label: 'Microsoft PowerPoint 97-2003 (.ppt)' },
      { value: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', label: 'Microsoft PowerPoint (.pptx)' },
      { value: 'application/vnd.oasis.opendocument.presentation', label: 'OpenDocument prezentace (.odp)' }
    ]
  },
  {
    label: 'Video',
    options: [
      { value: 'video/mp4', label: 'MP4 video (.mp4)' },
      { value: 'video/webm', label: 'WebM video (.webm)' },
      { value: 'video/quicktime', label: 'QuickTime video (.mov)' },
      { value: 'video/mpeg', label: 'MPEG video (.mpeg, .mpg)' },
      { value: 'video/x-msvideo', label: 'AVI video (.avi)' },
      { value: 'video/x-matroska', label: 'Matroska video (.mkv)' }
    ]
  },
  {
    label: 'Audio',
    options: [
      { value: 'audio/mpeg', label: 'MP3 audio (.mp3)' },
      { value: 'audio/mp4', label: 'MPEG-4 audio (.m4a)' },
      { value: 'audio/wav', label: 'WAV audio (.wav)' },
      { value: 'audio/ogg', label: 'OGG audio (.ogg)' },
      { value: 'audio/flac', label: 'FLAC audio (.flac)' }
    ]
  },
  {
    label: 'Archivy a balíčky',
    options: [
      { value: 'application/zip', label: 'ZIP archiv (.zip)' },
      { value: 'application/gzip', label: 'GZIP archiv (.gz)' },
      { value: 'application/x-7z-compressed', label: '7-Zip archiv (.7z)' },
      { value: 'application/vnd.rar', label: 'RAR archiv (.rar)' },
      { value: 'application/x-tar', label: 'TAR archiv (.tar)' }
    ]
  },
  {
    label: 'Písma',
    options: [
      { value: 'font/woff', label: 'Web Open Font (.woff)' },
      { value: 'font/woff2', label: 'Web Open Font 2 (.woff2)' },
      { value: 'font/ttf', label: 'TrueType font (.ttf)' },
      { value: 'font/otf', label: 'OpenType font (.otf)' }
    ]
  },
  {
    label: 'Ostatní',
    options: [
      { value: 'text/calendar', label: 'Kalendářová událost (.ics)' },
      { value: 'text/vcard', label: 'Elektronická vizitka (.vcf)' },
      { value: 'application/octet-stream', label: 'Obecný binární soubor' }
    ]
  }
];
const knownMediaCategories = new Set(mediaCategoryGroups.flatMap((group) => group.options.map((option) => option.value)));
const knownMediaMimeTypes = new Set(mediaMimeTypeGroups.flatMap((group) => group.options.map((option) => option.value)));
const mediaMimeTypeByExtension: Record<string, string> = {
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', avif: 'image/avif', gif: 'image/gif', svg: 'image/svg+xml',
  tif: 'image/tiff', tiff: 'image/tiff', bmp: 'image/bmp', heic: 'image/heic', heif: 'image/heif', pdf: 'application/pdf', doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', rtf: 'application/rtf', odt: 'application/vnd.oasis.opendocument.text',
  txt: 'text/plain', html: 'text/html', htm: 'text/html', md: 'text/markdown', xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', ods: 'application/vnd.oasis.opendocument.spreadsheet', csv: 'text/csv',
  json: 'application/json', xml: 'application/xml', ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', odp: 'application/vnd.oasis.opendocument.presentation',
  mp4: 'video/mp4', webm: 'video/webm', mov: 'video/quicktime', mpeg: 'video/mpeg', mpg: 'video/mpeg', avi: 'video/x-msvideo', mkv: 'video/x-matroska',
  mp3: 'audio/mpeg', m4a: 'audio/mp4', wav: 'audio/wav', ogg: 'audio/ogg', flac: 'audio/flac', zip: 'application/zip', gz: 'application/gzip',
  '7z': 'application/x-7z-compressed', rar: 'application/vnd.rar', tar: 'application/x-tar', woff: 'font/woff', woff2: 'font/woff2',
  ttf: 'font/ttf', otf: 'font/otf', ics: 'text/calendar', vcf: 'text/vcard'
};
const inferMediaMimeType = (fileName: string) => mediaMimeTypeByExtension[fileName.split('.').pop()?.toLowerCase() ?? ''] || 'application/octet-stream';
const inferMediaCategory = (mimeType: string) => {
  if (mimeType.startsWith('image/')) return 'visual';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.startsWith('font/')) return 'font';
  if (['application/zip', 'application/gzip', 'application/x-7z-compressed', 'application/vnd.rar', 'application/x-tar'].includes(mimeType)) return 'archive';
  if (['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.oasis.opendocument.spreadsheet', 'text/csv'].includes(mimeType)) return 'data-spreadsheet';
  if (['application/json', 'application/xml'].includes(mimeType)) return 'data-export';
  if (mimeType === 'application/octet-stream') return 'other';
  return 'document';
};
const institutionalCareOptions = [
  { value: 'unknown', label: 'Nezjištěno / nechce uvést' },
  { value: 'yes', label: 'Ano - dětský domov / ústavní péče' },
  { value: 'no', label: 'Ne' }
];
const institutionalCareLabel = (value?: string | null) =>
  institutionalCareOptions.find((item) => item.value === value)?.label ?? institutionalCareOptions[0].label;
const childhoodBackgroundOptions = [
  { value: 'unknown', label: 'Nezjištěno / neuvedeno' },
  { value: 'institutional_home', label: 'Dětský domov' },
  { value: 'educational_institute', label: 'Výchovný ústav' },
  { value: 'foster_care', label: 'Pěstounská péče' },
  { value: 'incomplete_family', label: 'Neúplná rodina' },
  { value: 'standard_family', label: 'Běžná rodina' },
  { value: 'street_or_homelessness', label: 'Ulice / bez stabilního zázemí' },
  { value: 'other', label: 'Jiné' }
];
const childhoodBackgroundLabel = (value?: string | null) =>
  childhoodBackgroundOptions.find((item) => item.value === value)?.label ?? childhoodBackgroundOptions[0].label;
const loadSeededTransparentDocuments = () => import('./transparentDocuments').then((module) => module.seededTransparentDocuments as unknown as MediaFile[]);
const PrintableForm = React.lazy(() => import('./PrintableForm'));

type PublicMediaAsset = {
  id: string;
  title: string;
  description: string;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
  kind: 'pdf' | 'image' | 'logo';
};

const publicMediaKitAssets: PublicMediaAsset[] = [
  {
    id: 'restart-plakat',
    title: 'REST||ART plakát',
    description: 'Veřejný plakát projektu pro sdílení, tisk a partnerskou komunikaci.',
    fileName: 'restart-plakat.pdf',
    fileUrl: '/documents/media/restart-plakat.pdf',
    mimeType: 'application/pdf',
    fileSize: 3865485,
    kind: 'pdf'
  },
  {
    id: 'restart-brochure-rozkladaci',
    title: 'REST||ART rozkládací brožura',
    description: 'Stručná projektová brožura pro představení poslání, programů a možností zapojení.',
    fileName: 'brochure-rozkladaci-03.pdf',
    fileUrl: '/documents/media/brochure-rozkladaci-03.pdf',
    mimeType: 'application/pdf',
    fileSize: 807252,
    kind: 'pdf'
  },
  {
    id: 'restart-brochure-jailbreak',
    title: 'Brožura programu JAILBREAK',
    description: 'Programová brožura zaměřená na podporu návratu po výkonu trestu a druhou šanci v praxi.',
    fileName: 'brochure-jailbreak.pdf',
    fileUrl: '/documents/media/brochure-jailbreak.pdf',
    mimeType: 'application/pdf',
    fileSize: 975787,
    kind: 'pdf'
  },
  {
    id: 'restart-elegant-brochure',
    title: 'Prezentační brožura REST||ART',
    description: 'Elegantní veřejná brožura pro partnery, podporovatele a úvodní představení projektu.',
    fileName: 'elegant-brochure.pdf',
    fileUrl: '/documents/media/elegant-brochure.pdf',
    mimeType: 'application/pdf',
    fileSize: 290962,
    kind: 'pdf'
  },
  {
    id: 'restart-projekt-infografika',
    title: 'Projekt REST||ART Integrace',
    description: 'Prezentační projektová infografika s posláním, kontakty a základními pilíři projektu.',
    fileName: 'restart-projekt-infografika.png',
    fileUrl: '/images/media/restart-projekt-infografika.png',
    mimeType: 'image/png',
    fileSize: 1396629,
    kind: 'image'
  },
  {
    id: 'restart-sekundarni-znak',
    title: 'Sekundární znak REST||ART',
    description: 'Černobílý kruhový znak pro dokumenty, plakáty a doprovodné materiály.',
    fileName: 'restart-sekundarni-znak.png',
    fileUrl: '/images/media/restart-sekundarni-znak.png',
    mimeType: 'image/png',
    fileSize: 773976,
    kind: 'logo'
  },
  {
    id: 'restart-zazemi-upravena-fotka',
    title: 'Upravená fotka zázemí',
    description: 'Prezentační fotografie zázemí projektu pro média a veřejnou komunikaci.',
    fileName: 'restart-zazemi-upravena-fotka.png',
    fileUrl: '/images/media/restart-zazemi-upravena-fotka.png',
    mimeType: 'image/png',
    fileSize: 5447357,
    kind: 'image'
  }
];

const methodologyLifecycleSteps = [
  'První kontakt',
  'Intake a vstupní posouzení',
  'Zařazení do programu',
  'Komplexní mapování situace',
  'Individuální plán podpory',
  'Realizace intervencí',
  'Průběžné hodnocení',
  'Stabilizace',
  'Follow-up',
  'Samostatný klient'
];

const methodologyPillars = [
  {
    title: 'JAILBREAK',
    text: 'Příprava a podpora osob ve výkonu trestu a po propuštění. Důraz je na rozhodnutí, plán návratu a zodpovědnost.'
  },
  {
    title: 'RESET',
    text: 'Obnovení režimu, základních návyků, stability těla, mysli a prostředí před dalšími kroky.'
  },
  {
    title: 'STREETWISE',
    text: 'Praktické dovednosti pro běžný život: finance, komunikace, orientace v pravidlech a krizové rozhodování.'
  },
  {
    title: 'REWORK',
    text: 'Pracovní integrace, rekvalifikace, příprava na zaměstnání a obnova profesní identity.'
  },
  {
    title: 'BOD ZLOMU',
    text: 'Včasná prevence u mladých lidí a lidí v riziku. Bod zlomu vytváříme dříve, než přijde selhání.'
  },
  {
    title: 'STABILIZACE',
    text: 'Dlouhodobé udržení změny: práce, bydlení, vztahy, komunita, zdraví a měřitelné vyhodnocování.'
  }
];

const methodologyPrinciples = [
  {
    icon: ShieldCheck,
    title: 'Odpovědnost před omluvou',
    text: 'Klient dostává příležitost, ne výmluvu. Důvěra je vždy spojena s konkrétní odpovědností.'
  },
  {
    icon: ClipboardList,
    title: 'Měřitelnost místo dojmů',
    text: 'Pracujeme se Stabilizačním indexem, KPI, revizemi plánu a anonymizovaným veřejným reportingem.'
  },
  {
    icon: Users,
    title: 'Překlad mezi dvěma světy',
    text: 'Metodika propojuje očekávání zaměstnavatelů, institucí a lidí s trestní nebo krizovou minulostí.'
  },
  {
    icon: Wrench,
    title: 'Standard formulářů',
    text: 'PDF standard drží jednotnou identitu, přesnou geometrii polí a povinnou vizuální i funkční kontrolu.'
  }
];

const methodologyVisuals = [
  {
    title: 'Druhá šance, skutečná změna',
    src: '/images/methodology/druha-sance-skutecna-zmena.png',
    alt: 'Vizuál REST ART Integrace s textem Druhá šance, skutečná změna.',
    note: 'Veřejný prezentační vizuál pro základní sdělení projektu.'
  },
  {
    title: 'Životní cyklus klienta',
    src: '/images/methodology/zivotni-cyklus-klienta.png',
    alt: 'Infografika životního cyklu klienta REST ART Integrace.',
    note: 'Metodický model od prvního kontaktu přes intervenci, hodnocení a follow-up.'
  },
  {
    title: 'Životní cyklus pro metodiky',
    src: '/images/methodology/zivotni-cyklus-klienta-ministerstvo.png',
    alt: 'Rozšířená verze životního cyklu klienta s rámcem a podporou ministerstva.',
    note: 'Varianta pro institucionální jednání, standardy kvality a akreditaci programů.'
  },
  {
    title: 'Šest programových pilířů',
    src: '/images/methodology/sest-programovych-piliru.png',
    alt: 'Infografika šesti programových pilířů REST ART Integrace.',
    note: 'Pracovní metodický vizuál. Před tiskem projde ještě závěrečnou jazykovou a URL korekturou.'
  },
  {
    title: 'Síť spolupráce',
    src: '/images/methodology/sit-spoluprace.png',
    alt: 'Mapa sítě spolupráce REST ART Integrace v České republice.',
    note: 'Pracovní vizuál partnerství mezi institucemi, zaměstnavateli, komunitou a odborníky.'
  },
  {
    title: 'Milníky 2025-2026',
    src: '/images/methodology/milniky-2025-2026.png',
    alt: 'Časová osa a milníky projektu REST ART Integrace pro roky 2025 a 2026.',
    note: 'Pracovní přehled vývoje projektu od vzniku po pilotní ověřování.'
  }
];

const methodologyIconVisuals = [
  {
    title: 'BOD ZLOMU',
    src: '/images/methodology/bod-zlomu-ikon.png',
    alt: 'Ikona programu BOD ZLOMU.'
  },
  {
    title: 'STABILIZACE',
    src: '/images/methodology/stabilizace-ikon.png',
    alt: 'Ikona programu STABILIZACE.'
  }
];

const methodologyDownloads = [
  {
    title: 'METODIKA REST||ART INTEGRACE',
    description: 'Veřejná PDF verze metodiky: životní cyklus klienta, princip práce, programová architektura a rámec odpovědné reintegrace.',
    fileName: 'metodika-restart-integrace.pdf',
    fileUrl: '/documents/methodology/metodika-restart-integrace.pdf',
    mimeType: 'PDF',
    fileSize: 2277729
  }
];

const methodologyAdminDownloads = [
  {
    title: 'METODIKA REST||ART INTEGRACE',
    description: 'Pracovní dokument metodiky s životním cyklem klienta, procesy, principy práce a programovou architekturou.',
    fileName: 'metodika-restart-integrace.docx',
    fileUrl: '/documents/methodology/metodika-restart-integrace.docx',
    mimeType: 'DOCX',
    fileSize: 10198668
  },
  {
    title: 'Standard stylu PDF formulářů',
    description: 'Technický a vizuální standard pro formuláře: statický master, pole, barvy, typografie a kontrolní pravidla.',
    fileName: 'standard-stylu-pdf-formularu-v2-1-rc4.pdf',
    fileUrl: '/documents/methodology/standard-stylu-pdf-formularu-v2-1-rc4.pdf',
    mimeType: 'PDF',
    fileSize: 2807045
  }
];

const methodologyStyleTokens = [
  { name: 'Primary dark green', value: '#0D5E46' },
  { name: 'Accent green', value: '#8BC53F' },
  { name: 'Field fill', value: '#E9EFFC' },
  { name: 'Section band', value: '#EAF5E6' },
  { name: 'Light green-white', value: '#F5FAF3' },
  { name: 'Warning', value: '#FFF8D8' },
  { name: 'Main text', value: '#0B1F18' },
  { name: 'Secondary text', value: '#5D6B66' }
];

type AuthRole = ApiRole;

type AuthAccount = {
  id: string;
  role: AuthRole;
  name: string;
  email: string;
  phone: string;
  password: string;
  createdAt: string;
};

type AuthMode = 'login' | 'register' | 'reset' | 'reset-confirm';

type ClientProfileDraft = {
  name: string;
  phone: string;
  note: string;
  avatar: string;
  source: string;
  zoom: number;
  offsetX: number;
  offsetY: number;
  rotation: number;
  filter: string;
};

type ClientSettingsDraft = {
  privacyMode: string;
  documentEmails: boolean;
  commentEmails: boolean;
  twoFactorEnabled: boolean;
};

type ProjectApplicationDraft = {
  requestedRole: ApiProjectApplicationType;
  phone: string;
  motivation: string;
  availability: string;
  contribution: string;
  note: string;
};

type AdminToolsDraft = {
  firstName: string;
  lastName: string;
  registrationDate: string;
  sequence: number;
  generatedId: string;
  barcodeValue: string;
  qrValue: string;
};

type CodeArchiveKind = 'barcode' | 'qr';

type CodeArchiveEntry = {
  id: string;
  kind: CodeArchiveKind;
  value: string;
  clientId: string;
  clientName: string;
  formId: string;
  formTitle: string;
  note: string;
  source: 'manual' | 'csv';
  createdAt: string;
  importedAt: string;
};

type LoginRequest = {
  email: string;
  password: string;
  role: AuthRole;
};

type RegisterRequest = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

type ResetConfirmRequest = {
  token: string;
  password: string;
};

type MediaUploadResult = {
  fileName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
};

type FeedbackTone = 'success' | 'error' | 'warning' | 'info';
type FeedbackVariant = FeedbackTone | 'danger';

type ToastMessage = {
  id: string;
  tone: FeedbackTone;
  title: string;
  text?: string;
};

type NotifyFn = (tone: FeedbackTone, title: string, text?: string) => void;

type AdminContextMenuItem = {
  label: string;
  text?: string;
  icon?: React.ReactNode;
  tone?: 'default' | 'success' | 'danger';
  disabled?: boolean;
  onSelect: () => void;
};

type ModalState = {
  title: string;
  text: string;
  tone: FeedbackTone;
} | null;

type AdminDialogState =
  | { type: 'template'; template: FormTemplate }
  | { type: 'media'; media: MediaFile }
  | { type: 'user'; user: ManagedUser }
  | { type: 'notification'; notification: NotificationItem }
  | { type: 'settings'; section: 'organization' | 'security' };

type AdminSettingsDraft = {
  organizationName: string;
  primaryColor: string;
  seoTitle: string;
  seoDescription: string;
  cookiesMode: string;
  loginMode: string;
  rolesMode: string;
  passwordResetMode: string;
  twoFactorMode: string;
};

type LayoutConfig = {
  pageMax: string;
  pageGutter: string;
  breakpoints: {
    s: number;
    m: number;
    l: number;
  };
};

type IconConfig = {
  size: number;
  strokeWidth: number;
};

type ToastContextValue = {
  notify: NotifyFn;
  dismissToast: (id: string) => void;
  messages: ToastMessage[];
};

type CookieCategory = 'necessary' | 'statistics' | 'marketing';

type CookiePreferences = {
  necessary: true;
  statistics: boolean;
  marketing: boolean;
  decidedAt: string;
  version: string;
};

const COOKIE_PREFERENCES_EVENT = 'restart-cookie-preferences-changed';

type CookieCatalogItem = {
  name: string;
  service: string;
  category: CookieCategory;
  duration: string;
  owner: string;
  policyUrl?: string;
};

type AdminSection =
  | 'dashboard'
  | 'news'
  | 'content'
  | 'clients'
  | 'forms'
  | 'tools'
  | 'codeArchive'
  | 'media'
  | 'materialOffers'
  | 'users'
  | 'notifications'
  | 'settings';

type ClientSection =
  | 'dashboard'
  | 'profile'
  | 'application'
  | 'avatar'
  | 'documents'
  | 'activity'
  | 'notifications'
  | 'settings';

type AdminActivityKind = 'notification' | 'comment' | 'like' | 'registration' | 'client' | 'document' | 'news';

type AdminActivityTarget = {
  tab: AdminSection;
  clientId?: string;
  newsId?: string;
  notificationId?: string;
  userId?: string;
  documentId?: string;
  href?: string;
};

type AdminActivityItem = {
  id: string;
  kind: AdminActivityKind;
  title: string;
  text: string;
  date: string;
  tone: FeedbackTone;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  target: AdminActivityTarget;
  unread?: boolean;
  meta?: string;
};

type WorkspaceNavItem<T extends string> = {
  id: T;
  label: string;
  text: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
};

const layoutConfig: LayoutConfig = {
  pageMax: '1640px',
  pageGutter: 'clamp(22px, 3.6vw, 58px)',
  breakpoints: {
    s: 640,
    m: 980,
    l: 1200
  }
};

const iconConfig: IconConfig = {
  size: 18,
  strokeWidth: 2
};

const LayoutContext = React.createContext<LayoutConfig>(layoutConfig);
const IconContext = React.createContext<IconConfig>(iconConfig);
const ToastContext = React.createContext<ToastContextValue | null>(null);

const adminNavItems: Array<WorkspaceNavItem<AdminSection>> = [
  { id: 'dashboard', label: 'Dashboard', text: 'Statistiky a rychlé akce', icon: LayoutDashboard },
  { id: 'news', label: 'Aktuality', text: 'Publikace a archiv', icon: Newspaper },
  { id: 'content', label: 'Příspěvky / obsah', text: 'Články, reporty, galerie', icon: FileStack },
  { id: 'clients', label: 'Klienti', text: 'Seznam, detail, stav', icon: Users },
  { id: 'forms', label: 'Tiskové formuláře', text: 'Šablony a exporty', icon: ClipboardList },
  { id: 'tools', label: 'Tools', text: 'ID, čárové kódy, QR', icon: Wrench },
  { id: 'codeArchive', label: 'Archiv kódů', text: 'CSV, čárové kódy, QR', icon: FolderOpen },
  { id: 'media', label: 'Média', text: 'Obrázky a dokumenty', icon: ImageIcon },
  { id: 'materialOffers', label: 'Materiální dary', text: 'Oblečení, vybavení a knihy', icon: PackageOpen },
  { id: 'users', label: 'Uživatelé a role', text: 'Admin, editor, user', icon: UserCog },
  { id: 'notifications', label: 'Notifikace', text: 'Zprávy a upozornění', icon: Bell },
  { id: 'settings', label: 'Nastavení', text: 'Branding, SEO, bezpečnost', icon: Settings }
];

const adminSectionIds = adminNavItems.map((item) => item.id);

const toFeedbackTone = (value: string | null | undefined): FeedbackTone =>
  value === 'success' || value === 'error' || value === 'warning' || value === 'info' ? value : 'info';

const shortenActivityText = (value: string, maxLength = 132) => {
  const text = value.replace(/\s+/g, ' ').trim();
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
};

const parseAdminActivityLink = (href?: string): AdminActivityTarget | null => {
  if (!href) return null;
  const normalized = href.trim().replace(/^#/, '');
  const [path, search = ''] = normalized.split('?');
  if (path !== '/admin') return null;
  const params = new URLSearchParams(search);
  const tab = params.get('tab') as AdminSection | null;
  const safeTab = tab && adminSectionIds.includes(tab) ? tab : 'dashboard';
  return {
    tab: safeTab,
    clientId: params.get('client') ?? undefined,
    newsId: params.get('news') ?? undefined,
    notificationId: params.get('notification') ?? undefined,
    userId: params.get('user') ?? undefined,
    documentId: params.get('document') ?? undefined,
    href
  };
};

const getAdminActivityQueryParam = (href: string | undefined, key: string) => {
  if (!href) return '';
  const query = href.split('?')[1] || '';
  return new URLSearchParams(query).get(key) || '';
};

const clientNavItems: Array<WorkspaceNavItem<ClientSection>> = [
  { id: 'dashboard', label: 'Dashboard', text: 'Stav účtu a přehled', icon: LayoutDashboard },
  { id: 'profile', label: 'Můj profil', text: 'Jméno, kontakty, bio', icon: UserRound },
  { id: 'application', label: 'Žádost o vstup', text: 'Klient, dobrovolník, podpora', icon: ClipboardList },
  { id: 'avatar', label: 'Avatar / profilovka', text: 'Upload, ořez, náhled', icon: ImageIcon },
  { id: 'documents', label: 'Moje dokumenty', text: 'Soubory a formuláře', icon: FolderOpen },
  { id: 'activity', label: 'Moje aktivita', text: 'Historie změn', icon: ClipboardList },
  { id: 'notifications', label: 'Notifikace', text: 'Zprávy a potvrzení', icon: Bell },
  { id: 'settings', label: 'Nastavení účtu', text: 'Heslo, 2FA, soukromí', icon: ShieldCheck }
];

const cookieCatalog: CookieCatalogItem[] = [
  {
    name: 'restart-cookie-preferences',
    service: 'REST||ART Integrace',
    category: 'necessary',
    duration: '1 rok',
    owner: 'REST||ART Integrace'
  },
  {
    name: 'restart-auth-session',
    service: 'REST||ART Integrace',
    category: 'necessary',
    duration: 'Relace / lokální nastavení',
    owner: 'REST||ART Integrace'
  },
  {
    name: 'webSID',
    service: 'Webová aplikace',
    category: 'necessary',
    duration: 'Relace',
    owner: 'REST||ART Integrace'
  },
  {
    name: '_ga',
    service: 'Google Analytics',
    category: 'statistics',
    duration: '2 roky',
    owner: 'Google LLC',
    policyUrl: 'https://policies.google.com/privacy'
  },
  {
    name: '_ga_*',
    service: 'Google Analytics',
    category: 'statistics',
    duration: '2 roky',
    owner: 'Google LLC',
    policyUrl: 'https://policies.google.com/privacy'
  },
  {
    name: '_gid',
    service: 'Google Analytics',
    category: 'statistics',
    duration: '24 hodin',
    owner: 'Google LLC',
    policyUrl: 'https://policies.google.com/privacy'
  },
  {
    name: '_gat*',
    service: 'Google Analytics',
    category: 'statistics',
    duration: 'Relace',
    owner: 'Google LLC',
    policyUrl: 'https://policies.google.com/privacy'
  },
  {
    name: '_pk_id*',
    service: 'Matomo',
    category: 'statistics',
    duration: '1 rok',
    owner: 'Matomo',
    policyUrl: 'https://matomo.org/privacy-policy/'
  },
  {
    name: '_pk_ses*',
    service: 'Matomo',
    category: 'statistics',
    duration: 'Relace',
    owner: 'Matomo',
    policyUrl: 'https://matomo.org/privacy-policy/'
  },
  {
    name: 'YSC',
    service: 'YouTube / Google',
    category: 'necessary',
    duration: 'Relace',
    owner: 'Google LLC',
    policyUrl: 'https://policies.google.com/privacy'
  },
  {
    name: 'VISITOR_INFO1_LIVE',
    service: 'YouTube / Google',
    category: 'marketing',
    duration: '6 měsíců',
    owner: 'Google LLC',
    policyUrl: 'https://policies.google.com/privacy'
  },
  {
    name: 'NID',
    service: 'Google reCAPTCHA',
    category: 'necessary',
    duration: '6 měsíců',
    owner: 'Google LLC',
    policyUrl: 'https://policies.google.com/privacy'
  },
  {
    name: '_GRECAPTCHA',
    service: 'Google reCAPTCHA',
    category: 'necessary',
    duration: '6 měsíců',
    owner: 'Google LLC',
    policyUrl: 'https://policies.google.com/privacy'
  },
  {
    name: '_fbp',
    service: 'Meta Pixel',
    category: 'marketing',
    duration: '3 měsíce',
    owner: 'Meta Platforms Ireland Ltd.',
    policyUrl: 'https://www.facebook.com/privacy/policy/'
  },
  {
    name: 'li_gc',
    service: 'LinkedIn profilový odznak',
    category: 'marketing',
    duration: '6 měsíců',
    owner: 'LinkedIn Ireland Unlimited Company',
    policyUrl: 'https://www.linkedin.com/legal/privacy-policy'
  },
  {
    name: '_gcl_au',
    service: 'Google Ads',
    category: 'marketing',
    duration: '3 měsíce',
    owner: 'Google LLC',
    policyUrl: 'https://policies.google.com/privacy'
  },
  {
    name: '_uetsid',
    service: 'Microsoft Ads',
    category: 'marketing',
    duration: '24 hodin',
    owner: 'Microsoft',
    policyUrl: 'https://privacy.microsoft.com/privacystatement'
  },
  {
    name: '_uetvid',
    service: 'Microsoft Ads',
    category: 'marketing',
    duration: '1 rok',
    owner: 'Microsoft',
    policyUrl: 'https://privacy.microsoft.com/privacystatement'
  },
  {
    name: 'sp_t',
    service: 'Spotify',
    category: 'necessary',
    duration: '68 let',
    owner: 'Spotify',
    policyUrl: 'https://www.spotify.com/legal/privacy-policy/'
  },
  {
    name: 'sp_landing',
    service: 'Spotify',
    category: 'necessary',
    duration: '24 hodin',
    owner: 'Spotify',
    policyUrl: 'https://www.spotify.com/legal/privacy-policy/'
  }
];

const fromApiUser = (user: ApiUser): AuthAccount => ({
  id: user.id,
  role: user.role,
  name: user.name,
  email: user.email,
  phone: user.phone,
  password: '',
  createdAt: user.createdAt
});

const fromApiClient = (client: ApiClientRecord): ClientRecord => ({
  id: client.id,
  firstName: client.firstName,
  lastName: client.lastName,
  birthDate: client.birthDate || '',
  phone: client.phone || '',
  email: client.email || '',
  address: client.address || '',
  targetGroup: client.targetGroup || '',
  program: client.program,
  institutionalCareHistory: client.institutionalCareHistory || 'unknown',
  childhoodBackground: client.childhoodBackground || 'unknown',
  status: client.status,
  notes: client.notes || '',
  operationalId: client.operationalId || '',
  createdAt: client.createdAt
});

const clientStatusClass = (status: string) => {
  const normalized = stripDiacritics(status).toLowerCase();
  if (normalized.includes('novy')) return 'is-new';
  if (normalized.includes('mapovani')) return 'is-mapping';
  if (normalized.includes('zarazen')) return 'is-active';
  if (normalized.includes('stabilizace')) return 'is-stabilization';
  if (normalized.includes('uzavreno')) return 'is-closed';
  return 'is-default';
};

const newsHtmlTags = new Set([
  'A',
  'B',
  'BLOCKQUOTE',
  'BR',
  'DIV',
  'EM',
  'FIGCAPTION',
  'FIGURE',
  'H1',
  'H2',
  'H3',
  'H4',
  'HR',
  'I',
  'IFRAME',
  'IMG',
  'LI',
  'OL',
  'P',
  'SPAN',
  'STRONG',
  'U',
  'UL'
]);
const newsAlignmentClasses = new Set(['align-left', 'align-center', 'align-right', 'align-justify']);
const newsLayoutClasses = new Set([
  'progress-comparison',
  'progress-comparison-card',
  'progress-comparison-card--work',
  'progress-comparison-card--reference',
  'progress-comparison-media',
  'progress-comparison-label',
  'project-status',
  'project-status-badge',
  'project-photo-story',
  'project-photo-story-copy',
  'project-gallery',
  'project-gallery-card',
  'project-gallery-card--wide',
  'news-video'
]);
const newsHtmlClasses = new Set([...newsAlignmentClasses, ...newsLayoutClasses]);
const newsHtmlAttrs = new Map([
  ['A', new Set(['href', 'target', 'rel', 'title'])],
  ['DIV', new Set(['class'])],
  ['FIGCAPTION', new Set(['class'])],
  ['FIGURE', new Set(['class'])],
  ['H1', new Set(['class'])],
  ['H2', new Set(['class'])],
  ['H3', new Set(['class'])],
  ['H4', new Set(['class'])],
  ['IMG', new Set(['src', 'alt', 'title', 'loading', 'width', 'height'])],
  ['IFRAME', new Set(['src', 'title', 'allow', 'allowfullscreen', 'loading'])],
  ['P', new Set(['class'])],
  ['SPAN', new Set(['class'])]
]);

function isSafeNewsUrl(tagName: string, attrName: string, value: string) {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (attrName === 'href') return /^(https?:|mailto:|tel:|#|\/)/i.test(trimmed);
  if (tagName === 'IMG' && attrName === 'src') return /^(https?:|\/)/i.test(trimmed);
  if (tagName === 'IFRAME' && attrName === 'src') {
    try {
      const url = new URL(trimmed, window.location.origin);
      return ['youtube.com', 'www.youtube.com', 'youtube-nocookie.com', 'www.youtube-nocookie.com', 'vimeo.com', 'player.vimeo.com'].includes(url.hostname);
    } catch {
      return false;
    }
  }
  return true;
}

function cleanNewsHtml(value = '', fallbackImageAlt = 'Obrázek k aktualitě') {
  if (typeof document === 'undefined') {
    return value
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
      .replace(/\son\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
      .replace(/javascript:/gi, '');
  }

  const template = document.createElement('template');
  template.innerHTML = value;

  const cleanNode = (node: Node) => {
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === Node.COMMENT_NODE) {
        child.remove();
        continue;
      }
      if (child.nodeType !== Node.ELEMENT_NODE) {
        continue;
      }

      const element = child as HTMLElement;
      const tagName = element.tagName;
      if (!newsHtmlTags.has(tagName)) {
        if (tagName === 'SCRIPT' || tagName === 'STYLE') {
          element.remove();
        } else {
          element.replaceWith(...Array.from(element.childNodes));
        }
        cleanNode(node);
        continue;
      }

      const allowedAttrs = newsHtmlAttrs.get(tagName) || new Set<string>();
      for (const attribute of Array.from(element.attributes)) {
        const attrName = attribute.name.toLowerCase();
        if (attrName === 'class' && allowedAttrs.has(attrName)) {
          const safeClasses = attribute.value.split(/\s+/).filter((className) => newsHtmlClasses.has(className));
          if (safeClasses.length > 0) {
            element.setAttribute('class', safeClasses.join(' '));
          } else {
            element.removeAttribute(attribute.name);
          }
          continue;
        }
        if (!allowedAttrs.has(attrName) || !isSafeNewsUrl(tagName, attrName, attribute.value)) {
          element.removeAttribute(attribute.name);
        }
      }

      if (tagName === 'A') {
        element.setAttribute('rel', 'noopener noreferrer');
      }
      if (tagName === 'IMG') {
        if (!element.getAttribute('src')?.trim()) {
          element.remove();
          continue;
        }
        if (!element.getAttribute('alt')?.trim()) {
          element.setAttribute('alt', fallbackImageAlt);
        }
        if (!element.getAttribute('width')?.trim()) {
          element.setAttribute('width', '1200');
        }
        if (!element.getAttribute('height')?.trim()) {
          element.setAttribute('height', '675');
        }
        element.setAttribute('loading', 'lazy');
      }
      if (tagName === 'IFRAME') {
        if (!element.getAttribute('src')?.trim()) {
          element.remove();
          continue;
        }
        if (!element.getAttribute('title')?.trim()) {
          element.setAttribute('title', 'Vložené video');
        }
        element.setAttribute('loading', 'lazy');
      }
      cleanNode(element);
    }
  };

  cleanNode(template.content);
  return template.innerHTML;
}

const fromApiFormTemplate = (template: ApiFormTemplate): FormTemplate => ({
  id: template.id,
  formUid: template.formUid,
  formGroup: template.formGroup,
  title: template.title,
  description: template.description,
  fields: template.fields,
  fileUrl: template.fileUrl,
  folder: template.folder,
  sourceNote: template.sourceNote,
  sizeBytes: template.sizeBytes,
  status: template.status,
  isCurrent: template.isCurrent,
  isActive: template.isActive
});

const readableBytes = (value?: number) => {
  if (!value) return 'velikost neznámá';
  if (value < 1024 * 1024) return `${Math.round(value / 102.4) / 10} kB`;
  return `${Math.round(value / 1024 / 102.4) / 10} MB`;
};

const formCategoryTitle = (folder?: string) => {
  if (!folder) return 'Bez kategorie';
  const withoutPrefix = folder.replace(/^\d+_/, '').replace(/_/g, ' ').toLowerCase();
  return withoutPrefix.charAt(0).toUpperCase() + withoutPrefix.slice(1);
};

const formFolderByPrefix: Record<string, string> = {
  GDPR: '01_GDPR_A_SOUHLASY',
  KLI: '02_KLIENTSKA_SLOZKA',
  KRI: '04_KRIZOVY_REZIM',
  EVA: '05_EVALUACE_A_FOLLOW_UP',
  REG: '06_REGISTRY',
  ETY: '07_ETIKA_A_TYM',
  DOP: '08_DOPLNKOVE_LISTY',
  AIO: '99_ALL_IN_ONE_VOLITELNE'
};

const formFolderHints: Array<[RegExp, string]> = [
  [/GDPR/i, formFolderByPrefix.GDPR],
  [/INTAKE|EXIT|KNIHA_KLIENTA/i, formFolderByPrefix.KLI],
  [/KRIZOV/i, formFolderByPrefix.KRI],
  [/FOLLOW_UP|STABILIZACNI/i, formFolderByPrefix.EVA],
  [/REGISTR|EVIDENCE_KOMUNITNICH/i, formFolderByPrefix.REG],
  [/MLCENLIVOST|ETICKY/i, formFolderByPrefix.ETY],
  [/LIST_INCIDENTU|LIST_HRANIC/i, formFolderByPrefix.DOP],
  [/ALL_IN_ONE|DOPLNKOVE_LISTY_INCIDENTY|GDPR_BALICEK|REGISTRY_FILLABLE/i, formFolderByPrefix.AIO]
];

const fileNameFromPath = (value?: string) => {
  if (!value) return '';
  const firstPart = value.split('|')[0].trim();
  const withoutQuery = firstPart.split(/[?#]/)[0];
  return decodeURIComponent(withoutQuery.split('/').pop() || '');
};

const templatePrefix = (template?: Pick<FormTemplate, 'title' | 'folder' | 'sourceNote'>) => {
  if (!template) return '';
  const source = `${template.title || ''} ${template.folder || ''} ${template.sourceNote || ''}`;
  const match = source.match(/\b(GDPR|KLI|KRI|EVA|REG|ETY|DOP|AIO)[-\s]/i);
  return match?.[1]?.toUpperCase() || '';
};

const publicFormFolder = (template?: Pick<FormTemplate, 'title' | 'folder' | 'sourceNote'>, fileName = '') => {
  if (template?.folder && /^\d+_/.test(template.folder)) return template.folder;
  const prefix = templatePrefix(template);
  if (prefix && formFolderByPrefix[prefix]) return formFolderByPrefix[prefix];
  const source = `${fileName} ${template?.title || ''} ${template?.folder || ''} ${template?.sourceNote || ''}`;
  return formFolderHints.find(([pattern]) => pattern.test(source))?.[1] || '';
};

const legacyPublicFileUrls: Record<string, string> = {
  '/documents/forms/02_KLIENTSKA_SLOZKA/RAI-FRM-KLI-002_KNIHA_KLIENTA_FILLABLE_v1_6_COMPACT_CONTENT_LOCKED.pdf':
    '/documents/forms/02_KLIENTSKA_SLOZKA/RAI-FRM-KLI-002_KNIHA_KLIENTA_v2_0_RC1_REBUILD_FROM_ZERO_FILLABLE.pdf'
};

const normalizeLegacyPublicFileUrl = (value: string) => legacyPublicFileUrls[value] || value;

const resolvePublicFileUrl = (value?: string, template?: Pick<FormTemplate, 'title' | 'folder' | 'sourceNote'>) => {
  const trimmed = value?.trim() || '';
  if (!trimmed) return '';
  if (/^(https?:|data:|blob:)/i.test(trimmed)) return trimmed;
  if (trimmed.startsWith('/documents/') || trimmed.startsWith('/images/')) return normalizeLegacyPublicFileUrl(trimmed);

  const fileName = fileNameFromPath(trimmed) || fileNameFromPath(template?.sourceNote);
  if (!fileName || !/\.pdf$/i.test(fileName)) return trimmed;

  const folder = publicFormFolder(template, fileName);
  return normalizeLegacyPublicFileUrl(folder ? `/documents/forms/${folder}/${fileName}` : trimmed);
};

const formSensitivity = (template: FormTemplate) => {
  const source = `${template.folder || ''} ${template.sourceNote || ''}`.toLowerCase();
  if (source.includes('gdpr')) return 'GDPR';
  if (source.includes('citliv')) return 'Citlivé';
  if (source.includes('klient')) return 'Klientské';
  return 'Standard';
};


const normalizeAutofillText = (value: string) => stripDiacritics(value).toLowerCase();

const clientFullName = (client: ClientRecord) => `${client.firstName} ${client.lastName}`.trim();

const clientFormAutofillValue = (field: FormTemplate['fields'][number], client: ClientRecord) => {
  const haystack = normalizeAutofillText(`${field.key} ${field.label}`);
  const contactLine = [client.phone, client.email, client.address].filter(Boolean).join(' | ');

  if (/datum.*narozeni|narozeni|birth/.test(haystack)) return client.birthDate || '';
  if (/datum.*kontaktu|datum.*zpracovani|processing.*date|contact.*date/.test(haystack)) return todayIso();
  if (/interni.*id|operational|kod.*klienta|cislo.*klienta|client.*id/.test(haystack)) return client.operationalId || '';
  if (/telefon|phone/.test(haystack)) return client.phone || '';
  if (/e-mail|email|mail/.test(haystack)) return client.email || '';
  if (/adresa|address/.test(haystack)) return client.address || '';
  if (/kontakt|contact/.test(haystack)) return contactLine;
  if (/program/.test(haystack)) return client.program || '';
  if (/cilova.*skupina|target.*group/.test(haystack)) return client.targetGroup || '';
  if (/stav|status/.test(haystack)) return client.status || '';
  if (/(^| )(klient|client|jmeno|name)( |$)/.test(haystack) && !/podpis|prohlaseni|poznamka|souhlas|kontakt|adresa/.test(haystack)) {
    return clientFullName(client);
  }

  return '';
};

const clientFormAutofillIsSystemField = (field: FormTemplate['fields'][number]) => {
  const haystack = normalizeAutofillText(`${field.key} ${field.label}`);
  return (
    /datum.*narozeni|narozeni|birth/.test(haystack) ||
    /datum.*kontaktu|datum.*zpracovani|processing.*date|contact.*date/.test(haystack) ||
    /interni.*id|operational|kod.*klienta|cislo.*klienta|client.*id/.test(haystack) ||
    /telefon|phone/.test(haystack) ||
    /e-mail|email|mail/.test(haystack) ||
    /adresa|address/.test(haystack) ||
    /kontakt|contact/.test(haystack) ||
    /program/.test(haystack) ||
    /cilova.*skupina|target.*group/.test(haystack) ||
    /stav|status/.test(haystack) ||
    (/(^| )(klient|client|jmeno|name)( |$)/.test(haystack) && !/podpis|prohlaseni|poznamka|souhlas|kontakt|adresa/.test(haystack))
  );
};

const mergeClientAutofillDraft = (
  template: FormTemplate,
  client: ClientRecord,
  currentDraft: FormDraft,
  previousClient: ClientRecord | null
) => {
  let changed = false;
  const nextDraft = { ...currentDraft };

  template.fields.forEach((field) => {
    const nextValue = clientFormAutofillValue(field, client);
    const isSystemField = clientFormAutofillIsSystemField(field);
    if (!nextValue && !isSystemField) return;

    const currentValue = String(nextDraft[field.key] ?? '');
    const previousValue = previousClient ? clientFormAutofillValue(field, previousClient) : '';
    const canReplace = isSystemField || currentValue.trim() === '' || Boolean(previousValue && currentValue.trim() === previousValue.trim());

    if (canReplace && currentValue !== nextValue) {
      nextDraft[field.key] = nextValue;
      changed = true;
    }
  });

  return changed ? nextDraft : currentDraft;
};

const starterAccounts: AuthAccount[] = [];

const missionSlides: HomeSlide[] = [
  {
    id: 'mission-origin',
    title: 'REST||ART INTEGRACE',
    subtitle: 'Zkušenost, poznání, metodika a teprve potom projekt.',
    imageUrl: '/images/crops/camera-202607/20260608_155425.webp',
    ctaLabel: 'Poznat metodiku',
    ctaHref: '/metodika',
    sortOrder: 10,
    isActive: true
  },
  {
    id: 'mission-understanding',
    title: 'Než člověka zhodnotíme',
    subtitle: 'Neobhajujeme chyby. Neomlouváme. Snažíme se porozumět cestě.',
    imageUrl: '/images/crops/camera-202607/20260622_201849.webp',
    ctaLabel: 'Naše principy',
    ctaHref: '/metodika',
    sortOrder: 20,
    isActive: true
  },
  {
    id: 'mission-change',
    title: 'Trvalá změna nevzniká jednou službou',
    subtitle: 'Práce, odpovědnost, důvěra, komunita a příležitost začít znovu.',
    imageUrl: '/images/crops/camera-202607/20260606_055641.webp',
    ctaLabel: 'Jak pracujeme',
    ctaHref: '/co-delame',
    sortOrder: 30,
    isActive: true
  },
  {
    id: 'mission-system',
    title: 'Nevytváříme další službu',
    subtitle: 'Budujeme připravený proces návratu do běžného života.',
    imageUrl: '/images/crops/camera-202607/20260701_121440.webp',
    ctaLabel: 'Zapojit se',
    ctaHref: '/zapojeni',
    sortOrder: 40,
    isActive: true
  }
];

const programSlides: HomeSlide[] = [
  {
    id: 'pillar-jailbreak',
    title: 'JAILBREAK',
    subtitle: 'Výkon trestu odnětí svobody a návrat ven: svoboda potřebuje strukturu, práci a konkrétní plán.',
    imageUrl: '/images/program-pillars/jailbreak-skica.webp',
    ctaLabel: 'O programu',
    ctaHref: '/programy/jailbreak',
    sortOrder: 110,
    isActive: true
  },
  {
    id: 'pillar-reset',
    title: 'RESET',
    subtitle: 'Závislosti, krize a ztracený režim: důstojný restart přes terapii, komunitu a bezpečný každodenní rytmus.',
    imageUrl: '/images/program-pillars/reset-skica.webp',
    ctaLabel: 'O programu',
    ctaHref: '/programy/reset',
    sortOrder: 120,
    isActive: true
  },
  {
    id: 'pillar-rework',
    title: 'REWORK',
    subtitle: 'Dlouhodobě nezaměstnaní a lidé s bariérami: pracovní restart, rekvalifikace a férový návrat do praxe.',
    imageUrl: '/images/program-pillars/rework-skica.webp',
    ctaLabel: 'O programu',
    ctaHref: '/programy/rework',
    sortOrder: 130,
    isActive: true
  },
  {
    id: 'pillar-streetwise',
    title: 'STREETWISE',
    subtitle: 'Lidé bez domova a mimo dosah systému: nízkoprahové zázemí, terén a první bezpečný krok.',
    imageUrl: '/images/program-pillars/streetwise-skica.webp',
    ctaLabel: 'O programu',
    ctaHref: '/programy/streetwise',
    sortOrder: 140,
    isActive: true
  },
  {
    id: 'pillar-bod-zlomu',
    title: 'BOD ZLOMU',
    subtitle: 'Děti z dětských domovů a mladí lidé po ústavní péči: přechod do samostatnosti, vztahů a vlastního směru.',
    imageUrl: '/images/program-pillars/bod-zlomu-skica.webp',
    ctaLabel: 'O programu',
    ctaHref: '/programy/bod-zlomu',
    sortOrder: 150,
    isActive: true
  },
  {
    id: 'pillar-stabilizace',
    title: 'STABILIZACE',
    subtitle: 'Konečný podpůrný program: udržet změnu v bydlení, práci, režimu, komunitě a běžném životě.',
    imageUrl: '/images/program-pillars/stabilizace-skica.webp',
    ctaLabel: 'O programu',
    ctaHref: '/programy/stabilizace',
    sortOrder: 160,
    isActive: true
  }
];

const starterSlides = [...missionSlides, ...programSlides];
const starterSlideIds = new Set(starterSlides.map((slide) => slide.id));
const missionSlideIds = new Set(missionSlides.map((slide) => slide.id));
const programSlideIds = new Set(programSlides.map((slide) => slide.id));
const designedTextSlidePattern = /^\/images\/\d{2}\.png$/i;
const sketchPillarSlidePattern =
  /^\/images\/program-pillars\/(?:jailbreak|reset|rework|streetwise|bod-zlomu|stabilizace)-skica\.webp$/i;

const programHeroStories: Record<string, { label: string; motto: string; text: string }> = {
  'pillar-jailbreak': {
    label: 'Program návratu',
    motto: 'Svoboda bez plánu je jen další zkouška.',
    text: 'JAILBREAK staví první bezpečný most mezi výkonem trestu a životem venku: režim, práce, vztahy a konkrétní kroky místo prázdných slibů.'
  },
  'pillar-reset': {
    label: 'Program stabilizace',
    motto: 'Restart nezačíná velkým gestem, ale prvním zvládnutým dnem.',
    text: 'RESET pomáhá lidem v závislosti, krizi nebo rozpadu rytmu znovu postavit denní strukturu, bezpečné zázemí a podporu, která vydrží.'
  },
  'pillar-rework': {
    label: 'Program práce',
    motto: 'Práce není jen výplata. Je to návrat důvěry v sebe.',
    text: 'REWORK propojuje pracovní restart, rekvalifikaci a férové šance pro lidi, kteří dlouho stáli mimo běžný pracovní život.'
  },
  'pillar-streetwise': {
    label: 'Nízkoprahový program',
    motto: 'První krok musí být dosažitelný i pro člověka bez pevné půdy pod nohama.',
    text: 'STREETWISE začíná tam, kde lidé skutečně jsou: v terénu, v nejistotě, mimo systém. Dává zázemí, kontakt a první bezpečný bod.'
  },
  'pillar-bod-zlomu': {
    label: 'Program mladé dospělosti',
    motto: 'Samostatnost se nedá nařídit. Musí se bezpečně natrénovat.',
    text: 'BOD ZLOMU podporuje mladé lidi po ústavní péči při přechodu do vztahů, práce, bydlení a vlastního směru bez náhlého pádu do prázdna.'
  },
  'pillar-stabilizace': {
    label: 'Program udržení změny',
    motto: 'Změna má hodnotu až tehdy, když se dá unést i v obyčejném týdnu.',
    text: 'STABILIZACE drží člověka po prvním restartu: bydlení, práce, komunita, režim a drobná rozhodnutí, která z velké změny udělají život.'
  }
};

const missionHeroStories: Record<string, { label: string; motto: string; text: string }> = {
  'mission-origin': {
    label: 'Jak vznikáme',
    motto: 'Zkušenost → poznání → metodika → projekt.',
    text: 'To, co přinášíme, není běžná praxe. Nevznikli jsme podle schématu problém → dotace → projekt. Vycházíme z praktické zkušenosti, kterou převádíme do otevřeného a ověřitelného systému.'
  },
  'mission-understanding': {
    label: 'Druhá šance a odpovědnost',
    motto: 'Neobhajujeme chyby. Neomlouváme. Snažíme se porozumět cestě.',
    text: 'Minulost nelze změnit. Lze však vytvořit podmínky, v nichž člověk převezme odpovědnost za to, co udělá zítra.'
  },
  'mission-change': {
    label: 'Propojený proces',
    motto: 'Práce. Odpovědnost. Důvěra. Komunita. Příležitost začít znovu.',
    text: 'Skutečná změna vzniká tehdy, když člověk dostane příležitost převzít odpovědnost a zároveň má prostředí, které mu umožní změnu udržet.'
  },
  'mission-system': {
    label: 'Systém spolupráce',
    motto: 'Budujeme připravený proces návratu do běžného života.',
    text: 'REST||ART INTEGRACE je vznikající systém pracovní a sociální reintegrace lidí ohrožených sociálním vyloučením. Propojuje praktickou zkušenost, odpovědné zaměstnavatele, veřejné instituce a budoucí odborné partnery. Koncept je ve výstavbě a otevřený ověřování.'
  }
};

const programHeroStoryAliases: Array<[string, keyof typeof programHeroStories]> = [
  ['jailbreak', 'pillar-jailbreak'],
  ['reset', 'pillar-reset'],
  ['rework', 'pillar-rework'],
  ['streetwise', 'pillar-streetwise'],
  ['bod-zlomu', 'pillar-bod-zlomu'],
  ['bod zlomu', 'pillar-bod-zlomu'],
  ['stabilizace', 'pillar-stabilizace']
];

const programPillarStoryKeyFromSlide = (slide: HomeSlide) => {
  const directKey = slide.id.toLowerCase();
  if (directKey in programHeroStories) return directKey as keyof typeof programHeroStories;

  const slugMatch = slide.imageUrl.match(/\/images\/program-pillars\/([a-z-]+)-skica\.(?:webp|png|jpe?g|avif)$/i);
  if (slugMatch) {
    const slugKey = `pillar-${slugMatch[1].toLowerCase()}`;
    if (slugKey in programHeroStories) return slugKey as keyof typeof programHeroStories;
  }

  const searchable = `${slide.id} ${slide.title} ${slide.subtitle} ${slide.imageUrl}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  return programHeroStoryAliases.find(([alias]) => searchable.includes(alias))?.[1];
};

const programHeroStoryFromSlide = (slide: HomeSlide) => {
  const storyKey = programPillarStoryKeyFromSlide(slide);
  return storyKey ? programHeroStories[storyKey] : undefined;
};

const heroStoryFromSlide = (slide: HomeSlide) => missionHeroStories[slide.id] ?? programHeroStoryFromSlide(slide);

const programPillarSlideFromSlide = (slide: HomeSlide) => {
  const storyKey = programPillarStoryKeyFromSlide(slide);
  return programSlides.find((starterSlide) => starterSlide.id === slide.id || starterSlide.imageUrl === slide.imageUrl || starterSlide.id === storyKey);
};

const fallbackProgramStoryFromIndex = (index: number) => {
  const starterSlide = programSlides[index % programSlides.length];
  return starterSlide ? programHeroStories[starterSlide.id] : undefined;
};

const heroAutoScrollItems = programSlides.map((slide) => ({
  id: slide.id,
  title: slide.title,
  motto: programHeroStories[slide.id]?.motto ?? slide.subtitle,
  href: slide.ctaHref || '/programy'
}));

const practicePhotoSlides = [
  {
    id: 'practice-camera-rose-arch',
    title: 'Klenba, která vyrostla',
    text: 'Růže a pevná konstrukce ukazují, co dokáže trpělivá práce v čase.',
    imageUrl: '/images/crops/camera-202607/20260608_155425.webp'
  },
  {
    id: 'practice-camera-welcome',
    title: 'Místo, které vítá',
    text: 'Zázemí tvoří i malé konkrétní věci, které dávají najevo: tady může začít další krok.',
    imageUrl: '/images/crops/camera-202607/20260701_121440.webp'
  },
  {
    id: 'practice-camera-pocerady-road',
    title: 'Cesta z Počerad',
    text: 'Projekt vzniká v konkrétním místě, ale jeho směr vede k návratu do běžného života.',
    imageUrl: '/images/crops/camera-202607/20260622_201849.webp'
  },
  {
    id: 'practice-camera-shelter',
    title: 'Zázemí ve výstavbě',
    text: 'Prostor vzniká svépomocí, z dostupných materiálů a práce, která je skutečně vidět.',
    imageUrl: '/images/crops/camera-202607/20260604_190316.webp'
  },
  {
    id: 'practice-camera-passage',
    title: 'Průchod mezi růžemi',
    text: 'Cesta nemusí být rovná ani hotová, aby mohla vést bezpečným směrem.',
    imageUrl: '/images/crops/camera-202607/20260604_190302.webp'
  },
  {
    id: 'practice-camera-rose-path',
    title: 'Cesta pod klenbou',
    text: 'Živé prostředí připomíná, že stabilita se buduje péčí, rytmem a každodenní prací.',
    imageUrl: '/images/crops/camera-202607/20260606_055641.webp'
  },
  {
    id: 'practice-camera-open-gate',
    title: 'Otevřený vstup',
    text: 'První bezpečný krok potřebuje konkrétní místo, kam lze skutečně přijít.',
    imageUrl: '/images/crops/camera-202607/20260610_123857.webp'
  },
  {
    id: 'practice-camera-raspberries',
    title: 'Úroda z vlastního zázemí',
    text: 'Péče má konkrétní výsledek. Někdy je jím i obyčejná sklizeň, o kterou se lidé společně postarali.',
    imageUrl: '/images/crops/camera-202607/20260622_130315.webp'
  },
  {
    id: 'practice-camera-shared-table',
    title: 'Stůl, který spojuje',
    text: 'Společné chvíle a běžné domácí rituály pomáhají vytvářet bezpečné a lidské prostředí.',
    imageUrl: '/images/crops/camera-202607/20260702_230003.webp'
  },
  {
    id: 'practice-camera-new-growth',
    title: 'Nové výhonky',
    text: 'Malé začátky potřebují pravidelnou péči, čas a prostor, aby mohly zesílit.',
    imageUrl: '/images/crops/camera-202607/20260610_124158.webp'
  },
  {
    id: 'practice-camera-rose-corridor',
    title: 'Cesta mezi růžemi',
    text: 'Proměna prostředí vzniká postupně, krok za krokem a vlastní prací.',
    imageUrl: '/images/crops/camera-202607/20260610_124053.webp'
  },
  {
    id: 'practice-camera-rose-canopy',
    title: 'Když péče rozkvete',
    text: 'To, co se dlouho buduje a udržuje, může jednou vytvořit pevné a krásné zázemí.',
    imageUrl: '/images/crops/camera-202607/20260610_124143.webp'
  },
  {
    id: 'practice-camera-building-materials',
    title: 'Zázemí znovu použitých věcí',
    text: 'Prostor vzniká z dostupných materiálů, nápadů a ochoty přiložit ruku k dílu.',
    imageUrl: '/images/crops/camera-202607/20260604_190334.webp'
  },
  {
    id: 'practice-camera-work-in-progress',
    title: 'Práce před výsledkem',
    text: 'Skutečná proměna má i pracovní fázi, která není uhlazená, ale bez ní by výsledek nevznikl.',
    imageUrl: '/images/crops/camera-202607/20260604_190311.webp'
  },
  {
    id: 'practice-camera-restart-strawberries',
    title: 'REST||ART po svém',
    text: 'Název projektu může vzniknout i z vlastní úrody, nápadu a společné chvíle.',
    imageUrl: '/images/crops/camera-202607/restart-art-jahody.webp'
  },
  {
    id: 'practice-camera-quiet-home',
    title: 'Klid v zázemí',
    text: 'Bezpečný prostor tvoří také obyčejné chvíle odpočinku a pocit, že člověk někam patří.',
    imageUrl: '/images/crops/camera-202607/20260520_222915.webp'
  },
  {
    id: 'practice-camera-yellow-passage',
    title: 'Průchod, který se mění',
    text: 'Každá dokončená část zázemí zpřehledňuje cestu a otevírá prostor pro další práci.',
    imageUrl: '/images/crops/camera-202607/20260603_175300.webp'
  },
  {
    id: 'practice-camera-potted-flowers',
    title: 'Každý kout může růst',
    text: 'I malý upravený prostor může nést důležitý signál péče, řádu a nového začátku.',
    imageUrl: '/images/crops/camera-202607/20260606_055722.webp'
  },
  {
    id: 'practice-camera-pink-rose',
    title: 'Jeden konkrétní výsledek',
    text: 'Změna se skládá z konkrétních kroků, které je možné vidět, pojmenovat a dál rozvíjet.',
    imageUrl: '/images/crops/camera-202607/20260610_124306.webp'
  },
  {
    id: 'practice-camera-color-in-progress',
    title: 'Barva v rozestavěném místě',
    text: 'I během výstavby lze vytvářet prostředí, které působí živě a dává smysl.',
    imageUrl: '/images/crops/camera-202607/20260610_124243.webp'
  },
  {
    id: 'practice-camera-reused-planter',
    title: 'Zachráněná nádoba, nový život',
    text: 'Nový účel často začíná tím, že se na dostupné věci podíváme jinak a dáme jim další možnost.',
    imageUrl: '/images/crops/camera-202607/20260610_124203.webp'
  }
];

const defaultHomepageSections: HomepageContentItem[] = [
  {
    id: 'practice-gallery',
    contentType: 'section',
    label: 'ZÁZEMÍ V OBRAZECH',
    title: 'Reálné místo, reálná práce.',
    body:
      'Skici ukazují směr projektu. Fotky drží stopu toho, jak zázemí opravdu vzniká: z materiálu, který se podaří zachránit, a z práce, která je vidět až krok za krokem.',
    imageUrl: '',
    ctaLabel: '',
    ctaHref: '',
    sortOrder: 10,
    isActive: true,
    updatedAt: ''
  },
  {
    id: 'streetwise',
    contentType: 'section',
    label: 'STREETWISE',
    title: 'Z věcí, které měly skončit, stavíme nové zázemí.',
    body:
      'REST||ART Integrace vzniká stejně jako naše bouda: z nalezeného materiálu, práce, trpělivosti a víry, že i to, co bylo odepsané, může znovu sloužit.',
    imageUrl: '',
    ctaLabel: 'STREETWISE',
    ctaHref: '/programy/streetwise',
    sortOrder: 20,
    isActive: true,
    updatedAt: ''
  },
  {
    id: 'green-band',
    contentType: 'section',
    label: 'Hlavní poselství',
    title: 'Začít znovu není selhání, je to síla.',
    body: 'Mentoring, práce, bydlení a stabilizace v jednom srozumitelném systému podpory.',
    imageUrl: '',
    ctaLabel: 'Jak pracujeme',
    ctaHref: '/co-delame',
    sortOrder: 30,
    isActive: true,
    updatedAt: ''
  },
  {
    id: 'economy',
    contentType: 'section',
    label: 'Ekonomika druhé šance',
    title: 'Dát člověku cestu zpět je levnější než čekat na další pád.',
    body: 'Nejde o hezkou frázi. Jde o praktický rozdíl mezi pasivním nákladem systému a aktivní reintegrací.',
    imageUrl: '',
    ctaLabel: '',
    ctaHref: '',
    sortOrder: 40,
    isActive: true,
    updatedAt: ''
  },
  {
    id: 'solution',
    contentType: 'section',
    label: 'Řešení',
    title: 'Není to klasická nezisková organizace. Je to systém návratu.',
    body:
      'REST||ART Integrace propojuje sociální práci, mentoring, firmy, obce, dokumenty, formuláře a každodenní praxi do jedné srozumitelné cesty.',
    imageUrl: '',
    ctaLabel: '',
    ctaHref: '',
    sortOrder: 50,
    isActive: true,
    updatedAt: ''
  },
  {
    id: 'impact',
    contentType: 'section',
    label: 'Dopad',
    title: 'Měřitelná změna, která má lidský i ekonomický smysl.',
    body:
      'Druhá šance je pro nás konkrétní výsledek: méně návratů do krize, více práce, bezpečnější bydlení a opora, která člověka nenechá zmizet.',
    imageUrl: '',
    ctaLabel: '',
    ctaHref: '',
    sortOrder: 60,
    isActive: true,
    updatedAt: ''
  },
  {
    id: 'seo',
    contentType: 'section',
    label: 'Oficiální projekt druhých šancí',
    title: 'Sociální začleňování, podpora po výkonu trestu a návrat do běžného života.',
    body:
      'RESTART Integrace propojuje mentoring, stabilizaci, práci, bydlení a komunitní podporu pro lidi, kteří potřebují bezpečný návrat do společnosti. Programy pomáhají po výkonu trestu, v sociální krizi, po ústavní péči i při dlouhodobé ztrátě práce nebo zázemí.',
    imageUrl: '',
    ctaLabel: '',
    ctaHref: '',
    sortOrder: 70,
    isActive: true,
    updatedAt: ''
  },
  {
    id: 'partners',
    contentType: 'section',
    label: 'Pro partnery',
    title: 'Spolupráce s námi není charita. Je to investice do návratu lidí i stability okolí.',
    body:
      'Hledáme partnery, kteří chtějí být součástí praktické změny: zaměstnavatele, obce, instituce, odborníky i lidi, kteří rozumí tomu, že druhá šance musí mít konkrétní kroky.',
    imageUrl: '',
    ctaLabel: 'Chci být partner',
    ctaHref: '/zapojeni',
    sortOrder: 80,
    isActive: true,
    updatedAt: ''
  }
];

const defaultHomepageGallery: HomepageContentItem[] = practicePhotoSlides.map((slide, index) => ({
  id: slide.id,
  contentType: 'gallery',
  label: '',
  title: slide.title,
  body: slide.text,
  imageUrl: slide.imageUrl,
  ctaLabel: '',
  ctaHref: '',
  sortOrder: (index + 1) * 10,
  isActive: true,
  updatedAt: ''
}));

const defaultHomepageContent = [...defaultHomepageSections, ...defaultHomepageGallery];

const mergeHomepageContent = (items: HomepageContentItem[]) => {
  const overrides = new Map(items.map((item) => [item.id, item]));
  const mergedDefaults = defaultHomepageContent.map((item) => overrides.get(item.id) ?? item);
  const defaultIds = new Set(defaultHomepageContent.map((item) => item.id));
  return [...mergedDefaults, ...items.filter((item) => !defaultIds.has(item.id))];
};

const hasStarterHeroDeck = (slides: HomeSlide[]) =>
  slides.filter((slide) => slide.isActive && starterSlideIds.has(slide.id)).length === starterSlides.length;

const hasMissionHeroDeck = (slides: HomeSlide[]) =>
  slides.filter((slide) => slide.isActive && missionSlideIds.has(slide.id)).length === missionSlides.length;

const hasProgramPillarDeck = (slides: HomeSlide[]) =>
  slides.filter((slide) => slide.isActive && programSlideIds.has(slide.id)).length === programSlides.length;

const shouldUseStarterHeroDeck = (slides: HomeSlide[]) => {
  const activeSlides = slides.filter((slide) => slide.isActive);
  if (hasStarterHeroDeck(slides)) return false;
  if (activeSlides.length === 0) return true;
  const isPreviousProgramDeck = hasProgramPillarDeck(slides) && !hasMissionHeroDeck(slides);
  const isLegacySlideDeck = activeSlides.some((slide) => slide.id.startsWith('slide-'));
  return isPreviousProgramDeck || isLegacySlideDeck;
};

const emptyClient: ClientRecord = {
  id: '',
  firstName: '',
  lastName: '',
  birthDate: '',
  phone: '',
  email: '',
  address: '',
  targetGroup: '',
  program: 'JAILBREAK',
  institutionalCareHistory: 'unknown',
  childhoodBackground: 'unknown',
  status: 'Nový kontakt',
  notes: '',
  operationalId: '',
  createdAt: ''
};

const emptyFormTemplate: FormTemplate = {
  id: 'loading-template',
  title: 'Načítám šablony',
  description: 'Knihovna tiskových formulářů se načítá po otevření administrace.',
  fields: [],
  isActive: false
};

const loadFallbackFormTemplates = () => import('./formTemplates').then((module) => module.fallbackFormTemplates as FormTemplate[]);
const todayIso = () => new Date().toISOString().slice(0, 10);

const stripDiacritics = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const initialsFromName = (firstName: string, lastName: string) => {
  const first = stripDiacritics(firstName.trim()).replace(/[^a-zA-Z]/g, '');
  const last = stripDiacritics(lastName.trim()).replace(/[^a-zA-Z]/g, '');
  const initials = `${first[0] ?? ''}${last[0] ?? ''}`.toUpperCase();
  return initials.padEnd(2, 'X').slice(0, Math.max(2, initials.length));
};

const initialsFromDisplayName = (value: string) => {
  const words = stripDiacritics(value).replace(/[^a-zA-Z\s]/g, ' ').trim().split(/\s+/).filter(Boolean);
  const initials = `${words[0]?.[0] ?? 'R'}${words[1]?.[0] ?? words[0]?.[1] ?? 'I'}`.toUpperCase();
  return initials.slice(0, 2);
};

const dateToCompactId = (isoDate: string) => {
  const date = isoDate ? new Date(`${isoDate}T00:00:00`) : new Date();
  if (Number.isNaN(date.getTime())) return dateToCompactId(todayIso());
  return `${String(date.getDate()).padStart(2, '0')}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getFullYear()).slice(-2)}`;
};

const dateToInputValue = (value?: string) => {
  if (!value) return todayIso();
  const directDate = value.slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(directDate)) return directDate;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? todayIso() : parsed.toISOString().slice(0, 10);
};

const clientSequenceNumber = (clients: Pick<ClientRecord, 'id' | 'createdAt'>[], clientId?: string) => {
  const orderedClients = clients
    .map((client, index) => ({ client, index }))
    .sort((left, right) => {
      const leftTime = Date.parse(left.client.createdAt || '') || 0;
      const rightTime = Date.parse(right.client.createdAt || '') || 0;
      if (leftTime !== rightTime) return leftTime - rightTime;
      return right.index - left.index;
    });
  const index = clientId ? orderedClients.findIndex(({ client }) => client.id === clientId) : -1;
  return Math.max(1, index >= 0 ? index + 1 : clients.length + 1);
};

const randomFourDigits = () => String(Math.floor(Math.random() * 10000)).padStart(4, '0');

const buildClientOperationalId = (draft: Pick<AdminToolsDraft, 'firstName' | 'lastName' | 'registrationDate' | 'sequence'>, randomCode = randomFourDigits()) =>
  `${initialsFromName(draft.firstName, draft.lastName)}-${dateToCompactId(draft.registrationDate)}-${randomCode}-${String(Math.max(1, draft.sequence || 1)).padStart(3, '0')}`;

const downloadDataUrl = (dataUrl: string, fileName: string) => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = fileName;
  link.click();
};

const downloadSvgElement = (svg: SVGSVGElement, fileName: string) => {
  const source = new XMLSerializer().serializeToString(svg);
  const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(source)}`;
  downloadDataUrl(dataUrl, fileName);
};

const normalizeCsvHeader = (value: string) => stripDiacritics(value).toLowerCase().replace(/[^a-z0-9]/g, '');

const splitCsvLine = (line: string, delimiter: string) => {
  const cells: string[] = [];
  let current = '';
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];
    if (char === '"' && quoted && next === '"') {
      current += '"';
      index += 1;
      continue;
    }
    if (char === '"') {
      quoted = !quoted;
      continue;
    }
    if (char === delimiter && !quoted) {
      cells.push(current.trim());
      current = '';
      continue;
    }
    current += char;
  }
  cells.push(current.trim());
  return cells;
};

const parseCsvText = (text: string) => {
  const lines = text
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length === 0) return [];
  const headerLine = lines[0];
  const delimiter = (headerLine.match(/;/g)?.length ?? 0) > (headerLine.match(/,/g)?.length ?? 0) ? ';' : ',';
  const headers = splitCsvLine(headerLine, delimiter).map(normalizeCsvHeader);
  return lines.slice(1).map((line) => {
    const cells = splitCsvLine(line, delimiter);
    return headers.reduce<Record<string, string>>((row, header, index) => {
      if (header) row[header] = cells[index] ?? '';
      return row;
    }, {});
  });
};

const csvValue = (row: Record<string, string>, keys: string[]) => {
  for (const key of keys) {
    const normalized = normalizeCsvHeader(key);
    if (row[normalized]?.trim()) return row[normalized].trim();
  }
  return '';
};

const decodeCsvBuffer = (buffer: ArrayBuffer) => {
  const decoderOptions = [
    { label: 'utf-8', options: { fatal: true } },
    { label: 'windows-1250', options: undefined },
    { label: 'iso-8859-2', options: undefined },
    { label: 'utf-8', options: undefined }
  ];

  for (const decoderOption of decoderOptions) {
    try {
      const decoded = new TextDecoder(decoderOption.label, decoderOption.options).decode(buffer);
      if (!decoded.includes('\uFFFD')) return decoded;
    } catch {
      // Try the next common Czech CSV encoding.
    }
  }

  return new TextDecoder('utf-8').decode(buffer);
};

const readTextFile = (file: File) => file.arrayBuffer().then(decodeCsvBuffer);

const buildCodeArchiveEntriesFromCsv = (text: string, kind: CodeArchiveKind): CodeArchiveEntry[] => {
  const importedAt = new Date().toISOString();
  return parseCsvText(text)
    .map<CodeArchiveEntry | null>((row, index) => {
      const value = csvValue(row, ['value', 'hodnota', 'kod', 'code', 'barcode', 'qr', 'id', 'uniqueId', 'unikatniId']);
      if (!value) return null;
      const createdAt = csvValue(row, ['createdAt', 'created', 'datum', 'vytvoreno', 'datumVytvoreni']) || todayIso();
      const entry: CodeArchiveEntry = {
        id: crypto.randomUUID(),
        kind,
        value,
        clientId: csvValue(row, ['clientId', 'klientId', 'idKlienta']),
        clientName: csvValue(row, ['client', 'clientName', 'klient', 'jmenoKlienta', 'name']),
        formId: csvValue(row, ['formId', 'formularId', 'templateId', 'sablonaId']),
        formTitle: csvValue(row, ['form', 'formular', 'formTitle', 'template', 'sablona', 'document', 'dokument']),
        note: csvValue(row, ['note', 'notes', 'poznamka', 'popis']) || `CSV řádek ${index + 2}`,
        source: 'csv',
        createdAt,
        importedAt
      };
      return entry;
    })
    .filter((entry): entry is CodeArchiveEntry => Boolean(entry));
};

function useStoredState<T>(key: string, initialValue: T) {
  const [value, setValue] = React.useState<T>(() => {
    const stored = window.localStorage.getItem(key);
    if (!stored) return initialValue;
    try {
      return JSON.parse(stored) as T;
    } catch {
      return initialValue;
    }
  });

  React.useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}

function useHashPath() {
  const [path, setPath] = React.useState(() => currentBrowserPath());

  React.useEffect(() => {
    const scrollToDocumentAnchor = () => {
      const hash = window.location.hash;
      if (!hash || hash.startsWith('#/')) return false;
      const targetId = decodeURIComponent(hash.slice(1));
      const target = window.document.getElementById(targetId);
      if (!target) return false;
      target.scrollIntoView({ block: 'start', behavior: 'smooth' });
      return true;
    };
    const onRouteChange = () => {
      setPath(currentBrowserPath());
      window.requestAnimationFrame(() => {
        if (!scrollToDocumentAnchor()) window.scrollTo({ top: 0, behavior: 'instant' });
      });
    };
    const onHashChange = () => {
      window.requestAnimationFrame(() => {
        if (!scrollToDocumentAnchor()) onRouteChange();
      });
    };
    window.addEventListener('hashchange', onHashChange);
    window.addEventListener('popstate', onRouteChange);
    return () => {
      window.removeEventListener('hashchange', onHashChange);
      window.removeEventListener('popstate', onRouteChange);
    };
  }, []);

  return path;
}

function runWhenIdle(callback: () => void, timeout = 1600) {
  const scheduler = (window as Window & {
    requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
    cancelIdleCallback?: (handle: number) => void;
  }).requestIdleCallback;
  if (scheduler) {
    const handle = scheduler(callback, { timeout });
    return () => (window as Window & { cancelIdleCallback?: (handle: number) => void }).cancelIdleCallback?.(handle);
  }
  const handle = window.setTimeout(callback, Math.min(timeout, 700));
  return () => window.clearTimeout(handle);
}

function PageSearch({
  onNotify,
  onDone,
  placement = 'header'
}: {
  onNotify: NotifyFn;
  onDone?: () => void;
  placement?: 'header' | 'mobile';
}) {
  const [query, setQuery] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const searchInputId = React.useId();
  const webMcpAttributes = {
    toolname: placement === 'mobile' ? 'search_site_mobile' : 'search_site_header',
    tooldescription: 'Vyhledá veřejné stránky, programy, aktuality, metodiku, dokumenty a možnosti podpory na webu REST||ART Integrace.'
  };

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const value = query.trim();
    if (!value) {
      inputRef.current?.focus();
      onNotify('warning', 'Vyhledávání je prázdné', 'Zadejte text, který chcete najít na webu.');
      return;
    }
    onDone?.();
    window.location.assign(`/vyhledavani?q=${encodeURIComponent(value)}`);
  };

  return (
    <form className="site-search" role="search" onSubmit={submitSearch} {...webMcpAttributes}>
      <label className="visually-hidden" htmlFor={searchInputId}>Vyhledat na celém webu</label>
      <Search size={16} aria-hidden="true" />
      <input
        id={searchInputId}
        ref={inputRef}
        name="query"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Hledat na celém webu"
        maxLength={160}
        required
        {...{ toolparamdescription: 'Hledaný výraz nebo téma v češtině.' }}
      />
      <button className="tooltip-link" type="submit" aria-label="Vyhledat na webu" data-tooltip="Vyhledat">
        <ArrowRight size={16} />
      </button>
    </form>
  );
}

function BrandLockup() {
  return (
    <span className="brand-lockup">
      <img
        src="/images/brand/restart-integrace-standard-tree-lockup.png"
        alt="REST||ART Integrace"
        width="1410"
        height="625"
        loading="eager"
        decoding="async"
      />
    </span>
  );
}

function Header({
  currentPath,
  account,
  notifications,
  onNotify
}: {
  currentPath: string;
  account: AuthAccount | null;
  notifications: NotificationItem[];
  onNotify: NotifyFn;
}) {
  const [open, setOpen] = React.useState(false);
  const isAdminAccount = account?.role === 'admin';
  const visibleNavItems = [
    ...navItems.filter((item) => item.href !== '/klient' || isAdminAccount || isPortalRole(account?.role)),
    ...(isAdminAccount ? [{ href: '/admin', label: 'Administrace' }] : [])
  ];
  const unreadNotificationCount = account
    ? notifications.filter((notification) =>
        !notification.readAt && (isAdminAccount || !notification.recipientId || notification.recipientId === account.id)
      ).length
    : 0;
  const profileHref = isAdminAccount ? '/admin' : '/klient';
  const profileLabel = isAdminAccount ? 'Administrace' : 'Profil';
  const profileAriaLabel = isAdminAccount ? 'Otevřít administraci' : `Otevřít profil ${account?.name ?? ''}`;
  const notificationHref = isAdminAccount ? '/admin?tab=notifications' : '/klient?section=notifications';
  const headerAvatarSrc = React.useMemo(() => {
    if (!account) return '';
    try {
      const stored = window.localStorage.getItem(`restart-client-profile-${account.id}`);
      if (!stored) return '';
      const parsed = JSON.parse(stored) as Partial<ClientProfileDraft>;
      return typeof parsed.avatar === 'string' && parsed.avatar ? parsed.avatar : '';
    } catch {
      return '';
    }
  }, [account?.id]);
  const headerAvatar = account ? (
    <span className="header-avatar" aria-hidden="true">
      {headerAvatarSrc ? <img src={headerAvatarSrc} alt="" /> : <span>{initialsFromDisplayName(account.name)}</span>}
    </span>
  ) : null;

  return (
    <>
      <header className="site-header">
        <a className="brand" href="/" aria-label="REST ART Integrace domů">
          <BrandLockup />
        </a>
        <button className="menu-button" type="button" aria-label="Otevřít menu" onClick={() => setOpen(true)}>
          <Menu size={22} />
        </button>
        <div className="header-nav-stack">
          <div className="header-tools">
            <PageSearch onNotify={onNotify} />
            <div className="auth-actions" aria-label="Přístup k účtu">
              {account ? (
                <>
                  <a
                    className="header-bell tooltip-link"
                    href={notificationHref}
                    aria-label={unreadNotificationCount > 0 ? `Notifikace: ${unreadNotificationCount} nepřečtené` : 'Notifikace'}
                    data-tooltip="Notifikace"
                  >
                    <Bell size={17} />
                    {unreadNotificationCount > 0 && <span>{unreadNotificationCount}</span>}
                  </a>
                  <a className="header-avatar-link tooltip-link" href={profileHref} aria-label={profileAriaLabel} data-tooltip={profileLabel}>
                    {headerAvatar}
                    <span className="header-account-label">{profileLabel}</span>
                  </a>
                </>
              ) : (
                <div className="portal-entry-links">
                  <a className="portal-entry-link client" href="/klient">
                    <UserRound size={17} />
                    <span>Klientská zóna</span>
                  </a>
                  <a className="portal-entry-link admin" href="/admin">
                    <ShieldCheck size={17} />
                    <span>Administrace</span>
                  </a>
                </div>
              )}
            </div>
          </div>
          <nav className="desktop-nav" aria-label="Hlavní navigace">
            {visibleNavItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={
                  currentPath === internalHrefPath(item.href) ||
                  (item.href === '/programy' && currentPath.startsWith('/programy/')) ||
                  (item.href === '/zapojeni' && (currentPath.startsWith('/zapojeni/') || currentPath === '/darovat'))
                    ? 'active'
                    : ''
                }
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
        <a className="header-cta" href="/kontakt">
          Napište nám
        </a>
      </header>
      {open && (
        <div className="mobile-panel" role="dialog" aria-modal="true" aria-label="Mobilní menu">
          <button className="close-button" type="button" aria-label="Zavřít menu" onClick={() => setOpen(false)}>
            <X size={22} />
          </button>
          <PageSearch onNotify={onNotify} onDone={() => setOpen(false)} placement="mobile" />
          {visibleNavItems.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
          <div className="mobile-auth-actions">
            {account ? (
              <>
                <a href={notificationHref} onClick={() => setOpen(false)}>
                  <Bell size={18} /> Notifikace {unreadNotificationCount > 0 ? `(${unreadNotificationCount})` : ''}
                </a>
                <a href={profileHref} onClick={() => setOpen(false)}>
                  {headerAvatar} {profileLabel}
                </a>
              </>
            ) : (
              <>
                <a href="/klient" onClick={() => setOpen(false)}>
                  <UserRound size={18} /> Klientská zóna
                </a>
                <a href="/admin" onClick={() => setOpen(false)}>
                  <ShieldCheck size={18} /> Administrace
                </a>
              </>
            )}
          </div>
          <a className="mobile-cta" href="/kontakt" onClick={() => setOpen(false)}>
            Napište nám
          </a>
        </div>
      )}
    </>
  );
}

function Breadcrumb({ path }: { path: string }) {
  const programDetail = path.startsWith('/programy/') ? getProgramBySlug(path.replace('/programy/', '')) : null;
  const supportDetail = path.startsWith('/zapojeni/') || path === '/darovat';
  const crumbs =
    programDetail
      ? [
          { label: 'Domů', href: '/' },
          { label: 'Programy', href: '/programy' },
          { label: programDetail.title }
        ]
      : supportDetail
        ? [
            { label: 'Domů', href: '/' },
            { label: 'Zapojení', href: '/zapojeni' },
            { label: getRouteLabel(path) }
          ]
      : path === '/kontakt'
      ? [
          { label: 'Domů', href: '/' },
          { label: 'Kontakt', href: '/kontakt' },
          { label: 'Formulář' }
        ]
      : path === '/klient'
        ? [
            { label: 'Domů', href: '/' },
            { label: 'Klientský profil' }
          ]
      : path === '/admin'
        ? [
            { label: 'Domů', href: '/' },
            { label: 'Administrace' }
          ]
        : path === '/'
          ? [{ label: 'Domů' }]
          : [
              { label: 'Domů', href: '/' },
              { label: getRouteLabel(path) }
            ];

  return (
    <nav className="breadcrumb-bar" aria-label="Umístění na webu">
      <span>Nacházíte se:</span>
      <ol>
        {crumbs.map((crumb, index) => (
          <li key={`${crumb.label}-${index}`}>
            {'href' in crumb && crumb.href ? <a href={crumb.href}>{crumb.label}</a> : <strong>{crumb.label}</strong>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function SectionIntro({ label, title, text }: { label: string; title: string; text: string }) {
  return (
    <div className="section-intro">
      <p className="section-label">{label}</p>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}

function StarCard({
  value,
  title,
  text,
  index
}: {
  value: string;
  title: string;
  text: string;
  index: number;
}) {
  return (
    <article className="star-card">
      <div className="star-card-top">
        <span className="star-card-mark" aria-hidden="true">
          <Star size={18} />
        </span>
        <span className="star-card-index">{String(index + 1).padStart(2, '0')}</span>
      </div>
      <strong>{value}</strong>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

function PageHeader({ label, title, text }: { label: string; title: string; text: string }) {
  return (
    <section className="page-header">
      <p className="section-label">{label}</p>
      <h1>{title}</h1>
      <p>{text}</p>
    </section>
  );
}

function FocusGrid() {
  return (
    <div className="focus-grid">
      {focusAreas.map((area) => {
        const Icon = area.icon;
        return (
          <article key={area.title} className="focus-card">
            <Icon size={24} />
            <h3>{area.title}</h3>
            <p>{area.text}</p>
          </article>
        );
      })}
    </div>
  );
}

function ProgramsList() {
  return (
    <div className="program-list">
      {programs.map((program) => {
        const Icon = program.icon;
        return (
          <article key={program.title} className="program-row">
            <div className="program-icon">
              <Icon size={24} />
            </div>
            <div className="program-content">
              <div className="program-heading">
                <h3>{program.title}</h3>
                <span>{program.audience}</span>
              </div>
              <p>{program.goal}</p>
              <ul>
                {program.activities.map((activity) => (
                  <li key={activity}>{activity}</li>
                ))}
              </ul>
              <a className="program-link" href={`/programy/${programSlug(program.title)}`}>
                Detail programu <ArrowRight size={17} />
              </a>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function ProgramPillarMap() {
  return (
    <section className="program-pillar-section">
      <div className="program-map-layout">
        <figure className="program-map-figure">
          <img src="/images/program-pillars/restart-integrace-map.png" alt="Mapa sesti piliru projektu REST||ART Integrace" />
        </figure>
        <div className="program-map-copy">
          <p className="section-label">REST||ART Integrace</p>
          <h2>Šest pilířů druhé šance</h2>
          <p>
            Každý pilíř řeší jinou životní situaci. Dohromady tvoří systém podpory od prvního
            kontaktu přes práci, bydlení a dokumenty až po dlouhodobou stabilizaci.
          </p>
        </div>
      </div>
      <div className="program-pillar-grid">
        {programs.map((program) => {
          const visual = getProgramPillarVisual(program.title);
          return (
            <a key={program.title} className="program-pillar-card" href={`/programy/${programSlug(program.title)}`}>
              {visual ? <img src={visual.src} alt={visual.alt} loading="lazy" /> : null}
              <div>
                <span>{visual?.shortLabel ?? program.audience}</span>
                <strong>{program.title}</strong>
                <p>{program.goal}</p>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}

function NewsGrid({
  news,
  discussion
}: {
  news: NewsItem[];
  discussion: NewsDiscussion;
}) {
  const [currentPage, setCurrentPage] = React.useState(0);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(news.length / itemsPerPage);
  const startIdx = currentPage * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const currentItems = news.slice(startIdx, endIdx);

  React.useEffect(() => {
    setCurrentPage(0);
  }, [news]);

  return (
    <>
      <div className="news-gallery" aria-live="polite">
        {currentItems.map((item) => {
          const itemHref = newsPath(item);
          const commentCount = discussion.comments.filter((comment) => comment.newsId === item.id).length;
          const commentLabel =
            commentCount === 0
              ? 'Žádné komentáře'
              : commentCount === 1
                ? '1 komentář'
                : commentCount < 5
                  ? `${commentCount} komentáře`
                  : `${commentCount} komentářů`;
          return (
            <article key={item.id} className="news-gallery-card">
              <a className="news-gallery-image" href={itemHref} aria-label={`Otevřít aktualitu: ${item.title}`}>
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.title} loading="lazy" />
                ) : (
                  <span className="news-gallery-image-placeholder" aria-hidden="true">
                  <Newspaper size={48} opacity={0.3} />
                  </span>
                )}
              </a>
              <div className="news-gallery-content">
                <h3>
                  <a href={itemHref}>{item.title}</a>
                </h3>
                <p className="news-excerpt">{item.excerpt}</p>
                <a className="news-read-more" href={itemHref}>
                  Přečíst více <span aria-hidden="true">»</span>
                </a>
              </div>
              <footer className="news-card-footer">
                <time dateTime={item.date}>{new Date(item.date).toLocaleDateString('cs-CZ')}</time>
                <span>{commentLabel}</span>
              </footer>
            </article>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="news-pagination">
          <button
            disabled={currentPage === 0}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="pagination-btn"
            aria-label="Předchozí strana"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="pagination-numbers">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`pagination-number ${currentPage === i ? 'active' : ''}`}
                aria-label={`Strana ${i + 1}`}
                aria-current={currentPage === i ? 'page' : undefined}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            disabled={currentPage === totalPages - 1}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="pagination-btn"
            aria-label="Následující strana"
          >
            <ChevronLeft size={18} style={{ transform: 'scaleX(-1)' }} />
          </button>
        </div>
      )}
    </>
  );
}

function NewsDiscussionPanel({
  item,
  discussion,
  account,
  onToggleLike,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
  onNotify
}: {
  item: NewsItem;
  discussion: NewsDiscussion;
  account: AuthAccount | null;
  onToggleLike: (newsId: string) => Promise<void>;
  onAddComment: (newsId: string, text: string, parentId?: string | null) => Promise<boolean>;
  onUpdateComment: (commentId: string, text: string) => Promise<boolean>;
  onDeleteComment: (commentId: string) => Promise<void>;
  onNotify: (tone: FeedbackTone, title: string, text?: string) => void;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [draft, setDraft] = React.useState('');
  const [replyTo, setReplyTo] = React.useState<ApiNewsComment | null>(null);
  const [replyDraft, setReplyDraft] = React.useState('');
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editDraft, setEditDraft] = React.useState('');
  const like = discussion.likes[item.id] ?? { newsId: item.id, count: 0, likedByMe: false };
  const comments = discussion.comments.filter((comment) => comment.newsId === item.id);
  const commentsByParent = comments.reduce((groups, comment) => {
    const key = comment.parentId || 'root';
    groups.set(key, [...(groups.get(key) || []), comment]);
    return groups;
  }, new Map<string, ApiNewsComment[]>());
  const commentWord =
    comments.length === 1 ? 'komentář' : comments.length > 1 && comments.length < 5 ? 'komentáře' : 'komentářů';
  const likeWord = like.count === 1 ? 'lajk' : like.count > 1 && like.count < 5 ? 'lajky' : 'lajků';

  React.useEffect(() => {
    if (!isOpen) {
      setReplyTo(null);
      setEditingId(null);
    }
  }, [isOpen]);

  const requireAccount = () => {
    if (account) return true;
    onNotify('warning', 'Přihlášení je potřeba', 'Komentovat a dávat srdíčka mohou registrovaní uživatelé.');
    return false;
  };

  const submitComment = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!requireAccount()) return;
    const text = draft.trim();
    if (!text) return;
    const saved = await onAddComment(item.id, text);
    if (saved) setDraft('');
  };

  const submitReply = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!replyTo || !requireAccount()) return;
    const text = replyDraft.trim();
    if (!text) return;
    const saved = await onAddComment(item.id, text, replyTo.id);
    if (saved) {
      setReplyTo(null);
      setReplyDraft('');
    }
  };

  const saveEdit = async (commentId: string) => {
    const text = editDraft.trim();
    if (!text) return;
    const saved = await onUpdateComment(commentId, text);
    if (saved) {
      setEditingId(null);
      setEditDraft('');
    }
  };

  const renderComment = (comment: ApiNewsComment, depth = 0): React.ReactNode => {
    const replies = commentsByParent.get(comment.id) || [];
    const canManage = account && (account.role === 'admin' || account.id === comment.authorId);
    return (
      <div className="comment-thread" data-depth={depth} key={comment.id}>
        <article className="comment-card">
          <div className="comment-meta">
            <strong>{comment.authorName}</strong>
            <span>{new Date(comment.createdAt).toLocaleString('cs-CZ')}</span>
          </div>
          {editingId === comment.id ? (
            <div className="comment-edit">
              <textarea value={editDraft} onChange={(event) => setEditDraft(event.target.value)} rows={3} />
              <div className="comment-actions">
                <button className="mini-action" type="button" onClick={() => saveEdit(comment.id)}>
                  <Save size={15} /> Uložit
                </button>
                <button className="mini-action ghost" type="button" onClick={() => setEditingId(null)}>
                  <X size={15} /> Zrušit
                </button>
              </div>
            </div>
          ) : (
            <p>{comment.body}</p>
          )}
          <div className="comment-actions">
            <button className="mini-action ghost" type="button" onClick={() => (requireAccount() ? setReplyTo(comment) : undefined)}>
              <Reply size={15} /> Odpovědět
            </button>
            {canManage && (
              <AdminContextMenu
                label={`Akce komentáře od ${comment.authorName}`}
                items={[
                  {
                    label: 'Upravit',
                    text: 'Otevřít inline editaci',
                    icon: <FileText size={16} />,
                    onSelect: () => {
                      setEditingId(comment.id);
                      setEditDraft(comment.body);
                    }
                  },
                  {
                    label: 'Smazat',
                    text: 'Odstranit komentář',
                    icon: <Trash2 size={16} />,
                    tone: 'danger',
                    onSelect: () => onDeleteComment(comment.id)
                  }
                ]}
              />
            )}
          </div>
        </article>
        {replies.length > 0 && <div className="comment-replies">{replies.map((reply) => renderComment(reply, depth + 1))}</div>}
      </div>
    );
  };

  return (
    <div className="news-discussion">
      <div className="discussion-summary">
        <button className="comments-toggle" type="button" aria-expanded={isOpen} onClick={() => setIsOpen((current) => !current)}>
          <MessageCircle size={17} /> {isOpen ? 'Skrýt komentáře' : 'Zobrazit komentáře'}
        </button>
        <span className="summary-separator" aria-hidden="true">|</span>
        <span>{comments.length} {commentWord}</span>
        <span className="summary-separator" aria-hidden="true">|</span>
        <button
          className={`heart-button${like.likedByMe ? ' active' : ''}`}
          type="button"
          aria-pressed={like.likedByMe}
          onClick={() => (requireAccount() ? onToggleLike(item.id) : undefined)}
        >
          <Heart size={17} fill={like.likedByMe ? 'currentColor' : 'none'} /> {like.count} {likeWord}
        </button>
      </div>

      {isOpen && (
        <div className="comment-panel">
          <div className="comment-list">
            {(commentsByParent.get('root') || []).map((comment) => renderComment(comment))}
            {comments.length === 0 && <p className="comment-empty">Zatím bez komentářů.</p>}
          </div>

          {replyTo && (
            <form className="comment-form reply-form" onSubmit={submitReply}>
              <label>
                Odpověď pro {replyTo.authorName}
                <textarea value={replyDraft} onChange={(event) => setReplyDraft(event.target.value)} rows={3} />
              </label>
              <div className="comment-actions">
                <button className="mini-action" type="submit">
                  <Reply size={15} /> Odeslat odpověď
                </button>
                <button className="mini-action ghost" type="button" onClick={() => setReplyTo(null)}>
                  <X size={15} /> Zrušit
                </button>
              </div>
            </form>
          )}

          {account ? (
            <form className="comment-form" onSubmit={submitComment}>
              <label>
                Přidat komentář
                <textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  rows={3}
                  placeholder="Napište komentář..."
                />
              </label>
              <button className="mini-action" type="submit">
                <MessageCircle size={15} /> Komentovat
              </button>
            </form>
          ) : (
            <p className="comment-login-note">
              Pro komentování nebo lajkování se prosím <a href="/klient">přihlaste do klientské zóny</a>.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function useNewsSeo({ title, description, path, item }: { title: string; description: string; path: string; item?: NewsItem }) {
  React.useEffect(() => {
    const absoluteUrl = `${window.location.origin}${path}`;
    const previousTitle = document.title;
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]') ?? document.createElement('link');
    const canonicalWasCreated = !canonical.parentNode;
    const previousCanonical = canonical.getAttribute('href');
    if (canonicalWasCreated) {
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = absoluteUrl;
    document.title = `${title} | RESTART Integrace`;

    const changedMeta: Array<{ element: HTMLMetaElement; created: boolean; previous: string | null }> = [];
    const setMeta = (selector: string, attribute: 'name' | 'property', key: string, content: string) => {
      const meta = document.querySelector<HTMLMetaElement>(selector) ?? document.createElement('meta');
      const created = !meta.parentNode;
      changedMeta.push({ element: meta, created, previous: meta.getAttribute('content') });
      if (created) {
        meta.setAttribute(attribute, key);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:url"]', 'property', 'og:url', absoluteUrl);
    setMeta('meta[property="og:type"]', 'property', 'og:type', item ? 'article' : 'website');

    const schemaId = 'news-structured-data';
    document.getElementById(schemaId)?.remove();
    if (item) {
      const schema = document.createElement('script');
      schema.id = schemaId;
      schema.type = 'application/ld+json';
      schema.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: item.title,
        description: item.excerpt,
        datePublished: item.date,
        dateModified: item.date,
        mainEntityOfPage: absoluteUrl,
        image: item.imageUrl ? [new URL(item.imageUrl, window.location.origin).href] : undefined,
        publisher: { '@type': 'Organization', name: 'RESTART Integrace', url: window.location.origin }
      });
      document.head.appendChild(schema);
    }

    return () => {
      document.getElementById(schemaId)?.remove();
      document.title = previousTitle;
      if (canonicalWasCreated) canonical.remove();
      else if (previousCanonical) canonical.href = previousCanonical;
      changedMeta.forEach(({ element, created, previous }) => {
        if (created) element.remove();
        else if (previous !== null) element.content = previous;
      });
    };
  }, [description, item, path, title]);
}

function HeroAutoScroll({ items }: { items: typeof heroAutoScrollItems }) {
  const repeatedItems = [...items, ...items];

  return (
    <div className="hero-autoscroll" aria-label="Programy RESTART Integrace">
      <div className="hero-autoscroll-track">
        {repeatedItems.map((item, index) => {
          const isDuplicate = index >= items.length;
          return (
            <a
              key={`${item.id}-${index}`}
              href={item.href}
              className="hero-autoscroll-item"
              aria-hidden={isDuplicate || undefined}
              tabIndex={isDuplicate ? -1 : undefined}
            >
              <span>{item.title}</span>
              <small>{item.motto}</small>
            </a>
          );
        })}
      </div>
    </div>
  );
}

function HomeSlideshow({ slides }: { slides: HomeSlide[] }) {
  const visibleSlides = slides.filter((slide) => slide.isActive).sort((left, right) => left.sortOrder - right.sortOrder);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [autoplayEnabled, setAutoplayEnabled] = React.useState(false);
  const manualPauseUntil = React.useRef(0);
  const swipeStartX = React.useRef<number | null>(null);
  const activeSlide = visibleSlides[activeIndex] ?? visibleSlides[0] ?? starterSlides[0];
  const activeSlideHasDesignedText = designedTextSlidePattern.test(activeSlide.imageUrl);
  const detectedHeroStory = heroStoryFromSlide(activeSlide);
  const activeSlideLooksLikeProgram =
    sketchPillarSlidePattern.test(activeSlide.imageUrl) ||
    /program-pillars|jailbreak|reset|rework|streetwise|bod[-_\s]?zlomu|stabilizace/i.test(
      `${activeSlide.id} ${activeSlide.title} ${activeSlide.subtitle} ${activeSlide.imageUrl}`
    );
  const activeProgramStory = detectedHeroStory ?? (activeSlideLooksLikeProgram || activeSlideHasDesignedText ? fallbackProgramStoryFromIndex(activeIndex) : undefined);
  const activeSlideIsProgramStory = Boolean(activeProgramStory) || sketchPillarSlidePattern.test(activeSlide.imageUrl);
  const activeSlideIsMissionStory = missionSlideIds.has(activeSlide.id);
  const activeSlideHasContainedImage = activeSlideHasDesignedText || activeSlideIsProgramStory;
  const activePillarSlide = programPillarSlideFromSlide(activeSlide);
  const activeSlideTitle = activeSlide.title?.trim() || activePillarSlide?.title || 'REST||ART Integrace';
  const activeSlideSubtitle = activeSlide.subtitle?.trim() || activePillarSlide?.subtitle || '';
  const activeCtaLabel = activeSlide.ctaLabel?.trim() || activePillarSlide?.ctaLabel;
  const activeCtaHref = activeSlide.ctaHref?.trim() || activePillarSlide?.ctaHref;
  const slideCount = visibleSlides.length;
  const wrapIndex = (index: number) => {
    if (!slideCount) return 0;
    return (index + slideCount) % slideCount;
  };
  const markManualInteraction = () => {
    setAutoplayEnabled(true);
    manualPauseUntil.current = Date.now() + 9000;
  };
  const goToSlide = (index: number, manual = false) => {
    if (manual) markManualInteraction();
    setActiveIndex(wrapIndex(index));
  };
  const goNext = (manual = false) => {
    if (manual) markManualInteraction();
    setActiveIndex((current) => wrapIndex(current + 1));
  };
  const goPrev = (manual = false) => {
    if (manual) markManualInteraction();
    setActiveIndex((current) => wrapIndex(current - 1));
  };
  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    swipeStartX.current = event.clientX;
  };
  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (swipeStartX.current === null || slideCount < 2) return;
    const delta = event.clientX - swipeStartX.current;
    swipeStartX.current = null;
    if (Math.abs(delta) < 52) return;
    if (delta > 0) {
      goPrev(true);
    } else {
      goNext(true);
    }
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (slideCount < 2) return;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goPrev(true);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      goNext(true);
    }
  };

  React.useEffect(() => {
    if (!autoplayEnabled) return;
    if (visibleSlides.length < 2) return;
    const timer = window.setInterval(() => {
      if (Date.now() < manualPauseUntil.current) return;
      setActiveIndex((current) => (current + 1) % visibleSlides.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [autoplayEnabled, visibleSlides.length]);

  React.useEffect(() => {
    if (activeIndex >= visibleSlides.length) setActiveIndex(0);
  }, [activeIndex, visibleSlides.length]);

  return (
    <section
      className="hero slideshow-hero"
      aria-label="Hlavní sdělení"
      aria-roledescription="carousel"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div
        className={`hero-banner${activeSlideHasContainedImage ? ' designed-slide' : ''}${
          activeSlideIsProgramStory ? ' program-story-slide' : ''
        }${activeSlideIsMissionStory ? ' mission-story-slide' : ''}`}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          swipeStartX.current = null;
        }}
      >
        {activeSlideHasContainedImage && (
          <img className="hero-banner-bg" src={activeSlide.imageUrl} alt="" aria-hidden="true" loading="eager" fetchPriority="high" decoding="async" />
        )}
        <img className="hero-banner-main" src={activeSlide.imageUrl} alt="" loading="eager" fetchPriority="high" decoding="async" />
        {activeProgramStory && (
          <div className="hero-program-card" aria-live="polite">
            <p className="quiet-label">{activeProgramStory.label}</p>
            <h1>{activeSlideTitle}</h1>
            <p className="hero-program-motto">{activeProgramStory.motto}</p>
            <p className="hero-text">{activeProgramStory.text}</p>
            <div className="hero-actions">
              {activeCtaLabel && activeCtaHref && (
                <a className="button inverse" href={activeCtaHref}>
                  {activeCtaLabel} <ArrowRight size={18} />
                </a>
              )}
              <a className="button inverse ghost" href="/programy">
                Zobrazit programy
              </a>
            </div>
          </div>
        )}
        <div className="hero-banner-overlay" aria-live="polite">
          <p className="quiet-label">{activeProgramStory?.label ?? 'Projekt druhých šancí'}</p>
          <h1>{activeSlideTitle}</h1>
          {activeProgramStory ? (
            <>
              <p className="hero-program-motto">{activeProgramStory.motto}</p>
              <p className="hero-text">{activeProgramStory.text}</p>
            </>
          ) : (
            <p className="hero-text">{activeSlideSubtitle}</p>
          )}
          <div className="hero-actions">
            {activeCtaLabel && activeCtaHref && (
              <a className="button inverse" href={activeCtaHref}>
                {activeCtaLabel} <ArrowRight size={18} />
              </a>
            )}
            <a className="button inverse ghost" href="/programy">
              Zobrazit programy
            </a>
          </div>
        </div>
        {visibleSlides.length > 1 && (
          <button className="slide-arrow slide-prev" type="button" aria-label="Předchozí slide" onClick={() => goPrev(true)}>
            <ChevronLeft size={26} />
          </button>
        )}
        {visibleSlides.length > 1 && (
          <button className="slide-arrow slide-next" type="button" aria-label="Další slide" onClick={() => goNext(true)}>
            <ArrowRight size={24} />
          </button>
        )}
        {visibleSlides.length > 1 && (
          <span className="slide-counter" aria-label={`Slide ${activeIndex + 1} z ${visibleSlides.length}`}>
            {activeIndex + 1} / {visibleSlides.length}
          </span>
        )}
      </div>
      <HeroAutoScroll items={heroAutoScrollItems} />
      {visibleSlides.length > 1 && (
        <div className="slide-dots" aria-label="Výběr slidu">
          {visibleSlides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              className={index === activeIndex ? 'active' : ''}
              aria-label={`Zobrazit slide ${index + 1}`}
              onClick={() => goToSlide(index, true)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function PracticePhotoSlideshow({ content }: { content: HomepageContentItem[] }) {
  const galleryIntro =
    content.find((item) => item.id === 'practice-gallery' && item.contentType === 'section') ??
    defaultHomepageSections[0];
  const gallerySlides = content
    .filter((item) => item.contentType === 'gallery' && item.isActive)
    .sort((left, right) => left.sortOrder - right.sortOrder);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const manualPauseUntil = React.useRef(0);
  const slideCount = gallerySlides.length;
  const activeSlide = gallerySlides[activeIndex] ?? gallerySlides[0];
  const wrapIndex = (index: number) => (index + slideCount) % slideCount;
  const goToSlide = (index: number, manual = false) => {
    if (manual) manualPauseUntil.current = Date.now() + 9000;
    setActiveIndex(wrapIndex(index));
  };
  const goNext = (manual = false) => {
    if (manual) manualPauseUntil.current = Date.now() + 9000;
    setActiveIndex((current) => wrapIndex(current + 1));
  };
  const goPrev = (manual = false) => {
    if (manual) manualPauseUntil.current = Date.now() + 9000;
    setActiveIndex((current) => wrapIndex(current - 1));
  };

  React.useEffect(() => {
    if (slideCount < 2) return;
    const timer = window.setInterval(() => {
      if (Date.now() < manualPauseUntil.current) return;
      setActiveIndex((current) => (current + 1) % slideCount);
    }, 7200);
    return () => window.clearInterval(timer);
  }, [slideCount]);

  React.useEffect(() => {
    if (activeIndex >= slideCount) setActiveIndex(0);
  }, [activeIndex, slideCount]);

  if (!galleryIntro.isActive || !activeSlide) return null;

  return (
    <section className="practice-gallery" aria-label="Fotky z praxe">
      <div className="practice-gallery-copy">
        <p className="section-label">{galleryIntro.label}</p>
        <h2>{galleryIntro.title}</h2>
        <p>{galleryIntro.body}</p>
      </div>
      <div className="practice-gallery-stage">
        <figure className="practice-photo-frame">
          <img src={activeSlide.imageUrl} alt="" />
          <figcaption>
            <span>{activeIndex + 1} / {slideCount}</span>
            <strong>{activeSlide.title}</strong>
            <p>{activeSlide.body}</p>
          </figcaption>
        </figure>
        <div className="practice-gallery-controls">
          <button type="button" aria-label="Předchozí fotka" title="Předchozí fotka" onClick={() => goPrev(true)}>
            <ChevronLeft size={22} />
          </button>
          <div className="slide-dots compact" aria-label="Výběr fotky">
            {gallerySlides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                className={index === activeIndex ? 'active' : ''}
                aria-label={`Zobrazit fotku ${index + 1}`}
                onClick={() => goToSlide(index, true)}
              />
            ))}
          </div>
          <button type="button" aria-label="Další fotka" title="Další fotka" onClick={() => goNext(true)}>
            <ArrowRight size={21} />
          </button>
        </div>
      </div>
    </section>
  );
}

function LazyVideo({
  src,
  poster,
  label,
  buttonLabel = 'Přehrát video'
}: {
  src: string;
  poster: string;
  label: string;
  buttonLabel?: string;
}) {
  const [isLoaded, setIsLoaded] = React.useState(false);

  if (isLoaded) {
    return (
      <video controls autoPlay preload="metadata" poster={poster} aria-label={label}>
        <source src={src} type="video/mp4" />
        Váš prohlížeč neumí přehrát vložené video.
      </video>
    );
  }

  return (
    <button className="lazy-video-poster" type="button" aria-label={label} onClick={() => setIsLoaded(true)}>
      <img src={poster} alt="" width="960" height="540" loading="lazy" />
      <span className="lazy-video-play">
        <Video size={22} />
        {buttonLabel}
      </span>
    </button>
  );
}

function useVideoWatchSeo(video: VideoWatchPageData) {
  React.useEffect(() => {
    const absoluteUrl = `${window.location.origin}${video.path}`;
    const absoluteVideoUrl = new URL(video.contentUrl, window.location.origin).href;
    const absoluteThumbnailUrl = new URL(video.thumbnailUrl, window.location.origin).href;
    const previousTitle = document.title;
    document.title = `${video.title} | RESTART Integrace`;

    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]') ?? document.createElement('link');
    const canonicalCreated = !canonical.parentNode;
    const previousCanonical = canonical.getAttribute('href');
    if (canonicalCreated) {
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = absoluteUrl;

    const changedMeta: Array<{ element: HTMLMetaElement; created: boolean; previous: string | null }> = [];
    const setMeta = (selector: string, attribute: 'name' | 'property', key: string, content: string) => {
      const meta = document.querySelector<HTMLMetaElement>(selector) ?? document.createElement('meta');
      const created = !meta.parentNode;
      changedMeta.push({ element: meta, created, previous: meta.getAttribute('content') });
      if (created) {
        meta.setAttribute(attribute, key);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    setMeta('meta[name="description"]', 'name', 'description', video.description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', video.title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', video.description);
    setMeta('meta[property="og:url"]', 'property', 'og:url', absoluteUrl);
    setMeta('meta[property="og:type"]', 'property', 'og:type', 'video.other');
    setMeta('meta[property="og:image"]', 'property', 'og:image', absoluteThumbnailUrl);
    setMeta('meta[property="og:video"]', 'property', 'og:video', absoluteVideoUrl);
    setMeta('meta[property="og:video:type"]', 'property', 'og:video:type', 'video/mp4');

    const schema = document.createElement('script');
    schema.id = 'video-watch-structured-data';
    schema.type = 'application/ld+json';
    schema.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: video.title,
      description: video.description,
      thumbnailUrl: [absoluteThumbnailUrl],
      uploadDate: video.uploadDate,
      duration: video.duration,
      contentUrl: absoluteVideoUrl,
      width: video.width,
      height: video.height,
      isAccessibleForFree: true,
      inLanguage: 'cs-CZ',
      mainEntityOfPage: absoluteUrl,
      publisher: {
        '@type': 'Organization',
        name: 'RESTART Integrace',
        url: window.location.origin,
        logo: {
          '@type': 'ImageObject',
          url: `${window.location.origin}/images/brand/restart-integrace-full-logo.png`
        }
      }
    });
    document.getElementById(schema.id)?.remove();
    document.head.appendChild(schema);

    return () => {
      document.title = previousTitle;
      if (canonicalCreated) canonical.remove();
      else if (previousCanonical) canonical.href = previousCanonical;
      changedMeta.forEach(({ element, created, previous }) => {
        if (created) element.remove();
        else if (previous !== null) element.content = previous;
      });
      schema.remove();
    };
  }, [video]);
}

function VideoWatchPage({ video }: { video: VideoWatchPageData }) {
  useVideoWatchSeo(video);
  const durationSeconds = video.duration === 'PT15S' ? '15 sekund' : '6 sekund';

  return (
    <section className="content-section video-watch-page">
      <header className="video-watch-header">
        <div>
          <p className="section-label">{video.eyebrow}</p>
          <h1>{video.title}</h1>
        </div>
      </header>

      <video
        className="video-watch-player"
        controls
        preload="metadata"
        poster={video.thumbnailUrl}
        width={video.width}
        height={video.height}
        aria-label={video.title}
      >
        <source src={video.contentUrl} type="video/mp4" />
        Váš prohlížeč neumí přehrát toto video.
      </video>

      <div className="video-watch-support">
        <div>
          <p className="section-label">Obsah videa</p>
          <h2>{video.caption}</h2>
        </div>
        <div className="video-watch-description">
          <p>{video.description}</p>
          <dl aria-label="Informace o videu">
            <div><dt>Délka</dt><dd>{durationSeconds}</dd></div>
            <div><dt>Publikováno</dt><dd><time dateTime={video.uploadDate}>23. 6. 2026</time></dd></div>
          </dl>
        </div>
        <a className="button secondary" href="/">
          Zpět na úvod <ArrowRight size={18} />
        </a>
      </div>
    </section>
  );
}

function ProjectRevealMini() {
  return (
    <section className="project-reveal-section" aria-labelledby="project-reveal-title">
      <div className="project-reveal-copy">
        <p className="section-label">O projektu</p>
        <h2 id="project-reveal-title">Krátká animace, která drží atmosféru druhé šance.</h2>
        <p>
          Logo reveal používáme jako jemný brand moment: ne jako zdržující intro, ale jako krátký vizuální podpis
          projektu tam, kde má návštěvník rychle pochopit, že REST||ART Integrace má vlastní tvář.
        </p>
        <div className="project-reveal-points" aria-label="Využití animace">
          <span>O projektu</span>
          <span>Partnerům</span>
          <span>Video intro</span>
        </div>
        <a className="button primary" href="/co-delame">
          Projít metodu práce <ArrowRight size={18} />
        </a>
      </div>
      <figure className="project-reveal-card">
        <div className="project-reveal-video-frame">
          <LazyVideo
            src="/videos/restart-logo-reveal.mp4"
            poster="/images/video/restart-logo-reveal-preview.webp"
            label="Přehrát mini animaci loga REST ART Integrace"
            buttonLabel="Přehrát animaci"
          />
        </div>
        <figcaption>
          <span><Video size={18} /> Mini animace projektu druhých šancí</span>
          <a href="/videa/logo-reveal">Samostatná stránka videa <ArrowRight size={16} /></a>
        </figcaption>
      </figure>
    </section>
  );
}

function HomePage({
  news,
  slides,
  homepageContent,
  discussion,
  account,
  onToggleLike,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
  onNotify
}: {
  news: NewsItem[];
  slides: HomeSlide[];
  homepageContent: HomepageContentItem[];
  discussion: NewsDiscussion;
  account: AuthAccount | null;
  onToggleLike: (newsId: string) => Promise<void>;
  onAddComment: (newsId: string, text: string, parentId?: string | null) => Promise<boolean>;
  onUpdateComment: (commentId: string, text: string) => Promise<boolean>;
  onDeleteComment: (commentId: string) => Promise<void>;
  onNotify: (tone: FeedbackTone, title: string, text?: string) => void;
}) {
  const section = (id: string) =>
    homepageContent.find((item) => item.id === id && item.contentType === 'section') ??
    defaultHomepageSections.find((item) => item.id === id)!;
  const streetwiseSection = section('streetwise');
  const greenBandSection = section('green-band');
  const economySection = section('economy');
  const solutionSection = section('solution');
  const impactSection = section('impact');
  const seoSection = section('seo');
  const partnersSection = section('partners');

  return (
    <>
      <HomeSlideshow slides={slides} />
      <PracticePhotoSlideshow content={homepageContent} />

      {streetwiseSection.isActive && <section className="streetwise-feature" aria-label="STREETWISE zázemí">
        <article className="streetwise-card streetwise-card-main">
          <p className="section-label">{streetwiseSection.label}</p>
          <h2>{streetwiseSection.title}</h2>
          <p>{streetwiseSection.body}</p>
          <a className="button primary" href={streetwiseSection.ctaHref || '/programy/streetwise'}>
            {streetwiseSection.ctaLabel || 'STREETWISE'} <ArrowRight size={18} />
          </a>
        </article>
        <article className="streetwise-card">
          <strong>První kontakt</strong>
          <p>
            Nízkoprahové místo, kam člověk může přijít bez dlouhého vysvětlování a začít řešit další krok.
          </p>
        </article>
        <article className="streetwise-card">
          <strong>Zázemí a střecha</strong>
          <p>
            Praktický prostor pro lidi bez domova: bezpečí, orientace, hygienické balíky a návazná pomoc.
          </p>
        </article>
        <figure className="streetwise-card streetwise-photo">
          <img src="/images/crops/streetwise/streetwise-bouda-stavba.webp" alt="" />
          <figcaption>Reálná stavba z nalezeného materiálu</figcaption>
        </figure>
      </section>}

      <section className="stats-band" aria-label="Základní čísla">
        {stats.map((item) => (
          <div key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </section>

      {greenBandSection.isActive && <section className="green-band">
        <div>
          <p>{greenBandSection.title}</p>
          <span>{greenBandSection.body}</span>
        </div>
        <a className="button inverse" href={greenBandSection.ctaHref || '/co-delame'}>
          {greenBandSection.ctaLabel || 'Jak pracujeme'}
        </a>
      </section>}

      <ProjectRevealMini />

      <section className="split-section">
        <div>
          <p className="section-label">Realita bez filtru</p>
          <h2>Problém, který nejde schovat do statistik.</h2>
        </div>
        <div className="text-column">
          <p>
            Česká republika každoročně platí vysokou cenu za to, že lidé po krizi, výkonu trestu nebo dlouhodobém
            propadu často zůstávají bez návazné podpory. Bez práce, bydlení a režimu se člověk snadno vrací zpět do
            systému, který je drahý, přetížený a lidsky vyčerpávající.
          </p>
          <p>
            REST||ART Integrace stojí na jednoduché otázce: co kdyby část těchto nákladů šla do návratu člověka dřív,
            než se znovu zlomí?
          </p>
        </div>
      </section>

      {economySection.isActive && <section className="content-section compact-section">
        <SectionIntro
          label={economySection.label}
          title={economySection.title}
          text={economySection.body}
        />
        <div className="metric-grid">
          {realityCards.map((item) => (
            <article className="metric-card" key={item.title}>
              <strong>{item.value}</strong>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>}

      {solutionSection.isActive && <section className="solution-section">
        <SectionIntro
          label={solutionSection.label}
          title={solutionSection.title}
          text={solutionSection.body}
        />
        <div className="principle-grid">
          {solutionPrinciples.map((item) => (
            <article key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>}

      {impactSection.isActive && <section className="content-section compact-section">
        <SectionIntro
          label={impactSection.label}
          title={impactSection.title}
          text={impactSection.body}
        />
        <div className="metric-grid">
          {impactMetrics.map((item) => (
            <article className="metric-card muted" key={item.title}>
              <strong>{item.value}</strong>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>}

      {seoSection.isActive && <section className="homepage-seo-section" aria-labelledby="homepage-seo-title">
        <p className="section-label">{seoSection.label}</p>
        <h2 id="homepage-seo-title">{seoSection.title}</h2>
        <p>{seoSection.body}</p>
        <div className="homepage-seo-points" aria-label="Hlavní oblasti podpory">
          <span>projekt druhých šancí</span>
          <span>sociální začleňování</span>
          <span>podpora po výkonu trestu</span>
          <span>práce, bydlení a stabilizace</span>
        </div>
      </section>}

      <section className="project-video-section" id="projektove-video" aria-labelledby="project-video-title">
        <div className="project-video-copy">
          <p className="section-label">Video o projektu</p>
          <h2 id="project-video-title">RESTART Integrace v krátké animaci</h2>
          <p>
            Stručné představení projektu druhých šancí: proč vzniká, komu pomáhá a jak se do něj mohou zapojit lidé,
            firmy, instituce i podporovatelé.
          </p>
          <a className="button secondary" href="/videa/predstaveni-projektu">
            Otevřít stránku videa <ArrowRight size={18} />
          </a>
        </div>
        <figure className="project-video-frame">
          <LazyVideo
            src="/videos/rest-art-intro-z-podkladu-v1-720p.mp4"
            poster="/videos/rest-art-intro-poster.webp"
            label="Přehrát krátké video projektu RESTART Integrace"
          />
          <figcaption>Oficiální krátké video projektu RESTART Integrace.</figcaption>
        </figure>
      </section>

      {partnersSection.isActive && <section className="split-section partner-message">
        <div>
          <p className="section-label">{partnersSection.label}</p>
          <h2>{partnersSection.title}</h2>
        </div>
        <div className="text-column">
          <p>{partnersSection.body}</p>
          <p>
            Podpora projektu pomáhá pokrýt mentoring, první materiály, dopravu, dokumenty, pracovní přípravu a zázemí,
            kde může člověk začít znovu.
          </p>
          <div className="inline-actions">
            <a className="button primary" href={partnersSection.ctaHref || '/zapojeni'}>
              {partnersSection.ctaLabel || 'Chci být partner'} <ArrowRight size={18} />
            </a>
            <a className="button secondary" href="/darujte">
              Podpořit projekt
            </a>
          </div>
        </div>
      </section>}

      <section className="content-section">
        <SectionIntro
          label="Rozcestník"
          title="Vyberte oblast, kterou potřebujete řešit"
          text="Druhá šance má několik vstupních cest. Každá vede k praktické pomoci a konkrétnímu dalšímu kroku."
        />
        <div className="home-link-grid">
          {[
            { href: '/co-delame', title: 'Co děláme', text: 'Mentoring, práce, bydlení a stabilizace.' },
            { href: '/programy', title: 'Programy', text: 'JAILBREAK, RESET, REWORK, STREETWISE, BOD ZLOMU a STABILIZACE.' },
            { href: '/aktuality', title: 'Aktuality', text: 'Krátké zprávy a veřejné novinky projektu.' },
            { href: '/kontakt', title: 'Kontakt', text: 'Rychlý kontakt, e-mail, telefon a formulář.' }
          ].map((item) => (
            <a className="home-link" href={item.href} key={item.href}>
              <strong>{item.title}</strong>
              <span>{item.text}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="muted-section">
        <SectionIntro
          label="Aktuálně"
          title="Poslední zprávy"
          text="Zprávy z projektu, terénu a příprav jednotlivých programů."
        />
        <NewsGrid
          news={news.slice(0, 2)}
          discussion={discussion}
        />
      </section>
    </>
  );
}

function WorkPage() {
  return (
    <>
      <PageHeader
        label="Co děláme"
        title="Pomoc není jednorázový kontakt. Je to doprovázení."
        text="Pracujeme s lidmi, kteří potřebují stabilní oporu při návratu do běžného života. Spojujeme praktickou pomoc s lidským přístupem."
      />
      <section className="content-section">
        <FocusGrid />
      </section>
      <section className="green-band">
        <div>
          <p>Důstojnost, praxe a dlouhodobost</p>
          <span>Druhá šance není slogan do kampaně. Je to metoda práce, která má konkrétní kroky.</span>
        </div>
      </section>
      <section className="split-section">
        <div>
          <p className="section-label">Pro koho</p>
          <h2>Vidíme potenciál tam, kde ostatní často vidí problém.</h2>
        </div>
        <div className="text-column">
          <p>
            Projekt je určen lidem po výkonu trestu, lidem bez domova, lidem v sociální krizi, mladým lidem z ústavní
            péče, dlouhodobě nezaměstnaným a lidem, kteří se po léčbě nebo těžké životní situaci potřebují znovu
            postavit na vlastní nohy.
          </p>
          <p>
            Naším cílem je jednoduchá, ale náročná věc: vrátit člověka zpět do společnosti a dát mu podmínky, aby
            změna vydržela.
          </p>
        </div>
      </section>
      <section className="content-section">
        <SectionIntro
          label="Jak pracujeme"
          title="Důstojně, prakticky a dlouhodobě"
          text="Základní principy drží projekt pohromadě i napříč různými cílovými skupinami."
        />
        <div className="principles">
          {principles.map((principle) => (
            <span key={principle}>{principle}</span>
          ))}
        </div>
      </section>
    </>
  );
}

function ProgramsPage() {
  return (
    <>
      <PageHeader
        label="Programy"
        title="Šest cest podle konkrétní situace člověka"
        text="Každý program má jinou cílovou skupinu, ale společný cíl: návrat k samostatnosti, práci, vztahům a bezpečnému fungování."
      />
      <ProgramPillarMap />
      <section className="muted-section">
        <ProgramsList />
      </section>
    </>
  );
}

function ProgramDetailPage({ program }: { program: (typeof programs)[number] }) {
  const Icon = program.icon;
  const pillarVisual = getProgramPillarVisual(program.title);
  const heroImage = program.image ?? pillarVisual;
  const isStreetwise = program.title === 'STREETWISE';
  const [activeActivityIndex, setActiveActivityIndex] = React.useState<number | null>(null);
  const activeActivity =
    activeActivityIndex !== null ? program.activityDetails?.[activeActivityIndex] ?? null : null;
  const fallbackText =
    'Praktická podpora, důstojný přístup a plán, který se dá zvládnout krok za krokem.';

  React.useEffect(() => {
    if (!activeActivity) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveActivityIndex(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeActivity]);

  return (
    <>
      <section className={`program-detail-hero${heroImage ? ' has-image' : ''}`}>
        <div className="program-detail-copy">
          <a className="back-link" href="/programy">
            <ChevronLeft size={18} /> Zpět na programy
          </a>
          <p className="section-label">Program</p>
          <div className="program-detail-title">
            <span className="program-icon">
              <Icon size={26} />
            </span>
            <div>
              <h1>{program.title}</h1>
              <p>{program.audience}</p>
            </div>
          </div>
          <p className="program-detail-lead">{program.goal}</p>
          {program.duration ? <p className="program-duration">{program.title} | {program.duration}</p> : null}
          <p>{program.featureText ?? fallbackText}</p>
          {program.quote ? (
            <blockquote className="program-quote">
              <p>{program.quote.text}</p>
              {program.quote.caption ? <cite>{program.quote.caption}</cite> : null}
            </blockquote>
          ) : null}
          <div className="program-detail-actions">
            <a className="button primary" href="/kontakt">
              Napište nám <ArrowRight size={18} />
            </a>
            <a className="button secondary" href="/zapojeni">
              Chci pomoci
            </a>
          </div>
        </div>
        {heroImage ? (
          <figure className="program-detail-media">
            <img src={heroImage.src} alt={heroImage.alt} />
          </figure>
        ) : null}
      </section>
      {program.stats?.length ? (
        <section className="program-stat-band" aria-label={`${program.title} v číslech`}>
          {program.stats.map((item) => (
            <div key={`${item.value}-${item.label}`}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </section>
      ) : null}
      <section className="content-section program-detail-section">
        <SectionIntro
          label="V praxi"
          title="Co v programu řešíme"
          text="Konkrétní oblasti podpory, které drží člověka v pohybu od prvního kontaktu k dlouhodobé stabilitě."
        />
        <div className="program-detail-points">
          {program.activities.map((activity, index) => {
            const detail = program.activityDetails?.[index];
            return detail ? (
              <button
                key={activity}
                className="program-activity-chip"
                type="button"
                aria-haspopup="dialog"
                onClick={() => setActiveActivityIndex(index)}
              >
                <Info size={16} />
                {activity}
              </button>
            ) : (
              <span key={activity}>{activity}</span>
            );
          })}
        </div>
      </section>
      {isStreetwise ? (
        <section className="content-section program-visual-story streetwise-program-visual" aria-labelledby="streetwise-visual-title">
          <figure>
            <a href="/images/program-pillars/streetwise-program-vizual.webp" target="_blank" rel="noreferrer">
              <img
                src="/images/program-pillars/streetwise-program-vizual.webp"
                alt="Vizuál programu STREETWISE s člověkem při práci a principy praktických dovedností, režimu, odpovědnosti a druhé šance."
                width={1280}
                height={1280}
                loading="lazy"
              />
            </a>
            <figcaption>
              Veřejný vizuál programu STREETWISE: dovednosti, disciplína, důstojnost a nový směr.
            </figcaption>
          </figure>
          <div className="program-visual-copy">
            <p className="section-label">STREETWISE v jednom obrazu</p>
            <h2 id="streetwise-visual-title">Praktický krok má smysl, když vede k samostatnosti</h2>
            <p>
              Vizuální koncept shrnuje směr programu. Praktické dovednosti, denní režim a návazná podpora nejsou cílem
              samy o sobě. Jsou oporou pro člověka, který znovu přebírá odpovědnost za svůj život.
            </p>
            <ul className="program-visual-principles">
              <li><strong>Praktické dovednosti</strong><span>Konkrétní úkol, viditelný výsledek a zkušenost, že změnu lze dokončit.</span></li>
              <li><strong>Režim a odpovědnost</strong><span>Jasná pravidla, pravidelnost a spolehlivost, na které se dá stavět.</span></li>
              <li><strong>Krok za krokem</strong><span>Realistický plán rozdělený na malé kroky, které člověk dokáže udržet.</span></li>
              <li><strong>Druhá šance skutečně</strong><span>Minulost nezmizí, ale dnešní rozhodnutí může změnit další směr.</span></li>
            </ul>
          </div>
        </section>
      ) : null}
      {activeActivity
        ? createPortal(
            <div
              className="modal-backdrop program-modal-backdrop"
              role="presentation"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) setActiveActivityIndex(null);
              }}
            >
              <article
                className="program-activity-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="program-activity-modal-title"
                onMouseDown={(event) => event.stopPropagation()}
              >
                <button className="modal-close" type="button" aria-label="Zavřít detail bodu" onClick={() => setActiveActivityIndex(null)}>
                  <X size={18} />
                </button>
                <p className="section-label">JAILBREAK | co řešíme</p>
                <h2 id="program-activity-modal-title">{activeActivity.title}</h2>
                <p>{activeActivity.text}</p>
                {activeActivity.items?.length ? (
                  <ul>
                    {activeActivity.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </article>
            </div>,
            document.body
          )
        : null}
      {program.sections?.length ? (
        <section className="content-section program-story-section">
          {program.sections.map((section) => (
            <article key={section.title} className="program-story-card">
              <p className="section-label">{section.label}</p>
              <h2>{section.title}</h2>
              <p>{section.text}</p>
              {section.items?.length ? (
                <ul>
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
          {program.contactBox ? (
            <aside className="program-contact-box">
              <p className="section-label">REST||ART | {program.title}</p>
              <h3>{program.contactBox.title}</h3>
              {program.contactBox.lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </aside>
          ) : null}
        </section>
      ) : null}
    </>
  );
}

function NewsDetailPage({
  item,
  discussion,
  account,
  onToggleLike,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
  onNotify
}: {
  item: NewsItem;
  discussion: NewsDiscussion;
  account: AuthAccount | null;
  onToggleLike: (newsId: string) => Promise<void>;
  onAddComment: (newsId: string, text: string, parentId?: string | null) => Promise<boolean>;
  onUpdateComment: (commentId: string, text: string) => Promise<boolean>;
  onDeleteComment: (commentId: string) => Promise<void>;
  onNotify: (tone: FeedbackTone, title: string, text?: string) => void;
}) {
  const isStory = isSecondChanceStory(item);
  const backHref = isStory ? '/pribehy-druhe-sance' : newsTagPath(newsTagLabel(item));
  const backLabel = isStory ? 'Zpět na příběhy' : `Zpět: ${newsTagLabel(item)}`;
  useNewsSeo({ title: item.title, description: item.excerpt, path: newsPath(item), item });
  
  return (
    <>
      <section className="story-detail-hero">
        <div>
          <a className="back-link" href={backHref}>
            <ChevronLeft size={18} /> {backLabel}
          </a>
          <div className="news-card-meta">
            {item.tag && (
              <a className="news-tag" href={isStory ? '/pribehy-druhe-sance' : newsTagPath(item.tag)}>
                {item.tag}
              </a>
            )}
            <time dateTime={item.date}>{new Date(item.date).toLocaleDateString('cs-CZ')}</time>
          </div>
          <h1>{item.title}</h1>
          <p>{item.excerpt}</p>
          {item.imageUrl && (
            <div className="news-detail-image">
              <img src={item.imageUrl} alt={item.title} loading="lazy" />
            </div>
          )}
        </div>
      </section>
      <section className="content-section story-detail-content">
        {item.body ? (
          <article className="news-body" dangerouslySetInnerHTML={{ __html: cleanNewsHtml(item.body, item.title) }} />
        ) : (
          <p>{item.excerpt}</p>
        )}
        <NewsDiscussionPanel
          item={item}
          discussion={discussion}
          account={account}
          onToggleLike={onToggleLike}
          onAddComment={onAddComment}
          onUpdateComment={onUpdateComment}
          onDeleteComment={onDeleteComment}
          onNotify={onNotify}
        />
      </section>
    </>
  );
}

function NewsPage({
  news,
  discussion,
  storiesOnly = false,
  activeTagSlug = ''
}: {
  news: NewsItem[];
  discussion: NewsDiscussion;
  storiesOnly?: boolean;
  activeTagSlug?: string;
}) {
  const sortedNews = [...news].sort((a, b) => {
    const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
    return dateDiff || a.title.localeCompare(b.title, 'cs');
  });
  const secondChanceStories = sortedNews.filter(isSecondChanceStory);
  const availableTags = Array.from(new Set(sortedNews.filter((item) => !isSecondChanceStory(item)).map(newsTagLabel))).sort((a, b) =>
    a.localeCompare(b, 'cs')
  );
  const activeTag = activeTagSlug ? availableTags.find((tag) => slugifyPathSegment(tag) === activeTagSlug) : undefined;
  const displayedNews = storiesOnly
    ? secondChanceStories
    : activeTag
      ? sortedNews.filter((item) => !isSecondChanceStory(item) && newsTagSlug(item) === activeTagSlug)
      : sortedNews;
  const seoTitle = storiesOnly ? 'Příběhy druhé šance' : activeTag ? `Aktuality: ${activeTag}` : 'Aktuality';
  const seoDescription = storiesOnly
    ? 'Anonymizované příběhy lidí, kteří se vracejí do běžného života.'
    : activeTag
      ? `Novinky projektu RESTART Integrace v rubrice ${activeTag}.`
      : 'Novinky z projektu, praxe, programů a komunitní spolupráce RESTART Integrace.';
  useNewsSeo({
    title: seoTitle,
    description: seoDescription,
    path: storiesOnly ? '/pribehy-druhe-sance' : activeTag ? newsTagPath(activeTag) : '/aktuality'
  });
  return (
    <>
      <PageHeader
        label={storiesOnly ? 'Příběhy druhé šance' : activeTag || 'Aktuality'}
        title={storiesOnly ? 'Skutečné příběhy bez bulváru' : activeTag ? `Aktuality: ${activeTag}` : 'Co se v projektu děje'}
        text={
          storiesOnly
            ? 'Anonymizované příběhy lidí, kteří se snaží vrátit do běžného života. Bez senzace, s respektem a důrazem na změnu.'
            : 'Novinky z projektu, příběhy z praxe a důležité informace o podpoře, programech a komunitní spolupráci.'
        }
      />
      <section className="content-section">
        {!storiesOnly && availableTags.length > 0 && (
          <nav className="news-tag-nav" aria-label="Rubriky aktualit">
            <a className={!activeTag ? 'active' : ''} href="/aktuality" aria-current={!activeTag ? 'page' : undefined}>
              Všechny
            </a>
            {availableTags.map((tag) => (
              <a
                key={tag}
                className={tag === activeTag ? 'active' : ''}
                href={newsTagPath(tag)}
                aria-current={tag === activeTag ? 'page' : undefined}
              >
                {tag}
              </a>
            ))}
          </nav>
        )}
        {secondChanceStories.length > 0 && !storiesOnly && (
          <aside className="story-rubric-callout" aria-label="Rubrika Příběhy druhé šance">
            <span className="news-tag">Příběhy druhé šance</span>
            <div>
              <h2>Skutečné příběhy bez bulváru.</h2>
              <p>
                Citlivě zpracované kazuistiky lidí, kteří se snaží vrátit do běžného života. Identifikační a
                rodinné detaily zůstávají mimo veřejný prostor.
              </p>
            </div>
          </aside>
        )}
        <NewsGrid
          news={displayedNews}
          discussion={discussion}
        />
      </section>
    </>
  );
}

const supportOptions = [
  {
    href: '/zapojeni/darovat-obleceni',
    shortTitle: 'Oblečení',
    label: 'Základní potřeby',
    title: 'Darujte oblečení',
    text: 'Čisté a použitelné oblečení může pomoci lidem v programu STREETWISE i těm, kteří po propuštění nemají vlastní zázemí.',
    icon: Shirt
  },
  {
    href: '/zapojeni/vybaveni-centra',
    shortTitle: 'Vybavení',
    label: 'Komunitní zázemí',
    title: 'Vybavení pro centrum',
    text: 'Nábytek, kancelářské a další funkční vybavení využijeme při budování komunitního centra a zázemí projektu.',
    icon: PackageOpen
  },
  {
    href: '/zapojeni/sbirka-knih',
    shortTitle: 'Knihy',
    label: 'Vzdělávání',
    title: 'Sbírka knih',
    text: 'Knihy předáváme tam, kde mohou podpořit vzdělávání, mentoring, osobní rozvoj a smysluplné využití času.',
    icon: BookOpen
  },
  {
    href: '/darovat',
    shortTitle: 'Finanční dary',
    label: 'DONATE',
    title: 'Finanční podpora',
    text: 'Jednorázový nebo pravidelný dar pomáhá financovat mentoring, dopravu, materiál a konkrétní kroky stabilizace.',
    icon: Heart
  }
];

type MaterialSupportPageConfig = {
  path: string;
  offerType: ApiMaterialOfferType;
  label: string;
  title: string;
  text: string;
  introTitle: string;
  intro: string;
  acceptedTitle: string;
  accepted: string[];
  helpsTitle: string;
  helps: string[];
  note: string;
};

const materialSupportPages: Record<string, MaterialSupportPageConfig> = {
  '/zapojeni/darovat-obleceni': {
    path: '/zapojeni/darovat-obleceni',
    offerType: 'clothing',
    label: 'Dary oblečení',
    title: 'Oblečení pro důstojný nový začátek',
    text: 'Pomozte zajistit základní potřeby lidem, kteří nemají prostředky ani blízkého člověka, na kterého by se mohli obrátit.',
    introTitle: 'Praktická pomoc ve chvíli, kdy je opravdu potřeba',
    intro:
      'Darované oblečení směřuje podle aktuální potřeby zejména k lidem bez stabilního zázemí v programu STREETWISE a k lidem vracejícím se z výkonu trestu. Předání vždy koordinujeme tak, aby odpovídalo velikosti, ročnímu období a skutečné situaci konkrétního člověka.',
    acceptedTitle: 'Co dává smysl nabídnout',
    accepted: [
      'Čisté, vyprané a nepoškozené běžné oblečení.',
      'Sezónní bundy, mikiny, kalhoty a pracovní oděvy.',
      'Použitelnou obuv, batohy, tašky a základní doplňky.',
      'Nové spodní prádlo, ponožky a hygienické potřeby v původním balení.'
    ],
    helpsTitle: 'Komu může dar pomoci',
    helps: [
      'Lidem bez domova nebo bez stabilního zázemí.',
      'Lidem bez prostředků na zajištění základních potřeb.',
      'Lidem po propuštění, kteří nemají rodinnou ani jinou oporu.',
      'Klientům při nástupu do práce, na pohovor nebo při návratu do běžného režimu.'
    ],
    note: 'Oblečení prosím nevozte bez předchozí domluvy. Potvrdíme aktuální potřebu, velikosti i možnosti převzetí.'
  },
  '/zapojeni/vybaveni-centra': {
    path: '/zapojeni/vybaveni-centra',
    offerType: 'equipment',
    label: 'Vybavení centra',
    title: 'Dejte vybavení další smysluplné využití',
    text: 'Přijímáme nabídky funkčního vybavení pro komunitní centrum, kanceláře projektu a praktickou práci s klienty.',
    introTitle: 'Zázemí, ve kterém se dá pracovat a začít znovu',
    intro:
      'Komunitní centrum a kanceláře potřebují jednoduché, bezpečné a funkční vybavení. Využití každé nabídky předem ověříme podle prostoru, dopravy a aktuálních priorit projektu.',
    acceptedTitle: 'Co můžeme využít',
    accepted: [
      'Stoly, židle, křesla, skříně, police a úložné systémy.',
      'Kancelářské vybavení, monitory, počítače, tiskárny a drobnou techniku.',
      'Vybavení pro komunitní kuchyň, setkávání, workshopy a mentoring.',
      'Nářadí, pracovní pomůcky a materiál pro údržbu a praktické programy.'
    ],
    helpsTitle: 'Kde vybavení slouží',
    helps: [
      'V kancelářích projektu a při individuálních konzultacích.',
      'V komunitním centru a prostoru pro setkávání.',
      'Při vzdělávání, mentoringu a přípravě na zaměstnání.',
      'V praktických aktivitách, které rozvíjejí samostatnost a pracovní návyky.'
    ],
    note: 'Přijímáme pouze bezpečné a funkční věci. Před předáním si potvrdíme rozměry, stav, dopravu a konkrétní využití.'
  },
  '/zapojeni/sbirka-knih': {
    path: '/zapojeni/sbirka-knih',
    offerType: 'books',
    label: 'Sbírka knih',
    title: 'Knihy, které otevírají další cestu',
    text: 'Sbíráme kvalitní knihy pro komunitní centrum, mentoring a další místa, kde mohou podpořit vzdělávání a osobní rozvoj.',
    introTitle: 'Kniha může být nástrojem změny i návratu k soustředění',
    intro:
      'Knihy třídíme podle tématu, stavu a skutečné potřeby. Část může sloužit v komunitním centru, při mentoringu nebo prostřednictvím partnerů tam, kde chybí přístup ke kvalitnímu čtení.',
    acceptedTitle: 'Jaké knihy hledáme',
    accepted: [
      'Beletrii v dobrém stavu pro dospělé i mladé čtenáře.',
      'Naučnou literaturu, slovníky, učebnice a knihy pro samostudium.',
      'Knihy o osobním rozvoji, financích, právu, práci a zdravém životním stylu.',
      'Aktuální odborné a řemeslné publikace využitelné při mentoringu a přípravě na práci.'
    ],
    helpsTitle: 'Kam mohou knihy směřovat',
    helps: [
      'Do knihovny komunitního centra REST||ART Integrace.',
      'K mentorům a klientům podle jejich vzdělávacích cílů.',
      'K partnerským organizacím a do míst s konkrétní poptávkou.',
      'Do nápravných zařízení pouze po dohodě s danou institucí a podle jejích pravidel.'
    ],
    note: 'Nepřijímáme plesnivé, silně poškozené ani obsahově zastaralé knihy. Větší množství vždy nejprve konzultujte.'
  }
};

function SupportSubnav({ activePath }: { activePath: string }) {
  return (
    <nav className="support-subnav" aria-label="Možnosti podpory">
      <a href="/zapojeni" className={activePath === '/zapojeni' ? 'active' : ''} aria-current={activePath === '/zapojeni' ? 'page' : undefined}>
        Přehled
      </a>
      {supportOptions.map((option) => (
        <a
          key={option.href}
          href={option.href}
          className={activePath === option.href ? 'active' : ''}
          aria-current={activePath === option.href ? 'page' : undefined}
        >
          {option.shortTitle}
        </a>
      ))}
    </nav>
  );
}

function SupportHubPage() {
  useNewsSeo({
    title: 'Zapojení a možnosti podpory',
    description:
      'Rozcestník podpory RESTART Integrace: darování oblečení, vybavení komunitního centra, sbírka knih, finanční dary a partnerství.',
    path: '/zapojeni'
  });
  return (
    <>
      <PageHeader
        label="Zapojení"
        title="Pomoc může mít více podob"
        text="Vyberte si způsob podpory, který vám dává smysl. Každá nabídka prochází domluvou, převzetím a konkrétním využitím."
      />
      <section className="content-section support-hub">
        <SupportSubnav activePath="/zapojeni" />
        <SectionIntro
          label="Rozcestník podpory"
          title="Od základních potřeb po dlouhodobý rozvoj"
          text="Materiální i finanční podpora doplňuje mentoring, pracovní reintegraci a stabilizaci. Nejdříve společně ověříme, co je právě potřeba a jak dar bezpečně převzít."
        />
        <div className="support-option-grid">
          {supportOptions.map((option) => {
            const Icon = option.icon;
            return (
              <article className="support-option-card" key={option.href}>
                <span className="support-option-icon" aria-hidden="true">
                  <Icon size={24} />
                </span>
                <p className="section-label">{option.label}</p>
                <h2>{option.title}</h2>
                <p>{option.text}</p>
                <a href={option.href}>
                  Zjistit podrobnosti <ArrowRight size={17} />
                </a>
              </article>
            );
          })}
        </div>
      </section>
      <section className="muted-section support-partners">
        <SectionIntro
          label="Další spolupráce"
          title="Zapojit se mohou lidé, firmy i instituce"
          text="Vedle darů hledáme zaměstnavatele, odborníky, dobrovolníky a veřejné partnery, kteří chtějí spoluvytvářet připravený proces návratu do společnosti."
        />
        <div className="support-grid">
          {supportPaths.map((path) => (
            <article key={path.title}>
              <h3>{path.title}</h3>
              <p>{path.text}</p>
            </article>
          ))}
        </div>
        <div className="partner-strip" aria-label="Typy partnerů">
          {partnerTypes.map((partner) => {
            const Icon = partner.icon;
            return (
              <div key={partner.title}>
                <Icon size={22} />
                <span>{partner.title}</span>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

type MaterialOfferDraft = {
  donorName: string;
  email: string;
  phone: string;
  itemDescription: string;
  quantity: string;
  locality: string;
  transport: ApiMaterialOfferTransport;
  itemCondition: string;
  note: string;
  privacyConsent: boolean;
  website: string;
};

type MaterialOfferLocalPhoto = { file: File; previewUrl: string };

async function compressMaterialOfferPhoto(file: File): Promise<File> {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    throw new Error('Fotografie musí být ve formátu JPEG, PNG nebo WebP.');
  }
  if (file.size > 12_000_000) {
    throw new Error('Zdrojová fotografie může mít nejvýše 12 MB.');
  }
  const bitmap = await createImageBitmap(file);
  const maxDimension = 1600;
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext('2d', { alpha: false });
  if (!context) {
    bitmap.close();
    throw new Error('Fotografii se nepodařilo zpracovat.');
  }
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const toBlob = (quality: number) =>
    new Promise<Blob>((resolve, reject) =>
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Fotografii se nepodařilo zmenšit.'))), 'image/webp', quality)
    );
  let blob = await toBlob(0.82);
  if (blob.size > 2_000_000) blob = await toBlob(0.66);
  if (blob.size > 2_000_000) throw new Error('Fotografii se ani po zmenšení nepodařilo dostat pod 2 MB.');
  const baseName = file.name.replace(/\.[^.]+$/, '').slice(0, 180) || 'fotografie';
  return new File([blob], `${baseName}.webp`, { type: 'image/webp', lastModified: Date.now() });
}

const emptyMaterialOfferDraft = (): MaterialOfferDraft => ({
  donorName: '',
  email: '',
  phone: '',
  itemDescription: '',
  quantity: '',
  locality: '',
  transport: 'agreement',
  itemCondition: 'good',
  note: '',
  privacyConsent: false,
  website: ''
});

function MaterialOfferForm({ config }: { config: MaterialSupportPageConfig }) {
  const [draft, setDraft] = React.useState<MaterialOfferDraft>(emptyMaterialOfferDraft);
  const [photos, setPhotos] = React.useState<MaterialOfferLocalPhoto[]>([]);
  const [submitting, setSubmitting] = React.useState(false);
  const [message, setMessage] = React.useState<{ tone: FeedbackTone; title: string; text: string } | null>(null);
  const [completedOfferId, setCompletedOfferId] = React.useState('');
  const [fileInputKey, setFileInputKey] = React.useState(0);
  const photosRef = React.useRef<MaterialOfferLocalPhoto[]>([]);
  const startedRef = React.useRef(false);
  photosRef.current = photos;

  React.useEffect(() => {
    trackAnalyticsEvent('material_offer_view', { offer_type: config.offerType });
  }, [config.offerType]);

  React.useEffect(
    () => () => photosRef.current.forEach((photo) => URL.revokeObjectURL(photo.previewUrl)),
    []
  );

  const updateDraft = <K extends keyof MaterialOfferDraft>(key: K, value: MaterialOfferDraft[K]) => {
    if (!startedRef.current) {
      startedRef.current = true;
      trackAnalyticsEvent('material_offer_start', { offer_type: config.offerType });
    }
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const addPhotos = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files || []);
    const available = Math.max(0, 4 - photos.length);
    const candidates = selected.slice(0, available);
    const accepted: MaterialOfferLocalPhoto[] = [];
    const errors: string[] = [];
    for (const file of candidates) {
      try {
        const compressed = await compressMaterialOfferPhoto(file);
        accepted.push({ file: compressed, previewUrl: URL.createObjectURL(compressed) });
      } catch (error) {
        errors.push(error instanceof Error ? error.message : 'Fotografii se nepodařilo zpracovat.');
      }
    }
    if (selected.length > available) errors.push('Lze přiložit nejvýše 4 fotografie.');
    setMessage(
      errors.length > 0
        ? { tone: 'warning', title: 'Některé fotografie nebyly přidány', text: [...new Set(errors)].join(' ') }
        : null
    );
    setPhotos((current) => [...current, ...accepted]);
    if (accepted.length > 0 && !startedRef.current) {
      startedRef.current = true;
      trackAnalyticsEvent('material_offer_start', { offer_type: config.offerType });
    }
    event.target.value = '';
  };

  const removePhoto = (index: number) => {
    setPhotos((current) => {
      const removed = current[index];
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return current.filter((_, photoIndex) => photoIndex !== index);
    });
  };

  const submitOffer = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.email.trim() && !draft.phone.trim()) {
      trackAnalyticsEvent('material_offer_validation_error', { offer_type: config.offerType, error_code: 'missing_contact' });
      setMessage({ tone: 'warning', title: 'Chybí kontakt', text: 'Doplňte alespoň e-mail nebo telefon, abychom mohli domluvit předání.' });
      return;
    }
    setSubmitting(true);
    setMessage(null);
    try {
      const uploadedPhotos = await Promise.all(
        photos.map(async ({ file }) => ({
          fileName: file.name,
          mimeType: file.type,
          fileSize: file.size,
          contentBase64: await fileToBase64(file)
        }))
      );
      const offer = await submitMaterialOffer({ ...draft, offerType: config.offerType, photos: uploadedPhotos });
      photos.forEach((photo) => URL.revokeObjectURL(photo.previewUrl));
      setPhotos([]);
      setDraft(emptyMaterialOfferDraft());
      setFileInputKey((current) => current + 1);
      setCompletedOfferId(offer.id);
      startedRef.current = false;
      trackAnalyticsEvent('material_offer_submit_success', { offer_type: config.offerType, photo_count: uploadedPhotos.length });
      setMessage({ tone: 'success', title: 'Nabídku jsme přijali', text: 'Děkujeme. Nabídku prověříme a ozveme se kvůli dalšímu postupu.' });
    } catch (error) {
      trackAnalyticsEvent('material_offer_submit_error', {
        offer_type: config.offerType,
        error_code: error instanceof ApiRequestError ? `http_${error.status}` : 'client_error'
      });
      setMessage({
        tone: 'error',
        title: 'Nabídku se nepodařilo odeslat',
        text: error instanceof Error ? error.message : 'Zkuste to prosím znovu nebo využijte kontaktní stránku.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const toolName = `offer_${config.offerType}`;
  return (
    <div className="material-offer-form-wrap" id="nabidnout-dar">
      <div className="material-offer-form-heading">
        <p className="section-label">Online nabídka</p>
        <h2>Nabídnout {config.offerType === 'clothing' ? 'oblečení' : config.offerType === 'equipment' ? 'vybavení' : 'knihy'}</h2>
        <p>Vyplnění zabere několik minut. Fotografie nám pomohou rychleji posoudit využití a dopravu.</p>
      </div>
      <form
        className="material-offer-form"
        onSubmit={submitOffer}
        {...{
          toolname: toolName,
          tooldescription: `Připraví nabídku ${materialOfferTypeLabels[config.offerType].toLowerCase()} pro REST||ART Integrace. Uživatel musí údaje zkontrolovat a formulář ručně odeslat.`
        }}
      >
        <div className="material-offer-form-grid">
          <label>
            Jméno a příjmení
            <input name="donorName" autoComplete="name" required maxLength={180} value={draft.donorName} onChange={(event) => updateDraft('donorName', event.target.value)} {...{ toolparamdescription: 'Jméno osoby, která věci nabízí.' }} />
          </label>
          <label>
            Lokalita
            <input name="locality" autoComplete="address-level2" required maxLength={180} placeholder="Obec nebo město" value={draft.locality} onChange={(event) => updateDraft('locality', event.target.value)} {...{ toolparamdescription: 'Město nebo obec, kde se nabídka nachází.' }} />
          </label>
          <label>
            E-mail
            <input name="email" type="email" autoComplete="email" maxLength={190} value={draft.email} onChange={(event) => updateDraft('email', event.target.value)} {...{ toolparamdescription: 'Kontaktní e-mail dárce; povinný je e-mail nebo telefon.' }} />
          </label>
          <label>
            Telefon
            <input name="phone" type="tel" autoComplete="tel" maxLength={50} value={draft.phone} onChange={(event) => updateDraft('phone', event.target.value)} {...{ toolparamdescription: 'Kontaktní telefon dárce; povinný je telefon nebo e-mail.' }} />
          </label>
          <label className="material-offer-wide">
            Co nabízíte
            <textarea name="itemDescription" rows={4} required maxLength={5000} placeholder="Druh, velikosti, rozměry, témata knih nebo další důležité podrobnosti" value={draft.itemDescription} onChange={(event) => updateDraft('itemDescription', event.target.value)} {...{ toolparamdescription: 'Přesný popis nabízených věcí.' }} />
          </label>
          <label>
            Množství
            <input name="quantity" required maxLength={120} placeholder="Např. 3 krabice / 12 kusů" value={draft.quantity} onChange={(event) => updateDraft('quantity', event.target.value)} {...{ toolparamdescription: 'Přibližný počet kusů, krabic nebo objem nabídky.' }} />
          </label>
          <label>
            Stav věcí
            <select name="itemCondition" required value={draft.itemCondition} onChange={(event) => updateDraft('itemCondition', event.target.value)} {...{ toolparamdescription: 'Aktuální fyzický stav nabízených věcí.' }}>
              <option value="new">Nové / nepoužité</option>
              <option value="excellent">Velmi dobrý stav</option>
              <option value="good">Dobrý, běžně použitelný stav</option>
              <option value="usable">Použitelné s drobným opotřebením</option>
              <option value="repair">Vyžaduje opravu nebo kompletaci</option>
            </select>
          </label>
          <label className="material-offer-wide">
            Doprava
            <select name="transport" required value={draft.transport} onChange={(event) => updateDraft('transport', event.target.value as ApiMaterialOfferTransport)} {...{ toolparamdescription: 'Možnost dopravy nebo potřeba vyzvednutí nabídky.' }}>
              <option value="agreement">Dopravu potřebujeme domluvit</option>
              <option value="donor-delivery">Mohu věci přivézt</option>
              <option value="project-pickup">Potřebuji vyzvednutí projektem</option>
            </select>
          </label>
          <label className="material-offer-wide">
            Poznámka
            <textarea name="note" rows={3} maxLength={5000} placeholder="Časové možnosti, přístup k místu, rozměry nebo jiné okolnosti" value={draft.note} onChange={(event) => updateDraft('note', event.target.value)} {...{ toolparamdescription: 'Volitelné doplňující informace k předání.' }} />
          </label>
          <label className="material-offer-honeypot" aria-hidden="true">
            Web
            <input name="website" tabIndex={-1} autoComplete="off" value={draft.website} onChange={(event) => updateDraft('website', event.target.value)} />
          </label>
        </div>

        <fieldset className="material-offer-photos">
          <legend>Fotografie nabídky <span>volitelné, nejvýše 4</span></legend>
          <label className="material-photo-picker">
            <ImagePlus size={22} aria-hidden="true" />
            <span>Přidat fotografie</span>
            <small>JPEG, PNG nebo WebP do 12 MB, automaticky zmenšíme</small>
            <input key={fileInputKey} name="photos" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={addPhotos} {...{ toolparamdescription: 'Volitelné fotografie nabízených věcí.' }} />
          </label>
          {photos.length > 0 && (
            <div className="material-photo-preview-grid" aria-label="Vybrané fotografie">
              {photos.map((photo, index) => (
                <figure key={`${photo.file.name}-${photo.previewUrl}`}>
                  <img src={photo.previewUrl} alt={`Náhled fotografie ${index + 1}: ${photo.file.name}`} />
                  <figcaption>{photo.file.name}</figcaption>
                  <button type="button" onClick={() => removePhoto(index)} aria-label={`Odebrat fotografii ${photo.file.name}`} title="Odebrat fotografii"><Trash2 size={16} /></button>
                </figure>
              ))}
            </div>
          )}
        </fieldset>

        <label className="checkbox-field material-offer-consent">
          <input name="privacyConsent" type="checkbox" required checked={draft.privacyConsent} onChange={(event) => updateDraft('privacyConsent', event.target.checked)} {...{ toolparamdescription: 'Souhlas se zpracováním kontaktních údajů kvůli vyřízení nabídky.' }} />
          <span>Souhlasím se zpracováním kontaktních údajů za účelem posouzení a vyřízení nabídky. <a href="/zasady-ochrany-osobnich-udaju">Zásady ochrany osobních údajů</a>.</span>
        </label>

        {message && <Feedback variant={message.tone} title={message.title} description={`${message.text}${completedOfferId ? ` Číslo nabídky: ${completedOfferId}.` : ''}`} />}
        <div className="material-offer-submit-row">
          <button className="button primary" type="submit" disabled={submitting}>
            {submitting ? 'Odesílám nabídku...' : 'Odeslat nabídku'} <ArrowRight size={17} />
          </button>
          <span>Údaje a fotografie nejsou veřejně publikovány.</span>
        </div>
      </form>
    </div>
  );
}

function MaterialSupportPage({ config }: { config: MaterialSupportPageConfig }) {
  const faqItems = React.useMemo(
    () => [
      {
        question: `Jak poznám, zda je nabídka ${materialOfferTypeLabels[config.offerType].toLowerCase()} vhodná?`,
        answer: `Nabídku stručně popište a přiložte fotografie. Před převzetím ověříme aktuální potřebu, stav věcí, kapacitu a konkrétní využití.`
      },
      {
        question: 'Musím věci přivézt osobně?',
        answer: 'Nemusíte. Ve formuláři vyberte vlastní dopravu, vyzvednutí projektem nebo domluvu. Konkrétní možnost potvrdíme podle lokality a kapacity.'
      },
      {
        question: 'Dostanu potvrzení o přijetí nabídky?',
        answer: 'Pokud uvedete e-mail a e-mailová brána je dostupná, přijde potvrzení s číslem nabídky. Další postup s vámi domluvíme podle výsledku posouzení.'
      },
      {
        question: 'Jsou moje údaje a fotografie veřejné?',
        answer: 'Ne. Kontaktní údaje a fotografie slouží pouze k posouzení a vyřízení nabídky a nejsou veřejně publikovány.'
      }
    ],
    [config.offerType]
  );
  useNewsSeo({
    title: config.title,
    description: config.text,
    path: config.path
  });
  React.useEffect(() => {
    const id = `material-offer-faq-${config.offerType}`;
    document.getElementById(id)?.remove();
    const script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer }
      }))
    });
    document.head.appendChild(script);
    return () => script.remove();
  }, [config.offerType, faqItems]);
  return (
    <>
      <PageHeader label={config.label} title={config.title} text={config.text} />
      <section className="content-section support-detail-page">
        <SupportSubnav activePath={config.path} />
        <div className="support-detail-intro">
          <p className="section-label">Smysl podpory</p>
          <h2>{config.introTitle}</h2>
          <p>{config.intro}</p>
        </div>
        <div className="support-detail-grid">
          <article>
            <h2>{config.acceptedTitle}</h2>
            <ul>
              {config.accepted.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article>
            <h2>{config.helpsTitle}</h2>
            <ul>
              {config.helps.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>
      <section className="muted-section support-process-section">
        <SectionIntro
          label="Jak postupovat"
          title="Domluva před předáním chrání dárce i příjemce"
          text={config.note}
        />
        <ol className="support-process">
          {[
            ['1', 'Napište nám', 'Stručně popište, co nabízíte, množství, stav a místo předání.'],
            ['2', 'Ověříme potřebu', 'Prověříme aktuální využití, kapacitu skladu a vhodný termín.'],
            ['3', 'Domluvíme předání', 'Potvrdíme způsob dopravy, kontaktní osobu a místo převzetí.'],
            ['4', 'Dar využijeme', 'Věc zařadíme tam, kde má konkrétní a smysluplné využití.']
          ].map(([number, title, text]) => (
            <li key={number}>
              <strong>{number}</strong>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </li>
          ))}
        </ol>
        <MaterialOfferForm config={config} />
      </section>
      <section className="content-section material-offer-faq" aria-labelledby={`faq-${config.offerType}`}>
        <SectionIntro
          label="Časté otázky"
          title="Co je dobré vědět před odesláním"
          text="Krátké odpovědi k převzetí, dopravě, potvrzení a ochraně údajů."
        />
        <div className="material-offer-faq-list">
          {faqItems.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}

function MonetaryDonationPage() {
  useNewsSeo({
    title: 'Darovat a podpořit RESTART Integrace',
    description:
      'Podpořte RESTART Integrace přes bezpečný donate systém nebo přímý převod. Dary financují mentoring, pracovní restart a stabilizaci.',
    path: '/darovat'
  });
  return (
    <>
      <PageHeader
        label="Finanční podpora"
        title="Proměňte podporu v konkrétní krok"
        text="Jednorázový nebo pravidelný dar pomáhá financovat mentoring, dopravu, materiály, pracovní restart a stabilizaci."
      />
      <section className="content-section support-donate-nav">
        <SupportSubnav activePath="/darovat" />
      </section>
      <section className="donate-section" id="darovat">
        <div className="donate-copy">
          <p className="section-label">DONATE</p>
          <h2>Podpořte nás</h2>
          <p>
            Každý dar pomáhá měnit druhou šanci v konkrétní kroky: mentoring, práci, stabilizaci, materiály a návrat
            lidí zpět do života.
          </p>
          <div className="donate-actions">
            <a className="button primary" href="https://donate.stripe.com/8x23cv0HAdIg8dibnF3ks03?locale=cs&prefilled_email=kozakdavid%40dk-i.cz" target="_blank" rel="noreferrer">
              <Heart size={18} /> Darovat přes Stripe
            </a>
            <a className="button secondary" href="/kontakt">
              Chci být partner
            </a>
          </div>
        </div>
        <div className="donate-card">
          <p className="section-label">Transparentní podpora</p>
          <h3>Dary jdou do konkrétních kroků, ne do prázdných slibů.</h3>
          <p>Stripe odkaz vede přímo na bezpečnou platební stránku. Pokud preferujete přímý převod, použijte níže uvedený účet.</p>
          <dl>
            <div>
              <dt>IBAN</dt>
              <dd>LT45 3250 0078 0969 2068</dd>
            </div>
            <div>
              <dt>BIC / SWIFT</dt>
              <dd>REVOLT21</dd>
            </div>
            <div>
              <dt>Korespondent BIC</dt>
              <dd>BARCGB22</dd>
            </div>
            <div>
              <dt>Banka</dt>
              <dd>Revolut Bank UAB, Konstitucijos ave. 21B, 08130 Vilnius, Lithuania</dd>
            </div>
          </dl>
        </div>
        <div className="donate-amounts">
          {[
            { amount: '500 Kč', title: 'Startovací pomoc', text: 'Materiály, první konzultace, doprava nebo praktická drobnost pro první krok.' },
            { amount: '1 500 Kč', title: 'Mentoring a stabilizace', text: 'Čas s mentorem, příprava na práci, doprovod při úřadech a návrat do režimu.' },
            { amount: '5 000 Kč+', title: 'Programový rozvoj', text: 'Podpora workshopů, pracovního vybavení a dlouhodobého dopadu programů.' }
          ].map((item) => (
            <article key={item.amount}>
              <strong>{item.amount}</strong>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
        <div className="donate-challenges">
          <p className="section-label">Aktuální výzvy</p>
          <h3>Vyberte si, kde chcete být vidět.</h3>
          <ol>
            <li>Pomozte pokrýt první praktické kroky po návratu z vězení nebo krize.</li>
            <li>Podpořte mentoring, pracovní restart a stabilizaci lidí, kteří chtějí začít znovu.</li>
            <li>Staňte se partnerem výzvy druhé šance a pomozte nám z programu udělat opakovatelný systém.</li>
          </ol>
          <p className="donate-motto">Na nikoho se nezapomíná. Každý si zaslouží druhou šanci.</p>
        </div>
      </section>
    </>
  );
}

function StaticInfoPage({ page }: { page: (typeof staticPages)[string] }) {
  return (
    <section className="content-section static-info-page">
      <div className="static-info-head">
        <p className="section-label">{page.label}</p>
        <h1>{page.title}</h1>
        <p>{page.lead}</p>
      </div>
      <div className="static-info-grid">
        {page.sections.map((section) => (
          <article key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

type SiteSearchEntry = {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  href: string;
  searchableText: string;
};

const normalizeSearchValue = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('cs-CZ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const coreSearchEntries: SiteSearchEntry[] = [
  {
    id: 'home',
    category: 'Web',
    title: 'REST||ART Integrace',
    excerpt: 'Vznikající systém pracovní a sociální reintegrace, druhé šance, práce, odpovědnosti a stabilizace.',
    href: '/',
    searchableText: 'domů homepage zkušenost poznání metodika projekt práce odpovědnost důvěra komunita druhá šance'
  },
  {
    id: 'work',
    category: 'O projektu',
    title: 'Co děláme',
    excerpt: 'Mentoring, práce, bydlení, stabilizace a bezpečný návrat do běžného života.',
    href: '/co-delame',
    searchableText: JSON.stringify({ focusAreas, principles, solutionPrinciples, realityCards, impactMetrics })
  },
  {
    id: 'programs',
    category: 'Programy',
    title: 'Programy REST||ART Integrace',
    excerpt: 'JAILBREAK, RESET, REWORK, STREETWISE, BOD ZLOMU a STABILIZACE.',
    href: '/programy',
    searchableText: JSON.stringify(programs)
  },
  {
    id: 'methodology',
    category: 'Metodika',
    title: 'Metodika REST||ART Integrace',
    excerpt: 'Životní cyklus klienta, programové pilíře, Manifest, Charta, Slovník pojmů a koncepční podklady.',
    href: '/metodika',
    searchableText: JSON.stringify({
      methodologyLifecycleSteps,
      methodologyPillars,
      methodologyPrinciples,
      methodologyVisuals,
      methodologyDocuments
    })
  },
  {
    id: 'news',
    category: 'Aktuality',
    title: 'Aktuality',
    excerpt: 'Zprávy z projektu, terénu a příprav jednotlivých programů.',
    href: '/aktuality',
    searchableText: 'aktuality novinky zprávy projekt terén'
  },
  {
    id: 'stories',
    category: 'Příběhy',
    title: 'Příběhy druhé šance',
    excerpt: 'Skutečné zkušenosti, návrat do společnosti a změna postavená na odpovědnosti.',
    href: '/pribehy-druhe-sance',
    searchableText: 'příběhy druhá šance zkušenost návrat společnost'
  },
  {
    id: 'support',
    category: 'Zapojení',
    title: 'Zapojení a partnerství',
    excerpt: 'Možnosti spolupráce pro zaměstnavatele, obce, instituce, odborníky, dobrovolníky a podporovatele.',
    href: '/zapojeni',
    searchableText: JSON.stringify({ partnerTypes, supportPaths })
  },
  {
    id: 'donate',
    category: 'Podpora',
    title: 'Finančně podpořit projekt',
    excerpt: 'Jednorázová nebo pravidelná finanční podpora mentoringu, dopravy, pracovních kroků a zázemí projektu.',
    href: '/darovat',
    searchableText: 'dar darovat donate podpora příspěvek finance transparentní účet platební karta Stripe partner'
  },
  {
    id: 'donate-clothes',
    category: 'Materiální pomoc',
    title: 'Darovat oblečení',
    excerpt: 'Oblečení a základní potřeby pro lidi bez prostředků, klienty STREETWISE a osoby po propuštění z vězení.',
    href: '/zapojeni/darovat-obleceni',
    searchableText:
      'darovat oblečení oděvy boty pracovní oděv hygiena základní potřeby STREETWISE bez domova po propuštění vězení materiální pomoc'
  },
  {
    id: 'donate-equipment',
    category: 'Materiální pomoc',
    title: 'Vybavení komunitního centra a kanceláří',
    excerpt: 'Nábytek, kancelářské vybavení, technika, nářadí a další funkční vybavení pro zázemí projektu.',
    href: '/zapojeni/vybaveni-centra',
    searchableText:
      'darovat nábytek vybavení komunitní centrum kancelář stoly židle skříně počítače tiskárny technika nářadí materiál'
  },
  {
    id: 'book-collection',
    category: 'Sbírka',
    title: 'Sbírka knih',
    excerpt: 'Knihy pro komunitní centrum, mentoring, vzdělávání a další místa, kde jsou skutečně potřeba.',
    href: '/zapojeni/sbirka-knih',
    searchableText:
      'darovat knihy sbírka knih komunitní knihovna mentoring vzdělávání učebnice beletrie nápravná zařízení věznice'
  },
  {
    id: 'contact',
    category: 'Kontakt',
    title: 'Kontakt',
    excerpt: 'Telefon, e-mail, adresa a kontaktní formulář REST||ART Integrace.',
    href: '/kontakt',
    searchableText: JSON.stringify(contacts)
  }
];

const buildSiteSearchEntries = (news: NewsItem[]) => {
  const staticEntries = Object.entries(staticPages).map(([href, page]) => ({
    id: `static-${href}`,
    category: page.label,
    title: page.title,
    excerpt: page.lead,
    href,
    searchableText: `${page.lead} ${page.sections.map((section) => `${section.title} ${section.text}`).join(' ')}`
  }));
  const programEntries = programs.map((program) => ({
    id: `program-${programSlug(program.title)}`,
    category: 'Program',
    title: program.title,
    excerpt: program.goal,
    href: `/programy/${programSlug(program.title)}`,
    searchableText: JSON.stringify(program)
  }));
  const newsEntries = news.map((item) => ({
    id: `news-${item.id}`,
    category: isSecondChanceStory(item) ? 'Příběh druhé šance' : 'Aktualita',
    title: item.title,
    excerpt: item.excerpt,
    href: newsPath(item),
    searchableText: `${item.tag ?? ''} ${item.excerpt} ${item.body ?? ''}`
  }));
  const methodologyEntries = methodologyDownloads.map((download) => ({
    id: `methodology-${download.fileName}`,
    category: 'Dokument',
    title: download.title,
    excerpt: download.description,
    href: '/metodika',
    searchableText: `${download.fileName} ${download.mimeType}`
  }));
  const methodologyDocumentEntries = methodologyDocuments.map((document) => ({
    id: `methodology-document-${document.id}`,
    category: 'Veřejná metodika',
    title: document.title,
    excerpt: document.lead,
    href: document.path,
    searchableText: [
      document.description,
      document.version,
      document.status,
      document.keywords.join(' '),
      ...document.sections.flatMap((section) => [
        section.title,
        ...section.blocks.flatMap((block) => {
          if ('text' in block) return [block.text];
          if (block.type === 'list') return block.items;
          return block.items.flatMap((item) => [item.term, item.definition]);
        })
      ])
    ].join(' ')
  }));
  const videoEntries = videoWatchPages.map((video) => ({
    id: `video-${video.id}`,
    category: 'Video',
    title: video.title,
    excerpt: video.description,
    href: video.path,
    searchableText: `${video.caption} ${video.shortTitle} oficiální video animace projektu druhá šance`
  }));
  const mediaEntries = publicMediaKitAssets.map((asset) => ({
    id: `media-${asset.id}`,
    category: 'Média ke stažení',
    title: asset.title,
    excerpt: asset.description,
    href: '/media',
    searchableText: `${asset.fileName} ${asset.mimeType} ${asset.kind}`
  }));
  const unique = new Map<string, SiteSearchEntry>();
  [...coreSearchEntries, ...staticEntries, ...programEntries, ...newsEntries, ...methodologyEntries, ...methodologyDocumentEntries, ...videoEntries, ...mediaEntries].forEach((entry) => {
    const key = `${entry.href}|${entry.title}`;
    if (!unique.has(key)) unique.set(key, entry);
  });
  return Array.from(unique.values());
};

function SearchPage({ news }: { news: NewsItem[] }) {
  const initialQuery = new URLSearchParams(window.location.search).get('q')?.trim() ?? '';
  const [query, setQuery] = React.useState(initialQuery);
  const [activeQuery, setActiveQuery] = React.useState(initialQuery);
  const entries = React.useMemo(() => buildSiteSearchEntries(news), [news]);
  const normalizedQuery = normalizeSearchValue(activeQuery);
  const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);
  const results = React.useMemo(() => {
    if (!queryTokens.length) return [];
    return entries
      .map((entry) => {
        const title = normalizeSearchValue(entry.title);
        const excerpt = normalizeSearchValue(entry.excerpt);
        const body = normalizeSearchValue(`${entry.category} ${entry.searchableText}`);
        const score = queryTokens.reduce((total, token) => {
          if (title === token) return total + 24;
          if (title.startsWith(token)) return total + 16;
          if (title.includes(token)) return total + 11;
          if (excerpt.includes(token)) return total + 6;
          if (body.includes(token)) return total + 3;
          return total;
        }, 0);
        return { entry, score };
      })
      .filter((result) => result.score > 0)
      .sort((left, right) => right.score - left.score || left.entry.title.localeCompare(right.entry.title, 'cs'));
  }, [entries, normalizedQuery]);
  const resultCountLabel = results.length === 1 ? 'výsledek' : results.length >= 2 && results.length <= 4 ? 'výsledky' : 'výsledků';

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const nextQuery = query.trim();
    setActiveQuery(nextQuery);
    window.history.replaceState(null, '', nextQuery ? `/vyhledavani?q=${encodeURIComponent(nextQuery)}` : '/vyhledavani');
  };

  return (
    <section className="search-results-page">
      <div className="section-heading search-results-heading">
        <div>
          <p className="section-label">Celý web</p>
          <h1>Výsledky vyhledávání</h1>
          <p>Prohledáváme veřejné stránky, programy, aktuality, metodiku, dokumenty, média i možnosti podpory.</p>
        </div>
        <form
          className="search-results-form"
          role="search"
          onSubmit={submit}
          {...{
            toolname: 'search_site_results',
            tooldescription: 'Vyhledá a zobrazí veřejné výsledky napříč celým webem REST||ART Integrace.'
          }}
        >
          <Search size={20} aria-hidden="true" />
          <input
            name="query"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Co hledáte?"
            aria-label="Hledat na celém webu"
            maxLength={160}
            required
            autoFocus
            {...{ toolparamdescription: 'Hledaný výraz nebo téma v češtině.' }}
          />
          <button className="button primary" type="submit">Vyhledat</button>
        </form>
      </div>
      <div className="search-results-summary" aria-live="polite">
        {activeQuery ? <strong>{results.length} {resultCountLabel} pro „{activeQuery}“</strong> : <strong>Zadejte hledaný výraz.</strong>}
      </div>
      <div className="search-results-list">
        {activeQuery && results.length === 0 && (
          <div className="empty-note">Nic jsme nenašli. Zkuste kratší výraz, název programu nebo téma jako práce, bydlení, metodika či darování.</div>
        )}
        {results.map(({ entry }) => (
          <a className="search-result-item" href={entry.href} key={entry.id}>
            <span>{entry.category}</span>
            <h2>{entry.title}</h2>
            <p>{entry.excerpt}</p>
            <strong>Otevřít <ArrowRight size={17} /></strong>
          </a>
        ))}
      </div>
    </section>
  );
}

function MediaKitPage({ page, assets }: { page: (typeof staticPages)[string]; assets: PublicMediaAsset[] }) {
  return (
    <section className="content-section static-info-page">
      <div className="static-info-head">
        <p className="section-label">{page.label}</p>
        <h1>{page.title}</h1>
        <p>{page.lead}</p>
      </div>
      <div className="static-info-grid">
        {page.sections.map((section) => (
          <article key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.text}</p>
          </article>
        ))}
      </div>
      <div className="media-kit-grid">
        {assets.map((asset) => {
          const publicUrl = resolvePublicFileUrl(asset.fileUrl);
          return (
            <article className="media-kit-card" key={asset.id}>
              <div className={`media-kit-preview ${asset.kind === 'logo' ? 'is-logo' : ''}`}>
                {asset.kind === 'pdf' ? <FileText size={54} /> : <img src={publicUrl} alt={asset.title} />}
              </div>
              <div className="media-kit-body">
                <div>
                  <p className="section-label">{asset.kind === 'pdf' ? 'PDF' : asset.kind === 'logo' ? 'Znak' : 'Fotografie'}</p>
                  <h2>{asset.title}</h2>
                  <p>{asset.description}</p>
                  <small>{asset.fileName} · {readableBytes(asset.fileSize)} · {asset.mimeType}</small>
                </div>
                <a className="button secondary" href={publicUrl} target="_blank" rel="noreferrer" download={asset.fileName}>
                  <Download size={18} /> {asset.kind === 'pdf' ? 'Otevřít plakát' : 'Stáhnout obrázek'}
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function useMethodologyDocumentSeo(document: MethodologyDocument) {
  React.useEffect(() => {
    const title = `${document.title} | RESTART Integrace`;
    const canonicalUrl = `${window.location.origin}${document.path}`;
    const previousTitle = window.document.title;
    window.document.title = title;

    const description = window.document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const previousDescription = description?.content;
    if (description) description.content = document.description;

    const canonical = window.document.querySelector<HTMLLinkElement>('link[rel="canonical"]') ?? window.document.createElement('link');
    const canonicalCreated = !canonical.parentNode;
    const previousCanonical = canonical.href;
    if (canonicalCreated) {
      canonical.rel = 'canonical';
      window.document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    const schema = window.document.createElement('script');
    schema.id = 'methodology-document-structured-data';
    schema.type = 'application/ld+json';
    const definitions = document.sections.flatMap((section) =>
      section.blocks.flatMap((block) => (block.type === 'definitions' ? block.items : []))
    );
    schema.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      '@id': `${canonicalUrl}#article`,
      headline: document.title,
      description: document.description,
      datePublished: document.published,
      dateModified: document.published,
      inLanguage: 'cs-CZ',
      articleSection: 'Metodika a veřejná dokumentace',
      keywords: document.keywords,
      author: { '@type': 'Organization', name: 'RESTART Integrace', url: `${window.location.origin}/` },
      publisher: { '@type': 'Organization', name: 'RESTART Integrace', url: `${window.location.origin}/` },
      mainEntityOfPage: canonicalUrl,
      isBasedOn: `${window.location.origin}${document.downloadDocx}`,
      ...(definitions.length
        ? {
            mainEntity: {
              '@type': 'DefinedTermSet',
              name: document.title,
              hasDefinedTerm: definitions.map((item) => ({
                '@type': 'DefinedTerm',
                name: item.term,
                description: item.definition,
                url: `${canonicalUrl}#${slugifyPathSegment(item.term)}`
              }))
            }
          }
        : {})
    });
    window.document.head.appendChild(schema);

    return () => {
      window.document.title = previousTitle;
      if (description && previousDescription !== undefined) description.content = previousDescription;
      if (canonicalCreated) canonical.remove();
      else canonical.href = previousCanonical;
      schema.remove();
    };
  }, [document]);
}

function MethodologyDocumentBlockView({ block }: { block: MethodologyDocumentBlock }) {
  if (block.type === 'paragraph') return <p>{block.text}</p>;
  if (block.type === 'heading') return <h3>{block.text}</h3>;
  if (block.type === 'quote') return <blockquote>{block.text}</blockquote>;
  if (block.type === 'list') {
    return (
      <ul>
        {block.items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    );
  }
  return (
    <dl className="methodology-definition-list">
      {block.items.map((item) => (
        <div id={slugifyPathSegment(item.term)} key={item.term}>
          <dt>{item.term}</dt>
          <dd>{item.definition}</dd>
        </div>
      ))}
    </dl>
  );
}

function MethodologyDocumentPage({ document }: { document: MethodologyDocument }) {
  useMethodologyDocumentSeo(document);
  const relatedDocuments = methodologyDocuments.filter((item) => item.id !== document.id);

  return (
    <section className="content-section methodology-document-page">
      <header className="methodology-document-header">
        <div>
          <p className="section-label">{document.eyebrow}</p>
          <h1>{document.title}</h1>
          <p className="methodology-document-lead">{document.lead}</p>
        </div>
        <div className="methodology-document-meta" aria-label="Informace o dokumentu">
          <span><strong>Verze</strong>{document.version}</span>
          <span><strong>Stav</strong>{document.status}</span>
          <span><strong>Zveřejněno</strong><time dateTime={document.published}>{new Date(document.published).toLocaleDateString('cs-CZ')}</time></span>
        </div>
        <div className="methodology-actions">
          <a className="button primary" href={document.downloadDocx} download={document.sourceFileName}>
            <Download size={18} /> Stáhnout originál DOCX
          </a>
          <a className="button secondary" href="/metodika">
            <ChevronLeft size={18} /> Zpět na metodiku
          </a>
        </div>
      </header>

      <div className="methodology-document-layout">
        <aside className="methodology-document-toc" aria-label="Obsah dokumentu">
          <p className="section-label">Na této stránce</p>
          <nav>
            {document.sections.map((section) => <a key={section.id} href={`#${section.id}`}>{section.title}</a>)}
          </nav>
          <small>Zdroj: {document.sourceFileName}</small>
        </aside>

        <article className="methodology-document-content">
          {document.sections.map((section) => (
            <section id={section.id} key={section.id}>
              <h2>{section.title}</h2>
              {section.blocks.map((block, index) => <MethodologyDocumentBlockView block={block} key={`${section.id}-${index}`} />)}
            </section>
          ))}
        </article>
      </div>

      <nav className="methodology-related-documents" aria-label="Související veřejné dokumenty">
        <div>
          <p className="section-label">Veřejná dokumentace</p>
          <h2>Pokračujte v metodickém rámci</h2>
        </div>
        <div>
          {relatedDocuments.map((item) => (
            <a href={item.path} key={item.id}>
              <span>{item.shortTitle}</span>
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          ))}
        </div>
      </nav>
    </section>
  );
}

function MethodologyPage({ account }: { account: AuthAccount | null }) {
  const isAdmin = account?.role === 'admin';

  return (
    <section className="content-section methodology-page">
      <div className="methodology-hero">
        <div className="methodology-hero-copy">
          <p className="section-label">Metodika pro veřejnost</p>
          <h1>REST||ART jako opakovatelný standard, ne jednorázový projekt</h1>
          <p>
            Metodika propojuje zkušenost, práci s klientem, zaměstnavatele, instituce a měřitelná data. Vychází z principu,
            že člověk není definovaný trestem, ale odpovědným krokem, který udělá zítra.
          </p>
          <div className="methodology-actions">
            <a className="button primary" href="/documents/methodology/metodika-restart-integrace.pdf" target="_blank" rel="noreferrer" download>
              <Download size={18} /> Stáhnout metodiku PDF
            </a>
            <a className="button secondary" href="#metodika-cyklus">
              <ClipboardList size={18} /> Jak funguje cyklus
            </a>
          </div>
        </div>
        <div className="methodology-public-card">
          <FileText size={34} />
          <div>
            <p className="section-label">Veřejný dokument</p>
            <h2>Metodika ke stažení ve formátu PDF</h2>
            <p>
              PDF verze je určená pro partnery, veřejnost a základní orientaci v přístupu REST||ART Integrace. Pracovní
              DOCX, brand video, vizuály a technické standardy zůstávají dostupné pouze administrátorovi.
            </p>
          </div>
          <a className="button secondary" href="/documents/methodology/metodika-restart-integrace.pdf" target="_blank" rel="noreferrer">
            <Download size={18} /> Otevřít PDF
          </a>
        </div>
      </div>

      <div className="methodology-principle-grid" aria-label="Metodické principy REST ART Integrace">
        {methodologyPrinciples.map((principle) => {
          const Icon = principle.icon;
          return (
            <article key={principle.title}>
              <Icon size={24} />
              <h2>{principle.title}</h2>
              <p>{principle.text}</p>
            </article>
          );
        })}
      </div>

      <div className="methodology-split" id="metodika-cyklus">
        <article className="methodology-flow-card">
          <p className="section-label">Životní cyklus klienta</p>
          <h2>Od prvního kontaktu k samostatnosti</h2>
          <p>
            Základem není pouze zaměstnání. Základem je řízená změna: rozhodnutí, plán, intervence, průběžné hodnocení,
            stabilizace a návrat do podpory, pokud se objeví relaps, ztráta bydlení, práce nebo nová krize.
          </p>
          <ol className="methodology-flow-list">
            {methodologyLifecycleSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </article>

        <article className="methodology-standard-card">
          <p className="section-label">ONLY TRUE</p>
          <h2>Každé tvrzení má mít oporu</h2>
          <p>
            Veřejné výstupy rozlišují doložené číslo, odborný zdroj, zkušenost a pracovní hypotézu. RESTART proto nechce
            stavět důvěru na dojmu, ale na čitelném procesu, konkrétních datech a otevřeném vyhodnocování.
          </p>
          <ul>
            <li>Data jsou uvedená s jasným zdrojem.</li>
            <li>Zkušenost je označená jako zkušenost, ne jako statistika.</li>
            <li>Pracovní hypotéza je zveřejněná pouze jako pracovní hypotéza.</li>
            <li>Výsledky mají být měřitelné, ověřitelné a průběžně revidované.</li>
          </ul>
        </article>
      </div>

      <div className="methodology-program-section">
        <div>
          <p className="section-label">Programová architektura</p>
          <h2>Šest pilířů, jeden směr</h2>
          <p>
            Jednotlivé programy nejsou izolované značky. Tvoří modulární rámec, který lze skládat podle rizik, potřeb,
            motivace a reálné životní situace klienta.
          </p>
        </div>
        <div className="methodology-pillar-grid">
          {methodologyPillars.map((pillar) => (
            <article key={pillar.title}>
              <h3>{pillar.title}</h3>
              <p>{pillar.text}</p>
            </article>
          ))}
        </div>
      </div>

      <section className="methodology-system-model" aria-labelledby="methodology-system-model-title">
        <div className="methodology-system-head">
          <div>
            <p className="section-label">Vizuální model systému</p>
            <h2 id="methodology-system-model-title">Jak se zkušenost mění v měřitelný systém spolupráce</h2>
          </div>
          <p>
            REST||ART Integrace propojuje práci s konkrétním člověkem a síť partnerů. Metodika určuje postup,
            dokumentace drží odpovědnost a měření ukazuje, co skutečně funguje.
          </p>
        </div>
        <figure className="methodology-system-figure">
          <a href="/images/methodology/vizualni-model-rest-art-integrace.webp" target="_blank" rel="noreferrer">
            <img
              src="/images/methodology/vizualni-model-rest-art-integrace.webp"
              alt="Diagram systému REST ART Integrace: cílové skupiny postupují přes programy, metodiku, dokumentaci a měření; zaměstnavatelé, obce, instituce, dobrovolníci, komunita a partneři tvoří spolupracující síť. Společným výsledkem je stabilní člověk."
              width={1168}
              height={576}
              loading="lazy"
            />
          </a>
          <figcaption>Vizuální mapa metodického toku, spolupracující sítě a společného výsledku.</figcaption>
        </figure>
        <div className="methodology-system-legend">
          <article>
            <h3>Metodický tok</h3>
            <p>Cílové skupiny → programy → metodika → dokumentace → měření → výstupy.</p>
          </article>
          <article>
            <h3>Síť spolupráce</h3>
            <p>Zaměstnavatelé, obce, instituce, dobrovolníci, komunita a odborní partneři přinášejí konkrétní návaznost.</p>
          </article>
          <article>
            <h3>Společný výsledek</h3>
            <p>Stabilní člověk, který dokáže převzít odpovědnost, pracovat na sobě a udržet změnu v běžném životě.</p>
          </article>
        </div>
      </section>

      <section className="methodology-document-library" aria-labelledby="verejna-dokumentace-title">
        <div className="methodology-document-library-head">
          <div>
            <p className="section-label">Veřejná dokumentace</p>
            <h2 id="verejna-dokumentace-title">Hodnoty, pravidla a společný slovník</h2>
          </div>
          <p>Každý dokument má vlastní veřejnou stránku, stabilní adresu a originální soubor ke stažení.</p>
        </div>
        <div className="methodology-document-library-grid">
          {methodologyDocuments.map((document) => (
            <article key={document.id}>
              <div>
                <p className="section-label">{document.version}</p>
                <h3>{document.shortTitle}</h3>
                <p>{document.lead}</p>
              </div>
              <div className="methodology-document-actions">
                <a className="button secondary" href={document.path}>
                  Číst online <ArrowRight size={18} />
                </a>
                <a
                  className="methodology-download-link"
                  href={document.downloadDocx}
                  target="_blank"
                  rel="noreferrer"
                  download={document.sourceFileName}
                >
                  <Download size={16} /> Stáhnout DOCX
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="methodology-downloads" aria-label="Veřejná metodika ke stažení">
        {methodologyDownloads.map((download) => (
          <article key={download.fileUrl}>
            <FileText size={28} />
            <div>
              <p className="section-label">{download.mimeType}</p>
              <h2>{download.title}</h2>
              <p>{download.description}</p>
              <small>{download.fileName} · {readableBytes(download.fileSize)}</small>
            </div>
            <a className="button secondary" href={download.fileUrl} target="_blank" rel="noreferrer" download={download.fileName}>
              <Download size={18} /> Otevřít
            </a>
          </article>
        ))}
      </div>

      {isAdmin && (
        <div className="methodology-admin-section" aria-label="Administrátorské standardy pro tvorbu dokumentů">
          <div className="methodology-admin-head">
            <p className="section-label">Viditelné pouze administrátorovi</p>
            <h2>Standardy pro tvorbu dokumentů</h2>
            <p>
              Tato část je pracovní knihovna pro správu metodiky, formulářů, PDF standardů, brand assetů a vizuálních
              podkladů. Veřejnosti se nevykresluje a v prerenderu není součástí indexovaného obsahu.
            </p>
          </div>

          <div className="methodology-video-card" id="metodika-video">
            <video controls preload="metadata" poster="/videos/rest-art-logo-reveal-standard-poster.png">
              <source src="/videos/rest-art-logo-reveal-standard.mp4" type="video/mp4" />
              Váš prohlížeč neumí přehrát vložené video.
            </video>
            <div>
              <p className="section-label">Vybraný brand asset</p>
              <h2>Logo reveal pro interní a partnerskou prezentaci</h2>
              <p>
                Z přiložených variant je tato zvolená jako nejčistší pracovní verze pro web: drží prémiový dojem,
                respektuje zeleno-zlatou identitu a nepůsobí jako samostatná náhrada oficiálního loga.
              </p>
            </div>
          </div>

          <div className="methodology-standard-card">
            <p className="section-label">PDF standard</p>
            <h2>Technická pravidla formulářů</h2>
            <p>
              Standard formulářů drží jednotný vzhled napříč dokumenty: Poppins pro vizuální identitu, Helvetica pro
              interaktivní pole, rámečky 0,6 pt v akcentní zelené a jasně definované vrstvy dokumentu.
            </p>
            <ul>
              <li>Statická grafika je master.</li>
              <li>Pole nesmí překrývat rámečky ani text.</li>
              <li>Opakované prvky drží shodné rozměry.</li>
              <li>Oprava pole nesmí měnit ostatní části dokumentu.</li>
              <li>Finální PDF prochází funkční i vizuální kontrolou.</li>
            </ul>
          </div>

          <div className="methodology-downloads" aria-label="Administrátorské dokumenty ke stažení">
            {methodologyAdminDownloads.map((download) => (
              <article key={download.fileUrl}>
                <FileText size={28} />
                <div>
                  <p className="section-label">{download.mimeType}</p>
                  <h2>{download.title}</h2>
                  <p>{download.description}</p>
                  <small>{download.fileName} · {readableBytes(download.fileSize)}</small>
                </div>
                <a className="button secondary" href={download.fileUrl} target="_blank" rel="noreferrer" download={download.fileName}>
                  <Download size={18} /> Otevřít
                </a>
              </article>
            ))}
          </div>

          <div className="methodology-style-section">
            <div>
              <p className="section-label">Design tokens</p>
              <h2>Vizuální a technická konzistence</h2>
              <p>
                Barevné hodnoty vycházejí ze standardu PDF formulářů a slouží jako společný základ pro dokumenty,
                formuláře i veřejné vizuály.
              </p>
            </div>
            <div className="methodology-token-grid">
              {methodologyStyleTokens.map((token) => (
                <article key={token.value}>
                  <span style={{ backgroundColor: token.value }} aria-hidden="true" />
                  <strong>{token.name}</strong>
                  <small>{token.value}</small>
                </article>
              ))}
            </div>
          </div>

          <div className="methodology-gallery-section" id="metodika-vizualy">
            <div className="methodology-gallery-head">
              <div>
                <p className="section-label">Vizuální knihovna</p>
                <h2>Podklady pro web, metodiku a partnerskou komunikaci</h2>
              </div>
              <p>
                Galerie kombinuje finální veřejně použitelné vizuály a pracovní návrhy. Pracovní kusy jsou záměrně
                označené, aby před tiskem nebo kampaní prošly poslední korekturou.
              </p>
            </div>
            <div className="methodology-visual-grid">
              {methodologyVisuals.map((visual) => (
                <figure key={visual.src}>
                  <a href={visual.src} target="_blank" rel="noreferrer">
                    <img src={visual.src} alt={visual.alt} loading="lazy" />
                  </a>
                  <figcaption>
                    <strong>{visual.title}</strong>
                    <span>{visual.note}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
            <div className="methodology-icon-strip" aria-label="Programové ikony">
              {methodologyIconVisuals.map((visual) => (
                <figure key={visual.src}>
                  <img src={visual.src} alt={visual.alt} loading="lazy" />
                  <figcaption>{visual.title}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function JailbreakBackgroundWidget({ stats }: { stats: ApiJailbreakBackgroundStats }) {
  const institutionalCareYes = stats.institutionalCare.find((item) => item.key === 'yes');
  const displayBuckets = stats.childhoodBackground.filter((item) => item.count > 0);

  return (
    <aside className="transparency-data-widget" aria-label="Anonymizovaná metrika programu JAILBREAK">
      <div className="transparency-data-head">
        <span className="news-tag">JAILBREAK data</span>
        <div>
          <h2>Zázemí klientů před vstupem do programu</h2>
          <p>{stats.note}</p>
        </div>
      </div>
      <div className="transparency-data-main">
        <div className="transparency-data-number">
          <span>Vzorek</span>
          <strong>{stats.total}</strong>
          <small>klientů JAILBREAK v evidenci</small>
        </div>
        <div className="transparency-data-number">
          <span>Institucionální péče</span>
          <strong>{stats.canPublish ? `${institutionalCareYes?.share ?? 0} %` : 'sběr'}</strong>
          <small>{stats.canPublish ? `${institutionalCareYes?.count ?? 0} z ${stats.total} klientů` : `zveřejníme od n >= ${stats.minPublicSample}`}</small>
        </div>
      </div>
      {stats.canPublish ? (
        <div className="transparency-bars">
          {displayBuckets.length > 0 ? (
            displayBuckets.map((item) => (
              <div className="transparency-bar-row" key={item.key}>
                <span>{item.label}</span>
                <div aria-hidden="true">
                  <i style={{ width: `${Math.max(item.share, item.count > 0 ? 4 : 0)}%` }} />
                </div>
                <strong>{item.count} / {item.share} %</strong>
              </div>
            ))
          ) : (
            <p className="empty-note">Zatím nejsou vyplněná strukturovaná data k zázemí klientů.</p>
          )}
        </div>
      ) : (
        <p className="transparency-data-note">
          Veřejný graf zobrazíme až po dosažení minimálního anonymizačního vzorku. Interně lze data sbírat už teď.
        </p>
      )}
    </aside>
  );
}

function VerifiedPrisonStatsNote() {
  return (
    <aside className="transparency-data-widget verified-data-widget" aria-label="Ověřená data Vězeňské služby České republiky">
      <div className="transparency-data-head">
        <span className="news-tag">ONLY TRUE</span>
        <div>
          <h2>Ověřená data k vězeňství</h2>
          <p>
            Rozpočtové údaje v grafu se vztahují k běžným výdajům Vězeňské služby ČR. U roku 2025 odpovídá hodnota
            „Rozpočet po změnách“ částce 13 107 759,28 tis. Kč a hodnota „Skutečné čerpání“ částce 13 084 930,06 tis.
            Kč podle Výroční zprávy VS ČR za rok 2025.
          </p>
        </div>
      </div>
      <p className="transparency-data-note">
        Údaj je proto nutné číst jako běžné výdaje, nikoliv jako celkové výdaje Vězeňské služby ČR. Rozpočtová data jsou
        používána pouze jako přesně vymezený ukazatel běžných výdajů VS ČR, nikoliv jako zjednodušené tvrzení o celkových
        nákladech vězeňství.
      </p>
      <div className="verified-data-links" aria-label="Zdroje ověřených údajů">
        <a href="https://www.vs.gov.cz/media/organizacni-jednotky/generalni-reditelstvi/odbor-spravni/uredni-deska/vyrocni-zpravy/vyrocni-zprava-vs-cr-2025.pdf" target="_blank" rel="noreferrer">
          Výroční zpráva VS ČR 2025
        </a>
        <a href="https://www.vs.gov.cz/sekce/statisticke-rocenky-vezenske-sluzby" target="_blank" rel="noreferrer">
          Statistické ročenky VS ČR
        </a>
        <a href="https://csu.gov.cz/vezni" target="_blank" rel="noreferrer">
          ČSÚ: Vězni
        </a>
        <a href="https://ec.europa.eu/eurostat/statistics-explained/index.php?title=Prison_statistics" target="_blank" rel="noreferrer">
          Eurostat: Prison statistics
        </a>
      </div>
    </aside>
  );
}

const prisonStatisticMetrics = [
  {
    label: 'Počet vězněných osob v roce 2025',
    value: '19 359',
    note: 'stav podle souhrnných dat VS ČR'
  },
  {
    label: 'Změna 2020-2025',
    value: '+73 osob',
    note: 'celkově +0,38 %, tedy dlouhodobě stabilní hladina okolo 19 tisíc osob'
  },
  {
    label: 'Nárůst osob ve vazbě 2021-2025',
    value: '+259 osob',
    note: 'z 1 392 na 1 651 osob, přibližně +18,6 %'
  },
  {
    label: 'Česko v EU v roce 2024',
    value: '178 / 100 tis.',
    note: 'Eurostat uvádí Česko mezi zeměmi s nejvyšší mírou věznění v EU'
  }
];

const prisonStatisticFigures = [
  {
    title: 'Dlouhodobý trend počtu vězněných osob',
    imageUrl: '/images/statistics/dlouhodoby-trend-veznenych-osob.png',
    alt: 'Graf dlouhodobého trendu počtu vězněných osob v letech 2020 až 2023.',
    caption:
      'Po poklesu v roce 2021 se počet vězněných osob vrátil nad 19 tisíc. Trend proto podporuje potřebu stabilní reintegrační práce, ne pouze jednorázových intervencí.'
  },
  {
    title: 'Souhrn vývoje VS ČR 2020-2025',
    imageUrl: '/images/statistics/souhrn-vyvoje-vs-cr-2020-2025.png',
    alt: 'Souhrnný graf vývoje počtu vězněných osob, osob ve výkonu trestu, ve vazbě, v zabezpečovací detenci a rozpočtových údajů v letech 2020 až 2025.',
    caption:
      'Souhrn ukazuje současně kapacitní, procesní i rozpočtový rozměr vězeňství. Rozpočet v grafu je čten jako běžné výdaje podle uvedené poznámky ONLY TRUE.'
  },
  {
    title: 'Evropské srovnání v roce 2024',
    imageUrl: '/images/statistics/eurostat-vezni-eu-srovnani-2024.png',
    alt: 'Graf Eurostatu s porovnáním počtu vězňů na 100 tisíc obyvatel v zemích Evropské unie v roce 2024.',
    caption:
      'Eurostat pro rok 2024 uvádí Česko na hodnotě přibližně 178 vězňů na 100 tisíc obyvatel. Tento údaj slouží jako kontext zatížení systému, nikoliv jako samostatné hodnocení příčin.'
  }
];

function PrisonStatisticsSection() {
  return (
    <section className="prison-stats-section" aria-labelledby="prison-stats-title">
      <div className="prison-stats-head">
        <p className="section-label">Statistická opora</p>
        <h2 id="prison-stats-title">Data, která vysvětlují potřebnost reintegrace</h2>
        <p>
          Grafy vycházejí ze souhrnných údajů Vězeňské služby ČR za roky 2020-2025 a z evropského srovnání Eurostatu za
          rok 2024. Nepoužíváme je jako argument strachu, ale jako věcný rámec: tisíce lidí se každoročně vracejí z
          výkonu trestu, vazby nebo zabezpečovací detence zpět do společnosti.
        </p>
      </div>

      <div className="prison-stats-metrics">
        {prisonStatisticMetrics.map((metric) => (
          <article key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <p>{metric.note}</p>
          </article>
        ))}
      </div>

      <div className="prison-stats-copy">
        <article>
          <h3>Co z dat plyne pro REST||ART</h3>
          <p>
            V letech 2020-2025 se počet vězněných osob pohyboval v úzkém pásmu okolo 19 tisíc osob. Nejde tedy o
            výjimečný výkyv, ale o stabilní společenské téma, které potřebuje dlouhodobý rámec práce s návratem člověka
            do běžného života.
          </p>
        </article>
        <article>
          <h3>Proč vzniká bod zlomu dříve</h3>
          <p>
            Nárůst počtu osob ve vazbě mezi roky 2021 a 2025 ukazuje, že reintegrační práce nemá začínat až po propuštění.
            RESTART proto pracuje s bodem zlomu už ve vězení, v institucích, ve škole, v rodině nebo v krizové životní
            situaci.
          </p>
        </article>
      </div>

      <div className="prison-figure-grid">
        {prisonStatisticFigures.map((figure) => (
          <figure key={figure.imageUrl} className="prison-figure-card">
            <a href={figure.imageUrl} target="_blank" rel="noreferrer" aria-label={`Otevřít graf: ${figure.title}`}>
              <img src={figure.imageUrl} alt={figure.alt} loading="lazy" />
            </a>
            <figcaption>
              <strong>{figure.title}</strong>
              <span>{figure.caption}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      <p className="prison-stats-source-note">
        Zdrojová data: výroční zprávy a statistické údaje Vězeňské služby ČR, statistické ročenky VS ČR, ČSÚ a Eurostat.
        Každá veřejná interpretace je vedena principem ONLY TRUE: číslo je buď doložené, nebo je výslovně označené jako
        pracovní hypotéza.
      </p>
    </section>
  );
}

function TransparencyDocumentsPage({
  documents,
  jailbreakBackgroundStats
}: {
  documents: MediaFile[];
  jailbreakBackgroundStats: ApiJailbreakBackgroundStats | null;
}) {
  const sorted = documents.slice().sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());

  return (
    <section className="content-section static-info-page">
      <div className="static-info-head">
        <p className="section-label">Transparentnost</p>
        <h1>Povinné zveřejňování</h1>
        <p>Zveřejňujeme dokumenty pro transparentnost projektových aktivit, financování a veřejných podkladů.</p>
      </div>
      <VerifiedPrisonStatsNote />
      <PrisonStatisticsSection />
      {jailbreakBackgroundStats && <JailbreakBackgroundWidget stats={jailbreakBackgroundStats} />}
      <div className="client-document-list transparency-document-list">
        {sorted.length === 0 ? (
          <p className="empty-note">Zatím nejsou žádné zveřejněné transparentní dokumenty. Přidejte je prosím v administraci v sekci Média.</p>
        ) : (
          sorted.map((document) => {
            const publicUrl = resolvePublicFileUrl(document.fileUrl);
            const documentTitle = document.title || document.fileName;
            const documentType = (document.fileName.split('.').pop() || 'PDF').toUpperCase();
            const fileBaseName = document.fileName.replace(/\.[^.]+$/, '');
            const thumbnailUrl = /\.pdf$/i.test(document.fileName) && document.fileUrl.startsWith('/documents/transparency/')
              ? `/documents/transparency/thumbnails/${fileBaseName}.png`
              : '';
            return (
              <article key={document.id} title={document.fileName}>
                <span className="document-thumb document-thumb-preview" aria-hidden="true">
                  {thumbnailUrl && (
                    <img
                      src={thumbnailUrl}
                      alt=""
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.style.display = 'none';
                        const fallback = event.currentTarget.nextElementSibling as HTMLElement | null;
                        fallback?.removeAttribute('hidden');
                      }}
                    />
                  )}
                  <span className="document-thumb-fallback" hidden={Boolean(thumbnailUrl)}>
                    <FileText size={22} />
                    <em>{documentType}</em>
                  </span>
                </span>
                <div className="document-card-copy">
                  <strong>{documentTitle}</strong>
                  <small>
                    {new Date(document.createdAt).toLocaleDateString('cs-CZ')} · {readableBytes(document.fileSize)}
                  </small>
                </div>
                <span className="document-file-chip" aria-label={`Typ souboru ${documentType}`}>{documentType}</span>
                <a className="button secondary" href={publicUrl} target="_blank" rel="noreferrer" aria-label={`Otevřít dokument ${documentTitle}`}>
                  <Download size={18} /> Otevřít PDF
                </a>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}

const linkedInProfileUrl = 'https://cz.linkedin.com/in/david-koz%C3%A1k-5b1ab5365?trk=profile-badge';

function storedMarketingConsent() {
  try {
    const stored = window.localStorage.getItem('restart-cookie-preferences');
    if (!stored) return false;
    return (JSON.parse(stored) as Partial<CookiePreferences>).marketing === true;
  } catch {
    return false;
  }
}

function LinkedInProfileBadge({ onOpenCookieSettings }: { onOpenCookieSettings: () => void }) {
  const [marketingAllowed, setMarketingAllowed] = React.useState(storedMarketingConsent);
  const [badgeReady, setBadgeReady] = React.useState(false);
  const [badgeTimedOut, setBadgeTimedOut] = React.useState(false);
  const badgeRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const syncFromStorage = () => setMarketingAllowed(storedMarketingConsent());
    const syncFromPreferences = (event: Event) => {
      const preferences = (event as CustomEvent<CookiePreferences>).detail;
      setMarketingAllowed(preferences?.marketing === true);
    };
    window.addEventListener('storage', syncFromStorage);
    window.addEventListener(COOKIE_PREFERENCES_EVENT, syncFromPreferences);
    return () => {
      window.removeEventListener('storage', syncFromStorage);
      window.removeEventListener(COOKIE_PREFERENCES_EVENT, syncFromPreferences);
    };
  }, []);

  React.useEffect(() => {
    setBadgeReady(false);
    setBadgeTimedOut(false);
    if (!marketingAllowed) return;
    const scriptId = 'linkedin-profile-badge-script';
    document.getElementById(scriptId)?.remove();
    const observer = new MutationObserver(() => {
      if (badgeRef.current?.querySelector('iframe')) setBadgeReady(true);
    });
    if (badgeRef.current) observer.observe(badgeRef.current, { childList: true, subtree: true });
    const timeoutId = window.setTimeout(() => {
      if (!badgeRef.current?.querySelector('iframe')) setBadgeTimedOut(true);
    }, 4500);
    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://platform.linkedin.com/badges/js/profile.js';
    script.async = true;
    script.defer = true;
    script.type = 'text/javascript';
    document.body.appendChild(script);
    return () => {
      observer.disconnect();
      window.clearTimeout(timeoutId);
      script.remove();
      document.querySelectorAll('script[src^="https://badges.linkedin"]').forEach((node) => node.remove());
    };
  }, [marketingAllowed]);

  return (
    <section className="linkedin-profile" aria-labelledby="linkedin-profile-title">
      <div className="linkedin-profile-heading">
        <span className="linkedin-profile-icon" aria-hidden="true"><Linkedin size={19} /></span>
        <div>
          <p className="section-label">LinkedIn</p>
          <h2 id="linkedin-profile-title">Veřejný profil zakladatele</h2>
        </div>
      </div>
      {marketingAllowed ? (
        <>
          <div className={`linkedin-badge-shell${badgeReady ? ' is-ready' : ''}`}>
            <div
              ref={badgeRef}
              className="badge-base LI-profile-badge"
              data-locale="cs_CZ"
              data-size="large"
              data-theme="light"
              data-type="VERTICAL"
              data-vanity="david-kozák-5b1ab5365"
              data-version="v1"
            >
              <a className="badge-base__link LI-simple-link" href={linkedInProfileUrl} target="_blank" rel="noreferrer noopener">
                David Kozák
              </a>
            </div>
          </div>
          {!badgeReady && (
            <div className="linkedin-profile-placeholder is-compact" aria-live="polite">
              <p>
                {badgeTimedOut
                  ? 'Oficiální odznak LinkedIn se nyní nepodařilo načíst. Veřejný profil zůstává dostupný přímo.'
                  : 'Načítáme veřejný profil z LinkedInu…'}
              </p>
              <a className="button secondary" href={linkedInProfileUrl} target="_blank" rel="noreferrer noopener">
                <Linkedin size={17} /> Otevřít LinkedIn
              </a>
            </div>
          )}
          <p className="linkedin-profile-note">Externí obsah poskytuje LinkedIn.</p>
        </>
      ) : (
        <div className="linkedin-profile-placeholder">
          <p>Odznak načteme pouze po povolení marketingových cookies. Veřejný profil lze otevřít i přímo.</p>
          <div className="linkedin-profile-actions">
            <a className="button secondary" href={linkedInProfileUrl} target="_blank" rel="noreferrer noopener">
              <Linkedin size={17} /> Otevřít LinkedIn
            </a>
            <button className="button ghost" type="button" onClick={onOpenCookieSettings}>
              <Settings size={17} /> Nastavení cookies
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function ContactPage({
  onNotify,
  onOpenCookieSettings
}: {
  onNotify: (tone: FeedbackTone, title: string, text?: string) => void;
  onOpenCookieSettings: () => void;
}) {
  const prepareMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') || '').trim();
    const contact = String(form.get('contact') || '').trim();
    const message = String(form.get('message') || '').trim();
    if (!name || !contact || !message) {
      onNotify('error', 'Zprávu nejde připravit', 'Vyplňte jméno, kontakt a zprávu.');
      return;
    }
    const subject = encodeURIComponent(`Kontakt z webu REST||ART Integrace - ${name}`);
    const body = encodeURIComponent(`Jméno: ${name}\nKontakt: ${contact}\n\nZpráva:\n${message}`);
    onNotify('success', 'Zpráva je připravená', 'Otevře se e-mailový klient s předvyplněnou zprávou.');
    window.location.href = `mailto:restartintegrace@dk-i.cz?subject=${subject}&body=${body}`;
  };

  return (
    <>
      <PageHeader
        label="Kontakt"
        title="Ozvěte se. První krok může být krátká zpráva."
        text="Máte dotaz, potřebujete podporu nebo chcete nabídnout spolupráci? Kontakt bereme věcně, lidsky a s respektem."
      />
      <section className="contact-section">
        <div className="contact-card">
          {contacts.map((contact) => (
            <div key={contact.label} className="contact-line">
              <span>{contact.label}</span>
              {contact.href ? <a href={contact.href}>{contact.value}</a> : <strong>{contact.value}</strong>}
            </div>
          ))}
          <div className="contact-actions">
            <a className="button primary" href="mailto:restartintegrace@dk-i.cz">
              <Mail size={18} /> Poslat e-mail
            </a>
            <a className="button secondary" href="tel:+420778564279">
              <Phone size={18} /> Zavolat
            </a>
          </div>
          <LinkedInProfileBadge onOpenCookieSettings={onOpenCookieSettings} />
        </div>
        <form
          className="contact-form"
          id="kontakt-formular"
          onSubmit={prepareMessage}
          {...{
            toolname: 'prepare_contact_message',
            tooldescription: 'Připraví kontaktní zprávu pro REST||ART Integrace. Před odesláním musí uživatel obsah zkontrolovat a formulář ručně potvrdit.'
          }}
        >
          <h2>Kontaktní formulář</h2>
          <label>
            Jméno
            <input
              name="name"
              autoComplete="name"
              maxLength={120}
              required
              {...{ toolparamdescription: 'Jméno osoby, která projekt kontaktuje.' }}
            />
          </label>
          <label>
            E-mail nebo telefon
            <input
              name="contact"
              autoComplete="email"
              maxLength={160}
              required
              {...{ toolparamdescription: 'E-mailová adresa nebo telefon pro odpověď.' }}
            />
          </label>
          <label>
            Zpráva
            <textarea
              name="message"
              rows={6}
              maxLength={3000}
              required
              {...{ toolparamdescription: 'Text dotazu, žádosti o podporu nebo nabídky spolupráce.' }}
            />
          </label>
          <button className="button primary" type="submit">
            Připravit zprávu
          </button>
        </form>
      </section>
    </>
  );
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  autoComplete = 'current-password'
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
}) {
  const [visible, setVisible] = React.useState(false);

  return (
    <div className="form-field password-control">
      <label htmlFor={id}>{label}</label>
      <div className="password-input">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          value={value}
          autoComplete={autoComplete}
          onChange={(event) => onChange(event.target.value)}
          required
        />
        <button
          type="button"
          aria-label={visible ? 'Skrýt heslo' : 'Zobrazit heslo'}
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}

function FeedbackIcon({ tone }: { tone: FeedbackTone }) {
  const { size, strokeWidth } = React.useContext(IconContext);
  const props = { size, strokeWidth };
  if (tone === 'success') return <CheckCircle2 {...props} />;
  if (tone === 'error') return <AlertCircle {...props} />;
  return <Info {...props} />;
}

const normalizeFeedbackTone = (variant: FeedbackVariant = 'info'): FeedbackTone => (variant === 'danger' ? 'error' : variant);

function Feedback({
  variant = 'info',
  icon = true,
  title,
  description,
  showCloseButton = false,
  onClose,
  children,
  className = ''
}: {
  variant?: FeedbackVariant;
  icon?: boolean;
  title?: string;
  description?: string;
  showCloseButton?: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
  className?: string;
}) {
  const tone = normalizeFeedbackTone(variant);
  return (
    <section className={`ui-feedback ${tone}${className ? ` ${className}` : ''}`} aria-live={tone === 'error' ? 'assertive' : 'polite'}>
      {icon && (
        <div className="ui-feedback-icon" aria-hidden="true">
          <FeedbackIcon tone={tone} />
        </div>
      )}
      <div className="ui-feedback-body">
        {title && <strong className="ui-feedback-title">{title}</strong>}
        {description && <p className="ui-feedback-description">{description}</p>}
        {children}
      </div>
      {showCloseButton && onClose && (
        <button className="ui-feedback-close" type="button" aria-label="Zavřít hlášku" onClick={onClose}>
          <X size={16} />
        </button>
      )}
    </section>
  );
}

function Line() {
  return <span className="ui-line" aria-hidden="true" />;
}

function SectionDivider({ children }: { children: React.ReactNode }) {
  return (
    <div className="section-divider" role="separator" aria-label={typeof children === 'string' ? children : undefined}>
      <Line />
      <span>{children}</span>
      <Line />
    </div>
  );
}

function Badge({ tone = 'info', children }: { tone?: FeedbackTone; children: React.ReactNode }) {
  return <span className={`ui-badge ${tone}`}>{children}</span>;
}

function AdminContextMenu({ label = 'Admin akce', items }: { label?: string; items: AdminContextMenuItem[] }) {
  const [open, setOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div className="admin-context-menu" ref={menuRef}>
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={label}
        className="icon-tool admin-context-trigger"
        type="button"
        onClick={() => setOpen((current) => !current)}
      >
        <MoreHorizontal size={18} />
      </button>
      {open && (
        <div aria-label={label} className="admin-context-popover" role="menu">
          {items.map((item) => (
            <button
              key={item.label}
              className={`admin-context-item ${item.tone === 'danger' ? 'danger' : ''} ${
                item.tone === 'success' ? 'success' : ''
              }`}
              disabled={item.disabled}
              role="menuitem"
              type="button"
              onClick={() => {
                if (item.disabled) return;
                setOpen(false);
                item.onSelect();
              }}
            >
              {item.icon}
              <span>
                <strong>{item.label}</strong>
                {item.text && <small>{item.text}</small>}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function CursorCard({
  trigger,
  overlay,
  className = ''
}: {
  trigger: React.ReactNode;
  overlay: React.ReactNode;
  className?: string;
}) {
  const [isHovering, setIsHovering] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [isTouchDevice, setIsTouchDevice] = React.useState(false);

  React.useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice) return;
    setPosition({ x: event.clientX, y: event.clientY });
    setIsHovering(true);
  };

  const floatingStyle = {
    left:
      typeof window === 'undefined'
        ? position.x + 18
        : Math.max(12, Math.min(position.x + 18, window.innerWidth - 340)),
    top:
      typeof window === 'undefined'
        ? position.y + 18
        : Math.max(12, Math.min(position.y + 18, window.innerHeight - 220))
  } as React.CSSProperties;

  return (
    <>
      <div
        className={`cursor-card-trigger${className ? ` ${className}` : ''}`}
        onMouseEnter={handleMouseMove}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setIsHovering(false)}
        onFocus={() => setIsHovering(false)}
      >
        {trigger}
      </div>
      {isHovering &&
        !isTouchDevice &&
        typeof document !== 'undefined' &&
        createPortal(
          <div className="cursor-card-floating" style={floatingStyle}>
            {overlay}
          </div>,
          document.body
        )}
    </>
  );
}

function AppCheckbox({
  id,
  checked,
  onChange,
  label,
  description,
  required = false,
  disabled = false
}: {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: React.ReactNode;
  description?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <label className={`app-checkbox${disabled ? ' disabled' : ''}`} htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        aria-required={required}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="checkbox-control" aria-hidden="true">
        {checked && <CheckCircle2 size={16} />}
      </span>
      <span className="checkbox-copy">
        <span>{label}</span>
        {description && <small>{description}</small>}
      </span>
    </label>
  );
}

function LayoutProvider({ children }: { children: React.ReactNode }) {
  const layoutStyle = {
    '--page-max': layoutConfig.pageMax,
    '--page-gutter': layoutConfig.pageGutter
  } as React.CSSProperties;

  return (
    <LayoutContext.Provider value={layoutConfig}>
      <div className="app-layout-provider" style={layoutStyle}>
        {children}
      </div>
    </LayoutContext.Provider>
  );
}

function IconProvider({ children }: { children: React.ReactNode }) {
  return <IconContext.Provider value={iconConfig}>{children}</IconContext.Provider>;
}

function ToastProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = React.useState<ToastMessage[]>([]);
  const timeoutRefs = React.useRef<Record<string, number>>({});

  const dismissToast = React.useCallback((id: string) => {
    if (timeoutRefs.current[id]) {
      window.clearTimeout(timeoutRefs.current[id]);
      delete timeoutRefs.current[id];
    }
    setMessages((current) => current.filter((message) => message.id !== id));
  }, []);

  const notify = React.useCallback<NotifyFn>((tone, title, text) => {
    const id = crypto.randomUUID();
    setMessages((current) => [...current.slice(-3), { id, tone, title, text }]);
    timeoutRefs.current[id] = window.setTimeout(() => {
      dismissToast(id);
    }, tone === 'error' ? 7000 : 4800);
  }, [dismissToast]);

  React.useEffect(() => {
    return () => {
      Object.values(timeoutRefs.current).forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, []);

  return (
    <ToastContext.Provider value={{ notify, dismissToast, messages }}>
      {children}
      <ToastStack messages={messages} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <LayoutProvider>
      <IconProvider>
        <ToastProvider>{children}</ToastProvider>
      </IconProvider>
    </LayoutProvider>
  );
}

function RevealFx({
  children,
  delay = 0,
  className = '',
  as: Component = 'div'
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}) {
  const style = { '--reveal-delay': `${delay}ms` } as React.CSSProperties;
  return (
    <Component className={`reveal-fx ${className}`.trim()} style={style}>
      {children}
    </Component>
  );
}

function ToastStack({
  messages,
  onDismiss
}: {
  messages: ToastMessage[];
  onDismiss: (id: string) => void;
}) {
  if (messages.length === 0) return null;
  return (
    <div className="toast-stack" role="status" aria-live="polite" aria-atomic="false">
      {messages.map((message) => (
        <Feedback
          className="ui-toast"
          key={message.id}
          variant={message.tone}
          title={message.title}
          description={message.text}
          showCloseButton={true}
          onClose={() => onDismiss(message.id)}
        />
      ))}
    </div>
  );
}

function AppModal({ modal, onClose }: { modal: ModalState; onClose: () => void }) {
  if (!modal) return null;
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className={`app-modal ${modal.tone}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="app-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-icon"><FeedbackIcon tone={modal.tone} /></div>
        <div>
          <h2 id="app-modal-title">{modal.title}</h2>
          <p>{modal.text}</p>
        </div>
        <button className="modal-close" type="button" aria-label="Zavřít dialog" onClick={onClose}>
          <X size={18} />
        </button>
        <button className="button primary" type="button" onClick={onClose}>
          Rozumím
        </button>
      </section>
    </div>
  );
}

const weatherLeaves = [
  { left: '3%', size: 16, color: '#7dff9a', accent: '#247b3d', glow: 'rgba(88, 255, 132, 0.42)', opacity: 0.24, duration: '18s', delay: '-2s', drift: '108px', rotate: '10deg' },
  { left: '7%', size: 11, color: '#d4b64f', accent: '#826111', glow: 'rgba(255, 207, 73, 0.36)', opacity: 0.2, duration: '24s', delay: '-12s', drift: '-74px', rotate: '-18deg' },
  { left: '11%', size: 22, color: '#31c966', accent: '#0f5f2d', glow: 'rgba(49, 255, 112, 0.35)', opacity: 0.22, duration: '21s', delay: '-7s', drift: '132px', rotate: '28deg' },
  { left: '16%', size: 13, color: '#b6ff64', accent: '#4d8c25', glow: 'rgba(182, 255, 100, 0.36)', opacity: 0.21, duration: '27s', delay: '-18s', drift: '-92px', rotate: '-34deg' },
  { left: '20%', size: 18, color: '#2f7d49', accent: '#9bd86f', glow: 'rgba(68, 224, 102, 0.32)', opacity: 0.2, duration: '23s', delay: '-4s', drift: '86px', rotate: '44deg' },
  { left: '24%', size: 10, color: '#f0c75a', accent: '#a68121', glow: 'rgba(255, 213, 84, 0.42)', opacity: 0.19, duration: '29s', delay: '-21s', drift: '-118px', rotate: '-8deg' },
  { left: '29%', size: 20, color: '#5fe08b', accent: '#1e7b40', glow: 'rgba(95, 255, 139, 0.34)', opacity: 0.22, duration: '20s', delay: '-15s', drift: '124px', rotate: '18deg' },
  { left: '33%', size: 14, color: '#8fb85b', accent: '#2f6d32', glow: 'rgba(159, 221, 91, 0.3)', opacity: 0.18, duration: '26s', delay: '-10s', drift: '-78px', rotate: '-42deg' },
  { left: '37%', size: 25, color: '#20b85a', accent: '#0b4d29', glow: 'rgba(32, 230, 95, 0.36)', opacity: 0.18, duration: '31s', delay: '-24s', drift: '146px', rotate: '36deg' },
  { left: '41%', size: 12, color: '#e7d47a', accent: '#8d7327', glow: 'rgba(255, 230, 119, 0.34)', opacity: 0.2, duration: '22s', delay: '-5s', drift: '-104px', rotate: '-24deg' },
  { left: '45%', size: 17, color: '#a4ff8b', accent: '#2a9144', glow: 'rgba(164, 255, 139, 0.36)', opacity: 0.21, duration: '25s', delay: '-19s', drift: '96px', rotate: '12deg' },
  { left: '49%', size: 9, color: '#1f5f36', accent: '#64d982', glow: 'rgba(77, 255, 119, 0.28)', opacity: 0.18, duration: '33s', delay: '-11s', drift: '-64px', rotate: '52deg' },
  { left: '52%', size: 21, color: '#48d76f', accent: '#d7bf55', glow: 'rgba(72, 247, 111, 0.33)', opacity: 0.22, duration: '19s', delay: '-14s', drift: '118px', rotate: '-16deg' },
  { left: '56%', size: 15, color: '#cfb15a', accent: '#4f8f46', glow: 'rgba(255, 207, 80, 0.34)', opacity: 0.19, duration: '28s', delay: '-23s', drift: '-132px', rotate: '30deg' },
  { left: '60%', size: 24, color: '#0ea64b', accent: '#8dff79', glow: 'rgba(36, 255, 105, 0.38)', opacity: 0.2, duration: '22s', delay: '-8s', drift: '154px', rotate: '-30deg' },
  { left: '64%', size: 12, color: '#b4db65', accent: '#2f7d49', glow: 'rgba(185, 232, 105, 0.3)', opacity: 0.2, duration: '30s', delay: '-17s', drift: '-88px', rotate: '22deg' },
  { left: '68%', size: 19, color: '#78ffad', accent: '#146a39', glow: 'rgba(120, 255, 173, 0.38)', opacity: 0.2, duration: '24s', delay: '-3s', drift: '112px', rotate: '-46deg' },
  { left: '72%', size: 10, color: '#f5d36b', accent: '#a77d19', glow: 'rgba(255, 218, 102, 0.42)', opacity: 0.2, duration: '34s', delay: '-27s', drift: '-120px', rotate: '8deg' },
  { left: '75%', size: 16, color: '#2ed56c', accent: '#0d5d31', glow: 'rgba(46, 255, 112, 0.34)', opacity: 0.21, duration: '20s', delay: '-13s', drift: '136px', rotate: '40deg' },
  { left: '79%', size: 23, color: '#a5c94e', accent: '#2e6f37', glow: 'rgba(175, 222, 75, 0.3)', opacity: 0.17, duration: '32s', delay: '-20s', drift: '-142px', rotate: '-20deg' },
  { left: '82%', size: 13, color: '#56f08f', accent: '#1d773f', glow: 'rgba(86, 255, 143, 0.35)', opacity: 0.22, duration: '23s', delay: '-9s', drift: '92px', rotate: '16deg' },
  { left: '85%', size: 18, color: '#b8933a', accent: '#f2df8a', glow: 'rgba(255, 216, 88, 0.32)', opacity: 0.18, duration: '29s', delay: '-26s', drift: '-106px', rotate: '-38deg' },
  { left: '88%', size: 11, color: '#2fef77', accent: '#0c6f35', glow: 'rgba(47, 255, 119, 0.4)', opacity: 0.23, duration: '21s', delay: '-6s', drift: '126px', rotate: '46deg' },
  { left: '91%', size: 26, color: '#67b747', accent: '#d7c25b', glow: 'rgba(143, 255, 88, 0.3)', opacity: 0.17, duration: '35s', delay: '-30s', drift: '-154px', rotate: '-12deg' },
  { left: '94%', size: 14, color: '#e1bd43', accent: '#5cae50', glow: 'rgba(255, 205, 66, 0.36)', opacity: 0.19, duration: '26s', delay: '-16s', drift: '104px', rotate: '26deg' },
  { left: '97%', size: 19, color: '#49c76b', accent: '#112f1d', glow: 'rgba(73, 235, 107, 0.3)', opacity: 0.18, duration: '31s', delay: '-22s', drift: '-130px', rotate: '-28deg' },
  { left: '13%', size: 8, color: '#cbff8a', accent: '#319044', glow: 'rgba(203, 255, 138, 0.32)', opacity: 0.2, duration: '17s', delay: '-1s', drift: '80px', rotate: '58deg' },
  { left: '58%', size: 8, color: '#fff0a4', accent: '#b8933a', glow: 'rgba(255, 234, 132, 0.38)', opacity: 0.18, duration: '18s', delay: '-6s', drift: '-82px', rotate: '-54deg' },
  { left: '1%', size: 12, color: '#d9bf58', accent: '#315f35', glow: 'rgba(231, 196, 77, 0.38)', opacity: 0.27, duration: '22s', delay: '-15s', drift: '92px', rotate: '34deg' },
  { left: '9%', size: 18, color: '#4aa95f', accent: '#163f2a', glow: 'rgba(74, 169, 95, 0.34)', opacity: 0.3, duration: '19s', delay: '-9s', drift: '-106px', rotate: '-26deg' },
  { left: '18%', size: 14, color: '#b98f32', accent: '#426f3b', glow: 'rgba(213, 164, 53, 0.36)', opacity: 0.28, duration: '26s', delay: '-20s', drift: '118px', rotate: '48deg' },
  { left: '27%', size: 23, color: '#3d8a4f', accent: '#d0aa45', glow: 'rgba(72, 156, 86, 0.34)', opacity: 0.29, duration: '24s', delay: '-3s', drift: '-136px', rotate: '-36deg' },
  { left: '35%', size: 11, color: '#e2c25c', accent: '#2f6940', glow: 'rgba(226, 194, 92, 0.4)', opacity: 0.3, duration: '17s', delay: '-12s', drift: '74px', rotate: '18deg' },
  { left: '43%', size: 20, color: '#5bb56d', accent: '#123b29', glow: 'rgba(91, 181, 109, 0.35)', opacity: 0.3, duration: '21s', delay: '-17s', drift: '-122px', rotate: '-44deg' },
  { left: '47%', size: 13, color: '#b88d30', accent: '#67884b', glow: 'rgba(216, 170, 65, 0.36)', opacity: 0.27, duration: '28s', delay: '-25s', drift: '102px', rotate: '56deg' },
  { left: '54%', size: 17, color: '#3e9f57', accent: '#c8a43d', glow: 'rgba(62, 159, 87, 0.36)', opacity: 0.31, duration: '18s', delay: '-8s', drift: '-96px', rotate: '-14deg' },
  { left: '62%', size: 25, color: '#d2b34f', accent: '#2e6d3d', glow: 'rgba(222, 188, 78, 0.4)', opacity: 0.28, duration: '30s', delay: '-19s', drift: '148px', rotate: '38deg' },
  { left: '66%', size: 10, color: '#61ba72', accent: '#17472e', glow: 'rgba(97, 186, 114, 0.34)', opacity: 0.32, duration: '16s', delay: '-5s', drift: '-68px', rotate: '-52deg' },
  { left: '70%', size: 16, color: '#c49b38', accent: '#497c43', glow: 'rgba(212, 167, 61, 0.36)', opacity: 0.29, duration: '23s', delay: '-14s', drift: '116px', rotate: '24deg' },
  { left: '77%', size: 21, color: '#438f53', accent: '#d5b64d', glow: 'rgba(74, 157, 91, 0.35)', opacity: 0.3, duration: '27s', delay: '-23s', drift: '-132px', rotate: '-32deg' },
  { left: '84%', size: 12, color: '#e0be56', accent: '#356d3e', glow: 'rgba(224, 190, 86, 0.4)', opacity: 0.31, duration: '20s', delay: '-11s', drift: '84px', rotate: '42deg' },
  { left: '89%', size: 18, color: '#58ad68', accent: '#183f2b', glow: 'rgba(88, 173, 104, 0.34)', opacity: 0.3, duration: '25s', delay: '-18s', drift: '-114px', rotate: '-20deg' },
  { left: '93%', size: 22, color: '#b88e31', accent: '#4d8148', glow: 'rgba(207, 161, 55, 0.37)', opacity: 0.28, duration: '29s', delay: '-27s', drift: '142px', rotate: '30deg' },
  { left: '99%', size: 14, color: '#4a9e5c', accent: '#d2ad44', glow: 'rgba(74, 158, 92, 0.34)', opacity: 0.3, duration: '22s', delay: '-7s', drift: '-88px', rotate: '-40deg' }
];

function WeatherLeaves() {
  return (
    <div className="weather-leaves" aria-hidden="true">
      {weatherLeaves.map((leaf, index) => (
        <span
          key={`${leaf.left}-${index}`}
          style={
            {
              '--leaf-left': leaf.left,
              '--leaf-size': `${leaf.size}px`,
              '--leaf-color': leaf.color,
              '--leaf-accent': leaf.accent,
              '--leaf-glow': leaf.glow,
              '--leaf-opacity': leaf.opacity,
              '--leaf-duration': leaf.duration,
              '--leaf-delay': leaf.delay,
              '--leaf-drift': leaf.drift,
              '--leaf-rotate': leaf.rotate
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

const categoryLabels: Record<CookieCategory, string> = {
  necessary: 'Technické',
  statistics: 'Statistické',
  marketing: 'Marketingové'
};

const applyGoogleConsentMode = (preferences: Pick<CookiePreferences, 'statistics' | 'marketing'>) => {
  const gtag = (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag;
  if (!gtag) return;
  gtag('consent', 'update', {
    analytics_storage: preferences.statistics ? 'granted' : 'denied',
    ad_storage: preferences.marketing ? 'granted' : 'denied',
    ad_user_data: preferences.marketing ? 'granted' : 'denied',
    ad_personalization: preferences.marketing ? 'granted' : 'denied',
    personalization_storage: preferences.marketing ? 'granted' : 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted'
  });
};

const trackAnalyticsEvent = (eventName: string, params: Record<string, string | number | boolean> = {}) => {
  const gtag = (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag;
  if (!gtag) return;
  gtag('event', eventName, params);
};

function CookieConsent({
  forceOpen = false,
  inline = false,
  onClose
}: {
  forceOpen?: boolean;
  inline?: boolean;
  onClose?: () => void;
}) {
  const [legacyAccepted, setLegacyAccepted] = useStoredState('restart-cookie-consent', false);
  const [preferences, setPreferences] = useStoredState<CookiePreferences | null>('restart-cookie-preferences', null);
  const [manageOpen, setManageOpen] = React.useState(false);
  const [statistics, setStatistics] = React.useState(false);
  const [marketing, setMarketing] = React.useState(false);
  const { notify } = useToast();
  const shouldShowBanner = !preferences && !forceOpen;
  const shouldShowManager = forceOpen || manageOpen;

  React.useEffect(() => {
    if (preferences || !legacyAccepted) return;
    setPreferences({
      necessary: true,
      statistics: true,
      marketing: true,
      decidedAt: new Date().toISOString(),
      version: '2026-06'
    });
  }, [legacyAccepted, preferences, setPreferences]);

  React.useEffect(() => {
    if (!preferences) return;
    setStatistics(preferences.statistics);
    setMarketing(preferences.marketing);
    applyGoogleConsentMode(preferences);
  }, [preferences, forceOpen]);

  if (!shouldShowBanner && !shouldShowManager) return null;

  const closeManager = () => {
    setManageOpen(false);
    onClose?.();
  };

  const savePreferences = (nextStatistics = statistics, nextMarketing = marketing) => {
    const nextPreferences: CookiePreferences = {
      necessary: true,
      statistics: nextStatistics,
      marketing: nextMarketing,
      decidedAt: new Date().toISOString(),
      version: '2026-06'
    };
    setPreferences(nextPreferences);
    window.dispatchEvent(new CustomEvent<CookiePreferences>(COOKIE_PREFERENCES_EVENT, { detail: nextPreferences }));
    setLegacyAccepted(true);
    setStatistics(nextStatistics);
    setMarketing(nextMarketing);
    notify('success', 'Nastavení cookies uloženo', 'Volby můžete kdykoliv změnit v patičce webu.');
    closeManager();
  };

  const openManager = () => {
    setStatistics(preferences?.statistics ?? false);
    setMarketing(preferences?.marketing ?? false);
    setManageOpen(true);
  };

  if (shouldShowManager) {
    return (
      <div className="cookie-manager-backdrop" role="presentation" onMouseDown={closeManager}>
        <section
          className="cookie-manager reveal-fx"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-manager-title"
          onMouseDown={(event) => event.stopPropagation()}
        >
          <button className="modal-close" type="button" aria-label="Zavřít nastavení cookies" onClick={closeManager}>
            <X size={18} />
          </button>
          <div className="cookie-manager-head">
            <p className="section-label">Správa cookies</p>
            <h2 id="cookie-manager-title">Nastavení souhlasu</h2>
            <p>
              Technické cookies jsou potřebné pro přihlášení, bezpečnost a uložení voleb. Statistické a marketingové
              služby zapneme jen podle vašeho souhlasu.
            </p>
          </div>

          <div className="cookie-options">
            <AppCheckbox
              id="cookies-necessary"
              checked
              disabled
              onChange={() => undefined}
              label="Technické cookies"
              description="Nezbytné pro základní fungování webu, přihlášení a bezpečnost formulářů."
            />
            <AppCheckbox
              id="cookies-statistics"
              checked={statistics}
              onChange={setStatistics}
              label="Statistické cookies"
              description="Pomáhají zjistit, které části webu lidé používají. Slouží k anonymnímu zlepšování obsahu."
            />
            <AppCheckbox
              id="cookies-marketing"
              checked={marketing}
              onChange={setMarketing}
              label="Marketingové cookies"
              description="Používají se pro vložený obsah, kampaně a měření externích služeb, pokud je zapojíme."
            />
          </div>

          <div className="cookie-table-wrap" aria-label="Seznam cookies">
            <table className="cookie-table">
              <thead>
                <tr>
                  <th>Název</th>
                  <th>Služba</th>
                  <th>Kategorie účelu</th>
                  <th>Doba uložení</th>
                  <th>Správce dat</th>
                  <th>Zásady</th>
                </tr>
              </thead>
              <tbody>
                {cookieCatalog.map((item) => (
                  <tr key={`${item.name}-${item.service}`}>
                    <td><code>{item.name}</code></td>
                    <td>{item.service}</td>
                    <td><Badge tone={item.category === 'necessary' ? 'info' : item.category === 'statistics' ? 'success' : 'warning'}>{categoryLabels[item.category]}</Badge></td>
                    <td>{item.duration}</td>
                    <td>{item.owner}</td>
                    <td>
                      {item.policyUrl ? (
                        <a href={item.policyUrl} target="_blank" rel="noreferrer">Zásady</a>
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="cookie-manager-actions">
            <button className="button secondary" type="button" onClick={() => savePreferences(false, false)}>
              Pouze nezbytné
            </button>
            <button className="button secondary" type="button" onClick={() => savePreferences(true, true)}>
              Povolit vše
            </button>
            <button className="button primary" type="button" onClick={() => savePreferences()}>
              Uložit nastavení
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <section className={`cookie-consent reveal-fx${inline ? ' is-inline' : ''}`} aria-labelledby="cookie-consent-title">
      <div>
        <p className="section-label" id="cookie-consent-title">Cookies</p>
        <p>
          Používáme nezbytné cookies pro přihlášení, bezpečnost formulářů a uložení základního nastavení webu.
        </p>
      </div>
      <div className="cookie-consent-actions">
        <button className="button secondary" type="button" onClick={() => savePreferences(false, false)}>
          Pouze nezbytné
        </button>
        <button className="button secondary" type="button" onClick={openManager}>
          Spravovat
        </button>
        <button className="button primary" type="button" onClick={() => savePreferences(true, true)}>
          Přijmout vše
        </button>
      </div>
    </section>
  );
}

function WorkspaceSidebar<T extends string>({
  title,
  items,
  active,
  onSelect
}: {
  title: string;
  items: Array<WorkspaceNavItem<T>>;
  active: T;
  onSelect: (id: T) => void;
}) {
  return (
    <aside className="workspace-sidebar" aria-label={title}>
      <p className="section-label">{title}</p>
      <nav>
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.id} className={active === item.id ? 'active' : ''} type="button" onClick={() => onSelect(item.id)}>
              <Icon size={18} />
              <span>
                <strong>{item.label}</strong>
                <small>{item.text}</small>
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

function WorkspaceBottomNav<T extends string>({
  items,
  active,
  onSelect
}: {
  items: Array<WorkspaceNavItem<T>>;
  active: T;
  onSelect: (id: T) => void;
}) {
  const visibleItems = items.slice(0, 5);

  return (
    <nav className="workspace-bottom-nav" aria-label="Rychlá navigace">
      {visibleItems.map((item) => {
        const Icon = item.icon;
        return (
          <button key={item.id} className={active === item.id ? 'active' : ''} type="button" onClick={() => onSelect(item.id)}>
            <Icon size={18} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function WorkspaceTopbar({
  title,
  text,
  account,
  badge,
  onLogout,
  quickAction
}: {
  title: string;
  text: string;
  account: AuthAccount;
  badge: string;
  onLogout: () => void;
  quickAction?: React.ReactNode;
  notificationCount?: number;
  onNotificationsClick?: () => void;
}) {
  return (
    <div className="workspace-topbar">
      <div>
        <p className="section-label">{badge}</p>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
      <div className="workspace-actions">
        {quickAction}
        <div className="session-chip">
          <UserRound size={16} />
          <span>{account.name}</span>
        </div>
        <button className="button secondary" type="button" onClick={onLogout}>
          <LogOut size={18} /> Odhlásit
        </button>
      </div>
    </div>
  );
}

function WorkspacePlaceholder({
  title,
  text,
  items
}: {
  title: string;
  text: string;
  items: string[];
}) {
  return (
    <article className="admin-card workspace-placeholder">
      <h3>{title}</h3>
      <p>{text}</p>
      <div className="placeholder-list">
        {items.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </article>
  );
}

function AuthScreen({
  role,
  title,
  text,
  accounts,
  onLogin,
  onRegister,
  onLoginRequest,
  onRegisterRequest,
  onResetRequest,
  onResetConfirmRequest,
  onNotify,
  onOpenModal
}: {
  role: AuthRole;
  title: string;
  text: string;
  accounts: AuthAccount[];
  onLogin: (account: AuthAccount) => void;
  onRegister?: (account: AuthAccount) => void;
  onLoginRequest?: (credentials: LoginRequest) => Promise<AuthAccount | null>;
  onRegisterRequest?: (payload: RegisterRequest) => Promise<AuthAccount | null>;
  onResetRequest?: (email: string) => Promise<ApiPasswordResetRequest | null>;
  onResetConfirmRequest?: (payload: ResetConfirmRequest) => Promise<string>;
  onNotify: (tone: FeedbackTone, title: string, text?: string) => void;
  onOpenModal: (modal: Exclude<ModalState, null>) => void;
}) {
  const [mode, setMode] = React.useState<AuthMode>('login');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [messageTone, setMessageTone] = React.useState<FeedbackTone>('info');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [loginConsent, setLoginConsent] = React.useState(false);
  const [registrationConsent, setRegistrationConsent] = React.useState(false);
  const [resetToken, setResetToken] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');

  React.useEffect(() => {
    const hashQuery = window.location.hash.includes('?') ? window.location.hash.split('?')[1] : '';
    const query = window.location.search ? window.location.search.slice(1) : hashQuery;
    if (!query) return;
    const params = new URLSearchParams(query);
    const tokenFromLink = params.get('resetToken');
    const authNotice = params.get('auth');
    if (tokenFromLink) {
      setMode('reset-confirm');
      setResetToken(tokenFromLink);
      setMessageTone('info');
      setMessage('Reset token je načtený z odkazu. Nastavte nové heslo.');
      return;
    }
    if (authNotice === 'google-pending') {
      setMessageTone('success');
      setMessage('Registrace přes Google byla přijata a čeká na ověření administrátorem.');
    } else if (authNotice === 'google-inactive') {
      setMessageTone('warning');
      setMessage('Google účet existuje, ale čeká na ověření nebo aktivaci administrátorem.');
    } else if (authNotice === 'google-admin-denied') {
      setMessageTone('error');
      setMessage('Tento Google účet není aktivní administrátorský účet.');
    } else if (authNotice === 'google-error') {
      setMessageTone('error');
      setMessage('Přihlášení přes Google se nepodařilo. Zkuste to prosím znovu.');
    }
  }, [role]);

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setMessage('');
    const labels: Record<AuthMode, string> = {
      login: 'Přihlášení',
      register: 'Registrace uchazeče',
      reset: 'Obnova hesla',
      'reset-confirm': 'Nové heslo'
    };
    onNotify('info', 'Režim změněn', labels[nextMode]);
  };

  const startGoogleLogin = () => {
    const target = role === 'admin' ? '/admin' : '/klient';
    window.location.href = `/api/auth/google/start?role=${encodeURIComponent(role)}&next=${encodeURIComponent(target)}`;
  };

  const submitLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!loginConsent) {
      setMessageTone('warning');
      setMessage('Před přihlášením potvrďte vstup do chráněné zóny.');
      onNotify('warning', 'Potvrzení chybí', 'Zaškrtněte potvrzení u přihlašovacího formuláře.');
      return;
    }
    setIsSubmitting(true);
    setMessageTone('info');
    setMessage('Ověřuji přihlašovací údaje...');
    if (onLoginRequest) {
      try {
        const apiAccount = await onLoginRequest({ email, password, role });
        if (apiAccount) {
          onNotify('success', 'Přihlášení proběhlo', `Vítejte, ${apiAccount.name}.`);
          setMessage('');
          onLogin(apiAccount);
          return;
        }
      } catch (error) {
        if (error instanceof ApiRequestError && [400, 401, 403].includes(error.status)) {
          setIsSubmitting(false);
          setMessageTone('error');
          const apiMessage = error.status === 403 && error.message ? error.message : '';
          setMessage(
            role === 'client' && apiMessage
              ? apiMessage
              : role === 'client'
              ? 'Přihlášení se nepodařilo. Zkontrolujte e-mail, heslo a zda nejste v klientské zóně s admin účtem.'
              : 'Přihlášení se nepodařilo. Použijte aktivní administrátorský účet uložený v databázi.'
          );
          onNotify(
            role === 'client' && apiMessage ? 'warning' : 'error',
            'Přihlášení se nepodařilo',
            role === 'client' && apiMessage
              ? apiMessage
              : role === 'client'
                ? 'Pro admin účet použijte vstup do administrace.'
                : 'Zkontrolujte e-mail, heslo a zda je účet aktivní v DB.'
          );
          return;
        }
        setMessageTone('warning');
        setMessage(error instanceof Error ? error.message : 'Ověření účtu se nepodařilo. Zkuste to prosím znovu.');
        onNotify('warning', 'Ověření účtu selhalo', 'Zkuste to prosím znovu za chvíli.');
        if (role === 'admin') {
          setIsSubmitting(false);
          setMessageTone('error');
          setMessage(error instanceof Error ? error.message : 'Přihlášení administrace se nepodařilo.');
          onNotify('error', 'Přihlášení administrace selhalo', 'Zkontrolujte e-mail, heslo a oprávnění.');
          return;
        }
      }
    }
    const account = accounts.find(
      (item) => item.role === role && item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password
    );
    if (!account) {
      setIsSubmitting(false);
      setMessageTone('error');
      setMessage('Přihlášení se nepodařilo. Zkontrolujte e-mail a heslo.');
      onNotify('error', 'Přihlášení se nepodařilo', 'Zkontrolujte e-mail, heslo a typ účtu.');
      return;
    }
    onNotify('success', 'Přihlášení proběhlo', `Vítejte, ${account.name}.`);
    setMessage('');
    setIsSubmitting(false);
    onLogin(account);
  };

  const submitRegistration = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!onRegister) return;
    if (!registrationConsent) {
      setMessageTone('warning');
      setMessage('Pro vytvoření profilu je potřeba potvrdit souhlas se zpracováním údajů.');
      onNotify('warning', 'Souhlas chybí', 'Zaškrtněte souhlas v registračním formuláři.');
      return;
    }
    setIsSubmitting(true);
    setMessageTone('info');
    setMessage('Zakládám profil uchazeče...');
    if (onRegisterRequest) {
      try {
        const apiAccount = await onRegisterRequest({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          password
        });
        if (apiAccount) {
          onNotify('success', 'Registrace je hotová', 'Profil uchazeče byl vytvořen.');
          onLogin(apiAccount);
          return;
        }
        setIsSubmitting(false);
        setMessageTone('success');
        setMessage('Registrace byla přijata a čeká na ověření administrátorem. Jakmile ji admin aktivuje, půjde se přihlásit.');
        return;
      } catch (error) {
        setMessageTone('warning');
        setMessage(error instanceof Error ? error.message : 'Registrace se nepodařila. Zkuste to prosím znovu.');
        onNotify('warning', 'Registrace se nepodařila', 'Zkontrolujte údaje a zkuste formulář odeslat znovu.');
        if (error instanceof ApiRequestError && [400, 401, 403, 409].includes(error.status)) {
          setIsSubmitting(false);
          return;
        }
      }
    }
    const existing = accounts.some((item) => item.email.toLowerCase() === email.trim().toLowerCase());
    if (existing) {
      setIsSubmitting(false);
      setMessageTone('error');
      setMessage('Účet s tímto e-mailem už existuje.');
      onNotify('error', 'Registrace se nepodařila', 'Účet s tímto e-mailem už existuje.');
      return;
    }
    const account: AuthAccount = {
      id: crypto.randomUUID(),
      role: 'applicant',
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password,
      createdAt: todayIso()
    };
    onRegister(account);
    trackAnalyticsEvent('sign_up', {
      method: 'local',
      role: 'applicant',
      account_status: 'local_fallback'
    });
    onNotify('success', 'Registrace je hotová', 'Profil byl vytvořen.');
    setIsSubmitting(false);
    onLogin(account);
  };

  const submitReset = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessageTone('info');
    setMessage('Připravuji obnovu hesla...');
    let resetMessage = 'Pokud účet existuje, je připravený odkaz pro obnovu hesla.';
    if (onResetRequest) {
      try {
        const reset = await onResetRequest(email);
        if (reset?.message) resetMessage = reset.message;
        if (reset?.resetToken) {
          setResetToken(reset.resetToken);
          setMode('reset-confirm');
          setMessageTone('success');
          setMessage('Reset token je připravený. Zadejte nové heslo.');
          onNotify('success', 'Reset token připraven', 'Teď nastavte nové heslo.');
          return;
        }
      } catch {
        // Keep the confirmation neutral even when the mail service does not return a message.
      }
    }
    setIsSubmitting(false);
    setMessageTone('success');
    setMessage(resetMessage);
    onNotify('success', 'Obnova hesla připravena', resetMessage);
    onOpenModal({
      tone: 'info',
      title: 'Obnova hesla',
      text: resetMessage
    });
  };

  const submitResetConfirm = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!onResetConfirmRequest) return;
    setIsSubmitting(true);
    setMessageTone('info');
    setMessage('Nastavuji nové heslo...');
    try {
      const resetMessage = await onResetConfirmRequest({ token: resetToken, password: newPassword });
      setMessageTone('success');
      setMessage(resetMessage);
      setPassword('');
      setNewPassword('');
      setResetToken('');
      setMode('login');
      onNotify('success', 'Heslo změněno', resetMessage);
    } catch (error) {
      setMessageTone('error');
      setMessage(error instanceof Error ? error.message : 'Heslo se nepodařilo změnit.');
      onNotify('error', 'Reset hesla selhal', error instanceof Error ? error.message : 'Zkuste to prosím znovu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="auth-section">
      <div className="auth-card">
          <div className="auth-intro">
            <div className="auth-icon">{role === 'admin' ? <LockKeyhole size={28} /> : <UserRound size={28} />}</div>
            <p className="section-label">{role === 'admin' ? 'Administrace' : 'Klientská zóna'}</p>
            <Badge tone="info">
              {mode === 'login'
                ? 'Přihlášení'
                : mode === 'register'
                  ? 'Registrace uchazeče'
                  : mode === 'reset-confirm'
                    ? 'Nové heslo'
                    : 'Obnova hesla'}
            </Badge>
            <h1>{title}</h1>
            <p>{text}</p>
          </div>

        <div className="auth-panel">
          <div className="auth-switch" aria-label="Přepnutí přístupu">
            <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => switchMode('login')}>
              Přihlášení
            </button>
            {onRegister && (
              <button
                type="button"
                className={mode === 'register' ? 'active' : ''}
                onClick={() => switchMode('register')}
              >
                Registrace uchazeče
              </button>
            )}
          </div>

          {mode === 'login' && (
            <form className="auth-form" onSubmit={submitLogin}>
              <label>
                E-mail
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
              </label>
              <PasswordField id={`${role}-login-password`} label="Heslo" value={password} onChange={setPassword} />
              <AppCheckbox
                id={`${role}-login-consent`}
                checked={loginConsent}
                onChange={setLoginConsent}
                required
                label="Potvrzuji vstup do chráněné zóny"
                description="Přihlašovací údaje jsou určeny pouze pro klienta nebo oprávněného pracovníka."
              />
              <div className="form-actions">
                <button className="button primary" type="submit" disabled={isSubmitting}>
                  <KeyRound size={18} /> {isSubmitting ? 'Ověřuji...' : 'Přihlásit'}
                </button>
                <button
                  className="button secondary"
                  type="button"
                  onClick={() => switchMode('reset')}
                >
                  Zapomenuté heslo
                </button>
              </div>
              <button className="button secondary google-login-button" type="button" onClick={startGoogleLogin}>
                <Mail size={18} /> Pokračovat přes Google
              </button>
            </form>
          )}

          {mode === 'register' && onRegister && (
            <form className="auth-form" onSubmit={submitRegistration}>
              <label>
                Jméno a příjmení
                <input value={name} onChange={(event) => setName(event.target.value)} required />
              </label>
              <label>
                E-mail
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
              </label>
              <label>
                Telefon
                <input value={phone} onChange={(event) => setPhone(event.target.value)} />
              </label>
              <PasswordField
                id="client-register-password"
                label="Heslo"
                value={password}
                onChange={setPassword}
                autoComplete="new-password"
              />
              <AppCheckbox
                id="client-register-consent"
                checked={registrationConsent}
                onChange={setRegistrationConsent}
                required
                label="Souhlasím se zpracováním údajů"
                description="Údaje slouží k registraci klientského profilu a komunikaci v rámci projektu REST||ART Integrace."
              />
              <button className="button primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Zakládám profil...' : 'Vytvořit profil'}
              </button>
            </form>
          )}

          {mode === 'reset' && (
            <form className="auth-form" onSubmit={submitReset}>
              <label>
                E-mail pro obnovu
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
              </label>
              <div className="form-actions">
                <button className="button primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Odesílám...' : 'Odeslat obnovu'}
                </button>
                <button className="button secondary" type="button" onClick={() => switchMode('login')}>
                  Zpět na přihlášení
                </button>
              </div>
            </form>
          )}

          {mode === 'reset-confirm' && (
            <form className="auth-form" onSubmit={submitResetConfirm}>
              <label>
                Reset token
                <input value={resetToken} onChange={(event) => setResetToken(event.target.value)} required />
              </label>
              <PasswordField
                id={`${role}-reset-new-password`}
                label="Nové heslo"
                value={newPassword}
                onChange={setNewPassword}
                autoComplete="new-password"
              />
              <div className="form-actions">
                <button className="button primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Ukládám...' : 'Nastavit nové heslo'}
                </button>
                <button className="button secondary" type="button" onClick={() => switchMode('login')}>
                  Zpět na přihlášení
                </button>
              </div>
            </form>
          )}

          {message && <p className={`auth-message ${messageTone}`}>{message}</p>}
        </div>
      </div>
    </section>
  );
}

function avatarFilter(filter: string) {
  if (filter === 'mono') return 'grayscale(1) contrast(1.08)';
  if (filter === 'warm') return 'sepia(0.22) saturate(1.12) contrast(1.04)';
  if (filter === 'crisp') return 'contrast(1.18) saturate(1.12)';
  if (filter === 'soft') return 'brightness(1.05) saturate(0.9)';
  return 'none';
}

function ClientProfile({
  account,
  clientDocuments,
  notifications,
  projectApplications,
  onNotificationReadRequest,
  onProjectApplicationSubmit,
  onPasswordResetRequest,
  onLogout,
  onNotify
}: {
  account: AuthAccount;
  clientDocuments: ClientDocument[];
  notifications: NotificationItem[];
  projectApplications: ProjectApplication[];
  onNotificationReadRequest?: (notificationId: string) => Promise<void>;
  onProjectApplicationSubmit?: (application: ProjectApplicationDraft) => Promise<ProjectApplication>;
  onPasswordResetRequest?: (email: string) => Promise<ApiPasswordResetRequest | null>;
  onLogout: () => void;
  onNotify: (tone: FeedbackTone, title: string, text?: string) => void;
}) {
  const [profile, setProfile] = useStoredState<ClientProfileDraft>(`restart-client-profile-${account.id}`, {
    name: account.name,
    phone: account.phone,
    note: '',
    avatar: '',
    source: '',
    zoom: 1,
    offsetX: 0,
    offsetY: 0,
    rotation: 0,
    filter: 'natural'
  });
  const [profileMessage, setProfileMessage] = React.useState('');
  const [activeSection, setActiveSection] = React.useState<ClientSection>('dashboard');
  const [settingsDraft, setSettingsDraft] = useStoredState<ClientSettingsDraft>(`restart-client-settings-${account.id}`, {
    privacyMode: 'Profil je viditelný pouze pracovníkům projektu',
    documentEmails: true,
    commentEmails: true,
    twoFactorEnabled: false
  });
  const [applicationDraft, setApplicationDraft] = useStoredState<ProjectApplicationDraft>(`restart-client-application-${account.id}`, {
    requestedRole: 'client',
    phone: account.phone,
    motivation: '',
    availability: '',
    contribution: '',
    note: ''
  });
  const [applicationMessage, setApplicationMessage] = React.useState('');
  const [isSubmittingApplication, setIsSubmittingApplication] = React.useState(false);
  const [notificationAuditSearch, setNotificationAuditSearch] = React.useState('');
  const [passwordResetMessage, setPasswordResetMessage] = React.useState('');
  const [isRequestingPasswordReset, setIsRequestingPasswordReset] = React.useState(false);
  const [previousAvatarDraft, setPreviousAvatarDraft] = React.useState<Pick<
    ClientProfileDraft,
    'source' | 'avatar' | 'zoom' | 'offsetX' | 'offsetY' | 'rotation' | 'filter'
  > | null>(null);
  const displayName = profile.name.trim() || account.name;
  const displayPhone = profile.phone.trim() || account.phone;
  const isAdminProfile = account.role === 'admin';
  const isApplicantProfile = account.role === 'applicant';
  const workspaceBadge = isAdminProfile ? 'Admin profil' : roleLabels[account.role] || 'Klientská zóna';
  const workspaceTitle = isAdminProfile ? 'Profil administrátora' : isApplicantProfile ? 'Profil uchazeče' : roleLabels[account.role] || 'Přihlášený uživatel';
  const applicantSections = new Set<ClientSection>(['dashboard', 'profile', 'application', 'notifications', 'settings']);
  const visibleClientNavItems = isApplicantProfile ? clientNavItems.filter((item) => applicantSections.has(item.id)) : clientNavItems;
  React.useEffect(() => {
    const sectionParam = new URLSearchParams(window.location.search).get('section') as ClientSection | null;
    if (!sectionParam || !clientNavItems.some((item) => item.id === sectionParam)) return;
    if (isApplicantProfile && !applicantSections.has(sectionParam)) return;
    setActiveSection(sectionParam);
  }, [isApplicantProfile]);
  React.useEffect(() => {
    if (isApplicantProfile && !applicantSections.has(activeSection)) {
      setActiveSection('dashboard');
    }
  }, [activeSection, isApplicantProfile]);
  const profileCompletion = Math.round(
    ([
      Boolean(displayName),
      Boolean(account.email),
      Boolean(displayPhone),
      Boolean(profile.note.trim()),
      Boolean(profile.avatar || profile.source)
    ].filter(Boolean).length /
      5) *
      100
  );
  const visibleDocuments = clientDocuments
    .filter((document) => {
      if (isAdminProfile) return true;
      const haystack = `${document.userId || ''} ${document.title} ${document.notes}`.toLowerCase();
      return document.userId === account.id || haystack.includes(account.email.toLowerCase()) || haystack.includes(displayName.toLowerCase());
    })
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());
  const visibleNotifications = notifications
    .filter((notification) => isAdminProfile || !notification.recipientId || notification.recipientId === account.id)
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());
  const activeNotifications = visibleNotifications.filter((notification) => !notification.readAt);
  const archivedNotifications = visibleNotifications.filter((notification) => notification.readAt);
  const unreadNotifications = visibleNotifications.filter((notification) => !notification.readAt);
  const activityItems = [
    ...visibleDocuments.slice(0, 5).map((document) => ({
      id: `document-${document.id}`,
      title: document.title,
      text: `${document.status || 'dokument'} - ${document.documentType || 'soubor'}`,
      date: document.createdAt,
      tone: document.signedAt ? 'success' : 'warning'
    })),
    ...visibleNotifications.slice(0, 5).map((notification) => ({
      id: `notification-${notification.id}`,
      title: notification.title,
      text: notification.category,
      date: notification.createdAt,
      tone: notification.readAt ? 'info' : 'warning'
    })),
    {
      id: 'profile-created',
      title: 'Profil vytvořen',
      text: account.email,
      date: account.createdAt,
      tone: 'success'
    }
  ].sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime());
  const pendingClientDocuments = visibleDocuments.filter(
    (document) => !document.signedAt && ['prepared', 'pending', 'draft'].includes(document.status.toLowerCase())
  );
  const sortedProjectApplications = projectApplications
    .filter((application) => isAdminProfile || application.userId === account.id)
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());
  const latestApplication = sortedProjectApplications[0];
  const pendingApplication = sortedProjectApplications.find((application) => application.status === 'pending');
  const applicationStatusTone: FeedbackTone =
    latestApplication?.status === 'approved' ? 'success' : latestApplication?.status === 'rejected' ? 'warning' : latestApplication ? 'info' : 'warning';
  const clientWorkflow = [
    {
      title: 'Profil',
      text: profileCompletion >= 80 ? 'Profil je pro pracovníka dobře čitelný.' : 'Doplňte telefon, poznámku nebo profilovou fotku.',
      tone: profileCompletion >= 80 ? 'success' : 'warning'
    },
    {
      title: 'Žádost',
      text: latestApplication
        ? latestApplication.status === 'pending'
          ? `Žádost o roli ${roleLabels[latestApplication.requestedRole]} čeká na schválení.`
          : latestApplication.status === 'approved'
            ? `Žádost byla schválena jako ${roleLabels[latestApplication.requestedRole]}.`
            : 'Žádost byla uzavřena, můžete podat novou po domluvě s týmem.'
        : 'Podejte žádost o vstup jako klient, dobrovolník nebo podporovatel.',
      tone: latestApplication?.status === 'approved' ? 'success' : 'warning'
    },
    {
      title: 'Dokumenty',
      text:
        pendingClientDocuments.length > 0
          ? `${pendingClientDocuments.length} dokument čeká na podpis nebo doplnění.`
          : visibleDocuments.length > 0
            ? 'Dokumenty jsou uložené v osobní zóně.'
            : 'Zatím čekáte na první připravený dokument.',
      tone: pendingClientDocuments.length > 0 ? 'warning' : visibleDocuments.length > 0 ? 'success' : 'info'
    },
    {
      title: 'Zprávy',
      text: unreadNotifications.length > 0 ? `${unreadNotifications.length} nepřečtené upozornění.` : 'Nemáte žádné nepřečtené upozornění.',
      tone: unreadNotifications.length > 0 ? 'warning' : 'success'
    },
    {
      title: 'Další krok',
      text:
        pendingClientDocuments.length > 0
          ? 'Otevřete dokumenty a domluvte podpis s pracovníkem.'
          : unreadNotifications.length > 0
            ? 'Přečtěte poslední zprávu od týmu.'
            : 'Udržujte profil aktuální a napište si o další formulář podle potřeby.',
      tone: pendingClientDocuments.length > 0 || unreadNotifications.length > 0 ? 'warning' : 'info'
    }
  ];

  const updateProfile = <K extends keyof ClientProfileDraft>(key: K, value: ClientProfileDraft[K]) => {
    setProfile((current) => ({ ...current, [key]: value }));
    setProfileMessage('');
  };

  const updateAvatarField = <K extends 'zoom' | 'offsetX' | 'offsetY' | 'rotation' | 'filter'>(
    key: K,
    value: ClientProfileDraft[K]
  ) => {
    setPreviousAvatarDraft({
      source: profile.source,
      avatar: profile.avatar,
      zoom: profile.zoom,
      offsetX: profile.offsetX,
      offsetY: profile.offsetY,
      rotation: profile.rotation,
      filter: profile.filter
    });
    updateProfile(key, value);
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setProfile((current) => ({
        ...current,
        source: String(reader.result),
        avatar: '',
        zoom: 1,
        offsetX: 0,
        offsetY: 0,
        rotation: 0,
        filter: 'natural'
      }));
      setProfileMessage('Fotka je připravená k úpravě.');
      onNotify('info', 'Fotka je nahraná', 'Teď můžete upravit ořez, zoom, rotaci a filtr.');
    };
    reader.readAsDataURL(file);
  };

  const resetAvatar = () => {
    setPreviousAvatarDraft({
      source: profile.source,
      avatar: profile.avatar,
      zoom: profile.zoom,
      offsetX: profile.offsetX,
      offsetY: profile.offsetY,
      rotation: profile.rotation,
      filter: profile.filter
    });
    setProfile((current) => ({
      ...current,
      zoom: 1,
      offsetX: 0,
      offsetY: 0,
      rotation: 0,
      filter: 'natural'
    }));
    onNotify('info', 'Úpravy avataru resetovány', 'Ořez, zoom, rotace a filtr jsou zpět na výchozí hodnotě.');
  };

  const undoAvatar = () => {
    if (!previousAvatarDraft) {
      onNotify('warning', 'Není co vrátit', 'Nejdřív proveďte úpravu avataru.');
      return;
    }
    setProfile((current) => ({ ...current, ...previousAvatarDraft }));
    setPreviousAvatarDraft(null);
    onNotify('info', 'Úprava vrácena', 'Avatar je zpět v předchozím stavu.');
  };

  const saveAvatar = () => {
    if (!profile.source) {
      onNotify('warning', 'Nejdřív nahrajte fotku', 'Avatar není z čeho uložit.');
      return;
    }
    const image = new Image();
    image.onload = () => {
      const size = 512;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const context = canvas.getContext('2d');
      if (!context) return;
      context.fillStyle = '#f5f8f4';
      context.fillRect(0, 0, size, size);
      context.translate(size / 2 + profile.offsetX * 1.8, size / 2 + profile.offsetY * 1.8);
      context.rotate((profile.rotation * Math.PI) / 180);
      context.filter = avatarFilter(profile.filter);
      const scale = Math.max(size / image.width, size / image.height) * profile.zoom;
      context.drawImage(image, (-image.width * scale) / 2, (-image.height * scale) / 2, image.width * scale, image.height * scale);
      setProfile((current) => ({ ...current, avatar: canvas.toDataURL('image/png') }));
      setProfileMessage('Avatar je uložený v profilu.');
      onNotify('success', 'Avatar je uložený', 'Profilová fotka se uložila v uživatelském profilu.');
    };
    image.src = profile.source;
  };

  const saveProfile = () => {
    setProfileMessage('Profilové údaje jsou uložené v prohlížeči.');
    onNotify('success', 'Profil je uložený', 'Profilové údaje jsou uložené v prohlížeči.');
  };

  const markClientNotificationRead = async (notification: NotificationItem) => {
    if (notification.readAt) {
      onNotify('info', 'Notifikace už je přečtená', notification.title);
      return;
    }
    if (!onNotificationReadRequest) {
      onNotify('warning', 'Notifikace nejde označit', 'Zkuste akci zopakovat později.');
      return;
    }
    try {
      await onNotificationReadRequest(notification.id);
      onNotify('success', 'Notifikace označena', notification.title);
    } catch (error) {
      onNotify('error', 'Notifikace se nepodařila uložit', error instanceof Error ? error.message : 'Zkuste to prosím znovu.');
    }
  };

  const archiveClientNotification = async (notification: NotificationItem) => {
    if (notification.readAt) {
      onNotify('info', 'Notifikace je v audit logu', notification.title);
      return;
    }
    if (!onNotificationReadRequest) {
      onNotify('warning', 'Notifikace nejde archivovat', 'Zkuste akci zopakovat později.');
      return;
    }
    try {
      await onNotificationReadRequest(notification.id);
      onNotify('success', 'Přesunuto do audit logu', notification.title);
    } catch (error) {
      onNotify('error', 'Notifikaci se nepodařilo archivovat', error instanceof Error ? error.message : 'Zkuste to prosím znovu.');
    }
  };

  const saveAccountSettings = () => {
    onNotify('success', 'Nastavení účtu uloženo', 'Předvolby soukromí a upozornění jsou uložené v profilu.');
  };

  const updateApplicationDraft = <K extends keyof ProjectApplicationDraft>(key: K, value: ProjectApplicationDraft[K]) => {
    setApplicationDraft((current) => ({ ...current, [key]: value }));
    setApplicationMessage('');
  };

  const submitApplication = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!onProjectApplicationSubmit) {
      onNotify('warning', 'Žádost teď nejde odeslat', 'Zkuste to prosím znovu později.');
      return;
    }
    if (pendingApplication) {
      setApplicationMessage('Už máte žádost čekající na vyřízení.');
      onNotify('warning', 'Žádost už čeká', 'Nejdřív ji musí administrátor vyřídit.');
      return;
    }
    if (!applicationDraft.motivation.trim()) {
      setApplicationMessage('Doplňte prosím krátké zdůvodnění žádosti.');
      onNotify('warning', 'Chybí zdůvodnění', 'Napište pár vět, proč se chcete zapojit.');
      return;
    }
    setIsSubmittingApplication(true);
    setApplicationMessage('Odesílám žádost...');
    try {
      const saved = await onProjectApplicationSubmit({
        ...applicationDraft,
        phone: applicationDraft.phone || displayPhone
      });
      setApplicationMessage(`Žádost o roli ${roleLabels[saved.requestedRole]} byla odeslána a čeká na schválení.`);
      onNotify('success', 'Žádost odeslána', 'Administrátor ji uvidí v přehledu žádostí.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Žádost se nepodařilo odeslat.';
      setApplicationMessage(message);
      onNotify('error', 'Žádost se nepodařilo odeslat', message);
    } finally {
      setIsSubmittingApplication(false);
    }
  };

  const requestPasswordResetFromProfile = async () => {
    if (!onPasswordResetRequest) {
      onNotify('warning', 'Reset hesla není dostupný', 'Zkuste akci zopakovat později.');
      return;
    }
    setIsRequestingPasswordReset(true);
    setPasswordResetMessage('Odesílám žádost o obnovu hesla...');
    try {
      const result = await onPasswordResetRequest(account.email);
      const message = result?.message || 'Pokud účet existuje, dorazí instrukce pro obnovu hesla.';
      setPasswordResetMessage(message);
      onNotify('success', 'Obnova hesla připravena', message);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Žádost se nepodařilo odeslat.';
      setPasswordResetMessage(message);
      onNotify('error', 'Obnova hesla selhala', message);
    } finally {
      setIsRequestingPasswordReset(false);
    }
  };

  const requestClientDocument = () => {
    const subject = encodeURIComponent(`Žádost o dokument - ${displayName}`);
    const body = encodeURIComponent(
      [
        `Jméno: ${displayName}`,
        `E-mail: ${account.email}`,
        `Telefon: ${displayPhone || '-'}`,
        '',
        'Prosím o přípravu dokumentu nebo formuláře do klientské zóny.',
        'Poznámka klienta:',
        profile.note.trim() || '-'
      ].join('\n')
    );
    onNotify('success', 'Žádost je připravená', 'Otevře se e-mail pro pracovníka REST||ART Integrace.');
    window.location.href = `mailto:restartintegrace@dk-i.cz?subject=${subject}&body=${body}`;
  };

  const currentClientNav = visibleClientNavItems.find((item) => item.id === activeSection) ?? visibleClientNavItems[0];
  const normalizedNotificationAuditSearch = notificationAuditSearch.trim().toLowerCase();
  const filteredArchivedNotifications = archivedNotifications.filter((notification) => {
    if (!normalizedNotificationAuditSearch) return true;
    const haystack = `${notification.title} ${notification.body} ${notification.category} ${new Date(notification.createdAt).toLocaleString('cs-CZ')}`.toLowerCase();
    return haystack.includes(normalizedNotificationAuditSearch);
  });
  const avatarEditor = (
    <article className="avatar-editor">
      <h2>Avatar editor</h2>
      <label className="upload-drop">
        <Upload size={20} />
        <span>Nahrát fotku</span>
        <input type="file" accept="image/*" onChange={handleAvatarUpload} />
      </label>
      <div className="avatar-preview">
        {profile.source ? (
          <img
            src={profile.source}
            alt=""
            style={{
              filter: avatarFilter(profile.filter),
              transform: `translate(${profile.offsetX}px, ${profile.offsetY}px) rotate(${profile.rotation}deg) scale(${profile.zoom})`
            }}
          />
        ) : profile.avatar ? (
          <img src={profile.avatar} alt="" />
        ) : (
          <UserRound size={54} />
        )}
      </div>
      <div className="avatar-controls">
        <label>
          Crop / zoom
          <input
            type="range"
            min="1"
            max="2.4"
            step="0.05"
            value={profile.zoom}
            onChange={(event) => updateAvatarField('zoom', Number(event.target.value))}
          />
        </label>
        <label>
          Crop X
          <input
            type="range"
            min="-90"
            max="90"
            value={profile.offsetX}
            onChange={(event) => updateAvatarField('offsetX', Number(event.target.value))}
          />
        </label>
        <label>
          Crop Y
          <input
            type="range"
            min="-90"
            max="90"
            value={profile.offsetY}
            onChange={(event) => updateAvatarField('offsetY', Number(event.target.value))}
          />
        </label>
        <label>
          Rotace
          <input
            type="range"
            min="-30"
            max="30"
            value={profile.rotation}
            onChange={(event) => updateAvatarField('rotation', Number(event.target.value))}
          />
        </label>
        <label>
          Filtr
          <select value={profile.filter} onChange={(event) => updateAvatarField('filter', event.target.value)}>
            <option value="natural">Natural</option>
            <option value="soft">Soft</option>
            <option value="crisp">Crisp</option>
            <option value="warm">Warm</option>
            <option value="mono">Mono</option>
          </select>
        </label>
      </div>
      <div className="form-actions">
        <button className="button secondary" type="button" onClick={undoAvatar}>
          <Undo2 size={18} /> Undo
        </button>
        <button className="button secondary" type="button" onClick={resetAvatar}>
          <RotateCcw size={18} /> Reset
        </button>
        <button className="button primary" type="button" onClick={saveAvatar} disabled={!profile.source}>
          <Save size={18} /> Uložit avatar
        </button>
      </div>
    </article>
  );

  return (
    <section className="client-section">
      <div className="workspace-layout client-workspace">
        <WorkspaceSidebar title="Uživatelské menu" items={visibleClientNavItems} active={activeSection} onSelect={setActiveSection} />
        <div className="workspace-main">
          <WorkspaceTopbar
            title={activeSection === 'dashboard' ? displayName : currentClientNav.label}
            text={currentClientNav.text}
            account={account}
            badge={workspaceBadge}
            onLogout={onLogout}
            quickAction={<Badge tone="success">{workspaceTitle}</Badge>}
          />

          {activeSection === 'dashboard' && (
            <div className="client-dashboard">
              <article className="client-summary-card">
                <div className="client-avatar" aria-label="Avatar klienta">
                  {profile.avatar || profile.source ? <img src={profile.avatar || profile.source} alt="" /> : <UserRound size={42} />}
                </div>
                <h2>{displayName}</h2>
                <p>{account.email}</p>
                <div className="status-line">
                  <span>Stav účtu</span>
                  <strong><Badge tone={isApplicantProfile ? applicationStatusTone : 'success'}>{roleLabels[account.role] || account.role}</Badge></strong>
                </div>
              </article>
              <article>
                <h2>Přehled účtu</h2>
                <p>Soukromý přehled kontaktů, programu, domluvených kroků a dokumentů.</p>
                <dl>
                  <div>
                    <dt>Telefon</dt>
                    <dd>{displayPhone || '-'}</dd>
                  </div>
                  <div>
                    <dt>Dokumenty</dt>
                    <dd>{visibleDocuments.length}</dd>
                  </div>
                  <div>
                    <dt>Nepřečtené zprávy</dt>
                    <dd>{unreadNotifications.length}</dd>
                  </div>
                  <div>
                    <dt>Profil vytvořen</dt>
                    <dd>{new Date(account.createdAt).toLocaleDateString('cs-CZ')}</dd>
                  </div>
                </dl>
              </article>
              <article className="client-progress-card">
                <h2>Dokončení profilu</h2>
                <div className="progress-meter" aria-label={`Profil vyplněn z ${profileCompletion} procent`}>
                  <span style={{ width: `${profileCompletion}%` }} />
                </div>
                <strong>{profileCompletion} %</strong>
                <p>Doplňte telefon, poznámku a profilovou fotku, aby měl pracovník rychlejší kontext.</p>
              </article>
              <article className="client-wide-card client-workflow-card">
                <div className="client-card-heading">
                  <div>
                    <h2>Stav spolupráce</h2>
                    <p>Krátký přehled profilu, dokumentů, zpráv a dalšího kroku v klientské zóně.</p>
                  </div>
                  <Badge tone={pendingClientDocuments.length > 0 ? 'warning' : 'success'}>
                    {pendingClientDocuments.length > 0 ? 'Čeká akce' : 'Připraveno'}
                  </Badge>
                </div>
                <div className="client-workflow-list">
                  {clientWorkflow.map((item, index) => (
                    <div key={item.title} className={`client-workflow-step tone-${item.tone}`}>
                      <span>{index + 1}</span>
                      <div>
                        <strong>{item.title}</strong>
                        <p>{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
              <article>
                <h2>Poslední notifikace</h2>
                <div className="client-notification-list compact">
                  {visibleNotifications.length === 0 && <p className="empty-note">Zatím tu nejsou žádné zprávy.</p>}
                  {visibleNotifications.slice(0, 3).map((notification) => (
                    <button key={notification.id} type="button" className={`${notification.readAt ? 'read' : ''} tone-${toFeedbackTone(notification.tone)}`} onClick={() => markClientNotificationRead(notification)}>
                      <Badge tone={(notification.tone as FeedbackTone) || 'info'}>{notification.category}</Badge>
                      <strong>{notification.title}</strong>
                      <span>{notification.body}</span>
                    </button>
                  ))}
                </div>
              </article>
              <article>
                <h2>Rychlé akce</h2>
                <div className="quick-action-grid">
                  <button type="button" onClick={() => setActiveSection('profile')}>Upravit profil</button>
                  <button type="button" onClick={() => setActiveSection('application')}>Žádost o vstup</button>
                  {!isApplicantProfile && <button type="button" onClick={() => setActiveSection('avatar')}>Změnit avatar</button>}
                  {!isApplicantProfile && <button type="button" onClick={() => setActiveSection('documents')}>Moje dokumenty</button>}
                  {!isApplicantProfile && <button type="button" onClick={requestClientDocument}>Požádat o formulář</button>}
                </div>
              </article>
            </div>
          )}

          {activeSection === 'profile' && (
            <div className="client-dashboard">
              <article className="profile-editor">
                <h2>Můj profil</h2>
                <label>
                  Zobrazované jméno
                  <input value={profile.name} onChange={(event) => updateProfile('name', event.target.value)} />
                </label>
                <label>
                  Telefon
                  <input value={profile.phone} onChange={(event) => updateProfile('phone', event.target.value)} />
                </label>
                <label>
                  Bio / poznámka pro pracovníka
                  <textarea rows={4} value={profile.note} onChange={(event) => updateProfile('note', event.target.value)} />
                </label>
                <button className="button primary" type="button" onClick={saveProfile}>
                  <Save size={18} /> Uložit profil
                </button>
                {profileMessage && <p className="auth-message">{profileMessage}</p>}
              </article>
              <article>
                <h2>Kontakty</h2>
                <dl>
                  <div>
                    <dt>E-mail</dt>
                    <dd>{account.email}</dd>
                  </div>
                  <div>
                    <dt>Telefon</dt>
                    <dd>{displayPhone || '-'}</dd>
                  </div>
                  <div>
                    <dt>Profil vytvořen</dt>
                    <dd>{new Date(account.createdAt).toLocaleDateString('cs-CZ')}</dd>
                  </div>
                </dl>
              </article>
            </div>
          )}

          {activeSection === 'application' && (
            <div className="client-dashboard">
              <article className="client-wide-card project-application-card">
                <div className="client-card-heading">
                  <div>
                    <h2>Žádost o vstup do projektu</h2>
                    <p>Vyberte, jak se chcete zapojit. Žádost po odeslání zkontroluje administrátor a schválí cílovou roli účtu.</p>
                  </div>
                  <Badge tone={applicationStatusTone}>
                    {latestApplication ? latestApplication.status === 'pending' ? 'Čeká na schválení' : latestApplication.status === 'approved' ? 'Schváleno' : 'Uzavřeno' : 'Nová žádost'}
                  </Badge>
                </div>
                {latestApplication && (
                  <div className="application-status-panel">
                    <span>Poslední žádost</span>
                    <strong>{roleLabels[latestApplication.requestedRole]} - {latestApplication.status === 'pending' ? 'čeká' : latestApplication.status === 'approved' ? 'schválena' : 'zamítnuta'}</strong>
                    <p>{latestApplication.adminNote || latestApplication.note || 'Bez doplňující poznámky.'}</p>
                    <small>{new Date(latestApplication.createdAt).toLocaleString('cs-CZ')}</small>
                  </div>
                )}
                <form className="profile-editor application-form" onSubmit={submitApplication}>
                  <fieldset className="application-role-grid" disabled={Boolean(pendingApplication) || isSubmittingApplication}>
                    <legend>Chci se zapojit jako</legend>
                    {applicationRoleOptions.map((option) => (
                      <label key={option.value} className={applicationDraft.requestedRole === option.value ? 'selected' : ''}>
                        <input
                          type="radio"
                          name="requestedRole"
                          value={option.value}
                          checked={applicationDraft.requestedRole === option.value}
                          onChange={() => updateApplicationDraft('requestedRole', option.value)}
                        />
                        <strong>{option.label}</strong>
                        <span>{option.description}</span>
                      </label>
                    ))}
                  </fieldset>
                  <label>
                    Telefon pro domluvu
                    <input value={applicationDraft.phone} onChange={(event) => updateApplicationDraft('phone', event.target.value)} placeholder={displayPhone || '+420 ...'} />
                  </label>
                  <label>
                    Proč se chcete zapojit?
                    <textarea rows={4} value={applicationDraft.motivation} onChange={(event) => updateApplicationDraft('motivation', event.target.value)} required />
                  </label>
                  <label>
                    Časové možnosti / forma zapojení
                    <textarea rows={3} value={applicationDraft.availability} onChange={(event) => updateApplicationDraft('availability', event.target.value)} />
                  </label>
                  <label>
                    Jakou podporu můžete nabídnout nebo potřebujete?
                    <textarea rows={3} value={applicationDraft.contribution} onChange={(event) => updateApplicationDraft('contribution', event.target.value)} />
                  </label>
                  <label>
                    Poznámka
                    <textarea rows={3} value={applicationDraft.note} onChange={(event) => updateApplicationDraft('note', event.target.value)} />
                  </label>
                  <div className="form-actions">
                    <button className="button primary" type="submit" disabled={Boolean(pendingApplication) || isSubmittingApplication}>
                      <Mail size={18} /> {isSubmittingApplication ? 'Odesílám...' : pendingApplication ? 'Žádost čeká' : 'Odeslat žádost'}
                    </button>
                  </div>
                  {applicationMessage && <p className="auth-message">{applicationMessage}</p>}
                </form>
              </article>
            </div>
          )}

          {activeSection === 'avatar' && <div className="client-dashboard">{avatarEditor}</div>}

          {activeSection === 'documents' && (
            <div className="client-dashboard">
              <article className="client-wide-card">
                <div className="client-card-heading">
                  <div>
                    <h2>Moje dokumenty</h2>
                    <p>Připravené formuláře, soubory k podpisu a historie uložených dokumentů.</p>
                  </div>
                  <button className="button secondary" type="button" onClick={requestClientDocument}>
                    <Mail size={18} /> Požádat o dokument
                  </button>
                </div>
                <div className="client-document-list">
                  {visibleDocuments.length === 0 && (
                    <div className="empty-action-state">
                      <p className="empty-note">Zatím tu není žádný dokument. Jakmile pracovník připraví formulář, zobrazí se tady.</p>
                      <button className="button primary" type="button" onClick={requestClientDocument}>
                        <Mail size={18} /> Požádat pracovníka
                      </button>
                    </div>
                  )}
                  {visibleDocuments.map((document) => (
                    <article key={document.id}>
                      <div>
                        <strong>{document.title}</strong>
                        <span>{document.documentType} - {document.status}</span>
                        <small>{new Date(document.createdAt).toLocaleString('cs-CZ')}</small>
                      </div>
                      <Badge tone={document.signedAt ? 'success' : 'warning'}>{document.signedAt ? 'Podepsáno' : 'K podpisu'}</Badge>
                      {document.fileUrl && (
                        <a className="button secondary" href={resolvePublicFileUrl(document.fileUrl)} target="_blank" rel="noreferrer">
                          <FolderOpen size={18} /> Otevřít
                        </a>
                      )}
                    </article>
                  ))}
                </div>
              </article>
            </div>
          )}

          {activeSection === 'activity' && (
            <div className="client-dashboard">
              <article className="client-wide-card">
                <h2>Moje aktivita</h2>
                <p>Historie změn profilu, dokumentů a důležitých upozornění.</p>
                <div className="activity-list timeline-list">
                  {activityItems.map((item) => (
                    <span key={item.id}>
                      <Badge tone={item.tone as FeedbackTone}>{new Date(item.date).toLocaleDateString('cs-CZ')}</Badge>
                      <strong>{item.title}</strong>
                      <small>{item.text}</small>
                    </span>
                  ))}
                </div>
              </article>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="client-dashboard">
              <article className="client-wide-card">
                <div className="client-card-heading">
                  <div>
                    <h2>Notifikace</h2>
                    <p>Nové zprávy, potvrzení, připomínky a systémová upozornění.</p>
                  </div>
                  <button className="button secondary" type="button" onClick={requestClientDocument}>
                    <Mail size={18} /> Napsat pracovníkovi
                  </button>
                </div>
                <div className="client-notification-list">
                  {activeNotifications.length === 0 && (
                    <div className="empty-action-state">
                      <p className="empty-note">Nemáte žádné aktivní notifikace. Vyřízené zprávy najdete níže v audit logu.</p>
                      <button className="button primary" type="button" onClick={requestClientDocument}>
                        <Mail size={18} /> Poslat žádost
                      </button>
                    </div>
                  )}
                  {activeNotifications.map((notification) => (
                    <article key={notification.id} className={`client-notification-item ${notification.readAt ? 'read' : ''} tone-${toFeedbackTone(notification.tone)}`}>
                      <button className="client-notification-main" type="button" onClick={() => markClientNotificationRead(notification)}>
                        <span className="client-notification-meta">
                          <Badge tone={(notification.tone as FeedbackTone) || 'info'}>{notification.category}</Badge>
                          <small>{new Date(notification.createdAt).toLocaleString('cs-CZ')}</small>
                        </span>
                        <strong>{notification.title}</strong>
                        <span className="client-notification-body">{notification.body}</span>
                      </button>
                      <aside className="notification-cursor-card" aria-hidden="true">
                        <strong>{notification.title}</strong>
                        <span>{notification.body}</span>
                      </aside>
                      <button
                        className="notification-dismiss-button icon-tool tooltip-link danger"
                        type="button"
                        data-tooltip="Vyřídit a archivovat"
                        aria-label={`Vyřídit a archivovat notifikaci ${notification.title}`}
                        onClick={() => archiveClientNotification(notification)}
                      >
                        <X size={15} />
                      </button>
                    </article>
                  ))}
                </div>
                <div className="notification-audit-panel">
                  <div className="notification-audit-head">
                    <div>
                      <h3>Audit log notifikací</h3>
                      <p className="form-help">{archivedNotifications.length} archivovaných záznamů pro dohledání historie.</p>
                    </div>
                    <label className="notification-audit-search">
                      <Search size={15} />
                      <input
                        value={notificationAuditSearch}
                        onChange={(event) => setNotificationAuditSearch(event.target.value)}
                        placeholder="Hledat v audit logu"
                      />
                    </label>
                  </div>
                  <div className="notification-audit-list">
                    {filteredArchivedNotifications.length === 0 && (
                      <p className="empty-note">V audit logu není žádný odpovídající záznam.</p>
                    )}
                    {filteredArchivedNotifications.map((notification) => (
                      <article key={`audit-${notification.id}`} className={`notification-audit-item tone-${toFeedbackTone(notification.tone)}`}>
                        <Badge tone={(notification.tone as FeedbackTone) || 'info'}>{notification.category}</Badge>
                        <strong>{notification.title}</strong>
                        <span>{notification.body}</span>
                        <small>
                          Archivováno {notification.readAt ? new Date(notification.readAt).toLocaleString('cs-CZ') : new Date(notification.createdAt).toLocaleString('cs-CZ')}
                        </small>
                      </article>
                    ))}
                  </div>
                </div>
              </article>
            </div>
          )}

          {activeSection === 'settings' && (
            <div className="client-dashboard">
              <article className="profile-editor">
                <h2>Nastavení účtu</h2>
                <label>
                  Soukromí profilu
                  <select value={settingsDraft.privacyMode} onChange={(event) => setSettingsDraft((current) => ({ ...current, privacyMode: event.target.value }))}>
                    <option>Profil je viditelný pouze pracovníkům projektu</option>
                    <option>Profil je viditelný administrátorům a editorům</option>
                    <option>Profil je dočasně skrytý mimo nezbytné kontakty</option>
                  </select>
                </label>
                <label className="checkbox-field">
                  <input type="checkbox" checked={settingsDraft.documentEmails} onChange={(event) => setSettingsDraft((current) => ({ ...current, documentEmails: event.target.checked }))} />
                  Posílat upozornění k dokumentům
                </label>
                <label className="checkbox-field">
                  <input type="checkbox" checked={settingsDraft.commentEmails} onChange={(event) => setSettingsDraft((current) => ({ ...current, commentEmails: event.target.checked }))} />
                  Posílat upozornění ke komentářům a odpovědím
                </label>
                <label className="checkbox-field">
                  <input type="checkbox" checked={settingsDraft.twoFactorEnabled} onChange={(event) => setSettingsDraft((current) => ({ ...current, twoFactorEnabled: event.target.checked }))} />
                  Připravit dvoufázové ověření pro účet
                </label>
                <button className="button primary" type="button" onClick={saveAccountSettings}>
                  <Save size={18} /> Uložit nastavení
                </button>
              </article>
              <article>
                <h2>Heslo a bezpečnost</h2>
                <p>Obnova hesla odešle požadavek na e-mail přihlášeného účtu.</p>
                <button className="button secondary" type="button" onClick={requestPasswordResetFromProfile} disabled={isRequestingPasswordReset}>
                  <KeyRound size={18} /> {isRequestingPasswordReset ? 'Odesílám...' : 'Obnovit heslo'}
                </button>
                {passwordResetMessage && <p className="auth-message">{passwordResetMessage}</p>}
                <dl>
                  <div>
                    <dt>E-mail účtu</dt>
                    <dd>{account.email}</dd>
                  </div>
                  <div>
                    <dt>2FA</dt>
                    <dd>{settingsDraft.twoFactorEnabled ? 'Připraveno k aktivaci' : 'Vypnuto'}</dd>
                  </div>
                </dl>
              </article>
            </div>
          )}
        </div>
        <WorkspaceBottomNav items={clientNavItems} active={activeSection} onSelect={setActiveSection} />
      </div>
    </section>
  );
}

function App() {
  const [clients, setClients] = useStoredState<ClientRecord[]>('restart-admin-clients', []);
  const [news, setNews] = useStoredState<NewsItem[]>('restart-public-news', starterNews);
  const [newsDiscussion, setNewsDiscussion] = React.useState<NewsDiscussion>({ likes: {}, comments: [] });
  const [slides, setSlides] = useStoredState<HomeSlide[]>('restart-home-slides', starterSlides);
  const [homepageContent, setHomepageContent] = useStoredState<HomepageContentItem[]>(
    'restart-homepage-content',
    defaultHomepageContent
  );
  const [formTemplates, setFormTemplates] = useStoredState<FormTemplate[]>('restart-form-templates', []);
  const [accounts, setAccounts] = useStoredState<AuthAccount[]>('restart-auth-accounts', starterAccounts);
  const [managedUsers, setManagedUsers] = React.useState<ManagedUser[]>([]);
  const [projectApplications, setProjectApplications] = React.useState<ProjectApplication[]>([]);
  const [mediaFiles, setMediaFiles] = React.useState<MediaFile[]>([]);
  const [publicMediaFiles, setPublicMediaFiles] = React.useState<MediaFile[]>([]);
  const [jailbreakBackgroundStats, setJailbreakBackgroundStats] = React.useState<ApiJailbreakBackgroundStats | null>(null);
  const [clientDocuments, setClientDocuments] = React.useState<ClientDocument[]>([]);
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([]);
  const [materialOffers, setMaterialOffers] = React.useState<MaterialOffer[]>([]);
  const [emailTemplates, setEmailTemplates] = React.useState<ApiEmailTemplate[]>([]);
  const [sessionId, setSessionId] = useStoredState<string | null>('restart-auth-session', null);
  const [apiAccount, setApiAccount] = React.useState<AuthAccount | null>(null);
  const [modal, setModal] = React.useState<ModalState>(null);
  const [cookieSettingsOpen, setCookieSettingsOpen] = React.useState(false);
  const { notify } = useToast();
  const currentPath = useHashPath();
  const currentAccount = apiAccount ?? (localAuthFallbackEnabled() ? accounts.find((account) => account.id === sessionId) : null) ?? null;

  const refreshNewsDiscussion = React.useCallback(async () => {
    const discussion = await listNewsDiscussion();
    setNewsDiscussion({
      likes: Object.fromEntries(discussion.likes.map((like) => [like.newsId, like])),
      comments: discussion.comments
    });
  }, []);

  React.useEffect(() => {
    if (shouldUseStarterHeroDeck(slides)) {
      setSlides(starterSlides);
    }
  }, [slides, setSlides]);

  React.useEffect(() => {
    getSession()
      .then((user) => setApiAccount(user ? fromApiUser(user) : null))
      .catch(() => setApiAccount(null));
    listNews()
      .then((items) => {
        setNews(mergeNewsItems(starterNews, items));
      })
      .catch(() => undefined);
    listSlides()
      .then((items) => {
        if (items.length > 0) setSlides(shouldUseStarterHeroDeck(items) ? starterSlides : items);
      })
      .catch(() => undefined);
    listHomepageContent()
      .then((items) => setHomepageContent(mergeHomepageContent(items)))
      .catch(() => undefined);
  }, [setHomepageContent, setNews, setSlides]);

  React.useEffect(() => {
    if (currentPath !== '/povinne-zverejnovani') return;
    return runWhenIdle(() => {
      Promise.allSettled([loadSeededTransparentDocuments(), listPublicMedia(TRANSPARENCY_DOCUMENT_CATEGORY), getJailbreakBackgroundStats()]).then(
        ([fallbackResult, mediaResult, statsResult]) => {
          const mergeDocuments = (items: MediaFile[]) => {
            setPublicMediaFiles((current) => {
              const fallbackIds = new Set(current.map((item) => item.fileUrl));
              const merged = [...current];
              items.forEach((item) => {
                if (!fallbackIds.has(item.fileUrl)) {
                  merged.push(item);
                  fallbackIds.add(item.fileUrl);
                }
              });
              return merged;
            });
          };
          if (fallbackResult.status === 'fulfilled') {
            mergeDocuments(fallbackResult.value);
          }
          if (mediaResult.status === 'fulfilled') {
            mergeDocuments(mediaResult.value);
          }
          setJailbreakBackgroundStats(statsResult.status === 'fulfilled' ? statsResult.value : null);
        }
      );
    }, 1200);
  }, [currentPath]);

  React.useEffect(() => {
    const shouldLoadDiscussion =
      currentPath === '/' || currentPath.startsWith('/aktuality') || currentPath === '/pribehy-druhe-sance' || currentPath.startsWith(storyDetailPrefix) || currentPath.startsWith('/aktualita/');
    if (!shouldLoadDiscussion) return;
    return runWhenIdle(() => {
      refreshNewsDiscussion().catch(() => undefined);
    }, currentAccount ? 900 : 2400);
  }, [currentAccount?.id, currentPath, refreshNewsDiscussion]);

  React.useEffect(() => {
    if (currentAccount?.role !== 'admin' || currentPath !== '/admin') return;
    let isActive = true;
    loadFallbackFormTemplates()
      .then((templates) => {
        if (isActive) setFormTemplates((current) => (current.length > 0 ? current : templates));
      })
      .catch(() => undefined);
    listClients()
      .then((items) => {
        if (isActive) setClients(items.map(fromApiClient));
      })
      .catch(() => undefined);
    listFormTemplates()
      .then((items) => {
        const mapped = items.map(fromApiFormTemplate).filter((template) => template.fields.length > 0);
        if (isActive && mapped.length > 0) setFormTemplates(mapped);
      })
      .catch(() => undefined);
    listUsers()
      .then((items) => {
        if (isActive) setManagedUsers(items);
      })
      .catch(() => undefined);
    listProjectApplications()
      .then((items) => {
        if (isActive) setProjectApplications(items);
      })
      .catch(() => undefined);
    listMedia()
      .then((items) => {
        if (isActive) setMediaFiles(items);
      })
      .catch(() => undefined);
    listDocuments()
      .then((items) => {
        if (isActive) setClientDocuments(items);
      })
      .catch(() => undefined);
    listNotifications()
      .then((items) => {
        if (isActive) setNotifications(items);
      })
      .catch(() => undefined);
    listMaterialOffers()
      .then((items) => {
        if (isActive) setMaterialOffers(items);
      })
      .catch(() => undefined);
    listEmailTemplates()
      .then((items) => {
        if (isActive) setEmailTemplates(items);
      })
      .catch(() => undefined);
    return () => {
      isActive = false;
    };
  }, [currentAccount?.id, currentAccount?.role, currentPath, setClients, setFormTemplates]);
React.useEffect(() => {
    if (!currentAccount || currentAccount.role === 'admin' || currentPath !== '/klient') return;
    Promise.allSettled([listMyProjectApplications(), listNotifications()]).then(([applicationsResult, notificationsResult]) => {
      if (applicationsResult.status === 'fulfilled') setProjectApplications(applicationsResult.value);
      if (notificationsResult.status === 'fulfilled') setNotifications(notificationsResult.value);
    });
  }, [currentAccount?.id, currentAccount?.role, currentPath]);

  const login = (account: AuthAccount) => {
    if (account.password) {
      setSessionId(account.id);
      setApiAccount(null);
      if (account.role === 'admin' && currentPath !== '/admin') {
        navigateToPath('/admin');
      }
      return;
    }
    setApiAccount(account);
    setSessionId(null);
    if (account.role === 'admin' && currentPath !== '/admin') {
      navigateToPath('/admin');
    }
  };
  const logout = () => {
    logoutUser().catch(() => undefined);
    setApiAccount(null);
    setSessionId(null);
    notify('info', 'Odhlášení proběhlo', 'Uživatel byl odhlášen.');
  };
  const registerClient = (account: AuthAccount) => setAccounts((current) => [account, ...current]);
  const loginViaApi = async ({ email, password, role }: LoginRequest) => {
    try {
      const user = await loginUser(email, password, role as ApiRole);
      return fromApiUser(user);
    } catch (error) {
      if (role === 'client' && error instanceof ApiRequestError && error.status === 403) {
        throw error;
      }
      if (role === 'client' && error instanceof ApiRequestError && [400, 401, 403].includes(error.status)) {
        const user = await loginUser(email, password, 'admin');
        return fromApiUser(user);
      }
      throw error;
    }
  };
  const registerViaApi = async ({ name, email, phone, password }: RegisterRequest) => {
    const registration = await registerClientAccount(name, email, phone, password);
    trackAnalyticsEvent('sign_up', {
      method: 'email',
      role: 'applicant',
      account_status: registration.pendingVerification || registration.user.isActive === false ? 'pending_verification' : 'active'
    });
    if (registration.pendingVerification || registration.user.isActive === false) {
      notify(
        'success',
        'Registrace přijata',
        registration.message || 'Účet čeká na ověření administrátorem.'
      );
      return null;
    }
    return fromApiUser(registration.user);
  };
  const resetViaApi = (email: string) => requestPasswordReset(email);
  const confirmResetViaApi = ({ token, password }: ResetConfirmRequest) => confirmPasswordReset(token, password);
  const saveClientViaApi = async (client: ClientRecord) => {
    const saved = await saveClientRecord(client);
    return fromApiClient(saved);
  };
  const deleteClientViaApi = async (clientId: string) => {
    const result = await deleteClientRecord(clientId);
    setClients((current) => current.filter((item) => item.id !== clientId));
    setClientDocuments((current) => current.map((document) => (document.clientId === clientId ? { ...document, clientId: null } : document)));
    return result;
  };
  const saveNewsViaApi = (item: NewsItem) => saveNewsRecord(item);
  const deleteNewsViaApi = (id: string) => deleteNewsRecord(id);
  const saveSlideViaApi = (item: HomeSlide) => saveSlideRecord(item);
  const saveHomepageContentViaApi = (item: HomepageContentItem) => saveHomepageContentRecord(item);
  const saveDocumentViaApi = async (document: Omit<ClientDocument, 'createdAt'> & { createdAt?: string }) => {
    const saved = await saveDocumentRecord(document);
    setClientDocuments((current) => {
      const exists = current.some((item) => item.id === saved.id);
      return exists ? current.map((item) => (item.id === saved.id ? saved : item)) : [saved, ...current];
    });
    return saved;
  };
  const saveMediaViaApi = async (media: Omit<MediaFile, 'createdAt' | 'uploadedBy'> & { createdAt?: string; uploadedBy?: string | null }) => {
    const saved = await saveMediaRecord(media);
    setMediaFiles((current) => {
      const exists = current.some((item) => item.id === saved.id);
      return exists ? current.map((item) => (item.id === saved.id ? saved : item)) : [saved, ...current];
    });
    return saved;
  };
  const uploadMediaViaApi = (mediaFile: File, category = TRANSPARENCY_DOCUMENT_CATEGORY): Promise<MediaUploadResult> =>
    uploadMediaFile(mediaFile, category);
  const saveNotificationViaApi = async (notification: Omit<NotificationItem, 'createdAt' | 'readAt'> & { createdAt?: string; readAt?: string | null }) => {
    const saved = await saveNotificationRecord(notification);
    setNotifications((current) => {
      const exists = current.some((item) => item.id === saved.id);
      return exists ? current.map((item) => (item.id === saved.id ? saved : item)) : [saved, ...current];
    });
    return saved;
  };
  const markNotificationReadViaApi = async (notificationId: string) => {
    await markNotificationReadRecord(notificationId);
    const readAt = new Date().toISOString();
    setNotifications((current) => current.map((item) => (item.id === notificationId ? { ...item, readAt } : item)));
  };
  const updateManagedUserViaApi = async (user: Pick<ManagedUser, 'id' | 'role' | 'isActive'>) => {
    const saved = await updateUserRecord(user);
    setManagedUsers((current) => current.map((item) => (item.id === saved.id ? saved : item)));
    return saved;
  };
  const submitProjectApplicationViaApi = async (application: ProjectApplicationDraft) => {
    const saved = await submitProjectApplication(application);
    setProjectApplications((current) => [saved, ...current.filter((item) => item.id !== saved.id)]);
    return saved;
  };
  const reviewProjectApplicationViaApi = async (applicationId: string, status: 'approved' | 'rejected', approvedRole: ApiRole, adminNote = '') => {
    const result = await reviewProjectApplicationRecord(applicationId, status, approvedRole, adminNote);
    setProjectApplications((current) => current.map((item) => (item.id === result.application.id ? result.application : item)));
    if (result.user) {
      setManagedUsers((current) => current.map((item) => (item.id === result.user?.id ? result.user : item)));
    }
    return result.application;
  };
  const resetManagedUserPasswordViaApi = (userId: string) => resetUserPasswordRecord(userId);
  const deleteManagedUserViaApi = async (userId: string) => {
    await deleteUserRecord(userId);
    setManagedUsers((current) => current.filter((item) => item.id !== userId));
  };
  const updateMaterialOfferViaApi = async (
    offerId: string,
    update: Pick<MaterialOffer, 'status' | 'adminNote' | 'assignedTo' | 'pickupAt' | 'pickupAddress' | 'retentionUntil'>
  ) => {
    const saved = await updateMaterialOffer(offerId, update);
    setMaterialOffers((current) => current.map((offer) => (offer.id === saved.id ? saved : offer)));
    return saved;
  };
  const anonymizeMaterialOfferViaApi = async (offerId: string) => {
    await anonymizeMaterialOffer(offerId);
    const refreshed = await listMaterialOffers();
    setMaterialOffers(refreshed);
  };
  const updateEmailTemplateViaApi = async (
    templateKey: string,
    update: Pick<ApiEmailTemplate, 'subjectTemplate' | 'textTemplate' | 'htmlTemplate' | 'isActive'>
  ) => {
    const saved = await updateEmailTemplate(templateKey, update);
    setEmailTemplates((current) => current.map((template) => (template.key === saved.key ? saved : template)));
    return saved;
  };
  const toggleLikeViaApi = async (newsId: string) => {
    try {
      const like = await toggleNewsLike(newsId);
      setNewsDiscussion((current) => ({
        ...current,
        likes: { ...current.likes, [newsId]: like }
      }));
      notify(like.likedByMe ? 'success' : 'info', like.likedByMe ? 'Srdíčko přidáno' : 'Srdíčko odebráno');
    } catch (error) {
      notify('error', 'Srdíčko se nepodařilo uložit', error instanceof Error ? error.message : 'Zkuste to prosím znovu.');
    }
  };
  const addCommentViaApi = async (newsId: string, text: string, parentId?: string | null) => {
    try {
      const comment = await addNewsComment(newsId, text, parentId);
      setNewsDiscussion((current) => ({
        ...current,
        comments: [...current.comments, comment]
      }));
      notify('success', parentId ? 'Odpověď uložena' : 'Komentář uložen', 'Příspěvek je veřejně zobrazený u aktuality.');
      return true;
    } catch (error) {
      notify('error', 'Komentář se nepodařilo uložit', error instanceof Error ? error.message : 'Zkuste to prosím znovu.');
      return false;
    }
  };
  const updateCommentViaApi = async (commentId: string, text: string) => {
    try {
      const comment = await updateNewsComment(commentId, text);
      setNewsDiscussion((current) => ({
        ...current,
        comments: current.comments.map((item) => (item.id === comment.id ? comment : item))
      }));
      notify('success', 'Komentář upraven', 'Změna je uložená.');
      return true;
    } catch (error) {
      notify('error', 'Komentář se nepodařilo upravit', error instanceof Error ? error.message : 'Zkuste to prosím znovu.');
      return false;
    }
  };
  const deleteCommentViaApi = async (commentId: string) => {
    try {
      await deleteNewsComment(commentId);
      setNewsDiscussion((current) => ({
        ...current,
        comments: current.comments.filter((comment) => comment.id !== commentId && comment.parentId !== commentId)
      }));
      notify('info', 'Komentář smazán', 'Příspěvek byl odstraněn.');
    } catch (error) {
      notify('error', 'Komentář se nepodařilo smazat', error instanceof Error ? error.message : 'Zkuste to prosím znovu.');
    }
  };

  const selectedProgram = currentPath.startsWith('/programy/') ? getProgramBySlug(currentPath.replace('/programy/', '')) : null;
  const selectedMethodologyDocument = methodologyDocuments.find((document) => document.path === currentPath) ?? null;
  const selectedVideo = videoWatchPages.find((video) => video.path === currentPath) ?? null;
  const selectedMaterialSupportPage = materialSupportPages[currentPath] ?? null;
  const selectedStoryId = currentPath.startsWith(storyDetailPrefix) ? decodeURIComponent(currentPath.slice(storyDetailPrefix.length)) : '';
  const selectedStory = selectedStoryId ? news.find((item) => item.id === selectedStoryId && isSecondChanceStory(item)) : null;

  const newsRouteMatch = currentPath.match(/^\/aktuality\/([^/]+)(?:\/([^/]+))?$/);
  const activeNewsTagSlug = newsRouteMatch?.[1] ? decodeURIComponent(newsRouteMatch[1]) : '';
  const selectedNewsSlug = newsRouteMatch?.[2] ? decodeURIComponent(newsRouteMatch[2]) : '';
  const selectedNewsBySlug = selectedNewsSlug
    ? news.find(
        (item) => !isSecondChanceStory(item) && newsTagSlug(item) === activeNewsTagSlug && newsItemSlug(item) === selectedNewsSlug
      )
    : null;
  const newsDetailPrefix = '/aktualita/';
  const selectedNewsId = currentPath.startsWith(newsDetailPrefix) ? decodeURIComponent(currentPath.slice(newsDetailPrefix.length)) : '';
  const selectedLegacyNews = selectedNewsId ? news.find((item) => item.id === selectedNewsId && !isSecondChanceStory(item)) : null;
  const selectedNews = selectedNewsBySlug || selectedLegacyNews;

  const staticPage = staticPages[currentPath];
  const transparencyPublicDocuments = publicMediaFiles
    .filter((document) => document.category === TRANSPARENCY_DOCUMENT_CATEGORY || document.fileUrl.startsWith('/documents/transparency/'))
    .filter((document, index, list) => list.findIndex((other) => other.fileUrl === document.fileUrl) === index);
  const page =
    currentPath === '/vyhledavani' ? (
      <SearchPage news={news} />
    ) : currentPath === '/co-delame' ? (
      <WorkPage />
    ) : currentPath === '/programy' ? (
      <ProgramsPage />
    ) : currentPath === '/metodika' ? (
      <MethodologyPage account={currentAccount} />
    ) : selectedVideo ? (
      <VideoWatchPage video={selectedVideo} />
    ) : selectedMethodologyDocument ? (
      <MethodologyDocumentPage document={selectedMethodologyDocument} />
    ) : selectedProgram ? (
      <ProgramDetailPage program={selectedProgram} />
    ) : selectedStory ? (
      <NewsDetailPage
        item={selectedStory}
        discussion={newsDiscussion}
        account={currentAccount}
        onToggleLike={toggleLikeViaApi}
        onAddComment={addCommentViaApi}
        onUpdateComment={updateCommentViaApi}
        onDeleteComment={deleteCommentViaApi}
        onNotify={notify}
      />
    ) : selectedNews ? (
      <NewsDetailPage
        item={selectedNews}
        discussion={newsDiscussion}
        account={currentAccount}
        onToggleLike={toggleLikeViaApi}
        onAddComment={addCommentViaApi}
        onUpdateComment={updateCommentViaApi}
        onDeleteComment={deleteCommentViaApi}
        onNotify={notify}
      />
    ) : currentPath === '/aktuality' || (newsRouteMatch && !selectedNewsSlug) ? (
      <NewsPage
        news={news}
        discussion={newsDiscussion}
        activeTagSlug={activeNewsTagSlug}
      />
    ) : currentPath === '/pribehy-druhe-sance' ? (
      <NewsPage
        news={news}
        discussion={newsDiscussion}
        storiesOnly
      />
    ) : currentPath === '/zapojeni' ? (
      <SupportHubPage />
    ) : selectedMaterialSupportPage ? (
      <MaterialSupportPage config={selectedMaterialSupportPage} />
    ) : currentPath === '/darovat' ? (
      <MonetaryDonationPage />
    ) : currentPath === '/media' ? (
      <MediaKitPage page={staticPages['/media']} assets={publicMediaKitAssets} />
    ) : currentPath === '/povinne-zverejnovani' ? (
      <TransparencyDocumentsPage documents={transparencyPublicDocuments} jailbreakBackgroundStats={jailbreakBackgroundStats} />
    ) : currentPath === '/kontakt' ? (
      <ContactPage onNotify={notify} onOpenCookieSettings={() => setCookieSettingsOpen(true)} />
    ) : staticPage ? (
      <StaticInfoPage page={staticPage} />
    ) : currentPath === '/klient' ? (
      currentAccount && (currentAccount.role === 'admin' || isPortalRole(currentAccount.role)) ? (
        <ClientProfile
          account={currentAccount}
          clientDocuments={clientDocuments}
          notifications={notifications}
          projectApplications={projectApplications}
          onNotificationReadRequest={markNotificationReadViaApi}
          onProjectApplicationSubmit={submitProjectApplicationViaApi}
          onPasswordResetRequest={requestPasswordReset}
          onLogout={logout}
          onNotify={notify}
        />
      ) : (
        <AuthScreen
          role="client"
          title="Klientský portál"
          text="Po registraci vznikne profil uchazeče. V portálu pak můžete podat žádost o vstup jako klient, dobrovolník nebo podporovatel projektu."
          accounts={accounts}
          onLogin={login}
          onRegister={registerClient}
          onLoginRequest={loginViaApi}
          onRegisterRequest={registerViaApi}
          onResetRequest={resetViaApi}
          onResetConfirmRequest={confirmResetViaApi}
          onNotify={notify}
          onOpenModal={setModal}
        />
      )
    ) : currentPath === '/admin' ? (
      currentAccount?.role === 'admin' ? (
        <AdminWorkspace
          clients={clients}
          news={news}
          slides={slides}
          homepageContent={homepageContent}
          formTemplates={formTemplates}
          managedUsers={managedUsers}
          projectApplications={projectApplications}
          mediaFiles={mediaFiles}
          clientDocuments={clientDocuments}
          notifications={notifications}
          materialOffers={materialOffers}
          emailTemplates={emailTemplates}
          discussion={newsDiscussion}
          onClientsChange={setClients}
          onNewsChange={setNews}
          onSlidesChange={setSlides}
          onHomepageContentChange={setHomepageContent}
          onClientSaveRequest={saveClientViaApi}
          onClientDeleteRequest={deleteClientViaApi}
          onNewsSaveRequest={saveNewsViaApi}
          onNewsDeleteRequest={deleteNewsViaApi}
          onSlideSaveRequest={saveSlideViaApi}
          onHomepageContentSaveRequest={saveHomepageContentViaApi}
          onDocumentSaveRequest={saveDocumentViaApi}
          onMediaSaveRequest={saveMediaViaApi}
          onMediaUploadRequest={uploadMediaViaApi}
          onNotificationSaveRequest={saveNotificationViaApi}
          onNotificationReadRequest={markNotificationReadViaApi}
          onUserUpdateRequest={updateManagedUserViaApi}
          onProjectApplicationReviewRequest={reviewProjectApplicationViaApi}
          onUserResetPasswordRequest={resetManagedUserPasswordViaApi}
          onUserDeleteRequest={deleteManagedUserViaApi}
          onMaterialOfferUpdateRequest={updateMaterialOfferViaApi}
          onMaterialOfferAnonymizeRequest={anonymizeMaterialOfferViaApi}
          onEmailTemplateUpdateRequest={updateEmailTemplateViaApi}
          account={currentAccount}
          onLogout={logout}
          onNotify={notify}
        />
      ) : (
        <AuthScreen
          role="admin"
          title="Přihlášení do administrace"
          text="Administrace je chráněná vstupní logikou. Po přihlášení se otevře dashboard pro klienty, formuláře a aktuality."
          accounts={accounts}
          onLogin={login}
          onLoginRequest={loginViaApi}
          onResetRequest={resetViaApi}
          onResetConfirmRequest={confirmResetViaApi}
          onNotify={notify}
          onOpenModal={setModal}
        />
      )
    ) : (
      <HomePage
        news={news}
        slides={slides}
        homepageContent={homepageContent}
        discussion={newsDiscussion}
        account={currentAccount}
        onToggleLike={toggleLikeViaApi}
        onAddComment={addCommentViaApi}
        onUpdateComment={updateCommentViaApi}
        onDeleteComment={deleteCommentViaApi}
        onNotify={notify}
      />
    );

  return (
    <>
      <WeatherLeaves />
      <Header currentPath={currentPath} account={currentAccount} notifications={notifications} onNotify={notify} />
      <Breadcrumb path={currentPath} />
      <main id="top">
        <RevealFx key={currentPath} className="page-reveal" delay={70}>
          {page}
        </RevealFx>
      </main>
      <AppModal modal={modal} onClose={() => setModal(null)} />
      <CookieConsent forceOpen={cookieSettingsOpen} inline={Boolean(selectedVideo)} onClose={() => setCookieSettingsOpen(false)} />
      <footer className="site-footer">
        <div className="footer-brand-block">
          <p>REST||ART Integrace</p>
          <span>Druhá šance v praxi. Mentoring, práce, bydlení, stabilizace.</span>
        </div>
        <nav className="footer-nav" aria-label="Textová navigace v patičce">
          {footerNavGroups.map((group) => (
            <div key={group.title}>
              <strong>{group.title}</strong>
              {group.links.map((link) => (
                <a key={link.href} href={link.href}>{link.label}</a>
              ))}
            </div>
          ))}
        </nav>
        <div className="codex-credit" aria-label="Technická spolupráce">
          <span>Design a vývoj ve spolupráci s</span>
          <strong>OpenAI Codex</strong>
        </div>
        <button className="footer-cookie-button" type="button" onClick={() => setCookieSettingsOpen(true)}>
          Nastavení cookies
        </button>
      </footer>
    </>
  );
}

function AdminWorkspace({
  clients,
  news,
  slides,
  homepageContent,
  formTemplates,
  managedUsers,
  projectApplications,
  mediaFiles,
  clientDocuments,
  notifications,
  materialOffers,
  emailTemplates,
  discussion,
  onClientsChange,
  onNewsChange,
  onSlidesChange,
  onHomepageContentChange,
  onClientSaveRequest,
  onClientDeleteRequest,
  onNewsSaveRequest,
  onNewsDeleteRequest,
  onSlideSaveRequest,
  onHomepageContentSaveRequest,
  onDocumentSaveRequest,
  onMediaSaveRequest,
  onMediaUploadRequest,
  onNotificationSaveRequest,
  onNotificationReadRequest,
  onUserUpdateRequest,
  onProjectApplicationReviewRequest,
  onUserResetPasswordRequest,
  onUserDeleteRequest,
  onMaterialOfferUpdateRequest,
  onMaterialOfferAnonymizeRequest,
  onEmailTemplateUpdateRequest,
  account,
  onLogout,
  onNotify
}: {
  clients: ClientRecord[];
  news: NewsItem[];
  slides: HomeSlide[];
  homepageContent: HomepageContentItem[];
  formTemplates: FormTemplate[];
  managedUsers: ManagedUser[];
  projectApplications: ProjectApplication[];
  mediaFiles: MediaFile[];
  clientDocuments: ClientDocument[];
  notifications: NotificationItem[];
  materialOffers: MaterialOffer[];
  emailTemplates: ApiEmailTemplate[];
  discussion: NewsDiscussion;
  onClientsChange: React.Dispatch<React.SetStateAction<ClientRecord[]>>;
  onNewsChange: React.Dispatch<React.SetStateAction<NewsItem[]>>;
  onSlidesChange: React.Dispatch<React.SetStateAction<HomeSlide[]>>;
  onHomepageContentChange: React.Dispatch<React.SetStateAction<HomepageContentItem[]>>;
  onClientSaveRequest?: (client: ClientRecord) => Promise<ClientRecord>;
  onClientDeleteRequest?: (clientId: string) => Promise<{ ok: boolean; id: string; detachedDocuments: number }>;
  onNewsSaveRequest?: (item: NewsItem) => Promise<NewsItem>;
  onNewsDeleteRequest?: (id: string) => Promise<void>;
  onSlideSaveRequest?: (item: HomeSlide) => Promise<HomeSlide>;
  onHomepageContentSaveRequest?: (item: HomepageContentItem) => Promise<HomepageContentItem>;
  onDocumentSaveRequest?: (document: Omit<ClientDocument, 'createdAt'> & { createdAt?: string }) => Promise<ClientDocument>;
  onMediaSaveRequest?: (media: Omit<MediaFile, 'createdAt' | 'uploadedBy'> & { createdAt?: string; uploadedBy?: string | null }) => Promise<MediaFile>;
  onMediaUploadRequest?: (mediaFile: File, category: string) => Promise<MediaUploadResult>;
  onNotificationSaveRequest?: (
    notification: Omit<NotificationItem, 'createdAt' | 'readAt'> & { createdAt?: string; readAt?: string | null }
  ) => Promise<NotificationItem>;
  onNotificationReadRequest?: (notificationId: string) => Promise<void>;
  onUserUpdateRequest?: (user: Pick<ManagedUser, 'id' | 'role' | 'isActive'>) => Promise<ManagedUser>;
  onProjectApplicationReviewRequest?: (applicationId: string, status: 'approved' | 'rejected', approvedRole: ApiRole, adminNote?: string) => Promise<ProjectApplication>;
  onUserResetPasswordRequest?: (userId: string) => Promise<ApiAdminPasswordResetResponse>;
  onUserDeleteRequest?: (userId: string) => Promise<void>;
  onMaterialOfferUpdateRequest?: (
    offerId: string,
    update: Pick<MaterialOffer, 'status' | 'adminNote' | 'assignedTo' | 'pickupAt' | 'pickupAddress' | 'retentionUntil'>
  ) => Promise<MaterialOffer>;
  onMaterialOfferAnonymizeRequest?: (offerId: string) => Promise<void>;
  onEmailTemplateUpdateRequest?: (
    templateKey: string,
    update: Pick<ApiEmailTemplate, 'subjectTemplate' | 'textTemplate' | 'htmlTemplate' | 'isActive'>
  ) => Promise<ApiEmailTemplate>;
  account: AuthAccount;
  onLogout: () => void;
  onNotify: (tone: FeedbackTone, title: string, text?: string) => void;
}) {
  const [activeTab, setActiveTab] = React.useState<AdminSection>('dashboard');
  const [focusedNewsId, setFocusedNewsId] = React.useState('');
  const [focusedActivityId, setFocusedActivityId] = React.useState('');
  const [notificationSearch, setNotificationSearch] = React.useState('');
  const [materialOfferFilter, setMaterialOfferFilter] = React.useState<'all' | ApiMaterialOfferType>('all');
  const [materialOfferStatusFilter, setMaterialOfferStatusFilter] = React.useState<'all' | ApiMaterialOfferStatus>('all');
  const [materialOfferQuery, setMaterialOfferQuery] = React.useState('');
  const [selectedMaterialOfferId, setSelectedMaterialOfferId] = React.useState('');
  const [materialOfferStatusDraft, setMaterialOfferStatusDraft] = React.useState<ApiMaterialOfferStatus>('new');
  const [materialOfferAdminNote, setMaterialOfferAdminNote] = React.useState('');
  const [materialOfferAssignedTo, setMaterialOfferAssignedTo] = React.useState('');
  const [materialOfferPickupAt, setMaterialOfferPickupAt] = React.useState('');
  const [materialOfferPickupAddress, setMaterialOfferPickupAddress] = React.useState('');
  const [materialOfferRetentionUntil, setMaterialOfferRetentionUntil] = React.useState('');
  const [materialOfferPhotoPreview, setMaterialOfferPhotoPreview] = React.useState<{ url: string; name: string } | null>(null);
  const [savingMaterialOffer, setSavingMaterialOffer] = React.useState(false);
  const [savingEmailTemplate, setSavingEmailTemplate] = React.useState('');
  const [emailTemplateDrafts, setEmailTemplateDrafts] = React.useState<Record<string, ApiEmailTemplate>>({});
  const selectedMaterialOffer = materialOffers.find((offer) => offer.id === selectedMaterialOfferId) ?? null;
  const normalizedMaterialOfferQuery = materialOfferQuery.trim().toLocaleLowerCase('cs-CZ');
  const filteredMaterialOffers = materialOffers.filter(
    (offer) =>
      (materialOfferFilter === 'all' || offer.offerType === materialOfferFilter) &&
      (materialOfferStatusFilter === 'all' || offer.status === materialOfferStatusFilter) &&
      (!normalizedMaterialOfferQuery ||
        [offer.id, offer.donorName, offer.email, offer.phone, offer.locality, offer.itemDescription, offer.assignedName]
          .join(' ')
          .toLocaleLowerCase('cs-CZ')
          .includes(normalizedMaterialOfferQuery))
  );
  const newMaterialOfferCount = materialOffers.filter((offer) => offer.status === 'new').length;
  React.useEffect(() => {
    const tabParam = new URLSearchParams(window.location.search).get('tab') as AdminSection | null;
    if (tabParam && adminSectionIds.includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);
  React.useEffect(() => {
    if (!selectedMaterialOfferId && materialOffers[0]) setSelectedMaterialOfferId(materialOffers[0].id);
  }, [materialOffers, selectedMaterialOfferId]);
  React.useEffect(() => {
    if (!selectedMaterialOffer) return;
    setMaterialOfferStatusDraft(selectedMaterialOffer.status);
    setMaterialOfferAdminNote(selectedMaterialOffer.adminNote);
    setMaterialOfferAssignedTo(selectedMaterialOffer.assignedTo || '');
    setMaterialOfferPickupAt(selectedMaterialOffer.pickupAt ? selectedMaterialOffer.pickupAt.slice(0, 16) : '');
    setMaterialOfferPickupAddress(selectedMaterialOffer.pickupAddress);
    setMaterialOfferRetentionUntil(selectedMaterialOffer.retentionUntil ? selectedMaterialOffer.retentionUntil.slice(0, 10) : '');
  }, [
    selectedMaterialOffer?.id,
    selectedMaterialOffer?.status,
    selectedMaterialOffer?.adminNote,
    selectedMaterialOffer?.assignedTo,
    selectedMaterialOffer?.pickupAt,
    selectedMaterialOffer?.pickupAddress,
    selectedMaterialOffer?.retentionUntil
  ]);
  React.useEffect(() => {
    setEmailTemplateDrafts(Object.fromEntries(emailTemplates.map((template) => [template.key, { ...template }])));
  }, [emailTemplates]);

  const saveMaterialOfferReview = async () => {
    if (!selectedMaterialOffer || !onMaterialOfferUpdateRequest) return;
    setSavingMaterialOffer(true);
    try {
      await onMaterialOfferUpdateRequest(selectedMaterialOffer.id, {
        status: materialOfferStatusDraft,
        adminNote: materialOfferAdminNote,
        assignedTo: materialOfferAssignedTo || null,
        pickupAt: materialOfferPickupAt ? new Date(materialOfferPickupAt).toISOString() : null,
        pickupAddress: materialOfferPickupAddress,
        retentionUntil: materialOfferRetentionUntil || selectedMaterialOffer.retentionUntil
      });
      setAdminMessageTone('success');
      setAdminMessage('Stav materiální nabídky byl uložen.');
      onNotify('success', 'Nabídka aktualizována', 'Změna je uložená v administraci.');
    } catch (error) {
      setAdminMessageTone('error');
      setAdminMessage(error instanceof Error ? error.message : 'Nabídku se nepodařilo aktualizovat.');
    } finally {
      setSavingMaterialOffer(false);
    }
  };
  const exportMaterialOffersCsv = () => {
    const csvValue = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;
    const rows = [
      ['ID', 'Typ', 'Stav', 'Dárce', 'E-mail', 'Telefon', 'Lokalita', 'Množství', 'Doprava', 'Přiřazeno', 'Termín svozu', 'Adresa svozu', 'Vytvořeno'],
      ...filteredMaterialOffers.map((offer) => [
        offer.id,
        materialOfferTypeLabels[offer.offerType],
        materialOfferStatusOptions.find((option) => option.value === offer.status)?.label || offer.status,
        offer.donorName,
        offer.email,
        offer.phone,
        offer.locality,
        offer.quantity,
        materialOfferTransportLabels[offer.transport],
        offer.assignedName,
        offer.pickupAt || '',
        offer.pickupAddress,
        offer.createdAt
      ])
    ];
    const blob = new Blob([`\uFEFF${rows.map((row) => row.map(csvValue).join(';')).join('\r\n')}`], {
      type: 'text/csv;charset=utf-8'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `materialni-nabidky-${todayIso()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };
  const printSelectedMaterialOffer = () => {
    if (!selectedMaterialOffer) return;
    const printable = window.open('', '_blank', 'noopener,noreferrer');
    if (!printable) return;
    const safe = (value: unknown) =>
      String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    printable.document.write(`<!doctype html><html lang="cs"><head><meta charset="utf-8"><title>Nabídka ${safe(selectedMaterialOffer.id)}</title>
      <style>body{font:14px Arial,sans-serif;color:#14241c;max-width:800px;margin:32px auto}h1{color:#075b43}dt{font-weight:700}dd{margin:0 0 12px}hr{border:0;border-top:1px solid #bbb}</style></head><body>
      <h1>Materiální nabídka</h1><p>${safe(selectedMaterialOffer.id)}</p><hr><dl>
      <dt>Typ a stav</dt><dd>${safe(materialOfferTypeLabels[selectedMaterialOffer.offerType])} · ${safe(materialOfferStatusOptions.find((option) => option.value === selectedMaterialOffer.status)?.label)}</dd>
      <dt>Dárce</dt><dd>${safe(selectedMaterialOffer.donorName)} · ${safe(selectedMaterialOffer.email)} · ${safe(selectedMaterialOffer.phone)}</dd>
      <dt>Lokalita</dt><dd>${safe(selectedMaterialOffer.locality)}</dd><dt>Popis</dt><dd>${safe(selectedMaterialOffer.itemDescription)}</dd>
      <dt>Množství</dt><dd>${safe(selectedMaterialOffer.quantity)}</dd><dt>Přiřazeno</dt><dd>${safe(selectedMaterialOffer.assignedName)}</dd>
      <dt>Svoz</dt><dd>${safe(selectedMaterialOffer.pickupAt ? new Date(selectedMaterialOffer.pickupAt).toLocaleString('cs-CZ') : '')} ${safe(selectedMaterialOffer.pickupAddress)}</dd>
      <dt>Interní poznámka</dt><dd>${safe(selectedMaterialOffer.adminNote)}</dd></dl></body></html>`);
    printable.document.close();
    printable.print();
  };
  const anonymizeSelectedMaterialOffer = async () => {
    if (!selectedMaterialOffer || !onMaterialOfferAnonymizeRequest || !window.confirm('Trvale odstranit kontaktní údaje a fotografie této nabídky?')) return;
    try {
      await onMaterialOfferAnonymizeRequest(selectedMaterialOffer.id);
      onNotify('success', 'Nabídka anonymizována', 'Kontaktní údaje a fotografie byly odstraněny.');
    } catch (error) {
      onNotify('error', 'Anonymizace se nezdařila', error instanceof Error ? error.message : 'Zkuste to znovu.');
    }
  };
  const saveEmailTemplateDraft = async (templateKey: string) => {
    const draft = emailTemplateDrafts[templateKey];
    if (!draft || !onEmailTemplateUpdateRequest) return;
    setSavingEmailTemplate(templateKey);
    try {
      await onEmailTemplateUpdateRequest(templateKey, draft);
      onNotify('success', 'E-mailová šablona uložena');
    } catch (error) {
      onNotify('error', 'Šablonu se nepodařilo uložit', error instanceof Error ? error.message : 'Zkuste to znovu.');
    } finally {
      setSavingEmailTemplate('');
    }
  };
  const [clientForm, setClientForm] = React.useState<ClientRecord>(emptyClient);
  const [selectedClientId, setSelectedClientId] = React.useState('');
  const [clientQuery, setClientQuery] = React.useState('');
  const [clientStatusFilter, setClientStatusFilter] = React.useState('all');
  const [clientIdFilter, setClientIdFilter] = React.useState('all');
  const [selectedTemplateId, setSelectedTemplateId] = React.useState(formTemplates[0]?.id ?? '');
  const [templateQuery, setTemplateQuery] = React.useState('');
  const [templateCategory, setTemplateCategory] = React.useState('all');
  const [draft, setDraft] = React.useState<FormDraft>({});
  const [newsForm, setNewsForm] = React.useState<NewsItem>({
    id: '',
    title: '',
    slug: '',
    date: todayIso(),
    excerpt: '',
    body: '',
    tag: 'Aktuality projektu',
    imageUrl: ''
  });
  const [isNewsDialogOpen, setIsNewsDialogOpen] = React.useState(false);
  const [newsUndoStack, setNewsUndoStack] = React.useState<string[]>([]);
  const newsBodyRef = React.useRef<HTMLTextAreaElement | null>(null);
  const [slideForm, setSlideForm] = React.useState<HomeSlide>({
    id: '',
    title: '',
    subtitle: '',
    imageUrl: '/images/slides/restart-tree.jpg',
    ctaLabel: '',
    ctaHref: '/kontakt',
    sortOrder: 170,
    isActive: true
  });
  const [contentEditorTab, setContentEditorTab] = React.useState<ContentEditorTab>('hero');
  const [homepageContentForm, setHomepageContentForm] = React.useState<HomepageContentItem>(
    defaultHomepageGallery[0]
  );
  const [imageUploadBusy, setImageUploadBusy] = React.useState('');
  const [adminMessage, setAdminMessage] = React.useState('');
  const [adminMessageTone, setAdminMessageTone] = React.useState<FeedbackTone>('info');
  const [adminDialog, setAdminDialog] = React.useState<AdminDialogState | null>(null);
  const [mediaForm, setMediaForm] = React.useState<MediaFile>({
    id: '',
    title: '',
    fileName: '',
    fileUrl: '',
    mimeType: 'image/jpeg',
    fileSize: 0,
    category: 'visual',
    altText: '',
    uploadedBy: account.id,
    createdAt: todayIso()
  });
  const [mediaUploadFile, setMediaUploadFile] = React.useState<File | null>(null);
  const [managedUserForm, setManagedUserForm] = React.useState<ManagedUser>({
    id: '',
    role: 'client',
    name: '',
    email: '',
    phone: '',
    createdAt: todayIso(),
    isActive: true,
    lastLoginAt: null
  });
  const [notificationForm, setNotificationForm] = React.useState<NotificationItem>({
    id: '',
    recipientId: null,
    title: '',
    body: '',
    tone: 'info',
    category: 'Systém',
    linkHref: '',
    readAt: null,
    createdAt: new Date().toISOString()
  });
  const [toolsDraft, setToolsDraft] = useStoredState<AdminToolsDraft>('restart-admin-tools', {
    firstName: '',
    lastName: '',
    registrationDate: todayIso(),
    sequence: Math.max(1, clients.length + 1),
    generatedId: '',
    barcodeValue: '',
    qrValue: ''
  });
  const [codeArchive, setCodeArchive] = useStoredState<CodeArchiveEntry[]>('restart-admin-code-archive', []);
  const [codeArchiveQuery, setCodeArchiveQuery] = React.useState('');
  const [codeArchiveKindFilter, setCodeArchiveKindFilter] = React.useState<'all' | CodeArchiveKind>('all');
  const barcodeRef = React.useRef<SVGSVGElement | null>(null);
  const qrCanvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [settingsDraft, setSettingsDraft] = useStoredState<AdminSettingsDraft>('restart-admin-settings', {
    organizationName: 'REST||ART Integrace',
    primaryColor: 'zelený akcent webu',
    seoTitle: 'REST||ART Integrace - neziskový projekt druhých šancí',
    seoDescription: 'Mentoring, práce, bydlení, STREETWISE a stabilizace pro lidi na okraji společnosti.',
    cookiesMode: 'lišta a správa kategorií aktivní',
    loginMode: 'aktivní',
    rolesMode: 'admin, editor, client',
    passwordResetMode: 'tokenový reset přes API',
    twoFactorMode: 'další bezpečnostní modul'
  });

  const selectedClient = clients.find((client) => client.id === selectedClientId) ?? clients[0] ?? null;
  const previousAutofillClientRef = React.useRef<ClientRecord | null>(null);
  const selectedToolsClient = selectedClientId ? clients.find((client) => client.id === selectedClientId) ?? null : null;
  const toolsClientHasOperationalId = Boolean(selectedToolsClient?.operationalId?.trim());
  const toolsClientSequence = clientSequenceNumber(clients, selectedToolsClient?.id);
  const toolsEffectiveDraft = selectedToolsClient
    ? {
        ...toolsDraft,
        firstName: selectedToolsClient.firstName,
        lastName: selectedToolsClient.lastName,
        registrationDate: dateToInputValue(selectedToolsClient.createdAt),
        sequence: toolsClientSequence
      }
    : toolsDraft;
  const filteredCodeArchive = codeArchive
    .filter((entry) => codeArchiveKindFilter === 'all' || entry.kind === codeArchiveKindFilter)
    .filter((entry) => {
      const query = codeArchiveQuery.trim().toLowerCase();
      if (!query) return true;
      return [entry.value, entry.clientName, entry.clientId, entry.formTitle, entry.formId, entry.note]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));
    })
    .sort((left, right) => new Date(right.importedAt || right.createdAt).getTime() - new Date(left.importedAt || left.createdAt).getTime());
  const barcodeArchiveCount = codeArchive.filter((entry) => entry.kind === 'barcode').length;
  const qrArchiveCount = codeArchive.filter((entry) => entry.kind === 'qr').length;
  const clientStatusOptions = Array.from(new Set(clients.map((client) => client.status || 'Bez stavu'))).sort((left, right) =>
    left.localeCompare(right, 'cs')
  );
  const filteredClients = clients.filter((client) => {
    const query = clientQuery.trim().toLowerCase();
    const matchesQuery =
      !query ||
      [
        client.firstName,
        client.lastName,
        client.email,
        client.phone,
        client.program,
        client.status,
        client.operationalId,
        client.targetGroup,
        client.address,
        institutionalCareLabel(client.institutionalCareHistory),
        childhoodBackgroundLabel(client.childhoodBackground)
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));
    const matchesStatus = clientStatusFilter === 'all' || client.status === clientStatusFilter;
    const hasOperationalId = Boolean(client.operationalId?.trim());
    const matchesId =
      clientIdFilter === 'all' ||
      (clientIdFilter === 'with-id' && hasOperationalId) ||
      (clientIdFilter === 'without-id' && !hasOperationalId);
    return matchesQuery && matchesStatus && matchesId;
  });
  React.useEffect(() => {
    if (activeTab !== 'clients') return;
    if (filteredClients.length === 0) return;
    if (filteredClients.some((client) => client.id === selectedClientId)) return;
    setSelectedClientId(filteredClients[0].id);
  }, [activeTab, filteredClients, selectedClientId]);
  const selectedTemplate = formTemplates.find((template) => template.id === selectedTemplateId) ?? formTemplates[0] ?? emptyFormTemplate;
  const selectedTemplateFileUrl = resolvePublicFileUrl(selectedTemplate.fileUrl || selectedTemplate.sourceNote, selectedTemplate);
  React.useEffect(() => {
    if (!selectedClient || !selectedTemplate) return;

    setDraft((current) => mergeClientAutofillDraft(selectedTemplate, selectedClient, current, previousAutofillClientRef.current));
    previousAutofillClientRef.current = selectedClient;
  }, [selectedClient?.id, selectedTemplate?.id]);

  const templateCategories = Array.from(new Set(formTemplates.map((template) => template.folder || 'bez-kategorie'))).sort((left, right) =>
    formCategoryTitle(left).localeCompare(formCategoryTitle(right), 'cs')
  );
  const filteredTemplates = formTemplates.filter((template) => {
    const matchesCategory = templateCategory === 'all' || (template.folder || 'bez-kategorie') === templateCategory;
    const query = templateQuery.trim().toLowerCase();
    const matchesQuery =
      !query ||
      [template.title, template.description, template.folder, template.sourceNote]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));
    return matchesCategory && matchesQuery;
  });
  const selectedClientDocuments = selectedClient
    ? clientDocuments.filter((document) => {
        const lastName = selectedClient.lastName.trim().toLowerCase();
        return document.clientId === selectedClient.id || Boolean(lastName && document.title.toLowerCase().includes(lastName));
      })
    : [];
  const selectedClientPendingDocuments = selectedClientDocuments.filter(
    (document) => !document.signedAt && ['prepared', 'pending', 'draft'].includes(document.status.toLowerCase())
  );
  const selectedClientNotifications = selectedClient
    ? notifications.filter((notification) => {
        const haystack = `${notification.title} ${notification.body} ${notification.category}`.toLowerCase();
        const email = selectedClient.email.trim().toLowerCase();
        const fullName = `${selectedClient.firstName} ${selectedClient.lastName}`.toLowerCase();
        return notification.recipientId === selectedClient.id || Boolean(email && haystack.includes(email)) || Boolean(fullName.trim() && haystack.includes(fullName));
      })
    : [];
  const selectedClientNextStep = selectedClient
    ? !selectedClient.operationalId?.trim()
      ? 'Vygenerovat interní ID a uložit ho ke kartě klienta.'
      : selectedClientPendingDocuments.length > 0
        ? 'Dokončit podpis nebo archivaci připravených dokumentů.'
        : selectedClient.status === 'Nový kontakt'
          ? 'Doplnit mapování situace, kontakt a první bezpečný krok.'
          : selectedClient.status === 'V mapování'
            ? 'Vybrat program, cíle spolupráce a připravit první formuláře.'
            : selectedClient.status === 'Zařazen do programu'
              ? 'Hlídání průběžných cílů, dokumentů a dalších setkání.'
              : selectedClient.status === 'Stabilizace'
                ? 'Připravit výstupní plán, návaznost a kontrolní kontakt.'
                : 'Udržet archiv kompletní a případně založit návaznou aktivitu.'
    : '';
  const clientPanelClient = filteredClients.find((client) => client.id === selectedClient?.id) ?? filteredClients[0] ?? selectedClient;
  const clientPanelDocuments = clientPanelClient
    ? clientDocuments.filter((document) => {
        const lastName = clientPanelClient.lastName.trim().toLowerCase();
        return document.clientId === clientPanelClient.id || Boolean(lastName && document.title.toLowerCase().includes(lastName));
      })
    : [];
  const clientPanelPendingDocuments = clientPanelDocuments.filter(
    (document) => !document.signedAt && ['prepared', 'pending', 'draft'].includes(document.status.toLowerCase())
  );
  const clientPanelNotifications = clientPanelClient
    ? notifications.filter((notification) => {
        const haystack = `${notification.title} ${notification.body} ${notification.category}`.toLowerCase();
        const email = clientPanelClient.email.trim().toLowerCase();
        const fullName = `${clientPanelClient.firstName} ${clientPanelClient.lastName}`.toLowerCase();
        return notification.recipientId === clientPanelClient.id || Boolean(email && haystack.includes(email)) || Boolean(fullName.trim() && haystack.includes(fullName));
      })
    : [];
  const clientPanelNextStep = clientPanelClient
    ? !clientPanelClient.operationalId?.trim()
      ? 'Vygenerovat interní ID a uložit ho ke kartě klienta.'
      : clientPanelPendingDocuments.length > 0
        ? 'Dokončit podpis nebo archivaci připravených dokumentů.'
        : clientPanelClient.status === 'Nový kontakt'
          ? 'Doplnit mapování situace, kontakt a první bezpečný krok.'
          : clientPanelClient.status === 'V mapování'
            ? 'Vybrat program, cíle spolupráce a připravit první formuláře.'
            : clientPanelClient.status === 'Zařazen do programu'
              ? 'Hlídání průběžných cílů, dokumentů a dalších setkání.'
              : clientPanelClient.status === 'Stabilizace'
                ? 'Připravit výstupní plán, návaznost a kontrolní kontakt.'
                : 'Udržet archiv kompletní a případně založit návaznou aktivitu.'
    : '';
  const unreadNotifications = notifications.filter((notification) => !notification.readAt);
  const activeUsers = managedUsers.filter((user) => user.isActive);
  const pendingDocuments = clientDocuments.filter((document) => !document.signedAt && ['prepared', 'pending', 'draft'].includes(document.status.toLowerCase()));
  const activeSlides = slides.filter((slide) => slide.isActive).sort((first, second) => first.sortOrder - second.sortOrder);
  const clientsWithoutOperationalId = clients.filter((client) => !client.operationalId?.trim()).length;
  const newsById = new Map(news.map((item) => [item.id, item]));
  const notificationTargets = notifications.map((notification) => ({
    notification,
    target: parseAdminActivityLink(notification.linkHref)
  }));
  const notifiedCommentIds = new Set(
    notificationTargets
      .map(({ target }) => getAdminActivityQueryParam(target?.href, 'comment'))
      .filter(Boolean)
  );
  const notifiedNewsLikeIds = new Set(
    notificationTargets
      .filter(({ notification }) => notification.title.toLowerCase().includes('srdíčko'))
      .map(({ target }) => target?.newsId)
      .filter(Boolean)
  );
  const notifiedUserIds = new Set(notificationTargets.map(({ target }) => target?.userId).filter(Boolean));
  const registrationUsers = managedUsers.filter((user) => user.role === 'applicant');
  const pendingProjectApplications = projectApplications.filter((application) => application.status === 'pending');
  const interactionActivityCount = Object.values(discussion.likes).reduce((sum, item) => sum + Number(item.count || 0), 0) + discussion.comments.length;
  const adminActivityItems: AdminActivityItem[] = [
    ...notifications.slice(0, 18).map((notification) => ({
      id: `notification-${notification.id}`,
      kind: 'notification' as const,
      title: notification.title,
      text: notification.body,
      date: notification.createdAt,
      tone: notification.readAt ? 'info' : toFeedbackTone(notification.tone || 'warning'),
      icon: Bell,
      target: {
        ...(parseAdminActivityLink(notification.linkHref) ?? { tab: 'notifications' as AdminSection, href: notification.linkHref }),
        notificationId: notification.id
      },
      unread: !notification.readAt,
      meta: notification.category
    })),
    ...discussion.comments
      .filter((comment) => !notifiedCommentIds.has(comment.id))
      .slice(-20)
      .map((comment) => ({
        id: `comment-${comment.id}`,
        kind: 'comment' as const,
        title: 'Přidaný komentář',
        text: `${comment.authorName}: ${shortenActivityText(comment.body, 120)}`,
        date: comment.createdAt,
        tone: 'info' as const,
        icon: MessageCircle,
        target: { tab: 'news' as AdminSection, newsId: comment.newsId },
        meta: newsById.get(comment.newsId)?.title ?? 'Aktualita'
      })),
    ...Object.values(discussion.likes)
      .filter((like) => Number(like.count || 0) > 0 && !notifiedNewsLikeIds.has(like.newsId))
      .map((like) => ({
        id: `like-${like.newsId}-${like.count}`,
        kind: 'like' as const,
        title: 'Srdíčka u aktuality',
        text: `${like.count}x <3 u „${newsById.get(like.newsId)?.title ?? 'aktuality'}“`,
        date: newsById.get(like.newsId)?.date ?? todayIso(),
        tone: 'success' as const,
        icon: Heart,
        target: { tab: 'news' as AdminSection, newsId: like.newsId },
        meta: 'Aktuality'
      })),
    ...registrationUsers
      .filter((user) => !notifiedUserIds.has(user.id))
      .slice(0, 12)
      .map((user) => ({
        id: `registration-${user.id}`,
        kind: 'registration' as const,
        title: 'Nová registrace',
        text: `${user.name} - ${user.email}`,
        date: user.createdAt,
        tone: 'success' as const,
        icon: UserRound,
        target: { tab: 'users' as AdminSection, userId: user.id },
        meta: 'Klientský účet'
      })),
    ...clientDocuments.slice(0, 8).map((document) => ({
      id: `document-${document.id}`,
      kind: 'document' as const,
      title: document.title,
      text: `Dokument: ${document.status || 'bez stavu'}`,
      date: document.createdAt,
      tone: document.signedAt ? 'success' as const : 'warning' as const,
      icon: ClipboardList,
      target: { tab: 'forms' as AdminSection, documentId: document.id },
      meta: 'Dokument'
    })),
    ...clients.slice(0, 8).map((client) => ({
      id: `client-${client.id}`,
      kind: 'client' as const,
      title: `${client.firstName} ${client.lastName}`,
      text: `Klient: ${client.program} - ${client.status}`,
      date: client.createdAt,
      tone: 'success' as const,
      icon: Users,
      target: { tab: 'clients' as AdminSection, clientId: client.id },
      meta: client.operationalId ? client.operationalId : 'bez ID'
    })),
    ...news.slice(0, 8).map((item) => ({
      id: `news-${item.id}`,
      kind: 'news' as const,
      title: item.title,
      text: 'Aktualita publikovaná na webu',
      date: item.date,
      tone: 'info' as const,
      icon: Newspaper,
      target: { tab: 'news' as AdminSection, newsId: item.id },
      meta: 'Aktualita'
    }))
  ].sort((left, right) => {
    const leftDate = new Date(left.date).getTime();
    const rightDate = new Date(right.date).getTime();
    return (Number.isNaN(rightDate) ? 0 : rightDate) - (Number.isNaN(leftDate) ? 0 : leftDate);
  });
  const systemActivityItems = adminActivityItems.filter((item) => item.kind === 'like' || item.kind === 'comment' || item.kind === 'registration');
  const newsReactionCount = Object.values(discussion.likes).reduce((sum, like) => sum + Number(like.count || 0), 0);
  const previewNews = (focusedNewsId ? news.find((item) => item.id === focusedNewsId) : null) ?? news[0] ?? null;
  const previewNewsComments = previewNews
    ? discussion.comments
        .filter((comment) => comment.newsId === previewNews.id)
        .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
    : [];
  const previewNewsLike = previewNews ? discussion.likes[previewNews.id] : null;

  React.useEffect(() => {
    const barcodeValue = toolsDraft.barcodeValue.trim();
    const barcodeElement = barcodeRef.current;
    if (!barcodeElement || !barcodeValue) return;
    let isCancelled = false;
    import('jsbarcode')
      .then(({ default: renderBarcode }) => {
        if (isCancelled) return;
        renderBarcode(barcodeElement, barcodeValue, {
        format: 'CODE128',
        lineColor: '#14231b',
        width: 2,
        height: 86,
        displayValue: true,
        font: 'Poppins',
        fontSize: 16,
        margin: 14
      });
      })
      .catch((error) => {
        if (!isCancelled) {
          onNotify('error', 'Čárový kód nejde vykreslit', error instanceof Error ? error.message : 'Zkontrolujte hodnotu kódu.');
        }
      });
    return () => {
      isCancelled = true;
    };
  }, [onNotify, toolsDraft.barcodeValue]);

  React.useEffect(() => {
    const qrValue = toolsDraft.qrValue.trim();
    const qrCanvas = qrCanvasRef.current;
    if (!qrCanvas || !qrValue) return;
    let isCancelled = false;
    import('qrcode')
      .then((qrCodeModule) => {
        if (isCancelled) return undefined;
        const qrCode = qrCodeModule.default ?? qrCodeModule;
        return qrCode.toCanvas(qrCanvas, qrValue, {
          width: 236,
          margin: 2,
          errorCorrectionLevel: 'M',
          color: {
            dark: '#14231b',
            light: '#ffffff'
          }
        });
      })
      .catch((error) => {
        if (!isCancelled) {
          onNotify('error', 'QR kód nejde vykreslit', error instanceof Error ? error.message : 'Zkontrolujte hodnotu QR kódu.');
        }
      });
    return () => {
      isCancelled = true;
    };
  }, [onNotify, toolsDraft.qrValue]);

  React.useEffect(() => {
    if (!selectedClientId && clients[0]) setSelectedClientId(clients[0].id);
  }, [clients, selectedClientId]);

  React.useEffect(() => {
    if (!selectedToolsClient) return;
    const savedOperationalId = selectedToolsClient.operationalId?.trim() ?? '';
    const nextDraft: AdminToolsDraft = {
      firstName: selectedToolsClient.firstName,
      lastName: selectedToolsClient.lastName,
      registrationDate: dateToInputValue(selectedToolsClient.createdAt),
      sequence: clientSequenceNumber(clients, selectedToolsClient.id),
      generatedId: savedOperationalId,
      barcodeValue: savedOperationalId,
      qrValue: savedOperationalId
    };
    setToolsDraft((current) =>
      current.firstName === nextDraft.firstName &&
      current.lastName === nextDraft.lastName &&
      current.registrationDate === nextDraft.registrationDate &&
      current.sequence === nextDraft.sequence &&
      current.generatedId === nextDraft.generatedId &&
      current.barcodeValue === nextDraft.barcodeValue &&
      current.qrValue === nextDraft.qrValue
        ? current
        : nextDraft
    );
  }, [clients, selectedToolsClient, setToolsDraft]);

  React.useEffect(() => {
    if (!formTemplates.length) return;
    if (!selectedTemplateId || !formTemplates.some((template) => template.id === selectedTemplateId)) {
      setSelectedTemplateId(formTemplates[0].id);
    }
  }, [formTemplates, selectedTemplateId]);

  const saveClient = async (event: React.FormEvent) => {
    event.preventDefault();
    const id = clientForm.id || crypto.randomUUID();
    const nextClient = {
      ...clientForm,
      id,
      createdAt: clientForm.createdAt || todayIso()
    };
    let savedClient = nextClient;
    if (onClientSaveRequest) {
      try {
        savedClient = await onClientSaveRequest(nextClient);
        setAdminMessageTone('success');
        setAdminMessage('Klient je uložený v databázi.');
        onNotify('success', 'Klient uložen', `${savedClient.firstName} ${savedClient.lastName} je uložený v databázi.`);
      } catch {
        setAdminMessageTone('warning');
        setAdminMessage('Klient je uložený v aktuální administraci.');
        onNotify('warning', 'Klient uložen', 'Zkontrolujte stav záznamu později.');
      }
    }
    onClientsChange((current) => {
      const exists = current.some((client) => client.id === savedClient.id);
      return exists
        ? current.map((client) => (client.id === savedClient.id ? savedClient : client))
        : [savedClient, ...current];
    });
    setSelectedClientId(savedClient.id);
    setClientForm(emptyClient);
    if (!onClientSaveRequest) {
      setAdminMessageTone('success');
      setAdminMessage('Klient je uložený v aktuální administraci.');
      onNotify('success', 'Klient uložen', 'Záznam byl uložen.');
    }
  };

  const editClient = (client: ClientRecord) => {
    setClientForm({ ...emptyClient, ...client, operationalId: client.operationalId || '' });
    setSelectedClientId(client.id);
    setActiveTab('clients');
    onNotify('info', 'Klient načten k úpravě', `${client.firstName} ${client.lastName}`);
  };

  const clearClientForm = () => {
    setClientForm(emptyClient);
    onNotify('info', 'Formulář klienta vyčištěn', 'Můžete zadat nový kontakt.');
  };

  const deleteClient = async (client: ClientRecord) => {
    if (!onClientDeleteRequest) {
      onNotify('warning', 'Mazání klientů není dostupné', 'Akci zkuste zopakovat později.');
      return;
    }
    const relatedDocuments = clientDocuments.filter((document) => document.clientId === client.id).length;
    const confirmed = window.confirm(
      `Opravdu smazat klienta ${client.firstName} ${client.lastName}?` +
        (relatedDocuments > 0
          ? ` Navázané dokumenty (${relatedDocuments}) zůstanou v evidenci, jen se odpojí od této klientské karty.`
          : '') +
        ' Tato akce nejde vrátit zpět.'
    );
    if (!confirmed) return;
    try {
      const result = await onClientDeleteRequest(client.id);
      onClientsChange((current) => current.filter((item) => item.id !== client.id));
      setSelectedClientId((current) => (current === client.id ? '' : current));
      setClientForm((current) => (current.id === client.id ? emptyClient : current));
      onNotify(
        'success',
        'Klient smazán',
        result.detachedDocuments > 0
          ? `Klientská karta byla odstraněna. Dokumenty ponechány v evidenci: ${result.detachedDocuments}.`
          : 'Duplicitní klientská karta byla odstraněna.'
      );
    } catch (error) {
      onNotify('error', 'Klienta se nepodařilo smazat', error instanceof Error ? error.message : 'Zkuste to prosím znovu.');
    }
  };

  const openNewsDialog = (item?: NewsItem) => {
    setNewsForm(
      item ?? {
        id: '',
        title: '',
        slug: '',
        date: todayIso(),
        excerpt: '',
        body: '',
        tag: 'Aktuality projektu',
        imageUrl: ''
      }
    );
    setIsNewsDialogOpen(true);
    onNotify('info', item ? 'Aktualita načtena k úpravě' : 'Nová aktualita', item?.title ?? 'Můžete začít psát.');
  };

  const closeNewsDialog = () => {
    setIsNewsDialogOpen(false);
    setNewsForm({ id: '', title: '', date: todayIso(), excerpt: '', body: '', tag: '', imageUrl: '' });
    setNewsUndoStack([]);
  };

  const insertNewsBody = (before: string, after = '', placeholder = '') => {
    const textarea = newsBodyRef.current;
    setNewsForm((current) => {
      const body = current.body || '';
      setNewsUndoStack((stack) => [...stack.slice(-14), body]);
      const start = textarea?.selectionStart ?? body.length;
      const end = textarea?.selectionEnd ?? body.length;
      const selected = body.slice(start, end) || placeholder;
      const nextBody = `${body.slice(0, start)}${before}${selected}${after}${body.slice(end)}`;
      window.requestAnimationFrame(() => {
        textarea?.focus();
        const cursor = start + before.length + selected.length + after.length;
        textarea?.setSelectionRange(cursor, cursor);
      });
      return { ...current, body: nextBody };
    });
  };

  const undoNewsBodyInsert = () => {
    setNewsUndoStack((stack) => {
      const previous = stack[stack.length - 1];
      if (previous === undefined) return stack;
      setNewsForm((current) => ({ ...current, body: previous }));
      return stack.slice(0, -1);
    });
    window.requestAnimationFrame(() => newsBodyRef.current?.focus());
  };

  const insertNewsMedia = (type: 'image' | 'video' | 'link') => {
    const url = window.prompt(type === 'image' ? 'URL obrázku' : type === 'video' ? 'URL videa nebo embed iframe' : 'URL odkazu');
    if (!url) return;
    const trimmed = url.trim();
    if (type === 'image') {
      insertNewsBody(`<figure><img src="${trimmed}" alt="" width="1200" height="675" /><figcaption>Popisek obrázku</figcaption></figure>`);
      return;
    }
    if (type === 'video') {
      const embed = trimmed.startsWith('<iframe')
        ? trimmed
        : `<iframe src="${trimmed}" title="Video" loading="lazy" allowfullscreen></iframe>`;
      insertNewsBody(`<div class="news-video">${embed}</div>`);
      return;
    }
    insertNewsBody(`<a href="${trimmed}" target="_blank" rel="noreferrer">`, '</a>', 'Text odkazu');
  };

  const uploadImageFromComputer = async (file: File, category: string) => {
    if (!file.type.startsWith('image/')) {
      onNotify('warning', 'Soubor není obrázek', 'Vyberte JPG, PNG, WebP, AVIF nebo jiný podporovaný obrázek.');
      return '';
    }
    if (!onMediaUploadRequest) {
      onNotify('warning', 'Nahrávání není dostupné', 'Upload endpoint není právě dostupný.');
      return '';
    }
    setImageUploadBusy(category);
    try {
      const uploaded = await onMediaUploadRequest(file, category);
      onNotify('success', 'Obrázek nahrán', file.name);
      return resolvePublicFileUrl(uploaded.fileUrl);
    } catch (error) {
      onNotify('error', 'Obrázek se nepodařilo nahrát', error instanceof Error ? error.message : 'Zkuste to prosím znovu.');
      return '';
    } finally {
      setImageUploadBusy('');
    }
  };

  const uploadNewsThumbnail = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = '';
    if (!file) return;
    const fileUrl = await uploadImageFromComputer(file, 'news');
    if (fileUrl) setNewsForm((current) => ({ ...current, imageUrl: fileUrl }));
  };

  const uploadNewsBodyImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = '';
    if (!file) return;
    const fileUrl = await uploadImageFromComputer(file, 'news');
    if (fileUrl) {
      insertNewsBody(`<figure><img src="${fileUrl}" alt="" width="1200" height="675" /><figcaption>Popisek obrázku</figcaption></figure>`);
    }
  };

  const uploadSlideImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = '';
    if (!file) return;
    const fileUrl = await uploadImageFromComputer(file, 'hero');
    if (fileUrl) setSlideForm((current) => ({ ...current, imageUrl: fileUrl }));
  };

  const uploadHomepageContentImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = '';
    if (!file) return;
    const fileUrl = await uploadImageFromComputer(file, 'homepage-gallery');
    if (fileUrl) setHomepageContentForm((current) => ({ ...current, imageUrl: fileUrl }));
  };

  const saveNews = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newsForm.title.trim()) return;
    const id = newsForm.id || crypto.randomUUID();
    let nextItem: NewsItem = {
      ...newsForm,
      id,
      slug: slugifyPathSegment(newsForm.slug || newsForm.title),
      date: newsForm.date || todayIso(),
      body: cleanNewsHtml(newsForm.body || '', newsForm.title || 'Obrázek k aktualitě'),
      tag: newsForm.tag?.trim() || 'Aktuality projektu'
    };
    if (onNewsSaveRequest) {
      try {
        const savedItem = await onNewsSaveRequest(nextItem);
        nextItem = { ...savedItem, body: savedItem.body || '' };
        setAdminMessageTone('success');
        setAdminMessage('Aktualita je uložená v databázi.');
        onNotify('success', 'Aktualita uložena', nextItem.title);
      } catch {
        setAdminMessageTone('warning');
        setAdminMessage('Aktualita je uložená v aktuální administraci.');
        onNotify('warning', 'Aktualita uložena', 'Zkontrolujte stav záznamu později.');
      }
    }
    onNewsChange((current) => {
      const exists = current.some((item) => item.id === nextItem.id);
      const updated = exists
        ? current.map((item) => (item.id === nextItem.id ? nextItem : item))
        : [nextItem, ...current];
      return updated.sort((left, right) => right.date.localeCompare(left.date));
    });
    closeNewsDialog();
    if (!onNewsSaveRequest) {
      setAdminMessageTone('success');
      setAdminMessage('Aktualita je uložená v aktuální administraci.');
      onNotify('success', 'Aktualita uložena', 'Záznam byl uložen.');
    }
  };

  const deleteNews = async (item: NewsItem) => {
    if (!window.confirm(`Smazat aktualitu "${item.title}"?`)) return;
    let removedFromDatabase = false;
    let removedStaleLocalItem = false;
    if (onNewsDeleteRequest) {
      try {
        await onNewsDeleteRequest(item.id);
        removedFromDatabase = true;
      } catch (error) {
        if (error instanceof ApiRequestError && error.status === 404) {
          removedStaleLocalItem = true;
        } else {
          setAdminMessageTone('error');
          setAdminMessage(error instanceof Error ? error.message : 'Aktualitu se nepodařilo smazat.');
          onNotify('error', 'Mazání selhalo', error instanceof Error ? error.message : 'Zkuste to prosím znovu.');
          return;
        }
      }
    }
    onNewsChange((current) => current.filter((newsItem) => newsItem.id !== item.id));
    if (newsForm.id === item.id) closeNewsDialog();
    if (removedFromDatabase) {
      setAdminMessageTone('success');
      setAdminMessage('Aktualita byla smazána z databáze.');
      onNotify('info', 'Aktualita smazána', item.title);
    } else if (removedStaleLocalItem) {
      setAdminMessageTone('warning');
      setAdminMessage('Aktualita už v databázi nebyla. Odstranil jsem ji z lokální administrace.');
      onNotify('warning', 'Lokální aktualita odstraněna', 'Záznam v databázi už neexistoval.');
    }
  };

  const saveSlide = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!slideForm.title.trim() || !slideForm.subtitle.trim() || !slideForm.imageUrl.trim()) {
      onNotify('warning', 'Hero slide není kompletní', 'Vyplňte nadpis, text a obrázek.');
      return;
    }
    const id = slideForm.id || crypto.randomUUID();
    let nextItem = { ...slideForm, id };
    if (onSlideSaveRequest) {
      try {
        nextItem = await onSlideSaveRequest(nextItem);
        setAdminMessageTone('success');
        setAdminMessage('Slide je uložený v databázi.');
        onNotify('success', 'Slide uložen', nextItem.title);
      } catch {
        setAdminMessageTone('warning');
        setAdminMessage('Slide je uložený v aktuální administraci.');
        onNotify('warning', 'Slide uložen', 'Zkontrolujte stav záznamu později.');
      }
    }
    onSlidesChange((current) => {
      const exists = current.some((item) => item.id === nextItem.id);
      const updated = exists
        ? current.map((item) => (item.id === nextItem.id ? nextItem : item))
        : [...current, nextItem];
      return updated.sort((left, right) => left.sortOrder - right.sortOrder);
    });
    setSlideForm({
      id: '',
      title: '',
      subtitle: '',
      imageUrl: '/images/slides/restart-tree.jpg',
      ctaLabel: '',
      ctaHref: '/kontakt',
      sortOrder: Math.max(0, ...slides.map((slide) => slide.sortOrder)) + 10,
      isActive: true
    });
    if (!onSlideSaveRequest) {
      setAdminMessageTone('success');
      setAdminMessage('Slide je uložený v aktuální administraci.');
      onNotify('success', 'Slide uložen', 'Záznam byl uložen.');
    }
  };

  const saveHomepageContentItem = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!homepageContentForm.title.trim() || !homepageContentForm.body.trim()) {
      onNotify('warning', 'Obsah není kompletní', 'Vyplňte nadpis a hlavní text.');
      return;
    }
    if (homepageContentForm.contentType === 'gallery' && !homepageContentForm.imageUrl.trim()) {
      onNotify('warning', 'Fotografie chybí', 'Vyberte obrázek z médií nebo jej nahrajte z počítače.');
      return;
    }
    const id =
      homepageContentForm.id ||
      (homepageContentForm.contentType === 'gallery' ? `gallery-${crypto.randomUUID()}` : crypto.randomUUID());
    let nextItem: HomepageContentItem = {
      ...homepageContentForm,
      id,
      updatedAt: new Date().toISOString()
    };
    if (onHomepageContentSaveRequest) {
      try {
        nextItem = await onHomepageContentSaveRequest(nextItem);
        setAdminMessageTone('success');
        setAdminMessage('Obsah homepage je uložený v databázi.');
        onNotify('success', 'Obsah uložen', nextItem.title);
      } catch (error) {
        setAdminMessageTone('error');
        setAdminMessage(error instanceof Error ? error.message : 'Obsah se nepodařilo uložit.');
        onNotify('error', 'Uložení selhalo', error instanceof Error ? error.message : 'Zkuste to prosím znovu.');
        return;
      }
    }
    onHomepageContentChange((current) => {
      const exists = current.some((item) => item.id === nextItem.id);
      const updated = exists
        ? current.map((item) => (item.id === nextItem.id ? nextItem : item))
        : [...current, nextItem];
      return updated.sort((left, right) => left.sortOrder - right.sortOrder);
    });
    setHomepageContentForm(nextItem);
  };

  const updateClientField = (field: keyof ClientRecord, value: string) => {
    setClientForm((current) => ({ ...current, [field]: value }));
  };

  const printForm = () => {
    if (!selectedClient) {
      onNotify('warning', 'Formulář nejde tisknout', 'Nejdřív vyberte nebo zaregistrujte klienta.');
      return;
    }
    onNotify('info', 'Připravuji tisk', `${selectedTemplate.title} pro klienta ${selectedClient.firstName} ${selectedClient.lastName}.`);
    window.print();
  };

  const downloadFilledPdf = async () => {
    if (!selectedClient) {
      onNotify('warning', 'PDF nejde vyplnit', 'Nejdřív vyberte klienta.');
      return;
    }
    if (!selectedTemplateFileUrl) {
      onNotify('warning', 'PDF není k dispozici', 'Šablona nemá navázaný soubor PDF.');
      return;
    }
    try {
      const result = await fillFormPdf({
        fileUrl: selectedTemplateFileUrl,
        templateId: selectedTemplate.id,
        formUid: selectedTemplate.formUid,
        templateTitle: selectedTemplate.title,
        client: selectedClient,
        draft,
        values: {
          internalId: selectedClient.operationalId || '',
          clientName: clientFullName(selectedClient),
          birthDate: selectedClient.birthDate || '',
          phone: selectedClient.phone || '',
          email: selectedClient.email || '',
          address: selectedClient.address || '',
          contact: [selectedClient.phone, selectedClient.email, selectedClient.address].filter(Boolean).join(' | '),
          program: selectedClient.program || '',
          printDate: new Date().toLocaleDateString('cs-CZ'),
          workerNote: draft.workerNote || draft.handoverNote || ''
        }
      });
      const objectUrl = URL.createObjectURL(result.blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = result.fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
      onNotify('success', 'Vyplněné PDF připraveno', `${result.filledFields} polí bylo předvyplněno.`);
    } catch (error) {
      onNotify('error', 'PDF se nepodařilo vyplnit', error instanceof Error ? error.message : 'Zkuste to prosím znovu.');
    }
  };

  const registerPreparedDocument = async () => {
    if (!selectedClient) {
      onNotify('warning', 'Dokument nejde zapsat', 'Nejdřív vyberte klienta.');
      return;
    }
    const documentDraft: Omit<ClientDocument, 'createdAt'> & { createdAt?: string } = {
      id: crypto.randomUUID(),
      clientId: selectedClient.id,
      userId: null,
      mediaId: null,
      title: `${selectedTemplate.title} - ${selectedClient.firstName} ${selectedClient.lastName}`,
      documentType: 'form',
      status: 'prepared',
      fileUrl: selectedTemplateFileUrl,
      notes: [
        `Program: ${selectedClient.program}`,
        draft.handoverNote ? `Předání: ${draft.handoverNote}` : '',
        draft.signatureNote ? `Podpis: ${draft.signatureNote}` : ''
      ]
        .filter(Boolean)
        .join(' | '),
      signedAt: null
    };
    if (!onDocumentSaveRequest) {
      onNotify('warning', 'Dokument není zapsaný', 'Dokument lze vytisknout, zápis zkuste zopakovat později.');
      return;
    }
    try {
      await onDocumentSaveRequest(documentDraft);
      onNotify('success', 'Dokument zapsán', 'Formulář je evidovaný u klienta jako připravený k podpisu.');
    } catch (error) {
      onNotify('error', 'Dokument se nepodařilo zapsat', error instanceof Error ? error.message : 'Zkuste to prosím znovu.');
    }
  };

  const updateManagedUser = async (user: ManagedUser, patch: Partial<Pick<ManagedUser, 'role' | 'isActive'>>) => {
    if (!onUserUpdateRequest) {
      onNotify('warning', 'Správa rolí není dostupná', 'Změnu role zkuste zopakovat později.');
      return;
    }
    try {
      const saved = await onUserUpdateRequest({ id: user.id, role: patch.role ?? user.role, isActive: patch.isActive ?? user.isActive });
      onNotify('success', 'Uživatel upraven', `${saved.name} má aktualizovaná oprávnění.`);
    } catch (error) {
      onNotify('error', 'Uživatel se nepodařil upravit', error instanceof Error ? error.message : 'Zkuste to prosím znovu.');
    }
  };

  const resetManagedUserPassword = async (user: ManagedUser) => {
    if (!onUserResetPasswordRequest) {
      onNotify('warning', 'Reset hesla není dostupný', 'Akci zkuste zopakovat později.');
      return;
    }
    try {
      const reset = await onUserResetPasswordRequest(user.id);
      const detail = reset.emailSent
        ? `Odkaz byl odeslán na ${reset.email}.`
        : reset.resetUrl
          ? `E-mail není nastavený. Odkaz: ${reset.resetUrl}`
          : 'Reset byl připraven, ale e-mailová brána není nastavená.';
      onNotify('success', 'Reset hesla připraven', detail);
    } catch (error) {
      onNotify('error', 'Reset hesla se nepodařil', error instanceof Error ? error.message : 'Zkuste to prosím znovu.');
    }
  };

  const deleteManagedUser = async (user: ManagedUser) => {
    if (!onUserDeleteRequest) {
      onNotify('warning', 'Mazání účtů není dostupné', 'Akci zkuste zopakovat později.');
      return;
    }
    if (user.id === account.id) {
      onNotify('warning', 'Vlastní účet nelze smazat', 'Nejdřív se přihlaste jiným administrátorským účtem.');
      return;
    }
    const confirmed = window.confirm(`Opravdu smazat účet ${user.name} (${user.email})? Tato akce nejde vrátit zpět.`);
    if (!confirmed) return;
    try {
      await onUserDeleteRequest(user.id);
      setAdminDialog(null);
      onNotify('success', 'Uživatel smazán', `${user.name} byl/a odstraněn/a ze systému.`);
    } catch (error) {
      onNotify('error', 'Uživatel se nepodařil smazat', error instanceof Error ? error.message : 'Zkuste to prosím znovu.');
    }
  };

  const openTemplateDialog = (template: FormTemplate) => {
    selectTemplateForForm(template.id);
    setAdminDialog({ type: 'template', template });
  };

  const openMediaDialog = (file?: MediaFile) => {
    const nextMedia =
      file ?? {
        id: '',
        title: '',
        fileName: '',
        fileUrl: '',
        mimeType: 'image/jpeg',
        fileSize: 0,
        category: 'visual',
        altText: '',
        uploadedBy: account.id,
        createdAt: todayIso()
      };
    setMediaForm(nextMedia);
    setMediaUploadFile(null);
    setAdminDialog({ type: 'media', media: nextMedia });
    onNotify('info', file ? 'Médium načteno k úpravě' : 'Nové médium', file?.title ?? 'Zadejte název a cestu k souboru.');
  };

  const onMediaUploadSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.currentTarget.files?.[0] || null;
    setMediaUploadFile(selectedFile);
    if (!selectedFile) return;
    const detectedMimeType = selectedFile.type || inferMediaMimeType(selectedFile.name);
    setMediaForm((current) => {
      const shouldInferCategory = !current.id && (!current.category || current.category === 'visual');
      return {
        ...current,
        title: current.title || selectedFile.name.replace(/\.[^.]+$/, ''),
        fileName: selectedFile.name,
        mimeType: detectedMimeType,
        category: shouldInferCategory ? inferMediaCategory(detectedMimeType) : current.category,
        fileSize: selectedFile.size
      };
    });
    onNotify('info', 'Soubor zvolen', `Nahrávání připraveno: ${selectedFile.name}`);
  };

  const saveMediaDialog = async (event: React.FormEvent) => {
    event.preventDefault();
    let fileName = mediaForm.fileName.trim() || mediaForm.fileUrl.split('/').pop() || mediaForm.title.trim();
    let fileUrl = mediaForm.fileUrl.trim();
    let mimeType = mediaForm.mimeType.trim() || 'application/octet-stream';
    let fileSize = Number(mediaForm.fileSize) || 0;

    if (mediaUploadFile) {
      if (!onMediaUploadRequest) {
        onNotify('warning', 'Nahrávání je vypnuté', 'Soubor nejde uložit bez dostupného upload endpointu.');
        return;
      }
      try {
        const uploaded = await onMediaUploadRequest(mediaUploadFile, mediaForm.category || TRANSPARENCY_DOCUMENT_CATEGORY);
        fileUrl = uploaded.fileUrl;
        fileName = mediaForm.fileName.trim() || uploaded.fileName;
        mimeType = uploaded.mimeType || mimeType;
        fileSize = uploaded.fileSize || fileSize;
        onNotify('success', 'Soubor nahrán', `${mediaUploadFile.name} je uložen na serveru.`);
      } catch (error) {
        onNotify('error', 'Nahrávání souboru selhalo', error instanceof Error ? error.message : 'Zkuste to prosím znovu.');
        return;
      }
    }

    const nextMedia: MediaFile = {
      ...mediaForm,
      id: mediaForm.id || crypto.randomUUID(),
      title: mediaForm.title.trim(),
      fileName,
      fileUrl,
      mimeType,
      fileSize,
      category: mediaForm.category.trim() || 'visual',
      altText: mediaForm.altText.trim(),
      uploadedBy: mediaForm.uploadedBy || account.id,
      createdAt: mediaForm.createdAt || todayIso()
    };
    if (!nextMedia.title || !nextMedia.fileUrl) {
      onNotify('warning', 'Médium nejde uložit', 'Vyplňte název a URL souboru.');
      return;
    }
    if (!onMediaSaveRequest) {
      onNotify('warning', 'Médium nejde uložit', 'Uložení zkuste zopakovat později.');
      return;
    }
    try {
      const saved = await onMediaSaveRequest(nextMedia);
      setMediaForm(saved);
      setAdminDialog({ type: 'media', media: saved });
      setMediaUploadFile(null);
      onNotify('success', 'Médium uloženo', saved.title);
    } catch (error) {
      onNotify('error', 'Médium se nepodařilo uložit', error instanceof Error ? error.message : 'Zkuste to prosím znovu.');
    }
  };

  const openUserDialog = (user: ManagedUser) => {
    setManagedUserForm(user);
    setAdminDialog({ type: 'user', user });
    onNotify('info', 'Uživatel načten', user.email);
  };

  const saveUserDialog = async (event: React.FormEvent) => {
    event.preventDefault();
    const source = managedUsers.find((user) => user.id === managedUserForm.id) ?? managedUserForm;
    await updateManagedUser(source, { role: managedUserForm.role, isActive: managedUserForm.isActive });
    setAdminDialog((current) => (current?.type === 'user' ? { type: 'user', user: { ...source, role: managedUserForm.role, isActive: managedUserForm.isActive } } : current));
  };

  const reviewApplication = async (application: ProjectApplication, status: 'approved' | 'rejected', approvedRole: ApiRole = application.requestedRole) => {
    if (!onProjectApplicationReviewRequest) {
      onNotify('warning', 'Schvalování není dostupné', 'Zkuste akci zopakovat později.');
      return;
    }
    try {
      const adminNote =
        status === 'approved'
          ? `Schváleno jako ${roleLabels[approvedRole]}. Žadateli byla odeslána potvrzovací notifikace.`
          : 'Bohužel žádost nyní nemůžeme schválit z kapacitních důvodů. Děkujeme za pochopení. Pokud se možnosti projektu rozšíří, můžeme se k žádosti vrátit.';
      const saved = await onProjectApplicationReviewRequest(application.id, status, approvedRole, adminNote);
      onNotify(
        status === 'approved' ? 'success' : 'warning',
        status === 'approved' ? 'Žádost schválena' : 'Žádost zamítnuta',
        `${saved.userName} - žadateli byla odeslána notifikace.`
      );
    } catch (error) {
      onNotify('error', 'Žádost se nepodařilo vyřídit', error instanceof Error ? error.message : 'Zkuste to prosím znovu.');
    }
  };

  const openNotificationDialog = (notification?: NotificationItem) => {
    const nextNotification =
      notification ?? {
        id: '',
        recipientId: null,
        title: '',
        body: '',
        tone: 'info',
        category: 'Systém',
        linkHref: '',
        readAt: null,
        createdAt: new Date().toISOString()
      };
    setNotificationForm(nextNotification);
    setAdminDialog({ type: 'notification', notification: nextNotification });
    onNotify('info', notification ? 'Notifikace načtena' : 'Nová notifikace', notification?.title ?? 'Zadejte nadpis, text a kategorii.');
  };

  const saveNotificationDialog = async (event: React.FormEvent) => {
    event.preventDefault();
    const nextNotification: NotificationItem = {
      ...notificationForm,
      id: notificationForm.id || crypto.randomUUID(),
      title: notificationForm.title.trim(),
      body: notificationForm.body.trim(),
      tone: notificationForm.tone || 'info',
      category: notificationForm.category.trim() || 'Systém',
      linkHref: notificationForm.linkHref.trim(),
      createdAt: notificationForm.createdAt || new Date().toISOString()
    };
    if (!nextNotification.title || !nextNotification.body) {
      onNotify('warning', 'Notifikace nejde uložit', 'Vyplňte nadpis a text zprávy.');
      return;
    }
    if (!onNotificationSaveRequest) {
      onNotify('warning', 'Notifikaci nejde uložit', 'Uložení zkuste zopakovat později.');
      return;
    }
    try {
      const saved = await onNotificationSaveRequest(nextNotification);
      setNotificationForm(saved);
      setAdminDialog({ type: 'notification', notification: saved });
      onNotify('success', 'Notifikace uložena', saved.title);
    } catch (error) {
      onNotify('error', 'Notifikace se nepodařila uložit', error instanceof Error ? error.message : 'Zkuste to prosím znovu.');
    }
  };

  const markNotificationRead = async (notification: NotificationItem) => {
    if (!onNotificationReadRequest) {
      onNotify('warning', 'Stav notifikace nejde změnit', 'Akci zkuste zopakovat později.');
      return;
    }
    try {
      await onNotificationReadRequest(notification.id);
      const readAt = new Date().toISOString();
      const nextNotification = { ...notification, readAt };
      setNotificationForm((current) => (current.id === notification.id ? nextNotification : current));
      setAdminDialog((current) =>
        current?.type === 'notification' && current.notification.id === notification.id
          ? { type: 'notification', notification: nextNotification }
          : current
      );
      onNotify('success', 'Notifikace archivována', 'Upozornění je vedené jako vyřízené v auditním archivu.');
    } catch (error) {
      onNotify('error', 'Stav notifikace se nepodařilo uložit', error instanceof Error ? error.message : 'Zkuste to prosím znovu.');
    }
  };

  const markNotificationsReadBatch = async (items: NotificationItem[]) => {
    const unreadItems = items.filter((item) => !item.readAt);
    if (!unreadItems.length) {
      onNotify('info', 'Inbox je prázdný', 'Ve výběru nejsou žádné aktivní notifikace k archivaci.');
      return;
    }
    if (!onNotificationReadRequest) {
      onNotify('warning', 'Stav notifikací nejde změnit', 'Akci zkuste zopakovat později.');
      return;
    }
    const results = await Promise.allSettled(unreadItems.map((item) => onNotificationReadRequest(item.id)));
    const failedCount = results.filter((result) => result.status === 'rejected').length;
    if (failedCount > 0) {
      onNotify(
        'warning',
        'Část notifikací zůstala aktivní',
        `${unreadItems.length - failedCount} archivováno, ${failedCount} se nepodařilo uložit.`
      );
      return;
    }
    onNotify('success', 'Aktivní notifikace archivovány', `${unreadItems.length} upozornění je přesunuté do auditního archivu.`);
  };

  const loadClientIntoTools = (clientId: string) => {
    const client = clients.find((item) => item.id === clientId);
    if (!client) return;
    const savedOperationalId = client.operationalId?.trim() ?? '';
    setSelectedClientId(client.id);
    setToolsDraft((current) => ({
      ...current,
      firstName: client.firstName,
      lastName: client.lastName,
      registrationDate: dateToInputValue(client.createdAt),
      sequence: clientSequenceNumber(clients, client.id),
      generatedId: savedOperationalId,
      barcodeValue: savedOperationalId,
      qrValue: savedOperationalId
    }));
    onNotify(
      'info',
      savedOperationalId ? 'Interní ID načteno' : 'Klient načten do tools',
      savedOperationalId || `${client.firstName} ${client.lastName} zatím nemá interní ID.`
    );
  };

  const generateOperationalId = async () => {
    const sourceClient = selectedToolsClient;
    const sourceDraft = sourceClient
      ? {
          ...toolsDraft,
          firstName: sourceClient.firstName,
          lastName: sourceClient.lastName,
          registrationDate: dateToInputValue(sourceClient.createdAt),
          sequence: clientSequenceNumber(clients, sourceClient.id)
        }
      : toolsDraft;
    if (!sourceDraft.firstName.trim() && !sourceDraft.lastName.trim()) {
      onNotify('warning', 'ID nejde vygenerovat', 'Vyplňte jméno nebo příjmení klienta.');
      return;
    }
    if (sourceClient?.operationalId?.trim()) {
      const savedOperationalId = sourceClient.operationalId.trim();
      const confirmed = window.confirm(`Klient ${sourceClient.firstName} ${sourceClient.lastName} už má ID ${savedOperationalId}. Přegenerovat ID podle aktuální karty klienta?`);
      if (!confirmed) {
        setToolsDraft((current) => ({
          ...current,
          ...sourceDraft,
          generatedId: savedOperationalId,
          barcodeValue: savedOperationalId,
          qrValue: savedOperationalId
        }));
        onNotify('info', 'ID ponecháno beze změny', `${sourceClient.firstName} ${sourceClient.lastName}: ${savedOperationalId}`);
        return;
      }
    }
    const generatedId = buildClientOperationalId(sourceDraft);
    setToolsDraft((current) => ({
      ...current,
      ...sourceDraft,
      generatedId,
      barcodeValue: generatedId,
      qrValue: generatedId
    }));
    if (!sourceClient) {
      onNotify('warning', 'ID vygenerováno jen lokálně', 'Vyberte klienta z registru, aby se ID uložilo do databáze.');
      return;
    }
    const nextClient = { ...sourceClient, operationalId: generatedId };
    onClientsChange((current) => current.map((client) => (client.id === nextClient.id ? nextClient : client)));
    if (!onClientSaveRequest) {
      onNotify('success', 'ID uloženo lokálně', generatedId);
      return;
    }
    try {
      const savedClient = await onClientSaveRequest(nextClient);
      onClientsChange((current) => current.map((client) => (client.id === savedClient.id ? savedClient : client)));
      setClientForm((current) => (current.id === savedClient.id ? savedClient : current));
      setToolsDraft((current) => ({
        ...current,
        firstName: savedClient.firstName,
        lastName: savedClient.lastName,
        registrationDate: dateToInputValue(savedClient.createdAt),
        sequence: clientSequenceNumber(clients, savedClient.id),
        generatedId: savedClient.operationalId,
        barcodeValue: savedClient.operationalId,
        qrValue: savedClient.operationalId
      }));
      setAdminMessageTone('success');
      setAdminMessage('Interní ID klienta je uložené v databázi.');
      onNotify('success', 'ID uloženo ke klientovi', `${savedClient.firstName} ${savedClient.lastName}: ${savedClient.operationalId}`);
    } catch (error) {
      setAdminMessageTone('warning');
      setAdminMessage('ID je zatím jen v aktuální administraci. Databázové uložení selhalo.');
      onNotify('error', 'ID se nepodařilo uložit do DB', error instanceof Error ? error.message : 'Zkuste to prosím znovu.');
    }
  };

  const copyToolsValue = async (value: string, label: string) => {
    if (!value.trim()) {
      onNotify('warning', 'Není co kopírovat', `Nejdřív vygenerujte nebo vyplňte ${label}.`);
      return;
    }
    try {
      await navigator.clipboard.writeText(value);
      onNotify('success', 'Zkopírováno', value);
    } catch {
      onNotify('warning', 'Kopírování selhalo', 'Prohlížeč nepovolil zápis do schránky.');
    }
  };

  const downloadBarcode = () => {
    if (!barcodeRef.current || !toolsDraft.barcodeValue.trim()) {
      onNotify('warning', 'Čárový kód není připravený', 'Vyplňte hodnotu pro čárový kód.');
      return;
    }
    downloadSvgElement(barcodeRef.current, `${toolsDraft.barcodeValue.trim() || 'barcode'}.svg`);
    onNotify('success', 'Čárový kód stažen', 'SVG je připravené pro tisk nebo štítek.');
  };

  const downloadQrCode = () => {
    if (!qrCanvasRef.current || !toolsDraft.qrValue.trim()) {
      onNotify('warning', 'QR kód není připravený', 'Vyplňte hodnotu pro QR kód.');
      return;
    }
    downloadDataUrl(qrCanvasRef.current.toDataURL('image/png'), `${toolsDraft.qrValue.trim() || 'qr-code'}.png`);
    onNotify('success', 'QR kód stažen', 'PNG je připravené pro tisk nebo sdílení.');
  };

  const saveCurrentCodeToArchive = (kind: CodeArchiveKind) => {
    const value = kind === 'barcode' ? toolsDraft.barcodeValue.trim() : toolsDraft.qrValue.trim();
    if (!value) {
      onNotify('warning', kind === 'barcode' ? 'Čárový kód není připravený' : 'QR kód není připravený', 'Nejdřív vyplňte nebo vygenerujte hodnotu.');
      return;
    }
    const entry: CodeArchiveEntry = {
      id: crypto.randomUUID(),
      kind,
      value,
      clientId: selectedToolsClient?.id ?? '',
      clientName: selectedToolsClient ? `${selectedToolsClient.firstName} ${selectedToolsClient.lastName}`.trim() : `${toolsDraft.firstName} ${toolsDraft.lastName}`.trim(),
      formId: selectedTemplate?.id ?? '',
      formTitle: selectedTemplate?.title ?? '',
      note: kind === 'barcode' ? 'Ručně uložený čárový kód z Tools.' : 'Ručně uložený QR kód z Tools.',
      source: 'manual',
      createdAt: todayIso(),
      importedAt: new Date().toISOString()
    };
    let duplicate = false;
    setCodeArchive((current) => {
      duplicate = current.some((item) => item.kind === entry.kind && item.value === entry.value);
      return duplicate ? current : [entry, ...current];
    });
    if (duplicate) {
      onNotify('info', 'Kód už je v archivu', value);
      return;
    }
    onNotify('success', kind === 'barcode' ? 'Čárový kód uložen do archivu' : 'QR kód uložen do archivu', value);
  };

  const importCodeArchiveCsv = async (event: React.ChangeEvent<HTMLInputElement>, kind: CodeArchiveKind) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      const text = await readTextFile(file);
      const entries = buildCodeArchiveEntriesFromCsv(text, kind);
      if (entries.length === 0) {
        onNotify('warning', 'CSV neobsahuje kódy', 'Soubor musí mít sloupec value/hodnota/kod/qr/barcode.');
        return;
      }
      let inserted = 0;
      let skipped = 0;
      setCodeArchive((current) => {
        const existing = new Set(current.map((entry) => `${entry.kind}:${entry.value}`));
        const uniqueEntries = entries.filter((entry) => {
          const key = `${entry.kind}:${entry.value}`;
          if (existing.has(key)) {
            skipped += 1;
            return false;
          }
          existing.add(key);
          inserted += 1;
          return true;
        });
        return [...uniqueEntries, ...current];
      });
      onNotify(
        'success',
        kind === 'barcode' ? 'Čárové kódy importovány' : 'QR kódy importovány',
        `${inserted} přidáno${skipped ? `, ${skipped} duplicit přeskočeno` : ''}.`
      );
    } catch (error) {
      onNotify('error', 'CSV se nepodařilo načíst', error instanceof Error ? error.message : 'Zkontrolujte soubor a zkuste to znovu.');
    }
  };

  const deleteCodeArchiveEntry = (entry: CodeArchiveEntry) => {
    setCodeArchive((current) => current.filter((item) => item.id !== entry.id));
    onNotify('success', 'Kód odebrán z archivu', entry.value);
  };

  const exportCodeArchiveCsv = () => {
    const rows = filteredCodeArchive.length ? filteredCodeArchive : codeArchive;
    if (rows.length === 0) {
      onNotify('warning', 'Archiv je prázdný', 'Nejdřív importujte CSV nebo uložte kód z Tools.');
      return;
    }
    const escapeCell = (value: string | number) => `"${String(value ?? '').replace(/"/g, '""')}"`;
    const header = ['type', 'value', 'clientId', 'clientName', 'formId', 'formTitle', 'note', 'source', 'createdAt', 'importedAt'];
    const body = rows.map((entry) =>
      [
        entry.kind,
        entry.value,
        entry.clientId,
        entry.clientName,
        entry.formId,
        entry.formTitle,
        entry.note,
        entry.source,
        entry.createdAt,
        entry.importedAt
      ]
        .map(escapeCell)
        .join(';')
    );
    const csv = `\uFEFF${[header.join(';'), ...body].join('\r\n')}`;
    downloadDataUrl(`data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`, `restart-archiv-kodu-${todayIso()}.csv`);
    onNotify('success', 'Archiv exportován', `${rows.length} záznamů v CSV.`);
  };

  const saveSettingsDialog = (event: React.FormEvent) => {
    event.preventDefault();
    setAdminDialog(null);
    onNotify('success', 'Nastavení uloženo', 'Hodnoty administrace byly aktualizované.');
  };

  const markNotificationReadQuietly = async (notification: NotificationItem) => {
    if (notification.readAt || !onNotificationReadRequest) return;
    try {
      await onNotificationReadRequest(notification.id);
    } catch (error) {
      onNotify('warning', 'Notifikace zůstala nepřečtená', error instanceof Error ? error.message : notification.title);
    }
  };

  const focusAdminTarget = (target: AdminActivityTarget, label: string) => {
    setActiveTab(target.tab);
    if (target.clientId) {
      const client = clients.find((item) => item.id === target.clientId);
      if (client) {
        setSelectedClientId(client.id);
        setClientForm({ ...emptyClient, ...client, operationalId: client.operationalId || '' });
      }
    }
    if (target.newsId) {
      setFocusedNewsId(target.newsId);
      window.setTimeout(() => {
        const selector = `[data-news-id="${target.newsId?.replace(/"/g, '\\"')}"]`;
        document.querySelector(selector)?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }, 80);
    }
    if (target.userId) {
      const user = managedUsers.find((item) => item.id === target.userId);
      if (user) {
        setManagedUserForm(user);
        setAdminDialog({ type: 'user', user });
      }
    }
    if (target.notificationId && target.tab === 'notifications') {
      const notification = notifications.find((item) => item.id === target.notificationId);
      if (notification) openNotificationDialog(notification);
    }
    if (target.href) {
      const nextPath = target.href.replace(/^#/, '');
      if (!nextPath.startsWith('/admin') && nextPath.startsWith('/')) {
        navigateToPath(nextPath);
      }
    }
    onNotify('info', 'Aktivita otevřena', label);
  };

  const openAdminActivity = async (item: AdminActivityItem) => {
    setFocusedActivityId(item.id);
    if (item.kind === 'notification' && item.target.notificationId) {
      const notification = notifications.find((entry) => entry.id === item.target.notificationId);
      if (notification) await markNotificationReadQuietly(notification);
    }
    focusAdminTarget(item.target, item.title);
  };

  const openNotificationTarget = async (notification: NotificationItem) => {
    const target = parseAdminActivityLink(notification.linkHref);
    if (!target) {
      openNotificationDialog(notification);
      return;
    }
    await markNotificationReadQuietly(notification);
    focusAdminTarget({ ...target, notificationId: notification.id }, notification.title);
  };

  const renderActivityItem = (item: AdminActivityItem) => {
    const ActivityIcon = item.icon;
    return (
      <button
        key={item.id}
        className={`activity-feed-item ${item.unread ? 'is-unread' : ''} ${focusedActivityId === item.id ? 'is-focused' : ''}`}
        type="button"
        onClick={() => openAdminActivity(item)}
      >
        <span className={`activity-icon activity-${item.kind}`} aria-hidden="true">
          <ActivityIcon size={16} />
        </span>
        <Badge tone={item.tone}>{item.meta ?? new Date(item.date).toLocaleDateString('cs-CZ')}</Badge>
        <strong>{item.title}</strong>
        <small>{item.text}</small>
      </button>
    );
  };

  const selectAdminTab = (tab: AdminSection) => {
    setActiveTab(tab);
  };

  const selectClientForForm = (clientId: string) => {
    setSelectedClientId(clientId);
    const client = clients.find((item) => item.id === clientId);
    if (client) onNotify('info', 'Klient vybrán', `${client.firstName} ${client.lastName}`);
  };

  const selectTemplateForForm = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const template = formTemplates.find((item) => item.id === templateId);
    if (template) onNotify('info', 'Šablona vybrána', template.title);
  };

  const editNews = (item: NewsItem) => {
    openNewsDialog(item);
  };

  const editSlide = (item: HomeSlide) => {
    setSlideForm(item);
    setContentEditorTab('hero');
    selectAdminTab('content');
    onNotify('info', 'Slide načten k úpravě', item.title);
  };

  const newSlide = () => {
    setSlideForm({
      id: '',
      title: '',
      subtitle: '',
      imageUrl: '',
      ctaLabel: 'Zjistit více',
      ctaHref: '/kontakt',
      sortOrder: Math.max(0, ...slides.map((slide) => slide.sortOrder)) + 10,
      isActive: true
    });
    setContentEditorTab('hero');
    selectAdminTab('content');
    onNotify('info', 'Nový hero slide', 'Formulář je připravený.');
  };

  const editHomepageContent = (item: HomepageContentItem) => {
    setHomepageContentForm(item);
    setContentEditorTab(item.contentType === 'gallery' ? 'gallery' : 'sections');
    selectAdminTab('content');
  };

  const newHomepageGalleryItem = () => {
    setHomepageContentForm({
      id: '',
      contentType: 'gallery',
      label: '',
      title: '',
      body: '',
      imageUrl: '',
      ctaLabel: '',
      ctaHref: '',
      sortOrder:
        Math.max(
          0,
          ...homepageContent.filter((item) => item.contentType === 'gallery').map((item) => item.sortOrder)
        ) + 10,
      isActive: true,
      updatedAt: ''
    });
    setContentEditorTab('gallery');
  };

  const selectContentEditorTab = (tab: ContentEditorTab) => {
    setContentEditorTab(tab);
    if (tab === 'gallery' && homepageContentForm.contentType !== 'gallery') {
      setHomepageContentForm(
        homepageContent
          .filter((item) => item.contentType === 'gallery')
          .sort((left, right) => left.sortOrder - right.sortOrder)[0] ?? defaultHomepageGallery[0]
      );
    }
    if (tab === 'sections' && homepageContentForm.contentType !== 'section') {
      setHomepageContentForm(
        homepageContent
          .filter((item) => item.contentType === 'section')
          .sort((left, right) => left.sortOrder - right.sortOrder)[0] ?? defaultHomepageSections[0]
      );
    }
  };

  const currentAdminNav = adminNavItems.find((item) => item.id === activeTab) ?? adminNavItems[0];
  const homepageGalleryItems = homepageContent
    .filter((item) => item.contentType === 'gallery')
    .sort((left, right) => left.sortOrder - right.sortOrder);
  const homepageSectionItems = homepageContent
    .filter((item) => item.contentType === 'section')
    .sort((left, right) => left.sortOrder - right.sortOrder);
  const programChartPalette = ['#226f3f', '#4f8f16', '#bb8f3a', '#0f4b3d', '#7aa66a', '#d8b15f', '#6a8f7a', '#15382f'];
  const clientProgramStats = Array.from(
    clients.reduce((groups, client) => {
      const program = client.program?.trim() || 'Bez programu';
      groups.set(program, (groups.get(program) || 0) + 1);
      return groups;
    }, new Map<string, number>())
  )
    .map(([program, count], index) => ({
      program,
      count,
      share: clients.length > 0 ? Math.round((count / clients.length) * 100) : 0,
      color: programChartPalette[index % programChartPalette.length]
    }))
    .sort((first, second) => second.count - first.count || first.program.localeCompare(second.program, 'cs'));
  let clientProgramChartCursor = 0;
  const clientProgramChartBackground =
    clientProgramStats.length > 0 && clients.length > 0
      ? `conic-gradient(${clientProgramStats
          .map((item) => {
            const start = clientProgramChartCursor;
            const end = start + (item.count / clients.length) * 100;
            clientProgramChartCursor = end;
            return `${item.color} ${start}% ${end}%`;
          })
          .join(', ')})`
      : 'linear-gradient(135deg, rgba(34, 111, 63, 0.16), rgba(187, 143, 58, 0.16))';
  const jailbreakClients = clients.filter((client) => client.program === 'JAILBREAK');
  const institutionalCareStats = institutionalCareOptions.map((option) => {
    const count = jailbreakClients.filter((client) => (client.institutionalCareHistory || 'unknown') === option.value).length;
    return {
      ...option,
      count,
      share: jailbreakClients.length > 0 ? Math.round((count / jailbreakClients.length) * 100) : 0
    };
  });
  const childhoodBackgroundStats = childhoodBackgroundOptions
    .map((option) => {
      const count = jailbreakClients.filter((client) => (client.childhoodBackground || 'unknown') === option.value).length;
      return {
        ...option,
        count,
        share: jailbreakClients.length > 0 ? Math.round((count / jailbreakClients.length) * 100) : 0
      };
    })
    .filter((item) => item.count > 0 || item.value === 'unknown');
  const onlineWindowMs = 15 * 60 * 1000;
  const onlineUsers = managedUsers.filter((user) => {
    if (user.id === account.id) return true;
    if (!user.lastLoginAt) return false;
    const lastLogin = new Date(user.lastLoginAt).getTime();
    return Number.isFinite(lastLogin) && Date.now() - lastLogin <= onlineWindowMs;
  });
  const documentStatusLabels: Record<string, string> = {
    pending: 'Čeká na vyřízení',
    prepared: 'Připraveno k podpisu',
    draft: 'Rozpracováno',
    ready: 'Připraveno',
    signed: 'Podepsáno',
    archived: 'Archiv'
  };
  const documentQueueStats = Array.from(
    pendingDocuments.reduce((groups, document) => {
      const status = String(document.status || 'pending');
      const label = documentStatusLabels[status] || status;
      groups.set(label, (groups.get(label) || 0) + 1);
      return groups;
    }, new Map<string, number>())
  )
    .map(([label, count]) => ({ label, count }))
    .sort((first, second) => second.count - first.count || first.label.localeCompare(second.label, 'cs'));
  const formFolderStats = Array.from(
    formTemplates.reduce((groups, template) => {
      const folder = template.folder || template.formGroup || template.title || 'Bez slozky';
      groups.set(folder, (groups.get(folder) || 0) + 1);
      return groups;
    }, new Map<string, number>())
  )
    .map(([folder, count]) => ({
      folder,
      label: folder.replace(/^\d+_/, '').replace(/_/g, ' '),
      count
    }))
    .sort((first, second) => second.count - first.count || first.label.localeCompare(second.label, 'cs'))
    .slice(0, 4);

  return (
    <section className="admin-section" id="admin">
      <div className="workspace-layout admin-workspace">
        <WorkspaceSidebar title="Admin menu" items={adminNavItems} active={activeTab} onSelect={selectAdminTab} />
        <div className="workspace-main">
          <WorkspaceTopbar
            title={currentAdminNav.label}
            text={currentAdminNav.text}
            account={account}
            badge="Administrace"
            onLogout={onLogout}
            notificationCount={notifications.filter((notification) => !notification.readAt).length}
            onNotificationsClick={() => selectAdminTab('notifications')}
            quickAction={<button className="button primary" type="button" onClick={() => selectAdminTab('clients')}><Plus size={18} /> Nový klient</button>}
          />
          {adminMessage && (
            <Feedback
              className="admin-message"
              variant={adminMessageTone}
              title={adminMessageTone === 'success' ? 'Hotovo' : adminMessageTone === 'warning' ? 'Pozor' : adminMessageTone === 'error' ? 'Akce se nepodařila' : 'Informace'}
              description={adminMessage}
              showCloseButton={true}
              onClose={() => setAdminMessage('')}
            />
          )}
          <SectionDivider>{currentAdminNav.label}</SectionDivider>

        {activeTab === 'dashboard' && (
          <div className="admin-grid dashboard-grid">
            <article className="admin-card metric-card">
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: '18px', alignItems: 'start' }}>
                <div>
                  <span>Klienti celkem</span>
                  <strong>{clients.length}</strong>
                  <p>aktivních záznamů v registru podle programu</p>
                </div>
                <div
                  aria-label={
                    clientProgramStats.length > 0
                      ? `Rozložení klientů podle programu: ${clientProgramStats.map((item) => `${item.program} ${item.count}`).join(', ')}`
                      : 'Zatím nejsou evidovaní klienti podle programu.'
                  }
                  role="img"
                  style={{
                    width: '118px',
                    height: '118px',
                    borderRadius: '50%',
                    background: clientProgramChartBackground,
                    display: 'grid',
                    placeItems: 'center',
                    boxShadow: 'inset 0 0 0 1px rgba(34, 111, 63, 0.18)'
                  }}
                >
                  <span
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '50%',
                      display: 'grid',
                      placeItems: 'center',
                      background: '#fff',
                      color: '#17241d',
                      fontWeight: 800,
                      fontSize: '1.1rem'
                    }}
                  >
                    {clients.length}
                  </span>
                </div>
              </div>
              <div style={{ display: 'grid', gap: '10px', marginTop: '18px' }}>
                {clientProgramStats.length > 0 ? (
                  clientProgramStats.map((item) => (
                    <div
                      key={item.program}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'auto 1fr auto',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.9rem',
                        color: '#41564c'
                      }}
                    >
                      <span aria-hidden="true" style={{ width: '10px', height: '10px', borderRadius: '999px', background: item.color }} />
                      <span>{item.program}</span>
                      <strong style={{ color: '#17241d' }}>
                        {item.count} / {item.share} %
                      </strong>
                    </div>
                  ))
                ) : (
                  <span style={{ color: '#607067', fontSize: '0.9rem' }}>Zatím žádný klient k rozdělení.</span>
                )}
              </div>
            </article>
            <article className="admin-card metric-card evidence-card">
              <span>JAILBREAK zázemí</span>
              <strong>{jailbreakClients.length}</strong>
              <p>interní anonymizační metrika pro vazbu na BOD ZLOMU</p>
              <div className="evidence-bars" aria-label="Institucionální péče v dětství u klientů JAILBREAK">
                {institutionalCareStats.map((item) => (
                  <div className="evidence-bar-row" key={item.value}>
                    <span>{item.label}</span>
                    <div aria-hidden="true">
                      <i style={{ width: `${Math.max(item.share, item.count > 0 ? 4 : 0)}%` }} />
                    </div>
                    <strong>{item.count} / {item.share} %</strong>
                  </div>
                ))}
              </div>
              <div className="evidence-background-list" aria-label="Typ dětství nebo rodinného zázemí">
                {childhoodBackgroundStats.map((item) => (
                  <span key={item.value}>
                    {item.label}
                    <strong>{item.count}</strong>
                  </span>
                ))}
              </div>
              <small className="metric-disclaimer">Veřejně pouze agregovaně a až po dosažení bezpečného vzorku.</small>
            </article>
            <article className="admin-card metric-card compact-news-card">
              <div>
                <span>Aktuality</span>
                <strong>{news.length}</strong>
                <p>zpráv ve veřejném archivu</p>
              </div>
              <div className="compact-metric-strip" aria-label="Rychlý stav aktualit">
                <span>
                  Komentáře
                  <strong>{discussion.comments.length}</strong>
                </span>
                <span>
                  Reakce
                  <strong>{newsReactionCount}</strong>
                </span>
              </div>
              <button className="button ghost compact-card-action" type="button" onClick={() => selectAdminTab('news')}>
                Upravit aktuality
              </button>
            </article>
            <article className="admin-card metric-card">
              <span>Slideshow</span>
              <strong>{activeSlides.length}</strong>
              <p>aktivních bannerů na homepage</p>
              <div style={{ display: 'grid', gap: '8px', marginTop: '16px' }}>
                {activeSlides.length === 0 && <span style={{ color: '#607067', fontSize: '0.9rem' }}>Žádný aktivní banner.</span>}
                {activeSlides.slice(0, 4).map((slide) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => {
                      setSlideForm(slide);
                      selectAdminTab('content');
                    }}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'auto 1fr auto',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '9px 11px',
                      borderRadius: '14px',
                      border: '1px solid rgba(34, 111, 63, 0.16)',
                      background: 'rgba(34, 111, 63, 0.05)',
                      color: '#17462c',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{ fontWeight: 800 }}>#{slide.sortOrder}</span>
                    <span>{slide.title}</span>
                    <Badge tone="success">aktivní</Badge>
                  </button>
                ))}
                {activeSlides.length > 4 && (
                  <button className="button secondary" type="button" onClick={() => selectAdminTab('content')} style={{ justifyContent: 'center' }}>
                    Zobrazit všech {activeSlides.length} bannerů
                  </button>
                )}
              </div>
              <div style={{ borderTop: '1px solid rgba(34, 111, 63, 0.14)', marginTop: '18px', paddingTop: '16px', display: 'grid', gap: '10px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px', alignItems: 'end' }}>
                  <div>
                    <span>Dokumenty k vyřízení</span>
                    <p>{pendingDocuments.length} čeká na podpis nebo dokončení</p>
                  </div>
                  <strong style={{ color: '#0f4b3d', fontSize: '2.25rem', lineHeight: 1 }}>{pendingDocuments.length}</strong>
                </div>
                {(documentQueueStats.length > 0 ? documentQueueStats : [{ label: 'Bez čekajících dokumentů', count: 0 }]).slice(0, 2).map((item) => (
                  <div key={item.label} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '10px', color: '#41564c', fontSize: '0.92rem' }}>
                    <span>{item.label}</span>
                    <strong style={{ color: '#17241d' }}>{item.count}</strong>
                  </div>
                ))}
                <button className="button secondary" type="button" onClick={() => selectAdminTab('clients')} style={{ justifyContent: 'center' }}>
                  Vyřídit v kartách klientů
                </button>
              </div>
            </article>
            <article className="admin-card metric-card">
              <span>Formuláře</span>
              <strong>{formTemplates.length}</strong>
              <p>šablon připravených k tisku podle složek</p>
              <div style={{ display: 'grid', gap: '8px', marginTop: '16px' }}>
                {formFolderStats.map((folder) => (
                  <button
                    key={folder.folder}
                    type="button"
                    onClick={() => selectAdminTab('forms')}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr auto',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '9px 11px',
                      borderRadius: '14px',
                      border: '1px solid rgba(34, 111, 63, 0.18)',
                      background: 'rgba(34, 111, 63, 0.06)',
                      color: '#17462c',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <span>{folder.label}</span>
                    <strong>{folder.count}</strong>
                  </button>
                ))}
              </div>
            </article>
            <div style={{ alignSelf: 'start', display: 'grid', gridTemplateColumns: 'repeat(2, minmax(128px, 1fr))', gap: '12px' }}>
              <article className="admin-card metric-card" style={{ minHeight: 'auto', padding: '18px' }}>
                <span>Uživatelé online</span>
                <strong>{onlineUsers.length}</strong>
                <p>z {activeUsers.length} aktivních účtů</p>
              </article>
              <article className="admin-card metric-card" style={{ minHeight: 'auto', padding: '18px' }}>
                <span>Nepřečtené</span>
                <strong>{unreadNotifications.length}</strong>
                <p>notifikací čeká na reakci</p>
              </article>
              <article className="admin-card metric-card" style={{ minHeight: 'auto', padding: '18px' }}>
                <span>Média</span>
                <strong>{mediaFiles.length}</strong>
                <p>souborů v knihovně</p>
              </article>
              <article className="admin-card metric-card" style={{ minHeight: 'auto', padding: '18px' }}>
                <span>Nové materiální dary</span>
                <strong>{newMaterialOfferCount}</strong>
                <p>z {materialOffers.length} evidovaných nabídek</p>
              </article>
              <article className="admin-card metric-card" style={{ minHeight: 'auto', padding: '18px' }}>
                <span>Bez interního ID</span>
                <strong>{clientsWithoutOperationalId}</strong>
                <p>klientů čeká na kód</p>
              </article>
            </div>
            <article className="admin-card">
              <h3>Poslední aktivita</h3>
              <div className="activity-list timeline-list">
                {adminActivityItems.slice(0, 7).map(renderActivityItem)}
                {adminActivityItems.length === 0 && <p className="empty-note">Zatím nejsou uložené žádné změny.</p>}
              </div>
            </article>
            <article className="admin-card">
              <h3>Rychlé akce</h3>
              <div className="quick-action-grid">
                <button type="button" onClick={() => selectAdminTab('clients')}>Registrovat klienta</button>
                <button type="button" onClick={() => selectAdminTab('news')}>Vytvořit aktualitu</button>
                <button type="button" onClick={() => selectAdminTab('forms')}>Tiskový formulář</button>
                <button type="button" onClick={() => selectAdminTab('tools')}>Tools</button>
                <button type="button" onClick={() => selectAdminTab('content')}>Správa obsahu</button>
                <button type="button" onClick={() => selectAdminTab('notifications')}>Poslat notifikaci</button>
                <button type="button" onClick={() => selectAdminTab('media')}>Přidat médium</button>
                <button type="button" onClick={() => selectAdminTab('materialOffers')}>Vyřídit materiální dary</button>
              </div>
            </article>
            <article className="admin-card">
              <h3>Dokumenty k řešení</h3>
              <div className="table-lite">
                {pendingDocuments.length === 0 && <p className="empty-note">Žádný dokument aktuálně nečeká na podpis.</p>}
                {pendingDocuments.slice(0, 5).map((document) => (
                  <div key={document.id}>
                    <strong>{document.title}</strong>
                    <span>{document.status} - {new Date(document.createdAt).toLocaleDateString('cs-CZ')}</span>
                  </div>
                ))}
              </div>
            </article>
          </div>
        )}

        {activeTab === 'clients' && (
          <div className="admin-grid clients-admin-grid">
            <form className="admin-card" onSubmit={saveClient}>
              <h3>{clientForm.id ? 'Upravit klienta' : 'Registrovat klienta'}</h3>
              <div className="form-grid two">
                <label>
                  Jméno
                  <input value={clientForm.firstName} onChange={(event) => updateClientField('firstName', event.target.value)} required />
                </label>
                <label>
                  Příjmení
                  <input value={clientForm.lastName} onChange={(event) => updateClientField('lastName', event.target.value)} required />
                </label>
                <label>
                  Datum narození
                  <input type="date" value={clientForm.birthDate} onChange={(event) => updateClientField('birthDate', event.target.value)} />
                </label>
                <label>
                  Telefon
                  <input value={clientForm.phone} onChange={(event) => updateClientField('phone', event.target.value)} />
                </label>
                <label>
                  E-mail
                  <input type="email" value={clientForm.email} onChange={(event) => updateClientField('email', event.target.value)} />
                </label>
                <label>
                  Program
                  <select value={clientForm.program} onChange={(event) => updateClientField('program', event.target.value)}>
                    {programs.map((program) => (
                      <option key={program.title}>{program.title}</option>
                    ))}
                  </select>
                </label>
              </div>
              <label>
                Adresa / aktuální místo pobytu
                <input value={clientForm.address} onChange={(event) => updateClientField('address', event.target.value)} />
              </label>
              <label>
                Cílová skupina
                <input
                  value={clientForm.targetGroup}
                  onChange={(event) => updateClientField('targetGroup', event.target.value)}
                  placeholder="např. po výkonu trestu, bez domova, sociální krize"
                />
              </label>
              <div className="form-grid two">
                <label>
                  Institucionální péče v dětství
                  <select
                    value={clientForm.institutionalCareHistory}
                    onChange={(event) => updateClientField('institutionalCareHistory', event.target.value)}
                  >
                    {institutionalCareOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <small className="form-help">Interní metrika pro JAILBREAK/BOD ZLOMU, veřejně pouze anonymizovaně.</small>
                </label>
                <label>
                  Typ dětství / rodinného zázemí
                  <select
                    value={clientForm.childhoodBackground}
                    onChange={(event) => updateClientField('childhoodBackground', event.target.value)}
                  >
                    {childhoodBackgroundOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <small className="form-help">Pomáhá doložit vazbu mezi JAILBREAK a prevencí BOD ZLOMU.</small>
                </label>
              </div>
              <label>
                Stav
                <select value={clientForm.status} onChange={(event) => updateClientField('status', event.target.value)}>
                  <option>Nový kontakt</option>
                  <option>V mapování</option>
                  <option>Zařazen do programu</option>
                  <option>Stabilizace</option>
                  <option>Uzavřeno</option>
                </select>
              </label>
              <label>
                Interní ID klienta (pouze admin)
                <input
                  value={clientForm.operationalId}
                  onChange={(event) => updateClientField('operationalId', event.target.value)}
                  placeholder="Vygeneruje se v Tools"
                />
                <small className="form-help">Nezobrazuje se v klientské zóně. Slouží pro interní kartu, štítky, čárový kód a QR.</small>
              </label>
              <label>
                Poznámky
                <textarea rows={5} value={clientForm.notes} onChange={(event) => updateClientField('notes', event.target.value)} />
              </label>
              <div className="form-actions">
                <button className="button primary" type="submit">
                  <Save size={18} /> Uložit klienta
                </button>
                <button className="button secondary" type="button" onClick={clearClientForm}>
                  Vyčistit
                </button>
              </div>
            </form>

            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h3>Registr klientů</h3>
                  <p>{filteredClients.length} z {clients.length} záznamů podle aktuálního filtru.</p>
                </div>
                <Badge tone={clients.some((client) => !client.operationalId?.trim()) ? 'warning' : 'success'}>
                  {clients.filter((client) => !client.operationalId?.trim()).length} bez ID
                </Badge>
              </div>
              <div className="client-filter-grid">
                <label>
                  Vyhledat
                  <input value={clientQuery} onChange={(event) => setClientQuery(event.target.value)} placeholder="Jméno, e-mail, program, ID..." />
                </label>
                <label>
                  Stav
                  <select value={clientStatusFilter} onChange={(event) => setClientStatusFilter(event.target.value)}>
                    <option value="all">Všechny stavy</option>
                    {clientStatusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Interní ID
                  <select value={clientIdFilter} onChange={(event) => setClientIdFilter(event.target.value)}>
                    <option value="all">Všichni klienti</option>
                    <option value="without-id">Jen bez ID</option>
                    <option value="with-id">Jen s ID</option>
                  </select>
                </label>
              </div>
              <div className="client-list">
                {clients.length === 0 && <p className="empty-note">Zatím není uložený žádný klient.</p>}
                {clients.length > 0 && filteredClients.length === 0 && <p className="empty-note">Žádný klient neodpovídá zvolenému filtru.</p>}
                {filteredClients.map((client) => (
                  <button
                    key={client.id}
                    type="button"
                    className={`${client.operationalId ? 'has-operational-id' : 'missing-operational-id'} ${client.id === clientPanelClient?.id ? 'is-selected' : ''}`}
                    onClick={() => editClient(client)}
                  >
                    <strong>
                      {client.firstName} {client.lastName}
                    </strong>
                    <div className="client-list-meta">
                      <span className={`client-status-chip ${clientStatusClass(client.status)}`}>{client.status}</span>
                      <span className={client.operationalId ? 'client-id-chip is-ready' : 'client-id-chip is-missing'}>
                        {client.operationalId ? `ID ${client.operationalId}` : 'Bez ID'}
                      </span>
                    </div>
                    <small>{client.program}</small>
                  </button>
                ))}
              </div>
            </div>

            <aside className="admin-card client-detail-card">
              <div className="admin-card-header">
                <div>
                  <h3>Karta klienta</h3>
                  <p>Admin-only přehled pro rychlou práci s formuláři, ID a dokumenty.</p>
                </div>
                <UserRound size={22} aria-hidden="true" />
              </div>
              {!clientPanelClient ? (
                <p className="empty-note">Vyberte klienta v registru.</p>
              ) : (
                <>
                  <div className="client-detail-identity">
                    <div>
                      <span>Vybraný klient</span>
                      <strong>{clientPanelClient.firstName} {clientPanelClient.lastName}</strong>
                      <small>{clientPanelClient.email || clientPanelClient.phone || 'Kontakt není doplněný'}</small>
                    </div>
                    <span className={`client-status-chip ${clientStatusClass(clientPanelClient.status)}`}>{clientPanelClient.status}</span>
                  </div>
                  <div className="client-detail-grid">
                    <div>
                      <span>Interní ID</span>
                      <strong>{clientPanelClient.operationalId?.trim() || 'Nevygenerováno'}</strong>
                    </div>
                    <div>
                      <span>Program</span>
                      <strong>{clientPanelClient.program}</strong>
                    </div>
                    <div>
                      <span>Institucionální péče</span>
                      <strong>{institutionalCareLabel(clientPanelClient.institutionalCareHistory)}</strong>
                    </div>
                    <div>
                      <span>Zázemí v dětství</span>
                      <strong>{childhoodBackgroundLabel(clientPanelClient.childhoodBackground)}</strong>
                    </div>
                    <div>
                      <span>Dokumenty</span>
                      <strong>{clientPanelDocuments.length}</strong>
                    </div>
                    <div>
                      <span>Notifikace</span>
                      <strong>{clientPanelNotifications.length}</strong>
                    </div>
                  </div>
                  <div className="client-next-step">
                    <Badge tone={clientPanelPendingDocuments.length > 0 || !clientPanelClient.operationalId?.trim() ? 'warning' : 'info'}>Další krok</Badge>
                    <p>{clientPanelNextStep}</p>
                  </div>
                  <div className="client-detail-actions">
                    <button className="button secondary" type="button" onClick={() => editClient(clientPanelClient)}>
                      <UserCog size={18} /> Upravit kartu
                    </button>
                    <button
                      className="button secondary"
                      type="button"
                      onClick={() => {
                        selectClientForForm(clientPanelClient.id);
                        selectAdminTab('forms');
                      }}
                    >
                      <FileText size={18} /> Formuláře
                    </button>
                    <button
                      className="button secondary"
                      type="button"
                      onClick={() => {
                        loadClientIntoTools(clientPanelClient.id);
                        selectAdminTab('tools');
                      }}
                    >
                      <Barcode size={18} /> ID / kódy
                    </button>
                    <button className="button danger" type="button" onClick={() => deleteClient(clientPanelClient)}>
                      <Trash2 size={18} /> Smazat klienta
                    </button>
                  </div>
                  <div className="client-detail-documents">
                    <strong>Poslední dokumenty</strong>
                    {clientPanelDocuments.length === 0 && <p className="empty-note">Zatím bez evidovaných dokumentů.</p>}
                    {clientPanelDocuments.slice(0, 4).map((document) => (
                      <span key={document.id}>
                        <FileText size={15} aria-hidden="true" />
                        <span>{document.title}</span>
                        <Badge tone={document.signedAt ? 'success' : 'warning'}>{document.status}</Badge>
                      </span>
                    ))}
                  </div>
                </>
              )}
            </aside>
          </div>
        )}

        {activeTab === 'forms' && (
          <div className="forms-layout">
            <div className="forms-control-stack no-print">
              <div className="admin-card">
                <h3>Knihovna šablon</h3>
                <div className="form-grid two">
                  <label>
                    Vyhledat
                    <input value={templateQuery} onChange={(event) => setTemplateQuery(event.target.value)} placeholder="GDPR, intake, krizový..." />
                  </label>
                  <label>
                    Kategorie
                    <select value={templateCategory} onChange={(event) => setTemplateCategory(event.target.value)}>
                      <option value="all">Všechny kategorie</option>
                      {templateCategories.map((category) => (
                        <option key={category} value={category}>
                          {formCategoryTitle(category)}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="template-library" aria-label="Knihovna tiskových šablon">
                  {filteredTemplates.length === 0 && <p className="empty-note">Žádná šablona neodpovídá filtru.</p>}
                  {filteredTemplates.map((template) => (
                    <button
                      key={template.id}
                      type="button"
                      className={template.id === selectedTemplate.id ? 'active' : ''}
                      onClick={() => selectTemplateForForm(template.id)}
                    >
                      <strong>{template.title}</strong>
                      <span>{[template.formUid, formCategoryTitle(template.folder)].filter(Boolean).join(' · ')}</span>
                      <small>{[formSensitivity(template), template.isCurrent === false ? 'Archiv' : 'Aktivní'].join(' · ')}</small>
                    </button>
                  ))}
                </div>
              </div>

              <div className="admin-card">
              <h3>Připravit formulář</h3>
              <label>
                Klient
                <select value={selectedClient?.id ?? ''} onChange={(event) => selectClientForForm(event.target.value)}>
                  {clients.length === 0 && <option value="">Nejdřív zaregistrujte klienta</option>}
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.firstName} {client.lastName} - {client.program}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Šablona
                <select value={selectedTemplateId} onChange={(event) => selectTemplateForForm(event.target.value)}>
                  {formTemplates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.title}
                    </option>
                  ))}
                </select>
              </label>
              <div className="selected-template-summary">
                <div>
                  <span>Vybraná šablona</span>
                  <strong>{selectedTemplate.title}</strong>
                  {selectedTemplate.description && <p>{selectedTemplate.description}</p>}
                </div>
                <div className="summary-actions">
                  <Badge tone={formSensitivity(selectedTemplate) === 'GDPR' || formSensitivity(selectedTemplate) === 'Citlivé' ? 'warning' : 'info'}>
                    {formSensitivity(selectedTemplate)}
                  </Badge>
                  <button className="icon-tool tooltip-link" type="button" data-tooltip="Detail šablony" aria-label="Detail šablony" onClick={() => openTemplateDialog(selectedTemplate)}>
                    <FileText size={17} />
                  </button>
                </div>
              </div>
              {(selectedTemplate.folder || selectedTemplate.fileUrl || selectedTemplate.sourceNote) && (
                <div className="template-meta">
                  {selectedTemplate.formUid && <span>ID: {selectedTemplate.formUid}</span>}
                  {selectedTemplate.formGroup && <span>Skupina: {selectedTemplate.formGroup}</span>}
                  {selectedTemplate.folder && <span>{formCategoryTitle(selectedTemplate.folder)}</span>}
                  <span>{selectedTemplate.isCurrent === false ? 'Archiv' : 'Aktivní'}</span>
                  <span>{readableBytes(selectedTemplate.sizeBytes)}</span>
                  {selectedTemplate.sourceNote && <span>{selectedTemplate.sourceNote}</span>}
                  {selectedTemplateFileUrl && (
                    <>
                      {selectedClient ? (
                        <button className="text-link-button" type="button" onClick={downloadFilledPdf}>
                          Stáhnout vyplněné PDF
                        </button>
                      ) : (
                        <span>Vyberte klienta pro vyplnění PDF</span>
                      )}
                      <a href={selectedTemplateFileUrl} target="_blank" rel="noreferrer">
                        Otevřít originál
                      </a>
                    </>
                  )}
                </div>
              )}
              {selectedTemplate.fields.map((field) => (
                <label key={field.key}>
                  {field.label}
                  <textarea
                    rows={field.rows ?? 3}
                    value={draft[field.key] ?? ''}
                    onChange={(event) => setDraft((current) => ({ ...current, [field.key]: event.target.value }))}
                  />
                </label>
              ))}
              <div className="form-actions">
                <button className="button primary" type="button" onClick={printForm} disabled={!selectedClient}>
                  <Printer size={18} /> Tisknout k podpisu
                </button>
                <button className="button secondary" type="button" onClick={downloadFilledPdf} disabled={!selectedClient || !selectedTemplateFileUrl}>
                  <Download size={18} /> Stáhnout vyplněné PDF
                </button>
                <button className="button secondary" type="button" onClick={registerPreparedDocument} disabled={!selectedClient}>
                  <ClipboardList size={18} /> Zapsat do dokumentů
                </button>
              </div>
              {selectedClient && (
                <div className="linked-documents">
                  <span>Dokumenty klienta</span>
                  {selectedClientDocuments.length === 0 ? (
                    <p className="empty-note">Zatím není zapsaný žádný formulář.</p>
                  ) : (
                    selectedClientDocuments.slice(0, 4).map((document) => (
                      <a key={document.id} href={resolvePublicFileUrl(document.fileUrl) || '/admin'} target={document.fileUrl ? '_blank' : undefined} rel="noreferrer">
                        {document.title}
                      </a>
                    ))
                  )}
                </div>
              )}
              </div>
            </div>

            <React.Suspense fallback={<article className="print-sheet print-sheet-branded"><p className="empty-note">Načítám náhled tiskového formuláře...</p></article>}>
              <PrintableForm client={selectedClient} template={selectedTemplate} draft={draft} />
            </React.Suspense>
          </div>
        )}

        {activeTab === 'tools' && (
          <div className="admin-grid tools-grid">
            <article className="admin-card tools-card">
              <div className="admin-card-header">
                <div>
                  <h3>Generátor klientského ID</h3>
                  <p className="form-help">Formát: iniciály, datum registrace, čtyři náhodné číslice a pořadí.</p>
                </div>
                <button className="icon-tool tooltip-link primary" type="button" data-tooltip="Generovat ID" aria-label="Generovat ID" onClick={generateOperationalId}>
                  <RotateCcw size={18} />
                </button>
              </div>
              <label>
                Načíst klienta z registru
                <select value={selectedToolsClient?.id ?? ''} onChange={(event) => loadClientIntoTools(event.target.value)}>
                  <option value="">Vyberte klienta...</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.firstName} {client.lastName} - {client.program}
                    </option>
                  ))}
                </select>
              </label>
              <div className="form-grid two">
                <label>
                  Jméno
                  <input
                    value={toolsEffectiveDraft.firstName}
                    onChange={(event) => setToolsDraft((current) => ({ ...current, firstName: event.target.value }))}
                    placeholder="David"
                    disabled={Boolean(selectedToolsClient)}
                  />
                </label>
                <label>
                  Příjmení
                  <input
                    value={toolsEffectiveDraft.lastName}
                    onChange={(event) => setToolsDraft((current) => ({ ...current, lastName: event.target.value }))}
                    placeholder="Kozák"
                    disabled={Boolean(selectedToolsClient)}
                  />
                </label>
                <label>
                  Datum registrace
                  <input
                    type="date"
                    value={toolsEffectiveDraft.registrationDate}
                    onChange={(event) => setToolsDraft((current) => ({ ...current, registrationDate: event.target.value }))}
                    disabled={Boolean(selectedToolsClient)}
                  />
                </label>
                <label>
                  Pořadí automaticky
                  <input
                    type="number"
                    min="1"
                    value={toolsEffectiveDraft.sequence}
                    onChange={(event) => setToolsDraft((current) => ({ ...current, sequence: Number(event.target.value) || 1 }))}
                    disabled={Boolean(selectedToolsClient)}
                  />
                  <small className="form-help">
                    {selectedToolsClient ? 'Pořadí se bere automaticky podle aktuální pozice klienta v registru.' : 'Bez vybraného klienta lze pořadí zadat ručně.'}
                  </small>
                </label>
              </div>
              <div className="generated-id-panel">
                <span>Výsledné ID</span>
                <strong>{toolsDraft.generatedId || 'DK-060626-0000-001'}</strong>
                <small>
                  {toolsClientHasOperationalId
                    ? 'Tento klient už má interní ID uložené v databázi. Generátor ho pouze načítá.'
                    : 'Iniciály se doplní minimálně na dvě písmena. Datum se ukládá jako DDMMYY.'}
                </small>
              </div>
              <div className="form-actions">
                <button className="button primary" type="button" onClick={generateOperationalId}>
                  <Wrench size={18} /> {toolsClientHasOperationalId ? 'Přegenerovat ID podle klienta' : 'Vygenerovat ID'}
                </button>
                <button className="icon-tool tooltip-link" type="button" data-tooltip="Kopírovat ID" aria-label="Kopírovat ID" onClick={() => copyToolsValue(toolsDraft.generatedId, 'ID')}>
                  <Copy size={18} />
                </button>
              </div>
            </article>

            <article className="admin-card tools-card">
              <div className="admin-card-header">
                <div>
                  <h3><Barcode size={18} /> Čárový kód a QR</h3>
                  <p className="form-help">Hodnoty lze použít pro štítky, dokumenty, karty nebo rychlé dohledání klienta.</p>
                </div>
                <Badge tone="success"><QrCode size={14} /> CODE128 + QR</Badge>
              </div>
              <label>
                Hodnota pro čárový kód
                <input value={toolsDraft.barcodeValue} onChange={(event) => setToolsDraft((current) => ({ ...current, barcodeValue: event.target.value }))} placeholder="DK-060626-4821-001" />
              </label>
              <div className="code-preview barcode-panel">
                {toolsDraft.barcodeValue ? <svg ref={barcodeRef} className="barcode-preview" aria-label={`Čárový kód ${toolsDraft.barcodeValue}`} /> : <p className="empty-note">Po zadání hodnoty se vykreslí čárový kód.</p>}
              </div>
              <div className="tool-action-row">
                <button className="icon-tool tooltip-link" type="button" data-tooltip="Kopírovat hodnotu" aria-label="Kopírovat hodnotu čárového kódu" onClick={() => copyToolsValue(toolsDraft.barcodeValue, 'hodnotu čárového kódu')}>
                  <Copy size={18} />
                </button>
                <button className="icon-tool tooltip-link primary" type="button" data-tooltip="Stáhnout SVG" aria-label="Stáhnout čárový kód jako SVG" onClick={downloadBarcode}>
                  <Download size={18} />
                </button>
                <button className="icon-tool tooltip-link" type="button" data-tooltip="Uložit do archivu" aria-label="Uložit čárový kód do archivu" onClick={() => saveCurrentCodeToArchive('barcode')}>
                  <Save size={18} />
                </button>
              </div>
              <label>
                Hodnota pro QR
                <textarea rows={4} value={toolsDraft.qrValue} onChange={(event) => setToolsDraft((current) => ({ ...current, qrValue: event.target.value }))} placeholder="ID, odkaz na profil nebo text pro kartu" />
              </label>
              <div className="code-preview qr-panel">
                {toolsDraft.qrValue ? <canvas ref={qrCanvasRef} className="qr-preview" aria-label={`QR kód ${toolsDraft.qrValue}`} /> : <p className="empty-note">Po zadání hodnoty se vykreslí QR kód.</p>}
              </div>
              <div className="tool-action-row">
                <button className="icon-tool tooltip-link" type="button" data-tooltip="Kopírovat QR hodnotu" aria-label="Kopírovat QR hodnotu" onClick={() => copyToolsValue(toolsDraft.qrValue, 'QR hodnotu')}>
                  <Copy size={18} />
                </button>
                <button className="icon-tool tooltip-link primary" type="button" data-tooltip="Stáhnout PNG" aria-label="Stáhnout QR kód jako PNG" onClick={downloadQrCode}>
                  <Download size={18} />
                </button>
                <button className="icon-tool tooltip-link" type="button" data-tooltip="Uložit do archivu" aria-label="Uložit QR kód do archivu" onClick={() => saveCurrentCodeToArchive('qr')}>
                  <Save size={18} />
                </button>
              </div>
              <button className="button secondary" type="button" onClick={() => selectAdminTab('codeArchive')}>
                <FolderOpen size={18} /> Otevřít archiv kódů
              </button>
            </article>

            <article className="admin-card tools-help-card">
              <h3>Pravidlo ID</h3>
              <div className="table-lite">
                <div><strong>DK</strong><span>minimálně dvě iniciály ze jména a příjmení</span></div>
                <div><strong>060626</strong><span>datum registrace ve formátu den, měsíc, rok</span></div>
                <div><strong>4821</strong><span>čtyři náhodné číslice pro rozlišení</span></div>
                <div><strong>001</strong><span>pořadí klienta nebo ručně zadané číslo</span></div>
              </div>
            </article>
          </div>
        )}

        {activeTab === 'codeArchive' && (
          <div className="admin-grid code-archive-grid">
            <article className="admin-card code-archive-hero">
              <div className="admin-card-header">
                <div>
                  <span className="eyebrow">ARCHIV KÓDŮ</span>
                  <h3>Čárové kódy a QR pro formuláře</h3>
                  <p className="form-help">
                    Archiv drží hodnotu kódu, klienta a vazbu na formulář. Finální sada formulářů s čárovými kódy se sem později může importovat přes CSV.
                  </p>
                </div>
                <button className="icon-tool tooltip-link primary" type="button" data-tooltip="Export CSV" aria-label="Exportovat archiv do CSV" onClick={exportCodeArchiveCsv}>
                  <Download size={18} />
                </button>
              </div>
              <div className="code-archive-stats">
                <div className="metric-card">
                  <span>Čárové kódy</span>
                  <strong>{barcodeArchiveCount}</strong>
                  <p>CODE128 a štítky</p>
                </div>
                <div className="metric-card">
                  <span>QR kódy</span>
                  <strong>{qrArchiveCount}</strong>
                  <p>Profil, formulář, odkaz</p>
                </div>
                <div className="metric-card">
                  <span>Celkem</span>
                  <strong>{codeArchive.length}</strong>
                  <p>záznamů v archivu</p>
                </div>
              </div>
            </article>

            <article className="admin-card code-import-card">
              <div className="admin-card-header">
                <div>
                  <h3><Barcode size={18} /> Import čárových kódů</h3>
                  <p className="form-help">CSV může obsahovat sloupce value/hodnota, client/klient, form/formulář, note/poznámka.</p>
                </div>
                <label className="button secondary code-import-button">
                  <Upload size={18} /> Nahrát CSV
                  <input type="file" accept=".csv,text/csv" onChange={(event) => importCodeArchiveCsv(event, 'barcode')} />
                </label>
              </div>
            </article>

            <article className="admin-card code-import-card">
              <div className="admin-card-header">
                <div>
                  <h3><QrCode size={18} /> Import QR kódů</h3>
                  <p className="form-help">QR archiv používá stejnou CSV strukturu. Hodnota může být ID, URL profilu, nebo text pro formulář.</p>
                </div>
                <label className="button secondary code-import-button">
                  <Upload size={18} /> Nahrát CSV
                  <input type="file" accept=".csv,text/csv" onChange={(event) => importCodeArchiveCsv(event, 'qr')} />
                </label>
              </div>
            </article>

            <article className="admin-card code-archive-table-card">
              <div className="admin-card-header">
                <div>
                  <h3>Přehled archivu</h3>
                  <p className="form-help">{filteredCodeArchive.length} z {codeArchive.length} záznamů podle aktuálního filtru.</p>
                </div>
                <Badge tone={codeArchive.length ? 'success' : 'warning'}>{codeArchive.length ? 'Archiv aktivní' : 'Bez záznamů'}</Badge>
              </div>
              <div className="form-grid two code-archive-filters">
                <label>
                  Vyhledat
                  <input value={codeArchiveQuery} onChange={(event) => setCodeArchiveQuery(event.target.value)} placeholder="ID, klient, formulář..." />
                </label>
                <label>
                  Typ kódu
                  <select value={codeArchiveKindFilter} onChange={(event) => setCodeArchiveKindFilter(event.target.value as 'all' | CodeArchiveKind)}>
                    <option value="all">Všechny typy</option>
                    <option value="barcode">Čárové kódy</option>
                    <option value="qr">QR kódy</option>
                  </select>
                </label>
              </div>
              <div className="code-archive-table">
                {codeArchive.length === 0 && <p className="empty-note">Archiv je zatím prázdný. Uložte kód z Tools nebo nahrajte CSV.</p>}
                {codeArchive.length > 0 && filteredCodeArchive.length === 0 && <p className="empty-note">Žádný kód neodpovídá zvolenému filtru.</p>}
                {filteredCodeArchive.map((entry) => {
                  const CodeIcon = entry.kind === 'barcode' ? Barcode : QrCode;
                  return (
                    <div className="code-archive-row" key={entry.id}>
                      <span className={`code-kind-chip is-${entry.kind}`}>
                        <CodeIcon size={15} /> {entry.kind === 'barcode' ? 'CODE128' : 'QR'}
                      </span>
                      <div className="code-archive-value">
                        <strong>{entry.value}</strong>
                        <small>{entry.note || (entry.source === 'csv' ? 'Import CSV' : 'Ručně uložený záznam')}</small>
                      </div>
                      <div>
                        <span>Klient</span>
                        <strong>{entry.clientName || entry.clientId || 'bez vazby'}</strong>
                      </div>
                      <div>
                        <span>Formulář</span>
                        <strong>{entry.formTitle || entry.formId || 'nepřiřazeno'}</strong>
                      </div>
                      <Badge tone={entry.source === 'csv' ? 'info' : 'success'}>{entry.source === 'csv' ? 'CSV' : 'Ručně'}</Badge>
                      <button className="icon-tool tooltip-link danger" type="button" data-tooltip="Smazat z archivu" aria-label={`Smazat kód ${entry.value}`} onClick={() => deleteCodeArchiveEntry(entry)}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </article>
          </div>
        )}

        {activeTab === 'news' && (
          <div className="admin-grid news-admin-layout">
            <div className="admin-card news-admin-card">
              <div className="admin-card-header">
                <div>
                  <h3>Aktuality</h3>
                  <p className="form-help">Editor publikovaných zpráv, médií a vložených videí.</p>
                </div>
                <button className="icon-tool tooltip-link primary" type="button" data-tooltip="Nová aktualita" aria-label="Nová aktualita" onClick={() => openNewsDialog()}>
                  <Plus size={18} />
                </button>
              </div>
              <div className="news-admin-list">
                {news.length === 0 && <p className="empty-note">Zatím není uložená žádná aktualita.</p>}
                {news.map((item) => (
                  <article key={item.id} className={`news-admin-row ${focusedNewsId === item.id ? 'is-targeted' : ''}`} data-news-id={item.id}>
                    <button className="news-admin-main" type="button" onClick={() => editNews(item)}>
                      <time dateTime={item.date}>{new Date(item.date).toLocaleDateString('cs-CZ')}</time>
                      {item.tag && <em className="news-tag">{item.tag}</em>}
                      <strong>{item.title}</strong>
                      <span>{item.excerpt}</span>
                    </button>
                    <div className="news-row-actions" aria-label={`Akce pro aktualitu ${item.title}`}>
                      <AdminContextMenu
                        label={`Akce aktuality ${item.title}`}
                        items={[
                          {
                            label: 'Upravit',
                            text: 'Otevřít editor aktuality',
                            icon: <FileText size={16} />,
                            onSelect: () => editNews(item)
                          },
                          {
                            label: 'Smazat',
                            text: 'Odstranit aktualitu z webu',
                            icon: <Trash2 size={16} />,
                            tone: 'danger',
                            onSelect: () => deleteNews(item)
                          }
                        ]}
                      />
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="admin-card">
              <h3>{focusedNewsId ? 'Aktualita z aktivity' : 'Náhled poslední aktuality'}</h3>
              {previewNews ? (
                <article className="news-preview-card">
                  <time dateTime={previewNews.date}>{new Date(previewNews.date).toLocaleDateString('cs-CZ')}</time>
                  <h4>{previewNews.title}</h4>
                  <p>{previewNews.excerpt}</p>
                  <div className="news-interaction-summary" aria-label="Interakce aktuality">
                    <Badge tone="success"><Heart size={13} /> {previewNewsLike?.count ?? 0}x &lt;3</Badge>
                    <Badge tone="info"><MessageCircle size={13} /> {previewNewsComments.length} komentářů</Badge>
                  </div>
                  {previewNewsComments.length > 0 && (
                    <div className="admin-comment-snippet-list">
                      {previewNewsComments.slice(0, 4).map((comment) => (
                        <span key={comment.id}>
                          <strong>{comment.authorName}</strong>
                          <small>{shortenActivityText(comment.body, 110)}</small>
                        </span>
                      ))}
                    </div>
                  )}
                  {previewNews.body && <div className="news-body" dangerouslySetInnerHTML={{ __html: cleanNewsHtml(previewNews.body, previewNews.title) }} />}
                </article>
              ) : (
                <p className="empty-note">Po vytvoření aktuality se tady ukáže rychlý náhled.</p>
              )}
            </div>

            {isNewsDialogOpen && (
              <div className="editor-backdrop" role="presentation" onMouseDown={closeNewsDialog}>
                <form className="news-editor-dialog" role="dialog" aria-modal="true" aria-label="Editor aktuality" onSubmit={saveNews} onMouseDown={(event) => event.stopPropagation()}>
                  <div className="editor-titlebar">
                    <div>
                      <h3>{newsForm.id ? 'Upravit aktualitu' : 'Nová aktualita'}</h3>
                      <p>Mini editor obsahu pro webové aktuality.</p>
                    </div>
                    <div className="editor-title-actions">
                      {newsForm.id && (
                        <AdminContextMenu
                          label={`Akce aktuality ${newsForm.title || 'bez názvu'}`}
                          items={[
                            {
                              label: 'Smazat aktualitu',
                              text: 'Odstranit z veřejného webu',
                              icon: <Trash2 size={16} />,
                              tone: 'danger',
                              onSelect: () => deleteNews(newsForm)
                            }
                          ]}
                        />
                      )}
                      <button className="icon-tool tooltip-link" type="button" data-tooltip="Zavřít" aria-label="Zavřít editor" onClick={closeNewsDialog}>
                        <X size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="editor-fields">
                    <label>
                      Nadpis
                      <input
                        value={newsForm.title}
                        onChange={(event) =>
                          setNewsForm((current) => {
                            const title = event.target.value;
                            const shouldRefreshSlug = !current.slug || current.slug === slugifyPathSegment(current.title);
                            return { ...current, title, slug: shouldRefreshSlug ? slugifyPathSegment(title) : current.slug };
                          })
                        }
                        required
                      />
                    </label>
                    <label>
                      Datum
                      <input type="date" value={newsForm.date} onChange={(event) => setNewsForm((current) => ({ ...current, date: event.target.value }))} />
                    </label>
                    <label>
                      Rubrika / tag
                      <select
                        value={newsForm.tag || ''}
                        onChange={(event) => setNewsForm((current) => ({ ...current, tag: event.target.value }))}
                        required
                      >
                        {newsForm.tag && !newsTagOptions.includes(newsForm.tag) && <option value={newsForm.tag}>{newsForm.tag}</option>}
                        {newsTagOptions.map((tag) => (
                          <option key={tag} value={tag}>{tag}</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      URL název stránky
                      <input
                        value={newsForm.slug || ''}
                        onChange={(event) => setNewsForm((current) => ({ ...current, slug: slugifyPathSegment(event.target.value) }))}
                        placeholder="nazev-aktuality"
                        required
                      />
                      <small className="news-url-preview">
                        {newsPath({ ...newsForm, slug: newsForm.slug || newsForm.title })}
                      </small>
                    </label>
                    <div className="editor-full field-stack">
                      <label>
                        URL obrázku / miniatury
                        <input
                          type="text"
                          value={newsForm.imageUrl || ''}
                          onChange={(event) => setNewsForm((current) => ({ ...current, imageUrl: event.target.value }))}
                          placeholder="https://example.com/image.jpg"
                        />
                      </label>
                      <span className="local-image-actions">
                        <label className="button secondary local-image-upload">
                          <Upload size={17} />
                          {imageUploadBusy === 'news' ? 'Nahrávám…' : 'Nahrát z počítače'}
                          <input type="file" accept="image/*" onChange={uploadNewsThumbnail} disabled={Boolean(imageUploadBusy)} />
                        </label>
                        <small>Obrázek se nahraje do mediální knihovny a URL se doplní automaticky.</small>
                      </span>
                      {newsForm.imageUrl && (
                        <small style={{ display: 'block', marginTop: '8px' }}>
                          Náhled: <img src={newsForm.imageUrl} alt="Náhled" style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '8px', borderRadius: '6px' }} />
                        </small>
                      )}
                    </div>
                    <label className="editor-full">
                      Krátký text
                      <textarea rows={3} value={newsForm.excerpt} onChange={(event) => setNewsForm((current) => ({ ...current, excerpt: event.target.value }))} required />
                    </label>
                  </div>

                  <div className="mini-word-toolbar" aria-label="Nástroje editoru">
                    <button className="text-tool tooltip-link" type="button" data-tooltip="Hlavní nadpis" aria-label="Vložit hlavní nadpis" onClick={() => insertNewsBody('<h1>', '</h1>', 'Hlavní nadpis')}>
                      H1
                    </button>
                    <button className="text-tool tooltip-link" type="button" data-tooltip="Nadpis sekce" aria-label="Vložit nadpis sekce" onClick={() => insertNewsBody('<h2>', '</h2>', 'Nadpis sekce')}>
                      H2
                    </button>
                    <button className="text-tool tooltip-link" type="button" data-tooltip="Podnadpis" aria-label="Vložit podnadpis" onClick={() => insertNewsBody('<h3>', '</h3>', 'Podnadpis')}>
                      H3
                    </button>
                    <button className="text-tool tooltip-link" type="button" data-tooltip="Odstavec" aria-label="Vložit odstavec" onClick={() => insertNewsBody('<p>', '</p>', 'Text odstavce')}>
                      P
                    </button>
                    <button className="text-tool tooltip-link" type="button" data-tooltip="Zalomení řádku" aria-label="Vložit zalomení řádku" onClick={() => insertNewsBody('', '<br />\n', '')}>
                      BR
                    </button>
                    <span className="toolbar-divider" aria-hidden="true" />
                    <button className="icon-tool tooltip-link" type="button" data-tooltip="Zarovnat vlevo" aria-label="Zarovnat vlevo" onClick={() => insertNewsBody('<p class="align-left">', '</p>', 'Text zarovnaný vlevo')}>
                      <span className="align-icon align-left-icon">L</span>
                    </button>
                    <button className="icon-tool tooltip-link" type="button" data-tooltip="Zarovnat na střed" aria-label="Zarovnat na střed" onClick={() => insertNewsBody('<p class="align-center">', '</p>', 'Text zarovnaný na střed')}>
                      <span className="align-icon align-center-icon">C</span>
                    </button>
                    <button className="icon-tool tooltip-link" type="button" data-tooltip="Zarovnat vpravo" aria-label="Zarovnat vpravo" onClick={() => insertNewsBody('<p class="align-right">', '</p>', 'Text zarovnaný vpravo')}>
                      <span className="align-icon align-right-icon">R</span>
                    </button>
                    <button className="icon-tool tooltip-link" type="button" data-tooltip="Do bloku" aria-label="Zarovnat do bloku" onClick={() => insertNewsBody('<p class="align-justify">', '</p>', 'Text zarovnaný do bloku')}>
                      <span className="align-icon align-justify-icon">J</span>
                    </button>
                    <span className="toolbar-divider" aria-hidden="true" />
                    <button className="icon-tool tooltip-link" type="button" data-tooltip="Tučně" aria-label="Tučný text" onClick={() => insertNewsBody('<strong>', '</strong>', 'tučný text')}>
                      <Bold size={17} />
                    </button>
                    <button className="icon-tool tooltip-link" type="button" data-tooltip="Kurzíva" aria-label="Kurzíva" onClick={() => insertNewsBody('<em>', '</em>', 'kurzíva')}>
                      <Italic size={17} />
                    </button>
                    <button className="icon-tool tooltip-link" type="button" data-tooltip="Podtrhnout" aria-label="Podtrhnout" onClick={() => insertNewsBody('<u>', '</u>', 'podtržený text')}>
                      <Underline size={17} />
                    </button>
                    <button className="icon-tool tooltip-link" type="button" data-tooltip="Seznam" aria-label="Vložit seznam" onClick={() => insertNewsBody('<ul><li>', '</li></ul>', 'Položka seznamu')}>
                      <List size={17} />
                    </button>
                    <button className="icon-tool tooltip-link" type="button" data-tooltip="Odkaz" aria-label="Vložit odkaz" onClick={() => insertNewsMedia('link')}>
                      <Link size={17} />
                    </button>
                    <button className="icon-tool tooltip-link" type="button" data-tooltip="Obrázek" aria-label="Vložit obrázek" onClick={() => insertNewsMedia('image')}>
                      <ImagePlus size={17} />
                    </button>
                    <label className="icon-tool tooltip-link local-toolbar-upload" data-tooltip="Nahrát obrázek z počítače" aria-label="Nahrát obrázek z počítače">
                      <Upload size={17} />
                      <input type="file" accept="image/*" onChange={uploadNewsBodyImage} disabled={Boolean(imageUploadBusy)} />
                    </label>
                    <button className="icon-tool tooltip-link" type="button" data-tooltip="Video" aria-label="Vložit video" onClick={() => insertNewsMedia('video')}>
                      <Video size={17} />
                    </button>
                    <button className="icon-tool tooltip-link" type="button" data-tooltip="Zpět" aria-label="Vrátit poslední vložení" onClick={undoNewsBodyInsert} disabled={newsUndoStack.length === 0}>
                      <Undo2 size={17} />
                    </button>
                  </div>

                  <div className="editor-body-grid">
                    <label>
                      Obsah
                      <textarea
                        ref={newsBodyRef}
                        className="news-body-source"
                        rows={12}
                        value={newsForm.body || ''}
                        onChange={(event) => setNewsForm((current) => ({ ...current, body: event.target.value }))}
                        placeholder="<p>Text aktuality...</p>"
                      />
                    </label>
                    <div className="news-editor-preview">
                      <span>Náhled</span>
                      {newsForm.tag && <em className="news-tag">{newsForm.tag}</em>}
                      <h4>{newsForm.title || 'Nadpis aktuality'}</h4>
                      <p>{newsForm.excerpt || 'Krátký text aktuality.'}</p>
                      <div className="news-body" dangerouslySetInnerHTML={{ __html: cleanNewsHtml(newsForm.body || '', newsForm.title || 'Obrázek k aktualitě') }} />
                    </div>
                  </div>

                  <div className="editor-actions">
                    <button className="icon-tool tooltip-link primary wide" type="submit" data-tooltip="Uložit" aria-label="Uložit aktualitu">
                      <Save size={18} />
                      <span>Uložit</span>
                    </button>
                    <button className="icon-tool tooltip-link wide" type="button" data-tooltip="Zavřít bez uložení" aria-label="Zavřít bez uložení" onClick={closeNewsDialog}>
                      <X size={18} />
                      <span>Zavřít</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {activeTab === 'content' && (
          <div className="content-admin-workspace">
            <div className="content-editor-tabs" role="tablist" aria-label="Části homepage">
              <button
                type="button"
                role="tab"
                aria-selected={contentEditorTab === 'hero'}
                className={contentEditorTab === 'hero' ? 'active' : ''}
                onClick={() => selectContentEditorTab('hero')}
              >
                <Star size={17} /> Úvodní hero
                <span>{slides.filter((item) => item.isActive).length}</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={contentEditorTab === 'gallery'}
                className={contentEditorTab === 'gallery' ? 'active' : ''}
                onClick={() => selectContentEditorTab('gallery')}
              >
                <ImageIcon size={17} /> Slideshow homepage
                <span>{homepageGalleryItems.filter((item) => item.isActive).length}</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={contentEditorTab === 'sections'}
                className={contentEditorTab === 'sections' ? 'active' : ''}
                onClick={() => selectContentEditorTab('sections')}
              >
                <FileStack size={17} /> Další sekce
                <span>{homepageSectionItems.filter((item) => item.isActive).length}</span>
              </button>
              <a className="button secondary" href="/" target="_blank" rel="noreferrer">
                <Eye size={16} /> Náhled webu
              </a>
            </div>

            {contentEditorTab === 'hero' && <div className="admin-grid content-editor-panel" role="tabpanel">
            <form className="admin-card hero-admin-form" onSubmit={saveSlide}>
              <div className="admin-card-header">
                <div>
                  <p className="section-label">Homepage</p>
                  <h3>{slideForm.id ? 'Upravit hero slide' : 'Nový hero slide'}</h3>
                  <p className="form-help">Každý slide potřebuje nadpis, krátký text a obrázek. Pořadí určuje jeho pozici.</p>
                </div>
                <button className="button secondary" type="button" onClick={newSlide}>
                  <Plus size={17} /> Nový slide
                </button>
              </div>
              <label>
                Nadpis
                <input value={slideForm.title} onChange={(event) => setSlideForm((current) => ({ ...current, title: event.target.value }))} required />
              </label>
              <label>
                Text
                <textarea rows={5} value={slideForm.subtitle} onChange={(event) => setSlideForm((current) => ({ ...current, subtitle: event.target.value }))} required />
              </label>
              <div className="field-stack">
                <label>
                  Obrázek
                  <input
                    value={slideForm.imageUrl}
                    onChange={(event) => setSlideForm((current) => ({ ...current, imageUrl: event.target.value }))}
                    placeholder="URL obrázku nebo nahrajte soubor z počítače"
                    required
                  />
                </label>
                <span className="local-image-actions">
                  <label className="button secondary local-image-upload">
                    <Upload size={17} />
                    {imageUploadBusy === 'hero' ? 'Nahrávám…' : 'Nahrát z počítače'}
                    <input type="file" accept="image/*" onChange={uploadSlideImage} disabled={Boolean(imageUploadBusy)} />
                  </label>
                  <small>JPG, PNG, WebP nebo AVIF. Po nahrání se cesta doplní sama.</small>
                </span>
              </div>
              {slideForm.imageUrl && (
                <div className="hero-admin-preview">
                  <img src={resolvePublicFileUrl(slideForm.imageUrl)} alt="" />
                  <div>
                    <span>Náhled hero slidu</span>
                    <strong>{slideForm.title || 'Nadpis slidu'}</strong>
                    <p>{slideForm.subtitle || 'Text slidu'}</p>
                  </div>
                </div>
              )}
              <div className="form-grid two">
                <label>
                  Text tlačítka
                  <input value={slideForm.ctaLabel} onChange={(event) => setSlideForm((current) => ({ ...current, ctaLabel: event.target.value }))} />
                </label>
                <label>
                  Odkaz tlačítka
                  <input value={slideForm.ctaHref} onChange={(event) => setSlideForm((current) => ({ ...current, ctaHref: event.target.value }))} />
                </label>
                <label>
                  Pořadí
                  <input
                    type="number"
                    value={slideForm.sortOrder}
                    onChange={(event) => setSlideForm((current) => ({ ...current, sortOrder: Number(event.target.value) }))}
                  />
                </label>
                <label className="checkbox-field">
                  <input
                    type="checkbox"
                    checked={slideForm.isActive}
                    onChange={(event) => setSlideForm((current) => ({ ...current, isActive: event.target.checked }))}
                  />
                  Aktivní
                </label>
              </div>
              <div className="editor-actions">
                <button className="button primary" type="submit">
                  <Save size={18} /> {slideForm.id ? 'Uložit změny' : 'Přidat do hero sekce'}
                </button>
                {slideForm.id && (
                  <button className="button secondary" type="button" onClick={newSlide}>
                    <Plus size={18} /> Přidat další
                  </button>
                )}
              </div>
            </form>
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h3>Hero slidy</h3>
                  <p className="form-help">Kliknutím otevřete slide k úpravě.</p>
                </div>
                <Badge tone="info">{slides.length} celkem</Badge>
              </div>
              <div className="client-list slide-list">
                {slides.map((item) => (
                  <button className={slideForm.id === item.id ? 'active' : ''} key={item.id} type="button" onClick={() => editSlide(item)}>
                    <img src={item.imageUrl} alt="" />
                    <strong>{item.title}</strong>
                    <span>
                      pořadí {item.sortOrder} - {item.isActive ? 'aktivní' : 'skrytý'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            </div>}

            {contentEditorTab === 'gallery' && (
              <div className="admin-grid content-editor-panel" role="tabpanel">
                <form className="admin-card homepage-content-form" onSubmit={saveHomepageContentItem}>
                  <div className="admin-card-header">
                    <div>
                      <p className="section-label">Fotogalerie homepage</p>
                      <h3>{homepageContentForm.id ? 'Upravit snímek' : 'Nový snímek'}</h3>
                      <p className="form-help">Tato slideshow je pod úvodním hero a ukazuje reálné fotografie z praxe.</p>
                    </div>
                    <button className="button secondary" type="button" onClick={newHomepageGalleryItem}>
                      <Plus size={17} /> Nový snímek
                    </button>
                  </div>
                  <label>
                    Nadpis fotografie
                    <input
                      value={homepageContentForm.title}
                      onChange={(event) => setHomepageContentForm((current) => ({ ...current, title: event.target.value }))}
                      required
                    />
                  </label>
                  <label>
                    Krátký popis
                    <textarea
                      rows={4}
                      value={homepageContentForm.body}
                      onChange={(event) => setHomepageContentForm((current) => ({ ...current, body: event.target.value }))}
                      required
                    />
                  </label>
                  <div className="field-stack">
                    <label>
                      Obrázek
                      <input
                        value={homepageContentForm.imageUrl}
                        onChange={(event) => setHomepageContentForm((current) => ({ ...current, imageUrl: event.target.value }))}
                        placeholder="URL obrázku nebo nahrajte soubor z počítače"
                        required
                      />
                    </label>
                    <span className="local-image-actions">
                      <label className="button secondary local-image-upload">
                        <Upload size={17} />
                        {imageUploadBusy === 'homepage-gallery' ? 'Nahrávám…' : 'Nahrát z počítače'}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={uploadHomepageContentImage}
                          disabled={Boolean(imageUploadBusy)}
                        />
                      </label>
                      <small>Po nahrání se veřejná cesta doplní automaticky.</small>
                    </span>
                  </div>
                  {homepageContentForm.imageUrl && (
                    <div className="homepage-gallery-admin-preview">
                      <img src={resolvePublicFileUrl(homepageContentForm.imageUrl)} alt="" />
                      <div>
                        <strong>{homepageContentForm.title || 'Nadpis fotografie'}</strong>
                        <p>{homepageContentForm.body || 'Popis fotografie'}</p>
                      </div>
                    </div>
                  )}
                  <div className="form-grid two">
                    <label>
                      Pořadí
                      <input
                        type="number"
                        value={homepageContentForm.sortOrder}
                        onChange={(event) =>
                          setHomepageContentForm((current) => ({ ...current, sortOrder: Number(event.target.value) }))
                        }
                      />
                    </label>
                    <label className="checkbox-field">
                      <input
                        type="checkbox"
                        checked={homepageContentForm.isActive}
                        onChange={(event) =>
                          setHomepageContentForm((current) => ({ ...current, isActive: event.target.checked }))
                        }
                      />
                      Zobrazit na webu
                    </label>
                  </div>
                  <button className="button primary" type="submit">
                    <Save size={18} /> Uložit snímek
                  </button>
                </form>

                <div className="admin-card">
                  <div className="admin-card-header">
                    <div>
                      <h3>Snímky z praxe</h3>
                      <p className="form-help">Kliknutím načtete snímek k úpravě. Skryté zůstávají v archivu.</p>
                    </div>
                    <Badge tone="info">{homepageGalleryItems.length} celkem</Badge>
                  </div>
                  <div className="homepage-content-list">
                    {homepageGalleryItems.map((item) => (
                      <button
                        className={homepageContentForm.id === item.id ? 'active' : ''}
                        key={item.id}
                        type="button"
                        onClick={() => editHomepageContent(item)}
                      >
                        <img src={resolvePublicFileUrl(item.imageUrl)} alt="" />
                        <span>
                          <strong>{item.title}</strong>
                          <small>Pořadí {item.sortOrder} · {item.isActive ? 'zobrazeno' : 'skryto'}</small>
                        </span>
                        {item.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {contentEditorTab === 'sections' && (
              <div className="admin-grid content-editor-panel" role="tabpanel">
                <div className="admin-card">
                  <div className="admin-card-header">
                    <div>
                      <p className="section-label">Homepage</p>
                      <h3>Editovatelné sekce</h3>
                      <p className="form-help">Vyberte blok. Změny se projeví na veřejné homepage po uložení.</p>
                    </div>
                    <Badge tone="info">{homepageSectionItems.length} sekcí</Badge>
                  </div>
                  <div className="homepage-section-list">
                    {homepageSectionItems.map((item) => (
                      <button
                        className={homepageContentForm.id === item.id ? 'active' : ''}
                        key={item.id}
                        type="button"
                        onClick={() => editHomepageContent(item)}
                      >
                        <span>
                          <small>{item.label || 'Sekce'}</small>
                          <strong>{item.title}</strong>
                        </span>
                        {item.isActive ? <Eye size={17} /> : <EyeOff size={17} />}
                      </button>
                    ))}
                  </div>
                </div>

                <form className="admin-card homepage-content-form" onSubmit={saveHomepageContentItem}>
                  <div className="admin-card-header">
                    <div>
                      <p className="section-label">Úprava sekce</p>
                      <h3>{homepageContentForm.title}</h3>
                      <p className="form-help">Technický klíč: {homepageContentForm.id}</p>
                    </div>
                    <Badge tone={homepageContentForm.isActive ? 'success' : 'warning'}>
                      {homepageContentForm.isActive ? 'Zobrazeno' : 'Skryto'}
                    </Badge>
                  </div>
                  <label>
                    Štítek nad nadpisem
                    <input
                      value={homepageContentForm.label}
                      onChange={(event) => setHomepageContentForm((current) => ({ ...current, label: event.target.value }))}
                    />
                  </label>
                  <label>
                    Nadpis
                    <input
                      value={homepageContentForm.title}
                      onChange={(event) => setHomepageContentForm((current) => ({ ...current, title: event.target.value }))}
                      required
                    />
                  </label>
                  <label>
                    Hlavní text
                    <textarea
                      rows={6}
                      value={homepageContentForm.body}
                      onChange={(event) => setHomepageContentForm((current) => ({ ...current, body: event.target.value }))}
                      required
                    />
                  </label>
                  <div className="form-grid two">
                    <label>
                      Text tlačítka
                      <input
                        value={homepageContentForm.ctaLabel}
                        onChange={(event) =>
                          setHomepageContentForm((current) => ({ ...current, ctaLabel: event.target.value }))
                        }
                      />
                    </label>
                    <label>
                      Odkaz tlačítka
                      <input
                        value={homepageContentForm.ctaHref}
                        onChange={(event) =>
                          setHomepageContentForm((current) => ({ ...current, ctaHref: event.target.value }))
                        }
                      />
                    </label>
                    <label>
                      Pořadí v administraci
                      <input
                        type="number"
                        value={homepageContentForm.sortOrder}
                        onChange={(event) =>
                          setHomepageContentForm((current) => ({ ...current, sortOrder: Number(event.target.value) }))
                        }
                      />
                    </label>
                    <label className="checkbox-field">
                      <input
                        type="checkbox"
                        checked={homepageContentForm.isActive}
                        onChange={(event) =>
                          setHomepageContentForm((current) => ({ ...current, isActive: event.target.checked }))
                        }
                      />
                      Zobrazit sekci na webu
                    </label>
                  </div>
                  <div className="homepage-section-preview">
                    <small>{homepageContentForm.label}</small>
                    <strong>{homepageContentForm.title}</strong>
                    <p>{homepageContentForm.body}</p>
                  </div>
                  <button className="button primary" type="submit">
                    <Save size={18} /> Uložit sekci
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {activeTab === 'materialOffers' && (
          <div className="material-offers-admin">
            <article className="admin-card material-offers-list-panel">
              <div className="admin-card-header">
                <div>
                  <h3>Materiální nabídky</h3>
                  <p className="form-help">Oblečení, vybavení a knihy odeslané z veřejných formulářů.</p>
                </div>
                <Badge tone={newMaterialOfferCount > 0 ? 'warning' : 'success'}>{newMaterialOfferCount} nových</Badge>
              </div>
              <div className="material-offer-toolbar">
                <label className="search-field">
                  <Search size={16} aria-hidden="true" />
                  <input
                    type="search"
                    value={materialOfferQuery}
                    onChange={(event) => setMaterialOfferQuery(event.target.value)}
                    placeholder="Jméno, lokalita, kontakt nebo ID"
                    aria-label="Vyhledat materiální nabídku"
                  />
                </label>
                <select
                  value={materialOfferStatusFilter}
                  onChange={(event) => setMaterialOfferStatusFilter(event.target.value as 'all' | ApiMaterialOfferStatus)}
                  aria-label="Filtrovat podle stavu"
                >
                  <option value="all">Všechny stavy</option>
                  {materialOfferStatusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
                <button className="button secondary" type="button" onClick={exportMaterialOffersCsv}>
                  <Download size={16} /> CSV
                </button>
              </div>
              <div className="material-offer-filter" role="group" aria-label="Filtrovat nabídky podle typu">
                {([
                  ['all', 'Vše'],
                  ['clothing', 'Oblečení'],
                  ['equipment', 'Vybavení'],
                  ['books', 'Knihy']
                ] as const).map(([value, label]) => (
                  <button key={value} type="button" className={materialOfferFilter === value ? 'active' : ''} onClick={() => setMaterialOfferFilter(value)}>
                    {label}
                  </button>
                ))}
              </div>
              <div className="material-offer-admin-list">
                {filteredMaterialOffers.length === 0 && <p className="empty-note">V této kategorii zatím nejsou žádné nabídky.</p>}
                {filteredMaterialOffers.map((offer) => {
                  const statusLabel = materialOfferStatusOptions.find((option) => option.value === offer.status)?.label || offer.status;
                  return (
                    <button
                      key={offer.id}
                      type="button"
                      className={selectedMaterialOfferId === offer.id ? 'active' : ''}
                      onClick={() => setSelectedMaterialOfferId(offer.id)}
                    >
                      <span className="material-offer-list-icon" aria-hidden="true">
                        {offer.offerType === 'clothing' ? <Shirt size={19} /> : offer.offerType === 'books' ? <BookOpen size={19} /> : <PackageOpen size={19} />}
                      </span>
                      <span>
                        <strong>{offer.donorName}</strong>
                        <small>{materialOfferTypeLabels[offer.offerType]} · {offer.locality}</small>
                      </span>
                      <span className={`material-offer-status status-${offer.status}`}>{statusLabel}</span>
                      <time dateTime={offer.createdAt}>{new Date(offer.createdAt).toLocaleDateString('cs-CZ')}</time>
                    </button>
                  );
                })}
              </div>
            </article>

            <article className="admin-card material-offer-detail-panel">
              {!selectedMaterialOffer ? (
                <div className="material-offer-empty-detail">
                  <PackageOpen size={34} />
                  <h3>Vyberte nabídku</h3>
                  <p>Zobrazí se kontakt, fotografie, doprava a ovládání stavu.</p>
                </div>
              ) : (
                <>
                  <div className="admin-card-header material-offer-detail-heading">
                    <div>
                      <p className="section-label">{materialOfferTypeLabels[selectedMaterialOffer.offerType]}</p>
                      <h3>{selectedMaterialOffer.donorName}</h3>
                      <p className="form-help">Nabídka {selectedMaterialOffer.id} · {new Date(selectedMaterialOffer.createdAt).toLocaleString('cs-CZ')}</p>
                    </div>
                    <span className={`material-offer-status status-${selectedMaterialOffer.status}`}>
                      {materialOfferStatusOptions.find((option) => option.value === selectedMaterialOffer.status)?.label}
                    </span>
                  </div>

                  <dl className="material-offer-facts">
                    <div><dt>Množství</dt><dd>{selectedMaterialOffer.quantity}</dd></div>
                    <div><dt>Stav věcí</dt><dd>{materialOfferConditionLabels[selectedMaterialOffer.itemCondition] || selectedMaterialOffer.itemCondition}</dd></div>
                    <div><dt>Lokalita</dt><dd>{selectedMaterialOffer.locality}</dd></div>
                    <div><dt>Doprava</dt><dd>{materialOfferTransportLabels[selectedMaterialOffer.transport]}</dd></div>
                  </dl>

                  <section className="material-offer-description">
                    <h4>Popis nabídky</h4>
                    <p>{selectedMaterialOffer.itemDescription}</p>
                    {selectedMaterialOffer.note && <><h4>Poznámka dárce</h4><p>{selectedMaterialOffer.note}</p></>}
                  </section>

                  <div className="material-offer-contact-actions">
                    {selectedMaterialOffer.email && <a className="button secondary" href={`mailto:${selectedMaterialOffer.email}`}><Mail size={17} /> {selectedMaterialOffer.email}</a>}
                    {selectedMaterialOffer.phone && <a className="button secondary" href={`tel:${selectedMaterialOffer.phone.replace(/\s+/g, '')}`}><Phone size={17} /> {selectedMaterialOffer.phone}</a>}
                    <button className="button secondary" type="button" onClick={printSelectedMaterialOffer}><Printer size={17} /> Tisk / PDF</button>
                  </div>

                  <section className="material-offer-admin-photos">
                    <h4>Fotografie <span>{selectedMaterialOffer.photos.length}</span></h4>
                    {selectedMaterialOffer.photos.length === 0 ? (
                      <p className="empty-note">Dárce nepřiložil žádné fotografie.</p>
                    ) : (
                      <div>
                        {selectedMaterialOffer.photos.map((photo, index) => (
                          <button key={photo.id} type="button" onClick={() => setMaterialOfferPhotoPreview({ url: photo.url, name: photo.fileName })} title="Otevřít fotografii v plné velikosti">
                            <img src={photo.url} alt={`Fotografie ${index + 1} k nabídce od ${selectedMaterialOffer.donorName}`} />
                            <span>{photo.fileName}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </section>

                  <div className="material-offer-review-form">
                    <label>
                      Odpovědná osoba
                      <select value={materialOfferAssignedTo} onChange={(event) => setMaterialOfferAssignedTo(event.target.value)}>
                        <option value="">Nepřiřazeno</option>
                        {managedUsers
                          .filter((user) => user.isActive && ['admin', 'editor'].includes(user.role))
                          .map((user) => <option key={user.id} value={user.id}>{user.name} · {roleLabels[user.role]}</option>)}
                      </select>
                    </label>
                    <label>
                      Stav nabídky
                      <select value={materialOfferStatusDraft} onChange={(event) => setMaterialOfferStatusDraft(event.target.value as ApiMaterialOfferStatus)}>
                        {materialOfferStatusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                      </select>
                    </label>
                    <label>
                      Termín svozu / převzetí
                      <input type="datetime-local" value={materialOfferPickupAt} onChange={(event) => setMaterialOfferPickupAt(event.target.value)} />
                    </label>
                    <label>
                      Adresa svozu
                      <input maxLength={500} value={materialOfferPickupAddress} onChange={(event) => setMaterialOfferPickupAddress(event.target.value)} placeholder="Adresa nebo upřesnění místa" />
                    </label>
                    <label>
                      Uchovat údaje do
                      <input type="date" value={materialOfferRetentionUntil} onChange={(event) => setMaterialOfferRetentionUntil(event.target.value)} />
                    </label>
                    <label>
                      Interní poznámka
                      <textarea rows={4} maxLength={5000} value={materialOfferAdminNote} onChange={(event) => setMaterialOfferAdminNote(event.target.value)} placeholder="Domluvený termín, odpovědná osoba, důvod odmítnutí…" />
                    </label>
                    <button className="button primary" type="button" onClick={saveMaterialOfferReview} disabled={savingMaterialOffer || !onMaterialOfferUpdateRequest}>
                      <Save size={17} /> {savingMaterialOffer ? 'Ukládám...' : 'Uložit stav nabídky'}
                    </button>
                  </div>
                  <section className="material-offer-notification-state">
                    <h4>Oznámení a souhlas</h4>
                    <p>Potvrzení dárci: {selectedMaterialOffer.donorNotifiedAt ? new Date(selectedMaterialOffer.donorNotifiedAt).toLocaleString('cs-CZ') : 'neodesláno'}</p>
                    <p>Upozornění týmu: {selectedMaterialOffer.adminNotifiedAt ? new Date(selectedMaterialOffer.adminNotifiedAt).toLocaleString('cs-CZ') : 'neodesláno'}</p>
                    <p>Souhlas: {selectedMaterialOffer.consentVersion || 'neuveden'} · {selectedMaterialOffer.consentAt ? new Date(selectedMaterialOffer.consentAt).toLocaleString('cs-CZ') : 'bez data'}</p>
                  </section>
                  <section className="material-offer-history">
                    <h4>Historie nabídky</h4>
                    {selectedMaterialOffer.events.length === 0 ? (
                      <p className="empty-note">Zatím nejsou zaznamenané žádné změny.</p>
                    ) : (
                      <ol>
                        {selectedMaterialOffer.events.map((event) => (
                          <li key={event.id}>
                            <span>{new Date(event.createdAt).toLocaleString('cs-CZ')}</span>
                            <strong>{event.eventType === 'created' ? 'Nabídka přijata' : event.eventType === 'status_changed' ? 'Změna stavu' : event.eventType === 'anonymized' ? 'Anonymizace' : 'Úprava workflow'}</strong>
                            <small>{event.actorName || 'Systém'}{event.note ? ` · ${event.note}` : ''}</small>
                          </li>
                        ))}
                      </ol>
                    )}
                  </section>
                  <div className="material-offer-danger-zone">
                    <button className="button danger" type="button" onClick={anonymizeSelectedMaterialOffer} disabled={Boolean(selectedMaterialOffer.anonymizedAt) || !onMaterialOfferAnonymizeRequest}>
                      <Trash2 size={16} /> {selectedMaterialOffer.anonymizedAt ? 'Anonymizováno' : 'Anonymizovat údaje'}
                    </button>
                  </div>
                </>
              )}
            </article>

            <article className="admin-card material-email-templates">
              <div className="admin-card-header">
                <div>
                  <h3>E-mailové šablony</h3>
                  <p className="form-help">Proměnné: {'{{donorName}}'}, {'{{offerType}}'}, {'{{offerId}}'}, {'{{locality}}'}, {'{{quantity}}'}, {'{{statusLabel}}'}, {'{{pickupDetails}}'}, {'{{adminUrl}}'}.</p>
                </div>
                <Mail size={20} />
              </div>
              <div className="material-email-template-list">
                {emailTemplates.map((template) => {
                  const draft = emailTemplateDrafts[template.key] || template;
                  return (
                    <details key={template.key}>
                      <summary>{template.displayName}<span>{draft.isActive ? 'aktivní' : 'vypnutá'}</span></summary>
                      <div className="material-email-template-form">
                        <label>Předmět<input value={draft.subjectTemplate} onChange={(event) => setEmailTemplateDrafts((current) => ({ ...current, [template.key]: { ...draft, subjectTemplate: event.target.value } }))} /></label>
                        <label>Textová verze<textarea rows={6} value={draft.textTemplate} onChange={(event) => setEmailTemplateDrafts((current) => ({ ...current, [template.key]: { ...draft, textTemplate: event.target.value } }))} /></label>
                        <label>HTML verze<textarea rows={7} value={draft.htmlTemplate} onChange={(event) => setEmailTemplateDrafts((current) => ({ ...current, [template.key]: { ...draft, htmlTemplate: event.target.value } }))} /></label>
                        <label className="checkbox-field"><input type="checkbox" checked={draft.isActive} onChange={(event) => setEmailTemplateDrafts((current) => ({ ...current, [template.key]: { ...draft, isActive: event.target.checked } }))} /><span>Šablona je aktivní</span></label>
                        <button className="button primary" type="button" onClick={() => saveEmailTemplateDraft(template.key)} disabled={savingEmailTemplate === template.key || !onEmailTemplateUpdateRequest}><Save size={16} /> {savingEmailTemplate === template.key ? 'Ukládám...' : 'Uložit šablonu'}</button>
                      </div>
                    </details>
                  );
                })}
              </div>
            </article>
            {materialOfferPhotoPreview && createPortal(
              <div className="material-photo-lightbox" role="dialog" aria-modal="true" aria-label={materialOfferPhotoPreview.name} onClick={() => setMaterialOfferPhotoPreview(null)}>
                <button type="button" aria-label="Zavřít náhled" onClick={() => setMaterialOfferPhotoPreview(null)}><X size={22} /></button>
                <img src={materialOfferPhotoPreview.url} alt={materialOfferPhotoPreview.name} onClick={(event) => event.stopPropagation()} />
              </div>,
              document.body
            )}
          </div>
        )}

        {activeTab === 'media' && (
          <div className="admin-grid">
            <article className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h3>Knihovna souborů</h3>
                  <p className="form-help">Obrázky, PDF a dokumenty dostupné z databáze i veřejné složky webu.</p>
                </div>
                <button className="icon-tool tooltip-link primary" type="button" data-tooltip="Nové médium" aria-label="Nové médium" onClick={() => openMediaDialog()}>
                  <Plus size={18} />
                </button>
              </div>
              <div className="table-lite media-table">
                {mediaFiles.length === 0 && <p className="empty-note">V databázi zatím nejsou uložená média. Slideshow níže používá veřejné soubory z webu.</p>}
                {mediaFiles.map((file) => (
                  <div key={file.id}>
                    <strong>{file.title}</strong>
                    <span>{file.category} - {readableBytes(file.fileSize)}</span>
                    <button className="icon-tool tooltip-link" type="button" data-tooltip="Detail média" aria-label="Detail média" onClick={() => openMediaDialog(file)}>
                      <FileText size={16} />
                    </button>
                    <a href={resolvePublicFileUrl(file.fileUrl)} target="_blank" rel="noreferrer">Otevřít</a>
                  </div>
                ))}
              </div>
            </article>
            <article className="admin-card">
              <h3>Aktuální vizuály</h3>
              <div className="client-list slide-list">
                {slides.slice(0, 6).map((item) => (
                  <button key={item.id} type="button" onClick={() => editSlide(item)}>
                    <img src={item.imageUrl} alt="" />
                    <strong>{item.title}</strong>
                    <span>{item.imageUrl}</span>
                  </button>
                ))}
              </div>
            </article>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="admin-grid">
            <article className="admin-card application-review-card">
              <h3>Žádosti o vstup ({pendingProjectApplications.length})</h3>
              <p className="form-help">Schválením se uchazeči nastaví cílová role účtu. Zamítnutí pošle žadateli kapacitní zprávu do notifikací.</p>
              <div className="application-review-list">
                {projectApplications.length === 0 && <p className="empty-note">Zatím není podaná žádná žádost.</p>}
                {projectApplications.slice(0, 12).map((application) => (
                  <article key={application.id} className={`application-review-row status-${application.status}`}>
                    <div>
                      <Badge tone={application.status === 'approved' ? 'success' : application.status === 'rejected' ? 'error' : 'info'}>
                        {application.status === 'pending' ? 'čeká' : application.status === 'approved' ? 'schváleno' : 'zamítnuto'}
                      </Badge>
                      <strong>{application.userName}</strong>
                      <span>{application.userEmail}</span>
                      <small>{roleLabels[application.requestedRole]} · {new Date(application.createdAt).toLocaleString('cs-CZ')}</small>
                      {application.motivation && <p>{application.motivation}</p>}
                    </div>
                    {application.status === 'pending' ? (
                      <div className="application-review-actions">
                        <AdminContextMenu
                          label={`Akce žádosti ${application.userName}`}
                          items={[
                            {
                              label: `Schválit jako ${roleLabels[application.requestedRole]}`,
                              text: 'Potvrdit roli a účet',
                              icon: <CheckCircle2 size={16} />,
                              tone: 'success',
                              onSelect: () => reviewApplication(application, 'approved', application.requestedRole)
                            },
                            {
                              label: 'Zamítnout kapacitně',
                              text: 'Poslat červenou zprávu žadateli',
                              icon: <X size={16} />,
                              tone: 'danger',
                              onSelect: () => reviewApplication(application, 'rejected', application.requestedRole)
                            }
                          ]}
                        />
                      </div>
                    ) : (
                      <small>{application.adminNote || 'Vyřízeno'}</small>
                    )}
                  </article>
                ))}
              </div>
            </article>
            <article className="admin-card">
              <h3>Uživatelé</h3>
              <p className="form-help">Role a aktivace účtů. Změny se ukládají přes admin API.</p>
              <div className="user-admin-list">
                {managedUsers.length === 0 && <p className="empty-note">Seznam uživatelů není dostupný nebo je prázdný.</p>}
                {managedUsers.map((user) => (
                  <article key={user.id} className="user-admin-row">
                    <button className="user-admin-main" type="button" onClick={() => openUserDialog(user)}>
                      <strong>{user.name}</strong>
                      <span>{user.email}</span>
                      <small>{user.lastLoginAt ? `poslední přihlášení ${new Date(user.lastLoginAt).toLocaleDateString('cs-CZ')}` : 'bez posledního přihlášení'}</small>
                    </button>
                    <select value={user.role} onChange={(event) => updateManagedUser(user, { role: event.target.value as ApiRole })}>
                      {adminRoleOptions.map((role) => (
                        <option key={role} value={role}>{roleLabels[role]}</option>
                      ))}
                    </select>
                    <label className="switch-row">
                      <input type="checkbox" checked={user.isActive} onChange={(event) => updateManagedUser(user, { isActive: event.target.checked })} />
                      Aktivní
                    </label>
                    <AdminContextMenu
                      label={`Akce uživatele ${user.name}`}
                      items={[
                        {
                          label: 'Detail / role',
                          text: 'Otevřít správu účtu',
                          icon: <UserCog size={16} />,
                          onSelect: () => openUserDialog(user)
                        },
                        {
                          label: 'Reset hesla',
                          text: 'Vygenerovat reset hesla',
                          icon: <KeyRound size={16} />,
                          onSelect: () => resetManagedUserPassword(user)
                        },
                        {
                          label: 'Smazat účet',
                          text: 'Odstranit uživatele',
                          icon: <Trash2 size={16} />,
                          tone: 'danger',
                          onSelect: () => deleteManagedUser(user)
                        }
                      ]}
                    />
                  </article>
                ))}
              </div>
            </article>
            <article className="admin-card">
              <h3>Role</h3>
              <div className="table-lite">
                <div><strong>Uchazeč</strong><span>základní profil, komentáře a žádost o vstup do projektu</span></div>
                <div><strong>Klient</strong><span>klientská zóna, profil a vlastní dokumenty</span></div>
                <div><strong>Dobrovolník</strong><span>portál a komunikace k zapojení do pomoci</span></div>
                <div><strong>Investor / mecenáš / dárce</strong><span>portál podporovatele a komunikace k podpoře projektu</span></div>
                <div><strong>Admin / Editor</strong><span>správa projektu, obsahu a uživatelských rolí podle oprávnění</span></div>
              </div>
            </article>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="admin-grid">
            <article className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h3>Notifikace</h3>
                  <p className="form-help">{unreadNotifications.length} nepřečtených upozornění, {interactionActivityCount} veřejných interakcí.</p>
                </div>
                <button className="icon-tool tooltip-link primary" type="button" data-tooltip="Nová notifikace" aria-label="Nová notifikace" onClick={() => openNotificationDialog()}>
                  <Plus size={18} />
                </button>
              </div>
              <div className="notification-toolbar">
                <label className="notification-search">
                  <Search size={16} aria-hidden="true" />
                  <input
                    type="search"
                    value={notificationSearch}
                    aria-label="Hledat v notifikacích"
                    placeholder="Hledat podle názvu, typu, textu nebo data"
                    onChange={(event) => setNotificationSearch(event.target.value)}
                  />
                  {notificationSearch && (
                    <button type="button" aria-label="Vymazat hledání" onClick={() => setNotificationSearch('')}>
                      <X size={15} />
                    </button>
                  )}
                </label>
              </div>
              {(() => {
                const searchValue = notificationSearch.trim().toLocaleLowerCase('cs-CZ');
                const matchesNotification = (notification: NotificationItem) => {
                  if (!searchValue) return true;
                  const createdAt = new Date(notification.createdAt);
                  const readAt = notification.readAt ? new Date(notification.readAt) : null;
                  const searchableText = [
                    notification.title,
                    notification.body,
                    notification.category,
                    notification.tone,
                    notification.linkHref || '',
                    createdAt.toLocaleString('cs-CZ'),
                    createdAt.toISOString(),
                    readAt ? readAt.toLocaleString('cs-CZ') : '',
                    readAt ? readAt.toISOString() : ''
                  ]
                    .join(' ')
                    .toLocaleLowerCase('cs-CZ');
                  return searchableText.includes(searchValue);
                };
                const activeAdminNotifications = notifications.filter((notification) => !notification.readAt && matchesNotification(notification));
                const archivedAdminNotifications = notifications.filter((notification) => notification.readAt && matchesNotification(notification));
                const renderNotificationRow = (notification: NotificationItem, archive = false) => (
                  <article key={`${archive ? 'archive' : 'active'}-${notification.id}`} className={`compact ${notification.readAt ? 'read' : ''}`}>
                    <Badge tone={toFeedbackTone(notification.tone)}>{notification.category}</Badge>
                    <CursorCard
                      trigger={
                        <button
                          className="notification-admin-main compact"
                          type="button"
                          aria-label={`${notification.title}. Detail je dostupný v náhledu nebo přes menu.`}
                          onClick={() => openNotificationTarget(notification)}
                        >
                          <strong>{notification.title}</strong>
                        </button>
                      }
                      overlay={
                        <div className={`cursor-card-panel tone-${toFeedbackTone(notification.tone)}`}>
                          <Badge tone={toFeedbackTone(notification.tone)}>{notification.category}</Badge>
                          <strong>{notification.title}</strong>
                          <p>{notification.body}</p>
                          <span className="cursor-card-meta">
                            <small>{notification.readAt ? 'Archivováno / přečteno' : 'Čeká na reakci'}</small>
                            <small>{new Date(notification.createdAt).toLocaleString('cs-CZ')}</small>
                          </span>
                          {notification.linkHref && <small className="cursor-card-link">Má navázaný cíl: otevřít lze přes menu.</small>}
                        </div>
                      }
                    />
                    <div className="notification-actions">
                      <AdminContextMenu
                        label={`Akce notifikace ${notification.title}`}
                        items={[
                          {
                            label: 'Detail',
                            text: 'Upravit notifikaci',
                            icon: <FileText size={16} />,
                            onSelect: () => openNotificationDialog(notification)
                          },
                          ...(!notification.readAt
                            ? [
                                {
                                  label: 'Označit přečtené',
                                  text: 'Archivovat jako vyřízené',
                                  icon: <CheckCircle2 size={16} />,
                                  tone: 'success' as const,
                                  onSelect: () => markNotificationRead(notification)
                                }
                              ]
                            : []),
                          ...(notification.linkHref
                            ? [
                                {
                                  label: 'Otevřít cíl',
                                  text: 'Přejít na související místo',
                                  icon: <ArrowRight size={16} />,
                                  onSelect: () => openNotificationTarget(notification)
                                }
                              ]
                            : [])
                        ]}
                      />
                    </div>
                  </article>
                );

                return (
                  <>
                    <div className="notification-section-label">
                      <span>Aktivní notifikace</span>
                      <span className="notification-section-actions">
                        <small>{activeAdminNotifications.length} čeká na reakci</small>
                        {activeAdminNotifications.length > 0 && (
                          <button className="notification-section-button" type="button" onClick={() => markNotificationsReadBatch(activeAdminNotifications)}>
                            Archivovat výběr
                          </button>
                        )}
                      </span>
                    </div>
                    <div className="notification-admin-list compact">
                      {activeAdminNotifications.length === 0 && (
                        <p className="empty-note">
                          {notificationSearch ? 'Pro hledání nejsou žádné aktivní notifikace.' : 'Žádné aktivní notifikace nečekají na reakci.'}
                        </p>
                      )}
                      {activeAdminNotifications.map((notification) => renderNotificationRow(notification))}
                    </div>

                    <details className="notification-archive-panel" open={Boolean(notificationSearch)}>
                      <summary>
                        <div className="notification-section-label archive">
                          <span>Auditní archiv</span>
                          <small>
                            {archivedAdminNotifications.length} vyřízených záznamů ve výběru
                            {notificationSearch ? ' - otevřeno kvůli hledání' : ''}
                          </small>
                        </div>
                      </summary>
                      <div className="notification-admin-list compact archive-list">
                        {archivedAdminNotifications.length === 0 && (
                          <p className="empty-note">
                            {notificationSearch ? 'V archivu pro hledání nic není.' : 'Archiv je zatím prázdný.'}
                          </p>
                        )}
                        {archivedAdminNotifications.slice(0, 24).map((notification) => renderNotificationRow(notification, true))}
                        {archivedAdminNotifications.length > 24 && (
                          <p className="empty-note">Zobrazeno prvních 24 záznamů. Zúžte výběr přes hledání podle názvu, typu nebo data.</p>
                        )}
                      </div>
                    </details>
                  </>
                );
              })()}
            </article>
            <article className="admin-card">
              <h3>Systémové události</h3>
              <div className="activity-list timeline-list system-event-list">
                {systemActivityItems.slice(0, 9).map(renderActivityItem)}
                {systemActivityItems.length === 0 && <p className="empty-note">Zatím nejsou žádné registrace, komentáře ani srdíčka k řešení.</p>}
              </div>
            </article>
            <article className="admin-card">
              <h3>Typy upozornění</h3>
              <div className="table-lite">
                <div><strong>Registrace</strong><span>nové účty a klientské žádosti</span></div>
                <div><strong>Srdíčka</strong><span>reakce registrovaných uživatelů u aktualit</span></div>
                <div><strong>Komentáře</strong><span>nové veřejné komentáře a odpovědi</span></div>
                <div><strong>Dokumenty</strong><span>formuláře připravené k podpisu</span></div>
                <div><strong>Systém</strong><span>API, databáze a bezpečnostní zprávy</span></div>
              </div>
            </article>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="admin-grid">
            <article className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h3>Profil organizace</h3>
                  <p className="form-help">Veřejné údaje, SEO a cookie režim.</p>
                </div>
                <button className="icon-tool tooltip-link" type="button" data-tooltip="Upravit profil" aria-label="Upravit profil organizace" onClick={() => setAdminDialog({ type: 'settings', section: 'organization' })}>
                  <Settings size={17} />
                </button>
              </div>
              <div className="table-lite">
                <div><strong>Název</strong><span>{settingsDraft.organizationName}</span></div>
                <div><strong>Primární barva</strong><span>{settingsDraft.primaryColor}</span></div>
                <div><strong>SEO titulek</strong><span>{settingsDraft.seoTitle}</span></div>
                <div><strong>Cookies</strong><span>{settingsDraft.cookiesMode}</span></div>
              </div>
            </article>
            <article className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h3>Bezpečnost</h3>
                  <p className="form-help">Přístupy, role a ochrana účtů.</p>
                </div>
                <button className="icon-tool tooltip-link" type="button" data-tooltip="Upravit bezpečnost" aria-label="Upravit bezpečnost" onClick={() => setAdminDialog({ type: 'settings', section: 'security' })}>
                  <ShieldCheck size={17} />
                </button>
              </div>
              <div className="table-lite">
                <div><strong>Login</strong><span>{settingsDraft.loginMode}</span></div>
                <div><strong>Role</strong><span>{settingsDraft.rolesMode}</span></div>
                <div><strong>Reset hesla</strong><span>{settingsDraft.passwordResetMode}</span></div>
                <div><strong>2FA</strong><span>{settingsDraft.twoFactorMode}</span></div>
              </div>
            </article>
          </div>
        )}
        </div>
        <AdminDetailDialog
          dialog={adminDialog}
          selectedClient={selectedClient}
          draft={draft}
          mediaForm={mediaForm}
          setMediaForm={setMediaForm}
          mediaUploadFile={mediaUploadFile}
          onMediaUploadSelect={onMediaUploadSelect}
          managedUserForm={managedUserForm}
          setManagedUserForm={setManagedUserForm}
          notificationForm={notificationForm}
          setNotificationForm={setNotificationForm}
          settingsDraft={settingsDraft}
          setSettingsDraft={setSettingsDraft}
          onClose={() => setAdminDialog(null)}
          onSelectTemplate={selectTemplateForForm}
          onPrintForm={printForm}
          onDownloadFilledPdf={downloadFilledPdf}
          onRegisterDocument={registerPreparedDocument}
          onSaveMedia={saveMediaDialog}
          onSaveUser={saveUserDialog}
          onResetUserPassword={resetManagedUserPassword}
          onDeleteUser={deleteManagedUser}
          onSaveNotification={saveNotificationDialog}
          onMarkNotificationRead={markNotificationRead}
          onSaveSettings={saveSettingsDialog}
        />
        <WorkspaceBottomNav items={adminNavItems} active={activeTab} onSelect={selectAdminTab} />
      </div>
    </section>
  );
}

function AdminDetailDialog({
  dialog,
  selectedClient,
  draft,
  mediaForm,
  setMediaForm,
  mediaUploadFile,
  onMediaUploadSelect,
  managedUserForm,
  setManagedUserForm,
  notificationForm,
  setNotificationForm,
  settingsDraft,
  setSettingsDraft,
  onClose,
  onSelectTemplate,
  onPrintForm,
  onDownloadFilledPdf,
  onRegisterDocument,
  onSaveMedia,
  onSaveUser,
  onResetUserPassword,
  onDeleteUser,
  onSaveNotification,
  onMarkNotificationRead,
  onSaveSettings
}: {
  dialog: AdminDialogState | null;
  selectedClient: ClientRecord | null;
  draft: FormDraft;
  mediaForm: MediaFile;
  setMediaForm: React.Dispatch<React.SetStateAction<MediaFile>>;
  mediaUploadFile: File | null;
  onMediaUploadSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  managedUserForm: ManagedUser;
  setManagedUserForm: React.Dispatch<React.SetStateAction<ManagedUser>>;
  notificationForm: NotificationItem;
  setNotificationForm: React.Dispatch<React.SetStateAction<NotificationItem>>;
  settingsDraft: AdminSettingsDraft;
  setSettingsDraft: React.Dispatch<React.SetStateAction<AdminSettingsDraft>>;
  onClose: () => void;
  onSelectTemplate: (templateId: string) => void;
  onPrintForm: () => void;
  onDownloadFilledPdf: () => void;
  onRegisterDocument: () => void;
  onSaveMedia: (event: React.FormEvent) => void;
  onSaveUser: (event: React.FormEvent) => void;
  onResetUserPassword: (user: ManagedUser) => void;
  onDeleteUser: (user: ManagedUser) => void;
  onSaveNotification: (event: React.FormEvent) => void;
  onMarkNotificationRead: (notification: NotificationItem) => void;
  onSaveSettings: (event: React.FormEvent) => void;
}) {
  if (!dialog) return null;

  const closeButton = (
    <button className="icon-tool tooltip-link" type="button" data-tooltip="Zavřít" aria-label="Zavřít dialog" onClick={onClose}>
      <X size={18} />
    </button>
  );

  if (dialog.type === 'template') {
    const template = dialog.template;
    const sensitivity = formSensitivity(template);
    const templateFileUrl = resolvePublicFileUrl(template.fileUrl || template.sourceNote, template);
    return (
      <div className="editor-backdrop" role="presentation" onMouseDown={onClose}>
        <section className="admin-detail-dialog" role="dialog" aria-modal="true" aria-label="Detail šablony" onMouseDown={(event) => event.stopPropagation()}>
          <div className="editor-titlebar">
            <div>
              <p className="section-label">Tisková šablona</p>
              <h3>{template.title}</h3>
            </div>
            <div className="editor-title-actions">{closeButton}</div>
          </div>
          <div className="detail-meta-grid">
            <div><span>ID záznamu</span><strong>{template.id}</strong></div>
            <div><span>ID formuláře</span><strong>{template.formUid || '-'}</strong></div>
            <div><span>Skupina</span><strong>{template.formGroup || '-'}</strong></div>
            <div><span>Kategorie</span><strong>{formCategoryTitle(template.folder)}</strong></div>
            <div><span>Citlivost</span><strong>{sensitivity}</strong></div>
            <div><span>Velikost</span><strong>{readableBytes(template.sizeBytes)}</strong></div>
            <div><span>Stav</span><strong>{template.isCurrent === false || template.isActive === false ? 'Archiv' : 'Aktivní'}</strong></div>
            <div><span>Klient pro náhled</span><strong>{selectedClient ? `${selectedClient.firstName} ${selectedClient.lastName}` : 'nevybrán'}</strong></div>
          </div>
          {template.description && (
            <div className="detail-section">
              <span>Popis</span>
              <p>{template.description}</p>
            </div>
          )}
          <div className="detail-section">
            <span>Zdroj</span>
            {template.sourceNote && <p>{template.sourceNote}</p>}
            {templateFileUrl ? (
              <a className="button secondary" href={templateFileUrl} target="_blank" rel="noreferrer">
                <FolderOpen size={18} /> Otevřít PDF
              </a>
            ) : (
              <p className="empty-note">PDF není k dispozici.</p>
            )}
          </div>
          <div className="detail-section">
            <span>Pole pro tisk</span>
            <div className="detail-field-list">
              {template.fields.length === 0 && <p className="empty-note">Bez doplňkových polí.</p>}
              {template.fields.map((field) => (
                <div key={field.key}>
                  <strong>{field.label}</strong>
                  <small>{field.key} / řádků {field.rows ?? 3}</small>
                  {draft[field.key] && <p>{draft[field.key]}</p>}
                </div>
              ))}
            </div>
          </div>
          <div className="editor-actions">
            <button className="button primary" type="button" onClick={() => onSelectTemplate(template.id)}>
              <ClipboardList size={18} /> Použít šablonu
            </button>
            <button className="button secondary" type="button" onClick={onPrintForm} disabled={!selectedClient}>
              <Printer size={18} /> Tisknout k podpisu
            </button>
            <button className="button secondary" type="button" onClick={onDownloadFilledPdf} disabled={!selectedClient || !templateFileUrl}>
              <Download size={18} /> Stáhnout vyplněné PDF
            </button>
            <button className="button secondary" type="button" onClick={onRegisterDocument} disabled={!selectedClient}>
              <FileText size={18} /> Zapsat do dokumentů
            </button>
          </div>
        </section>
      </div>
    );
  }

  if (dialog.type === 'media') {
    const mediaFileUrl = resolvePublicFileUrl(mediaForm.fileUrl);
    return (
      <div className="editor-backdrop" role="presentation" onMouseDown={onClose}>
        <form className="admin-detail-dialog" role="dialog" aria-modal="true" aria-label="Detail média" onSubmit={onSaveMedia} onMouseDown={(event) => event.stopPropagation()}>
          <div className="editor-titlebar">
            <div>
              <p className="section-label">Médium</p>
              <h3>{mediaForm.id ? 'Upravit soubor' : 'Nový soubor'}</h3>
            </div>
            <div className="editor-title-actions">{closeButton}</div>
          </div>
          <div className="editor-fields">
            <div className="editor-full field-stack">
              <span className="field-label">Nahrát soubor z počítače</span>
              <span className="local-image-actions">
                <label className="button secondary local-image-upload">
                  <Upload size={17} /> {mediaUploadFile ? 'Vybrat jiný soubor' : 'Vybrat soubor'}
                  <input type="file" onChange={onMediaUploadSelect} />
                </label>
                <small>{mediaUploadFile ? `${mediaUploadFile.name} · ${readableBytes(mediaUploadFile.size)}` : 'Obrázek, PDF nebo jiný dokument.'}</small>
              </span>
            </div>
            <label>
              Název
              <input value={mediaForm.title} onChange={(event) => setMediaForm((current) => ({ ...current, title: event.target.value }))} required />
            </label>
            <label>
              Kategorie
              <select aria-label="Kategorie" value={mediaForm.category} onChange={(event) => setMediaForm((current) => ({ ...current, category: event.target.value }))} required>
                {mediaForm.category && !knownMediaCategories.has(mediaForm.category) && (
                  <option value={mediaForm.category}>Aktuální vlastní hodnota: {mediaForm.category}</option>
                )}
                {mediaCategoryGroups.map((group) => (
                  <optgroup key={group.label} label={group.label}>
                    {group.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </optgroup>
                ))}
              </select>
            </label>
            <label>
              Název souboru
              <input value={mediaForm.fileName} onChange={(event) => setMediaForm((current) => ({ ...current, fileName: event.target.value }))} />
            </label>
            <label>
              MIME typ
              <select aria-label="MIME typ" value={mediaForm.mimeType} onChange={(event) => setMediaForm((current) => ({ ...current, mimeType: event.target.value }))} required>
                {mediaForm.mimeType && !knownMediaMimeTypes.has(mediaForm.mimeType) && (
                  <option value={mediaForm.mimeType}>Aktuální vlastní hodnota: {mediaForm.mimeType}</option>
                )}
                {mediaMimeTypeGroups.map((group) => (
                  <optgroup key={group.label} label={group.label}>
                    {group.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </optgroup>
                ))}
              </select>
            </label>
            <label className="editor-full">
              URL souboru
              <input value={mediaForm.fileUrl} onChange={(event) => setMediaForm((current) => ({ ...current, fileUrl: event.target.value }))} placeholder="Doplňte URL nebo nahrajte soubor z počítače" required={!mediaUploadFile} />
            </label>
            <label>
              Velikost v bytech
              <input type="number" min="0" value={mediaForm.fileSize} onChange={(event) => setMediaForm((current) => ({ ...current, fileSize: Number(event.target.value) }))} />
            </label>
            <label>
              Vytvořeno
              <input value={mediaForm.createdAt} onChange={(event) => setMediaForm((current) => ({ ...current, createdAt: event.target.value }))} />
            </label>
            <label className="editor-full">
              Alt text / popis obrázku
              <textarea rows={4} value={mediaForm.altText} onChange={(event) => setMediaForm((current) => ({ ...current, altText: event.target.value }))} />
            </label>
          </div>
          {mediaForm.fileUrl && (
            <div className="media-dialog-preview">
              {mediaForm.mimeType.startsWith('image/') ? <img src={mediaFileUrl} alt={mediaForm.altText || ''} /> : <FileText size={42} />}
              <div>
                <span>ID: {mediaForm.id || 'nový záznam'}</span>
                <span>{readableBytes(mediaForm.fileSize)}</span>
                <a href={mediaFileUrl} target="_blank" rel="noreferrer">Otevřít soubor</a>
              </div>
            </div>
          )}
          <div className="editor-actions">
            <button className="button primary" type="submit">
              <Save size={18} /> Uložit médium
            </button>
            <button className="button secondary" type="button" onClick={onClose}>
              <X size={18} /> Zavřít
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (dialog.type === 'user') {
    return (
      <div className="editor-backdrop" role="presentation" onMouseDown={onClose}>
        <form className="admin-detail-dialog" role="dialog" aria-modal="true" aria-label="Detail uživatele" onSubmit={onSaveUser} onMouseDown={(event) => event.stopPropagation()}>
          <div className="editor-titlebar">
            <div>
              <p className="section-label">Uživatel a role</p>
              <h3>{managedUserForm.name}</h3>
            </div>
            <div className="editor-title-actions">{closeButton}</div>
          </div>
          <div className="detail-meta-grid">
            <div><span>ID</span><strong>{managedUserForm.id}</strong></div>
            <div><span>E-mail</span><strong>{managedUserForm.email}</strong></div>
            <div><span>Telefon</span><strong>{managedUserForm.phone || 'neuveden'}</strong></div>
            <div><span>Vytvořen</span><strong>{new Date(managedUserForm.createdAt).toLocaleString('cs-CZ')}</strong></div>
            <div><span>Poslední login</span><strong>{managedUserForm.lastLoginAt ? new Date(managedUserForm.lastLoginAt).toLocaleString('cs-CZ') : 'bez záznamu'}</strong></div>
            <div><span>Stav</span><strong>{managedUserForm.isActive ? 'aktivní' : 'deaktivovaný'}</strong></div>
          </div>
          <div className="editor-fields">
            <label>
              Role
              <select value={managedUserForm.role} onChange={(event) => setManagedUserForm((current) => ({ ...current, role: event.target.value as ApiRole }))}>
                {adminRoleOptions.map((role) => (
                  <option key={role} value={role}>{roleLabels[role]}</option>
                ))}
              </select>
            </label>
            <label className="checkbox-field">
              <input type="checkbox" checked={managedUserForm.isActive} onChange={(event) => setManagedUserForm((current) => ({ ...current, isActive: event.target.checked }))} />
              Aktivní účet
            </label>
          </div>
          <div className="editor-actions">
            <button className="button primary" type="submit">
              <Save size={18} /> Uložit roli
            </button>
            <button className="button secondary" type="button" onClick={() => onResetUserPassword(managedUserForm)}>
              <KeyRound size={18} /> Reset hesla
            </button>
            <button className="button danger" type="button" onClick={() => onDeleteUser(managedUserForm)}>
              <Trash2 size={18} /> Smazat účet
            </button>
            <button className="button secondary" type="button" onClick={onClose}>
              <X size={18} /> Zavřít
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (dialog.type === 'notification') {
    return (
      <div className="editor-backdrop" role="presentation" onMouseDown={onClose}>
        <form className="admin-detail-dialog" role="dialog" aria-modal="true" aria-label="Detail notifikace" onSubmit={onSaveNotification} onMouseDown={(event) => event.stopPropagation()}>
          <div className="editor-titlebar">
            <div>
              <p className="section-label">Notifikace</p>
              <h3>{notificationForm.id ? 'Upravit upozornění' : 'Nové upozornění'}</h3>
            </div>
            <div className="editor-title-actions">{closeButton}</div>
          </div>
          <div className="editor-fields">
            <label>
              Nadpis
              <input value={notificationForm.title} onChange={(event) => setNotificationForm((current) => ({ ...current, title: event.target.value }))} required />
            </label>
            <label>
              Kategorie
              <input value={notificationForm.category} onChange={(event) => setNotificationForm((current) => ({ ...current, category: event.target.value }))} />
            </label>
            <label>
              Typ hlášky
              <select value={notificationForm.tone} onChange={(event) => setNotificationForm((current) => ({ ...current, tone: event.target.value }))}>
                <option value="info">info</option>
                <option value="success">success</option>
                <option value="warning">warning</option>
                <option value="error">error</option>
              </select>
            </label>
            <label>
              Příjemce ID
              <input value={notificationForm.recipientId || ''} onChange={(event) => setNotificationForm((current) => ({ ...current, recipientId: event.target.value || null }))} />
            </label>
            <label className="editor-full">
              Text
              <textarea rows={5} value={notificationForm.body} onChange={(event) => setNotificationForm((current) => ({ ...current, body: event.target.value }))} required />
            </label>
            <label className="editor-full">
              Odkaz
              <input value={notificationForm.linkHref} onChange={(event) => setNotificationForm((current) => ({ ...current, linkHref: event.target.value }))} />
            </label>
          </div>
          <div className="detail-meta-grid">
            <div><span>ID</span><strong>{notificationForm.id || 'nový záznam'}</strong></div>
            <div><span>Vytvořeno</span><strong>{new Date(notificationForm.createdAt).toLocaleString('cs-CZ')}</strong></div>
            <div><span>Přečteno</span><strong>{notificationForm.readAt ? new Date(notificationForm.readAt).toLocaleString('cs-CZ') : 'ne'}</strong></div>
          </div>
          <div className="editor-actions">
            <button className="button primary" type="submit">
              <Save size={18} /> Uložit notifikaci
            </button>
            {notificationForm.id && !notificationForm.readAt && (
              <button className="button secondary" type="button" onClick={() => onMarkNotificationRead(notificationForm)}>
                <CheckCircle2 size={18} /> Označit přečtené
              </button>
            )}
            <button className="button secondary" type="button" onClick={onClose}>
              <X size={18} /> Zavřít
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="editor-backdrop" role="presentation" onMouseDown={onClose}>
      <form className="admin-detail-dialog" role="dialog" aria-modal="true" aria-label="Nastavení administrace" onSubmit={onSaveSettings} onMouseDown={(event) => event.stopPropagation()}>
        <div className="editor-titlebar">
          <div>
            <p className="section-label">Nastavení</p>
            <h3>{dialog.section === 'organization' ? 'Profil organizace' : 'Bezpečnost'}</h3>
          </div>
          <div className="editor-title-actions">{closeButton}</div>
        </div>
        {dialog.section === 'organization' ? (
          <div className="editor-fields">
            <label>
              Název organizace
              <input value={settingsDraft.organizationName} onChange={(event) => setSettingsDraft((current) => ({ ...current, organizationName: event.target.value }))} />
            </label>
            <label>
              Primární barva
              <input value={settingsDraft.primaryColor} onChange={(event) => setSettingsDraft((current) => ({ ...current, primaryColor: event.target.value }))} />
            </label>
            <label className="editor-full">
              SEO titulek
              <input value={settingsDraft.seoTitle} onChange={(event) => setSettingsDraft((current) => ({ ...current, seoTitle: event.target.value }))} />
            </label>
            <label className="editor-full">
              SEO popis
              <textarea rows={4} value={settingsDraft.seoDescription} onChange={(event) => setSettingsDraft((current) => ({ ...current, seoDescription: event.target.value }))} />
            </label>
            <label className="editor-full">
              Cookies režim
              <input value={settingsDraft.cookiesMode} onChange={(event) => setSettingsDraft((current) => ({ ...current, cookiesMode: event.target.value }))} />
            </label>
          </div>
        ) : (
          <div className="editor-fields">
            <label>
              Login
              <input value={settingsDraft.loginMode} onChange={(event) => setSettingsDraft((current) => ({ ...current, loginMode: event.target.value }))} />
            </label>
            <label>
              Role
              <input value={settingsDraft.rolesMode} onChange={(event) => setSettingsDraft((current) => ({ ...current, rolesMode: event.target.value }))} />
            </label>
            <label>
              Reset hesla
              <input value={settingsDraft.passwordResetMode} onChange={(event) => setSettingsDraft((current) => ({ ...current, passwordResetMode: event.target.value }))} />
            </label>
            <label>
              2FA
              <input value={settingsDraft.twoFactorMode} onChange={(event) => setSettingsDraft((current) => ({ ...current, twoFactorMode: event.target.value }))} />
            </label>
          </div>
        )}
        <div className="editor-actions">
          <button className="button primary" type="submit">
            <Save size={18} /> Uložit nastavení
          </button>
          <button className="button secondary" type="button" onClick={onClose}>
            <X size={18} /> Zavřít
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;

const rootElement = document.getElementById('root')!;
const appRoot =
  ((window as Window & { restartAppRoot?: ReturnType<typeof createRoot> }).restartAppRoot ??= createRoot(rootElement));

appRoot.render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>
);

