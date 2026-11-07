/**
 * Subdivided Counting Engine (Pulso Smulkinimas)
 *
 * Implements discrete integer rhythmic subdivision for music education.
 * Treats rhythm as discrete integer units by finding the smallest common
 * rhythmic denomination (the base unit, e.g. 8th or 16th note) and setting
 * that denomination to 1 unit (a single metronome/subdivision tick).
 *
 * All note and rest durations become exact integer multiples of that unit.
 */

export type NoteType =
  | '16th'
  | '8th'
  | 'dotted-8th'
  | 'quarter'
  | 'dotted-quarter'
  | 'half'
  | 'dotted-half'
  | 'whole';

export type BaseUnit = '8th' | '16th';

export interface NoteMetadata {
  id: NoteType;
  nameEn: string;
  nameLt: string;
  symbol: string;
  standardBeats: number;
  fractionLabel: string;
  subdividedUnits8th: number;
  subdividedUnits16th: number;
  countDisplay8th: string;
  countDisplay16th: string;
}

export interface SubdivisionSpan {
  note: NoteType;
  units: number;
  span: [number, number]; // [startTick, endTick] (1-indexed inclusive)
}

/**
 * Standard note metadata dictionary for both English and Lithuanian musical theory.
 */
export const NOTE_DEFINITIONS: Record<NoteType, NoteMetadata> = {
  '16th': {
    id: '16th',
    nameEn: 'Sixteenth note',
    nameLt: 'Šešioliktinė nata',
    symbol: '𝅘𝅥𝅯',
    standardBeats: 0.25,
    fractionLabel: '1/16',
    subdividedUnits8th: 0.5,
    subdividedUnits16th: 1,
    countDisplay8th: '[0.5]',
    countDisplay16th: '[1]',
  },
  '8th': {
    id: '8th',
    nameEn: 'Eighth note',
    nameLt: 'Aštuntinė nata',
    symbol: '♪',
    standardBeats: 0.5,
    fractionLabel: '1/8',
    subdividedUnits8th: 1,
    subdividedUnits16th: 2,
    countDisplay8th: '[1]',
    countDisplay16th: '[1, 2]',
  },
  'dotted-8th': {
    id: 'dotted-8th',
    nameEn: 'Dotted eighth',
    nameLt: 'Punktuota aštuntinė',
    symbol: '♪.',
    standardBeats: 0.75,
    fractionLabel: '3/16',
    subdividedUnits8th: 1.5,
    subdividedUnits16th: 3,
    countDisplay8th: '[1.5]',
    countDisplay16th: '[1, 2, 3]',
  },
  quarter: {
    id: 'quarter',
    nameEn: 'Quarter note',
    nameLt: 'Ketvirtinė nata',
    symbol: '♩',
    standardBeats: 1.0,
    fractionLabel: '1/4',
    subdividedUnits8th: 2,
    subdividedUnits16th: 4,
    countDisplay8th: '[1, 2]',
    countDisplay16th: '[1, 2, 3, 4]',
  },
  'dotted-quarter': {
    id: 'dotted-quarter',
    nameEn: 'Dotted quarter',
    nameLt: 'Punktuota ketvirtinė',
    symbol: '♩.',
    standardBeats: 1.5,
    fractionLabel: '3/8',
    subdividedUnits8th: 3,
    subdividedUnits16th: 6,
    countDisplay8th: '[1, 2, 3]',
    countDisplay16th: '[1 .. 6]',
  },
  half: {
    id: 'half',
    nameEn: 'Half note',
    nameLt: 'Pusinė nata',
    symbol: '𝅗𝅥',
    standardBeats: 2.0,
    fractionLabel: '2/4',
    subdividedUnits8th: 4,
    subdividedUnits16th: 8,
    countDisplay8th: '[1, 2, 3, 4]',
    countDisplay16th: '[1 .. 8]',
  },
  'dotted-half': {
    id: 'dotted-half',
    nameEn: 'Dotted half',
    nameLt: 'Punktuota pusinė',
    symbol: '𝅗𝅥.',
    standardBeats: 3.0,
    fractionLabel: '3/4',
    subdividedUnits8th: 6,
    subdividedUnits16th: 12,
    countDisplay8th: '[1, 2, 3, 4, 5, 6]',
    countDisplay16th: '[1 .. 12]',
  },
  whole: {
    id: 'whole',
    nameEn: 'Whole note',
    nameLt: 'Sveikoji nata',
    symbol: '𝅝',
    standardBeats: 4.0,
    fractionLabel: '4/4',
    subdividedUnits8th: 8,
    subdividedUnits16th: 16,
    countDisplay8th: '[1, 2, 3, 4, 5, 6, 7, 8]',
    countDisplay16th: '[1 .. 16]',
  },
};

/**
 * Returns the integer or discrete unit count for a given note type
 * relative to the chosen subdivision base denomination.
 */
export function getNoteUnits(note: NoteType, baseUnit: BaseUnit): number {
  const meta = NOTE_DEFINITIONS[note];
  if (!meta) {
    throw new Error(`Unknown note type: ${note}`);
  }
  return baseUnit === '8th' ? meta.subdividedUnits8th : meta.subdividedUnits16th;
}

