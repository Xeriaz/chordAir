import React, { useCallback, useEffect, useState } from 'react';
import { AnswerGrid } from './components/AnswerGrid';
import { BookPageViewer } from './components/BookPageViewer';
import { BookTheoryGuide } from './components/BookTheoryGuide';
import { FeedbackPanel } from './components/FeedbackPanel';
import { AppView, Header } from './components/Header';
import { PianoKeyboard } from './components/PianoKeyboard';
import { SettingsModal } from './components/SettingsModal';
import { SubdivisionGuide } from './components/SubdivisionGuide';
import { TheoryGuide } from './components/TheoryGuide';
import { playChord } from './domain/audio';
import {
  CHORD_QUALITIES,
  DEFAULT_SETTINGS,
  INVERSIONS,
  detectPresetForQualities,
} from './domain/chords';
import { generatePracticeCard } from './domain/generator';
import { UI_STRINGS } from './domain/i18n';
import {
  ChordQualityId,
  InversionId,
  PracticeCard,
  PracticeSettings,
  SessionStats,
} from './domain/types';

const SETTINGS_STORAGE_KEY = 'chordair_settings_v1';
const STATS_STORAGE_KEY = 'chordair_stats_v1';

export const INITIAL_STATS: SessionStats = {
  completed: 0,
  correct: 0,
  streak: 0,
  bestStreak: 0,
};

export function sanitizeSettings(rawInput: unknown): PracticeSettings {
  if (!rawInput || typeof rawInput !== 'object') return DEFAULT_SETTINGS;
  const parsed = rawInput as Partial<PracticeSettings>;

  const validQualities = Array.isArray(parsed.enabledQualities)
    ? parsed.enabledQualities.filter(
        (q): q is ChordQualityId => typeof q === 'string' && q in CHORD_QUALITIES
      )
    : [];

  const validInversions = Array.isArray(parsed.enabledInversions)
    ? parsed.enabledInversions.filter(
        (inv): inv is InversionId => typeof inv === 'string' && inv in INVERSIONS
      )
    : [];

  if (validQualities.length === 0 || validInversions.length === 0) {
    return DEFAULT_SETTINGS;
  }

  return {
    language: parsed.language === 'en' ? 'en' : 'lt',
    preset: detectPresetForQualities(validQualities),
    enabledQualities: validQualities,
    enabledInversions: validInversions,
    showAllKeyLabels: parsed.showAllKeyLabels !== undefined ? Boolean(parsed.showAllKeyLabels) : true,
    autoPlayAudio: Boolean(parsed.autoPlayAudio),
  };
}

export function sanitizeStats(rawInput: unknown): SessionStats {
  if (!rawInput || typeof rawInput !== 'object') return INITIAL_STATS;
  const parsed = rawInput as Partial<SessionStats>;

  const completed =
    typeof parsed.completed === 'number' && Number.isFinite(parsed.completed) && parsed.completed >= 0
      ? Math.floor(parsed.completed)
      : 0;
  const correct =
    typeof parsed.correct === 'number' && Number.isFinite(parsed.correct) && parsed.correct >= 0
      ? Math.min(completed, Math.floor(parsed.correct))
      : 0;
  const streak =
    typeof parsed.streak === 'number' && Number.isFinite(parsed.streak) && parsed.streak >= 0
      ? Math.floor(parsed.streak)
      : 0;
  const bestStreak =
    typeof parsed.bestStreak === 'number' &&
    Number.isFinite(parsed.bestStreak) &&
    parsed.bestStreak >= 0
      ? Math.max(streak, Math.floor(parsed.bestStreak))
      : streak;

  return { completed, correct, streak, bestStreak };
}

function loadSavedSettings(): PracticeSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return sanitizeSettings(JSON.parse(raw));
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function loadSavedStats(): SessionStats {
  try {
    const raw = localStorage.getItem(STATS_STORAGE_KEY);
    if (!raw) return INITIAL_STATS;
    return sanitizeStats(JSON.parse(raw));
  } catch {
    return INITIAL_STATS;
  }
}

