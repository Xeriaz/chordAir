import { ChordQualityId, VoicedNote } from './types';

export interface CadenceChordStep {
  stepIndex: number;
  romanNumeral: string;
  nameEn: string;
  nameLt: string;
  symbol: string;
  qualityId?: ChordQualityId;
  inversionLabelEn: string;
  inversionLabelLt: string;
  voiceLeadingTipEn: string;
  voiceLeadingTipLt: string;
  notes: VoicedNote[];
  anchorMidis: number[];
}

export interface CadenceProgression {
  id: string;
  titleEn: string;
  titleLt: string;
  category: 'classical' | 'jazz' | 'minor' | 'pop';
  categoryBadgeEn: string;
  categoryBadgeLt: string;
  keyCenter: string;
  summaryEn: string;
  summaryLt: string;
  pedagogicalSecretEn: string;
  pedagogicalSecretLt: string;
  steps: CadenceChordStep[];
}

export const CADENCE_PROGRESSIONS: CadenceProgression[] = [
  {
    id: 'classical-authentic-c',
    titleEn: 'Classical Authentic Cadence (I – IV – V – I)',
    titleLt: 'Klasikinė autentinė kadencija (I – IV – V – I)',
    category: 'classical',
    categoryBadgeEn: 'Classical Harmony',
    categoryBadgeLt: 'Klasikinė harmonija',
    keyCenter: 'C Major',
    summaryEn: 'The mother of all Western harmony. Teaches common-tone anchoring so your hand never has to jump across keys.',
    summaryLt: 'Vakarų muzikos pamatas. Moko bendrų garsų inkaravimo (anchoring), kad rankai nereikėtų šokinėti per klaviatūrą.',
    pedagogicalSecretEn: 'Traditional lessons teach beginners to jump hands C -> F -> G. Master pianists lock the thumb on C when moving to F, moving only the upper two fingers by one key.',
    pedagogicalSecretLt: 'Tradicinės pamokos dažnai liepia šokinėti nuo C prie F ir G. Profesionalai laiko nykštį ant C, o viršutinius du pirštus pajudina vos per vieną klavišą.',
    steps: [
      {
        stepIndex: 1,
        romanNumeral: 'I',
        nameEn: 'C Major',
        nameLt: 'C mažoras',
        symbol: 'C',
        inversionLabelEn: 'Root position',
        inversionLabelLt: 'Pagrindinė padėtis',
        voiceLeadingTipEn: 'Home tonic. Establish a relaxed curved hand arch with fingers 1-3-5 on C4, E4, G4.',
        voiceLeadingTipLt: 'Namų tonika. Sukurkite laisvą rankos arką su pirštais 1-3-5 ant C4, E4, G4.',
        anchorMidis: [],
        notes: [
          { midi: 60, pitchClass: 0, noteName: 'C', spokenName: 'C', spokenNameLt: 'C', octave: 4, role: 'root', roleLabel: 'Root', isBass: true, fingering: '1' },
          { midi: 64, pitchClass: 4, noteName: 'E', spokenName: 'E', spokenNameLt: 'E', octave: 4, role: 'third', roleLabel: '3rd', isBass: false, fingering: '3' },
          { midi: 67, pitchClass: 7, noteName: 'G', spokenName: 'G', spokenNameLt: 'G', octave: 4, role: 'fifth', roleLabel: '5th', isBass: false, fingering: '5' },
        ],
      },
      {
        stepIndex: 2,
        romanNumeral: 'IV',
        nameEn: 'F Major / C',
        nameLt: 'F mažoras / C',
        symbol: 'F/C',
        inversionLabelEn: '2nd inversion',
        inversionLabelLt: '2-asis apvertimas',
        voiceLeadingTipEn: '⚓ Common Tone Anchor: Keep thumb 1 locked on C4! Middle finger moves to F4, pinky to A4.',
        voiceLeadingTipLt: '⚓ Bendro garso inkaras: Laikykite nykštį 1 ant C4! Vidurinis pirštas pereina į F4, mažylis į A4.',
        anchorMidis: [60],
        notes: [
          { midi: 60, pitchClass: 0, noteName: 'C', spokenName: 'C', spokenNameLt: 'C', octave: 4, role: 'fifth', roleLabel: '5th', isBass: true, fingering: '1', isAnchor: true },
          { midi: 65, pitchClass: 5, noteName: 'F', spokenName: 'F', spokenNameLt: 'F', octave: 4, role: 'root', roleLabel: 'Root', isBass: false, fingering: '3' },
          { midi: 69, pitchClass: 9, noteName: 'A', spokenName: 'A', spokenNameLt: 'A', octave: 4, role: 'third', roleLabel: '3rd', isBass: false, fingering: '5' },
        ],
      },
      {
        stepIndex: 3,
        romanNumeral: 'V',
        nameEn: 'G Major',
        nameLt: 'G mažoras',
        symbol: 'G',
        inversionLabelEn: '2nd inversion (low)',
        inversionLabelLt: '2-asis apvertimas',
        voiceLeadingTipEn: 'Dominant tension: Shift hand slightly down to D4, G4, B4. Notice G4 was in your original C chord!',
        voiceLeadingTipLt: 'Dominantinė įtampa: Perkelkite ranką į D4, G4, B4. Pastebėkite, kad G4 jau skambėjo pradiniame C akorde!',
        anchorMidis: [67],
        notes: [
          { midi: 62, pitchClass: 2, noteName: 'D', spokenName: 'D', spokenNameLt: 'D', octave: 4, role: 'fifth', roleLabel: '5th', isBass: true, fingering: '1' },
          { midi: 67, pitchClass: 7, noteName: 'G', spokenName: 'G', spokenNameLt: 'G', octave: 4, role: 'root', roleLabel: 'Root', isBass: false, fingering: '3', isAnchor: true },
          { midi: 71, pitchClass: 11, noteName: 'B', spokenName: 'B', spokenNameLt: 'H', octave: 4, role: 'third', roleLabel: '3rd', isBass: false, fingering: '5' },
        ],
      },
      {
        stepIndex: 4,
        romanNumeral: 'I',
        nameEn: 'C Major',
        nameLt: 'C mažoras',
        symbol: 'C',
        inversionLabelEn: 'Root position',
        inversionLabelLt: 'Pagrindinė padėtis',
        voiceLeadingTipEn: 'Resolution: B4 steps up 1 semitone to C; D4 steps up to E4; G4 stays rock steady. Pure resolution.',
        voiceLeadingTipLt: 'Išrišimas: B4 pustoniu kyla į C; D4 kyla į E4; G4 išlieka stabilus. Visiška harmoninė ramybė.',
        anchorMidis: [67],
        notes: [
          { midi: 60, pitchClass: 0, noteName: 'C', spokenName: 'C', spokenNameLt: 'C', octave: 4, role: 'root', roleLabel: 'Root', isBass: true, fingering: '1' },
          { midi: 64, pitchClass: 4, noteName: 'E', spokenName: 'E', spokenNameLt: 'E', octave: 4, role: 'third', roleLabel: '3rd', isBass: false, fingering: '3' },
          { midi: 67, pitchClass: 7, noteName: 'G', spokenName: 'G', spokenNameLt: 'G', octave: 4, role: 'fifth', roleLabel: '5th', isBass: false, fingering: '5', isAnchor: true },
        ],
      },
    ],
  },
  {
    id: 'jazz-two-five-one-c',
    titleEn: 'Jazz & Lo-Fi Standard (ii7 – V7 – Imaj7)',
    titleLt: 'Džiazo ir Lo-Fi standartas (ii7 – V7 – Imaj7)',
    category: 'jazz',
    categoryBadgeEn: 'Jazz & Soul Voice Leading',
    categoryBadgeLt: 'Džiazas ir Soul balsų vedimas',
    keyCenter: 'C Major',
    summaryEn: 'The definitive jazz turnaround. Demonstrates how guide tones (3rd & 7th) swap smoothly by single half steps.',
    summaryLt: 'Esminė džiazo ir šiuolaikinės muzikos seka. Parodo, kaip vedantieji tonai (3 ir 7) keičiasi vos pustoniu.',
    pedagogicalSecretEn: 'In ii-V-I, the 7th of each chord drops by a single half-step to become the 3rd of the next chord, while other notes remain anchored. This is why jazz sounds so effortlessly smooth.',
    pedagogicalSecretLt: 'ii-V-I sekoje kiekvieno akordo 7-oji nata nusileidžia vos vienu pustoniu ir tampa kito akordo 3-iąja nata. Štai kodėl džiazas skamba taip sklandžiai.',
    steps: [
      {
        stepIndex: 1,
        romanNumeral: 'ii7',
        nameEn: 'D Minor 7th',
        nameLt: 'D minorinis septakordas',
        symbol: 'Dm7',
        qualityId: 'minor7',
        inversionLabelEn: 'Root position',
        inversionLabelLt: 'Pagrindinė padėtis',
        voiceLeadingTipEn: 'Dm7: [D4, F4, A4, C5]. Notice the guide-tone 7th (C5) and 3rd (F4).',
        voiceLeadingTipLt: 'Dm7: [D4, F4, A4, C5]. Atkreipkite dėmesį į vedančiuosius tonus: 7-oji (C5) ir 3-ioji (F4).',
        anchorMidis: [],
        notes: [
          { midi: 62, pitchClass: 2, noteName: 'D', spokenName: 'D', spokenNameLt: 'D', octave: 4, role: 'root', roleLabel: 'Root', isBass: true, fingering: '1' },
          { midi: 65, pitchClass: 5, noteName: 'F', spokenName: 'F', spokenNameLt: 'F', octave: 4, role: 'third', roleLabel: '3rd', isBass: false, fingering: '2' },
          { midi: 69, pitchClass: 9, noteName: 'A', spokenName: 'A', spokenNameLt: 'A', octave: 4, role: 'fifth', roleLabel: '5th', isBass: false, fingering: '3' },
          { midi: 72, pitchClass: 0, noteName: 'C', spokenName: 'C', spokenNameLt: 'C', octave: 5, role: 'seventh', roleLabel: '7th', isBass: false, fingering: '5' },
        ],
      },
      {
        stepIndex: 2,
        romanNumeral: 'V7',
        nameEn: 'G Dominant 7th',
        nameLt: 'G dominantseptakordas',
        symbol: 'G7',
        qualityId: 'dominant7',
        inversionLabelEn: '2nd inversion voicing',
        inversionLabelLt: 'Balsų glaudinimas',
        voiceLeadingTipEn: '⚓ Anchors: D4 and F4 NEVER MOVE! C5 drops by 1 half step to B4; A4 moves to G4.',
        voiceLeadingTipLt: '⚓ Inkarai: D4 ir F4 NEPAJUDĖJO! C5 nusileidžia vos 1 pustoniu į B4; A4 pereina į G4.',
        anchorMidis: [62, 65],
        notes: [
          { midi: 62, pitchClass: 2, noteName: 'D', spokenName: 'D', spokenNameLt: 'D', octave: 4, role: 'fifth', roleLabel: '5th', isBass: true, fingering: '1', isAnchor: true },
          { midi: 65, pitchClass: 5, noteName: 'F', spokenName: 'F', spokenNameLt: 'F', octave: 4, role: 'seventh', roleLabel: '7th', isBass: false, fingering: '2', isAnchor: true },
          { midi: 67, pitchClass: 7, noteName: 'G', spokenName: 'G', spokenNameLt: 'G', octave: 4, role: 'root', roleLabel: 'Root', isBass: false, fingering: '3' },
          { midi: 71, pitchClass: 11, noteName: 'B', spokenName: 'B', spokenNameLt: 'H', octave: 4, role: 'third', roleLabel: '3rd', isBass: false, fingering: '5' },
        ],
      },
      {
        stepIndex: 3,
        romanNumeral: 'Imaj7',
        nameEn: 'C Major 7th',
        nameLt: 'C didysis septakordas',
        symbol: 'Cmaj7',
        qualityId: 'major7',
        inversionLabelEn: 'Root position',
        inversionLabelLt: 'Pagrindinė padėtis',
        voiceLeadingTipEn: '⚓ Anchor: B4 and G4 stay anchored! F4 drops 1 half step to E4; D4 resolves to C4.',
        voiceLeadingTipLt: '⚓ Inkaras: B4 ir G4 lieka vietoje! F4 nusileidžia 1 pustoniu į E4; D4 išsisprendžia į C4.',
        anchorMidis: [67, 71],
        notes: [
          { midi: 60, pitchClass: 0, noteName: 'C', spokenName: 'C', spokenNameLt: 'C', octave: 4, role: 'root', roleLabel: 'Root', isBass: true, fingering: '1' },
          { midi: 64, pitchClass: 4, noteName: 'E', spokenName: 'E', spokenNameLt: 'E', octave: 4, role: 'third', roleLabel: '3rd', isBass: false, fingering: '2' },
          { midi: 67, pitchClass: 7, noteName: 'G', spokenName: 'G', spokenNameLt: 'G', octave: 4, role: 'fifth', roleLabel: '5th', isBass: false, fingering: '3', isAnchor: true },
          { midi: 71, pitchClass: 11, noteName: 'B', spokenName: 'B', spokenNameLt: 'H', octave: 4, role: 'seventh', roleLabel: '7th', isBass: false, fingering: '5', isAnchor: true },
        ],
      },
    ],
  },
  {
    id: 'pop-four-chords-c',
    titleEn: 'Pop Ballad & Anthem (I – V – vi – IV)',
    titleLt: 'Populiariosios muzikos himnas (I – V – vi – IV)',
    category: 'pop',
    categoryBadgeEn: 'Pop / Modern Repertoire',
    categoryBadgeLt: 'Populiarioji muzika',
    keyCenter: 'C Major',
    summaryEn: 'The progression behind hundreds of famous pop and rock hits. Shows how inversions create a flowing emotional baseline.',
    summaryLt: 'Šimtų žymiausių pop ir roko hitų pagrindas. Parodo, kaip apvertimai sukuria plaukiantį melodinį pojūtį.',
    pedagogicalSecretEn: 'Rather than jumping, your right hand keeps either C or G grounded through almost the entire 4-chord cycle.',
    pedagogicalSecretLt: 'Užuot šokinėjusi, dešinė ranka beveik per visą ciklą išlaiko bendras C arba G natas.',
    steps: [
      {
        stepIndex: 1,
        romanNumeral: 'I',
        nameEn: 'C Major',
        nameLt: 'C mažoras',
        symbol: 'C',
        inversionLabelEn: 'Root position',
        inversionLabelLt: 'Pagrindinė padėtis',
        voiceLeadingTipEn: 'Tonic foundation: C4, E4, G4. Note G4 as our primary melodic anchor.',
        voiceLeadingTipLt: 'Pradžia: C4, E4, G4. Įsidėmėkite G4 kaip pagrindinį melodinį inkarą.',
        anchorMidis: [],
        notes: [
          { midi: 60, pitchClass: 0, noteName: 'C', spokenName: 'C', spokenNameLt: 'C', octave: 4, role: 'root', roleLabel: 'Root', isBass: true, fingering: '1' },
          { midi: 64, pitchClass: 4, noteName: 'E', spokenName: 'E', spokenNameLt: 'E', octave: 4, role: 'third', roleLabel: '3rd', isBass: false, fingering: '3' },
          { midi: 67, pitchClass: 7, noteName: 'G', spokenName: 'G', spokenNameLt: 'G', octave: 4, role: 'fifth', roleLabel: '5th', isBass: false, fingering: '5' },
        ],
      },
      {
        stepIndex: 2,
        romanNumeral: 'V',
        nameEn: 'G Major / D',
        nameLt: 'G mažoras / D',
        symbol: 'G/D',
        inversionLabelEn: '2nd inversion',
        inversionLabelLt: '2-asis apvertimas',
        voiceLeadingTipEn: '⚓ Common Tone Anchor: G4 stays firmly anchored on finger 3!',
        voiceLeadingTipLt: '⚓ Bendro garso inkaras: G4 lieka tvirtai įsitvirtinęs ties 3-iuoju pirštu!',
        anchorMidis: [67],
        notes: [
          { midi: 62, pitchClass: 2, noteName: 'D', spokenName: 'D', spokenNameLt: 'D', octave: 4, role: 'fifth', roleLabel: '5th', isBass: true, fingering: '1' },
          { midi: 67, pitchClass: 7, noteName: 'G', spokenName: 'G', spokenNameLt: 'G', octave: 4, role: 'root', roleLabel: 'Root', isBass: false, fingering: '3', isAnchor: true },
          { midi: 71, pitchClass: 11, noteName: 'B', spokenName: 'B', spokenNameLt: 'H', octave: 4, role: 'third', roleLabel: '3rd', isBass: false, fingering: '5' },
        ],
      },
      {
        stepIndex: 3,
        romanNumeral: 'vi',
        nameEn: 'A Minor / C',
        nameLt: 'A minoras / C',
        symbol: 'Am/C',
        inversionLabelEn: '1st inversion',
        inversionLabelLt: '1-asis apvertimas',
        voiceLeadingTipEn: 'Emotional turn: C4 returns under thumb 1, E4 under finger 3, A4 under pinky 5.',
        voiceLeadingTipLt: 'Emocinis lūžis: C4 grįžta po nykščiu 1, E4 po 3-iuoju, A4 po mažyliu 5.',
        anchorMidis: [],
        notes: [
          { midi: 60, pitchClass: 0, noteName: 'C', spokenName: 'C', spokenNameLt: 'C', octave: 4, role: 'third', roleLabel: '3rd', isBass: true, fingering: '1' },
          { midi: 64, pitchClass: 4, noteName: 'E', spokenName: 'E', spokenNameLt: 'E', octave: 4, role: 'fifth', roleLabel: '5th', isBass: false, fingering: '3' },
          { midi: 69, pitchClass: 9, noteName: 'A', spokenName: 'A', spokenNameLt: 'A', octave: 4, role: 'root', roleLabel: 'Root', isBass: false, fingering: '5' },
        ],
      },
      {
        stepIndex: 4,
        romanNumeral: 'IV',
        nameEn: 'F Major / C',
        nameLt: 'F mažoras / C',
        symbol: 'F/C',
        inversionLabelEn: '2nd inversion',
        inversionLabelLt: '2-asis apvertimas',
        voiceLeadingTipEn: '⚓ Double Anchor: Both C4 and A4 stay anchored! Only middle finger moves from E4 to F4.',
        voiceLeadingTipLt: '⚓ Dvigubas inkaras: Tiek C4, tiek A4 lieka vietoje! Tik vidurinis pirštas pajuda iš E4 į F4.',
        anchorMidis: [60, 69],
        notes: [
          { midi: 60, pitchClass: 0, noteName: 'C', spokenName: 'C', spokenNameLt: 'C', octave: 4, role: 'fifth', roleLabel: '5th', isBass: true, fingering: '1', isAnchor: true },
          { midi: 65, pitchClass: 5, noteName: 'F', spokenName: 'F', spokenNameLt: 'F', octave: 4, role: 'root', roleLabel: 'Root', isBass: false, fingering: '3' },
          { midi: 69, pitchClass: 9, noteName: 'A', spokenName: 'A', spokenNameLt: 'A', octave: 4, role: 'third', roleLabel: '3rd', isBass: false, fingering: '5', isAnchor: true },
        ],
      },
    ],
  },
  {
    id: 'minor-dramatic-a',
    titleEn: 'Dramatic Minor Cadence (i – iv – V – i)',
    titleLt: 'Dramatinė minorinė kadencija (i – iv – V – i)',
    category: 'minor',
    categoryBadgeEn: 'Minor Harmony',
    categoryBadgeLt: 'Minorinė harmonija',
    keyCenter: 'A Minor',
    summaryEn: 'The staple of classical drama and film scoring. Demonstrates the sharp leading tone (G#) pulling strongly into the tonic.',
    summaryLt: 'Kino muzikos ir klasikinės dramos šerdis. Parodo, kaip aštrus vedamasis pustonis (G#) traukia į toniką.',
    pedagogicalSecretEn: 'The harmonic minor G# creates intense emotional pull. Notice how smooth the transition feels when using 1st inversion.',
    pedagogicalSecretLt: 'Harmoninis G# sukuria stiprią trauką. Pastebėkite, kaip sklandžiai skamba perėjimas per 1-ąjį apvertimą.',
    steps: [
      {
        stepIndex: 1,
        romanNumeral: 'i',
        nameEn: 'A Minor / C',
        nameLt: 'A minoras / C',
        symbol: 'Am/C',
        inversionLabelEn: '1st inversion',
        inversionLabelLt: '1-asis apvertimas',
        voiceLeadingTipEn: 'Dark tonic: C4, E4, A4.',
        voiceLeadingTipLt: 'Tamsi tonika: C4, E4, A4.',
        anchorMidis: [],
        notes: [
          { midi: 60, pitchClass: 0, noteName: 'C', spokenName: 'C', spokenNameLt: 'C', octave: 4, role: 'third', roleLabel: '3rd', isBass: true, fingering: '1' },
          { midi: 64, pitchClass: 4, noteName: 'E', spokenName: 'E', spokenNameLt: 'E', octave: 4, role: 'fifth', roleLabel: '5th', isBass: false, fingering: '3' },
          { midi: 69, pitchClass: 9, noteName: 'A', spokenName: 'A', spokenNameLt: 'A', octave: 4, role: 'root', roleLabel: 'Root', isBass: false, fingering: '5' },
        ],
      },
      {
        stepIndex: 2,
        romanNumeral: 'iv',
        nameEn: 'D Minor / A',
        nameLt: 'D minoras / A',
        symbol: 'Dm/A',
        inversionLabelEn: '2nd inversion',
        inversionLabelLt: '2-asis apvertimas',
        voiceLeadingTipEn: '⚓ Common Tone: A4 stays firmly anchored on pinky 5!',
        voiceLeadingTipLt: '⚓ Bendras garsas: A4 lieka tvirtai įtvirtintas po 5-uoju pirštu!',
        anchorMidis: [69],
        notes: [
          { midi: 62, pitchClass: 2, noteName: 'D', spokenName: 'D', spokenNameLt: 'D', octave: 4, role: 'root', roleLabel: 'Root', isBass: true, fingering: '1' },
          { midi: 65, pitchClass: 5, noteName: 'F', spokenName: 'F', spokenNameLt: 'F', octave: 4, role: 'third', roleLabel: '3rd', isBass: false, fingering: '3' },
          { midi: 69, pitchClass: 9, noteName: 'A', spokenName: 'A', spokenNameLt: 'A', octave: 4, role: 'fifth', roleLabel: '5th', isBass: false, fingering: '5', isAnchor: true },
        ],
      },
      {
        stepIndex: 3,
        romanNumeral: 'V',
        nameEn: 'E Major / B',
        nameLt: 'E mažoras / B',
        symbol: 'E/B',
        inversionLabelEn: '2nd inversion',
        inversionLabelLt: '2-asis apvertimas',
        voiceLeadingTipEn: 'Harmonic tension: G#4 is the leading tone that yearns to resolve up to A.',
        voiceLeadingTipLt: 'Harmoninė įtampa: G#4 yra vedamasis pustonis, kuris trokšta išsispręsti į A.',
        anchorMidis: [],
        notes: [
          { midi: 64, pitchClass: 4, noteName: 'E', spokenName: 'E', spokenNameLt: 'E', octave: 4, role: 'root', roleLabel: 'Root', isBass: true, fingering: '1' },
          { midi: 68, pitchClass: 8, noteName: 'G♯', spokenName: 'G sharp', spokenNameLt: 'G diez', octave: 4, role: 'third', roleLabel: '3rd', isBass: false, fingering: '3' },
          { midi: 71, pitchClass: 11, noteName: 'B', spokenName: 'B', spokenNameLt: 'H', octave: 4, role: 'fifth', roleLabel: '5th', isBass: false, fingering: '5' },
        ],
      },
      {
        stepIndex: 4,
        romanNumeral: 'i',
        nameEn: 'A Minor / C',
        nameLt: 'A minoras / C',
        symbol: 'Am/C',
        inversionLabelEn: '1st inversion',
        inversionLabelLt: '1-asis apvertimas',
        voiceLeadingTipEn: 'Resolution: G#4 resolves up into A; complete harmonic release.',
        voiceLeadingTipLt: 'Išrišimas: G#4 pakyla į A; visiškas harmoninis palengvėjimas.',
        anchorMidis: [],
        notes: [
          { midi: 60, pitchClass: 0, noteName: 'C', spokenName: 'C', spokenNameLt: 'C', octave: 4, role: 'third', roleLabel: '3rd', isBass: true, fingering: '1' },
          { midi: 64, pitchClass: 4, noteName: 'E', spokenName: 'E', spokenNameLt: 'E', octave: 4, role: 'fifth', roleLabel: '5th', isBass: false, fingering: '3' },
          { midi: 69, pitchClass: 9, noteName: 'A', spokenName: 'A', spokenNameLt: 'A', octave: 4, role: 'root', roleLabel: 'Root', isBass: false, fingering: '5' },
        ],
      },
    ],
  },
];
