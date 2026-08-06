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
      'Projekt JAILBREAK otevírá novou kapitolu života lidem po výkonu trestu. Po výstupu nemá přijít jen svoboda, ale také struktura, odpovědnost, práce a návazná opora. Svoboda bez plánu často znamená jen další zkoušku; JAILBREAK proto spojuje přípravu ještě před výstupem s konkrétním zázemím po návratu.',
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
        label: 'Proč existuje',
        title: 'REST||ART není tabulka. Je to odpověď.',
        text:
          'Program vznikl jako odpověď na ticho v systému, který často přehlíží lidi po pádu a nechává je mezi stigmatem, bariérami a dalším rizikem propadu. JAILBREAK není další formální projekt pro výkaz. Je to praktická cesta, jak z času ve výkonu trestu udělat přípravu na návrat a z návratu udělat skutečný restart.',
        items: [
          'Začínáme motivací, kontaktem a plánem, ne až krizí po propuštění.',
          'Propojujeme práci, bydlení, režim, vztahy a následnou stabilizaci.',
          'Druhá šance znamená odpovědnost na obou stranách: podporu i jasné závazky.'
        ]
      },
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
          'JAILBREAK nestaví na frázi o druhé šanci, ale na konkrétním přechodu do práce, režimu a běžného života. Nečekáme, až lidé znovu spadnou, ale nechceme je ani nechat ležet, když už spadli.',
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
          'David Kozák International s.r.o. zajišťuje mentoring, korespondenci s lidmi ve VTOS, návštěvy pracovníků, stanovení cílů, přípravu na podmíněné propuštění, podporu rodinných vztahů, pracovní návaznost a základní materiální pomoc pro nemajetné klienty. Po výkonu trestu nabízíme práci, ubytování, psychosociální podporu a navazující stabilizační kroky. Vše stojí na smluvním rámci, osobní odpovědnosti a spolupráci, která má být skutečná, ne jen výkazově přijatelná.',
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
      src: '/images/crops/streetwise/streetwise-bouda-stavba.webp',
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
    text: 'Individuální vedení, podpora a motivace. Mentor pomáhá převést druhou šanci z dobrého úmyslu do konkrétních kroků: domluva, termín, kontrola, odpovědnost a kontakt ve chvíli, kdy člověk začíná ztrácet směr.',
    icon: HandHeart
  },
  {
    title: 'Práce',
    text: 'Spolupracujeme se zaměstnavateli, pomáháme s přípravou, rekvalifikací i nástupem do zaměstnání. Práce není jen příjem; je to rytmus, důvěra, odpovědnost a jeden z nejrychlejších způsobů, jak se vrátit do běžného života.',
    icon: Briefcase
  },
  {
    title: 'Bydlení',
    text: 'Stabilní zázemí je podmínkou změny. Bez místa, kam se člověk může vracet, se i dobrý plán rychle rozpadá. Podporujeme bezpečný přechod k bydlení, režimu a samostatnosti.',
    icon: Building2
  },
  {
    title: 'Stabilizace',
    text: 'Pracujeme s financemi, dokumenty, zdravím, vztahy a každodenním režimem. Stabilizace není jednorázová pomoc, ale doprovod v prvních týdnech a měsících, kdy se rozhoduje, jestli změna vydrží.',
    icon: Leaf
  }
];

