import { CrosswordGrid } from '../types/game';

export const LEVEL_1_DATA: CrosswordGrid = {
  cells: Array(12).fill(null).map(() => 
    Array(12).fill(null).map(() => ({
      value: '',
      revealed: false,
      isBlocked: true,
      belongsToClues: [],
      hintsUsed: 0
    }))
  ),
  clues: [
    // Across clues - separate rows, no overlaps
    {
      id: 1,
      number: 1,
      text: "American muscle car brand (4 letters)",
      answer: "FORD",
      direction: 'across',
      startRow: 1,
      startCol: 1,
      answered: false,
      hintsUsed: 0,
    },
    {
      id: 2, 
      number: 2,
      text: "German engineering excellence (3 letters)",
      answer: "BMW",
      direction: 'across',
      startRow: 2,
      startCol: 6,
      answered: false,
      hintsUsed: 0,
    },
    {
      id: 3,
      number: 3,
      text: "German luxury brand with four rings (4 letters)",
      answer: "AUDI",
      direction: 'across',
      startRow: 4,
      startCol: 1,
      answered: false,
      hintsUsed: 0,
    },
    {
      id: 4,
      number: 4,
      text: "Japanese performance brand (5 letters)",
      answer: "HONDA",
      direction: 'across',
      startRow: 5,
      startCol: 6,
      answered: false,
      hintsUsed: 0,
    },
    {
      id: 5,
      number: 5,
      text: "Korean car manufacturer (7 letters)",
      answer: "HYUNDAI",
      direction: 'across',
      startRow: 7,
      startCol: 1,
      answered: false,
      hintsUsed: 0,
    },
    // Down clues - separate columns, no overlaps
    {
      id: 6,
      number: 6,
      text: "Italian sports car with prancing horse (7 letters)",
      answer: "FERRARI",
      direction: 'down',
      startRow: 1,
      startCol: 9,
      answered: false,
      hintsUsed: 0,
    },
    {
      id: 7,
      number: 7,
      text: "Swedish safety-focused brand (5 letters)",
      answer: "VOLVO",
      direction: 'down',
      startRow: 2,
      startCol: 2,
      answered: false,
      hintsUsed: 0,
    },
    {
      id: 8,
      number: 8,
      text: "British luxury brand (7 letters)",
      answer: "BENTLEY",
      direction: 'down',
      startRow: 4,
      startCol: 7,
      answered: false,
      hintsUsed: 0,
    },
    {
      id: 9,
      number: 9,
      text: "Japanese luxury brand (6 letters)",
      answer: "TOYOTA",
      direction: 'down',
      startRow: 1,
      startCol: 6,
      answered: false,
      hintsUsed: 0,
    },
    {
      id: 10,
      number: 10,
      text: "German luxury car with star (8 letters)",
      answer: "MERCEDES",
      direction: 'down',
      startRow: 3,
      startCol: 4,
      answered: false,
      hintsUsed: 0,
    }
  ]
};

// Initialize the grid based on clues
function initializeGrid(gridData: CrosswordGrid): CrosswordGrid {
  const newGrid = { ...gridData };
  
  // Set up cells for each clue
  newGrid.clues.forEach(clue => {
    const { startRow, startCol, answer, direction, id } = clue;
    
    for (let i = 0; i < answer.length; i++) {
      const row = direction === 'across' ? startRow : startRow + i;
      const col = direction === 'across' ? startCol + i : startCol;
      
      if (row < newGrid.cells.length && col < newGrid.cells[0].length) {
        newGrid.cells[row][col] = {
          value: '',
          revealed: false,
          isBlocked: false,
          number: i === 0 ? clue.number : undefined,
          belongsToClues: [...(newGrid.cells[row][col]?.belongsToClues || []), id],
          hintsUsed: 0
        };
      }
    }
  });
  
  return newGrid;
}

export const LEVEL_DATA: { [key: number]: CrosswordGrid } = {
  1: initializeGrid(LEVEL_1_DATA),
  2: initializeGrid({
    cells: Array(12).fill(null).map(() => 
      Array(12).fill(null).map(() => ({
        value: '',
        revealed: false,
        isBlocked: true,
        belongsToClues: []
      }))
    ),
    clues: [
      {
        id: 1,
        number: 1,
        text: "Web framework for JavaScript",
        answer: "REACT",
        direction: 'across',
        startRow: 1,
        startCol: 1,
        answered: false,
      },
      {
        id: 2,
        number: 2,
        text: "Database query language",
        answer: "SQL",
        direction: 'across',
        startRow: 3,
        startCol: 2,
        answered: false,
      },
      // Add more clues for level 2...
    ]
  }),
  3: initializeGrid({
    cells: Array(15).fill(null).map(() => 
      Array(15).fill(null).map(() => ({
        value: '',
        revealed: false,
        isBlocked: true,
        belongsToClues: []
      }))
    ),
    clues: [
      {
        id: 1,
        number: 1,
        text: "Machine learning framework",
        answer: "TENSORFLOW",
        direction: 'across',
        startRow: 1,
        startCol: 1,
        answered: false,
      },
      // Add more clues for level 3...
    ]
  }),
  4: initializeGrid({
    cells: Array(20).fill(null).map(() => 
      Array(20).fill(null).map(() => ({
        value: '',
        revealed: false,
        isBlocked: true,
        belongsToClues: []
      }))
    ),
    clues: [
      {
        id: 1,
        number: 1,
        text: "Advanced algorithm concept",
        answer: "RECURSION",
        direction: 'across',
        startRow: 1,
        startCol: 1,
        answered: false,
      },
      // Add more clues for level 4...
    ]
  }),
};
