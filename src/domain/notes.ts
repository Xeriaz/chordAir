import { NoteInfo, PianoKeyData, PitchClass } from './types';

export const NOTES: Record<PitchClass, NoteInfo> = {
  0: {
    pitchClass: 0,
    displayName: 'C',
    sharpName: 'C',
    flatName: 'C',
    spokenName: 'C',
    isBlack: false,
  },
  1: {
    pitchClass: 1,
    displayName: 'C♯/D♭',
    sharpName: 'C♯',
    flatName: 'D♭',
    spokenName: 'D flat',
    isBlack: true,
  },
  2: {
    pitchClass: 2,
    displayName: 'D',
    sharpName: 'D',
    flatName: 'D',
    spokenName: 'D',
    isBlack: false,
  },
  3: {
    pitchClass: 3,
    displayName: 'D♯/E♭',
    sharpName: 'D♯',
    flatName: 'E♭',
    spokenName: 'E flat',
    isBlack: true,
  },
  4: {
    pitchClass: 4,
    displayName: 'E',
    sharpName: 'E',
    flatName: 'E',
    spokenName: 'E',
    isBlack: false,
  },
  5: {
    pitchClass: 5,
    displayName: 'F',
    sharpName: 'F',
    flatName: 'F',
    spokenName: 'F',
    isBlack: false,
  },
  6: {
    pitchClass: 6,
    displayName: 'F♯/G♭',
    sharpName: 'F♯',
    flatName: 'G♭',
    spokenName: 'F sharp',
    isBlack: true,
  },
  7: {
    pitchClass: 7,
    displayName: 'G',
    sharpName: 'G',
    flatName: 'G',
    spokenName: 'G',
    isBlack: false,
  },
  8: {
    pitchClass: 8,
    displayName: 'G♯/A♭',
    sharpName: 'G♯',
    flatName: 'A♭',
    spokenName: 'A flat',
    isBlack: true,
  },
  9: {
    pitchClass: 9,
    displayName: 'A',
    sharpName: 'A',
    flatName: 'A',
    spokenName: 'A',
    isBlack: false,
  },
  10: {
    pitchClass: 10,
    displayName: 'A♯/B♭',
    sharpName: 'A♯',
    flatName: 'B♭',
    spokenName: 'B flat',
    isBlack: true,
  },
  11: {
    pitchClass: 11,
    displayName: 'B',
    sharpName: 'B',
    flatName: 'B',
    spokenName: 'B',
    isBlack: false,
  },
};

export const ALL_PITCH_CLASSES: PitchClass[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

/**
 * Returns the most natural single root spelling (e.g. D♭, E♭, F♯, A♭, B♭)
 * so chord names and symbols stay clean and readable for beginners.
 */
export function getRootNoteName(pitchClass: PitchClass): string {
  switch (pitchClass) {
    case 1:
      return 'D♭';
    case 3:
      return 'E♭';
    case 6:
      return 'F♯';
    case 8:
      return 'A♭';
    case 10:
      return 'B♭';
    default:
      return NOTES[pitchClass].displayName;
  }
}

/**
 * Chooses flat or sharp spelling for chord tones based on root pitch class
 * so chords like E♭ minor or D major read naturally.
 */
export function spellNoteForRoot(notePitchClass: PitchClass, rootPitchClass: PitchClass): string {
  const flatRoots = new Set<PitchClass>([0, 1, 3, 5, 8, 10]); // C, Db, Eb, F, Ab, Bb prefer flats in minor/7ths
  const info = NOTES[notePitchClass];
  if (!info.isBlack) return info.displayName;
  return flatRoots.has(rootPitchClass) ? info.flatName : info.sharpName;
}

/**
 * Generates a 2-octave keyboard from C4 (MIDI 60) to B5 (MIDI 83).
 */
export const PIANO_START_MIDI = 60; // C4
export const PIANO_END_MIDI = 83; // B5

export const PIANO_KEYS: PianoKeyData[] = Array.from(
  { length: PIANO_END_MIDI - PIANO_START_MIDI + 1 },
  (_, index) => {
    const midi = PIANO_START_MIDI + index;
    const pitchClass = (midi % 12) as PitchClass;
    const octave = Math.floor(midi / 12) - 1;
    const noteInfo = NOTES[pitchClass];
    const primaryName = getRootNoteName(pitchClass);
    return {
      midi,
      octave,
      pitchClass,
      noteInfo,
      id: `${primaryName}${octave}`,
    };
  }
);
