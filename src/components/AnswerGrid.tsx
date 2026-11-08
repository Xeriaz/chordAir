import React from 'react';
import {
  UI_STRINGS,
  formatChordAriaLabel,
  formatChordReadableName,
} from '../domain/i18n';
import { ChordAnswerOption, Language, PracticeSettings } from '../domain/types';

interface AnswerGridProps {
  options: ChordAnswerOption[];
  selectedOptionId: string | null;
  correctOptionId: string;
  language: Language;
  preset?: PracticeSettings['preset'];
  onSelectOption: (optionId: string) => void;
}

export const AnswerGrid: React.FC<AnswerGridProps> = ({
  options,
  selectedOptionId,
  correctOptionId,
  language,
  preset = 'beginner',
  onSelectOption,
}) => {
  const t = UI_STRINGS[language];
  const isAnswered = selectedOptionId !== null;
  const isBeginner = preset === 'beginner';

  return (
    <section className="answer-section" aria-labelledby="prompt-heading">
      <div className="prompt-row">
        <h2 id="prompt-heading" className="prompt-heading">
          {t.promptHeading}
        </h2>
        {!isBeginner && (
          <span className="keyboard-hint-text" aria-hidden="true">
            {t.keysHint(options.length)}
          </span>
        )}
      </div>

      <div className="answer-grid" role="group" aria-label={t.answerChoicesGroupAria}>
        {options.map((option, index) => {
          const isSelected = selectedOptionId === option.id;
          const isCorrect = option.id === correctOptionId;

          const baseReadableName = formatChordReadableName(
            option.rootPitchClass,
            option.qualityId,
            language
          );

          // For the beginner preset, replace confusing digits with musical/emotional cues in Lithuanian / English
          const emotionCue =
            option.qualityId === 'major'
              ? (language === 'lt' ? 'šviesus · džiugus' : 'bright · happy')
              : option.qualityId === 'minor'
              ? (language === 'lt' ? 'švelnus · liūdnas' : 'warm · sad')
              : null;

          const localizedReadableName =
            isBeginner && emotionCue
              ? `${baseReadableName} (${emotionCue})`
              : baseReadableName;

          const localizedAriaLabel = formatChordAriaLabel(
            option.rootPitchClass,
            option.qualityId,
            option.symbol,
            language
          );

          // Confusing digits 1-4 are replaced by musical icons in beginner preset to prevent fingering confusion
          const shortcutDisplay = isBeginner
            ? option.qualityId === 'major'
              ? '☀️'
              : option.qualityId === 'minor'
              ? '🌙'
              : '♪'
            : index + 1;

          let stateClass = '';
          let statusIndicator = null;
          let ariaStatus: 'correct' | 'incorrect' | null = null;

          if (isAnswered) {
            if (isCorrect) {
              stateClass = 'answer-btn--correct';
              ariaStatus = 'correct';
              statusIndicator = (
                <span className="answer-status-badge answer-status-badge--correct">
                  {t.correctBadge}
                </span>
              );
            } else if (isSelected) {
              stateClass = 'answer-btn--incorrect';
              ariaStatus = 'incorrect';
              statusIndicator = (
                <span className="answer-status-badge answer-status-badge--incorrect">
                  {t.yourPickBadge}
                </span>
              );
            } else {
              stateClass = 'answer-btn--dimmed';
            }
          }

          return (
            <button
              key={option.id}
              type="button"
              disabled={isAnswered}
              onClick={() => onSelectOption(option.id)}
              className={`answer-btn ${stateClass}`}
              aria-label={t.optionAria(index + 1, localizedAriaLabel, ariaStatus)}
            >
              <span
                className={`answer-shortcut ${isBeginner ? 'answer-shortcut--icon' : ''}`}
                aria-hidden="true"
              >
                {shortcutDisplay}
              </span>

              <span className="answer-main-text">
                <span className="answer-readable-name">{localizedReadableName}</span>
                <span className="answer-symbol-badge" title={t.chordSymbolTitle}>
                  {option.symbol}
                </span>
              </span>

              {statusIndicator}
            </button>
          );
        })}
      </div>
    </section>
  );
};
