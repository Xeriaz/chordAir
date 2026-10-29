export type Language = 'en' | 'lt';

export type PitchClass = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export type ChordCategory = 'triad' | 'seventh';

export type ChordQualityId =
  | 'major'
  | 'minor'
  | 'diminished'
  | 'augmented'
  | 'major7'
  | 'dominant7'
  | 'minor7'
  | 'halfDiminished7'
  | 'diminished7';

export type InversionId = 'root' | 'first' | 'second' | 'third';

export type LevelPresetId = 'beginner' | 'moreTriads' | 'seventhChords' | 'custom';

export interface NoteInfo {
  pitchClass: PitchClass;
  /** Primary display name (e.g., "C", "D#", "Eb") */
  displayName: string;
  /** Sharp spelling (e.g., "C#") */
  sharpName: string;
  /** Flat spelling (e.g., "Db") */
  flatName: string;
  /** Accessible spoken name for screen readers in English (e.g., "E flat") */
  spokenName: string;
  /** Accessible spoken name for screen readers in Lithuanian (e.g., "E bemol") */
  spokenNameLt: string;
  isBlack: boolean;
}

export interface PianoKeyData {
  midi: number;
  octave: number;
  pitchClass: PitchClass;
  noteInfo: NoteInfo;
  /** Unique label with octave, e.g., "C4" */
  id: string;
}

export interface ChordQualityDefinition {
  id: ChordQualityId;
  category: ChordCategory;
  /** Plain-language quality name, e.g. "major", "minor", "dominant 7th" */
  name: string;
  /** Capitalized title for settings UI, e.g. "Major triad" */
  title: string;
  /** Symbol suffix appended to root note, e.g. "", "m", "dim", "aug", "maj7", "7" */
  symbolSuffix: string;
  /** Semitone offsets from root in root position, e.g. [0, 4, 7] */
  intervals: number[];
  /** Plain-language interval names, e.g. ["Root", "Major 3rd", "Perfect 5th"] */
  intervalLabels: string[];
  /** Short, beginner-friendly explanation of the sound and shape */
  description: string;
  /** How to count semitones / keys for beginners */
  shapeHint: string;
}

export interface InversionDefinition {
  id: InversionId;
  index: number; // 0 = root, 1 = 1st, 2 = 2nd, 3 = 3rd
  name: string;
  shortLabel: string;
  description: string;
  /** Minimum number of notes in chord required to support this inversion */
  minNotes: number;
}

export interface LevelPresetDefinition {
  id: Exclude<LevelPresetId, 'custom'>;
  name: string;
  badge: string;
  description: string;
  qualities: ChordQualityId[];
}

export interface PracticeSettings {
  language: Language;
  preset: LevelPresetId;
  enabledQualities: ChordQualityId[];
  enabledInversions: InversionId[];
  /** Whether to show note names on all keys or only highlighted chord keys */
  showAllKeyLabels: boolean;
  /** Play chord audio automatically when a new card is shown */
  autoPlayAudio: boolean;
}

export interface ChordAnswerOption {
  /** Unique identifier: `${rootPitchClass}:${qualityId}` */
  id: string;
  rootPitchClass: PitchClass;
  qualityId: ChordQualityId;
  /** Readable full name in English, e.g. "C minor" */
  readableName: string;
  /** Chord symbol, e.g. "Cm" */
  symbol: string;
  /** Spoken accessible label in English, e.g. "C minor (Cm)" */
  ariaLabel: string;
}

export interface VoicedNote {
  midi: number;
  pitchClass: PitchClass;
  noteName: string;
  spokenName: string;
  spokenNameLt: string;
  octave: number;
  /** Role in the chord: 'root' | 'third' | 'fifth' | 'seventh' */
  role: 'root' | 'third' | 'fifth' | 'seventh';
  roleLabel: string;
  isBass: boolean;
}

export interface PracticeCard {
  id: string;
  rootPitchClass: PitchClass;
  quality: ChordQualityDefinition;
  inversion: InversionDefinition;
  /** Readable chord name in English, e.g. "C minor" */
  readableName: string;
  /** Chord symbol, e.g. "Cm" */
  symbol: string;
  /** Voiced notes sorted from lowest MIDI to highest MIDI */
  voicedNotes: VoicedNote[];
  /** MIDI numbers of highlighted keys */
  highlightedMidis: number[];
  /** Multiple choice options (4 items, or fewer if pool has <4 possible chords) */
  options: ChordAnswerOption[];
  correctOptionId: string;
}

export interface SessionStats {
  completed: number;
  correct: number;
  streak: number;
  bestStreak: number;
}
