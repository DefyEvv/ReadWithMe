export type BookPage = {
  pageNumber: number;
  text: string;
  imagePrompt: string;
  altText: string;
};

export type BookLevel = {
  id: string;
  level: 1 | 2 | 3;
  title: string;
  pages: BookPage[];
};

export type BookTheme = {
  id: string;
  title: string;
  description: string;
  coverPrompt: string;
  levels: BookLevel[];
};

export type ReadingProgress = {
  unlockedLevels: Record<string, number>;
  completedBooks: string[];
  lastReadPageByBook: Record<string, number>;
  totalPagesRead: number;
};

export type AppSettings = {
  soundEnabled: boolean;
  showTranscript: boolean;
};
