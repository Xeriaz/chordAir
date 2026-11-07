import React from 'react';
import { UI_STRINGS, getInversionText, getPresetText } from '../domain/i18n';
import { PracticeSettings, SessionStats } from '../domain/types';

export type AppView = 'practice' | 'guide' | 'rhythm';

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
  const lang = settings.language ?? 'en';
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
          <div
            className="stats-pill"
            role="status"
            aria-live="polite"
            aria-label={t.sessionProgressAria(stats.correct, stats.completed, accuracy, stats.streak)}
          >
            <div className="stat-item">
              <span className="stat-label">{t.score}</span>
              <span className="stat-value">
                {stats.correct}
                <span className="stat-total">/{stats.completed}</span>
              </span>
            </div>
            {accuracy !== null && (
              <div className="stat-item stat-item--hide-xs">
                <span className="stat-label">{t.accuracy}</span>
                <span className="stat-value">{accuracy}%</span>
              </div>
            )}
            <div className="stat-item">
              <span className="stat-label">{t.streak}</span>
              <span className="stat-value">🔥 {stats.streak}</span>
            </div>
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

      <nav className="view-nav-bar" aria-label={t.mainNavAria} role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeView === 'practice'}
          className={`view-nav-btn view-nav-btn--practice ${
            activeView === 'practice' ? 'view-nav-btn--active' : ''
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
          aria-selected={activeView === 'guide'}
          className={`view-nav-btn view-nav-btn--theory ${
            activeView === 'guide' ? 'view-nav-btn--active' : ''
          }`}
          onClick={() => onSelectView('guide')}
          aria-label={t.theoryTabAria}
        >
          <span className="view-nav-icon" aria-hidden="true">📖</span>
          <span className="view-nav-text">{t.theoryTab}</span>
          <span className="view-nav-badge">{lang === 'lt' ? 'Gidas' : 'Guide'}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeView === 'rhythm'}
          className={`view-nav-btn view-nav-btn--rhythm ${
            activeView === 'rhythm' ? 'view-nav-btn--active' : ''
          }`}
          onClick={() => onSelectView('rhythm')}
          aria-label={t.rhythmTabAria}
        >
          <span className="view-nav-icon" aria-hidden="true">⏱️</span>
          <span className="view-nav-text">{t.rhythmTab}</span>
        </button>
      </nav>
    </header>
  );
};
