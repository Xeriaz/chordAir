import React, { useCallback, useEffect, useRef, useState } from 'react';
import { playChord } from '../domain/audio';
import { CADENCE_PROGRESSIONS, CadenceProgression } from '../domain/cadences';
import { UI_STRINGS } from '../domain/i18n';
import { Language } from '../domain/types';
import { PianoKeyboard } from './PianoKeyboard';

interface CadenceGuideProps {
  language: Language;
  onBackToPractice: () => void;
}

export const CadenceGuide: React.FC<CadenceGuideProps> = ({
  language,
  onBackToPractice,
}) => {
  const t = UI_STRINGS[language];
  const isLt = language === 'lt';

  const [selectedProgressionId, setSelectedProgressionId] = useState<string>(
    CADENCE_PROGRESSIONS[0].id
  );
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isPlayingSequence, setIsPlayingSequence] = useState<boolean>(false);
  const sequenceTimerRef = useRef<number | null>(null);

  const progression: CadenceProgression =
    CADENCE_PROGRESSIONS.find((p) => p.id === selectedProgressionId) ??
    CADENCE_PROGRESSIONS[0];

  const currentStep = progression.steps[activeStepIndex] ?? progression.steps[0];

  const handleSelectProgression = (id: string) => {
    setSelectedProgressionId(id);
    setActiveStepIndex(0);
    if (sequenceTimerRef.current) {
      window.clearTimeout(sequenceTimerRef.current);
      setIsPlayingSequence(false);
    }
  };

  const handleStepChange = (newIndex: number) => {
    if (newIndex >= 0 && newIndex < progression.steps.length) {
      setActiveStepIndex(newIndex);
      const step = progression.steps[newIndex];
      playChord(step.notes.map((n) => n.midi));
    }
  };

  // Auto-play cadence progression loop
  const handlePlaySequence = useCallback(() => {
    if (isPlayingSequence) {
      if (sequenceTimerRef.current) {
        window.clearTimeout(sequenceTimerRef.current);
      }
      setIsPlayingSequence(false);
      return;
    }

    setIsPlayingSequence(true);
    let step = 0;

    const playNext = () => {
      if (step >= progression.steps.length) {
        setIsPlayingSequence(false);
        return;
      }
      setActiveStepIndex(step);
      playChord(progression.steps[step].notes.map((n) => n.midi));
      step += 1;
      sequenceTimerRef.current = window.setTimeout(playNext, 1300);
    };

    playNext();
  }, [isPlayingSequence, progression.steps]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (sequenceTimerRef.current) {
        window.clearTimeout(sequenceTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="cadence-guide-container">
      {/* Top Header & Navigation */}
      <div className="cadence-guide-header">
        <button
          type="button"
          onClick={onBackToPractice}
          className="back-to-practice-btn"
        >
          ← {t.backToPracticeShort}
        </button>

        <div className="cadence-header-title-group">
          <div className="cadence-audit-badge-row">
            <span className="pedagogy-audit-badge">
              {t.pedagogyAuditBadge}
            </span>
            <span className="cadence-audit-footnote">
              {t.auditAttributionFootnote}
            </span>
          </div>
          <h2 className="cadence-main-title">{t.cadenceExplorerTitle}</h2>
          <p className="cadence-main-subtitle">{t.cadenceExplorerSubtitle}</p>
        </div>
      </div>

      {/* Progression Category / Selection Tabs */}
      <div className="cadence-selector-pills" role="tablist">
        {CADENCE_PROGRESSIONS.map((prog) => {
          const isSelected = prog.id === progression.id;
          return (
            <button
              key={prog.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              className={`cadence-pill-btn ${isSelected ? 'cadence-pill-btn--active' : ''}`}
              onClick={() => handleSelectProgression(prog.id)}
            >
              <span className="cadence-pill-category">
                {isLt ? prog.categoryBadgeLt : prog.categoryBadgeEn}
              </span>
              <span className="cadence-pill-title">
                {isLt ? prog.titleLt : prog.titleEn}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Progression Summary Card */}
      <section className="cadence-card">
        <div className="cadence-card-header">
          <div>
            <span className="cadence-key-center-tag">{progression.keyCenter}</span>
            <h3 className="cadence-prog-heading">
              {isLt ? progression.titleLt : progression.titleEn}
            </h3>
            <p className="cadence-prog-desc">
              {isLt ? progression.summaryLt : progression.summaryEn}
            </p>
          </div>

          <button
            type="button"
            className={`cadence-play-sequence-btn ${isPlayingSequence ? 'cadence-play-sequence-btn--playing' : ''}`}
            onClick={handlePlaySequence}
          >
            {isPlayingSequence ? t.stopSequenceBtn : t.playSequenceBtn}
          </button>
        </div>

        {/* Secret Masterclass Tip Box */}
        <div className="cadence-secret-box">
          <span className="cadence-secret-icon" aria-hidden="true">💡</span>
          <div>
            <strong>{isLt ? 'Pianisto paslaptis:' : 'Masterclass Insight:'} </strong>
            <span>{isLt ? progression.pedagogicalSecretLt : progression.pedagogicalSecretEn}</span>
          </div>
        </div>

        {/* Stepper Navigation */}
        <div className="cadence-stepper">
          <div className="cadence-stepper-track">
            {progression.steps.map((step, idx) => {
              const isActive = idx === activeStepIndex;
              const hasAnchor = step.anchorMidis.length > 0;
              return (
                <button
                  key={step.stepIndex}
                  type="button"
                  className={`cadence-step-node ${isActive ? 'cadence-step-node--active' : ''}`}
                  onClick={() => handleStepChange(idx)}
                >
                  <span className="cadence-step-roman">{step.romanNumeral}</span>
                  <span className="cadence-step-symbol">{step.symbol}</span>
                  {hasAnchor && (
                    <span className="cadence-anchor-mini-tag" title={t.commonToneAnchorLabel}>
                      ⚓
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="cadence-step-controls">
            <button
              type="button"
              className="cadence-nav-step-btn"
              disabled={activeStepIndex === 0}
              onClick={() => handleStepChange(activeStepIndex - 1)}
            >
              {t.stepBack}
            </button>
            <span className="cadence-step-counter">
              {t.stepIndicator(activeStepIndex + 1, progression.steps.length)}
            </span>
            <button
              type="button"
              className="cadence-nav-step-btn"
              disabled={activeStepIndex === progression.steps.length - 1}
              onClick={() => handleStepChange(activeStepIndex + 1)}
            >
              {t.stepForward}
            </button>
          </div>
        </div>

        {/* Current Step Detail Banner */}
        <div className="cadence-step-banner">
          <div className="cadence-step-left">
            <span className="cadence-roman-badge">{currentStep.romanNumeral}</span>
            <div>
              <h4 className="cadence-step-name">
                {isLt ? currentStep.nameLt : currentStep.nameEn} ({currentStep.symbol})
              </h4>
              <span className="cadence-inversion-badge">
                {isLt ? currentStep.inversionLabelLt : currentStep.inversionLabelEn}
              </span>
            </div>
          </div>
          <div className="cadence-step-tip">
            <span className="cadence-tip-lead">{isLt ? 'Balsų vedimas:' : 'Voice Leading:'}</span>
            <span>{isLt ? currentStep.voiceLeadingTipLt : currentStep.voiceLeadingTipEn}</span>
          </div>
        </div>

        {/* Keyboard Rendering Current Chord Voicing */}
        <div className="cadence-keyboard-wrapper">
          <PianoKeyboard
            voicedNotes={currentStep.notes}
            qualityId={
              currentStep.notes.length === 4
                ? 'dominant7'
                : currentStep.nameEn.toLowerCase().includes('minor')
                ? 'minor'
                : 'major'
            }
            showAllKeyLabels={true}
            isRevealed={true}
            language={language}
            blindMode={false}
            showFingering={true}
          />
        </div>
      </section>
    </div>
  );
};
