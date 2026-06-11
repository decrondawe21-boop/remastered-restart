import React from 'react';
import { createPortal } from 'react-dom';
import { createRoot } from 'react-dom/client';
import {
  ArrowRight,
  AlertCircle,
  Barcode,
  Bell,
  Bold,
  ChevronLeft,
  CheckCircle2,
  ClipboardList,
  Copy,
  Download,
  Heading1,
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
  List,
  LockKeyhole,
  LogOut,
  Mail,
  MessageCircle,
  Menu,
  Newspaper,
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
import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode';
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
import {
  getSession,
  addNewsComment,
  confirmPasswordReset,
  deleteNewsComment,
  deleteNews as deleteNewsRecord,
  listClients,
  listDocuments,
  listFormTemplates,
  listMedia,
  listNews,
  listNewsDiscussion,
  listNotifications,
  listPublicMedia,
  listSlides,
  listUsers,
  uploadMediaFile,
  loginUser,
  logoutUser,
  markNotificationRead as markNotificationReadRecord,
  registerClient as registerClientAccount,
  requestPasswordReset,
  saveClient as saveClientRecord,
  saveDocument as saveDocumentRecord,
  saveMedia as saveMediaRecord,
  saveNews as saveNewsRecord,
  saveNotification as saveNotificationRecord,
  saveSlide as saveSlideRecord,
  toggleNewsLike,
  updateNewsComment,
  updateUser as updateUserRecord,
  ApiRequestError,
  type ApiClientDocument,
  type ApiClientRecord,
  type ApiFormTemplate,
  type ApiManagedUser,
  type ApiMediaFile,
  type ApiNewsComment,
  type ApiNewsLike,
  type ApiHomeSlide,
  type ApiNotification,
  type ApiPasswordResetRequest,
  type ApiRole,
  type ApiUser
} from './api';
import './styles.css';

const navItems = [
  { href: '#/co-delame', label: 'Co děláme' },
  { href: '#/programy', label: 'Programy' },
  { href: '#/aktuality', label: 'Aktuality' },
  { href: '#/zapojeni', label: 'Zapojení' },
  { href: '#/povinne-zverejnovani', label: 'Transparentnost' },
  { href: '#/kontakt', label: 'Kontakt' },
  { href: '#/klient', label: 'Klientská zóna' }
];

const routeLabels: Record<string, string> = {
  '/': 'Domů',
  '/co-delame': 'Co děláme',
  '/programy': 'Programy',
  '/aktuality': 'Aktuality',
  '/zapojeni': 'Zapojení',
  '/kontakt': 'Kontakt',
  '/kontakt/formular': 'Formulář',
  '/klient': 'Klientský profil',
  '/admin': 'Administrace',
  '/pro-firmy': 'Pro firmy',
  '/media': 'Média',
  '/zasady-ochrany-osobnich-udaju': 'Zásady ochrany osobních údajů',
  '/povinne-zverejnovani': 'Povinné zveřejňování',
  '/webove-gdpr': 'Webové GDPR'
};

const footerNavGroups = [
  {
    title: 'Navigace',
    links: [
      { href: '#/', label: 'Domů' },
      { href: '#/co-delame', label: 'Co děláme' },
      { href: '#/programy', label: 'Programy' },
      { href: '#/aktuality', label: 'Aktuality' },
      { href: '#/zapojeni', label: 'Zapojení' },
      { href: '#/kontakt', label: 'Kontakt' }
    ]
  },
  {
    title: 'Projekt',
    links: [
      { href: '#/pro-firmy', label: 'Pro firmy' },
      { href: '#/media', label: 'Média' },
      { href: '#/povinne-zverejnovani', label: 'Povinné zveřejňování' },
      { href: '#/webove-gdpr', label: 'Webové GDPR' },
      { href: '#/zasady-ochrany-osobnich-udaju', label: 'Zásady ochrany osobních údajů' }
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
  if (path.startsWith('/programy/')) {
    const program = getProgramBySlug(path.replace('/programy/', ''));
    return program?.title ?? 'Program';
  }
  return 'Domů';
};

const normalizePath = (value: string) => {
  const path = value.replace(/^#/, '') || '/';
  if (routeLabels[path]) return path;
  if (path.startsWith('/programy/') && getProgramBySlug(path.replace('/programy/', ''))) return path;
  return '/';
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
  status: string;
  notes: string;
  operationalId: string;
  createdAt: string;
};

type NewsItem = {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  body?: string;
};

type NewsDiscussion = {
  likes: Record<string, ApiNewsLike>;
  comments: ApiNewsComment[];
};

type HomeSlide = ApiHomeSlide;

type FormDraft = Record<string, string>;

type FormTemplate = {
  id: string;
  title: string;
  description: string;
  fields: Array<{ key: string; label: string; rows?: number }>;
  fileUrl?: string;
  folder?: string;
  sourceNote?: string;
  sizeBytes?: number;
  isActive?: boolean;
};

type ManagedUser = ApiManagedUser;
type MediaFile = ApiMediaFile;
type ClientDocument = ApiClientDocument;
type NotificationItem = ApiNotification;
const TRANSPARENCY_DOCUMENT_CATEGORY = 'transparency';
const seededTransparentDocuments: MediaFile[] = [
  {
    id: 'fallback-opz-051',
    title: 'REST||ART Podklad ke konzultaci OPZ 051',
    fileName: 'REST_ART_PODKLAD_KONZULTACE_OPZ_051_v1.pdf',
    fileUrl: '/documents/transparency/REST_ART_PODKLAD_KONZULTACE_OPZ_051_v1.pdf',
    mimeType: 'application/pdf',
    fileSize: 111226,
    category: TRANSPARENCY_DOCUMENT_CATEGORY,
    altText: '',
    uploadedBy: null,
    createdAt: '2026-06-10'
  },
  {
    id: 'fallback-kpz-politiky-ktere-funguji',
    title: 'REST||ART KPZ - Politiky, které fungují',
    fileName: 'REST_ART_KPZ_POLITIKY_KTERE_FUNGUJI_v1.pdf',
    fileUrl: '/documents/transparency/REST_ART_KPZ_POLITIKY_KTERE_FUNGUJI_v1.pdf',
    mimeType: 'application/pdf',
    fileSize: 175390,
    category: TRANSPARENCY_DOCUMENT_CATEGORY,
    altText: '',
    uploadedBy: null,
    createdAt: '2026-06-11'
  },
  {
    id: 'fallback-opz-051-59',
    title: 'REST||ART Podklad ke konzultaci OPZ 051/59',
    fileName: 'REST_ART_PODKLAD_KONZULTACE_OPZ_051_59_v1.pdf',
    fileUrl: '/documents/transparency/REST_ART_PODKLAD_KONZULTACE_OPZ_051_59_v1.pdf',
    mimeType: 'application/pdf',
    fileSize: 409589,
    category: TRANSPARENCY_DOCUMENT_CATEGORY,
    altText: '',
    uploadedBy: null,
    createdAt: '2026-06-11'
  }
];

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
  | 'users'
  | 'notifications'
  | 'settings';

type ClientSection =
  | 'dashboard'
  | 'profile'
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

const newsHtmlTags = new Set(['A', 'B', 'BLOCKQUOTE', 'BR', 'EM', 'H2', 'H3', 'H4', 'I', 'IFRAME', 'IMG', 'LI', 'OL', 'P', 'STRONG', 'U', 'UL']);
const newsHtmlAttrs = new Map([
  ['A', new Set(['href', 'target', 'rel', 'title'])],
  ['IMG', new Set(['src', 'alt', 'title', 'loading'])],
  ['IFRAME', new Set(['src', 'title', 'allow', 'allowfullscreen', 'loading'])]
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

function cleanNewsHtml(value = '') {
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
        if (!allowedAttrs.has(attrName) || !isSafeNewsUrl(tagName, attrName, attribute.value)) {
          element.removeAttribute(attribute.name);
        }
      }

      if (tagName === 'A') {
        element.setAttribute('rel', 'noopener noreferrer');
      }
      if (tagName === 'IMG' || tagName === 'IFRAME') {
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
  title: template.title,
  description: template.description,
  fields: template.fields,
  fileUrl: template.fileUrl,
  folder: template.folder,
  sourceNote: template.sourceNote,
  sizeBytes: template.sizeBytes,
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

const resolvePublicFileUrl = (value?: string, template?: Pick<FormTemplate, 'title' | 'folder' | 'sourceNote'>) => {
  const trimmed = value?.trim() || '';
  if (!trimmed) return '';
  if (/^(https?:|data:|blob:)/i.test(trimmed)) return trimmed;
  if (trimmed.startsWith('/documents/') || trimmed.startsWith('/images/')) return trimmed;

  const fileName = fileNameFromPath(trimmed) || fileNameFromPath(template?.sourceNote);
  if (!fileName || !/\.pdf$/i.test(fileName)) return trimmed;

  const folder = publicFormFolder(template, fileName);
  return folder ? `/documents/forms/${folder}/${fileName}` : trimmed;
};

const formSensitivity = (template: FormTemplate) => {
  const source = `${template.folder || ''} ${template.sourceNote || ''}`.toLowerCase();
  if (source.includes('gdpr')) return 'GDPR';
  if (source.includes('citliv')) return 'Citlivé';
  if (source.includes('klient')) return 'Klientské';
  return 'Standard';
};

const starterAccounts: AuthAccount[] = [
  {
    id: 'admin-seed',
    role: 'admin',
    name: 'Administrátor REST||ART',
    email: 'admin@restart.local',
    phone: '',
    password: 'restart2026',
    createdAt: '2026-06-03'
  }
];

const starterSlides: HomeSlide[] = [
  {
    id: 'pillar-jailbreak',
    title: 'JAILBREAK',
    subtitle: 'Výkon trestu odnětí svobody a návrat ven: svoboda potřebuje strukturu, práci a konkrétní plán.',
    imageUrl: '/images/program-pillars/jailbreak-skica.png',
    ctaLabel: 'O programu',
    ctaHref: '#/programy/jailbreak',
    sortOrder: 10,
    isActive: true
  },
  {
    id: 'pillar-reset',
    title: 'RESET',
    subtitle: 'Závislosti, krize a ztracený režim: důstojný restart přes terapii, komunitu a bezpečný každodenní rytmus.',
    imageUrl: '/images/program-pillars/reset-skica.png',
    ctaLabel: 'O programu',
    ctaHref: '#/programy/reset',
    sortOrder: 20,
    isActive: true
  },
  {
    id: 'pillar-rework',
    title: 'REWORK',
    subtitle: 'Dlouhodobě nezaměstnaní a lidé s bariérami: pracovní restart, rekvalifikace a férový návrat do praxe.',
    imageUrl: '/images/program-pillars/rework-skica.png',
    ctaLabel: 'O programu',
    ctaHref: '#/programy/rework',
    sortOrder: 30,
    isActive: true
  },
  {
    id: 'pillar-streetwise',
    title: 'STREETWISE',
    subtitle: 'Lidé bez domova a mimo dosah systému: nízkoprahové zázemí, terén a první bezpečný krok.',
    imageUrl: '/images/program-pillars/streetwise-skica.png',
    ctaLabel: 'O programu',
    ctaHref: '#/programy/streetwise',
    sortOrder: 40,
    isActive: true
  },
  {
    id: 'pillar-bod-zlomu',
    title: 'BOD ZLOMU',
    subtitle: 'Děti z dětských domovů a mladí lidé po ústavní péči: přechod do samostatnosti, vztahů a vlastního směru.',
    imageUrl: '/images/program-pillars/bod-zlomu-skica.png',
    ctaLabel: 'O programu',
    ctaHref: '#/programy/bod-zlomu',
    sortOrder: 50,
    isActive: true
  },
  {
    id: 'pillar-stabilizace',
    title: 'STABILIZACE',
    subtitle: 'Konečný podpůrný program: udržet změnu v bydlení, práci, režimu, komunitě a běžném životě.',
    imageUrl: '/images/program-pillars/stabilizace-skica.png',
    ctaLabel: 'O programu',
    ctaHref: '#/programy/stabilizace',
    sortOrder: 60,
    isActive: true
  }
];

const starterSlideIds = new Set(starterSlides.map((slide) => slide.id));
const designedTextSlidePattern = /^\/images\/\d{2}\.png$/i;
const sketchPillarSlidePattern =
  /^\/images\/program-pillars\/(?:jailbreak|reset|rework|streetwise|bod-zlomu|stabilizace)-skica\.png$/i;

const practicePhotoSlides = [
  {
    id: 'practice-rose-arch',
    title: 'Klenba, která vyrostla',
    text: 'Z malých sazenic vznikl průchod. Stejně stavíme zázemí: trpělivě, rukama a krok za krokem.',
    imageUrl: '/images/crops/roses-20260608/ruze-klenba.jpg'
  },
  {
    id: 'practice-roses',
    title: 'Trpělivost, která roste',
    text: 'Růže, práce a čas připomínají, že změna nevzniká naráz.',
    imageUrl: '/images/crops/roses-20260608/ruze-detail.jpg'
  },
  {
    id: 'practice-gate',
    title: 'První průchod',
    text: 'Místo, kde se z prvního kontaktu může stát další bezpečný krok.',
    imageUrl: '/images/crops/streetwise/streetwise-cesta-branka.jpg'
  },
  {
    id: 'practice-workbench',
    title: 'Zázemí z nalezeného',
    text: 'Z věcí, které měly skončit, vzniká praktický prostor pro STREETWISE.',
    imageUrl: '/images/crops/new-photos/foto-175346-mid.jpg'
  },
  {
    id: 'practice-shelter',
    title: 'Bouda v procesu',
    text: 'Materiál, ruce a čas. Malé kroky, které dávají prostoru smysl.',
    imageUrl: '/images/crops/streetwise/streetwise-bouda-stavba.jpg'
  },
  {
    id: 'practice-flowers',
    title: 'Zázemí z detailů',
    text: 'I malá úprava prostoru mění pocit z prvního setkání.',
    imageUrl: '/images/crops/roses-20260608/kvetiny-zazemi.jpg'
  },
  {
    id: 'practice-path',
    title: 'Cesta k bezpečí',
    text: 'Každý stabilní bod začíná konkrétním místem, kam se dá přijít.',
    imageUrl: '/images/crops/roses-20260608/ruze-pruchod.jpg'
  },
  {
    id: 'practice-green',
    title: 'Živé místo',
    text: 'Zázemí nemá působit jako instituce. Má být čitelné, lidské a použitelné.',
    imageUrl: '/images/crops/roses-20260608/ruze-svetlo.jpg'
  }
];

const hasProgramPillarDeck = (slides: HomeSlide[]) =>
  slides.filter((slide) => slide.isActive && starterSlideIds.has(slide.id)).length === starterSlides.length;

const shouldUseProgramPillarDeck = (slides: HomeSlide[]) => {
  const activeSlides = slides.filter((slide) => slide.isActive);
  if (activeSlides.length < starterSlides.length) return true;
  return activeSlides.some((slide) => slide.id.startsWith('slide-')) && !hasProgramPillarDeck(slides);
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
  status: 'Nový kontakt',
  notes: '',
  operationalId: '',
  createdAt: ''
};

const fallbackFormTemplates: FormTemplate[] = [
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
  }
];

const todayIso = () => new Date().toISOString().slice(0, 10);

const stripDiacritics = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const initialsFromName = (firstName: string, lastName: string) => {
  const first = stripDiacritics(firstName.trim()).replace(/[^a-zA-Z]/g, '');
  const last = stripDiacritics(lastName.trim()).replace(/[^a-zA-Z]/g, '');
  const initials = `${first[0] ?? ''}${last[0] ?? ''}`.toUpperCase();
  return initials.padEnd(2, 'X').slice(0, Math.max(2, initials.length));
};

const dateToCompactId = (isoDate: string) => {
  const date = isoDate ? new Date(`${isoDate}T00:00:00`) : new Date();
  if (Number.isNaN(date.getTime())) return dateToCompactId(todayIso());
  return `${String(date.getDate()).padStart(2, '0')}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getFullYear()).slice(-2)}`;
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
  const [path, setPath] = React.useState(() => normalizePath(window.location.hash));

  React.useEffect(() => {
    const onHashChange = () => {
      setPath(normalizePath(window.location.hash));
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return path;
}

function PageSearch({ onNotify, onDone }: { onNotify: NotifyFn; onDone?: () => void }) {
  const [query, setQuery] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const searchInputId = React.useId();

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const value = query.trim();
    if (!value) {
      inputRef.current?.focus();
      onNotify('warning', 'Vyhledávání je prázdné', 'Zadejte text, který chcete najít na aktuální stránce.');
      return;
    }

    const browserFind = (window as Window & { find?: (text: string, caseSensitive?: boolean, backwards?: boolean, wrapAround?: boolean) => boolean }).find;
    const found = browserFind ? browserFind(value, false, false, true) : document.body.innerText.toLowerCase().includes(value.toLowerCase());
    if (found) {
      onNotify('success', 'Text nalezen', `Prohlížeč zvýraznil výskyt: ${value}`);
      onDone?.();
      return;
    }
    onNotify('warning', 'Text nenalezen', `Na této stránce se nenašlo: ${value}`);
  };

  return (
    <form className="site-search" role="search" onSubmit={submitSearch}>
      <label className="visually-hidden" htmlFor={searchInputId}>Vyhledat text na stránce</label>
      <Search size={16} aria-hidden="true" />
      <input
        id={searchInputId}
        ref={inputRef}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Vyhledat text na stránce"
      />
      <button className="tooltip-link" type="submit" aria-label="Vyhledat text" data-tooltip="Vyhledat">
        <ArrowRight size={16} />
      </button>
    </form>
  );
}

function Header({ currentPath, account, onNotify }: { currentPath: string; account: AuthAccount | null; onNotify: NotifyFn }) {
  const [open, setOpen] = React.useState(false);
  const visibleNavItems = navItems.filter((item) => item.href !== '#/klient' || account?.role === 'client' || account?.role === 'admin');

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#/" aria-label="REST ART Integrace domů">
        <img src="/images/sponsor-logo.png" alt="" />
        </a>
        <button className="menu-button" type="button" aria-label="Otevřít menu" onClick={() => setOpen(true)}>
          <Menu size={22} />
        </button>
        <div className="header-nav-stack">
          <div className="header-tools">
            <PageSearch onNotify={onNotify} />
            <div className="auth-actions" aria-label="Přístup k účtu">
              <a
                className="signin-icon tooltip-link"
                href={account?.role === 'client' ? '#/klient' : '#/admin'}
                aria-label={account?.role === 'client' ? 'Profil' : account?.role === 'admin' ? 'Admin' : 'Sign in'}
                data-tooltip={account?.role === 'client' ? 'Profil' : account?.role === 'admin' ? 'Admin' : 'Sign in'}
              >
                <UserRound size={19} />
              </a>
              {!account && (
                <a className="signup-link" href="#/klient" aria-label="Sign up">
                  Sign up
                </a>
              )}
            </div>
          </div>
          <nav className="desktop-nav" aria-label="Hlavní navigace">
            {visibleNavItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={
                  currentPath === item.href.slice(1) ||
                  (item.href === '#/programy' && currentPath.startsWith('/programy/'))
                    ? 'active'
                    : ''
                }
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
        <a className="header-cta" href="#/kontakt">
          Napište nám
        </a>
      </header>
      {open && (
        <div className="mobile-panel" role="dialog" aria-modal="true" aria-label="Mobilní menu">
          <button className="close-button" type="button" aria-label="Zavřít menu" onClick={() => setOpen(false)}>
            <X size={22} />
          </button>
          <PageSearch onNotify={onNotify} onDone={() => setOpen(false)} />
          {visibleNavItems.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
          <div className="mobile-auth-actions">
            <a href={account?.role === 'client' ? '#/klient' : '#/admin'} onClick={() => setOpen(false)}>
              <UserRound size={18} /> {account?.role === 'client' ? 'Profil' : account?.role === 'admin' ? 'Admin' : 'Sign in'}
            </a>
            {!account && (
              <a href="#/klient" onClick={() => setOpen(false)}>
                Sign up
              </a>
            )}
          </div>
          <a className="mobile-cta" href="#/kontakt" onClick={() => setOpen(false)}>
            Napište nám
          </a>
        </div>
      )}
    </>
  );
}

function Breadcrumb({ path }: { path: string }) {
  const programDetail = path.startsWith('/programy/') ? getProgramBySlug(path.replace('/programy/', '')) : null;
  const crumbs =
    programDetail
      ? [
          { label: 'Domů', href: '#/' },
          { label: 'Programy', href: '#/programy' },
          { label: programDetail.title }
        ]
      : path === '/kontakt'
      ? [
          { label: 'Domů', href: '#/' },
          { label: 'Kontakt', href: '#/kontakt' },
          { label: 'Formulář' }
        ]
      : path === '/klient'
        ? [
            { label: 'Domů', href: '#/' },
            { label: 'Klientský profil' }
          ]
      : path === '/admin'
        ? [
            { label: 'Domů', href: '#/' },
            { label: 'Administrace' }
          ]
        : path === '/'
          ? [{ label: 'Domů' }]
          : [
              { label: 'Domů', href: '#/' },
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
              <a className="program-link" href={`#/programy/${programSlug(program.title)}`}>
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
            <a key={program.title} className="program-pillar-card" href={`#/programy/${programSlug(program.title)}`}>
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
  discussion,
  account,
  onToggleLike,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
  onNotify
}: {
  news: NewsItem[];
  discussion: NewsDiscussion;
  account: AuthAccount | null;
  onToggleLike: (newsId: string) => Promise<void>;
  onAddComment: (newsId: string, text: string, parentId?: string | null) => Promise<boolean>;
  onUpdateComment: (commentId: string, text: string) => Promise<boolean>;
  onDeleteComment: (commentId: string) => Promise<void>;
  onNotify: (tone: FeedbackTone, title: string, text?: string) => void;
}) {
  return (
    <div className="news-grid">
      {news.map((item) => (
        <article key={item.id} className="news-card">
          <time dateTime={item.date}>{new Date(item.date).toLocaleDateString('cs-CZ')}</time>
          <h3>{item.title}</h3>
          <p>{item.excerpt}</p>
          {item.body && <div className="news-body" dangerouslySetInnerHTML={{ __html: cleanNewsHtml(item.body) }} />}
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
        </article>
      ))}
    </div>
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
              <>
                <button
                  className="mini-action ghost"
                  type="button"
                  onClick={() => {
                    setEditingId(comment.id);
                    setEditDraft(comment.body);
                  }}
                >
                  Upravit
                </button>
                <button className="mini-action danger" type="button" onClick={() => onDeleteComment(comment.id)}>
                  <Trash2 size={15} /> Smazat
                </button>
              </>
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
              Pro komentování nebo lajkování se prosím <a href="#/klient">přihlaste do klientské zóny</a>.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function HomeSlideshow({ slides }: { slides: HomeSlide[] }) {
  const visibleSlides = slides.filter((slide) => slide.isActive).sort((left, right) => left.sortOrder - right.sortOrder);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const manualPauseUntil = React.useRef(0);
  const swipeStartX = React.useRef<number | null>(null);
  const activeSlide = visibleSlides[activeIndex] ?? visibleSlides[0] ?? starterSlides[0];
  const activeSlideHasDesignedText =
    designedTextSlidePattern.test(activeSlide.imageUrl) || sketchPillarSlidePattern.test(activeSlide.imageUrl);
  const slideCount = visibleSlides.length;
  const wrapIndex = (index: number) => {
    if (!slideCount) return 0;
    return (index + slideCount) % slideCount;
  };
  const markManualInteraction = () => {
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
    if (visibleSlides.length < 2) return;
    const timer = window.setInterval(() => {
      if (Date.now() < manualPauseUntil.current) return;
      setActiveIndex((current) => (current + 1) % visibleSlides.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [visibleSlides.length]);

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
        className={`hero-banner${activeSlideHasDesignedText ? ' designed-slide' : ''}`}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          swipeStartX.current = null;
        }}
      >
        {activeSlideHasDesignedText && <img className="hero-banner-bg" src={activeSlide.imageUrl} alt="" aria-hidden="true" />}
        <img className="hero-banner-main" src={activeSlide.imageUrl} alt="" />
        <div className={`hero-banner-overlay${activeSlideHasDesignedText ? ' visually-hidden' : ''}`} aria-live="polite">
          <p className="quiet-label">Projekt druhých šancí</p>
          <h1>{activeSlide.title}</h1>
          <p className="hero-text">{activeSlide.subtitle}</p>
          <div className="hero-actions">
            {activeSlide.ctaLabel && activeSlide.ctaHref && (
              <a className="button inverse" href={activeSlide.ctaHref}>
                {activeSlide.ctaLabel} <ArrowRight size={18} />
              </a>
            )}
            <a className="button inverse ghost" href="#/programy">
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

function PracticePhotoSlideshow() {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const manualPauseUntil = React.useRef(0);
  const slideCount = practicePhotoSlides.length;
  const activeSlide = practicePhotoSlides[activeIndex] ?? practicePhotoSlides[0];
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

  return (
    <section className="practice-gallery" aria-label="Fotky z praxe">
      <div className="practice-gallery-copy">
        <p className="section-label">ZÁZEMÍ V OBRAZECH</p>
        <h2>Reálné místo, reálná práce.</h2>
        <p>
          Skici ukazují směr projektu. Fotky drží stopu toho, jak zázemí opravdu vzniká: z materiálu, který se
          podaří zachránit, a z práce, která je vidět až krok za krokem.
        </p>
      </div>
      <div className="practice-gallery-stage">
        <figure className="practice-photo-frame">
          <img src={activeSlide.imageUrl} alt="" />
          <figcaption>
            <span>{activeIndex + 1} / {slideCount}</span>
            <strong>{activeSlide.title}</strong>
            <p>{activeSlide.text}</p>
          </figcaption>
        </figure>
        <div className="practice-gallery-controls">
          <button type="button" aria-label="Předchozí fotka" title="Předchozí fotka" onClick={() => goPrev(true)}>
            <ChevronLeft size={22} />
          </button>
          <div className="slide-dots compact" aria-label="Výběr fotky">
            {practicePhotoSlides.map((slide, index) => (
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

function HomePage({
  news,
  slides,
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
  discussion: NewsDiscussion;
  account: AuthAccount | null;
  onToggleLike: (newsId: string) => Promise<void>;
  onAddComment: (newsId: string, text: string, parentId?: string | null) => Promise<boolean>;
  onUpdateComment: (commentId: string, text: string) => Promise<boolean>;
  onDeleteComment: (commentId: string) => Promise<void>;
  onNotify: (tone: FeedbackTone, title: string, text?: string) => void;
}) {
  return (
    <>
      <HomeSlideshow slides={slides} />
      <PracticePhotoSlideshow />

      <section className="streetwise-feature" aria-label="STREETWISE zázemí">
        <article className="streetwise-card streetwise-card-main">
          <p className="section-label">STREETWISE</p>
          <h2>Z věcí, které měly skončit, stavíme nové zázemí.</h2>
          <p>
            REST||ART Integrace vzniká stejně jako naše bouda: z nalezeného materiálu, práce, trpělivosti a víry, že
            i to, co bylo odepsané, může znovu sloužit.
          </p>
          <a className="button primary" href="#/programy/streetwise">
            STREETWISE <ArrowRight size={18} />
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
          <img src="/images/crops/streetwise/streetwise-bouda-stavba.jpg" alt="" />
          <figcaption>Reálná stavba z nalezeného materiálu</figcaption>
        </figure>
      </section>

      <section className="stats-band" aria-label="Základní čísla">
        {stats.map((item) => (
          <div key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </section>

      <section className="green-band">
        <div>
          <p>Začít znovu není selhání, je to síla.</p>
          <span>Mentoring, práce, bydlení a stabilizace v jednom srozumitelném systému podpory.</span>
        </div>
        <a className="button inverse" href="#/co-delame">
          Jak pracujeme
        </a>
      </section>

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

      <section className="content-section compact-section">
        <SectionIntro
          label="Ekonomika druhé šance"
          title="Dát člověku cestu zpět je levnější než čekat na další pád."
          text="Nejde o hezkou frázi. Jde o praktický rozdíl mezi pasivním nákladem systému a aktivní reintegrací."
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
      </section>

      <section className="solution-section">
        <SectionIntro
          label="Řešení"
          title="Není to klasická nezisková organizace. Je to systém návratu."
          text="REST||ART Integrace propojuje sociální práci, mentoring, firmy, obce, dokumenty, formuláře a každodenní praxi do jedné srozumitelné cesty."
        />
        <div className="principle-grid">
          {solutionPrinciples.map((item) => (
            <article key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section compact-section">
        <SectionIntro
          label="Dopad"
          title="Měřitelná změna, která má lidský i ekonomický smysl."
          text="Druhá šance je pro nás konkrétní výsledek: méně návratů do krize, více práce, bezpečnější bydlení a opora, která člověka nenechá zmizet."
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
      </section>

      <section className="split-section partner-message">
        <div>
          <p className="section-label">Pro partnery</p>
          <h2>Spolupráce s námi není charita. Je to investice do návratu lidí i stability okolí.</h2>
        </div>
        <div className="text-column">
          <p>
            Hledáme partnery, kteří chtějí být součástí praktické změny: zaměstnavatele, obce, instituce, odborníky i
            lidi, kteří rozumí tomu, že druhá šance musí mít konkrétní kroky.
          </p>
          <p>
            Podpora projektu pomáhá pokrýt mentoring, první materiály, dopravu, dokumenty, pracovní přípravu a zázemí,
            kde může člověk začít znovu.
          </p>
          <div className="inline-actions">
            <a className="button primary" href="#/zapojeni">
              Chci být partner <ArrowRight size={18} />
            </a>
            <a className="button secondary" href="#/darujte">
              Podpořit projekt
            </a>
          </div>
        </div>
      </section>

      <section className="content-section">
        <SectionIntro
          label="Rozcestník"
          title="Vyberte oblast, kterou potřebujete řešit"
          text="Druhá šance má několik vstupních cest. Každá vede k praktické pomoci a konkrétnímu dalšímu kroku."
        />
        <div className="home-link-grid">
          {[
            { href: '#/co-delame', title: 'Co děláme', text: 'Mentoring, práce, bydlení a stabilizace.' },
            { href: '#/programy', title: 'Programy', text: 'JAILBREAK, RESET, REWORK, STREETWISE, BOD ZLOMU a STABILIZACE.' },
            { href: '#/aktuality', title: 'Aktuality', text: 'Krátké zprávy a veřejné novinky projektu.' },
            { href: '#/kontakt', title: 'Kontakt', text: 'Rychlý kontakt, e-mail, telefon a formulář.' }
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
          <a className="back-link" href="#/programy">
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
            <a className="button primary" href="#/kontakt">
              Napište nám <ArrowRight size={18} />
            </a>
            <a className="button secondary" href="#/zapojeni">
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

function NewsPage({
  news,
  discussion,
  account,
  onToggleLike,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
  onNotify
}: {
  news: NewsItem[];
  discussion: NewsDiscussion;
  account: AuthAccount | null;
  onToggleLike: (newsId: string) => Promise<void>;
  onAddComment: (newsId: string, text: string, parentId?: string | null) => Promise<boolean>;
  onUpdateComment: (commentId: string, text: string) => Promise<boolean>;
  onDeleteComment: (commentId: string) => Promise<void>;
  onNotify: (tone: FeedbackTone, title: string, text?: string) => void;
}) {
  return (
    <>
      <PageHeader
        label="Aktuality"
        title="Co se v projektu děje"
        text="Krátké zprávy z příprav, programu a spolupráce. Aktuality se dají doplňovat přímo v administraci."
      />
      <section className="content-section">
        <NewsGrid
          news={news}
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

function SupportPage() {
  return (
    <>
      <PageHeader
        label="Zapojení"
        title="Spolupráce, která má konkrétní podobu"
        text="Hledáme lidi, firmy, instituce a organizace, které chtějí pomoci vytvořit reálnou cestu zpět do života."
      />
      <section className="muted-section">
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
      <section className="donate-section">
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
            <a className="button secondary" href="#/kontakt">
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

function TransparencyDocumentsPage({ documents }: { documents: MediaFile[] }) {
  const sorted = documents.slice().sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());

  return (
    <section className="content-section static-info-page">
      <div className="static-info-head">
        <p className="section-label">Transparentnost</p>
        <h1>Povinné zveřejňování</h1>
        <p>Zveřejňujeme dokumenty pro transparentnost projektových aktivit, financování a veřejných podkladů.</p>
      </div>
      <div className="client-document-list">
        {sorted.length === 0 ? (
          <p className="empty-note">Zatím nejsou žádné zveřejněné transparentní dokumenty. Přidejte je prosím v administraci v sekci Média.</p>
        ) : (
          sorted.map((document) => {
            const publicUrl = resolvePublicFileUrl(document.fileUrl);
            return (
              <article key={document.id}>
                <div>
                  <strong>{document.title || document.fileName}</strong>
                  <span>{document.fileName}</span>
                  <small>
                    {new Date(document.createdAt).toLocaleDateString('cs-CZ')} · {readableBytes(document.fileSize)} · {document.mimeType || 'soubor'}
                  </small>
                </div>
                <a className="button secondary" href={publicUrl} target="_blank" rel="noreferrer">
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

function ContactPage({ onNotify }: { onNotify: (tone: FeedbackTone, title: string, text?: string) => void }) {
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
        </div>
        <form className="contact-form" id="kontakt-formular" onSubmit={prepareMessage}>
          <h2>Kontaktní formulář</h2>
          <label>
            Jméno
            <input name="name" />
          </label>
          <label>
            E-mail nebo telefon
            <input name="contact" />
          </label>
          <label>
            Zpráva
            <textarea name="message" rows={6} />
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
  { left: '58%', size: 8, color: '#fff0a4', accent: '#b8933a', glow: 'rgba(255, 234, 132, 0.38)', opacity: 0.18, duration: '18s', delay: '-6s', drift: '-82px', rotate: '-54deg' }
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

function CookieConsent({ forceOpen = false, onClose }: { forceOpen?: boolean; onClose?: () => void }) {
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
  }, [preferences, forceOpen]);

  if (!shouldShowBanner && !shouldShowManager) return null;

  const closeManager = () => {
    setManageOpen(false);
    onClose?.();
  };

  const savePreferences = (nextStatistics = statistics, nextMarketing = marketing) => {
    setPreferences({
      necessary: true,
      statistics: nextStatistics,
      marketing: nextMarketing,
      decidedAt: new Date().toISOString(),
      version: '2026-06'
    });
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
    <section className="cookie-consent reveal-fx" aria-labelledby="cookie-consent-title">
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
        <button className="icon-action" type="button" aria-label="Notifikace">
          <Bell size={18} />
          <span>2</span>
        </button>
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
  const [email, setEmail] = React.useState(role === 'admin' ? 'admin@restart.local' : '');
  const [password, setPassword] = React.useState(role === 'admin' ? 'restart2026' : '');
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [messageTone, setMessageTone] = React.useState<FeedbackTone>('info');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [loginConsent, setLoginConsent] = React.useState(false);
  const [registrationConsent, setRegistrationConsent] = React.useState(false);
  const [resetToken, setResetToken] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setMessage('');
    const labels: Record<AuthMode, string> = {
      login: 'Přihlášení',
      register: 'Registrace klienta',
      reset: 'Obnova hesla',
      'reset-confirm': 'Nové heslo'
    };
    onNotify('info', 'Režim změněn', labels[nextMode]);
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
          setMessage(
            role === 'client'
              ? 'Přihlášení se nepodařilo. Zkontrolujte e-mail, heslo a zda nejste v klientské zóně s admin účtem.'
              : 'Přihlášení se nepodařilo. Zkontrolujte e-mail, heslo a oprávnění administrace.'
          );
          onNotify(
            'error',
            'Přihlášení se nepodařilo',
            role === 'client' ? 'Pro admin účet použijte vstup do administrace.' : 'Účet nemá odpovídající administrátorský přístup.'
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
    setMessage('Zakládám klientský profil...');
    if (onRegisterRequest) {
      try {
        const apiAccount = await onRegisterRequest({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          password
        });
        if (apiAccount) {
          onNotify('success', 'Registrace je hotová', 'Klientský profil byl vytvořen a uživatel je přihlášen.');
          onLogin(apiAccount);
          return;
        }
      } catch (error) {
        setMessageTone('warning');
        setMessage(error instanceof Error ? error.message : 'Registrace se nepodařila. Zkuste to prosím znovu.');
        onNotify('warning', 'Registrace se nepodařila', 'Zkontrolujte údaje a zkuste formulář odeslat znovu.');
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
      role: 'client',
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password,
      createdAt: todayIso()
    };
    onRegister(account);
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
                  ? 'Registrace klienta'
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
                Registrace klienta
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
  onNotificationReadRequest,
  onPasswordResetRequest,
  onLogout,
  onNotify
}: {
  account: AuthAccount;
  clientDocuments: ClientDocument[];
  notifications: NotificationItem[];
  onNotificationReadRequest?: (notificationId: string) => Promise<void>;
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
  const [passwordResetMessage, setPasswordResetMessage] = React.useState('');
  const [isRequestingPasswordReset, setIsRequestingPasswordReset] = React.useState(false);
  const [previousAvatarDraft, setPreviousAvatarDraft] = React.useState<Pick<
    ClientProfileDraft,
    'source' | 'avatar' | 'zoom' | 'offsetX' | 'offsetY' | 'rotation' | 'filter'
  > | null>(null);
  const displayName = profile.name.trim() || account.name;
  const displayPhone = profile.phone.trim() || account.phone;
  const isAdminProfile = account.role === 'admin';
  const workspaceBadge = isAdminProfile ? 'Admin profil' : 'Klientská zóna';
  const workspaceTitle = isAdminProfile ? 'Profil administrátora' : 'Přihlášený klient';
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
  const clientWorkflow = [
    {
      title: 'Profil',
      text: profileCompletion >= 80 ? 'Profil je pro pracovníka dobře čitelný.' : 'Doplňte telefon, poznámku nebo profilovou fotku.',
      tone: profileCompletion >= 80 ? 'success' : 'warning'
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

  const saveAccountSettings = () => {
    onNotify('success', 'Nastavení účtu uloženo', 'Předvolby soukromí a upozornění jsou uložené v profilu.');
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

  const currentClientNav = clientNavItems.find((item) => item.id === activeSection) ?? clientNavItems[0];
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
        <WorkspaceSidebar title="Uživatelské menu" items={clientNavItems} active={activeSection} onSelect={setActiveSection} />
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
                  <strong><Badge tone="warning">Čeká na ověření</Badge></strong>
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
                    <button key={notification.id} type="button" className={notification.readAt ? 'read' : ''} onClick={() => markClientNotificationRead(notification)}>
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
                  <button type="button" onClick={() => setActiveSection('avatar')}>Změnit avatar</button>
                  <button type="button" onClick={() => setActiveSection('documents')}>Moje dokumenty</button>
                  <button type="button" onClick={requestClientDocument}>Požádat o formulář</button>
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
                  {visibleNotifications.length === 0 && (
                    <div className="empty-action-state">
                      <p className="empty-note">Zatím nemáte žádné notifikace. Pokud čekáte na dokument nebo potvrzení, můžete pracovníkovi poslat krátkou žádost.</p>
                      <button className="button primary" type="button" onClick={requestClientDocument}>
                        <Mail size={18} /> Poslat žádost
                      </button>
                    </div>
                  )}
                  {visibleNotifications.map((notification) => (
                    <button key={notification.id} type="button" className={notification.readAt ? 'read' : ''} onClick={() => markClientNotificationRead(notification)}>
                      <Badge tone={(notification.tone as FeedbackTone) || 'info'}>{notification.category}</Badge>
                      <strong>{notification.title}</strong>
                      <span>{notification.body}</span>
                      <small>{new Date(notification.createdAt).toLocaleString('cs-CZ')}</small>
                    </button>
                  ))}
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
  const [formTemplates, setFormTemplates] = useStoredState<FormTemplate[]>('restart-form-templates', fallbackFormTemplates);
  const [accounts, setAccounts] = useStoredState<AuthAccount[]>('restart-auth-accounts', starterAccounts);
  const [managedUsers, setManagedUsers] = React.useState<ManagedUser[]>([]);
  const [mediaFiles, setMediaFiles] = React.useState<MediaFile[]>([]);
  const [publicMediaFiles, setPublicMediaFiles] = React.useState<MediaFile[]>(seededTransparentDocuments);
  const [clientDocuments, setClientDocuments] = React.useState<ClientDocument[]>([]);
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([]);
  const [sessionId, setSessionId] = useStoredState<string | null>('restart-auth-session', null);
  const [apiAccount, setApiAccount] = React.useState<AuthAccount | null>(null);
  const [modal, setModal] = React.useState<ModalState>(null);
  const [cookieSettingsOpen, setCookieSettingsOpen] = React.useState(false);
  const { notify } = useToast();
  const currentPath = useHashPath();
  const currentAccount = apiAccount ?? accounts.find((account) => account.id === sessionId) ?? null;

  const refreshNewsDiscussion = React.useCallback(async () => {
    const discussion = await listNewsDiscussion();
    setNewsDiscussion({
      likes: Object.fromEntries(discussion.likes.map((like) => [like.newsId, like])),
      comments: discussion.comments
    });
  }, []);

  React.useEffect(() => {
    if (shouldUseProgramPillarDeck(slides)) {
      setSlides(starterSlides);
    }
  }, [slides, setSlides]);

  React.useEffect(() => {
    getSession()
      .then((user) => setApiAccount(user ? fromApiUser(user) : null))
      .catch(() => setApiAccount(null));
    listNews()
      .then((items) => {
        setNews(items);
      })
      .catch(() => undefined);
    listSlides()
      .then((items) => {
        if (items.length > 0) setSlides(shouldUseProgramPillarDeck(items) ? starterSlides : items);
      })
      .catch(() => undefined);
  }, [setNews, setSlides]);

  React.useEffect(() => {
    listPublicMedia(TRANSPARENCY_DOCUMENT_CATEGORY)
      .then((items) => {
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
      })
      .catch(() => undefined);
  }, []);

  React.useEffect(() => {
    refreshNewsDiscussion().catch(() => undefined);
  }, [currentAccount?.id, refreshNewsDiscussion]);

  React.useEffect(() => {
    if (currentAccount?.role !== 'admin') return;
    listClients()
      .then((items) => setClients(items.map(fromApiClient)))
      .catch(() => undefined);
    listFormTemplates()
      .then((items) => {
        const mapped = items.map(fromApiFormTemplate).filter((template) => template.fields.length > 0);
        if (mapped.length > 0) setFormTemplates(mapped);
      })
      .catch(() => undefined);
    listUsers()
      .then(setManagedUsers)
      .catch(() => undefined);
    listMedia()
      .then(setMediaFiles)
      .catch(() => undefined);
    listDocuments()
      .then(setClientDocuments)
      .catch(() => undefined);
    listNotifications()
      .then(setNotifications)
      .catch(() => undefined);
  }, [currentAccount?.id, currentAccount?.role, setClients, setFormTemplates]);

  const login = (account: AuthAccount) => {
    if (account.password) {
      setSessionId(account.id);
      setApiAccount(null);
      if (account.role === 'admin' && currentPath !== '/admin') {
        window.location.hash = '#/admin';
      }
      return;
    }
    setApiAccount(account);
    setSessionId(null);
    if (account.role === 'admin' && currentPath !== '/admin') {
      window.location.hash = '#/admin';
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
      if (role === 'client' && error instanceof ApiRequestError && [400, 401, 403].includes(error.status)) {
        const user = await loginUser(email, password, 'admin');
        return fromApiUser(user);
      }
      throw error;
    }
  };
  const registerViaApi = async ({ name, email, phone, password }: RegisterRequest) => {
    const user = await registerClientAccount(name, email, phone, password);
    return fromApiUser(user);
  };
  const resetViaApi = (email: string) => requestPasswordReset(email);
  const confirmResetViaApi = ({ token, password }: ResetConfirmRequest) => confirmPasswordReset(token, password);
  const saveClientViaApi = async (client: ClientRecord) => {
    const saved = await saveClientRecord(client);
    return fromApiClient(saved);
  };
  const saveNewsViaApi = (item: NewsItem) => saveNewsRecord(item);
  const deleteNewsViaApi = (id: string) => deleteNewsRecord(id);
  const saveSlideViaApi = (item: HomeSlide) => saveSlideRecord(item);
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

  const staticPage = staticPages[currentPath];
  const transparencyPublicDocuments = publicMediaFiles
    .filter((document) => document.category === TRANSPARENCY_DOCUMENT_CATEGORY || document.fileUrl.startsWith('/documents/transparency/'))
    .filter((document, index, list) => list.findIndex((other) => other.fileUrl === document.fileUrl) === index);
  const page =
    currentPath === '/co-delame' ? (
      <WorkPage />
    ) : currentPath === '/programy' ? (
      <ProgramsPage />
    ) : selectedProgram ? (
      <ProgramDetailPage program={selectedProgram} />
    ) : currentPath === '/aktuality' ? (
      <NewsPage
        news={news}
        discussion={newsDiscussion}
        account={currentAccount}
        onToggleLike={toggleLikeViaApi}
        onAddComment={addCommentViaApi}
        onUpdateComment={updateCommentViaApi}
        onDeleteComment={deleteCommentViaApi}
        onNotify={notify}
      />
    ) : currentPath === '/zapojeni' ? (
      <SupportPage />
    ) : currentPath === '/media' ? (
      <MediaKitPage page={staticPages['/media']} assets={publicMediaKitAssets} />
    ) : currentPath === '/povinne-zverejnovani' ? (
      <TransparencyDocumentsPage documents={transparencyPublicDocuments} />
    ) : currentPath === '/kontakt' ? (
      <ContactPage onNotify={notify} />
    ) : staticPage ? (
      <StaticInfoPage page={staticPage} />
    ) : currentPath === '/klient' ? (
      currentAccount?.role === 'client' || currentAccount?.role === 'admin' ? (
        <ClientProfile
          account={currentAccount}
          clientDocuments={clientDocuments}
          notifications={notifications}
          onNotificationReadRequest={markNotificationReadViaApi}
          onPasswordResetRequest={requestPasswordReset}
          onLogout={logout}
          onNotify={notify}
        />
      ) : (
        <AuthScreen
          role="client"
          title="Klientský profil"
          text="Klientský profil je chráněný registrací a přihlášením. Po vytvoření profilu se klient dostane ke svým údajům a dokumentům."
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
          formTemplates={formTemplates}
          managedUsers={managedUsers}
          mediaFiles={mediaFiles}
          clientDocuments={clientDocuments}
          notifications={notifications}
          discussion={newsDiscussion}
          onClientsChange={setClients}
          onNewsChange={setNews}
          onSlidesChange={setSlides}
          onClientSaveRequest={saveClientViaApi}
          onNewsSaveRequest={saveNewsViaApi}
          onNewsDeleteRequest={deleteNewsViaApi}
          onSlideSaveRequest={saveSlideViaApi}
          onDocumentSaveRequest={saveDocumentViaApi}
          onMediaSaveRequest={saveMediaViaApi}
          onMediaUploadRequest={uploadMediaViaApi}
          onNotificationSaveRequest={saveNotificationViaApi}
          onNotificationReadRequest={markNotificationReadViaApi}
          onUserUpdateRequest={updateManagedUserViaApi}
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
      <Header currentPath={currentPath} account={currentAccount} onNotify={notify} />
      <Breadcrumb path={currentPath} />
      <main id="top">
        <RevealFx key={currentPath} className="page-reveal" delay={70}>
          {page}
        </RevealFx>
      </main>
      <AppModal modal={modal} onClose={() => setModal(null)} />
      <CookieConsent forceOpen={cookieSettingsOpen} onClose={() => setCookieSettingsOpen(false)} />
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
  formTemplates,
  managedUsers,
  mediaFiles,
  clientDocuments,
  notifications,
  discussion,
  onClientsChange,
  onNewsChange,
  onSlidesChange,
  onClientSaveRequest,
  onNewsSaveRequest,
  onNewsDeleteRequest,
  onSlideSaveRequest,
  onDocumentSaveRequest,
  onMediaSaveRequest,
  onMediaUploadRequest,
  onNotificationSaveRequest,
  onNotificationReadRequest,
  onUserUpdateRequest,
  account,
  onLogout,
  onNotify
}: {
  clients: ClientRecord[];
  news: NewsItem[];
  slides: HomeSlide[];
  formTemplates: FormTemplate[];
  managedUsers: ManagedUser[];
  mediaFiles: MediaFile[];
  clientDocuments: ClientDocument[];
  notifications: NotificationItem[];
  discussion: NewsDiscussion;
  onClientsChange: React.Dispatch<React.SetStateAction<ClientRecord[]>>;
  onNewsChange: React.Dispatch<React.SetStateAction<NewsItem[]>>;
  onSlidesChange: React.Dispatch<React.SetStateAction<HomeSlide[]>>;
  onClientSaveRequest?: (client: ClientRecord) => Promise<ClientRecord>;
  onNewsSaveRequest?: (item: NewsItem) => Promise<NewsItem>;
  onNewsDeleteRequest?: (id: string) => Promise<void>;
  onSlideSaveRequest?: (item: HomeSlide) => Promise<HomeSlide>;
  onDocumentSaveRequest?: (document: Omit<ClientDocument, 'createdAt'> & { createdAt?: string }) => Promise<ClientDocument>;
  onMediaSaveRequest?: (media: Omit<MediaFile, 'createdAt' | 'uploadedBy'> & { createdAt?: string; uploadedBy?: string | null }) => Promise<MediaFile>;
  onMediaUploadRequest?: (mediaFile: File, category: string) => Promise<MediaUploadResult>;
  onNotificationSaveRequest?: (
    notification: Omit<NotificationItem, 'createdAt' | 'readAt'> & { createdAt?: string; readAt?: string | null }
  ) => Promise<NotificationItem>;
  onNotificationReadRequest?: (notificationId: string) => Promise<void>;
  onUserUpdateRequest?: (user: Pick<ManagedUser, 'id' | 'role' | 'isActive'>) => Promise<ManagedUser>;
  account: AuthAccount;
  onLogout: () => void;
  onNotify: (tone: FeedbackTone, title: string, text?: string) => void;
}) {
  const [activeTab, setActiveTab] = React.useState<AdminSection>('dashboard');
  const [focusedNewsId, setFocusedNewsId] = React.useState('');
  const [focusedActivityId, setFocusedActivityId] = React.useState('');
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
    date: todayIso(),
    excerpt: '',
    body: ''
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
    ctaHref: '#/kontakt',
    sortOrder: 40,
    isActive: true
  });
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
  const selectedToolsClient = selectedClientId ? clients.find((client) => client.id === selectedClientId) ?? null : null;
  const toolsClientHasOperationalId = Boolean(selectedToolsClient?.operationalId?.trim());
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
      [client.firstName, client.lastName, client.email, client.phone, client.program, client.status, client.operationalId, client.targetGroup, client.address]
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
  const selectedTemplate = formTemplates.find((template) => template.id === selectedTemplateId) ?? formTemplates[0] ?? fallbackFormTemplates[0];
  const selectedTemplateFileUrl = resolvePublicFileUrl(selectedTemplate.fileUrl || selectedTemplate.sourceNote, selectedTemplate);
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
  const registrationUsers = managedUsers.filter((user) => user.role === 'client');
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
  const previewNews = (focusedNewsId ? news.find((item) => item.id === focusedNewsId) : null) ?? news[0] ?? null;
  const previewNewsComments = previewNews
    ? discussion.comments
        .filter((comment) => comment.newsId === previewNews.id)
        .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
    : [];
  const previewNewsLike = previewNews ? discussion.likes[previewNews.id] : null;

  React.useEffect(() => {
    if (!barcodeRef.current || !toolsDraft.barcodeValue.trim()) return;
    try {
      JsBarcode(barcodeRef.current, toolsDraft.barcodeValue.trim(), {
        format: 'CODE128',
        lineColor: '#14231b',
        width: 2,
        height: 86,
        displayValue: true,
        font: 'Poppins',
        fontSize: 16,
        margin: 14
      });
    } catch (error) {
      onNotify('error', 'Čárový kód nejde vykreslit', error instanceof Error ? error.message : 'Zkontrolujte hodnotu kódu.');
    }
  }, [onNotify, toolsDraft.barcodeValue]);

  React.useEffect(() => {
    if (!qrCanvasRef.current || !toolsDraft.qrValue.trim()) return;
    QRCode.toCanvas(qrCanvasRef.current, toolsDraft.qrValue.trim(), {
      width: 236,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#14231b',
        light: '#ffffff'
      }
    }).catch((error) => {
      onNotify('error', 'QR kód nejde vykreslit', error instanceof Error ? error.message : 'Zkontrolujte hodnotu QR kódu.');
    });
  }, [onNotify, toolsDraft.qrValue]);

  React.useEffect(() => {
    if (!selectedClientId && clients[0]) setSelectedClientId(clients[0].id);
  }, [clients, selectedClientId]);

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

  const openNewsDialog = (item?: NewsItem) => {
    setNewsForm(
      item ?? {
        id: '',
        title: '',
        date: todayIso(),
        excerpt: '',
        body: ''
      }
    );
    setIsNewsDialogOpen(true);
    onNotify('info', item ? 'Aktualita načtena k úpravě' : 'Nová aktualita', item?.title ?? 'Můžete začít psát.');
  };

  const closeNewsDialog = () => {
    setIsNewsDialogOpen(false);
    setNewsForm({ id: '', title: '', date: todayIso(), excerpt: '', body: '' });
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
      insertNewsBody(`<figure><img src="${trimmed}" alt="" /><figcaption>Popisek obrázku</figcaption></figure>`);
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

  const saveNews = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newsForm.title.trim()) return;
    const id = newsForm.id || crypto.randomUUID();
    let nextItem: NewsItem = { ...newsForm, id, date: newsForm.date || todayIso(), body: cleanNewsHtml(newsForm.body || '') };
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
    if (!slideForm.title.trim() || !slideForm.subtitle.trim() || !slideForm.imageUrl.trim()) return;
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
      ctaHref: '#/kontakt',
      sortOrder: 40,
      isActive: true
    });
    if (!onSlideSaveRequest) {
      setAdminMessageTone('success');
      setAdminMessage('Slide je uložený v aktuální administraci.');
      onNotify('success', 'Slide uložen', 'Záznam byl uložen.');
    }
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
    setMediaForm((current) => ({
      ...current,
      title: current.title || selectedFile.name.replace(/\.[^.]+$/, ''),
      fileName: selectedFile.name,
      mimeType: selectedFile.type || current.mimeType || 'application/pdf',
      fileSize: selectedFile.size
    }));
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
      setNotificationForm(nextNotification);
      setAdminDialog({ type: 'notification', notification: nextNotification });
      onNotify('success', 'Notifikace označena', 'Upozornění je vedené jako přečtené.');
    } catch (error) {
      onNotify('error', 'Stav notifikace se nepodařilo uložit', error instanceof Error ? error.message : 'Zkuste to prosím znovu.');
    }
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
      registrationDate: client.createdAt || todayIso(),
      sequence: Math.max(1, clients.findIndex((item) => item.id === client.id) + 1),
      generatedId: savedOperationalId,
      barcodeValue: savedOperationalId || current.barcodeValue,
      qrValue: savedOperationalId || current.qrValue
    }));
    onNotify(
      'info',
      savedOperationalId ? 'Interní ID načteno' : 'Klient načten do tools',
      savedOperationalId || `${client.firstName} ${client.lastName} zatím nemá interní ID.`
    );
  };

  const generateOperationalId = async () => {
    if (!toolsDraft.firstName.trim() && !toolsDraft.lastName.trim()) {
      onNotify('warning', 'ID nejde vygenerovat', 'Vyplňte jméno nebo příjmení klienta.');
      return;
    }
    const selectedToolsClient = selectedClientId ? clients.find((client) => client.id === selectedClientId) : null;
    if (selectedToolsClient?.operationalId?.trim()) {
      const savedOperationalId = selectedToolsClient.operationalId.trim();
      setToolsDraft((current) => ({
        ...current,
        generatedId: savedOperationalId,
        barcodeValue: savedOperationalId,
        qrValue: savedOperationalId
      }));
      onNotify('info', 'ID už existuje', `${selectedToolsClient.firstName} ${selectedToolsClient.lastName}: ${savedOperationalId}`);
      return;
    }
    const generatedId = buildClientOperationalId(toolsDraft);
    setToolsDraft((current) => ({
      ...current,
      generatedId,
      barcodeValue: generatedId,
      qrValue: generatedId
    }));
    if (!selectedToolsClient) {
      onNotify('warning', 'ID vygenerováno jen lokálně', 'Vyberte klienta z registru, aby se ID uložilo do databáze.');
      return;
    }
    const nextClient = { ...selectedToolsClient, operationalId: generatedId };
    onClientsChange((current) => current.map((client) => (client.id === nextClient.id ? nextClient : client)));
    if (!onClientSaveRequest) {
      onNotify('success', 'ID uloženo lokálně', generatedId);
      return;
    }
    try {
      const savedClient = await onClientSaveRequest(nextClient);
      onClientsChange((current) => current.map((client) => (client.id === savedClient.id ? savedClient : client)));
      setClientForm((current) => (current.id === savedClient.id ? savedClient : current));
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
    if (target.href && !target.href.startsWith('#/admin') && target.href.startsWith('#/')) {
      window.location.hash = target.href;
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
    onNotify('info', 'Slide načten k úpravě', item.title);
  };

  const currentAdminNav = adminNavItems.find((item) => item.id === activeTab) ?? adminNavItems[0];

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
              <span>Klienti</span>
              <strong>{clients.length}</strong>
              <p>aktivních záznamů v registru</p>
            </article>
            <article className="admin-card metric-card">
              <span>Aktuality</span>
              <strong>{news.length}</strong>
              <p>publikovaných nebo připravených zpráv</p>
            </article>
            <article className="admin-card metric-card">
              <span>Slideshow</span>
              <strong>{slides.filter((slide) => slide.isActive).length}</strong>
              <p>aktivních bannerů na homepage</p>
            </article>
            <article className="admin-card metric-card">
              <span>Formuláře</span>
              <strong>{formTemplates.length}</strong>
              <p>šablon připravených k tisku</p>
            </article>
            <article className="admin-card metric-card">
              <span>Dokumenty</span>
              <strong>{clientDocuments.length}</strong>
              <p>{pendingDocuments.length} čeká na podpis nebo dokončení</p>
            </article>
            <article className="admin-card metric-card">
              <span>Uživatelé</span>
              <strong>{activeUsers.length}</strong>
              <p>aktivních účtů z {managedUsers.length}</p>
            </article>
            <article className="admin-card metric-card">
              <span>Notifikace</span>
              <strong>{unreadNotifications.length}</strong>
              <p>nepřečtených upozornění v systému</p>
            </article>
            <article className="admin-card metric-card">
              <span>Média</span>
              <strong>{mediaFiles.length}</strong>
              <p>souborů v knihovně médií</p>
            </article>
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
                      <span>{formCategoryTitle(template.folder)}</span>
                      <small>{formSensitivity(template)}</small>
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
                  {selectedTemplate.folder && <span>{formCategoryTitle(selectedTemplate.folder)}</span>}
                  <span>{readableBytes(selectedTemplate.sizeBytes)}</span>
                  {selectedTemplate.sourceNote && <span>{selectedTemplate.sourceNote}</span>}
                  {selectedTemplateFileUrl && (
                    <a href={selectedTemplateFileUrl} target="_blank" rel="noreferrer">
                      Otevřít PDF
                    </a>
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
                      <a key={document.id} href={resolvePublicFileUrl(document.fileUrl) || '#/admin'} target={document.fileUrl ? '_blank' : undefined} rel="noreferrer">
                        {document.title}
                      </a>
                    ))
                  )}
                </div>
              )}
              </div>
            </div>

            <PrintableForm client={selectedClient} template={selectedTemplate} draft={draft} />
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
                  <input value={toolsDraft.firstName} onChange={(event) => setToolsDraft((current) => ({ ...current, firstName: event.target.value }))} placeholder="David" />
                </label>
                <label>
                  Příjmení
                  <input value={toolsDraft.lastName} onChange={(event) => setToolsDraft((current) => ({ ...current, lastName: event.target.value }))} placeholder="Kozák" />
                </label>
                <label>
                  Datum registrace
                  <input type="date" value={toolsDraft.registrationDate} onChange={(event) => setToolsDraft((current) => ({ ...current, registrationDate: event.target.value }))} />
                </label>
                <label>
                  Pořadí
                  <input type="number" min="1" value={toolsDraft.sequence} onChange={(event) => setToolsDraft((current) => ({ ...current, sequence: Number(event.target.value) || 1 }))} />
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
                <button className="button primary" type="button" onClick={generateOperationalId} disabled={toolsClientHasOperationalId}>
                  <Wrench size={18} /> {toolsClientHasOperationalId ? 'ID už existuje' : 'Vygenerovat ID'}
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
                      <strong>{item.title}</strong>
                      <span>{item.excerpt}</span>
                    </button>
                    <div className="news-row-actions" aria-label={`Akce pro aktualitu ${item.title}`}>
                      <button className="icon-tool tooltip-link" type="button" data-tooltip="Upravit" aria-label="Upravit aktualitu" onClick={() => editNews(item)}>
                        <FileText size={17} />
                      </button>
                      <button className="icon-tool tooltip-link danger" type="button" data-tooltip="Smazat" aria-label="Smazat aktualitu" onClick={() => deleteNews(item)}>
                        <Trash2 size={17} />
                      </button>
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
                  {previewNews.body && <div className="news-body" dangerouslySetInnerHTML={{ __html: cleanNewsHtml(previewNews.body) }} />}
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
                        <button className="icon-tool tooltip-link danger" type="button" data-tooltip="Smazat" aria-label="Smazat aktualitu" onClick={() => deleteNews(newsForm)}>
                          <Trash2 size={18} />
                        </button>
                      )}
                      <button className="icon-tool tooltip-link" type="button" data-tooltip="Zavřít" aria-label="Zavřít editor" onClick={closeNewsDialog}>
                        <X size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="editor-fields">
                    <label>
                      Nadpis
                      <input value={newsForm.title} onChange={(event) => setNewsForm((current) => ({ ...current, title: event.target.value }))} required />
                    </label>
                    <label>
                      Datum
                      <input type="date" value={newsForm.date} onChange={(event) => setNewsForm((current) => ({ ...current, date: event.target.value }))} />
                    </label>
                    <label className="editor-full">
                      Krátký text
                      <textarea rows={3} value={newsForm.excerpt} onChange={(event) => setNewsForm((current) => ({ ...current, excerpt: event.target.value }))} required />
                    </label>
                  </div>

                  <div className="mini-word-toolbar" aria-label="Nástroje editoru">
                    <button className="icon-tool tooltip-link" type="button" data-tooltip="Nadpis" aria-label="Vložit nadpis" onClick={() => insertNewsBody('<h2>', '</h2>', 'Nadpis sekce')}>
                      <Heading1 size={17} />
                    </button>
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
                      <h4>{newsForm.title || 'Nadpis aktuality'}</h4>
                      <p>{newsForm.excerpt || 'Krátký text aktuality.'}</p>
                      <div className="news-body" dangerouslySetInnerHTML={{ __html: cleanNewsHtml(newsForm.body || '') }} />
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
          <div className="admin-grid">
            <form className="admin-card" onSubmit={saveSlide}>
              <h3>{slideForm.id ? 'Upravit pinned obsah' : 'Přidat pinned obsah'}</h3>
              <label>
                Nadpis
                <input value={slideForm.title} onChange={(event) => setSlideForm((current) => ({ ...current, title: event.target.value }))} required />
              </label>
              <label>
                Text
                <textarea rows={5} value={slideForm.subtitle} onChange={(event) => setSlideForm((current) => ({ ...current, subtitle: event.target.value }))} required />
              </label>
              <label>
                Obrázek URL
                <input
                  value={slideForm.imageUrl}
                  onChange={(event) => setSlideForm((current) => ({ ...current, imageUrl: event.target.value }))}
                  placeholder="/images/slides/restart-tree.jpg"
                  required
                />
              </label>
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
              <button className="button primary" type="submit">
                <Save size={18} /> Uložit slide
              </button>
            </form>
            <div className="admin-card">
              <h3>Pinned obsah a bannery</h3>
              <div className="client-list slide-list">
                {slides.map((item) => (
                  <button key={item.id} type="button" onClick={() => editSlide(item)}>
                    <img src={item.imageUrl} alt="" />
                    <strong>{item.title}</strong>
                    <span>
                      pořadí {item.sortOrder} - {item.isActive ? 'aktivní' : 'skrytý'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
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
                      <option value="admin">admin</option>
                      <option value="editor">editor</option>
                      <option value="client">client</option>
                    </select>
                    <label className="switch-row">
                      <input type="checkbox" checked={user.isActive} onChange={(event) => updateManagedUser(user, { isActive: event.target.checked })} />
                      Aktivní
                    </label>
                    <button className="icon-tool tooltip-link" type="button" data-tooltip="Detail uživatele" aria-label="Detail uživatele" onClick={() => openUserDialog(user)}>
                      <UserCog size={16} />
                    </button>
                  </article>
                ))}
              </div>
            </article>
            <article className="admin-card">
              <h3>Role</h3>
              <div className="table-lite">
                <div><strong>Admin</strong><span>plný přístup k administraci, klientům, formulářům a nastavení</span></div>
                <div><strong>Editor</strong><span>obsah, aktuality a média bez správy rolí</span></div>
                <div><strong>Client</strong><span>klientská zóna, profil a vlastní dokumenty</span></div>
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
              <div className="notification-admin-list">
                {notifications.length === 0 && <p className="empty-note">Zatím nejsou uložená žádná upozornění.</p>}
                {notifications.map((notification) => (
                  <article key={notification.id} className={notification.readAt ? 'read' : ''}>
                    <Badge tone={toFeedbackTone(notification.tone)}>{notification.category}</Badge>
                    <button className="notification-admin-main" type="button" onClick={() => openNotificationTarget(notification)}>
                      <strong>{notification.title}</strong>
                      <p>{notification.body}</p>
                      <span>{new Date(notification.createdAt).toLocaleString('cs-CZ')}</span>
                    </button>
                    <div className="notification-actions">
                      <button className="icon-tool tooltip-link" type="button" data-tooltip="Detail notifikace" aria-label="Detail notifikace" onClick={() => openNotificationDialog(notification)}>
                        <FileText size={16} />
                      </button>
                      {!notification.readAt && (
                        <button className="icon-tool tooltip-link" type="button" data-tooltip="Označit přečtené" aria-label="Označit přečtené" onClick={() => markNotificationRead(notification)}>
                          <CheckCircle2 size={16} />
                        </button>
                      )}
                      {notification.linkHref && (
                        <button className="text-link-button" type="button" onClick={() => openNotificationTarget(notification)}>
                          Otevřít
                        </button>
                      )}
                    </div>
                  </article>
                ))}
              </div>
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
          managedUserForm={managedUserForm}
          setManagedUserForm={setManagedUserForm}
          notificationForm={notificationForm}
          setNotificationForm={setNotificationForm}
          settingsDraft={settingsDraft}
          setSettingsDraft={setSettingsDraft}
          onClose={() => setAdminDialog(null)}
          onSelectTemplate={selectTemplateForForm}
          onPrintForm={printForm}
          onRegisterDocument={registerPreparedDocument}
          onSaveMedia={saveMediaDialog}
          onSaveUser={saveUserDialog}
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
  managedUserForm,
  setManagedUserForm,
  notificationForm,
  setNotificationForm,
  settingsDraft,
  setSettingsDraft,
  onClose,
  onSelectTemplate,
  onPrintForm,
  onRegisterDocument,
  onSaveMedia,
  onSaveUser,
  onSaveNotification,
  onMarkNotificationRead,
  onSaveSettings
}: {
  dialog: AdminDialogState | null;
  selectedClient: ClientRecord | null;
  draft: FormDraft;
  mediaForm: MediaFile;
  setMediaForm: React.Dispatch<React.SetStateAction<MediaFile>>;
  managedUserForm: ManagedUser;
  setManagedUserForm: React.Dispatch<React.SetStateAction<ManagedUser>>;
  notificationForm: NotificationItem;
  setNotificationForm: React.Dispatch<React.SetStateAction<NotificationItem>>;
  settingsDraft: AdminSettingsDraft;
  setSettingsDraft: React.Dispatch<React.SetStateAction<AdminSettingsDraft>>;
  onClose: () => void;
  onSelectTemplate: (templateId: string) => void;
  onPrintForm: () => void;
  onRegisterDocument: () => void;
  onSaveMedia: (event: React.FormEvent) => void;
  onSaveUser: (event: React.FormEvent) => void;
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
            <div><span>ID</span><strong>{template.id}</strong></div>
            <div><span>Kategorie</span><strong>{formCategoryTitle(template.folder)}</strong></div>
            <div><span>Citlivost</span><strong>{sensitivity}</strong></div>
            <div><span>Velikost</span><strong>{readableBytes(template.sizeBytes)}</strong></div>
            <div><span>Stav</span><strong>{template.isActive === false ? 'Skrytá' : 'Aktivní'}</strong></div>
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
            <label>
              Název
              <input value={mediaForm.title} onChange={(event) => setMediaForm((current) => ({ ...current, title: event.target.value }))} required />
            </label>
            <label>
              Kategorie
              <input value={mediaForm.category} onChange={(event) => setMediaForm((current) => ({ ...current, category: event.target.value }))} />
            </label>
            <label>
              Název souboru
              <input value={mediaForm.fileName} onChange={(event) => setMediaForm((current) => ({ ...current, fileName: event.target.value }))} />
            </label>
            <label>
              MIME typ
              <input value={mediaForm.mimeType} onChange={(event) => setMediaForm((current) => ({ ...current, mimeType: event.target.value }))} />
            </label>
            <label className="editor-full">
              URL souboru
              <input value={mediaForm.fileUrl} onChange={(event) => setMediaForm((current) => ({ ...current, fileUrl: event.target.value }))} required />
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
                <option value="admin">admin</option>
                <option value="editor">editor</option>
                <option value="client">client</option>
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

function PrintableForm({
  client,
  template,
  draft
}: {
  client: ClientRecord | null;
  template: FormTemplate;
  draft: FormDraft;
}) {
  return (
    <article className="print-sheet">
      <div className="print-header">
        <div>
          <p>REST||ART Integrace</p>
          <h2>{template.title}</h2>
        </div>
        <FileText size={34} />
      </div>
      {!client ? (
        <p className="empty-note">Vyberte klienta pro náhled tiskového formuláře.</p>
      ) : (
        <>
          <div className="print-meta">
            <div>
              <span>Klient</span>
              <strong>
                {client.firstName} {client.lastName}
              </strong>
            </div>
            <div>
              <span>Datum narození</span>
              <strong>{client.birthDate || '-'}</strong>
            </div>
            <div>
              <span>Program</span>
              <strong>{client.program}</strong>
            </div>
            <div>
              <span>Datum tisku</span>
              <strong>{new Date().toLocaleDateString('cs-CZ')}</strong>
            </div>
          </div>
          <div className="print-block">
            <span>Kontakt a adresa</span>
            <p>{[client.phone, client.email, client.address].filter(Boolean).join(' | ') || '-'}</p>
          </div>
          {template.fields.map((field) => (
            <div className="print-block" key={field.key}>
              <span>{field.label}</span>
              <p>{draft[field.key] || ' '}</p>
            </div>
          ))}
          <div className="signature-grid">
            <div>
              <span>Podpis klienta</span>
            </div>
            <div>
              <span>Podpis pracovníka</span>
            </div>
          </div>
        </>
      )}
    </article>
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
