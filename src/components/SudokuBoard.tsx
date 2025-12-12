import { SudokuCell } from './SudokuCell';
import { Board } from '@/lib/sudoku';
import { cn } from '@/lib/utils';

interface SudokuBoardProps {
  board: Board;
  selectedCell: [number, number] | null;
  solvingCell: [number, number] | null;
  onCellClick: (row: number, col: number) => void;
}

export function SudokuBoard({
  board,
  selectedCell,
  solvingCell,
  onCellClick,
}: SudokuBoardProps) {
  return (
    <div 
      className={cn(
        'w-full max-w-md mx-auto p-2 sm:p-3',
        'bg-card rounded-xl shadow-soft-lg',
        'border-2 border-grid-subgrid',
        'animate-scale-in',
      )}
    >
      <div className="grid grid-cols-9">
        {board.map((row, rowIdx) =>
          row.map((cell, colIdx) => {
            const isSelected =
              selectedCell !== null &&
              selectedCell[0] === rowIdx &&
              selectedCell[1] === colIdx;

            const isHighlighted =
              selectedCell !== null &&
              (selectedCell[0] === rowIdx || selectedCell[1] === colIdx);

            const isSolving =
              solvingCell !== null &&
              solvingCell[0] === rowIdx &&
              solvingCell[1] === colIdx;

            return (
              <SudokuCell
                key={`${rowIdx}-${colIdx}`}
                cell={cell}
                row={rowIdx}
                col={colIdx}
                isSelected={isSelected}
                isHighlighted={isHighlighted}
                isSolving={isSolving}
                onClick={() => onCellClick(rowIdx, colIdx)}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
