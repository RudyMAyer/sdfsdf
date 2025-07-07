import { CrosswordGrid } from '../types/game';

export const LEVEL_1_DATA: CrosswordGrid = {
  cells: Array(50).fill(null).map(() => 
    Array(50).fill(null).map(() => ({
      value: '',
      revealed: false,
      isBlocked: true,
      belongsToClues: [],
      hintsUsed: 0
    }))
  ),
  clues: [
    {
      id: 1,
      number: 1,
      text: "Mobil Jerman terkenal dengan rekayasa teknik (3 huruf)",
      answer: "BMW",
      direction: 'across',
      startRow: 2,
      startCol: 3,
      answered: false,
      hintsUsed: 0,
    },
    {
      id: 2,
      number: 2,
      text: "Merek mobil Jepang (5 huruf)",
      answer: "MAZDA",
      direction: 'down',
      startRow: 2,
      startCol: 4,
      answered: false,
      hintsUsed: 0,
    },
    {
      id: 3,
      number: 3,
      text: "Mobil sport asal Italia (7 huruf)",
      answer: "FERRARI",
      direction: 'across',
      startRow: 10,
      startCol: 12,
      answered: false,
      hintsUsed: 0,
    },
    {
      id: 4,
      number: 4,
      text: "Mobil sport mewah Italia (11 huruf)",
      answer: "LAMBORGHINI",
      direction: 'down',
      startRow: 8,
      startCol: 16,
      answered: false,
      hintsUsed: 0,
    },
    {
      id: 5,
      number: 5,
      text: "Mobil sport asal Italia (6 huruf)",
      answer: "PAGANI",
      direction: 'across',
      startRow: 20,
      startCol: 10,
      answered: false,
      hintsUsed: 0,
    },
    {
      id: 6,
      number: 6,
      text: "Mobil sport asal Swedia (10 huruf)",
      answer: "KOENIGSEGG",
      direction: 'down',
      startRow: 15,
      startCol: 15,
      answered: false,
      hintsUsed: 0,
    },
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
    cells: Array(50).fill(null).map(() => 
      Array(50).fill(null).map(() => ({
        value: '',
        revealed: false,
        isBlocked: true,
        belongsToClues: [],
        hintsUsed: 0
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
        hintsUsed: 0,
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
        hintsUsed: 0,
      },
      // Add more clues for level 2...
    ]
  }),
  3: initializeGrid({
    cells: Array(50).fill(null).map(() => 
      Array(50).fill(null).map(() => ({
        value: '',
        revealed: false,
        isBlocked: true,
        belongsToClues: [],
        hintsUsed: 0
      }))
    ),
    clues: [
      {
        id: 1,
        number: 1,
        text: "Sample clue",
        answer: "SAMPLE",
        direction: 'across',
        startRow: 1,
        startCol: 1,
        answered: false,
        hintsUsed: 0,
      },
      // Add more clues for level 3...
    ]
  }),
  4: initializeGrid({
    cells: Array(50).fill(null).map(() => 
      Array(50).fill(null).map(() => ({
        value: '',
        revealed: false,
        isBlocked: true,
        belongsToClues: [],
        hintsUsed: 0
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
        hintsUsed: 0,
      },
      // Add more clues for level 4...
    ]
  }),
};
