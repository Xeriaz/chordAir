import React, { useCallback, useEffect, useState } from 'react';
import { AnswerGrid } from './components/AnswerGrid';
import { FeedbackPanel } from './components/FeedbackPanel';
import { Header } from './components/Header';
import { PianoKeyboard } from './components/PianoKeyboard';
import { SettingsModal } from './components/SettingsModal';
import { playChord } from './domain/audio';
import { DEFAULT_SETTINGS } from './domain/chords';
import { generatePracticeCard } from './domain/generator';
import { PracticeCard, PracticeSettings, SessionStats } from './domain/types';

const SETTINGS_STORAGE_KEY = 'chordair_settings_v1';
const STATS_STORAGE_KEY = 'chordair_stats_v1';

const INITIAL_STATS: SessionStats = {
  completed: 0,
  correct: 0,
  streak: 0,
  bestStreak: 0,
};

function loadSavedSettings(): PracticeSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<PracticeSettings>;
    if (
      Array.isArray(parsed.enabledQualities) &&
      parsed.enabledQualities.length > 0 &&
      Array.isArray(parsed.enabledInversions) &&
      parsed.enabledInversions.length > 0
    ) {
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
      };
    }
  } catch {
    // Ignore storage read issues
  }
  return DEFAULT_SETTINGS;
}

function loadSavedStats(): SessionStats {
  try {
    const raw = localStorage.getItem(STATS_STORAGE_KEY);
    if (!raw) return INITIAL_STATS;
    const parsed = JSON.parse(raw) as Partial<SessionStats>;
    if (typeof parsed.completed === 'number' && typeof parsed.correct === 'number') {
      return {
        completed: parsed.completed,
        correct: parsed.correct,
        streak: parsed.streak ?? 0,
        bestStreak: parsed.bestStreak ?? 0,
      };
    }
  } catch {
    // Ignore storage read issues
  }
  return INITIAL_STATS;
}

export const App: React.FC = () => {
  const [settings, setSettings] = useState<PracticeSettings>(() => loadSavedSettings());
  const [stats, setStats] = useState<SessionStats>(() => loadSavedStats());
  const [card, setCard] = useState<PracticeCard>(() => generatePracticeCard(loadSavedSettings()));
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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
      // If the learner hasn't answered the current card yet and the current card's chord type or
      // inversion is no longer enabled, refresh the current card seamlessly while preserving stats.
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

  // Global keyboard shortcuts (1-4 to pick option, Enter/ArrowRight for next card, Space to hear chord)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isSettingsOpen) return;
      // Ignore if typing inside an input
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
        // Avoid double-triggering if the Next Card button itself is already focused and Enter is pressed
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
  }, [isSettingsOpen, selectedOptionId, card, handleSelectOption, handleNextCard]);

  return (
    <div className="app-shell">
      <a href="#main-practice" className="skip-link">
        Skip to chord practice
      </a>

      <Header
        settings={settings}
        stats={stats}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onResetStats={handleResetStats}
        onToggleLabels={handleToggleLabels}
      />

      <main id="main-practice" className="practice-main">
        {settings.enabledInversions.length > 1 && (
          <div className="voicing-notice-bar" role="note">
            <span>
              Inversions active: chords may have their notes rearranged (root, 1st, or 2nd
              inversion).
            </span>
          </div>
        )}

        <PianoKeyboard
          voicedNotes={card.voicedNotes}
          showAllKeyLabels={settings.showAllKeyLabels}
          isRevealed={selectedOptionId !== null}
        />

        <AnswerGrid
          options={card.options}
          selectedOptionId={selectedOptionId}
          correctOptionId={card.correctOptionId}
          onSelectOption={handleSelectOption}
        />

        {selectedOptionId !== null && (
          <FeedbackPanel
            card={card}
            selectedOptionId={selectedOptionId}
            onNextCard={handleNextCard}
          />
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
