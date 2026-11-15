export interface OctaveData {
  id: string;
  number: number;
  nameLt: string;
  nameEn: string;
  helmholtzSymbol: string;
  scientificRange: string;
  startMidi: number;
  endMidi: number;
  freqRangeHz: string;
  clefLt: string;
  clefEn: string;
  descriptionLt: string;
  descriptionEn: string;
  roleLt: string;
  roleEn: string;
  color: string;
  keysCount: number;
  pedagogyTipLt: string;
  pedagogyTipEn: string;
  exampleMidi: number; // Anchor note for audio demonstration
}

export const PIANO_OCTAVES: OctaveData[] = [
  {
    id: 'subcontra',
    number: 0,
    nameLt: 'Subkontroktava',
    nameEn: 'Sub-contra octave',
    helmholtzSymbol: 'A₂, H₂ (A,, H,,)',
    scientificRange: 'A0 – B0',
    startMidi: 21,
    endMidi: 23,
    freqRangeHz: '27.5 Hz – 30.9 Hz',
    clefLt: 'Gilusis boso raktas (po 5 pagalbinėmis linijomis)',
    clefEn: 'Deep ledger lines far below bass clef',
    descriptionLt:
      'Pati žemiausia fortepijono oktava. Standartinis fortepijonas turi tik 3 šios oktavos klavišus: La (A0), Si bemol (B♭0) ir Si (H0/B0). Dėl didžiulio stygų ilgio garsai labiau primena žemą griausmą ar virpesį.',
    descriptionEn:
      'The lowest octave on the piano, containing only 3 keys (A0, B♭0, B0). Frequencies approach the lower threshold of human hearing and are felt as visceral vibration.',
    roleLt: 'Vargonų 32 pėdų bosiniai vamzdžiai, Bösendorfer Imperial sub-bosas',
    roleEn: '32-foot pipe organ pedal stops, Bösendorfer Imperial sub-bass',
    color: '#6366f1',
    keysCount: 3,
    pedagogyTipLt:
      'Fortepijonas prasideda ne nuo C, o būtent nuo subkontroktavos A0 (La)! Tik keli gamintojai (pvz., Bösendorfer) prideda papildomų klavišų žemiau A0.',
    pedagogyTipEn:
      'The piano keyboard does not start on C, but on Sub-contra A0! Only special instruments like the Bösendorfer Imperial extend even lower.',
    exampleMidi: 21,
  },
  {
    id: 'contra',
    number: 1,
    nameLt: 'Kontroktava',
    nameEn: 'Contra octave',
    helmholtzSymbol: 'C₁ – H₁ (C, – H,)',
    scientificRange: 'C1 – B1',
    startMidi: 24,
    endMidi: 35,
    freqRangeHz: '32.7 Hz – 61.7 Hz',
    clefLt: 'Boso raktas (žemiau penklinės)',
    clefEn: 'Bass clef (ledger lines below staff)',
    descriptionLt:
      'Galingas orkestro pamatas. Žymima didžiosiomis raidėmis su apatiniu indeksu arba kableliu (C₁, D₁... arba C,, D,...). Čia skamba kontrabosas, tūba ir kontrafagotas.',
    descriptionEn:
      'Heavy orchestral foundation. Notated with capital letters and subscript numbers or commas (C₁, D₁...). The primary domain of the double bass, tuba, and contrabassoon.',
    roleLt: 'Kontrabosas, tūba, bosinė gitara',
    roleEn: 'Double bass, tuba, bass guitar',
    color: '#3b82f6',
    keysCount: 12,
    pedagogyTipLt:
      'Prisiminkite taisyklę: žemiausios oktavos žymimos DIDŽIOSIOMIS raidėmis. Kontroktavoje atsiranda apatinis indeksas 1 (C₁).',
    pedagogyTipEn:
      'Remember the classical rule: deep bass octaves use CAPITAL letters. Contra octave adds subscript 1 (C₁).',
    exampleMidi: 24,
  },
  {
    id: 'great',
    number: 2,
    nameLt: 'Didžioji oktava',
    nameEn: 'Great octave',
    helmholtzSymbol: 'C – H',
    scientificRange: 'C2 – B2',
    startMidi: 36,
    endMidi: 47,
    freqRangeHz: '65.4 Hz – 123.5 Hz',
    clefLt: 'Boso raktas (apatinė penklinės dalis)',
    clefEn: 'Bass clef (lower staff lines)',
    descriptionLt:
      'Žymima PAPRASTOMIS DIDŽIOSIOMIS RAIDĖMIS be jokių indeksų (C, D, E, F, G, A, H). Tai sodrus, šiltas baritono ir boso dainavimo registras bei violončelės gilioji C styga.',
    descriptionEn:
      'Notated with SIMPLE CAPITAL LETTERS without numbers or primes (C, D, E, F, G, A, B). Resonant baritone/bass vocal range and the rich cello C-string.',
    roleLt: 'Violončelė, baritonas/bosas, kairės rankos bosiniai akordai',
    roleEn: 'Cello, baritone/bass voices, left-hand bass fundamentals',
    color: '#06b6d4',
    keysCount: 12,
    pedagogyTipLt:
      'Didžioji oktava neturi JOKIŲ indeksų – tiesiog didžioji C, didžioji G. Ji yra boso rakto apatinėje pusėje.',
    pedagogyTipEn:
      'The Great Octave has NO numbers or primes – simply plain capital letters (C, G). It forms the lower half of the bass staff.',
    exampleMidi: 36,
  },
  {
    id: 'small',
    number: 3,
    nameLt: 'Mažoji oktava',
    nameEn: 'Small octave',
    helmholtzSymbol: 'c – h',
    scientificRange: 'C3 – B3',
    startMidi: 48,
    endMidi: 59,
    freqRangeHz: '130.8 Hz – 246.9 Hz',
    clefLt: 'Boso raktas (viršutinė penklinės dalis)',
    clefEn: 'Bass clef (upper staff lines)',
    descriptionLt:
      'Žymima PAPRASTOMIS MAŽOSIOMIS RAIDĖMIS be jokių indeksų (c, d, e, f, g, a, h). Tenoro dainavimo centras ir altų žemasis registras. Baigiasi tiesiai prieš centrinį C.',
    descriptionEn:
      'Notated with SIMPLE LOWERCASE LETTERS without primes or numbers (c, d, e, f, g, a, b). The tenor singing range and viola lower register, ending right before Middle C.',
    roleLt: 'Tenoras, altas, kairės rankos harmoninis užpildymas',
    roleEn: 'Tenor vocal range, viola, keyboard harmonic comping',
    color: '#10b981',
    keysCount: 12,
    pedagogyTipLt:
      'Čia įvyksta svarbiausias lūžis: raidės tampa MAŽOSIOMIS (c, d, e)! Mažoji oktava neturi indeksų ir gyvena ties boso rakto viršumi.',
    pedagogyTipEn:
      'The great shift happens here: letters become LOWERCASE (c, d, e)! Small octave has no numbers and sits at the top of the bass clef.',
    exampleMidi: 48,
  },
  {
    id: 'one-line',
    number: 4,
    nameLt: 'Pirmoji oktava',
    nameEn: 'One-line / First octave',
    helmholtzSymbol: 'c¹ – h¹ (c′ – h′)',
    scientificRange: 'C4 – B4',
    startMidi: 60,
    endMidi: 71,
    freqRangeHz: '261.6 Hz – 493.9 Hz',
    clefLt: 'Smuiko raktas (G raktas)',
    clefEn: 'Treble clef (G clef)',
    descriptionLt:
      'SVARBIAUSIA OKTAVA MUZIKOS MOKYME! Prasideda nuo Centrinio Do (Middle C = c¹ = C4). Čia yra tarptautinis kamertonas La (a¹ = 440 Hz). Žymima mažosiomis raidėmis su viršutiniu vienetu (c¹, d¹...).',
    descriptionEn:
      'THE PEDAGOGICAL CENTER OF THE KEYBOARD! Starts at Middle C (c¹ = C4) and contains the concert pitch A4 = 440 Hz (a¹). Notated with lowercase letters and superscript 1.',
    roleLt: 'Centrinis Do (Middle C), orkestro kamertonas A440, pradedančiųjų fortepijono melodijos',
    roleEn: 'Middle C anchor, concert pitch A440, soprano/alto core melodies',
    color: '#eab308',
    keysCount: 12,
    pedagogyTipLt:
      'Centrinis Do (c¹ / C4) yra pagrindinis pianisto orientyras. Jis dalija fortepijoną į kairės rankos (boso) ir dešinės rankos (smuiko) karalystes.',
    pedagogyTipEn:
      'Middle C (c¹ / C4) is every pianist’s home anchor, perfectly splitting the grand staff into bass and treble clefs.',
    exampleMidi: 60,
  },
  {
    id: 'two-line',
    number: 5,
    nameLt: 'Antroji oktava',
    nameEn: 'Two-line / Second octave',
    helmholtzSymbol: 'c² – h² (c″ – h″)',
    scientificRange: 'C5 – B5',
    startMidi: 72,
    endMidi: 83,
    freqRangeHz: '523.3 Hz – 987.8 Hz',
    clefLt: 'Smuiko raktas (viršutinės linijos ir virš penklinės)',
    clefEn: 'Treble clef (upper lines and spaces)',
    descriptionLt:
      'Šviesus, dainingas registras. Žymima mažosiomis raidėmis su dvejetu (c², d²...). Čia skamba smuiko E styga, soprano aukščiausios natos ir dešinės rankos fortepijono melodinės linijos.',
    descriptionEn:
      'Luminous and singing. Notated with lowercase letters and superscript 2 (c², d²...). Features the brilliant violin E-string, soprano high notes, and expressive piano leads.',
    roleLt: 'Smuiko E styga, sopranas, fortepijono dainuojanti melodija',
    roleEn: 'Violin E-string, soprano high range, expressive melodies',
    color: '#f97316',
    keysCount: 12,
    pedagogyTipLt:
      'Antrojoje oktavoje indeksas tampa 2 (c²). Visi dainuojantys fortepijono solo ir smuiko melodijos pražysta būtent čia.',
    pedagogyTipEn:
      'Two-line octave uses superscript 2 (c²). Expressive violin lines and vocal soaring high notes thrive in this register.',
    exampleMidi: 72,
  },
  {
    id: 'three-line',
    number: 6,
    nameLt: 'Trečioji oktava',
    nameEn: 'Three-line / Third octave',
    helmholtzSymbol: 'c³ – h³ (c‴ – h‴)',
    scientificRange: 'C6 – B6',
    startMidi: 84,
    endMidi: 95,
    freqRangeHz: '1046.5 Hz – 1975.5 Hz',
    clefLt: 'Smuiko raktas su 8va (octava alta)',
    clefEn: 'Treble clef with 8va ledger lines',
    descriptionLt:
      'Krištolinis, varpelius primenantis skambesys. Kad nereikėtų daugybės pagalbinių linijų, natose virš šios oktavos rašomas ženklas 8va (groti oktava aukščiau). Fleitos ir varpelių registras.',
    descriptionEn:
      'Crystalline and bell-like. Often written with an 8va sign (octava alta) to avoid excessive ledger lines. The natural high register of flutes, glockenspiel, and celesta.',
    roleLt: 'Fleita, varpeliai, čelesta, virtuoziški pasažai',
    roleEn: 'Flute, glockenspiel, celesta, virtuoso flourishes',
    color: '#ec4899',
    keysCount: 12,
    pedagogyTipLt:
      'Natose pamatę „8va“ žinokite: natos užrašytos pirmojoje ar antrojoje oktavoje, bet groti reikia trečiojoje oktavoje!',
    pedagogyTipEn:
      'When you see "8va" above the treble staff, notes written in lower registers are played one octave higher up in the 3-line octave.',
    exampleMidi: 84,
  },
  {
    id: 'four-line',
    number: 7,
    nameLt: 'Ketvirtoji oktava',
    nameEn: 'Four-line / Fourth octave',
    helmholtzSymbol: 'c⁴ – h⁴',
    scientificRange: 'C7 – B7',
    startMidi: 96,
    endMidi: 107,
    freqRangeHz: '2093.0 Hz – 3951.1 Hz',
    clefLt: 'Smuiko raktas su 15ma (dvi oktavos aukščiau)',
    clefEn: 'Treble clef with 15ma / extreme ledger lines',
    descriptionLt:
      'Veriantis, labai aukštas skambesys. Pikolo fleitos viršūnė. Žymima c⁴, d⁴ ir t.t. Šiame registre fortepijono plaktukai muša į labai trumpas trigubas plienines stygas be dempferių.',
    descriptionEn:
      'Piercing, shimmering, and ultra-high. The domain of the piccolo. Modern grand pianos omit dampers in this register because the strings ring out with brief, pure resonance.',
    roleLt: 'Pikolo fleita, fortepijono viršutiniai akcentai',
    roleEn: 'Piccolo, top piano accents and sparkling runs',
    color: '#a855f7',
    keysCount: 12,
    pedagogyTipLt:
      'Šioje oktavoje fortepijonas nebeturi dempferių (duslintuvų), nes trumpos plieninės stygos savaime greitai nutyla.',
    pedagogyTipEn:
      'Grand pianos omit dampers here because these short high strings naturally decay quickly without needing felt pads.',
    exampleMidi: 96,
  },
  {
    id: 'five-line',
    number: 8,
    nameLt: 'Penktoji oktava',
    nameEn: 'Five-line / Fifth octave',
    helmholtzSymbol: 'c⁵',
    scientificRange: 'C8',
    startMidi: 108,
    endMidi: 108,
    freqRangeHz: '4186.0 Hz',
    clefLt: 'Aukščiausia natų riba',
    clefEn: 'The summit of keyboard notation',
    descriptionLt:
      'Fortepijone yra tik VIENAS šios oktavos klavišas – C8 (c⁵). Tai 88-asis, pats kraštinis dešinysis fortepijono klavišas! Jo dažnis yra 4186 Hz – tai aukščiausias standartinio fortepijono garsas.',
    descriptionEn:
      'Contains only ONE single key on the standard piano: C8 (c⁵) — the 88th and final key at the extreme right edge of the keyboard, vibrating at 4186 Hz.',
    roleLt: 'Pats 88-asis fortepijono klavišas (viršūnė)',
    roleEn: 'The 88th and final key of the grand piano',
    color: '#f43f5e',
    keysCount: 1,
    pedagogyTipLt:
      'C8 yra paskutinė, 88-oji fortepijono nata. Daugiau klavišų į dešinę nebėra!',
    pedagogyTipEn:
      'C8 is the 88th and final note on the grand piano. There are no more keys to the right!',
    exampleMidi: 108,
  },
];

