import React from 'react';
import { INVERSIONS, LEVEL_PRESETS } from '../domain/chords';
import { PracticeSettings, SessionStats } from '../domain/types';

interface HeaderProps {
  settings: PracticeSettings;
  stats: SessionStats;
  onOpenSettings: () => void;
  onResetStats: () => void;
  onToggleLabels: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  stats,
  onOpenSettings,
  onResetStats,
  onToggleLabels,
}) => {
  const presetObj = LEVEL_PRESETS.find((p) => p.id === settings.preset);
  const levelLabel = presetObj ? presetObj.name : 'Custom';

  const inversionSummary =
    settings.enabledInversions.length === 1
      ? INVERSIONS[settings.enabledInversions[0]].shortLabel
      : `${settings.enabledInversions.length} voicings`;

  const accuracy =
    stats.completed > 0 ? Math.round((stats.correct / stats.completed) * 100) : null;

  return (
    <header className="top-bar">
      <div className="brand-group">
        <div className="brand-logo" aria-hidden="true">
          <span className="logo-key logo-key--active" />
          <span className="logo-key" />
          <span className="logo-key logo-key--active" />
        </div>
        <div>
          <h1 className="brand-title">ChordAir</h1>
          <button
            type="button"
            className="level-badge-btn"
            onClick={onOpenSettings}
            aria-label={`Current level: ${levelLabel}, ${inversionSummary}. Click to change chord settings.`}
          >
            <span className="level-dot" aria-hidden="true" />
            <span>{levelLabel}</span>
            <span className="level-sep" aria-hidden="true">
              ·
            </span>
            <span>{inversionSummary}</span>
          </button>
        </div>
      </div>

      <div className="top-bar-right">
        <div
          className="stats-pill"
          role="status"
          aria-live="polite"
          aria-label={`Session progress: ${stats.correct} correct out of ${stats.completed} completed${
            accuracy !== null ? `, ${accuracy}% accuracy` : ''
          }, streak ${stats.streak}`}
        >
          <div className="stat-item">
            <span className="stat-label">Score</span>
            <span className="stat-value">
              {stats.correct}
              <span className="stat-total">/{stats.completed}</span>
            </span>
          </div>
          {accuracy !== null && (
            <div className="stat-item stat-item--hide-xs">
              <span className="stat-label">Accuracy</span>
              <span className="stat-value">{accuracy}%</span>
            </div>
          )}
          <div className="stat-item">
            <span className="stat-label">Streak</span>
            <span className="stat-value">🔥 {stats.streak}</span>
          </div>
          {stats.completed > 0 && (
            <button
              type="button"
              className="reset-stats-btn"
              onClick={onResetStats}
              title="Reset session progress"
              aria-label="Reset session progress"
            >
              ↺
            </button>
          )}
        </div>

        <div className="action-buttons">
          <button
            type="button"
            className={`icon-btn ${settings.showAllKeyLabels ? 'icon-btn--active' : ''}`}
            onClick={onToggleLabels}
            aria-pressed={settings.showAllKeyLabels}
            title="Toggle note names on all piano keys"
          >
            <span aria-hidden="true">ABC</span>
            <span className="sr-only">Show note names on all keys</span>
          </button>

          <button
            type="button"
            className="settings-trigger-btn"
            onClick={onOpenSettings}
            aria-label="Open chord and practice settings"
          >
            <span aria-hidden="true">⚙</span>
            <span className="settings-btn-text">Settings</span>
          </button>
        </div>
      </div>
    </header>
  );
};
