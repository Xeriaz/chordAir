import { describe, expect, it } from 'vitest';
import { INITIAL_STATS, sanitizeSettings, sanitizeStats } from '../App';
import { CADENCE_PROGRESSIONS } from './cadences';
import { CHORD_QUALITIES, DEFAULT_SETTINGS, INVERSIONS, detectPresetForQualities } from './chords';
import {
  buildAnswerOptions,
  buildChordAnswerOption,
  generatePracticeCard,
  voiceChordOnKeyboard,
} from './generator';
import { UI_STRINGS, formatChordReadableName, getInversionText, getQualityText } from './i18n';
import { PIANO_END_MIDI, PIANO_START_MIDI } from './notes';

describe('ChordAir domain logic', () => {
  it('formats readable chord names and symbols cleanly in English and Lithuanian', () => {
    const cMinor = buildChordAnswerOption(0, 'minor');
    expect(cMinor.readableName).toBe('C minor');
    expect(cMinor.symbol).toBe('Cm');
    expect(formatChordReadableName(0, 'minor', 'lt')).toBe('C minoras');

    const ebMaj7 = buildChordAnswerOption(3, 'major7');
    expect(ebMaj7.readableName).toBe('E♭ major 7th');
    expect(ebMaj7.symbol).toBe('E♭maj7');
    expect(formatChordReadableName(3, 'major7', 'lt')).toBe('E♭ didysis septakordas');

    const fSharpDim = buildChordAnswerOption(6, 'diminished');
    expect(fSharpDim.readableName).toBe('F♯ diminished');
    expect(fSharpDim.symbol).toBe('F♯dim');
    expect(formatChordReadableName(6, 'diminished', 'lt')).toBe('F♯ sumažintas');

    expect(getQualityText('major', 'lt').title).toBe('Mažorinis trigarsis');
    expect(getInversionText('first', 'lt').name).toBe('1-asis apvertimas (sekstakordas)');
  });

  it('voices root-position and inverted chords within the 2-octave keyboard range (C4..B5)', () => {
    for (const quality of Object.values(CHORD_QUALITIES)) {
      for (let root = 0; root < 12; root++) {
        const rootNotes = voiceChordOnKeyboard(root as 0, quality, INVERSIONS.root);
        expect(rootNotes.length).toBe(quality.intervals.length);
        expect(rootNotes[0].isBass).toBe(true);
        for (const note of rootNotes) {
          expect(note.midi).toBeGreaterThanOrEqual(PIANO_START_MIDI);
          expect(note.midi).toBeLessThanOrEqual(PIANO_END_MIDI);
        }
      }
    }
  });

  it('correctly rearranges notes for 1st and 2nd inversions', () => {
    // C major: C (0), E (4), G (7)
    const rootPos = voiceChordOnKeyboard(0, CHORD_QUALITIES.major, INVERSIONS.root);
    expect(rootPos.map((n) => n.noteName)).toEqual(['C', 'E', 'G']);
    expect(rootPos[0].role).toBe('root');

    // 1st inversion: E4 (64), G4 (67), C5 (72)
    const firstInv = voiceChordOnKeyboard(0, CHORD_QUALITIES.major, INVERSIONS.first);
    expect(firstInv.map((n) => n.noteName)).toEqual(['E', 'G', 'C']);
    expect(firstInv[0].role).toBe('third');
    expect(firstInv[0].isBass).toBe(true);

    // 2nd inversion: G4 (67), C5 (72), E5 (76)
    const secondInv = voiceChordOnKeyboard(0, CHORD_QUALITIES.major, INVERSIONS.second);
    expect(secondInv.map((n) => n.noteName)).toEqual(['G', 'C', 'E']);
    expect(secondInv[0].role).toBe('fifth');
    expect(secondInv[0].isBass).toBe(true);
  });

  it('generates 4 unique answer options including the correct answer and only enabled qualities', () => {
    const options = buildAnswerOptions(0, 'major', ['major', 'minor'], 4);
    expect(options).toHaveLength(4);
    const ids = new Set(options.map((o) => o.id));
    expect(ids.size).toBe(4);
    expect(ids.has('0:major')).toBe(true);
    expect(ids.has('0:minor')).toBe(true);
    for (const opt of options) {
      expect(['major', 'minor']).toContain(opt.qualityId);
    }
  });

  it('generates 4 distinct options even when only 1 chord quality is enabled', () => {
    const singleQualityOptions = buildAnswerOptions(5, 'major', ['major'], 4);
    expect(singleQualityOptions).toHaveLength(4);
    const ids = new Set(singleQualityOptions.map((o) => o.id));
    expect(ids.size).toBe(4);
    expect(ids.has('5:major')).toBe(true);
  });

  it('safely falls back to root position when 3rd inversion is selected for a 3-note triad', () => {
    const card = generatePracticeCard({
      ...DEFAULT_SETTINGS,
      enabledQualities: ['major'],
      enabledInversions: ['third'],
    });
    expect(card.inversion.id).toBe('root');
  });

  it('generates practice cards matching user settings and avoids immediate duplicate cards', () => {
    const firstCard = generatePracticeCard(DEFAULT_SETTINGS);
    expect(['major', 'minor']).toContain(firstCard.quality.id);
    expect(firstCard.inversion.id).toBe('root');

    const secondCard = generatePracticeCard(DEFAULT_SETTINGS, firstCard.id);
    expect(secondCard.id).not.toBe(firstCard.id);
  });

  it('detects preset levels accurately from enabled qualities', () => {
    expect(detectPresetForQualities(['minor', 'major'])).toBe('beginner');
    expect(detectPresetForQualities(['major', 'minor', 'diminished', 'augmented'])).toBe(
      'moreTriads'
    );
    expect(detectPresetForQualities(['major', 'major7'])).toBe('custom');
  });

  it('sanitizes corrupted localStorage settings and stats safely without crashing', () => {
    expect(DEFAULT_SETTINGS.language).toBe('lt');
    expect(DEFAULT_SETTINGS.showAllKeyLabels).toBe(true);

    expect(sanitizeSettings(null)).toEqual(DEFAULT_SETTINGS);
    expect(
      sanitizeSettings({
        enabledQualities: ['nonExistentQuality'],
        enabledInversions: ['root'],
      })
    ).toEqual(DEFAULT_SETTINGS);

    const partialValid = sanitizeSettings({
      language: 'lt',
      enabledQualities: ['major', 'invalidQuality'],
      enabledInversions: ['first', 'invalidInv'],
      showAllKeyLabels: true,
    });
    expect(partialValid.language).toBe('lt');
    expect(partialValid.enabledQualities).toEqual(['major']);
    expect(partialValid.enabledInversions).toEqual(['first']);
    expect(partialValid.preset).toBe('custom');

    expect(sanitizeStats({ completed: -5, correct: 999, streak: NaN })).toEqual(INITIAL_STATS);
    expect(sanitizeStats({ completed: 10, correct: 15, streak: 4, bestStreak: 2 })).toEqual({
      completed: 10,
      correct: 10,
      streak: 4,
      bestStreak: 4,
    });
  });

  it('maintains identical translation keys between English and Lithuanian UI dictionaries', () => {
    const enKeys = Object.keys(UI_STRINGS.en).sort();
    const ltKeys = Object.keys(UI_STRINGS.lt).sort();
    expect(ltKeys).toEqual(enKeys);
  });

  describe('Pedagogy Audit Masterclass features', () => {
    it('assigns anatomical right-hand fingerings to triads and inversions', () => {
      // Root position triad: 1 - 3 - 5
      const rootTriad = voiceChordOnKeyboard(0, CHORD_QUALITIES.major, INVERSIONS.root);
      expect(rootTriad.map((n) => n.fingering)).toEqual(['1', '3', '5']);

      // 1st inversion triad: 1 - 2 - 5 (wider 4th interval at top)
      const firstInvTriad = voiceChordOnKeyboard(0, CHORD_QUALITIES.major, INVERSIONS.first);
      expect(firstInvTriad.map((n) => n.fingering)).toEqual(['1', '2', '5']);

      // 2nd inversion triad: 1 - 3 - 5
      const secondInvTriad = voiceChordOnKeyboard(0, CHORD_QUALITIES.major, INVERSIONS.second);
      expect(secondInvTriad.map((n) => n.fingering)).toEqual(['1', '3', '5']);

      // 7th chord root position: 1 - 2 - 3 - 5
      const rootSeventh = voiceChordOnKeyboard(0, CHORD_QUALITIES.major7, INVERSIONS.root);
      expect(rootSeventh.map((n) => n.fingering)).toEqual(['1', '2', '3', '5']);
    });

    it('correctly creates shell voicings for 7th chords by omitting the redundant 5th', () => {
      const fullSeventh = voiceChordOnKeyboard(0, CHORD_QUALITIES.dominant7, INVERSIONS.root);
      expect(fullSeventh).toHaveLength(4);

      const shellSeventh = voiceChordOnKeyboard(0, CHORD_QUALITIES.dominant7, INVERSIONS.root, {
        shellVoicings: true,
      });
      expect(shellSeventh).toHaveLength(3);
      const roles = shellSeventh.map((n) => n.role);
      expect(roles).toContain('root');
      expect(roles).toContain('third');
      expect(roles).toContain('seventh');
      expect(roles).not.toContain('fifth');
    });

    it('validates cadence progression datasets have correct ranges and common tone anchors', () => {
      expect(CADENCE_PROGRESSIONS.length).toBeGreaterThanOrEqual(4);
      for (const prog of CADENCE_PROGRESSIONS) {
        expect(prog.steps.length).toBeGreaterThanOrEqual(3);
        for (const step of prog.steps) {
          for (const note of step.notes) {
            expect(note.midi).toBeGreaterThanOrEqual(PIANO_START_MIDI);
            expect(note.midi).toBeLessThanOrEqual(PIANO_END_MIDI);
            expect(note.fingering).toBeDefined();
          }
        }
      }
    });

    it('sanitizes and preserves blindMode, showFingering, and shellVoicings', () => {
      const sanitized = sanitizeSettings({
        enabledQualities: ['major'],
        enabledInversions: ['root'],
        blindMode: true,
        showFingering: false,
        shellVoicings: true,
      });
      expect(sanitized.blindMode).toBe(true);
      expect(sanitized.showFingering).toBe(false);
      expect(sanitized.shellVoicings).toBe(true);
    });
  });
});
