import { describe, expect, it } from 'vitest';
import {
  NOTE_DEFINITIONS,
  NoteType,
  PRESET_SCENARIOS,
  calculateSubdivisionUnits,
  formatMeasureDisplay,
  formatSpanCount,
  getNoteUnits,
  getSpanTicks,
} from './subdivisionEngine';

describe('Subdivided Counting Engine (Pulso Smulkinimas)', () => {
  describe('8th-note base unit calculations (Example A)', () => {
    it('accurately converts all note types to 8th-note integer units in 4/4 time', () => {
      expect(getNoteUnits('8th', '8th')).toBe(1);
      expect(getNoteUnits('quarter', '8th')).toBe(2);
      expect(getNoteUnits('dotted-quarter', '8th')).toBe(3);
      expect(getNoteUnits('half', '8th')).toBe(4);
      expect(getNoteUnits('dotted-half', '8th')).toBe(6);
      expect(getNoteUnits('whole', '8th')).toBe(8);
    });

    it('calculates Measure Scenario 1: [Quarter, Eighth, Eighth, Half]', () => {
      // 2 + 1 + 1 + 4 = 8 units
      const notes = ['quarter', '8th', '8th', 'half'] as const;
      const spans = calculateSubdivisionUnits([...notes], '8th');

      expect(spans).toHaveLength(4);

      // Quarter: units = 2, span = [1, 2]
      expect(spans[0]).toEqual({
        note: 'quarter',
        units: 2,
        span: [1, 2],
      });

      // Eighth: units = 1, span = [3, 3]
      expect(spans[1]).toEqual({
        note: '8th',
        units: 1,
        span: [3, 3],
      });

      // Eighth: units = 1, span = [4, 4]
      expect(spans[2]).toEqual({
        note: '8th',
        units: 1,
        span: [4, 4],
      });

      // Half: units = 4, span = [5, 8]
      expect(spans[3]).toEqual({
        note: 'half',
        units: 4,
        span: [5, 8],
      });

      // Total units should equal 8
      const totalUnits = spans.reduce((sum, s) => sum + s.units, 0);
      expect(totalUnits).toBe(8);

      // Visual display count: (1-2) | (3) | (4) | (5-6-7-8)
      expect(formatMeasureDisplay(spans)).toBe('(1-2) | (3) | (4) | (5-6-7-8)');
    });

    it('calculates Measure Scenario 2: [Dotted Quarter, Eighth, Half]', () => {
      // 3 + 1 + 4 = 8 units
      const notes = ['dotted-quarter', '8th', 'half'] as const;
      const spans = calculateSubdivisionUnits([...notes], '8th');

      expect(spans).toHaveLength(3);

      // Dotted quarter: units = 3, span = [1, 3]
      expect(spans[0]).toEqual({
        note: 'dotted-quarter',
        units: 3,
        span: [1, 3],
      });

      // Eighth: units = 1, span = [4, 4]
      expect(spans[1]).toEqual({
        note: '8th',
        units: 1,
        span: [4, 4],
      });

      // Half: units = 4, span = [5, 8]
      expect(spans[2]).toEqual({
        note: 'half',
        units: 4,
        span: [5, 8],
      });

      const totalUnits = spans.reduce((sum, s) => sum + s.units, 0);
      expect(totalUnits).toBe(8);

      // Visual display count: (1-2-3) | (4) | (5-6-7-8)
      expect(formatMeasureDisplay(spans)).toBe('(1-2-3) | (4) | (5-6-7-8)');
    });
  });

  describe('16th-note base unit calculations (Example B)', () => {
    it('accurately converts all note types to 16th-note integer units in 4/4 time', () => {
      expect(getNoteUnits('16th', '16th')).toBe(1);
      expect(getNoteUnits('8th', '16th')).toBe(2);
      expect(getNoteUnits('dotted-8th', '16th')).toBe(3);
      expect(getNoteUnits('quarter', '16th')).toBe(4);
      expect(getNoteUnits('dotted-quarter', '16th')).toBe(6);
      expect(getNoteUnits('half', '16th')).toBe(8);
      expect(getNoteUnits('dotted-half', '16th')).toBe(12);
      expect(getNoteUnits('whole', '16th')).toBe(16);
    });

    it('calculates Scenario 3 (dotted-8th + 16th + quarter + half) correctly', () => {
      // [Dotted 8th, 16th, Quarter, Half] -> 3 + 1 + 4 + 8 = 16 units
      const notes = ['dotted-8th', '16th', 'quarter', 'half'] as const;
      const spans = calculateSubdivisionUnits([...notes], '16th');

      expect(spans[0].span).toEqual([1, 3]);
      expect(spans[1].span).toEqual([4, 4]);
      expect(spans[2].span).toEqual([5, 8]);
      expect(spans[3].span).toEqual([9, 16]);

      const totalUnits = spans.reduce((sum, s) => sum + s.units, 0);
      expect(totalUnits).toBe(16);
      expect(formatMeasureDisplay(spans)).toBe('(1-2-3) | (4) | (5-6-7-8) | (9-10-11-12-13-14-15-16)');
    });

    it('calculates Scenario 4 (four 16ths + two 8ths + half) correctly', () => {
      // 1 + 1 + 1 + 1 + 2 + 2 + 8 = 16 units
      const notes = ['16th', '16th', '16th', '16th', '8th', '8th', 'half'] as const;
      const spans = calculateSubdivisionUnits([...notes], '16th');

      expect(spans).toHaveLength(7);
      expect(spans[0].span).toEqual([1, 1]);
      expect(spans[1].span).toEqual([2, 2]);
      expect(spans[2].span).toEqual([3, 3]);
      expect(spans[3].span).toEqual([4, 4]);
      expect(spans[4].span).toEqual([5, 6]);
      expect(spans[5].span).toEqual([7, 8]);
      expect(spans[6].span).toEqual([9, 16]);
      expect(formatMeasureDisplay(spans)).toBe('(1) | (2) | (3) | (4) | (5-6) | (7-8) | (9-10-11-12-13-14-15-16)');
    });
  });

  describe('Formatting & helper utilities', () => {
    it('formats single and multiple tick spans correctly', () => {
      expect(formatSpanCount([1, 1])).toBe('(1)');
      expect(formatSpanCount([1, 2])).toBe('(1-2)');
      expect(formatSpanCount([1, 3])).toBe('(1-2-3)');
      expect(formatSpanCount([5, 8])).toBe('(5-6-7-8)');
      expect(formatSpanCount([1, 8], false)).toBe('(1-8)');
    });

    it('expands spans into discrete tick integer arrays', () => {
      expect(getSpanTicks([1, 1])).toEqual([1]);
      expect(getSpanTicks([1, 4])).toEqual([1, 2, 3, 4]);
      expect(getSpanTicks([5, 8])).toEqual([5, 6, 7, 8]);
    });

    it('handles empty note array without errors', () => {
      const spans = calculateSubdivisionUnits([], '8th');
      expect(spans).toEqual([]);
      expect(formatMeasureDisplay(spans)).toBe('');
    });

    it('throws when encountering an unknown note type', () => {
      expect(() => getNoteUnits('invalid-note' as unknown as NoteType, '8th')).toThrow();
    });

    it('contains metadata for all supported note types', () => {
      expect(NOTE_DEFINITIONS['16th'].nameEn).toBe('Sixteenth note');
      expect(NOTE_DEFINITIONS['16th'].nameLt).toBe('Šešioliktinė nata');
      expect(NOTE_DEFINITIONS['8th'].nameEn).toBe('Eighth note');
      expect(NOTE_DEFINITIONS['8th'].nameLt).toBe('Aštuntinė nata');
      expect(NOTE_DEFINITIONS['whole'].nameLt).toBe('Sveikoji nata');
    });

    it('includes valid preset scenarios matching curriculum', () => {
      expect(PRESET_SCENARIOS.length).toBeGreaterThanOrEqual(4);
      const sc1 = PRESET_SCENARIOS.find((s) => s.id === 'scenario-1-8th');
      expect(sc1).toBeDefined();
      expect(sc1?.notes).toEqual(['quarter', '8th', '8th', 'half']);

      const sc2 = PRESET_SCENARIOS.find((s) => s.id === 'scenario-2-syncopation');
      expect(sc2).toBeDefined();
      expect(sc2?.notes).toEqual(['dotted-quarter', '8th', 'half']);

      const sc3 = PRESET_SCENARIOS.find((s) => s.id === 'scenario-3-16th-dotted');
      expect(sc3).toBeDefined();
      expect(sc3?.notes).toEqual(['dotted-8th', '16th', 'quarter', 'half']);

      const sc4 = PRESET_SCENARIOS.find((s) => s.id === 'scenario-4-16th-groove');
      expect(sc4).toBeDefined();
      expect(sc4?.notes).toEqual(['16th', '16th', '16th', '16th', '8th', '8th', 'half']);
    });
  });
});
