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
  duration?: string;
  featureText?: string;
  quote?: {
    text: string;
    caption?: string;
  };
  stats?: Array<{
    value: string;
    label: string;
  }>;
  sections?: Array<{
    label: string;
    title: string;
    text: string;
    items?: string[];
  }>;
  contactBox?: {
    title: string;
    lines: string[];
  };
  image?: {
    src: string;
    alt: string;
  };
}

export const programs: Program[] = [
  {
    title: 'JAILBREAK',
    audience: 'Osoby po i ve výkonu trestu a lidé, kteří se ocitli na dně a potřebují znovu do běžného života.',
    goal: 'Životní restart, snížení recidivy a bezpečný návrat do práce, bydlení a běžného fungování.',
    activities: ['mentoring', 'pracovní asistence', 'rekvalifikace', 'psychosociální podpora', 'příprava na výstup', 'návazná stabilizace po propuštění'],
    icon: ShieldCheck,
    duration: '6-12 měsíců dle profilu klienta',
    featureText:
      'Projekt JAILBREAK otevírá novou kapitolu života lidem po výkonu trestu. Po výstupu nemá přijít jen svoboda, ale také struktura, odpovědnost, práce a návazná opora.',
    quote: {
      text:
        'Neslibujeme iluze. Nabízíme konkrétní cestu. Program funguje, protože propojuje to, co společnost potřebuje, s tím, co jednotlivci skutečně hledají.',
      caption: 'JAILBREAK | druhá šance v praxi'
    },
    stats: [
      { value: '-70 %', label: 'míra recidivy u propuštěných vězňů' },
      { value: '583', label: 'vězňů na 100 000 obyvatel v ČR' },
      { value: '108,4 %', label: 'aktuální přeplněnost věznic' }
    ],
    sections: [
      {
        label: 'Význam názvu',
        title: 'Ne útěk z vězení, ale životní restart',
        text:
          'Název JAILBREAK neznamená útěk z vězení. Stejně jako v IT označuje odblokování systému, i tady jde o překročení minulosti a nalezení nové cesty dál.'
      },
      {
        label: 'Konkrétní přínos programu',
        title: 'Každá úspěšná reintegrace snižuje riziko další kriminality',
        text:
          'JAILBREAK nestaví na frázi o druhé šanci, ale na konkrétním přechodu do práce, režimu a běžného života.',
        items: [
          'Snížení recidivy a opakovaného uvěznění.',
          'Rychlejší a cílenější rehabilitace odsouzených.',
          'Využití času ve VTOS pro přípravu na návrat.',
          'Posílení pracovních a sociálních návyků.',
          'Následné zaměstnání a ubytování po propuštění.',
          'Možnost nové identity a života pro ty, kteří chtějí změnu.'
        ]
      },
      {
        label: 'Jak to děláme',
        title: 'Mentoring, práce a opora',
        text:
          'David Kozák International s.r.o. zajišťuje mentoring, pracovní asistenci, rekvalifikaci a kontakt s realitou. Po výkonu trestu nabízíme práci v Německu, ubytování, psychosociální podporu a navazující stabilizační kroky. Vše na smluvním základě, bez závislosti na dotacích.'
      }
    ],
    contactBox: {
      title: 'Kontaktní zázemí programu',
      lines: ['David Kozák International s.r.o.', 'Drážďanská 517/52, 400 07 Ústí nad Labem', 'restartintegrace@dk-i.cz']
    }
  },
  {
    title: 'RESET',
    audience: 'Lidé bez domova, v závislosti nebo v sociální krizi',
    goal: 'Obnova důstojnosti, základních návyků a dlouhodobé životní stability.',
    activities: ['individuální podpora', 'komunitní terapie', 'dluhové poradenství', 'terapeutická pomoc'],
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
    audience: 'Lidé bez domova, mladí lidé v riziku a lidé mimo dosah systému',
    goal: 'Bezpečný první kontakt v terénu, nízkoprahové zázemí a konkrétní krok zpět ke stabilitě.',
    activities: ['terénní kontakt', 'nízkoprahové zázemí', 'hygiena, dokumenty a první plán', 'napojení na práci a bydlení'],
    icon: MapPinned,
    featureText:
      'Z věcí, které měly skončit, stavíme nové zázemí. STREETWISE vzniká z materiálu, práce, trpělivosti a víry, že i odepsané věci mohou znovu sloužit. Stejnou logiku neseme k lidem: neodepisovat, zůstat poblíž a najít první bezpečný krok.',
    image: {
      src: '/images/crops/streetwise/streetwise-bouda-stavba.jpg',
      alt: 'Rozpracované zázemí STREETWISE stavěné ze zachráněného materiálu'
    }
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
