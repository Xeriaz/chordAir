import React from 'react';
import { UI_STRINGS, getInversionText, getPresetText } from '../domain/i18n';
import { PracticeSettings, SessionStats } from '../domain/types';

export type AppView = 'practice' | 'guide' | 'rhythm' | 'book-theory' | 'sheet-music';

interface HeaderProps {
  settings: PracticeSettings;
  stats: SessionStats;
  activeView: AppView;
  onSelectView: (view: AppView) => void;
  onOpenSettings: () => void;
  onResetStats: () => void;
  onToggleLabels: () => void;
  onToggleLanguage: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  stats,
  activeView,
  onSelectView,
  onOpenSettings,
  onResetStats,
  onToggleLabels,
  onToggleLanguage,
}) => {
  const lang = settings.language ?? 'lt';
  const t = UI_STRINGS[lang];

  const levelLabel =
    settings.preset === 'custom'
      ? t.customPresetName
      : getPresetText(settings.preset, lang).name;

  const inversionSummary =
    settings.enabledInversions.length === 1
      ? getInversionText(settings.enabledInversions[0], lang).shortLabel
      : t.voicingsCount(settings.enabledInversions.length);

  const accuracy =
    stats.completed > 0 ? Math.round((stats.correct / stats.completed) * 100) : null;

  const isPracticeActive = activeView === 'practice';
  const isBookActive = activeView === 'book-theory' || activeView === 'sheet-music';

  return (
    <header className="top-header-area">
      <div className="top-bar">
        <div className="brand-group">
          <div
            className="brand-logo"
            aria-hidden="true"
            onClick={() => {
              if (activeView !== 'practice') onSelectView('practice');
            }}
            style={{ cursor: activeView !== 'practice' ? 'pointer' : 'default' }}
            title={activeView !== 'practice' ? (lang === 'lt' ? 'Grįžti į treniruotę' : 'Back to practice') : undefined}
          >
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
              aria-label={t.currentLevelAria(levelLabel, inversionSummary)}
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
          {/* De-emphasized, non-punitive compact session stats */}
          <div
            className="stats-pill"
            role="status"
            aria-live="polite"
            aria-label={t.sessionProgressAria(stats.correct, stats.completed, accuracy, stats.streak)}
          >
            <div className="stat-item stat-item--friendly">
              <span className="stat-friendly-icon" aria-hidden="true">✓</span>
              <span className="stat-value">
                {stats.correct}
                {stats.completed > 0 && <span className="stat-total">/{stats.completed}</span>}
              </span>
            </div>

            {stats.streak >= 2 && (
              <div className="stat-item stat-item--streak" title={t.streakCelebration(stats.streak)}>
                <span className="stat-streak-flame" aria-hidden="true">🔥</span>
                <span className="stat-streak-num">{stats.streak}</span>
              </div>
            )}

            {stats.completed > 0 && (
              <button
                type="button"
                className="reset-stats-btn"
                onClick={onResetStats}
                title={t.resetProgress}
                aria-label={t.resetProgress}
              >
                ↺
              </button>
            )}
          </div>

          <div className="action-buttons">
            <button
              type="button"
              className="icon-btn lang-toggle-btn"
              onClick={onToggleLanguage}
              title={t.switchLanguageTitle}
              aria-label={t.switchLanguageTitle}
            >
              <span className={lang === 'en' ? 'lang-code--active' : 'lang-code--inactive'}>EN</span>
              <span className="lang-divider" aria-hidden="true">
                /
              </span>
              <span className={lang === 'lt' ? 'lang-code--active' : 'lang-code--inactive'}>LT</span>
            </button>

            <button
              type="button"
              className={`icon-btn ${settings.showAllKeyLabels ? 'icon-btn--active' : ''}`}
              onClick={onToggleLabels}
              aria-pressed={settings.showAllKeyLabels}
              title={t.toggleLabelsTitle}
            >
              <span aria-hidden="true">ABC</span>
              <span className="sr-only">{t.toggleLabelsSr}</span>
            </button>

            <button
              type="button"
              className="settings-trigger-btn"
              onClick={onOpenSettings}
              aria-label={t.openSettingsAria}
            >
              <span aria-hidden="true">⚙</span>
              <span className="settings-btn-text">{t.settingsButton}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary consolidated 2-mode navigation (desktop top bar & mobile thumb-friendly bottom bar) */}
      <nav className="view-nav-bar bottom-nav-bar" aria-label={t.mainNavAria} role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={isPracticeActive}
          className={`view-nav-btn view-nav-btn--practice ${
            isPracticeActive ? 'view-nav-btn--active' : ''
          }`}
          onClick={() => onSelectView('practice')}
          aria-label={t.practiceTabAria}
        >
          <span className="view-nav-icon" aria-hidden="true">🎹</span>
          <span className="view-nav-text">{t.practiceTab}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={isBookActive}
          className={`view-nav-btn view-nav-btn--book ${
            isBookActive ? 'view-nav-btn--active' : ''
          }`}
          onClick={() => {
            if (!isBookActive) {
              onSelectView('book-theory');
            }
          }}
          aria-label={t.bookAndSheetTabAria}
        >
          <span className="view-nav-icon" aria-hidden="true">📖</span>
          <span className="view-nav-text">{t.bookAndSheetTab}</span>
          <span className="view-nav-badge view-nav-badge--gold">216 p.</span>
        </button>
      </nav>
    </header>
  );
};
