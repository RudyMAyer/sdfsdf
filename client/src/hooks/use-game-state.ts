import { useState, useCallback } from 'react';
import { GameState, CrosswordGrid, CrosswordClue } from '../types/game';
import { LEVEL_DATA } from '../data/crossword-data';

export function useGameState(initialLevel: number = 1) {
  const [gameState, setGameState] = useState<GameState>(() => ({
    currentLevel: initialLevel,
    score: 0,
    hintsUsed: 0,
    hintsRemaining: 3,
    completedQuestions: 0,
    selectedCell: null,
    selectedClue: null,
    currentInput: '',
    gridState: LEVEL_DATA[initialLevel],
  }));

  const selectCell = useCallback((row: number, col: number) => {
    setGameState(prev => ({
      ...prev,
      selectedCell: { row, col },
      currentInput: prev.gridState.cells[row][col]?.value || ''
    }));
  }, []);

  const selectClue = useCallback((clueId: number) => {
    setGameState(prev => {
      const clue = prev.gridState.clues.find(c => c.id === clueId);
      if (!clue) return prev;

      return {
        ...prev,
        selectedClue: clueId,
        selectedCell: { row: clue.startRow, col: clue.startCol },
        currentInput: ''
      };
    });
  }, []);

  const updateInput = useCallback((value: string) => {
    setGameState(prev => ({ ...prev, currentInput: value }));
  }, []);

  const submitAnswer = useCallback((answer: string): boolean => {
    if (!gameState.selectedClue) return false;

    const clue = gameState.gridState.clues.find(c => c.id === gameState.selectedClue);
    if (!clue) return false;

    const isCorrect = answer.toUpperCase() === clue.answer.toUpperCase();
    
    setGameState(prev => {
      const newGridState = { ...prev.gridState };
      const updatedClue = { ...clue, answered: isCorrect };
      newGridState.clues = newGridState.clues.map(c => 
        c.id === clue.id ? updatedClue : c
      );

      if (isCorrect) {
        // Fill in the correct answer in the grid
        for (let i = 0; i < clue.answer.length; i++) {
          const row = clue.direction === 'across' ? clue.startRow : clue.startRow + i;
          const col = clue.direction === 'across' ? clue.startCol + i : clue.startCol;
          
          if (row < newGridState.cells.length && col < newGridState.cells[0].length) {
            newGridState.cells[row][col] = {
              ...newGridState.cells[row][col],
              value: clue.answer[i],
              revealed: true
            };
          }
        }
        
        return {
          ...prev,
          gridState: newGridState,
          score: prev.score + 100,
          completedQuestions: prev.completedQuestions + 1,
          currentInput: '',
          selectedClue: null
        };
      } else {
        // Wrong answer - reveal a random letter and deduct points
        return useHint(prev, clue);
      }
    });

    return isCorrect;
  }, [gameState.selectedClue, gameState.gridState]);

  const useHint = useCallback((state: GameState = gameState, targetClue?: CrosswordClue): GameState => {
    if (state.hintsRemaining <= 0) return state;

    const clue = targetClue || state.gridState.clues.find(c => c.id === state.selectedClue);
    if (!clue || clue.answered) return state;

    // Find unrevealed positions in the answer
    const unrevealedPositions: number[] = [];
    for (let i = 0; i < clue.answer.length; i++) {
      const row = clue.direction === 'across' ? clue.startRow : clue.startRow + i;
      const col = clue.direction === 'across' ? clue.startCol + i : clue.startCol;
      
      if (row < state.gridState.cells.length && col < state.gridState.cells[0].length) {
        if (!state.gridState.cells[row][col].revealed) {
          unrevealedPositions.push(i);
        }
      }
    }

    if (unrevealedPositions.length === 0) return state;

    // Reveal a random letter
    const randomIndex = Math.floor(Math.random() * unrevealedPositions.length);
    const positionToReveal = unrevealedPositions[randomIndex];
    
    const row = clue.direction === 'across' ? clue.startRow : clue.startRow + positionToReveal;
    const col = clue.direction === 'across' ? clue.startCol + positionToReveal : clue.startCol;

    const newGridState = { ...state.gridState };
    newGridState.cells[row][col] = {
      ...newGridState.cells[row][col],
      value: clue.answer[positionToReveal],
      revealed: true
    };

    return {
      ...state,
      gridState: newGridState,
      score: Math.max(0, state.score - 5),
      hintsUsed: state.hintsUsed + 1,
      hintsRemaining: state.hintsRemaining - 1
    };
  }, [gameState]);

  const manualHint = useCallback(() => {
    setGameState(prev => useHint(prev));
  }, [useHint]);

  const resetLevel = useCallback((level: number) => {
    setGameState({
      currentLevel: level,
      score: 0,
      hintsUsed: 0,
      hintsRemaining: 3,
      completedQuestions: 0,
      selectedCell: null,
      selectedClue: null,
      currentInput: '',
      gridState: LEVEL_DATA[level],
    });
  }, []);

  return {
    gameState,
    selectCell,
    selectClue,
    updateInput,
    submitAnswer,
    manualHint,
    resetLevel,
  };
}
