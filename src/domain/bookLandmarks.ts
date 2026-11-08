export interface BookLandmark {
  page: number;
  lesson: string;
  titleEn: string;
  titleLt: string;
  category: 'basics' | 'repertoire' | 'scales' | 'blues' | 'advanced';
  descEn?: string;
  descLt?: string;
}

export const TOTAL_BOOK_PAGES = 216;

export const BOOK_LANDMARKS: BookLandmark[] = [
  {
    page: 1,
    lesson: 'Cover',
    titleEn: 'Book Cover & Title',
    titleLt: 'Knygos viršelis ir antraštė',
    category: 'basics',
  },
  {
    page: 4,
    lesson: 'Contents',
    titleEn: 'Table of Contents & Index',
    titleLt: 'Turinys ir pamokų rodyklė',
    category: 'basics',
  },
  {
    page: 8,
    lesson: 'Introduction',
    titleEn: 'How to Sit, Hand Shape & Practice Approach',
    titleLt: 'Sėdėsena, rankų forma ir praktikos metodika',
    category: 'basics',
  },
  {
    page: 10,
    lesson: 'Lesson 1',
    titleEn: 'C Position & Treble Notes (RH 1–5)',
    titleLt: 'C padėtis ir smuiko rakto natos (DR 1–5)',
    category: 'basics',
    descEn: 'Introduction to Middle C, Treble clef, 4/4 meter, and 5-finger right hand position.',
    descLt: 'Pirmosios oktavos C, smuiko raktas, 4/4 metras ir 5 pirštų dešinės rankos padėtis.',
  },
  {
    page: 16,
    lesson: 'Lesson 2',
    titleEn: 'Ode to Joy (Beethoven) & Left Hand Chords (C, G7)',
    titleLt: 'Odė džiaugsmui (Beethoven) ir kairės rankos akordai (C, G7)',
    category: 'repertoire',
    descEn: 'Beethoven classic introducing LH chord accompaniment with C and G7 block chords.',
    descLt: 'Beethoveno klasika: kairės rankos akordų pritarimas (C ir G7 trigarsiai).',
  },
  {
    page: 18,
    lesson: 'Lesson 3',
    titleEn: "When the Saints Go Marchin' In & Lead-in Notes",
    titleLt: "When the Saints Go Marchin' In ir priešaktis",
    category: 'repertoire',
    descEn: '3-beat lead-in (pick-up bar), ties across bar lines, and F major chord.',
    descLt: '3 dalių priešaktis, lygos per takto brūkšnį ir F mažoro akordas.',
  },
  {
    page: 20,
    lesson: 'Lesson 5',
    titleEn: 'C Major Scale (Thumb-under & Crossover)',
    titleLt: 'C mažoro gama (nykščio pakišimas ir perkėlimas)',
    category: 'scales',
    descEn: '8-note full octave scale fingering: 1–2–3–1–2–3–4–5 and crossover technique.',
    descLt: 'Pilnos oktavos gama: 1–2–3–1–2–3–4–5 pirštuotė ir nykščio pakišimo technika.',
  },
  {
    page: 23,
    lesson: 'Lesson 6',
    titleEn: "Brahms' Lullaby (Waltz Time 3/4 & Dotted Notes)",
    titleLt: 'Bramso lopšinė (Valso metras 3/4 ir punktuotos natos)',
    category: 'repertoire',
    descEn: '3/4 meter, dotted quarter notes, and lyrical expression.',
    descLt: '3/4 metras, punktuotos ketvirtinės natos ir lyriškas frazavimas.',
  },
  {
    page: 33,
    lesson: 'Lesson 13',
    titleEn: 'Scarborough Fair (Minor Chords & Arpeggios)',
    titleLt: 'Scarborough Fair (Minoriniai akordai ir arpedžio)',
    category: 'repertoire',
    descEn: 'Traditional folk ballad in D minor / Dorian feel with rolling arpeggios.',
    descLt: 'Tradicinė baladė D minore / dorinėje dermėje su banguojančiais arpedžio.',
  },
  {
    page: 34,
    lesson: 'Lesson 15',
    titleEn: 'Chopsticks (Duets, Rhythmic Accents & Staccato)',
    titleLt: 'Chopsticks (Duetai, ritminiai akcentai ir staccato)',
    category: 'repertoire',
    descEn: 'Famous duet piece practicing parallel 3rds, staccato touches, and strict rhythm.',
    descLt: 'Garsusis duetas: lygiagrečios tercijos, staccato štrichas ir tikslus tempas.',
  },
  {
    page: 54,
    lesson: 'Lesson 11',
    titleEn: 'G Major Scale (Sharps & Key Signatures)',
    titleLt: 'G mažoro gama (diezai ir prierakčio ženklai)',
    category: 'scales',
    descEn: 'Key of G Major with 1 sharp (F♯), semitones between 3–4 and 7–8.',
    descLt: 'G mažoro tonacija su 1 diezu (F♯), pustoniai tarp 3–4 ir 7–8 laipsnių.',
  },
  {
    page: 58,
    lesson: 'Lesson 12',
    titleEn: 'F Major Scale (Flats & 4th Finger Thumb-under)',
    titleLt: 'F mažoro gama (bemoliai ir 4 piršto pakišimas)',
    category: 'scales',
    descEn: 'Key of F Major with 1 flat (B♭) and special RH fingering rule on black keys.',
    descLt: 'F mažoro tonacija su 1 bemoliu (B♭) ir speciali pirštuotė juodiems klavišams.',
  },
  {
    page: 84,
    lesson: 'Lesson 19',
    titleEn: 'Cut Common Time (Alla Breve 2/2)',
    titleLt: 'Cut Common Time (Alla Breve 2/2 metras)',
    category: 'basics',
    descEn: 'Fast tempos counted in 2 half-note pulses per bar.',
    descLt: 'Greiti tempai, skaičiuojant po 2 pusines natas takte (alla breve).',
  },
  {
    page: 104,
    lesson: 'Lesson 24',
    titleEn: 'A Natural Minor Scale (Relative of C Major)',
    titleLt: 'A natūraliojo minoro gama (paralelinė C mažorui)',
    category: 'scales',
    descEn: 'All white keys from A to A; relative minor tonic relationship.',
    descLt: 'Visi balti klavišai nuo A iki A; paralelinio minoro sąsaja su C mažoru.',
  },
  {
    page: 108,
    lesson: 'Lesson 25',
    titleEn: 'Harmonic & Melodic Minor / House of the Rising Sun',
    titleLt: 'Harmoninis ir melodinis minoras / House of the Rising Sun',
    category: 'repertoire',
    descEn: 'Raised 7th (G♯) in harmonic minor, compound 6/8 meter in House of the Rising Sun.',
    descLt: 'Paaukštintas VII laipsnis (G♯), 6/8 metras ir arpedžiuoti akordai.',
  },
  {
    page: 116,
    lesson: 'Lesson 27',
    titleEn: '12-Bar Blues (Walking Bass & Shuffle Rhythm)',
    titleLt: '12 taktų bliuzas (bosinė linija ir swing/shuffle ritmas)',
    category: 'blues',
    descEn: 'Standard I–IV–V 12-bar blues progression with swung eighths and boogie bass.',
    descLt: 'Standartinė 12 taktų I–IV–V bliuzo forma su svinguojančiu bosu.',
  },
  {
    page: 120,
    lesson: 'Lesson 28',
    titleEn: 'Blues Improvisation & Dominant 7th Voicings',
    titleLt: 'Bliuzo improvizacija ir dominantseptakordai (C7, F7, G7)',
    category: 'blues',
    descEn: 'Blue notes (♭3, ♭5, ♭7) with dominant 7th accompaniment.',
    descLt: 'Mėlynosios natos (♭3, ♭5, ♭7) ir dominantseptakordų išdėstymai.',
  },
  {
    page: 142,
    lesson: 'Lesson 35',
    titleEn: 'D Major Scale & How to Learn Any New Key',
    titleLt: 'D mažoro gama ir naujų tonacijų mokymosi metodika',
    category: 'scales',
    descEn: '2 sharps (F♯, C♯), circle of 5ths progression, and systematic practice.',
    descLt: '2 diezai (F♯, C♯), kvintų ratas ir sisteminga praktika.',
  },
  {
    page: 185,
    lesson: 'Lesson 42',
    titleEn: 'Modes & Extended Harmony (Dorian, Mixolydian, 9ths/11ths/13ths)',
    titleLt: 'Dermės ir išplėstinė harmonija (dorinė, miksolidinė, nonakordai 9/11/13)',
    category: 'advanced',
    descEn: 'Modal jazz improvisation, guide tones (3rd & 7th), and chord extensions.',
    descLt: 'Modalinis džiazas, kreipiančiosios natos (3 ir 7) bei akordų išplėtimai.',
  },
  {
    page: 208,
    lesson: 'Appendix',
    titleEn: 'Complete Keyboard Chord Dictionary & Inversions Chart',
    titleLt: 'Pilnas klavišinių akordų žinynas ir apvertimų lentelė',
    category: 'advanced',
    descEn: 'Quick reference reference for major, minor, 7th, augmented, and diminished chords.',
    descLt: 'Greita atmintinė visiems mažoro, minoro, septakordų ir kitiems akordams.',
  },
];

export function getPageImageUrl(pageNumber: number): string {
  const safePage = Math.max(1, Math.min(TOTAL_BOOK_PAGES, Math.floor(pageNumber) || 1));
  const pad = String(safePage).padStart(3, '0');
  const base = import.meta.env.BASE_URL || './';
  const prefix = base.endsWith('/') ? base : `${base}/`;
  return `${prefix}book_pages/page_${pad}.webp`;
}

export function findLandmarkForPage(page: number): BookLandmark | undefined {
  return BOOK_LANDMARKS.find((lm) => lm.page === page);
}

export function getNearestLandmark(page: number): BookLandmark {
  let closest = BOOK_LANDMARKS[0];
  for (const lm of BOOK_LANDMARKS) {
    if (lm.page <= page) {
      closest = lm;
    } else {
      break;
    }
  }
  return closest;
}
