import { CHORD_QUALITIES, INVERSIONS } from './chords';
import {
  ALL_PITCH_CLASSES,
  NOTES,
  PIANO_END_MIDI,
  PIANO_START_MIDI,
  getRootNoteName,
  spellNoteForRoot,
} from './notes';
import {
  ChordAnswerOption,
  ChordQualityDefinition,
  ChordQualityId,
  InversionDefinition,
  PitchClass,
  PracticeCard,
  PracticeSettings,
  VoicedNote,
} from './types';

const ROLE_ORDER: Array<{ role: VoicedNote['role']; label: string }> = [
  { role: 'root', label: 'Root' },
  { role: 'third', label: '3rd' },
  { role: 'fifth', label: '5th' },
  { role: 'seventh', label: '7th' },
];

/**
 * Formats readable name and symbol for any (root, quality) pair.
 * Example: C minor / Cm, F♯ diminished / F♯dim, B♭ dominant 7th / B♭7
 */
export function buildChordAnswerOption(
  rootPitchClass: PitchClass,
  qualityId: ChordQualityId
): ChordAnswerOption {
  const rootName = getRootNoteName(rootPitchClass);
  const rootSpoken = NOTES[rootPitchClass].spokenName;
  const quality = CHORD_QUALITIES[qualityId];
  const readableName = `${rootName} ${quality.name}`;
  const symbol = `${rootName}${quality.symbolSuffix}`;
  return {
    id: `${rootPitchClass}:${qualityId}`,
    rootPitchClass,
    qualityId,
    readableName,
    symbol,
    ariaLabel: `${rootSpoken} ${quality.name}, symbol ${symbol}`,
  };
}

/**
 * Computes the voiced MIDI notes for a given root, chord quality, and inversion
 * so that all notes fit within the 2-octave keyboard (MIDI 60..83).
 */
export function voiceChordOnKeyboard(
  rootPitchClass: PitchClass,
  quality: ChordQualityDefinition,
  inversion: InversionDefinition
): VoicedNote[] {
  const rootMidiBase = PIANO_START_MIDI + rootPitchClass; // C4 (60) .. B4 (71)

  // Build root position notes first
  const unshifted = quality.intervals.map((semitones, idx) => {
    const midi = rootMidiBase + semitones;
    const pitchClass = (midi % 12) as PitchClass;
    const roleMeta = ROLE_ORDER[idx] ?? { role: 'seventh' as const, label: 'Tone' };
    return {
      midi,
      pitchClass,
      noteName: spellNoteForRoot(pitchClass, rootPitchClass),
      spokenName: NOTES[pitchClass].spokenName,
      octave: Math.floor(midi / 12) - 1,
      role: roleMeta.role,
      roleLabel: quality.intervalLabels[idx] ?? roleMeta.label,
      isBass: false,
    };
  });

  // Apply inversion by shifting the lowest `inversion.index` notes up by 12 semitones (1 octave)
  const effectiveInversionCount = Math.min(inversion.index, unshifted.length - 1);
  const inverted = unshifted.map((note, idx) => {
    if (idx < effectiveInversionCount) {
      const shiftedMidi = note.midi + 12;
      return {
        ...note,
        midi: shiftedMidi,
        octave: Math.floor(shiftedMidi / 12) - 1,
      };
    }
    return note;
  });

  // Sort ascending by MIDI pitch
  inverted.sort((a, b) => a.midi - b.midi);

  // If the highest note exceeds PIANO_END_MIDI (83 / B5), shift the entire chord down an octave
  // as long as the lowest note stays >= PIANO_START_MIDI (60).
  const maxMidi = inverted[inverted.length - 1].midi;
  const minMidi = inverted[0].midi;
  if (maxMidi > PIANO_END_MIDI && minMidi - 12 >= PIANO_START_MIDI) {
    for (const note of inverted) {
      note.midi -= 12;
      note.octave -= 1;
    }
  }

  // Mark the lowest voiced note as the bass note
  if (inverted.length > 0) {
    inverted[0].isBass = true;
  }

  return inverted;
}

/**
 * Generates plausible multiple-choice distractors from the learner's enabled chord qualities.
 * Includes same-root chords with different enabled quality and neighboring-root chords
 * so the learner practices both root accuracy and chord shape recognition.
 */
