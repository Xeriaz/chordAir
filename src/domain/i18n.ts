import { CHORD_QUALITIES, INVERSIONS, LEVEL_PRESETS } from './chords';
import { NOTES, getRootNoteName } from './notes';
import {
  ChordQualityId,
  InversionId,
  Language,
  LevelPresetId,
  PitchClass,
  VoicedNote,
} from './types';

export interface QualityTranslation {
  /** Short chord quality name used after root note, e.g. "mažoras", "minoras" */
  name: string;
  /** Capitalized title in Settings, e.g. "Mažorinis trigarsis" */
  title: string;
  /** Interval role labels, e.g. ["Pagrindinis garsas (prima)", "Didžioji tercija", "Grynoji kvinta"] */
  intervalLabels: string[];
  /** Beginner-friendly description of sound */
  description: string;
  /** Keyboard shape explanation (in semitones / pusbalsiais) */
  shapeHint: string;
}

export interface InversionTranslation {
  name: string;
  shortLabel: string;
  description: string;
}

export interface PresetTranslation {
  name: string;
  badge: string;
  description: string;
}

const LT_QUALITIES: Record<ChordQualityId, QualityTranslation> = {
  major: {
    name: 'mažoras',
    title: 'Mažorinis trigarsis',
    intervalLabels: ['Prima (pagrindinis garsas)', 'Didžioji tercija', 'Grynoji kvinta'],
    description: 'Šviesus, tvirtas ir džiugus 3 natų akordas (trigarsis).',
    shapeHint: 'Pagrindinis garsas + 4 pustoniai (vidurinė nata) + 3 pustoniai (viršutinė nata).',
  },
  minor: {
    name: 'minoras',
    title: 'Minorinis trigarsis',
    symbolSuffix: 'm',
    intervalLabels: ['Prima (pagrindinis garsas)', 'Mažoji tercija', 'Grynoji kvinta'],
    description: 'Šiltas, jausmingas ir šiek tiek melancholiškas 3 natų akordas.',
    shapeHint: 'Pagrindinis garsas + 3 pustoniai (pažeminta vidurinė nata) + 4 pustoniai (viršutinė nata).',
  } as QualityTranslation,
  diminished: {
    name: 'sumažintas',
    title: 'Sumažintas trigarsis',
    intervalLabels: ['Prima (pagrindinis garsas)', 'Mažoji tercija', 'Sumažinta kvinta'],
    description: 'Įtemptas, glaudus 3 natų akordas, siekiantis išrišimo.',
    shapeHint: 'Dvi mažosios tercijos: pagrindinis garsas + 3 pustoniai + 3 pustoniai.',
  },
  augmented: {
    name: 'padidintas',
    title: 'Padidintas trigarsis',
    intervalLabels: ['Prima (pagrindinis garsas)', 'Didžioji tercija', 'Padidinta kvinta'],
    description: 'Svajingas, platus ir tarsi pakibęs 3 natų akordas.',
    shapeHint: 'Dvi didžiosios tercijos: pagrindinis garsas + 4 pustoniai + 4 pustoniai.',
  },
  major7: {
    name: 'didysis septakordas',
    title: 'Didysis mažorinis septakordas',
    intervalLabels: [
      'Prima (pagrindinis garsas)',
      'Didžioji tercija',
      'Grynoji kvinta',
      'Didžioji septima',
    ],
    description: 'Sodrus, svajingas 4 natų akordas, dažnas džiaze ir „lo-fi“ muzikoje.',
    shapeHint: 'Mažorinis trigarsis + nata 1 pustoniu žemiau kitos oktavos pagrindinio garso.',
  },
  dominant7: {
    name: 'dominantseptakordas',
    title: 'Dominantseptakordas',
    intervalLabels: [
      'Prima (pagrindinis garsas)',
      'Didžioji tercija',
      'Grynoji kvinta',
      'Mažoji septima',
    ],
    description: 'Energingas, bliuzinis 4 natų akordas, turintis stiprią trauką į toniką.',
    shapeHint: 'Mažorinis trigarsis + nata 2 pustoniais žemiau kitos oktavos pagrindinio garso.',
  },
  minor7: {
    name: 'minorinis septakordas',
    title: 'Mažasis minorinis septakordas',
    intervalLabels: [
      'Prima (pagrindinis garsas)',
      'Mažoji tercija',
      'Grynoji kvinta',
      'Mažoji septima',
    ],
    description: 'Švelnus, lyriškas 4 natų minorinis septakordas.',
    shapeHint: 'Minorinis trigarsis + nata 2 pustoniais žemiau kitos oktavos pagrindinio garso.',
  },
  halfDiminished7: {
    name: 'pusiau sumažintas septakordas',
    title: 'Pusiau sumažintas septakordas',
    intervalLabels: [
      'Prima (pagrindinis garsas)',
      'Mažoji tercija',
      'Sumažinta kvinta',
      'Mažoji septima',
    ],
    description: 'Spalvingas, švelniai disonansinis 4 natų akordas (mažasis septakordas su sumažinta kvinta).',
    shapeHint: 'Sumažintas trigarsis + mažoji septima (10 pustonių virš pagrindinio garso).',
  },
  diminished7: {
    name: 'sumažintas septakordas',
    title: 'Sumažintas septakordas',
    intervalLabels: [
      'Prima (pagrindinis garsas)',
      'Mažoji tercija',
      'Sumažinta kvinta',
      'Sumažinta septima',
    ],
    description: 'Dramatiškas, simetriškas 4 natų akordas, išdėstytas kas 3 pustonius.',
    shapeHint: 'Trys lygūs žingsniai po 3 pustonius (0, 3, 6, 9).',
  },
};

