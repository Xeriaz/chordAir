import {
  ChordQualityDefinition,
  ChordQualityId,
  InversionDefinition,
  InversionId,
  LevelPresetDefinition,
  PracticeSettings,
} from './types';

export const CHORD_QUALITIES: Record<ChordQualityId, ChordQualityDefinition> = {
  major: {
    id: 'major',
    category: 'triad',
    name: 'major',
    title: 'Major triad',
    symbolSuffix: '',
    intervals: [0, 4, 7],
    intervalLabels: ['Root', 'Major 3rd', 'Perfect 5th'],
    description: 'Bright, stable, and happy 3-note chord.',
    shapeHint: 'Root + 4 half steps (middle note) + 3 half steps (top note).',
  },
  minor: {
    id: 'minor',
    category: 'triad',
    name: 'minor',
    title: 'Minor triad',
    symbolSuffix: 'm',
    intervals: [0, 3, 7],
    intervalLabels: ['Root', 'Minor 3rd', 'Perfect 5th'],
    description: 'Warm, expressive, and slightly melancholic 3-note chord.',
    shapeHint: 'Root + 3 half steps (lowered middle note) + 4 half steps (top note).',
  },
  diminished: {
    id: 'diminished',
    category: 'triad',
    name: 'diminished',
    title: 'Diminished triad',
    symbolSuffix: 'dim',
    intervals: [0, 3, 6],
    intervalLabels: ['Root', 'Minor 3rd', 'Diminished 5th'],
    description: 'Tense, compact 3-note chord that wants to resolve.',
    shapeHint: 'Stacked minor 3rds: Root + 3 half steps + 3 half steps.',
  },
  augmented: {
    id: 'augmented',
    category: 'triad',
    name: 'augmented',
    title: 'Augmented triad',
    symbolSuffix: 'aug',
    intervals: [0, 4, 8],
    intervalLabels: ['Root', 'Major 3rd', 'Augmented 5th'],
    description: 'Dreamy, wide, and floating 3-note chord.',
    shapeHint: 'Stacked major 3rds: Root + 4 half steps + 4 half steps.',
  },
  major7: {
    id: 'major7',
    category: 'seventh',
    name: 'major 7th',
    title: 'Major 7th',
    symbolSuffix: 'maj7',
    intervals: [0, 4, 7, 11],
    intervalLabels: ['Root', 'Major 3rd', 'Perfect 5th', 'Major 7th'],
    description: 'Lush, dreamy 4-note chord common in jazz and lo-fi.',
    shapeHint: 'Major triad + a note 1 half step below the next root octave.',
  },
  dominant7: {
    id: 'dominant7',
    category: 'seventh',
    name: 'dominant 7th',
    title: 'Dominant 7th',
    symbolSuffix: '7',
    intervals: [0, 4, 7, 10],
    intervalLabels: ['Root', 'Major 3rd', 'Perfect 5th', 'Minor 7th'],
    description: 'Bluesy, energetic 4-note chord with strong forward pull.',
    shapeHint: 'Major triad + a note 2 half steps below the next root octave.',
  },
  minor7: {
    id: 'minor7',
    category: 'seventh',
    name: 'minor 7th',
    title: 'Minor 7th',
    symbolSuffix: 'm7',
    intervals: [0, 3, 7, 10],
    intervalLabels: ['Root', 'Minor 3rd', 'Perfect 5th', 'Minor 7th'],
    description: 'Smooth, soulful 4-note minor chord.',
    shapeHint: 'Minor triad + a note 2 half steps below the next root octave.',
  },
  halfDiminished7: {
    id: 'halfDiminished7',
    category: 'seventh',
    name: 'half-diminished 7th',
    title: 'Half-diminished 7th',
    symbolSuffix: 'm7♭5',
    intervals: [0, 3, 6, 10],
    intervalLabels: ['Root', 'Minor 3rd', 'Diminished 5th', 'Minor 7th'],
    description: 'Rich, bittersweet 4-note chord used in jazz turnarounds.',
    shapeHint: 'Diminished triad + a minor 7th (10 half steps above root).',
  },
  diminished7: {
    id: 'diminished7',
    category: 'seventh',
    name: 'diminished 7th',
    title: 'Diminished 7th',
    symbolSuffix: 'dim7',
    intervals: [0, 3, 6, 9],
    intervalLabels: ['Root', 'Minor 3rd', 'Diminished 5th', 'Diminished 7th'],
    description: 'Dramatic, symmetrical 4-note chord spaced every 3 half steps.',
    shapeHint: 'Three equal steps of 3 semitones each (0, 3, 6, 9).',
  },
};

