export interface PageTranslationEntry {
  page: number;
  lessonTag: string;
  titleLt: string;
  summaryLt: string;
  instructionsLt: string[];
  theoryNotesLt?: string[];
  tipLt?: string;
  audioPreview?: {
    labelLt: string;
    midis: number[];
  };
}

export const BOOK_TRANSLATIONS: Record<number, PageTranslationEntry> = {
  1: {
    page: 1,
    lessonTag: 'Viršelis',
    titleLt: 'Knygos viršelis ir įvadas',
    summaryLt: 'Peter Gelling „Progressive Complete Learn to Play Keyboards Manual“ — išsamus vadovėlis nuo pradinių žingsnių iki profesionalaus muzikavimo.',
    instructionsLt: [
      'Vadovėlis skirtas visiems elektroniniams klavišiniams instrumentams, sintezatoriams ir fortepijonui.',
      'Kursą sudaro 3 pagrindinės dalys, apimančios 46 pamokas, teorijos pradmenis, kūrinių repertuarą ir akordų žinyną.',
    ],
    tipLt: 'Naudokite navigacijos mygtukus apačioje arba pamokų rodyklę (viršuje dešinėje), kad greitai atverstumėte norimą temą.',
  },
  4: {
    page: 4,
    lessonTag: 'Turinys',
    titleLt: 'Vadovėlio turinys ir pamokų rodyklė',
    summaryLt: 'Struktūrizuotas visų 46 pamokų sąrašas, suskirstytas į tris tobulėjimo lygius.',
    instructionsLt: [
      '1 Dalis (1–15 pamokos): pagrindai, sėdėsena, penklinė, dešinės ir kairės rankos 5 pirštų padėtys, pirmieji akordai ir dainos.',
      '2 Dalis (16–30 pamokos): gamos, tonacijos (diezai ir bemoliai), minorinės skalės, 12 taktų bliuzas ir improvizacija.',
      '3 Dalis (31–46 pamokos): išplėstinė harmonija, septakordai, dermės (Dorian, Mixolydian) ir stiliai (rokas, džiazas, funk).',
    ],
    tipLt: 'Kiekvieną temą rekomenduojama įsisavinti lėtu tempu prieš pereinant prie sekančios.',
  },
  8: {
    page: 8,
    lessonTag: 'Įvadas',
    titleLt: 'Taisyklinga sėdėsena, rankų forma ir praktikos metodika',
    summaryLt: 'Ergonomikos pagrindai: kaip sėdėti prie instrumento, laikyti rankas ir organizuoti kasdienes treniruotes.',
    instructionsLt: [
      'Sėdėkite tiesiai, bet laisvai instrumentų centro (Middle C) atžvilgiu.',
      'Kėdės aukštį sureguliuokite taip, kad jūsų dilbiai būtų horizontalūs ir lygiagretūs klaviatūrai.',
      'Pirštus laikykite švelniai išgaubtus (tarsi delne laikytumėte teniso kamuoliuką).',
      'Klavišus spauskite pirštų pagalvėlėmis (galiukais), o nykštį (1 pirštą) — jo išorine šonine briauna.',
    ],
    theoryNotesLt: [
      'Pirštų numeracija (abiem rankoms vienoda): 1 = Nykštys, 2 = Smilius, 3 = Didysis, 4 = Bevardis, 5 = Mažylis.',
    ],
    tipLt: 'Kasdienė 15–30 minučių praktika duoda žymiai didesnę pažangą nei viena ilga treniruotė savaitgalį.',
  },
  10: {
    page: 10,
    lessonTag: '1 Pamoka',
    titleLt: 'Dešinės rankos C padėtis ir smuiko rakto natos (C–D–E–F–G)',
    summaryLt: 'Pirmoji dešinės rankos padėtis: 5 pirštai dengia 5 gretimus baltus klavišus nuo pirmosios oktavos C.',
    instructionsLt: [
      'Padėkite dešinės rankos nykštį (1) ant pirmosios oktavos C (Middle C).',
      'Likę pirštai natūraliai gula ant gretimų klavišų: 2 ant D, 3 ant E, 4 ant F, 5 ant G.',
      'Grokite tolygiai, pirštus spauskite paeiliui, stebėdami, kad riešas nepakibtų ir nenusvirtų.',
    ],
    theoryNotesLt: [
      'Smuiko raktas (Treble Clef / G Clef): nurodo aukštas natas, dažniausiai grojamas dešine ranka.',
      '4/4 Metras (Time Signature): 4 ketvirtinės natos kiekviename takte (skaičiuojama: 1 – 2 – 3 – 4).',
      'Ketvirtinė nata (Quarter Note): tamsi galvutė su kojele = 1 dūžis.',
    ],
    tipLt: 'Garsiai skaičiuokite ritmą balsu: „VIENAS, DU, TRYS, KETURI“ — tai padeda išlaikyti stabilų tempą.',
    audioPreview: {
      labelLt: 'C padėties garsai (C4–G4)',
      midis: [60, 62, 64, 65, 67],
    },
  },
  12: {
    page: 12,
    lessonTag: '1 Pamoka (tęsinys)',
    titleLt: 'Natų trukmės: ketvirtinė, pusinė ir sveikoji nata',
    summaryLt: 'Ritmo skaičiavimo pagrindai: kaip išlaikyti ilgiau skambančias natas.',
    instructionsLt: [
      'Ketvirtinė nata: skamba 1 dūžį.',
      'Pusinė nata (Half Note, balta galvutė su kojele): skamba 2 dūžius (skaičiuokite: 1–2).',
      'Sveikoji nata (Whole Note, balta galvutė be kojelės): skamba visą 4/4 taktą — 4 dūžius (skaičiuokite: 1–2–3–4).',
    ],
    theoryNotesLt: [
      'Takto brūkšnys (Bar Line): padalina muziką į vienodo ilgio taktus.',
      'Pabaigos dvigubas brūkšnys (Double Bar Line): žymi kūrinio arba pratimo pabaigą.',
    ],
    tipLt: 'Neatleiskite klavišo anksčiau laiko — laikykite jį paspaustą visą nurodytą trukmę!',
  },
  14: {
    page: 14,
    lessonTag: '1 Pamoka (LH)',
    titleLt: 'Kairės rankos boso raktas ir C padėtis (C3–G3)',
    summaryLt: 'Kairės rankos įvedimas: boso raktas ir žemosios natos.',
    instructionsLt: [
      'Kairės rankos mažylį (5) padėkite ant mažosios oktavos C (oktava žemiau Middle C).',
      'Pirštuotė kylant: 5 (C) – 4 (D) – 3 (E) – 2 (F) – 1 (G).',
      'Atkreipkite dėmesį, kad nykštys (1) dabar yra ant aukščiausios padėties natos (G)!',
    ],
    theoryNotesLt: [
      'Boso raktas (Bass Clef / F Clef): žymi žemas natas, dažniausiai grojamas kaire ranka.',
      'Middle C boso rakte užrašoma ant pirmosios pagalbinės linijos virš penklinės.',
    ],
    tipLt: 'Palyginkite abi rankas: dešinėje nykštys (1) yra ant C, o kairėje nykštys (1) yra ant G.',
  },
  16: {
    page: 16,
    lessonTag: '2 Pamoka',
    titleLt: 'Odė džiaugsmui (Beethoven) ir kairės rankos akordai (C ir G7)',
    summaryLt: 'Pirmasis klasikinis kūrinys su melodija dešinėje rankoje ir akordų pritarimu kairėje.',
    instructionsLt: [
      'Dešinė ranka groja garsiąją Bethoveno melodiją 5 pirštų C padėtyje: E – E – F – G | G – F – E – D...',
      'Kairė ranka akompanuoja akordais: C mažoras (C–E–G) ir G7 dominantseptakordas (B–F–G).',
      'Pirmiausia išmokite kiekvienos rankos partiją atskirai, tik tada junkite kartu lėtu tempu.',
    ],
    theoryNotesLt: [
      'Akordas: bent trys natos, skambančios vienu metu.',
      'C akordas: pagrindinis tonikos trigarsis (I laipsnis).',
      'G7 akordas: dominantinis akordas (V7 laipsnis), sukuriantis įtampą, kuri nori grįžti į C.',
    ],
    tipLt: 'Akordus kaire ranka spauskite švelniai ir tolygiai, kad jie neužgožtų dešinės rankos melodijos.',
    audioPreview: {
      labelLt: 'Bethoveno „Odė džiaugsmui“ pradžia',
      midis: [60, 64, 67, 76],
    },
  },
  18: {
    page: 18,
    lessonTag: '3 Pamoka',
    titleLt: 'When the Saints Go Marchin\' In ir priešaktis (Pick-up Bar)',
    summaryLt: 'Tradicinis Naujojo Orleano džiazo kūrinys, pristatantis priešaktį ir lygas.',
    instructionsLt: [
      'Kūrinys prasideda priešakčiu: melodija prasideda ne nuo 1 dūžio, o nuo 2, 3 ir 4 dūžių (C – E – F).',
      'Pirmasis pilnas taktas prasideda nata G, kuri yra jungiama lyga per takto ribą.',
      'Kairėje rankoje naudojami trys pagrindiniai akordai: C, F ir G7.',
    ],
    theoryNotesLt: [
      'Priešaktis (Lead-in / Incomplete Measure): neužbaigtas pradinis taktas, kurio trūkstami dūžiai kompensuojami paskutiniame kūrinio takte.',
      'Lyga (Tie): lanko formos linija, jungianti dvi to paties aukščio natas — antroji nata nebespaudžiama, o tęsiamas jos skambesys.',
    ],
    tipLt: 'Skaičiuokite priešaktį: „(pauzė 1) ir du, trys, keturi | VIENAS...“',
  },
  20: {
    page: 20,
    lessonTag: '5 Pamoka',
    titleLt: 'C mažoro gama (nykščio pakišimas ir perkėlimas)',
    summaryLt: 'Pagrindinė fortepijono technikos taisyklė: kaip sklandžiai sugroti 8 natų oktavą penkiais pirštais.',
    instructionsLt: [
      'Dešinė ranka kildama: grokite pirštais 1 (C) – 2 (D) – 3 (E), tada švelniai pakiškite nykštį (1) po 3-iuoju pirštu ant F, ir baikite 1 (F) – 2 (G) – 3 (A) – 4 (B) – 5 (C).',
      'Dešinė ranka leisdamasi: 5–4–3–2–1, tada 3-iasis pirštas perkeliamas virš nykščio ant E: 3 (E) – 2 (D) – 1 (C).',
      'Kairė ranka kildama: 5–4–3–2–1, tada 3-iasis pirštas perkeliamas virš nykščio ant A: 3–2–1.',
    ],
    theoryNotesLt: [
      'Mažoro gamos formulė: Tonas – Tonas – Pustonis – Tonas – Tonas – Tonas – Pustonis (T–T–ST–T–T–T–ST).',
      'Natūralūs pustoniai C mažore yra tarp E–F (3–4 laipsniai) ir B–C (7–8 laipsniai) — čia nėra juodų klavišų!',
    ],
    tipLt: 'Pakišdami nykštį nekelkite alkūnės aukštyn — riešas turi judėti horizontaliai ir ramiai.',
    audioPreview: {
      labelLt: 'C mažoro gama (C4–C5)',
      midis: [60, 62, 64, 65, 67, 69, 71, 72],
    },
  },
  23: {
    page: 23,
    lessonTag: '6 Pamoka',
    titleLt: 'Bramso lopšinė (Valso metras 3/4 ir punktuota nata)',
    summaryLt: 'Valso ritmas (trys ketvirtinės takte) ir lyriškas cantabile grojimas.',
    instructionsLt: [
      '3/4 Metras: takte yra 3 dūžiai (skaičiuojama: 1 – 2 – 3). Pirmasis dūžis visada yra stiprus (akcentuotas).',
      'Punktuota ketvirtinė nata (Dotted Quarter Note): taškas prailgina natą puse jos vertės (1 + 0,5 = 1,5 dūžio).',
      'Kairė ranka groja būdingą valso akompanimentą: bosas ant 1, akordai ant 2 ir 3.',
    ],
    theoryNotesLt: [
      'Cantabile: groti dainingai, išraiškingai, sujungiant natas (legato).',
      'Frazavimas: melodiją atlikite tarsi dainuodami vienu kvėpavimu.',
    ],
    tipLt: 'Ant pirmo dūžio kairėje rankoje paspauskite bosą šiek tiek giliau, o akordus 2 ir 3 dūžiuose atlikite lengvai.',
  },
  33: {
    page: 33,
    lessonTag: '13 Pamoka',
    titleLt: 'Scarborough Fair (Minoriniai akordai ir arpedžio)',
    summaryLt: 'Tradicinė anglų baladė d-moll / dorinėje dermėje su banguojančiais akordų garsais.',
    instructionsLt: [
      'Kūrinys atliekamas 3/4 metru lyrišku, banguojančiu tempu.',
      'Melodijoje naudojami minoriniai akordai: Dm (D–F–A), Am (A–C–E) ir C mažoras.',
      'Akompanimentas atliekamas arpedžiuotai (natos išskaidomos paeiliui, o ne spaudžiamos kartu).',
    ],
    theoryNotesLt: [
      'Minorinis trigarsis: sudarytas iš pagrindinio garso, mažosios tercijos (3 pustoniai) ir grynosios kvintos (7 pustoniai).',
      'Arpedžio (Arpeggio): akordo natų grojimas paeiliui iš apačios į viršų.',
    ],
    tipLt: 'Laikykite pirštus arti klavišų, kad arpedžio garsai skambėtų švelniai ir tolygiai.',
  },
  34: {
    page: 34,
    lessonTag: '15 Pamoka',
    titleLt: 'Chopsticks (Duetinis grojimas, lygiagrečios tercijos ir staccato)',
    summaryLt: 'Populiariausias fortepijoninis duetas: koordinacija, staccato štrichas ir ritminis tikslumas.',
    instructionsLt: [
      'Melodija grojama lygiagrečiomis tercijomis (du pirštai spaudžia gretimas natas vienu metu).',
      'Naudojamas staccato štrichas — trumpi, atšokantys garsai.',
      'Gali būti grojama keturiomis rankomis su mokytoju ar draugu (Primo ir Secondo partijos).',
    ],
    theoryNotesLt: [
      'Staccato: taškas virš arba po natos galvutės reikalauja natą pagroti trumpai ir staigiai atleisti klavišą.',
      'Tercija: intervalas, apimantis tris laipsnius (pvz., C–E arba F–A).',
    ],
    tipLt: 'Staccato atlikite lengvu riešo judesiu — tarsi klavišas būtų karštas!',
  },
  54: {
    page: 54,
    lessonTag: '11 Pamoka',
    titleLt: 'G mažoro gama (Diezai ir prierakčio ženklai)',
    summaryLt: 'Pirmoji gama su juodu klavišu: 1 diezas (F♯) prieraktyje.',
    instructionsLt: [
      'Gama prasideda nuo natos G: G – A – B – C – D – E – F♯ – G.',
      '7-asis laipsnis yra F♯ (juodas klavišas iškart į dešinę nuo F). Grojamas 4 dešinės rankos pirštu.',
      'Pirštuotė tokia pati kaip C mažore: RH 1–2–3–1–2–3–4–5, LH 5–4–3–2–1–3–2–1.',
    ],
    theoryNotesLt: [
      'Diezas (♯): paaukština natą vienu pustoniu į dešinę (artimiausias klavišas).',
      'Prierakčio ženklas (Key Signature): nurodomas prie smuiko ir boso raktų penklinės pradžioje ir galioja visam kūriniui.',
    ],
    tipLt: 'Kadangi F♯ jau pažymėtas prie rakto, taktuose prie natos F papildomas diezas neberašomas!',
    audioPreview: {
      labelLt: 'G mažoro gama (su F♯)',
      midis: [67, 69, 71, 72, 74, 76, 78, 79],
    },
  },
  58: {
    page: 58,
    lessonTag: '12 Pamoka',
    titleLt: 'F mažoro gama (Bemoliai ir 4-ojo piršto taisyklė)',
    summaryLt: 'Tonacija su 1 bemoliu (B♭) ir speciali dešinės rankos pirštuotė ant juodų klavišų.',
    instructionsLt: [
      'F mažoro gama turi vieną bemolį: B♭ (B paverčiamas į juodą klavišą B♭).',
      'SVARBI PIRŠTUOTĖ: dešinė ranka kyla 1 (F) – 2 (G) – 3 (A) – 4 (B♭).',
      'Kadangi B♭ yra juodas klavišas, nykštys ant jo nededamas! Nykštys pakišamas po 4 pirštu ant C: 1 (C) – 2 (D) – 3 (E) – 4 (F).',
    ],
    theoryNotesLt: [
      'Bemolis (♭): pažemina natą vienu pustoniu į kairę.',
      'Auksinė fortepijono taisyklė: stenkitės vengti dėti nykštį (1) ant juodų klavišų gamose.',
    ],
    tipLt: 'Kairėje rankoje pirštuotė įprasta: 5–4–3–2–1, perkeliamas 3–2–1.',
    audioPreview: {
      labelLt: 'F mažoro gama (su B♭)',
      midis: [65, 67, 69, 70, 72, 74, 76, 77],
    },
  },
  84: {
    page: 84,
    lessonTag: '19 Pamoka',
    titleLt: 'Alla Breve ir Cut Common Time (2/2 metras)',
    summaryLt: 'Greitų tempų metras: skaičiuojama po dvi pusines natas takte.',
    instructionsLt: [
      'Alla Breve žymimas perbraukta raide C (Cut Common Time).',
      'Nors takte telpa 4 ketvirtinės natos, pulsas skaičiuojamas tik į du dūžius: 1 ir 2 (kiekvienas dūžis lygus pusinei natai).',
      'Tai leidžia greitus kūrinius atlikti lengvai, neskaldant dėmesio į keturis smulkius dūžius.',
    ],
    theoryNotesLt: [
      '2/2 metras: du pusinių natų dūžiai takte.',
      'Dažnai naudojamas maršuose, džiazo svinge ir greitose pop dainose.',
    ],
    tipLt: 'Pajuskite sūpuojantį žingsnio pulsą: „KAIRĖ, DEŠINĖ, KAIRĖ, DEŠINĖ“ vietoje keturių skaičių.',
  },
  104: {
    page: 104,
    lessonTag: '24 Pamoka',
    titleLt: 'A natūralusis minoras (Paralelinė C mažorui tonacija)',
    summaryLt: 'Minorinės harmonijos pradžia: balti klavišai nuo A iki A su melancholišku tonikos centru.',
    instructionsLt: [
      'A natūralusis minoras dalijasi tais pačiais baltais klavišais kaip C mažoras, bet prasideda ir baigiasi nata A.',
      'Pirštuotė identiška C mažorui: RH 1–2–3–1–2–3–4–5, LH 5–4–3–2–1–3–2–1.',
      'Atkreipkite dėmesį, kad pustoniai čia yra tarp 2–3 laipsnių (B–C) ir 5–6 laipsnių (E–F).',
    ],
    theoryNotesLt: [
      'Paralelinės tonacijos (Relative Keys): turi tuos pačius prierakčio ženklus, bet skirtingus tonikos centrus (C mažoras ir A minoras neturi ženklų).',
      'Minorinė tercija (A–C = 3 pustoniai) suteikia skambesiui liūdną, jausmingą atspalvį.',
    ],
    tipLt: 'Paklausykite skirtumo: C mažoras skamba šviesiai ir džiugiai, o A minoras — giliai ir susimąsčius.',
    audioPreview: {
      labelLt: 'A natūraliojo minoro gama',
      midis: [69, 71, 72, 74, 76, 77, 79, 81],
    },
  },
  108: {
    page: 108,
    lessonTag: '25 Pamoka',
    titleLt: 'Harmoninis ir melodinis minoras / House of the Rising Sun',
    summaryLt: 'Paaukštintas VII laipsnis (G♯), sudėtinis 6/8 metras ir arpedžiuoti akordai.',
    instructionsLt: [
      'Harmoninis minoras: VII laipsnis paaukštinamas vienu pustoniu (G paverčiamas G♯). Taip sukuriamas stiprus vedamasis garsas į toniką A.',
      'Tarp VI ir VII laipsnių (F ir G♯) atsiranda platus 1,5 tono intervalas (padidinta sekunda), sukeliantis „rytietišką“ skambesį.',
      'Kūrinys „House of the Rising Sun“ atliekamas 6/8 metru (du kirčiai takte: 1 ir 4) su akordų seka: Am – C – D – F – Am – E7.',
    ],
    theoryNotesLt: [
      '6/8 Metras: 6 aštuntinės takte, grupuojamos po tris: [1-2-3] ir [4-5-6].',
      'E7 Dominantseptakordas: atsiranda dėl harmoninio minoro paaukštintos natos G♯ (E–G♯–B–D).',
    ],
    tipLt: 'Grodamas F į G♯, 3 ir 4 dešinės rankos pirštus išskėskite šiek tiek plačiau.',
    audioPreview: {
      labelLt: 'A harmoninio minoro gama (su G♯)',
      midis: [69, 71, 72, 74, 76, 77, 80, 81],
    },
  },
  116: {
    page: 116,
    lessonTag: '27 Pamoka',
    titleLt: '12 taktų bliuzas (Walking Bass ir Shuffle ritmas)',
    summaryLt: 'Amerikietiškos muzikos pagrindas: standartinė 12 taktų I–IV–V harmoninė seka.',
    instructionsLt: [
      '12 taktų schema C tonacijoje: 4 taktai C7 (I) → 2 taktai F7 (IV) → 2 taktai C7 (I) → 1 taktas G7 (V) → 1 taktas F7 (IV) → 1 taktas C7 (I) → 1 taktas G7 (Turnaround).',
      'Kairė ranka groja „walking bass“ liniją arba ritmišką boogie-woogie boso modelį.',
      'Aštuntinės natos atliekamos ne tiesiai, o svinguojant („shuffle“: pirmoji aštuntinė ilgesnė, antroji trumpesnė).',
    ],
    theoryNotesLt: [
      'Dominantseptakordai bliuzo muzikoje: visi akordai turi mažąją septimą (♭7), suteikiančią aštrų bliuzo charakterį.',
      'C7 = C–E–G–B♭; F7 = F–A–C–E♭; G7 = G–B–D–F.',
    ],
    tipLt: 'Boso ritmą pajuskite kaip traukinio ratų dundėjimą: „TUM-ta, TUM-ta, TUM-ta, TUM-ta“.',
    audioPreview: {
      labelLt: '12 taktų bliuzo akordai (C7–F7–G7)',
      midis: [60, 64, 67, 70],
    },
  },
  120: {
    page: 120,
    lessonTag: '28 Pamoka',
    titleLt: 'Bliuzo improvizacija ir „Mėlynosios“ natos (Blue Notes)',
    summaryLt: 'Kaip kurti solo melodijas naudojant bliuzo gamą ir praplėstus septakordus.',
    instructionsLt: [
      'C bliuzo gama: C – E♭ – F – G♭ – G – B♭ – C.',
      'Bliuzo natos (Blue Notes): pažemintas 3 laipsnis (E♭), pažemintas 5 laipsnis (G♭) ir pažemintas 7 laipsnis (B♭).',
      'Improvizuokite trumpas muzikines frazes (rifus), atsakydami į kairės rankos akordus („call and response“ principas).',
    ],
    theoryNotesLt: [
      'Trigarsis su pažemintu 5 laipsniu (Tritonis: C–G♭) yra pats aštriausias ir labiausiai atpažįstamas bliuzo garsas.',
    ],
    tipLt: 'Pradėkite nuo vos 3–4 natų (pvz., E♭, F, G) ir eksperimentuokite su ritmu, o ne natų gausa.',
    audioPreview: {
      labelLt: 'C bliuzo gama su mėlynosiomis natomis',
      midis: [60, 63, 65, 66, 67, 70, 72],
    },
  },
  142: {
    page: 142,
    lessonTag: '35 Pamoka',
    titleLt: 'D mažoro gama ir kvintų ratas (Kaip išmokti bet kurią naują tonaciją)',
    summaryLt: 'Sistemingas naujų tonacijų įsisavinimas: 2 diezai (F♯ ir C♯) ir kvintų ratas.',
    instructionsLt: [
      'D mažoras turi du diezus: F♯ ir C♯ (D – E – F♯ – G – A – B – C♯ – D).',
      'Metodika kiekvienai naujai tonacijai:',
      '1. Išmokite gamos pirštuotę atskirai dešine ir kaire ranka lėtu tempu.',
      '2. Suraskite tris pagrindinius akordus (I = D, IV = G, V = A arba A7).',
      '3. Sugrokite akordų seką ir pritaikykite žinomą melodiją naujoje tonacijoje.',
    ],
    theoryNotesLt: [
      'Kvintų ratas: judant kvinta aukštyn (C → G → D → A → E...), kiekviena sekanti gama gauna po vieną papildomą diezą.',
    ],
    tipLt: 'Prieš pradėdami groti pjesę, pažiūrėkite į prieraktį: ar matote du diezus? Vadinasi, visi F ir C bus juodi klavišai!',
    audioPreview: {
      labelLt: 'D mažoro gama (F♯ ir C♯)',
      midis: [62, 64, 66, 67, 69, 71, 73, 74],
    },
  },
  185: {
    page: 185,
    lessonTag: '42 Pamoka',
    titleLt: 'Dermės ir praplėsta džiazo harmonija (Dorinė, Miksolidinė, 9/11/13)',
    summaryLt: 'Modernus modalinis džiazas, kreipiantieji tonai (Guide Tones) ir akordų praplėtimai.',
    instructionsLt: [
      'D Dorinė dermė (Dorian Mode): antroji C mažoro dermė (D–E–F–G–A–B–C–D). Skamba kaip minoras su pakelta natūralia seksta (B). Idealiai tinka Dm7 akordui.',
      'G Miksolidinė dermė (Mixolydian Mode): penktoji C mažoro dermė (G–A–B–C–D–E–F–G). Tai mažoras su pažemintu 7 laipsniu (F). Atitinka G7 dominantseptakordą.',
      'Džiazo praplėtimai: akordai papildomi nona (9), undecima (11) ir terciadecima (13).',
    ],
    theoryNotesLt: [
      'Kreipiantieji tonai (Guide Tones — 3 ir 7 laipsniai): svarbiausios akordo natos, apibrėžiančios jo harmoninę prigimtį.',
      'Nonakordas (9th Chord): suteikia prabangų, šiltą „lo-fi“ ir džiazo skambesį.',
    ],
    tipLt: 'Kairėje rankoje grokite tik boso natą ir 3/7 laipsnius — atlaisvinkite vietos dešinei rankai improvizuoti!',
    audioPreview: {
      labelLt: 'D Dorinė dermė',
      midis: [62, 64, 65, 67, 69, 71, 72, 74],
    },
  },
  208: {
    page: 208,
    lessonTag: 'Priedas',
    titleLt: 'Pilnas klavišinių akordų žinynas ir apvertimų schema',
    summaryLt: 'Greita universali visų tonacijų akordų žinyno lentelė.',
    instructionsLt: [
      'Kiekvienam pagrindiniam tonui (C, D, E, F, G, A, B ir jų alteracijoms) pateikiami 6 svarbiausi akordų tipai: Mažoras, Minoras, 7, m7, maj7, dim.',
      'Apvertimai (Inversions): parodyta, kaip sukeisti natas vietomis (pagrindinė padėtis, 1-asis ir 2-asis apvertimai), kad ranka klaviatūroje judėtų kuo trumpesniais atstumais (balso vedimas).',
    ],
    theoryNotesLt: [
      'Balso vedimas (Voice Leading): tolygus akordų jungimas, paliekant bendras natas tose pačiose vietose.',
    ],
    tipLt: 'Naudokite šį skyrių kaip kasdienį žinyną dainų akompanimentui kurti.',
  },
};