const LT_INVERSIONS: Record<InversionId, InversionTranslation> = {
  root: {
    name: 'Pagrindinė padėtis',
    shortLabel: 'Pagr. padėtis',
    description: 'Akordo pagrindinis garsas (prima) yra apačioje (kairiausias pažymėtas klavišas).',
  },
  first: {
    name: '1-asis apvertimas (sekstakordas)',
    shortLabel: '1 apvert.',
    description:
      'Tas pats akordas sukeistomis natomis: vidurinė nata (tercija) yra apačioje, o pagrindinis garsas perkeltas oktava aukščiau.',
  },
  second: {
    name: '2-asis apvertimas (kvartsekstakordas)',
    shortLabel: '2 apvert.',
    description:
      'Tas pats akordas sukeistomis natomis: kvinta yra apačioje, o apatinės natos perkeltos oktava aukščiau.',
  },
  third: {
    name: '3-iasis apvertimas (sekundakordas)',
    shortLabel: '3 apvert.',
    description: '4 natų septakordams: septima yra apačioje (bosiniame balse).',
  },
};

const LT_PRESETS: Record<Exclude<LevelPresetId, 'custom'>, PresetTranslation> = {
  beginner: {
    name: 'Pradedantiesiems',
    badge: 'Pradžia',
    description: 'Mažoriniai ir minoriniai trigarsiai — du pagrindiniai 3 natų akordai.',
  },
  moreTriads: {
    name: 'Visi trigarsiai',
    badge: '4 trigarsiai',
    description: 'Mažoriniai, minoriniai, sumažinti ir padidinti 3 natų akordai.',
  },
  seventhChords: {
    name: 'Septakordai',
    badge: 'Trigarsiai ir 7',
    description: 'Pagrindiniai 4 natų septakordai kartu su trigarsiais.',
  },
};

export function getQualityText(id: ChordQualityId, lang: Language): QualityTranslation {
  if (lang === 'lt') {
    return LT_QUALITIES[id];
  }
  const q = CHORD_QUALITIES[id];
  return {
    name: q.name,
    title: q.title,
    intervalLabels: q.intervalLabels,
    description: q.description,
    shapeHint: q.shapeHint,
  };
}

export function getInversionText(id: InversionId, lang: Language): InversionTranslation {
  if (lang === 'lt') {
    return LT_INVERSIONS[id];
  }
  const inv = INVERSIONS[id];
  return {
    name: inv.name,
    shortLabel: inv.shortLabel,
    description: inv.description,
  };
}

