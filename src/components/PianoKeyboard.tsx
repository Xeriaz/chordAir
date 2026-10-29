import React from 'react';
import { playChord, playNote } from '../domain/audio';
import { UI_STRINGS, getVoicedRoleLabel } from '../domain/i18n';
import { PIANO_KEYS, getRootNoteName } from '../domain/notes';
import { ChordQualityId, Language, PianoKeyData, VoicedNote } from '../domain/types';

interface PianoKeyboardProps {
  voicedNotes: VoicedNote[];
  qualityId: ChordQualityId;
  showAllKeyLabels: boolean;
  isRevealed: boolean;
  language: Language;
}

const WHITE_KEYS = PIANO_KEYS.filter((k) => !k.noteInfo.isBlack);

/**
 * Computes the horizontal percentage position for each black key across the 14 white keys (C4..B5).
 */
function getBlackKeyLeftPercent(midi: number): number {
  const whiteIndexBefore = WHITE_KEYS.filter((wk) => wk.midi < midi).length;
  const whiteKeyWidthPct = 100 / WHITE_KEYS.length;
  return whiteIndexBefore * whiteKeyWidthPct;
}

export const PianoKeyboard: React.FC<PianoKeyboardProps> = ({
  voicedNotes,
  qualityId,
  showAllKeyLabels,
  isRevealed,
  language,
}) => {
  const t = UI_STRINGS[language];
  const voicedByMidi = new Map<number, VoicedNote>(voicedNotes.map((n) => [n.midi, n]));
  const blackKeys = PIANO_KEYS.filter((k) => k.noteInfo.isBlack);

  const spokenSummary = voicedNotes
    .map((n) => {
      const spoken = language === 'lt' ? n.spokenNameLt : n.spokenName;
      const roleLabel = getVoicedRoleLabel(n, qualityId, language);
      return `${spoken} ${n.octave}${
        isRevealed
          ? ` (${roleLabel})`
          : n.isBass
          ? ` (${t.lowestNoteLegend.toLowerCase()})`
          : ''
      }`;
    })
    .join(', ');

  const renderKeyContent = (key: PianoKeyData, voiced: VoicedNote | undefined) => {
    const isHighlighted = Boolean(voiced);
    const labelText = voiced ? voiced.noteName : getRootNoteName(key.pitchClass);
    const shouldShowLabel = isHighlighted || showAllKeyLabels || key.pitchClass === 0;

    const shortRoleTag =
      voiced?.role === 'root'
        ? language === 'lt'
          ? '1'
          : 'R'
        : voiced?.role === 'third'
        ? '3'
        : voiced?.role === 'fifth'
        ? '5'
        : '7';

    return (
      <span className="key-inner">
        {isHighlighted && (
          <span
            className={`key-marker ${voiced?.isBass ? 'key-marker--bass' : ''}`}
            aria-hidden="true"
            title={voiced?.isBass ? t.lowestNoteTitle : t.chordNoteTitle}
          >
            {voiced?.isBass ? '★' : '●'}
          </span>
        )}
        {shouldShowLabel && (
          <span
            className={`key-label ${isHighlighted ? 'key-label--highlighted' : ''}`}
            aria-hidden="true"
          >
            {labelText}
            {!isHighlighted && key.pitchClass === 0 ? key.octave : ''}
          </span>
        )}
        {isHighlighted && isRevealed && voiced && (
          <span className="key-role-tag" aria-hidden="true">
            {shortRoleTag}
          </span>
        )}
      </span>
    );
  };

  return (
    <section className="keyboard-stage" aria-label={t.pianoKeyboardSectionAria}>
      <div className="keyboard-toolbar">
        <div className="keyboard-legend" aria-hidden="true">
          <span className="legend-item">
            <span className="legend-swatch legend-swatch--bass">★</span> {t.lowestNoteLegend}
          </span>
          <span className="legend-item">
            <span className="legend-swatch legend-swatch--tone">●</span> {t.chordNoteLegend}
          </span>
        </div>

        <button
          type="button"
          className="listen-btn"
          onClick={() => playChord(voicedNotes.map((n) => n.midi))}
          aria-label={t.hearChordAria}
        >
          <span aria-hidden="true">🔊</span> {t.hearChord}
        </button>
      </div>

      {/* Screen reader description of highlighted keys */}
      <p className="sr-only" aria-live="polite">
        {t.highlightedKeysSr(spokenSummary)}
      </p>

      <div className="piano-scroll-container">
        <div className="piano-bed" role="group" aria-label={t.twoOctaveGroupAria}>
          {/* White keys layer */}
          <div className="white-keys-row">
            {WHITE_KEYS.map((key) => {
              const voiced = voicedByMidi.get(key.midi);
              const isHighlighted = Boolean(voiced);
              const spoken =
                language === 'lt' ? key.noteInfo.spokenNameLt : key.noteInfo.spokenName;
              return (
                <button
                  key={key.midi}
                  type="button"
                  onClick={() => playNote(key.midi)}
                  className={`piano-key piano-key--white ${
                    isHighlighted ? 'piano-key--highlighted' : ''
                  } ${voiced?.isBass ? 'piano-key--bass' : ''}`}
                  aria-pressed={isHighlighted}
                  aria-label={t.keyAria(spoken, key.octave, isHighlighted, Boolean(voiced?.isBass))}
                >
                  {renderKeyContent(key, voiced)}
                </button>
              );
            })}
          </div>

          {/* Black keys overlay layer */}
          <div className="black-keys-layer">
            {blackKeys.map((key) => {
              const voiced = voicedByMidi.get(key.midi);
              const isHighlighted = Boolean(voiced);
              const leftPct = getBlackKeyLeftPercent(key.midi);
              const spoken =
                language === 'lt' ? key.noteInfo.spokenNameLt : key.noteInfo.spokenName;
              return (
                <button
                  key={key.midi}
                  type="button"
                  style={{ left: `${leftPct}%` }}
                  onClick={() => playNote(key.midi)}
                  className={`piano-key piano-key--black ${
                    isHighlighted ? 'piano-key--highlighted' : ''
                  } ${voiced?.isBass ? 'piano-key--bass' : ''}`}
                  aria-pressed={isHighlighted}
                  aria-label={t.keyAria(spoken, key.octave, isHighlighted, Boolean(voiced?.isBass))}
                >
                  {renderKeyContent(key, voiced)}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
