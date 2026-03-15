import { useState, useEffect } from 'react';
import { bookThemes } from './data/books';
import { ReadingProgress, AppSettings, BookLevel } from './types';
import {
  loadProgress,
  saveProgress,
  loadSettings,
  saveSettings,
  markBookComplete,
  markPageRead,
  resetProgress
} from './utils/progress';
import { StoryLibrary } from './components/StoryLibrary';
import { ReadingScreen } from './components/ReadingScreen';
import { CompletionScreen } from './components/CompletionScreen';
import { Settings } from './components/Settings';

type Screen = 'library' | 'reading' | 'completion' | 'settings';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('library');
  const [progress, setProgress] = useState<ReadingProgress>(loadProgress());
  const [settings, setSettings] = useState<AppSettings>(loadSettings());
  const [selectedBook, setSelectedBook] = useState<BookLevel | null>(null);
  const [selectedThemeId, setSelectedThemeId] = useState<string>('');
  const [levelUnlocked, setLevelUnlocked] = useState(false);
  const [initialPage, setInitialPage] = useState(0);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const handleSelectBook = (themeId: string, level: 1 | 2 | 3) => {
    const theme = bookThemes.find(t => t.id === themeId);
    if (!theme) return;

    const book = theme.levels.find(l => l.level === level);
    if (!book) return;

    setSelectedBook(book);
    setSelectedThemeId(themeId);
    setLevelUnlocked(false);

    const lastPage = progress.lastReadPageByBook[book.id] || 0;
    setInitialPage(lastPage);

    setCurrentScreen('reading');
  };

  const handlePageComplete = (pageNumber: number) => {
    if (!selectedBook) return;

    const newProgress = markPageRead(progress, selectedBook.id, pageNumber);
    setProgress(newProgress);
  };

  const handleBookComplete = () => {
    if (!selectedBook) return;

    const newProgress = markBookComplete(
      progress,
      selectedBook.id,
      selectedThemeId,
      selectedBook.level
    );

    const didUnlockLevel = newProgress.unlockedLevels[selectedThemeId] > progress.unlockedLevels[selectedThemeId];
    setLevelUnlocked(didUnlockLevel);

    setProgress(newProgress);
    setCurrentScreen('completion');
  };

  const handleBackToLibrary = () => {
    setCurrentScreen('library');
    setSelectedBook(null);
    setSelectedThemeId('');
  };

  const handleOpenSettings = () => {
    setCurrentScreen('settings');
  };

  const handleCloseSettings = () => {
    setCurrentScreen('library');
  };

  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
  };

  const handleResetProgress = () => {
    const newProgress = resetProgress();
    setProgress(newProgress);
    setCurrentScreen('library');
  };

  return (
    <>
      {currentScreen === 'library' && (
        <StoryLibrary
          themes={bookThemes}
          progress={progress}
          onSelectBook={handleSelectBook}
          onOpenSettings={handleOpenSettings}
        />
      )}

      {currentScreen === 'reading' && selectedBook && (
        <ReadingScreen
          book={selectedBook}
          initialPage={initialPage}
          settings={settings}
          themeId={selectedThemeId}
          onBack={handleBackToLibrary}
          onPageComplete={handlePageComplete}
          onBookComplete={handleBookComplete}
        />
      )}

      {currentScreen === 'completion' && selectedBook && (
        <CompletionScreen
          book={selectedBook}
          onBackToLibrary={handleBackToLibrary}
          levelUnlocked={levelUnlocked}
        />
      )}

      {currentScreen === 'settings' && (
        <Settings
          settings={settings}
          progress={progress}
          onUpdateSettings={handleUpdateSettings}
          onResetProgress={handleResetProgress}
          onClose={handleCloseSettings}
        />
      )}
    </>
  );
}

export default App;
