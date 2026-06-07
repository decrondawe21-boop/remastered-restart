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
  activityDetails?: Array<{
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
    activities: [
      'mentoring',
      'korespondence a návštěvy',
      'cíle a režim',
      'žádost o PP',
      'rodinné vztahy',
      'hygienické balíky',
      'pracovní návaznost',
      'stabilizace po propuštění'
    ],
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
          'David Kozák International s.r.o. zajišťuje mentoring, korespondenci s lidmi ve VTOS, návštěvy pracovníků, stanovení cílů, přípravu na podmíněné propuštění, podporu rodinných vztahů, pracovní návaznost a základní materiální pomoc pro nemajetné klienty. Po výkonu trestu nabízíme práci v Německu, ubytování, psychosociální podporu a navazující stabilizační kroky. Vše na smluvním základě, bez závislosti na dotacích.',
        items: [
          'Korespondence s vězni a příprava prvního důvěryhodného kontaktu.',
          'Návštěvy pracovníků a osobní mapování situace ještě před výstupem.',
          'Stanovení konkrétních cílů, termínů a kontrola jejich dodržování.',
          'Podpora při přípravě žádosti o podmíněné propuštění.',
          'Snaha o obnovu nebo zklidnění vztahů s rodinou, pokud je to bezpečné.',
          'Hygienické balíky a základní hmotná pomoc pro nemajetné klienty.'
        ]
      }
    ],
    activityDetails: [
      {
        title: 'Mentoring',
        text:
          'Pravidelný kontakt s člověkem, který pomáhá držet směr po výkonu trestu nebo při přípravě na výstup. Mentor neřeší klienta místo něj, ale pomáhá mu převádět plán do konkrétních kroků.',
        items: [
          'nastavení osobního plánu a priorit',
          'pravidelné konzultace a kontrola postupu',
          'podpora při komunikaci s institucemi',
          'práce s odpovědností, režimem a motivací',
          'dohoda na cílech, které se dají průběžně ověřovat'
        ]
      },
      {
        title: 'Korespondence a návštěvy',
        text:
          'Práce s klientem může začít ještě ve výkonu trestu. Korespondence, návštěvy pracovníků a osobní kontakt pomáhají ověřit motivaci, situaci i reálné možnosti ještě před výstupem.',
        items: [
          'korespondence s vězni a postupné mapování potřeb',
          'návštěvy pracovníků tam, kde je to možné a smysluplné',
          'fyzický kontakt jako důležitý prvek důvěry a odpovědnosti',
          'příprava konkrétních kroků ještě před propuštěním'
        ]
      },
      {
        title: 'Cíle a režim',
        text:
          'Bez konkrétních cílů se druhá šance rychle rozpadne na dobrý úmysl. Společně nastavujeme reálné kroky, termíny a jednoduchý režim, který se dá dodržet i ve stresu.',
        items: [
          'stanovení krátkodobých a dlouhodobých cílů',
          'kontrola dodržování domluvených kroků',
          'práce s docházkou, komunikací a odpovědností',
          'včasné pojmenování rizik, která mohou plán rozbít'
        ]
      },
      {
        title: 'Žádost o PP',
        text:
          'U klientů, kde to dává smysl, pomáháme připravit podklady a realistický plán pro žádost o podmíněné propuštění. Nejde o slib výsledku, ale o odpovědnou přípravu.',
        items: [
          'mapování situace a reálných podmínek pro PP',
          'příprava plánu práce, bydlení a následné podpory',
          'pomoc s formulací konkrétních závazků',
          'důraz na odpovědnost, nikoli na prázdné prohlášení'
        ]
      },
      {
        title: 'Rodinné vztahy',
        text:
          'Rodina může být oporou, ale také zdrojem bolesti a rizika. Program pomáhá hledat bezpečný způsob, jak vztahy uklidnit, obnovit nebo nastavit zdravé hranice.',
        items: [
          'citlivé mapování vztahů s rodinou a blízkými',
          'snaha o léčbu vztahů tam, kde je to bezpečné',
          'podpora při komunikaci a omluvě bez tlaku na druhou stranu',
          'nastavení hranic, pokud návrat do rodiny není vhodný'
        ]
      },
      {
        title: 'Hygienické balíky',
        text:
          'Někteří lidé nemají při výstupu ani základní věci. Hygienický balík a drobná hmotná pomoc nejsou charita pro efekt, ale praktický start, který snižuje ponížení a chaos prvních dnů.',
        items: [
          'základní hygienické potřeby pro nemajetné klienty',
          'praktické minimum pro první dny po výstupu',
          'pomoc podle skutečné nouze, ne podle dojmu',
          'navázání materiální pomoci na další konkrétní kroky'
        ]
      },
      {
        title: 'Pracovní návaznost',
        text:
          'Návrat do práce je praktická změna režimu. Pomáháme s výběrem vhodné práce, přípravou na nástup, první komunikací se zaměstnavatelem a zvládnutím prvních týdnů.',
        items: [
          'mapování zkušeností a reálných možností',
          'příprava životopisu, pohovoru a nástupu',
          'doprovod při prvním kontaktu se zaměstnavatelem',
          'podpora při udržení docházky a pracovních návyků'
        ]
      },
      {
        title: 'Návazná stabilizace po propuštění',
        text:
          'První týdny po propuštění rozhodují. Stabilizace drží práci, bydlení, režim, finance a vztahy tak, aby první chyba neznamenala návrat do starého kruhu.',
        items: [
          'follow-up po propuštění a pravidelný kontakt',
          'podpora při bydlení, práci a financích',
          'řešení konfliktů a krizových situací včas',
          'postupné snižování podpory podle stability klienta'
        ]
      }
    ],
    contactBox: {
      title: 'Kontaktní zázemí programu',
      lines: ['David Kozák International s.r.o.', 'Drážďanská 517/52, 400 07 Ústí nad Labem', 'restart@dk-i.cz']
    }
  },
  {
    title: 'RESET',
    audience: 'Lidé v závislosti, sociální krizi nebo bez stabilního zázemí',
    goal: 'Obnova důstojnosti, základních návyků a dlouhodobé životní stability.',
    activities: ['individuální podpora', 'komunitní terapie', 'dluhové poradenství', 'terapeutická pomoc'],
    icon: Sprout,
    duration: '3-9 měsíců podle míry krize a stabilizace',
    featureText:
      'RESET je prostor pro lidi, kterým se rozpadl režim, vztahy, zdraví nebo bezpečné zázemí. Nezačínáme tlakem na výkon, ale návratem k základům: bezpečí, důvěra, zdraví, dokumenty, dluhy a malé kroky, které se dají opakovat.',
    quote: {
      text: 'Nejde o rychlou nápravu. Jde o návrat k rytmu, který člověk dokáže unést i zítra.',
      caption: 'RESET | stabilizace po krizi'
    },
    sections: [
      {
        label: 'První stabilizace',
        title: 'Bezpečí, režim a důvěra',
        text:
          'První fáze programu pomáhá zastavit chaos. Společně mapujeme aktuální situaci, rizika, dluhy, zdraví, bydlení a vztahy tak, aby člověk získal alespoň minimální oporu pro další rozhodnutí.'
      },
      {
        label: 'Závislosti a krize',
        title: 'Podpora bez moralizování',
        text:
          'RESET pracuje s realitou, ne s dokonalým obrazem klienta. Důležitá je pravidelnost kontaktu, jasná dohoda a postupné přebírání odpovědnosti.',
        items: [
          'Individuální plán stabilizace a krizové mapování.',
          'Komunitní a terapeutická návaznost podle situace.',
          'Dluhové, dokumentové a praktické minimum.',
          'Podpora při návratu ke zdravým návykům a vztahům.'
        ]
      },
      {
        label: 'Směr dál',
        title: 'Z krize k odpovědnosti',
        text:
          'Jakmile se situace uklidní, navazujeme na další pilíře REST||ART Integrace. Cílem není závislost na pomoci, ale schopnost znovu držet vlastní život v rukou.'
      }
    ],
    contactBox: {
      title: 'Kontakt pro program RESET',
      lines: ['REST||ART Integrace', '+420 778 564 279', 'restart@dk-i.cz']
    }
  },
  {
    title: 'REWORK',
    audience: 'Dlouhodobě nezaměstnaní a lidé s bariérami',
    goal: 'Zlepšení zaměstnatelnosti a bezpečný vstup na pracovní trh.',
    activities: ['kariérní vedení', 'rekvalifikace', 'pracovní stáže', 'spolupráce se zaměstnavateli'],
    icon: Briefcase,
    duration: '2-6 měsíců podle připravenosti k práci',
    featureText:
      'REWORK staví most mezi člověkem a pracovním trhem. Neřeší jen životopis, ale i režim, docházku, komunikaci, dluhy, motivaci a bezpečné pracovní prostředí, ve kterém se dá znovu začít.',
    quote: {
      text: 'Práce není jen příjem. Je to režim, kontakt, odpovědnost a důvod vstát.',
      caption: 'REWORK | návrat k práci'
    },
    sections: [
      {
        label: 'Mapování bariér',
        title: 'Nejdřív zjistit, co skutečně brání práci',
        text:
          'U každého klienta hledáme konkrétní překážky: chybějící doklady, exekuce, nestabilní bydlení, zdravotní omezení, strach z nástupu nebo dlouhý výpadek z pracovního rytmu.'
      },
      {
        label: 'Příprava na práci',
        title: 'Režim, dovednosti a trénink',
        text:
          'Pracujeme s praktickými úkoly, rekvalifikací, pohovory, zkušebními směnami a nácvikem komunikace. Klient ví, co se od něj očekává, a zaměstnavatel ví, s čím počítat.',
        items: [
          'Kariérní vedení a pracovní plán.',
          'Rekvalifikace a doplnění základních dovedností.',
          'Příprava na pohovor, nástup a první týdny v práci.',
          'Doprovod při komunikaci se zaměstnavatelem.'
        ]
      },
      {
        label: 'Spolupráce s firmami',
        title: 'Druhá šance musí být dobře připravená',
        text:
          'Firmám nabízíme jasný rámec spolupráce. Druhá šance není charita bez hranic, ale dohoda, odpovědnost a podpora v prvních kritických týdnech.'
      }
    ],
    contactBox: {
      title: 'Kontakt pro program REWORK',
      lines: ['REST||ART Integrace', '+420 778 564 279', 'restart@dk-i.cz']
    }
  },
  {
    title: 'STREETWISE',
    audience: 'Lidé bez domova, mladí lidé v riziku a lidé mimo dosah systému',
    goal: 'Bezpečný první kontakt v terénu, nízkoprahové zázemí a konkrétní krok zpět ke stabilitě.',
    activities: ['terénní kontakt', 'nízkoprahové zázemí', 'hygiena, dokumenty a první plán', 'napojení na práci a bydlení'],
    icon: MapPinned,
    duration: 'první kontakt ihned, návaznost podle situace',
    featureText:
      'Z věcí, které měly skončit, stavíme nové zázemí. STREETWISE vzniká z materiálu, práce, trpělivosti a víry, že i odepsané věci mohou znovu sloužit. Stejnou logiku neseme k lidem: neodepisovat, zůstat poblíž a najít první bezpečný krok.',
    quote: {
      text:
        'REST||ART Integrace vzniká stejně jako naše bouda: z materiálu, práce, trpělivosti a víry, že i odepsané věci mohou znovu sloužit.',
      caption: 'STREETWISE | zázemí, které roste'
    },
    sections: [
      {
        label: 'Nízkoprahové zázemí',
        title: 'Střecha pro první krok',
        text:
          'STREETWISE buduje praktické místo pro první kontakt: bezpečí, rozhovor, hygienu, dokumenty, základní orientaci a plán. Někdy stačí stůl, židle, klid a člověk, který neutíká pryč.'
      },
      {
        label: 'Terén',
        title: 'Být poblíž, když člověk ještě nevěří systému',
        text:
          'Lidé bez domova často nepřijdou sami do kanceláře. Terénní práce proto začíná tam, kde člověk skutečně je, a postupně ho vede k dalším krokům.',
        items: [
          'První rozhovor bez tlaku a bez zbytečné administrativy.',
          'Pomoc s doklady, kontakty, hygienou a základní orientací.',
          'Napojení na práci, bydlení, zdravotní péči nebo další program.',
          'Dlouhodobější doprovod, pokud člověk chce změnu držet.'
        ]
      },
      {
        label: 'Smysl zázemí',
        title: 'Z odepsaného materiálu vzniká prostor pro návrat',
        text:
          'Bouda stavěná ze zachráněného dřeva a věcí z demolic je i symbolem programu. To, co mělo skončit, může dostat nový účel. Stejně pracujeme s lidmi na okraji.'
      }
    ],
    contactBox: {
      title: 'Kontakt pro program STREETWISE',
      lines: ['REST||ART Integrace', '+420 778 564 279', 'restart@dk-i.cz']
    },
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
    icon: UsersRound,
    duration: '6-18 měsíců podle věku a podpůrné sítě',
    featureText:
      'BOD ZLOMU je pro mladé lidi, kteří odcházejí z dětského domova, ústavní péče nebo z prostředí, kde chyběla bezpečná opora. Právě přechod do dospělosti může rozhodnout, jestli člověk spadne do chaosu, nebo najde směr.',
    quote: {
      text: 'Bod zlomu může být pád, ale také okamžik, kdy se poprvé objeví směr.',
      caption: 'BOD ZLOMU | přechod do samostatnosti'
    },
    sections: [
      {
        label: 'Přechod do samostatnosti',
        title: 'Nenechat mladého člověka stát na prahu samotného',
        text:
          'Program pomáhá zvládnout první období samostatnosti: bydlení, dokumenty, školu, práci, finance, vztahy a hranice. Cílem je, aby mladý člověk nemusel všechno pochopit až přes průšvih.'
      },
      {
        label: 'Praktický život',
        title: 'Věci, které se ve škole často neučí',
        text:
          'BOD ZLOMU dává praktický rámec pro každodenní fungování. Vedeme klienty k tomu, aby rozuměli smlouvám, penězům, komunikaci s úřady i rizikům vztahů, které mohou zneužívat jejich nejistotu.',
        items: [
          'Trénink samostatného bydlení a základního hospodaření.',
          'Podpora při škole, práci nebo rekvalifikaci.',
          'Mentoring a bezpečný dospělý kontakt.',
          'Rozvoj zdravých hranic, vztahů a odpovědnosti.'
        ]
      },
      {
        label: 'Dlouhodobý směr',
        title: 'Mladý člověk nepotřebuje jen radu, ale oporu',
        text:
          'Snažíme se vytvořit podpůrnou síť, která mladého člověka drží i po prvním úspěchu. Samostatnost není skok, ale proces.'
      }
    ],
    contactBox: {
      title: 'Kontakt pro program BOD ZLOMU',
      lines: ['REST||ART Integrace', '+420 778 564 279', 'restart@dk-i.cz']
    }
  },
  {
    title: 'STABILIZACE',
    audience: 'Lidé, kteří prošli změnou a chtějí ji udržet',
    goal: 'Dlouhodobé udržení práce, bydlení, duševní rovnováhy a komunitního zapojení.',
    activities: ['follow-up', 'podporované bydlení', 'komunitní podpora', 'zdravotní a psychologická péče'],
    icon: Home,
    duration: 'dlouhodobý follow-up podle potřeb klienta',
    featureText:
      'STABILIZACE drží změnu po skončení intenzivní podpory. Sleduje práci, bydlení, zdraví, vztahy, finance a rizika návratu do starých vzorců. Pomoc se zmenšuje postupně, ne skokem.',
    quote: {
      text: 'Úspěch není jen vstát. Úspěch je vydržet stát i po prvním nárazu.',
      caption: 'STABILIZACE | udržení změny'
    },
    sections: [
      {
        label: 'Follow-up',
        title: 'Změna potřebuje dohled i po úspěchu',
        text:
          'Největší riziko často přichází ve chvíli, kdy to zvenku vypadá dobře. STABILIZACE proto nabízí následný kontakt, kontrolu plánů a včasné zachycení problémů.'
      },
      {
        label: 'Bydlení, práce, vztahy',
        title: 'Udržet to, co se podařilo vybudovat',
        text:
          'Pomáháme klientům řešit konflikty, výpadky v práci, změny bydlení, dluhy, zdraví a tlak okolí. Cílem je, aby krize nestrhla celý předchozí proces.',
        items: [
          'Pravidelný kontakt a kontrola stabilizačního plánu.',
          'Podpora při udržení práce a bydlení.',
          'Napojení na komunitu, služby a bezpečné vztahy.',
          'Rychlá reakce při riziku relapsu nebo sociálního propadu.'
        ]
      },
      {
        label: 'Ukončení podpory',
        title: 'Od pomoci k samostatnému fungování',
        text:
          'Program směřuje k tomu, aby klient podporu postupně nepotřeboval. Stabilita se pozná podle toho, že člověk umí požádat o pomoc včas a zároveň zvládá běžné věci sám.'
      }
    ],
    contactBox: {
      title: 'Kontakt pro stabilizační podporu',
      lines: ['REST||ART Integrace', '+420 778 564 279', 'restart@dk-i.cz']
    }
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
  { value: '127+', label: 'klientů v integračním procesu' },
  { value: '6', label: 'aktivních programů REST||ART' },
  { value: '78 %', label: 'úspěšnost stabilizace' }
];

