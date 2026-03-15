import { ReadingProgress, AppSettings } from '../types';

const PROGRESS_KEY = 'readWithMe_progress';
const SETTINGS_KEY = 'readWithMe_settings';

export const getInitialProgress = (): ReadingProgress => ({
  unlockedLevels: {
    'ocean-adventure': 1,
    'animal-city': 1,
    'ice-kingdom': 1,
    'tower-adventure': 1,
    'lantern-quest': 1
  },
  completedBooks: [],
  lastReadPageByBook: {},
  totalPagesRead: 0
});

export const getInitialSettings = (): AppSettings => ({
  soundEnabled: true,
  showTranscript: true
});

export const loadProgress = (): ReadingProgress => {
  try {
    const saved = localStorage.getItem(PROGRESS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error loading progress:', error);
  }
  return getInitialProgress();
};

export const saveProgress = (progress: ReadingProgress): void => {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving progress:', error);
  }
};

export const loadSettings = (): AppSettings => {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }
  return getInitialSettings();
};

export const saveSettings = (settings: AppSettings): void => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};

export const markBookComplete = (progress: ReadingProgress, bookId: string, themeId: string, level: 1 | 2 | 3): ReadingProgress => {
  const newProgress = { ...progress };

  if (!newProgress.completedBooks.includes(bookId)) {
    newProgress.completedBooks.push(bookId);
  }

  if (level < 3 && newProgress.unlockedLevels[themeId] === level) {
    newProgress.unlockedLevels[themeId] = level + 1;
  }

  return newProgress;
};

export const markPageRead = (progress: ReadingProgress, bookId: string, pageNumber: number): ReadingProgress => {
  const newProgress = { ...progress };
  newProgress.lastReadPageByBook[bookId] = pageNumber;
  newProgress.totalPagesRead += 1;
  return newProgress;
};

export const resetProgress = (): ReadingProgress => {
  const initial = getInitialProgress();
  saveProgress(initial);
  return initial;
};
