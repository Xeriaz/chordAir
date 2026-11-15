import { describe, expect, it } from 'vitest';
import { PIANO_OCTAVES, getOctaveNotes } from './octaves';

describe('Piano Octaves domain', () => {
  it('defines all 9 piano octaves from Sub-contra to 5-line', () => {
    expect(PIANO_OCTAVES.length).toBe(9);
    const namesLt = PIANO_OCTAVES.map((o) => o.nameLt);
    expect(namesLt).toEqual([
      'Subkontroktava',
      'Kontroktava',
      'Didžioji oktava',
      'Mažoji oktava',
      'Pirmoji oktava',
      'Antroji oktava',
      'Trečioji oktava',
      'Ketvirtoji oktava',
      'Penktoji oktava',
    ]);
  });

  it('correctly maps Middle C (c¹ / C4) to Pirmoji oktava', () => {
    const firstOctave = PIANO_OCTAVES.find((o) => o.id === 'one-line');
    expect(firstOctave).toBeDefined();
    expect(firstOctave!.startMidi).toBe(60); // C4 = 60
    expect(firstOctave!.scientificRange).toBe('C4 – B4');
    expect(firstOctave!.helmholtzSymbol).toContain('c¹');
  });

  it('generates correct notes and Helmholtz symbols for Didžioji and Mažoji octaves', () => {
    const greatOctave = PIANO_OCTAVES.find((o) => o.id === 'great')!;
    const greatNotes = getOctaveNotes(greatOctave);
    expect(greatNotes.length).toBe(12);
    // Great octave uses capital letters with NO index
    expect(greatNotes[0].helmholtzLt).toBe('C');
    expect(greatNotes[0].scientific).toBe('C2');

    const smallOctave = PIANO_OCTAVES.find((o) => o.id === 'small')!;
    const smallNotes = getOctaveNotes(smallOctave);
    expect(smallNotes.length).toBe(12);
    // Small octave uses lowercase letters with NO index
    expect(smallNotes[0].helmholtzLt).toBe('c');
    expect(smallNotes[0].scientific).toBe('C3');
  });

  it('accounts for all 88 keys on a standard grand piano', () => {
    const totalKeys = PIANO_OCTAVES.reduce((sum, o) => sum + o.keysCount, 0);
    expect(totalKeys).toBe(88);
    // Subkontroktava starts on A0 (MIDI 21)
    expect(PIANO_OCTAVES[0].startMidi).toBe(21);
    // Penktoji oktava ends on C8 (MIDI 108)
    expect(PIANO_OCTAVES[8].endMidi).toBe(108);
  });
});
