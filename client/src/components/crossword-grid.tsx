import { cn } from "@/lib/utils";
import { CrosswordGrid, CrosswordCell } from "../types/game";

interface CrosswordGridProps {
  gridState: CrosswordGrid;
  selectedCell: { row: number; col: number } | null;
  onCellClick: (row: number, col: number) => void;
}

export function CrosswordGridComponent({ gridState, selectedCell, onCellClick }: CrosswordGridProps) {
  const gridSize = gridState.cells.length;
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">Crossword Puzzle</h4>
      
      <div 
        className="crossword-grid inline-grid bg-gray-100 p-4 rounded-lg"
        style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
      >
        {gridState.cells.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <CrosswordCellComponent
              key={`${rowIndex}-${colIndex}`}
              cell={cell}
              row={rowIndex}
              col={colIndex}
              isSelected={selectedCell?.row === rowIndex && selectedCell?.col === colIndex}
              onClick={() => !cell.isBlocked && onCellClick(rowIndex, colIndex)}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface CrosswordCellComponentProps {
  cell: CrosswordCell;
  row: number;
  col: number;
  isSelected: boolean;
  onClick: () => void;
}

function CrosswordCellComponent({ cell, isSelected, onClick }: CrosswordCellComponentProps) {
  if (cell.isBlocked) {
    return <div className="crossword-cell bg-gray-300 rounded" />;
  }

  return (
    <div
      className={cn(
        "crossword-cell bg-white border border-gray-300 rounded flex items-center justify-center relative cursor-pointer hover:bg-blue-50 transition-colors",
        isSelected && "bg-blue-200 border-blue-400"
      )}
      onClick={onClick}
    >
      {cell.number && (
        <span className="absolute top-0 left-0 text-xs font-bold text-gray-600 pl-1">
          {cell.number}
        </span>
      )}
      <span className={cn(
        "text-lg font-bold",
        cell.revealed ? "text-gray-800" : "text-gray-400"
      )}>
        {cell.value}
      </span>
    </div>
  );
}