export const App: React.FC = () => {
  const [settings, setSettings] = useState<PracticeSettings>(() => loadSavedSettings());
  const [stats, setStats] = useState<SessionStats>(() => loadSavedStats());
  const [card, setCard] = useState<PracticeCard>(() => generatePracticeCard(loadSavedSettings()));
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeView, setActiveView] = useState<AppView>('practice');
  const [sheetMusicPage, setSheetMusicPage] = useState<number>(1);

  const language = settings.language ?? 'lt';
  const t = UI_STRINGS[language];

  // Sync <html lang="..."> attribute for screen readers and browser tools
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // Persist settings and stats
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Ignore quota errors
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
    } catch {
      // Ignore quota errors
    }
  }, [stats]);

  const handleSelectOption = useCallback(
    (optionId: string) => {
      if (selectedOptionId !== null) return;
      setSelectedOptionId(optionId);

      const isCorrect = optionId === card.correctOptionId;
      setStats((prev) => {
        const nextStreak = isCorrect ? prev.streak + 1 : 0;
        return {
          completed: prev.completed + 1,
          correct: prev.correct + (isCorrect ? 1 : 0),
          streak: nextStreak,
          bestStreak: Math.max(prev.bestStreak, nextStreak),
        };
      });

      if (settings.autoPlayAudio) {
        playChord(card.highlightedMidis);
      }
    },
    [selectedOptionId, card, settings.autoPlayAudio]
  );

  const handleNextCard = useCallback(() => {
    const next = generatePracticeCard(settings, card.id);
    setCard(next);
    setSelectedOptionId(null);
    if (settings.autoPlayAudio) {
      playChord(next.highlightedMidis);
    }
  }, [settings, card.id]);

  const handleUpdateSettings = useCallback(
    (nextSettings: PracticeSettings) => {
      setSettings(nextSettings);
      const currentStillValid =
        nextSettings.enabledQualities.includes(card.quality.id) &&
        nextSettings.enabledInversions.includes(card.inversion.id);

      if (selectedOptionId === null && !currentStillValid) {
        setCard(generatePracticeCard(nextSettings, card.id));
      }
    },
    [card.id, card.quality.id, card.inversion.id, selectedOptionId]
  );

  const handleResetStats = useCallback(() => {
    setStats(INITIAL_STATS);
  }, []);

  const handleToggleLabels = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      showAllKeyLabels: !prev.showAllKeyLabels,
    }));
  }, []);

  const handleOpenSheetMusic = useCallback((page: number = 1) => {
    setSheetMusicPage(page);
    setActiveView('sheet-music');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleToggleLanguage = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      language: prev.language === 'lt' ? 'en' : 'lt',
    }));
  }, []);

  // Global keyboard shortcuts (1-4 to pick option, Enter/ArrowRight for next card, Space to hear chord)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isSettingsOpen || activeView !== 'practice') return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (selectedOptionId === null) {
        const num = Number.parseInt(e.key, 10);
        if (num >= 1 && num <= card.options.length) {
          e.preventDefault();
          handleSelectOption(card.options[num - 1].id);
          return;
        }
      } else if (e.key === 'Enter' || e.key === 'ArrowRight') {
        if (
          e.key === 'Enter' &&
          (e.target as HTMLElement | null)?.classList.contains('next-card-btn')
        ) {
          return;
        }
        e.preventDefault();
        handleNextCard();
        return;
      }

      if (e.key === ' ' && tag !== 'BUTTON') {
        e.preventDefault();
        playChord(card.highlightedMidis);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isSettingsOpen, activeView, selectedOptionId, card, handleSelectOption, handleNextCard]);

  return (
    <div className="app-shell">
      <a href="#main-practice" className="skip-link">
        {t.skipToPractice}
      </a>

      <Header
        settings={settings}
        stats={stats}
        activeView={activeView}
        onSelectView={setActiveView}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onResetStats={handleResetStats}
        onToggleLabels={handleToggleLabels}
        onToggleLanguage={handleToggleLanguage}
      />

      <main id="main-practice" className="practice-main">
        {activeView === 'sheet-music' ? (
          <BookPageViewer
            initialPage={sheetMusicPage}
            language={language}
            onToggleLanguage={handleToggleLanguage}
            onBackToPractice={() => {
              setActiveView('practice');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenBookGuide={() => {
              setActiveView('book-theory');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : activeView === 'book-theory' ? (
          <BookTheoryGuide
            language={language}
            onToggleLanguage={handleToggleLanguage}
            onOpenSheetMusic={handleOpenSheetMusic}
            onBackToPractice={() => {
              setActiveView('practice');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenChordsGuide={() => {
              setActiveView('guide');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenRhythmGuide={() => {
              setActiveView('rhythm');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : activeView === 'rhythm' ? (
          <SubdivisionGuide
            language={language}
            onToggleLanguage={handleToggleLanguage}
            onBackToPractice={() => {
              setActiveView('practice');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenChordsGuide={() => {
              setActiveView('guide');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenBookGuide={() => {
              setActiveView('book-theory');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : activeView === 'guide' ? (
          <TheoryGuide
            language={language}
            onStartPractice={() => {
              setActiveView('practice');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenRhythm={() => {
              setActiveView('rhythm');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenBookGuide={() => {
              setActiveView('book-theory');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : (
          <>
            {settings.enabledInversions.length > 1 && (
              <div className="voicing-notice-bar" role="note">
                <span>{t.inversionsActiveNotice}</span>
              </div>
            )}

            <PianoKeyboard
              voicedNotes={card.voicedNotes}
              qualityId={card.quality.id}
              showAllKeyLabels={settings.showAllKeyLabels}
              isRevealed={selectedOptionId !== null}
              language={language}
            />

            <AnswerGrid
              options={card.options}
              selectedOptionId={selectedOptionId}
              correctOptionId={card.correctOptionId}
              language={language}
              preset={settings.preset}
              onSelectOption={handleSelectOption}
            />

            {selectedOptionId !== null && (
              <FeedbackPanel
                card={card}
                selectedOptionId={selectedOptionId}
                language={language}
                onNextCard={handleNextCard}
              />
            )}

            {/* Quick links to Chord Theory & Rhythm Drills */}
            <nav className="practice-quick-links" aria-label={language === 'lt' ? 'Papildomi gidai' : 'Extra guides'}>
              <button
                type="button"
                className="quick-link-btn"
                onClick={() => {
                  setActiveView('guide');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <span className="quick-link-icon" aria-hidden="true">📖</span>
                <span className="quick-link-text">
                  <span className="quick-link-title">
                    {language === 'lt' ? 'Akordų teorija' : 'Chord Theory'}
                  </span>
                  <span className="quick-link-sub">
                    {language === 'lt' ? 'Mažorų ir minorų sandara' : 'Triad construction rules'}
                  </span>
                </span>
              </button>

              <button
                type="button"
                className="quick-link-btn"
                onClick={() => {
                  setActiveView('rhythm');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <span className="quick-link-icon" aria-hidden="true">⏱️</span>
                <span className="quick-link-text">
                  <span className="quick-link-title">
                    {language === 'lt' ? 'Ritmo pratimai' : 'Rhythm Drills'}
                  </span>
                  <span className="quick-link-sub">
                    {language === 'lt' ? 'Pulso smulkinimas ir metronomas' : 'Pulse & subdivisions'}
                  </span>
                </span>
              </button>
            </nav>
          </>
        )}
      </main>

      <SettingsModal
        isOpen={isSettingsOpen}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};
export default App;
