import React, { useState } from 'react';
import { playChord, playNote } from '../domain/audio';
import { CHORD_QUALITIES } from '../domain/chords';
import { formatChordReadableName } from '../domain/i18n';
import { ALL_PITCH_CLASSES, NOTES, getRootNoteName, spellNoteForRoot } from '../domain/notes';
import { ChordQualityId, Language, PitchClass } from '../domain/types';

interface TheoryGuideProps {
  language: Language;
  onStartPractice: () => void;
}

const GUIDE_CONTENT = {
  en: {
    pageTitle: 'How Piano Chords Are Built',
    pageSubtitle:
      'Learn the simple counting rules behind every chord and how to spot the difference between Major and Minor in seconds.',
    backToPracticeBtn: '← Back to Practice',
    startPracticeCta: 'Ready? Practice Recognizing Chords →',

    // Section 1: Half steps
    sec1Badge: 'Step 1 · The Building Block',
    sec1Title: 'Half Steps (Semitones) on the Piano',
    sec1Lead:
      'Every chord on the piano is built by counting half steps (also called semitones). A half step is the shortest distance from any key to the very next key — whether white or black.',
    sec1TipTitle: 'How to count properly:',
    sec1Rules: [
      'Your starting note (the Root) is always 0.',
      'Count every single key to the right — both white and black keys.',
      'Never skip a black key when counting half steps!',
    ],

    // Section 2: Major vs Minor
    sec2Badge: 'Step 2 · The Golden Rule',
    sec2Title: 'How to Distinguish Major vs. Minor',
    sec2Lead:
      'Major and Minor triads have 3 notes: a Root (bottom), a 3rd (middle), and a 5th (top). Notice that their outer frame (Root and 5th) is 100% identical — always 7 half steps apart! Only the middle note changes by 1 key:',
    majorCardTitle: 'Major Triad (4 + 3)',
    majorCardMood: 'Bright · Happy · Stable',
    majorFormula: '0 (Root)  →  +4 half steps (Major 3rd)  →  +3 half steps (5th)',
    majorRule:
      'Bigger gap on the bottom (4 half steps), smaller gap on top (3 half steps).',
    hearMajorBtn: '🔊 Hear C Major (C – E – G)',

    minorCardTitle: 'Minor Triad (3 + 4)',
    minorCardMood: 'Warm · Emotional · Melancholic',
    minorFormula: '0 (Root)  →  +3 half steps (Minor 3rd)  →  +4 half steps (5th)',
    minorRule:
      'Smaller gap on the bottom (3 half steps), bigger gap on top (4 half steps). Lowering the middle note by 1 key turns any Major chord into Minor!',
    hearMinorBtn: '🔊 Hear C Minor (C – E♭ – G)',

    // Section 3: Interactive Laboratory
    sec3Badge: 'Step 3 · Interactive Chord Lab',
    sec3Title: 'Compare Any Major & Minor Chord Side-by-Side',
    sec3Lead:
      'Pick any root note and switch between chord types to see and hear exactly how the middle and top notes move on the piano.',
    pickRootLabel: '1. Choose Root Note:',
    pickQualityLabel: '2. Choose Chord Type:',
    playInteractiveBtn: '🔊 Play This Chord',
    semitoneCountLabel: 'Half steps from root:',
    noteNamesLabel: 'Notes:',

    // Section 4: All 4 Triads Table
    sec4Badge: 'Step 4 · Complete Reference',
    sec4Title: 'The 4 Triad Recipes & Seventh Chords',
    sec4Lead:
      'Once you know Major (4+3) and Minor (3+4), you can build Diminished and Augmented triads just by moving the top note (the 5th):',
    colChordType: 'Chord Type',
    colFormula: 'Half-Step Recipe',
    colFromRoot: 'Keys from Root',
    colExample: 'Example on C',
    colAction: 'Listen',
    triadRows: [
      {
        id: 'major' as ChordQualityId,
        name: 'Major Triad',
        symbol: 'C',
        recipe: '4 + 3',
        offsets: '0 – 4 – 7',
        notes: 'C – E – G',
        midis: [60, 64, 67],
        desc: 'Big step (4), then small step (3).',
      },
      {
        id: 'minor' as ChordQualityId,
        name: 'Minor Triad',
        symbol: 'Cm',
        recipe: '3 + 4',
        offsets: '0 – 3 – 7',
        notes: 'C – E♭ – G',
        midis: [60, 63, 67],
        desc: 'Small step (3), then big step (4).',
      },
      {
        id: 'diminished' as ChordQualityId,
        name: 'Diminished Triad',
        symbol: 'Cdim',
        recipe: '3 + 3',
        offsets: '0 – 3 – 6',
        notes: 'C – E♭ – G♭',
        midis: [60, 63, 66],
        desc: 'Two small steps (Minor with a lowered 5th). Tense sound.',
      },
      {
        id: 'augmented' as ChordQualityId,
        name: 'Augmented Triad',
        symbol: 'Caug',
        recipe: '4 + 4',
        offsets: '0 – 4 – 8',
        notes: 'C – E – G♯',
        midis: [60, 64, 68],
        desc: 'Two big steps (Major with a raised 5th). Dreamy sound.',
      },
    ],

    // Section 5: Visual Recognition Tips & Inversions
    sec5Badge: 'Step 5 · Visual Shortcuts',
    sec5Title: '3 Fast Tips for Recognizing Chords by Eye',
    tips: [
      {
        title: '1. Find the Root & Check the Outer Frame first',
        body: 'In Root Position, the leftmost highlighted key gives the chord its letter name (e.g. C, F, G). For Major and Minor, the outer two keys are always 7 half steps apart.',
      },
      {
        title: '2. Look at the Middle Note’s spacing',
        body: 'Is the middle note closer to the bottom note or the top note? If it is closer to the bottom note (3 half steps), it’s Minor. If it is closer to the top note (4 half steps from bottom), it’s Major.',
      },
      {
        title: '3. Spotting Inversions (Rearranged Notes)',
        body: 'In Root Position, keys are evenly spaced (skipping every other white key, like C–E–G). In an Inversion, two notes sit further apart (a 4th, 5 half steps) — the note right ABOVE that wider gap is always the true Root of the chord!',
      },
    ],
  },
  lt: {
    pageTitle: 'Kaip sudaromi fortepijono akordai',
    pageSubtitle:
      'Sužinokite paprastą pustonių skaičiavimo taisyklę ir išmokite per kelias sekundes atskirti mažorą nuo minoro.',
    backToPracticeBtn: '← Grįžti į praktiką',
    startPracticeCta: 'Pasiruošę? Pradėti akordų praktiką →',

    // Section 1: Half steps
    sec1Badge: '1 žingsnis · Pagrindinis matas',
    sec1Title: 'Pustoniai fortepijono klaviatūroje',
    sec1Lead:
      'Visi fortepijono akordai sudaromi skaičiuojant pustonius. Pustonis — tai mažiausias atstumas tarp dviejų gretimų klavišų (nesvarbu, baltų ar juodų).',
    sec1TipTitle: 'Kaip teisingai skaičiuoti pustonius:',
    sec1Rules: [
      'Pradinė nata (pagrindinis garsas / prima) visada yra 0.',
      'Skaičiuokite kiekvieną gretimą klavišą į dešinę — tiek baltus, tiek juodus.',
      'Skaičiuodami niekada nepraleiskite juodų klavišų!',
    ],

    // Section 2: Major vs Minor
    sec2Badge: '2 žingsnis · Auksinė taisyklė',
    sec2Title: 'Kaip atskirti mažorą nuo minoro?',
    sec2Lead:
      'Mažorinis ir minorinis trigarsiai turi 3 natas: pagrindinį garsą (primą apačioje), terciją (viduryje) ir kvintą (viršuje). Jų kraštinės natos (prima ir kvinta) yra visiškai vienodos — visada per 7 pustonius! Skiriasi tik vidurinė nata (per 1 klavišą):',
    majorCardTitle: 'Mažorinis trigarsis (4 + 3)',
    majorCardMood: 'Šviesus · Džiugus · Tvirtas',
    majorFormula: '0 (Prima)  →  +4 pustoniai (Didžioji tercija)  →  +3 pustoniai (Kvinta)',
    majorRule:
      'Didesnis tarpas apačioje (4 pustoniai), mažesnis tarpas viršuje (3 pustoniai).',
    hearMajorBtn: '🔊 Klausyti C mažoro (C – E – G)',

    minorCardTitle: 'Minorinis trigarsis (3 + 4)',
    minorCardMood: 'Šiltas · Jausmingas · Melancholiškas',
    minorFormula: '0 (Prima)  →  +3 pustoniai (Mažoji tercija)  →  +4 pustoniai (Kvinta)',
    minorRule:
      'Mažesnis tarpas apačioje (3 pustoniai), didesnis tarpas viršuje (4 pustoniai). Pažeminus bet kurio mažoro vidurinę natą 1 klavišu į kairę, gaunamas minoras!',
    hearMinorBtn: '🔊 Klausyti C minoro (C – E♭ – G)',

    // Section 3: Interactive Laboratory
    sec3Badge: '3 žingsnis · Interaktyvi akordų laboratorija',
    sec3Title: 'Palyginkite bet kurį mažoro ir minoro akordą',
    sec3Lead:
      'Pasirinkite bet kurią pradinę natą ir akordo tipą — pamatysite ir išgirsite, kaip klaviatūroje pasislenka vidurinė ir viršutinė natos.',
    pickRootLabel: '1. Pasirinkite pagrindinę natą:',
    pickQualityLabel: '2. Pasirinkite akordo tipą:',
    playInteractiveBtn: '🔊 Pagroti šį akordą',
    semitoneCountLabel: 'Pustoniai nuo pagrindinio garso:',
    noteNamesLabel: 'Natos:',

    // Section 4: All 4 Triads Table
    sec4Badge: '4 žingsnis · Atmintinė',
    sec4Title: 'Visų 4 trigarsių formulės',
    sec4Lead:
      'Kai jau mokate mažorą (4+3) ir minorą (3+4), sumažintą ir padidintą trigarsius sudarysite tiesiog pakeitę viršutinę natą (kvintą):',
    colChordType: 'Akordo tipas',
    colFormula: 'Pustonių formulė',
    colFromRoot: 'Klavišai nuo primos',
    colExample: 'Pavyzdys nuo C',
    colAction: 'Klausyti',
    triadRows: [
      {
        id: 'major' as ChordQualityId,
        name: 'Mažorinis trigarsis',
        symbol: 'C',
        recipe: '4 + 3',
        offsets: '0 – 4 – 7',
        notes: 'C – E – G',
        midis: [60, 64, 67],
        desc: 'Didelis žingsnis (4), tada mažas žingsnis (3).',
      },
      {
        id: 'minor' as ChordQualityId,
        name: 'Minorinis trigarsis',
        symbol: 'Cm',
        recipe: '3 + 4',
        offsets: '0 – 3 – 7',
        notes: 'C – E♭ – G',
        midis: [60, 63, 67],
        desc: 'Mažas žingsnis (3), tada didelis žingsnis (4).',
      },
      {
        id: 'diminished' as ChordQualityId,
        name: 'Sumažintas trigarsis',
        symbol: 'Cdim',
        recipe: '3 + 3',
        offsets: '0 – 3 – 6',
        notes: 'C – E♭ – G♭',
        midis: [60, 63, 66],
        desc: 'Du maži žingsniai (minoras su pažeminta kvinta). Įtemptas skambesys.',
      },
      {
        id: 'augmented' as ChordQualityId,
        name: 'Padidintas trigarsis',
        symbol: 'Caug',
        recipe: '4 + 4',
        offsets: '0 – 4 – 8',
        notes: 'C – E – G♯',
        midis: [60, 64, 68],
        desc: 'Du dideli žingsniai (mažoras su paaukštinta kvinta). Svajingas skambesys.',
      },
    ],

    // Section 5: Visual Recognition Tips & Inversions
    sec5Badge: '5 žingsnis · Vizualūs patarimai',
    sec5Title: '3 greiti patarimai, kaip atpažinti akordą akimis',
    tips: [
      {
        title: '1. Pirmiausia suraskite pagrindinį garsą (primą)',
        body: 'Pagrindinėje padėtyje kairiausias pažymėtas klavišas nusako akordo raidę (pvz., C, F, G). Mažore ir minore kraštiniai klavišai visada nutolę per 7 pustonius.',
      },
      {
        title: '2. Pažiūrėkite, kuriai pusei arčiau yra vidurinė nata',
        body: 'Ar vidurinė nata arčiau apatinės, ar viršutinės natos? Jei arčiau apatinės (3 pustoniai) — tai minoras. Jei arčiau viršutinės (4 pustoniai nuo apačios) — tai mažoras.',
      },
      {
        title: '3. Kaip atpažinti apvertimus (sukeistas natas)',
        body: 'Pagrindinėje padėtyje natos išsidėsčiusios tolygiai (kas antrą laipsnį, pvz., C–E–G). Apvertime tarp dviejų natų atsiranda platesnis tarpas (kvarta — 5 pustoniai): nata, esanti IŠ KARTO VIRŠ to platesnio tarpo, visada yra tikrasis akordo pagrindinis garsas!',
      },
    ],
  },
};

