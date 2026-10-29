import React, { useEffect, useRef } from 'react';
import {
  LEVEL_PRESETS,
  ORDERED_CHORD_QUALITIES,
  ORDERED_INVERSIONS,
  detectPresetForQualities,
} from '../domain/chords';
import {
  UI_STRINGS,
  getInversionText,
  getPresetText,
  getQualityText,
} from '../domain/i18n';
import {
  ChordQualityId,
  InversionId,
  Language,
  LevelPresetId,
  PracticeSettings,
} from '../domain/types';

interface SettingsModalProps {
  isOpen: boolean;
  settings: PracticeSettings;
  onUpdateSettings: (next: PracticeSettings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  settings,
  onUpdateSettings,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const lang: Language = settings.language ?? 'en';
  const t = UI_STRINGS[lang];

  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeBtnRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const hasSeventhSelected = settings.enabledQualities.some(
    (q) => ORDERED_CHORD_QUALITIES.find((def) => def.id === q)?.category === 'seventh'
  );

  const handleSelectLanguage = (nextLang: Language) => {
    onUpdateSettings({
      ...settings,
      language: nextLang,
    });
  };

  const handleSelectPreset = (presetId: Exclude<LevelPresetId, 'custom'>) => {
    const found = LEVEL_PRESETS.find((p) => p.id === presetId);
    if (!found) return;
    onUpdateSettings({
      ...settings,
      preset: presetId,
      enabledQualities: [...found.qualities],
    });
  };

  const handleToggleQuality = (qualityId: ChordQualityId) => {
    const isCurrentlyEnabled = settings.enabledQualities.includes(qualityId);
    if (isCurrentlyEnabled && settings.enabledQualities.length <= 1) {
      return;
    }

    const nextQualities = isCurrentlyEnabled
      ? settings.enabledQualities.filter((q) => q !== qualityId)
      : [...settings.enabledQualities, qualityId];

    onUpdateSettings({
      ...settings,
      preset: detectPresetForQualities(nextQualities),
      enabledQualities: nextQualities,
    });
  };

  const handleToggleInversion = (inversionId: InversionId) => {
    const isCurrentlyEnabled = settings.enabledInversions.includes(inversionId);
    if (isCurrentlyEnabled && settings.enabledInversions.length <= 1) {
      return;
    }

    const nextInversions = isCurrentlyEnabled
      ? settings.enabledInversions.filter((inv) => inv !== inversionId)
      : [...settings.enabledInversions, inversionId];

    onUpdateSettings({
      ...settings,
      enabledInversions: nextInversions,
    });
  };

  const triads = ORDERED_CHORD_QUALITIES.filter((q) => q.category === 'triad');
  const sevenths = ORDERED_CHORD_QUALITIES.filter((q) => q.category === 'seventh');

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="settings-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-modal-title"
      >
        <div className="modal-header">
          <div>
            <h2 id="settings-modal-title" className="modal-title">
              {t.settingsModalTitle}
            </h2>
            <p className="modal-subtitle">{t.settingsModalSubtitle}</p>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label={t.closeSettingsAria}
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          {/* Language Switcher */}
          <section className="settings-section" aria-labelledby="lang-heading">
            <h3 id="lang-heading" className="settings-section-title">
              {t.languageSectionTitle}
            </h3>
            <div className="language-selector-row" role="radiogroup" aria-labelledby="lang-heading">
              <button
                type="button"
                role="radio"
                aria-checked={lang === 'en'}
                onClick={() => handleSelectLanguage('en')}
                className={`lang-option-btn ${lang === 'en' ? 'lang-option-btn--active' : ''}`}
              >
                <span className="lang-option-code">EN</span>
                <span>English</span>
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={lang === 'lt'}
                onClick={() => handleSelectLanguage('lt')}
                className={`lang-option-btn ${lang === 'lt' ? 'lang-option-btn--active' : ''}`}
              >
                <span className="lang-option-code">LT</span>
                <span>Lietuvių</span>
              </button>
            </div>
          </section>

          {/* 1. Level Presets */}
          <section className="settings-section" aria-labelledby="preset-heading">
            <h3 id="preset-heading" className="settings-section-title">
              {t.practiceLevelTitle}
            </h3>
            <div className="preset-grid" role="radiogroup" aria-labelledby="preset-heading">
              {LEVEL_PRESETS.map((preset) => {
                const isActive = settings.preset === preset.id;
                const pText = getPresetText(preset.id, lang);
                return (
                  <button
                    key={preset.id}
                    type="button"
                    role="radio"
                    aria-checked={isActive}
                    onClick={() => handleSelectPreset(preset.id)}
                    className={`preset-card ${isActive ? 'preset-card--active' : ''}`}
                  >
                    <div className="preset-card-top">
                      <span className="preset-name">{pText.name}</span>
                      <span className="preset-badge">{pText.badge}</span>
                    </div>
                    <p className="preset-desc">{pText.description}</p>
                  </button>
                );
              })}

              <button
                type="button"
                role="radio"
                aria-checked={settings.preset === 'custom'}
                onClick={() =>
                  onUpdateSettings({
                    ...settings,
                    preset: 'custom',
                  })
                }
                className={`preset-card ${
                  settings.preset === 'custom' ? 'preset-card--active' : ''
                }`}
              >
                <div className="preset-card-top">
                  <span className="preset-name">{t.customPresetName}</span>
                  <span className="preset-badge">
                    {t.selectedCountBadge(settings.enabledQualities.length)}
                  </span>
                </div>
                <p className="preset-desc">{t.customPresetDesc}</p>
              </button>
            </div>
          </section>

          {/* 2. Individual Chord Types */}
          <section className="settings-section" aria-labelledby="chord-types-heading">
            <div className="section-header-inline">
              <h3 id="chord-types-heading" className="settings-section-title">
                {t.includedChordTypesTitle}
              </h3>
              <span className="section-helper">{t.plainNamesHelper}</span>
            </div>

            <h4 className="chord-group-subheading">{t.triadsSubheading}</h4>
            <div className="quality-list">
              {triads.map((quality) => {
                const checked = settings.enabledQualities.includes(quality.id);
                const isLastRemaining = checked && settings.enabledQualities.length === 1;
                const qText = getQualityText(quality.id, lang);
                return (
                  <label
                    key={quality.id}
                    className={`quality-item ${checked ? 'quality-item--checked' : ''} ${
                      isLastRemaining ? 'quality-item--locked' : ''
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={isLastRemaining}
                      onChange={() => handleToggleQuality(quality.id)}
                    />
                    <div className="quality-item-body">
                      <div className="quality-item-title-row">
                        <span className="quality-title">{qText.title}</span>
                        <span className="quality-example-badge">
                          C {qText.name} · <strong>C{quality.symbolSuffix}</strong>
                        </span>
                      </div>
                      <p className="quality-desc">{qText.description}</p>
                    </div>
                  </label>
                );
              })}
            </div>

            <h4 className="chord-group-subheading">{t.seventhsSubheading}</h4>
            <div className="quality-list">
              {sevenths.map((quality) => {
                const checked = settings.enabledQualities.includes(quality.id);
                const isLastRemaining = checked && settings.enabledQualities.length === 1;
                const qText = getQualityText(quality.id, lang);
                return (
                  <label
                    key={quality.id}
                    className={`quality-item ${checked ? 'quality-item--checked' : ''} ${
                      isLastRemaining ? 'quality-item--locked' : ''
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={isLastRemaining}
                      onChange={() => handleToggleQuality(quality.id)}
                    />
                    <div className="quality-item-body">
                      <div className="quality-item-title-row">
                        <span className="quality-title">{qText.title}</span>
                        <span className="quality-example-badge">
                          C {qText.name} · <strong>C{quality.symbolSuffix}</strong>
                        </span>
                      </div>
                      <p className="quality-desc">{qText.description}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </section>

          {/* 3. Root position & Inversions */}
          <section className="settings-section" aria-labelledby="inversions-heading">
            <h3 id="inversions-heading" className="settings-section-title">
              {t.positionsInversionsTitle}
            </h3>
            <p className="settings-explanation">
              {t.inversionsExplanationPrefix} <strong>{t.inversionsExplanationBold}</strong>{' '}
              {t.inversionsExplanationMiddle} <strong>{t.inversionsExplanationEnd}</strong>.
            </p>

            <div className="quality-list">
              {ORDERED_INVERSIONS.map((inv) => {
                const checked = settings.enabledInversions.includes(inv.id);
                const isLastRemaining = checked && settings.enabledInversions.length === 1;
                const needsSeventhWarning = inv.id === 'third' && !hasSeventhSelected;
                const invText = getInversionText(inv.id, lang);

                return (
                  <label
                    key={inv.id}
                    className={`quality-item ${checked ? 'quality-item--checked' : ''} ${
                      isLastRemaining ? 'quality-item--locked' : ''
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={isLastRemaining}
                      onChange={() => handleToggleInversion(inv.id)}
                    />
                    <div className="quality-item-body">
                      <div className="quality-item-title-row">
                        <span className="quality-title">{invText.name}</span>
                        {inv.id === 'root' && (
                          <span className="recommended-pill">{t.recommendedForBeginners}</span>
                        )}
                      </div>
                      <p className="quality-desc">
                        {invText.description}
                        {needsSeventhWarning && (
                          <span className="inversion-note">{t.appliesWhenSeventhEnabled}</span>
                        )}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </section>

          {/* 4. Helpful Aids */}
          <section className="settings-section" aria-labelledby="aids-heading">
            <h3 id="aids-heading" className="settings-section-title">
              {t.practiceAidsTitle}
            </h3>
            <div className="quality-list">
              <label
                className={`quality-item ${
                  settings.showAllKeyLabels ? 'quality-item--checked' : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={settings.showAllKeyLabels}
                  onChange={() =>
                    onUpdateSettings({
                      ...settings,
                      showAllKeyLabels: !settings.showAllKeyLabels,
                    })
                  }
                />
                <div className="quality-item-body">
                  <span className="quality-title">{t.showAllKeyLabelsTitle}</span>
                  <p className="quality-desc">{t.showAllKeyLabelsDesc}</p>
                </div>
              </label>

              <label
                className={`quality-item ${
                  settings.autoPlayAudio ? 'quality-item--checked' : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={settings.autoPlayAudio}
                  onChange={() =>
                    onUpdateSettings({
                      ...settings,
                      autoPlayAudio: !settings.autoPlayAudio,
                    })
                  }
                />
                <div className="quality-item-body">
                  <span className="quality-title">{t.autoPlayAudioTitle}</span>
                  <p className="quality-desc">{t.autoPlayAudioDesc}</p>
                </div>
              </label>
            </div>
          </section>
        </div>

        <div className="modal-footer">
          <button type="button" className="done-settings-btn" onClick={onClose}>
            {t.doneSettingsButton}
          </button>
        </div>
      </div>
    </div>
  );
};
