import React from 'react';
import { playChord, playNote } from '../domain/audio';
import { PIANO_KEYS, getRootNoteName } from '../domain/notes';
import { PianoKeyData, VoicedNote } from '../domain/types';

interface PianoKeyboardProps {
  voicedNotes: VoicedNote[];
  showAllKeyLabels: boolean;
  isRevealed: boolean;
}

const WHITE_KEYS = PIANO_KEYS.filter((k) => !k.noteInfo.isBlack);

/**
 * Computes the horizontal percentage position for each black key across the 14 white keys (C4..B5).
 */
function getBlackKeyLeftPercent(midi: number): number {
  // Count how many white keys appear before this black key
  const whiteIndexBefore = WHITE_KEYS.filter((wk) => wk.midi < midi).length;
  const whiteKeyWidthPct = 100 / WHITE_KEYS.length;
  return whiteIndexBefore * whiteKeyWidthPct;
}

export const PianoKeyboard: React.FC<PianoKeyboardProps> = ({
  voicedNotes,
  showAllKeyLabels,
  isRevealed,
}) => {
  const voicedByMidi = new Map<number, VoicedNote>(voicedNotes.map((n) => [n.midi, n]));
  const blackKeys = PIANO_KEYS.filter((k) => k.noteInfo.isBlack);

  const spokenSummary = voicedNotes
    .map(
      (n) =>
        `${n.spokenName} ${n.octave}${
          isRevealed ? ` (${n.roleLabel})` : n.isBass ? ' (lowest note)' : ''
        }`
    )
    .join(', ');

  const renderKeyContent = (key: PianoKeyData, voiced: VoicedNote | undefined) => {
    const isHighlighted = Boolean(voiced);
    const labelText = voiced ? voiced.noteName : getRootNoteName(key.pitchClass);
    const shouldShowLabel = isHighlighted || showAllKeyLabels || key.pitchClass === 0;

    return (
      <span className="key-inner">
        {isHighlighted && (
          <span
            className={`key-marker ${voiced?.isBass ? 'key-marker--bass' : ''}`}
            aria-hidden="true"
            title={voiced?.isBass ? 'Lowest note (bass)' : 'Chord note'}
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
            {voiced.role === 'root' ? 'R' : voiced.role === 'third' ? '3' : voiced.role === 'fifth' ? '5' : '7'}
          </span>
        )}
      </span>
    );
  };

  return (
    <section className="keyboard-stage" aria-label="Piano keyboard">
      <div className="keyboard-toolbar">
        <div className="keyboard-legend" aria-hidden="true">
          <span className="legend-item">
            <span className="legend-swatch legend-swatch--bass">★</span> Lowest note
          </span>
          <span className="legend-item">
            <span className="legend-swatch legend-swatch--tone">●</span> Chord note
          </span>
        </div>

        <button
          type="button"
          className="listen-btn"
          onClick={() => playChord(voicedNotes.map((n) => n.midi))}
          aria-label="Play highlighted chord sound (Shortcut: Space)"
        >
          <span aria-hidden="true">🔊</span> Hear chord
        </button>
      </div>

      {/* Screen reader description of highlighted keys */}
      <p className="sr-only" aria-live="polite">
        Highlighted piano keys from lowest to highest: {spokenSummary}.
      </p>

      <div className="piano-scroll-container">
        <div className="piano-bed" role="group" aria-label="Two-octave piano keyboard from C4 to B5">
          {/* White keys layer */}
          <div className="white-keys-row">
            {WHITE_KEYS.map((key) => {
              const voiced = voicedByMidi.get(key.midi);
              const isHighlighted = Boolean(voiced);
              return (
                <button
                  key={key.midi}
                  type="button"
                  onClick={() => playNote(key.midi)}
                  className={`piano-key piano-key--white ${
                    isHighlighted ? 'piano-key--highlighted' : ''
                  } ${voiced?.isBass ? 'piano-key--bass' : ''}`}
                  aria-pressed={isHighlighted}
                  aria-label={`${key.noteInfo.spokenName} ${key.octave}${
                    isHighlighted
                      ? `, highlighted chord note${voiced?.isBass ? ', lowest note' : ''}`
                      : ''
                  }`}
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
                  aria-label={`${key.noteInfo.spokenName} ${key.octave}${
                    isHighlighted
                      ? `, highlighted chord note${voiced?.isBass ? ', lowest note' : ''}`
                      : ''
                  }`}
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
