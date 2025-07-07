import { CrosswordGrid } from '../types/game';

export const LEVEL_1_DATA: CrosswordGrid = {
  cells: Array(10).fill(null).map(() => 
    Array(10).fill(null).map(() => ({
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
      text: "Computer software application",
      answer: "PROGRAM",
      direction: 'across',
      startRow: 1,
      startCol: 1,
      answered: false,
    },
    {
      id: 2, 
      number: 2,
      text: "Programming language for web development",
      answer: "JAVA",
      direction: 'across',
      startRow: 3,
      startCol: 3,
      answered: false,
    },
    {
      id: 3,
      number: 3,
      text: "Computer programming concept",
      answer: "OBJECT",
      direction: 'across',
      startRow: 5,
      startCol: 0,
      answered: false,
    },
    {
      id: 4,
      number: 1,
      text: "Coding language",
      answer: "PYTHON",
      direction: 'down',
      startRow: 1,
      startCol: 1,
      answered: false,
    },
    {
      id: 5,
      number: 4,
      text: "Data structure",
      answer: "ARRAY",
      direction: 'down',
      startRow: 1,
      startCol: 5,
      answered: false,
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
      
      if (row < 10 && col < 10) {
        newGrid.cells[row][col] = {
          value: '',
          revealed: false,
          isBlocked: false,
          number: i === 0 ? clue.number : undefined,
          belongsToClues: [...(newGrid.cells[row][col]?.belongsToClues || []), id]
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
