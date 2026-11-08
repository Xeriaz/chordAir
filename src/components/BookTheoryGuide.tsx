import React, { useEffect, useRef, useState } from 'react';
import { playChord, playNote } from '../domain/audio';
import { PIANO_KEYS, getRootNoteName } from '../domain/notes';
import { Language } from '../domain/types';

interface BookTheoryGuideProps {
  language: Language;
  onToggleLanguage: () => void;
  onBackToPractice: () => void;
  onOpenChordsGuide?: () => void;
  onOpenRhythmGuide?: () => void;
  onOpenSheetMusic?: (page?: number) => void;
}

type ChapterId =
  | 'all'
  | 'ch1-posture'
  | 'ch2-staff'
  | 'ch3-rhythm'
  | 'ch4-scales'
  | 'ch5-chords'
  | 'ch6-harmony'
  | 'ch7-expression';

interface ScalePreset {
  id: string;
  lessonRef: string;
  nameEn: string;
  nameLt: string;
  formula: string;
  notesLabel: string;
  midis: number[];
  rhFingering: string;
  lhFingering: string;
  descEn: string;
  descLt: string;
}

const BOOK_SCALES: ScalePreset[] = [
  {
    id: 'c-major',
    lessonRef: 'Lesson 5 & 7',
    nameEn: 'C Major Scale (Ionian)',
    nameLt: 'C mažoro gama (Joninė)',
    formula: 'T – T – ST – T – T – T – ST (1 2 3 4 5 6 7 8)',
    notesLabel: 'C – D – E – F – G – A – B – C',
    midis: [60, 62, 64, 65, 67, 69, 71, 72],
    rhFingering: '1 – 2 – 3 – 1 (thumb under) – 2 – 3 – 4 – 5',
    lhFingering: '5 – 4 – 3 – 2 – 1 – 3 (crossover) – 2 – 1',
    descEn:
      'All white keys starting on Middle C. Semitones naturally occur between E–F (3–4) and B–C (7–8).',
    descLt:
      'Visi balti klavišai nuo pirmosios oktavos C. Natūralūs pustoniai yra tarp E–F (3–4) ir B–C (7–8).',
  },
  {
    id: 'g-major',
    lessonRef: 'Lesson 11',
    nameEn: 'G Major Scale (1 Sharp: F♯)',
    nameLt: 'G mažoro gama (1 diezas: F♯)',
    formula: 'T – T – ST – T – T – T – ST (1 2 3 4 5 6 7 8)',
    notesLabel: 'G – A – B – C – D – E – F♯ – G',
    midis: [67, 69, 71, 72, 74, 76, 78, 79],
    rhFingering: '1 – 2 – 3 – 1 (thumb under) – 2 – 3 – 4 – 5',
    lhFingering: '5 – 4 – 3 – 2 – 1 – 3 (crossover) – 2 – 1',
    descEn:
      'Starts on G and requires F♯ (black key) so the 7th-to-8th step remains 1 semitone.',
    descLt:
      'Prasideda nuo G ir turi vieną diezą F♯, kad tarp 7 ir 8 laipsnių išliktų 1 pustonis.',
  },
  {
    id: 'f-major',
    lessonRef: 'Lesson 12',
    nameEn: 'F Major Scale (1 Flat: B♭)',
    nameLt: 'F mažoro gama (1 bemolis: B♭)',
    formula: 'T – T – ST – T – T – T – ST (1 2 3 4 5 6 7 8)',
    notesLabel: 'F – G – A – B♭ – C – D – E – F',
    midis: [65, 67, 69, 70, 72, 74, 76, 77],
    rhFingering: '1 – 2 – 3 – 4 – 1 (thumb under on C) – 2 – 3 – 4',
    lhFingering: '5 – 4 – 3 – 2 – 1 – 3 (crossover) – 2 – 1',
    descEn:
      'Contains B♭ on the 4th degree. Because B♭ is a black key, RH uses finger 4 on B♭ and tucks thumb under on C!',
    descLt:
      '4-asis laipsnis yra B♭. Kadangi B♭ yra juodas klavišas, dešinė ranka B♭ groja 4-u pirštu, o nykštį (1) pakiša po C!',
  },
  {
    id: 'd-major',
    lessonRef: 'Lesson 35 & 44',
    nameEn: 'D Major Scale (2 Sharps: F♯, C♯)',
    nameLt: 'D mažoro gama (2 diezai: F♯, C♯)',
    formula: 'T – T – ST – T – T – T – ST (1 2 3 4 5 6 7 8)',
    notesLabel: 'D – E – F♯ – G – A – B – C♯ – D',
    midis: [62, 64, 66, 67, 69, 71, 73, 74],
    rhFingering: '1 – 2 – 3 – 1 – 2 – 3 – 4 – 5',
    lhFingering: '5 – 4 – 3 – 2 – 1 – 3 – 2 – 1',
    descEn:
      'Featured in Lesson 44 ("How to Learn a New Key"). Contains two sharps: F♯ (3rd) and C♯ (7th).',
    descLt:
      '44 pamokos pavyzdinė tonacija. Turi du diezus: F♯ (3 laipsnis) ir C♯ (7 laipsnis).',
  },
  {
    id: 'a-natural-minor',
    lessonRef: 'Lesson 24',
    nameEn: 'A Natural Minor Scale (Relative of C)',
    nameLt: 'A natūraliojo minoro gama (paralelinė C mažorui)',
    formula: '1 – 2 – ♭3 – 4 – 5 – ♭6 – ♭7 – 8 (T – ST – T – T – ST – T – T)',
    notesLabel: 'A – B – C – D – E – F – G – A',
    midis: [69, 71, 72, 74, 76, 77, 79, 81],
    rhFingering: '1 – 2 – 3 – 1 – 2 – 3 – 4 – 5',
    lhFingering: '5 – 4 – 3 – 2 – 1 – 3 – 2 – 1',
    descEn:
      'Built on the 6th degree of C major. Shares the exact same white keys as C major, starting and ending on A.',
    descLt:
      'Sudaroma nuo C mažoro VI laipsnio. Turi tas pačias baltas natas kaip C mažoras, bet prasideda ir baigiasi nata A.',
  },
  {
    id: 'a-harmonic-minor',
    lessonRef: 'Lesson 25',
    nameEn: 'A Harmonic Minor Scale (Raised 7th: G♯)',
    nameLt: 'A harmoninio minoro gama (paaukštintas VII laipsnis: G♯)',
    formula: '1 – 2 – ♭3 – 4 – 5 – ♭6 – 7 – 8',
    notesLabel: 'A – B – C – D – E – F – G♯ – A',
    midis: [69, 71, 72, 74, 76, 77, 80, 81],
    rhFingering: '1 – 2 – 3 – 1 – 2 – 3 – 4 – 5',
    lhFingering: '5 – 4 – 3 – 2 – 1 – 3 – 2 – 1',
    descEn:
      'Raises the 7th degree (G → G♯) to create a strong leading tone and a 1½-tone (3 semitone) "Eastern" gap between F and G♯.',
    descLt:
      'Paaukština VII laipsnį (G → G♯), sukurdama vedamąjį garsą ir 1,5 tono (3 pustonių) rytietišką intervalą tarp F ir G♯.',
  },
  {
    id: 'a-melodic-minor',
    lessonRef: 'Lesson 25 & 35',
    nameEn: 'A Melodic Minor Scale (Ascending: F♯, G♯)',
    nameLt: 'A melodinio minoro gama (kylanti: F♯, G♯)',
    formula: '1 – 2 – ♭3 – 4 – 5 – 6 – 7 – 8 (Ascending)',
    notesLabel: 'A – B – C – D – E – F♯ – G♯ – A',
    midis: [69, 71, 72, 74, 76, 78, 80, 81],
    rhFingering: '1 – 2 – 3 – 1 – 2 – 3 – 4 – 5',
    lhFingering: '5 – 4 – 3 – 2 – 1 – 3 – 2 – 1',
    descEn:
      'Raises both 6th and 7th degrees (F♯, G♯) when ascending (like a major scale with ♭3). In Classical music it descends as natural minor; in Jazz it stays raised both ways.',
    descLt:
      'Kylant paaukštinami VI ir VII laipsniai (F♯, G♯ — tarsi mažoras su ♭3). Klasikoje leidžiantis grįžtama į natūralųjį minorą, o džiaze grojama vienodai.',
  },
  {
    id: 'a-minor-pentatonic',
    lessonRef: 'Lesson 26',
    nameEn: 'A Minor Pentatonic Scale (5 Notes)',
    nameLt: 'A minorinė pentatonika (5 natų gama)',
    formula: '1 – ♭3 – 4 – 5 – ♭7 – 8 (Omits 2nd & 6th)',
    notesLabel: 'A – C – D – E – G – A',
    midis: [69, 72, 74, 76, 79, 81],
    rhFingering: '1 – 2 – 3 – 1 – 2 – 3',
    lhFingering: '5 – 3 – 2 – 1 – 2 – 1',
    descEn:
      'A 5-note scale formed by omitting the 2nd and 6th degrees of the natural minor scale. Essential for rock/blues riffs and improvisation.',
    descLt:
      '5 garsų gama, gaunama iš natūraliojo minoro praleidus II ir VI laipsnius. Pagrindinė roko, bliuzo rifų ir improvizacijos gama.',
  },
  {
    id: 'c-blues',
    lessonRef: 'Lesson 28 & 30',
    nameEn: 'C Blues Scale (with Blue Notes ♭3, ♭5, ♭7)',
    nameLt: 'C bliuzo gama (su „mėlynosiomis“ natomis ♭3, ♭5, ♭7)',
    formula: '1 – ♭3 – 4 – ♭5 – 5 – ♭7 – 8',
    notesLabel: 'C – E♭ – F – G♭ – G – B♭ – C',
    midis: [60, 63, 65, 66, 67, 70, 72],
    rhFingering: '1 – 2 – 3 – 4 – 1 – 2 – 3',
    lhFingering: '5 – 3 – 2 – 1 – 3 – 2 – 1',
    descEn:
      'Minor pentatonic plus the flattened 5th (G♭). Contains all three Blue Notes (E♭, G♭, B♭) and omits degrees 2 and 6.',
    descLt:
      'Minorinė pentatonika su pridėtu pažemintu V laipsniu (G♭). Apima visas tris „mėlynąsias“ bliuzo natas (E♭, G♭, B♭).',
  },
  {
    id: 'd-dorian',
    lessonRef: 'Lesson 42',
    nameEn: 'D Dorian Mode (2nd Mode of C Major)',
    nameLt: 'D dorinė dermė (II-oji C mažoro dermė)',
    formula: '1 – 2 – ♭3 – 4 – 5 – 6 – ♭7 – 8',
    notesLabel: 'D – E – F – G – A – B – C – D',
    midis: [62, 64, 65, 67, 69, 71, 72, 74],
    rhFingering: '1 – 2 – 3 – 1 – 2 – 3 – 4 – 5',
    lhFingering: '5 – 4 – 3 – 2 – 1 – 3 – 2 – 1',
    descEn:
      'Starts on the 2nd degree of C major. Sounds like a minor scale with a raised natural 6th (B), ideal over Dm7 or Cm7 → F7 modal grooves.',
    descLt:
      'Prasideda nuo C mažoro II laipsnio. Minorinė dermė su paaukštinta (natūralia) seksta (B) — puikiai tinka Dm7 bei modaliniam džiazui.',
  },
  {
    id: 'g-mixolydian',
    lessonRef: 'Lesson 42',
    nameEn: 'G Mixolydian Mode (5th Mode of C Major)',
    nameLt: 'G miksolidinė dermė (V-oji C mažoro dermė)',
    formula: '1 – 2 – 3 – 4 – 5 – 6 – ♭7 – 8',
    notesLabel: 'G – A – B – C – D – E – F – G',
    midis: [67, 69, 71, 72, 74, 76, 77, 79],
    rhFingering: '1 – 2 – 3 – 1 – 2 – 3 – 4 – 5',
    lhFingering: '5 – 4 – 3 – 2 – 1 – 3 – 2 – 1',
    descEn:
      'Starts on the 5th degree of C major. A major scale with a flattened 7th (F natural), matching Dominant 7th (G7) chords.',
    descLt:
      'Prasideda nuo C mažoro V laipsnio. Mažorinė gama su pažemintu VII laipsniu (♭7), idealiai atitinkanti dominantseptakordą (G7).',
  },
];

interface BookExerciseItem {
  id: string;
  lesson: string;
  titleEn: string;
  titleLt: string;
  timeSig: string;
  keyName: string;
  chordsUsed: string;
  focusEn: string;
  focusLt: string;
  melodyNotesLabel: string;
  sequence: Array<{ midis: number[]; durationMs: number; label: string }>;
}

