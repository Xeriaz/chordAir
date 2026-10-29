import React, { useEffect, useRef } from 'react';
import {
  LEVEL_PRESETS,
  ORDERED_CHORD_QUALITIES,
  ORDERED_INVERSIONS,
  detectPresetForQualities,
} from '../domain/chords';
import {
  ChordQualityId,
  InversionId,
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
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    closeBtnRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const hasSeventhSelected = settings.enabledQualities.some(
    (q) => ORDERED_CHORD_QUALITIES.find((def) => def.id === q)?.category === 'seventh'
  );

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
    // Prevent unchecking the very last enabled chord type
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
        className="settings-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-modal-title"
      >
        <div className="modal-header">
          <div>
            <h2 id="settings-modal-title" className="modal-title">
              Practice Settings
            </h2>
            <p className="modal-subtitle">
              Choose which chord shapes and voicings appear. Changes apply immediately while
              keeping your session score.
            </p>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close settings"
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          {/* 1. Level Presets */}
          <section className="settings-section" aria-labelledby="preset-heading">
            <h3 id="preset-heading" className="settings-section-title">
              1. Practice Level
            </h3>
            <div className="preset-grid" role="radiogroup" aria-labelledby="preset-heading">
              {LEVEL_PRESETS.map((preset) => {
                const isActive = settings.preset === preset.id;
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
                      <span className="preset-name">{preset.name}</span>
                      <span className="preset-badge">{preset.badge}</span>
                    </div>
                    <p className="preset-desc">{preset.description}</p>
                  </button>
                );
              })}

              <div
                role="radio"
                aria-checked={settings.preset === 'custom'}
                tabIndex={0}
                onClick={() =>
                  onUpdateSettings({
                    ...settings,
                    preset: 'custom',
                  })
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onUpdateSettings({ ...settings, preset: 'custom' });
                  }
                }}
                className={`preset-card ${
                  settings.preset === 'custom' ? 'preset-card--active' : ''
                }`}
              >
                <div className="preset-card-top">
                  <span className="preset-name">Custom</span>
                  <span className="preset-badge">
                    {settings.enabledQualities.length} selected
                  </span>
                </div>
                <p className="preset-desc">
                  Pick any combination of individual chord types below.
                </p>
              </div>
            </div>
          </section>

          {/* 2. Individual Chord Types */}
          <section className="settings-section" aria-labelledby="chord-types-heading">
            <div className="section-header-inline">
              <h3 id="chord-types-heading" className="settings-section-title">
                2. Included Chord Types
              </h3>
              <span className="section-helper">
                 Plain names &amp; symbols (example on C)
              </span>
            </div>

            <h4 className="chord-group-subheading">3-Note Triads</h4>
            <div className="quality-list">
              {triads.map((quality) => {
                const checked = settings.enabledQualities.includes(quality.id);
                const isLastRemaining = checked && settings.enabledQualities.length === 1;
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
                        <span className="quality-title">{quality.title}</span>
                        <span className="quality-example-badge">
                          C {quality.name} · <strong>C{quality.symbolSuffix}</strong>
                        </span>
                      </div>
                      <p className="quality-desc">{quality.description}</p>
                    </div>
                  </label>
                );
              })}
            </div>

            <h4 className="chord-group-subheading">4-Note Seventh Chords</h4>
            <div className="quality-list">
              {sevenths.map((quality) => {
                const checked = settings.enabledQualities.includes(quality.id);
                const isLastRemaining = checked && settings.enabledQualities.length === 1;
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
                        <span className="quality-title">{quality.title}</span>
                        <span className="quality-example-badge">
                          C {quality.name} · <strong>C{quality.symbolSuffix}</strong>
                        </span>
                      </div>
                      <p className="quality-desc">{quality.description}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </section>

          {/* 3. Root position & Inversions */}
          <section className="settings-section" aria-labelledby="inversions-heading">
            <h3 id="inversions-heading" className="settings-section-title">
              3. Chord Positions &amp; Inversions
            </h3>
            <p className="settings-explanation">
              An <strong>inversion</strong> is the exact same chord with its notes rearranged so a
              different note is on the bottom. Beginners should start with{' '}
              <strong>Root position</strong>.
            </p>

            <div className="quality-list">
              {ORDERED_INVERSIONS.map((inv) => {
                const checked = settings.enabledInversions.includes(inv.id);
                const isLastRemaining = checked && settings.enabledInversions.length === 1;
                const needsSeventhWarning = inv.id === 'third' && !hasSeventhSelected;

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
                        <span className="quality-title">{inv.name}</span>
                        {inv.id === 'root' && (
                          <span className="recommended-pill">Recommended for beginners</span>
                        )}
                      </div>
                      <p className="quality-desc">
                        {inv.description}
                        {needsSeventhWarning && (
                          <span className="inversion-note">
                            {' '}
                            (Applies when a 4-note seventh chord is enabled.)
                          </span>
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
              4. Practice Aids
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
                  <span className="quality-title">Show note names on every piano key</span>
                  <p className="quality-desc">
                    When off, note names appear only on the highlighted chord keys and C4/C5
                    landmarks.
                  </p>
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
                  <span className="quality-title">Auto-play chord sound on each card</span>
                  <p className="quality-desc">
                    Automatically play the chord tones using the built-in piano synthesizer.
                  </p>
                </div>
              </label>
            </div>
          </section>
        </div>

        <div className="modal-footer">
          <button type="button" className="done-settings-btn" onClick={onClose}>
            Done &amp; Continue Practice
          </button>
        </div>
      </div>
    </div>
  );
};
