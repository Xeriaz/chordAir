import React, { useEffect, useRef } from 'react';
import { PracticeCard } from '../domain/types';

interface FeedbackPanelProps {
  card: PracticeCard;
  selectedOptionId: string;
  onNextCard: () => void;
}

export const FeedbackPanel: React.FC<FeedbackPanelProps> = ({
  card,
  selectedOptionId,
  onNextCard,
}) => {
  const nextBtnRef = useRef<HTMLButtonElement>(null);
  const isCorrect = selectedOptionId === card.correctOptionId;
  const selectedOption = card.options.find((o) => o.id === selectedOptionId);

  useEffect(() => {
    // Move keyboard focus to the "Next Card" button for effortless keyboard/screen-reader flow
    nextBtnRef.current?.focus();
  }, [card.id]);

  const notesList = card.voicedNotes.map((n) => n.noteName).join(' – ');
  const bassNote = card.voicedNotes[0]?.noteName ?? '';

  return (
    <section
      className={`feedback-panel ${
        isCorrect ? 'feedback-panel--correct' : 'feedback-panel--incorrect'
      }`}
      role="region"
      aria-live="polite"
      aria-label="Answer feedback"
    >
      <div className="feedback-content">
        <div className="feedback-header">
          <span className="feedback-icon" aria-hidden="true">
            {isCorrect ? '✓' : '✗'}
          </span>
          <div>
            <h3 className="feedback-title">
              {isCorrect ? (
                <>
                  Spot on! That’s <strong>{card.readableName}</strong>{' '}
                  <span className="feedback-symbol">({card.symbol})</span>
                </>
              ) : (
                <>
                  Not quite — you chose {selectedOption?.readableName ?? 'another chord'}. The
                  correct chord is <strong>{card.readableName}</strong>{' '}
                  <span className="feedback-symbol">({card.symbol})</span>
                </>
              )}
            </h3>
            <p className="feedback-subtitle">{card.quality.description}</p>
          </div>
        </div>

        <div className="feedback-details-grid">
          <div className="feedback-detail-chip">
            <span className="detail-label">Notes played (low → high)</span>
            <span className="detail-value">{notesList}</span>
          </div>

          <div className="feedback-detail-chip">
            <span className="detail-label">Voicing / Position</span>
            <span className="detail-value">
              {card.inversion.name}
              {card.inversion.id !== 'root' ? ` (${bassNote} on the bottom)` : ' (Root on bottom)'}
            </span>
          </div>

          <div className="feedback-detail-chip">
            <span className="detail-label">Keyboard shape</span>
            <span className="detail-value">{card.quality.shapeHint}</span>
          </div>
        </div>
      </div>

      <div className="feedback-actions">
        <button
          ref={nextBtnRef}
          type="button"
          className="next-card-btn"
          onClick={onNextCard}
          aria-label="Next practice card (Shortcut: Enter)"
        >
          <span>Next Card</span>
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  );
};