const LAB_QUALITIES: ChordQualityId[] = [
  'major',
  'minor',
  'diminished',
  'augmented',
  'major7',
  'dominant7',
  'minor7',
];

// 13-key mini octave keyboard from C to C for the interactive diagram
const MINI_OCTAVE_KEYS = Array.from({ length: 20 }, (_, idx) => {
  const pitchClass = (idx % 12) as PitchClass;
  const info = NOTES[pitchClass];
  return {
    offset: idx,
    midi: 60 + idx,
    pitchClass,
    isBlack: info.isBlack,
    label: getRootNoteName(pitchClass),
  };
});

const MINI_WHITE_KEYS = MINI_OCTAVE_KEYS.filter((k) => !k.isBlack);

function getMiniBlackLeftPercent(offset: number): number {
  const whiteBefore = MINI_WHITE_KEYS.filter((wk) => wk.offset < offset).length;
  return (whiteBefore * 100) / MINI_WHITE_KEYS.length;
}

export const TheoryGuide: React.FC<TheoryGuideProps> = ({ language, onStartPractice }) => {
  const g = GUIDE_CONTENT[language];
  const [labRoot, setLabRoot] = useState<PitchClass>(0); // C
  const [labQuality, setLabQuality] = useState<ChordQualityId>('major');

  const activeQualityDef = CHORD_QUALITIES[labQuality];
  const activeOffsets = activeQualityDef.intervals.map((semitones) => labRoot + semitones);
  const activeMidis = activeOffsets.map((offset) => 60 + offset);
  const activeSpelledNotes = activeQualityDef.intervals.map((semitones) =>
    spellNoteForRoot(((labRoot + semitones) % 12) as PitchClass, labRoot)
  );
  const activeReadableName = formatChordReadableName(labRoot, labQuality, language);
  const activeSymbol = `${getRootNoteName(labRoot)}${activeQualityDef.symbolSuffix}`;

  const handleSelectLabRoot = (root: PitchClass) => {
    setLabRoot(root);
    const midis = CHORD_QUALITIES[labQuality].intervals.map((s) => 60 + root + s);
    playChord(midis);
  };

  const handleSelectLabQuality = (qId: ChordQualityId) => {
    setLabQuality(qId);
    const midis = CHORD_QUALITIES[qId].intervals.map((s) => 60 + labRoot + s);
    playChord(midis);
  };

  return (
    <article className="theory-guide" aria-labelledby="guide-main-title">
      <div className="guide-hero">
        <div className="guide-hero-top">
          <button type="button" className="back-practice-btn" onClick={onStartPractice}>
            {g.backToPracticeBtn}
          </button>
        </div>
        <h2 id="guide-main-title" className="guide-title">
          {g.pageTitle}
        </h2>
        <p className="guide-subtitle">{g.pageSubtitle}</p>
      </div>

      {/* Section 1: Half Steps */}
      <section className="guide-card">
        <span className="guide-step-badge">{g.sec1Badge}</span>
        <h3 className="guide-section-title">{g.sec1Title}</h3>
        <p className="guide-text">{g.sec1Lead}</p>

        <div className="guide-rules-box">
          <strong className="guide-rules-heading">{g.sec1TipTitle}</strong>
          <ul className="guide-rules-list">
            {g.sec1Rules.map((rule, i) => (
              <li key={i}>{rule}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Section 2: Major vs Minor Comparison */}
      <section className="guide-card">
        <span className="guide-step-badge">{g.sec2Badge}</span>
        <h3 className="guide-section-title">{g.sec2Title}</h3>
        <p className="guide-text">{g.sec2Lead}</p>

        <div className="comparison-grid">
          {/* Major Card */}
          <div className="comparison-box comparison-box--major">
            <div className="comparison-header">
              <h4>{g.majorCardTitle}</h4>
              <span className="mood-pill">{g.majorCardMood}</span>
            </div>

            {/* Visual Step Diagram: 0 --(+4)--> 4 --(+3)--> 7 */}
            <div className="step-diagram" aria-hidden="true">
              <div className="step-node step-node--root">
                <span className="node-note">C</span>
                <span className="node-num">0</span>
              </div>
              <div className="step-bridge step-bridge--wide">
                <span>+4</span>
              </div>
              <div className="step-node step-node--third-maj">
                <span className="node-note">E</span>
                <span className="node-num">4</span>
              </div>
              <div className="step-bridge step-bridge--narrow">
                <span>+3</span>
              </div>
              <div className="step-node step-node--fifth">
                <span className="node-note">G</span>
                <span className="node-num">7</span>
              </div>
            </div>

            <p className="comparison-formula">{g.majorFormula}</p>
            <p className="comparison-rule">{g.majorRule}</p>
            <button
              type="button"
              className="guide-audio-btn"
              onClick={() => playChord([60, 64, 67])}
            >
              {g.hearMajorBtn}
            </button>
          </div>

          {/* Minor Card */}
          <div className="comparison-box comparison-box--minor">
            <div className="comparison-header">
              <h4>{g.minorCardTitle}</h4>
              <span className="mood-pill">{g.minorCardMood}</span>
            </div>

            {/* Visual Step Diagram: 0 --(+3)--> 3 --(+4)--> 7 */}
            <div className="step-diagram" aria-hidden="true">
              <div className="step-node step-node--root">
                <span className="node-note">C</span>
                <span className="node-num">0</span>
              </div>
              <div className="step-bridge step-bridge--narrow">
                <span>+3</span>
              </div>
              <div className="step-node step-node--third-min">
                <span className="node-note">E♭</span>
                <span className="node-num">3</span>
              </div>
              <div className="step-bridge step-bridge--wide">
                <span>+4</span>
              </div>
              <div className="step-node step-node--fifth">
                <span className="node-note">G</span>
                <span className="node-num">7</span>
              </div>
            </div>

            <p className="comparison-formula">{g.minorFormula}</p>
            <p className="comparison-rule">{g.minorRule}</p>
            <button
              type="button"
              className="guide-audio-btn"
              onClick={() => playChord([60, 63, 67])}
            >
              {g.hearMinorBtn}
            </button>
          </div>
        </div>
      </section>

      {/* Section 3: Interactive Chord Lab */}
      <section className="guide-card">
        <span className="guide-step-badge">{g.sec3Badge}</span>
        <h3 className="guide-section-title">{g.sec3Title}</h3>
        <p className="guide-text">{g.sec3Lead}</p>

        <div className="lab-controls">
          <div className="lab-control-group">
            <span className="lab-label">{g.pickRootLabel}</span>
            <div className="lab-root-pills">
              {ALL_PITCH_CLASSES.map((pc) => (
                <button
                  key={pc}
                  type="button"
                  onClick={() => handleSelectLabRoot(pc)}
                  className={`lab-pill ${labRoot === pc ? 'lab-pill--active' : ''}`}
                >
                  {getRootNoteName(pc)}
                </button>
              ))}
            </div>
          </div>

          <div className="lab-control-group">
            <span className="lab-label">{g.pickQualityLabel}</span>
            <div className="lab-quality-pills">
              {LAB_QUALITIES.map((qId) => {
                const label = formatChordReadableName(labRoot, qId, language);
                return (
                  <button
                    key={qId}
                    type="button"
                    onClick={() => handleSelectLabQuality(qId)}
                    className={`lab-pill ${labQuality === qId ? 'lab-pill--active' : ''}`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Interactive Mini Piano Diagram */}
        <div className="lab-result-bar">
          <div className="lab-chord-summary">
            <strong className="lab-chord-title">
              {activeReadableName} <span className="lab-symbol">({activeSymbol})</span>
            </strong>
            <span className="lab-meta">
              {g.noteNamesLabel} <strong>{activeSpelledNotes.join(' – ')}</strong> ·{' '}
              {g.semitoneCountLabel}{' '}
              <strong>{activeQualityDef.intervals.map((i) => `+${i}`).join(', ')}</strong>
            </span>
          </div>

          <button
            type="button"
            className="listen-btn"
            onClick={() => playChord(activeMidis)}
          >
            {g.playInteractiveBtn}
          </button>
        </div>

        <div className="mini-piano-wrapper">
          <div className="mini-piano-bed">
            <div
              className="mini-white-row"
              style={{ gridTemplateColumns: `repeat(${MINI_WHITE_KEYS.length}, 1fr)` }}
            >
              {MINI_WHITE_KEYS.map((key) => {
                const intervalIdx = activeOffsets.indexOf(key.offset);
                const isHighlighted = intervalIdx !== -1;
                const isRoot = intervalIdx === 0;
                const semitoneFromRoot = key.offset - labRoot;

                return (
                  <button
                    key={key.offset}
                    type="button"
                    onClick={() => playNote(key.midi)}
                    className={`piano-key piano-key--white ${
                      isHighlighted ? 'piano-key--highlighted' : ''
                    } ${isRoot ? 'piano-key--bass' : ''}`}
                  >
                    <span className="key-inner">
                      {isHighlighted && (
                        <span className={`key-marker ${isRoot ? 'key-marker--bass' : ''}`}>
                          +{semitoneFromRoot}
                        </span>
                      )}
                      <span
                        className={`key-label ${isHighlighted ? 'key-label--highlighted' : ''}`}
                      >
                        {isHighlighted ? activeSpelledNotes[intervalIdx] : key.label}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="black-keys-layer">
              {MINI_OCTAVE_KEYS.filter((k) => k.isBlack).map((key) => {
                const intervalIdx = activeOffsets.indexOf(key.offset);
                const isHighlighted = intervalIdx !== -1;
                const isRoot = intervalIdx === 0;
                const semitoneFromRoot = key.offset - labRoot;
                const leftPct = getMiniBlackLeftPercent(key.offset);

                return (
                  <button
                    key={key.offset}
                    type="button"
                    style={{ left: `${leftPct}%`, width: '5.5%' }}
                    onClick={() => playNote(key.midi)}
                    className={`piano-key piano-key--black ${
                      isHighlighted ? 'piano-key--highlighted' : ''
                    } ${isRoot ? 'piano-key--bass' : ''}`}
                  >
                    <span className="key-inner">
                      {isHighlighted && (
                        <span className={`key-marker ${isRoot ? 'key-marker--bass' : ''}`}>
                          +{semitoneFromRoot}
                        </span>
                      )}
                      {isHighlighted && (
                        <span className="key-label key-label--highlighted">
                          {activeSpelledNotes[intervalIdx]}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Reference Table */}
      <section className="guide-card">
        <span className="guide-step-badge">{g.sec4Badge}</span>
        <h3 className="guide-section-title">{g.sec4Title}</h3>
        <p className="guide-text">{g.sec4Lead}</p>

        <div className="table-scroll">
          <table className="guide-table">
            <thead>
              <tr>
                <th>{g.colChordType}</th>
                <th>{g.colFormula}</th>
                <th>{g.colFromRoot}</th>
                <th>{g.colExample}</th>
                <th>{g.colAction}</th>
              </tr>
            </thead>
            <tbody>
              {g.triadRows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <strong>{row.name}</strong>
                    <div className="table-sub-desc">{row.desc}</div>
                  </td>
                  <td>
                    <span className="formula-pill">{row.recipe}</span>
                  </td>
                  <td>
                    <code>{row.offsets}</code>
                  </td>
                  <td>
                    <strong>{row.symbol}</strong> ({row.notes})
                  </td>
                  <td>
                    <button
                      type="button"
                      className="table-play-btn"
                      onClick={() => playChord(row.midis)}
                    >
                      🔊
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 5: Visual Tips */}
      <section className="guide-card">
        <span className="guide-step-badge">{g.sec5Badge}</span>
        <h3 className="guide-section-title">{g.sec5Title}</h3>
        <div className="tips-grid">
          {g.tips.map((tip, i) => (
            <div key={i} className="tip-item">
              <h4 className="tip-title">{tip.title}</h4>
              <p className="tip-body">{tip.body}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="guide-bottom-cta">
        <button type="button" className="next-card-btn" onClick={onStartPractice}>
          {g.startPracticeCta}
        </button>
      </div>
    </article>
  );
};