const BOOK_EXERCISES: BookExerciseItem[] = [
  {
    id: 'ode-to-joy',
    lesson: 'Lesson 2 & 10',
    titleEn: 'Ode to Joy (L. van Beethoven)',
    titleLt: 'Odė džiaugsmui (L. van Beethoven)',
    timeSig: '4/4',
    keyName: 'C Major',
    chordsUsed: 'C, G7',
    focusEn: '5-finger C position (C–D–E–F–G) with Left Hand C & G7 block chords.',
    focusLt: '5 pirštų C padėtis (C–D–E–F–G) su kairės rankos C ir G7 akordais.',
    melodyNotesLabel: 'E – E – F – G | G – F – E – D | C – C – D – E | E. – D – D',
    sequence: [
      { midis: [60, 64, 67, 76], durationMs: 420, label: 'E + C chord' },
      { midis: [76], durationMs: 420, label: 'E' },
      { midis: [77], durationMs: 420, label: 'F' },
      { midis: [79], durationMs: 420, label: 'G' },
      { midis: [59, 65, 67, 79], durationMs: 420, label: 'G + G7 chord' },
      { midis: [77], durationMs: 420, label: 'F' },
      { midis: [76], durationMs: 420, label: 'E' },
      { midis: [74], durationMs: 420, label: 'D' },
      { midis: [60, 64, 67, 72], durationMs: 420, label: 'C + C chord' },
      { midis: [72], durationMs: 420, label: 'C' },
      { midis: [74], durationMs: 420, label: 'D' },
      { midis: [76], durationMs: 420, label: 'E' },
      { midis: [76], durationMs: 630, label: 'E.' },
      { midis: [59, 65, 67, 74], durationMs: 210, label: 'D' },
      { midis: [59, 65, 67, 74], durationMs: 750, label: 'D + G7' },
    ],
  },
  {
    id: 'when-the-saints',
    lesson: 'Lesson 3',
    titleEn: "When the Saints Go Marchin' In",
    titleLt: "When the Saints Go Marchin' In (Naujojo Orleano džiazas)",
    timeSig: '4/4',
    keyName: 'C Major',
    chordsUsed: 'C, F, G7',
    focusEn: '3-beat Lead-in (pick-up bar: C–E–F | G), ties across bar lines, and quarter/half rests.',
    focusLt: '3 dalių prieštaktis (C–E–F | G), lygos per takto brūkšnį ir ketvirtinės bei pusinės pauzės.',
    melodyNotesLabel: '(Lead-in) C – E – F | G (held) | C – E – F | G (held) | C – E – F – G – E – C – E – D',
    sequence: [
      { midis: [72], durationMs: 360, label: 'C (Lead-in)' },
      { midis: [76], durationMs: 360, label: 'E' },
      { midis: [77], durationMs: 360, label: 'F' },
      { midis: [60, 64, 67, 79], durationMs: 950, label: 'G + C chord' },
      { midis: [72], durationMs: 360, label: 'C' },
      { midis: [76], durationMs: 360, label: 'E' },
      { midis: [77], durationMs: 360, label: 'F' },
      { midis: [60, 64, 67, 79], durationMs: 950, label: 'G + C chord' },
      { midis: [72], durationMs: 360, label: 'C' },
      { midis: [76], durationMs: 360, label: 'E' },
      { midis: [77], durationMs: 360, label: 'F' },
      { midis: [60, 64, 67, 79], durationMs: 650, label: 'G' },
      { midis: [76], durationMs: 650, label: 'E' },
      { midis: [72], durationMs: 650, label: 'C' },
      { midis: [76], durationMs: 650, label: 'E' },
      { midis: [59, 65, 67, 74], durationMs: 900, label: 'D + G7' },
    ],
  },
  {
    id: 'brahms-lullaby',
    lesson: 'Lesson 6',
    titleEn: "Brahms' Lullaby (J. Brahms)",
    titleLt: 'Bramso lopšinė (J. Brahms)',
    timeSig: '3/4',
    keyName: 'C Major',
    chordsUsed: 'C, F, G7',
    focusEn: 'Waltz time (3/4), dotted quarter note (1½ beats) followed by an eighth note, and thumb-under crossover.',
    focusLt: 'Valso metras (3/4), punktuota ketvirtinė nata (1,5 dalies) su aštuntine ir nykščio pakišimas.',
    melodyNotesLabel: 'E – E | G (dotted qtr) – E – E | G – E – G – C5 – B – A – A – G',
    sequence: [
      { midis: [76], durationMs: 320, label: 'E' },
      { midis: [76], durationMs: 320, label: 'E' },
      { midis: [60, 64, 67, 79], durationMs: 750, label: 'G. + C' },
      { midis: [76], durationMs: 320, label: 'E' },
      { midis: [76], durationMs: 320, label: 'E' },
      { midis: [60, 64, 67, 79], durationMs: 750, label: 'G + C' },
      { midis: [76], durationMs: 320, label: 'E' },
      { midis: [79], durationMs: 320, label: 'G' },
      { midis: [60, 65, 69, 84], durationMs: 640, label: 'C5 + F' },
      { midis: [83], durationMs: 450, label: 'B' },
      { midis: [81], durationMs: 320, label: 'A' },
      { midis: [81], durationMs: 450, label: 'A' },
      { midis: [59, 65, 67, 79], durationMs: 800, label: 'G + G7' },
    ],
  },
  {
    id: 'house-rising-sun',
    lesson: 'Lesson 25',
    titleEn: 'House of the Rising Sun (6/8 Minor Arpeggios)',
    titleLt: 'House of the Rising Sun (6/8 minoriniai arpedžio)',
    timeSig: '6/8',
    keyName: 'A Minor',
    chordsUsed: 'Am, C, D, F, E7',
    focusEn: 'Six-eight compound meter (2 dotted-quarter beats per bar, accented on counts 1 & 4) combining chords from Natural, Harmonic & Melodic minor!',
    focusLt: '6/8 sudėtinis metras (2 punktuotų ketvirtinių dalys takte, kirčiuojant 1 ir 4) su akordais iš visų 3 minoro atmainų (Am, C, D, F, E7).',
    melodyNotesLabel: 'Am (A–C–E) → C (C–E–G) → D (D–F♯–A) → F (F–A–C) → Am → E7 (E–G♯–B–D)',
    sequence: [
      { midis: [69, 72, 76], durationMs: 550, label: 'Am (i)' },
      { midis: [60, 64, 67], durationMs: 550, label: 'C (III)' },
      { midis: [62, 66, 69], durationMs: 550, label: 'D (IV - Melodic min)' },
      { midis: [65, 69, 72], durationMs: 550, label: 'F (VI - Natural min)' },
      { midis: [69, 72, 76], durationMs: 550, label: 'Am (i)' },
      { midis: [64, 68, 71, 74], durationMs: 750, label: 'E7 (V7 - Harmonic min)' },
      { midis: [69, 72, 76], durationMs: 850, label: 'Am (i)' },
    ],
  },
  {
    id: 'blues-riff-c',
    lesson: 'Lesson 28–31',
    titleEn: '12-Bar Blues Riff & Dominant 7th Voicings',
    titleLt: '12 taktų bliuzo rifas ir dominantseptakordai',
    timeSig: '4/4 Swing',
    keyName: 'C Blues',
    chordsUsed: 'C7, F7, G7',
    focusEn: 'C Blues scale riff (C–E♭–F–G♭–G–B♭–C) over Dominant 7th chords (1–3–5–♭7).',
    focusLt: 'C bliuzo gamos rifas (C–E♭–F–G♭–G–B♭–C) virš dominantseptakordų (C7, F7, G7).',
    melodyNotesLabel: 'C – E♭ – F – G♭ – G – B♭ – C5 (over C7 → F7 → G7)',
    sequence: [
      { midis: [60, 64, 67, 70], durationMs: 500, label: 'C7 (1 3 5 ♭7)' },
      { midis: [72], durationMs: 280, label: 'C' },
      { midis: [75], durationMs: 280, label: 'E♭ (♭3)' },
      { midis: [77], durationMs: 280, label: 'F (4)' },
      { midis: [78], durationMs: 260, label: 'G♭ (♭5 Blue note)' },
      { midis: [79], durationMs: 420, label: 'G (5)' },
      { midis: [82], durationMs: 360, label: 'B♭ (♭7)' },
      { midis: [65, 69, 72, 75, 84], durationMs: 650, label: 'C5 + F7 (IV7)' },
      { midis: [67, 71, 74, 77], durationMs: 650, label: 'G7 (V7)' },
      { midis: [60, 64, 67, 70, 72], durationMs: 850, label: 'C7 (I7)' },
    ],
  },
];

const WHITE_KEYS = PIANO_KEYS.filter((k) => !k.noteInfo.isBlack);
const BLACK_KEYS = PIANO_KEYS.filter((k) => k.noteInfo.isBlack);

function getBlackLeftPercent(midi: number): number {
  const whiteBefore = WHITE_KEYS.filter((wk) => wk.midi < midi).length;
  return (whiteBefore * 100) / WHITE_KEYS.length;
}


export const SCALE_BOOK_PAGES: Record<string, number> = {
  'c-major': 20,
  'g-major': 54,
  'f-major': 58,
  'd-major': 142,
  'a-natural-minor': 104,
  'a-harmonic-minor': 108,
  'a-melodic-minor': 108,
  'a-minor-pentatonic': 112,
  'c-blues': 120,
  'd-dorian': 185,
  'g-mixolydian': 185,
};

export const EXERCISE_BOOK_PAGES: Record<string, number> = {
  'ode-to-joy': 16,
  'when-the-saints': 18,
  'brahms-lullaby': 23,
  'house-rising-sun': 108,
  'blues-riff-c': 116,
};

