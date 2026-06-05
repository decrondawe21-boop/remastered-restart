import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowRight,
  AlertCircle,
  Bell,
  Bold,
  ChevronLeft,
  CheckCircle2,
  ClipboardList,
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
  Reply,
  RotateCcw,
  Save,
  Settings,
  ShieldCheck,
  Trash2,
  Underline,
  Undo2,
  Upload,
  UserCog,
  UserRound,
  Users,
  Video,
  X
} from 'lucide-react';
import {
  contacts,
  focusAreas,
  partnerTypes,
  principles,
  programs,
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
  listFormTemplates,
  listNews,
  listNewsDiscussion,
  listSlides,
  loginUser,
  logoutUser,
  registerClient as registerClientAccount,
  requestPasswordReset,
  saveClient as saveClientRecord,
  saveNews as saveNewsRecord,
  saveSlide as saveSlideRecord,
  toggleNewsLike,
  updateNewsComment,
  ApiRequestError,
  type ApiClientRecord,
  type ApiFormTemplate,
  type ApiNewsComment,
  type ApiNewsLike,
  type ApiHomeSlide,
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
  '/admin': 'Administrace'
};

const normalizePath = (value: string) => {
  const path = value.replace(/^#/, '') || '/';
  return routeLabels[path] ? path : '/';
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
};

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

type FeedbackTone = 'success' | 'error' | 'warning' | 'info';

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
  { id: 'media', label: 'Média', text: 'Obrázky a dokumenty', icon: ImageIcon },
  { id: 'users', label: 'Uživatelé a role', text: 'Admin, editor, user', icon: UserCog },
  { id: 'notifications', label: 'Notifikace', text: 'Zprávy a upozornění', icon: Bell },
  { id: 'settings', label: 'Nastavení', text: 'Branding, SEO, bezpečnost', icon: Settings }
];

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
  createdAt: client.createdAt
});

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
  sizeBytes: template.sizeBytes
});

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
    id: 'slide-vstup',
    title: 'Zázemí, které roste krok za krokem',
    subtitle: 'To, co začíná jako malé semínko, může časem vytvořit bezpečný průchod.',
    imageUrl: '/images/crops/streetwise/streetwise-klenba.jpg',
    ctaLabel: 'STREETWISE',
    ctaHref: '#/programy',
    sortOrder: 10,
    isActive: true
  },
  {
    id: 'slide-zazemi',
    title: 'Z odepsaného vzniká zázemí',
    subtitle: 'Z nalezeného dřeva a materiálu stavíme prostor, který může sloužit dál.',
    imageUrl: '/images/crops/streetwise/streetwise-zelena-stena.jpg',
    ctaLabel: 'Jak pracujeme',
    ctaHref: '#/co-delame',
    sortOrder: 20,
    isActive: true
  },
  {
    id: 'slide-detail',
    title: 'Trpělivá péče má smysl',
    subtitle: 'Růže, zázemí i lidská změna rostou tehdy, když dostanou čas a oporu.',
    imageUrl: '/images/crops/streetwise/streetwise-ruze-detail.jpg',
    ctaLabel: 'Zapojit se',
    ctaHref: '#/zapojeni',
    sortOrder: 30,
    isActive: true
  },
  {
    id: 'slide-streetwise-cesta',
    title: 'Střecha pro první krok',
    subtitle: 'STREETWISE buduje bezpečné místo pro kontakt, podporu a první stabilní krok.',
    imageUrl: '/images/crops/streetwise/streetwise-cesta-branka.jpg',
    ctaLabel: 'Potřebuji pomoc',
    ctaHref: '#/kontakt',
    sortOrder: 40,
    isActive: true
  },
  {
    id: 'slide-streetwise-bouda',
    title: 'Stavíme z toho, co ještě může sloužit',
    subtitle: 'Dřevo z demolic, ruce, trpělivost a víra v druhou šanci. Pro věci i pro lidi.',
    imageUrl: '/images/crops/streetwise/streetwise-bouda-stavba.jpg',
    ctaLabel: 'Druhá šance v praxi',
    ctaHref: '#/co-delame',
    sortOrder: 50,
    isActive: true
  },
  {
    id: 'slide-01',
    title: 'REST||ART Integrace',
    subtitle: 'Neziskový projekt druhých šancí.',
    imageUrl: '/images/01.png',
    ctaLabel: 'Zobrazit programy',
    ctaHref: '#/programy',
    sortOrder: 100,
    isActive: false
  },
  {
    id: 'slide-04',
    title: 'Vizuál 04',
    subtitle: 'REST||ART Integrace - banner 04.',
    imageUrl: '/images/04.png',
    ctaLabel: 'Zobrazit programy',
    ctaHref: '#/programy',
    sortOrder: 40,
    isActive: false
  },
  {
    id: 'slide-05',
    title: 'Vizuál 05',
    subtitle: 'REST||ART Integrace - banner 05.',
    imageUrl: '/images/05.png',
    ctaLabel: 'Zobrazit programy',
    ctaHref: '#/programy',
    sortOrder: 50,
    isActive: false
  },
  {
    id: 'slide-06',
    title: 'Vizuál 06',
    subtitle: 'REST||ART Integrace - banner 06.',
    imageUrl: '/images/06.png',
    ctaLabel: 'Zobrazit programy',
    ctaHref: '#/programy',
    sortOrder: 60,
    isActive: false
  },
  {
    id: 'slide-07',
    title: 'Vizuál 07',
    subtitle: 'REST||ART Integrace - banner 07.',
    imageUrl: '/images/07.png',
    ctaLabel: 'Zobrazit programy',
    ctaHref: '#/programy',
    sortOrder: 70,
    isActive: false
  },
  {
    id: 'slide-08',
    title: 'Vizuál 08',
    subtitle: 'REST||ART Integrace - banner 08.',
    imageUrl: '/images/08.png',
    ctaLabel: 'Zobrazit programy',
    ctaHref: '#/programy',
    sortOrder: 80,
    isActive: false
  },
  {
    id: 'slide-09',
    title: 'Vizuál 09',
    subtitle: 'REST||ART Integrace - banner 09.',
    imageUrl: '/images/09.png',
    ctaLabel: 'Zobrazit programy',
    ctaHref: '#/programy',
    sortOrder: 90,
    isActive: false
  },
  {
    id: 'slide-10',
    title: 'Vizuál 10',
    subtitle: 'REST||ART Integrace - banner 10.',
    imageUrl: '/images/10.png',
    ctaLabel: 'Zobrazit programy',
    ctaHref: '#/programy',
    sortOrder: 100,
    isActive: false
  },
  {
    id: 'slide-11',
    title: 'Vizuál 11',
    subtitle: 'REST||ART Integrace - banner 11.',
    imageUrl: '/images/11.png',
    ctaLabel: 'Zobrazit programy',
    ctaHref: '#/programy',
    sortOrder: 110,
    isActive: false
  },
  {
    id: 'slide-12',
    title: 'Vizuál 12',
    subtitle: 'REST||ART Integrace - banner 12.',
    imageUrl: '/images/12.png',
    ctaLabel: 'Zobrazit programy',
    ctaHref: '#/programy',
    sortOrder: 120,
    isActive: false
  },
  {
    id: 'slide-13',
    title: 'Vizuál 13',
    subtitle: 'REST||ART Integrace - banner 13.',
    imageUrl: '/images/13.png',
    ctaLabel: 'Zobrazit programy',
    ctaHref: '#/programy',
    sortOrder: 130,
    isActive: false
  },
  {
    id: 'slide-14',
    title: 'Vizuál 14',
    subtitle: 'REST||ART Integrace - banner 14.',
    imageUrl: '/images/14.png',
    ctaLabel: 'Zobrazit programy',
    ctaHref: '#/programy',
    sortOrder: 140,
    isActive: false
  },
  {
    id: 'slide-15',
    title: 'Vizuál 15',
    subtitle: 'REST||ART Integrace - banner 15.',
    imageUrl: '/images/15.png',
    ctaLabel: 'Zobrazit programy',
    ctaHref: '#/programy',
    sortOrder: 150,
    isActive: false
  },
  {
    id: 'slide-16',
    title: 'Vizuál 16',
    subtitle: 'REST||ART Integrace - banner 16.',
    imageUrl: '/images/16.png',
    ctaLabel: 'Zobrazit programy',
    ctaHref: '#/programy',
    sortOrder: 160,
    isActive: false
  },
  {
    id: 'slide-17',
    title: 'Vizuál 17',
    subtitle: 'REST||ART Integrace - banner 17.',
    imageUrl: '/images/17.png',
    ctaLabel: 'Zobrazit programy',
    ctaHref: '#/programy',
    sortOrder: 170,
    isActive: false
  },
  {
    id: 'slide-18',
    title: 'Vizuál 18',
    subtitle: 'REST||ART Integrace - banner 18.',
    imageUrl: '/images/18.png',
    ctaLabel: 'Zobrazit programy',
    ctaHref: '#/programy',
    sortOrder: 180,
    isActive: false
  },
  {
    id: 'slide-19',
    title: 'Vizuál 19',
    subtitle: 'REST||ART Integrace - banner 19.',
    imageUrl: '/images/19.png',
    ctaLabel: 'Zobrazit programy',
    ctaHref: '#/programy',
    sortOrder: 190,
    isActive: false
  },
  {
    id: 'slide-20',
    title: 'Vizuál 20',
    subtitle: 'REST||ART Integrace - banner 20.',
    imageUrl: '/images/20.png',
    ctaLabel: 'Zobrazit programy',
    ctaHref: '#/programy',
    sortOrder: 200,
    isActive: false
  }
];

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