export const ORDERED_CHORD_QUALITIES: ChordQualityDefinition[] = [
  CHORD_QUALITIES.major,
  CHORD_QUALITIES.minor,
  CHORD_QUALITIES.diminished,
  CHORD_QUALITIES.augmented,
  CHORD_QUALITIES.major7,
  CHORD_QUALITIES.dominant7,
  CHORD_QUALITIES.minor7,
  CHORD_QUALITIES.halfDiminished7,
  CHORD_QUALITIES.diminished7,
];

export const INVERSIONS: Record<InversionId, InversionDefinition> = {
  root: {
    id: 'root',
    index: 0,
    name: 'Root position',
    shortLabel: 'Root pos.',
    description: 'The naming note (root) is at the bottom (leftmost highlighted key).',
    minNotes: 3,
  },
  first: {
    id: 'first',
    index: 1,
    name: '1st inversion',
    shortLabel: '1st inv.',
    description: 'The same chord rearranged so the middle note (3rd) is on the bottom, and the root moves up an octave.',
    minNotes: 3,
  },
  second: {
    id: 'second',
    index: 2,
    name: '2nd inversion',
    shortLabel: '2nd inv.',
    description: 'The same chord rearranged so the 5th is on the bottom, and the lower notes move up an octave.',
    minNotes: 3,
  },
  third: {
    id: 'third',
    index: 3,
    name: '3rd inversion',
    shortLabel: '3rd inv.',
    description: 'For 4-note seventh chords: the 7th is placed on the bottom.',
    minNotes: 4,
  },
};

export const ORDERED_INVERSIONS: InversionDefinition[] = [
  INVERSIONS.root,
  INVERSIONS.first,
  INVERSIONS.second,
  INVERSIONS.third,
];

export const LEVEL_PRESETS: LevelPresetDefinition[] = [
  {
    id: 'beginner',
    name: 'Beginner',
    badge: 'Beginner',
    description: 'Major and minor triads — the two foundational 3-note chords.',
    qualities: ['major', 'minor'],
  },
  {
    id: 'moreTriads',
    name: 'More triads',
    badge: 'All Triads',
    description: 'Major, minor, diminished, and augmented 3-note chords.',
    qualities: ['major', 'minor', 'diminished', 'augmented'],
  },
  {
    id: 'seventhChords',
    name: 'Seventh chords',
    badge: 'Triads & 7ths',
    description: 'Includes common 4-note seventh chords alongside triads.',
    qualities: [
      'major',
      'minor',
      'diminished',
      'augmented',
      'major7',
      'dominant7',
      'minor7',
      'halfDiminished7',
      'diminished7',
    ],
  },
];

export const DEFAULT_SETTINGS: PracticeSettings = {
  language: 'en',
  preset: 'beginner',
  enabledQualities: ['major', 'minor'],
  enabledInversions: ['root'],
  showAllKeyLabels: false,
  autoPlayAudio: false,
};

/**
 * Checks if a set of enabled qualities matches one of the standard presets.
 */
export function detectPresetForQualities(qualities: ChordQualityId[]): PracticeSettings['preset'] {
  const sortedTarget = [...qualities].sort().join(',');
  for (const preset of LEVEL_PRESETS) {
    const sortedPreset = [...preset.qualities].sort().join(',');
    if (sortedTarget === sortedPreset) {
      return preset.id;
    }
  }
  return 'custom';
}