export const BookTheoryGuide: React.FC<BookTheoryGuideProps> = ({
  language,
  onToggleLanguage,
  onBackToPractice,
  onOpenChordsGuide,
  onOpenRhythmGuide,
  onOpenSheetMusic,
}) => {
  const isLt = language === 'lt';
  const [activeChapter, setActiveChapter] = useState<ChapterId>('all');
  const [selectedScaleId, setSelectedScaleId] = useState<string>('c-major');
  const [playingExerciseId, setPlayingExerciseId] = useState<string | null>(null);
  const [activeExerciseStepLabel, setActiveExerciseStepLabel] = useState<string | null>(null);
  const timeoutsRef = useRef<number[]>([]);

  const selectedScale =
    BOOK_SCALES.find((s) => s.id === selectedScaleId) ?? BOOK_SCALES[0];

  const clearScheduledAudio = () => {
    timeoutsRef.current.forEach((id) => window.clearTimeout(id));
    timeoutsRef.current = [];
    setPlayingExerciseId(null);
    setActiveExerciseStepLabel(null);
  };

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const handlePlayScale = (scale: ScalePreset) => {
    clearScheduledAudio();
    scale.midis.forEach((midi, idx) => {
      playNote(midi, idx * 0.28, 0.9, 0.65);
    });
  };

  const handlePlayProgression = (chordSequence: number[][]) => {
    clearScheduledAudio();
    chordSequence.forEach((midis, stepIdx) => {
      const tid = window.setTimeout(() => {
        playChord(midis);
      }, stepIdx * 720);
      timeoutsRef.current.push(tid);
    });
  };

  const handlePlayExercise = (ex: BookExerciseItem) => {
    if (playingExerciseId === ex.id) {
      clearScheduledAudio();
      return;
    }
    clearScheduledAudio();
    setPlayingExerciseId(ex.id);

    let elapsed = 0;
    ex.sequence.forEach((step) => {
      const tid = window.setTimeout(() => {
        setActiveExerciseStepLabel(step.label);
        if (step.midis.length === 1) {
          playNote(step.midis[0], 0, Math.max(0.45, step.durationMs / 1000 + 0.25), 0.7);
        } else {
          playChord(step.midis);
        }
      }, elapsed);
      timeoutsRef.current.push(tid);
      elapsed += step.durationMs;
    });

    const endTid = window.setTimeout(() => {
      setPlayingExerciseId(null);
      setActiveExerciseStepLabel(null);
    }, elapsed + 200);
    timeoutsRef.current.push(endTid);
  };

  const showSection = (id: Exclude<ChapterId, 'all'>) =>
    activeChapter === 'all' || activeChapter === id;

  const CHAPTER_TABS: Array<{ id: ChapterId; badge: string; labelEn: string; labelLt: string }> = [
    { id: 'all', badge: 'All 46', labelEn: 'Full Book Curriculum', labelLt: 'Visas vadovėlio kursas' },
    { id: 'ch1-posture', badge: 'Ch. 1', labelEn: 'Posture & Fingering', labelLt: 'Laikysena ir pirštuotė' },
    { id: 'ch2-staff', badge: 'Ch. 2', labelEn: 'Staff & Clefs', labelLt: 'Penklinė ir raktai' },
    { id: 'ch3-rhythm', badge: 'Ch. 3', labelEn: 'Notes, Rests & Meter', labelLt: 'Natos, pauzės ir metras' },
    { id: 'ch4-scales', badge: 'Ch. 4', labelEn: 'Scales, Modes & Keys', labelLt: 'Gamos, dermės ir tonacijos' },
    { id: 'ch5-chords', badge: 'Ch. 5', labelEn: 'Chords, 7ths & Extensions', labelLt: 'Akordai, 7 ir išplėtimai' },
    { id: 'ch6-harmony', badge: 'Ch. 6', labelEn: 'Harmony, Blues & Keys', labelLt: 'Harmonija ir bliuzas' },
    { id: 'ch7-expression', badge: 'Ch. 7', labelEn: 'Dynamics, Pedal & Songs', labelLt: 'Dinamika, pedalas ir kūriniai' },
  ];

  return (
    <article
      className="theory-guide-container subdivision-guide book-theory-guide"
      aria-labelledby="book-guide-title"
    >
      {/* Top Navigation & Language Switcher */}
      <div className="theory-nav-bar">
        <button
          type="button"
          className="back-practice-btn"
          onClick={onBackToPractice}
          aria-label={isLt ? 'Grįžti į akordų treniruotę' : 'Back to chord practice'}
        >
          {isLt ? '← Grįžti į treniruotę' : '← Back to Practice'}
        </button>

        <div className="book-quick-nav-group">
          {onOpenSheetMusic && (
            <button
              type="button"
              className="icon-btn book-sheet-nav-btn"
              onClick={() => onOpenSheetMusic(1)}
              title={isLt ? 'Atidaryti visų 216 psl. natų peržiūrą' : 'Open 216-page sheet music viewer'}
            >
              🎼 {isLt ? 'Natos (216 psl.)' : 'Sheet Music (216 p.)'}
            </button>
          )}
          {onOpenChordsGuide && (
            <button
              type="button"
              className="icon-btn"
              onClick={onOpenChordsGuide}
              title={isLt ? 'Atidaryti akordų sandaros gidą' : 'Open Chord Construction Guide'}
            >
              📖 {isLt ? 'Akordų gidas' : 'Chord Guide'}
            </button>
          )}
          {onOpenRhythmGuide && (
            <button
              type="button"
              className="icon-btn"
              onClick={onOpenRhythmGuide}
              title={isLt ? 'Atidaryti ritmo smulkinimo treniruoklį' : 'Open Subdivided Rhythm Guide'}
            >
              ⏱️ {isLt ? 'Ritmo gidas' : 'Rhythm Guide'}
            </button>
          )}
          <button
            type="button"
            className="icon-btn lang-toggle-btn"
            onClick={onToggleLanguage}
            aria-label={isLt ? 'Switch language to English' : 'Perjungti kalbą į lietuvių'}
          >
            <span className={!isLt ? 'lang-code--active' : 'lang-code--inactive'}>EN</span>
            <span className="lang-divider" aria-hidden="true">
              /
            </span>
            <span className={isLt ? 'lang-code--active' : 'lang-code--inactive'}>LT</span>
          </button>
        </div>
      </div>

      {/* Hero Header */}
      <header className="theory-header book-hero-header">
        <div className="section-badge">
          {isLt
            ? '📚 Vadovėlio konspektas · 3 dalys · 46 pamokos (Peter Gelling)'
            : '📚 Complete Manual Curriculum · 3 Sections · 46 Lessons (Peter Gelling)'}
        </div>
        <h1 id="book-guide-title" className="theory-title">
          {isLt
            ? 'Progressive Complete Learn to Play Keyboards: Teorija ir Praktika'
            : 'Progressive Complete Learn to Play Keyboards: Theory & Practice Manual'}
        </h1>
        <p className="theory-subtitle">
          {isLt
            ? 'Susistemintas visų 46 vadovėlio pamokų gidas: nuo sėdėsenos, penklinės raktų, pirštuotės ir ritmikos iki visų tonacijų gamų, dermių, septakordų, alteruotų džiazo akordų bei interaktyvių pratimų.'
            : 'A structured, interactive companion to all 46 lessons in the manual — from posture, staff reading, fingering, and rhythm to scales, modes, chord inversions, guide tones, extended jazz harmony, and playable repertoire.'}
        </p>

        {/* Chapter Filter Pills */}
        <nav
          className="book-chapter-tabs"
          aria-label={isLt ? 'Vadovėlio skyriai' : 'Book curriculum chapters'}
        >
          {CHAPTER_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveChapter(tab.id)}
              className={`book-chapter-pill ${
                activeChapter === tab.id ? 'book-chapter-pill--active' : ''
              }`}
            >
              <span className="book-chapter-badge">{tab.badge}</span>
              <span>{isLt ? tab.labelLt : tab.labelEn}</span>
            </button>
          ))}
        </nav>

        {/* Prominent Action Banner for Sheet Music Viewer */}
        {onOpenSheetMusic && (
          <section
            className="book-sheet-banner"
            aria-label={isLt ? 'Vadovėlio natų peržiūra' : 'Book Sheet Music Viewer'}
          >
            <div className="book-sheet-banner__content">
              <div className="book-sheet-banner__badge">
                <span className="book-sheet-banner__badge-icon">📖</span>
                <span>{isLt ? 'Originalios vadovėlio natos' : 'Original Manual Sheet Music'}</span>
                <span className="book-sheet-banner__tag">216 {isLt ? 'Puslapių' : 'Pages'}</span>
              </div>
              <h2 className="book-sheet-banner__title">
                {isLt
                  ? 'Žiūrėti visą Peter Gelling vadovėlio natų leidinį'
                  : 'Browse Complete 216-Page Manual Sheet Music'}
              </h2>
              <p className="book-sheet-banner__desc">
                {isLt
                  ? 'Mokykitės tiesiai iš originalių vadovėlio puslapių: aiški penklinė, pirštuotė (1–5), pratimai ir visi kūriniai su greitu mastelio keitimu (zoom), klaviatūros valdymu ir pamokų rodykle.'
                  : 'Study directly from the complete 216-page manual with razor-sharp sheet music notation, fingering numbers (1–5), repertoire pieces, zoom/pan, keyboard flipping, and curriculum landmarks.'}
              </p>
            </div>
            <button
              type="button"
              className="book-sheet-banner__btn"
              onClick={() => onOpenSheetMusic(1)}
            >
              <span className="banner-btn-icon">📖</span>
              <span>{isLt ? 'Atidaryti vadovėlio natų peržiūrą' : 'Open Book Sheet Music Viewer'}</span>
              <span className="banner-btn-badge">216 P.</span>
            </button>
          </section>
        )}
      </header>

      {/* =====================================================================
          CHAPTER 1: POSTURE, HAND SHAPE, FINGERING & KEYBOARD GEOGRAPHY
          ===================================================================== */}
      {showSection('ch1-posture') && (
        <section className="theory-card" aria-labelledby="ch1-heading">
          <div className="card-badge card-badge--gold">
            {isLt
              ? '1 Skyrius · Įvadas ir 1–8 pamokos (Pagrindai)'
              : 'Chapter 1 · Introduction & Lessons 1–8 (Foundations)'}
          </div>
          <h2 id="ch1-heading" className="card-title">
            {isLt
              ? 'Laikysena, rankos forma, pirštuotė (1–5) ir klaviatūros orientyrai'
              : 'Posture, Hand Shape, Fingering Rules (1–5) & Keyboard Landmarks'}
          </h2>
          <p className="section-description">
            {isLt
              ? 'Prieš grojant pirmąsias natas, vadovėlis pabrėžia taisyklingą sėdėseną, išgaubtus pirštus ir sistemingą kasdienę praktiką.'
              : 'Before playing your first piece, the manual establishes ergonomic posture, curved finger mechanics, and a structured daily practice routine.'}
          </p>

          <div className="beginner-steps-container">
            <div className="beginner-step-pill">
              <span className="pill-number">1</span>
              <div className="pill-content">
                <strong>
                  {isLt
                    ? 'Sėdėsena ir riešo padėtis (How to Sit at the Keyboard)'
                    : 'Sitting Posture & Bench Height (Page 8)'}
                </strong>
                <p>
                  {isLt
                    ? 'Sėdėkite tiesiai, bet atsipalaidavę. Sureguliuokite kėdutės aukštį taip, kad dilbiai būtų lygiagretūs klaviatūrai, o pečiai neįsitempę.'
                    : 'Sit up straight and relaxed in the middle of the keyboard. Adjust seat height so your forearms are comfortable and level with the keys.'}
                </p>
              </div>
            </div>

            <div className="beginner-step-pill">
              <span className="pill-number">2</span>
              <div className="pill-content">
                <strong>
                  {isLt
                    ? 'Išgaubti pirštai (Hand Shape & Finger Tips)'
                    : 'Curved Fingers & Thumb Side (Page 8)'}
                </strong>
                <p>
                  {isLt
                    ? 'Visada laikykite pirštus švelniai suapvalintus (tarsi laikytumėte kamuoliuką). Klavišus spauskite pirštų pagalvėlėmis (galiukais) ir nykščio šonu.'
                    : 'Always curve your fingers to keep them at the same level. Strike keys with the tips of fingers 2–5 and the outer side of your thumb (1).'}
                </p>
              </div>
            </div>

            <div className="beginner-step-pill">
              <span className="pill-number">3</span>
              <div className="pill-content">
                <strong>
                  {isLt
                    ? 'Praktikos metodika (Approach to Practice)'
                    : 'Daily Practice Approach (Page 7)'}
                </strong>
                <p>
                  {isLt
                    ? 'Kasdienės 15–30 min. treniruotės duoda daug daugiau naudos nei viena ilga sesija per savaitę. Laiką dalinkite po lygiai naujai medžiagai ir senų kūrinių kartojimui su metronomu.'
                    : 'Short daily sessions (15–30 min/day) beat one long weekly session. Split time evenly between new material and revising past work slowly with a metronome.'}
                </p>
              </div>
            </div>
          </div>

          {/* Fingering & Keyboard Landmarks Grid */}
          <div className="scenarios-breakdown-grid">
            <div className="scenario-callout-card">
              <h3 className="callout-title">
                {isLt
                  ? '🖐️ Pirštų numeracija (Fingering 1–5) ir 5 pirštų padėtys'
                  : '🖐️ Finger Numbers (1–5) & Five-Finger Positions'}
              </h3>
              <ul className="scenario-steps-list">
                <li>
                  <strong>{isLt ? 'Pirštai 1–5 (abi rankos):' : 'Fingers 1–5 (Both Hands):'}</strong>{' '}
                  <code>1</code> = {isLt ? 'Nykštys (Thumb)' : 'Thumb'}, <code>2</code> ={' '}
                  {isLt ? 'Smilius (Index)' : 'Index'}, <code>3</code> ={' '}
                  {isLt ? 'Didysis (Middle)' : 'Middle'}, <code>4</code> ={' '}
                  {isLt ? 'Bevardis (Ring)' : 'Ring'}, <code>5</code> ={' '}
                  {isLt ? 'Mažylis (Pinky)' : 'Little finger'}.
                </li>
                <li>
                  <strong>
                    {isLt ? 'Pirmosios oktavos C (Middle C / C4):' : 'Finding Middle C (C4):'}
                  </strong>{' '}
                  {isLt
                    ? 'Juodi klavišai išsidėstę grupėmis po 2 ir po 3. Nata C visada yra baltas klavišas iš karto į kairę nuo 2 juodų klavišų grupės.'
                    : 'Black keys appear in groups of 2 and 3. Every C is the white key immediately to the left of the two black keys.'}
                </li>
                <li>
                  <strong>
                    {isLt
                      ? 'C ir D penkių pirštų padėtys (Lessons 1 & 8):'
                      : 'C Position & D Position (Lessons 1 & 8):'}
                  </strong>{' '}
                  {isLt
                    ? 'C padėtis dengia C–D–E–F–G (pirštai 1–2–3–4–5). D padėtis paslenka visą ranką per 1 baltą klavišą į dešinę: D–E–F–G–A.'
                    : 'C Position covers C–D–E–F–G with fingers 1–2–3–4–5. D Position shifts the hand up one white key to cover D–E–F–G–A.'}
                </li>
              </ul>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                <button
                  type="button"
                  className="guide-audio-btn"
                  onClick={() => playNote(60)}
                >
                  🔊 {isLt ? 'Klausyti Middle C (C4)' : 'Hear Middle C (C4)'}
                </button>
                <button
                  type="button"
                  className="guide-audio-btn"
                  onClick={() => {
                    [60, 62, 64, 65, 67].forEach((m, i) => playNote(m, i * 0.25, 0.8));
                  }}
                >
                  🔊 {isLt ? 'C padėtis (C–D–E–F–G)' : 'Play C Position (C–D–E–F–G)'}
                </button>
                <button
                  type="button"
                  className="guide-audio-btn"
                  onClick={() => {
                    [62, 64, 65, 67, 69].forEach((m, i) => playNote(m, i * 0.25, 0.8));
                  }}
                >
                  🔊 {isLt ? 'D padėtis (D–E–F–G–A)' : 'Play D Position (D–E–F–G–A)'}
                </button>
              </div>
            </div>

            <div className="scenario-callout-card">
              <h3 className="callout-title">
                {isLt
                  ? '🔄 Nykščio pakišimas (Thumb Under) ir Perkėlimas (Crossover)'
                  : '🔄 Scale Mechanics: Thumb Under & Crossover (Lessons 5, 7, 11)'}
              </h3>
              <ul className="scenario-steps-list">
                <li>
                  <strong>
                    {isLt ? 'Kodėl reikia keisti pirštus:' : 'Why 5 fingers are not enough:'}
                  </strong>{' '}
                  {isLt
                    ? 'Mažorinė gama turi 8 natas (oktavą: Do–Re–Mi–Fa–So–La–Ti–Do). Kad sugroti sklandžiai (legato), naudojamas nykščio pakišimas ir pirštų perkėlimas.'
                    : 'A major scale spans 8 notes (an octave: Do–Re–Mi–Fa–So–La–Ti–Do). Smooth legato playing requires passing the thumb under and crossing fingers over.'}
                </li>
                <li>
                  <strong>
                    {isLt ? 'Dešinė ranka (RH C ir G mažore):' : 'Right Hand (C & G Major):'}
                  </strong>{' '}
                  {isLt
                    ? 'Kylant: 1–2–3, tada nykštys (1) pakišamas po 3-iu pirštu ant 4 laipsnio (F arba C) → 1–2–3–4–5. Leidžiantis: 5–4–3–2–1, tada 3-ias pirštas perkeliamas virš nykščio (3–2–1).'
                    : 'Ascending: play 1–2–3, then pass thumb (1) underneath finger 3 to play the 4th degree → 1–2–3–4–5. Descending: 5–4–3–2–1, then cross finger 3 over thumb → 3–2–1.'}
                </li>
                <li>
                  <strong>
                    {isLt ? 'Kairė ranka (LH atvirkščiai):' : 'Left Hand (Reverse symmetry):'}
                  </strong>{' '}
                  {isLt
                    ? 'Kylant: 5–4–3–2–1, tada 3-ias pirštas perkeliamas virš nykščio ant 6 laipsnio (A arba E) → 3–2–1. Grojant abiem rankomis kartu, perkėlimai vyksta skirtingu metu!'
                    : 'Ascending: 5–4–3–2–1, then cross finger 3 over thumb onto the 6th degree → 3–2–1. When playing hands together, crossovers happen at different moments!'}
                </li>
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          CHAPTER 2: STAFF READING, CLEFS & GRAND STAFF LANDMARKS
          ===================================================================== */}
      {showSection('ch2-staff') && (
        <section className="theory-card" aria-labelledby="ch2-heading">
          <div className="card-badge">
            {isLt
              ? '2 Skyrius · Įvadas ir 1, 7, 13 pamokos (Natų raštas)'
              : 'Chapter 2 · Intro & Lessons 1, 7, 13 (Reading Music)'}
          </div>
          <h2 id="ch2-heading" className="card-title">
            {isLt
              ? 'Penklinė, Smuiko ir Boso raktai, Didžioji penklinė ir natų atmintinės'
              : 'The Staff, Treble & Bass Clefs, Grand Staff & Note Mnemonics'}
          </h2>
          <p className="section-description">
            {isLt
              ? 'Klaviatūros muzika užrašoma Didžiojoje penklinėje (Grand Staff), kurią sudaro dvi penkių linijų penklinės, sujungtos kairėje riestiniu skliaustu (akolade).'
              : 'Keyboard music is written on the Grand Staff — joining the Treble Staff (high notes, right hand) and Bass Staff (low notes, left hand) with a line and bracket/brace.'}
          </p>

          <div className="terms-grid">
            <div className="term-card">
              <div className="term-header">
                <span className="term-primary">
                  {isLt ? '🎼 Smuiko raktas (Treble Clef / G Clef)' : '🎼 Treble Clef & Staff (Smuiko raktas)'}
                </span>
                <span className="term-secondary">
                  {isLt ? 'Aukštos natos · Dažniausiai dešinė ranka (RH)' : 'High notes · Usually Right Hand (RH)'}
                </span>
              </div>
              <p className="term-description">
                {isLt ? (
                  <>
                    <strong>Linijos (iš apačios į viršų):</strong> <code>E – G – B – D – F</code>{' '}
                    (angl. mnemonika: <em>&ldquo;Every Good Boy Deserves Fruit&rdquo;</em>).
                    <br />
                    <strong>Tarpai (iš apačios į viršų):</strong> <code>F – A – C – E</code>{' '}
                    (sudaro anglišką žodį <em>&ldquo;FACE&rdquo;</em>).
                  </>
                ) : (
                  <>
                    <strong>Lines (bottom to top):</strong> <code>E – G – B – D – F</code> (
                    <em>&ldquo;Every Good Boy Deserves Fruit&rdquo;</em>).
                    <br />
                    <strong>Spaces (bottom to top):</strong> <code>F – A – C – E</code> (spells the
                    word <em>&ldquo;FACE&rdquo;</em>).
                  </>
                )}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                <button
                  type="button"
                  className="add-note-chip"
                  onClick={() =>
                    [64, 67, 71, 74, 77].forEach((m, i) => playNote(m, i * 0.28, 0.8))
                  }
                >
                  🔊 {isLt ? 'Linijos: E4–G4–B4–D5–F5' : 'Lines: E4–G4–B4–D5–F5'}
                </button>
                <button
                  type="button"
                  className="add-note-chip"
                  onClick={() =>
                    [65, 69, 72, 76].forEach((m, i) => playNote(m, i * 0.28, 0.8))
                  }
                >
                  🔊 {isLt ? 'Tarpai: F4–A4–C5–E5' : 'Spaces: F4–A4–C5–E5'}
                </button>
              </div>
            </div>

            <div className="term-card">
              <div className="term-header">
                <span className="term-primary">
                  {isLt ? '𝄢 Boso raktas (Bass Clef / F Clef)' : '𝄢 Bass Clef & Staff (Boso raktas)'}
                </span>
                <span className="term-secondary">
                  {isLt ? 'Žemos natos · Dažniausiai kairė ranka (LH)' : 'Low notes · Usually Left Hand (LH)'}
                </span>
              </div>
              <p className="term-description">
                {isLt ? (
                  <>
                    <strong>Linijos (iš apačios į viršų):</strong> <code>G – B – D – F – A</code>{' '}
                    (angl. mnemonika: <em>&ldquo;Good Boys Deserve Fruit Always&rdquo;</em>).
                    <br />
                    <strong>Tarpai (iš apačios į viršų):</strong> <code>A – C – E – G</code>{' '}
                    (angl. mnemonika: <em>&ldquo;All Cows Eat Grass&rdquo;</em>).
                  </>
                ) : (
                  <>
                    <strong>Lines (bottom to top):</strong> <code>G – B – D – F – A</code> (
                    <em>&ldquo;Good Boys Deserve Fruit Always&rdquo;</em>).
                    <br />
                    <strong>Spaces (bottom to top):</strong> <code>A – C – E – G</code> (
                    <em>&ldquo;All Cows Eat Grass&rdquo;</em>).
                  </>
                )}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                <button
                  type="button"
                  className="add-note-chip"
                  onClick={() =>
                    [43, 47, 50, 53, 57].forEach((m, i) => playNote(m, i * 0.28, 0.8))
                  }
                >
                  🔊 {isLt ? 'Linijos: G2–B2–D3–F3–A3' : 'Lines: G2–B2–D3–F3–A3'}
                </button>
                <button
                  type="button"
                  className="add-note-chip"
                  onClick={() =>
                    [45, 48, 52, 55].forEach((m, i) => playNote(m, i * 0.28, 0.8))
                  }
                >
                  🔊 {isLt ? 'Tarpai: A2–C3–E3–G3' : 'Spaces: A2–C3–E3–G3'}
                </button>
              </div>
            </div>

            <div className="term-card">
              <div className="term-header">
                <span className="term-primary">
                  {isLt
                    ? '📏 Pridėtinės linijos (Leger Lines) ir Kotelių kryptis'
                    : '📏 Leger Lines, Stems & 8va / 8vb Symbols'}
                </span>
                <span className="term-secondary">
                  {isLt ? '1, 5, 13 ir 40 pamokos' : 'Lessons 1, 5, 13 & 40'}
                </span>
              </div>
              <p className="term-description">
                {isLt ? (
                  <>
                    <strong>Pridėtinė linija (Leger line):</strong> trumpa horizontali linija natoms
                    už penklinės ribų (pvz., <em>Middle C</em> rašoma ant pirmos pridėtinės linijos po
                    smuiko penkline).
                    <br />
                    <strong>Kotelių kryptis (Stems):</strong> natos žemiau vidurinės (3-ios) linijos
                    turi kotelius į viršų; aukščiau vidurinės linijos — į apačią; ant 3-ios linijos
                    (B) — į bet kurią pusę.
                    <br />
                    <strong>8va / 8vb ir Loco:</strong> <code>8va</code> = groti oktava aukščiau nei
                    užrašyta; <code>8vb</code> = oktava žemiau; <code>loco</code> = grįžti į įprastą
                    aukštį.
                  </>
                ) : (
                  <>
                    <strong>Leger lines:</strong> short lines above or below the staff (Middle C sits
                    on a leger line just below the treble staff).
                    <br />
                    <strong>Stem Rules (Page 20):</strong> notes below the middle line have stems up;
                    notes above have stems down; the middle line (B) can go either way.
                    <br />
                    <strong>8va / 8vb &amp; Loco (Pages 54, 174):</strong> <code>8va</code> = play 1
                    octave higher; <code>8vb</code> = 1 octave lower; <code>loco</code> = return to
                    written pitch.
                  </>
                )}
              </p>
            </div>

            <div className="term-card">
              <div className="term-header">
                <span className="term-primary">
                  {isLt
                    ? '🔁 Taktai, Kartojimo ženklai ir Voltos (1st & 2nd Endings)'
                    : '🔁 Bars, Repeat Signs, 1st/2nd Endings & D.C. al Fine'}
                </span>
                <span className="term-secondary">
                  {isLt ? 'Įvadas, 1 ir 6 pamokos' : 'Intro, Lessons 1 & 6 (Pages 10, 13, 25)'}
                </span>
              </div>
              <p className="term-description">
                {isLt ? (
                  <>
                    <strong>Taktas (Bar / Measure):</strong> atkarpa tarp dviejų vertikalių takto
                    brūkšnių (<em>Bar lines</em>). Dvigubas brūkšnys žymi kūrinio pabaigą.
                    <br />
                    <strong>Kartojimo ženklas (Repeat sign):</strong> du taškai prieš dvigubą takto
                    brūkšnį nurodo pakartoti atkarpą.
                    <br />
                    <strong>1-oji ir 2-oji volta (First &amp; Second Endings):</strong> pirmą kartą
                    grojama atkarpa po skliaustu <code>[1.]</code> ir grįžtama į pradžią; antrą kartą
                    <code>[1.]</code> praleidžiama ir iškart šokama į <code>[2.]</code> (pvz.,{' '}
                    <em>Jingle Bells</em>, p. 25).
                  </>
                ) : (
                  <>
                    <strong>Bar / Measure:</strong> segment between vertical bar lines; a double bar
                    line marks the end of a piece.
                    <br />
                    <strong>Repeat Sign:</strong> two dots before a double bar mean play again from
                    the start.
                    <br />
                    <strong>1st &amp; 2nd Endings (Page 25):</strong> play bracket <code>[1.]</code>{' '}
                    on the first pass and repeat; on the second pass skip <code>[1.]</code> and jump
                    directly to <code>[2.]</code>.
                  </>
                )}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          CHAPTER 3: NOTE & REST VALUES, TIME SIGNATURES & RHYTHM
          ===================================================================== */}
      {showSection('ch3-rhythm') && (
        <section className="theory-card" aria-labelledby="ch3-heading">
          <div className="card-badge">
            {isLt
              ? '3 Skyrius · 1–6, 11, 14, 16–19, 25, 29, 33, 40 pamokos'
              : 'Chapter 3 · Lessons 1–6, 11, 14, 16–19, 25, 29, 33, 40'}
          </div>
          <h2 id="ch3-heading" className="card-title">
            {isLt
              ? 'Natų ir pauzių trukmės, Takto metrai, Triolės, Svingas ir Sinkopė'
              : 'Note & Rest Values, Time Signatures, Triplets, Swing & Syncopation'}
          </h2>
          <p className="section-description">
            {isLt
              ? 'Knygoje skaičiavimas žymimas dviem šrifto dydžiais: paryškintas didelis skaičius rodo, kada paspausti natą, mažesni skaičiai — kiek dalių ją laikyti, o maži skaičiai po pauzėmis — tylos trukmę.'
              : 'In the book’s counting system, bold numbers show when a note is struck, smaller numbers indicate holding the note, and small numbers under rests mark silent beats.'}
          </p>

          <div className="table-wrapper">
            <table className="theory-table">
              <thead>
                <tr>
                  <th scope="col">{isLt ? 'Nata / Pauzė (EN)' : 'Note / Rest Value (EN)'}</th>
                  <th scope="col">{isLt ? 'Lietuviškas terminas (LT)' : 'Lithuanian Term (LT)'}</th>
                  <th scope="col">{isLt ? 'Simbolis' : 'Symbol'}</th>
                  <th scope="col">{isLt ? 'Trukmė (4/4 takte)' : 'Duration (in 4/4)'}</th>
                  <th scope="col">{isLt ? 'Vadovėlio skaičiavimas' : 'Book Counting Method'}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Whole Note &amp; Whole Rest</strong> (p. 11–15)
                  </td>
                  <td>
                    <strong>Sveikoji nata ir sveikoji pauzė</strong>
                  </td>
                  <td>
                    <span className="unit-pill">𝅝 / 𝄻</span>
                  </td>
                  <td>{isLt ? '4 dalys (pilnas taktas)' : '4 beats (1 full bar)'}</td>
                  <td>
                    <code>1 2 3 4</code>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Dotted Half Note</strong> (Lesson 4, p. 18)
                  </td>
                  <td>
                    <strong>Punktuota pusinė nata</strong>
                  </td>
                  <td>
                    <span className="unit-pill">𝅗𝅥.</span>
                  </td>
                  <td>
                    {isLt
                      ? '3 dalys (taškas prideda ½ vertės: 2 + 1)'
                      : '3 beats (dot adds half value: 2 + 1)'}
                  </td>
                  <td>
                    <code>1 2 3</code> ({isLt ? 'pilnas 3/4 taktas' : '1 bar in 3/4 waltz'})
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Half Note &amp; Half Rest</strong> (p. 11–16)
                  </td>
                  <td>
                    <strong>Pusinė nata ir pusinė pauzė</strong>
                  </td>
                  <td>
                    <span className="unit-pill">𝅗𝅥 / 𝄼</span>
                  </td>
                  <td>{isLt ? '2 dalys' : '2 beats'}</td>
                  <td>
                    <code>1 2 – 3 4</code>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Dotted Quarter Note</strong> (Lesson 6, p. 24)
                  </td>
                  <td>
                    <strong>Punktuota ketvirtinė nata</strong>
                  </td>
                  <td>
                    <span className="unit-pill">♩.</span>
                  </td>
                  <td>{isLt ? '1,5 dalies (dažnai su aštuntine)' : '1½ beats (often + 8th note)'}</td>
                  <td>
                    <code>1 + 2 (+)</code>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Quarter Note &amp; Quarter Rest</strong> (p. 11–16)
                  </td>
                  <td>
                    <strong>Ketvirtinė nata ir ketvirtinė pauzė</strong>
                  </td>
                  <td>
                    <span className="unit-pill">♩ / 𝄽</span>
                  </td>
                  <td>{isLt ? '1 dalis' : '1 beat'}</td>
                  <td>
                    <code>1 – 2 – 3 – 4</code>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Eighth Note &amp; Eighth Rest</strong> (Lessons 5, 14)
                  </td>
                  <td>
                    <strong>Aštuntinė nata ir aštuntinė pauzė</strong>
                  </td>
                  <td>
                    <span className="unit-pill">♪ / 𝄾</span>
                  </td>
                  <td>{isLt ? '½ dalies (8 vnt. 4/4 takte)' : '½ beat (8 per 4/4 bar)'}</td>
                  <td>
                    <code>1 + 2 + 3 + 4 +</code> (<em>&ldquo;one and two and...&rdquo;</em>)
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Dotted Eighth + Sixteenth</strong> (Lesson 18, p. 80)
                  </td>
                  <td>
                    <strong>Punktuota aštuntinė + šešioliktinė</strong>
                  </td>
                  <td>
                    <span className="unit-pill">♪. + 𝅘𝅥𝅯</span>
                  </td>
                  <td>{isLt ? '¾ dalies + ¼ dalies (= 1 dalis)' : '¾ beat + ¼ beat (= 1 beat)'}</td>
                  <td>
                    <code>1 e + (a)</code>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Sixteenth Note</strong> (Lesson 17, p. 73)
                  </td>
                  <td>
                    <strong>Šešioliktinė nata</strong>
                  </td>
                  <td>
                    <span className="unit-pill">𝅘𝅥𝅯 (4/beat)</span>
                  </td>
                  <td>{isLt ? '¼ dalies (16 vnt. 4/4 takte)' : '¼ beat (16 per 4/4 bar)'}</td>
                  <td>
                    <code>1 e + a 2 e + a</code> (<em>&ldquo;one ee and ah&rdquo;</em>)
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Eighth-Note Triplet</strong> (Lesson 29, p. 128)
                  </td>
                  <td>
                    <strong>Aštuntinių triolė</strong>
                  </td>
                  <td>
                    <span className="unit-pill">[3] ♪♪♪</span>
                  </td>
                  <td>{isLt ? '⅓ dalies kiekvienai (3 natos per 1 dalį)' : '⅓ beat each (3 even notes in 1 beat)'}</td>
                  <td>
                    <code>1-trip-let 2-trip-let</code>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Sixteenth-Note Triplet</strong> (Lesson 33, p. 145)
                  </td>
                  <td>
                    <strong>Šešioliktinių triolė (sekstolė)</strong>
                  </td>
                  <td>
                    <span className="unit-pill">[3] + [3]</span>
                  </td>
                  <td>{isLt ? '3 natos per ½ dalies (6 natos per 1 dalį)' : '3 notes per ½ beat (6 notes per beat)'}</td>
                  <td>
                    <code>Did-dle-a Did-dle-a</code>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Time Signatures & Rhythmic Concepts */}
          <div className="scenarios-breakdown-grid">
            <div className="scenario-callout-card">
              <h3 className="callout-title">
                {isLt
                  ? '⏲️ Visi 6 vadovėlio takto metrai (Time Signatures)'
                  : '⏲️ All 6 Time Signatures in the Manual'}
              </h3>
              <ul className="scenario-steps-list">
                <li>
                  <strong>
                    <code>4/4</code> arba <code>C</code> (Common Time — p. 11, 46):
                  </strong>{' '}
                  {isLt
                    ? '4 ketvirtinių dalių taktas. Simbolis C reiškia lygiai tą patį kaip 4/4.'
                    : 'Four quarter-note beats per bar. The symbol C (Common time) means exactly 4/4.'}
                </li>
                <li>
                  <strong>
                    <code>3/4</code> (Waltz Time — Lesson 4, p. 18):
                  </strong>{' '}
                  {isLt
                    ? '3 ketvirtinių dalių taktas (valso ritmas: 1–2–3).'
                    : 'Three quarter-note beats per bar, known as waltz time.'}
                </li>
                <li>
                  <strong>
                    <code>2/4</code> (Lesson 25, p. 112):
                  </strong>{' '}
                  {isLt
                    ? '2 ketvirtinių dalių taktas (pvz., R. Schumann „First Loss“).'
                    : 'Two quarter-note beats per bar (used in Schumann’s "First Loss").'}
                </li>
                <li>
                  <strong>
                    <code>2/2</code> arba <code>¢</code> (Cut Common Time — Lesson 19, p. 84):
                  </strong>{' '}
                  {isLt
                    ? 'Perbraukta C raidė: 2 pusinių natų dalys takte (pusinė = 1 skaičius, ketvirtinė = ½).'
                    : 'Two half-note beats per bar: each half note gets 1 count, quarter notes get ½ count.'}
                </li>
                <li>
                  <strong>
                    <code>6/8</code> (Lesson 25, p. 110) &amp; <code>12/8</code> (Lesson 40, p. 174):
                  </strong>{' '}
                  {isLt
                    ? '6/8 turi 6 aštuntines, sugrupuotas į 2 stambias dalis po 3 aštuntines (kirčiuojami 1 ir 4). 12/8 turi 12 aštuntinių (4 dalys po 3, skamba kaip 4/4 su triolėmis).'
                    : '6/8 groups six 8th notes into 2 dotted-quarter beats (accent counts 1 and 4). 12/8 has 12 eighth notes counted in 4 triplet-feel beats (1-2-3, 2-2-3, 3-2-3, 4-2-3).'}
                </li>
              </ul>
            </div>

            <div className="scenario-callout-card">
              <h3 className="callout-title">
                {isLt
                  ? '🎷 Lyga (Tie), Prieštaktis (Lead-in), Sinkopė, Svingas ir Šaflas'
                  : '🎷 Ties, Lead-In, Syncopation, Swing & Shuffle'}
              </h3>
              <ul className="scenario-steps-list">
                <li>
                  <strong>{isLt ? 'Lyga (Tie — Lesson 4, p. 19):' : 'The Tie (Lesson 4, p. 19):'}</strong>{' '}
                  {isLt
                    ? 'Lenkta linija, jungianti dvi to paties aukščio natas. Grojama tik pirmoji nata ir laikoma per abiejų natų trukmę (vienintelis būdas išlaikyti garsą per takto brūkšnį).'
                    : 'Curved line connecting two notes of the same pitch. Strike only the first note and hold for the combined length (used across bar lines).'}
                </li>
                <li>
                  <strong>
                    {isLt
                      ? 'Prieštaktis (Lead-in / Anacrusis — Lesson 3, p. 17):'
                      : 'Lead-in / Pick-up / Anacrusis (Lesson 3, p. 17):'}
                  </strong>{' '}
                  {isLt
                    ? 'Natos prieš pirmąjį pilną taktą. Prieštakčio ir paskutinio (nepilno) takto natų suma visada sudaro 1 pilną taktą.'
                    : 'Notes before the first full bar. The lead-in plus the final incomplete bar always add up to one complete bar.'}
                </li>
                <li>
                  <strong>
                    {isLt ? 'Sinkopė (Syncopation — Lessons 14, 16):' : 'Syncopation (Lessons 14 & 16):'}
                  </strong>{' '}
                  {isLt
                    ? 'Kirčio perkėlimas iš stipriosios takto dalies (on-beat) į silpnąją tarpinę dalį („+“ / off-beat), dažnai naudojant aštuntines pauzes ant stipriųjų dalių.'
                    : 'Displacing accents from on the beat to off the beat ("and" counts), often by placing 8th rests on the main beats.'}
                </li>
                <li>
                  <strong>
                    {isLt
                      ? 'Svingas (Swing) ir Šaflas (Shuffle — Lesson 29, p. 129–130):'
                      : 'Swing & Shuffle (Lesson 29, p. 129–130):'}
                  </strong>{' '}
                  {isLt
                    ? 'Svingo ritmas gaunamas sujungus pirmąsias dvi triolės natas lyga (pirma nata trunka ⅔ dalies, antra — ⅓). Nuolatinis svinguojančių aštuntinių srautas vadinamas Shuffle.'
                    : 'Created by tying the first two notes of an 8th-note triplet (⅔ beat + ⅓ beat). A continuous stream of swung 8th notes creates the Blues/Boogie Shuffle.'}
                </li>
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          CHAPTER 4: ACCIDENTALS, SCALES, MODES & THE KEY CYCLE (INTERACTIVE)
          ===================================================================== */}
      {showSection('ch4-scales') && (
        <section className="theory-card" aria-labelledby="ch4-heading">
          <div className="card-badge">
            {isLt
              ? '4 Skyrius · 5, 10–12, 18, 24–26, 28, 35–36, 42 pamokos'
              : 'Chapter 4 · Lessons 5, 10–12, 18, 24–26, 28, 35–36, 42'}
          </div>
          <h2 id="ch4-heading" className="card-title">
            {isLt
              ? 'Alteracijos ženklai, Gamos (Mažoras, 3 Minorai, Pentatonika, Bliuzas), 7 Dermės ir Kvintų ratas'
              : 'Accidentals, Scales (Major, 3 Minors, Pentatonic, Blues), 7 Modes & The Key Cycle'}
          </h2>
          <p className="section-description">
            {isLt
              ? 'Pasirinkite bet kurią vadovėlio gamą ar dermę žemiau — išgirsite jos skambesį klaviatūroje ir matysite tikslią formulę bei pirštuotę.'
              : 'Select any scale or mode from the manual below to see its keys highlighted on the piano, inspect its interval formula & fingering, and hear it played.'}
          </p>

          {/* Accidentals & Chromatic Scale Callout */}
          <div className="key-rule-callout">
            <h3 className="rule-title">
              {isLt
                ? '♯ ♭ ♮ Alteracijos ženklai (Accidentals), Enharmonizmas ir Chromatinė gama (Lessons 10, 12, 18)'
                : '♯ ♭ ♮ Accidentals, Enharmonic Notes & The 12-Note Chromatic Scale (Lessons 10, 12, 18)'}
            </h3>
            <p>
              {isLt ? (
                <>
                  <strong>Diezas (Sharp ♯):</strong> paaukština natą 1 pustoniu (klavišas į dešinę).{' '}
                  <strong>Bemolis (Flat ♭):</strong> pažemina natą 1 pustoniu (klavišas į kairę).{' '}
                  <strong>Bekaras (Natural ♮):</strong> atšaukia diezą ar bemolį iki takto pabaigos.{' '}
                  <strong>Enharmoniniai garsai (Enharmonic notes):</strong> tas pats klavišas gali
                  turėti du pavadinimus priklausomai nuo tonacijos (pvz.,{' '}
                  <code>C♯ = D♭, D♯ = E♭, F♯ = G♭, G♯ = A♭, A♯ = B♭</code>, netgi{' '}
                  <code>E = F♭, F = E♯</code>). Kiekvienoje diatoninėje gamoje privalo būti po vieną
                  skirtingą abėcėlės raidę (todėl G mažore rašoma <code>F♯</code>, o ne{' '}
                  <code>G♭</code>!).
                </>
              ) : (
                <>
                  <strong>Sharp (♯):</strong> raises pitch by 1 semitone (next key right).{' '}
                  <strong>Flat (♭):</strong> lowers pitch by 1 semitone (next key left).{' '}
                  <strong>Natural (♮):</strong> cancels a sharp or flat for the rest of the bar.{' '}
                  <strong>Enharmonic notes:</strong> two spellings for the exact same key (
                  <code>C♯ = D♭, D♯ = E♭, F♯ = G♭, G♯ = A♭, A♯ = B♭</code>). Diatonic scales must use
                  each letter name once — so G major uses <code>F♯</code> (never <code>G♭</code>), and F
                  major uses <code>B♭</code> (never <code>A♯</code>).
                </>
              )}
            </p>
          </div>

          {/* Interactive Scale & Mode Selector */}
          <div className="scenario-selector-group">
            <label className="picker-label">
              {isLt
                ? 'Interaktyvi vadovėlio gamų ir dermių laboratorija:'
                : 'Interactive Book Scale & Mode Explorer:'}
            </label>
            <div className="scenario-buttons-row">
              {BOOK_SCALES.map((sc) => (
                <button
                  key={sc.id}
                  type="button"
                  className={`scenario-btn ${
                    selectedScaleId === sc.id ? 'scenario-btn--active' : ''
                  }`}
                  onClick={() => {
                    setSelectedScaleId(sc.id);
                    handlePlayScale(sc);
                  }}
                >
                  <span className="scenario-btn-title">
                    {isLt ? sc.nameLt : sc.nameEn}
                  </span>
                  <span className="scenario-btn-badge">
                    {sc.lessonRef} · {sc.notesLabel}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Scale Details Banner */}
          <div className="lab-result-bar">
            <div className="lab-chord-summary">
              <strong className="lab-chord-title">
                {isLt ? selectedScale.nameLt : selectedScale.nameEn}{' '}
                <span className="lab-symbol">({selectedScale.lessonRef})</span>
              </strong>
              <span className="lab-meta">
                <strong>{isLt ? 'Natos:' : 'Notes:'}</strong> {selectedScale.notesLabel} ·{' '}
                <strong>{isLt ? 'Formulė:' : 'Formula:'}</strong> <code>{selectedScale.formula}</code>
              </span>
              <span className="lab-meta">
                <strong>RH:</strong> <code>{selectedScale.rhFingering}</code> ·{' '}
                <strong>LH:</strong> <code>{selectedScale.lhFingering}</code>
              </span>
              <span className="lab-meta" style={{ color: 'var(--text-primary)', marginTop: '2px' }}>
                {isLt ? selectedScale.descLt : selectedScale.descEn}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="play-btn"
                onClick={() => handlePlayScale(selectedScale)}
              >
                🔊 {isLt ? 'Groti gamą' : 'Play Scale'}
              </button>
              {onOpenSheetMusic && (
                <button
                  type="button"
                  className="sheet-music-pill-btn"
                  onClick={() => onOpenSheetMusic(SCALE_BOOK_PAGES[selectedScale.id] ?? 20)}
                  title={
                    isLt
                      ? `Atidaryti ${SCALE_BOOK_PAGES[selectedScale.id] ?? 20} puslapio natas vadovėlyje`
                      : `View Sheet Music on Page ${SCALE_BOOK_PAGES[selectedScale.id] ?? 20}`
                  }
                >
                  📄 {isLt ? `Žiūrėti natas (p. ${SCALE_BOOK_PAGES[selectedScale.id] ?? 20})` : `View Sheet Music (p. ${SCALE_BOOK_PAGES[selectedScale.id] ?? 20})`}
                </button>
              )}
            </div>
          </div>

          {/* Mini 2-Octave Piano showing the selected scale */}
          <div className="mini-piano-wrapper">
            <div
              className="mini-piano-bed"
              role="group"
              aria-label={isLt ? 'Gamos klaviatūros schema' : 'Scale keyboard diagram'}
            >
              <div
                className="mini-white-row"
                style={{ gridTemplateColumns: `repeat(${WHITE_KEYS.length}, 1fr)` }}
              >
                {WHITE_KEYS.map((key) => {
                  const degIdx = selectedScale.midis.indexOf(key.midi);
                  const isHighlighted = degIdx !== -1;
                  const isRoot = degIdx === 0 || degIdx === selectedScale.midis.length - 1;

                  return (
                    <button
                      key={key.midi}
                      type="button"
                      onClick={() => playNote(key.midi)}
                      className={`piano-key piano-key--white ${
                        isHighlighted ? 'piano-key--highlighted' : ''
                      } ${isRoot ? 'piano-key--bass' : ''}`}
                    >
                      <span className="key-inner">
                        {isHighlighted && (
                          <span
                            className={`key-marker ${isRoot ? 'key-marker--bass' : ''}`}
                            aria-hidden="true"
                          >
                            {degIdx + 1}
                          </span>
                        )}
                        <span
                          className={`key-label ${
                            isHighlighted ? 'key-label--highlighted' : ''
                          }`}
                          aria-hidden="true"
                        >
                          {getRootNoteName(key.pitchClass)}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="black-keys-layer">
                {BLACK_KEYS.map((key) => {
                  const degIdx = selectedScale.midis.indexOf(key.midi);
                  const isHighlighted = degIdx !== -1;
                  const isRoot = degIdx === 0;
                  const leftPct = getBlackLeftPercent(key.midi);

                  return (
                    <button
                      key={key.midi}
                      type="button"
                      style={{ left: `${leftPct}%` }}
                      onClick={() => playNote(key.midi)}
                      className={`piano-key piano-key--black ${
                        isHighlighted ? 'piano-key--highlighted' : ''
                      } ${isRoot ? 'piano-key--bass' : ''}`}
                    >
                      <span className="key-inner">
                        {isHighlighted && (
                          <span
                            className={`key-marker ${isRoot ? 'key-marker--bass' : ''}`}
                            aria-hidden="true"
                          >
                            {degIdx + 1}
                          </span>
                        )}
                        {isHighlighted && (
                          <span className="key-label key-label--highlighted" aria-hidden="true">
                            {key.noteInfo.displayName}
                          </span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Key Cycle & All 7 Modes Reference Tables */}
          <div className="scenarios-breakdown-grid">
            <div className="scenario-callout-card">
              <h3 className="callout-title">
                {isLt
                  ? '🧭 Kvintų ir kvartų ratas (The Key Cycle — Lessons 35 & 36)'
                  : '🧭 The Key Cycle: Sharp & Flat Key Signatures (Lessons 35 & 36)'}
              </h3>
              <ul className="scenario-steps-list">
                <li>
                  <strong>
                    {isLt
                      ? 'Pagal laikrodžio rodyklę (Kvintomis aukštyn — Diezinės tonacijos):'
                      : 'Clockwise by 5ths (Sharp Keys — new sharp is the 7th degree):'}
                  </strong>
                  <br />
                  <code>C (0)</code> → <code>G (1♯: F♯)</code> → <code>D (2♯: F♯, C♯)</code> →{' '}
                  <code>A (3♯: +G♯)</code> → <code>E (4♯: +D♯)</code> →{' '}
                  <code>B (5♯: +A♯)</code> → <code>F♯ (6♯: +E♯)</code>.
                </li>
                <li>
                  <strong>
                    {isLt
                      ? 'Prieš laikrodžio rodyklę (Kvartomis aukštyn — Bemolinės tonacijos):'
                      : 'Anti-clockwise by 4ths (Flat Keys — new flat is the 4th degree):'}
                  </strong>
                  <br />
                  <code>C (0)</code> → <code>F (1♭: B♭)</code> → <code>B♭ (2♭: B♭, E♭)</code> →{' '}
                  <code>E♭ (3♭: +A♭)</code> → <code>A♭ (4♭: +D♭)</code> →{' '}
                  <code>D♭ (5♭: +G♭)</code> → <code>G♭ (6♭: +C♭)</code>.
                </li>
                <li>
                  <strong>
                    {isLt ? 'Paralelinės tonacijos (Relative Minor — VI laipsnis):' : 'Relative Minor Keys (6th Degree):'}
                  </strong>{' '}
                  <code>C ↔ Am</code>, <code>G ↔ Em</code>, <code>D ↔ Bm</code>,{' '}
                  <code>A ↔ F♯m</code>, <code>E ↔ C♯m</code>, <code>F ↔ Dm</code>,{' '}
                  <code>B♭ ↔ Gm</code>, <code>E♭ ↔ Cm</code>.
                </li>
              </ul>
            </div>

            <div className="scenario-callout-card">
              <h3 className="callout-title">
                {isLt
                  ? '🏛️ Visos 7 Mažoro Dermės (The 7 Modes — Lesson 42, p. 185–187)'
                  : '🏛️ The 7 Modes & Their Degree Formulas (Lesson 42, p. 185–187)'}
              </h3>
              <ul className="scenario-steps-list">
                <li>
                  <strong>1. Ionian (Joninė — I):</strong> <code>1 2 3 4 5 6 7</code> (C–D–E–F–G–A–B →{' '}
                  <strong>IMaj7</strong>)
                </li>
                <li>
                  <strong>2. Dorian (Dorinė — ii):</strong> <code>1 2 ♭3 4 5 6 ♭7</code> (D–E–F–G–A–B–C →{' '}
                  <strong>ii7</strong>)
                </li>
                <li>
                  <strong>3. Phrygian (Friginė — iii):</strong> <code>1 ♭2 ♭3 4 5 ♭6 ♭7</code>{' '}
                  (E–F–G–A–B–C–D → <strong>iii7</strong>)
                </li>
                <li>
                  <strong>4. Lydian (Lidinė — IV):</strong> <code>1 2 3 ♯4 5 6 7</code> (F–G–A–B–C–D–E →{' '}
                  <strong>IVMaj7 / Maj7♯11</strong>)
                </li>
                <li>
                  <strong>5. Mixolydian (Miksolidinė — V):</strong> <code>1 2 3 4 5 6 ♭7</code>{' '}
                  (G–A–B–C–D–E–F → <strong>V7</strong>)
                </li>
                <li>
                  <strong>6. Aeolian (Ejolinė / Nat. minoras — vi):</strong>{' '}
                  <code>1 2 ♭3 4 5 ♭6 ♭7</code> (A–B–C–D–E–F–G → <strong>vi7</strong>)
                </li>
                <li>
                  <strong>7. Locrian (Lokrinė — vii°):</strong> <code>1 ♭2 ♭3 4 ♭5 ♭6 ♭7</code>{' '}
                  (B–C–D–E–F–G–A → <strong>viiø7 / m7♭5</strong>)
                </li>
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          CHAPTER 5: INTERVALS, CHORDS, INVERSIONS, 7THS, EXTENSIONS & ALTERED
          ===================================================================== */}
      {showSection('ch5-chords') && (
        <section className="theory-card" aria-labelledby="ch5-heading">
          <div className="card-badge">
            {isLt
              ? '5 Skyrius · 2, 8–10, 13, 15, 21–22, 31, 39, 41, 43, 45 pamokos'
              : 'Chapter 5 · Lessons 2, 8–10, 13, 15, 21–22, 31, 39, 41, 43, 45'}
          </div>
          <h2 id="ch5-heading" className="card-title">
            {isLt
              ? 'Intervalai, Trigarsiai, Septakordai, Gido tonai, Išplėstiniai (9, 11, 13) ir Alteruoti akordai'
              : 'Intervals, Triads, Inversions, 7th Chords, Guide Tones, Extended (9/11/13) & Altered Chords'}
          </h2>
          <p className="section-description">
            {isLt
              ? 'Spustelėkite 🔊 mygtuką šalia bet kurio akordo iš vadovėlio lentelės, kad išgirstumėte tikslų jo išdėstymą fortepijonu.'
              : 'Click the 🔊 button on any chord formula from the manual below to hear its exact voicing on the grand piano.'}
          </p>

          {/* Complete Book Chord Construction Table */}
          <div className="table-wrapper">
            <table className="theory-table">
              <thead>
                <tr>
                  <th scope="col">{isLt ? 'Akordo tipas (EN / LT)' : 'Chord Type (EN / LT)'}</th>
                  <th scope="col">{isLt ? 'Simbolis' : 'Symbol'}</th>
                  <th scope="col">{isLt ? 'Laipsnių formulė' : 'Scale Formula'}</th>
                  <th scope="col">{isLt ? 'Natos nuo C' : 'Notes on C'}</th>
                  <th scope="col">{isLt ? 'Vadovėlio pastaba' : 'Book Lesson & Voicing Rule'}</th>
                  <th scope="col">{isLt ? 'Klausyti' : 'Listen'}</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    nameEn: 'Major Triad',
                    nameLt: 'Mažorinis trigarsis',
                    symbol: 'C',
                    formula: '1 – 3 – 5',
                    notes: 'C – E – G',
                    midis: [60, 64, 67],
                    noteEn: 'Lesson 2 & 22: Major 3rd (4 semitones) + Minor 3rd (3 semitones).',
                    noteLt: '2 ir 22 pam.: Didžioji tercija (4 pust.) + mažoji tercija (3 pust.).',
                  },
                  {
                    nameEn: 'Minor Triad',
                    nameLt: 'Minorinis trigarsis',
                    symbol: 'Cm',
                    formula: '1 – ♭3 – 5',
                    notes: 'C – E♭ – G',
                    midis: [60, 63, 67],
                    noteEn: 'Lesson 8 & 22: Minor 3rd (3 semitones) + Major 3rd (4 semitones).',
                    noteLt: '8 ir 22 pam.: Mažoji tercija (3 pust.) + didžioji tercija (4 pust.).',
                  },
                  {
                    nameEn: 'Augmented Triad',
                    nameLt: 'Padidintas trigarsis',
                    symbol: 'C+ (Caug)',
                    formula: '1 – 3 – ♯5',
                    notes: 'C – E – G♯',
                    midis: [60, 64, 68],
                    noteEn: 'Lesson 22 & 25: Two Major 3rds stacked (III+ in Harmonic minor).',
                    noteLt: '22 ir 25 pam.: Dvi didžiosios tercijos (III+ laipsnis harmoniniame minore).',
                  },
                  {
                    nameEn: 'Diminished Triad',
                    nameLt: 'Sumažintas trigarsis',
                    symbol: 'Cdim (C°)',
                    formula: '1 – ♭3 – ♭5',
                    notes: 'C – E♭ – G♭',
                    midis: [60, 63, 66],
                    noteEn: 'Lesson 21 & 22: Two Minor 3rds stacked (vii° chord in Major keys).',
                    noteLt: '21 ir 22 pam.: Dvi mažosios tercijos (vii° laipsnis mažore).',
                  },
                  {
                    nameEn: 'Suspended 4th & Add9',
                    nameLt: 'Suspenduotas (sus4) ir Add9',
                    symbol: 'Csus4 / C(add9)',
                    formula: '1 – 4 – 5 / 1 – 3 – 5 – 9',
                    notes: 'C–F–G / C–E–G–D',
                    midis: [60, 65, 67, 74],
                    noteEn: 'Lesson 39: sus4 replaces 3rd with 4th; add9 adds the 9th (2nd) to a triad.',
                    noteLt: '39 pam.: sus4 pakeičia 3-ią laipsnį 4-uoju; add9 prideda noną (9) be septimos.',
                  },
                  {
                    nameEn: 'Sixth Chord (Major 6th)',
                    nameLt: 'Sekstakordas (Su pridėta seksta 6)',
                    symbol: 'C6 / Cm6',
                    formula: '1 – 3 – 5 – 6',
                    notes: 'C – E – G – A',
                    midis: [60, 64, 67, 69],
                    noteEn: 'Lesson 43: Triad + 6th degree instead of a 7th.',
                    noteLt: '43 pam.: Trigarsis su pridėtu VI laipsniu (be septimos).',
                  },
                  {
                    nameEn: 'Major Seventh',
                    nameLt: 'Didysis mažorinis septakordas',
                    symbol: 'CMaj7',
                    formula: '1 – 3 – 5 – 7',
                    notes: 'C – E – G – B',
                    midis: [60, 64, 67, 71],
                    noteEn: 'Lesson 41: Major triad + Major 7th. Substitution: play Em over C bass (Em/C).',
                    noteLt: '41 pam.: Mažoras + didžioji 7. Keitimas: Em trigarsis dešine ranka virš C boso (Em/C).',
                  },
                  {
                    nameEn: 'Dominant Seventh',
                    nameLt: 'Dominantseptakordas',
                    symbol: 'C7',
                    formula: '1 – 3 – 5 – ♭7',
                    notes: 'C – E – G – B♭',
                    midis: [60, 64, 67, 70],
                    noteEn: 'Lesson 2, 12, 31: Major triad + ♭7. The 5th is most commonly omitted in voicings.',
                    noteLt: '2, 12, 31 pam.: Mažoras + ♭7. Praktikoje dažniausiai praleidžiama kvinta (5).',
                  },
                  {
                    nameEn: 'Minor Seventh',
                    nameLt: 'Mažasis minorinis septakordas',
                    symbol: 'Cm7',
                    formula: '1 – ♭3 – 5 – ♭7',
                    notes: 'C – E♭ – G – B♭',
                    midis: [60, 63, 67, 70],
                    noteEn: 'Lesson 41: Minor triad + ♭7. Substitution: play E♭ major triad over C bass (E♭/C).',
                    noteLt: '41 pam.: Minoras + ♭7. Keitimas: E♭ mažorinis trigarsis virš C boso (E♭/C).',
                  },
                  {
                    nameEn: 'Minor 7 Flat 5 (Half-Diminished)',
                    nameLt: 'Pusiau sumažintas septakordas',
                    symbol: 'Cm7♭5 (Cø7)',
                    formula: '1 – ♭3 – ♭5 – ♭7',
                    notes: 'C – E♭ – G♭ – B♭',
                    midis: [60, 63, 66, 70],
                    noteEn: 'Lesson 41: Diminished triad + ♭7 (Chord viiø7 in Major keys, iiø7 in Minor).',
                    noteLt: '41 pam.: Sumažintas trigarsis + ♭7 (viiø7 laipsnis mažore, iiø7 minore).',
                  },
                  {
                    nameEn: 'Diminished Seventh',
                    nameLt: 'Sumažintas septakordas',
                    symbol: 'C°7 (Cdim7)',
                    formula: '1 – ♭3 – ♭5 – ♭♭7',
                    notes: 'C – E♭ – G♭ – B♭♭(A)',
                    midis: [60, 63, 66, 69],
                    noteEn: 'Lesson 41 & 46: Double-flattened 7th (enharmonic to 6th, A). vii°7 in Harmonic minor.',
                    noteLt: '41 ir 46 pam.: Dvigubai pažeminta 7 (enharmoniška A). vii°7 harmoniniame minore.',
                  },
                  {
                    nameEn: 'Ninth Chords (Maj9, 9, m9)',
                    nameLt: 'Nonakordai (CMaj9, C9, Cm9)',
                    symbol: 'CMaj9 / C9 / Cm9',
                    formula: '1 – 3(♭3) – 5 – 7(♭7) – 9',
                    notes: 'C – E – G – B(♭) – D',
                    midis: [60, 64, 67, 70, 74],
                    noteEn: 'Lesson 43: Add 9th (D) a 3rd above the 7th. Substitution: Em7/C = CMaj9.',
                    noteLt: '43 pam.: Pridedama nona (D). Keitimas: Em7 virš C boso = CMaj9.',
                  },
                  {
                    nameEn: 'Eleventh & 7sus4 / Maj7♯11',
                    nameLt: 'Undecimakordai (Cm11, C7sus4, CMaj7♯11)',
                    symbol: 'Cm11 / C7sus4',
                    formula: '1 – ♭3 – 5 – ♭7 – 9 – 11',
                    notes: 'C – E♭ – G – B♭ – D – F',
                    midis: [60, 63, 67, 70, 74, 77],
                    noteEn: 'Lesson 43: In Major/Dom 11th, omit the 3rd (Gm7/C = C11/C7sus4) or sharpen 11th (♯11 = Lydian) to avoid clashing with 3!',
                    noteLt: '43 pam.: Mažore/dominantoje 3 ir 11 pjaunasi, todėl 3 praleidžiama (Gm7/C) arba 11 paaukštinama (♯11).',
                  },
                  {
                    nameEn: 'Thirteenth Chord',
                    nameLt: 'Terciadecimakordas (13-asis akordas)',
                    symbol: 'C13',
                    formula: '1 – 3 – 5 – ♭7 – 9 – (♯11) – 13',
                    notes: 'C – E – B♭ – D – A',
                    midis: [60, 64, 70, 74, 81],
                    noteEn: 'Lesson 43: Highest diatonic extension. Right hand often voices just 3 – ♭7 – 13 (E–B♭–A).',
                    noteLt: '43 pam.: Aukščiausias išplėtimas. Dešinė ranka dažniausiai groja tik 3 – ♭7 – 13 (E–B♭–A).',
                  },
                  {
                    nameEn: 'Altered Dominants (7♯9, 7♭5, 13♯11)',
                    nameLt: 'Alteruoti akordai (7♯9, 7♭5, 13♯11)',
                    symbol: 'C7(♯9)',
                    formula: '1 – 3 – 5 – ♭7 – ♯9',
                    notes: 'C – E – G – B♭ – D♯',
                    midis: [60, 64, 67, 70, 75],
                    noteEn: 'Lesson 45: Raises or flattens the 5th/9th for strong jazz/blues tension before resolving to an unaltered chord.',
                    noteLt: '45 pam.: Paaukština arba pažemina 5 ar 9 laipsnį, sukuriant ryškią džiazo/bliuzo įtampą prieš išrišimą.',
                  },
                ].map((row, idx) => (
                  <tr key={idx}>
                    <td>
                      <strong>{isLt ? row.nameLt : row.nameEn}</strong>
                      <div className="table-sub-desc">{isLt ? row.nameEn : row.nameLt}</div>
                    </td>
                    <td>
                      <code>{row.symbol}</code>
                    </td>
                    <td>
                      <span className="formula-pill">{row.formula}</span>
                    </td>
                    <td>{row.notes}</td>
                    <td>{isLt ? row.noteLt : row.noteEn}</td>
                    <td>
                      <button
                        type="button"
                        className="table-play-btn"
                        onClick={() => playChord(row.midis)}
                        aria-label={`Play ${row.symbol}`}
                      >
                        🔊
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Inversions, Guide Tones, Arpeggios & Broken Chords */}
          <div className="scenarios-breakdown-grid">
            <div className="scenario-callout-card">
              <h3 className="callout-title">
                {isLt
                  ? '🎹 Akordų apvertimai (Inversions) ir Glaudus sujungimas (Lessons 13, 15, 31)'
                  : '🎹 Chord Inversions & Close-Position Voice Leading (Lessons 13, 15, 31)'}
              </h3>
              <ul className="scenario-steps-list">
                <li>
                  <strong>{isLt ? 'Trigarsių 3 padėtys:' : '3 Positions of Triads:'}</strong>{' '}
                  {isLt ? 'Pagrindinė' : 'Root'} <code>(1 – 3 – 5)</code>,{' '}
                  {isLt ? '1-asis apvertimas' : '1st Inversion'} <code>(3 – 5 – 1)</code>,{' '}
                  {isLt ? '2-asis apvertimas' : '2nd Inversion'} <code>(5 – 1 – 3)</code>.
                </li>
                <li>
                  <strong>{isLt ? 'Septakordų 4 padėtys:' : '4 Positions of 7th Chords:'}</strong>{' '}
                  {isLt ? 'Pagrindinė' : 'Root'} <code>(1–3–5–♭7)</code>, 1st{' '}
                  <code>(3–5–♭7–1)</code>, 2nd <code>(5–♭7–1–3)</code>, 3rd{' '}
                  <code>(♭7–1–3–5)</code>.
                </li>
                <li>
                  <strong>
                    {isLt
                      ? 'Vadovėlio taisyklė greitam C → F → G keitimui (p. 57):'
                      : 'Book Shortcut for Smooth C → F → G Changes (Page 57):'}
                  </strong>{' '}
                  {isLt
                    ? 'Užuot šokinėję per klaviatūrą, grokite C pagrindinėje padėtyje (C–E–G), F — 2-ame apvertime (C–F–A), o G — 1-ame apvertime (B–D–G)!'
                    : 'Keep your hand in one zone by playing C in Root Position (C–E–G), F in 2nd Inversion (C–F–A), and G in 1st Inversion (B–D–G)!'}
                </li>
              </ul>
              <button
                type="button"
                className="guide-audio-btn"
                onClick={() =>
                  handlePlayProgression([
                    [60, 64, 67],
                    [60, 65, 69],
                    [59, 62, 67],
                    [60, 64, 67],
                  ])
                }
              >
                🔊{' '}
                {isLt
                  ? 'Klausyti glaudaus C (Root) → F (2nd Inv) → G (1st Inv) → C'
                  : 'Hear Smooth Voice-Led C (Root) → F (2nd Inv) → G (1st Inv) → C'}
              </button>
            </div>

            <div className="scenario-callout-card">
              <h3 className="callout-title">
                {isLt
                  ? '🎯 Gido tonai (Guide Tones — p. 182), Arpedžio ir Laužyti akordai (p. 32–35)'
                  : '🎯 Guide Tones (Page 182), Slash Chords, Arpeggios & Broken Chords'}
              </h3>
              <ul className="scenario-steps-list">
                <li>
                  <strong>{isLt ? 'Gido tonai (Guide Tones — 3 ir 7):' : 'Guide Tones (3rd & 7th — Lesson 41):'}</strong>{' '}
                  {isLt
                    ? '3-ias laipsnis nusako mažorą/minorą, o 7-as — septakordo rūšį. Džiaze 3-ias vieno akordo laipsnis sklandžiai pereina į kito akordo 7-ąjį laipsnį ir atvirkščiai.'
                    : 'The 3rd defines major/minor quality and the 7th defines the 7th type. In smooth progressions, the 3rd of one chord steps directly into the 7th of the next.'}
                </li>
                <li>
                  <strong>
                    {isLt
                      ? 'Arpedžio (Arpeggio) vs. Laužytas akordas (Broken Chord — Lesson 9):'
                      : 'Arpeggios vs. Broken Chords (Lesson 9, p. 32–35):'}
                  </strong>{' '}
                  {isLt
                    ? 'Arpedžio — akordo natos grojamos po vieną iš eilės (pvz., C–E–G). Laužytas akordas — pirma grojama apatinė (bosinė) nata viena, o tada viršutinės natos kartu (pvz., C → [E+G]).'
                    : 'An arpeggio plays chord notes one at a time (C – E – G). A broken chord plays the lowest note alone first, followed by the upper chord notes together (C → [E+G]).'}
                </li>
                <li>
                  <strong>
                    {isLt ? 'Perbraukti akordai (Slash Chords — Lesson 15 & 41):' : 'Slash Chords & Upper Triads (Lessons 15, 41, 43):'}
                  </strong>{' '}
                  <code>G/E</code> = {isLt ? 'G akordas virš E boso;' : 'G triad over E bass;'}{' '}
                  <code>Em/C = CMaj7</code>; <code>Fmaj7/D = Dm9</code>;{' '}
                  <code>Gm7/C = C11 (C7sus4)</code>.
                </li>
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          CHAPTER 6: SCALE-TONE HARMONY, PROGRESSIONS, BLUES & TRANSPOSITION
          ===================================================================== */}
      {showSection('ch6-harmony') && (
        <section className="theory-card" aria-labelledby="ch6-heading">
          <div className="card-badge">
            {isLt
              ? '6 Skyrius · 15, 18, 21–25, 28, 37, 40–41, 44, 46 pamokos'
              : 'Chapter 6 · Lessons 15, 18, 21–25, 28, 37, 40–41, 44, 46'}
          </div>
          <h2 id="ch6-heading" className="card-title">
            {isLt
              ? 'Gamos laipsnių akordai (I–vii°), Pagrindiniai ir šalutiniai akordai, 12 taktų bliuzas ir Transponavimas'
              : 'Scale-Tone Chords (I–vii°), Primary & Secondary Chords, 12-Bar Blues & Transposition'}
          </h2>
          <p className="section-description">
            {isLt
              ? 'Ant kiekvieno gamos laipsnio galime pastatyti trigarsį arba septakordą. Ši romėniškų skaičių sistema leidžia akimirksniu transponuoti bet kurį kūrinį į visas 12 tonacijų.'
              : 'Building a triad or 7th chord on each degree of a scale yields the Scale-Tone Chords. Roman numerals let you transpose progressions across all 12 keys effortlessly.'}
          </p>

          {/* Scale-Tone Chords Comparison Table (Major + 3 Minors) */}
          <div className="table-wrapper">
            <table className="theory-table">
              <thead>
                <tr>
                  <th scope="col">{isLt ? 'Gama / Sistemos tipas' : 'Scale / Tonality System'}</th>
                  <th scope="col">I / i</th>
                  <th scope="col">ii / ii°</th>
                  <th scope="col">iii / III</th>
                  <th scope="col">IV / iv</th>
                  <th scope="col">V / v</th>
                  <th scope="col">vi / VI</th>
                  <th scope="col">vii° / VII</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>{isLt ? 'Mažoro trigarsiai (C Major)' : 'Major Scale Triads (C Major)'}</strong>
                    <div className="table-sub-desc">Lessons 21, 22, 37</div>
                  </td>
                  <td><code>I</code> (C)</td>
                  <td><code>ii</code> (Dm)</td>
                  <td><code>iii</code> (Em)</td>
                  <td><code>IV</code> (F)</td>
                  <td><code>V</code> (G)</td>
                  <td><code>vi</code> (Am)</td>
                  <td><code>vii°</code> (Bdim)</td>
                </tr>
                <tr>
                  <td>
                    <strong>{isLt ? 'Mažoro septakordai (C Major 7ths)' : 'Major Scale 7ths (C Major)'}</strong>
                    <div className="table-sub-desc">Lesson 41 (p. 180, 184)</div>
                  </td>
                  <td><code>IMaj7</code> (CMaj7)</td>
                  <td><code>ii7</code> (Dm7)</td>
                  <td><code>iii7</code> (Em7)</td>
                  <td><code>IVMaj7</code> (FMaj7)</td>
                  <td><code>V7</code> (G7)</td>
                  <td><code>vi7</code> (Am7)</td>
                  <td><code>viiø7</code> (Bm7♭5)</td>
                </tr>
                <tr>
                  <td>
                    <strong>{isLt ? 'Natūralusis minoras (A Nat. Minor)' : 'Natural Minor (A Minor)'}</strong>
                    <div className="table-sub-desc">Lesson 24 &amp; 46 (p. 105, 211)</div>
                  </td>
                  <td><code>i</code> (Am / Am7)</td>
                  <td><code>ii°</code> (Bdim / Bm7♭5)</td>
                  <td><code>III</code> (C / CMaj7)</td>
                  <td><code>iv</code> (Dm / Dm7)</td>
                  <td><code>v</code> (Em / Em7)</td>
                  <td><code>VI</code> (F / FMaj7)</td>
                  <td><code>VII</code> (G / G7)</td>
                </tr>
                <tr>
                  <td>
                    <strong>{isLt ? 'Harmoninis minoras (A Harm. Minor)' : 'Harmonic Minor (A Minor, G♯)'}</strong>
                    <div className="table-sub-desc">Lesson 25 &amp; 46 (p. 108, 211)</div>
                  </td>
                  <td><code>i</code> (Am / AmMaj7)</td>
                  <td><code>ii°</code> (Bdim / Bm7♭5)</td>
                  <td><code>III+</code> (C+ / CMaj7♯5)</td>
                  <td><code>iv</code> (Dm / Dm7)</td>
                  <td><code>V</code> (<strong>E / E7</strong>)</td>
                  <td><code>VI</code> (F / FMaj7)</td>
                  <td><code>vii°</code> (<strong>G♯dim / G♯°7</strong>)</td>
                </tr>
                <tr>
                  <td>
                    <strong>{isLt ? 'Melodinis minoras (A Mel. Minor)' : 'Melodic Minor (A Minor, F♯ & G♯)'}</strong>
                    <div className="table-sub-desc">Lesson 25 &amp; 46 (p. 110, 211)</div>
                  </td>
                  <td><code>i</code> (Am / AmMaj7)</td>
                  <td><code>ii</code> (<strong>Bm / Bm7</strong>)</td>
                  <td><code>III+</code> (C+ / CMaj7♯5)</td>
                  <td><code>IV</code> (<strong>D / D7</strong>)</td>
                  <td><code>V</code> (<strong>E / E7</strong>)</td>
                  <td><code>vi°</code> (<strong>F♯dim / F♯m7♭5</strong>)</td>
                  <td><code>vii°</code> (<strong>G♯dim / G♯m7♭5</strong>)</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Interactive Progressions & 12-Bar Blues */}
          <div className="scenarios-breakdown-grid">
            <div className="scenario-callout-card">
              <h3 className="callout-title">
                {isLt
                  ? '🔁 Pagrindiniai (I, IV, V), Šalutiniai ir Antriniai dominantai (Lessons 37, 40)'
                  : '🔁 Primary Chords (I, IV, V), Turnarounds & Secondary Dominants'}
              </h3>
              <ul className="scenario-steps-list">
                <li>
                  <strong>{isLt ? 'Pagrindiniai akordai (Primary Chords — I, IV, V):' : 'Primary Chords (I, IV, V — Lesson 37):'}</strong>{' '}
                  {isLt
                    ? 'Apima visas 7 gamos natas, todėl vien jais galima harmonizuoti bet kurią melodiją!'
                    : 'Together contain every note of the scale, allowing you to harmonize any melody in the key!'}
                </li>
                <li>
                  <strong>{isLt ? 'Šalutiniai akordai (Secondary Chords — ii, iii, vi, vii°):' : 'Secondary Chords (ii, iii, vi, vii° — Lesson 40):'}</strong>{' '}
                  {isLt
                    ? 'Suteikia harmonijai spalvų (pvz., I – vi – IV – V arba džiazo ii7 – V7 – IMaj7).'
                    : 'Used to re-harmonize melodies with richer color (e.g. I–vi–IV–V or Jazz ii7–V7–IMaj7).'}
                </li>
                <li>
                  <strong>{isLt ? 'Antriniai dominantai (Secondary Dominants — p. 174):' : 'Secondary Dominants (Lesson 40, p. 174):'}</strong>{' '}
                  {isLt
                    ? 'Bet kurį gamos laipsnio akordą galima pakeisti dominantseptakordu (pvz., C → B7 → Em → E7 → Am → A7 → Dm → D7 → G7).'
                    : 'Substituting a Dominant 7th on scale degrees (II7, III7, VI7) creates a chain of V7→I pulls.'}
                </li>
              </ul>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                <button
                  type="button"
                  className="guide-audio-btn"
                  onClick={() =>
                    handlePlayProgression([
                      [60, 64, 67],
                      [60, 64, 69],
                      [60, 65, 69],
                      [59, 62, 67],
                    ])
                  }
                >
                  🔊 I–vi–IV–V (C–Am–F–G)
                </button>
                <button
                  type="button"
                  className="guide-audio-btn"
                  onClick={() =>
                    handlePlayProgression([
                      [62, 65, 69, 72],
                      [59, 65, 67, 74],
                      [60, 64, 67, 71],
                    ])
                  }
                >
                  🔊 Jazz ii7–V7–IMaj7 (Dm7–G7–CMaj7)
                </button>
              </div>
            </div>

            <div className="scenario-callout-card">
              <h3 className="callout-title">
                {isLt
                  ? '🎸 12 Taktų Bliuzo Forma (12-Bar Blues Form — Lessons 18 & 28, p. 124)'
                  : '🎸 The 12-Bar Blues Form in Roman Numerals (Lessons 18 & 28, p. 124)'}
              </h3>
              <ul className="scenario-steps-list">
                <li>
                  <strong>{isLt ? '1–4 taktai (4 bars):' : 'Bars 1–4 (4 bars):'}</strong>{' '}
                  <code>I7 | I7 | I7 | I7</code> (e.g. <code>C7</code> × 4)
                </li>
                <li>
                  <strong>{isLt ? '5–8 taktai (4 bars):' : 'Bars 5–8 (4 bars):'}</strong>{' '}
                  <code>IV7 | IV7 | I7 | I7</code> (e.g. <code>F7 – F7 – C7 – C7</code>)
                </li>
                <li>
                  <strong>{isLt ? '9–12 taktai (4 bars):' : 'Bars 9–12 (4 bars):'}</strong>{' '}
                  <code>V7 | IV7 | I7 | V7</code> (e.g. <code>G7 – F7 – C7 – G7</code>)
                </li>
                <li>
                  <strong>{isLt ? 'Kairės rankos būdai (Lessons 27, 28, 33):' : 'Left Hand Patterns (Lessons 27, 28, 33):'}</strong>{' '}
                  {isLt
                    ? 'Alternuojančios oktavos (Alternating octaves 5–1), vaikščiojantis bosas (Walking bass) arba Boogie 5–6–♭7 svyravimas.'
                    : 'Alternating octaves (fingers 5 & 1), Walking Bass lines, or Boogie 5th-to-6th/♭7th shuffle patterns.'}
                </li>
              </ul>
              <button
                type="button"
                className="guide-audio-btn"
                onClick={() =>
                  handlePlayProgression([
                    [60, 64, 67, 70],
                    [65, 69, 72, 75],
                    [60, 64, 67, 70],
                    [67, 71, 74, 77],
                    [65, 69, 72, 75],
                    [60, 64, 67, 70],
                  ])
                }
              >
                🔊 {isLt ? 'Klausyti Bliuzo I7 → IV7 → I7 → V7 → IV7 → I7' : 'Hear Blues Cadence I7 → IV7 → I7 → V7 → IV7 → I7'}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          CHAPTER 7: DYNAMICS, TEMPO, PEDAL, ORNAMENTS & PLAYABLE REPERTOIRE
          ===================================================================== */}
      {showSection('ch7-expression') && (
        <section className="theory-card" aria-labelledby="ch7-heading">
          <div className="card-badge card-badge--gold">
            {isLt
              ? '7 Skyrius · 5, 10, 13, 15, 17, 20, 24–25, 32–33 pamokos + Pratimai'
              : 'Chapter 7 · Lessons 5, 10, 13, 15, 17, 20, 24–25, 32–33 + Repertoire'}
          </div>
          <h2 id="ch7-heading" className="card-title">
            {isLt
              ? 'Dinamika, Tempo nuorodos, Dešinysis (Sustain) pedalas, Melizmos ir Kūrinių pratimai'
              : 'Dynamics, Tempo Markings, Sustain Pedal Technique, Ornaments & Playable Book Exercises'}
          </h2>

          <div className="terms-grid">
            <div className="term-card">
              <div className="term-header">
                <span className="term-primary">
                  {isLt ? '🔊 Dinamikos lygiai (Dynamics — Lesson 17, p. 75)' : '🔊 Dynamic Markings (Lesson 17, Page 75)'}
                </span>
                <span className="term-secondary">
                  {isLt ? 'Garsumo valdymas nuo pp iki ff' : 'Volume control from very soft to very loud'}
                </span>
              </div>
              <p className="term-description">
                <code>pp</code> (<em>pianissimo</em>) = {isLt ? 'labai tyliai' : 'very soft'} ·{' '}
                <code>p</code> (<em>piano</em>) = {isLt ? 'tyliai' : 'soft'} · <code>mp</code> (
                <em>mezzo piano</em>) = {isLt ? 'vidutiniškai tyliai' : 'moderately soft'} ·{' '}
                <code>mf</code> (<em>mezzo forte</em>) ={' '}
                {isLt ? 'vidutiniškai garsiai' : 'moderately loud'} · <code>f</code> (<em>forte</em>
                ) = {isLt ? 'garsiai' : 'loud'} · <code>ff</code> (<em>fortissimo</em>) ={' '}
                {isLt ? 'labai garsiai' : 'very loud'}.
                <br />
                <strong>Crescendo (cresc. / &lt;):</strong>{' '}
                {isLt ? 'palaipsniui garsyn.' : 'gradually louder.'}{' '}
                <strong>Diminuendo (dim. / &gt;):</strong>{' '}
                {isLt ? 'palaipsniui tyliau.' : 'gradually softer.'}
              </p>
            </div>

            <div className="term-card">
              <div className="term-header">
                <span className="term-primary">
                  {isLt ? '🏃 Tempo žymėjimai ir pokyčiai (Lessons 13, 24, 25)' : '🏃 Tempo Markings & Changes (Pages 59, 104, 112)'}
                </span>
                <span className="term-secondary">
                  {isLt ? 'Itališki greičio terminai ir Rubato' : 'Italian speed terms, Fermata & Rubato'}
                </span>
              </div>
              <p className="term-description">
                <strong>Adagio</strong> ({isLt ? 'lėtai' : 'slowly'}) · <strong>Andante</strong> (
                {isLt ? 'ramaus žingsnio tempu' : 'easy walking pace'}) · <strong>Moderato</strong>{' '}
                ({isLt ? 'vidutiniškai' : 'moderate speed'}) · <strong>Allegro</strong> ({isLt ? 'greitai' : 'fast'}) ·{' '}
                <strong>Presto</strong> ({isLt ? 'labai greitai' : 'very fast'}).
                <br />
                <strong>Accelerando:</strong> {isLt ? 'greitėjant' : 'gradually faster'} ·{' '}
                <strong>Ritardando / Rallentando:</strong> {isLt ? 'lėtėjant' : 'gradually slower'} ·{' '}
                <strong>Ritenuto (rit.):</strong> {isLt ? 'staiga sulėtinant' : 'immediately slower'} ·{' '}
                <strong>A tempo:</strong> {isLt ? 'grįžti į pradinį tempą' : 'return to original tempo'} ·{' '}
                <strong>Rubato:</strong>{' '}
                {isLt
                  ? 'meninis tempo lankstumas solo kūriniuose.'
                  : 'expressive freedom of tempo in solo pieces.'}
              </p>
            </div>

            <div className="term-card">
              <div className="term-header">
                <span className="term-primary">
                  {isLt
                    ? '🦶 Dešinysis pedalas (Using the Sustain Pedal — Lesson 20, p. 85–86)'
                    : '🦶 Using the Sustain Pedal (Lesson 20, Pages 85–86)'}
                </span>
                <span className="term-secondary">
                  {isLt ? 'Sinchronizuotas pedalo perėmimas' : 'Synchronized release-on-change rule'}
                </span>
              </div>
              <p className="term-description">
                {isLt ? (
                  <>
                    Dešinysis (<em>sustain</em>) pedalas leidžia išlaikyti skambesį be tarpų, kol
                    rankos juda į naują akordo padėtį. <strong>Pagrindinė taisyklė:</strong> pedalą
                    būtina <strong>atleisti tiksliai tuo momentu, kai paspaudžiamas naujas akordas</strong>, ir
                    iškart vėl nuspausti (kad senas ir naujas akordai nesusilietų į drumzliną
                    disonansą!).
                  </>
                ) : (
                  <>
                    Operated with the right foot (marked <code>Ped.</code>).{' '}
                    <strong>Golden Rule:</strong> Quickly release the pedal at the exact moment a new
                    chord harmony is struck, then immediately press it down again — preventing chords
                    (like C and G7) from blurring together!
                  </>
                )}
              </p>
            </div>

            <div className="term-card">
              <div className="term-header">
                <span className="term-primary">
                  {isLt
                    ? '✨ Artikuliacija ir Ornamentai (Lessons 5, 10, 15, 32, 33)'
                    : '✨ Articulation, Grace Notes, Glissando, Trill & Tremolo'}
                </span>
                <span className="term-secondary">
                  {isLt ? 'Staccato, Legato, Foršlagas, Glissando, Trelė' : 'Pages 22, 42, 66, 140, 147'}
                </span>
              </div>
              <p className="term-description">
                {isLt ? (
                  <>
                    <strong>Staccato (taškas virš/po nata):</strong> trumpai ir atskirtai.{' '}
                    <strong>Legato (lankas):</strong> rišliai ir sklandžiai.{' '}
                    <strong>Foršlagas (Grace note — p. 140):</strong> maža perbraukta nata prieš
                    pagrindinę (bliuze 2-as pirštas nuslysta nuo juodo klavišo D♯ ant balto E;
                    klasikoje grojama dviem skirtingais pirštais).{' '}
                    <strong>Glissando (p. 147):</strong> nykščio nagu braukiama per klavišus.{' '}
                    <strong>Trelė (Trill) ir Tremolo:</strong> greitas dviejų natų kaitaliojimas
                    (trelė — mažais intervalais 2/3 pirštais; tremolo — sekstomis/oktavomis riešo
                    judesiu).
                  </>
                ) : (
                  <>
                    <strong>Staccato:</strong> short &amp; detached (dot above/below note).{' '}
                    <strong>Legato:</strong> smooth &amp; connected.{' '}
                    <strong>Grace Note (p. 140):</strong> small slashed note before main note (Blues:
                    slide same finger from black key D♯ to white key E; Classical: use two separate
                    fingers). <strong>Glissando (p. 147):</strong> slide across keys with thumb nail.{' '}
                    <strong>Trill vs. Tremolo:</strong> rapid alternation of 2nds/3rds (fingers =
                    trill) vs. 6ths/octaves (wrist motion = tremolo).
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Interactive Book Exercises & Repertoire Player */}
          <div className="table-subsection table-subsection--spaced">
            <div className="example-header-pill">
              <span className="example-badge">
                {isLt ? 'Praktiniai Kūriniai' : 'Playable Exercises'}
              </span>
              <h3 className="example-title">
                {isLt
                  ? 'Interaktyvūs vadovėlio pratimai ir dainų ištraukos (Klausykitės ir grokite kartu)'
                  : 'Interactive Book Repertoire & Lesson Studies (Listen & Play Along)'}
              </h3>
            </div>

            {activeExerciseStepLabel && (
              <div className="playback-status-row" role="status" aria-live="polite">
                <div className="active-tick-badge">
                  <span className="pulse-dot" aria-hidden="true" />
                  <span>
                    {isLt ? 'Dabar skamba:' : 'Now Playing:'}{' '}
                    <strong>{activeExerciseStepLabel}</strong>
                  </span>
                </div>
              </div>
            )}

            <div className="scenarios-breakdown-grid">
              {BOOK_EXERCISES.map((ex) => {
                const isThisPlaying = playingExerciseId === ex.id;
                return (
                  <div key={ex.id} className="scenario-callout-card">
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '8px',
                        flexWrap: 'wrap',
                      }}
                    >
                      <span className="formula-pill">{ex.lesson}</span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {ex.timeSig} · {ex.keyName}
                      </span>
                    </div>
                    <h4 className="callout-title">
                      {isLt ? ex.titleLt : ex.titleEn}
                    </h4>
                    <ul className="scenario-steps-list">
                      <li>
                        <strong>{isLt ? 'Akordai:' : 'Chords:'}</strong>{' '}
                        <code>{ex.chordsUsed}</code>
                      </li>
                      <li>
                        <strong>{isLt ? 'Melodijos natos:' : 'Exercise Notes:'}</strong>{' '}
                        <code>{ex.melodyNotesLabel}</code>
                      </li>
                      <li>
                        <strong>{isLt ? 'Pamokos tikslas:' : 'Lesson Focus:'}</strong>{' '}
                        {isLt ? ex.focusLt : ex.focusEn}
                      </li>
                    </ul>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
                      <button
                        type="button"
                        className={`guide-audio-btn ${
                          isThisPlaying ? 'play-btn--active' : ''
                        }`}
                        onClick={() => handlePlayExercise(ex)}
                      >
                        {isThisPlaying
                          ? isLt
                            ? '⏹ Sustabdyti perklausą'
                            : '⏹ Stop Preview'
                          : isLt
                          ? '▶ Klausyti pratimo ištraukos'
                          : '▶ Hear Exercise Preview'}
                      </button>
                      {onOpenSheetMusic && (
                        <button
                          type="button"
                          className="sheet-music-pill-btn"
                          onClick={() => onOpenSheetMusic(EXERCISE_BOOK_PAGES[ex.id] ?? 16)}
                          title={
                            isLt
                              ? `Atidaryti ${EXERCISE_BOOK_PAGES[ex.id] ?? 16} puslapio natas vadovėlyje`
                              : `View Sheet Music on Page ${EXERCISE_BOOK_PAGES[ex.id] ?? 16}`
                          }
                        >
                          📄 {isLt ? `Žiūrėti natas (p. ${EXERCISE_BOOK_PAGES[ex.id] ?? 16})` : `View Sheet Music (p. ${EXERCISE_BOOK_PAGES[ex.id] ?? 16})`}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA & Cross-Guide Navigation */}
      <section className="theory-card" style={{ textAlign: 'center' }}>
        <h2 className="card-title" style={{ fontSize: '1.15rem' }}>
          {isLt
            ? 'Pasiruošę pritaikyti vadovėlio žinias praktikoje?'
            : 'Ready to Apply the Manual’s Theory on the Keyboard?'}
        </h2>
        <div
          className="ready-cta-container"
          style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}
        >
          <button
            type="button"
            className="ready-practice-cta"
            onClick={onBackToPractice}
          >
            🎹 {isLt ? 'Grįžti į Akordų Treniruotę →' : 'Back to Chord Practice →'}
          </button>
          {onOpenChordsGuide && (
            <button
              type="button"
              className="ctrl-btn"
              onClick={onOpenChordsGuide}
            >
              📖 {isLt ? 'Akordų Sandaros Atmintinė →' : 'Chord Construction Guide →'}
            </button>
          )}
          {onOpenRhythmGuide && (
            <button
              type="button"
              className="ctrl-btn"
              onClick={onOpenRhythmGuide}
            >
              ⏱️ {isLt ? 'Pulso Smulkinimo Treniruoklis →' : 'Subdivided Rhythm Engine →'}
            </button>
          )}
        </div>
      </section>
    </article>
  );
};