export function getPresetText(
  id: Exclude<LevelPresetId, 'custom'>,
  lang: Language
): PresetTranslation {
  if (lang === 'lt') {
    return LT_PRESETS[id];
  }
  const p = LEVEL_PRESETS.find((item) => item.id === id)!;
  return {
    name: p.name,
    badge: p.badge,
    description: p.description,
  };
}

export function formatChordReadableName(
  rootPitchClass: PitchClass,
  qualityId: ChordQualityId,
  lang: Language
): string {
  const rootName = getRootNoteName(rootPitchClass);
  const qText = getQualityText(qualityId, lang);
  return `${rootName} ${qText.name}`;
}

export function formatChordAriaLabel(
  rootPitchClass: PitchClass,
  qualityId: ChordQualityId,
  symbol: string,
  lang: Language
): string {
  const note = NOTES[rootPitchClass];
  const qText = getQualityText(qualityId, lang);
  if (lang === 'lt') {
    return `${note.spokenNameLt} ${qText.name}, žymėjimas ${symbol}`;
  }
  return `${note.spokenName} ${qText.name}, symbol ${symbol}`;
}

export function getVoicedRoleLabel(note: VoicedNote, qualityId: ChordQualityId, lang: Language): string {
  const qText = getQualityText(qualityId, lang);
  const roleIdx =
    note.role === 'root' ? 0 : note.role === 'third' ? 1 : note.role === 'fifth' ? 2 : 3;
  return qText.intervalLabels[roleIdx] ?? note.roleLabel;
}