export interface OctaveNoteItem {
  midi: number;
  pitchClass: number;
  noteName: string;
  spokenNameLt: string;
  spokenNameEn: string;
  helmholtzLt: string;
  scientific: string;
  isBlack: boolean;
  frequencyHz: number;
}

const PITCH_NAMES_LT = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'H'];
const PITCH_NAMES_EN = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
const BLACK_PITCH_CLASSES = [1, 3, 6, 8, 10];

export function getOctaveNotes(octave: OctaveData): OctaveNoteItem[] {
  const notes: OctaveNoteItem[] = [];
  for (let midi = octave.startMidi; midi <= octave.endMidi; midi++) {
    const pitchClass = midi % 12;
    const isBlack = BLACK_PITCH_CLASSES.includes(pitchClass);
    const scientificOct = Math.floor(midi / 12) - 1;
    const nameLt = PITCH_NAMES_LT[pitchClass];
    const nameEn = PITCH_NAMES_EN[pitchClass];
    const freq = Math.round(440 * Math.pow(2, (midi - 69) / 12) * 10) / 10;

    // Build Helmholtz symbol
    let helmholtz = nameLt;
    if (octave.number === 0) {
      helmholtz = `${nameLt}₂`;
    } else if (octave.number === 1) {
      helmholtz = `${nameLt}₁`;
    } else if (octave.number === 2) {
      helmholtz = nameLt; // Capital
    } else if (octave.number === 3) {
      helmholtz = nameLt.toLowerCase(); // lowercase, no index
    } else {
      const sup = ['¹', '²', '³', '⁴', '⁵'][octave.number - 4] ?? '';
      helmholtz = `${nameLt.toLowerCase()}${sup}`;
    }

    notes.push({
      midi,
      pitchClass,
      noteName: nameEn,
      spokenNameLt: nameLt,
      spokenNameEn: nameEn,
      helmholtzLt: helmholtz,
      scientific: `${nameEn}${scientificOct}`,
      isBlack,
      frequencyHz: freq,
    });
  }
  return notes;
}
