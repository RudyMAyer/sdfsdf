export interface CrosswordCell {
  value: string;
  revealed: boolean;
  number?: number;
  isBlocked: boolean;
  belongsToClues: number[];
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
    description: "20 Questions • Easy",
    totalQuestions: 20,
    difficulty: 'easy',
    unlockRequirement: 0,
  },
  {
    level: 2,
    name: "Level 2", 
    description: "25 Questions • Medium",
    totalQuestions: 25,
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
  {
    level: 4,
    name: "Level 4",
    description: "40 Questions • Very Hard",
    totalQuestions: 40,
    difficulty: 'very hard',
    unlockRequirement: 3650,
  },
];