function Header({ currentPath, account }: { currentPath: string; account: AuthAccount | null }) {
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
          <nav className="desktop-nav" aria-label="Hlavní navigace">
            {visibleNavItems.map((item) => (
              <a key={item.href} href={item.href} className={currentPath === item.href.slice(1) ? 'active' : ''}>
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
  const crumbs =
    path === '/kontakt'
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
              { label: routeLabels[path] }
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
            <div>
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
            </div>
          </article>
        );
      })}
    </div>
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
  const activeSlideHasDesignedText = /^\/images\/\d{2}\.png$/i.test(activeSlide.imageUrl);
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
        className="hero-banner"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          swipeStartX.current = null;
        }}
      >
        <img src={activeSlide.imageUrl} alt="" />
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

      <section className="streetwise-feature">
        <div className="streetwise-copy">
          <p className="section-label">STREETWISE</p>
          <h2>Z věcí, které měly skončit, stavíme nové zázemí.</h2>
          <p>
            REST||ART Integrace vzniká stejně jako naše bouda: z nalezeného materiálu, práce, trpělivosti a víry, že
            i to, co bylo odepsané, může znovu sloužit.
          </p>
          <p>
            STREETWISE bude zázemí a střecha pro lidi bez domova. Praktický prostor pro první kontakt, bezpečí a další
            krok zpět ke stabilitě.
          </p>
          <a className="button primary" href="#/programy">
            Zobrazit STREETWISE <ArrowRight size={18} />
          </a>
        </div>
        <figure className="streetwise-photo">
          <img src="/images/crops/streetwise/streetwise-bouda-stavba.jpg" alt="" />
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

      <section className="content-section">
        <SectionIntro
          label="Rozcestník"
          title="Vyberte oblast, kterou potřebujete řešit"
          text="Web je rozdělený do klasických stránek. Nemusíte projíždět dlouhý one-page, můžete rovnou přejít na programy, kontakt nebo administraci."
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
          text="Krátký přehled dění. Další aktuality najdete na samostatné stránce Aktuality."
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
      <section className="muted-section">
        <ProgramsList />
      </section>
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
    </>
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
    window.location.href = `mailto:kozak.david@dk-i.cz?subject=${subject}&body=${body}`;
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
            <a className="button primary" href="mailto:kozak.david@dk-i.cz">
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
        <div className={`ui-toast ${message.tone}`} key={message.id}>
          <div className="toast-icon"><FeedbackIcon tone={message.tone} /></div>
          <div>
            <strong>{message.title}</strong>
            {message.text && <p>{message.text}</p>}
          </div>
          <button type="button" aria-label="Zavřít hlášku" onClick={() => onDismiss(message.id)}>
            <X size={16} />
          </button>
        </div>
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
      <Badge tone="info">Připraveno pro napojení na backend</Badge>
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
        setMessage(error instanceof Error ? error.message : 'Backend ověření není dostupné, zkouším lokální účet.');
        onNotify('warning', 'Backend ověření selhalo', 'Zkouším ještě lokální prototypový účet.');
        if (role === 'admin') {
          setIsSubmitting(false);
          setMessageTone('error');
          setMessage(error instanceof Error ? error.message : 'Backend ověření administrace není dostupné.');
          onNotify('error', 'Přihlášení administrace selhalo', 'Lokální prototypový admin fallback je vypnutý.');
          return;
        }
        // Keep the local prototype fallback available while backend accounts are being seeded.
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
        setMessage(error instanceof Error ? error.message : 'Registrace přes API se nepodařila, používám lokální režim.');
        onNotify('warning', 'Registrace přes API selhala', 'Pokračuji lokálním uložením v prohlížeči.');
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
    onNotify('success', 'Lokální registrace je hotová', 'Profil byl vytvořen v prohlížeči.');
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
        // Use the same public confirmation text even when the mail backend is not connected yet.
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
                ? 'Připraveno k přihlášení'
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
              {role === 'admin' && (
                <p className="auth-note">Dočasný prototypový vstup: admin@restart.local / restart2026</p>
              )}
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
  onLogout,
  onNotify
}: {
  account: AuthAccount;
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
  const [previousAvatarDraft, setPreviousAvatarDraft] = React.useState<Pick<
    ClientProfileDraft,
    'source' | 'avatar' | 'zoom' | 'offsetX' | 'offsetY' | 'rotation' | 'filter'
  > | null>(null);
  const displayName = profile.name.trim() || account.name;
  const displayPhone = profile.phone.trim() || account.phone;
  const isAdminProfile = account.role === 'admin';
  const workspaceBadge = isAdminProfile ? 'Admin profil' : 'Klientská zóna';
  const workspaceTitle = isAdminProfile ? 'Profil administrátora' : 'Přihlášený klient';

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
                    <dt>Profil vytvořen</dt>
                    <dd>{new Date(account.createdAt).toLocaleDateString('cs-CZ')}</dd>
                  </div>
                </dl>
              </article>
              <WorkspacePlaceholder
                title="Notifikace"
                text="Tady budou nové zprávy, potvrzení schůzek a systémová upozornění."
                items={['Nová zpráva od pracovníka', 'Dokument čeká na podpis', 'Profil čeká na ověření']}
              />
              <article>
                <h2>Rychlé akce</h2>
                <div className="quick-action-grid">
                  <button type="button" onClick={() => setActiveSection('profile')}>Upravit profil</button>
                  <button type="button" onClick={() => setActiveSection('avatar')}>Změnit avatar</button>
                  <button type="button" onClick={() => setActiveSection('documents')}>Moje dokumenty</button>
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
              <WorkspacePlaceholder
                title="Moje dokumenty"
                text="Přehled uložených souborů, formulářů a historie podpisů."
                items={['Vstupní karta', 'Souhlas se zapojením', 'Stabilizační plán']}
              />
              <article>
                <h2>Dokumenty k podpisu</h2>
                <p>Dokumenty budou připravené k tisku, stažení a potvrzení po napojení na databázi.</p>
                <a className="button secondary" href="#/kontakt">Kontaktovat pracovníka</a>
              </article>
            </div>
          )}

          {activeSection === 'activity' && (
            <div className="client-dashboard">
              <WorkspacePlaceholder
                title="Moje aktivita"
                text="Historie odeslaných formulářů, změn profilu a potvrzení."
                items={['Profil vytvořen', 'Avatar připraven k úpravě', 'Čeká na ověření pracovníkem']}
              />
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="client-dashboard">
              <WorkspacePlaceholder
                title="Notifikace"
                text="Nové zprávy, potvrzení, připomínky a upozornění."
                items={['Zprávy', 'Potvrzení', 'Upozornění']}
              />
            </div>
          )}

          {activeSection === 'settings' && (
            <div className="client-dashboard">
              <WorkspacePlaceholder
                title="Nastavení účtu"
                text="Heslo, soukromí a dvoufázové ověření."
                items={['Změna hesla', 'Soukromí profilu', '2FA']}
              />
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
    getSession()
      .then((user) => setApiAccount(user ? fromApiUser(user) : null))
      .catch(() => setApiAccount(null));
    listNews()
      .then((items) => {
        if (items.length > 0) setNews(items);
      })
      .catch(() => undefined);
    listSlides()
      .then((items) => {
        if (items.length > 0) setSlides(items);
      })
      .catch(() => undefined);
  }, [setNews, setSlides]);

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

  const page =
    currentPath === '/co-delame' ? (
      <WorkPage />
    ) : currentPath === '/programy' ? (
      <ProgramsPage />
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
    ) : currentPath === '/kontakt' ? (
      <ContactPage onNotify={notify} />
    ) : currentPath === '/klient' ? (
      currentAccount?.role === 'client' || currentAccount?.role === 'admin' ? (
        <ClientProfile account={currentAccount} onLogout={logout} onNotify={notify} />
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
          onClientsChange={setClients}
          onNewsChange={setNews}
          onSlidesChange={setSlides}
          onClientSaveRequest={saveClientViaApi}
          onNewsSaveRequest={saveNewsViaApi}
          onNewsDeleteRequest={deleteNewsViaApi}
          onSlideSaveRequest={saveSlideViaApi}
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
      <Header currentPath={currentPath} account={currentAccount} />
      <Breadcrumb path={currentPath} />
      <main id="top">
        <RevealFx key={currentPath} className="page-reveal" delay={70}>
          {page}
        </RevealFx>
      </main>
      <AppModal modal={modal} onClose={() => setModal(null)} />
      <CookieConsent forceOpen={cookieSettingsOpen} onClose={() => setCookieSettingsOpen(false)} />
      <footer className="site-footer">
        <div>
          <p>REST||ART Integrace</p>
          <span>Druhá šance v praxi. Mentoring, práce, bydlení, stabilizace.</span>
        </div>
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
  onClientsChange,
  onNewsChange,
  onSlidesChange,
  onClientSaveRequest,
  onNewsSaveRequest,
  onNewsDeleteRequest,
  onSlideSaveRequest,
  account,
  onLogout,
  onNotify
}: {
  clients: ClientRecord[];
  news: NewsItem[];
  slides: HomeSlide[];
  formTemplates: FormTemplate[];
  onClientsChange: React.Dispatch<React.SetStateAction<ClientRecord[]>>;
  onNewsChange: React.Dispatch<React.SetStateAction<NewsItem[]>>;
  onSlidesChange: React.Dispatch<React.SetStateAction<HomeSlide[]>>;
  onClientSaveRequest?: (client: ClientRecord) => Promise<ClientRecord>;
  onNewsSaveRequest?: (item: NewsItem) => Promise<NewsItem>;
  onNewsDeleteRequest?: (id: string) => Promise<void>;
  onSlideSaveRequest?: (item: HomeSlide) => Promise<HomeSlide>;
  account: AuthAccount;
  onLogout: () => void;
  onNotify: (tone: FeedbackTone, title: string, text?: string) => void;
}) {
  const [activeTab, setActiveTab] = React.useState<AdminSection>('dashboard');
  const [clientForm, setClientForm] = React.useState<ClientRecord>(emptyClient);
  const [selectedClientId, setSelectedClientId] = React.useState('');
  const [selectedTemplateId, setSelectedTemplateId] = React.useState(formTemplates[0]?.id ?? '');
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

  const selectedClient = clients.find((client) => client.id === selectedClientId) ?? clients[0] ?? null;
  const selectedTemplate = formTemplates.find((template) => template.id === selectedTemplateId) ?? formTemplates[0] ?? fallbackFormTemplates[0];

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
        setAdminMessage('API není dostupné, klient je uložený jen lokálně v prohlížeči.');
        onNotify('warning', 'Klient uložen jen lokálně', 'API není dostupné, záznam zůstává v prohlížeči.');
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
      setAdminMessage('Klient je uložený lokálně v prohlížeči.');
      onNotify('success', 'Klient uložen', 'Záznam je uložený lokálně v prohlížeči.');
    }
  };

  const editClient = (client: ClientRecord) => {
    setClientForm(client);
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
    onNotify('info', item ? 'Aktualita načtena k úpravě' : 'Nová aktualita', item?.title ?? 'Editor je připravený.');
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
        setAdminMessage('API není dostupné, aktualita je uložená jen lokálně v prohlížeči.');
        onNotify('warning', 'Aktualita uložena jen lokálně', 'API není dostupné.');
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
      setAdminMessage('Aktualita je uložená lokálně v prohlížeči.');
      onNotify('success', 'Aktualita uložena', 'Záznam je uložený lokálně v prohlížeči.');
    }
  };

  const deleteNews = async (item: NewsItem) => {
    if (!window.confirm(`Smazat aktualitu "${item.title}"?`)) return;
    if (onNewsDeleteRequest) {
      try {
        await onNewsDeleteRequest(item.id);
        setAdminMessageTone('success');
        setAdminMessage('Aktualita byla smazána z databáze.');
        onNotify('info', 'Aktualita smazána', item.title);
      } catch {
        setAdminMessageTone('error');
        setAdminMessage('Aktualitu se nepodařilo smazat přes API.');
        onNotify('error', 'Mazání selhalo', 'Zkuste to prosím znovu.');
        return;
      }
    }
    onNewsChange((current) => current.filter((newsItem) => newsItem.id !== item.id));
    if (newsForm.id === item.id) closeNewsDialog();
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
        setAdminMessage('API není dostupné, slide je uložený jen lokálně v prohlížeči.');
        onNotify('warning', 'Slide uložen jen lokálně', 'API není dostupné.');
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
      setAdminMessage('Slide je uložený lokálně v prohlížeči.');
      onNotify('success', 'Slide uložen', 'Záznam je uložený lokálně v prohlížeči.');
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

  const selectAdminTab = (tab: AdminSection) => {
    setActiveTab(tab);
    const labels: Record<AdminSection, string> = {
      dashboard: 'Dashboard',
      content: 'Příspěvky / obsah',
      clients: 'Klienti',
      forms: 'Formuláře',
      news: 'Aktuality',
      media: 'Média',
      users: 'Uživatelé a role',
      notifications: 'Notifikace',
      settings: 'Nastavení'
    };
    onNotify('info', 'Sekce otevřena', labels[tab]);
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
          {adminMessage && <p className={`admin-message ${adminMessageTone}`}>{adminMessage}</p>}

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
            <article className="admin-card">
              <h3>Poslední změny</h3>
              <div className="activity-list">
                {[...clients.slice(0, 3).map((client) => `Klient: ${client.firstName} ${client.lastName}`), ...news.slice(0, 3).map((item) => `Aktualita: ${item.title}`)].slice(0, 5).map((item) => (
                  <span key={item}>{item}</span>
                ))}
                {clients.length === 0 && news.length === 0 && <p className="empty-note">Zatím nejsou uložené žádné změny.</p>}
              </div>
            </article>
            <article className="admin-card">
              <h3>Rychlé akce</h3>
              <div className="quick-action-grid">
                <button type="button" onClick={() => selectAdminTab('clients')}>Registrovat klienta</button>
                <button type="button" onClick={() => selectAdminTab('news')}>Vytvořit aktualitu</button>
                <button type="button" onClick={() => selectAdminTab('forms')}>Tiskový formulář</button>
                <button type="button" onClick={() => selectAdminTab('content')}>Správa obsahu</button>
              </div>
            </article>
          </div>
        )}

        {activeTab === 'clients' && (
          <div className="admin-grid">
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
              <h3>Registr klientů</h3>
              <div className="client-list">
                {clients.length === 0 && <p className="empty-note">Zatím není uložený žádný klient.</p>}
                {clients.map((client) => (
                  <button key={client.id} type="button" onClick={() => editClient(client)}>
                    <strong>
                      {client.firstName} {client.lastName}
                    </strong>
                    <span>
                      {client.program} - {client.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'forms' && (
          <div className="forms-layout">
            <div className="admin-card no-print">
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
              <p className="form-help">{selectedTemplate.description}</p>
              {(selectedTemplate.folder || selectedTemplate.fileUrl || selectedTemplate.sourceNote) && (
                <div className="template-meta">
                  {selectedTemplate.folder && <span>{selectedTemplate.folder}</span>}
                  {selectedTemplate.sourceNote && <span>{selectedTemplate.sourceNote}</span>}
                  {selectedTemplate.fileUrl && (
                    <a href={selectedTemplate.fileUrl} target="_blank" rel="noreferrer">
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
              <button className="button primary" type="button" onClick={printForm} disabled={!selectedClient}>
                <Printer size={18} /> Tisknout k podpisu
              </button>
            </div>

            <PrintableForm client={selectedClient} template={selectedTemplate} draft={draft} />
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
                  <article key={item.id} className="news-admin-row">
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
              <h3>Náhled poslední aktuality</h3>
              {news[0] ? (
                <article className="news-preview-card">
                  <time dateTime={news[0].date}>{new Date(news[0].date).toLocaleDateString('cs-CZ')}</time>
                  <h4>{news[0].title}</h4>
                  <p>{news[0].excerpt}</p>
                  {news[0].body && <div className="news-body" dangerouslySetInnerHTML={{ __html: cleanNewsHtml(news[0].body) }} />}
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
            <WorkspacePlaceholder
              title="Knihovna souborů"
              text="Obrázky, PDF, dokumenty a soubory pro aktuality, formuláře i veřejné stránky."
              items={['Obrázky', 'Dokumenty', 'Soubory ke stažení', 'Galerie']}
            />
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
            <WorkspacePlaceholder
              title="Uživatelé a role"
              text="Správa administrátorů, editorů, klientů a oprávnění pro jednotlivé části systému."
              items={['Admin', 'Editor', 'User', 'Oprávnění modulů']}
            />
            <article className="admin-card">
              <h3>Role</h3>
              <div className="table-lite">
                <div><strong>Admin</strong><span>plný přístup</span></div>
                <div><strong>Editor</strong><span>obsah a média</span></div>
                <div><strong>User</strong><span>klientská zóna</span></div>
              </div>
            </article>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="admin-grid">
            <WorkspacePlaceholder
              title="Notifikace"
              text="Zprávy, žádosti klientů a systémová upozornění."
              items={['Nové registrace', 'Žádosti o reset hesla', 'Komentáře k aktualitám', 'Systémové chyby']}
            />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="admin-grid">
            <WorkspacePlaceholder
              title="Profil organizace"
              text="Branding, jazyk, SEO metadata, vzhled a bezpečnostní nastavení."
              items={['Logo a barvy', 'SEO metadata', 'Jazyk webu', 'Bezpečnost', 'Cookies']}
            />
            <article className="admin-card">
              <h3>Bezpečnost</h3>
              <div className="table-lite">
                <div><strong>Login</strong><span>aktivní</span></div>
                <div><strong>Role</strong><span>připraveno k rozšíření</span></div>
                <div><strong>2FA</strong><span>plánovaný modul</span></div>
              </div>
            </article>
          </div>
        )}
        </div>
        <WorkspaceBottomNav items={adminNavItems} active={activeTab} onSelect={selectAdminTab} />
      </div>
    </section>
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
