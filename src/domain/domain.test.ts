import { describe, expect, it } from 'vitest';
import { CHORD_QUALITIES, DEFAULT_SETTINGS, INVERSIONS, detectPresetForQualities } from './chords';
import {
  buildAnswerOptions,
  buildChordAnswerOption,
  generatePracticeCard,
  voiceChordOnKeyboard,
} from './generator';
import { formatChordReadableName, getInversionText, getQualityText } from './i18n';
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
    // Should also include same-root distractor (0:minor) when both major and minor are enabled
    expect(ids.has('0:minor')).toBe(true);
    for (const opt of options) {
      expect(['major', 'minor']).toContain(opt.qualityId);
    }
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
});