export const UI_STRINGS = {
  en: {
    skipToPractice: 'Skip to chord practice',
    customPresetName: 'Custom',
    voicingsCount: (count: number) => `${count} voicings`,
    currentLevelAria: (level: string, inv: string) =>
      `Current level: ${level}, ${inv}. Click to change chord settings.`,
    sessionProgressAria: (correct: number, completed: number, acc: number | null, streak: number) =>
      `Session progress: ${correct} correct out of ${completed} completed${
        acc !== null ? `, ${acc}% accuracy` : ''
      }, streak ${streak}`,
    score: 'Score',
    accuracy: 'Accuracy',
    streak: 'Streak',
    resetProgress: 'Reset session progress',
    toggleLabelsTitle: 'Toggle note names on all piano keys',
    toggleLabelsSr: 'Show note names on all keys',
    switchLanguageTitle: 'Switch language to Lithuanian (Lietuvių)',
    openSettingsAria: 'Open chord and practice settings',
    settingsButton: 'Settings',
    inversionsActiveNotice:
      'Inversions active: chords may have their notes rearranged (root, 1st, or 2nd inversion).',
    pianoKeyboardSectionAria: 'Piano keyboard',
    lowestNoteLegend: 'Lowest note',
    chordNoteLegend: 'Chord note',
    lowestNoteTitle: 'Lowest note (bass)',
    chordNoteTitle: 'Chord note',
    hearChord: 'Hear chord',
    hearChordAria: 'Play highlighted chord sound (Shortcut: Space)',
    highlightedKeysSr: (summary: string) =>
      `Highlighted piano keys from lowest to highest: ${summary}.`,
    twoOctaveGroupAria: 'Two-octave piano keyboard from C4 to B5',
    keyAria: (spoken: string, octave: number, isHighlighted: boolean, isBass: boolean) =>
      `${spoken} ${octave}${
        isHighlighted ? `, highlighted chord note${isBass ? ', lowest note' : ''}` : ''
      }`,
    promptHeading: 'Which chord is highlighted on the keyboard?',
    keysHint: (count: number) => `Keys 1–${count} to answer`,
    answerChoicesGroupAria: 'Chord answer choices',
    correctBadge: '✓ Correct',
    yourPickBadge: '✗ Your pick',
    optionAria: (idx: number, label: string, status: 'correct' | 'incorrect' | null) =>
      `Option ${idx}: ${label}${
        status === 'correct'
          ? ' — Correct answer'
          : status === 'incorrect'
          ? ' — Incorrect choice'
          : ''
      }`,
    chordSymbolTitle: 'Chord symbol',
    answerFeedbackAria: 'Answer feedback',
    correctTitlePrefix: 'Spot on! That’s',
    incorrectTitlePrefix: (chosen: string) =>
      `Not quite — you chose ${chosen}. The correct chord is`,
    anotherChord: 'another chord',
    notesPlayedLabel: 'Notes played (low → high)',
    voicingPositionLabel: 'Voicing / Position',
    bassOnBottom: (note: string) => `(${note} on the bottom)`,
    rootOnBottom: '(Root on bottom)',
    keyboardShapeLabel: 'Keyboard shape',
    nextCardButton: 'Next Card',
    nextCardAria: 'Next practice card (Shortcut: Enter)',
    settingsModalTitle: 'Practice Settings',
    settingsModalSubtitle:
      'Choose which chord shapes and voicings appear. Changes apply immediately while keeping your session score.',
    closeSettingsAria: 'Close settings',
    languageSectionTitle: 'Language / Kalba',
    practiceLevelTitle: '1. Practice Level',
    selectedCountBadge: (count: number) => `${count} selected`,
    customPresetDesc: 'Pick any combination of individual chord types below.',
    includedChordTypesTitle: '2. Included Chord Types',
    plainNamesHelper: 'Plain names & symbols (example on C)',
    triadsSubheading: '3-Note Triads',
    seventhsSubheading: '4-Note Seventh Chords',
    positionsInversionsTitle: '3. Chord Positions & Inversions',
    inversionsExplanationPrefix: 'An',
    inversionsExplanationBold: 'inversion',
    inversionsExplanationMiddle:
      'is the exact same chord with its notes rearranged so a different note is on the bottom. Beginners should start with',
    inversionsExplanationEnd: 'Root position',
    recommendedForBeginners: 'Recommended for beginners',
    appliesWhenSeventhEnabled: ' (Applies when a 4-note seventh chord is enabled.)',
    practiceAidsTitle: '4. Practice Aids',
    showAllKeyLabelsTitle: 'Show note names on every piano key',
    showAllKeyLabelsDesc:
      'When off, note names appear only on the highlighted chord keys and C4/C5 landmarks.',
    autoPlayAudioTitle: 'Auto-play chord sound on each card',
    autoPlayAudioDesc:
      'Automatically play the grand piano chord sound when a card appears or is answered.',
    doneSettingsButton: 'Done & Continue Practice',
  },
  lt: {
    skipToPractice: 'Pereiti prie akordų praktikos',
    customPresetName: 'Pasirinktinis',
    voicingsCount: (count: number) => `${count} išdėstymai`,
    currentLevelAria: (level: string, inv: string) =>
      `Dabartinis lygis: ${level}, ${inv}. Spustelėkite norėdami pakeisti akordų nustatymus.`,
    sessionProgressAria: (correct: number, completed: number, acc: number | null, streak: number) =>
      `Sesijos rezultatas: ${correct} teisingai iš ${completed}${
        acc !== null ? `, ${acc}% tikslumas` : ''
      }, serija ${streak}`,
    score: 'Taškai',
    accuracy: 'Tikslumas',
    streak: 'Serija',
    resetProgress: 'Išvalyti sesijos rezultatus',
    toggleLabelsTitle: 'Rodyti natų pavadinimus ant visų klavišų',
    toggleLabelsSr: 'Rodyti natų pavadinimus ant visų klavišų',
    switchLanguageTitle: 'Perjungti kalbą į anglų (English)',
    openSettingsAria: 'Atidaryti akordų ir praktikos nustatymus',
    settingsButton: 'Nustatymai',
    inversionsActiveNotice:
      'Įjungti apvertimai: akordo natos gali būti sukeistos vietomis (pagrindinė padėtis, 1-asis arba 2-asis apvertimas).',
    pianoKeyboardSectionAria: 'Fortepijono klaviatūra',
    lowestNoteLegend: 'Žemiausia nata (bosas)',
    chordNoteLegend: 'Akordo nata',
    lowestNoteTitle: 'Žemiausia nata (bosas)',
    chordNoteTitle: 'Akordo nata',
    hearChord: 'Klausyti akordo',
    hearChordAria: 'Atkurti pažymėto akordo skambesį (Spartusis klavišas: Tarpas)',
    highlightedKeysSr: (summary: string) =>
      `Pažymėti fortepijono klavišai nuo žemiausio iki aukščiausio: ${summary}.`,
    twoOctaveGroupAria: 'Dviejų oktavų fortepijono klaviatūra nuo C4 iki B5',
    keyAria: (spoken: string, octave: number, isHighlighted: boolean, isBass: boolean) =>
      `${spoken} ${octave}${
        isHighlighted
          ? `, pažymėta akordo nata${isBass ? ', žemiausia nata (bosas)' : ''}`
          : ''
      }`,
    promptHeading: 'Kuris akordas pažymėtas klaviatūroje?',
    keysHint: (count: number) => `Klavišai 1–${count} atsakymui`,
    answerChoicesGroupAria: 'Akordo atsakymo variantai',
    correctBadge: '✓ Teisingai',
    yourPickBadge: '✗ Jūsų pasirinkimas',
    optionAria: (idx: number, label: string, status: 'correct' | 'incorrect' | null) =>
      `Variantas ${idx}: ${label}${
        status === 'correct'
          ? ' — Teisingas atsakymas'
          : status === 'incorrect'
          ? ' — Neteisingas pasirinkimas'
          : ''
      }`,
    chordSymbolTitle: 'Akordo žymėjimas',
    answerFeedbackAria: 'Atsakymo paaiškinimas',
    correctTitlePrefix: 'Puiku! Tai',
    incorrectTitlePrefix: (chosen: string) =>
      `Ne visai — pasirinkote ${chosen}. Teisingas akordas yra`,
    anotherChord: 'kitą akordą',
    notesPlayedLabel: 'Akordo natos (iš apačios į viršų)',
    voicingPositionLabel: 'Padėtis / Apvertimas',
    bassOnBottom: (note: string) => `(${note} apačioje)`,
    rootOnBottom: '(Pagrindinis garsas apačioje)',
    keyboardShapeLabel: 'Akordo sandara klaviatūroje',
    nextCardButton: 'Kitas akordas',
    nextCardAria: 'Kitas praktikos akordas (Spartusis klavišas: Enter)',
    settingsModalTitle: 'Praktikos nustatymai',
    settingsModalSubtitle:
      'Pasirinkite, kokie akordai ir jų apvertimai bus rodomi. Pakeitimai įsigalioja iš karto, išsaugant jūsų sesijos taškus.',
    closeSettingsAria: 'Uždaryti nustatymus',
    languageSectionTitle: 'Kalba / Language',
    practiceLevelTitle: '1. Praktikos lygis',
    selectedCountBadge: (count: number) => `Pasirinkta: ${count}`,
    customPresetDesc: 'Žemiau pasirinkite bet kurį norimų akordų derinį.',
    includedChordTypesTitle: '2. Įtraukti akordų tipai',
    plainNamesHelper: 'Pavadinimai ir žymėjimai (pavyzdys nuo C)',
    triadsSubheading: '3 natų trigarsiai',
    seventhsSubheading: '4 natų septakordai',
    positionsInversionsTitle: '3. Akordų padėtys ir apvertimai',
    inversionsExplanationPrefix: 'Akordo',
    inversionsExplanationBold: 'apvertimas',
    inversionsExplanationMiddle:
      'yra tas pats akordas, kurio natos sukeistos vietomis taip, kad apačioje skambėtų kita akordo nata. Pradedantiesiems rekomenduojama',
    inversionsExplanationEnd: 'Pagrindinė padėtis',
    recommendedForBeginners: 'Rekomenduojama pradedantiesiems',
    appliesWhenSeventhEnabled: ' (Taikoma, kai įjungti 4 natų septakordai.)',
    practiceAidsTitle: '4. Pagalbinės priemonės',
    showAllKeyLabelsTitle: 'Rodyti natų pavadinimus ant visų klavišų',
    showAllKeyLabelsDesc:
      'Kai išjungta, natų pavadinimai rodomi tik ant pažymėtų akordo klavišų bei C4/C5 orientyrų.',
    autoPlayAudioTitle: 'Automatiškai pagroti akordą',
    autoPlayAudioDesc:
      'Automatiškai atkurti fortepijono akordo skambesį pasirodžius naujai kortelei arba atsakant.',
    doneSettingsButton: 'Atlikta — tęsti praktiką',
  },
} as const;
