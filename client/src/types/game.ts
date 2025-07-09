export interface CrosswordCell {
  value: string;
  revealed: boolean;
  number?: number | string;
  isBlocked: boolean;
  belongsToClues: number[];
  hintsUsed?: number; // Track how many hints used for this cell
}

export interface CrosswordClue {
  id: number;
  number: number;
  text: string;
  answer: string;
  direction: 'across' | 'down';
  startRow: number;
  startCol: number;
  answered: boolean;
  hintsUsed: number; // Track hints used for this clue (max 2)
  hidden?: boolean; // Jika true, clue disembunyikan
}

export interface CrosswordGrid {
  cells: CrosswordCell[][];
  clues: CrosswordClue[];
}

export interface LevelConfig {
  level: number;
  name: string;
  description: string;
  totalQuestions: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'very hard';
  unlockRequirement: number;
}

export interface GameState {
  currentLevel: number;
  score: number;
  hintsUsed: number;
  hintsRemaining: number;
  completedQuestions: number;
  selectedCell: { row: number; col: number } | null;
  selectedClue: number | null;
  currentInput: string;
  gridState: CrosswordGrid;
}

export const LEVEL_CONFIGS: LevelConfig[] = [
  {
    level: 1,
    name: "Level 1",
    description: "16 Questions • Easy",
    totalQuestions: 16,
    difficulty: 'easy',
    unlockRequirement: 0,
  },
  {
    level: 2,
    name: "Level 2", 
    description: "23 Questions • Medium",
    totalQuestions: 23,
    difficulty: 'medium',
    unlockRequirement: 1800,
  },
  {
    level: 3,
    name: "Level 3",
    description: "30 Questions • Hard", 
    totalQuestions: 30,
    difficulty: 'hard',
    unlockRequirement: 2250,
  },
];
