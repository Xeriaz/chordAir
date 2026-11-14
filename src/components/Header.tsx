import React, { useEffect, useRef, useState } from 'react';
import { UI_STRINGS, getInversionText, getPresetText } from '../domain/i18n';
import { PracticeSettings, SessionStats } from '../domain/types';

export type AppView = 'practice' | 'guide' | 'rhythm' | 'sheet-music';

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const lang = settings.language ?? 'lt';
  const t = UI_STRINGS[lang];

  // Close dropdown menu when clicking outside or pressing Escape
  useEffect(() => {
    if (!isMenuOpen) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

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
  const isBookActive = activeView === 'sheet-music';
  const isTheoryActive = activeView === 'guide';
  const isRhythmActive = activeView === 'rhythm';

  const handleSelectNavView = (view: AppView) => {
    onSelectView(view);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="top-header-area">
      <div className="top-bar">
        <div className="brand-group">
          <div
            className="brand-logo"
            aria-hidden="true"
            onClick={() => {
              if (activeView !== 'practice') handleSelectNavView('practice');
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
            {/* Unified Lessons & Navigation Dropdown Menu */}
            <div className="nav-menu-wrapper" ref={menuRef}>
              <button
                type="button"
                className={`icon-btn menu-trigger-btn ${isMenuOpen ? 'icon-btn--active' : ''}`}
                onClick={() => setIsMenuOpen((prev) => !prev)}
                aria-expanded={isMenuOpen}
                aria-haspopup="true"
                title={t.lessonsMenuTitle}
                aria-label={t.lessonsMenuAria}
              >
                <span aria-hidden="true" className="menu-trigger-icon">☰</span>
                <span className="menu-btn-text">{t.lessonsMenuButton}</span>
              </button>

              {isMenuOpen && (
                <div className="nav-dropdown-menu" role="menu" aria-label={t.lessonsMenuTitle}>
                  <div className="nav-dropdown-header">
                    <span className="nav-dropdown-title">{t.lessonsMenuTitle}</span>
                    <button
                      type="button"
                      className="nav-dropdown-close-btn"
                      onClick={() => setIsMenuOpen(false)}
                      aria-label={t.closeMenuAria}
                    >
                      ✕
                    </button>
                  </div>

                  <div className="nav-dropdown-items">
                    <button
                      type="button"
                      role="menuitem"
                      className={`nav-dropdown-item ${isPracticeActive ? 'nav-dropdown-item--active' : ''}`}
                      onClick={() => handleSelectNavView('practice')}
                    >
                      <span className="nav-dropdown-item-icon" aria-hidden="true">🎹</span>
                      <div className="nav-dropdown-item-info">
                        <span className="nav-dropdown-item-title">{t.practiceTab}</span>
                        <span className="nav-dropdown-item-desc">{t.navPracticeSubtitle}</span>
                      </div>
                      {isPracticeActive && <span className="nav-dropdown-active-dot" aria-hidden="true" />}
                    </button>

                    <button
                      type="button"
                      role="menuitem"
                      className={`nav-dropdown-item ${isBookActive ? 'nav-dropdown-item--active' : ''}`}
                      onClick={() => handleSelectNavView('sheet-music')}
                    >
                      <span className="nav-dropdown-item-icon" aria-hidden="true">📖</span>
                      <div className="nav-dropdown-item-info">
                        <div className="nav-dropdown-item-title-row">
                          <span className="nav-dropdown-item-title">{t.bookAndSheetTab}</span>
                          <span className="view-nav-badge view-nav-badge--gold">216 p.</span>
                        </div>
                        <span className="nav-dropdown-item-desc">{t.navBookSubtitle}</span>
                      </div>
                      {isBookActive && <span className="nav-dropdown-active-dot" aria-hidden="true" />}
                    </button>

                    <button
                      type="button"
                      role="menuitem"
                      className={`nav-dropdown-item ${isTheoryActive ? 'nav-dropdown-item--active' : ''}`}
                      onClick={() => handleSelectNavView('guide')}
                    >
                      <span className="nav-dropdown-item-icon" aria-hidden="true">🎼</span>
                      <div className="nav-dropdown-item-info">
                        <span className="nav-dropdown-item-title">{t.theoryTab}</span>
                        <span className="nav-dropdown-item-desc">{t.navTheorySubtitle}</span>
                      </div>
                      {isTheoryActive && <span className="nav-dropdown-active-dot" aria-hidden="true" />}
                    </button>

                    <button
                      type="button"
                      role="menuitem"
                      className={`nav-dropdown-item ${isRhythmActive ? 'nav-dropdown-item--active' : ''}`}
                      onClick={() => handleSelectNavView('rhythm')}
                    >
                      <span className="nav-dropdown-item-icon" aria-hidden="true">🥁</span>
                      <div className="nav-dropdown-item-info">
                        <span className="nav-dropdown-item-title">{t.rhythmTab}</span>
                        <span className="nav-dropdown-item-desc">{t.navRhythmSubtitle}</span>
                      </div>
                      {isRhythmActive && <span className="nav-dropdown-active-dot" aria-hidden="true" />}
                    </button>

                    <div className="nav-dropdown-divider" role="separator" />

                    <button
                      type="button"
                      role="menuitem"
                      className="nav-dropdown-item nav-dropdown-item--settings"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onOpenSettings();
                      }}
                    >
                      <span className="nav-dropdown-item-icon" aria-hidden="true">⚙️</span>
                      <div className="nav-dropdown-item-info">
                        <span className="nav-dropdown-item-title">{t.settingsButton}</span>
                        <span className="nav-dropdown-item-desc">{levelLabel} · {inversionSummary}</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

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

      {/* Primary consolidated 4-view navigation bar (desktop top bar & mobile thumb-friendly bar) */}
      <nav className="view-nav-bar bottom-nav-bar" aria-label={t.mainNavAria} role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={isPracticeActive}
          className={`view-nav-btn view-nav-btn--practice ${
            isPracticeActive ? 'view-nav-btn--active' : ''
          }`}
          onClick={() => handleSelectNavView('practice')}
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
          onClick={() => handleSelectNavView('sheet-music')}
          aria-label={t.bookAndSheetTabAria}
        >
          <span className="view-nav-icon" aria-hidden="true">📖</span>
          <span className="view-nav-text">{t.bookAndSheetTab}</span>
          <span className="view-nav-badge view-nav-badge--gold">216 p.</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={isTheoryActive}
          className={`view-nav-btn view-nav-btn--theory ${
            isTheoryActive ? 'view-nav-btn--active' : ''
          }`}
          onClick={() => handleSelectNavView('guide')}
          aria-label={t.theoryTabAria}
        >
          <span className="view-nav-icon" aria-hidden="true">🎼</span>
          <span className="view-nav-text">{t.theoryTab}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={isRhythmActive}
          className={`view-nav-btn view-nav-btn--rhythm ${
            isRhythmActive ? 'view-nav-btn--active' : ''
          }`}
          onClick={() => handleSelectNavView('rhythm')}
          aria-label={t.rhythmTabAria}
        >
          <span className="view-nav-icon" aria-hidden="true">🥁</span>
          <span className="view-nav-text">{t.rhythmTab}</span>
        </button>
      </nav>
    </header>
  );
};
