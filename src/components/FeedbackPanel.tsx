import React, { useEffect, useRef } from 'react';
import {
  UI_STRINGS,
  formatChordReadableName,
  getInversionText,
  getQualityText,
} from '../domain/i18n';
import { Language, PracticeCard } from '../domain/types';

interface FeedbackPanelProps {
  card: PracticeCard;
  selectedOptionId: string;
  language: Language;
  onNextCard: () => void;
}

export const FeedbackPanel: React.FC<FeedbackPanelProps> = ({
  card,
  selectedOptionId,
  language,
  onNextCard,
}) => {
  const nextBtnRef = useRef<HTMLButtonElement>(null);
  const t = UI_STRINGS[language];
  const isCorrect = selectedOptionId === card.correctOptionId;
  const selectedOption = card.options.find((o) => o.id === selectedOptionId);

  useEffect(() => {
    nextBtnRef.current?.focus();
  }, [card.id]);

  const notesList = card.voicedNotes.map((n) => n.noteName).join(' – ');
  const bassNote = card.voicedNotes[0]?.noteName ?? '';

  const correctReadableName = formatChordReadableName(
    card.rootPitchClass,
    card.quality.id,
    language
  );
  const chosenReadableName = selectedOption
    ? formatChordReadableName(
        selectedOption.rootPitchClass,
        selectedOption.qualityId,
        language
      )
    : t.anotherChord;

  const qualityText = getQualityText(card.quality.id, language);
  const inversionText = getInversionText(card.inversion.id, language);

  return (
    <section
      className={`feedback-panel ${
        isCorrect ? 'feedback-panel--correct' : 'feedback-panel--incorrect'
      }`}
      role="region"
      aria-live="polite"
      aria-label={t.answerFeedbackAria}
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
                  {t.correctTitlePrefix} <strong>{correctReadableName}</strong>{' '}
                  <span className="feedback-symbol">({card.symbol})</span>
                </>
              ) : (
                <>
                  {t.incorrectTitlePrefix(chosenReadableName)}{' '}
                  <strong>{correctReadableName}</strong>{' '}
                  <span className="feedback-symbol">({card.symbol})</span>
                </>
              )}
            </h3>
            <p className="feedback-subtitle">{qualityText.description}</p>
          </div>
        </div>

        <div className="feedback-details-grid">
          <div className="feedback-detail-chip">
            <span className="detail-label">{t.notesPlayedLabel}</span>
            <span className="detail-value">{notesList}</span>
          </div>

          <div className="feedback-detail-chip">
            <span className="detail-label">{t.voicingPositionLabel}</span>
            <span className="detail-value">
              {inversionText.name}{' '}
              {card.inversion.id !== 'root' ? t.bassOnBottom(bassNote) : t.rootOnBottom}
            </span>
          </div>

          <div className="feedback-detail-chip">
            <span className="detail-label">{t.keyboardShapeLabel}</span>
            <span className="detail-value">{qualityText.shapeHint}</span>
          </div>
        </div>
      </div>

      <div className="feedback-actions">
        <button
          ref={nextBtnRef}
          type="button"
          className="next-card-btn"
          onClick={onNextCard}
          aria-label={t.nextCardAria}
        >
          <span>{t.nextCardButton}</span>
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  );
};