/**
 * Calculates start and end ticks (1-indexed inclusive) for each note in a measure
 * using the smallest common denomination as 1 unit.
 *
 * Example A (8th base):
 * Input: ['quarter', '8th', '8th', 'half'], '8th'
 * Output spans: [1, 2], [3, 3], [4, 4], [5, 8]
 */
export function calculateSubdivisionUnits(
  notes: NoteType[],
  baseUnit: BaseUnit
): SubdivisionSpan[] {
  let currentTick = 1;

  return notes.map((note) => {
    const units = getNoteUnits(note, baseUnit);
    const startTick = currentTick;
    // For integer units, endTick is startTick + units - 1
    const endTick = startTick + units - 1;
    currentTick += units;

    return {
      note,
      units,
      span: [startTick, endTick],
    };
  });
}

/**
 * Formats a single note's tick span as a concise count string.
 * e.g. [1, 2] -> "(1-2)"
 *      [3, 3] -> "(3)"
 *      [5, 8] -> "(5-6-7-8)" or "(5-8)"
 */
export function formatSpanCount(span: [number, number], expanded = true): string {
  const [start, end] = span;
  if (start === end) {
    return `(${start})`;
  }

  if (!expanded) {
    return `(${start}-${end})`;
  }

  const ticks: number[] = [];
  for (let i = start; i <= end; i += 1) {
    ticks.push(i);
  }
  return `(${ticks.join('-')})`;
}

/**
 * Formats a measure's list of subdivision spans into the canonical visual breakdown.
 * e.g. "(1-2) | (3) | (4) | (5-6-7-8)"
 */
export function formatMeasureDisplay(spans: SubdivisionSpan[]): string {
  return spans.map((s) => formatSpanCount(s.span, true)).join(' | ');
}

/**
 * Returns an array of discrete tick numbers that belong to a span.
 * e.g. [1, 3] -> [1, 2, 3]
 */
export function getSpanTicks(span: [number, number]): number[] {
  const [start, end] = span;
  const ticks: number[] = [];
  for (let i = start; i <= end; i += 1) {
    ticks.push(i);
  }
  return ticks;
}

/**
 * Predefined educational scenarios specified in the curriculum.
 */
export interface RhythmicScenario {
  id: string;
  titleEn: string;
  titleLt: string;
  descriptionEn: string;
  descriptionLt: string;
  baseUnit: BaseUnit;
  timeSignature: '4/4' | '3/4';
  totalUnits: number;
  notes: NoteType[];
}

export const PRESET_SCENARIOS: RhythmicScenario[] = [
  {
    id: 'scenario-1-8th',
    titleEn: 'Measure Scenario 1 (Quarter + Two 8ths + Half)',
    titleLt: '1 Scenarijus (Ketvirtinė + Dvi aštuntinės + Pusinė)',
    descriptionEn: 'Even division with steady quarters and eighths in 4/4 time.',
    descriptionLt: 'Tolygus ritmo pasiskirstymas su ketvirtinėmis ir aštuntinėmis 4/4 takte.',
    baseUnit: '8th',
    timeSignature: '4/4',
    totalUnits: 8,
    notes: ['quarter', '8th', '8th', 'half'],
  },
  {
    id: 'scenario-2-syncopation',
    titleEn: 'Measure Scenario 2 (Syncopation & Dotted Note)',
    titleLt: '2 Scenarijus (Sinkopė ir punktuota nata)',
    descriptionEn: 'Syncopated rhythm with a dotted quarter note crossing the second beat.',
    descriptionLt: 'Sinkopuotas ritmas su punktuota ketvirtine nata, peržengiančia antrąją takto dalį.',
    baseUnit: '8th',
    timeSignature: '4/4',
    totalUnits: 8,
    notes: ['dotted-quarter', '8th', 'half'],
  },
  {
    id: 'scenario-3-16th-dotted',
    titleEn: 'Scenario 3: 16th-Note Precision (Dotted 8th + 16th Pattern)',
    titleLt: '3 Scenarijus: 16-tinių tikslumas (Punktuota aštuntinė + 16-tinė)',
    descriptionEn: 'Rapid micro-rhythms where 16th notes require setting the base unit to 16th.',
    descriptionLt: 'Greitas mikroritmas, kur 16-tinės natos reikalauja bazinę vertę prilyginti šešioliktinei.',
    baseUnit: '16th',
    timeSignature: '4/4',
    totalUnits: 16,
    notes: ['dotted-8th', '16th', 'quarter', 'half'],
  },
  {
    id: 'scenario-4-16th-groove',
    titleEn: 'Scenario 4: Four 16ths + Two 8ths + Half',
    titleLt: '4 Scenarijus: Keturių 16-tinių bėgimas + Dvi aštuntinės + Pusinė',
    descriptionEn: 'Common classical and pop rhythm with a fast four-note 16th cluster.',
    descriptionLt: 'Klasikinėje ir populiariojoje muzikoje dažnas keturių šešioliktinių bėgimas.',
    baseUnit: '16th',
    timeSignature: '4/4',
    totalUnits: 16,
    notes: ['16th', '16th', '16th', '16th', '8th', '8th', 'half'],
  },
];
