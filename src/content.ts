import {
  Briefcase,
  Building2,
  HandHeart,
  HeartHandshake,
  Home,
  Landmark,
  Leaf,
  MapPinned,
  ShieldCheck,
  Sprout,
  UsersRound
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface Program {
  title: string;
  audience: string;
  goal: string;
  activities: string[];
  icon: LucideIcon;
}

export const programs: Program[] = [
  {
    title: 'JAILBREAK',
    audience: 'Lidé po výkonu trestu',
    goal: 'Návazná podpora po propuštění, návrat do běžného života a prevence recidivy.',
    activities: ['mentoring', 'pracovní asistence', 'právní a bytová podpora', 'psychologická opora'],
    icon: ShieldCheck
  },
  {
    title: 'RESET',
    audience: 'Lidé bez domova, v závislosti nebo v sociální krizi',
    goal: 'Obnova důstojnosti, základních návyků a dlouhodobé životní stability.',
    activities: ['individuální podpora', 'rekvalifikace', 'dluhové poradenství', 'terapeutická pomoc'],
    icon: Sprout
  },
  {
    title: 'REWORK',
    audience: 'Dlouhodobě nezaměstnaní a lidé s bariérami',
    goal: 'Zlepšení zaměstnatelnosti a bezpečný vstup na pracovní trh.',
    activities: ['kariérní vedení', 'rekvalifikace', 'pracovní stáže', 'spolupráce se zaměstnavateli'],
    icon: Briefcase
  },
  {
    title: 'STREETWISE',
    audience: 'Mladí lidé a lidé v rizikovém prostředí',
    goal: 'První kontakt v terénu, prevence sociálního vyloučení a napojení na pomoc.',
    activities: ['streetwork', 'komunitní práce', 'prevence kriminality', 'podpora vzdělávání'],
    icon: MapPinned
  },
  {
    title: 'BOD ZLOMU',
    audience: 'Mládež z dětských domovů a ústavní péče',
    goal: 'Podpora samostatnosti, zdravých vztahů a pozitivního životního směru.',
    activities: ['mentoring', 'tréninkové bydlení', 'rozvojové aktivity', 'psychoterapeutická podpora'],
    icon: UsersRound
  },
  {
    title: 'STABILIZACE',
    audience: 'Lidé, kteří prošli změnou a chtějí ji udržet',
    goal: 'Dlouhodobé udržení práce, bydlení, duševní rovnováhy a komunitního zapojení.',
    activities: ['follow-up', 'podporované bydlení', 'komunitní podpora', 'zdravotní a psychologická péče'],
    icon: Home
  }
];

export const focusAreas = [
  {
    title: 'Mentoring',
    text: 'Individuální vedení, podpora a motivace. Pomáháme lidem překonat překážky, které brání návratu do běžného života.',
    icon: HandHeart
  },
  {
    title: 'Práce',
    text: 'Spolupracujeme se zaměstnavateli, pomáháme s přípravou, rekvalifikací i nástupem do zaměstnání.',
    icon: Briefcase
  },
  {
    title: 'Bydlení',
    text: 'Stabilní zázemí je podmínkou změny. Podporujeme bezpečný přechod k samostatnému bydlení.',
    icon: Building2
  },
  {
    title: 'Stabilizace',
    text: 'Pracujeme s financemi, dokumenty, zdravím, vztahy a každodenním režimem. Krok za krokem vracíme život do rovnováhy.',
    icon: Leaf
  }
];

export const supportPaths = [
  {
    title: 'Pro jednotlivce',
    text: 'Potřebujete pomoc se startem, prací, bydlením nebo návaznou podporou? Ozvěte se. První krok může být krátká zpráva.'
  },
  {
    title: 'Pro firmy',
    text: 'Hledáme zaměstnavatele, kteří umí dát férovou šanci a chtějí být součástí návratu lidí do stabilního života.'
  },
  {
    title: 'Pro instituce a obce',
    text: 'Navazujeme na věznice, úřady, školy, komunitní služby a další organizace, které pracují s lidmi v riziku.'
  }
];

export const stats = [
  { value: '6', label: 'programových linií' },
  { value: '4', label: 'hlavní oblasti pomoci' },
  { value: '1', label: 'konkrétní plán změny' }
];

export const principles = [
  'osobní přístup',
  'dlouhodobá spolupráce',
  'respekt a důstojnost',
  'reálné výsledky',
  'propojení sociální práce, mentoringu a praxe',
  'spolupráce s firmami, obcemi a institucemi'
];

export const contacts = [
  { label: 'E-mail', value: 'kozak.david@dk-i.cz', href: 'mailto:kozak.david@dk-i.cz' },
  { label: 'Telefon', value: '+420 778 564 279', href: 'tel:+420778564279' },
  { label: 'Adresa', value: 'Drážďanská 517/52, 400 07 Ústí nad Labem' }
];

export const partnerTypes = [
  { title: 'Věznice a justice', icon: Landmark },
  { title: 'Zaměstnavatelé', icon: Briefcase },
  { title: 'Obce a školy', icon: Home },
  { title: 'Neziskové služby', icon: HeartHandshake }
];

export const starterNews = [
  {
    id: 'news-start',
    title: 'REST||ART Integrace připravuje program druhých šancí',
    date: '2026-06-02',
    excerpt:
      'Vzniká nový veřejný a interní systém pro práci s klienty, partnery, aktualitami a formuláři projektu.'
  },
  {
    id: 'news-programs',
    title: 'Programy staví na mentoringu, práci, bydlení a stabilizaci',
    date: '2026-05-28',
    excerpt:
      'Základní programové linie propojují postpenitenciární podporu, terénní práci, rekvalifikace a dlouhodobé doprovázení.'
  }
];
