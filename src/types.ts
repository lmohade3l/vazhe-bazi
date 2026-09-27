export type LetterState = 'correct' | 'present' | 'absent';

export type GameStatus = 'playing' | 'won' | 'lost';

export type DayStatus = 'won' | 'lost' | 'in-progress' | 'not-played';

export type Theme = 'light' | 'dark';

export interface Settings {
  theme: Theme;
  hardMode: boolean;
  colorBlind: boolean;
}


export type SetSetting = <K extends keyof Settings>(name: K, value: Settings[K]) => void;

export interface Stats {
  played: number;
  wins: number;
  streak: number;
  maxStreak: number;
  dist: number[];
}

export interface Puzzle {
  number: number;
  solution: string;
  date: string;
}

export interface GameRecord {
  puzzle: number;
  guesses: string[];
  status: GameStatus;
  updatedAt: string;
}

export interface LegacyStats {
  played: number;
  wins: number;
  streak: number;
  maxStreak: number;
  dist: number[];
  lastPuzzle: number | null;
}

export interface ToastMessage {
  message: string;
  id: number;
}