export function buildAnswerOptions(
  targetRoot: PitchClass,
  targetQualityId: ChordQualityId,
  enabledQualities: ChordQualityId[],
  optionCount = 4
): ChordAnswerOption[] {
  const correctOption = buildChordAnswerOption(targetRoot, targetQualityId);

  // Build candidate pool of all valid (root, enabledQuality) pairs excluding the target
  const sameRootCandidates: ChordAnswerOption[] = [];
  const closeRootCandidates: ChordAnswerOption[] = [];
  const otherCandidates: ChordAnswerOption[] = [];

  for (const qualityId of enabledQualities) {
    for (const root of ALL_PITCH_CLASSES) {
      if (root === targetRoot && qualityId === targetQualityId) continue;
      const candidate = buildChordAnswerOption(root, qualityId);
      const distance = Math.min(
        (root - targetRoot + 12) % 12,
        (targetRoot - root + 12) % 12
      );

      if (root === targetRoot) {
        sameRootCandidates.push(candidate);
      } else if (distance <= 4 || distance === 5 || distance === 7) {
        // Musically close roots (steps, thirds, fourths, fifths)
        closeRootCandidates.push(candidate);
      } else {
        otherCandidates.push(candidate);
      }
    }
  }

  shuffleInPlace(sameRootCandidates);
  shuffleInPlace(closeRootCandidates);
  shuffleInPlace(otherCandidates);

  const selectedDistractors: ChordAnswerOption[] = [];

  // Always include at least 1 same-root distractor if available (e.g. C major vs C minor)
  if (sameRootCandidates.length > 0) {
    selectedDistractors.push(sameRootCandidates.shift()!);
  }

  // Combine remaining prioritized candidates
  const remainingPool = [...sameRootCandidates, ...closeRootCandidates, ...otherCandidates];
  shuffleInPlace(remainingPool);

  for (const candidate of remainingPool) {
    if (selectedDistractors.length >= optionCount - 1) break;
    selectedDistractors.push(candidate);
  }

  const allOptions = [correctOption, ...selectedDistractors];
  shuffleInPlace(allOptions);
  return allOptions;
}

/**
 * Generates a new practice card respecting the user's current settings,
 * avoiding repeating the exact same chord twice in a row.
 */
export function generatePracticeCard(
  settings: PracticeSettings,
  previousCardId?: string
): PracticeCard {
  const activeQualities: ChordQualityId[] =
    settings.enabledQualities.length > 0 ? settings.enabledQualities : ['major', 'minor'];

  // Pick a quality and root, avoiding immediate repeat when possible
  let chosenRoot: PitchClass = ALL_PITCH_CLASSES[Math.floor(Math.random() * ALL_PITCH_CLASSES.length)];
  let chosenQualityId: ChordQualityId =
    activeQualities[Math.floor(Math.random() * activeQualities.length)];
  let chosenInversion: InversionDefinition = INVERSIONS.root;

  for (let attempt = 0; attempt < 12; attempt++) {
    chosenRoot = ALL_PITCH_CLASSES[Math.floor(Math.random() * ALL_PITCH_CLASSES.length)];
    chosenQualityId = activeQualities[Math.floor(Math.random() * activeQualities.length)];
    const qualityDef = CHORD_QUALITIES[chosenQualityId];

    // Filter enabled inversions compatible with this chord's note count
    // Also ensure voiced notes fit within our 2-octave keyboard (C4..B5)
    const validInversions = settings.enabledInversions
      .map((id) => INVERSIONS[id])
      .filter((inv) => {
        if (!inv || qualityDef.intervals.length < inv.minNotes) return false;
        const voiced = voiceChordOnKeyboard(chosenRoot, qualityDef, inv);
        return voiced[voiced.length - 1].midi <= PIANO_END_MIDI;
      });

    chosenInversion =
      validInversions.length > 0
        ? validInversions[Math.floor(Math.random() * validInversions.length)]
        : INVERSIONS.root;

    const candidateId = `${chosenRoot}:${chosenQualityId}:${chosenInversion.id}`;
    if (candidateId !== previousCardId) {
      break;
    }
  }

  const quality = CHORD_QUALITIES[chosenQualityId];
  const voicedNotes = voiceChordOnKeyboard(chosenRoot, quality, chosenInversion);
  const answerMeta = buildChordAnswerOption(chosenRoot, chosenQualityId);
  const options = buildAnswerOptions(chosenRoot, chosenQualityId, activeQualities, 4);

  return {
    id: `${chosenRoot}:${chosenQualityId}:${chosenInversion.id}`,
    rootPitchClass: chosenRoot,
    quality,
    inversion: chosenInversion,
    readableName: answerMeta.readableName,
    symbol: answerMeta.symbol,
    voicedNotes,
    highlightedMidis: voicedNotes.map((n) => n.midi),
    options,
    correctOptionId: answerMeta.id,
  };
}

function shuffleInPlace<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