export const supportPaths = [
  {
    title: 'Pro jednotlivce',
    text: 'Potřebujete pomoc se startem, prací, bydlením nebo návaznou podporou? Ozvěte se. Není nutné mít dokonale připravený příběh ani plán. První krok může být krátká zpráva a ochota začít mluvit pravdivě.'
  },
  {
    title: 'Pro firmy',
    text: 'Hledáme zaměstnavatele, kteří umí dát férovou šanci a chtějí být součástí návratu lidí do stabilního života. Nabízíme rámec, doprovod a komunikaci, aby druhá šance nebyla rizikem bez opory, ale připravenou spoluprací.'
  },
  {
    title: 'Pro instituce a obce',
    text: 'Navazujeme na věznice, úřady, školy, komunitní služby a další organizace, které pracují s lidmi v riziku. Nehledáme grantové rivaly ani formální partnerství na papíře, ale společný směr, odvahu a odpovědnost.'
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
    text: 'Spojujeme lidi, firmy, obce, instituce a konkrétní příležitosti. Systém začne fungovat až ve chvíli, kdy spolu jeho části skutečně mluví.'
  },
  {
    title: 'Příběhy',
    text: 'Za každým klientem je konkrétní cesta, ne anonymní položka ve statistice. Nejde o to vylepšit výkaz, ale vrátit člověku šanci na normální den.'
  },
  {
    title: 'Odpovědnost',
    text: 'Druhá šance není bezbřehá tolerance. Je to jasný plán, dohoda a práce. Podpora má smysl jen tehdy, když vede k převzetí odpovědnosti.'
  },
  {
    title: 'Udržitelnost',
    text: 'Cílem není jednorázová pomoc, ale stav, který vydrží i po skončení programu. Pomoc má člověka postavit na nohy, ne vytvořit další závislost.'
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
    id: 'field-update-zabradli-u-zakladny-2026-08',
    slug: 'vedle-zakladny-roste-nove-zabradli-krok-za-krokem',
    title: 'Vedle základny roste nové zábradlí. Krok za krokem',
    date: '2026-08-06',
    tag: 'Stavíme svépomocí',
    excerpt:
      'U vstupu vedle základny postupně vzniká dřevěné zábradlí. Od přípravy prostoru přes osazení jednotlivých dílů až po zpevnění a ochranný nátěr.',
    imageUrl: '/images/news/zabradli-u-zakladny/04-soucasny-stav-zabradli.jpg',
    body: [
      '<p>Vedle základny pokračujeme v úpravě vstupního prostoru. Místo, které bylo otevřené a nepřehledné, postupně doplňujeme dřevěným zábradlím. Práce vzniká po částech podle prostoru, dostupného materiálu a toho, co je potřeba průběžně upravit.</p>',
      '<div class="project-status"><span class="project-status-badge">Stav k 6. srpnu 2026</span><strong>Bezpečnější a jasněji vymezený vstup</strong><p>Zábradlí už tvoří pevnou hranici vedle vstupu. Ještě pokračujeme v kontrole spojů a dokončovacích úpravách.</p></div>',
      '<h2>Jak práce postupovala</h2>',
      '<div class="project-gallery">',
      '<figure class="project-gallery-card"><img src="/images/news/zabradli-u-zakladny/01-priprava-prostoru.jpg" alt="Prostor vedle základny před stavbou zábradlí"><figcaption><strong>1. Příprava prostoru.</strong> Nejprve bylo potřeba uvolnit průchod, srovnat místo a připravit jednotlivé dřevěné díly.</figcaption></figure>',
      '<figure class="project-gallery-card"><img src="/images/news/zabradli-u-zakladny/02-prvni-cast-zabradli.jpg" alt="První osazená část dřevěného zábradlí"><figcaption><strong>2. První osazená část.</strong> Základní rám a svislé výplně začaly vymezovat okraj vstupu.</figcaption></figure>',
      '<figure class="project-gallery-card"><img src="/images/news/zabradli-u-zakladny/03-zpevneni-a-nater.jpg" alt="Zpevněné dřevěné zábradlí s ochranným nátěrem"><figcaption><strong>3. Zpevnění a nátěr.</strong> Jednotlivé prvky jsme spojili, srovnali a ošetřili tmavým ochranným nátěrem.</figcaption></figure>',
      '<figure class="project-gallery-card"><img src="/images/news/zabradli-u-zakladny/04-soucasny-stav-zabradli.jpg" alt="Současný stav zábradlí vedle základny REST ART"><figcaption><strong>4. Současný stav.</strong> Zábradlí už navazuje na vstup a vytváří pevnější a přehlednější oddělení prostoru.</figcaption></figure>',
      '</div>',
      '<h2>Co ještě zbývá</h2>',
      '<ul><li>zkontrolovat a případně dotáhnout všechny spoje,</li><li>dokončit drobné povrchové úpravy,</li><li>uvolnit a uspořádat okolí vstupu,</li><li>sledovat, jak konstrukce obstojí při běžném používání.</li></ul>',
      '<p><strong>Stavíme postupně a ukazujeme celý průběh.</strong> I menší úprava může výrazně změnit bezpečnost a každodenní fungování místa.</p>'
    ].join('')
  },
  {
    id: 'field-update-paletove-posezeni-2026-08',
    slug: 'makame-dal-paletove-posezeni-vznika-u-nas',
    title: 'Makáme dál: z palet roste vlastní posezení',
    date: '2026-08-04',
    tag: 'Práce v terénu',
    excerpt:
      'Inspirovali jsme se jednoduchým vzorem a pustili se do práce. Z použitých palet už vzniklo vlastní posezení — krok za krokem, vlastníma rukama a z materiálu, který dostal další využití.',
    imageUrl: '/images/updates/srpen-2026/zakladna/03-zazemi-lavice.jpg',
    body: [
      '<p>Vzor nám ukázal směr. Rozhodující část ale vznikla až u nás: rozebrat materiál, vybrat použitelné díly, poskládat a zpevnit konstrukci a postupně z ní udělat funkční kus nábytku.</p>',
      '<div class="progress-comparison">',
      '<figure class="progress-comparison-card progress-comparison-card--work"><div class="progress-comparison-media"><img src="/images/updates/srpen-2026/zakladna/03-zazemi-lavice.jpg" alt="Naše paletové posezení u základny REST||ART"><span class="progress-comparison-label">Naše práce</span></div><figcaption><strong>Vzniklo přímo u nás</strong><span>Lavice z použitých palet už stojí před zázemím a dostala první sedáky.</span></figcaption></figure>',
      '<figure class="progress-comparison-card progress-comparison-card--reference"><div class="progress-comparison-media"><img src="/images/updates/srpen-2026/paletove-posezeni-vzor.jpg" alt="Pinterestová inspirace pro paletové posezení"><span class="progress-comparison-label">Inspirace</span></div><figcaption><strong>Obrázek, od kterého jsme se odrazili</strong><span>Nekopírujeme hotový výrobek. Hledáme vlastní řešení podle rozměrů a materiálu, který máme k dispozici.</span></figcaption></figure>',
      '</div>',
      '<div class="project-photo-story"><img src="/images/updates/srpen-2026/paletove-posezeni-vyroba.jpg" alt="Rozpracovaná paletová lavice před dokončením"><div class="project-photo-story-copy"><span>Průběh výroby</span><strong>Od rozebraných palet k použitelnému posezení</strong><p>Ještě před několika dny byla vidět hlavně hrubá konstrukce. Teď už je z nápadu skutečný kus vybavení, na kterém se dá dál pracovat a který může sloužit.</p></div></div>',
      '<h2>Co ještě doladíme</h2>',
      '<ul><li>finální zpevnění a kontrolu celé konstrukce,</li><li>broušení hran a přípravu povrchu,</li><li>ochranný nátěr a dokončovací detaily,</li><li>pohodlnější sedáky a finální umístění v zázemí.</li></ul>',
      '<p><strong>Ukazujeme i průběh, ne jen hotový výsledek.</strong> Právě na něm je nejlépe vidět, že na místě opravdu pracujeme a každý další krok posouvá základnu dopředu.</p>'
    ].join('')
  },
  {
    id: 'field-update-zazemi-2026-08',
    slug: 'bouda-z-darovanych-materialu-pevny-zaklad',
    title: 'Z darovaných materiálů stavíme pevné zázemí',
    date: '2026-08-04',
    tag: 'Stavíme svépomocí',
    excerpt:
      'Není to katalogová stavba — vzniká z toho, co nám kdo daruje. Má ale pevné základy, uvnitř už slouží a připravené plechy na střechu čekají na snýtování.',
    imageUrl: '/images/updates/srpen-2026/zakladna/18-zakladna-celkem.jpg',
    body: [
      '<p>Na první pohled není dokonalá — a ani si na to nehraje. Boudu REST||ART stavíme svépomocí z materiálů, které nám lidé darují nebo které dokážeme znovu smysluplně využít. Podstatné je, že stojí na pevném základu a už teď vytváří funkční zázemí.</p>',
      '<div class="project-status"><span class="project-status-badge">Stav k 4. srpnu 2026</span><strong>Uvnitř už slouží. Zvenku pokračujeme.</strong><p>Modrá plachta je stále pouze dočasné zakrytí. Plechová střecha je připravená v garáži a čeká na snýtování.</p></div>',
      '<h2>Posun je vidět i během několika dní</h2>',
      '<div class="progress-comparison">',
      '<figure class="progress-comparison-card progress-comparison-card--reference"><div class="progress-comparison-media"><img src="/images/updates/srpen-2026/bouda-z-darovanych-materialu.jpg" alt="Bouda REST||ART na začátku srpna během stavby"><span class="progress-comparison-label">1. srpna</span></div><figcaption><strong>Rozpracované zázemí</strong><span>Přední část byla ještě zaplněná materiálem a pracovalo se hlavně na základní podobě stavby.</span></figcaption></figure>',
      '<figure class="progress-comparison-card progress-comparison-card--work"><div class="progress-comparison-media"><img src="/images/updates/srpen-2026/zakladna/18-zakladna-celkem.jpg" alt="Bouda a pracovní část základny o několik dní později"><span class="progress-comparison-label">4. srpna</span></div><figcaption><strong>Prostor už začíná fungovat</strong><span>Vstup, pracovní část i okolí se postupně čistí, skládají a připravují k běžnému používání.</span></figcaption></figure>',
      '</div>',
      '<h2>Uvnitř se opravdu bydlí a pracuje</h2>',
      '<div class="project-gallery">',
      '<figure class="project-gallery-card"><img src="/images/updates/srpen-2026/zakladna/20-bouda-interier-1.jpg" alt="První část interiéru boudy REST||ART"><figcaption>Obytná část s lůžkem, úložnými skříněmi a podlahou skládanou z dostupných dílů.</figcaption></figure>',
      '<figure class="project-gallery-card"><img src="/images/updates/srpen-2026/zakladna/21-bouda-interier-2.jpg" alt="Druhá část interiéru boudy REST||ART"><figcaption>Druhá část interiéru slouží pro ukládání věcí, jednoduché cvičení i každodenní provoz.</figcaption></figure>',
      '<figure class="project-gallery-card"><img src="/images/updates/srpen-2026/zakladna/22-pracovni-prostor.jpg" alt="Pracovní a úložný prostor vedle boudy"><figcaption>Pracovní a úložný prostor vzniká postupně podle toho, jaký materiál se podaří získat.</figcaption></figure>',
      '<figure class="project-gallery-card"><img src="/images/updates/srpen-2026/zakladna/23-venkovni-stul.jpg" alt="Provizorní bar a venkovní pracovní stůl"><figcaption>Provizorní bar a pracovní stůl: jednoduché, funkční a postavené z toho, co bylo po ruce.</figcaption></figure>',
      '</div>',
      '<h2>Co už je hotové a co nás čeká</h2>',
      '<ul><li>pevný základ a nosná část stavby,</li><li>zařízený a používaný vnitřní prostor,</li><li>připravené plechy pro dokončení střechy,</li><li>další opláštění, srovnání a dokončovací práce podle dostupného materiálu.</li></ul>'
    ].join('')
  },
  {
    id: 'field-update-zahrada-2026-08',
    slug: 'zahrada-dostava-svou-tvar',
    title: 'Zahrada dostává svou tvář: březen versus červenec',
    date: '2026-08-04',
    tag: 'Proměna místa',
    excerpt:
      'Stejný kout na jaře a na konci července ukazuje skutečnou změnu. Vedle záhonů vznikají cesty, jezírko, skalky, truhlíky i drobné prvky vyrobené vlastníma rukama.',
    imageUrl: '/images/updates/srpen-2026/zakladna/10-ruze.jpg',
    body: [
      '<p>Nejde jen o velké stavební zásahy. Atmosféru místa vytváří i každodenní péče: srovnat záhon, položit kameny, ošetřit rostliny, upravit cestu a vrátit drobným koutům smysl.</p>',
      '<div class="progress-comparison">',
      '<figure class="progress-comparison-card progress-comparison-card--reference"><div class="progress-comparison-media"><img src="/images/updates/srpen-2026/zakladna/27-zahrada-brezen.jpg" alt="Zahradní kout v březnu 2026 na začátku úprav"><span class="progress-comparison-label">Březen 2026</span></div><figcaption><strong>Začínali jsme od základu</strong><span>Geotextilie, kameny a první obrysy záhonů. Místo teprve hledalo svou podobu.</span></figcaption></figure>',
      '<figure class="progress-comparison-card progress-comparison-card--work"><div class="progress-comparison-media"><img src="/images/updates/srpen-2026/zakladna/28-zahrada-cervenec.jpg" alt="Stejný zahradní kout na konci července 2026"><span class="progress-comparison-label">Červenec 2026</span></div><figcaption><strong>Stejný kout o čtyři měsíce později</strong><span>Růže, rozrostlé záhony, upravené cesty a jasně ohraničený prostor ukazují každodenní práci.</span></figcaption></figure>',
      '</div>',
      '<div class="project-photo-story"><img src="/images/updates/srpen-2026/zakladna/11-cesta-k-zakladne.jpg" alt="Nově upravovaná cesta k základně REST||ART"><div class="project-photo-story-copy"><span>Cesta k základně</span><strong>Každý metr skládáme postupně</strong><p>Na cestě je vidět mnoho nového. Obrubníky i část povrchů jsme pokládali sami a postupně doplňujeme plůtky, výsadbu i další detaily.</p></div></div>',
      '<h2>Další místa, která dostávají smysl</h2>',
      '<div class="project-gallery">',
      '<figure class="project-gallery-card project-gallery-card--wide"><img src="/images/updates/srpen-2026/zakladna/17-jezirka.jpg" alt="Nově vybudované jezírko se skalkou a původní jezírko v pozadí"><figcaption>Nové jezírko jsme celé vykopali, osadili a doplnili skalkou. Čerpadlo nalezené v kontejneru se podařilo zprovoznit; v pozadí je původní jezírko.</figcaption></figure>',
      '<figure class="project-gallery-card"><img src="/images/updates/srpen-2026/zakladna/06-truhliky.jpg" alt="Truhlíky a vyřezávané dekorace u příjezdové cesty"><figcaption>Námi postavené truhlíky u příjezdové cesty a první vyřezávané dekorace, které chceme postupně rozmístit podél cest.</figcaption></figure>',
      '<figure class="project-gallery-card"><img src="/images/updates/srpen-2026/zakladna/26-nova-skalka.jpg" alt="Nově zakládaná skalka mezi paletami"><figcaption>Nově založená skalka je stále ve výstavbě. Kameny, výsadbu i celé ohraničení skládáme postupně.</figcaption></figure>',
      '<figure class="project-gallery-card"><img src="/images/updates/srpen-2026/zakladna/01-kompost.jpg" alt="Ručně sestavený kompostér na zahradní zbytky"><figcaption>Po domácku stlučený kompostér využívá plevel i zbytky, které nesnědí zvířata, aby se materiál vrátil ke květinám jako hnojivo.</figcaption></figure>',
      '<figure class="project-gallery-card"><img src="/images/updates/srpen-2026/zakladna/02-kad-voda.jpg" alt="Nalezená káď s vodou zarůstající zelení"><figcaption>Vyhozená káď s vodou už začíná obrůstat zelení. Je to jeden z budoucích projektů, který ještě čeká na dokončení.</figcaption></figure>',
      '<figure class="project-gallery-card"><img src="/images/updates/srpen-2026/zakladna/13-kocour-rajcata-obrubnik.jpg" alt="Kocour u rajčat a nově položeného obrubníku"><figcaption>U rajčat vzniká plůtek, který oddělí záhon od cesty. Obrubník podél cesty jsme položili sami — pod dohledem druhého kocoura.</figcaption></figure>',
      '<figure class="project-gallery-card"><img src="/images/updates/srpen-2026/zakladna/09-kocour-hlida-cestu.jpg" alt="Kocour na hlavní cestě do základny"><figcaption>Jeden ze dvou pravidelných hlídačů na hlavní cestičce do základny.</figcaption></figure>',
      '</div>',
      '<p><strong>Skutečný restart není jednorázové gesto.</strong> Je to vytrvalost, opakovaná práce a viditelný posun — záhon po záhonu a krok po kroku.</p>'
    ].join('')
  },
  {
    id: 'field-update-reuse-zakladna-2026-08',
    slug: 'zakladna-roste-z-toho-co-dostalo-druhou-sanci',
    title: 'Základna roste z toho, co dostalo druhou šanci',
    date: '2026-08-04',
    tag: 'Práce v terénu',
    excerpt:
      'Darované palety, místní dřevo, nalezené vybavení i vlastní ruční práce. Na jednom místě je vidět, jak z věcí určených k vyhození vznikají ploty, pracovní kouty a praktické zázemí.',
    imageUrl: '/images/updates/srpen-2026/zakladna/08-proutene-kreslo-zakladna.jpg',
    body: [
      '<p>Velká část základny nevzniká nákupem hotových řešení. Pracujeme s tím, co nám někdo daruje, co se podaří zachránit nebo co lze přestavět. Výsledek proto není katalogový, ale je skutečný, funkční a každým týdnem o kus dál.</p>',
      '<div class="project-gallery">',
      '<figure class="project-gallery-card project-gallery-card--wide"><img src="/images/updates/srpen-2026/zakladna/04-darovane-palety.jpg" alt="Velká zásoba palet darovaných anonymním podnikem"><figcaption>Palety nám daroval podnik, který si nepřál být jmenován. Právě z podobného materiálu vzniká nábytek, oplocení i další části zázemí.</figcaption></figure>',
      '<figure class="project-gallery-card"><img src="/images/updates/srpen-2026/zakladna/05-plot-drevo.jpg" alt="Dokončovaný plot kolem darované hromady dřeva"><figcaption>Aktuálně dokončujeme plot kolem hromady dřeva, které nanosili místní. Z tohoto materiálu vznikla také bouda REST||ART.</figcaption></figure>',
      '<figure class="project-gallery-card"><img src="/images/updates/srpen-2026/zakladna/25-novy-plot.jpg" alt="Námi postavený venkovní plot"><figcaption>Nový plot zvenčí. Na místě, kde dříve zůstávala jen otevřená mezera, je dnes jasně ohraničený vstup.</figcaption></figure>',
      '<figure class="project-gallery-card"><img src="/images/updates/srpen-2026/zakladna/14-pracovni-stul.jpg" alt="Pracovní stůl s darovaným a zajištěným nářadím"><figcaption>Pracovní stůl s nářadím. Většina vybavení je darovaná nebo nalezená; nákladnější nástroje zajistila společnost David Kozák International, s.r.o.</figcaption></figure>',
      '<figure class="project-gallery-card"><img src="/images/updates/srpen-2026/zakladna/15-plovouci-podlaha.jpg" alt="Připravená plovoucí podlaha pro interiér základny"><figcaption>Složená plovoucí podlaha čeká na další použití uvnitř základny.</figcaption></figure>',
      '<figure class="project-gallery-card"><img src="/images/updates/srpen-2026/zakladna/07-vstupni-brana.jpg" alt="Vstupní brána a cesta do základny"><figcaption>Vstupní brána otevírá hlavní cestu do základny, kterou postupně upravujeme a doplňujeme.</figcaption></figure>',
      '<figure class="project-gallery-card"><img src="/images/updates/srpen-2026/zakladna/08-proutene-kreslo-zakladna.jpg" alt="Ručně pletené proutěné křeslo před boudou REST||ART"><figcaption>Ručně pletené proutěné křeslo, bouda REST||ART a nový plot v jednom záběru — několik různých podob práce na jednom místě.</figcaption></figure>',
      '</div>',
      '<p>Recyklace tu není jen heslo. Každá zachráněná paleta, opravený předmět nebo znovu použitá deska snižuje náklady a současně vytváří konkrétní prostor pro práci, setkávání a další rozvoj projektu.</p>'
    ].join('')
  },
  {
    id: '0db6fc6b-1eea-42a0-ab3a-a6d381397d4f',
    slug: 'opszp',
    title: 'Dokumentace OPSZP',
    date: '2026-06-10',
    tag: 'Média a materiály',
    excerpt: 'Podklady REST||ART pro konzultaci v rámci OPSZP.',
    imageUrl: '/images/updates/archiv-2026/opszp-podklad-1.webp',
    body: [
      '<p>Zveřejňujeme dvě strany podkladového materiálu REST||ART připraveného pro odbornou konzultaci.</p>',
      '<figure><img src="/images/updates/archiv-2026/opszp-podklad-1.webp" alt="První strana podkladu REST||ART pro konzultaci OPSZP"><figcaption>Podklad pro konzultaci — strana 1.</figcaption></figure>',
      '<figure><img src="/images/updates/archiv-2026/opszp-podklad-2.webp" alt="Druhá strana podkladu REST||ART pro konzultaci OPSZP"><figcaption>Podklad pro konzultaci — strana 2.</figcaption></figure>'
    ].join('')
  },
  {
    id: '76719b7a-e6cd-4fd9-a35b-68e3ef0d05f1',
    slug: 'majerpropusten',
    title: 'Jaroslav Majer jde ven!',
    date: '2026-05-17',
    tag: 'JAILBREAK',
    excerpt: 'Můžete slavit — Jaroslav Majer byl podmíněně propuštěn a dostal další šanci.',
    imageUrl: '/images/updates/archiv-2026/jaroslav-majer-propusten.jpg',
    body: '<p><strong>Jaroslav Majer byl podmíněně propuštěn.</strong> Dostává tak další šanci a REST||ART bude u navazujících kroků, které mají pomoci proměnit rozhodnutí soudu ve skutečný návrat do běžného života.</p><p>Navazující text doplní Andrea Janichová, partnerka pana Majera. Děkujeme všem, kdo jeho další cestu podporují.</p>'
  },
  {
    id: '0d718647-7a13-4c93-9543-34e75adfee5a',
    slug: 'podmineneho-propusteni',
    title: 'Jaroslav Majer zítra čeká projednání PP',
    date: '2026-05-14',
    tag: 'JAILBREAK',
    excerpt: 'Jaroslava Majera zítra čeká projednání žádosti o podmíněné propuštění.',
    imageUrl: '/images/updates/archiv-2026/jaroslav-majer-pp.jpg',
    body: [
      '<p>Zítřejší den může být pro <strong><u>Jaroslava Majera</u></strong> zásadním milníkem. Na programu je projednání jeho žádosti o podmíněné propuštění, které může významně ovlivnit jeho další životní cestu i možnosti návratu do běžného života.</p>',
      '<p>Podmíněné propuštění představuje v českém právním systému důležitý nástroj resocializace. Nejde pouze o právní rozhodnutí soudu, ale také o posouzení dosavadního chování odsouzeného, jeho přístupu k nápravě a připravenosti začlenit se zpět do společnosti.</p>',
      '<p><strong>REST||ART Integrace</strong> dlouhodobě upozorňuje na význam druhých šancí, individuální podpory a systémové práce s lidmi po výkonu trestu. Úspěšná reintegrace není důležitá jen pro samotného člověka, ale i pro bezpečnost a stabilitu celé společnosti.</p>',
      '<p>Zítřejší projednání proto nevnímáme pouze jako administrativní krok, ale jako moment, který může otevřít prostor pro nový začátek. Budeme situaci dále sledovat a o dalším vývoji informovat.</p>',
      '<p><em>Redakce REST||ART Integrace</em></p>'
    ].join('')
  },
  {
    id: '21e08d15-89ce-4317-8abc-a29e8eabe3d1',
    slug: 'start',
    title: 'Nový Start pro REST||ART',
    date: '2026-05-04',
    tag: 'Aktuality projektu',
    excerpt:
      'Po ukončení působení v Ústí nad Labem se projekt přesunul na venkov, kde příroda, zahrada a větší prostor otevírají nové možnosti.',
    imageUrl: '/images/updates/archiv-2026/novy-start.jpg',
    body: [
      '<h2>REST||ART se přestěhoval</h2>',
      '<p>Po ukončení smlouvy v Ústí nad Labem se projekt přesunul na venkov, kde příroda a velká zahrada přinášejí nové možnosti. Komunitní práce, péče o zahradu a dostatek místa mohou vytvořit zázemí, ve kterém si lidé odpočinou, najedí se a připraví na další krok.</p>',
      '<p>Není to příběh o negativitě, ale o novém začátku a nových možnostech. Právě o tom REST||ART je. Místo na začátku proměny dnes dokumentují nové srpnové aktuality.</p>'
    ].join('')
  },
  {
    id: '0b5b706c-8219-46c7-9521-d2e9f7497791',
    slug: 'emotional',
    title: 'Emotional',
    date: '2026-05-01',
    tag: 'Média a materiály',
    excerpt: 'Krátké video zachycující osobní a emotivní rovinu projektu REST||ART.',
    imageUrl: '/images/updates/archiv-2026/emotional.png',
    body: '<p>Projekt není jen systém, metodika a soubor kroků. Nese také lidskou a osobní rovinu, ze které REST||ART vznikl.</p><div class="news-video"><iframe src="https://www.youtube.com/embed/lLa_FUYBAZg?si=CHxle2fFaRIl0bkt" title="Emotional — video REST||ART" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>'
  },
  {
    id: '7d5463f2-6cd7-4ab9-a20a-efb4e5359d33',
    slug: 'architektura-druhe-sance',
    title: 'REST||ART: Architektura druhé šance',
    date: '2026-04-28',
    tag: 'Metodika',
    excerpt: 'Vizuální představení systému podpory, který propojuje jednotlivé kroky druhé šance.',
    imageUrl: '/images/updates/archiv-2026/architektura-druhe-sance-cover.png',
    body: '<p>Architektura druhé šance ukazuje, že stabilní návrat nevzniká jedním izolovaným opatřením. Potřebuje propojit zázemí, práci, doprovod, odpovědnost i dlouhodobou oporu.</p><figure><img src="/images/updates/archiv-2026/architektura-druhe-sance-cover.png" alt="Vizuální architektura druhé šance REST||ART"><figcaption>REST||ART — architektura druhé šance.</figcaption></figure>'
  },
  {
    id: '647e36e0-ab6e-4ac5-ae6b-005a73ab1f77',
    slug: 'zadost-o-pp-kaleja-jiri-rest-art-se-pripojuje',
    title: 'Žádost o PP: Kaleja Jiří — REST||ART znovu odpovídá',
    date: '2026-04-11',
    tag: 'JAILBREAK',
    excerpt:
      'REST||ART obdržel další dopis s plánem podání žádosti o podmíněné propuštění od registrovaného člena Jiřího Kaleji a připravil konkrétní příslib návazné podpory.',
    body: [
      '<p>REST||ART obdržel další dopis s plánem podání žádosti o podmíněné propuštění od registrovaného člena Jiřího Kaleji. I přes omezené možnosti se aktivně zapojuje do aktivit a pravidelně zasílá ruční výrobky pro domov seniorů v Ústí nad Labem.</p>',
      '<h2>Příslib postpenitenciární péče</h2>',
      '<p>Projekt potvrzuje připravenost spolupracovat na resocializaci po případném podmíněném propuštění a nabídnout podporu od prvního dne po výstupu.</p>',
      '<ol><li><strong>Doprovod a asistence při výstupu:</strong> kontakt bezprostředně po propuštění a pomoc s prvními nezbytnými kroky.</li><li><strong>Ubytování:</strong> zajištění návazného zázemí.</li><li><strong>Pracovní uplatnění:</strong> pomoc s nástupem do zaměstnání a pracovního režimu.</li><li><strong>Odborné poradenství:</strong> pravidelné schůzky zaměřené na sociální stabilizaci a řešení dluhů.</li></ol>',
      '<h2>Proč se k žádosti připojujeme</h2>',
      '<p>Dosavadní komunikace ukazuje aktivní přístup k řešení situace a snahu o nápravu. REST||ART je v případě kladného rozhodnutí připraven poskytnout pomoc při hledání zaměstnání, dluhové poradenství, sociální asistenci a pravidelný mentoring zaměřený na prevenci recidivy.</p>',
      '<p>Domníváme se, že konkrétní podpůrná síť významně zvyšuje šanci, že propuštěný člověk povede řádný život. Nejde jen o formální souhlas, ale o převzetí reálné role pomoci a doprovodu během zkušební doby.</p>'
    ].join('')
  },
  {
    id: '58ffbf24-864b-4771-bc1f-ca77a4da9dd5',
    slug: 'zadost-o-pp-majer-jaroslav-rest-art-se-pripojuje',
    title: 'Žádost o PP: Majer Jaroslav — REST||ART se připojuje',
    date: '2026-04-03',
    tag: 'JAILBREAK',
    excerpt:
      'REST||ART se připojuje k žádosti o podmíněné propuštění a potvrzuje návaznou podporu po výstupu: doprovod, ubytování, práci, sociální asistenci a mentoring.',
    body: [
      '<p>REST||ART se připojuje k žádosti o podmíněné propuštění pana Majera Jaroslava a potvrzuje připravenost převzít návaznou postpenitenciární podporu ihned po výstupu.</p>',
      '<h2>Co po propuštění zajišťujeme</h2>',
      '<ul><li>doprovod při výstupu a stabilizační kontakt v prvních dnech,</li><li>zajištěné ubytování,</li><li>předjednané pracovní uplatnění a pomoc s nástupem do režimu,</li><li>sociální asistenci a orientaci v běžném fungování po výkonu trestu,</li><li>dluhové poradenství a průběžný mentoring během zkušební doby.</li></ul>',
      '<p>Cílem je, aby propuštění nebylo jednorázovým aktem, ale reálným přechodem do stabilnějšího života. REST||ART se v tomto případě nepřipojuje jen formálně, ale deklaruje konkrétní kapacitu a odpovědnost za návaznou podporu.</p>'
    ].join('')
  },
  {
    id: 'news-darovane-knihy-a-jeden-nalez',
    title: 'Darované knihy dorazily. A přibyl i jeden nečekaný nález',
    date: '2026-08-05',
    tag: 'Komunita',
    imageUrl: '/images/news/darovane-knihy/dobrodruzne-knihy-kod.jpg',
    excerpt:
      'Do vznikající knihovny jsme převzali několik krabic darovaných knih a zachránili také jeden nalezený soubor. Děkujeme všem, kdo dávají knihám i jejich budoucím čtenářům další šanci.',
    body: [
      '<p><strong>Naše sbírka knih se během července znovu rozrostla.</strong> Dorazilo k nám několik balíků a krabic darovaných knih – beletrie, dobrodružné romány, naučná literatura i starší edice, které mohou dál sloužit.</p>',
      '<h2>Knihy, které nemusely skončit bez užitku</h2>',
      '<p>Vedle darů jsme převzali také jeden nalezený soubor knih, kterému hrozilo, že zůstane zapomenutý. I ten čeká stejné pečlivé třídění jako ostatní.</p>',
      '<img src="/images/news/darovane-knihy/nalezeny-soubor-knih.jpg" alt="Nalezený soubor knih před roztříděním" width="1200" height="900" loading="lazy" />',
      '<p><em>Nalezený soubor knih před roztříděním.</em></p>',
      '<h2>Co bude následovat</h2>',
      '<p>Knihy postupně prohlédneme, očistíme a roztřídíme podle stavu a zaměření. Použitelné tituly zařadíme do připravované sbírky; s ostatními naložíme odpovědně.</p>',
      '<img src="/images/news/darovane-knihy/edice-aloise-jiraska.jpg" alt="Darovaná edice knih Aloise Jiráska" width="1200" height="675" loading="lazy" />',
      '<p><em>Část darované edice Aloise Jiráska.</em></p>',
      '<img src="/images/news/darovane-knihy/krabice-beletrie-a-naucnych-knih.jpg" alt="Krabice darované beletrie a naučných knih" width="1200" height="853" loading="lazy" />',
      '<p><em>V zásilkách je beletrie, naučná literatura i knihy pro volný čas.</em></p>',
      '<img src="/images/news/darovane-knihy/darovane-knihy-v-krabici.jpg" alt="Další darované knihy uložené v krabici" width="900" height="1200" loading="lazy" />',
      '<img src="/images/news/darovane-knihy/dobrodruzne-knihy-v-krabici.jpg" alt="Darované dobrodružné knihy v krabici" width="900" height="1200" loading="lazy" />',
      '<p><strong>Děkujeme všem dárcům.</strong> Darem knih nepředáváte jen věc. Pomáháte vytvářet prostor pro klid, vzdělávání a nový začátek lidí, se kterými projekt pracuje.</p>',
      '<p>Chcete se také zapojit? Podrobnosti najdete na stránce <a href="/zapojeni/sbirka-knih">Sbírka knih</a>.</p>'
    ].join('')
  },
  {
    id: 'news-vizualni-knihovna-metodiky',
    title: 'Vizuální knihovna metodiky je nově dostupná na jednom místě',
    date: '2026-07-30',
    tag: 'Média a materiály',
    imageUrl: '/images/methodology/vizualni-model-rest-art-integrace.webp',
    excerpt:
      'Diagram systému, životní cyklus klienta, šest programových pilířů i síť spolupráce jsou veřejně dostupné v přehledné vizuální knihovně.',
    body: [
      '<p>Rozšířili jsme veřejnou část metodiky o vizuální podklady, které pomáhají rychle pochopit, jak REST||ART Integrace propojuje cílové skupiny, programy, partnery, měření a konkrétní výstupy.</p>',
      '<h2>Od cílové skupiny ke stabilnímu člověku</h2>',
      '<p>Ústřední diagram ukazuje dvě části jednoho systému. Na jedné straně stojí metodicky řízená práce s klientem, na druhé zaměstnavatelé, obce, instituce, dobrovolníci, komunita a odborní partneři. Jejich propojení vytváří podmínky pro dlouhodobou stabilizaci.</p>',
      '<h2>Co je v knihovně dostupné</h2>',
      '<ul><li>vizuální model REST||ART Integrace,</li><li>životní cyklus klienta,</li><li>šest programových pilířů,</li><li>síť spolupráce,</li><li>časová osa a milníky projektu,</li><li>samostatné programové ikony.</li></ul>',
      '<p><a href="/metodika#metodika-vizualy">Otevřít vizuální knihovnu metodiky</a> nebo přejít na <a href="/media">veřejné materiály ke stažení</a>.</p>'
    ].join('')
  },
  {
    id: 'news-oficialni-videa-projektu',
    title: 'Oficiální videa projektu mají vlastní sledovací stránky',
    date: '2026-07-29',
    tag: 'Média a materiály',
    imageUrl: '/videos/rest-art-intro-poster.png',
    excerpt:
      'Krátké představení projektu a animace vizuální identity jsou dostupné na samostatných stránkách s popisem, titulky a údaji pro vyhledávače.',
    body: [
      '<p>Veřejná videa REST||ART Integrace jsme oddělili do samostatných sledovacích stránek. Každé video má vlastní adresu, náhled, popis a strukturovaná data, aby mu rozuměli návštěvníci, vyhledávače i asistivní technologie.</p>',
      '<h2>Krátké představení projektu</h2>',
      '<p>Patnáctisekundové video stručně představuje druhou šanci, praktickou podporu a bezpečný návrat do běžného života. <a href="/videa/predstaveni-projektu">Přehrát představení projektu</a>.</p>',
      '<h2>Vizuální identita</h2>',
      '<p>Krátká logo animace slouží jako vizuální podpis projektu pro prezentace a veřejnou komunikaci. <a href="/videa/logo-reveal">Přehrát logo reveal</a>.</p>',
      '<p>Brožury, plakát a další veřejné podklady jsou dostupné v <a href="/media">knihovně médií ke stažení</a>.</p>'
    ].join('')
  },
  {
    id: 'news-brozury-druhe-sance',
    title: 'Nové brožury REST||ART Integrace jsou veřejně ke stažení',
    date: '2026-06-26',
    tag: 'Média a materiály',
    imageUrl: '/images/media/restart-projekt-infografika.png',
    excerpt:
      'Zveřejnili jsme projektové brožury pro partnery, podporovatele i zájemce o program JAILBREAK. Materiály shrnují, proč REST||ART není jen další projekt, ale značka druhé šance v praxi.',
    body: [
      '<p>Do veřejné knihovny médií jsme doplnili nové projektové brožury REST||ART Integrace. Slouží pro partnery, podporovatele, instituce i lidi, kteří chtějí rychle pochopit, proč projekt vznikl a jakou změnu chce přinést.</p>',
      '<h2>Značka druhé šance</h2>',
      '<p>REST||ART Integrace nevnímáme jako tabulku, výkaz nebo formální značku na obálku žádosti. Je to odpověď na situace, kdy člověk po pádu najde stigma, bariéru a další propad místo otevřených dveří.</p>',
      '<p>Brožury popisují základní myšlenku: nečekat, až lidé znovu spadnou, ale zároveň je nenechat ležet. Projekt propojuje prevenci, doprovod, práci, bydlení a stabilizaci do jednoho praktického rámce.</p>',
      '<h2>Spolupráce, ne grantové soupeření</h2>',
      '<p>Hledáme partnery, kteří chtějí táhnout stejným směrem. Nejde nám o výkazově přijatelná partnerství, ale o prostředí, kde partner znamená společný směr, odvahu a odpovědnost.</p>',
      '<p><a href="/media">Otevřít veřejnou knihovnu brožur, plakátů a fotografií</a>.</p>'
    ].join('')
  },
  {
    id: 'story-z-praxe-ne-od-stolu',
    title: 'REST||ART vznikl z praxe, ne od stolu',
    date: '2026-07-02',
    tag: 'Příběhy druhé šance',
    excerpt:
      'Zakladatelský příběh projektu REST||ART / RESTART Integrace: osobní cesta přes závislost, ulici, výkon trestu, návrat do práce a vznik systému druhých šancí.',
    body: [
      '<p><strong>Projekt REST||ART / RESTART Integrace nevznikl od stolu ani jako teoretická úvaha.</strong> Je odpovědí na osobní zkušenost, která trvala šest let výkonu trestu a ještě několik let předtím.</p>',
      '<p>V mnoha ohledech jsem prošel téměř všemi cílovými skupinami, se kterými dnes projekt pracuje: závislostí, bezdomovectvím, sociálním propadem, ztrátou zázemí i návratem z výkonu trestu. Jedinou oblastí, kterou jsem osobně nezažil, je program BOD ZLOMU zaměřený na děti a mladé lidi. Právě zkušenost s tím, jak zásadní je včasný zásah, mi ale ukazuje, proč je tato část projektu důležitá.</p>',
      '<h2>Cesta nezačala dramaticky</h2>',
      '<p>Chytil jsem se špatné skupiny lidí. Nejdřív přišla marihuana, později pervitin. Přestože jsem si na střední škole držel dobrý prospěch, vysoká absence mě nakonec dostala na ulici: bez domova, bez zázemí, bez podpory. Kradl jsem jídlo, žil ze dne na den a postupně ztrácel kontakt s realitou i sám se sebou.</p>',
      '<p>První pokus o léčbu v Horních Beřkovicích nepomohl. Po propuštění jsem se okamžitě vrátil k tomu, co mě ničilo. Paradoxně jsem tehdy rodině tvrdil, že je všechno v pořádku. Začal jsem pracovat a po několika měsících jsem s užíváním přestal sám od sebe. Dodnes nevím, co přesně se ve mně zlomilo, ale dva roky jsem abstinoval a pracoval ve státním podniku.</p>',
      '<p>Věřil jsem, že se vrátím ke studiu. Právě návrat do školy ale přinesl další relaps. Tentokrát mě vyhodili a já strávil další dva roky na ulici jako bezdomovec.</p>',
      '<h2>Když pomoc nepřichází včas</h2>',
      '<p>Když už jsem byl na dně a začal přemýšlet o smrti, rozhodl jsem se požádat o pomoc. Zjistil jsem ale, že na odbornou péči budu čekat půl roku. V zoufalství jsem udělal něco, co přesně ukazuje, jak se člověk chová, když už neví kudy kam: ukradl jsem oblečení a nechal se chytit.</p>',
      '<p>Když mě po pár hodinách pustili, udělal jsem to znovu. Tentokrát mě zavřeli. Z původních šesti měsíců se po proměně podmínky stalo šest let.</p>',
      '<h2>Systém zevnitř</h2>',
      '<p>Ve výkonu trestu jsem ještě nějakou dobu užíval. Přes všechnu svou inteligenci mi trvalo dlouho, než jsem začal používat i rozum. Postupně jsem se zapojil do aktivit, které dávaly smysl: psal jsem dopisy, pomáhal méně zdatným odsouzeným, učil angličtinu, vedl kroužky a stal se pomocnou rukou pedagogů a vychovatelů.</p>',
      '<p>Díky tomu jsem získal důvěru odsouzených i personálu a mohl jsem vidět systém zevnitř. To, co jsem viděl, bylo zásadní.</p>',
      '<ul><li>míra propustnosti drog do věznic je obrovská,</li><li>velká část programů nefunguje tak, jak je prezentováno,</li><li>jeden pedagog a jeden vychovatel na padesát lidí nemůže zajistit skutečnou práci,</li><li>mnoho odsouzených nerozumí ani základním instrukcím,</li><li>systém je přetížený, vyhořelý a často formální.</li></ul>',
      '<p>Začal jsem pomáhat odsouzeným s dluhy, s přípravou na výstup, s kontaktem na děti v ústavní péči a také jsem upozorňoval na zneužívání kompetencí ze strany vedení.</p>',
      '<h2>Výstup bez zázemí</h2>',
      '<p>Těsně před mým propuštěním mi při filcungu zabavili téměř všechny osobní věci: bez protokolu, bez záznamu. Stížnost byla zamítnuta s tím, že neexistuje dokumentace. Na svobodu jsem šel v tom, v čem mě zavřeli: bez oblečení, bez jídla, bez zázemí, bez práce.</p>',
      '<p>Přesto jsem se nevzdal. Odešel jsem do Německa, začal pracovat jako OSVČ a během dvou let jsem splatil všechny dluhy včetně nákladů na právní řízení. Tvrdě jsem pracoval, vybudoval si stabilitu a nakonec založil vlastní firmu.</p>',
      '<h2>Proč vznikl REST||ART</h2>',
      '<p>Právě tehdy vznikla myšlenka projektu: vytvořit systém, který pomůže lidem v situaci, kterou jsem sám zažil. Ne jako fráze o druhé šanci, ale jako praktická cesta přes práci, bydlení, mentoring, režim, dokumenty, vztahy a následnou stabilizaci.</p>',
      '<p>REST||ART / RESTART Integrace je proto postavený na praxi, ne na teorii. Na zkušenosti, ne na domněnkách. Na tom, co skutečně funguje, ne na tom, co se dobře vyjímá v dokumentech.</p>',
      '<p>Je to projekt druhých šancí pro lidi, kteří se ocitli na okraji společnosti, ale mají chuť začít znovu.</p>'
    ].join('')
  },
  {
    id: 'story-petr-s-druha-sance',
    title: 'Petr S.: Dopis, ve kterém se člověk nechce vzdát',
    date: '2026-06-24',
    tag: 'Příběhy druhé šance',
    excerpt:
      'Petr S. ve svém dopise popisuje cestu přes ústavní péči, ulici, výkon trestu i léčbu. Nehledá výmluvu. Hledá způsob, jak začít žít jinak.',
    body: [
      '<p><strong>Tenhle příběh zveřejňujeme anonymizovaně a s respektem k soukromí klienta.</strong> Jméno je zkrácené, fotografie dopisu nezveřejňujeme a konkrétní citlivé detaily ponecháváme mimo veřejný prostor.</p>',
      '<h2>Život, který začal bez pevného zázemí</h2>',
      '<p>Petr S. vyrůstal od dětství mimo vlastní rodinu. Ve svém dopise se vrací k dětskému domovu, ústavní výchově, samotě a pocitu, že musel příliš brzy nést věci, kterým jako dítě nemohl rozumět.</p>',
      '<p>Ve škole se dokázal držet. Nebyl člověkem bez schopností ani bez snahy. Jenže za tím, co bylo vidět navenek, zůstávala bolest, nejistota a otázka, kam vlastně patří.</p>',
      '<h2>Špatná rozhodnutí a kruh, ze kterého se těžko vystupuje</h2>',
      '<p>Postupně přišla ulice, špatná rozhodnutí, trestná činnost, výkon trestu i pokusy o léčbu. Petr o minulosti nepíše proto, aby ji obhajoval. Píše o ní jako o kruhu, který se bez podpory a bezpečného zázemí velmi těžko přerušuje.</p>',
      '<p>Po výkonu trestu se člověk může ocitnout formálně na svobodě, ale prakticky bez opory: bez stabilního bydlení, bez práce, bez vztahů, bez režimu a často i bez důvěry, že změna může vydržet.</p>',
      '<h2>To nejdůležitější není minulost, ale směr</h2>',
      '<p>Nejsilnější část dopisu není popis pádu. Je to snaha říct: ještě to nechci vzdát. Petr píše o touze žít normálně, naučit se fungovat, obnovit důvěru a nezůstat sám v okamžiku, kdy přijde první těžká chvíle.</p>',
      '<p>Právě tady začíná smysl programu JAILBREAK. Druhá šance není smazání minulosti. Je to konkrétní plán, kontakt, odpovědnost, práce, bydlení, režim a člověk, který pomůže udržet směr, když je návrat do běžného života křehký.</p>',
      '<h2>Druhá šance v praxi</h2>',
      '<p>Petrův příběh není jednoduchý a nebude jednoduchý ani další krok. Ale dopis ukazuje něco podstatného: i člověk, který prošel těžkou minulostí, může pořád nést touhu změnit směr.</p>',
      '<p>Ne každý návrat se povede napoprvé. Každý návrat ale musí někde začít. Někdy jedním dopisem. Jednou větou. Jedním rozhodnutím, že minulost už nemá být jediný scénář budoucnosti.</p>'
    ].join('')
  },
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

