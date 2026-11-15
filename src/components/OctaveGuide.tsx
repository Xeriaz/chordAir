import React, { useCallback, useEffect, useRef, useState } from 'react';
import { playNote } from '../domain/audio';
import { UI_STRINGS } from '../domain/i18n';
import { OctaveData, OctaveNoteItem, PIANO_OCTAVES, getOctaveNotes } from '../domain/octaves';
import { Language } from '../domain/types';

interface OctaveGuideProps {
  language: Language;
  onBackToPractice: () => void;
}

type OctaveGuideTab = 'explorer' | 'rules' | 'quiz';

export const OctaveGuide: React.FC<OctaveGuideProps> = ({
  language,
  onBackToPractice,
}) => {
  const t = UI_STRINGS[language];
  const isLt = language === 'lt';

  const [activeTab, setActiveTab] = useState<OctaveGuideTab>('explorer');
  const [selectedOctaveId, setSelectedOctaveId] = useState<string>('one-line'); // Default to Pirmoji (Middle C)
  const [activeMidi, setActiveMidi] = useState<number | null>(null);
  const [isPlayingScale, setIsPlayingScale] = useState<boolean>(false);
  const scaleTimersRef = useRef<number[]>([]);

  // Quiz state
  const [quizTargetOctave, setQuizTargetOctave] = useState<OctaveData | null>(null);
  const [quizTargetMidi, setQuizTargetMidi] = useState<number | null>(null);
  const [quizOptions, setQuizOptions] = useState<OctaveData[]>([]);
  const [quizSelectedAnswerId, setQuizSelectedAnswerId] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({
    correct: 0,
    total: 0,
  });

  const selectedOctave: OctaveData =
    PIANO_OCTAVES.find((o) => o.id === selectedOctaveId) ?? PIANO_OCTAVES[4];

  const octaveNotes: OctaveNoteItem[] = getOctaveNotes(selectedOctave);

  // Clear pending playback timeouts
  const clearScaleTimers = useCallback(() => {
    scaleTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    scaleTimersRef.current = [];
    setIsPlayingScale(false);
  }, []);

  useEffect(() => {
    return () => clearScaleTimers();
  }, [clearScaleTimers]);

  // Play a single note and highlight
  const handlePlaySingleNote = (midi: number) => {
    setActiveMidi(midi);
    playNote(midi, 1.2, 0.95);
    window.setTimeout(() => {
      setActiveMidi((curr) => (curr === midi ? null : curr));
    }, 400);
  };

  // Play the ascending scale for the selected octave
  const handlePlayOctaveScale = () => {
    clearScaleTimers();
    setIsPlayingScale(true);

    octaveNotes.forEach((note, index) => {
      const timer = window.setTimeout(() => {
        handlePlaySingleNote(note.midi);
        if (index === octaveNotes.length - 1) {
          setIsPlayingScale(false);
        }
      }, index * 220);
      scaleTimersRef.current.push(timer);
    });
  };

  // Quiz Generator
  const generateNewQuizQuestion = useCallback(() => {
    // Focus on the core recognizable octaves (Contra, Great, Small, First, Second, Third)
    const eligibleOctaves = PIANO_OCTAVES.filter(
      (o) => o.number >= 1 && o.number <= 6
    );
    const target = eligibleOctaves[Math.floor(Math.random() * eligibleOctaves.length)];
    const notes = getOctaveNotes(target);
    // Pick a natural key (C, E, G, or A) for clear acoustic ear perception
    const naturalNotes = notes.filter((n) => !n.isBlack);
    const chosenNote = naturalNotes[Math.floor(Math.random() * naturalNotes.length)] ?? notes[0];

    // Pick 3 distractors
    const otherOctaves = PIANO_OCTAVES.filter((o) => o.id !== target.id);
    const shuffledOthers = [...otherOctaves].sort(() => Math.random() - 0.5);
    const options = [target, shuffledOthers[0], shuffledOthers[1], shuffledOthers[2]].sort(
      (a, b) => a.number - b.number
    );

    setQuizTargetOctave(target);
    setQuizTargetMidi(chosenNote.midi);
    setQuizOptions(options);
    setQuizSelectedAnswerId(null);

    // Play target note immediately
    playNote(chosenNote.midi, 1.5, 1.0);
  }, []);

  useEffect(() => {
    if (activeTab === 'quiz' && !quizTargetOctave) {
      generateNewQuizQuestion();
    }
  }, [activeTab, quizTargetOctave, generateNewQuizQuestion]);

  const handleSelectQuizAnswer = (octaveId: string) => {
    if (quizSelectedAnswerId !== null || !quizTargetOctave) return;
    setQuizSelectedAnswerId(octaveId);

    const isCorrect = octaveId === quizTargetOctave.id;
    setQuizScore((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));
  };

  return (
    <div className="octave-guide-container">
      {/* Top Breadcrumb & Title */}
      <div className="cadence-guide-header">
        <button
          type="button"
          className="back-to-practice-btn"
          onClick={onBackToPractice}
          aria-label={t.skipToPractice}
        >
          ← {t.practiceTab}
        </button>
        <div className="cadence-audit-badge-row">
          <span className="pedagogy-audit-badge">✨ Conservatory Pedagogy</span>
          <span className="cadence-pill-category">88 Keys Piano Architecture</span>
        </div>
        <h2 className="cadence-main-title">{t.octavesGuideTitle}</h2>
        <p className="cadence-main-subtitle">{t.octavesGuideSubtitle}</p>
      </div>

      {/* Tab Navigation */}
      <div className="octave-nav-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'explorer'}
          className={`octave-tab-btn ${activeTab === 'explorer' ? 'octave-tab-btn--active' : ''}`}
          onClick={() => setActiveTab('explorer')}
        >
          🎹 {isLt ? 'Oktavų žemėlapis ir klaviatūra' : 'Register Map & Keyboard'}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'rules'}
          className={`octave-tab-btn ${activeTab === 'rules' ? 'octave-tab-btn--active' : ''}`}
          onClick={() => setActiveTab('rules')}
        >
          📜 {isLt ? 'Helmholco taisyklės ir lentelė' : 'Helmholtz Rules & Chart'}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'quiz'}
          className={`octave-tab-btn ${activeTab === 'quiz' ? 'octave-tab-btn--active' : ''}`}
          onClick={() => setActiveTab('quiz')}
        >
          🎯 {isLt ? 'Klausos treniruotė (Viktorina)' : 'Octave Ear Trainer'}
        </button>
      </div>

      {/* TAB 1: EXPLORER & INTERACTIVE REGISTER MAP */}
      {activeTab === 'explorer' && (
        <div className="octave-explorer-view">
          {/* Panoramic 88-Key Register Ribbon */}
          <section className="octave-panoramic-card" aria-label={t.panoramicMapTitle}>
            <div className="octave-panoramic-header">
              <div>
                <h3 className="octave-section-heading">{t.panoramicMapTitle}</h3>
                <span className="octave-section-sub">
                  {isLt
                    ? 'Spustelėkite bet kurią fortepijono oktavą, kad pamatytumėte jos klavišus ir išgirstumėte skambesį:'
                    : 'Click any piano octave block below to inspect its keys and acoustic timbre:'}
                </span>
              </div>
            </div>

            <div className="octave-ribbon">
              {PIANO_OCTAVES.map((octave) => {
                const isSelected = octave.id === selectedOctave.id;
                const isMiddleC = octave.id === 'one-line';
                return (
                  <button
                    key={octave.id}
                    type="button"
                    className={`octave-ribbon-block ${
                      isSelected ? 'octave-ribbon-block--selected' : ''
                    } ${isMiddleC ? 'octave-ribbon-block--middle-c' : ''}`}
                    style={{
                      flexGrow: octave.keysCount,
                      borderTopColor: octave.color,
                    }}
                    onClick={() => {
                      setSelectedOctaveId(octave.id);
                      clearScaleTimers();
                    }}
                  >
                    <span className="octave-ribbon-num">
                      {octave.number === 0 ? 'Sub' : `${octave.number}`}
                    </span>
                    <span className="octave-ribbon-name">
                      {isLt ? octave.nameLt : octave.nameEn}
                    </span>
                    <span className="octave-ribbon-symbol">{octave.helmholtzSymbol}</span>
                    {isMiddleC && (
                      <span className="middle-c-pill" title="Middle C (c¹ / C4)">
                        ★ C4
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Active Octave Detail Banner */}
          <section className="octave-detail-stage">
            <div
              className="octave-banner"
              style={{
                borderLeftColor: selectedOctave.color,
                background: `linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(24, 34, 60, 0.9) 100%)`,
              }}
            >
              <div className="octave-banner-main">
                <div className="octave-badge-col">
                  <span
                    className="octave-num-badge"
                    style={{
                      borderColor: selectedOctave.color,
                      color: selectedOctave.color,
                    }}
                  >
                    {selectedOctave.number === 0 ? '0' : selectedOctave.number}
                  </span>
                  <span className="octave-scientific-tag">{selectedOctave.scientificRange}</span>
                </div>

                <div className="octave-text-col">
                  <div className="octave-title-row">
                    <h3 className="octave-title">
                      {isLt ? selectedOctave.nameLt : selectedOctave.nameEn}
                    </h3>
                    <span className="octave-helmholtz-badge">
                      {selectedOctave.helmholtzSymbol}
                    </span>
                  </div>
                  <p className="octave-desc">
                    {isLt ? selectedOctave.descriptionLt : selectedOctave.descriptionEn}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="octave-actions">
                <button
                  type="button"
                  className={`octave-play-scale-btn ${
                    isPlayingScale ? 'octave-play-scale-btn--playing' : ''
                  }`}
                  onClick={handlePlayOctaveScale}
                >
                  {isPlayingScale ? (isLt ? '⏹ Grojama...' : '⏹ Playing...') : t.playOctaveScaleBtn}
                </button>
              </div>
            </div>

            {/* Interactive Playable Keys of this Octave */}
            <div className="octave-keyboard-card">
              <div className="octave-keyboard-header">
                <span className="octave-keyboard-hint">{t.playKeyPrompt}</span>
                <span className="octave-freq-indicator">
                  {t.frequencyRangeLabel}: <strong>{selectedOctave.freqRangeHz}</strong>
                </span>
              </div>

              <div className="octave-keys-container">
                {octaveNotes.map((note) => {
                  const isActive = activeMidi === note.midi;
                  return (
                    <button
                      key={note.midi}
                      type="button"
                      className={`octave-key ${
                        note.isBlack ? 'octave-key--black' : 'octave-key--white'
                      } ${isActive ? 'octave-key--active' : ''}`}
                      onClick={() => handlePlaySingleNote(note.midi)}
                      title={`${isLt ? note.spokenNameLt : note.spokenNameEn} (${note.scientific} / ${note.helmholtzLt}) - ${note.frequencyHz} Hz`}
                    >
                      <div className="octave-key-content">
                        <span className="octave-key-name">
                          {isLt ? note.spokenNameLt : note.spokenNameEn}
                        </span>
                        <span className="octave-key-helmholtz">{note.helmholtzLt}</span>
                        <span className="octave-key-scientific">{note.scientific}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pedagogical Spec Grid */}
            <div className="octave-specs-grid">
              <div className="octave-spec-item">
                <span className="octave-spec-label">{t.clefRangeLabel}</span>
                <span className="octave-spec-value">
                  {isLt ? selectedOctave.clefLt : selectedOctave.clefEn}
                </span>
              </div>
              <div className="octave-spec-item">
                <span className="octave-spec-label">{t.orchestralRoleLabel}</span>
                <span className="octave-spec-value">
                  {isLt ? selectedOctave.roleLt : selectedOctave.roleEn}
                </span>
              </div>
              <div className="octave-spec-item">
                <span className="octave-spec-label">
                  {isLt ? 'Pedagoginis patarimas' : 'Pedagogue Insight'}
                </span>
                <span className="octave-spec-value octave-spec-value--tip">
                  💡 {isLt ? selectedOctave.pedagogyTipLt : selectedOctave.pedagogyTipEn}
                </span>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* TAB 2: HELMHOLTZ RULES & COMPARATIVE CHART */}
      {activeTab === 'rules' && (
        <div className="octave-rules-view">
          {/* Three Conservatory Golden Rules */}
          <div className="octave-rules-cards">
            <div className="octave-rule-card">
              <div className="octave-rule-icon">🔤</div>
              <h4 className="octave-rule-title">
                {isLt
                  ? '1 Taisyklė: Didžiosios vs. Mažosios raidės'
                  : 'Rule 1: Capitals vs. Lowercase Break'}
              </h4>
              <p className="octave-rule-body">
                {isLt ? (
                  <>
                    Viskas, kas yra <strong>žemiau Mažosios oktavos</strong> (Didžioji, Kontroktava,
                    Subkontroktava), žymima <strong>DIDŽIOSIOMIS RAIDĖMIS</strong>:{' '}
                    <code>C, D, E, F, G, A, H</code>.<br />
                    Nuo <strong>Mažosios oktavos į viršų</strong> visos natos žymimos{' '}
                    <strong>MAŽOSIOMIS RAIDĖMIS</strong>: <code>c, d, e, f, g, a, h</code>.
                  </>
                ) : (
                  <>
                    Everything <strong>below the Small Octave</strong> (Great, Contra, Sub-contra) is
                    notated in <strong>CAPITAL LETTERS</strong>: <code>C, D, E, F, G, A, B</code>.<br />
                    From the <strong>Small Octave and upwards</strong>, all notes are notated in{' '}
                    <strong>LOWERCASE LETTERS</strong>: <code>c, d, e, f, g, a, b</code>.
                  </>
                )}
              </p>
            </div>

            <div className="octave-rule-card">
              <div className="octave-rule-icon">🔢</div>
              <h4 className="octave-rule-title">
                {isLt
                  ? '2 Taisyklė: Indeksų skaičiavimo tvarka'
                  : 'Rule 2: Index & Prime Progression'}
              </h4>
              <p className="octave-rule-body">
                {isLt ? (
                  <>
                    <strong>Didžioji</strong> ir <strong>Mažoji</strong> oktavos yra „švarios“ —{' '}
                    <strong>be jokių indeksų</strong> (<code>C</code> vs. <code>c</code>).<br />
                    Leidžiantis žemyn atsiranda <em>apatiniai indeksai</em>: Kontroktava ={' '}
                    <code>C₁</code>, Subkontroktava = <code>A₂</code>.<br />
                    Kylant aukštyn atsiranda <em>viršutiniai indeksai</em>: Pirmoji = <code>c¹</code>,
                    Antroji = <code>c²</code>, Trečioji = <code>c³</code>, Ketvirtoji = <code>c⁴</code>.
                  </>
                ) : (
                  <>
                    <strong>Great</strong> and <strong>Small</strong> octaves are "clean" —{' '}
                    <strong>no numbers or primes</strong> (<code>C</code> vs. <code>c</code>).<br />
                    Descending down uses <em>subscripts</em>: Contra = <code>C₁</code>, Sub-contra ={' '}
                    <code>A₂</code>.<br />
                    Ascending up uses <em>superscripts</em>: 1-line = <code>c¹</code>, 2-line ={' '}
                    <code>c²</code>, 3-line = <code>c³</code>, 4-line = <code>c⁴</code>.
                  </>
                )}
              </p>
            </div>

            <div className="octave-rule-card">
              <div className="octave-rule-icon">🎯</div>
              <h4 className="octave-rule-title">
                {isLt ? '3 Taisyklė: Centrinis Do (Middle C)' : 'Rule 3: Middle C Anchor (c¹ / C4)'}
              </h4>
              <p className="octave-rule-body">
                {isLt ? (
                  <>
                    Centrinis C yra <strong>Pirmosios oktavos Do</strong> (<code>c¹</code> arba{' '}
                    <code>C4</code>).<br />
                    Tai pati svarbiausia nata fortepijono architektūroje: ji stovi ant 1 pagalbinės
                    linijos ir tobulai dalija sistemą į <strong>Boso raktą</strong> (kairė ranka) ir{' '}
                    <strong>Smuiko raktą</strong> (dešinė ranka).
                  </>
                ) : (
                  <>
                    Middle C is the <strong>One-line Octave Do</strong> (<code>c¹</code> or{' '}
                    <code>C4</code>).<br />
                    It is the foundational anchor of keyboard harmony: sitting on the first ledger
                    line between the <strong>Bass Clef</strong> (left hand) and{' '}
                    <strong>Treble Clef</strong> (right hand).
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Full 9-Octaves Comparative Table */}
          <div className="octave-table-card">
            <h3 className="octave-table-heading">
              {isLt
                ? 'Pilna 9 fortepijono oktavų suvestinė (Helmholcas vs. Mokslinė sistema)'
                : 'Complete 9-Octave Comparison Chart (Helmholtz vs. Scientific)'}
            </h3>

            <div className="octave-table-wrapper">
              <table className="octave-comparison-table">
                <thead>
                  <tr>
                    <th>Nr.</th>
                    <th>{isLt ? 'Lietuviškas pavadinimas' : 'Octave Name'}</th>
                    <th>{t.helmholtzNotationLabel}</th>
                    <th>{t.scientificNotationLabel}</th>
                    <th>MIDI</th>
                    <th>{t.frequencyRangeLabel}</th>
                    <th>{t.clefRangeLabel}</th>
                  </tr>
                </thead>
                <tbody>
                  {PIANO_OCTAVES.map((oct) => (
                    <tr
                      key={oct.id}
                      className={oct.id === selectedOctaveId ? 'octave-row--selected' : ''}
                      onClick={() => {
                        setSelectedOctaveId(oct.id);
                        setActiveTab('explorer');
                      }}
                      title={isLt ? 'Spustelėkite, kad atidarytumėte šią oktavą' : 'Click to view octave'}
                    >
                      <td>
                        <span
                          className="octave-dot-pill"
                          style={{ backgroundColor: oct.color }}
                        >
                          {oct.number}
                        </span>
                      </td>
                      <td>
                        <strong>{isLt ? oct.nameLt : oct.nameEn}</strong>
                        {oct.id === 'one-line' && (
                          <span className="table-badge table-badge--gold">Middle C</span>
                        )}
                      </td>
                      <td>
                        <code className="code-helmholtz">{oct.helmholtzSymbol}</code>
                      </td>
                      <td>
                        <code>{oct.scientificRange}</code>
                      </td>
                      <td>
                        {oct.startMidi === oct.endMidi
                          ? oct.startMidi
                          : `${oct.startMidi}–${oct.endMidi}`}
                      </td>
                      <td>{oct.freqRangeHz}</td>
                      <td>{isLt ? oct.clefLt : oct.clefEn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: OCTAVE EAR TRAINER & QUIZ */}
      {activeTab === 'quiz' && quizTargetOctave && quizTargetMidi && (
        <div className="octave-quiz-view">
          <div className="octave-quiz-card">
            <div className="octave-quiz-header">
              <div>
                <h3 className="octave-quiz-title">{t.octaveQuizTitle}</h3>
                <p className="octave-quiz-sub">{t.octaveQuizSubtitle}</p>
              </div>
              <div className="octave-quiz-score-badge">
                <span className="score-label">{t.score}:</span>
                <span className="score-value">
                  {quizScore.correct} / {quizScore.total}
                </span>
              </div>
            </div>

            <div className="octave-quiz-prompt-box">
              <span className="quiz-sound-icon" aria-hidden="true">
                👂
              </span>
              <p className="quiz-prompt-text">{t.octaveQuizPrompt}</p>
              <button
                type="button"
                className="quiz-replay-btn"
                onClick={() => playNote(quizTargetMidi, 1.5, 1.0)}
              >
                {t.playQuizPromptBtn}
              </button>
            </div>

            {/* Answer Options */}
            <div className="octave-quiz-options-grid">
              {quizOptions.map((option) => {
                const isSelected = quizSelectedAnswerId === option.id;
                const isTarget = option.id === quizTargetOctave.id;
                let btnClass = 'quiz-option-btn';

                if (quizSelectedAnswerId !== null) {
                  if (isTarget) {
                    btnClass += ' quiz-option-btn--correct';
                  } else if (isSelected) {
                    btnClass += ' quiz-option-btn--incorrect';
                  }
                }

                return (
                  <button
                    key={option.id}
                    type="button"
                    className={btnClass}
                    disabled={quizSelectedAnswerId !== null}
                    onClick={() => handleSelectQuizAnswer(option.id)}
                  >
                    <span
                      className="quiz-option-dot"
                      style={{ backgroundColor: option.color }}
                    />
                    <div className="quiz-option-info">
                      <span className="quiz-option-name">
                        {isLt ? option.nameLt : option.nameEn}
                      </span>
                      <span className="quiz-option-symbols">
                        {option.helmholtzSymbol} · {option.scientificRange}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Post-Answer Feedback Banner */}
            {quizSelectedAnswerId !== null && (
              <div
                className={`quiz-feedback-banner ${
                  quizSelectedAnswerId === quizTargetOctave.id
                    ? 'quiz-feedback-banner--correct'
                    : 'quiz-feedback-banner--incorrect'
                }`}
              >
                <div className="quiz-feedback-text">
                  <strong>
                    {quizSelectedAnswerId === quizTargetOctave.id
                      ? t.quizCorrect
                      : `${t.quizIncorrect} ${
                          isLt ? quizTargetOctave.nameLt : quizTargetOctave.nameEn
                        }`}
                  </strong>
                  <p className="quiz-feedback-sub">
                    {isLt ? quizTargetOctave.descriptionLt : quizTargetOctave.descriptionEn}
                  </p>
                </div>
                <button
                  type="button"
                  className="quiz-next-btn"
                  onClick={generateNewQuizQuestion}
                >
                  {t.nextQuestion}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
