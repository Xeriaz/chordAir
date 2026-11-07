import React, { useCallback, useEffect, useRef, useState } from 'react';
import { playMetronomeTick, playNoteAttackTone } from '../domain/rhythmAudio';
import {
  BaseUnit,
  NOTE_DEFINITIONS,
  NoteType,
  PRESET_SCENARIOS,
  RhythmicScenario,
  SubdivisionSpan,
  calculateSubdivisionUnits,
  formatMeasureDisplay,
  formatSpanCount,
  getNoteUnits,
} from '../domain/subdivisionEngine';
import { Language } from '../domain/types';

interface SubdivisionGuideProps {
  language: Language;
  onToggleLanguage: () => void;
  onBackToPractice: () => void;
  onOpenChordsGuide?: () => void;
}

const TERMINOLOGY_ITEMS = [
  {
    termEn: 'Subdivision / Subdivided Counting',
    termLt: 'Pulso smulkinimas / Smulkinamasis skaičiavimas',
    descEn:
      'The practice of dividing beats into their smallest recurring rhythmic denomination, treating each as 1 integer unit.',
    descLt:
      'Muzikinio takto pulso skaidymo metodas į smulkiausias pasikartojančias dalis, kiekvienai priskiriant 1 vienetą.',
  },
  {
    termEn: 'Smallest Common Denominator / Base Unit',
    termLt: 'Mažiausias bendras vardiklis / Bazinė vertė',
    descEn:
      'The shortest note denomination in a passage (e.g. 8th or 16th note) chosen as the single tick reference (1 unit).',
    descLt:
      'Smulkiausia kūrinyje pasitaikanti nata (pvz., aštuntinė ar šešioliktinė), kuriai priskiriama 1 vieneto reikšmė.',
  },
  {
    termEn: 'Whole note (4/4)',
    termLt: 'Sveikoji nata',
    descEn: 'Lasts 4 full beats. Equals 8 units in an 8th-note base, or 16 units in a 16th-note base.',
    descLt: 'Trunka 4 pilnas takto dalis. Atitinka 8 vienetus aštuntinių sistemoje arba 16 vienetų šešioliktinių sistemoje.',
  },
  {
    termEn: 'Half note (2/4)',
    termLt: 'Pusinė nata',
    descEn: 'Lasts 2 beats. Equals 4 units in an 8th-note base, or 8 units in a 16th-note base.',
    descLt: 'Trunka 2 takto dalis. Atitinka 4 vienetus aštuntinėse arba 8 vienetus šešioliktinėse.',
  },
  {
    termEn: 'Quarter note (1/4)',
    termLt: 'Ketvirtinė nata',
    descEn: 'The primary beat unit in 4/4 time. Equals 2 units in an 8th-note base, or 4 units in a 16th-note base.',
    descLt: 'Pagrindinė 4/4 takto dalis. Atitinka 2 vienetus aštuntinėse arba 4 vienetus šešioliktinėse.',
  },
  {
    termEn: 'Eighth note (1/8)',
    termLt: 'Aštuntinė nata',
    descEn: 'Half of a quarter note (0.5 beat). Equals 1 unit in an 8th-note base, or 2 units in a 16th-note base.',
    descLt: 'Pusė ketvirtinės (0,5 dalies). Yra 1 vienetas aštuntinėse arba 2 vienetai šešioliktinėse.',
  },
  {
    termEn: 'Sixteenth note (1/16)',
    termLt: 'Šešioliktinė nata',
    descEn: 'One-quarter of a beat. Equals 1 unit when the subdivision base is set to sixteenth notes.',
    descLt: 'Ketvirtis dalies (0,25). Prilyginama 1 vienetui, kai bazinė vertė yra šešioliktinė.',
  },
  {
    termEn: 'Dotted notes (Dotted quarter, Dotted half)',
    termLt: 'Punktuotos natos (Punktuota ketvirtinė, Punktuota pusinė)',
    descEn:
      'The dot adds half of the note value. Dotted quarter = 1.5 beats (3 eighths). Dotted half = 3 beats (6 eighths).',
    descLt:
      'Taškas prideda pusę natos vertės. Punktuota ketvirtinė = 1,5 dalies (3 aštuntinės). Punktuota pusinė = 3 dalys (6 aštuntinės).',
  },
  {
    termEn: 'Ties & Rests',
    termLt: 'Lyga (sujungtos natos) ir Pauzės',
    descEn:
      'Ties sustain sound across ticks without re-striking. Rests are discrete silent ticks that must be counted with exact precision.',
    descLt:
      'Lyga sujungia skambesį be naujo smūgio. Pauzės – tikslūs tylos vienetai, kuriuos privaloma tiksliai suskaičiuoti.',
  },
  {
    termEn: 'Metronome subdivision pulse',
    termLt: 'Metronomo smulkinamasis pulsas',
    descEn:
      'Clicking at the subdivision speed (e.g. 8th or 16th ticks) so every unit has a physical auditory landmark.',
    descLt:
      'Taksėjimas smulkiausiu pulsu (aštuntinėmis ar šešioliktinėmis), suteikiantis fizinį garsinį atskaitos tašką kiekvienam vienetui.',
  },
];