export const realityCards = [
  {
    value: '600 000 Kč',
    title: 'Náklad systému na člověka za rok',
    text: 'Konzervativní model nákladů spojených s uvězněním, opakovanou krizí nebo dlouhodobým propadem bez stabilizace.'
  },
  {
    value: '50 000 Kč',
    title: 'Reintegrace na člověka za rok',
    text: 'Mentoring, praktická pomoc, doprovod, první materiální zajištění a návrat do režimu běžného života.'
  },
  {
    value: '550 000 Kč',
    title: 'Rozdíl, který lze vrátit do života',
    text: 'Každý úspěšný návrat snižuje tlak na systém a zároveň vrací člověku důstojnost, práci a odpovědnost.'
  }
];

export const solutionPrinciples = [
  {
    title: 'Propojení',
    text: 'Spojujeme lidi, firmy, obce, instituce a konkrétní příležitosti.'
  },
  {
    title: 'Příběhy',
    text: 'Za každým klientem je konkrétní cesta, ne anonymní položka ve statistice.'
  },
  {
    title: 'Odpovědnost',
    text: 'Druhá šance není bezbřehá tolerance. Je to jasný plán, dohoda a práce.'
  },
  {
    title: 'Udržitelnost',
    text: 'Cílem není jednorázová pomoc, ale stav, který vydrží i po skončení programu.'
  }
];