export interface ResolvedTranslation {
  entry: PageTranslationEntry;
  isExact: boolean;
  derivedFromPage?: number;
}

export function getPageTranslation(page: number): ResolvedTranslation {
  const safePage = Math.max(1, Math.min(216, Math.floor(page) || 1));

  if (BOOK_TRANSLATIONS[safePage]) {
    return {
      entry: BOOK_TRANSLATIONS[safePage],
      isExact: true,
    };
  }

  // Find nearest preceding translation entry
  const availablePages = Object.keys(BOOK_TRANSLATIONS)
    .map(Number)
    .sort((a, b) => a - b);

  let closestPage = availablePages[0];
  for (const p of availablePages) {
    if (p <= safePage) {
      closestPage = p;
    } else {
      break;
    }
  }

  const base = BOOK_TRANSLATIONS[closestPage];

  return {
    isExact: false,
    derivedFromPage: closestPage,
    entry: {
      page: safePage,
      lessonTag: `${base.lessonTag} (tęsinys)`,
      titleLt: `${base.titleLt} · ${safePage} psl. praktika`,
      summaryLt: `Šis puslapis tęsia ${base.lessonTag} medžiagą („${base.titleLt}“). Gilinkite šios temos atlikimo techniką ir skaitymą iš natų.`,
      instructionsLt: [
        `Tęskite ${base.lessonTag} pratimų atlikimą pagal puslapyje pateiktą penklinę ir pirštuotes.`,
        ...base.instructionsLt.slice(0, 2),
      ],
      theoryNotesLt: base.theoryNotesLt,
      tipLt: base.tipLt || 'Grokite lėtu tempu, skaičiuodami dūžius tolygiai.',
      audioPreview: base.audioPreview,
    },
  };
}
