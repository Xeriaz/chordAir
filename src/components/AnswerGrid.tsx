import React from 'react';
import {
  UI_STRINGS,
  formatChordAriaLabel,
  formatChordReadableName,
} from '../domain/i18n';
import { ChordAnswerOption, Language } from '../domain/types';

interface AnswerGridProps {
  options: ChordAnswerOption[];
  selectedOptionId: string | null;
  correctOptionId: string;
  language: Language;
  onSelectOption: (optionId: string) => void;
}

export const AnswerGrid: React.FC<AnswerGridProps> = ({
  options,
  selectedOptionId,
  correctOptionId,
  language,
  onSelectOption,
}) => {
  const t = UI_STRINGS[language];
  const isAnswered = selectedOptionId !== null;

  return (
    <section className="answer-section" aria-labelledby="prompt-heading">
      <div className="prompt-row">
        <h2 id="prompt-heading" className="prompt-heading">
          {t.promptHeading}
        </h2>
        <span className="keyboard-hint-text" aria-hidden="true">
          {t.keysHint(options.length)}
        </span>
      </div>

      <div className="answer-grid" role="group" aria-label={t.answerChoicesGroupAria}>
        {options.map((option, index) => {
          const isSelected = selectedOptionId === option.id;
          const isCorrect = option.id === correctOptionId;

          const localizedReadableName = formatChordReadableName(
            option.rootPitchClass,
            option.qualityId,
            language
          );
          const localizedAriaLabel = formatChordAriaLabel(
            option.rootPitchClass,
            option.qualityId,
            option.symbol,
            language
          );

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
              <span className="answer-shortcut" aria-hidden="true">
                {index + 1}
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