export const impactMetrics = [
  {
    value: '-53 p. b.',
    title: 'modelové snížení recidivy',
    text: 'Dlouhodobá práce, režim a návazné zaměstnání významně snižují riziko návratu do stejného kruhu.'
  },
  {
    value: '550 000 Kč',
    title: 'potenciální roční úspora',
    text: 'Rozdíl mezi pasivním nákladem systému a aktivní reintegrací se dá převést do konkrétní pomoci.'
  },
  {
    value: 'stabilní opora',
    title: 'práce, bydlení, režim',
    text: 'Výsledek měříme tím, zda má člověk kam jít, co dělat a komu se ozvat, když přijde krize.'
  }
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
  { label: 'E-mail', value: 'restartintegrace@dk-i.cz', href: 'mailto:restartintegrace@dk-i.cz' },
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
    id: 'news-second-chance',
    title: 'Ne každý má možnosti. REST||ART umožňuje zkusit to znovu.',
    date: '2026-06-03',
    excerpt:
      'Společně vracíme lidem šanci na normální život: práci, režim, zázemí a podporu v okamžiku, kdy ji opravdu potřebují.'
  },
  {
    id: 'news-meeting-support',
    title: '28.05.2026 - 10:00 schůzka',
    date: '2026-05-28',
    excerpt:
      'Jednání o podporu projektu, na kterém závisí další rozvoj programů REST||ART Integrace a jejich praktického zázemí.'
  },
  {
    id: 'news-people-on-edge',
    title: 'Lidé na okraji společnosti',
    date: '2026-05-13',
    excerpt:
      'Nabízíme konkrétní cestu těm, kteří stojí mimo systém: bezpečný první kontakt, mentoring, práci a návaznou stabilizaci.'
  }
];