export const SubdivisionGuide: React.FC<SubdivisionGuideProps> = ({
  language,
  onToggleLanguage,
  onBackToPractice,
  onOpenChordsGuide,
}) => {
  const isLt = language === 'lt';

  // Active scenario or custom note list
  const [activeScenarioId, setActiveScenarioId] = useState<string>('scenario-1-8th');
  const [baseUnit, setBaseUnit] = useState<BaseUnit>('8th');
  const [measureNotes, setMeasureNotes] = useState<NoteType[]>(PRESET_SCENARIOS[0].notes);

  // Metronome & playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [bpm, setBpm] = useState<number>(72);
  const [currentTick, setCurrentTick] = useState<number>(1);
  const [soundMode, setSoundMode] = useState<'click' | 'pitch' | 'mute'>('click');

  const playbackTimerRef = useRef<number | null>(null);

  // Derived subdivision calculations
  const spans: SubdivisionSpan[] = calculateSubdivisionUnits(measureNotes, baseUnit);
  const targetTotalUnits = baseUnit === '8th' ? 8 : 16;
  const currentTotalUnits = spans.reduce((sum, s) => sum + s.units, 0);

  // Find currently sounding note based on currentTick
  const activeSpan = spans.find(
    (s) => currentTick >= s.span[0] && currentTick <= s.span[1]
  );

  // Play audio tick for a given tick index
  const triggerTickAudio = useCallback(
    (tick: number) => {
      if (soundMode === 'mute') return;

      const isDownbeat = tick === 1;
      const ticksPerBeat = baseUnit === '8th' ? 2 : 4;
      const isMainBeat = (tick - 1) % ticksPerBeat === 0;

      // Check if this tick is the attack (start) of a note
      const noteAtTick = spans.find((s) => s.span[0] === tick);

      if (soundMode === 'pitch' && noteAtTick) {
        // Melodic attack tone + light click
        playNoteAttackTone(60, 0.18);
        playMetronomeTick('subtick');
      } else {
        const tickType = isDownbeat ? 'downbeat' : isMainBeat ? 'mainbeat' : 'subtick';
        playMetronomeTick(tickType);
      }
    },
    [baseUnit, soundMode, spans]
  );

  // Handle switching scenario preset
  const handleSelectScenario = (scenario: RhythmicScenario) => {
    setActiveScenarioId(scenario.id);
    setBaseUnit(scenario.baseUnit);
    setMeasureNotes(scenario.notes);
    setCurrentTick(1);
    setIsPlaying(false);
  };

  // Add / remove notes in custom mode
  const handleAddNote = (note: NoteType) => {
    setActiveScenarioId('custom');
    setMeasureNotes((prev) => [...prev, note]);
  };

  const handleRemoveLastNote = () => {
    setActiveScenarioId('custom');
    setMeasureNotes((prev) => prev.slice(0, -1));
  };

  const handleClearNotes = () => {
    setActiveScenarioId('custom');
    setMeasureNotes([]);
    setCurrentTick(1);
    setIsPlaying(false);
  };

  // Switch base unit manually
  const handleSwitchBaseUnit = (newBase: BaseUnit) => {
    setBaseUnit(newBase);
    setCurrentTick(1);
    setIsPlaying(false);
  };

  // Playback loop
  useEffect(() => {
    if (!isPlaying) {
      if (playbackTimerRef.current !== null) {
        window.clearInterval(playbackTimerRef.current);
        playbackTimerRef.current = null;
      }
      return;
    }

    // BPM is quarter note beats per minute.
    // Base unit '8th' means 2 ticks per beat.
    // Base unit '16th' means 4 ticks per beat.
    const ticksPerBeat = baseUnit === '8th' ? 2 : 4;
    const ticksPerMinute = bpm * ticksPerBeat;
    const tickIntervalMs = (60 / ticksPerMinute) * 1000;

    // Trigger initial tick immediately
    triggerTickAudio(currentTick);

    playbackTimerRef.current = window.setInterval(() => {
      setCurrentTick((prev) => {
        const maxTicks = Math.max(targetTotalUnits, currentTotalUnits || targetTotalUnits);
        const next = prev >= maxTicks ? 1 : prev + 1;
        triggerTickAudio(next);
        return next;
      });
    }, tickIntervalMs);

    return () => {
      if (playbackTimerRef.current !== null) {
        window.clearInterval(playbackTimerRef.current);
        playbackTimerRef.current = null;
      }
    };
  }, [isPlaying, bpm, baseUnit, targetTotalUnits, currentTotalUnits, triggerTickAudio, currentTick]);

  // Step controls
  const handleStepForward = () => {
    setIsPlaying(false);
    const maxTicks = Math.max(targetTotalUnits, currentTotalUnits || targetTotalUnits);
    const next = currentTick >= maxTicks ? 1 : currentTick + 1;
    setCurrentTick(next);
    triggerTickAudio(next);
  };

  const handleStepBackward = () => {
    setIsPlaying(false);
    const maxTicks = Math.max(targetTotalUnits, currentTotalUnits || targetTotalUnits);
    const prev = currentTick <= 1 ? maxTicks : currentTick - 1;
    setCurrentTick(prev);
    triggerTickAudio(prev);
  };

  const handleResetPlayback = () => {
    setIsPlaying(false);
    setCurrentTick(1);
  };

  return (
    <article className="theory-guide-container subdivision-guide" aria-labelledby="subdivision-title">
      {/* Top Banner Navigation & Language Switcher */}
      <div className="theory-nav-bar">
        <button
          type="button"
          className="back-practice-btn"
          onClick={onBackToPractice}
          aria-label={isLt ? 'Grįžti į akordų treniruotę' : 'Back to chord practice'}
        >
          {isLt ? '← Grįžti į akordų treniruotę' : '← Back to Chord Practice'}
        </button>

        <button
          type="button"
          className="icon-btn lang-toggle-btn"
          onClick={onToggleLanguage}
          aria-label={isLt ? 'Switch language to English' : 'Perjungti kalbą į lietuvių'}
        >
          <span className={!isLt ? 'lang-code--active' : 'lang-code--inactive'}>EN</span>
          <span className="lang-divider" aria-hidden="true">
            /
          </span>
          <span className={isLt ? 'lang-code--active' : 'lang-code--inactive'}>LT</span>
        </button>
      </div>

      {/* Hero Header */}
      <header className="theory-header">
        <div className="section-badge">
          {isLt ? '⏱️ Ritmo technika · Pulso smulkinimas' : '⏱️ Rhythm Technique · Subdivision'}
        </div>
        <h1 id="subdivision-title" className="theory-title">
          {isLt
            ? 'Pulso Smulkinimas ir Ritmo Skaičiavimo Variklis'
            : 'Subdivided Counting Engine & Practice Guide'}
        </h1>
        <p className="theory-subtitle">
          {isLt
            ? 'Atsikratykite ritmo spėliojimo ir netikslumų. Paverskite kiekvieną takto natą tikslia sveikųjų skaičių aritmetika!'
            : 'Eliminate rhythmic guesswork and drift. Convert every musical duration into clean discrete integer multiples of a steady base pulse.'}
        </p>
      </header>

      {/* 1. Educational Explainer Copy */}
      <section className="theory-card" aria-labelledby="what-is-subdivision-heading">
        <div className="card-badge">
          {isLt ? '1 Dalis · Teorinis Pagrindas' : 'Part 1 · The Core Concept'}
        </div>
        <h2 id="what-is-subdivision-heading" className="card-title">
          {isLt ? 'Kas yra pulso smulkinimas?' : 'What is Subdivision?'}
        </h2>

        {isLt ? (
          <div className="explainer-prose">
            <p className="lead-paragraph">
              <strong>Pulso smulkinimas</strong> (angl. <em>subdivision</em>) – tai muzikinio ritmo skaidymo
              metodas, kai takto pulsas padalijamas į smulkiausias kūrinyje pasitaikančias natų vertes.
              Užuot apytiksliai taikius trumpesnes natas ar sinkopes, mažiausiai natai (dažniausiai
              aštuntinei arba šešioliktinei) priskiriama <code>1 vieneto</code> reikšmė. Visos ilgesnės
              natos ir pauzės tampa sveikaisiais šio vieneto kartotiniais.
            </p>
            <div className="key-rule-callout">
              <h3 className="rule-title">Kodėl tai veikia:</h3>
              <p>
                Šis metodas pašalina ritmo svyravimus ir paverčia trupmenines muzikos trukmes paprasta
                sveikųjų skaičių aritmetika. Įtvirtinus tikslias trukmių proporcijas raumenų atmintyje,
                palaipsniui grįžtama prie įprasto ketvirtinių pulso jautimo.
              </p>
            </div>
          </div>
        ) : (
          <div className="explainer-prose">
            <p className="lead-paragraph">
              <strong>Subdivision</strong> is the practice of breaking down musical beats into their
              smallest recurring rhythmic denomination. Instead of guessing the placement of short
              notes or off-beat syncopations, you define the smallest note (such as an 8th note or 16th
              note) as <code>1 unit</code>. Every longer note becomes a clean integer multiple of that unit.
            </p>
            <div className="key-rule-callout">
              <h3 className="rule-title">Why it works:</h3>
              <p>
                It eliminates rhythmic drift and replaces abstract fractions with concrete integers.
                Once muscle memory locks in the exact note lengths, you gradually transition back to
                feeling standard quarter-note pulses.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* 2. Interactive Measure Visualizer & Engine */}
      <section className="theory-card interactive-visualizer-section" aria-labelledby="visualizer-heading">
        <div className="card-badge">
          {isLt ? '2 Dalis · Interaktyvus Ritmo Treniruoklis' : 'Part 2 · Interactive Rhythmic Engine'}
        </div>
        <h2 id="visualizer-heading" className="card-title">
          {isLt
            ? 'Takto Vizualizatorius ir Taksintis Metronomas'
            : 'Measure Visualizer & Subdivided Metronome'}
        </h2>
        <p className="section-description">
          {isLt
            ? 'Pasirinkite kurį nors iš paruoštų scenarijų arba sukurkite savo takto natas. Stebėkite, kaip kiekvienas metronomo dūžis atitinka tikslią natos atkarpą.'
            : 'Select one of the curriculum scenarios or build your own custom measure. Watch each subdivision tick highlight the exact integer unit.'}
        </p>

        {/* Preset scenario selection */}
        <div className="scenario-selector-group">
          <label className="picker-label">
            {isLt ? 'Scenarijai ir Pavyzdžiai:' : 'Scenarios & Presets:'}
          </label>
          <div className="scenario-buttons-row">
            {PRESET_SCENARIOS.map((scenario) => (
              <button
                key={scenario.id}
                type="button"
                className={`scenario-btn ${activeScenarioId === scenario.id ? 'scenario-btn--active' : ''}`}
                onClick={() => handleSelectScenario(scenario)}
              >
                <span className="scenario-btn-title">
                  {isLt ? scenario.titleLt : scenario.titleEn}
                </span>
                <span className="scenario-btn-badge">
                  {scenario.baseUnit === '8th'
                    ? isLt
                      ? '1 vnt = Aštuntinė (8 vnt)'
                      : '1 unit = 8th (8 units)'
                    : isLt
                    ? '1 vnt = Šešioliktinė (16 vnt)'
                    : '1 unit = 16th (16 units)'}
                </span>
              </button>
            ))}
            <button
              type="button"
              className={`scenario-btn ${activeScenarioId === 'custom' ? 'scenario-btn--active' : ''}`}
              onClick={() => setActiveScenarioId('custom')}
            >
              <span className="scenario-btn-title">
                {isLt ? '✏️ Pasirinktinis Taktas' : '✏️ Custom Builder'}
              </span>
              <span className="scenario-btn-badge">
                {isLt ? 'Kurkite savo ritmą' : 'Add custom notes'}
              </span>
            </button>
          </div>
        </div>

        {/* Base Unit Selector */}
        <div className="base-unit-selector-bar">
          <span className="picker-label">
            {isLt ? 'Bazinė vertė (1 vienetas):' : 'Smallest Denomination (Base Unit = 1):'}
          </span>
          <div className="base-toggle-pills" role="radiogroup" aria-label="Base unit selector">
            <button
              type="button"
              role="radio"
              aria-checked={baseUnit === '8th'}
              className={`pill-btn ${baseUnit === '8th' ? 'pill-btn--active' : ''}`}
              onClick={() => handleSwitchBaseUnit('8th')}
            >
              ♪ {isLt ? 'Aštuntinė (8 vnt / 4/4 takte)' : '8th Note Base (8 units / 4/4)'}
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={baseUnit === '16th'}
              className={`pill-btn ${baseUnit === '16th' ? 'pill-btn--active' : ''}`}
              onClick={() => handleSwitchBaseUnit('16th')}
            >
              𝅘𝅥𝅯 {isLt ? 'Šešioliktinė (16 vnt / 4/4 takte)' : '16th Note Base (16 units / 4/4)'}
            </button>
          </div>
        </div>

        {/* Custom Builder Note Picker if Custom is active */}
        {activeScenarioId === 'custom' && (
          <div className="custom-builder-toolbar">
            <div className="builder-notes-label">
              {isLt ? 'Pridėti natą į taktą:' : 'Add note to measure:'}
            </div>
            <div className="note-adder-buttons">
              <button
                type="button"
                className="add-note-chip"
                onClick={() => handleAddNote('16th')}
                title="Sixteenth note"
              >
                𝅘𝅥𝅯 {isLt ? '16-tinė' : '16th'} ({getNoteUnits('16th', baseUnit)} vnt)
              </button>
              <button
                type="button"
                className="add-note-chip"
                onClick={() => handleAddNote('8th')}
                title="Eighth note"
              >
                ♪ {isLt ? 'Aštuntinė' : '8th'} ({getNoteUnits('8th', baseUnit)} vnt)
              </button>
              <button
                type="button"
                className="add-note-chip"
                onClick={() => handleAddNote('dotted-8th')}
                title="Dotted eighth note"
              >
                ♪. {isLt ? 'Punkt. ašt.' : 'Dot 8th'} ({getNoteUnits('dotted-8th', baseUnit)} vnt)
              </button>
              <button
                type="button"
                className="add-note-chip"
                onClick={() => handleAddNote('quarter')}
                title="Quarter note"
              >
                ♩ {isLt ? 'Ketvirtinė' : 'Quarter'} ({getNoteUnits('quarter', baseUnit)} vnt)
              </button>
              <button
                type="button"
                className="add-note-chip"
                onClick={() => handleAddNote('dotted-quarter')}
                title="Dotted quarter note"
              >
                ♩. {isLt ? 'Punkt. ketv.' : 'Dot Qtr'} ({getNoteUnits('dotted-quarter', baseUnit)} vnt)
              </button>
              <button
                type="button"
                className="add-note-chip"
                onClick={() => handleAddNote('half')}
                title="Half note"
              >
                𝅗𝅥 {isLt ? 'Pusinė' : 'Half'} ({getNoteUnits('half', baseUnit)} vnt)
              </button>
              <button
                type="button"
                className="add-note-chip"
                onClick={() => handleAddNote('dotted-half')}
                title="Dotted half note"
              >
                𝅗𝅥. {isLt ? 'Punkt. pusinė' : 'Dot Half'} ({getNoteUnits('dotted-half', baseUnit)} vnt)
              </button>
              <button
                type="button"
                className="add-note-chip"
                onClick={() => handleAddNote('whole')}
                title="Whole note"
              >
                𝅝 {isLt ? 'Sveikoji' : 'Whole'} ({getNoteUnits('whole', baseUnit)} vnt)
              </button>
              <button
                type="button"
                className="chip-action chip-action--undo"
                onClick={handleRemoveLastNote}
                disabled={measureNotes.length === 0}
                title={isLt ? 'Pašalinti paskutinę' : 'Remove last'}
              >
                ⌫ {isLt ? 'Trinti paskutinę' : 'Remove last'}
              </button>
              <button
                type="button"
                className="chip-action chip-action--clear"
                onClick={handleClearNotes}
                disabled={measureNotes.length === 0}
                title={isLt ? 'Išvalyti' : 'Clear'}
              >
                ✕ {isLt ? 'Išvalyti' : 'Clear'}
              </button>
            </div>
          </div>
        )}

        {/* Measure Math Breakdown Card */}
        <div className="measure-breakdown-banner">
          <div className="breakdown-stat">
            <span className="stat-label">
              {isLt ? 'Takto talpa (4/4):' : 'Measure Capacity (4/4):'}
            </span>
            <span
              className={`stat-value ${
                currentTotalUnits === targetTotalUnits
                  ? 'stat-value--perfect'
                  : currentTotalUnits > targetTotalUnits
                  ? 'stat-value--overflow'
                  : 'stat-value--under'
              }`}
            >
              {currentTotalUnits} / {targetTotalUnits} {isLt ? 'vienetų' : 'units'}
              {currentTotalUnits === targetTotalUnits && ' ✓'}
            </span>
          </div>

          <div className="breakdown-stat breakdown-stat--grow">
            <span className="stat-label">
              {isLt ? 'Vienetų suma:' : 'Unit breakdown:'}
            </span>
            <span className="stat-formula">
              {spans.length > 0
                ? spans.map((s) => `${s.units} vnt`).join(' + ') + ` = ${currentTotalUnits} vnt`
                : isLt
                ? 'Nėra natų'
                : 'No notes'}
            </span>
          </div>

          <div className="breakdown-stat">
            <span className="stat-label">
              {isLt ? 'Skaičiavimo seka:' : 'Visual display count:'}
            </span>
            <span className="stat-count-display">
              {spans.length > 0 ? formatMeasureDisplay(spans) : '—'}
            </span>
          </div>
        </div>

        {/* RHYTHMIC GRID & VISUAL MEASURE DISPLAY */}
        <div className="rhythmic-grid-container" aria-label="Rhythmic measure grid">
          {/* Tick numbers ruler (1 .. 8 or 1 .. 16) */}
          <div
            className="ticks-ruler"
            style={{
              gridTemplateColumns: `repeat(${targetTotalUnits}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: targetTotalUnits }, (_, i) => i + 1).map((tickNum) => {
              const ticksPerBeat = baseUnit === '8th' ? 2 : 4;
              const isMainBeat = (tickNum - 1) % ticksPerBeat === 0;
              const beatNumber = Math.floor((tickNum - 1) / ticksPerBeat) + 1;
              const isActive = currentTick === tickNum;

              return (
                <div
                  key={tickNum}
                  className={`ruler-tick-cell ${isMainBeat ? 'ruler-tick-cell--mainbeat' : ''} ${
                    isActive ? 'ruler-tick-cell--active' : ''
                  }`}
                  onClick={() => {
                    setCurrentTick(tickNum);
                    triggerTickAudio(tickNum);
                  }}
                  title={`Tick ${tickNum}${isMainBeat ? ` (Beat ${beatNumber})` : ''}`}
                >
                  <span className="tick-number">{tickNum}</span>
                  {isMainBeat && <span className="beat-indicator">B{beatNumber}</span>}
                </div>
              );
            })}
          </div>

          {/* Active playhead tracking line */}
          <div
            className="playhead-indicator"
            style={{
              left: `${((currentTick - 0.5) / targetTotalUnits) * 100}%`,
            }}
            aria-hidden="true"
          />

          {/* Note blocks placed on the grid */}
          <div
            className="note-blocks-row"
            style={{
              gridTemplateColumns: `repeat(${targetTotalUnits}, minmax(0, 1fr))`,
            }}
          >
            {spans.map((spanItem, idx) => {
              const meta = NOTE_DEFINITIONS[spanItem.note];
              const [start, end] = spanItem.span;
              const isCurrent = currentTick >= start && currentTick <= end;

              return (
                <div
                  key={`${spanItem.note}-${idx}-${start}`}
                  className={`note-block ${isCurrent ? 'note-block--current' : ''}`}
                  style={{
                    gridColumn: `${start} / ${end + 1}`,
                  }}
                  onClick={() => {
                    setCurrentTick(start);
                    triggerTickAudio(start);
                  }}
                  title={`${isLt ? meta.nameLt : meta.nameEn}: ${formatSpanCount(spanItem.span)}`}
                >
                  <div className="note-block-glyph" aria-hidden="true">
                    {meta.symbol}
                  </div>
                  <div className="note-block-info">
                    <span className="note-block-name">
                      {isLt ? meta.nameLt : meta.nameEn}
                    </span>
                    <span className="note-block-count">
                      {formatSpanCount(spanItem.span)}
                    </span>
                    <span className="note-block-units">
                      {spanItem.units} {isLt ? 'vnt' : 'units'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current status display */}
        <div className="playback-status-row" role="status" aria-live="polite">
          <div className="active-tick-badge">
            <span className="pulse-dot" aria-hidden="true" />
            <span>
              {isLt ? 'Dabartinis pulsas (Tick):' : 'Current Tick:'} <strong>{currentTick}</strong> /{' '}
              {targetTotalUnits}
            </span>
          </div>

          {activeSpan && (
            <div className="active-note-badge">
              <span>{isLt ? 'Skambanti nata:' : 'Sounding Note:'} </span>
              <strong>
                {isLt
                  ? NOTE_DEFINITIONS[activeSpan.note].nameLt
                  : NOTE_DEFINITIONS[activeSpan.note].nameEn}
              </strong>
              <span className="badge-span-text"> {formatSpanCount(activeSpan.span)}</span>
            </div>
          )}
        </div>

        {/* Audio Metronome Player Controls */}
        <div className="metronome-player-card">
          <div className="player-main-controls">
            <button
              type="button"
              className={`play-btn ${isPlaying ? 'play-btn--active' : ''}`}
              onClick={() => setIsPlaying((prev) => !prev)}
              aria-label={isPlaying ? (isLt ? 'Pristabdyti' : 'Pause') : isLt ? 'Groti pulsą' : 'Play subdivision pulse'}
            >
              {isPlaying ? '⏸ ' + (isLt ? 'Pauzė' : 'Pause') : '▶ ' + (isLt ? 'Groti Pulsą' : 'Play Pulse')}
            </button>

            <button
              type="button"
              className="ctrl-btn"
              onClick={handleResetPlayback}
              title={isLt ? 'Grįžti į pradžią' : 'Rewind to start'}
              aria-label={isLt ? 'Grįžti į pradžią' : 'Rewind to start'}
            >
              ⏮ {isLt ? 'Pradžia' : 'Rewind'}
            </button>

            <button
              type="button"
              className="ctrl-btn"
              onClick={handleStepBackward}
              title={isLt ? '1 žingsnis atgal' : 'Step back 1 tick'}
              aria-label={isLt ? '1 žingsnis atgal' : 'Step back 1 tick'}
            >
              ◀ {isLt ? '-1 vnt' : '-1 tick'}
            </button>

            <button
              type="button"
              className="ctrl-btn"
              onClick={handleStepForward}
              title={isLt ? '1 žingsnis pirmyn' : 'Step forward 1 tick'}
              aria-label={isLt ? '1 žingsnis pirmyn' : 'Step forward 1 tick'}
            >
              {isLt ? '+1 vnt' : '+1 tick'} ▶
            </button>
          </div>

          {/* Tempo BPM controls */}
          <div className="tempo-controls-group">
            <div className="tempo-header">
              <label htmlFor="bpm-slider" className="tempo-label">
                {isLt ? 'Tempas (Ketvirtinių BPM):' : 'Tempo (Quarter Note BPM):'} <strong>{bpm}</strong>
              </label>
              <span className="subdivision-rate-pill">
                {baseUnit === '8th' ? bpm * 2 : bpm * 4} {isLt ? 'dūžių/min (pulso sparta)' : 'ticks/min (pulse rate)'}
              </span>
            </div>
            <div className="tempo-slider-row">
              <span className="tempo-bound">40</span>
              <input
                id="bpm-slider"
                type="range"
                min={40}
                max={180}
                step={2}
                value={bpm}
                onChange={(e) => setBpm(Number(e.target.value))}
                className="bpm-range-slider"
              />
              <span className="tempo-bound">180</span>
            </div>
            <div className="tempo-presets-row">
              <button
                type="button"
                className={`tempo-preset-chip ${bpm === 60 ? 'tempo-preset-chip--active' : ''}`}
                onClick={() => setBpm(60)}
              >
                60 {isLt ? '(Lėta praktika)' : '(Slow practice)'}
              </button>
              <button
                type="button"
                className={`tempo-preset-chip ${bpm === 84 ? 'tempo-preset-chip--active' : ''}`}
                onClick={() => setBpm(84)}
              >
                84 {isLt ? '(Vidutinis)' : '(Moderate)'}
              </button>
              <button
                type="button"
                className={`tempo-preset-chip ${bpm === 112 ? 'tempo-preset-chip--active' : ''}`}
                onClick={() => setBpm(112)}
              >
                112 {isLt ? '(Greitas)' : '(Up-tempo)'}
              </button>
            </div>
          </div>

          {/* Sound options */}
          <div className="sound-options-group">
            <span className="picker-label">{isLt ? 'Garso režimas:' : 'Audio Mode:'}</span>
            <div className="sound-toggle-pills" role="radiogroup" aria-label="Audio mode">
              <button
                type="button"
                role="radio"
                aria-checked={soundMode === 'click'}
                className={`pill-btn ${soundMode === 'click' ? 'pill-btn--active' : ''}`}
                onClick={() => setSoundMode('click')}
              >
                🔔 {isLt ? 'Metronomo dūžiai' : 'Metronome Ticks'}
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={soundMode === 'pitch'}
                className={`pill-btn ${soundMode === 'pitch' ? 'pill-btn--active' : ''}`}
                onClick={() => setSoundMode('pitch')}
              >
                🎹 {isLt ? 'Natos garsas (Attack tone)' : 'Pitch Tone'}
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={soundMode === 'mute'}
                className={`pill-btn ${soundMode === 'mute' ? 'pill-btn--active' : ''}`}
                onClick={() => setSoundMode('mute')}
              >
                🔇 {isLt ? 'Be garso (Tik vizualiai)' : 'Mute (Visual only)'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Concrete Calculation Tables & Walkthroughs */}
      <section className="theory-card" aria-labelledby="calculation-tables-heading">
        <div className="card-badge">
          {isLt ? '3 Dalis · Aritmetiniai Modeliai' : 'Part 3 · Discrete Calculation Tables'}
        </div>
        <h2 id="calculation-tables-heading" className="card-title">
          {isLt
            ? 'Konkretūs Apskaičiavimo Pavyzdžiai ir Lentelės'
            : 'Standard Calculation Tables & Walkthroughs'}
        </h2>

        {/* Example A: Eighth Note Base */}
        <div className="table-subsection">
          <div className="example-header-pill">
            <span className="example-badge">Example A</span>
            <h3 className="example-title">
              {isLt
                ? 'Aštuntinės bazinė vertė (1 vienetas = 1 aštuntinė nata)'
                : 'Eighth-Note Base (1 Unit = 1 Eighth Note / Aštuntinė)'}
            </h3>
          </div>
          <p className="table-context-note">
            {isLt
              ? 'Standartiniame 4/4 takte visa takto trukmė lygi 8 vienetams:'
              : 'In standard 4/4 time, total measure duration = 8 units:'}
          </p>

          <div className="table-wrapper">
            <table className="theory-table">
              <thead>
                <tr>
                  <th scope="col">{isLt ? 'Nata (EN)' : 'Note Type (EN)'}</th>
                  <th scope="col">{isLt ? 'Nata (LT)' : 'Nata (LT)'}</th>
                  <th scope="col">{isLt ? 'Standartinė dalis' : 'Standard Beat'}</th>
                  <th scope="col">{isLt ? 'Susmulkinti vienetai' : 'Subdivided Units'}</th>
                  <th scope="col">{isLt ? 'Skaičiavimo rodinys' : 'Count Display'}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Eighth note</td>
                  <td><strong>Aštuntinė</strong></td>
                  <td>0.5 beat</td>
                  <td><span className="unit-pill">1</span></td>
                  <td><code>[1]</code></td>
                </tr>
                <tr>
                  <td>Quarter note</td>
                  <td><strong>Ketvirtinė</strong></td>
                  <td>1.0 beat</td>
                  <td><span className="unit-pill">2</span></td>
                  <td><code>[1, 2]</code></td>
                </tr>
                <tr>
                  <td>Dotted quarter</td>
                  <td><strong>Punktuota ketvirtinė</strong></td>
                  <td>1.5 beats</td>
                  <td><span className="unit-pill">3</span></td>
                  <td><code>[1, 2, 3]</code></td>
                </tr>
                <tr>
                  <td>Half note</td>
                  <td><strong>Pusinė</strong></td>
                  <td>2.0 beats</td>
                  <td><span className="unit-pill">4</span></td>
                  <td><code>[1, 2, 3, 4]</code></td>
                </tr>
                <tr>
                  <td>Dotted half</td>
                  <td><strong>Punktuota pusinė</strong></td>
                  <td>3.0 beats</td>
                  <td><span className="unit-pill">6</span></td>
                  <td><code>[1, 2, 3, 4, 5, 6]</code></td>
                </tr>
                <tr>
                  <td>Whole note</td>
                  <td><strong>Sveikoji</strong></td>
                  <td>4.0 beats</td>
                  <td><span className="unit-pill">8</span></td>
                  <td><code>[1, 2, 3, 4, 5, 6, 7, 8]</code></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Measure Scenarios breakdown callouts */}
          <div className="scenarios-breakdown-grid">
            <div className="scenario-callout-card">
              <h4 className="callout-title">
                {isLt
                  ? 'Takto Scenarijus 1 (Ketvirtinė + Dvi 8-tinės + Pusinė 4/4 takte)'
                  : 'Measure Scenario 1 (Quarter + Two 8ths + Half note in 4/4)'}
              </h4>
              <ul className="scenario-steps-list">
                <li>
                  <strong>{isLt ? 'Natos:' : 'Notes:'}</strong> <code>[Quarter, Eighth, Eighth, Half]</code>
                </li>
                <li>
                  <strong>{isLt ? 'Vienetų skaidymas:' : 'Unit breakdown:'}</strong>{' '}
                  <code>2 units + 1 unit + 1 unit + 4 units = 8 units</code>
                </li>
                <li>
                  <strong>{isLt ? 'Skaičiavimas:' : 'Visual display count:'}</strong>{' '}
                  <span className="count-highlight"><code>(1-2) | (3) | (4) | (5-6-7-8)</code></span>
                </li>
              </ul>
              <button
                type="button"
                className="load-scenario-link"
                onClick={() => handleSelectScenario(PRESET_SCENARIOS[0])}
              >
                ▶ {isLt ? 'Užkrauti šį scenarijų į treniruoklį' : 'Load this scenario into visualizer'}
              </button>
            </div>

            <div className="scenario-callout-card">
              <h4 className="callout-title">
                {isLt
                  ? 'Takto Scenarijus 2 (Sinkopė ir punktuota nata 4/4 takte)'
                  : 'Measure Scenario 2 (Syncopation & Dotted Note in 4/4)'}
              </h4>
              <ul className="scenario-steps-list">
                <li>
                  <strong>{isLt ? 'Natos:' : 'Notes:'}</strong> <code>[Dotted Quarter, Eighth, Half]</code>
                </li>
                <li>
                  <strong>{isLt ? 'Vienetų skaidymas:' : 'Unit breakdown:'}</strong>{' '}
                  <code>3 units + 1 unit + 4 units = 8 units</code>
                </li>
                <li>
                  <strong>{isLt ? 'Skaičiavimas:' : 'Visual display count:'}</strong>{' '}
                  <span className="count-highlight"><code>(1-2-3) | (4) | (5-6-7-8)</code></span>
                </li>
              </ul>
              <button
                type="button"
                className="load-scenario-link"
                onClick={() => handleSelectScenario(PRESET_SCENARIOS[1])}
              >
                ▶ {isLt ? 'Užkrauti šį scenarijų į treniruoklį' : 'Load this scenario into visualizer'}
              </button>
            </div>
          </div>
        </div>

        {/* Example B: Sixteenth Note Base */}
        <div className="table-subsection table-subsection--spaced">
          <div className="example-header-pill">
            <span className="example-badge">Example B</span>
            <h3 className="example-title">
              {isLt
                ? 'Šešioliktinės bazinė vertė (1 vienetas = 1 šešioliktinė nata)'
                : 'Sixteenth-Note Base (1 Unit = 1 Sixteenth Note / Šešioliktinė)'}
            </h3>
          </div>
          <p className="table-context-note">
            {isLt
              ? 'Taikoma, kai takte pasitaiko greiti pasažai ar punktuotos aštuntinės (4/4 taktas = 16 vienetų):'
              : 'Used when measures contain rapid runs or dotted eighth-note patterns (total measure in 4/4 = 16 units):'}
          </p>

          <div className="table-wrapper">
            <table className="theory-table">
              <thead>
                <tr>
                  <th scope="col">{isLt ? 'Nata (EN)' : 'Note Type (EN)'}</th>
                  <th scope="col">{isLt ? 'Nata (LT)' : 'Nata (LT)'}</th>
                  <th scope="col">{isLt ? 'Susmulkinti vienetai' : 'Subdivided Units'}</th>
                  <th scope="col">{isLt ? 'Skaičiavimo rodinys' : 'Count Display'}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Sixteenth note</td>
                  <td><strong>Šešioliktinė</strong></td>
                  <td><span className="unit-pill">1</span></td>
                  <td><code>[1]</code></td>
                </tr>
                <tr>
                  <td>Eighth note</td>
                  <td><strong>Aštuntinė</strong></td>
                  <td><span className="unit-pill">2</span></td>
                  <td><code>[1, 2]</code></td>
                </tr>
                <tr>
                  <td>Dotted eighth</td>
                  <td><strong>Punktuota aštuntinė</strong></td>
                  <td><span className="unit-pill">3</span></td>
                  <td><code>[1, 2, 3]</code></td>
                </tr>
                <tr>
                  <td>Quarter note</td>
                  <td><strong>Ketvirtinė</strong></td>
                  <td><span className="unit-pill">4</span></td>
                  <td><code>[1, 2, 3, 4]</code></td>
                </tr>
                <tr>
                  <td>Half note</td>
                  <td><strong>Pusinė</strong></td>
                  <td><span className="unit-pill">8</span></td>
                  <td><code>[1 .. 8]</code></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 4. Bilingual Terminology Dictionary */}
      <section className="theory-card" aria-labelledby="terminology-heading">
        <div className="card-badge">
          {isLt ? '4 Dalis · Dvikalbis Žodynėlis' : 'Part 4 · Bilingual Terminology Dictionary'}
        </div>
        <h2 id="terminology-heading" className="card-title">
          {isLt ? 'Muzikos Teorijos Terminų Žodynėlis' : 'Music Theory Terminology Reference'}
        </h2>
        <p className="section-description">
          {isLt
            ? 'Sulyginkite lietuvišką ir anglišką ritmikos terminiją praktiniam grojimui ir teorijai.'
            : 'Side-by-side English & Lithuanian rhythmic terminology for international practice.'}
        </p>

        <div className="terms-grid">
          {TERMINOLOGY_ITEMS.map((item, i) => (
            <div key={i} className="term-card">
              <div className="term-header">
                <span className="term-primary">{isLt ? item.termLt : item.termEn}</span>
                <span className="term-secondary">{isLt ? item.termEn : item.termLt}</span>
              </div>
              <p className="term-description">{isLt ? item.descLt : item.descEn}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Practical Practice Routine */}
      <section className="theory-card" aria-labelledby="practice-routine-heading">
        <div className="card-badge">
          {isLt ? '5 Dalis · Praktikos Žingsniai' : 'Part 5 · Practice Routine'}
        </div>
        <h2 id="practice-routine-heading" className="card-title">
          {isLt
            ? '3 Žingsnių Praktikos Metodika prie Fortepijono'
            : '3-Step Piano Practice Routine for Rhythmic Mastery'}
        </h2>

        <div className="routine-steps-grid">
          <div className="routine-step-card">
            <div className="step-number">1</div>
            <h3 className="step-title">
              {isLt ? 'Balsu skaičiuokite kiekvieną vienetą' : 'Count Every Unit Out Loud'}
            </h3>
            <p className="step-body">
              {isLt
                ? 'Nustatykite metronomą lėtu tempu (pvz., 60 BPM). Garsiai balsu skaičiuokite kiekvieną takso dūžį: „1, 2, 3, 4, 5, 6, 7, 8“. Rankos groja natas tiksliai ties jų pradžios vienetais ir laiko jas iki kito garso.'
                : 'Set metronome to slow tempo (e.g. 60 BPM). Vocalize every subdivision tick out loud: "1, 2, 3, 4, 5, 6, 7, 8". Strike notes strictly on their start unit and sustain for the full unit count.'}
            </p>
          </div>

          <div className="routine-step-card">
            <div className="step-number">2</div>
            <h3 className="step-title">
              {isLt ? 'Vidinis „šešėlinis“ pulsas' : 'Internal "Ghost" Pulse'}
            </h3>
            <p className="step-body">
              {isLt
                ? 'Balsu ištarkite tik natų atakas (pvz., „viens“, „keturi“), tačiau mintyse jauskite visus tarpinius dūžius. Pėda ar kūnu palaikykite stabilią vidinę tinklelio struktūrą.'
                : 'Only vocalize note attacks out loud while letting the subdivision ticks run continuously in your mind. Maintain the steady internal grid without physical rush.'}
            </p>
          </div>

          <div className="routine-step-card">
            <div className="step-number">3</div>
            <h3 className="step-title">
              {isLt ? 'Grįžimas prie ketvirtinių pulso' : 'Return to Macro Beat Pulse'}
            </h3>
            <p className="step-body">
              {isLt
                ? 'Perjunkite metronomą atgal į įprastą ketvirtinių pulsą (1, 2, 3, 4). Kadangi natų trukmės jau įsirėžė į raumenų atmintį, atlikimas išliks idealiai tikslus ir laisvas.'
                : 'Switch metronome back to regular quarter-note clicks (1, 2, 3, 4). Because proportions are ingrained in muscle memory, your playing feels fluid, musical, and rock-solid.'}
            </p>
          </div>
        </div>

        <div className="ready-cta-container" style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center" }}>
          <button
            type="button"
            className="ready-practice-cta"
            onClick={onBackToPractice}
          >
            {isLt ? 'Pasiruošę? Išbandykite Akordų Praktiką →' : 'Ready? Test Yourself in Chord Practice →'}
          </button>
          {onOpenChordsGuide && (
            <button
              type="button"
              className="ctrl-btn"
              onClick={onOpenChordsGuide}
            >
              📖 {isLt ? 'Akordų Teorijos Atmintinė →' : 'Chord Construction Guide →'}
            </button>
          )}
        </div>
      </section>
    </article>
  );
};
