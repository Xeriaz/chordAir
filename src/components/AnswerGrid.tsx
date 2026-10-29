import React from 'react';
import { ChordAnswerOption } from '../domain/types';

interface AnswerGridProps {
  options: ChordAnswerOption[];
  selectedOptionId: string | null;
  correctOptionId: string;
  onSelectOption: (optionId: string) => void;
}

export const AnswerGrid: React.FC<AnswerGridProps> = ({
  options,
  selectedOptionId,
  correctOptionId,
  onSelectOption,
}) => {
  const isAnswered = selectedOptionId !== null;

  return (
    <section className="answer-section" aria-labelledby="prompt-heading">
      <div className="prompt-row">
        <h2 id="prompt-heading" className="prompt-heading">
          Which chord is highlighted on the keyboard?
        </h2>
        <span className="keyboard-hint-text" aria-hidden="true">
          Keys 1–{options.length} to answer
        </span>
      </div>

      <div className="answer-grid" role="group" aria-label="Chord answer choices">
        {options.map((option, index) => {
          const isSelected = selectedOptionId === option.id;
          const isCorrect = option.id === correctOptionId;

          let stateClass = '';
          let statusIndicator = null;

          if (isAnswered) {
            if (isCorrect) {
              stateClass = 'answer-btn--correct';
              statusIndicator = (
                <span className="answer-status-badge answer-status-badge--correct">
                  ✓ Correct
                </span>
              );
            } else if (isSelected) {
              stateClass = 'answer-btn--incorrect';
              statusIndicator = (
                <span className="answer-status-badge answer-status-badge--incorrect">
                  ✗ Your pick
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
              aria-label={`Option ${index + 1}: ${option.ariaLabel}${
                isAnswered && isCorrect
                  ? ' — Correct answer'
                  : isAnswered && isSelected
                  ? ' — Incorrect choice'
                  : ''
              }`}
            >
              <span className="answer-shortcut" aria-hidden="true">
                {index + 1}
              </span>

              <span className="answer-main-text">
                <span className="answer-readable-name">{option.readableName}</span>
                <span className="answer-symbol-badge" title="Chord symbol">
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
